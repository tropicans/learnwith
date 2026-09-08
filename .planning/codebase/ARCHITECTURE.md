<!-- refreshed: 2026-09-08 -->
# Architecture

**Analysis Date:** 2026-09-08

## System Overview

```text
┌────────────────────────────────────────────────────────────────────────┐
│               NotebookLM Multi-Course Frontpage & Studio               │
│                             `index.html`                               │
├──────────────────────────┬──────────────────────┬──────────────────────┤
│  Top Bar & Course Menu   │  Course 1: AI Guide  │ Course 2: Word Guide │
│  LY Monogram Brand Pill  │ Pra-Training/Live M6 │ 4 Bab Praktik + Bab V│
│  `assets/css/main.css`   │ `assets/css/main.css`│ `assets/css/main.css`│
│ `assets/css/components`  │`assets/css/components`│`assets/css/components`│
└────────────┬─────────────┴──────────┬───────────┴──────────┬───────────┘
             │                        │                      │
             ▼                        ▼                      ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      Interaction & Controller Layer                    │
│                            `assets/js/app.js`                          │
│  • Theme & Mode Switch  • Mobile Drawer Nav    • 1-Click Code Copy     │
│  • Course Manager Gate  • Accordions & Spies   • Redaction Helper      │
│  • Bab V Quiz Engine    • BPSDM Rubric/Report  • Readiness Exporters   │
└────────────┬───────────────────────────────────────────────┬───────────┘
             │                                               │
             ▼                                               ▼
┌──────────────────────────────┐               ┌─────────────────────────┐
│     Search Engine (Query)    │               │  State Management Engine│
│     `assets/js/search.js`    │               │   `assets/js/state.js`  │
│  • Real-time DOM Indexer     │               │  • Reactive Pub/Sub     │
│  • Debounced Filtering       │               │  • Multi-Course Schema  │
│  • XSS-Safe Highlight Nodes  │               │  • Score & BPSDM Math   │
└──────────────────────────────┘               └─────────────┬───────────┘
                                                             │
                                                             ▼
                                               ┌─────────────────────────┐
                                               │ Browser Storage & Crypto│
                                               │ `config.js` (Hashes)    │
                                               │ Web Crypto SHA-256 API  │
                                               │ `localStorage` (Scoped) │
                                               │ `sessionStorage` (Token)│
                                               └─────────────────────────┘
```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| **HTML Shell & Markup** | Semantic HTML5 structure, CSP meta tags, anti-clickjack styles, NotebookLM top bar, Frontpage Hub (`#container-home`), Course 1 container (`#container-course-ai`), Course 2 container (`#container-course-word`), modals, and print slips | `index.html` |
| **Design System & Layout** | CSS reset, theme tokens, Material 3 elevation, NotebookLM studio header styling, light/dark mode variables, responsive breakpoints | `assets/css/main.css` |
| **UI Components & Atoms** | Cards, badges, buttons, code blocks, tooltips, alert boxes, toasts, quiz option buttons, BPSDM certificate layout, print stylesheets | `assets/css/components.css` |
| **Security Configuration** | Application versioning, course locked flags, session timeouts, and one-way SHA-256 authorized instructor passcode hashes | `config.js` |
| **State Management Engine** | Isolated multi-course state (`learnwith_ai_*` and `learnwith_word_*`), 20-question quiz scoring, self-reflection persistence, rubric checks, BPSDM graduation math (70/30), and reactive subscribers | `assets/js/state.js` |
| **Search Engine** | Real-time DOM scanning, non-destructive text highlighting (TextNode splitting), keyboard shortcuts (`Ctrl+K`), and query filtering | `assets/js/search.js` |
| **App Controller** | Orchestrates DOM event binding, course transitions, developer gate passcodes, mode switching (Pra-Training vs Hari-H), quiz interactions, report formatting, and exports | `assets/js/app.js` |
| **Automated Test Harness** | Dual-environment test execution (browser DOM & Node.js) validating state logic, redaction, search safety, mode switching, quiz evaluation, session security, and CSP | `tests/*.test.js` |

## Pattern Overview

