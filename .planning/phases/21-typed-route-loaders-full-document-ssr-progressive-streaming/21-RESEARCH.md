# Phase 21: Typed Route Loaders, Full-Document SSR & Progressive Streaming - Research

**Researched:** 2026-09-08  
**Domain:** TanStack Router, TanStack Start, Route Loaders, React 19 Suspense, Progressive HTML Streaming, Defer & Await, Dynamic Document Head Meta, ClientOnly Boundaries  
**Phase Requirements:** SSR-01, SSR-02, SSR-03, SSR-04  
**Target Directory:** `.planning/phases/21-typed-route-loaders-full-document-ssr-progressive-streaming/`

---

## User Constraints

From `/gsd-discuss-phase` & project state:
- No design preferences recorded (continue without context mode chosen).
- Core values: Maintain zero layout shift, eliminate hydration mismatch warnings, provide instant initial render with progressive HTML streaming, and preserve 100% backward compatibility for legacy CommonJS tests (`npm test`).
- Maintain offline-first / client-storage functionality for participant checklist, progress tracking, and interactive quizzes without server database requirements for basic course usage.

---

## Standard Stack

1. **Routing & SSR Engine**:
   - `@tanstack/react-router` (v1.120.x) [VERIFIED: package.json:17]
   - `@tanstack/react-start` (v1.120.x) [VERIFIED: package.json:18]
   - `vinxi` (v0.5.3) [VERIFIED: package.json:28]
   - `react` / `react-dom` (v19.0.0) [VERIFIED: package.json:24-25]
2. **Data & Schema**:
   - `zod` (v3.24.2) [VERIFIED: package.json:29]
   - Static typed curriculum models in `app/data/courses.ts`
3. **Core APIs & Components**:
   - `Route.useLoaderData()`: Type-safe consumption of server-loaded curriculum data.
   - `defer()` & `<Await>`: From `@tanstack/react-router` for unawaited deferred promises and progressive streaming over HTTP chunks.
   - `Suspense`: From `react` for skeleton fallbacks.
   - `<ClientOnly>`: From `@tanstack/react-router` for components accessing `localStorage` or browser-only APIs.
   - `head()`: Route option in TanStack Router for dynamic document titles, meta tags, and OpenGraph descriptors.

---

## Architecture Patterns

### 1. Unified Curriculum & Course Data Layer (`app/data/courses.ts`)
Decouple course syllabus, module descriptions, and metadata into a clean, strongly-typed static dataset:
- `getCoursesSummary()`: Returns metadata for `/` (Agentic AI, Word ASN, stats).
- `getCourseAiData()`: Returns modules for Pra-Training (5 modules) and Live Class (Modules 6-10), prerequisites, checkpoints.
- `getCourseWordData()`: Returns Bab I - V curriculum, standards, checkpoint gates, and passkey configuration.
- `getCourseDiagnostics()`: Returns system health, runtime info, and environment flags.

### 2. Typed Route Loaders (SSR-01)
Define explicit loader functions on route definitions:
```tsx
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
      { title: \`${loaderData?.course?.title || 'Workshop'} — learnwith Yudhi\` },
      { name: 'description', content: loaderData?.course?.subtitle || '' },
      { property: 'og:title', content: loaderData?.course?.title || '' },
      { property: 'og:type', content: 'website' },
    ],
  }),
  component: CourseAiComponent,
})
```

### 3. Progressive HTML Streaming with React Suspense & `<Await>` (SSR-02)
- TanStack Start server handler in `app/ssr.tsx` uses `createStartHandler({ createRouter })(defaultStreamHandler)`.
- During SSR, critical loader data (title, syllabus outline, structure) is resolved immediately before initial HTML shell is flushed.
- Secondary data wrapped in `defer(promise)` streams across HTTP chunks; `<Suspense fallback={<SkeletonCard />}>` renders placeholder skeletons until chunk arrives, eliminating layout shifts.

### 4. Dynamic Route Metadata (`head()`) (SSR-03)
- `head()` method on route configurations outputs `<title>`, `<meta>`, and `<link>` descriptors.
- In `__root.tsx`, default OpenGraph, charset, viewport, and stylesheet links are specified.
- Child routes (`/`, `/course/ai`, `/course/word`) override title and description contextually based on search params (e.g. `mode === 'live-class' ? 'Hari-H Praktik' : 'Pra-Training'`).

### 5. Hydration-Safe Client Islands (`<ClientOnly>`) (SSR-04)
- Browser-specific data (`localStorage.getItem('learnwith_ai_state_v1')`, active checkbox states, quiz answers) must NEVER cause SSR hydration mismatches.
- Pattern:
```tsx
import { ClientOnly } from '@tanstack/react-router'
import { ChecklistWidget } from '@/components/course/ChecklistWidget'
import { SkeletonChecklist } from '@/components/ui/Skeleton'

export function CourseWorksheet() {
  return (
    <ClientOnly fallback={<SkeletonChecklist />}>
      <ChecklistWidget courseId="ai" />
    </ClientOnly>
  )
}
```

---

## Don't Hand-Roll

- **DO NOT** roll custom SSR streaming handlers or raw Node http write chunk hacks. Rely on TanStack Start's built-in `defaultStreamHandler` and `defer()`.
- **DO NOT** hand-roll `window !== 'undefined'` guard conditions inside render trees where HTML mismatch is possible; use the canonical `<ClientOnly>` component from `@tanstack/react-router`.
- **DO NOT** manipulate document `document.title` inside `useEffect` when TanStack Router `head()` provides server-rendered metadata for SEO, social previews, and instant browser tab labeling.
- **DO NOT** modify existing CommonJS files in `assets/js/` or alter Node test fixtures in `tests/`. Keep new TanStack Start implementations isolated in `app/`.

---

## Common Pitfalls

1. **Awaiting Deferred Promises in Loader**:
   - *Pitfall*: Calling `await defer(...)` in loader ruins streaming and turns progressive SSR into blocking SSR.
   - *Fix*: Return `{ deferredData: defer(promise) }` without `await` and consume with `<Await promise={deferredData}>`.
2. **Hydration Discrepancy with `localStorage`**:
   - *Pitfall*: Reading `localStorage` during initial component render causes React error `#418` / `#423` (hydration mismatch).
   - *Fix*: Encapsulate all stateful user interactions in `<ClientOnly fallback={<Skeleton />}>` or read storage only inside `useEffect`.
3. **Missing `head` in Route Definitions**:
   - *Pitfall*: Relying only on `__root.tsx` `head` leaves child pages with generic titles in browser tabs and crawler indexes.
   - *Fix*: Provide specialized `head: ({ loaderData }) => ({ meta: [...] })` on `/`, `/course/ai`, and `/course/word`.

---

## Validation Architecture

### Automated Verification Gates
1. **TypeScript Typecheck**:
   - `npm run typecheck` (`tsc --noEmit`) must exit with code 0 with strict null checks.
2. **Production SSR Build**:
   - `npm run build` must generate valid client and server bundles in `.output/` without warnings.
3. **Route Loader & SSR Streaming Probe**:
   - Spin up production server on Port 3173 (`PORT=3173 node .output/server/index.mjs`).
   - Curl `/`, `/course/ai`, `/course/word` and assert:
     - HTTP Status 200.
     - Document contains `<title>` matching route metadata.
     - Document contains server-rendered curriculum headings (`Agentic AI`, `Pengolahan Kata`).
     - Zero unhandled promise rejections or streaming errors in server console.
4. **Legacy Test Suite Regression**:
   - `npm test` runs 11/11 test files and passes 100%.
