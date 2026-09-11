# Milestones

## v3.3 Admin Course Lifecycle & Visibility Management (Shipped: 2026-09-11)

**Shipped:** 2026-09-11  
**Status:** ✅ SHIPPED (verified_closeout)  
**Phases:** 34-37 (4 phases)  
**Plans:** 9 plans (9/9 completed)  
**Automated Tests:** 33 test files passing, 303/303 tests passed (0 failures) + TypeScript clean (0 errors)  
**Requirements:** 15/15 satisfied (100%)  
**Known verification overrides:** 0 newly acknowledged, 0 carried forward  

### Delivered

Complete administrative course lifecycle management and dynamic visibility synchronization across LearnWith. Administrators can show, hide, archive, and soft-delete courses from the Admin Command Center with real-time KPI feedback, two-factor safety confirmation, and automatic reactive catalog updates on the public frontpage and global header navigation.

### Key Accomplishments

1. **Course Lifecycle Schema & Store Architecture (Phase 34)**: Strongly-typed course status model (`active`, `hidden`, `archived`, `deleted`) with transition matrix validation and thread-safe in-memory store in `app/server/courseLifecycleStore.ts` guarded by Master Admin session verification.
2. **Admin Management UI & Action Controls (Phase 35)**: Dedicated "Manajemen Kursus" view in `AdminShell.tsx` with 5-status KPI metric cards, 1-click visibility toggles (`Tampilkan` / `Sembunyikan`), filter pills, live search, audit log table, and two-factor typed safety confirmation modal for soft deletion.
3. **Frontpage Catalog & Header Switcher Reactive Sync (Phase 36)**: Server RPC filtering via `getPublicCoursesListFn` ensuring only active courses are listed on `/`, multi-tab sync via `BroadcastChannel` (`learnwith:course_status_changed`), global navigation header switcher updates, unlisted course access with `UnlistedCourseBanner`, and passkey preservation on direct route `/course/word`.
4. **End-to-End Verification & Zero-Regression Audit (Phase 37)**: Defensive copy store immutability hardening (COURSE-TEST-01), exhaustive 4x4 state transition matrix tests, ASVS L1 authorization/schema validation, and platform-wide zero-regression audit across 303 test cases.

### Archive Reference

- [Roadmap Archive](milestones/v3.3-ROADMAP.md)
- [Requirements Archive](milestones/v3.3-REQUIREMENTS.md)
- [Milestone Audit](milestones/v3.3-MILESTONE-AUDIT.md)

---

## v3.2: Admin Command Center, Telemetry & Authentication

**Shipped:** 2026-09-09  
**Status:** ✅ SHIPPED (verified_closeout)  
**Phases:** 29-33 (5 phases)  
**Plans:** 10 plans (10/10 completed)  
**Automated Tests:** 27 test files passing, 242/242 tests passed (0 failures) + TypeScript clean (0 errors)  
**Requirements:** 20/20 satisfied (100%)  
**Known verification overrides:** 0 newly acknowledged, 0 carried forward  

### Delivered

A secure, comprehensive administrative command center (`/admin`) protecting course management, real-time telemetry aggregation of workshop participants across courses, runtime troubleshooting incident tracking, dynamic passkey rotation for Course 2, and global platform configuration (workshop mode switch and top-level announcement banner).

### Key Accomplishments

1. **Master Admin Authentication (Phase 29)**: Secure `/admin` route via `createServerFn` timing-safe Web Crypto SHA-256 hash comparison, session token registry, and Google OAuth SSO readiness with single-domain whitelist.
2. **Server Telemetry Ingestion (Phase 30)**: In-memory store with Zod schema validation, zero-division safety, non-blocking client heartbeat background transmitter on participant routes.
3. **Command Center Dashboard (Phase 31)**: 4 aggregate KPI metric cards, multi-criteria participant directory table, granular modal inspector with task checklist dossier, and 1-click RFC 4180 CSV/JSON export.
4. **Workshop Access & Passkey Management (Phase 32)**: Active passkey status monitoring, runtime dynamic passkey rotation without server restart, timing-safe verification, sliding-window rate limiting guard, and candidate-masked audit logs.
5. **Troubleshooting Hub & Global Configuration (Phase 33)**: Auto-classification across 6 classroom failure types with 1-click PowerShell remediation commands, dynamic global workshop mode toggle, and Global Announcement Banner mounted at viewport top.
6. **Quality Assurance**: Zero secret bundle leakage, zero regressions across `/`, `/course/ai`, `/course/word`, and 100% test pass rate (242/242 tests).

### Archive Reference