**Overall:** Modular Clean Vanilla Architecture (Separation of Concerns with Reactive Observer Pattern & Cryptographic Gate)

**Key Characteristics:**
- **Zero Runtime Dependencies**: No heavy frontend frameworks; leverages native browser capabilities for instant loading, offline capability, and longevity.
- **Strict Multi-Course State Isolation**: StateManager isolates storage keys per course (`learnwith_ai_state_v1` vs `learnwith_word_state_v1`) preventing data pollution.
- **Cryptographic Gate (Zero-Plaintext)**: Passcodes verified via Web Crypto SHA-256 hashing; passwords never stored or logged in plaintext.
- **Tab-Scoped Session Tokens**: Ephemeral session integrity validated against SHA-256 signatures with auto-lock timeout.
- **Defensive DOM Operations**: Search highlighting avoids `innerHTML` re-assignment to preserve live input states, event listeners, and prevent XSS vulnerabilities.
- **Universal Module Exports (Dual Environment)**: Core JavaScript files export to both browser `window` globals and Node.js `module.exports` for headless CI/CD testing.

## Layers

**1. Presentation & Structure Layer:**
- Purpose: Delivers accessible, semantic markup and design token styling.
- Location: `index.html`, `assets/css/main.css`, `assets/css/components.css`
- Contains: HTML5 semantic tags, SVG icons, CSS custom properties, responsive utility classes.
- Depends on: System fonts and Google Fonts CDN.
- Used by: End users and assistive technologies.

**2. Application Controller Layer:**
- Purpose: Binds user interactions (clicks, keyboard input, scroll, passcodes) to application actions.
- Location: `assets/js/app.js`
- Contains: Event listener setup, drawer animation handlers, clipboard utilities, DOM mutation helpers, quiz controllers.
- Depends on: `config.js`, `assets/js/state.js`, `assets/js/search.js`.
- Used by: Browser runtime on `DOMContentLoaded`.

**3. State & Business Logic Layer:**
- Purpose: Encapsulates state persistence, checklist completion calculations, checkpoint validation, quiz scoring, and BPSDM evaluation math.
- Location: `assets/js/state.js`
- Contains: `StateManager` class, default state constants, storage serialization, course configurations.
- Depends on: Browser `localStorage` API.
- Used by: `assets/js/app.js` and automated test suites.

**4. Search & Filter Engine Layer:**
- Purpose: Provides instant real-time search across guide modules, troubleshooting items, and glossary terms.
- Location: `assets/js/search.js`
- Contains: `SearchEngine` class, DOM indexing, DOM text-node highlighting, query debouncing.
- Depends on: DOM elements in `index.html`.
- Used by: `assets/js/app.js` and test suites.

## Data Flow

### Primary Request Path: Course Switching & Gated Unlock
1. User clicks course pill or Frontpage Hub card (`index.html:L120`).
2. Controller `setupCourseManager()` in `assets/js/app.js` checks if course is locked in `config.js`.
3. If locked, checks `sessionStorage` token and `localStorage` unlock status. If locked and no valid session, displays `#modal-wordcourse-locked`.
4. User enters passcode → Web Crypto SHA-256 hash computed → compared against `window.LEARNWITH_CONFIG.security.allowedPasscodeHashes`.
5. On match, persists unlock state, issues tab-scoped session token, hides modal, and renders `#container-course-word`.

### Secondary Flow: Bab V Quiz & BPSDM Graduation Report
1. User selects options in 20-question quiz cards (`quiz-card-*`).
2. Controller calls `AppState.updateQuizAnswer(qId, selectedOption)`.
3. StateManager validates against `WORD_QUIZ_QUESTIONS`, recalculates score (each 5 pts, KKM 80), and emits state change.
4. Rubrik checkboxes and reflection textareas trigger `updateWordRubric()` and `updateWordReflection()`.
5. BPSDM formula (`0.7 * practiceScore + 0.3 * quizScore`) computes final grade and assigns Predikat (Sangat Memuaskan / Memuaskan / Cukup / Kurang).
6. Export handlers format output for WhatsApp, Telegram, or `@media print`.

## Key Abstractions

