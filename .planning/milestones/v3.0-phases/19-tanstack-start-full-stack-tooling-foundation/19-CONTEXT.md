# Phase 19: TanStack Start & Full-Stack Tooling Foundation - Context

**Gathered:** 2026-09-08
**Status:** Ready for planning

<domain>
## Phase Boundary

Menyiapkan struktur dasar full-stack TanStack Start, bundler Vinxi/Vite, TypeScript strict configuration (`tsconfig.json`), dan entry points SSR/client (`app/client.tsx`, `app/ssr.tsx`). Menjamin keutuhan test suite legacy (11 file unit test), memisahkan backend (`app/server/`) dan frontend (`app/routes/`, `app/components/`), menetapkan port unik 3173 untuk dev & production runtime, serta memastikan container Docker siap diverifikasi selaras dengan aturan audit completion phase.

</domain>

<decisions>
## Implementation Decisions

### React Version & Runtime
- **D-01:** Gunakan React 19 (`react@^19.0.0`, `react-dom@^19.0.0`) sebagai basis TanStack Start & Vinxi — **Reversibility:** costly — Mengganti versi React di kemudian hari memerlukan penyesuaian dependensi framework dan typing.
- **D-02:** Strict Mode penuh pada `tsconfig.json` (`strict: true`, `moduleResolution: "Bundler"`, `jsx: "react-jsx"`), dengan path alias `@/*` mengarah ke `./app/*` — **Reversibility:** reversible.
- **D-03:** Progressive HTML Streaming pada `app/ssr.tsx` menggunakan `defaultStreamHandler` dari TanStack Start (`@tanstack/react-start/server`) untuk streaming chunk respons & React Suspense native — **Reversibility:** costly.
- **D-04:** Standard Client Hydration pada `app/client.tsx` menggunakan `StartClient` dengan `hydrateRoot` standar TanStack Start dan dev error reporting — **Reversibility:** reversible.

### Folder Structure & Asset Migration
- **D-05:** Pertahankan file legacy berdampingan (`index.html`, `assets/`, `config.js`) dalam root project selama migrasi bertahap v3.0 agar test runner dan fungsionalitas lama tetap 100% utuh — **Reversibility:** reversible.
- **D-06:** Gunakan folder `public/` standar Vite/Vinxi untuk static assets (`favicon.svg`, icons, robots) yang otomatis disajikan pada root `/` — **Reversibility:** reversible.
- **D-07:** Impor stylesheet CSS (`main.css`, `components.css`) via root document route pipeline Vite & `<Links />` untuk mengeliminasi Flash of Unstyled Content (FOUC) saat SSR streaming — **Reversibility:** reversible.

### Package Manager & Build Scripts
- **D-08:** Gunakan `npm` (`package-lock.json`) bawaan standar Node.js untuk dependensi `package.json` — **Reversibility:** reversible.
- **D-09:** Skrip perintah lengkap terpadu di `package.json` (`dev`, `build`, `start`, `typecheck`, `test:node`, `test`) — **Reversibility:** reversible.
- **D-10:** Gunakan Port unik **3173** (bukan port default 3000) untuk development server (`vinxi dev`) dan runtime production container agar tidak bentrok dengan service lain — **Reversibility:** reversible.
- **D-11:** Standar direktori build Vinxi `.output/` (`.output/server`, `.output/public`), serta tambahkan `.output/` dan `.vinxi/` ke `.gitignore` — **Reversibility:** reversible.
- **D-12:** Pemisahan arsitektur terisolasi antara Frontend (`app/routes/`, `app/components/`) dan Backend (`app/server/` dengan `createServerFn`) untuk mengakomodasi pipeline parsing PDF modul dan AI generator di masa depan tanpa membocorkan logika backend ke client bundle — **Reversibility:** costly — Fondasi arsitektur boundary v3.0.

