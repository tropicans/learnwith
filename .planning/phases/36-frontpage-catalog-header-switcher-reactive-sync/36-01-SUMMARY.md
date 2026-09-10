# Phase 36 Plan 01 Summary: Server RPC Filtering & Frontpage Hub Catalog Sync

## Accomplishments
- Implemented `getPublicCoursesListFn` in `app/server/courseLifecycle.ts`, providing TanStack Start server RPC filtering so public callers only receive courses in `'active'` status, preventing data leakage of hidden, archived, or soft-deleted workshops (ASVS 4.0.3 v5.1.3, `COURSE-MUTATE-03`).
- Updated `app/routes/index.tsx` route loader to call `getPublicCoursesListFn()` synchronously during SSR.
- Enhanced `app/components/home/WorkshopCatalog.tsx` with friendly empty-state (`#catalog-empty-state` with contact CTA when 0 courses active) and category-empty notice (`#catalog-category-empty` when a tab has 0 active courses) while keeping category filter chips visible and interactive (`COURSE-SYNC-01`).
- Added responsive styling for empty states and cards in `assets/css/components.css` and verified 100% byte-for-byte mirror parity with `public/assets/css/components.css`.
- Bootstrapped Phase 36 automated test suite in `tests/course-lifecycle-sync.test.js` covering `COURSE-MUTATE-03`, `COURSE-SYNC-01`, and CSS mirror integrity.

## Verification
- `node --test tests/course-lifecycle-sync.test.js` passed (10/10 tests passed, 0 failures).
- `node --test tests/course-lifecycle-*.test.js` passed across all 4 lifecycle test suites (37/37 tests passed, 0 failures).
- `npm run typecheck` passed with 0 errors.
- Requirements satisfied: COURSE-MUTATE-03, COURSE-SYNC-01.