<!-- refreshed: 2026-09-04 -->
# Architecture

**Analysis Date:** 2026-09-04

## System Overview

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        User Interface (View Layer)                     │
│                             `index.html`                               │
├──────────────────────────┬──────────────────────┬──────────────────────┤
│    Sidebar Navigation    │   Interactive Guide  │ Troubleshooting Hub  │
│  & Responsive Drawer     │  & Checkpoint Gates  │  & Report Exporter   │
│  `assets/css/main.css`   │ `assets/css/main.css`│ `assets/css/main.css`│
│ `assets/css/components`  │`assets/css/components`│`assets/css/components`│
└────────────┬─────────────┴──────────┬───────────┴──────────┬───────────┘
             │                        │                      │
             ▼                        ▼                      ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      Interaction & Controller Layer                    │
│                            `assets/js/app.js`                          │
│  • Theme Switcher       • Mobile Drawer      • 1-Click Code Copy       │
│  • Navigation Spy       • Accordions         • Redaction Engine        │
│  • Checkpoint Gate UI   • Form Sync          • Report Generator        │
└────────────┬───────────────────────────────────────────────┬───────────┘
             │                                               │
             ▼                                               ▼
┌──────────────────────────────┐               ┌─────────────────────────┐
│     Search Engine (Query)    │               │  State Management Engine│
│     `assets/js/search.js`    │               │   `assets/js/state.js`  │
│  • Real-time DOM Indexer     │               │  • Reactive Pub/Sub     │
│  • Debounced Filtering       │               │  • Readiness Evaluator  │
│  • XSS-Safe Highlight Nodes  │               │  • Module Progress Calc │
└──────────────────────────────┘               └─────────────┬───────────┘
                                                             │
                                                             ▼
                                               ┌─────────────────────────┐
                                               │ Browser Storage API     │
                                               │ `localStorage` (Origin) │
                                               │ 'pretraining_app_state' │
                                               └─────────────────────────┘
