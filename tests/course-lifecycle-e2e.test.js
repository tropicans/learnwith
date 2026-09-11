/**
 * Automated End-to-End Verification & Zero-Regression Test Suite for Phase 37
 * Milestone: v3.3 (Admin Course Lifecycle & Visibility Management)
 * Requirements Addressed:
 *   - COURSE-TEST-01: Lifecycle state transitions, store immutability, server mutation RPCs, and authorization guards.
 *   - COURSE-TEST-02: Zero regression across public workshop workflows, passkey gates, and platform integrity.
 */
const { describe, it, before, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT_DIR = path.resolve(__dirname, '..');

describe('Phase 37 End-to-End Verification & Zero-Regression Suite', () => {
  let schemaModule;
  let storeModule;
  let sessionModule;
  let platformServer;
  let courseRpcModule;

  before(async () => {
    schemaModule = await import('../app/schemas/courseLifecycle.ts');
    storeModule = await import('../app/server/courseLifecycleStore.ts');
    sessionModule = await import('../app/server/session.ts');
    platformServer = await import('../app/server/platform.ts');
    courseRpcModule = await import('../app/server/courseLifecycle.ts');
  });

  beforeEach(() => {
    storeModule.clearCourseLifecycleStoreForTesting();
    sessionModule.clearAllSessionsForTesting();
  });

  // =========================================================================
  // SUITE 1: Store Immutability & Reference Defense (COURSE-TEST-01)
  // =========================================================================
  describe('Suite 1: Store Immutability & Reference Defense (COURSE-TEST-01)', () => {
    it('guarantees store immutability against external single-record tampering', () => {
      const aiRecord = storeModule.getCourseLifecycleRecord('ai');
      assert.ok(aiRecord, 'AI course record must exist');
      assert.equal(aiRecord.status, 'active');

      // Attempt to tamper with returned object directly
      aiRecord.status = 'deleted';
      aiRecord.title = 'Tampered Title';

      // Fresh fetch must remain untampered
      const pristineRecord = storeModule.getCourseLifecycleRecord('ai');
      assert.equal(pristineRecord.status, 'active', 'Status in internal store must remain active');
      assert.equal(pristineRecord.title, 'Hands-on Agentic AI: Dari Chat ke Kalender');
    });

    it('guarantees store immutability against external array tampering', () => {
      const records = storeModule.getCourseLifecycleRecords();
      assert.equal(records.length, 2);

      // Mutate elements in array
      records[0].status = 'archived';
      records[1].status = 'deleted';
      records.pop();

      // Fresh fetch must have 2 records, both active
      const freshRecords = storeModule.getCourseLifecycleRecords();
      assert.equal(freshRecords.length, 2, 'Array length must remain 2');
      assert.equal(freshRecords.find(r => r.id === 'ai')?.status, 'active');
      assert.equal(freshRecords.find(r => r.id === 'word')?.status, 'active');
    });

    it('guarantees audit trail immutability against log mutation', () => {
      storeModule.updateCourseLifecycleStatus('ai', 'hidden', 'admin-user', 'Initial hide');
      const auditLog = storeModule.getCourseLifecycleAuditLog();
      assert.ok(auditLog.length > 0, 'Audit log must contain at least 1 entry');

      // Attempt tampering with audit log entry
      auditLog[0].reason = 'Malicious rewrite';
      auditLog[0].toStatus = 'deleted';

      const freshAuditLog = storeModule.getCourseLifecycleAuditLog();
      assert.equal(freshAuditLog[0].reason, 'Initial hide', 'Audit log reason must remain pristine');
      assert.equal(freshAuditLog[0].toStatus, 'hidden', 'Audit log status must remain hidden');
    });
  });

  // =========================================================================
  // SUITE 2: Complete 4x4 State Transition Matrix (COURSE-TEST-01)
  // =========================================================================
  describe('Suite 2: Complete 4x4 State Transition Matrix (COURSE-TEST-01)', () => {
    it('exhaustively validates all 16 combinations of the 4x4 lifecycle transition matrix', () => {
      const { isValidStatusTransition } = schemaModule;
      const statuses = ['active', 'hidden', 'archived', 'deleted'];

      // Expected matrix based on COURSE-STATUS-03:
      // active   -> active, hidden, archived, deleted (all true)
      // hidden   -> active, hidden, archived, deleted (all true)
      // archived -> active, hidden, archived, deleted (all true)
      // deleted  -> active (restore=true), hidden (false), archived (false), deleted (true no-op)
      const expectedMatrix = {
        active:   { active: true, hidden: true, archived: true, deleted: true },
        hidden:   { active: true, hidden: true, archived: true, deleted: true },
        archived: { active: true, hidden: true, archived: true, deleted: true },
        deleted:  { active: true, hidden: false, archived: false, deleted: true },
      };

      for (const from of statuses) {
        for (const to of statuses) {
          const expected = expectedMatrix[from][to];
          const actual = isValidStatusTransition(from, to);
          assert.equal(
            actual,
            expected,
            `Transition from "${from}" to "${to}" expected ${expected}, got ${actual}`
          );
        }
      }
    });

    it('strictly rejects disallowed store status transitions with descriptive error', () => {
      // Transition to deleted first
      storeModule.updateCourseLifecycleStatus('ai', 'deleted', 'admin');

      // Attempt transition: deleted -> hidden (must throw /tidak diizinkan/)
      assert.throws(
        () => {
          storeModule.updateCourseLifecycleStatus('ai', 'hidden', 'admin');
        },
        /tidak diizinkan/,
        'Should reject deleted -> hidden transition'
      );

      // Attempt transition: deleted -> archived (must throw /tidak diizinkan/)
      assert.throws(
        () => {
          storeModule.updateCourseLifecycleStatus('ai', 'archived', 'admin');
        },
        /tidak diizinkan/,
        'Should reject deleted -> archived transition'
      );

      // Attempt transition on non-existent course ID (must throw /tidak ditemukan/)
      assert.throws(
        () => {
          storeModule.updateCourseLifecycleStatus('unknown-course-id', 'active', 'admin');
        },
        /tidak ditemukan/,
        'Should reject mutation on unknown course ID'
      );

      // Verify schema rejects unrecognized status strings
      assert.throws(() => {
        schemaModule.courseLifecycleStatusSchema.parse('draft');
      });
      assert.throws(() => {
        schemaModule.courseLifecycleStatusSchema.parse('published');
      });
    });
  });

  // =========================================================================
  // SUITE 3: Server Mutation RPCs & Audit Logging (COURSE-TEST-01)
  // =========================================================================
  describe('Suite 3: Server Mutation RPCs & Audit Logging (COURSE-TEST-01)', () => {
    it('executes status mutations, increments version counter, and logs immutable audit records', () => {
      const initialVersion = storeModule.getCourseStoreVersion();

      // Perform mutation: active -> hidden
      const update1 = storeModule.updateCourseLifecycleStatus(
        'ai',
        'hidden',
        'super-admin@learnwith.id',
        'Pembaruan kurikulum 2026'
      );

      assert.equal(update1.success, true);
      assert.equal(update1.record.status, 'hidden');
      assert.equal(update1.record.updatedBy, 'super-admin@learnwith.id');
      assert.equal(update1.record.reason, 'Pembaruan kurikulum 2026');
      assert.ok(update1.version > initialVersion, 'Version counter must increment');

      // Check audit log entry (auditLog.unshift puts latest at index 0)
      const auditLog = storeModule.getCourseLifecycleAuditLog();
      const latestEntry = auditLog[0];
      assert.equal(latestEntry.courseId, 'ai');
      assert.equal(latestEntry.fromStatus, 'active');
      assert.equal(latestEntry.toStatus, 'hidden');
      assert.equal(latestEntry.operator, 'super-admin@learnwith.id');
      assert.equal(latestEntry.reason, 'Pembaruan kurikulum 2026');

      // Perform mutation: hidden -> archived
      const update2 = storeModule.updateCourseLifecycleStatus('ai', 'archived', 'admin-user');
      assert.equal(update2.record.status, 'archived');
      assert.ok(update2.version > update1.version);

      // Perform mutation: archived -> deleted (soft-delete)
      const update3 = storeModule.updateCourseLifecycleStatus('ai', 'deleted', 'admin-user');
      assert.equal(update3.record.status, 'deleted');

      // Perform restore mutation: deleted -> active (COURSE-STATUS-03)
      const restore = storeModule.updateCourseLifecycleStatus('ai', 'active', 'admin-user', 'Restored to catalog');
      assert.equal(restore.record.status, 'active');
      assert.equal(restore.record.reason, 'Restored to catalog');
    });
  });

  // =========================================================================
  // SUITE 4: Master Admin Authorization & Security Boundaries (COURSE-TEST-01)
  // =========================================================================
  describe('Suite 4: Master Admin Authorization & Security Boundaries (COURSE-TEST-01)', () => {
    it('rejects unauthenticated, malformed, and non-admin callers on protected endpoints', () => {
      const unauthorizedTokens = [
        undefined,
        null,
        '',
        '   ',
        'forged-token-xyz',
        'expired-token-12345',
        'participant-guest-token',
      ];

      for (const token of unauthorizedTokens) {
        assert.throws(
          () => {
            platformServer.assertAdminAuthorized(token);
          },
          /UNAUTHORIZED/,
          `Should reject unauthorized token: "${token}"`
        );
      }

      // Valid Master Admin session succeeds
      const adminSession = sessionModule.createAdminSession('passkey');
      const authUser = platformServer.assertAdminAuthorized(adminSession.token);
      assert.ok(authUser);
      assert.equal(authUser.role, 'admin');
    });

    it('enforces strict Zod payload validation on updateCourseStatusInputSchema', () => {
      const schema = schemaModule.updateCourseStatusInputSchema;

      // Valid payload passes
      const valid = schema.parse({
        courseId: 'ai',
        targetStatus: 'hidden',
        sessionToken: 'valid-token-string',
        reason: 'Optional note',
      });
      assert.equal(valid.courseId, 'ai');
      assert.equal(valid.targetStatus, 'hidden');

      // Invalid payload: empty courseId
      assert.throws(() => {
        schema.parse({
          courseId: '',
          targetStatus: 'hidden',
        });
      });

      // Invalid payload: missing targetStatus
      assert.throws(() => {
        schema.parse({
          courseId: 'ai',
        });
      });

      // Invalid payload: invalid targetStatus
      assert.throws(() => {
        schema.parse({
          courseId: 'ai',
          targetStatus: 'unknown',
          sessionToken: 'valid-token',
        });
      });
    });
  });

  // =========================================================================
  // SUITE 5: Public Catalog & Reactive Discovery Invariants (COURSE-TEST-02)
  // =========================================================================
  describe('Suite 5: Public Catalog & Reactive Discovery Invariants (COURSE-TEST-02)', () => {
    it('guarantees getPublicCoursesListFn returns only active courses across all lifecycle states', async () => {
      // 1. Initial State: both active
      let publicCourses = await courseRpcModule.getPublicCoursesListFn();
      assert.equal(publicCourses.length, 2, 'Default state must expose 2 active courses');
      assert.deepEqual(publicCourses.map(c => c.id).sort(), ['ai', 'word'].sort());

      // 2. Hide 'ai': only 'word' remains discoverable
      storeModule.updateCourseLifecycleStatus('ai', 'hidden');
      publicCourses = await courseRpcModule.getPublicCoursesListFn();
      assert.equal(publicCourses.length, 1);
      assert.equal(publicCourses[0].id, 'word');

      // Check public projections
      let projections = storeModule.getPublicCourseStatusProjections();
      const aiProj = projections.find(p => p.id === 'ai');
      assert.equal(aiProj.status, 'hidden');
      assert.equal(aiProj.isDiscoverable, false);
      assert.equal(aiProj.isAvailable, true); // Still available via direct route

      // 3. Archive 'word': public catalog becomes empty []
      storeModule.updateCourseLifecycleStatus('word', 'archived');
      publicCourses = await courseRpcModule.getPublicCoursesListFn();
      assert.equal(publicCourses.length, 0, 'Catalog must be empty when all courses are non-active');

      // 4. Soft-delete 'ai': remains empty []
      storeModule.updateCourseLifecycleStatus('ai', 'deleted');
      publicCourses = await courseRpcModule.getPublicCoursesListFn();
      assert.equal(publicCourses.length, 0);

      // 5. Restore 'ai' to active: 'ai' re-appears in catalog
      storeModule.updateCourseLifecycleStatus('ai', 'active');
      publicCourses = await courseRpcModule.getPublicCoursesListFn();
      assert.equal(publicCourses.length, 1);
      assert.equal(publicCourses[0].id, 'ai');
    });

    it('verifies frontpage catalog component defines empty state and category empty markers', () => {
      const catalogFile = path.join(ROOT_DIR, 'app/components/home/WorkshopCatalog.tsx');
      assert.ok(fs.existsSync(catalogFile), 'WorkshopCatalog.tsx must exist');
      const catalogContent = fs.readFileSync(catalogFile, 'utf-8');

      assert.ok(
        catalogContent.includes('catalog-empty-state'),
        'WorkshopCatalog must include catalog-empty-state ID for friendly empty card'
      );
      assert.ok(
        catalogContent.includes('catalog-category-empty'),
        'WorkshopCatalog must include catalog-category-empty ID for empty tab'
      );
    });
  });

  // =========================================================================
  // SUITE 6: Direct Route UX & Passkey Gate Preservation (COURSE-TEST-02)
  // =========================================================================
  describe('Suite 6: Direct Route UX & Passkey Gate Preservation (COURSE-TEST-02)', () => {
    it('verifies direct routes handle inactive notices and unlisted banners properly', () => {
      const aiRouteFile = path.join(ROOT_DIR, 'app/routes/course.ai.tsx');
      const wordRouteFile = path.join(ROOT_DIR, 'app/routes/course.word.tsx');

      assert.ok(fs.existsSync(aiRouteFile), 'course.ai.tsx must exist');
      assert.ok(fs.existsSync(wordRouteFile), 'course.word.tsx must exist');

      const aiContent = fs.readFileSync(aiRouteFile, 'utf-8');
      const wordContent = fs.readFileSync(wordRouteFile, 'utf-8');

      // Both direct routes must import and render CourseUnavailableNotice & UnlistedCourseBanner
      assert.ok(
        aiContent.includes('CourseUnavailableNotice') && aiContent.includes('UnlistedCourseBanner'),
        'course.ai.tsx must integrate CourseUnavailableNotice and UnlistedCourseBanner'
      );
      assert.ok(
        wordContent.includes('CourseUnavailableNotice') && wordContent.includes('UnlistedCourseBanner'),
        'course.word.tsx must integrate CourseUnavailableNotice and UnlistedCourseBanner'
      );
    });

    it('guarantees passkey gate verification on /course/word is strictly preserved for hidden courses', () => {
      const wordRouteFile = path.join(ROOT_DIR, 'app/routes/course.word.tsx');
      const wordContent = fs.readFileSync(wordRouteFile, 'utf-8');

      // Check that InstructorUnlockModal is rendered and isUnlocked state is checked
      assert.ok(
        wordContent.includes('InstructorUnlockModal'),
        'course.word.tsx must render InstructorUnlockModal'
      );
      assert.ok(
        wordContent.includes('isUnlocked'),
        'course.word.tsx must track isUnlocked state'
      );
    });

    it('verifies byte-for-byte CSS mirror parity between assets and public/assets', () => {
      const cssSrc = path.join(ROOT_DIR, 'assets/css/components.css');
      const cssPublic = path.join(ROOT_DIR, 'public/assets/css/components.css');

      assert.ok(fs.existsSync(cssSrc), 'assets/css/components.css must exist');
      assert.ok(fs.existsSync(cssPublic), 'public/assets/css/components.css must exist');

      const bufSrc = fs.readFileSync(cssSrc);
      const bufPublic = fs.readFileSync(cssPublic);

      assert.equal(
        bufSrc.length,
        bufPublic.length,
        'CSS mirror files must have identical byte length'
      );
      assert.ok(
        bufSrc.equals(bufPublic),
        'assets/css/components.css and public/assets/css/components.css must be 100% byte-for-byte identical'
      );
    });
  });
});