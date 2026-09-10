/**
 * Automated Unit & Integration Tests for Phase 34:
 * Course Lifecycle State Store (COURSE-STATUS-01, COURSE-STATUS-02, COURSE-STATUS-03)
 */
const { describe, it, before, beforeEach } = require('node:test');
const assert = require('node:assert/strict');

describe('Phase 34 Course Lifecycle State Store Suite', () => {
  let schemaModule;
  let storeModule;

  before(async () => {
    schemaModule = await import('../app/schemas/courseLifecycle.ts');
    storeModule = await import('../app/server/courseLifecycleStore.ts');
  });

  beforeEach(() => {
    storeModule.clearCourseLifecycleStoreForTesting();
  });

  it('COURSE-STATUS-01: validates lifecycle status enum and rejects invalid states', () => {
    const { courseLifecycleStatusSchema } = schemaModule;
    assert.equal(courseLifecycleStatusSchema.parse('active'), 'active');
    assert.equal(courseLifecycleStatusSchema.parse('hidden'), 'hidden');
    assert.equal(courseLifecycleStatusSchema.parse('archived'), 'archived');
    assert.equal(courseLifecycleStatusSchema.parse('deleted'), 'deleted');

    assert.throws(() => {
      courseLifecycleStatusSchema.parse('draft');
    });
    assert.throws(() => {
      courseLifecycleStatusSchema.parse('invalid');
    });
  });

  it('COURSE-STATUS-02: default store initializes with active ai and word courses', () => {
    const records = storeModule.getCourseLifecycleRecords();
    assert.equal(records.length, 2);

    const ai = storeModule.getCourseLifecycleRecord('ai');
    assert.ok(ai);
    assert.equal(ai.status, 'active');
    assert.equal(ai.id, 'ai');


    const word = storeModule.getCourseLifecycleRecord('word');
    assert.ok(word);
    assert.equal(word.status, 'active');
    assert.equal(word.id, 'word');
  });

  it('COURSE-STATUS-03: enforces allowable state transitions', () => {
    const { isValidStatusTransition } = schemaModule;

    // Same status no-op
    assert.equal(isValidStatusTransition('active', 'active'), true);

    // From active
    assert.equal(isValidStatusTransition('active', 'hidden'), true);
    assert.equal(isValidStatusTransition('active', 'archived'), true);
    assert.equal(isValidStatusTransition('active', 'deleted'), true);

    // From hidden
    assert.equal(isValidStatusTransition('hidden', 'active'), true);
    assert.equal(isValidStatusTransition('hidden', 'archived'), true);
    assert.equal(isValidStatusTransition('hidden', 'deleted'), true);

    // From archived
    assert.equal(isValidStatusTransition('archived', 'active'), true);
    assert.equal(isValidStatusTransition('archived', 'hidden'), true);
    assert.equal(isValidStatusTransition('archived', 'deleted'), true);

    // From deleted (Restore to active only)
    assert.equal(isValidStatusTransition('deleted', 'active'), true);
    assert.equal(isValidStatusTransition('deleted', 'hidden'), false);
    assert.equal(isValidStatusTransition('deleted', 'archived'), false);
  });

  it('COURSE-STATUS-03: status updates increment version, mutate record, and log audits', () => {
    const v1 = storeModule.getCourseStoreVersion();

    // 1. Hide
    const resHide = storeModule.updateCourseLifecycleStatus('ai', 'hidden', 'master-admin', 'Hide for update');
    assert.equal(resHide.success, true);
    assert.equal(resHide.record.status, 'hidden');
    assert.equal(resHide.record.updatedBy, 'master-admin');
    assert.equal(resHide.record.reason, 'Hide for update');
    assert.equal(resHide.version, v1 + 1);

    // 2. Archive
    const resArchive = storeModule.updateCourseLifecycleStatus('ai', 'archived', 'master-admin');
    assert.equal(resArchive.record.status, 'archived');
    assert.equal(resArchive.version, v1 + 2);

    // 3. Soft-delete
    const resDel = storeModule.updateCourseLifecycleStatus('ai', 'deleted', 'master-admin', 'Soft delete');
    assert.equal(resDel.record.status, 'deleted');

    // 4. Disallowed transition from deleted -> hidden
    assert.throws(() => {
      storeModule.updateCourseLifecycleStatus('ai', 'hidden', 'master-admin');
    }, /tidak diizinkan/);

    // 5. Restore to active
    const resRestore = storeModule.updateCourseLifecycleStatus('ai', 'active', 'master-admin', 'Restore active');
    assert.equal(resRestore.record.status, 'active');

    // Audit log check
    const audit = storeModule.getCourseLifecycleAuditLog();
    assert.equal(audit.length, 4);
    assert.equal(audit[0].fromStatus, 'deleted');
    assert.equal(audit[0].toStatus, 'active');
    assert.equal(audit[0].courseId, 'ai');
  });

  it('projects public discoverable and available flags accurately', () => {
    // Both active
    let proj = storeModule.getPublicCourseStatusProjections();
    assert.deepEqual(proj.find((p) => p.id === 'ai'), {
      id: 'ai',
      status: 'active',
      isDiscoverable: true,
      isAvailable: true,
    });

    // Hidden -> available via direct link, not discoverable in catalog
    storeModule.updateCourseLifecycleStatus('ai', 'hidden');
    proj = storeModule.getPublicCourseStatusProjections();
    assert.deepEqual(proj.find (p => p.id === 'ai'), {
      id: 'ai',
      status: 'hidden',
      isDiscoverable: false,
      isAvailable: true,
    });

    // Archived -> not discoverable, not available
    storeModule.updateCourseLifecycleStatus('ai', 'archived');
    proj = storeModule.getPublicCourseStatusProjections();
    assert.deepEqual(proj.find((p) => p.id === 'ai'), {
      id: 'ai',
      status: 'archived',
      isDiscoverable: false,
      isAvailable: false,
    });

    // Deleted -> not discoverable, not available
    storeModule.updateCourseLifecycleStatus('ai', 'deleted');
    proj = storeModule.getPublicCourseStatusProjections();
    assert.deepEqual(proj.find((p) => p.id === 'ai'), {
      id: 'ai',
      status: 'deleted',
      isDiscoverable: false,
      isAvailable: false,
    });
  });
});