- [Roadmap Archive](file:///c:/Users/yudhiar\Downloads\AgenticAI\.planning\milestones\v3.2-ROADMAP.md)
- [Requirements Archive](file:///c:/Users/yudhiar\Downloads\AgenticAI\.planning\milestones\v3.2-REQUIREMENTS.md)

---

## v3.1: Pre-Training Parity in TanStack Start

**Shipped:** 2026-09-09
**Status:** ✅ SHIPPED (verified_closeout)
**Phases:** 24-28 (5 phases)
**Plans:** 10 plans (10/10 completed)
**Automated Tests:** 19 test files passing, 100/100 tests passed (0 failures) + TypeScript clean (0 errors)
**Requirements:** 24/24 satisfied (100%)
**Known verification overrides:** 0 newly acknowledged, 0 carried forward

### Delivered

Complete interactive feature parity for the Course 1 Pre-Training experience (`/course/ai?mode=pretraining`) rebuilt on TanStack Start and React 19, including modular foundation sections, accordion practical modules 1–5, 1-click copy engine with toast notifications, 13-step persistent checklist with 3 automated Pass/Fail checkpoint gates, dynamic readiness status badge, 15-issue troubleshooting hub, client-side secret token redaction workbench, pre-filled readiness report generator with WhatsApp/Telegram export, and print formatting.

### Key Accomplishments

1. **Foundation & Context Sections (Phase 24)**: Modularized React 19 components for Target & Alur (`sec-target`), Glosarium Interaktif (`sec-glosarium`, 8+ AI technical terms), Aturan Keamanan & Token Protection (`sec-security`), Alat & Persiapan Perangkat (`sec-prerequisites`), and Panduan Khusus PowerShell (`sec-powershell`).
2. **Interactive Modules 1–5 & 1-Click Copy Engine (Phase 25)**: Replicated Modules 1–5 with collapsible accordion controls, callouts, and `CopyableCodeBlock` engine supporting dual clipboard fallback with animated toast feedback and zero whitespace corruption.
3. **Checklist Engine & Checkpoint Validation Gates (Phase 26)**: Integrated 13 step-level interactive checklist tasks across modules, 3 automated Checkpoint Gates with regex validation for Telegram Bot token and User ID, dynamic readiness scoring (SIAP WORKSHOP vs PERLU KLINIK PERSIAPAN), and safe progress reset modal synced to `learnwith_ai_checklist` localStorage.
4. **Troubleshooting Hub & Secret Redaction Assistant (Phase 27)**: Built 15 error resolution cards covering common runtime issues (`EADDRINUSE`, `401 Unauthorized`, `Execution_Policies`, `Telegram 409 Conflict`) with live search and category filters, paired with a client-side Secret Token Redaction Assistant to scrub tokens, API keys, and sensitive paths before sharing logs.
5. **Readiness Report Generator & Sidebar Navigation Sync (Phase 28)**: Delivered Form Laporan Kesiapan Peserta with real-time state synchronization, 1-click WhatsApp and Telegram Markdown export, `@media print` clean document styling, synchronized curriculum sidebar with dynamic module and checkpoint badges, and 100% test pass rate with zero regression across existing courses.

### Archive Reference

- [Roadmap Archive](file:///c:/Users/yudhiar/Downloads/AgenticAI/.planning/milestones/v3.1-ROADMAP.md)
- [Requirements Archive](file:///c:/Users/yudhiar/Downloads/AgenticAI/.planning/milestones/v3.1-REQUIREMENTS.md)
- [Milestone Audit](file:///c:/Users/yudhiar/Downloads/AgenticAI/.planning/milestones/v3.1-MILESTONE-AUDIT.md)

---

## v3.0 TanStack Start Full-Document SSR & File-Based Router Migration (Shipped: 2026-09-08)

**Phases completed:** 5 phases, 15 plans, 8 tasks

**Key accomplishments:**

- Root package manifest initialized with pinned TanStack Start/React 19 dependencies on Port 3173, and CommonJS isolation established to keep all 11 legacy test suites passing 100%.
- 19 - TanStack Start & Full-Stack Tooling Foundation
- Production containerization configured and validated with multi-stage Dockerfile and docker-compose.yml on Port 3173, confirmed clean SSR HTTP 200 response, and verified 100% legacy test suite passing.
- Implemented strongly-typed curriculum data layer (`app/data/courses.ts`), server preloading route loaders, and dynamic head metadata across Frontpage Hub and workspace routes.
- Implemented progressive HTML streaming with React Suspense & `<Await>` (SSR-02) and encapsulated client interactive state widgets within `<ClientOnly>` boundaries (SSR-04).
- Validated end-to-end SSR response codes, dynamic head title tags, progressive streaming output, and client island boundaries on Port 3173, followed by a regression test run on the 11 legacy test suites with 100% pass rate.

---

## v2.1: Google NotebookLM-Inspired UI/UX Overhaul & Workspace Architecture

**Shipped:** 2026-09-07
**Status:** ✅ SHIPPED (verified_closeout)
**Phases:** 13-15 (3 phases)
**Plans:** 3 plans (3/3 completed)
**Automated Tests:** 38 Playwright E2E browser tests passing (0 failures)
**Requirements:** 16/16 satisfied (100%)

### Delivered

Transformed the user interface into a calm, focused, and intuitive Google NotebookLM-inspired experience with an adaptive Frontpage Hub, seamless two-way Studio Workspace navigation, anti-cache critical CSS, de-duplicated sidebar, and modern LY monogram branding.

### Key Accomplishments

1. **Critical CSS & Anti-Cache Architecture**: Embedded critical dropdown and layout rules in `<head>` and asset version query busting (`?v=2.2.2`) preventing unstyled glitches.
2. **NotebookLM Top Bar & Pill Selector**: Sleek 56px header with unified platform branding `learnwith`, breadcrumb divider, and interactive course dropdown pill.
3. **Workspace De-duplication & Material 3 Refinement**: Streamlined sidebar to direct curriculum navigation, synchronized Course 2 stats (4 Bab, 3 Checkpoints, 28 Checklist steps), calm progress indicators, and pill search bar with `Ctrl+K`.
4. **NotebookLM Frontpage Hub**: Full-width `#container-home` displaying platform greeting ("Selamat Datang di learnwith Yudhi") and 2 focused workshop notebook cards with filter chips.
5. **Modern LY Monogram Branding**: Konsep 5 (Gemini AI Emblem LY) with royal blue to indigo gradient and gold 4-point AI sparkle applied to favicon and app header.

### Archive Reference

- [Roadmap Archive](file:///c:/Users/yudhiar/Downloads/AgenticAI/.planning/milestones/v2.1-ROADMAP.md)
- [Requirements Archive](file:///c:/Users/yudhiar/Downloads/AgenticAI/.planning/milestones/v2.1-REQUIREMENTS.md)

---

## v2.0: Multi-Course Platform & Modul Pengolahan Kata Tingkat Lanjut

**Shipped:** 2026-09-07
**Status:** ✅ SHIPPED (verified_closeout)
**Phases:** 9-12 (4 phases)
**Plans:** 8 plans (8/8 completed)
**Automated Tests:** 269 assertions passing across 9 test suites (0 failures) + 35 Playwright E2E browser tests
**Requirements:** 13/13 satisfied (100%)

### Delivered

Transformed learnwith into a multi-course architecture while keeping Course 1 100% active, backward-compatible, and isolated, and built the complete interactive companion for "Pengolahan Kata Tingkat Lanjut" behind an instructor protection gate.

### Key Accomplishments

1. **Multi-Course Architecture & Gateway Protection**: Namespaced state storage (`learnwith_ai_*` vs `learnwith_word_*`), zero regression for Course 1, developer passkey modal (`buka-kata`) & URL unlock (`?course=word&unlock=dev`), and course switcher UI.
2. **Interactive Word Modules & Checkpoints 1–2**: Guided workflows for Bab I–III covering Styles & Heading hierarchy, Navigation Pane, Multilevel Lists, Automatic TOC, Section Breaks, Header/Footer unlinking, mixed Roman/Arabic page numbering, and `.dotx` templates with Checkpoints 1 and 2 gates.
3. **Civil Service Standards & Keyboard Cheatsheet**: Visual shortcuts cards, Pergub DKI Jakarta No. 14/2020 formatting rules callouts, and 1-click snippet copying with animated toasts.
4. **Mail Merge Automation & Document Review Tools**: Bab IV automated guides for Mail Merge (mass letters, labels, filtering rules), Track Changes, commenting, Document Compare & Combine, and Checkpoint 3 gate.
5. **Interactive Knowledge Quiz & ASN Competency Rubric**: Official 20-question multiple-choice interactive knowledge evaluation with instant validation and detailed explanations (KKM 80), self-reflection rubrics, and portfolio verification.
6. **BPSDM Graduation Engine & Multi-Channel Exporter**: Weighted scoring (70% portfolio + 30% quiz), predicate assignment (*Sangat Memuaskan*, *Memuaskan*, *Cukup*), official Kop Surat certificate slip, and 1-click export to WhatsApp, Telegram Markdown, and clean `@media print` layout.

### Archive Reference

- [Roadmap Archive](file:///c:/Users/yudhiar/Downloads/AgenticAI/.planning/milestones/v2.0-ROADMAP.md)
- [Requirements Archive](file:///c:/Users/yudhiar/Downloads/AgenticAI/.planning/milestones/v2.0-REQUIREMENTS.md)
- [Milestone Audit](file:///c:/Users/yudhiar/Downloads/AgenticAI/.planning/milestones/v2.0-MILESTONE-AUDIT.md)

---

## v1.1: Live Workshop Guide (Hari-H Praktik Kelas)

**Shipped:** 2026-09-07
**Status:** ✅ SHIPPED (verified_closeout)
**Phases:** 5-8 (4 phases)
**Plans:** 8 plans (8/8 completed)
**Automated Tests:** 153 assertions passing across 6 test suites (0 failures)
**Requirements:** 19/19 satisfied (100%)

### Delivered

Expanded the web application from the v1.0 preparation baseline (`PANDUAN-PRE-TRAINING.md`) into a complete dual-purpose workshop companion accommodating the live in-class session (`PANDUAN-PRAKTIK-KELAS.md`).

### Key Accomplishments

1. **Mode Switcher & Dual Navigation**: Header & sidebar segmented controls to toggle seamlessly between "Pra-Training (Persiapan)" and "Hari-H (Praktik Kelas)" with persistent LocalStorage state.
2. **Interactive In-Class Modules & Checkpoints 4–6**: Guided workflows for 9Router model alignment (`npx 9router`), native Hermes Windows installer (`iex (irm ...)`), `hermes doctor`, and `hermes setup` wizard with Checkpoints 4, 5, 6 Pass/Fail gates.
3. **Telegram Gateway & Google Calendar Desktop OAuth**: Long-polling gateway integration with strict allowlist (`TELEGRAM_ALLOWED_USERS`), Google Cloud Desktop OAuth client creation, Calendar authorization, 1-click test prompts, reboot sequence, and Checkpoints 7, 8, 9 gates.
4. **In-Class Troubleshooting Hub & Completion Exporter**: Dedicated 7-issue runtime troubleshooting hub with live search and 4 category filters, multi-tier completion status engine (`calculateLiveReadiness`), and Form Laporan Hasil Praktik Kelas with 1-click WhatsApp and Telegram Markdown export with credential masking.

### Archive Reference

- [Roadmap Archive](file:///c:/Users/yudhiar/Downloads/AgenticAI/.planning/milestones/v1.1-ROADMAP.md)
- [Requirements Archive](file:///c:/Users/yudhiar/Downloads/AgenticAI/.planning/milestones/v1.1-REQUIREMENTS.md)

---

## v1.0: Pre-Training Interactive Web App

**Shipped:** 2026-09-03
**Status:** ✅ SHIPPED (verified_closeout)
**Phases:** 1-4 (4 phases)
**Plans:** 11 plans
**Automated Tests:** 46 assertions passing (0 failures)
**Requirements:** 18/18 satisfied (100%)
**Known verification overrides:** 0 newly acknowledged, 0 carried forward

### Delivered

Transform `PANDUAN-PRE-TRAINING.md` into an interactive, intuitive, and modern web application with real-time checklist tracking, 1-click command copying, checkpoint validation, troubleshooting assistance, and 1-click readiness report generation.

### Key Accomplishments

1. **Core Foundation & Shell**: Responsive layout shell with glassmorphic aesthetic, dark/light theme switching, sidebar navigation drawer, `Ctrl+K` debounced search engine, and reactive state bus.
2. **Interactive Modules & Guide Engine**: 5 practical pre-training modules with collapsible accordions, 1-click PowerShell command copy with animated toasts, Indonesian glossary popovers, and caution callout cards.
3. **Checklist & Checkpoint Engine**: 13 interactive step-level checkboxes, 3 gated checkpoint validation sections, Telegram User ID numeric validator, dynamic readiness badge (`SIAP MENGIKUTI WORKSHOP` vs `PERLU TECHNICAL CLINIC`), and accessible reset modal with LocalStorage sync.
4. **Troubleshooting & Report Exporter**: 10-issue Troubleshooting Hub with category pills and live search, interactive regex-based Token & Secret Redaction Helper workbench, dynamic Section 15 Form Laporan Kesiapan generator with 1-click WhatsApp/Telegram export, and clean `@media print` layout formatting.

### Archive Reference

- [Roadmap Archive](file:///c:/Users/yudhiar/Downloads/AgenticAI/.planning/milestones/v1.0-ROADMAP.md)
- [Requirements Archive](file:///c:/Users/yudhiar/Downloads/AgenticAI/.planning/milestones/v1.0-REQUIREMENTS.md)
- [Milestone Audit](file:///c:/Users/yudhiar/Downloads/AgenticAI/.planning/milestones/v1.0-MILESTONE-AUDIT.md)