**StateManager:**
- Purpose: Single source of truth for active course, checklists, checkpoints, quiz scores, and user metadata.
- Examples: `assets/js/state.js`
- Pattern: Reactive Event Emitter / Observer.

**SearchEngine:**
- Purpose: Non-destructive DOM search indexer and query highlighter.
- Examples: `assets/js/search.js`
- Pattern: TextNode Splitter & Token Filter.

**SessionSecurityManager:**
- Purpose: Manages tab-scoped session tokens, inactivity timeout, and URL sanitization.
- Examples: `assets/js/app.js`
- Pattern: Token Authenticator & Lifecycle Guard.

## Entry Points

**Web Application Entry:**
- Location: `index.html`
- Triggers: User opens the file via browser or visits hosted web address.
- Responsibilities: Loads CSP metadata, loads `config.js` → `state.js` → `search.js` → `app.js`, mounts NotebookLM studio and default Frontpage Hub.

**Automated Test Runner Entry (Browser):**
- Location: `tests/index.html`
- Triggers: Opened in browser.
- Responsibilities: Intercepts `console.log` and renders formatted test pass/fail logs to screen.

**Automated Test Runner Entry (Node.js / CI):**
- Location: `tests/*.test.js`
- Triggers: `node tests/<suite>.test.js`.
- Responsibilities: Instantiates production classes in mocked DOM/localStorage environment and asserts contract behaviors.

## Architectural Constraints

- **Single-Threaded Event Loop**: All DOM operations execute on the main thread; intensive operations like search query scanning use a 150ms debounce timer to prevent frame drops.
- **Client-Side Origin Isolation**: `localStorage` data is isolated per protocol/host/port origin; state does not cross origins.
- **Zero Build Artifacts**: Code files must remain pure vanilla JavaScript without non-standard syntax (no JSX, no TypeScript types in runtime files).
- **No External CDN Dependencies for Logic**: Core scripts must run completely offline without internet connectivity.
- **Content Security Policy (CSP)**: Strictly limits script and network connections (`connect-src 'self' https://generativelanguage.googleapis.com https://api.telegram.org; object-src 'none'; base-uri 'self'`).

## Anti-Patterns

### Anti-Pattern 1: Direct innerHTML Injection in Search Highlights
- **What happens:** Replacing element `.innerHTML` with `<mark>` tags destroys attached event listeners and resets user-typed form values.
- **Why it's wrong:** Causes interactive checkboxes, copy buttons, and input fields within the searched containers to lose functionality.
- **Do this instead:** Use DOM TextNode splitting (`document.createTextNode` and `document.createElement('mark')`) as implemented in `assets/js/search.js`.

### Anti-Pattern 2: Plaintext Passcodes in Source Code or Global Objects
- **What happens:** Storing plain text passcodes like `window.WORD_PASSCODES = ['...']` or in HTML placeholders.
- **Why it's wrong:** Any user opening browser DevTools or reading source can immediately bypass the gate.
- **Do this instead:** Store only one-way cryptographic SHA-256 hashes in `config.js` and verify input via `crypto.subtle.digest()`.

## Error Handling

**Strategy:** Graceful degradation and user-friendly visual feedback.

**Patterns:**
- **LocalStorage Quota / Exception Guarding**: `assets/js/state.js` wraps `localStorage.getItem` and `setItem` in `try...catch` blocks, falling back to in-memory state if cookies/storage are disabled.
- **DOM Element Presence Checking**: Every controller function in `assets/js/app.js` checks element existence (`if (!element) return;`) before attaching event listeners.
- **Clipboard API Fallback**: `setupCodeCopy()` in `assets/js/app.js` handles `navigator.clipboard.writeText` rejection and alerts the user with helpful error toasts.

## Cross-Cutting Concerns

**Logging:** Standard `console.log` and `console.warn` wrapped during automated test runs.
**Validation:** Form inputs validated with friendly regex constraints; Telegram usernames automatically normalized with `@`.
**Accessibility:** Full keyboard navigation support (Skip-to-content, `Ctrl+K` search focus, Tab/Enter/Space accordion controls, 44px touch targets on mobile).

---

*Architecture analysis: 2026-09-08*
