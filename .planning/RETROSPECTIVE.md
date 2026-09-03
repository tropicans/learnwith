# Project Retrospective

## Milestone: v1.0 — Pre-Training Interactive Web App

**Shipped:** 2026-09-03
**Phases:** 4 | **Plans:** 11 | **Requirements:** 18/18 (100%)

### What Was Built
A modern, responsive, and beginner-friendly web application designed to guide workshop participants through `PANDUAN-PRE-TRAINING.md` (Workshop Hermes Agent + 9Router). Features 5 structured pre-training modules, 1-click command copying with toast alerts, interactive glossary popovers, 13 persistent checklist items, 3 gated checkpoint validation cards with regex checks, dynamic readiness badge evaluation, a 10-issue Troubleshooting Hub, client-side regex Token Redaction workbench, and an automated Section 15 Form Laporan Kesiapan with 1-click WhatsApp/Telegram clipboard export.

### What Worked
- **Vanilla Stack Selection**: Choosing pure HTML5, CSS custom properties, and ES6 JavaScript without Node build steps or framework dependencies made development ultra-fast, zero-overhead, and completely free of build tooling failures.
- **Single Source of Truth in AppState**: Using a clean reactive event bus (`AppState.subscribe` and `AppState.notify`) ensured that ticking a step checkbox instantly updated sidebar counters, global progress bar, checkpoint readiness, and Section 15 export text synchronously.
- **Specification-Driven Milestones**: Structuring requirements across 4 distinct phases (Foundation $\to$ Guide Modules $\to$ Checkpoints $\to$ Exporter) allowed clean compartmentalized execution with zero regression between phases.
- **Browser-Based Automated Testing**: Running 46 automated assertions via headless Edge directly against DOM elements ensured all user flows (checkbox toggling, validation logic, redaction, and report generation) were validated before milestone closure.

### What Was Inefficient
- **Initial Plan Fragmentation**: Splitting Phase 1 and 2 into separate static layout and styling steps could have been batched slightly tighter.
- **Testing Setup**: Testing required headless browser execution rather than lightweight Node test runners due to the browser DOM dependencies, though headless Edge proved reliable.

### Patterns Established
- **Glassmorphic Modern UI**: Curated slate/indigo color tokens with dark mode defaults, backdrop blur filters, and clear visual card hierarchy.
- **Secret Redaction Safety**: Pre-submission regex masking for sensitive credentials (Telegram bot tokens, Google Cloud API keys) to protect participants in public chat rooms.
- **Dual Export Paths**: Providing both copy-to-clipboard (WhatsApp/Telegram formatted) and `@media print` CSS for physical or PDF archiving.

### Key Lessons
- Clear error guidance (Troubleshooting Hub) paired with automated log redaction eliminates the single largest support hurdle in pre-workshop onboarding.
- Visual checkpoint feedback (`SIAP MENGIKUTI WORKSHOP` vs `PERLU TECHNICAL CLINIC`) gives participants immediate confidence before entering the live training room.

---

## Cross-Milestone Trends

| Milestone | Phases | Plans | Tests | Pass Rate | Shipped Date |
|-----------|--------|-------|-------|-----------|--------------|
| v1.0 | 4 | 11 | 46 | 100% | 2026-09-03 |
