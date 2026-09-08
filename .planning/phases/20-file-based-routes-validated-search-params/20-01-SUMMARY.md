---
phase: 20-file-based-routes-validated-search-params
plan: "01"
type: execute
wave: 1
status: complete
date: 2026-09-08
requirements:
  - ROUTE-01
  - ROUTE-05
artifacts:
  - app/schemas/searchParams.ts
  - app/components/layout/Header.tsx
  - app/components/layout/CourseSwitcher.tsx
  - app/routes/__root.tsx
---

# Phase 20 Plan 01 Summary: Search Params & Root Document Shell

## Accomplishments
1. **Centralized Zod Search Schemas (`app/schemas/searchParams.ts`)**:
   - Implemented `homeSearchSchema` validating `filter` (`'all' | 'ai' | 'word'`) with `.catch('all')` fallback.
   - Implemented `courseAiSearchSchema` validating `mode` (`'pretraining' | 'live-class'`) with `.catch('pretraining')`, optional `step`, and `cp`.
   - Implemented `courseWordSearchSchema` validating optional `tab`, `bab`, and `unlocked`.
   - Exported TypeScript types inferred via `z.infer`.
2. **Platform Header & Switcher Components (`app/components/layout/`)**:
   - Implemented `CourseSwitcher.tsx` with NotebookLM-style pill dropdown, outside-click detection, active course indicator, and type-safe routing links.
   - Implemented `Header.tsx` with brand logo, breadcrumb separator, CourseSwitcher, and global search placeholder.
3. **Document Root Shell (`app/routes/__root.tsx`)**:
   - Configured document head with UTF-8, viewport, meta tags, Google Fonts (Inter, JetBrains Mono), and platform stylesheets (`/assets/css/main.css?v=2.2.0`, `/assets/css/components.css?v=2.2.0`).
   - Integrated `<Header />`, `<Outlet />`, `<ScrollRestoration />`, and `<Scripts />`.

## Verification
- Strict TypeScript verification (`npm run typecheck`) passed with 0 errors.
