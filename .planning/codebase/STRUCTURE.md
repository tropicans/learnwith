# Codebase Structure

**Analysis Date:** 2026-09-08

## Directory Layout

```text
learnwith/
├── .agents/                    # GSD workflow orchestration & agent definitions
│   ├── agents/                 # Role definitions (e.g. gsd-codebase-mapper.md)
│   ├── gsd-core/               # GSD core runtime, workflows, scripts, references
│   └── skills/                 # Specialized GSD skills and commands
├── .planning/                  # Project planning, state, roadmap, and codebase docs
│   ├── codebase/               # Mapped codebase documentation (7 documents)
│   ├── milestones/             # Completed milestone archives (v1.0, v1.1, v2.0, v2.1)
│   ├── quick/                  # Quick task records and logs
│   ├── ui-reviews/             # UI audit artifacts
│   ├── MILESTONES.md           # Milestone ledger
│   ├── PROJECT.md              # Project overview and requirements checklist
│   ├── RETROSPECTIVE.md        # Post-milestone retrospective notes
│   ├── ROADMAP.md              # Current roadmap and phase tracking
│   └── STATE.md                # Project status, completed plans, and next steps
├── assets/                     # Web application static assets
│   ├── css/
│   │   ├── main.css            # Base styles, reset, design tokens, light/dark themes, layout
│   │   └── components.css      # UI components, badges, cards, modals, print styles, quiz UI
│   ├── icons/
│   │   └── favicon.svg         # SVG LY monogram brand mascot & favicon
│   ├── js/
│   │   ├── state.js            # Central StateManager, multi-course storage, and quiz scoring
│   │   ├── search.js           # SearchEngine, DOM indexer, XSS-safe text highlighting
│   │   └── app.js              # Application controller, DOM interaction, gates, and exporters
│   └── neon-workshop-background.png # Visual graphic asset for workshop theme
├── tests/                      # Automated test suite (dual browser & Node runner)
│   ├── checkpoint-engine.test.js      # State, checklist, and checkpoint gate tests
│   ├── csp-dom-security.test.js       # Content Security Policy & DOM sanitization tests
│   ├── index.html                     # Browser-based test runner interface
│   ├── live-class-modules.test.js     # Moduls 6-11 live class tests
│   ├── mobile-accessibility.test.js   # Responsive layout & accessibility contracts
│   ├── mode-switcher.test.js          # Mode switcher (Pra-Training vs Hari-H) tests
│   ├── multi-course.test.js           # Multi-course isolation & gate tests
│   ├── search-security.test.js        # Search highlighting & DOM safety tests
│   ├── session-security.test.js       # URL hardening, session tokens, auto-lock tests
│   ├── troubleshooting-exporter.test.js # Redaction & report generation tests
│   ├── word-modules.test.js           # Course 2 Bab I-IV guides and checklists
│   └── word-quiz-report.test.js       # Course 2 Bab V quiz, rubric, and BPSDM report
├── output/                     # Generated workshop assets (gitignored)
│   ├── pdf/                    # Compiled PDF guide (Panduan-Pre-Training-9Router-Hermes.pdf)
│   └── *.pptx                  # Workshop slide decks
├── scratch/                    # Temporary scratch scripts and debug files
├── tmp/                        # Temporary build caches and scratch files (gitignored)
│   └── pdfs/                   # Python PDF generator (build_pretraining_pdf.py)
├── config.js                   # Application configuration, versioning, and hashed passcodes
├── favicon.svg                 # Root shortcut icon (LY Monogram)
├── index.html                  # Main interactive web application entry point
├── PANDUAN-PRAKTIK-KELAS.md    # Practical class exercises guide (Markdown)
├── PANDUAN-PRE-TRAINING.md     # Primary curriculum: pre-training guide (Markdown)
└── RENCANA-WORKSHOP.md         # Workshop syllabus and timeline (Markdown)
```

## Directory Purposes

**`assets/`:**
- Purpose: Contains all client-side styling, scripts, icons, and visual assets.
- Contains: Modular CSS files (`main.css`, `components.css`), JavaScript modules (`state.js`, `search.js`, `app.js`), and SVG graphics.
- Key files: `assets/js/state.js`, `assets/js/app.js`, `assets/css/main.css`, `assets/css/components.css`.

