# Phase 36 Technical Research: Frontpage Catalog & Header Switcher Reactive Sync

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Implement `getPublicCoursesListFn` server function (`COURSE-MUTATE-03`) in `app/server/courseLifecycle.ts` which joins catalog data (`app/data/courses.ts`) with lifecycle store status (`app/server/courseLifecycleStore.ts`), returning only courses with status `'active'` for public catalog display. — **Reversibility:** costly — dependent public route loaders and UI components consume this contract.
- **D-02:** Server-side filter in `getCoursesList()` / loader so public SSR HTML never leaks hidden, archived, or deleted courses.
- **D-03:** Friendly Empty State Card in `WorkshopCatalog`: When all courses are hidden or archived, render an informative empty state card ("Belum ada workshop publik aktif saat ini") with a contact/support link.
- **D-04:** Category Filter Tabs: Keep all category tabs visible; if a user selects a category with 0 active courses, display a category-specific empty message ("Belum ada modul aktif di kategori ini").
- **D-05:** Root Route Loader (`__root.tsx`) fetches public course status projections via `getPublicCourseStatusesFn` so `Header` and `CourseSwitcher` have synchronous SSR access via loader data/context without client waterfalls. — **Reversibility:** costly — root route loader data shapes global layout components.
- **D-06:** Shared `COURSE_NAV_REGISTRY` in `app/data/courses.ts`: Centralizes nav metadata (icon, path, title, lock badge, description) dynamically resolved against active course IDs.
- **D-07:** Direct Access State in Switcher: If a user is on a `hidden` course URL via direct access, the switcher button displays the current course title with an unlisted/direct indicator, and the dropdown menu displays active courses plus the current unlisted course marked with a direct access badge.
- **D-08:** Empty Switcher Behavior: If all courses are inactive/hidden, keep dropdown clickable with "Beranda Kursus" as active item and an informative disabled note ("Tidak ada workshop aktif saat ini").
- **D-09:** Dedicated Inactive Course Screen (`CourseUnavailableNotice` component): When a user accesses a direct URL for a `deleted` course (`/course/ai` or `/course/word`), render an informative notice explaining the workshop has been deactivated by administrators, with a link back to Beranda (`/`).
- **D-10:** Contextual Inactive Notice for `archived` courses: When a user accesses a direct URL for an `archived` course, render `CourseUnavailableNotice` with a specific 'Diarsipkan' state explaining that the workshop has concluded, with a link back to Beranda.
- **D-11:** Subtle Unlisted Banner: When a user directly visits a `hidden` course, render the workspace normally (preserving timing-safe passkey verification on `/course/word`), but show a discreet info pill/banner ('Workshop Akses Terbatas / Unlisted') indicating it is accessible via direct link.
- **D-12:** Route Loader Enforcement: Check lifecycle status in route loaders (`app/routes/course.ai.tsx` and `app/routes/course.word.tsx`), passing lifecycle status in `loaderData` so `CourseUnavailableNotice` renders on SSR with zero client flash.
- **D-13:** Mutation Invalidation: In `/admin`, after successful `adminUpdateCourseStatusFn`, call TanStack Router `router.invalidate()` to refetch active route loaders, and broadcast a `learnwith:course_status_changed` event via `BroadcastChannel`. — **Reversibility:** reversible — standard TanStack Router cache invalidation.
- **D-14:** Global Broadcast Listener in `__root.tsx`: Subscribe to `BroadcastChannel` at the root level in a `useEffect` to call `router.invalidate()` on any course status change across all browser tabs.
- **D-15:** Non-disruptive In-Flight Session Handling: If an admin deactivates a course while a participant is actively completing tasks, allow the current session to finish work, but display a subtle notice banner ("Status pelatihan telah diperbarui"); enforce the unavailable screen on full reload or route change.
- **D-16:** Comprehensive Test Strategy: Vitest integration tests for `getPublicCoursesListFn`, route loader projections, and `CourseUnavailableNotice` component states + automated tests verifying switcher/catalog reactive synchronization.

