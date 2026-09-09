# learnwith — Interactive Training Platform (Multi-Course)

## What This Is
A modern, responsive, and beginner-friendly web learning platform designed to guide workshop participants through interactive technical training. Built with TanStack Start, React 19, Vinxi, and Nitro with full-document SSR, file-based routing, and progressive streaming. It provides a modular course architecture hosting:
1. **Course 1**: *Hands-on Agentic AI: Dari Chat ke Kalender — Praktik Deploy Hermes Agent & 9Router* (Production & Published).
2. **Course 2**: *Pengolahan Kata Tingkat Lanjut* (Pelatihan Komputer Lanjutan BPSDM DKI Jakarta) — Protected with timing-safe passkey verification (`createServerFn`) and isolated directory/module structure.

## Core Value
Empower non-technical participants and government professionals to complete practical computer and AI workflows independently, safely, and without anxiety through clear visual guidance, interactive checklists, automated evaluation quizzes, and instant readiness & completion reporting.

## Current State: v3.2 Shipped (2026-09-09)

The platform has grown from student/participant self-service into an instructor-grade operational command center. Milestone v3.2 delivered the `/admin` command center with Master Admin Passkey authentication (and Google OAuth login foundation), real-time participant progress & telemetry aggregation, course access passkey management, runtime troubleshooting diagnostics, and global platform banner/mode configuration.

## Previous Milestones

<details>
<summary>✅ v3.2 Complete (Admin Command Center, Telemetry & Authentication) - SHIPPED 2026-09-09</summary>

- **Phases**: 29-33 (5 phases, 10 plans)
- **Accomplishments**:
  - Master Admin Authentication: Secure `/admin` route via `createServerFn` timing-safe hash comparison, session registry, and Google OAuth SSO readiness.
  - Telemetry Ingestion API: Structured in-memory store with Zod schema validation, zero-division safety, and non-blocking client heartbeat background transmitter.
  - Command Center Dashboard: 4 aggregate KPI metric cards, multi-criteria participant directory table, granular modal inspector with task checklist dossier, and 1-click RFC 4180 CSV/JSON export.
  - Course Access & Passkey Management: Active passkey status monitoring, runtime dynamic passkey rotation without server restart, timing-safe verification, sliding-window rate limiting guard, and candidate-masked audit logs.
  - Troubleshooting Hub: Auto-classification across 6 classroom failure types (Port 20128, PowerShell policy, OAuth, Telegram 409, EPERM, network), 1-click PowerShell remediation commands, and dual-layer secret redaction.
  - Platform Configuration: Dynamic global workshop mode toggle (`pretraining` vs `live-class`) with audit tracking, and Global Announcement Banner mounted at the top-level viewport with smart dismissibility.
  - Quality Assurance: Zero secret bundle leakage, zero regressions across `/`, `/course/ai`, `/course/word`, and 100% test pass rate (237/237 tests across 27 test files).

</details>

<details>
<summary>✅ v3.1 Complete (Pre-Training Parity in TanStack Start) - SHIPPED 2026-09-09</summary>

- **Phases**: 24-28 (5 phases, 10 plans)
- **Accomplishments**:
  - Modularized foundation sections: Target & Alur (`sec-target`), Glosarium Interaktif (8+ istilah), Aturan Keamanan, Alat & Persiapan, dan Panduan Khusus PowerShell.
  - Built interactive accordion Modules 1–5 (Node.js, 9Router, Bot Telegram, Hermes Agent, Integrasi Live Chat) with 1-click clipboard copy engine and visual toast feedback.
  - Implemented 13-step checklist engine, 3 automated Checkpoint Gates with regex validation, and dynamic readiness calculation (SIAP WORKSHOP vs PERLU KLINIK PERSIAPAN) with persistent localStorage (`learnwith_ai_checklist`).
  - Delivered Troubleshooting Hub with 15 error resolution cards, live search, category pills, and client-side Secret Token Redaction Assistant.
  - Shipped Form Laporan Kesiapan Peserta with 1-click WhatsApp and Telegram Markdown export, `@media print` official document styling, and curriculum sidebar with dynamic completion badges.
  - 100% automated test pass rate across 19 test files (100/100 tests passed, 0 failures, 0 TypeScript errors).

</details>

