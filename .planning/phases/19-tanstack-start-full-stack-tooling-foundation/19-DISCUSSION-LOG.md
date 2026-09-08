# Phase 19: TanStack Start & Full-Stack Tooling Foundation - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-09-08
**Phase:** 19-tanstack-start-full-stack-tooling-foundation
**Areas discussed:** React Version & Runtime, Folder Structure & Asset Migration, Package Manager & Build Scripts, Validation & Testing Setup

---

## React Version & Runtime

| Option | Description | Selected |
|--------|-------------|----------|
| React 19 (`^19.0.0`) | Standar modern terkini TanStack Start dengan dukungan penuh async streaming, native hooks, dan future-proof untuk v3.0 | ✓ |
| React 18.3 (`^18.3.1`) | Lebih konservatif dan stabil jika ada kekhawatiran kompatibilitas modul pihak ketiga | |
| Serahkan pada agen | Pilih React 19 | |

**User's choice:** Gunakan React 19 (`^19.0.0`)
**Notes:** Menjadi basis runtime TanStack Start v3.0.

| Option | Description | Selected |
|--------|-------------|----------|
| Strict Mode penuh | `strict: true`, `moduleResolution: "Bundler"`, `jsx: "react-jsx"` di `tsconfig.json` | ✓ |
| Pragmatic / Relaxed Mode | Toleransi lebih longgar | |
| Serahkan pada agen | Strict Mode | |

**User's choice:** Strict Mode penuh
**Notes:** Validasi tipe ketat untuk route generator dan typed server function RPC.

| Option | Description | Selected |
|--------|-------------|----------|
| Progressive HTML Streaming | `defaultStreamHandler` dari TanStack Start dengan React Suspense stream | ✓ |
| Buffer / Complete HTML Response | Response dikirim utuh tanpa chunk streaming | |
| Serahkan pada agen | Progressive Streaming | |

**User's choice:** Progressive HTML Streaming
**Notes:** Mengaktifkan progressive streaming HTML ke browser.

| Option | Description | Selected |
|--------|-------------|----------|
| Standard Client Hydration | `StartClient` dengan `hydrateRoot` dan dev error reporting | ✓ |
| Lenient Hydration | Error boundary fallback | |
| Serahkan pada agen | Standard hydration | |

**User's choice:** Standard Client Hydration
**Notes:** Standar resmi TanStack Start untuk deteksi mismatch dini.

---

## Folder Structure & Asset Migration

| Option | Description | Selected |
|--------|-------------|----------|
| Pertahankan file legacy berdampingan | Kode TanStack Start di folder `app/`, file legacy (`index.html`, `assets/`, `config.js`) tetap utuh | ✓ |
| Langsung migrasi struktur asset | Pindahkan asset ke `public/` atau `app/styles/` sejak awal | |
| Serahkan pada agen | Koeksistensi berdampingan | |

**User's choice:** Pertahankan file legacy berdampingan
**Notes:** Menghindari regresi pada test runner dan file existing selama migrasi bertahap.

| Option | Description | Selected |
|--------|-------------|----------|
| Standar `@/*` -> `./app/*` | Path alias konvensi TanStack Start | ✓ |
| Multi-alias eksplisit | `@app/*`, `@components/*`, `@styles/*`, `@assets/*` | |
| Serahkan pada agen | Standar `@/*` | |

**User's choice:** Standar `@/*` -> `./app/*`
**Notes:** Format standar untuk pemanggilan modul bersih.

| Option | Description | Selected |
|--------|-------------|----------|
| Folder `public/` standar Vite/Vinxi | Static assets (`favicon.svg`, icons) disajikan di root `/` | ✓ |
| Konfigurasi static router custom di Vinxi | Mengarahkan penyajian dari folder `assets/` langsung | |
| Serahkan pada agen | Folder `public/` standar | |

**User's choice:** Folder `public/` standar Vite/Vinxi
**Notes:** Konvensi Vite & Vinxi paling stabil dan mudah dipelihara.

| Option | Description | Selected |
|--------|-------------|----------|
| Vite Pipeline Imports via Root Route | Import stylesheet di root route agar terbundling dan diinject via `<Links />` | ✓ |
| Static Link Tags | Menyisipkan tag `<link rel="stylesheet">` biasa | |
| Serahkan pada agen | Vite Pipeline Imports | |

**User's choice:** Vite Pipeline Imports via Root Route
**Notes:** Mencegah Flash of Unstyled Content (FOUC).

---

## Package Manager & Build Scripts

| Option | Description | Selected |
|--------|-------------|----------|
| npm (`package-lock.json`) | Standar bawaan Node.js, universal, selaras dengan container Docker | ✓ |
| pnpm (`pnpm-lock.yaml`) | Disk caching dan kecepatan | |
| Serahkan pada agen | npm | |

