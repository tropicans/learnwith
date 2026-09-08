# Phase 23: Route-Level SSR Optimization & Production Docker Target - Context

**Gathered:** 2026-09-08
**Status:** Ready for planning

<domain>
## Phase Boundary

Mengoptimalkan mode SSR per route (Full SSR + ClientOnly Islands untuk Course Workspaces vs Full SSR dengan streaming untuk Frontpage Hub), mengonfigurasi production Docker container (multi-stage build, non-root user `node`, native Node.js healthcheck, tini/signal handling), menyajikan static asset via standalone Vinxi/Nitro Node server (`.output/server/index.mjs`) pada port 3173 dengan caching headers optimal, serta menyediakan automated container smoke test dan multi-tier test suite dengan garansi 100% kelulusan unit tests legacy.

</domain>

<decisions>
## Implementation Decisions

### Route SSR Strategy
- **D-01:** Full SSR Shell + `<ClientOnly>` Islands untuk rute `/course/ai` dan `/course/word` — **Reversibility:** costly — Server me-render struktur kurikulum & metadata, sementara widget stateful interaktif dimount aman di browser via ClientOnly boundary tanpa mismatch.
- **D-02:** Full SSR dengan Dynamic Metadata & Streaming untuk Frontpage Hub (`/`) — **Reversibility:** reversible — Layout, OpenGraph tags, dan preloaded summary dirender instan di server untuk TTFB optimal dan SEO maksimal.
- **D-03:** Preload on Intent (`preload: 'intent'`) pada navigasi TanStack Router — **Reversibility:** reversible — Hover/touch pada card & course pill otomatis memuat bundle rute target untuk transisi halaman seketika.
- **D-04:** Branded 404 Not Found & Route Error Boundary — **Reversibility:** reversible — Komponen visual khusus bergaya NotebookLM dengan logo monogram LY, panduan ramah pengguna, dan tombol Kembali ke Beranda.

### Docker Hardening & Healthcheck
- **D-05:** Non-Root User (`USER node`) di runner stage Dockerfile — **Reversibility:** costly — Menjalankan proses Node di container menggunakan user `node` standar CIS/OWASP dengan permission `/app` yang tepat.
- **D-06:** Native Node.js Healthcheck — **Reversibility:** reversible — Menggunakan inline script `node -e` dengan native `fetch` ke `http://localhost:3173/` tanpa perlu install wget/curl tambahan di Alpine.
- **D-07:** Optimized Multi-Stage Layering — **Reversibility:** reversible — Memisahkan caching layer `package*.json` + `npm ci` sebelum copy source code, dan hanya menyalin artefak terkompilasi (`.output`, `public`) ke runner stage yang ramping.
- **D-08:** Node Native Signal Handler / Tini Wrapper — **Reversibility:** reversible — Menangani sinyal SIGTERM/SIGINT agar container shutdown secara instan dan graceful saat `docker stop` tanpa timeout 10s.

### Asset Serving & Production Runtime
- **D-09:** Standalone Nitro/Vinxi Built-in Static Server — **Reversibility:** costly — Menjalankan `.output/server/index.mjs` secara mandiri; runtime Nitro otomatis melayani static assets dan SSR streaming tanpa dependensi reverse proxy eksternal tambahan.
- **D-10:** Immutable Caching untuk Hashed Assets & Fresh SSR HTML — **Reversibility:** reversible — Asset dengan hash mendapatkan `Cache-Control: public, max-age=31536000, immutable` untuk performa instan, sementara respon SSR HTML selalu segar tanpa caching stale.
- **D-11:** Explicit Defaults dengan ENV Override — **Reversibility:** reversible — Default PORT 3173 dan HOST 0.0.0.0 disediakan secara andal, namun tetap dapat di-override dinamis via environment variable sistem/Docker tanpa perlu build ulang image.
- **D-12:** Clean Structured Minimalist Request Logging — **Reversibility:** reversible — Log akses ringkas (HTTP method, path, status, latency) tanpa mencatat payload rahasia atau data sensitif.