<details>
<summary>✅ v3.0 Complete (TanStack Start Full-Document SSR & File-Based Router Migration) - SHIPPED 2026-09-08</summary>

- **Phases**: 19-23 (5 phases, 15 plans)
- **Accomplishments**:
  - Migrated codebase to TanStack Start v1.120.20, React 19, Vinxi 0.5.3, Vite 6, and TypeScript strict mode.
  - Implemented file-based routing (`app/routes/`) with centralized Zod query parameter validation and type-safe navigation.
  - Built strongly-typed server route loaders (`app/data/courses.ts`), progressive HTML streaming via Suspense skeletons, and dynamic OpenGraph `<head>` metadata.
  - Quarantined backend configuration and secrets in `app/server/` with timing-safe passkey verification and telemetry via `createServerFn`.
  - Hardened multi-stage Docker container with Alpine tini PID 1, non-root `node` user, and multi-tier test harness with 100% legacy test suite zero regression.

</details>

<details>
<summary>✅ v2.2 Complete (Application Security Hardening & Anti-Breach Protection) - SHIPPED 2026-09-07</summary>

- **Phases**: 16-18 (3 phases, 3 plans)
- **Accomplishments**:
  - Web Crypto API SHA-256 hash validation replacing plaintext passcodes.
  - Centralized security configuration in `config.js` and anti-tampering guards.
  - Safe URL parameter handling and session auto-lock mechanics.
  - Full Content Security Policy (CSP) headers, DOM sanitization, and anti-clickjacking frame busting.
  - 100% security test pass rate across Node and Playwright E2E suites.

</details>

<details>
<summary>✅ v2.1 Complete (Google NotebookLM-Inspired UI/UX Overhaul & Workspace Architecture) - SHIPPED 2026-09-07</summary>

- **Phases**: 13-15 (3 phases, 3 plans)
- **Accomplishments**:
  - Embedded critical CSS for course dropdowns in `<head>` and asset version query parameter (`?v=2.2.2`).
  - Google NotebookLM-style top bar with unified `learnwith` branding, breadcrumb divider, and course pill dropdown.
  - Streamlined desktop sidebar navigation focusing directly on curriculum links.
  - Synchronized Course 2 stats cards (4 Bab, 3 Checkpoints, 28 Checklist steps) and softened progress indicator.
  - Dedicated NotebookLM Frontpage Hub (`#container-home`) with 2 focused workshop cards and adaptive header.
  - Modern LY Monogram Branding (Konsep 5 Gemini AI Emblem) applied to favicon and app header.
  - 38 Playwright E2E integration tests passing with 0 errors.

</details>

<details>
<summary>✅ v2.0 Complete (Multi-Course Platform & Modul Pengolahan Kata Tingkat Lanjut) - SHIPPED 2026-09-07</summary>

- **Phases**: 9-12 (4 phases, 8 plans)
- **Accomplishments**:
  - Multi-course architecture with isolated state storage (`learnwith_ai_*` vs `learnwith_word_*`).
  - Developer gate modal with passcode (`buka-kata`) & URL unlock (`?course=word&unlock=dev`).
  - Bab I–III practical guides for Styles hierarchy, Automatic TOC, Section Breaks, mixed Roman/Arabic page numbering, `.dotx` templates, and Checkpoints 1 & 2.
  - Visual keyboard shortcuts, Pergub DKI No. 14/2020 formatting callouts, and 1-click text copying.
  - Bab IV Mail Merge automation, Track Changes, commenting, and Checkpoint 3.
  - Interactive 20-question multiple-choice knowledge evaluation (Bab V) with instant pedagogical explanations and scoring (KKM 80).
  - ASN self-reflection rubric and practical portfolio verification.
  - BPSDM graduation calculation (70% portfolio + 30% quiz), predicate assignment, official Kop Surat certificate slip, and 1-click WhatsApp, Telegram Markdown, and `@media print` exports.
  - 269 passed automated unit test assertions + 35 Playwright E2E browser tests passing with 0 errors.

</details>

<details>
<summary>✅ v1.1 Complete (Live Workshop Guide for Agentic AI) - SHIPPED 2026-09-07</summary>

