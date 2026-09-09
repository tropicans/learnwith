# Phase 28 Research: Laporan Kesiapan Generator, Sidebar Sync & E2E Zero Regression

## 1. Executive Summary & Objectives
Phase 28 is the final phase of Milestone v3.1 ("Pre-Training Parity in TanStack Start").
It delivers:
1. **Laporan Kesiapan Generator Section (`#sec-readiness-report`)**:
   - Requirements `PRE-RPT-01`, `PRE-RPT-02`, `PRE-RPT-03`.
   - Input fields: Name (`#input-report-name`), Operating System selector (`#select-report-os`), problem step (`#input-report-problem-step`), and error log message (`#input-report-error-msg`).
   - Pure generator utility (`app/utils/reportGenerator.ts`) producing standardized WhatsApp and Telegram Markdown reports with live preview (`#report-output-preview`).
   - Integrated sanitization using `sanitizeLogText` (from `app/utils/redaction.ts`).
   - 1-click clipboard copy (`#btn-copy-report`) with toast feedback.
   - Clean printable layout / PDF export (`#btn-print-report` triggering `window.print()` with `@media print` rules hiding navigation/buttons).
2. **Sidebar Navigation Synchronization (`#app-sidebar`)**:
   - Requirements `PRE-NAV-01`, `PRE-NAV-02`.
   - Sidebar component (`app/components/course/pretraining/PretrainingSidebar.tsx`) rendering `aside#app-sidebar.app-sidebar` with 4 pretraining nav groups matching `index.html` lines 325–450:
     - Pendahuluan (`#sec-target`, `#sec-glosarium`, `#sec-security`, `#sec-prerequisites`, `#sec-powershell`)
     - Modul Praktik (`#sec-module-1`..`#sec-module-5`) with dynamic badge counters (`badge-nav-m1`..`badge-nav-m4`)
     - Gerbang Checkpoint (`#sec-checkpoint-1`..`#sec-checkpoint-3`) with dynamic status badges (`status-nav-cp1`..`status-nav-cp3`)
     - Bantuan & Laporan (`#sec-troubleshooting`, `#sec-redaction`, `#sec-readiness-report`)
   - Scrollspy active link tracking across viewport scroll.
   - Seamless mode switching (`📋 Pra-Training` vs `🚀 Hari-H Kelas`) preserving route query params (`?mode=pretraining` vs `?mode=live-class`).
3. **E2E Zero Regression Verification (`PRE-NAV-03`)**:
   - 100% test pass rate across all Node native test suites (`tests/*.test.js`).
   - 100% clean TypeScript typecheck (`tsc --noEmit`).
   - Multi-course isolation strictly enforced (zero pollution between Course 1 AI and Course 2 Word).
