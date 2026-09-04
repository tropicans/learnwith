# Codebase Structure

**Analysis Date:** 2026-09-04

## Directory Layout

```text
AgenticAI/
├── .agents/                    # GSD workflow orchestration & agent definitions
│   ├── agents/                 # Role definitions (e.g. gsd-codebase-mapper.md)
│   ├── gsd-core/               # GSD core runtime, workflows, scripts, references
│   └── skills/                 # Specialized GSD skills and commands
├── .planning/                  # Project planning, state, roadmap, and codebase docs
│   ├── codebase/               # Mapped codebase documentation (7 documents)
│   ├── milestones/             # Completed milestone archives
│   ├── quick/                  # Quick task records and logs
│   ├── ui-reviews/             # UI audit artifacts
│   ├── MILESTONES.md           # Milestone ledger
│   ├── PROJECT.md              # Project overview and requirements checklist
│   ├── RETROSPECTIVE.md        # Post-milestone retrospective notes
│   ├── ROADMAP.md              # Current roadmap and phase tracking
│   └── STATE.md                # Project status, completed plans, and next steps
├── assets/                     # Web application static assets
│   ├── css/
│   │   ├── main.css            # Base styles, reset, design tokens, light/dark themes
│   │   └── components.css      # UI components, badges, cards, modals, print styles
│   ├── icons/
│   │   └── favicon.svg         # SVG app icon / robot mascot
│   ├── js/
│   │   ├── state.js            # Central StateManager and localStorage persistence
│   │   ├── search.js           # SearchEngine, DOM indexer, XSS-safe text highlighting
│   │   └── app.js              # Application controller, DOM interaction wireup
│   └── neon-workshop-background.png # Visual graphic asset for workshop theme
├── tests/                      # Automated test suite (dual browser & Node runner)
│   ├── checkpoint-engine.test.js      # State, checklist, and checkpoint gate tests
│   ├── mobile-accessibility.test.js   # Responsive layout & accessibility contracts
│   ├── search-security.test.js        # Search highlighting & DOM safety tests
│   ├── troubleshooting-exporter.test.js # Redaction & report generation tests
│   └── index.html                     # Browser-based test runner interface
├── output/                     # Generated workshop assets (gitignored)
│   ├── pdf/                    # Compiled PDF guide (Panduan-Pre-Training-9Router-Hermes.pdf)
│   └── *.pptx                  # Workshop slide decks
├── tmp/                        # Temporary scripts and scratch files (gitignored)
│   └── pdfs/                   # Python PDF generator (build_pretraining_pdf.py)
├── PANDUAN-PRE-TRAINING.md     # Primary curriculum: pre-training guide (Markdown)
├── PANDUAN-PRAKTIK-KELAS.md    # Practical class exercises guide (Markdown)
├── RENCANA-WORKSHOP.md         # Workshop syllabus and timeline (Markdown)
├── favicon.svg                 # Root shortcut icon
└── index.html                  # Main interactive web application entry point
```

## Directory Purposes

**`assets/`:**
- Purpose: Contains all client-side styling, scripts, icons, and visual assets.
- Contains: Modular CSS files (`main.css`, `components.css`), JavaScript modules (`state.js`, `search.js`, `app.js`), and SVG graphics.
- Key files: `assets/js/state.js`, `assets/js/app.js`, `assets/css/main.css`.

**`tests/`:**
- Purpose: Contains the zero-dependency automated test suite.
- Contains: Standalone test scripts executable in both browser and Node.js environments.
- Key files: `tests/index.html`, `tests/checkpoint-engine.test.js`, `tests/troubleshooting-exporter.test.js`.

**`.planning/`:**
- Purpose: GSD project tracking, requirements traceability, and codebase memory.
- Contains: Active roadmap, project specification, codebase maps, milestone logs, and quick task records.
- Key files: `.planning/PROJECT.md`, `.planning/STATE.md`, `.planning/ROADMAP.md`.

**`output/` (Gitignored):**
- Purpose: Houses generated binary outputs including presentation slide decks (`.pptx`) and generated handbook PDFs.

**`tmp/` (Gitignored):**
- Purpose: Scratch scripts, intermediate build assets, and PDF generation scripts.
- Key files: `tmp/pdfs/build_pretraining_pdf.py`.

## Key File Locations