### the agent's Discretion
- Styling details of `CourseUnavailableNotice` and the unlisted banner adhering strictly to NotebookLM theme tokens and existing design system.
- Exact broadcast payload format for `BroadcastChannel` (`{ type: 'STATUS_UPDATED', courseId, targetStatus, timestamp }`).

### Deferred Ideas
- None — discussion stayed strictly within Phase 36 domain and scope boundaries.
</user_constraints>

<phase_requirements>
## Phase Requirements

| Requirement ID | Description | Implementation Strategy & Research Support |
|---|---|---|
| **COURSE-MUTATE-03** | Public server function or loader `getPublicCoursesListFn` projects only non-deleted, non-archived courses for public consumption, excluding hidden courses from public listings while keeping them reachable via direct route. | Implement `getPublicCoursesListFn` in `app/server/courseLifecycle.ts` using `createServerFn({ method: 'GET' })`. It retrieves full `CourseData[]` from `app/data/courses.ts`, correlates with lifecycle store records via `getCourseLifecycleRecords()`, and strictly filters out all records where `status !== 'active'`. Public SSR route loader in `app/routes/index.tsx` consumes this function to ensure zero data leakage. |
| **COURSE-SYNC-01** | Frontpage Hub (`/`) reactively filters workshop cards: displays only `active` courses; omits `hidden`, `archived`, and `deleted` courses. | `app/routes/index.tsx` SSR loader supplies filtered active courses from `getPublicCoursesListFn`. `WorkshopCatalog.tsx` renders active workshop cards, an informative empty state card ("Belum ada workshop publik aktif saat ini") when no active courses exist, and category-level empty states when a filtered tab has 0 active courses. Invalidation occurs automatically on route refresh or broadcast trigger. |
| **COURSE-SYNC-02** | Global header course dropdown / course switcher displays only `active` courses for normal navigation. | `app/routes/__root.tsx` loader calls `getPublicCourseStatusesFn` to provide public status projections down through `Header` and `CourseSwitcher`. `CourseSwitcher.tsx` consumes `COURSE_NAV_REGISTRY` in `app/data/courses.ts`, resolving menu items against active statuses. If user is currently visiting a `hidden` course directly, display the current course with an unlisted badge in switcher and menu (D-07). If all courses are inactive, display "Beranda Kursus" with disabled note (D-08). |
| **COURSE-SYNC-03** | Direct workspace access (`/course/ai`, `/course/word`) for `hidden` courses remains functional when accessed directly (with passkey requirement intact if applicable), while `deleted` courses render an informative inactive/archived notice. | Route loaders in `app/routes/course.ai.tsx` and `app/routes/course.word.tsx` query lifecycle status via `getPublicCourseStatusesFn` or store lookup. If `status === 'deleted'`, render `CourseUnavailableNotice` (`status="deleted"`). If `status === 'archived'`, render `CourseUnavailableNotice` (`status="archived"`). If `status === 'hidden'`, render workspace normally (passkey gate preserved on `/course/word`) with a subtle unlisted banner pill (`UnlistedCourseBanner`). If status transitions while session is in-flight, preserve active workspace and display non-disruptive notice banner (D-15). |
</phase_requirements>

---

## Summary of Findings

Phase 36 completes the reactive bridge connecting administrator visibility mutations (Phases 34 and 35) to the public frontpage catalog, the global header course switcher, and direct route endpoints.

### Key Insights:
1. **Server Function & Data Flow**:
   - `app/server/courseLifecycle.ts` currently exports `getPublicCourseStatusesFn` (returning `PublicCourseStatusProjection[]` containing `id`, `status`, `isDiscoverable`, `isAvailable`).
   - We must add `getPublicCoursesListFn` [VERIFIED: app/server/courseLifecycle.ts:1-77, 36-CONTEXT.md:17] which joins `getCoursesList()` (`CourseData[]`) with store status records, filtering strictly for `status === 'active'`.
   - In `app/routes/index.tsx`, the route loader must invoke `getPublicCoursesListFn()` instead of bare static `getCoursesList()`, guaranteeing that SSR-rendered HTML never exposes hidden, archived, or soft-deleted workshops to search engines or public visitors.

