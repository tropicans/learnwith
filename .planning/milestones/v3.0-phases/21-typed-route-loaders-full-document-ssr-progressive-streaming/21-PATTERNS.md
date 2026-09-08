# Phase 21: Typed Route Loaders, Full-Document SSR & Progressive Streaming - Pattern Map

**Phase:** 21 - Typed Route Loaders, Full-Document SSR & Progressive Streaming  
**Status:** Ready for Planning  
**Target Directory:** `.planning/phases/21-typed-route-loaders-full-document-ssr-progressive-streaming/`

---

## Executive Summary

This document establishes the architecture patterns, component blueprints, and SSR streaming lifecycle contracts for Phase 21. It specifies the typed data layer (`app/data/courses.ts`), route loader signatures, React 19 Suspense boundaries, skeleton loaders, and `<ClientOnly>` hydration guards.

---

## File Classification & Architectural Boundaries

| File Path | Role | Boundary | Action | Analogs / Precedents |
|---|---|---|---|---|
| `app/data/courses.ts` | Curriculum & Module Data Store | Server & Isomorphic Data | Create | `assets/js/state.js` (`COURSE_CONFIGS`, module metadata) |
| `app/components/ui/Skeleton.tsx` | Skeleton Fallback Loaders | Pure Presentation | Create | NotebookLM card skeletons, worksheet pulse blocks |
| `app/components/course/ChecklistIsland.tsx` | Client-Only Checklist Widget | Client Island (`<ClientOnly>`) | Create | `assets/js/app.js` (interactive checkbox event listeners) |
| `app/routes/index.tsx` | Frontpage Hub Route (`/`) | Route Loader + SSR | Modify | Phase 20 `index.tsx` |
| `app/routes/course.ai.tsx` | Agentic AI Workspace (`/course/ai`) | Route Loader + Defer + Suspense | Modify | Phase 20 `course.ai.tsx` |
| `app/routes/course.word.tsx` | Word ASN Workspace (`/course/word`) | Route Loader + Defer + Suspense | Modify | Phase 20 `course.word.tsx` |

---

## Pattern Blueprints

### 1. Strongly-Typed Data Layer (`app/data/courses.ts`)
Provides deterministic data structures for courses, modules, and platform statistics:
```typescript
export interface CourseModule {
  id: string
  num: number
  title: string
  subtitle: string
  estimatedMinutes: number
  checkpoints?: string[]
}

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
}

export async function getCoursesList(): Promise<CourseData[]> { ... }
export async function getCourseAiData(mode: string): Promise<CourseData> { ... }
export async function getCourseWordData(): Promise<CourseData> { ... }
export async function getCourseStatsAsync(courseId: string): Promise<{ activeParticipants: number; completionRate: number }> { ... }
```

### 2. Route Loaders with Critical Data & Streaming Defer (`loader`)
In `app/routes/course.ai.tsx`:
```tsx
import { createFileRoute, defer, Await } from '@tanstack/react-router'
import { Suspense } from 'react'
import { getCourseAiData, getCourseStatsAsync } from '@/data/courses'
import { courseAiSearchSchema } from '@/schemas/searchParams'
import { CourseSkeleton } from '@/components/ui/Skeleton'

export const Route = createFileRoute('/course/ai')({
  validateSearch: (search) => courseAiSearchSchema.parse(search),
  loader: async ({ search }) => {
    const course = await getCourseAiData(search.mode)
    return {
      course,
      deferredStats: defer(getCourseStatsAsync(course.id)),
    }
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: \`${loaderData?.course?.title || 'Workshop AI'} — learnwith Yudhi\` },
      { name: 'description', content: loaderData?.course?.subtitle || '' },
      { property: 'og:title', content: loaderData?.course?.title || '' },
      { property: 'og:type', content: 'website' },
    ],
  }),
  component: CourseAiComponent,
})
```

### 3. Suspense & Skeleton Fallbacks (SSR-02)
Render immediate server-rendered HTML for critical layout while streaming deferred chunks:
```tsx
function CourseAiComponent() {
  const { course, deferredStats } = Route.useLoaderData()
  return (
    <main className="app-main course-main">
      <h1>{course.title}</h1>
      <p>{course.description}</p>
      
      {/* Progressive streaming section */}
      <Suspense fallback={<div className="skeleton-pulse">Memuat statistik workshop...</div>}>
        <Await promise={deferredStats}>
          {(stats) => (
            <div className="course-stats-banner">
              <span>Peserta Aktif: {stats.activeParticipants}</span>
              <span>Tingkat Kelulusan: {stats.completionRate}%</span>
            </div>
          )}
        </Await>
      </Suspense>
    </main>
  )
}
```

### 4. Hydration Safety via `<ClientOnly>` (SSR-04)
Encapsulate client-only state (localStorage access, interactive checklist checks, live quiz scoring):
```tsx
import { ClientOnly } from '@tanstack/react-router'
import { ChecklistWidget } from '@/components/course/ChecklistIsland'
import { SkeletonChecklist } from '@/components/ui/Skeleton'

export function InteractiveSection({ courseId }: { courseId: string }) {
  return (
    <ClientOnly fallback={<SkeletonChecklist />}>
      <ChecklistWidget courseId={courseId} />
    </ClientOnly>
  )
}
```
