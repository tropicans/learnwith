# Roadmap: learnwith — Interactive Training Platform (Multi-Course)

## Milestones

- ✅ **v1.0 Pre-Training Interactive Web App (Agentic AI)** - Phases 1-4 (shipped 2026-09-03) — [Archive](milestones/v1.0-ROADMAP.md)
- ✅ **v1.1 Live Workshop Guide (Agentic AI Hari-H)** - Phases 5-8 (shipped 2026-09-07) — [Archive](milestones/v1.1-ROADMAP.md)
- ✅ **v2.0 Multi-Course Platform & Modul Pengolahan Kata Tingkat Lanjut** - Phases 9-12 (shipped 2026-09-07) — [Archive](milestones/v2.0-ROADMAP.md)
- ✅ **v2.1 Google NotebookLM-Inspired UI/UX Overhaul & Workspace Architecture** - Phases 13-15 (shipped 2026-09-07) — [Archive](milestones/v2.1-ROADMAP.md)
- ✅ **v2.2 Application Security Hardening & Anti-Breach Protection** - Phases 16-18 (shipped 2026-09-07) — [Archive](milestones/v2.2-phases)
- ✅ **v3.0 TanStack Start Full-Document SSR & File-Based Router Migration** - Phases 19-23 (shipped 2026-09-08) — [Archive](milestones/v3.0-ROADMAP.md)
- ✅ **v3.1 Pre-Training Parity in TanStack Start** - Phases 24-28 (shipped 2026-09-09) — [Archive](milestones/v3.1-ROADMAP.md)
- 🚀 **v3.2 Admin Command Center, Telemetry & Authentication** - Phases 29-33 (Active)

---

## Active Milestone: v3.2 (Phases 29-33)

### Phase 29: Master Admin Authentication, Route Protection & Google OAuth Architecture
**Status**: ✅ Complete (2/2 plans shipped, verified 2026-09-09)  
**Goal**: Mengimplementasikan sistem autentikasi admin di rute `/admin`, validasi timing-safe SHA-256 hash via `createServerFn`, session cookie/token management, proteksi logout, dan persiapan antarmuka arsitektur Google OAuth.  
**Depends on**: Phase 28 (v3.1)  
**Requirements**: ADMIN-AUTH-01, ADMIN-AUTH-02, ADMIN-AUTH-03, ADMIN-AUTH-04, ADMIN-QA-01  
**Plans**: 2 plans (2 shipped)  

**Success Criteria**:
1. Rute `/admin` terlindungi; akses tanpa sesi yang valid menampilkan layar otentikasi Master Admin Passkey. (✅ Shipped)
2. Validasi kredensial dieksekusi di server via `createServerFn` dengan timing-safe hash comparison tanpa membocorkan hash ke bundle client. (✅ Shipped)
3. Tombol dan alur Google OAuth disiapkan (ready-state dengan parameter Client ID dan error handling terstruktur). (✅ Shipped)
4. Logout berhasil menghapus sesi admin dan me-redirect ke login screen. (✅ Shipped)

---

### Phase 30: Server Telemetry Ingestion API & Participant Background Client
**Status**: ✅ Complete (2/2 plans shipped, verified 2026-09-09)  
**Goal**: Membangun endpoint server internal TanStack Start untuk menerima heartbeat progres peserta, memvalidasi schema dengan Zod, menyimpannya di structured server store, dan mengintegrasikan pengiriman telemetry non-blocking dari browser peserta.  
**Depends on**: Phase 29  
**Requirements**: ADMIN-TELEM-01, ADMIN-TELEM-02, ADMIN-TELEM-03, ADMIN-QA-01, ADMIN-QA-02  
**Plans**: 2 plans (2 shipped)  

**Success Criteria**:
1. Server Telemetry API menerima dan memvalidasi payload peserta dengan Zod (nama, instansi, courseId, progress percent, checkpoints status, quiz score). (✅ Shipped)
2. Payload tersimpan aman di structured server store tanpa kehilangan data dan dapat di-query oleh modul admin. (✅ Shipped)
3. Klien peserta mengirimkan heartbeat/progress update secara asinkron (non-blocking) saat checklist/checkpoint diverifikasi tanpa mengganggu UX peserta. (✅ Shipped)

---

### Phase 31: Admin Command Center Dashboard & Participant Progress Monitoring
**Status**: ✅ Complete (2/2 plans shipped, verified 2026-09-09)  
**Goal**: Membangun antarmuka dashboard admin yang menampilkan ringkasan metrik agregat KPI, tabel peserta interaktif dengan pencarian dan filter, modal inspeksi detail peserta, dan fitur ekspor CSV/JSON 1-klik.  
**Depends on**: Phase 30  
**Requirements**: ADMIN-DASH-01, ADMIN-DASH-02, ADMIN-DASH-03, ADMIN-DASH-04  
**Plans**: 2 plans (2 shipped)  