2. **Root Layout & Navigation Synchronization**:
   - Currently, `app/routes/__root.tsx` has NO loader [VERIFIED: app/routes/__root.tsx:14-37]. Global layout components (`Header`, `CourseSwitcher`) currently have hardcoded static links to `/course/ai` and `/course/word` [VERIFIED: app/components/layout/CourseSwitcher.tsx:58-87].
   - By adding a `loader` in `createRootRoute` that invokes `getPublicCourseStatusesFn()`, the root route SSR passes `courseStatuses: PublicCourseStatusProjection[]` to `Header` and `CourseSwitcher` with zero waterfall delays.
   - Centralizing nav metadata in `COURSE_NAV_REGISTRY` in `app/data/courses.ts` decouples presentation details (icon, path, title, lock badge, description) from runtime component logic.

3. **Reactivity & Cross-Tab Cache Invalidation**:
   - When an admin mutates course status in `/admin` (via `adminUpdateCourseStatusFn`), calling `router.invalidate()` immediately refetches all active loaders in the current window [VERIFIED: 36-CONTEXT.md:35].
   - Standard browser `BroadcastChannel` with topic `'learnwith:course_status_changed'` broadcasts `{ type: 'STATUS_UPDATED', courseId, targetStatus, timestamp }`. A root listener in `__root.tsx` triggers `router.invalidate()` on all open browser tabs [VERIFIED: 36-CONTEXT.md:36].

4. **Direct Route Access & Inactive Screen UX**:
   - Routes `app/routes/course.ai.tsx` and `app/routes/course.word.tsx` can check lifecycle status during route loading.
   - For `deleted` or `archived` states, the route renders a dedicated `CourseUnavailableNotice` component (styled with the NotebookLM frosted card pattern established in `NotFound.tsx`).
   - For `hidden` courses, direct access is permitted, maintaining full workshop functionality and passkey gate verification on `/course/word`, while displaying a subtle `UnlistedCourseBanner` (`Akses Terbatas / Unlisted`).
   - In-flight session safety (D-15) prevents jarring UI teardown mid-task by checking whether the status transition occurred after the component had already mounted, showing a soft advisory banner instead of unmounting the workspace.

---

## Architectural Responsibility Map

| Component / Layer | Location | Primary Responsibility |
|---|---|---|
| **Public Course List RPC** | `app/server/courseLifecycle.ts` | Exports `getPublicCoursesListFn` (`COURSE-MUTATE-03`) which merges `getCoursesList()` with `getCourseLifecycleRecords()`, returning only `status === 'active'` courses. [VERIFIED: app/server/courseLifecycle.ts] |
| **Course Nav Registry** | `app/data/courses.ts` | Centralizes `COURSE_NAV_REGISTRY` with icons, titles, paths, and lock status for dynamic resolution in switchers and nav bars. [VERIFIED: app/data/courses.ts] |
| **Frontpage Route Loader** | `app/routes/index.tsx` | Calls `getPublicCoursesListFn()` during SSR / client transition to feed active courses to `WorkshopCatalog`. [VERIFIED: app/routes/index.tsx] |
| **Workshop Catalog UI** | `app/components/home/WorkshopCatalog.tsx` | Renders active course cards, friendly empty state when 0 active courses exist (D-03), and category-specific empty state when filter tab has 0 active courses (D-04). [VERIFIED: app/components/home/WorkshopCatalog.tsx] |
| **Root Route Loader & Broadcast Listener** | `app/routes/__root.tsx` | Root loader fetches `getPublicCourseStatusesFn()`. Subscribes to `BroadcastChannel` (`learnwith:course_status_changed`) to trigger `router.invalidate()` on cross-tab events (D-05, D-14). [VERIFIED: app/routes/__root.tsx] |
| **Header Layout** | `app/components/layout/Header.tsx` | Receives public course status projections and supplies them to `CourseSwitcher`. [VERIFIED: app/components/layout/Header.tsx] |
| **Course Switcher Dropdown** | `app/components/layout/CourseSwitcher.tsx` | Dynamically displays active courses from `COURSE_NAV_REGISTRY`. Handles direct unlisted badge on hidden courses (D-07) and disabled empty state note (D-08). [VERIFIED: app/components/layout/CourseSwitcher.tsx] |
| **AI Course Route** | `app/routes/course.ai.tsx` | Enforces lifecycle status in loader. Renders `CourseUnavailableNotice` for deleted/archived, `UnlistedCourseBanner` for hidden, and in-flight non-disruptive banner (D-09, D-10, D-11, D-15). [VERIFIED: app/routes/course.ai.tsx] |
| **Word Course Route** | `app/routes/course.word.tsx` | Enforces lifecycle status in loader while keeping timing-safe passkey unlock intact for hidden courses. Renders `CourseUnavailableNotice` for deleted/archived (COURSE-SYNC-03). [VERIFIED: app/routes/course.word.tsx] |
| **Unavailable Notice Screen** | `app/components/course/CourseUnavailableNotice.tsx` | Shared accessible NotebookLM notice screen for deleted and archived course states with link to Beranda (`/`). [VERIFIED: app/components/ui/NotFound.tsx] |
| **Unlisted Notice Banner** | `app/components/course/UnlistedCourseBanner.tsx` | Non-intrusive banner/pill alerting participants that current workshop is unlisted/restricted access. |
| **Admin View Invalidation** | `app/components/admin/courses/AdminCourseManagementView.tsx` | Calls `router.invalidate()` and broadcasts `learnwith:course_status_changed` event upon successful mutation (D-13). [VERIFIED: app/components/admin/courses/AdminCourseManagementView.tsx] |