**`tests/`:**
- Purpose: Contains the zero-dependency automated test suite.
- Contains: Standalone test scripts executable in both browser and Node.js environments.
- Key files: `tests/index.html`, `tests/*.test.js`.

**`.planning/`:**
- Purpose: GSD project tracking, requirements traceability, and codebase memory.
- Contains: Active roadmap, project specification, codebase maps, milestone logs, and quick task records.
- Key files: `.planning/PROJECT.md`, `.planning/STATE.md`, `.planning/ROADMAP.md`.

## Key File Locations

**Entry Points:**
- `index.html`: Main user-facing single-page application.
- `tests/index.html`: Browser-based automated test suite runner.

**Configuration & Security:**
- `config.js`: Centralized config with version (`2.2.0`), course lock status, session timeout, and SHA-256 hashed passcodes.
- `assets/css/main.css`: CSS Custom Properties design tokens, responsive layout, and theme modes.
- `assets/js/state.js`: Multi-course state schemas (`DEFAULT_STATE`, `WORD_DEFAULT_STATE`) and question banks.

**Core Logic & Engine:**
- `assets/js/state.js`: `StateManager` class handling state persistence, checklist counters, quiz scoring, and BPSDM math.
- `assets/js/search.js`: `SearchEngine` class providing DOM search indexing and safe text-node highlighting.
- `assets/js/app.js`: DOM interaction controllers, event wireup, gate authenticators, and export formatters.

## Naming Conventions

**Files:**
- CSS & JS: Lowercase with hyphens or concise words (`main.css`, `components.css`, `state.js`, `app.js`, `config.js`).
- Test Files: Kebab-case ending with `.test.js` (`checkpoint-engine.test.js`, `session-security.test.js`).
- Documentation: UPPERCASE with hyphens (`PANDUAN-PRE-TRAINING.md`, `RENCANA-WORKSHOP.md`, `PROJECT.md`).

**DOM IDs & CSS Classes:**
- Container & Sections: `sec-` prefix or descriptive kebab-case (`#sec-target`, `#sec-word-quiz`, `.app-container`, `#container-home`).
- Action Buttons: `btn-` prefix (`#btn-theme-toggle`, `#btn-mobile-menu`, `.btn-copy`, `.btn-submit-word-unlock`).
- Modals & Toasts: Descriptive names (`#modal-reset-confirm`, `#modal-wordcourse-locked`, `#toast-container`).
- Badges: `.badge`, `.badge-pill`, `.badge-[type]`.

**JavaScript Identifiers:**
- Classes: PascalCase (`StateManager`, `SearchEngine`, `SessionSecurityManager`).
- Functions & Methods: camelCase (`setupThemeToggle`, `updateChecklist`, `calculateWordGraduation`).
- Constants: UPPER_SNAKE_CASE (`STORAGE_KEY`, `DEFAULT_STATE`, `WORD_QUIZ_QUESTIONS`).

## Where to Add New Code

**New Course:**
1. Register course descriptor in `COURSE_CONFIGS` in `assets/js/state.js`.
2. Add dedicated markup container (`#container-course-[id]`) and navigation sidebar group in `index.html`.
3. Wire course switcher logic in `setupCourseManager()` in `assets/js/app.js`.
4. Create test suite in `tests/[id]-modules.test.js`.

**New Interactive Feature or Section:**
1. **Markup**: Add semantic section in `index.html` within `<main class="app-main">` with unique ID.
2. **Sidebar Link**: Add corresponding navigation item in `<nav class="sidebar-nav">` in `index.html`.
3. **State**: Register checklist keys in state schema in `assets/js/state.js`.
4. **Styling**: Add component classes to `assets/css/components.css`.
5. **Controller**: Add wireup function in `assets/js/app.js`.
6. **Tests**: Add unit test assertion in appropriate file under `tests/`.

## Special Directories

**`.planning/codebase/`:**
- Purpose: Contains codebase architecture and convention documents for agent reference.
- Generated: Yes (by `/gsd-map-codebase`).
- Committed: Yes.

**`output/`:**
- Purpose: Rendered PowerPoint presentations and generated PDF guides.
- Committed: No (in `.gitignore`).

---

*Structure analysis: 2026-09-08*
