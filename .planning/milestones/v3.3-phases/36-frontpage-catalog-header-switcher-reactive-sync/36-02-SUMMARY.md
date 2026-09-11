# Phase 36 Plan 02 Summary: Global Header Course Switcher & Root Loader Reactive Sync

## Accomplishments
- Established centralized course navigation registry (`COURSE_NAV_REGISTRY`) and `CourseNavItem` interface in `app/data/courses.ts` (D-06).
- Created multi-tab cross-window synchronization utility `app/utils/courseBroadcast.ts` broadcasting over `learnwith:course_status_changed` (D-13).
- Wired mutation triggers in `AdminCourseManagementView.tsx` calling `router.invalidate()` and `broadcastCourseStatusChange()` across all status lifecycle changes (D-13).
- Configured root route `app/routes/__root.tsx` loader with server-side `getPublicCourseStatusesFn()` and cross-tab `BroadcastChannel` listener triggering `router.invalidate()` on update messages (D-05, D-14).
- Updated `Header.tsx` and `CourseSwitcher.tsx` with dynamic lifecycle projections, unlisted badging (`.switcher-unlisted-badge` with `[Akses Terbatas]`) on direct visits (D-07), and disabled empty state note (`#course-dropdown-empty-note`) when all courses are inactive (D-08).
- Maintained 100% byte-for-byte mirror parity between `assets/css/components.css` and `public/assets/css/components.css`.
- Expanded automated integration test suite in `tests/course-lifecycle-sync.test.js` with `COURSE-SYNC-02` assertions.

## Verification
- `node --test tests/course-lifecycle-sync.test.js` passed (16/16 tests passed, 0 failures).
- `node --test tests/course-lifecycle-*.test.js` passed across all 4 lifecycle suites (43/43 tests passed, 0 failures).
- `npx tsc --noEmit` passed with 0 errors.
- Requirements satisfied: COURSE-SYNC-01, COURSE-SYNC-02.