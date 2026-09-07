# Milestones

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
