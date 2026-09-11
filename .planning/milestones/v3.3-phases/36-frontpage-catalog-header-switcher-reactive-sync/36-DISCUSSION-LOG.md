# Phase 36: Frontpage Catalog & Header Switcher Reactive Sync - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-09-10
**Phase:** 36-Frontpage Catalog & Header Switcher Reactive Sync
**Areas discussed:** Frontpage Catalog Filtering & Empty State, Header Course Switcher Sync, Direct URL Access & Inactive/Deleted Notice UI, Cache Revalidation & Reactivity

---

## Frontpage Catalog Filtering & Empty State

| Option | Description | Selected |
|--------|-------------|----------|
| Server-side filter in getCoursesList() | Only return courses with 'active' status so public SSR HTML never leaks hidden/archived courses | ✓ |
| Fetch all courses in loader and filter in component | Filter on client based on lifecycle projection | |
| Dedicated getPublicCoursesList() server function | Join catalog data with lifecycle store status | |

**User's choice:** Server-side filter in getCoursesList() — Only return courses with 'active' status so public SSR HTML never leaks hidden/archived courses

| Option | Description | Selected |
|--------|-------------|----------|
| Friendly Empty State Card | Show an informative card in WorkshopCatalog ("Belum ada workshop publik aktif saat ini") with refresh / contact link | ✓ |
| Minimal Alert Banner | Keep section header and render a subtle info banner | |
| Hide WorkshopCatalog Section | Suppress the catalog section entirely when no courses are active | |

**User's choice:** Friendly Empty State Card — Show an informative card in WorkshopCatalog ("Belum ada workshop publik aktif saat ini") with refresh / contact link

| Option | Description | Selected |
|--------|-------------|----------|
| Keep all category tabs | If user clicks a category with 0 active courses, display an informative empty state | ✓ |
| Dynamic tab filtering | Only show category tabs that have at least one active course | |
| Badge counters with disabled state | Show counts on tabs and disable any category with 0 active courses | |

**User's choice:** Keep all category tabs — If user clicks a category with 0 active courses, display an informative empty state ("Belum ada modul aktif di kategori ini")

| Option | Description | Selected |
|--------|-------------|----------|
| Dedicated server function getPublicCoursesListFn | Implement COURSE-MUTATE-03 server function that joins catalog data with lifecycle store status on the server | ✓ |
| Direct integration in getCoursesList() | Import lifecycle projections directly in app/data/courses.ts | |
| Dual-layer parameter passing | getCoursesList() takes optional status projection parameter | |

**User's choice:** Dedicated server function getPublicCoursesListFn — Implement COURSE-MUTATE-03 server function that joins catalog data with lifecycle store status on the server

---

## Header Course Switcher Sync

| Option | Description | Selected |
|--------|-------------|----------|
| Root Route Loader (__root.tsx) | Fetch public course status in the root loader so Header/CourseSwitcher has synchronous access via Route.useRouteContext() or useLoaderData() during SSR without client waterfalls | ✓ |
| Client-side hook in CourseSwitcher | Call getPublicCourseStatusesFn() inside an effect / TanStack Query | |
| Local cache with SWR hook | Read initial state from inline script/meta and background revalidate | |

**User's choice:** Root Route Loader (__root.tsx) — Fetch public course status in the root loader so Header/CourseSwitcher has synchronous access via Route.useRouteContext() or useLoaderData() during SSR without client waterfalls

| Option | Description | Selected |
|--------|-------------|----------|
| Contextual Current Item with Badge | Show current course title in the switcher button with an unlisted/direct indicator, and in dropdown show active courses plus the current active session marked with direct access badge | ✓ |
| Switcher button shows normally, dropdown strict | Dropdown strictly lists only active courses and Home | |
| Fallback switcher button to "Ruang Khusus" | Without exposing course metadata in switcher | |

**User's choice:** Contextual Current Item with Badge — Show current course title in the switcher button with an unlisted/direct indicator, and in dropdown show active courses plus the current active session marked with direct access badge

| Option | Description | Selected |
|--------|-------------|----------|
| Keep "Beranda Kursus" item | Keep dropdown clickable with "Beranda Kursus" and an informative disabled note ("Tidak ada workshop aktif saat ini") | ✓ |
| Disable dropdown button | Display "Beranda Kursus" in static/disabled pill style | |
| Hide CourseSwitcher container | Collapse the switcher area entirely | |

**User's choice:** Keep "Beranda Kursus" item — Keep dropdown clickable with "Beranda Kursus" and an informative disabled note ("Tidak ada workshop aktif saat ini")

| Option | Description | Selected |
|--------|-------------|----------|
| Shared COURSE_NAV_REGISTRY in courses.ts | Centralize course nav metadata (icon, path, title, lock badge, description) in app/data/courses.ts, populated dynamically based on active status list | ✓ |
| Directly enrich projections on server | Return icon and nav metadata directly from server projections | |
| Keep local icon dictionary | In CourseSwitcher.tsx | |

