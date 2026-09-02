# Milestone v1.0 Requirements — Pre-Training Interactive Web App

## Requirements

### UI & Core Architecture
- [ ] **UI-01**: User can view a responsive, modern layout with sidebar navigation, progress indicator, and light/dark theme toggle.
- [ ] **UI-02**: User can search and filter through all steps, glossary terms, and troubleshooting guides quickly.
- [ ] **UI-03**: User can view visual indicators for completed steps, active checkpoints, and overall readiness percentage.

### Interactive Step-by-Step Guide
- [ ] **GUIDE-01**: User can follow the 5 pre-training activities with collapsible/expandable sections corresponding to `PANDUAN-PRE-TRAINING.md`.
- [ ] **GUIDE-02**: User can copy PowerShell and command-line commands with a single click and receive instant visual toast feedback.
- [ ] **GUIDE-03**: User can view glossary tooltips and explanations for technical terms (Node.js, npm, 9Router, BotFather, Token, localhost, etc.).
- [ ] **GUIDE-04**: User can clearly distinguish cautionary sections (e.g., "Jangan memilih provider/model dulu", "Jangan instal Hermes dulu").
- [ ] **GUIDE-05**: User can click direct external links (Node.js download, Google Cloud Console, official docs) with security warnings.

### Checkpoints & Interactive Checklist
- [ ] **CHK-01**: User can check off interactive items across all stages (Persiapan, Node.js, 9Router, Telegram Bot, Google Cloud).
- [ ] **CHK-02**: User can validate Checkpoint 1 (Node.js & npm), Checkpoint 2 (9Router Dashboard), and Checkpoint 3 (Bot Telegram & User ID).
- [ ] **CHK-03**: User can view real-time readiness status badge: `SIAP MENGIKUTI WORKSHOP` or `PERLU TECHNICAL CLINIC`.
- [ ] **CHK-04**: User progress and checked states are automatically saved to `localStorage` and can be reset if needed.

### Troubleshooting & Safety Tools
- [ ] **TRBL-01**: User can search and filter common error scenarios (`node not recognized`, `running scripts is disabled`, `9router not found`, `EPERM/admin`, port/dashboard issue).
- [ ] **TRBL-02**: User can use the interactive "Redaction Helper" to paste error logs and automatically mask API keys, bot tokens, and passwords before sharing.
- [ ] **TRBL-03**: User can access quick guidance on how to report issues formatted according to Section 13 of the guide.

### Report Exporter & Form Generator
- [ ] **RPT-01**: User can input their name and operating system to automatically generate the Section 15 "Form Laporan Kesiapan".
- [ ] **RPT-02**: User can copy the formatted readiness report text to clipboard for sending via WhatsApp or Telegram with 1 click.
- [ ] **RPT-03**: User can print or export a clean summary checklist as PDF/Print view.

## Future Requirements (v1.1+)
- Interactive PowerShell simulation/validator to test commands virtually.
- Integration with Hermes live API testing once workshop begins.

## Out of Scope
- Automated remote installation on user's machine (security risk; users must run commands themselves).
- Backend server hosting or user authentication (web app runs locally/statically in browser for maximum privacy).

## Traceability Matrix

| Requirement | Phase | Status |
|-------------|-------|--------|
| UI-01 | Phase 1 | Planned |
| UI-02 | Phase 1 | Planned |
| UI-03 | Phase 1 | Planned |
| GUIDE-01 | Phase 2 | Planned |
| GUIDE-02 | Phase 2 | Planned |
| GUIDE-03 | Phase 2 | Planned |
| GUIDE-04 | Phase 2 | Planned |
| GUIDE-05 | Phase 2 | Planned |
| CHK-01 | Phase 3 | Planned |
| CHK-02 | Phase 3 | Planned |
| CHK-03 | Phase 3 | Planned |
| CHK-04 | Phase 3 | Planned |
| TRBL-01 | Phase 4 | Planned |
| TRBL-02 | Phase 4 | Planned |
| TRBL-03 | Phase 4 | Planned |
| RPT-01 | Phase 4 | Planned |
| RPT-02 | Phase 4 | Planned |
| RPT-03 | Phase 4 | Planned |
