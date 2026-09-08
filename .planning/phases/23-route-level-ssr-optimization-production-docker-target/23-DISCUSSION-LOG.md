# Phase 23: Route-Level SSR Optimization & Production Docker Target - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-09-08
**Phase:** 23-route-level-ssr-optimization-production-docker-target
**Areas discussed:** Route SSR Strategy, Docker Hardening & Healthcheck, Asset Serving & Production Runtime, Container Validation & Test Suite Scope

---

## Route SSR Strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Full SSR Shell + <ClientOnly> Islands | Server merender struktur silabus & metadata, sementara widget stateful (checklist, quiz, passkey) di-mount secara aman di client via ClientOnly boundary | ✓ |
| Full SSR Hydration Langsung | Seluruh komponen dicoba render di server dengan initial state, lalu rehidrasi sinkron ke localStorage di client | |
| Client-Only SPA Route | Rute /course/ai dan /course/word dijadikan client-only route (SPA mode), hanya shell root yang di-SSR | |

**User's choice:** Full SSR Shell + <ClientOnly> Islands
**Notes:** Menjaga TTFB dan SEO tetap maksimal sekaligus menghindari hydration mismatch pada widget stateful berbasis localStorage.

| Option | Description | Selected |
|--------|-------------|----------|
| Full SSR dengan Dynamic Metadata & Streaming | Server merender layout, OpenGraph tags, dan course summary secara langsung untuk TTFB instan dan SEO optimal | ✓ |
| Static Pre-rendering (SSG) | Frontpage diprerender saat build time menjadi HTML statis murni | |
| You decide | Serahkan penentuan teknis terbaik kepada Antigravity | |

**User's choice:** Full SSR dengan Dynamic Metadata & Streaming
**Notes:** Frontpage Hub `/` menggunakan full SSR untuk metadata OpenGraph instan.

| Option | Description | Selected |
|--------|-------------|----------|
| Preload on Intent (Hover/Touch) | Router otomatis preload loader bundle saat kursor diarahkan ke card/link, menghasilkan transisi halaman instan | ✓ |
| Preload Disabled (On Click) | Pemuatan rute hanya dieksekusi saat link benar-benar diklik (menghemat bandwidth) | |
| You decide | Serahkan penentuan teknis terbaik kepada Antigravity | |

**User's choice:** Preload on Intent (Hover/Touch)
**Notes:** Meningkatkan perceived performance saat transisi antar halaman.

| Option | Description | Selected |
|--------|-------------|----------|
| Dedicated Branded 404 & Error Component | Tampilan visual bernuansa NotebookLM dengan monogram LY, pesan informatif, dan tombol Kembali ke Beranda yang ramah pengguna | ✓ |
| Minimalist Simple Fallback | Tampilan fallback sederhana dan ringkas standar router | |
| You decide | Serahkan penentuan teknis terbaik kepada Antigravity | |

**User's choice:** Dedicated Branded 404 & Error Component
**Notes:** Konsistensi desain antarmuka bagi pengguna pemula jika menemui rute error.

---

## Docker Hardening & Healthcheck

| Option | Description | Selected |
|--------|-------------|----------|
| Non-Root User (USER node) | Menjalankan proses Node di container menggunakan user 'node' non-root (standar keamanan CIS & OWASP) dengan kepemilikan folder yang sesuai | ✓ |
| Default Root User | Tetap menggunakan user root seperti konfigurasi awal | |
| You decide | Serahkan penentuan teknis terbaik kepada Antigravity | |

**User's choice:** Non-Root User (USER node)
**Notes:** Standar keamanan container produksi untuk mencegah privilege escalation.

| Option | Description | Selected |
|--------|-------------|----------|
| Native Node.js Healthcheck | Menggunakan inline script node -e dengan native fetch (bawaan Node 20+) ke http://localhost:3173/ tanpa perlu install wget/curl tambahan di Alpine | ✓ |
| Alpine Wget/Curl | Menginstall paket curl/wget di image runner untuk mengecek status HTTP port 3173 | |
| You decide | Serahkan penentuan teknis terbaik kepada Antigravity | |

**User's choice:** Native Node.js Healthcheck
**Notes:** Menjaga ukuran image tetap ramping tanpa paket binary tambahan.

| Option | Description | Selected |
|--------|-------------|----------|
| Optimized Multi-Stage Layering | Memisahkan caching layer package*.json + npm ci sebelum copy source code, dan hanya mengoper artefak terkompilasi (.output, public) ke runner stage yang ramping | ✓ |
| Single-Stage Standar | Menggabungkan proses build dan run dalam satu stage sederhana tanpa layer caching terpisah | |
| You decide | Serahkan penentuan teknis terbaik kepada Antigravity | |

**User's choice:** Optimized Multi-Stage Layering
**Notes:** Waktu build lebih cepat jika kode aplikasi diubah tanpa perubahan dependensi.

| Option | Description | Selected |
|--------|-------------|----------|
| Node Native Signal Handler / Tini Process Wrapper | Menjamin forward SIGINT/SIGTERM ditangani dengan baik sehingga container stop secara instan dan graceful tanpa terpaksa dibunuh (SIGKILL) timeout 10s | ✓ |
| Standard Default Node CMD | Menjalankan node secara langsung tanpa penanganan sinyal khusus | |
| You decide | Serahkan penentuan teknis terbaik kepada Antigravity | |

**User's choice:** Node Native Signal Handler / Tini Process Wrapper
**Notes:** Menjamin graceful shutdown saat service di-restart atau dihentikan.

---

## Asset Serving & Production Runtime