---

## Standard Stack & Architecture Patterns

### 1. TanStack Start Server Function (`createServerFn`)
- Server functions are declared using `createServerFn({ method: 'GET' | 'POST' })` from `@tanstack/react-start` [VERIFIED: package.json:20, app/server/courseLifecycle.ts:1].
- When invoked inside route loaders during SSR, TanStack Start invokes the handler directly on the server without creating an HTTP fetch overhead.
- When invoked in client transitions or after `router.invalidate()`, it executes an automated type-safe RPC request.

```ts
// Pattern for getPublicCoursesListFn in app/server/courseLifecycle.ts
export const getPublicCoursesListFn = createServerFn({ method: 'GET' }).handler(
  async (): Promise<CourseData[]> => {
    const fullList = await getCoursesList()
    const records = getCourseLifecycleRecords()
    const statusMap = new Map(records.map((r) => [r.id, r.status]))

    return fullList.filter((course) => {
      const status = statusMap.get(course.id) ?? 'active'
      return status === 'active'
    })
  },
)
```

### 2. Root Loader in TanStack Router
- In `app/routes/__root.tsx`:
```tsx
export const Route = createRootRoute({
  loader: async () => {
    const courseStatuses = await getPublicCourseStatusesFn()
    return { courseStatuses }
  },
  ...
```
- In `RootComponent()`:
```tsx
const { courseStatuses } = Route.useLoaderData()
```
- Prop drilling `courseStatuses` from `RootComponent` to `<Header courseStatuses={courseStatuses} />` and into `<CourseSwitcher courseStatuses={courseStatuses} />` eliminates client-side waterfalls, guarantees instant synchronous SSR rendering, and provides frictionless unit-testing without requiring complex TanStack Router context mocks.

### 3. Cross-Tab Reactivity via `BroadcastChannel`
- Modern browsers support `BroadcastChannel` natively [VERIFIED: caniuse.com/broadcastchannel - CITED: developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel].
- In `app/components/admin/courses/AdminCourseManagementView.tsx` (or a helper `broadcastCourseStatusChange`):
```ts
export function broadcastCourseStatusChange(courseId: string, targetStatus: string) {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    try {
      const channel = new BroadcastChannel('learnwith:course_status_changed')
      channel.postMessage({
        type: 'STATUS_UPDATED',
        courseId,
        targetStatus,
        timestamp: Date.now(),
      })
      channel.close()
    } catch {
      // Graceful fallback if BroadcastChannel is blocked
    }
  }
}
```
- In `app/routes/__root.tsx`:
```tsx
const router = useRouter()
useEffect(() => {
  if (typeof window === 'undefined' || !('BroadcastChannel' in window)) return
  const channel = new BroadcastChannel('learnwith:course_status_changed')
  channel.onmessage = (event) => {
    if (event.data?.type === 'STATUS_UPDATED') {
      router.invalidate()
    }
  }
  return () => {
    channel.close()
  }
}, [router])
```