**Entry Points:**
- `index.html`: Main user-facing single-page application.
- `tests/index.html`: Browser-based automated test suite runner.

**Configuration & Design System:**
- `assets/css/main.css:L30-155`: CSS Custom Properties design tokens (colors, spacing, typography, light/dark themes).
- `assets/js/state.js:L7-53`: Default state structure and localStorage key (`'pretraining_app_state_v1'`).

**Core Logic & Engine:**
- `assets/js/state.js:L55-300`: `StateManager` class handling state persistence, checklist counters, and readiness status calculations.
- `assets/js/search.js:L7-235`: `SearchEngine` class providing DOM search indexing and safe text-node highlighting.
- `assets/js/app.js:L7-1030`: DOM interaction controllers, event wireup, and export formatters.

**Automated Testing:**
- `tests/checkpoint-engine.test.js`: Validates checklist counting, checkpoint gating, and persistence.
- `tests/troubleshooting-exporter.test.js`: Validates token redaction regex and formatted report generation.
- `tests/search-security.test.js`: Validates XSS safety and non-destructive search highlighting.
- `tests/mobile-accessibility.test.js`: Validates ARIA compliance, drawer navigation, and 44px touch targets.

## Naming Conventions

**Files:**
- CSS & JS: Lowercase with hyphens or concise words (`main.css`, `components.css`, `state.js`, `app.js`).
- Test Files: Kebab-case ending with `.test.js` (`checkpoint-engine.test.js`, `mobile-accessibility.test.js`).
- Documentation: UPPERCASE with hyphens (`PANDUAN-PRE-TRAINING.md`, `RENCANA-WORKSHOP.md`, `PROJECT.md`).

**DOM IDs & CSS Classes:**
- Container & Sections: `sec-` prefix or descriptive kebab-case (`#sec-target`, `#sec-module-1`, `.app-container`).
- Action Buttons: `btn-` prefix (`#btn-theme-toggle`, `#btn-mobile-menu`, `.btn-copy`, `.btn-checkpoint-pass`).
- Modals & Toasts: Descriptive names (`#modal-reset-confirm`, `#toast-container`).
- Badges: `.badge`, `.badge-pill`, `.badge-[type]` (`.badge-primary`, `.badge-success`, `.badge-warning`).

**JavaScript Identifiers:**
- Classes: PascalCase (`StateManager`, `SearchEngine`).
- Functions & Methods: camelCase (`setupThemeToggle`, `updateChecklist`, `getReadinessStatus`).
- Constants: UPPER_SNAKE_CASE (`STORAGE_KEY`, `DEFAULT_STATE`).

## Where to Add New Code

**New Interactive Feature or Section:**
1. **Markup**: Add semantic section in `index.html` within `<main class="app-main">` with unique ID.
2. **Sidebar Link**: Add corresponding navigation item in `<nav class="sidebar-nav">` in `index.html`.
3. **State (if persistent)**: Register checklist keys or form fields in `DEFAULT_STATE` in `assets/js/state.js`.
4. **Styling**: Add component classes to `assets/css/components.css` or layout rules to `assets/css/main.css`.
5. **Controller**: Add wireup function in `assets/js/app.js` and call it inside `DOMContentLoaded`.
6. **Tests**: Add unit test assertion in appropriate file under `tests/` and link in `tests/index.html`.

**New Troubleshooting Scenario:**
- Add a new `.card` inside the `#troubleshoot-list` container in `index.html:L1700-1900` with appropriate `data-category` attribute (`node`, `router`, `telegram`, or `google`).

**New Secret Redaction Pattern:**
- Add the regex pattern to `sanitizeLogText` in `assets/js/app.js:L820-860` and verify with test assertions in `tests/troubleshooting-exporter.test.js`.

## Special Directories

**`.planning/codebase/`:**
- Purpose: Contains codebase architecture and convention documents for agent reference.
- Generated: Yes (by `/gsd-map-codebase`).
- Committed: Yes.

**`output/`:**
- Purpose: Rendered PowerPoint presentations and generated PDF guides.
- Generated: Yes.
- Committed: No (in `.gitignore`).

**`tmp/`:**
- Purpose: Temporary build caches, scratch files, and helper scripts.
- Generated: Yes.
- Committed: No (in `.gitignore`).

---

*Structure analysis: 2026-09-04*
