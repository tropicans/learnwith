# Roadmap: Pre-Training & Live Workshop Interactive Web App

## Overview

Milestone v1.1 expands the web application from its v1.0 preparation baseline (`PANDUAN-PRE-TRAINING.md`) into a complete dual-purpose workshop companion accommodating the live in-class session (`PANDUAN-PRAKTIK-KELAS.md`). Across four sequential phases (Phases 5–8), we build a seamless mode switcher, interactive modules for 9Router model alignment and Hermes CLI installation, Telegram gateway wiring with strict allowlists, Google Calendar OAuth integration, an expanded live troubleshooting hub, dynamic in-class completion tracking (Checkpoints 4–9), and a 1-click final report exporter for instructors.

## Phases

**Phase Numbering:**
- Phases 1–4: Milestone v1.0 (Shipped 2026-09-03)
- Phases 5–8: Milestone v1.1 (Live Workshop Guide)

- [x] **Phase 5: Mode Switcher & Dual Workshop Navigation Shell** - Header/sidebar tab switcher toggling between "Pra-Training" and "Hari-H Praktik Kelas" modes.
- [x] **Phase 6: 9Router Model Alignment & Hermes Agent Windows Installation** - Guides and Checkpoints 4–6 for 9Router endpoint alignment, Hermes native install, doctor check, and full setup wizard.
- [ ] **Phase 7: Telegram Allowlist Gateway, Google Calendar OAuth & End-to-End Verification** - Guides and Checkpoints 7–9 for Telegram gateway security, Google Cloud Desktop OAuth, Calendar skill authorization, and live test prompts.
- [ ] **Phase 8: In-Class Troubleshooting Hub, Completion Status Engine & Final Report Exporter** - Live workshop error cards, Checkpoints 4–9 state engine calculations, and Form Laporan Hasil Praktik Kelas WhatsApp/Telegram export.

## Phase Details

### Phase 5: Mode Switcher & Dual Workshop Navigation Shell
**Goal**: Enable participants and instructors to toggle seamlessly between Pra-Training (persiapan) and Hari-H (praktik kelas), dynamically rendering the appropriate navigation links, progress trackers, and guide sections while preserving all persistent state.
**Depends on**: Milestone v1.0
**Requirements**: MODE-01, MODE-02
**Success Criteria**:
  1. Header and sidebar display responsive mode toggle switchers (`Pra-Training` vs `Hari-H Praktik Kelas`).
  2. Switching modes updates visible navigation links, search indexing, and active content sections without full page reload.
  3. All previously checked items in Pra-Training remain intact when switching to Hari-H and back.
  4. Mode selection persists in `localStorage` under `activeMode`.
**Plans**: 2 plans

Plans:
- [x] 05-01: Markup and CSS for mode switcher tabs in header and sidebar navigation drawer.
- [x] 05-02: StateManager integration and controller wireup for mode switching, section toggling, and search re-indexing.

---

### Phase 6: 9Router Model Alignment & Hermes Agent Windows Installation
**Goal**: Provide interactive, beginner-friendly guide modules and checkpoint gates for aligning 9Router's model/endpoint and installing/diagnosing Hermes Agent natively on Windows PowerShell.
**Depends on**: Phase 5
**Requirements**: CLASS-01, CLASS-02, CLASS-03, GATE-01, GATE-02, GATE-03
**Success Criteria**:
  1. Modul 6 displays step-by-step guidance for running 9Router locally, choosing the designated class model, setting up the API key privately, and presents Checkpoint 4 Pass/Fail verification gate.
  2. Modul 7 provides 1-click copy for the official Windows native installer `iex (irm https://hermes-agent.nousresearch.com/install.ps1)` and `hermes doctor`, with Checkpoint 5 Pass/Fail gate.
  3. Modul 8 walks participants through `hermes setup` wizard configuring the OpenAI-compatible endpoint `http://localhost:20128/v1`, API key, and model name, followed by Checkpoint 6 Pass/Fail gate for test response.
  4. Interactive checkboxes and checkpoint gates sync immediately to `StateManager` with localStorage persistence.
**Plans**: 2 plans

Plans:
- [x] 06-01: HTML markup and component cards for Modul 6 (9Router alignment) and Modul 7 (Hermes Windows install & doctor).
- [x] 06-02: HTML markup and component cards for Modul 8 (Hermes setup wizard) and Checkpoint Gates 4, 5, 6 with state wireup.

---

