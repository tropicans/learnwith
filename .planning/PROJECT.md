# Pre-Training Workshop Interactive Checklist & Guide Web App

## What This Is
A modern, responsive, and beginner-friendly web application designed to guide workshop participants through `PANDUAN-PRE-TRAINING.md` (Workshop Hermes Agent + 9Router: Mengelola Google Calendar melalui Telegram). It provides interactive step-by-step guidance, one-click command copying, real-time checklist tracking with `localStorage` persistence, automated checkpoint readiness evaluation, interactive troubleshooting, token redaction helper, and instant readiness report generation for instructors.

## Core Value
Empower non-technical participants to complete all pre-training prerequisites independently, safely, and without anxiety through clear visual guidance, interactive checklists, and automated readiness reporting.

## Key Decisions
- **Architecture**: Lightweight, modular Vanilla HTML5, modern CSS3 (Custom Properties, Glassmorphism, Responsive Grid/Flex), and Vanilla JS ES6+ (zero complex build steps required, runnable offline or on any browser).
- **Persistence**: Browser `localStorage` for state preservation (steps checked, form input, checkpoint states).
- **Safety First**: Client-side only with built-in token detection & redaction assistant to protect sensitive credentials.
- **Tone & Usability**: Indonesian language matching `PANDUAN-PRE-TRAINING.md`, clean typography, high visual feedback, and clear callouts for checkpoints.

## Current Milestone: v1.0 — Pre-Training Interactive Web App

### Goals
- Implement interactive step-by-step walkthrough covering Sections 1–16 of `PANDUAN-PRE-TRAINING.md`.
- Provide 1-click copy for all commands, scripts, and URLs.
- Implement 3 Milestone Checkpoints & 12 Final Checklist items with real-time status calculation (SIAP / PERLU TECHNICAL CLINIC).
- Provide interactive troubleshooting search for common errors (Node not recognized, PowerShell scripts disabled, Port/Dashboard issue, etc.).
- Provide Report Generator allowing participants to export their pre-filled readiness report to WhatsApp/Telegram in 1 click.
- Provide a Token & Error Redaction helper to safely redact credentials before sending error messages.

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
