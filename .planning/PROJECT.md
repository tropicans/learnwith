# Hands-on Agentic AI: Dari Chat ke Kalender — Praktik Deploy Hermes Agent & 9Router

## What This Is
A modern, responsive, and beginner-friendly web application designed to guide workshop participants through `PANDUAN-PRE-TRAINING.md` and `PANDUAN-PRAKTIK-KELAS.md` (Hands-on Agentic AI: Dari Chat ke Kalender — Praktik Deploy Hermes Agent & 9Router). It provides interactive step-by-step guidance, one-click command copying, real-time checklist tracking with `localStorage` persistence, automated checkpoint readiness evaluation, interactive troubleshooting, token redaction helper, and instant readiness & completion report generation for instructors.

## Core Value
Empower non-technical participants to complete all pre-training prerequisites and live in-class practical exercises independently, safely, and without anxiety through clear visual guidance, interactive checklists, and automated checkpoint reporting.

## Current State: Milestone v1.1 Complete (Live Workshop Guide)

**Shipped:** 2026-09-07
**Accomplishments:**
- Complete dual-purpose workshop navigation (Pra-Training vs Hari-H Praktik Kelas).
- Interactive guided workflows for Moduls 6–11 with Checkpoints 4–9.
- Dedicated in-class troubleshooting hub with live search and category filter.
- Form Laporan Hasil Praktik Kelas with 1-click WhatsApp and Telegram exports and automatic regex token redaction.
- 153 automated browser & Node.js test assertions passing with 0 failures (100% pass rate).

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

### Out of Scope
- Automated remote installation on user's machine (security risk; users must run commands themselves).
- Backend server hosting or user authentication (web app runs locally/statically in browser for maximum privacy).
- Storing participant OAuth client secrets or bot tokens in `localStorage` (credentials must remain in participant's local environment).

## Context
Shipped v1.1 with ~4,000 lines of production HTML and JavaScript. 153 automated tests passing with zero failures. Zero build tools or npm dependencies required. Complete companion web application ready for live deployment and classroom use.

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

