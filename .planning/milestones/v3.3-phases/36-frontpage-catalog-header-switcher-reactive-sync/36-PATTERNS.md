# Phase 36: Frontpage Catalog & Header Switcher Reactive Sync - Pattern Map

## File Classification

| Target File | Action | Role | Data Flow | Closest Analog |
|---|---|---|---|---|
| `app/server/courseLifecycle.ts` | Modify | Server / RPC | Reads lifecycle store + `getCoursesList()`, filters `status === 'active'` -> returns `CourseData[]` | `app/server/courseLifecycle.ts` (`getPublicCourseStatusesFn`) |
| `app/data/courses.ts` | Modify | Data / Config | Static metadata & registry definitions -> consumed by loaders & navigation components | `app/data/courses.ts` (`CourseData`, `getCoursesList`) |
| `app/routes/index.tsx` | Modify | Route | SSR/Client loader calls `getPublicCoursesListFn()` -> passes active `CourseData[]` to `WorkshopCatalog` | `app/routes/index.tsx` |
| `app/components/home/WorkshopCatalog.tsx` | Modify | Component | Props: `courses: CourseData[]`, `activeFilter` -> renders active course cards or friendly empty state | `app/components/home/WorkshopCatalog.tsx` |
| `app/routes/__root.tsx` | Modify | Route / Layout | Root loader fetches `getPublicCourseStatusesFn()`, listens to `BroadcastChannel` -> supplies `courseStatuses` to `Header` | `app/routes/__root.tsx` |
| `app/components/layout/Header.tsx` | Modify | Component / Layout | Props: `courseStatuses?: PublicCourseStatusProjection[]` -> passes to `CourseSwitcher` | `app/components/layout/Header.tsx` |
| `app/components/layout/CourseSwitcher.tsx` | Modify | Component / Nav | Consumes `courseStatuses` + `useRouterState` -> resolves items against `COURSE_NAV_REGISTRY`, shows unlisted badge or empty note | `app/components/layout/CourseSwitcher.tsx` |
| `app/components/course/CourseUnavailableNotice.tsx` | Create | Component / UI Screen | Props: `status: 'deleted' \| 'archived'`, `courseId: string` -> renders accessible NotebookLM notice screen with return CTA | `app/components/ui/NotFound.tsx` |
| `app/components/course/UnlistedCourseBanner.tsx` | Create | Component / UI Alert | Props: `courseId: string`, `isInFlight?: boolean` -> renders unlisted pill badge or non-disruptive session alert banner | `app/components/layout/GlobalAnnouncementBanner.tsx` |
| `app/routes/course.ai.tsx` | Modify | Route | Loader queries `getPublicCourseStatusesFn()`, component renders `CourseUnavailableNotice`, `UnlistedCourseBanner`, or workspace | `app/routes/course.ai.tsx` |
| `app/routes/course.word.tsx` | Modify | Route | Loader queries `getPublicCourseStatusesFn()`, preserves passkey modal for hidden, renders notice or unlisted banner | `app/routes/course.word.tsx` |
| `app/utils/courseBroadcast.ts` | Create | Utility | Dispatches `learnwith:course_status_changed` payload via browser `BroadcastChannel` | `app/utils/adminToken.ts` |
| `app/components/admin/courses/AdminCourseManagementView.tsx` | Modify | Component / Admin View | On successful status mutation -> calls `router.invalidate()` + `broadcastCourseStatusChange()` | `app/components/admin/courses/AdminCourseManagementView.tsx` |
| `tests/course-lifecycle-sync.test.js` | Create | Test | Tests `getPublicCoursesListFn`, route loader data flows, catalog empty states, switcher items, and notice screens | `tests/course-lifecycle-admin-ui.test.js` |
| `assets/css/components.css` & `public/assets/css/components.css` | Modify | Config / Stylesheet | CSS rules and design tokens for unavailable screens, unlisted banners, and empty state cards | `assets/css/components.css` |

---

## Pattern Assignments

### 1. `app/server/courseLifecycle.ts` (RPC Server Function)
- **Role:** Server / RPC (`COURSE-MUTATE-03`)
- **Closest Analog:** `app/server/courseLifecycle.ts` (`getPublicCourseStatusesFn` at lines 23-27)

