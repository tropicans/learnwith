# Pre-Training Workshop Interactive Checklist & Guide Web App

## What This Is
A modern, responsive, and beginner-friendly web application designed to guide workshop participants through `PANDUAN-PRE-TRAINING.md` (Workshop Hermes Agent + 9Router: Mengelola Google Calendar melalui Telegram). It provides interactive step-by-step guidance, one-click command copying, real-time checklist tracking with `localStorage` persistence, automated checkpoint readiness evaluation, interactive troubleshooting, token redaction helper, and instant readiness report generation for instructors.

## Core Value
Empower non-technical participants to complete all pre-training prerequisites independently, safely, and without anxiety through clear visual guidance, interactive checklists, and automated readiness reporting.

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

### Active (Candidate for v1.1)
- [ ] In-browser interactive PowerShell terminal simulation / command sandbox
- [ ] Live 9Router localhost:3000 health check / ping button via fetch
- [ ] Multilingual localization toggle (Indonesian / English)
- [ ] Offline PWA service worker support for offline usage

### Out of Scope
- Automated remote installation on user's machine (security risk; users must run commands themselves).
- Backend server hosting or user authentication (web app runs locally/statically in browser for maximum privacy).
- Hermes agent live execution during pre-training (reserved for live workshop day).

## Context
Shipped v1.0 with ~6,400 LOC of clean Vanilla HTML5, CSS3, and ES6 JavaScript. Zero external build tooling or npm runtime dependencies required. Tested with 46 automated browser-level test assertions passing (100% pass rate).

## Key Decisions
- ✓ **Architecture**: Lightweight, modular Vanilla HTML5, modern CSS3 (Custom Properties, Glassmorphism, Responsive Grid/Flex), and Vanilla JS ES6+ (zero complex build steps required, runnable offline or on any browser) — *Outcome: Good*
- ✓ **Persistence**: Browser `localStorage` for state preservation (steps checked, form input, checkpoint states) — *Outcome: Good*
- ✓ **Safety First**: Client-side only with built-in token detection & redaction assistant to protect sensitive credentials — *Outcome: Good*
- ✓ **Tone & Usability**: Indonesian language matching `PANDUAN-PRE-TRAINING.md`, clean typography, high visual feedback, and clear callouts for checkpoints — *Outcome: Good*

---
*Last updated: 2026-09-03 after v1.0 milestone*