### Container Validation & Test Suite Scope
- **D-13:** Dedicated Automated Container Smoke Test — **Reversibility:** reversible — Script pengujian otomatis (`tests/docker-smoke.test.js`) yang memverifikasi container build, health status, dan response HTTP 200 dengan payload HTML SSR lengkap di port 3173.
- **D-14:** Multi-Tier Test Scripts di `package.json` — **Reversibility:** reversible — Menyediakan skrip modular: `npm test` (unit test), `npm run test:e2e` (Playwright E2E), `npm run test:smoke` (container smoke test), serta komposit `npm run test:all`.
- **D-15:** Full Document Integrity Assertions per Rute — **Reversibility:** reversible — Memvalidasi respons HTML lengkap: `/` memuat OpenGraph & cards, `/course/ai` memuat shell silabus Agentic AI, dan `/course/word` memuat shell silabus Word dan skeleton tanpa error hydration.
- **D-16:** 100% Zero-Regression Guarantee untuk 13 Legacy Unit Test Suite — **Reversibility:** costly — Seluruh 13 unit test suite legacy di `tests/*.test.js` wajib tetap lulus 100% untuk menjamin backward-compatibility logika bisnis platform.

### the agent's Discretion
- Pemilihan detail opsi optimasi Vinxi/Nitro untuk file-compression (brotli/gzip pre-compress jika didukung preset node-server).
- Format internal helper script untuk docker smoke test runner.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Roadmap & Requirements
- `.planning/ROADMAP.md` §Phase 23 — Sasaran Phase 23 dan kriteria sukses DEPLOY-01 s/d DEPLOY-04
- `.planning/REQUIREMENTS.md` §Category 5 (DEPLOY) — Rincian spesifikasi DEPLOY-01, DEPLOY-02, DEPLOY-03, DEPLOY-04
- `.planning/PROJECT.md` — Core value platform, multi-course context, dan arah arsitektur v3.0

### Prior Context & Foundations
- `.planning/phases/19-tanstack-start-full-stack-tooling-foundation/19-CONTEXT.md` — Fondasi toolchain Vinxi/TanStack Start, konvensi Port 3173, dan aturan audit container Docker

### Infrastructure & Runtime Config
- `Dockerfile` — Konfigurasi multi-stage build Node 20 Alpine
- `docker-compose.yml` — Orkestrasi runtime service learnwith pada port 3173
- `app.config.ts` — Konfigurasi server Vinxi / TanStack Start

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `app/components/ClientOnly.tsx`: Boundary pelindung komponen interaktif client-side yang bergantung pada `localStorage`.
- `app/routes/__root.tsx`: Kerangka dokumen HTML root dengan `<Meta />`, `<Links />`, `<Scripts />`, `<ScrollRestoration />`.
- `app/routes/index.tsx`, `app/routes/course.ai.tsx`, `app/routes/course.word.tsx`: Rute inti yang akan dioptimasi strategi SSR-nya.
- `tests/*.test.js`: 13 suite unit test yang harus tetap lulus 100%.

### Established Patterns
- Nitro preset `node-server` dengan port 3173 sebagai baseline runtime.
- Web Crypto API SHA-256 passkey hashing pada server boundary.
- Namespaced localStorage isolation (`learnwith_ai_*` vs `learnwith_word_*`).

### Integration Points
- `Dockerfile` & `docker-compose.yml`: Target deployment container produksi.
- `package.json`: Skrip pengujian multi-tier (`test`, `test:e2e`, `test:smoke`, `test:all`).
- `.output/server/index.mjs`: Entrypoint runtime mandiri container.

</code_context>

<specifics>
## Specific Ideas
- Port 3173 tetap menjadi port standar runtime produksi dan dev.
- Skrip healthcheck Docker menggunakan native Node.js global fetch inline tanpa ketergantungan utility Alpine eksternal.

</specifics>

<deferred>
## Deferred Ideas
- **Automated PDF Module Ingestion to Interactive Workshop Generator** (dari Phase 19): Ingest modul PDF dan pembuatan workshop otomatis di server.
- **Centralized PostgreSQL & Vector Search** (dari REQUIREMENTS.md): Integrasi database relasional dan semantic search.

</deferred>

---

*Phase: 23-Route-Level SSR Optimization & Production Docker Target*
*Context gathered: 2026-09-08*