### 4. Navigation Registry Pattern
- Centralized dictionary in `app/data/courses.ts`:
```ts
export interface CourseNavItem {
  id: string
  title: string
  shortTitle?: string
  desc: string
  icon: string
  path: string
  searchParams?: Record<string, unknown>
  isLocked?: boolean
}

export const COURSE_NAV_REGISTRY: Record<string, CourseNavItem> = {
  ai: {
    id: 'ai',
    title: 'Hands-on Agentic AI',
    desc: 'Hermes Agent & 9Router',
    icon: '🤖',
    path: '/course/ai',
    searchParams: { mode: 'pretraining' },
    isLocked: false,
  },
  word: {
    id: 'word',
    title: 'Pengolahan Kata Lanjut',
    desc: 'Modul Praktik ASN (Styles, TOC, Merge)',
    icon: '📝',
    path: '/course/word',
    searchParams: {},
    isLocked: true,
  },
}
```
- Dynamic resolution in `CourseSwitcher.tsx`:
  - Iterates over `COURSE_NAV_REGISTRY`.
  - Determines if course is active in `courseStatuses`.
  - If user is on a `hidden` course route directly (e.g. `/course/ai` and `ai` is hidden), includes that item with a special `badge-pill` ("Akses Terbatas") (D-07).
  - If 0 active courses exist, renders disabled item "Tidak ada workshop aktif saat ini" (D-08).

### 5. In-Flight Session Safety Pattern (D-15)
- When a user is working inside `/course/ai` or `/course/word`, an admin deactivation event should NOT destroy their unsaved work or current checklist state in real-time.
- Technique:
```tsx
const { lifecycleStatus } = Route.useLoaderData()
const initialStatusRef = useRef(lifecycleStatus)
const [isInFlightChanged, setIsInFlightChanged] = useState(false)

useEffect(() => {
  if (
    (initialStatusRef.current === 'active' || initialStatusRef.current === 'hidden') &&
    (lifecycleStatus === 'deleted' || lifecycleStatus === 'archived')
  ) {
    setIsInFlightChanged(true)
  }
}, [lifecycleStatus])
```
- If `initialStatusRef.current === 'deleted' | 'archived'`, render `CourseUnavailableNotice` immediately on load.
- If `isInFlightChanged === true`, keep the workspace rendered, but show a floating notification banner:
  > "⚠️ Status kursus telah diperbarui oleh administrator. Anda dapat menyelesaikan pekerjaan sesi ini, namun pendaftaran dan akses baru telah ditutup."
- Full reload or route navigation will then naturally enforce `CourseUnavailableNotice`.

---

## Validation Architecture

### Test Framework & Environment
- **Node Test Runner**: Node v22 native test runner (`node --test`) using `node:test` and `node:assert/strict` [VERIFIED: package.json:11-12, tests/course-lifecycle-admin-ui.test.js:1-10].
- **Executable Location**: `C:\nvm4w\nodejs\node.exe` (Node v22.22.3) [VERIFIED: CLI check:1-5].
- **TypeScript Compiler**: `tsc --noEmit` [VERIFIED: package.json:10].

### Primary Verification Commands
```powershell
# 1. Run all Course Lifecycle Test Suites (Node test runner)
& "C:\nvm4w\nodejs\node.exe" --test tests/course-lifecycle-*.test.js

# 2. Run new Phase 36 Reactive Sync Test Suite
& "C:\nvm4w\nodejs\node.exe" --test tests/course-lifecycle-sync.test.js

# 3. TypeScript Typecheck
$env:PATH = "C:\nvm4w\nodejs;" + $env:PATH; & "C:\nvm4w\nodejs\npm.cmd" run typecheck

# 4. Full Regression Test Suite (All 32 test files)
$env:PATH = "C:\nvm4w\nodejs;" + $env:PATH; & "C:\nvm4w\nodejs\node.exe" --test tests/*.test.js
```

### Phase Requirements -> Test Map

