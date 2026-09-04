# Pre-Training Workshop Interactive Checklist & Guide Web App

## What This Is
A modern, responsive, and beginner-friendly web application designed to guide workshop participants through `PANDUAN-PRE-TRAINING.md` and `PANDUAN-PRAKTIK-KELAS.md` (Workshop Hermes Agent + 9Router: Mengelola Google Calendar melalui Telegram). It provides interactive step-by-step guidance, one-click command copying, real-time checklist tracking with `localStorage` persistence, automated checkpoint readiness evaluation, interactive troubleshooting, token redaction helper, and instant readiness & completion report generation for instructors.

## Core Value
Empower non-technical participants to complete all pre-training prerequisites and live in-class practical exercises independently, safely, and without anxiety through clear visual guidance, interactive checklists, and automated checkpoint reporting.

## Current Milestone: v1.1 Live Workshop Guide (Hari-H Praktik Kelas)

**Goal:** Expand the web application to provide interactive guidance, command copying, and checkpoint validation for the live workshop session (`PANDUAN-PRAKTIK-KELAS.md`), covering 9Router model alignment, Hermes Agent installation, Telegram bot wiring, and Google Calendar tool execution.

**Target features:**
- Mode / Tab Switcher in Header/Sidebar to toggle between "Pra-Training (Persiapan)" and "Hari-H (Praktik Kelas)"
- Interactive In-Class Modules (Modul 6–10):
  - Modul 6: Penyelarasan Provider & Model 9Router (Checkpoint 4)
  - Modul 7: Instalasi & Pemeriksaan Hermes di Windows via PowerShell (`hermes doctor`, Checkpoint 5)
  - Modul 8: Konfigurasi Hermes Full Setup (Model, Endpoint `http://localhost:20128/v1`, API Key)
  - Modul 9: Integrasi Bot Telegram & Whitelist User ID pada Hermes Agent (Checkpoint 6)
  - Modul 10: Google Cloud OAuth 2.0 (Desktop app), Otorisasi Google Calendar, & Uji End-to-End via Telegram (Checkpoint 7)
- 4 Live Workshop Checkpoint Verification Gates (CP-4, CP-5, CP-6, CP-7) with reactive status tracking
- In-Class Troubleshooting Hub & Resolution Cards (handling Python PATH issues, ExecutionPolicy, Google OAuth redirect errors, Telegram polling conflicts)
- Final Workshop Completion Report Generator (Form Laporan Status Akhir Praktik Kelas) with 1-click WhatsApp/Telegram export

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

### Active (Milestone v1.1)
- [ ] Mode Switcher: Tab/Toggle between "Pra-Training" and "Hari-H Praktik Kelas" (MODE-01)
- [ ] 9Router Alignment Guide & Checkpoint 4 Gate (CLASS-01)
- [ ] Hermes Agent Native Windows Installation & Doctor Checkpoint 5 (CLASS-02)
- [ ] Hermes Full Setup & Provider Configuration Guide (CLASS-03)
- [ ] Telegram Bot Integration & Whitelist Security Checkpoint 6 (CLASS-04)
- [ ] Google Calendar OAuth 2.0 & End-to-End Tool Call Verification Checkpoint 7 (CLASS-05)
- [ ] Live Workshop Troubleshooting Hub extension for runtime & OAuth errors (CLASS-06)
- [ ] Form Laporan Akhir Sesi Praktik Kelas & Export (CLASS-07)

### Out of Scope
- Automated remote installation on user's machine (security risk; users must run commands themselves).
- Backend server hosting or user authentication (web app runs locally/statically in browser for maximum privacy).
- Storing participant OAuth client secrets or bot tokens in `localStorage` (credentials must remain in participant's local environment).

## Context
Shipped v1.0 with ~6,400 LOC of clean Vanilla HTML5, CSS3, and ES6 JavaScript. Zero external build tooling or npm runtime dependencies required. Tested with 62 automated browser & Node.js test assertions passing (100% pass rate). Expanding into v1.1 to provide an end-to-end companion tool for both preparation and live workshop execution.

## Key Decisions
- ✓ **Architecture**: Lightweight, modular Vanilla HTML5, modern CSS3 (Custom Properties, Glassmorphism, Responsive Grid/Flex), and Vanilla JS ES6+ (zero complex build steps required, runnable offline or on any browser) — *Outcome: Good*
- ✓ **Persistence**: Browser `localStorage` for state preservation (steps checked, form input, checkpoint states) — *Outcome: Good*
- ✓ **Safety First**: Client-side only with built-in token detection & redaction assistant to protect sensitive credentials — *Outcome: Good*
- ✓ **Tone & Usability**: Indonesian language matching `PANDUAN-PRE-TRAINING.md` and `PANDUAN-PRAKTIK-KELAS.md`, clean typography, high visual feedback, and clear callouts for checkpoints — *Outcome: Good*

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
*Last updated: 2026-09-04 for Milestone v1.1*
