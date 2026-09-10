/**
 * Automated Unit & Integration Tests for Phase 34:
 * Course Lifecycle SERVER FUNCTIONS & SESSION AUTH GATING
 * (COURSE-MUTATE-01, COURSE-MUTATE-02)
 */
const { describe, it, before, beforeEach } = require('node:test');
const assert = require('node:assert/strict');

describe('Phase 34 Course Lifecycle RPC & Authorization Suite', () => {
  let courseLoader;
  let storeModule;
  let sessionModule;
  let platformServer;
  let schemasModule;

  before(async () => {
    courseLoader = await import('../app/server/courseLifecycle.ts');
    storeModule = await import('../app/server/courseLifecycleStore.ts');
    sessionModule = await import('../app/server/session.ts');
    platformServer = await import('../app/server/platform.ts');
    schemasModule = await import('../app/schemas/courseLifecycle.ts');
  });

  beforeEach(() => {
    storeModule.clearCourseLifecycleStoreForTesting();
    sessionModule.clearAllSessionsForTesting();
  });

  it('exports valid TanStack Start server function entrypoints', () => {
    assert.ok(courseLoader.getPublicCourseStatusesFn);
    assert.okStrict ? assert.okStrict(courseLoader.adminGetCoursesLifecycleFn) : assert.ok(courseLoader.adminGetCoursesLifecycleFn);
    assert.ok(courseLoader.adminUpdateCourseStatusFn);
  });

  it('getPublicCourseStatusesProjections yields discoverable and available metadata for public usage', () => {
    const projections = storeModule.getPublicCourseStatusProjections();
    assert.okArray ? assert.okArray(projections) : assert.ok(Array.isArray(projections));
    assert.equal(projections.length, 2);

    const ai = projections.find((p) => p.id === 'ai');
    assert.ok(ai);
    assert.equal(ai.status, 'active');
    assert.equal(ai.isDiscoverable, true);
    assert.equal(ai.isAvailable, true);
  });

  it('COURSE-MUTATE-01: rejects unauthorized callers via session authorization gate', () => {
    // No token
    assert.throws(() => {
      platformServer.assertAdminAuthorized(undefined);
    }, /UNAUTHORIZED/);

    // Invalid token
    assert.throws(() => {
      platformServer.assertAdminAuthorized('invalid-token');
    }, /UNAUTHORIZED/);

    // Empty token
    assert.throws(() => {
      platformServer.assertAdminAuthorized('');
    }, /UNAUTHORIZED/);
  });

  it('COURSE-MUTATE-01: admin authorization succeeds with valid Master Admin token', () => {
    const session = sessionModule.createAdminSession('passkey');
    const user = platformServer.assertAdminAuthorized(session.token);

    assert.ok(user);
    assert.equal(user.role, 'admin');

    // Admin can fetch full lifecycle records and audit trail
    const records = storeModule.getCourseLifecycleRecords();
    assert.equal(records.length, 2);
    const audit = storeModule.getCourseLifecycleAuditLog();
    assert.okArray ? assert.okArray(audit) : assert.ok(Array.isArray(audit));
  });

  it('COURSE-MUTATE-02: validates input schema and executes status mutation with audit trail', () => {
    const session = sessionModule.createAdminSession('passkey');
    const user = platformServer.assertAdminAuthorized(session.token);

    // Validate payload via Zod schema
    const payload = {
      courseId: 'ai',
      targetStatus: 'hidden',
      sessionToken: session.token,
      reason: 'Persiyapan modul tambahan',
    };
    const parsed = schemasModule.updateCourseStatusInputSchema.parse(payload);

    // Execute mutation
    const result = storeModule.updateCourseLifecycleStatus(
      parsed.courseId,
      parsed.targetStatus,
      user.role,
      parsed.reason,
    );

    assert.equal(result.success, true);
    assert.equal(result.record.status, 'hidden');
    assert.equal(result.record.reason, 'Persiyapan modul tambahan');

    // Archive course
    const archiveRes = storeModule.updateCourseLifecycleStatus(
      'ai',
      'archived',
      user.role,
      'Archive after workshop',
    );
    assert.equal(archiveRes.record.status, 'archived');

    // Delete course
    const delRes = storeModule.updateCourseLifecycleStatus(
      'ai',
      'deleted',
      user.role,
      'Soft delete',
    );
    assert.equal(delRes.record.status, 'deleted');

    // Restore course
    const restoreRes = storeModule.updateCourseLifecycleStatus(
      'ai',
      'active',
      user.role,
      'Reactivate for new batch',
    );
    assert.equal(restoreRes.record.status, 'active');

    // Verify disallowed transition rejection - delete first
    storeModule.updateCourseLifecycleStatus('ai', 'deleted', user.role);
    assert.throws(() => {
      storeModule.updateCourseLifecycleStatus('ai', 'hidden', user.role);
    }, /tidak diizinkan/);
  });

});
