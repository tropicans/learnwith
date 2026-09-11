---
status: passed
phase: "36"
phase_name: "frontpage-catalog-header-switcher-reactive-sync"
verified_at: "2026-09-10"
requirements_verified:
  - COURSE-SYNC-01
  - COURSE-SYNC-02
  - COURSE-SYNC-03
  - COURSE-MUTATE-03
---

# Phase 36 Verification Report: Frontpage Catalog & Header Switcher Reactive Sync

**Phase Goal:** Filter public courses reactively on `/` and navigation switcher based on lifecycle status.  
**Status:** PASSED  
**Verification Date:** 2026-09-10  
**Verifier:** GSD Verification Agent  

---

## 1. Executive Summary

Phase 36 completes the reactive integration of course lifecycle status into the public-facing areas of LearnWith:
1. Public course listing RPC (`getPublicCoursesListFn`) in `app/server/courseLifecycle.ts` strictly filters courses, returning only `active` workshops to prevent public disclosure of hidden, archived, or soft-deleted curricula.
2. Frontpage catalog (`WorkshopCatalog.tsx`) displays only active courses, with responsive empty state (`#catalog-empty-state`) and category filter notices (`#catalog-category-empty`).
3. Global header switcher (`Header.tsx` and `CourseSwitcher.tsx`) reactively projects active courses, displaying unlisted badges (`.switcher-unlisted-badge`) for unlisted courses accessed directly and an empty note (`#course-dropdown-empty-note`) when no courses are active.
4. Direct workspace routes (`/course/ai` and `/course/word`) properly handle direct navigation to hidden courses with `UnlistedCourseBanner`, display `CourseUnavailableNotice` for archived/deleted courses, and strictly preserve the timing-safe `WordPasskeyModal` gate on `/course/word`.
5. Multi-tab synchronization utility (`app/utils/courseBroadcast.ts`) broadcasts lifecycle changes via BroadcastChannel (`learnwith:course_status_changed`), triggering router invalidation across open windows.

---

## 2. Requirements Verification Matrix

| Requirement ID | Plan Reference | Description | Code Artifacts | Test Reference | Status |
|---|---|---|---|---|---|
| **COURSE-MUTATE-03** | Plan 36-01 | Public server function `getPublicCoursesListFn` projects only non-deleted, non-archived courses, excluding hidden courses from public listings while keeping them reachable via direct route. | `app/server/courseLifecycle.ts` | `tests/course-lifecycle-sync.test.js` (Suite 1) | **PASSED** |
| **COURSE-SYNC-01** | Plan 36-01 | Frontpage Hub (`/`) reactively filters workshop cards: displays only `active` courses; omits hidden, archived, and deleted courses. | `app/routes/index.tsx`<br>`app/components/home/WorkshopCatalog.tsx` | `tests/course-lifecycle-sync.test.js` (Suite 2) | **PASSED** |
| **COURSE-SYNC-02** | Plan 36-02 | Global header course dropdown / switcher displays only active courses for normal navigation. | `app/components/common/Header.tsx`<br>`app/components/common/CourseSwitcher.tsx`<br>`app/routes/__root.tsx` | `tests/course-lifecycle-sync.test.js` (Suite 3) | **PASSED** |
| **COURSE-SYNC-03** | Plan 36-03 | Direct workspace access (`/course/ai`, `/course/word`) for hidden courses remains functional with passkey intact; deleted/archived courses render unavailable notice. | `app/routes/course.ai.tsx`<br>`app/routes/course.word.tsx`<br>`app/components/course/CourseUnavailableNotice.tsx`<br>`app/components/course/UnlistedCourseBanner.tsx` | `tests/course-lifecycle-sync.test.js` (Suite 4) | **PASSED** |

---

## 3. Automated Test Evidence

- `tests/course-lifecycle-sync.test.js`: 20/20 tests passed.
- Full test run across all lifecycle suites: 43/43 tests passed.
- Total repository test suites: 32 suites passed (289 tests).
- TypeScript compile (`tsc --noEmit`): 0 errors.
- CSS mirror check (`assets/css/components.css` vs `public/assets/css/components.css`): 100% byte-for-byte parity.