| Requirement ID | Test Case | Target Test File | Assertion / Verification Target |
|---|---|---|---|
| **COURSE-MUTATE-03** | `getPublicCoursesListFn` returns only active courses | `tests/course-lifecycle-sync.test.js` | Mutate `ai` to `hidden`, `getPublicCoursesListFn()` returns only `[word]`. Mutate `word` to `deleted`, returns `[]`. Reset to active, returns `[ai, word]`. |
| **COURSE-SYNC-01** | `WorkshopCatalog` filtering & empty states | `tests/course-lifecycle-sync.test.js` | With 0 active courses, renders card with id `catalog-empty-state` ("Belum ada workshop publik aktif saat ini"). With filter `ai` and 0 ai courses, renders category empty message (`catalog-category-empty`). |
| **COURSE-SYNC-02** | `CourseSwitcher` dynamic nav items & badges | `tests/course-lifecycle-sync.test.js` | With `ai` hidden, dropdown omits `ai` on home page. When direct on `/course/ai`, dropdown displays unlisted badge `[Akses Terbatas]`. When all inactive, renders `course-dropdown-empty-note`. |
| **COURSE-SYNC-03** | Direct access to hidden vs deleted courses | `tests/course-lifecycle-sync.test.js` | Direct visit to `hidden` course renders workspace + `unlisted-course-banner`. Direct visit to `deleted` course renders `CourseUnavailableNotice` (`#course-unavailable-deleted`). Direct visit to `archived` course renders `#course-unavailable-archived`. |
| **CSS Consistency** | CSS token and stylesheet mirror verification | `tests/course-lifecycle-sync.test.js` | Verify `assets/css/*.css` is 100% identical to `public/assets/css/*.css` for modified stylesheets (`components.css`, `homepage.css`). |

### Wave 0 Gaps Identified
- Currently, `tests/course-lifecycle-sync.test.js` does NOT exist yet. It must be authored as Wave 0 to establish the test barrier before refactoring route loaders and UI components.
- `app/routes/__root.tsx` currently has no loader function; adding one requires ensuring error boundaries and 404 routes handle empty or undefined loader contexts gracefully without throwing unhandled exceptions.

---

## Security Domain

1. **Information Leakage Prevention**:
   - Private or soft-deleted course curricula must NEVER be transmitted over the wire to unauthenticated clients visiting `/`.
   - `getPublicCoursesListFn` acts as a server-side perimeter barrier: any courses in `hidden`, `archived`, or `deleted` state are pruned before serialize-and-send [VERIFIED: 36-CONTEXT.md:17-18].
2. **Access Control Integrity on Direct URLs**:
   - `COURSE-SYNC-03` guarantees that `/course/word` preserves its timing-safe passkey verification gate [VERIFIED: app/routes/course.word.tsx:37-45, app/server/passkey.ts] regardless of whether its lifecycle state is `active` or `hidden`.
3. **Audit Trail Immutability**:
   - Status transitions continue to increment `storeVersion` and record immutable audit entries in `courseLifecycleStore.ts` with the operator ID [VERIFIED: app/server/courseLifecycleStore.ts:94-102].
4. **CSS Mirroring Compliance**:
   - All modified stylesheets in `assets/css/` must be mirrored 1:1 to `public/assets/css/` to prevent styling drift in production or containerized environments [VERIFIED: tests/admin-auth.test.js:330-341].

---

## Metadata
- **Confidence**: HIGH
- **Phase Target**: 36 - Frontpage Catalog & Header Switcher Reactive Sync
- **Key Files Verified**:
  - `app/schemas/courseLifecycle.ts`
  - `app/server/courseLifecycleStore.ts`
  - `app/server/courseLifecycle.ts`
  - `app/data/courses.ts`
  - `app/routes/index.tsx`
  - `app/components/home/WorkshopCatalog.tsx`
  - `app/routes/__root.tsx`
  - `app/components/layout/Header.tsx`
  - `app/components/layout/CourseSwitcher.tsx`
  - `app/routes/course.ai.tsx`
  - `app/routes/course.word.tsx`
  - `app/components/ui/NotFound.tsx`
  - `app/components/admin/courses/AdminCourseManagementView.tsx`
  - `package.json`
