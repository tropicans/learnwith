# Phase 28 Patterns: Laporan Kesiapan Generator, Sidebar Sync & E2E Zero Regression

## 1. Exporter Engine Pattern (`app/utils/reportGenerator.ts`)
- Pure function with clear options interface:
```typescript
export interface ReportOptions {
  name?: string
  os?: string
  probStep?: string
  errorMsg?: string
  participantInfo?: {
    name?: string
    nodeVersion?: string
    telegramUsername?: string
    telegramUserId?: string
  }
  checkpoints?: Record<'cp-1' | 'cp-2' | 'cp-3', 'pending' | 'passed' | 'failed'>
  moduleChecklists?: Record<string, boolean>
  status?: 'ready' | 'clinic' | 'pending'
  format?: 'whatsapp' | 'telegram'
}
```
- Integration with `sanitizeLogText`:
  Automatically masks OpenAI API keys, Google Cloud API keys, Telegram Bot tokens, Windows user paths, and email addresses.
- Normalizes Telegram username (`@@bot` -> `@bot`).

## 2. Component Design Patterns
- `PretrainingReadinessReportSection.tsx`:
  - Uses `usePretrainingState` hook to populate initial name and react to checkpoint/checklist changes.
  - Form state updates update live preview in `<pre id="report-output-preview" className="report-preview-box">`.
  - Copy button `#btn-copy-report` with `navigator.clipboard.writeText` and fallback.
  - Print button `#btn-print-report` calling `window.print()`.
- `PretrainingSidebar.tsx`:
  - Displays `<aside id="app-sidebar" className="app-sidebar">`.
  - Tracks active section using `IntersectionObserver` or scroll listener.
  - Displays dynamic badges (`#badge-nav-m1`..`#badge-nav-m4`) and checkpoint status pills (`#status-nav-cp1`..`#status-nav-cp3`).
  - Mode switching with TanStack Router `<Link to="/course/ai" search={{ mode: 'pretraining' }} />` and `<Link to="/course/ai" search={{ mode: 'live-class' }} />`.

## 3. Multi-Course & Zero Regression Invariants
- `learnwith_ai_state_v1` remains strictly isolated from `learnwith_word_state_v1`.
- All 18 existing test files + 1 new test file (`tests/pretraining-readiness-report.test.js`) must pass cleanly with 0 failures.
