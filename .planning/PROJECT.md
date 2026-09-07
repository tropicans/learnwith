# learnwith — Interactive Training Platform (Multi-Course)

## What This Is
A modern, responsive, and beginner-friendly web learning platform designed to guide workshop participants through interactive technical training. It provides a modular course architecture hosting:
1. **Course 1**: *Hands-on Agentic AI: Dari Chat ke Kalender — Praktik Deploy Hermes Agent & 9Router* (Production & Published).
2. **Course 2**: *Pengolahan Kata Tingkat Lanjut* (Pelatihan Komputer Lanjutan BPSDM DKI Jakarta) — Protected/Locked for development with passkey and dedicated isolated directory/module structure.

## Core Value
Empower non-technical participants and government professionals to complete practical computer and AI workflows independently, safely, and without anxiety through clear visual guidance, interactive checklists, automated evaluation quizzes, and instant readiness & completion reporting.

## Current Milestone: v2.2 Application Security Hardening & Anti-Breach Protection

**Goal:** Lakukan penguatan keamanan (hardening) menyeluruh terhadap aplikasi agar tidak bisa dibreach (tahan terhadap kebocoran kata sandi, manipulasi objek global DevTools, bypass URL query tidak aman, dan celah injeksi DOM XSS).

**Target Features:**
- **Zero-Plaintext & Cryptographic Gate (Web Crypto API)**: Hapus seluruh kata sandi teks polos dari kode sumber, hapus `window.WORD_PASSCODES` dari console global, bersihkan bocoran di placeholder UI, dan gunakan enkripsi hash satu arah SHA-256 (`crypto.subtle.digest`).
- **Centralized Secure Config (`config.js`)**: Pisahkan konfigurasi penguncian modul dan hash sandi instruktur ke file konfigurasi terisolasi (`window.LEARNWITH_CONFIG`).
- **URL Bypass Hardening & Auto-Lock Session**: Kunci jalur bypass URL tanpa izin (`?unlock=dev`, dll.) di mode normal dan implementasikan auto-lock timeout agar modul tidak terbuka permanen jika ditinggal tanpa pengawasan.
- **Content Security Policy (CSP) & Anti-Clickjacking**: Pasang meta header CSP ketat dan pelindung anti-framing untuk mencegah serangan injeksi skrip dan pembajakan klik.
- **DOM Sanitization & Anti-XSS Audit**: Audit menyeluruh seluruh input pengguna (nama, NIP, evaluasi kuis, pencarian kata kunci) untuk memastikan 0% celah DOM XSS.

## Current State: v2.1 Shipped (2026-09-07)

The platform is now an authenticated **NotebookLM-Inspired Multi-Course Studio** with an adaptive Frontpage Hub, clean two-way studio workspace navigation, and modern LY monogram identity.

## Previous Milestones

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

### Out of Scope
- Automated remote installation on user's machine (security risk; users must run commands themselves).
- Backend server hosting or user authentication (web app runs locally/statically in browser for maximum privacy).
- Storing participant OAuth client secrets or bot tokens in `localStorage` (credentials must remain in participant's local environment).

## Context
Shipped v2.0 with ~7,500 lines of production HTML, CSS, and JavaScript. 269 automated unit test assertions and 35 Playwright E2E browser tests passing with zero failures. Complete multi-course platform ready for live deployment and classroom use.

## Key Decisions
- ✓ **Architecture**: Lightweight, modular Vanilla HTML5, modern CSS3 (Custom Properties, Glassmorphism, Responsive Grid/Flex), and Vanilla JS ES6+ (zero complex build steps required, runnable offline or on any browser) — *Outcome: Good*
- ✓ **Persistence**: Browser `localStorage` for state preservation (steps checked, form input, checkpoint states) — *Outcome: Good*
- ✓ **Safety First**: Client-side only with built-in token detection & redaction assistant to protect sensitive credentials — *Outcome: Good*
- ✓ **Tone & Usability**: Indonesian language matching `PANDUAN-PRE-TRAINING.md` and `PANDUAN-PRAKTIK-KELAS.md`, clean typography, high visual feedback, and clear callouts for checkpoints — *Outcome: Good*

## Next Milestone Goals (v1.2 Candidates)
- Interactive command simulator / terminal preview playground for dry-running PowerShell commands before executing.
- Live localhost ping button (CORS/fetch healthcheck) for `http://localhost:20128/v1` and 9Router status.
- Multilingual toggle (Indonesian / English) for international participants.
- PWA (Progressive Web App) manifest and service worker for 100% offline standalone usage.

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

---
*Last updated: 2026-09-07 for Milestone v1.1 Complete*

