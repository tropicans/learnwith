---
phase: 23-route-level-ssr-optimization-production-docker-target
plan: "01"
subsystem: ssr-routing
tags: [tanstack-start, ssr, hydration-safety, error-boundary, request-logging, intent-preload]

requires:
  - phase: 22-typed-server-functions-boundary-isolation
    provides: Typed server functions, boundary isolation, and isomorphic schemas
provides:
  - NotebookLM-branded 404 Not Found and Route Error Boundary components
  - Intent-based preloading with 50ms debounce on router factory and navigation links
  - Full document SSR for Frontpage Hub with OpenGraph metadata tags
  - Hydration-safe SSR Shell + ClientOnly Islands for AI & Word course routes
  - Minimalist structured request logging and fresh SSR cache headers
affects:
  - 23-02
  - 23-03

actuals:
  tokens: 1850
  tasks: 4
  commits: 1

tech-stack:
  added: []
  patterns:
    - Branded NotebookLM 404 and Route Error Boundary layout with LY monogram
    - Router default boundaries and defaultPreload: 'intent'
    - Minimalist structured server logging: [SSR] method path status (duration ms)
    - Fresh SSR cache headers (no-cache, no-store, must-revalidate)

key-files:
  created:
    - app/components/ui/NotFound.tsx
    - app/components/ui/RouteErrorBoundary.tsx
  modified:
    - app/routes/__root.tsx
    - app/router.tsx
    - app/routes/index.tsx
    - app/routes/course.ai.tsx
    - app/routes/course.word.tsx
    - app/ssr.tsx

key-decisions:
  - "D-01: Guaranteed client hydration safety by isolating localStorage interactive checklists in <ClientOnly> islands."
  - "D-02: Enforced Full SSR for Frontpage Hub / with OpenGraph tags (og:title, og:description, og:type, og:image)."
  - "D-03: Enabled intent-based preloading with 50ms delay in router factory and on course navigation links."
  - "D-04: Created branded NotebookLM 404 and Route Error Boundary with LY monogram, Indonesian text, and home navigation."
  - "D-10 & D-12: Added minimalist structured logging in app/ssr.tsx without query param leaks, ensuring fresh Cache-Control headers."

requirements-completed:
  - DEPLOY-02

coverage:
  - id: D-01
    description: "SSR Shell with <ClientOnly> Islands preventing localStorage hydration mismatch"
    requirement: DEPLOY-02
    verification:
      - kind: build
        ref: "npm run build"
        status: pass
  - id: D-02
    description: "Full SSR with dynamic OpenGraph metadata for Frontpage Hub /"
    requirement: DEPLOY-02
    verification:
      - kind: build
        ref: "app/routes/index.tsx"
        status: pass
  - id: D-03
    description: "Intent-based preloading configured on router and links"
    requirement: DEPLOY-02
    verification:
      - kind: build
        ref: "app/router.tsx"
        status: pass
  - id: D-04
    description: "Branded 404 Not Found and Route Error Boundary"
    requirement: DEPLOY-02
    verification:
      - kind: build
        ref: "app/routes/__root.tsx"
        status: pass
  - id: D-12
    description: "Minimalist structured request logging in ssr.tsx"
    requirement: DEPLOY-02
    verification:
      - kind: build
        ref: "app/ssr.tsx"
        status: pass
---

# Phase 23 Plan 01: Route-Level SSR Optimization, Hydration Safety Islands, Branded Error Boundaries & Structured Logging Summary

## Overview
Plan 23-01 established per-route SSR rendering strategies, guaranteed hydration safety across interactive course workspaces, implemented NotebookLM-branded 404 and error boundaries, and integrated structured request logging into the SSR stream handler.

## Accomplishments
1. **Branded 404 & Route Error Boundaries (`app/components/ui/NotFound.tsx`, `app/components/ui/RouteErrorBoundary.tsx`, `app/routes/__root.tsx`)**:
   - Built NotebookLM-styled 404 page featuring the official LY monogram (`/favicon.svg?v=2.3.0`), clear Indonesian guidance, and one-click return to `/`.
   - Built `RouteErrorBoundary` displaying error diagnostics, a retry action, and fallback navigation.
   - Bound both boundaries to `createRootRoute` in `app/routes/__root.tsx`.
2. **Intent-Based Preloading & Router Defaults (`app/router.tsx`, `app/routes/index.tsx`)**:
   - Configured `defaultPreload: 'intent'` and `defaultPreloadDelay: 50` on the TanStack Router factory.
   - Added `defaultNotFoundComponent` and `defaultErrorComponent` on router creation.
   - Applied `preload="intent"` to course workspace navigation buttons on the Frontpage Hub.
3. **Route-Level SSR & Hydration Safety (`app/routes/index.tsx`, `app/routes/course.ai.tsx`, `app/routes/course.word.tsx`)**:
   - Added OpenGraph metadata tags (`og:title`, `og:description`, `og:type: 'website'`, `og:image: '/learnwith-banner.png'`) to Frontpage Hub `/`.
   - Ensured static curriculum outlines and heroes are rendered during SSR while stateful checklists remain safely encapsulated in `<ClientOnly>` islands.
4. **Structured Request Logging & Fresh SSR Cache (`app/ssr.tsx`)**:
   - Wrapped `defaultStreamHandler(ctx)` to log `[SSR] ${method} ${pathname} ${status} (${duration}ms)`.
   - Stripped query parameters and request headers from server logs to prevent credential/token leaks (mitigating T-23-03).
   - Enforced `Cache-Control: no-cache, no-store, must-revalidate` on dynamic SSR HTML responses.

## Verification
- `npm run typecheck`: 0 TypeScript errors.
- `npm run build`: Successful Vinxi client, SSR, server, and Nitro server builds.