- **Phases**: 5-8 (4 phases, 8 plans)
- **Accomplishments**:
  - Complete dual-purpose workshop navigation (Pra-Training vs Hari-H Praktik Kelas).
  - Interactive guided workflows for Moduls 6–11 with Checkpoints 4–9.
  - Dedicated in-class troubleshooting hub with live search and category filter.
  - Form Laporan Hasil Praktik Kelas with 1-click WhatsApp and Telegram exports and automatic regex token redaction.
  - 153 automated browser & Node.js test assertions passing with 0 failures (100% pass rate).

</details>

<details>
<summary>✅ v1.0 Complete (Pre-Training Interactive Web App) - SHIPPED 2026-09-03</summary>

- **Phases**: 1-4 (4 phases, 11 plans)
- **Accomplishments**:
  - Core responsive shell, theme switcher, Ctrl+K search engine.
  - 5 interactive pre-training modules with 1-click copy and glossary popovers.
  - 13 checklist steps, 3 checkpoint gates, and dynamic readiness badge.
  - 10-issue troubleshooting hub, token redaction helper, and report exporter.

</details>

## Requirements

### Validated
- ✓ Modern responsive layout, sidebar navigation, theme toggle (UI-01) — v1.0
- ✓ Real-time search and filter through steps and glossary (UI-02) — v1.0
- ✓ Visual indicators for completed steps and readiness % (UI-03) — v1.0
- ✓ 5 collapsible/expandable pre-training modules (GUIDE-01) — v1.0
- ✓ 1-click copy for commands with toast notification (GUIDE-02) — v1.0
- ✓ Interactive glossary tooltips for technical terms (GUIDE-03) — v1.0
- ✓ Prominent caution alert cards for pre-workshop boundaries (GUIDE-04) — v1.0
- ✓ External official links with security context (GUIDE-05) — v1.0
- ✓ Interactive step-level checkboxes across all modules (CHK-01) — v1.0
- ✓ 3 gated checkpoints with Pass/Fail validation controls (CHK-02) — v1.0
- ✓ Dynamic readiness badge (`SIAP` vs `PERLU CLINIC`) (CHK-03) — v1.0
- ✓ LocalStorage persistence and safe reset modal (CHK-04) — v1.0
- ✓ Categorized troubleshooting hub for common issues (TRBL-01) — v1.0
- ✓ Step-by-step resolution cards with copyable commands (TRBL-02) — v1.0
- ✓ Interactive Token & Secret Redaction Helper (TRBL-03) — v1.0
- ✓ Pre-filled Form Laporan Kesiapan Section 15 (RPT-01) — v1.0
- ✓ 1-Click WhatsApp / Telegram clipboard export (RPT-02) — v1.0
- ✓ Clean Print & PDF-ready layout formatting (RPT-03) — v1.0
- ✓ Mode Switcher: Tab/Toggle between "Pra-Training" and "Hari-H Praktik Kelas" (MODE-01) — v1.1
- ✓ Dynamic Navigation & Section Visibility across modes (MODE-02) — v1.1
- ✓ 9Router Model Alignment & Endpoint Synchronization (CLASS-01) — v1.1
- ✓ Hermes Agent Windows Native Install & Doctor Diagnosis (CLASS-02) — v1.1
- ✓ Hermes Full Setup Wizard & 9Router Provider Test (CLASS-03) — v1.1
- ✓ Telegram Gateway Setup & Strict Allowlist Enforcement (CLASS-04) — v1.1
- ✓ Google Cloud Console OAuth 2.0 Desktop App & Calendar Authorization (CLASS-05) — v1.1
- ✓ End-to-End Test Prompts, Calendar Verification & Reboot SOP (CLASS-06) — v1.1
- ✓ Checkpoint Gates 4 through 9 Pass/Fail verification (GATE-01..06) — v1.1
- ✓ Multi-tier Live Workshop Completion Status Engine (GATE-07) — v1.1
- ✓ 7 In-Class Runtime Error Resolution Cards (TRBL-04) — v1.1
- ✓ In-Class Category Filters for Troubleshooting (TRBL-05) — v1.1
- ✓ Form Laporan Hasil Praktik Kelas (RPT-04) — v1.1
- ✓ Dual 1-Click WhatsApp & Telegram Markdown Exporter with Redaction (RPT-05) — v1.1
- ✓ Default Public Course 1 Stability & Backward-Compatibility (GATEWAY-01) — v2.0
- ✓ Course 2 Developer Gate with Passcode & URL Unlock (GATEWAY-02) — v2.0
- ✓ Namespaced LocalStorage Isolation per Course (GATEWAY-03) — v2.0
- ✓ Bab I Pendahuluan, Capaian & Berkas Latihan (WORD-01) — v2.0
- ✓ Bab II Struktur Dokumen, Styles, TOC & Checkpoint 1 (WORD-02) — v2.0
- ✓ Bab III Section Break, Romawi/Arab, .dotx & Checkpoint 2 (WORD-03) — v2.0
- ✓ Bab IV Mail Merge, Track Changes & Checkpoint 3 (WORD-04) — v2.0
- ✓ Visual Shortcuts, Pergub DKI Callouts & 1-Click Copy (WORD-05) — v2.0
- ✓ Evaluasi Pengetahuan Interaktif 20 Soal Bab V (QUIZ-01) — v2.0
- ✓ Validasi Jawaban, Penjelasan Pedagogis & Nilai Kuis (QUIZ-02) — v2.0
- ✓ Rubrik Refleksi Diri & Checklist Portofolio ASN (QUIZ-03) — v2.0
- ✓ Kalkulasi Kelulusan BPSDM & Kartu Sertifikat Kop Surat (WORD-RPT-01) — v2.0
- ✓ Ekspor Laporan WhatsApp, Telegram & Cetak Dokumen Dinas (WORD-RPT-02) — v2.0
- ✓ Root package manifest with pinned TanStack Start/React 19 dependencies & scripts (FOUND-01) — v3.0
- ✓ `app.config.ts` Vinxi app configuration & Port 3173 containerization (FOUND-02) — v3.0
- ✓ `tsconfig.json` with `@/*` path alias and strict type-checking (FOUND-03) — v3.0
- ✓ `app/client.tsx` & `app/ssr.tsx` hydration and streaming entry points (FOUND-04) — v3.0
- ✓ Global HTML root document shell (`__root.tsx`) with styles & header (ROUTE-01) — v3.0
- ✓ Index route (`/`) rendering Google NotebookLM Frontpage Hub (ROUTE-02) — v3.0
- ✓ File route `/course/ai` with dual-mode navigation (ROUTE-03) — v3.0
- ✓ File route `/course/word` for Word Processing ASN workspace (ROUTE-04) — v3.0
- ✓ Type-safe Zod search parameter validation schemas (ROUTE-05) — v3.0
- ✓ Strongly-typed route loaders preloading curriculum structures on server (SSR-01) — v3.0
- ✓ Progressive HTML streaming with React Suspense fallbacks using `defer` & `<Await>` (SSR-02) — v3.0
- ✓ Dynamic route metadata (`head()`) outputting contextual page titles, descriptions, and OpenGraph tags (SSR-03) — v3.0
- ✓ Client-only interactive widgets accessing browser state wrapped in `<ClientOnly>` boundaries (SSR-04) — v3.0
- ✓ Instructor passkey verification executed via `createServerFn` with server-side Zod validation (SRV-01) — v3.0
- ✓ Secret hashes and environment variables quarantined in `app/server/` and excluded from client bundles (SRV-02) — v3.0
- ✓ Internal telemetry and diagnostics executed via typed RPC without exposing raw secrets (SRV-03) — v3.0
- ✓ Standalone Production Docker Container packaging compiled TanStack Start app with Nitro node-server (DEPLOY-01) — v3.0
- ✓ Route SSR Mode Selection with NotebookLM 404 and structured request logging (DEPLOY-02) — v3.0
- ✓ Hardened Dockerfile & Compose with non-root user, tini signal trapping, and native healthchecks (DEPLOY-03) — v3.0
- ✓ Multi-Tier Testing Harness and 100% Zero-Regression Legacy Guarantee (DEPLOY-04) — v3.0
- ✓ Foundation & context sections (Target & Alur, Glosarium, Security, Prerequisites, PowerShell) (PRE-BASE-01..05) — v3.1
- ✓ Interactive Modules 1–5 with accordion controls & 1-click copy engine with toast feedback (PRE-MOD-01..06) — v3.1
- ✓ Interactive Checklist Engine (13 steps), 3 Checkpoints, & Dynamic Readiness Badge with `learnwith_ai_checklist` persistence (PRE-CHK-01..04) — v3.1
- ✓ Troubleshooting Hub with live search & category filters (PRE-TOOL-01..02) — v3.1
- ✓ Token & Secret Redaction Helper with multi-entity pattern masking (PRE-TOOL-03) — v3.1
- ✓ Generator Form Laporan Kesiapan with WhatsApp, Telegram Markdown, & Print/PDF export (PRE-RPT-01..03) — v3.1
- ✓ Curriculum Sidebar navigation with dynamic badges & mode switcher query sync (PRE-NAV-01..03) — v3.1