**User's choice:** Shared COURSE_NAV_REGISTRY in courses.ts — Centralize course nav metadata (icon, path, title, lock badge, description) in app/data/courses.ts, populated dynamically based on active status list

---

## Direct URL Access & Inactive/Deleted Notice UI

| Option | Description | Selected |
|--------|-------------|----------|
| Dedicated Inactive Course Screen | Render an informative notice component (CourseUnavailableNotice) explaining the workshop is inactive/archived with a link back to Beranda | ✓ |
| Instant redirect with Toast | Redirect user immediately to `/` and trigger a toast | |
| Trigger 404 Not Found | Throw notFound() so standard 404 component displays | |

**User's choice:** Dedicated Inactive Course Screen — Render an informative notice component (CourseUnavailableNotice) explaining the workshop is inactive/archived with a link back to Beranda

| Option | Description | Selected |
|--------|-------------|----------|
| Contextual Inactive Notice | Render CourseUnavailableNotice with specific 'Diarsipkan' state explaining the workshop has concluded, with link back to Beranda | ✓ |
| Read-only banner overlay | Allow viewing course modules but display a sticky top banner | |
| Redirect to home with toast | Redirect to home with toast | |

**User's choice:** Contextual Inactive Notice — Render CourseUnavailableNotice with specific 'Diarsipkan' state explaining the workshop has concluded, with link back to Beranda

| Option | Description | Selected |
|--------|-------------|----------|
| Subtle Unlisted Banner | Display a discreet info pill or banner ('Workshop Akses Terbatas / Unlisted') indicating it is accessible via direct link, with passkey prompt intact | ✓ |
| Standard experience | No extra banner, render exactly identical to active course | |
| Admin-only banner | Only display unlisted banner if session has admin auth | |

**User's choice:** Subtle Unlisted Banner — Display a discreet info pill or banner ('Workshop Akses Terbatas / Unlisted') indicating it is accessible via direct link, with passkey prompt intact

| Option | Description | Selected |
|--------|-------------|----------|
| Route Loader enforcement | Check status in route loader; pass lifecycle status in loaderData so CourseUnavailableNotice renders on SSR with zero client flash | ✓ |
| Route beforeLoad guard | Halt route loading in beforeLoad and throw redirect | |
| Client-side effect check | Let route render and check status via TanStack Query on mount | |

**User's choice:** Route Loader enforcement — Check status in route loader; pass lifecycle status in loaderData so CourseUnavailableNotice renders on SSR with zero client flash

---

## Cache Revalidation & Reactivity

| Option | Description | Selected |
|--------|-------------|----------|
| router.invalidate() + BroadcastChannel | Call router.invalidate() after successful mutation and broadcast 'learnwith:course_status_changed' for cross-tab reactivity | ✓ |
| TanStack router.invalidate() only | Rely strictly on TanStack Router's built-in router.invalidate() | |
| Optimistic client state + background revalidate | Update local UI optimistically, then trigger router.invalidate() | |

**User's choice:** router.invalidate() + BroadcastChannel — Call router.invalidate() after successful mutation and broadcast 'learnwith:course_status_changed' for cross-tab reactivity

| Option | Description | Selected |
|--------|-------------|----------|
| Global listener in __root.tsx | Subscribe to BroadcastChannel once at the root level to trigger router.invalidate() on any course status change across all browser tabs | ✓ |
| Route-level listeners in index.tsx and CourseSwitcher.tsx separately | Separate listeners per route | |
| Polling fallback | Poll every 60 seconds | |

**User's choice:** Global listener in __root.tsx — Subscribe to BroadcastChannel once at the root level to trigger router.invalidate() on any course status change across all browser tabs

| Option | Description | Selected |
|--------|-------------|----------|
| Non-disruptive banner | Allow current active session to finish work, but display a subtle notice banner ('Status pelatihan telah diperbarui'); enforce unavailable screen on full reload | ✓ |
| Immediate lockout | Immediately swap workspace to CourseUnavailableNotice | |
| Silent persistence | Only enforce on next navigation or reload | |

**User's choice:** Non-disruptive banner — Allow current active session to finish work, but display a subtle notice banner ('Status pelatihan telah diperbarui'); enforce unavailable screen on full reload

| Option | Description | Selected |
|--------|-------------|----------|
| Comprehensive Test Coverage | Vitest integration tests for getPublicCoursesListFn & component states + browser test verifying live switcher/catalog sync after mutation | ✓ |
| Vitest unit and RPC integration tests only | Fast, headless, server-store verification | |
| Component unit tests with mock server function responses | Unit tests only | |

**User's choice:** Comprehensive Test Coverage — Vitest integration tests for getPublicCoursesListFn & component states + browser test verifying live switcher/catalog sync after mutation

---

## the agent's Discretion

- Styling tokens for `CourseUnavailableNotice` and unlisted chip conforming to existing NotebookLM theme.
- Exact broadcast payload structure on `BroadcastChannel`.

## Deferred Ideas

None.