**User's choice:** npm (`package-lock.json`)
**Notes:** Universal dan tanpa tool CLI ekstra.

| Option | Description | Selected |
|--------|-------------|----------|
| Skrip lengkap terpadu | `dev`, `build`, `start`, `typecheck`, `test:node`, `test` | ✓ |
| Skrip minimalis | `dev`, `build`, `start` | |
| Serahkan pada agen | Skrip lengkap | |

**User's choice:** Skrip lengkap terpadu
**Notes:** Standar lifecycle lengkap.

| Option | Description | Selected |
|--------|-------------|----------|
| Port default 3000 | Port standar Vinxi / TanStack Start | |
| Port 8000 | Menyamakan dengan server lokal Python lama | |
| Port unik 3173 (Freeform) | Hindari port 3000, gunakan port unik 3173 | ✓ |

**User's choice:** Port unik 3173 ("cari port unik jangan gunakan port 3000")
**Notes:** User secara eksplisit meminta port unik agar tidak bentrok dengan service lokal lain. Disepakati port 3173.

| Option | Description | Selected |
|--------|-------------|----------|
| Standar Vinxi `.output/` | Direktori default Vinxi, tambahkan `.output/` dan `.vinxi/` ke `.gitignore` | ✓ |
| Kustom direktori `dist/` | Konvensional folder `dist/` | |
| Serahkan pada agen | Standar `.output/` | |

**User's choice:** Standar Vinxi `.output/`
**Notes:** Selaras dengan preset build Vinxi/Nitro.

**Catatan Arsitektur Khusus (User input):**
User menegaskan pemisahan tegas antara frontend dan backend ("bedakan antara frontend dan backend"), dengan visi masa depan untuk mengunggah modul PDF yang langsung di-generate otomatis menjadi halaman workshop interaktif. Arsitektur backend diisolasi di `app/server/` untuk menyambut kapabilitas ini.

---

## Validation & Testing Setup

| Option | Description | Selected |
|--------|-------------|----------|
| Dual Verification | Verifikasi kompilasi TypeScript (`tsc --noEmit`), build (`vinxi build`), dan tes respons HTTP SSR entry point | ✓ |
| Build Verification Saja | Hanya `vinxi build` | |
| Serahkan pada agen | Dual Verification | |

**User's choice:** Dual Verification
**Notes:** Validasi komprehensif pondasi Phase 19.

| Option | Description | Selected |
|--------|-------------|----------|
| Pertahankan kelulusan 100% Test Suite Legacy | 11 file test di `tests/*.test.js` tetap lulus via `node --test` | ✓ |
| Migrasi ke Vitest sekarang | Merombak file test lama ke Vitest | |
| Serahkan pada agen | Pertahankan test suite legacy | |

**User's choice:** Pertahankan kelulusan 100% Test Suite Legacy
**Notes:** Tidak ada regresi fungsionalitas lama.

| Option | Description | Selected |
|--------|-------------|----------|
| Minimalis & Cepat | Cukup andalkan `tsc --noEmit` (Strict TypeScript) di Phase 19 | ✓ |
| Pasang ESLint + TypeScript plugin | Tambah konfigurasi eslint | |
| Serahkan pada agen | Minimalis TypeScript | |

**User's choice:** Minimalis & Cepat
**Notes:** Fokus penuh pada pondasi framework tanpa overhead linter di Phase 19.

| Option | Description | Selected |
|--------|-------------|----------|
| Siapkan fondasi Dockerfile selaras aturan audit | Pastikan Dockerfile siap mem-build dan menjalankan image TanStack Start pada port unik 3173 saat audit | ✓ |
| Fokus verifikasi runtime Node lokal terlebih dahulu | Audit runtime lokal Node 20+, hardening container di Phase 23 | |
| Serahkan pada agen | Siapkan fondasi Dockerfile | |

**User's choice:** Siapkan fondasi Dockerfile selaras aturan audit
**Notes:** Selaras dengan aturan global user ("selesai bug fixing, lakukan build and up di docker untuk kemudian commit dan push").

---

## the agent's Discretion

- Penyesuaian minor versi library pendukung TanStack Start & Query.
- Setup template minimalis untuk `app/router.tsx` dan `app/routes/__root.tsx`.

## Deferred Ideas

- **Automated PDF Module Ingestion to Interactive Workshop Generator**: Kemampuan sistem di masa depan untuk mengunggah modul dokumen PDF, mem-parsing kontennya di server, dan secara otomatis menghasilkan kurikulum interaktif (panduan, checklist, kuis) serupa dengan Course 1 & 2 yang sudah ada.
