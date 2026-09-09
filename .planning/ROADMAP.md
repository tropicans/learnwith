# Roadmap: Milestone v3.1 Pre-Training Parity in TanStack Start

## Milestones Overview

- ✅ **v1.0 Pre-Training Interactive Web App (Agentic AI)** - Phases 1-4 (shipped 2026-09-03) — [Archive](milestones/v1.0-ROADMAP.md)
- ✅ **v1.1 Live Workshop Guide (Agentic AI Hari-H)** - Phases 5-8 (shipped 2026-09-07) — [Archive](milestones/v1.1-ROADMAP.md)
- ✅ **v2.0 Multi-Course Platform & Modul Pengolahan Kata Tingkat Lanjut** - Phases 9-12 (shipped 2026-09-07) — [Archive](milestones/v2.0-ROADMAP.md)
- ✅ **v2.1 Google NotebookLM-Inspired UI/UX Overhaul & Workspace Architecture** - Phases 13-15 (shipped 2026-09-07) — [Archive](milestones/v2.1-ROADMAP.md)
- ✅ **v2.2 Application Security Hardening & Anti-Breach Protection** - Phases 16-18 (shipped 2026-09-07) — [Archive](milestones/v2.2-phases)
- ✅ **v3.0 TanStack Start Full-Document SSR & File-Based Router Migration** - Phases 19-23 (shipped 2026-09-08) — [Archive](milestones/v3.0-ROADMAP.md)
- 🚀 **v3.1 Pre-Training Parity in TanStack Start** - Phases 24-28 (Active)

---

## Active Milestone: v3.1 (Phases 24-28)

### Phase 24: Pre-Training Foundation Sections & Data Extraction

**Goal**: Ekstraksi konten lengkap panduan dasar dan implementasi komponen modular React 19 untuk Target & Alur, Glosarium interaktif, Aturan Keamanan, Alat & Persiapan, serta Panduan PowerShell pada `/course/ai?mode=pretraining`.  
**Depends on**: Phase 23 (v3.0)  
**Requirements**: PRE-BASE-01, PRE-BASE-02, PRE-BASE-03, PRE-BASE-04, PRE-BASE-05  
**Plans**: 2 plans

Plans:
- [x] 24-01: Data extraction & typed data schema (pretrainingFoundation.ts) and modular React 19 foundation components (Hero, Target, Glosarium, Security, Prerequisites, PowerShell) (completed 2026-09-08)
- [x] 24-02: Route integration in app/routes/course.ai.tsx, styling fidelity, and automated unit/regression test verification (completed 2026-09-08)

**Success Criteria**:
1. User dapat melihat Target & Alur Pre-Training dengan estimasi waktu dan tahapan visual di route `/course/ai?mode=pretraining`.
2. Glosarium interaktif 10 istilah teknis AI tampil dengan kartu istilah dan badge penjelasan.
3. Aturan Keamanan & Perlindungan Rahasia tampil dengan peringatan keras dan banner security.
4. Spesifikasi Alat & Persiapan Perangkat dan Panduan PowerShell tampil dengan copyable commands dan tip navigasi.

---

### Phase 25: Interactive Modules 1–5 & 1-Click Copy Engine

**Goal**: Membangun modul pembelajaran interaktif Modul 1 s.d. 5 (Node.js, 9Router, Bot Telegram, Hermes Agent, Integrasi Live Chat) dengan kontrol accordion buka-tutup, callout peringatan/tips, dan mesin 1-click copy dengan toast feedback.  
**Depends on**: Phase 24  
**Requirements**: PRE-MOD-01, PRE-MOD-02, PRE-MOD-03, PRE-MOD-04, PRE-MOD-05, PRE-MOD-06  
**Plans**: 2 plans

Plans:
- [x] 25-01: Extract typed dataset (pretrainingModules.ts), 1-Click copy engine with fallback & toast (CopyableCodeBlock.tsx, Toast.tsx), and modular presentation components (PretrainingModuleCard, ModuleArchitectureFlow, CheckpointPreviewCard) (completed 2026-09-09)
- [x] 25-02: Build master accordion section (PretrainingModulesSection.tsx), route integration in course.ai.tsx, and automated unit/regression test suite verification (completed 2026-09-09)

