---
phase: 12-interactive-knowledge-quiz-bab-v-rubrik-evaluasi-laporan-kel
plan: "02"
subsystem: ui-controllers
tags: [quiz-ui, evaluation, rubric, report-exporter, bpsdm-certificate, print-css, search-indexing]

# Dependency graph
requires:
  - phase: 12-interactive-knowledge-quiz-bab-v-rubrik-evaluasi-laporan-kel
    plan: "01"
    provides: StateManager quiz/rubric/evaluation engine, 20-question bank, and generateWordReportText generator
provides:
  - Semantic HTML5 markup for #sec-word-quiz, #sec-word-rubrik, and #sec-word-report with #bpsdm-certificate-card
  - Responsive component CSS and high-fidelity @media print rules for BPSDM Kop Surat certificate
  - Interactive controllers in assets/js/app.js: setupWordQuiz, setupWordRubrik, setupWordGraduationReport, updateWordNavBadges
  - Extended search indexing in assets/js/search.js for quiz cards, reflections, and certificate cards
affects: [Course 2 UI, Bab V evaluation components, Certificate Generator]

actuals:
  tokens: 16500
  tasks: 3
  commits: 4

tech-stack:
  added: []
  patterns: [vanilla event delegation for quiz/rubrics, reactive nav badge updates, high-fidelity print stylesheet isolation, live DOM preview with XSS prevention]

key-files:
  created: []
  modified:
    - index.html
    - assets/css/components.css
    - assets/js/app.js
    - assets/js/search.js

key-decisions:
  - "Sanitized participant form inputs via textContent in live preview and certificate card to prevent XSS injection"
  - "Used existing design system CSS tokens (--accent-primary, --border-strong, --bg-surface-subtle) to maintain 100% WCAG contrast and token resolution across themes"
  - "Preserved strict 28-task baseline in calculateProgress() while tracking Bab V quiz and rubric as independent evaluation vectors"
  - "Wired @media print to isolate #bpsdm-certificate-card with Kop Surat DKI Jakarta, official layout, and hidden sidebar/navigation"

patterns-established:
  - "Interactive quiz options use .selected, .correct, and .incorrect classes with pedagogical explanation box reveal"
  - "Multi-channel export buttons use navigator.clipboard with fallback to document.execCommand('copy') and toast notifications"

requirements-completed:
  - QUIZ-01
  - QUIZ-02
  - QUIZ-03
  - WORD-RPT-01
  - WORD-RPT-02

coverage:
  - id: D1
    description: "Semantic DOM markup in index.html for Bab V quiz, rubric, and graduation report"
    requirement: QUIZ-01
    verification:
      - kind: unit
        ref: "tests/word-quiz-report.test.js#Suite 5: Multi-Channel Exporter & DOM Fixture Integrity"
        status: pass
    human_judgment: false
  - id: D2
    description: "Component and print certificate styling in assets/css/components.css"
    requirement: WORD-RPT-02
    verification:
      - kind: unit
        ref: "tests/mobile-accessibility.test.js#all CSS custom properties resolve and the 9Router endpoint is canonical"
        status: pass
    human_judgment: false
  - id: D3
    description: "Interactive controllers, scoring, and multi-channel report generation"
    requirement: QUIZ-02
    verification:
      - kind: unit
        ref: "tests/word-quiz-report.test.js#Suite 2: Interactive Scoring & State Transitions"
        status: pass
      - kind: unit
        ref: "tests/word-quiz-report.test.js#Suite 4: BPSDM Graduation Report Generation"
        status: pass
    human_judgment: false
---

# Plan 12-02 Summary: Interactive Knowledge Quiz (Bab V), Rubrik Evaluasi & Laporan Kelulusan BPSDM

Plan 12-02 delivered the complete interactive UI, responsive component styling, print certificate layout, event-driven controllers, and multi-channel graduation export system for Course 2 Bab V.

## Key Accomplishments

1. **Semantic DOM Markup (`index.html`)**:
   - Added Bab V navigation links in `#nav-group-word` (`#nav-link-word-quiz`, `#nav-link-word-rubrik`, `#nav-link-word-report`).
   - Built `#sec-word-quiz` containing the live score banner (`#banner-word-quiz-score`), reset button (`#btn-reset-word-quiz`), and all 20 question cards with 4 options and collapsible explanation boxes.
   - Built `#sec-word-rubrik` containing 5 structured reflection prompts, Table 5.1 rubric summary, 9 Lampiran 3 quality checks, and 6 Lampiran 5 portfolio checks.
   - Built `#sec-word-report` featuring participant identity fields, live multi-channel preview, WhatsApp/Telegram action buttons, and `#bpsdm-certificate-card` with official Kop Surat Pemprov DKI Jakarta.

2. **Component & High-Fidelity Print Styling (`assets/css/components.css`)**:
   - Styled quiz options (`.quiz-option-btn`, `.btn-quiz-option`) with clear interactive states (`.selected`, `.correct`, `.incorrect`) and pedagogical explanation boxes.
   - Styled rubric tables, reflection textareas, and score banners using standard design tokens.
   - Designed `#bpsdm-certificate-card` with formal borders, typography, official Kop Surat header, transcript table, and signature blocks.
   - Added `@media print` rules isolating `#bpsdm-certificate-card` for clean, professional single-page printing.

3. **Interactive Controllers & Search Indexing (`assets/js/app.js`, `assets/js/search.js`)**:
   - Implemented `setupWordQuiz()` to bind option click events, invoke `updateQuizAnswer()`, render instant feedback, and handle quiz reset.
   - Implemented `setupWordRubrik()` to bind reflection inputs and rubric checkboxes to `updateWordReflection()` and `updateWordRubric()`.
   - Implemented `setupWordGraduationReport()` to bind participant inputs to live previews, copy WhatsApp/Telegram reports with toast feedback, and trigger `window.print()`.
   - Implemented `updateWordNavBadges()` to update sidebar badge counts and status pills reactively.
   - Extended `assets/js/search.js` to index `.quiz-card`, `.reflection-card`, and `.bpsdm-certificate-card`.

## Verification

All 9 test suites across the repository passed with 0 failures:
- `tests/word-quiz-report.test.js`: 13/13 passed
- `tests/word-modules.test.js`: 71/71 passed
- `tests/multi-course.test.js`: 26/26 passed
- `tests/checkpoint-engine.test.js`: 18/18 passed
- `tests/live-class-modules.test.js`: 68/68 passed
- `tests/mobile-accessibility.test.js`: 6/6 passed
- `tests/mode-switcher.test.js`: 29/29 passed
- `tests/search-security.test.js`: 8/8 passed
- `tests/troubleshooting-exporter.test.js`: 30/30 passed