| Option | Description | Selected |
|--------|-------------|----------|
| Standalone Nitro/Vinxi Built-in Static Server | Menjalankan .output/server/index.mjs secara mandiri; runtime Nitro otomatis melayani static assets dan SSR streaming tanpa dependensi server eksternal tambahan | ✓ |
| Reverse Proxy Architecture (Nginx Sidecar) | Menambahkan container Nginx di docker-compose.yml untuk melayani static assets secara terpisah | |
| You decide | Serahkan penentuan teknis terbaik kepada Antigravity | |

**User's choice:** Standalone Nitro/Vinxi Built-in Static Server
**Notes:** Arsitektur mandiri dan portabel.

| Option | Description | Selected |
|--------|-------------|----------|
| Immutable Caching untuk Hashed Assets & Fresh SSR HTML | Asset dengan hash mendapatkan Cache-Control: public, max-age=31536000, immutable untuk performa instan, sementara respon SSR HTML selalu segar tanpa caching stale | ✓ |
| Uniform Short Cache | Seluruh respon aset dan HTML menggunakan cache seragam berdurasi singkat | |
| You decide | Serahkan penentuan teknis terbaik kepada Antigravity | |

**User's choice:** Immutable Caching untuk Hashed Assets & Fresh SSR HTML
**Notes:** Kombinasi performa aset maksimal dan kebaruan respon halaman.

| Option | Description | Selected |
|--------|-------------|----------|
| Explicit Defaults with ENV Override | Default PORT 3173 dan HOST 0.0.0.0 disediakan secara andal, namun tetap dapat di-override dinamis via environment variable sistem/Docker tanpa perlu build ulang image | ✓ |
| Strict Hardcoded Configuration | Mengunci nilai PORT 3173 dan HOST secara kaku di dalam kode tanpa fallback env runtime | |
| You decide | Serahkan penentuan teknis terbaik kepada Antigravity | |

**User's choice:** Explicit Defaults with ENV Override
**Notes:** Fleksibel untuk berbagai lingkungan deploy container.

| Option | Description | Selected |
|--------|-------------|----------|
| Clean Structured Minimalist Log | Log ringkas mencakup HTTP method, path, response status, dan latency (ms), tanpa mencatat payload rahasia atau data sensitif | ✓ |
| Verbose Debug Logging | Menampilkan detail header dan log ekstensif untuk setiap request masuk | |
| You decide | Serahkan penentuan teknis terbaik kepada Antigravity | |

**User's choice:** Clean Structured Minimalist Log
**Notes:** Aman dari kebocoran token/kunci dan bersih di production monitoring.

---

## Container Validation & Test Suite Scope

| Option | Description | Selected |
|--------|-------------|----------|
| Dedicated Automated Smoke Script | Script pengujian otomatis (misal tests/docker-smoke.test.js) yang memverifikasi container build, health status, dan response HTTP 200 dengan payload HTML SSR lengkap di port 3173 | ✓ |
| Manual CLI Verification Only | Menjalankan docker compose up --build -d secara manual saat audit tanpa script otomatis tambahan | |
| You decide | Serahkan penentuan teknis terbaik kepada Antigravity | |

**User's choice:** Dedicated Automated Smoke Script
**Notes:** Menjamin verifikasi container terotomasi dalam CI/audit pipeline.

| Option | Description | Selected |
|--------|-------------|----------|
| Multi-Tier Test Scripts | Menyediakan skrip modular di package.json: npm test (unit test cepat), npm run test:e2e (Playwright browser E2E), dan npm run test:smoke (container smoke test), serta komposit npm run test:all | ✓ |
| Single Monolithic Test Script | Menggabungkan seluruh unit, e2e, dan smoke test dalam satu baris npm test saja | |
| You decide | Serahkan penentuan teknis terbaik kepada Antigravity | |

**User's choice:** Multi-Tier Test Scripts
**Notes:** Fleksibel untuk local dev cepat vs verifikasi menyeluruh sebelum rilis.

| Option | Description | Selected |
|--------|-------------|----------|
| Full Document Integrity per Route | Memvalidasi respons HTML lengkap: `/` memuat OpenGraph & cards, `/course/ai` memuat shell silabus Agentic AI, dan `/course/word` memuat shell silabus Word dan skeleton tanpa error hydration | ✓ |
| Status Code 200 Saja | Hanya memvalidasi bahwa setiap rute mengembalikan HTTP 200 OK tanpa parsing payload HTML | |
| You decide | Serahkan penentuan teknis terbaik kepada Antigravity | |

**User's choice:** Full Document Integrity per Route
**Notes:** Memastikan seluruh halaman menyajikan kerangka SSR yang valid.

| Option | Description | Selected |
|--------|-------------|----------|
| 100% Zero-Regression Guarantee | Seluruh 13 unit test suite legacy di tests/*.test.js wajib tetap lulus 100% untuk menjamin backward-compatibility logika bisnis platform | ✓ |
| Modernize & Consolidate | Merefaktor dan menggabungkan sebagian suite lama ke dalam format pengujian yang lebih baru | |
| You decide | Serahkan penentuan teknis terbaik kepada Antigravity | |

**User's choice:** 100% Zero-Regression Guarantee
**Notes:** Menjamin tidak ada fitur atau logika yang rusak selama migrasi.

---

## the agent's Discretion

- Optimasi kompresi Vinxi/Nitro untuk file statis.
- Detail format helper script test smoke container.

## Deferred Ideas

- Ingest modul PDF otomatis untuk pembuatan silabus kurikulum di server.
- Database PostgreSQL terpusat dan Vector search untuk modul pembelajaran.