```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| **HTML Shell & Markup** | Semantic HTML5 structure, accessible ARIA attributes, module guides, checkpoint gates, modals, and report templates | `index.html` |
| **Design System & Layout** | CSS reset, theme variables, light/dark modes, layout grid/flexbox, typography, and responsive media queries | `assets/css/main.css` |
| **UI Components & Atoms** | Cards, badges, buttons, code terminal blocks, tooltips, alert boxes, toasts, and print styling | `assets/css/components.css` |
| **State Management Engine** | Source of truth for checklists, checkpoints, participant data, reactive subscriber notification, and `localStorage` persistence | `assets/js/state.js` |
| **Search Engine** | Real-time DOM scanning, non-destructive text highlighting (TextNode splitting), keyboard shortcuts (`Ctrl+K`), and query filtering | `assets/js/search.js` |
| **App Controller** | Orchestrates DOM event binding, UI updates, code copy, mobile drawer transitions, modal dialogs, and report exports | `assets/js/app.js` |
| **Automated Test Harness** | Dual-environment test execution (browser DOM & Node.js) validating state logic, redaction, search safety, and mobile UX | `tests/*.test.js` |

## Pattern Overview

**Overall:** Modular Clean Vanilla Architecture (Separation of Concerns with Reactive Observer Pattern)

**Key Characteristics:**
- **Zero Runtime Dependencies**: No heavy frontend frameworks; leverages native browser capabilities for instant loading, offline capability, and longevity.
- **Reactive State via Observer Pattern**: `StateManager` maintains the single source of truth and notifies UI controllers via an event emitter when state changes.
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
- Purpose: Binds user interactions (clicks, keyboard input, scroll) to application actions.
- Location: `assets/js/app.js`
- Contains: Event listener setup, drawer animation handlers, clipboard utilities, DOM mutation helpers.
- Depends on: `assets/js/state.js`, `assets/js/search.js`.
- Used by: Browser runtime on `DOMContentLoaded`.

**3. State & Business Logic Layer:**
- Purpose: Encapsulates state persistence, checklist completion calculations, checkpoint validation, and participant info.
- Location: `assets/js/state.js`
- Contains: `StateManager` class, default state constants, storage serialization.
- Depends on: Browser `localStorage` API.
- Used by: `assets/js/app.js` and automated test suites.

**4. Search & Filter Engine Layer:**
- Purpose: Provides instant real-time search across guide modules, troubleshooting items, and glossary terms.
- Location: `assets/js/search.js`
- Contains: `SearchEngine` class, DOM indexing, DOM text-node highlighting, query debouncing.
- Depends on: DOM elements in `index.html`.
- Used by: `assets/js/app.js` and test suites.

## Data Flow

### Primary Request Path: Checklist Toggle & Progress Calculation

1. **User Action**: Participant clicks a checklist item checkbox (`index.html:L350`)
2. **Event Capture**: Change event listener triggered in `assets/js/app.js:L220` (`setupChecklistListeners`)
3. **State Mutation**: `window.AppState.updateChecklist(id, isChecked)` called in `assets/js/state.js:L120`
4. **Persistence**: `StateManager.saveState()` writes updated JSON string to `localStorage.setItem('pretraining_app_state_v1')` (`assets/js/state.js:L88-96`)
5. **Event Emission**: `StateManager.emit('stateChange', state)` broadcasts the state update (`assets/js/state.js:L92`)
6. **UI Synchronization**: `updateProgressUI()` in `assets/js/app.js:L510-560` updates:
   - Header progress percentage and progress bar width
   - Module-specific counter badge (`N/M Selesai`)
   - Checkpoint gate eligibility
   - Readiness status badge (`SIAP` vs `PERLU CLINIC`)

### Secondary Flow: Checkpoint Gate Validation

1. **User Action**: Participant clicks "Verifikasi Berhasil (PASS)" or "Terdapat Masalah (FAIL)" on Checkpoint 1 (`index.html:L580`)
2. **Controller Handler**: Event listener in `assets/js/app.js:L360` (`setupCheckpointGates`) invokes `window.AppState.updateCheckpoint('cp-1', 'passed')`
3. **Status Recomputation**: `StateManager.getReadinessStatus()` re-evaluates all 3 checkpoints:
   - Returns `'clinic'` if any checkpoint is `'failed'`
   - Returns `'ready'` if all checkpoints are `'passed'` and checklists complete
   - Returns `'pending'` if validations remain incomplete
4. **UI Update**: Badges reflect color shifts (Emerald Green for Ready, Amber for Pending, Red for Clinic)

### Tertiary Flow: Token & Credential Redaction

1. **User Action**: User pastes terminal logs or configuration into Redaction Tool textarea (`index.html:L1920`)
2. **Input Processing**: Debounced input handler in `assets/js/app.js:L810` runs `sanitizeLogText(rawText)`
3. **Pattern Matching**: Regex replaces Telegram tokens (`[0-9]{8,10}:[a-zA-Z0-9_-]{35}`), OpenAI keys (`sk-[a-zA-Z0-9]{20,}`), and Google Cloud keys with masked strings (`[REDACTED_TELEGRAM_BOT_TOKEN]`, etc.)
4. **DOM Display**: Sanitized text displayed in output block with 1-click safe copy button

## Key Abstractions

**`StateManager` (`assets/js/state.js:L55-300`):**
- Purpose: Centralized state store with reactive subscriber callbacks and persistence.
- Pattern: Pub/Sub + Active Record over LocalStorage.

**`SearchEngine` (`assets/js/search.js:L7-235`):**
- Purpose: Client-side DOM indexing and search engine without altering component state.
- Pattern: In-Memory Inverted Index + Non-Destructive DOM Text Replacement.

**Toast Notification System (`assets/js/app.js:L990-1025`):**
- Purpose: Ephemeral feedback message queue.
- Pattern: Floating Action Toast Queue.

## Entry Points

**Web Application Entry:**
- Location: `index.html`
- Triggers: User opens the file via browser or visits hosted web address.
- Responsibilities: Loads CSS design system, renders semantic layout, loads scripts in order (`state.js` → `search.js` → `app.js`), initializes `AppState` and `SearchEngine`.

**Automated Test Runner Entry (Browser):**
- Location: `tests/index.html`
- Triggers: Opened in browser.
- Responsibilities: Intercepts `console.log` and renders formatted test pass/fail logs to screen.

**Automated Test Runner Entry (Node.js / CI):**
- Location: `tests/*.test.js`
- Triggers: `node tests/checkpoint-engine.test.js`, etc.
- Responsibilities: Instantiates production classes in mocked DOM/localStorage environment and asserts contract behaviors.

## Architectural Constraints

- **Single-Threaded Event Loop**: All DOM operations execute on the main thread; intensive operations like search query scanning use a 150ms debounce timer to prevent frame drops.
- **Client-Side Origin Isolation**: `localStorage` data is isolated per protocol/host/port origin; state does not cross origins.
- **Zero Build Artifacts**: Code files must remain pure vanilla JavaScript without non-standard syntax (no JSX, no TypeScript types in runtime files).
- **No External CDN Dependencies for Logic**: Core scripts must run completely offline without internet connectivity.

## Anti-Patterns

### Anti-Pattern 1: Direct innerHTML Injection in Search Highlights

**What happens:** Replacing element `.innerHTML` with `<mark>` tags destroys attached event listeners and resets user-typed form values.
**Why it's wrong:** Causes interactive checkboxes, copy buttons, and input fields within the searched containers to lose functionality.
**Do this instead:** Use DOM TextNode splitting (`document.createTextNode` and `document.createElement('mark')`) as implemented in `assets/js/search.js:L170-220`.

### Anti-Pattern 2: Storing Sensitive Telegram/OpenAI Tokens in State

**What happens:** Storing raw API tokens or passwords in `localStorage` or form state.
**Why it's wrong:** Exposes sensitive credentials in unencrypted browser storage and risks accidental inclusion in shared reports.
**Do this instead:** Pre-training web app never prompts for or stores tokens; the Redaction Helper in `assets/js/app.js:L810` sanitizes tokens client-side before sharing.

## Error Handling

**Strategy:** Graceful degradation and user-friendly visual feedback.

**Patterns:**
- **LocalStorage Quota / Exception Guarding**: `assets/js/state.js:L65-83` wraps `localStorage.getItem` and `setItem` in `try...catch` blocks, falling back to in-memory state if cookies/storage are disabled.
- **DOM Element Presence Checking**: Every controller function in `assets/js/app.js` checks element existence (`if (!element) return;`) before attaching event listeners.
- **Clipboard API Fallback**: `setupCodeCopy()` in `assets/js/app.js:L160-190` handles `navigator.clipboard.writeText` rejection and alerts the user with helpful error toasts.

## Cross-Cutting Concerns

**Logging:** Standard `console.log` and `console.warn` wrapped during automated test runs.
**Validation:** Form inputs (email, Telegram username) validated with friendly regex constraints; Telegram usernames automatically normalized with `@`.
**Accessibility:** Full keyboard navigation support (Skip-to-content, `Ctrl+K` search focus, Tab/Enter/Space accordion controls, 44px touch targets on mobile).

---

*Architecture analysis: 2026-09-04*
