# Coding Conventions

**Analysis Date:** 2026-09-08

## Naming Patterns

**Files:**
- JavaScript modules: Lowercase kebab-case or concise nouns (`state.js`, `search.js`, `app.js`, `config.js`).
- Test files: Kebab-case with `.test.js` suffix (`checkpoint-engine.test.js`, `session-security.test.js`).
- Stylesheets: Lowercase kebab-case (`main.css`, `components.css`).
- Markdown documentation: UPPERCASE kebab-case (`PANDUAN-PRE-TRAINING.md`, `PROJECT.md`).

**HTML IDs & Classes:**
- Container IDs: `sec-` prefix for major landmark sections (`#sec-target`, `#sec-word-quiz`, `#container-home`).
- Interactive Buttons: `btn-` prefix (`#btn-theme-toggle`, `#btn-mobile-menu`, `.btn-copy`, `#btn-submit-word-unlock`).
- Form Elements: CamelCase or kebab-case matching property (`#participant-name`, `#input-word-unlock-code`).
- CSS Classes: Kebab-case adhering to BEM-inspired functional names (`.card-interactive`, `.badge-pill`, `.alert-box`, `.checkpoint-gate-card`).

**JavaScript Identifiers:**
- Classes: PascalCase (`StateManager`, `SearchEngine`, `SessionSecurityManager`).
- Methods & Functions: camelCase (`setupCodeCopy`, `updateChecklist`, `calculateWordGraduation`, `escapeHtml`).
- Constants & Storage Keys: UPPER_SNAKE_CASE (`STORAGE_KEY`, `DEFAULT_STATE`, `WORD_QUIZ_QUESTIONS`).
- Event Names: camelCase string literals (`'stateChange'`, `'click'`, `'input'`).

## Code Style

**Formatting:**
- Indentation: 2 spaces (no tabs).
- Quotes: Single quotes (`'...'`) preferred for standard strings; template literals (`` `...` ``) for interpolation.
- Semicolons: Always included at statement ends.
- Trailing commas: Used in multiline object literals and arrays.

**CSS Architecture & Tokens:**
- CSS Variables: All colors, border radiuses, font sizes, transitions, and shadows must reference `:root` / `[data-theme="dark"]` tokens (e.g. `var(--bg-surface)`, `var(--text-primary)`).
- Hardcoded hex codes are strictly avoided in component rules; theme switching relies exclusively on custom property reassignment.
- Mobile First & Responsive Design: Breakpoints standard at `768px` (mobile drawer navigation threshold) and `1024px` (wide desktop layout).

## Import & Export Organization

**Dual-Environment Export Pattern:**
Because the codebase runs in both the browser (without bundlers) and in Node.js (for headless testing), all JavaScript files follow the universal module pattern:

```javascript
// At the bottom of the module (e.g. assets/js/state.js):
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { StateManager, DEFAULT_STATE, WORD_DEFAULT_STATE, WORD_QUIZ_QUESTIONS, STORAGE_KEY, LEGACY_STORAGE_KEY, COURSE_CONFIGS };
} else {
  window.AppState = new StateManager();
  window.WORD_QUIZ_QUESTIONS = WORD_QUIZ_QUESTIONS;
}
```

**Script Loading Order in HTML:**
In `index.html`, scripts must be loaded in dependency order at the bottom of the `<body>`:
1. `config.js` (Defines `window.LEARNWITH_CONFIG` settings, course locks, passcode hashes)
2. `assets/js/state.js` (Defines `StateManager` and initializes `window.AppState`)
3. `assets/js/search.js` (Defines `SearchEngine` and initializes `window.SearchEngine`)
4. `assets/js/app.js` (Main controller wireup, attaches event listeners to DOM)

## Error Handling

**Defensive DOM Querying:**
All DOM controller functions must verify element existence before attaching listeners to prevent runtime exceptions:

```javascript
function setupThemeToggle() {
  const themeBtn = document.getElementById('btn-theme-toggle');
  if (!themeBtn) return; // Guard clause
  themeBtn.addEventListener('click', () => { ... });
}
```

**LocalStorage Quota & Security Protection:**
Always wrap `localStorage` access in `try...catch` blocks to gracefully handle disabled storage, private browsing mode restrictions, or quota errors:

```javascript
try {
  localStorage.setItem(this.activeStorageKey, JSON.stringify(this.state));
} catch (e) {
  console.error('Failed to save state to localStorage:', e);
}
```

**Cryptographic Passcode Verification (SEC-01, SEC-03):**
Never compare passcodes using plain text strings. Always hash candidate inputs with Web Crypto SHA-256 and compare against authorized hashes from `config.js`:

```javascript
async function sha256Hex(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
```

**Non-Destructive DOM Search Highlighting:**
Avoid using `.innerHTML = ...` when highlighting search terms. Instead, use DOM `TextNode` splitting and `document.createElement('mark')` to prevent script execution (XSS) and preserve form input state.

## Logging

**Framework:** Native browser `console` API.
**Patterns:**
- `console.warn`: Used for non-fatal configuration issues or recoverable state load failures.
- `console.error`: Used for critical operational failures (e.g., localStorage write failure).
- Production logging is kept minimal; user-facing feedback is rendered via the Toast Notification system (`showToast(msg, type)`).

## Function & Controller Design

**Single Responsibility Wireup:**
In `assets/js/app.js`, initialization is broken into dedicated `setup*()` functions invoked sequentially inside `DOMContentLoaded`:
- `SessionSecurityManager.init()`
- `setupThemeToggle()`
- `setupMobileDrawer()`
- `setupNavigationSpy()`
- `setupCodeCopy()`
- `setupChecklistListeners()`
- `setupModuleAccordions()`
- `setupCheckpointGates()`
- `setupWordQuiz()`
- `setupWordRubrik()`
- `setupWordGraduationReport()`
- `setupModeSwitcher()`
- `setupCourseManager()`

**Pure Utility Functions:**
Data formatting, HTML escaping, and text sanitization are written as pure functions with no DOM side effects:
- `escapeHtml(text)`
- `sanitizeLogText(rawText)`
- `generateWordReportText(courseState)`

---

*Convention analysis: 2026-09-08*
