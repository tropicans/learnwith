/**
 * Automated Unit & Integration Tests for Phase 36:
 * Frontpage Catalog, Header Switcher & Direct Access Reactive Sync
 * Requirements: COURSE-MUTATE-03, COURSE-SYNC-01, COURSE-SYNC-02, COURSE-SYNC-03
 */
const { describe, it, before, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT_DIR = path.resolve(__dirname, '..');

describe('Phase 36 Course Lifecycle Reactive Sync Suite', () => {
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

  describe('COURSE-MUTATE-03: Server RPC getPublicCoursesListFn Active Filtering', () => {
    it('exports getPublicCoursesListFn from app/server/courseLifecycle.ts', () => {
      assert.ok(courseRpcModule.getPublicCoursesListFn, 'getPublicCoursesListFn must be exported');
      assert.equal(typeof courseRpcModule.getPublicCoursesListFn, 'function', 'Must be a function');
    });

    it('returns only courses with status "active" in default initial state', async () => {
      const courses = await courseRpcModule.getPublicCoursesListFn();
      assert.ok(Array.isArray(courses), 'Must return an array');
      assert.equal(courses.length, 2, 'Default state should have 2 active courses');
      const ids = courses.map((c) => c.id);
      assert.ok(ids.includes('ai'), 'Must include ai');
      assert.ok(ids.includes('word'), 'Must include word');
    });

    it('excludes course when transitioned to "hidden"', async () => {
      storeModule.updateCourseLifecycleStatus('ai', 'hidden', 'master-admin', 'Testing hidden state');
      const courses = await courseRpcModule.getPublicCoursesListFn();
      assert.equal(courses.length, 1, 'Only 1 active course should remain');
      assert.equal(courses[0].id, 'word', 'Only word should be returned');
    });

    it('excludes course when transitioned to "archived"', async () => {
      storeModule.updateCourseLifecycleStatus('word', 'archived', 'master-admin', 'Testing archived state');
      const courses = await courseRpcModule.getPublicCoursesListFn();
      assert.equal(courses.length, 1, 'Only 1 active course should remain');
      assert.equal(courses[0].id, 'ai', 'Only ai should be returned');
    });

    it('excludes course when transitioned to "deleted"', async () => {
      storeModule.updateCourseLifecycleStatus('ai', 'deleted', 'master-admin', 'Testing deleted state');
      const courses = await courseRpcModule.getPublicCoursesListFn();
      assert.equal(courses.length, 1, 'Only 1 active course should remain');
      assert.equal(courses[0].id, 'word', 'Only word should be returned');
    });

    it('returns empty array [] when all courses are non-active', async () => {
      storeModule.updateCourseLifecycleStatus('ai', 'hidden', 'master-admin', 'Hide ai');
      storeModule.updateCourseLifecycleStatus('word', 'archived', 'master-admin', 'Archive word');
      const courses = await courseRpcModule.getPublicCoursesListFn();
      assert.ok(Array.isArray(courses), 'Must return array');
      assert.equal(courses.length, 0, 'Must be empty when all non-active');
    });

    it('restores course into list when restored to "active"', async () => {
      storeModule.updateCourseLifecycleStatus('ai', 'hidden', 'master-admin', 'Hide ai');
      let courses = await courseRpcModule.getPublicCoursesListFn();
      assert.equal(courses.length, 1);

      storeModule.updateCourseLifecycleStatus('ai', 'active', 'master-admin', 'Restore ai');
      courses = await courseRpcModule.getPublicCoursesListFn();
      assert.equal(courses.length, 2, 'Both courses should be returned again');
    });
  });

  describe('COURSE-SYNC-01: Frontpage Hub Catalog Sync & Friendly Empty States', () => {
    it('verifies app/routes/index.tsx uses getPublicCoursesListFn in loader', () => {
      const indexPath = path.join(ROOT_DIR, 'app', 'routes', 'index.tsx');
      assert.ok(fs.existsSync(indexPath), 'app/routes/index.tsx must exist');
      const content = fs.readFileSync(indexPath, 'utf8');

      assert.ok(
        content.includes('getPublicCoursesListFn'),
        'app/routes/index.tsx must import/use getPublicCoursesListFn'
      );
      assert.ok(
        !content.includes('getCoursesList()'),
        'app/routes/index.tsx must not call unfiltered getCoursesList()'
      );
    });

    it('verifies WorkshopCatalog.tsx structure handles global empty state and category empty state', () => {
      const catalogPath = path.join(ROOT_DIR, 'app', 'components', 'home', 'WorkshopCatalog.tsx');
      assert.ok(fs.existsSync(catalogPath), 'WorkshopCatalog.tsx must exist');
      const content = fs.readFileSync(catalogPath, 'utf8');

      // Global empty state (D-03)
      assert.ok(
        content.includes('catalog-empty-state'),
        'Must contain element with id="catalog-empty-state"'
      );
      assert.ok(
        content.includes('Belum Ada Workshop Publik Aktif Saat Ini') ||
          content.includes('Belum ada workshop publik aktif saat ini'),
        'Must contain friendly empty state heading'
      );
      assert.ok(
        content.includes('mailto:support@learnwith.id') || content.includes('empty-state-cta'),
        'Must contain contact CTA in empty state'
      );

      // Category empty state (D-04)
      assert.ok(
        content.includes('catalog-category-empty'),
        'Must contain element with id="catalog-category-empty"'
      );
      assert.ok(
        content.includes('Belum ada modul aktif di kategori ini'),
        'Must contain category empty notice text'
      );
    });
  });

  describe('CSS Mirror Integrity Check', () => {
    it('ensures assets/css/components.css and public/assets/css/components.css are byte-for-byte identical', () => {
      const assetCssPath = path.join(ROOT_DIR, 'assets', 'css', 'components.css');
      const publicCssPath = path.join(ROOT_DIR, 'public', 'assets', 'css', 'components.css');

      assert.ok(fs.existsSync(assetCssPath), 'assets/css/components.css must exist');
      assert.ok(fs.existsSync(publicCssPath), 'public/assets/css/components.css must exist');

      const assetCss = fs.readFileSync(assetCssPath, 'utf8');
      const publicCss = fs.readFileSync(publicCssPath, 'utf8');

      assert.equal(assetCss, publicCss, 'CSS stylesheets must be byte-for-byte identical');
    });
  });
});