### Validation & Testing Setup
- **D-13:** Dual Verification untuk baseline Phase 19: validasi kompilasi TypeScript (`tsc --noEmit`), artefak build (`vinxi build`), dan tes respons HTTP SSR entry point — **Reversibility:** reversible.
- **D-14:** Pertahankan kelulusan 100% untuk 11 unit test suite legacy di `tests/*.test.js` melalui Node test runner (`node --test`) yang diintegrasikan ke skrip `npm test` — **Reversibility:** reversible.
- **D-15:** Minimalis & cepat untuk linter: cukup andalkan `tsc --noEmit` (Strict TypeScript) untuk validasi kode di Phase 19 tanpa beban ESLint tambahan — **Reversibility:** reversible.
- **D-16:** Siapkan target Dockerfile/Docker Compose selaras aturan audit global project: pastikan container dapat dibuild dan dijalankan pada port unik 3173 saat audit completion phase — **Reversibility:** costly.

### the agent's Discretion
- Pemilihan versi minor pustaka pendukung (`@tanstack/react-start`, `@tanstack/react-router`, `@tanstack/router-plugin`, `@tanstack/react-query`, `vinxi`, `zod`).
- Struktur internal awal di `app/` untuk router instance (`app/router.tsx`) dan root route skeleton (`app/routes/__root.tsx`).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Roadmap & Requirements
- `.planning/ROADMAP.md` — Definisi Milestone v3.0, cakupan Phase 19, dan kriteria sukses FOUND-01 s/d FOUND-04
- `.planning/REQUIREMENTS.md` §Category 1: Framework & Tooling Foundation (FOUND) — Detail spesifikasi FOUND-01, FOUND-02, FOUND-03, FOUND-04
- `.planning/PROJECT.md` — Core value platform, multi-course context, dan arah arsitektur v3.0

### Technical Stack & Architecture
- `.planning/research/STACK.md` — Versi pustaka inti TanStack Start, React 19, Vinxi, TypeScript 5.4, Zod
- `.planning/research/ARCHITECTURE.md` — Pola SSR streaming, typed server functions, dan routing TanStack Start
- `.planning/research/PITFALLS.md` — Pencegahan server hydration mismatches dan pencegahan kebocoran server code ke browser

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `assets/css/main.css` & `assets/css/components.css`: Sistem desain UI, color tokens, glassmorphism, dan komponen UI siap diimpor via Vite pipeline.
- `favicon.svg`: Monogram LY Emblem (Konsep 5) untuk icon brand platform.
- `tests/*.test.js`: 11 file test suite (checkpoint, exporter, CSP, search security, multi-course, word-quiz, dll.) yang harus tetap lulus 100%.
- `config.js`: Hash kunci sandi Web Crypto API dan konfigurasi security yang nantinya akan dimigrasikan ke backend boundary.

### Established Patterns
- Zero Plaintext Web Crypto passkey hashing (diterapkan di v2.2).
- Isolated Course 1 & Course 2 data structures.
- Strict CSP and anti-framing security rules.

### Integration Points
- `app.config.ts` & `package.json`: Menjadi entry point konfigurasi root baru untuk build system.
- `app/client.tsx` & `app/ssr.tsx`: Menjadi gerbang runtime baru untuk request/response cycle.
- `tests/`: Terintegrasi ke script `npm test` di `package.json`.

</code_context>

<specifics>
## Specific Ideas
- Port development server dan container dialokasikan khusus pada **Port 3173** untuk mencegah konflik port lokal.
- Pemisahan bersih struktur `app/server/` untuk mempersiapkan fitur masa depan: generator workshop otomatis dari modul dokumen PDF.

</specifics>

<deferred>
## Deferred Ideas
- **Automated PDF Module Ingestion to Interactive Workshop Generator**: Kemampuan sistem di masa depan untuk mengunggah modul dokumen PDF, mem-parsing kontennya di server, dan secara otomatis menghasilkan kurikulum interaktif (panduan, checklist, kuis) serupa dengan Course 1 & 2 yang sudah ada.

</deferred>

---

*Phase: 19-TanStack Start & Full-Stack Tooling Foundation*
