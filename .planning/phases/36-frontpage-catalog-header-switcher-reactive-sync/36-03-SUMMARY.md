# Phase 36 — Plan 03 Summary: Direct Workspace Access UX, Passkey Preservation & In-Flight Protection

## Plan Metadata
- **Phase:** 36 (Frontpage Catalog & Header Switcher Reactive Sync)
- **Plan:** 03
- **Wave:** 3
- **Requirements Addressed:** `COURSE-SYNC-03`
- **Execution Date:** 2026-09-10

---

## 1. Accomplishments & Delivered Deliverables

### A. Lifecycle State Notice Components
- **`app/components/course/CourseUnavailableNotice.tsx`**:
  - Implemented accessible status screens for workshops that have been soft-deleted (`course-unavailable-deleted`) or archived (`course-unavailable-archived`).
  - Provides contextual descriptions and a direct navigation CTA button returning users safely to the frontpage (`/`).
- **`app/components/course/UnlistedCourseBanner.tsx`**:
  - Implemented `UnlistedCourseBanner` (`banner-unlisted-course`) indicating unlisted/restricted access for `hidden` courses.
  - Implemented in-flight status advisory banner (`banner-inflight-status`) rendering non-disruptive alerts when an admin modifies lifecycle status mid-session, preventing abrupt unmounting of active user work.

### B. Direct Route Integration with SSR Protection
- **`app/routes/course.ai.tsx`**:
  - Added SSR loader checking `getPublicCourseStatusesFn()`.
  - Conditional rendering: renders `CourseUnavailableNotice` during initial server render without client flash if deleted or archived.
  - Mounts `UnlistedCourseBanner` if course is `hidden`.
  - Subscribes to multi-window `learnwith:course_status_changed` broadcast to display `#banner-inflight-status` if course is archived or deleted while a participant is actively working.
- **`app/routes/course.word.tsx`**:
  - Added SSR loader checking `getPublicCourseStatusesFn()`.
  - Conditional rendering: renders `CourseUnavailableNotice` if deleted or archived.
  - Strictly preserves the timing-safe `WordPasskeyModal` gate when the course is accessed directly, ensuring unlisted status does not bypass passkey security.
  - Mounts `UnlistedCourseBanner` and reacts to in-flight status changes via `#banner-inflight-status`.

### C. Design Standard & CSS Parity Compliance
- Replaced emoji with `<IconPackage />` component in `WorkshopCatalog.tsx` to maintain 100% compliance with zero-raw-OS-emoji standards verified by `tests/homepage.test.js`.
- Fixed CSS variable token in `assets/css/components.css` and `public/assets/css/components.css` to use `var(--accent-primary, #2563eb)`.
- Maintained 100% byte-for-byte mirror parity between `assets/css/components.css` and `public/assets/css/components.css`.

### D. Automated Testing & Verification
- Created comprehensive test suite in `tests/course-lifecycle-sync.test.js` covering `COURSE-MUTATE-03`, `COURSE-SYNC-01`, `COURSE-SYNC-02`, and `COURSE-SYNC-03`.
- All 20 tests in `tests/course-lifecycle-sync.test.js` PASS.
- All 32 test suites (289 tests) in `npm run test` PASS.
- TypeScript check (`npx tsc --noEmit`) passes with 0 errors.

---

## 2. Verification Summary
- `node --test tests/homepage.test.js`: PASS (30/30)
- `node --test tests/mobile-accessibility.test.js`: PASS (6/6)
- `node --test tests/course-lifecycle-sync.test.js`: PASS (20/20)
- `npm run test`: PASS (32 suites, 289 tests passed)
- `npx tsc --noEmit`: PASS (0 errors)
- Byte parity test: 100% byte-for-byte identical.