**Success Criteria**:
1. Dashboard admin menampilkan 4 kartu KPI agregat (Total Peserta, Penyelesaian Checkpoint, Rata-rata Skor Kuis, Rasio Siap Workshop).
2. Tabel peserta mendukung filter kursus (`ai` vs `word`), status kesiapan, status online/offline, dan pencarian instansi/nama instan.
3. Drawer/modal detail peserta menampilkan rincian progres modul, status tiap checkpoint, dan hasil kuis Bab V.
4. Tombol ekspor mengekstrak data tabel ke format CSV dan JSON yang valid dalam 1-klik.

---

### Phase 32: Workshop Access Passkey Management & Troubleshooting Audit Hub
**Status**: ✅ Complete (2/2 plans shipped, verified 2026-09-09)  
**Goal**: Membangun konsol manajemen kode akses passkey modul kedinasan (Course 2) dan pusat audit pencarian agregasi kendala troubleshooting runtime peserta.  
**Depends on**: Phase 31  
**Requirements**: ADMIN-PASS-01, ADMIN-PASS-02, ADMIN-PASS-03, ADMIN-LOG-01, ADMIN-LOG-02  
**Plans**: 2 plans (2 shipped)  

**Success Criteria**:
1. Admin dapat melihat status aktif passkey workshop dinas dan merotasi/memperbarui passkey via server function terproteksi. (✅ Shipped)
2. Log percobaan unlock passkey tercatat dengan audit timestamp dan status (berhasil vs gagal). (✅ Shipped)
3. Admin dapat mencari dan memfilter isu runtime peserta (bentrok port 20128, error OAuth, execution policy PowerShell) untuk koordinasi asistensi kelas. (✅ Shipped)

---

### Phase 33: Global Platform Configuration, Announcement Banner & E2E Zero-Regression
**Goal**: Mengimplementasikan kontrol konfigurasi platform global (toggle mode pretraining/live), Banner Pengumuman Siaran yang tampil di sisi peserta, dan eksekusi test suite komprehensif tanpa regresi.  
**Depends on**: Phase 32  
**Requirements**: ADMIN-CFG-01, ADMIN-CFG-02, ADMIN-QA-01, ADMIN-QA-02  
**Plans**: 2 plans  

**Success Criteria**:
1. Admin dapat menyalakan/mematikan mode workshop (Pre-training / Live Class) secara global.
2. Banner Pengumuman Global yang diset admin langsung tampil di seluruh halaman peserta dengan opsi dismiss.
3. Seluruh unit test rute admin lulus dan 100% test suite existing (`116/116`) lulus tanpa regresi.

---

## Phases Archive

<details>
<summary>✅ v3.1 Pre-Training Parity in TanStack Start (Phases 24-28) — SHIPPED 2026-09-09</summary>

- [x] Phase 24: Pre-Training Foundation Sections & Data Extraction (2/2 plans) — completed 2026-09-08
- [x] Phase 25: Interactive Modules 1–5 & 1-Click Copy Engine (2/2 plans) — completed 2026-09-09
- [x] Phase 26: Checklist Engine, Checkpoint Gates & Dynamic Readiness (2/2 plans) — completed 2026-09-09
- [x] Phase 27: Troubleshooting Hub & Secret Token Redaction Assistant (2/2 plans) — completed 2026-09-09
- [x] Phase 28: Laporan Kesiapan Generator, Sidebar Sync & E2E Zero-Regression (2/2 plans) — completed 2026-09-09

</details>

<details>
<summary>✅ v3.0 TanStack Start Full-Document SSR & File-Based Router Migration (Phases 19-23) — SHIPPED 2026-09-08</summary>

- [x] Phase 19: TanStack Start & Full-Stack Tooling Foundation (4/4 plans) — completed 2026-09-08
- [x] Phase 20: File-Based Routes & Search Params Validation (3/3 plans) — completed 2026-09-08
- [x] Phase 21: Typed Route Loaders, Full-Document SSR & Progressive Streaming (3/3 plans) — completed 2026-09-08
- [x] Phase 22: Typed Server Functions & Boundary Isolation (3/3 plans) — completed 2026-09-08
- [x] Phase 23: Route-Level SSR Optimization & Production Docker Target (2/2 plans) — completed 2026-09-08

</details>