### Active

- [ ] Master Admin Authentication via `createServerFn` with timing-safe hash check & Google OAuth architecture (ADMIN-AUTH-01..03)
- [ ] Internal Server Telemetry API for participant heartbeat, checkpoint status & evaluation ingest (ADMIN-TELEM-01..03)
- [ ] Admin Command Center Dashboard with participant progress aggregation & metrics (ADMIN-DASH-01..03)
- [ ] Workshop Access & Passkey Management Console for Course 2 & custom passkeys (ADMIN-PASS-01..02)
- [ ] Global Platform Configuration & Banner Announcement Control Center (ADMIN-CFG-01..02)

### Out of Scope

- Automated remote installation on user's machine (security risk; users must run commands themselves).
- Storing participant OAuth client secrets or bot tokens in `localStorage` (credentials must remain in participant's local environment).
- Heavy external UI component libraries that increase bundle size and degrade first paint performance.

## Context

Shipped v3.1 with TanStack Start, React 19, Vinxi, Vite 6, and Nitro node-server. 19 test suites passing (100/100 tests passed, 0 failures, 0 TypeScript errors). Milestone v3.1 achieved 100% feature parity for Pre-Training mode on `/course/ai?mode=pretraining`. Ready for next milestone.

## Key Decisions

- ✓ **Architecture**: Lightweight, modular Vanilla HTML5, modern CSS3 (Custom Properties, Glassmorphism, Responsive Grid/Flex), and Vanilla JS ES6+ (zero complex build steps required, runnable offline or on any browser) — *Outcome: Good*
- ✓ **Persistence**: Browser `localStorage` for state preservation (steps checked, form input, checkpoint states) — *Outcome: Good*
- ✓ **Safety First**: Client-side only with built-in token detection & redaction assistant to protect sensitive credentials — *Outcome: Good*
- ✓ **Tone & Usability**: Indonesian language matching `PANDUAN-PRE-TRAINING.md` and `PANDUAN-PRAKTIK-KELAS.md`, clean typography, high visual feedback, and clear callouts for checkpoints — *Outcome: Good*
- ✓ **Full-Stack SSR Architecture**: TanStack Start + Vinxi + Nitro node-server instead of SPA/static build (Rationale: SEO, TTFB, modern full-stack capabilities while preserving local/container flexibility) — *Outcome: Good*
- ✓ **File-Based Routing & Zod Search Params**: Declarative file routing in `app/routes/` with type-safe schema validation (Rationale: Eliminates manual DOM swapping and route ambiguity) — *Outcome: Good*
- ✓ **Server Functions Boundary Isolation**: `createServerFn` with secrets quarantined in `app/server/` (Rationale: Zero server secrets in client bundle, AST-level test verification) — *Outcome: Good*
- ✓ **Production Containerization**: Multi-stage Dockerfile with tini PID 1, non-root user `node`, standalone Nitro server (Rationale: Secure, reproducible, production-ready runtime on Port 3173) — *Outcome: Good*
- ✓ **Component Porting Strategy**: Pure React 19 client/island components inside `app/components/course/pretraining/` and integrated into `app/routes/course.ai.tsx` preserving original styling, persistence schemas, and test parity — *Outcome: Good (v3.1)*

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

## Next Milestone Goals (v3.2 / v4.0 Candidates)

- Live Class Mode (`?mode=live-class`) Full Parity in TanStack Start (Modul 6-11, Checkpoints 4-9, In-Class Report).
- PostgreSQL database integration for centralized multi-device participant progress and synchronized evaluation submissions.
- Vector DB & Semantic Search for interactive knowledge retrieval from training guides.
- Multilingual toggle (Indonesian / English) for international workshop participants.
- Interactive terminal simulator for dry-running CLI commands before local execution.

---
*Last updated: 2026-09-09 — Milestone v3.2 started*
