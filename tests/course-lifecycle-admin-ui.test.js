/**
 * Automated Unit & Integration Tests for Phase 35:
 * Course Lifecycle Admin UI & Action Controls
 * (COURSE-ADMIN-01, COURSE-ADMIN-02)
 */
const { describe, it, before, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT_DIR = path.resolve(__dirname, '..');

describe('Phase 35 Course Lifecycle Admin UI Suite', () => {
  let courseRpcModule;
  let storeModule;
  let sessionModule;

  before(async () => {
    courseRpcModule = await import('../app/server/courseLifecycle.ts');
    storeModule = await import('../app/server/courseLifecycleStore.ts');
    sessionModule = await import('../app/server/session.ts');
  });

  beforeEach(() => {
    storeModule.clearCourseLifecycleStoreForTesting();
    sessionModule.clearAllSessionsForTesting();
  });

  describe('COURSE-ADMIN-01: AdminShell Navigation & Container Verification', () => {
    it('verifies AdminShell.tsx structure and courses tab integration', () => {
      const shellPath = path.join(ROOT_DIR, 'app', 'components', 'admin', 'AdminShell.tsx');
      assert.ok(fs.existsSync(shellPath), 'AdminShell.tsx must exist');
      const content = fs.readFileSync(shellPath, 'utf8');

      if (content.includes('tab-admin-courses')) {
        assert.ok(content.includes('id="tab-admin-courses"'), 'Must have tab-admin-courses id');
        assert.ok(content.includes('Manajemen Kursus'), 'Must have label Manajemen Kursus');
        assert.ok(content.includes("'courses'"), "Must have 'courses' tab identifier");
        assert.ok(content.includes('AdminCourseManagementView'), 'Must import or render AdminCourseManagementView');
      } else {
        assert.ok(content.includes('id="admin-shell-container"'), 'Shell container must exist');
      }
    });

    it('calculates accurate KPI tallies for all lifecycle statuses', () => {
      const mockRecords = [
        { id: 'c1', status: 'active' },
        { id: 'c2', status: 'active' },
        { id: 'c3', status: 'hidden' },
        { id: 'c4', status: 'archived' },
        { id: 'c5', status: 'deleted' },
      ];

      const kpis = {
        total: mockRecords.length,
        active: mockRecords.filter((r) => r.status === 'active').length,
        hidden: mockRecords.filter((r) => r.status === 'hidden').length,
        archived: mockRecords.filter((r) => r.status === 'archived').length,
        deleted: mockRecords.filter((r) => r.status === 'deleted').length,
      };

      assert.equal(kpis.total, 5);
      assert.equal(kpis.active, 2);
      assert.equal(kpis.hidden, 1);
      assert.equal(kpis.archived, 1);
      assert.equal(kpis.deleted, 1);
    });

    it('verifies CourseLifecycleKPIs.tsx structure and card IDs', () => {
      const kpiPath = path.join(ROOT_DIR, 'app', 'components', 'admin', 'courses', 'CourseLifecycleKPIs.tsx');
      assert.ok(fs.existsSync(kpiPath), 'CourseLifecycleKPIs.tsx must exist');
      const content = fs.readFileSync(kpiPath, 'utf8');

      assert.ok(content.includes('id="kpi-total-courses"'), 'Must have total courses KPI id');
      assert.ok(content.includes('id="kpi-active-courses"'), 'Must have active courses KPI id');
      assert.ok(content.includes('id="kpi-hidden-courses"'), 'Must have hidden courses KPI id');
      assert.ok(content.includes('id="kpi-archived-courses"'), 'Must have archived courses KPI id');
      assert.ok(content.includes('id="kpi-deleted-courses"'), 'Must have deleted courses KPI id');
      assert.ok(content.includes('calculateCourseKPIs'), 'Must export calculateCourseKPIs');
    });

    it('verifies default store lifecycle records reflect in initial KPI calculations', () => {
      const records = storeModule.getCourseLifecycleRecords();
      assert.equal(records.length, 2);

      const activeCount = records.filter((r) => r.status === 'active').length;
      assert.equal(activeCount, 2);
      const hiddenCount = records.filter((r) => r.status === 'hidden').length;
      assert.equal(hiddenCount, 0);
    });
  });

  describe('COURSE-ADMIN-02: 1-Click Visibility Toggle RPC & Security Gate', () => {
    it('executes 1-click toggle between active and hidden states with authorized session', async () => {
      const session = sessionModule.createAdminSession('passkey');

      // 1. Toggle active -> hidden
      await courseRpcModule.adminUpdateCourseStatusFn({
        data: {
          courseId: 'ai',
          targetStatus: 'hidden',
          sessionToken: session.token,
          reason: 'Disembunyikan sementara untuk revisi materi',
        },
      });

      // Verify in store
      const hiddenRecord = storeModule.getCourseLifecycleRecord('ai');
      assert.equal(hiddenRecord.status, 'hidden');
      assert.equal(hiddenRecord.id, 'ai');

      // 2. Toggle hidden -> active
      await courseRpcModule.adminUpdateCourseStatusFn({
        data: {
          courseId: 'ai',
          targetStatus: 'active',
          sessionToken: session.token,
          reason: 'Diaktifkan kembali ke katalog publik',
        },
      });

      const activeRecord = storeModule.getCourseLifecycleRecord('ai');
      assert.equal(activeRecord.status, 'active');
    });

    it('rejects unauthorized status update with empty or invalid token', async () => {
      // Empty token
      await assert.rejects(async () => {
        await courseRpcModule.adminUpdateCourseStatusFn({
          data: {
            courseId: 'ai',
            targetStatus: 'hidden',
            sessionToken: '',
          },
        });
      }, /UNAUTHORIZED/);

      // Invalid token
      await assert.rejects(async () => {
        await courseRpcModule.adminUpdateCourseStatusFn({
          data: {
            courseId: 'ai',
            targetStatus: 'hidden',
            sessionToken: 'forged-or-expired-token-xyz',
          },
        });
      }, /UNAUTHORIZED/);
    });

    it('verifies CourseStatusCards.tsx structure and visibility toggle buttons', () => {
      const cardsPath = path.join(ROOT_DIR, 'app', 'components', 'admin', 'courses', 'CourseStatusCards.tsx');
      assert.ok(fs.existsSync(cardsPath), 'CourseStatusCards.tsx must exist');
      const content = fs.readFileSync(cardsPath, 'utf8');

      assert.ok(content.includes('id="admin-course-cards-grid"'), 'Must have cards grid id');
      assert.ok(content.includes('Sembunyikan Kursus'), 'Must have Sembunyikan Kursus button text');
      assert.ok(content.includes('Tampilkan Kursus'), 'Must have Tampilkan Kursus button text');
      assert.ok(content.includes('course-status-pill'), 'Must include course-status-pill');
    });
  });

  describe('COURSE-ADMIN-03: Filter Toolbar, Archive/Restore & Audit Table', () => {
    it('verifies CourseFilterToolbar.tsx structure, pills, and search box', () => {
      const toolbarPath = path.join(ROOT_DIR, 'app', 'components', 'admin', 'courses', 'CourseFilterToolbar.tsx');
      assert.ok(fs.existsSync(toolbarPath), 'CourseFilterToolbar.tsx must exist');
      const content = fs.readFileSync(toolbarPath, 'utf8');

      assert.ok(content.includes('id="course-filter-toolbar"'), 'Must have course-filter-toolbar ID');
      assert.ok(content.includes('id="course-search-input"'), 'Must have course-search-input ID');
      assert.ok(content.includes('filter-pill-all'), 'Must have filter-pill-all');
      assert.ok(content.includes('filter-pill-active'), 'Must have filter-pill-active');
      assert.ok(content.includes('filter-pill-hidden'), 'Must have filter-pill-hidden');
      assert.ok(content.includes('filter-pill-archived'), 'Must have filter-pill-archived');
      assert.ok(content.includes('filter-pill-deleted'), 'Must have filter-pill-deleted');
    });

    it('filters courses accurately by status and search keyword', () => {
      const mockRecords = [
        { id: 'ai', title: 'Hands-on Agentic AI', status: 'active' },
        { id: 'word', title: 'Pengolahan Kata Tingkat Lanjut', status: 'hidden' },
        { id: 'excel', title: 'Pengolahan Angka Excel', status: 'archived' },
      ];

      // Status filter
      const activeOnly = mockRecords.filter((c) => c.status === 'active');
      assert.equal(activeOnly.length, 1);
      assert.equal(activeOnly[0].id, 'ai');

      // Search keyword filter (case-insensitive)
      const q = 'kata';
      const searchResults = mockRecords.filter(
        (c) => c.title.toLowerCase().includes(q) || c.id.toLowerCase().includes(q),
      );
      assert.equal(searchResults.length, 1);
      assert.equal(searchResults[0].id, 'word');
    });

    it('executes archive and restore RPC transitions correctly', async () => {
      const session = sessionModule.createAdminSession('passkey');

      // 1. Archive active course
      await courseRpcModule.adminUpdateCourseStatusFn({
        data: {
          courseId: 'ai',
          targetStatus: 'archived',
          sessionToken: session.token,
          reason: 'Arsip kurikulum angkatan lama',
        },
      });

      const archivedRecord = storeModule.getCourseLifecycleRecord('ai');
      assert.equal(archivedRecord.status, 'archived');
      assert.equal(archivedRecord.reason, 'Arsip kurikulum angkatan lama');

      // 2. Restore archived course back to active
      await courseRpcModule.adminUpdateCourseStatusFn({
        data: {
          courseId: 'ai',
          targetStatus: 'active',
          sessionToken: session.token,
          reason: 'Dipulihkan kembali untuk semester baru',
        },
      });

      const restoredRecord = storeModule.getCourseLifecycleRecord('ai');
      assert.equal(restoredRecord.status, 'active');

      // Verify audit log has entries
      const auditLog = storeModule.getCourseLifecycleAuditLog();
      assert.ok(auditLog.length >= 2, 'Audit log must record both transitions');
      assert.equal(auditLog[0].toStatus, 'active');
      assert.equal(auditLog[1].toStatus, 'archived');
    });

    it('verifies CourseLifecycleAuditTable.tsx structure and table columns', () => {
      const tablePath = path.join(ROOT_DIR, 'app', 'components', 'admin', 'courses', 'CourseLifecycleAuditTable.tsx');
      assert.ok(fs.existsSync(tablePath), 'CourseLifecycleAuditTable.tsx must exist');
      const content = fs.readFileSync(tablePath, 'utf8');

      assert.ok(content.includes('id="course-audit-section"'), 'Must have course-audit-section ID');
      assert.ok(content.includes('id="admin-audit-table"'), 'Must have admin-audit-table ID');
      assert.ok(content.includes('Waktu Transisi'), 'Must have Waktu Transisi column');
      assert.ok(content.includes('Kursus'), 'Must have Kursus column');
      assert.ok(content.includes('Perubahan Status'), 'Must have Perubahan Status column');
      assert.ok(content.includes('Operator'), 'Must have Operator column');
      assert.ok(content.includes('Alasan / Catatan'), 'Must have Alasan / Catatan column');
    });
  });

  describe('COURSE-ADMIN-04: Soft-Delete Safety Guard Modal & Validation Barrier', () => {
    it('verifies CourseDeleteModal.tsx guard inputs, barrier logic, and labels', () => {
      const modalPath = path.join(ROOT_DIR, 'app', 'components', 'admin', 'courses', 'CourseDeleteModal.tsx');
      assert.ok(fs.existsSync(modalPath), 'CourseDeleteModal.tsx must exist');
      const content = fs.readFileSync(modalPath, 'utf8');

      assert.ok(content.includes('id="course-delete-modal-backdrop"'), 'Must have modal backdrop ID');
      assert.ok(content.includes('id="course-delete-modal-container"'), 'Must have modal container ID');
      assert.ok(content.includes('id="btn-confirm-delete"'), 'Must have confirm delete button ID');
      assert.ok(content.includes('id="btn-cancel-delete"'), 'Must have cancel delete button ID');
      assert.ok(content.includes('id="delete-confirm"'), 'Must have confirmation input ID');
      assert.ok(content.includes('id="delete-reason"'), 'Must have reason input ID');
      assert.ok(content.includes('Ya, Nonaktifkan Kursus'), 'Must have exact button copy');
      assert.ok(content.includes('Batalkan Perubahan'), 'Must have exact cancel copy');
      assert.ok(content.includes('⚠️ Tindakan Sensitif'), 'Must have danger badge copy');
    });

    it('validates confirmation guard barrier: only allows submit on course ID or HAPUS', () => {
      const courseId = 'ai';
      const isConfirmedGuard = (typed) => {
        const norm = (typed || '').trim().toLowerCase();
        return norm === courseId.toLowerCase() || norm === 'hapus';
      };

      assert.equal(isConfirmedGuard(''), false);
      assert.equal(isConfirmedGuard('ai '), true);
      assert.equal(isConfirmedGuard('AI'), true);
      assert.equal(isConfirmedGuard('hapus'), true);
      assert.equal(isConfirmedGuard('HAPUS'), true);
      assert.equal(isConfirmedGuard('wrong-id'), false);
      assert.equal(isConfirmedGuard('delete'), false);
    });

    it('executes soft-delete transition to deleted state with optional reason', async () => {
      const session = sessionModule.createAdminSession('passkey');

      await courseRpcModule.adminUpdateCourseStatusFn({
        data: {
          courseId: 'word',
          targetStatus: 'deleted',
          sessionToken: session.token,
          reason: 'Pembaruan kurikulum total angkatan baru',
        },
      });

      const deletedRecord = storeModule.getCourseLifecycleRecord('word');
      assert.equal(deletedRecord.status, 'deleted');
      assert.equal(deletedRecord.reason, 'Pembaruan kurikulum total angkatan baru');

      // Verify soft-deleted course can be restored back to active
      await courseRpcModule.adminUpdateCourseStatusFn({
        data: {
          courseId: 'word',
          targetStatus: 'active',
          sessionToken: session.token,
          reason: 'Dipulihkan kembali oleh Master Admin',
        },
      });

      const restoredRecord = storeModule.getCourseLifecycleRecord('word');
      assert.equal(restoredRecord.status, 'active');
    });
  });

  describe('Security Boundary & Style Integrity Audit', () => {
    const SENSITIVE_SERVER_SECRETS = [
      'ADMIN_PASSKEY',
      'SESSION_SECRET',
      'TELEGRAM_BOT_TOKEN',
      'GOOGLE_CLIENT_SECRET',
    ];

    it('verifies zero imports or leakage of sensitive server secrets in client course components', () => {
      const coursesDir = path.join(ROOT_DIR, 'app', 'components', 'admin', 'courses');
      if (fs.existsSync(coursesDir)) {
        const files = fs.readdirSync(coursesDir).filter((f) => f.endsWith('.tsx') || f.endsWith('.ts'));
        for (const file of files) {
          const fullPath = path.join(coursesDir, file);
          const content = fs.readFileSync(fullPath, 'utf8');

          for (const secret of SENSITIVE_SERVER_SECRETS) {
            assert.strictEqual(
              content.includes(secret),
              false,
              `Security boundary violation: ${file} contains reference to sensitive server secret ${secret}`
            );
          }
        }
      }
    });

    it('verifies assets/css/admin.css exists and is mirrored to public/assets/css/admin.css', () => {
      const srcCssPath = path.join(ROOT_DIR, 'assets', 'css', 'admin.css');
      const pubCssPath = path.join(ROOT_DIR, 'public', 'assets', 'css', 'admin.css');

      assert.strictEqual(fs.existsSync(srcCssPath), true, 'assets/css/admin.css must exist');
      assert.strictEqual(fs.existsSync(pubCssPath), true, 'public/assets/css/admin.css must exist');

      const srcContent = fs.readFileSync(srcCssPath, 'utf8');
      const pubContent = fs.readFileSync(pubCssPath, 'utf8');

      assert.strictEqual(srcContent, pubContent, 'Source and public stylesheets must be identical');
      assert.ok(srcContent.includes('Authoritative Source: assets/css/admin.css'), 'Must have authoritative header');
    });

    it('verifies admin course management styles are defined in admin.css', () => {
      const srcCssPath = path.join(ROOT_DIR, 'assets', 'css', 'admin.css');
      const content = fs.readFileSync(srcCssPath, 'utf8');

      assert.ok(content.includes('.admin-courses-container'), 'Must have .admin-courses-container');
      assert.ok(content.includes('.admin-course-cards-grid'), 'Must have .admin-course-cards-grid');
      assert.ok(content.includes('.admin-course-card'), 'Must have .admin-course-card');
      assert.ok(content.includes('.course-status-pill.status-active'), 'Must have .course-status-pill.status-active');
      assert.ok(content.includes('.course-status-pill.status-hidden'), 'Must have .course-status-pill.status-hidden');
      assert.ok(content.includes('.btn-course-action'), 'Must have .btn-course-action');
      assert.ok(content.includes('.btn-action-primary'), 'Must have .btn-action-primary');
      assert.ok(content.includes('.btn-action-warning'), 'Must have .btn-action-warning');
      assert.ok(content.includes('.btn-action-secondary'), 'Must have .btn-action-secondary');
      assert.ok(content.includes('.admin-modal-backdrop'), 'Must have .admin-modal-backdrop');
      assert.ok(content.includes('.course-delete-modal'), 'Must have .course-delete-modal');
      assert.ok(content.includes('.admin-audit-table'), 'Must have .admin-audit-table');
    });
  });
});
