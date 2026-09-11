# Phase 36: Frontpage Catalog & Header Switcher Reactive Sync - Context

**Gathered:** 2026-09-10
**Status:** Ready for planning

<domain>
## Phase Boundary

Ensure Frontpage Hub (`/`) and global navigation course switchers reactively reflect live course visibility (`active`, `hidden`, `archived`, `deleted`) managed in `/admin`, implement `COURSE-MUTATE-03` (`getPublicCoursesListFn`), and handle direct route access (`/course/ai`, `/course/word`) gracefully according to course lifecycle state.

</domain>

<decisions>
## Implementation Decisions

### Frontpage Catalog Filtering & Empty State
- **D-01:** Implement `getPublicCoursesListFn` server function (`COURSE-MUTATE-03`) in `app/server/courseLifecycle.ts` which joins catalog data (`app/data/courses.ts`) with lifecycle store status (`app/server/courseLifecycleStore.ts`), returning only courses with status `'active'` for public catalog display. — **Reversibility:** costly — dependent public route loaders and UI components consume this contract.
- **D-02:** Server-side filter in `getCoursesList()` / loader so public SSR HTML never leaks hidden, archived, or deleted courses.
- **D-03:** Friendly Empty State Card in `WorkshopCatalog`: When all courses are hidden or archived, render an informative empty state card ("Belum ada workshop publik aktif saat ini") with a contact/support link.
- **D-04:** Category Filter Tabs: Keep all category tabs visible; if a user selects a category with 0 active courses, display a category-specific empty message ("Belum ada modul aktif di kategori ini").

### Header Course Switcher Sync
- **D-05:** Root Route Loader (`__root.tsx`) fetches public course status projections via `getPublicCourseStatusesFn` so `Header` and `CourseSwitcher` have synchronous SSR access via loader data/context without client waterfalls. — **Reversibility:** costly — root route loader data shapes global layout components.
- **D-06:** Shared `COURSE_NAV_REGISTRY` in `app/data/courses.ts`: Centralizes nav metadata (icon, path, title, lock badge, description) dynamically resolved against active course IDs.
- **D-07:** Direct Access State in Switcher: If a user is on a `hidden` course URL via direct access, the switcher button displays the current course title with an unlisted/direct indicator, and the dropdown menu displays active courses plus the current unlisted course marked with a direct access badge.
- **D-08:** Empty Switcher Behavior: If all courses are inactive/hidden, keep dropdown clickable with "Beranda Kursus" as active item and an informative disabled note ("Tidak ada workshop aktif saat ini").

### Direct URL Access & Inactive/Deleted Notice UI
- **D-09:** Dedicated Inactive Course Screen (`CourseUnavailableNotice` component): When a user accesses a direct URL for a `deleted` course (`/course/ai` or `/course/word`), render an informative notice explaining the workshop has been deactivated by administrators, with a link back to Beranda (`/`).
- **D-10:** Contextual Inactive Notice for `archived` courses: When a user accesses a direct URL for an `archived` course, render `CourseUnavailableNotice` with a specific 'Diarsipkan' state explaining that the workshop has concluded, with a link back to Beranda.
- **D-11:** Subtle Unlisted Banner: When a user directly visits a `hidden` course, render the workspace normally (preserving timing-safe passkey verification on `/course/word`), but show a discreet info pill/banner ('Workshop Akses Terbatas / Unlisted') indicating it is accessible via direct link.
- **D-12:** Route Loader Enforcement: Check lifecycle status in route loaders (`app/routes/course.ai.tsx` and `app/routes/course.word.tsx`), passing lifecycle status in `loaderData` so `CourseUnavailableNotice` renders on SSR with zero client flash.

### Cache Revalidation & Reactivity
- **D-13:** Mutation Invalidation: In `/admin`, after successful `adminUpdateCourseStatusFn`, call TanStack Router `router.invalidate()` to refetch active route loaders, and broadcast a `learnwith:course_status_changed` event via `BroadcastChannel`. — **Reversibility:** reversible — standard TanStack Router cache invalidation.
- **D-14:** Global Broadcast Listener in `__root.tsx`: Subscribe to `BroadcastChannel` at the root level in a `useEffect` to call `router.invalidate()` on any course status change across all browser tabs.
- **D-15:** Non-disruptive In-Flight Session Handling: If an admin deactivates a course while a participant is actively completing tasks, allow the current session to finish work, but display a subtle notice banner ("Status pelatihan telah diperbarui"); enforce the unavailable screen on full reload or route change.
- **D-16:** Comprehensive Test Strategy: Vitest integration tests for `getPublicCoursesListFn`, route loader projections, and `CourseUnavailableNotice` component states + automated tests verifying switcher/catalog reactive synchronization.