### Phase 7: Telegram Allowlist Gateway, Google Calendar OAuth & End-to-End Verification
**Goal**: Guide participants through connecting their Telegram bot to Hermes with strict allowlist user ID filtering, setting up Google Cloud OAuth 2.0 (Desktop app), authorizing Google Calendar, and executing live test prompts.
**Depends on**: Phase 6
**Requirements**: CLASS-04, CLASS-05, CLASS-06, GATE-04, GATE-05, GATE-06
**Success Criteria**:
  1. Modul 9 guides participants through `hermes gateway setup`, `hermes gateway start/status/stop`, enforcing `TELEGRAM_ALLOWED_USERS` allowlist with Checkpoint 7 Pass/Fail gate.
  2. Modul 10 guides Google Cloud Console project creation, Google Calendar API activation, OAuth consent screen, Desktop app Client ID creation, and client secret JSON handling with Checkpoint 8 Pass/Fail gate.
  3. Modul 11 provides copyable prompt scenarios (`Tampilkan agenda saya hari ini`, `Buat agenda uji "Workshop Hermes" besok pukul 09.00...`), post-workshop reboot sequence, and Checkpoint 9 Pass/Fail gate.
  4. Checkpoint validations reflect real-time pass/fail states in the state manager.
**Plans**: 2 plans

Plans:
- [ ] 07-01: HTML markup and interaction wireup for Modul 9 (Telegram Gateway allowlist) and Checkpoint 7 Gate.
- [ ] 07-02: HTML markup and interaction wireup for Modul 10 (Google Calendar OAuth), Modul 11 (Uji End-to-End & Reboot), and Checkpoint Gates 8 & 9.

---

### Phase 8: In-Class Troubleshooting Hub, Completion Status Engine & Final Report Exporter
**Goal**: Expand the troubleshooting hub with in-class runtime error cards, implement overall Live Workshop completion status evaluation, and provide a Form Laporan Hasil Praktik Kelas with 1-click WhatsApp/Telegram export.
**Depends on**: Phase 7
**Requirements**: GATE-07, TRBL-04, TRBL-05, RPT-04, RPT-05
**Success Criteria**:
  1. Troubleshooting hub includes 7 live workshop scenarios (`hermes` not found, 9Router endpoint connection, API key invalid, bot silence, `unauthorized` allowlist error, OAuth Desktop app mismatch, wrong Google Calendar) with live search and category filter.
  2. State engine calculates overall Live Workshop readiness (`BELUM SIAP` -> `DALAM PRAKTIK` -> `SELESAI (SUKSES)`) based on Checkpoints 4–9.
  3. Form Laporan Hasil Praktik Kelas pre-fills Checkpoints 4–9 status, participant info, model used, and test results.
  4. 1-click WhatsApp & Telegram formatted export masks sensitive tokens and produces ready-to-send messages for instructors.
  5. Automated test suite in `tests/` updated with comprehensive unit tests for all new state logic, mode switching, and in-class export formatting, passing with 100% success rate.
**Plans**: 2 plans

Plans:
- [ ] 08-01: Troubleshooting Hub extension with in-class categories and 7 practical resolution cards.
- [ ] 08-02: Live Workshop completion status evaluator, Form Laporan Hasil Praktik Kelas generator, WhatsApp/Telegram export, and test suite verification.

## Progress

**Execution Order:**
Phases execute in numeric order: 5 → 6 → 7 → 8

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation Shell, Navigation & Theme Architecture | 3/3 | Complete ✓ | 2026-09-03 |
| 2. Interactive Guide Modules & 1-Click Execution | 3/3 | Complete ✓ | 2026-09-03 |
| 3. Checklist Engine, Checkpoint Gates & Local Storage State | 2/2 | Complete ✓ | 2026-09-03 |
| 4. Troubleshooting Hub, Secret Redaction Helper & Report Exporter | 3/3 | Complete ✓ | 2026-09-03 |
| 5. Mode Switcher & Dual Workshop Navigation Shell | 0/2 | Not started | - |
| 6. 9Router Model Alignment & Hermes Agent Windows Installation | 0/2 | Not started | - |
| 7. Telegram Allowlist Gateway, Google Calendar OAuth & End-to-End Verification | 0/2 | Not started | - |
| 8. In-Class Troubleshooting Hub, Completion Status Engine & Final Report Exporter | 0/2 | Not started | - |

---
*Roadmap generated: 2026-09-04*
*Last updated: 2026-09-04 for Milestone v1.1*