#### Concrete Excerpts:
```ts
// Analog: app/server/courseLifecycle.ts:23-27
export const getPublicCourseStatusesFn = createServerFn({ method: 'GET' }).handler(
  async (): Promise<PublicCourseStatusProjection[]> => {
    return getPublicCourseStatusProjections()
  },
)
```

#### Adaptation:
Add `getPublicCoursesListFn` using `createServerFn({ method: 'GET' })`. It queries `getCoursesList()` and `getCourseLifecycleRecords()`, correlates each course with its status, and strictly filters `status === 'active'`:
```ts
import { getCoursesList, type CourseData } from '../data/courses.ts'

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

---

### 2. `app/data/courses.ts` (Navigation Registry)
- **Role:** Data / Navigation Config (`COURSE-SYNC-02`, D-06)
- **Closest Analog:** `app/data/courses.ts` (`CourseData` model & static records at lines 19-35, 170-205)

#### Concrete Excerpts:
```ts
// Analog: app/data/courses.ts:19-29
export interface CourseData {
  id: string
  title: string
  subtitle: string
  description: string
  category: 'ai' | 'word'
  badge: string
  modulesCount: number
  checkpointsCount: number
  modules: CourseModule[]
  sessionMode?: string
}
```

#### Adaptation:
Define and export `CourseNavItem` interface and `COURSE_NAV_REGISTRY` mapping course IDs to their display metadata:
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

---

### 3. `app/routes/index.tsx` (Frontpage Hub Route)
- **Role:** Route / SSR Loader (`COURSE-SYNC-01`, D-01, D-02)
- **Closest Analog:** `app/routes/index.tsx` (lines 13-18)

#### Concrete Excerpts:
```tsx
// Analog: app/routes/index.tsx:13-18
export const Route = createFileRoute('/')({
  validateSearch: (search) => homeSearchSchema.parse(search),
  loader: async () => {
    const courses = await getCoursesList()
    return { courses }
  },
  ...
```

#### Adaptation:
Replace the direct static `getCoursesList()` call in `loader` with `getPublicCoursesListFn()`:
```tsx
import { getPublicCoursesListFn } from '@/server/courseLifecycle'

export const Route = createFileRoute('/')({
  validateSearch: (search) => homeSearchSchema.parse(search),
  loader: async () => {
    const courses = await getPublicCoursesListFn()
    return { courses }
  },
  head: () => ({
    // existing meta tags preserved
  }),
  component: HomeComponent,
})
```
This guarantees zero private or soft-deleted course data leaks into the public SSR HTML.

---

### 4. `app/components/home/WorkshopCatalog.tsx` (Catalog UI & Empty States)
- **Role:** Component / Catalog Grid (`COURSE-SYNC-01`, D-03, D-04)
- **Closest Analog:** `app/components/home/WorkshopCatalog.tsx` (lines 19-33, 74-149)

#### Concrete Excerpts:
```tsx
// Analog: app/components/home/WorkshopCatalog.tsx:19-24
export function WorkshopCatalog({ courses, activeFilter }: WorkshopCatalogProps) {
  const filteredCourses = courses.filter((c) => {
    if (activeFilter === 'all') return true
    return c.category === activeFilter
  })
```

#### Adaptation:
Add friendly empty state card when `courses.length === 0` (D-03) and category empty message when `courses.length > 0 && filteredCourses.length === 0` (D-04):
```tsx
      {/* Cards Grid or Empty States */}
      {courses.length === 0 ? (
        <div className="card catalog-empty-state-card" id="catalog-empty-state">
          <div className="empty-state-icon">📦</div>
          <h3 className="empty-state-title">Belum Ada Workshop Publik Aktif Saat Ini</h3>
          <p className="empty-state-desc">
            Semua modul pelatihan saat ini sedang dalam masa pemeliharaan kurikulum atau diarsipkan. Hubungi administrator jika Anda memerlukan akses khusus.
          </p>
          <a href="mailto:support@learnwith.id" className="btn btn-secondary empty-state-cta">
            Hubungi Tim Pelatihan
          </a>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="catalog-category-empty" id="catalog-category-empty">
          <p>Belum ada modul aktif di kategori ini. Silakan pilih tab "Semua Workshop" untuk melihat jalur belajar lainnya.</p>
        </div>
      ) : (
        <div className="catalog-cards-grid">
          {filteredCourses.map((course) => {
            // existing card rendering
          })}
        </div>
      )}
```

---

### 5. `app/routes/__root.tsx` (Root Route & Cross-Tab Reactivity)
- **Role:** Route / Global Layout (`COURSE-SYNC-02`, D-05, D-14)
- **Closest Analog:** `app/routes/__root.tsx` (lines 14-65)

#### Concrete Excerpts:
```tsx
// Analog: app/routes/__root.tsx:14-16, 39-64
export const Route = createRootRoute({
  head: () => ({ ... }),
  notFoundComponent: NotFound,
  errorComponent: RouteErrorBoundary,
  component: RootComponent,
})

function RootComponent() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  ...
  return (
    <RootDocument>
      ...
      <div className={`app-container ...`}>
        <Header />
        <Outlet />
      </div>
    </RootDocument>
  )
}
```

#### Adaptation:
Add `loader` calling `getPublicCourseStatusesFn()`, subscribe to `BroadcastChannel('learnwith:course_status_changed')` in `RootComponent` to invoke `router.invalidate()`, and pass `courseStatuses` to `<Header />`:
```tsx
import { useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'
import { getPublicCourseStatusesFn } from '@/server/courseLifecycle'
import type { PublicCourseStatusProjection } from '@/schemas/courseLifecycle'

export const Route = createRootRoute({
  loader: async (): Promise<{ courseStatuses: PublicCourseStatusProjection[] }> => {
    try {
      const courseStatuses = await getPublicCourseStatusesFn()
      return { courseStatuses }
    } catch {
      return { courseStatuses: [] }
    }
  },
  head: () => ({ ... }),
  notFoundComponent: NotFound,
  errorComponent: RouteErrorBoundary,
  component: RootComponent,
})

function RootComponent() {
  const router = useRouter()
  const loaderData = Route.useLoaderData()
  const courseStatuses = loaderData?.courseStatuses ?? []

  // Global cross-tab reactivity via BroadcastChannel (D-14)
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

  return (
    <RootDocument>
      ...
      <div className={`app-container ...`}>
        <Header courseStatuses={courseStatuses} />
        <Outlet />
      </div>
    </RootDocument>
  )
}
```

---

### 6. `app/components/layout/Header.tsx` (Header Container)
- **Role:** Component / Layout (`COURSE-SYNC-02`, D-05)
- **Closest Analog:** `app/components/layout/Header.tsx` (lines 5-8, 71-73)

#### Concrete Excerpts:
```tsx
// Analog: app/components/layout/Header.tsx:5-8, 71-73
export function Header() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  ...
        {/* Course Switcher Component */}
        <CourseSwitcher />
```

#### Adaptation:
Accept optional `courseStatuses?: PublicCourseStatusProjection[]` prop and pass to `<CourseSwitcher courseStatuses={courseStatuses} />`:
```tsx
import type { PublicCourseStatusProjection } from '@/schemas/courseLifecycle'

interface HeaderProps {
  courseStatuses?: PublicCourseStatusProjection[]
}

export function Header({ courseStatuses }: HeaderProps = {}) {
  // ...
  return (
    <header className="app-header">
      {/* ... */}
      <CourseSwitcher courseStatuses={courseStatuses} />
      {/* ... */}
    </header>
  )
}
```

---

### 7. `app/components/layout/CourseSwitcher.tsx` (Course Switcher Dropdown)
- **Role:** Component / Nav (`COURSE-SYNC-02`, D-06, D-07, D-08)
- **Closest Analog:** `app/components/layout/CourseSwitcher.tsx` (lines 4-38, 58-88)

#### Concrete Excerpts:
```tsx
// Analog: app/components/layout/CourseSwitcher.tsx:10-23
  const isHome = pathname === '/'
  const isAi = pathname.startsWith('/course/ai')
  const isWord = pathname.startsWith('/course/word')

  let currentIcon = '🏠'
  let currentName = 'Beranda Kursus'

  if (isAi) {
    currentIcon = '🤖'
    currentName = 'Hands-on Agentic AI'
  } else if (isWord) {
    currentIcon = '📝'
    currentName = 'Pengolahan Kata Lanjut'
  }
```

#### Adaptation:
1. Accept `courseStatuses?: PublicCourseStatusProjection[]`.
2. Determine current course from `pathname` matching `COURSE_NAV_REGISTRY`.
3. Check if current course is `hidden` via `courseStatuses` (D-07): if so, append an unlisted indicator `[Akses Terbatas]` to current course name and render that item in dropdown with an unlisted pill badge.
4. Filter registry items to only those with `status === 'active'` (or the current directly accessed course).
5. If 0 active courses exist, render disabled note: `"Tidak ada workshop aktif saat ini"` (D-08).
```tsx
import { COURSE_NAV_REGISTRY } from '@/data/courses'
import type { PublicCourseStatusProjection } from '@/schemas/courseLifecycle'

interface CourseSwitcherProps {
  courseStatuses?: PublicCourseStatusProjection[]
}

export function CourseSwitcher({ courseStatuses = [] }: CourseSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const routerState = useRouterState()
  const pathname = routerState.location.pathname

  const statusMap = new Map(courseStatuses.map((s) => [s.id, s.status]))
  const activeCourseKey = Object.keys(COURSE_NAV_REGISTRY).find((key) =>
    pathname.startsWith(COURSE_NAV_REGISTRY[key].path)
  )

  const isCurrentHidden = activeCourseKey ? statusMap.get(activeCourseKey) === 'hidden' : false
  // Dynamic header button icon and label
  const currentCourse = activeCourseKey ? COURSE_NAV_REGISTRY[activeCourseKey] : null
  const currentIcon = currentCourse ? currentCourse.icon : '🏠'
  const currentName = currentCourse 
    ? (isCurrentHidden ? `${currentCourse.title} (Akses Terbatas)` : currentCourse.title)
    : 'Beranda Kursus'

  // Items to show: always include active courses. If user is currently on a hidden course, include it too (D-07).
  const visibleItems = Object.values(COURSE_NAV_REGISTRY).filter((item) => {
    const status = statusMap.get(item.id) ?? 'active'
    return status === 'active' || (item.id === activeCourseKey && status === 'hidden')
  })

  // ...
```

---

### 8. `app/components/course/CourseUnavailableNotice.tsx` (Unavailable Screen)
- **Role:** Component / Notice Screen (`COURSE-SYNC-03`, D-09, D-10)
- **Closest Analog:** `app/components/ui/NotFound.tsx` (lines 1-75)

#### Concrete Excerpts:
```tsx
// Analog: app/components/ui/NotFound.tsx:15-69
      <div
        className="card error-card"
        style={{
          maxWidth: '520px',
          width: '100%',
          textAlign: 'center',
          padding: '2.5rem 2rem',
          borderRadius: '16px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          border: '1px solid var(--border-subtle, #e0e0e0)',
          background: 'var(--bg-surface, #ffffff)',
        }}
      >
        <div style={{ marginBottom: '1.25rem' }}>
          <img src="/favicon.svg?v=3.0.0" ... />
        </div>
        <div className="badge badge-pill badge-neutral">...</div>
        <h2>...</h2>
        <p>...</p>
        <Link to="/" search={{ filter: 'all' }} className="btn btn-primary btn-block">...</Link>
      </div>
```

#### Adaptation:
Create `CourseUnavailableNotice` supporting `status: 'deleted' | 'archived'` with customized icons, titles, badges, and contextual explanations:
```tsx
import { Link } from '@tanstack/react-router'

interface CourseUnavailableNoticeProps {
  status: 'deleted' | 'archived'
  courseId: string
  courseTitle?: string
}

export function CourseUnavailableNotice({ status, courseId, courseTitle }: CourseUnavailableNoticeProps) {
  const isArchived = status === 'archived'
  const icon = isArchived ? '📦' : '🚫'
  const badgeLabel = isArchived ? 'Diarsipkan' : 'Dinonaktifkan'
  const title = isArchived 
    ? 'Pelatihan Telah Diarsipkan' 
    : 'Pelatihan Tidak Tersedia'
  const description = isArchived
    ? `Materi pelatihan untuk "${courseTitle || courseId}" telah selesai dilaksanakan dan kini diarsipkan oleh administrator. Pendaftaran dan akses materi interaktif telah ditutup.`
    : `Akses ke modul pelatihan "${courseTitle || courseId}" telah dinonaktifkan oleh administrator. Silakan kembali ke beranda untuk memilih workshop yang sedang aktif.`

  return (
    <main className="app-main course-unavailable-main" id={`course-unavailable-${status}`}>
      <div className="card course-unavailable-card">
        <div className="unavailable-icon-wrapper">
          <span className="unavailable-icon" aria-hidden="true">{icon}</span>
        </div>
        <div className={`badge badge-pill ${isArchived ? 'badge-neutral' : 'badge-danger'}`}>
          {badgeLabel}
        </div>
        <h2 className="unavailable-title">{title}</h2>
        <p className="unavailable-desc">{description}</p>
        <Link
          to="/"
          search={{ filter: 'all' }}
          className="btn btn-primary unavailable-back-btn"
          id="btn-return-home"
        >
          <span>Kembali ke Beranda Workshop</span>
        </Link>
      </div>
    </main>
  )
}
```

---

### 9. `app/components/course/UnlistedCourseBanner.tsx` (Unlisted & In-Flight Banner)
- **Role:** Component / UI Alert (`COURSE-SYNC-03`, D-11, D-15)
- **Closest Analog:** `app/components/layout/GlobalAnnouncementBanner.tsx` (lines 85-123)

#### Concrete Excerpts:
```tsx
// Analog: app/components/layout/GlobalAnnouncementBanner.tsx:85-95
    <aside
      className={`global-announcement-banner banner-type-${config.banner.type}`}
      role="alert"
      aria-live="polite"
    >
      <div className="banner-inner">
        <span className="banner-icon">...</span>
        <p className="banner-message">...</p>
      </div>
    </aside>
```

#### Adaptation:
Create `UnlistedCourseBanner` supporting both static unlisted pill banner (D-11) and dynamic in-flight session change notification (D-15):
```tsx
interface UnlistedCourseBannerProps {
  courseId: string
  isInFlight?: boolean
  targetStatus?: string
}

export function UnlistedCourseBanner({ courseId, isInFlight, targetStatus }: UnlistedCourseBannerProps) {
  if (isInFlight) {
    return (
      <div className="course-inflight-banner" role="status" aria-live="polite" id="banner-inflight-status">
        <span className="inflight-icon" aria-hidden="true">⚠️</span>
        <span className="inflight-text">
          Status pelatihan ini telah diperbarui menjadi <strong>{targetStatus}</strong> oleh administrator. Anda dapat menyelesaikan pengerjaan sesi ini, namun akses baru telah dibatasi.
        </span>
      </div>
    )
  }

  return (
    <div className="unlisted-course-banner" role="note" id="banner-unlisted-course">
      <span className="unlisted-icon" aria-hidden="true">👁️‍🗨️</span>
      <span className="unlisted-text">
        <strong>Workshop Akses Terbatas (Unlisted)</strong> — Modul ini dapat diakses melalui tautan langsung namun tidak terdaftar di katalog publik.
      </span>
    </div>
  )
}
```

---

### 10. `app/routes/course.ai.tsx` (AI Workspace Route)
- **Role:** Route (`COURSE-SYNC-03`, D-09, D-10, D-11, D-12, D-15)
- **Closest Analog:** `app/routes/course.ai.tsx` (lines 24-56)

#### Concrete Excerpts:
```tsx
// Analog: app/routes/course.ai.tsx:27-33, 49-56
  loader: async ({ deps }) => {
    const course = await getCourseAiData(deps.mode)
    return {
      course,
      deferredStats: getCourseStatsAsync(course.id),
    }
  },
  ...
function CourseAiComponent() {
  const { mode } = Route.useSearch()
  const { course, deferredStats } = Route.useLoaderData()
```

#### Adaptation:
1. Loader checks lifecycle status via `getPublicCourseStatusesFn()` and passes `lifecycleStatus` to component.
2. If `lifecycleStatus === 'deleted' | 'archived'`, render `CourseUnavailableNotice`.
3. If `lifecycleStatus === 'hidden'`, render `UnlistedCourseBanner`.
4. Use `initialStatusRef` and `useEffect` to detect in-flight changes (D-15), rendering non-disruptive banner without unmounting workspace.
```tsx
export const Route = createFileRoute('/course/ai')({
  validateSearch: (search) => courseAiSearchSchema.parse(search),
  loaderDeps: ({ search }) => ({ mode: search.mode }),
  loader: async ({ deps }) => {
    const [course, statuses] = await Promise.all([
      getCourseAiData(deps.mode),
      getPublicCourseStatusesFn().catch(() => []),
    ])
    const statusRecord = statuses.find((s) => s.id === 'ai')
    const lifecycleStatus = statusRecord ? statusRecord.status : 'active'

    return {
      course,
      lifecycleStatus,
      deferredStats: getCourseStatsAsync(course.id),
    }
  },
  component: CourseAiComponent,
})

function CourseAiComponent() {
  const { course, lifecycleStatus, deferredStats } = Route.useLoaderData()
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

  if (initialStatusRef.current === 'deleted' || initialStatusRef.current === 'archived') {
    return <CourseUnavailableNotice status={initialStatusRef.current} courseId="ai" courseTitle={course.title} />
  }

  return (
    <main className="app-main course-main" id="container-course-ai">
      {isInFlightChanged && <UnlistedCourseBanner courseId="ai" isInFlight targetStatus={lifecycleStatus} />}
      {initialStatusRef.current === 'hidden' && <UnlistedCourseBanner courseId="ai" />}
      {/* Existing workspace UI */}
    </main>
  )
}
```

---

### 11. `app/routes/course.word.tsx` (Word Workspace Route)
- **Role:** Route (`COURSE-SYNC-03`, D-09, D-10, D-11, D-12, D-15)
- **Closest Analog:** `app/routes/course.word.tsx` (lines 10-46)

#### Adaptation:
Apply identical status verification in loader. If `deleted` or `archived`, render `CourseUnavailableNotice`. If `hidden`, preserve the existing passkey prompt and telemetry sync intact while displaying `UnlistedCourseBanner`.

---

### 12. `app/utils/courseBroadcast.ts` (Broadcast Utility)
- **Role:** Utility (`COURSE-SYNC-01`, D-13, D-14)
- **Closest Analog:** `app/utils/adminToken.ts` (lines 7-24)

#### Concrete Excerpts:
```ts
// Analog: app/utils/adminToken.ts:9-17
export function getClientAdminToken(): string | undefined {
  if (typeof window === 'undefined') return undefined
  try {
    const token = sessionStorage.getItem(ADMIN_TOKEN_STORAGE_KEY)
    return token ? token.trim() : undefined
  } catch {
    return undefined
  }
}
```

#### Adaptation:
Implement `broadcastCourseStatusChange`:
```ts
export interface CourseStatusBroadcastMessage {
  type: 'STATUS_UPDATED'
  courseId: string
  targetStatus: string
  timestamp: number
}

export const COURSE_STATUS_BROADCAST_CHANNEL = 'learnwith:course_status_changed'

export function broadcastCourseStatusChange(courseId: string, targetStatus: string): void {
  if (typeof window === 'undefined' || !('BroadcastChannel' in window)) return
  try {
    const channel = new BroadcastChannel(COURSE_STATUS_BROADCAST_CHANNEL)
    const payload: CourseStatusBroadcastMessage = {
      type: 'STATUS_UPDATED',
      courseId,
      targetStatus,
      timestamp: Date.now(),
    }
    channel.postMessage(payload)
    channel.close()
  } catch {
    // Fail silently if BroadcastChannel is blocked
  }
}
```

---

### 13. `app/components/admin/courses/AdminCourseManagementView.tsx` (Admin Invalidation)
- **Role:** Component / Admin View (`COURSE-SYNC-01`, D-13)
- **Closest Analog:** `app/components/admin/courses/AdminCourseManagementView.tsx` (lines 83-135)

#### Concrete Excerpts:
```tsx
// Analog: app/components/admin/courses/AdminCourseManagementView.tsx:93-105
      const res = await adminUpdateCourseStatusFn({
        data: {
          courseId,
          targetStatus,
          sessionToken: activeToken,
        },
      })
      showToast(
        res?.message || `Status kursus "${courseId}" berhasil ${actionLabel}.`,
        'success',
      )
      await fetchCourses(false)
```

#### Adaptation:
Import `useRouter` from `@tanstack/react-router` and `broadcastCourseStatusChange` from `@/utils/courseBroadcast`. After each successful mutation (`handleToggleVisibility`, `handleArchiveCourse`, `handleRestoreCourse`, and `handleDeleteConfirm`), call:
```tsx
router.invalidate()
broadcastCourseStatusChange(courseId, targetStatus)
```

---

### 14. `tests/course-lifecycle-sync.test.js` (Integration Test Suite)
- **Role:** Test (`COURSE-TEST-01`, `COURSE-TEST-02`, D-16)
- **Closest Analog:** `tests/course-lifecycle-admin-ui.test.js` (lines 6-27, 95-120) and `tests/course-lifecycle-rpc.test.js` (lines 6-34)

#### Concrete Excerpts:
```js
// Analog: tests/course-lifecycle-rpc.test.js:6-27
const { describe, it, before, beforeEach } = require('node:test');
const assert = require('node:assert/strict');

describe('Phase 34 Course Lifecycle RPC & Authorization Suite', () => {
  let courseLoader;
  let storeModule;
  let sessionModule;

  before(async () => {
    courseLoader = await import('../app/server/courseLifecycle.ts');
    storeModule = await import('../app/server/courseLifecycleStore.ts');
    sessionModule = await import('../app/server/session.ts');
  });

  beforeEach(() => {
    storeModule.clearCourseLifecycleStoreForTesting();
    sessionModule.clearAllSessionsForTesting();
  });
```

#### Adaptation:
Author a comprehensive suite testing:
1. `COURSE-MUTATE-03`: `getPublicCoursesListFn` returns only active courses, filtering out hidden, archived, and deleted courses dynamically.
2. `COURSE-SYNC-01`: Frontpage catalog filter logic and empty state card rendering (`#catalog-empty-state`, `#catalog-category-empty`).
3. `COURSE-SYNC-02`: Course switcher dynamic resolution from `COURSE_NAV_REGISTRY`, unlisted badge behavior on hidden course direct visit, and empty state note.
4. `COURSE-SYNC-03`: Direct access routing assertions: hidden course renders unlisted banner with functional workspace, deleted/archived renders `CourseUnavailableNotice`.
5. CSS Mirroring: Verifies `assets/css/components.css` === `public/assets/css/components.css`.

---

## Shared Patterns

### 1. TanStack Start Server Function Pattern
All server-side data extraction follows the established `createServerFn({ method: 'GET' | 'POST' })` pattern:
- Declared with `.handler(async () => ...)` in `app/server/*.ts`.
- Invoked directly inside route `loader` functions during SSR without network round-trips.
- Invoked via type-safe RPC from client navigation or `router.invalidate()`.

### 2. Route Loader SSR & Client Transition Pattern
Every route requiring lifecycle state (`/`, `__root.tsx`, `/course/ai`, `/course/word`) fetches data in its `loader`. This guarantees:
- Synchronous server-rendered HTML reflecting current status.
- Zero client-side flash or waterfall loading states.
- Clean hydration matching server expectations.

### 3. BroadcastChannel Cross-Tab Reactivity Pattern (D-13, D-14)
- When an admin updates course status in `/admin`, the action calls `router.invalidate()` for the current window and broadcasts an event on channel `'learnwith:course_status_changed'`.
- Root route listener in `__root.tsx` receives the event and invokes `router.invalidate()`, causing all open participant tabs to refetch their active loaders automatically.

### 4. NotebookLM Empty States & Notice Cards Pattern
Consistent styling using design system tokens:
- Background: `var(--bg-surface, #ffffff)`
- Border: `1px solid var(--border-subtle, #e0e0e0)`
- Border Radius: `16px`
- Box Shadow: `0 4px 24px rgba(0,0,0,0.06)`
- Pill badges: `.badge.badge-pill.badge-neutral` / `.badge-danger` / `.badge-success`
- High contrast accessible typography adhering strictly to the NotebookLM aesthetic.

### 5. In-Flight Session Safety Pattern (D-15)
To prevent disruptive UX when a course is deactivated while a participant is actively completing checkpoints:
- Capture initial loader status in a ref: `const initialStatusRef = useRef(lifecycleStatus)`.
- If status transitions from `active/hidden` to `deleted/archived` while component remains mounted, do NOT unmount the workspace.
- Display a prominent floating advisory alert (`#banner-inflight-status`).
- Enforce the full unavailable screen (`CourseUnavailableNotice`) upon full reload or route transition.

### 6. CSS Synchronization & Token Mirroring Pattern
Any CSS rule added or modified in `assets/css/*.css` MUST be mirrored 1:1 to `public/assets/css/*.css`. The automated test suite validates exact character-for-character equality to prevent drift across environments.

---

## PATTERN MAPPING COMPLETE
**Phase:** 36 - Frontpage Catalog & Header Switcher Reactive Sync
### File Created
`C:/Users/yudhiar/Downloads/AgenticAI/.planning/phases/36-frontpage-catalog-header-switcher-reactive-sync/36-PATTERNS.md`
