---
phase: 21-typed-route-loaders-full-document-ssr-progressive-streaming
plan: "01"
subsystem: routing
tags: [tanstack-router, ssr, loaders, metadata, types]

requires:
  - phase: 20-file-based-routing-search-params
    provides: file-based routes in app/routes and search parameter schemas
provides:
  - Strongly-typed course data layer in app/data/courses.ts
  - Server-side route loaders preloading curriculum data on index, course.ai, and course.word
  - Dynamic route metadata (head) generating contextual titles and OpenGraph tags
affects: [21-02, 21-03]

actuals:
  tokens: 1850
  tasks: 2
  commits: 1

tech-stack:
  added: []
  patterns: [typed-route-loaders, dynamic-head-metadata, loaderDeps-search-param-binding]

key-files:
  created:
    - app/data/courses.ts
  modified:
    - app/routes/index.tsx
    - app/routes/course.ai.tsx
    - app/routes/course.word.tsx

key-decisions:
  - "Used loaderDeps in app/routes/course.ai.tsx to safely bind search.mode to loader without reloading unnecessarily"
  - "Constructed rich course models with module syllabus, estimated time, and checkpoint metadata matching state.js and word-modules specs"

patterns-established:
  - "loader: typed data fetching with getCoursesList / getCourseAiData / getCourseWordData"
  - "head: dynamic title and OpenGraph metadata generation from loaderData with fallbacks"

requirements-completed:
  - SSR-01
  - SSR-03

duration: 10m
completed: 2026-09-08
status: complete
---

# Phase 21 Plan 01: Typed Route Loaders & Dynamic Head Metadata Summary

**Implemented strongly-typed curriculum data layer (`app/data/courses.ts`), server preloading route loaders, and dynamic head metadata across Frontpage Hub and workspace routes.**

## Performance

- **Duration:** 10m
- **Started:** 2026-09-08T07:31:00Z
- **Completed:** 2026-09-08T07:35:00Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- Created `app/data/courses.ts` exporting strict TypeScript interfaces (`CourseModule`, `CourseData`, `CourseStats`) and preloading loader functions.
- Implemented route loader in `app/routes/index.tsx` serving course summaries and dynamic OpenGraph metadata for the frontpage hub.
- Implemented route loader and dynamic `head` metadata in `app/routes/course.ai.tsx` with `loaderDeps` handling `search.mode` ('pretraining' vs 'live-class').
- Implemented route loader and dynamic `head` metadata in `app/routes/course.word.tsx` rendering bab structure and BPSDM curriculum.
- Verified compilation and build with 0 TypeScript or Vinxi errors.

## Task Commits

1. **Task 1 & Task 2: Data layer and route loaders** - `d58a7c1` (`feat(21-01): implement strongly-typed curriculum data layer and route loaders`)

## Verification Results

- `npm run typecheck`: Passed with 0 errors.
- `npm run build`: Vinxi client, SSR, and Nitro server bundles compiled cleanly.

## Self-Check: PASSED
