# Roadmap: Milestone v3.0 TanStack Start Full-Document SSR & File-Based Router Migration

## Milestones Overview

- ✅ **v1.0 Pre-Training Interactive Web App (Agentic AI)** - Phases 1-4 (shipped 2026-09-03) — [Archive](milestones/v1.0-ROADMAP.md)
- ✅ **v1.1 Live Workshop Guide (Agentic AI Hari-H)** - Phases 5-8 (shipped 2026-09-07) — [Archive](milestones/v1.1-ROADMAP.md)
- ✅ **v2.0 Multi-Course Platform & Modul Pengolahan Kata Tingkat Lanjut** - Phases 9-12 (shipped 2026-09-07) — [Archive](milestones/v2.0-ROADMAP.md)
- ✅ **v2.1 Google NotebookLM-Inspired UI/UX Overhaul & Workspace Architecture** - Phases 13-15 (shipped 2026-09-07) — [Archive](milestones/v2.1-ROADMAP.md)
- ✅ **v2.2 Application Security Hardening & Anti-Breach Protection** - Phases 16-18 (shipped 2026-09-07) — [Archive](milestones/v2.2-phases)
- 🚀 **v3.0 TanStack Start Full-Document SSR & File-Based Router Migration** - Phases 19-23 (Active)

---

## Active Milestone: v3.0 (Phases 19-23)

### Phase 19: TanStack Start & Full-Stack Tooling Foundation

**Goal**: Menyiapkan struktur dasar full-stack TanStack Start, bundler Vinxi/Vite, TypeScript strict configuration, dan entry points SSR/client.
**Depends on**: Milestone v2.2
**Requirements**: FOUND-01, FOUND-02, FOUND-03, FOUND-04
**Plans**: 3 plans

Plans:

- [x] 19-01: Root package manifest, pinned dependencies & CommonJS test isolation (completed 2026-09-08)
- [x] 19-02: TypeScript strict configuration, Vinxi bundler & TanStack Start entry points (completed 2026-09-08)
- [x] 19-03: Production containerization & deployment verification on Port 3173 (completed 2026-09-08)

**Success Criteria**:

1. Project memiliki dependencies TanStack Start, React 19/18, Vite, dan TypeScript terpasang dan dapat dibuild tanpa error.
2. `app.config.ts` dan `tsconfig.json` terkonfigurasi dengan path alias dan router plugin generator.
3. Entry points `app/client.tsx` dan `app/ssr.tsx` aktif dan mampu menangani initial request/response cycle.

### Phase 20: File-Based Routes & Validated Search Params

**Goal**: Mengonversi struktur multi-halaman monolitik menjadi file-based routing menggunakan TanStack Router dengan validasi parameter query via Zod.
**Depends on**: Phase 19
**Requirements**: ROUTE-01, ROUTE-02, ROUTE-03, ROUTE-04, ROUTE-05
**Plans**: 3 plans

Plans:

- [x] 20-01: Centralized Zod search validation schemas, platform Header & root document shell (completed 2026-09-08)
- [x] 20-02: Frontpage Hub (`/`), Agentic AI (`/course/ai`), and Word (`/course/word`) file routes & routeTree generation (completed 2026-09-08)
- [x] 20-03: End-to-end SSR endpoint verification on Port 3173 & legacy regression testing (completed 2026-09-08)

**Success Criteria**:

1. Root document shell `__root.tsx` menyajikan HTML lengkap dengan `<Meta />`, `<Links />`, `<Outlet />`, `<Scripts />`.
2. Halaman `/`, `/course/ai`, `/course/word`, dan `/diagnostics` terpetakan secara deklaratif di `app/routes/`.
3. Search parameters (`mode`, `tab`, `filter`, `unlock`) divalidasi dengan schema Zod dan memiliki type safety otomatis pada navigasi `<Link>`.

### Phase 21: Typed Route Loaders, Full-Document SSR & Progressive Streaming

**Goal**: Mengaktifkan server-side preloading data kurikulum dan modul melalui route loaders serta mengalirkan HTML secara progresif dengan React Suspense.
**Depends on**: Phase 20
**Requirements**: SSR-01, SSR-02, SSR-03, SSR-04
**Plans**: 3 plans

Plans:
**Wave 1**

- [ ] 21-01: Strongly-typed course data layer, route loaders & dynamic document head metadata

**Wave 2** *(blocked on Wave 1 completion)*

- [ ] 21-02: Progressive HTML streaming with React Suspense & ClientOnly hydration safety

**Wave 3** *(blocked on Wave 2 completion)*

- [ ] 21-03: Production SSR streaming probe verification on Port 3173 & legacy test suite regression

**Success Criteria**:

1. Data modul dan kurikulum di-preload via route `loader`, mengeliminasi layout shifts saat initial load.
2. Progressive streaming HTML aktif dengan Suspense fallback skeleton loader.
3. Widget interaktif berbasis client state (checklist dan kuis) dienkapsulasi dengan boundary `<ClientOnly>` sehingga bebas dari hydration mismatch.

### Phase 22: Typed Server Functions & Boundary Isolation

**Goal**: Menjaga fungsi sensitif dan logika server murni di balik boundary `createServerFn` yang aman dari kebocoran bundle client.
**Depends on**: Phase 21
**Requirements**: SRV-01, SRV-02, SRV-03
**Success Criteria**:

1. Verifikasi passkey modul pengajar dieksekusi via `createServerFn` dengan validasi payload Zod di sisi server.
2. Secret hash dan environment variables terisolasi di `app/server/` dan tidak pernah disertakan dalam bundle JavaScript browser.
3. Diagnostik dan telemetry internal berjalan via typed RPC yang aman.

### Phase 23: Route-Level SSR Optimization & Production Docker Target

**Goal**: Mengoptimalkan mode SSR per route (Full SSR vs Client Island) dan memvalidasi deployment runtime container Docker.
**Depends on**: Phase 22
**Requirements**: DEPLOY-01, DEPLOY-02, DEPLOY-03, DEPLOY-04
**Success Criteria**:

1. Build pipeline produksi `npm run build` menghasilkan artefak standalone Node server yang teroptimasi.
2. Mode SSR per route dikonfigurasi secara tepat untuk memaksimalkan TTFB dan SEO.
3. Container Docker berhasil dibuild dan dijalankan (`docker compose up --build -d`) tanpa regresi fungsionalitas.
4. Seluruh test suite (unit tests dan Playwright E2E) lulus 100%.