### the agent's Discretion
- Styling details of `CourseUnavailableNotice` and the unlisted banner adhering strictly to NotebookLM theme tokens and existing design system.
- Exact broadcast payload format for `BroadcastChannel` (`{ type: 'STATUS_UPDATED', courseId, targetStatus, timestamp }`).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements & Roadmap
- `.planning/REQUIREMENTS.md` §Category 3 & 4 — Requirements `COURSE-MUTATE-03`, `COURSE-SYNC-01`, `COURSE-SYNC-02`, `COURSE-SYNC-03`, `COURSE-TEST-01`, `COURSE-TEST-02`.
- `.planning/ROADMAP.md` §Phase 36 — Phase goal, requirements traceability, and success criteria.

### Lifecycle Architecture & Server Store
- `app/schemas/courseLifecycle.ts` — `CourseLifecycleStatus`, `PublicCourseStatusProjection`, and transition rules.
- `app/server/courseLifecycleStore.ts` — In-memory lifecycle store, `getPublicCourseStatusProjections()`, and `updateCourseLifecycleStatus()`.
- `app/server/courseLifecycle.ts` — `getPublicCourseStatusesFn` and `adminUpdateCourseStatusFn` server functions.

### Routing, Catalog & Navigation
- `app/routes/index.tsx` — Frontpage Hub route and loader calling `getCoursesList()`.
- `app/components/home/WorkshopCatalog.tsx` — Workshop cards rendering and category filtering.
- `app/routes/__root.tsx` — Root route document, global layout, and header mounting.
- `app/components/layout/Header.tsx` — App header component.
- `app/components/layout/CourseSwitcher.tsx` — Course switcher dropdown component.
- `app/routes/course.ai.tsx` — Agentic AI course workspace route.
- `app/routes/course.word.tsx` — Pengolahan Kata Lanjut course workspace route.
- `app/data/courses.ts` — Course metadata, catalog lists, and preloading functions.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `app/server/courseLifecycleStore.ts`: `getPublicCourseStatusProjections()` already projects `isDiscoverable` (`status === 'active'`) and `isAvailable` (`status === 'active' || status === 'hidden'`).
- `app/server/courseLifecycle.ts`: `getPublicCourseStatusesFn` server function already exists and returns `PublicCourseStatusProjection[]`.
- `app/components/home/WorkshopCatalog.tsx`: Already accepts `courses: CourseData[]` and `activeFilter: string`.
- `app/components/ui/NotFound.tsx`: Reference for clean status/notice screen layout in NotebookLM style.

### Established Patterns
- `createServerFn`: Used across `app/server/` for type-safe RPCs between client and server.
- `router.invalidate()`: Used in admin console to refresh loader data after mutations.
- `sessionStorage` / `localStorage` naming conventions: `learnwith_*`.

### Integration Points
- `app/server/courseLifecycle.ts`: Add `getPublicCoursesListFn` server function.
- `app/routes/index.tsx`: Loader calls `getPublicCoursesListFn` or updated `getCoursesList`.
- `app/routes/__root.tsx`: Loader retrieves public course projections for `Header` & `CourseSwitcher`.
- `app/components/layout/CourseSwitcher.tsx`: Dynamically renders active courses from root context instead of hardcoded list.
- `app/routes/course.ai.tsx` & `app/routes/course.word.tsx`: Check `isAvailable` in loader, render `CourseUnavailableNotice` if deleted or archived.

</code_context>

<specifics>
## Specific Ideas

- When a hidden course is visited directly, show a subtle pill badge in the header: `👁️‍🗨️ Akses Terbatas (Unlisted)` with high contrast and respectful tone.
- When an inactive/deleted course is accessed, render `CourseUnavailableNotice` with:
  - Icon: 🚫 (Deleted) or 📦 (Archived)
  - Title: "Pelatihan Tidak Tersedia" / "Pelatihan Telah Diarsipkan"
  - Description explaining the status
  - Primary button: "Kembali ke Beranda" linking to `/`

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed strictly within Phase 36 domain and scope boundaries.

</deferred>

---

*Phase: 36-Frontpage Catalog & Header Switcher Reactive Sync*
*Context gathered: 2026-09-10*