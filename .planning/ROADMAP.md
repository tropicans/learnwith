# Roadmap — Milestone v1.0: Pre-Training Interactive Web App

## Overview
Transform `PANDUAN-PRE-TRAINING.md` into an interactive, intuitive, and modern web application with real-time checklist tracking, 1-click command copying, checkpoint validation, troubleshooting assistance, and 1-click readiness report generation.

## Phases

| # | Phase | Goal | Requirements | Success Criteria | Status |
|---|-------|------|--------------|------------------|--------|
| 1 | Core Foundation & Shell | Establish responsive layout, theme tokens, sidebar navigation, search bar, and progress metrics | UI-01, UI-02, UI-03 | 3 | ✅ Completed |
| 2 | Interactive Modules & Guide Engine | Build the 5 core practical modules with structured steps, 1-click copy commands, glossary popovers, and safety alerts | GUIDE-01, GUIDE-02, GUIDE-03, GUIDE-04, GUIDE-05 | 4 | ✅ Completed |
| 3 | Checklist & Checkpoint Engine | Implement interactive checkboxes, 3 gated checkpoints, automated readiness calculation, and localStorage sync | CHK-01, CHK-02, CHK-03, CHK-04 | 4 | ✅ Completed |
| 4 | Troubleshooting & Report Exporter | Build error diagnostic search, token redaction helper, and 1-click readiness report generator for WhatsApp/Telegram | TRBL-01, TRBL-02, TRBL-03, RPT-01, RPT-02, RPT-03 | 4 | ✅ Completed |

---

### Phase Details

#### Phase 1: Core Foundation & Shell
- **Goal**: Create modern responsive UI shell with sidebar/mobile drawer, dark/light mode toggle, progress tracking header, and instant search filter.
- **Requirements**: UI-01, UI-02, UI-03
- **Success Criteria**:
  1. Responsive layout renders cleanly on desktop and mobile with harmonious modern typography and dark/light modes.
  2. Search bar filters modules, steps, and glossary terms with real-time highlighted results.
  3. Header reflects overall pre-training progress percentage and active section.

#### Phase 2: Interactive Modules & Guide Engine
- **Goal**: Build all 5 interactive modules reflecting the pre-training workflow with 1-click copyable commands and visual cues.
- **Requirements**: GUIDE-01, GUIDE-02, GUIDE-03, GUIDE-04, GUIDE-05
- **Success Criteria**:
  1. All 5 modules (Persiapan, Node.js, 9Router, Telegram Bot, Google Cloud) render with crystal-clear hierarchy and expandable sections.
  2. Every PowerShell command has a 1-click copy button with animated toast confirmation.
  3. Important warnings (Jangan pilih provider/model, Jangan instal Hermes dulu) are styled with prominent alert cards.
  4. Glossary terms feature interactive tooltips/modals explaining technical concepts in plain Indonesian.

#### Phase 3: Checklist & Checkpoint Engine
- **Goal**: Provide complete stateful checklist system with 3 Checkpoint verifications and automatic status determination.
- **Requirements**: CHK-01, CHK-02, CHK-03, CHK-04
- **Success Criteria**:
  1. Users can toggle checklist items at each step; changes persist across page reloads via `localStorage`.
  2. Checkpoints 1, 2, and 3 have dedicated pass/fail verification prompts and visual status badges.
  3. Final status badge dynamically evaluates to `SIAP MENGIKUTI WORKSHOP` or `PERLU TECHNICAL CLINIC`.
  4. Users can reset all progress with a single confirmation modal.

#### Phase 4: Troubleshooting & Report Exporter
- **Goal**: Integrate error diagnostics, token redaction tool, and 1-click readiness report export for instructors.
- **Requirements**: TRBL-01, TRBL-02, TRBL-03, RPT-01, RPT-02, RPT-03
- **Success Criteria**:
  1. Troubleshooting hub lists all Section 12 issues with searchable keywords and step-by-step resolution cards.
  2. Redaction helper detects and masks potential API keys, bot tokens, and sensitive data before copying error logs.
  3. Pre-filled "Form Laporan Kesiapan" automatically updates based on participant inputs and checklist status, ready to copy for WhatsApp/Telegram.
  4. Print/PDF-ready layout formatted cleanly for offline review.
