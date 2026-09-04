# Coding Conventions

**Analysis Date:** 2026-09-04

## Naming Patterns

**Files:**
- JavaScript modules: Lowercase kebab-case or concise nouns (`state.js`, `search.js`, `app.js`).
- Test files: Kebab-case with `.test.js` suffix (`checkpoint-engine.test.js`, `search-security.test.js`).
- Stylesheets: Lowercase kebab-case (`main.css`, `components.css`).
- Markdown documentation: UPPERCASE kebab-case (`PANDUAN-PRE-TRAINING.md`, `PROJECT.md`).

**HTML IDs & Classes:**
- Container IDs: `sec-` prefix for major landmark sections (`#sec-target`, `#sec-module-1`, `#sec-checkpoints`).
- Interactive Buttons: `btn-` prefix (`#btn-theme-toggle`, `#btn-mobile-menu`, `.btn-copy`).
- Form Elements: CamelCase or kebab-case matching property (`#participant-name`, `#participant-telegram-user`).
- CSS Classes: Kebab-case adhering to BEM-inspired functional names (`.card-interactive`, `.badge-pill`, `.alert-box`, `.checkpoint-gate-card`).

**JavaScript Identifiers:**
- Classes: PascalCase (`StateManager`, `SearchEngine`).
- Methods & Functions: camelCase (`setupCodeCopy`, `updateChecklist`, `getReadinessStatus`, `sanitizeLogText`).
- Constants & Storage Keys: UPPER_SNAKE_CASE (`STORAGE_KEY`, `DEFAULT_STATE`).
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
  module.exports = { StateManager, DEFAULT_STATE, STORAGE_KEY };
} else {
  window.AppState = new StateManager();
}
```

**Script Loading Order in HTML:**
In `index.html`, scripts must be loaded in dependency order at the bottom of the `<body>`:
1. `assets/js/state.js` (Defines `StateManager` and initializes `window.AppState`)
2. `assets/js/search.js` (Defines `SearchEngine` and initializes `window.SearchEngine`)
3. `assets/js/app.js` (Main controller wireup, attaches event listeners to DOM)

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
  localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
} catch (e) {
  console.error('Failed to save state to localStorage:', e);
}
```

**Non-Destructive DOM Search Highlighting:**
Avoid using `.innerHTML = ...` when highlighting search terms. Instead, use DOM `TextNode` splitting and `document.createElement('mark')` to prevent script execution (XSS) and preserve form input state:

```javascript
// Correct pattern (assets/js/search.js):
const mark = document.createElement('mark');
mark.className = 'search-highlight';
mark.textContent = matchText;
parent.insertBefore(mark, textNode);
```

## Logging

**Framework:** Native browser `console` API.
**Patterns:**
- `console.warn`: Used for non-fatal configuration issues or recoverable state load failures.
- `console.error`: Used for critical operational failures (e.g., localStorage write failure).
- Production logging is kept minimal; user-facing feedback is rendered via the Toast Notification system (`showToast(msg, type)`).

## Comments & Documentation

**Header Blocks:**
Every module begins with a standardized uppercase ASCII header banner:
```javascript
/**
 * ==========================================================================
 * PRE-TRAINING INTERACTIVE WEB APP - [MODULE NAME & RESPONSIBILITY]
 * ==========================================================================
 */
```

**JSDoc Annotations:**
Document public methods on classes with concise description, parameters, and return types:
```javascript
/**
 * Updates a checklist item boolean state and triggers reactivity
 * @param {string} id - The checklist key identifier
 * @param {boolean} checked - The new completion status
 */
updateChecklist(id, checked) { ... }
```

## Function & Controller Design

**Single Responsibility Wireup:**
In `assets/js/app.js`, initialization is broken into dedicated `setup*()` functions invoked sequentially inside `DOMContentLoaded`:
- `setupThemeToggle()`
- `setupMobileDrawer()`
- `setupNavigationSpy()`
- `setupCodeCopy()`
- `setupChecklistListeners()`
- `setupModuleAccordions()`
- `setupCheckpointGates()`
- `setupTroubleshootingHub()`
- `setupRedactionTool()`
- `setupReadinessReport()`

**Pure Utility Functions:**
Data formatting, HTML escaping, and text sanitization are written as pure functions with no DOM side effects:
- `escapeHtml(text)`
- `sanitizeLogText(rawText)`
- `formatReadinessReport(data)`

---

*Convention analysis: 2026-09-04*