**Success Criteria**:
1. Seluruh Modul 1 sampai Modul 5 dapat dibuka/ditutup secara independen maupun via tombol "Buka Semua" / "Tutup Semua".
2. Seluruh perintah CLI (PowerShell, npm, curl, git, hermes) memiliki tombol 1-Click Copy dengan feedback visual "Tersalin!" instan.
3. Detail teknis (konfigurasi JSON 9Router, format prompt Hermes, allowlist Telegram) tersaji lengkap sesuai panduan resmi.

---

### Phase 26: Checklist Engine, Checkpoint Gates & Dynamic Readiness

**Goal**: Mengintegrasikan sistem verifikasi mandiri berupa 13 checklist langkah, 3 checkpoint gates otomatis, sinkronisasi state persisten ke localStorage (`learnwith_ai_checklist`), dan status kesiapan peserta dinamis.  
**Depends on**: Phase 25  
**Requirements**: PRE-CHK-01, PRE-CHK-02, PRE-CHK-03, PRE-CHK-04  
**Plans**: 2 plans

Plans:
- [x] 26-01: Pretraining state hook with 13 checklist IDs (usePretrainingState.ts), Checkpoint 1-3 gate cards (CheckpointGateCard.tsx, PretrainingCheckpointsSection.tsx), dynamic readiness section, and reset modal (completed 2026-09-09)
- [x] 26-02: Wire interactive checkboxes, hero stats sync, route mounting in course.ai.tsx, and automated unit/regression test suite verification (completed 2026-09-09)

**Success Criteria**:
1. Peserta dapat mencentang 13 item checklist pada modul dan checklist island, dengan status tersimpan persisten di localStorage.
2. Checkpoint 1, 2, dan 3 menghitung kelulusan secara otomatis saat sub-item terpenuhi.
3. Badge kesiapan ("SIAP WORKSHOP" vs "PERLU KLINIK PERSIAPAN") dan progress bar mengupdate persentase secara real-time.
4. Fitur Reset Progres berfungsi dengan modal konfirmasi aman.

---

### Phase 27: Troubleshooting Hub & Secret Token Redaction Assistant

**Goal**: Membangun Troubleshooting Hub pre-training dengan pencarian teks instan dan filter kategori (Node.js, 9Router, Telegram, Hermes, PowerShell) serta alat sensor token rahasia otomatis.  
**Depends on**: Phase 26  
**Requirements**: PRE-TOOL-01, PRE-TOOL-02, PRE-TOOL-03  

**Success Criteria**:
1. Troubleshooting hub menampilkan 10+ kartu solusi error umum pre-training yang dapat difilter secara instan via search input dan filter chips.
2. Tool Sensor Token / Redaction Assistant dapat memproses teks masukan peserta dan menyensor token Telegram bot, Google Gemini API key, dan JWT/Bearer token sebelum disalin.
3. Solusi error menyediakan perintah perbaikan langkah-demi-langkah dengan 1-click copy.

---

### Phase 28: Laporan Kesiapan Generator, Sidebar Sync & E2E Zero-Regression

**Goal**: Menyediakan Form Laporan Kesiapan Peserta dengan ekspor 1-click ke WhatsApp dan Telegram Markdown, layout cetak resmi (`@media print`), sinkronisasi navigasi sidebar & scrollspy, serta pengujian E2E regresi nol.  
**Depends on**: Phase 27  
**Requirements**: PRE-RPT-01, PRE-RPT-02, PRE-RPT-03, PRE-NAV-01, PRE-NAV-02, PRE-NAV-03  

**Success Criteria**:
1. Form Laporan Kesiapan terisi otomatis dengan rekap checkpoint dan checklist peserta, serta dapat disalin ke format WhatsApp & Telegram dalam 1 klik.
2. Halaman rapi saat dicetak (`Ctrl+P`) dengan layout khusus cetak dokumen dinas/peserta.
3. Sidebar kiri menyinkronkan daftar tautan modul pre-training dengan indikator progres dan scrollspy navigasi aktif.
4. Seluruh test suite (Node unit test, Playwright E2E browser tests) lulus 100% tanpa error regresi.
