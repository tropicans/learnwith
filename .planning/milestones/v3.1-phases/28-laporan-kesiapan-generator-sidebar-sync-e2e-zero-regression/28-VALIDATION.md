# Phase 28 Validation Matrix

| Requirement | Plan | Test / Verification Artifact | Status |
|---|---|---|---|
| `PRE-RPT-01` (Form Laporan Kesiapan) | 28-02 | `app/components/course/pretraining/PretrainingReadinessReportSection.tsx`, DOM IDs `#input-report-name`, `#select-report-os`, `#input-report-problem-step`, `#input-report-error-msg`, `<pre id="report-output-preview">` | Planned |
| `PRE-RPT-02` (Readiness Report Exporter) | 28-01 | `app/utils/reportGenerator.ts`, `tests/pretraining-readiness-report.test.js`, WhatsApp & Telegram format, token redaction | Planned |
| `PRE-RPT-03` (Print Action & Print Media CSS) | 28-02 | `#btn-copy-report` toast feedback, `#btn-print-report` triggering `window.print()`, `@media print` in `public/assets/css/components.css` | Planned |
| `PRE-NAV-01` (Sidebar Navigation Groups & Dynamic Badges) | 28-02 | `app/components/course/pretraining/PretrainingSidebar.tsx`, `aside#app-sidebar`, 4 nav groups, `#badge-nav-m1`..`#badge-nav-m4`, `#status-nav-cp1`..`#status-nav-cp3`, scrollspy | Planned |
| `PRE-NAV-02` (Seamless Mode Switcher) | 28-02 | `PretrainingSidebar.tsx` tabs `📋 Pra-Training` & `🚀 Hari-H Kelas`, preserving `?mode=pretraining` vs `?mode=live-class` in TanStack Router | Planned |
| `PRE-NAV-03` (E2E Zero Regression Verification) | 28-01, 28-02 | `tests/*.test.js` (19 test files, 100% pass), `tsc --noEmit` (0 errors), multi-course state isolation | Planned |
