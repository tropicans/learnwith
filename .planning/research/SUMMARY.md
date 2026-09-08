# Project Research Summary — TanStack Start Migration (Milestone v3.0)

**Date:** 2026-09-08  
**Domain:** Full-Stack Web Application Framework Migration  
**Project:** learnwith  

---

## Key Findings

1. **Stack Additions**:
   - Framework: `@tanstack/react-start`, `@tanstack/react-router`, `@tanstack/router-plugin`, `@tanstack/react-query`, `vinxi`.
   - Utility & Validation: `zod` untuk validasi search params dan typed server function payloads.
   - Core runtime: React 19 / 18, Vite 5, TypeScript 5.4.

2. **Feature Table Stakes**:
   - File-based routing via `app/routes/` (`__root.tsx`, `index.tsx`, `course/ai.tsx`, `course/word.tsx`).
   - Validated search params (Zod schema) untuk query params (`mode`, `tab`, `filter`, `unlock`).
   - Typed route loaders untuk preloading modul dan silabus sebelum render.
   - Typed server functions (`createServerFn`) menjaga server-only logic di balik batas RPC yang aman.
   - Full-document progressive SSR streaming dengan React Suspense.

3. **Architecture & Boundaries**:
   - Entry points: `app/client.tsx` (hydration) & `app/ssr.tsx` (stream handling).
   - Server-only code diisolasi di `app/server/` dan diekspos melalui `createServerFn`.
   - Asset delivery terintegrasi di `__root.tsx` menggunakan `<Meta />`, `<Links />`, dan `<Scripts />`.

4. **Watch Out For (Pitfalls)**:
   - Hydration mismatch antara SSR dan `localStorage`: gunakan boundary `<ClientOnly>` untuk checklist dan kuis interaktif.
   - Kebocoran server secrets ke client: pastikan hanya `createServerFn` yang memproses verifikasi sandi.
   - Runtime Docker: gunakan preset `node-server` agar aplikasi dapat langsung berjalan di container tanpa modifikasi model aplikasi.

---

## Implications for Roadmap

- **Phase 19: TanStack Start Foundation & Build Setup** (Vinxi, Vite, TypeScript, Root Route Document Shell).
- **Phase 20: File-Based Routes & Validated Search Params** (Routes tree, Zod schema navigation, route transitions).
- **Phase 21: Typed Route Loaders, Full-Document SSR & Streaming** (Preloading syllabus, Suspense boundaries, streaming SSR).
- **Phase 22: Typed Server Functions & Server Boundary Isolation** (Server functions for passkey authentication, config access, state sync).
- **Phase 23: Route-Level SSR Optimization & Docker Container Target** (Per-route SSR/ClientOnly tuning, Dockerfile update, production verification).
