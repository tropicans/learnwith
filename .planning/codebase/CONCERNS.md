# Codebase Concerns

**Analysis Date:** 2026-09-08

## Tech Debt

**Monolithic Single-Page HTML (`index.html`):**
- Issue: `index.html` contains over 7,400 lines of markup incorporating the top bar, Frontpage Hub, sidebar, Course 1 guide (Pre-Training & Live M6-11), Course 2 guide (Bab I-IV), Bab V quiz cards, BPSDM graduation slip, modals, and templates.
- Files: `index.html`
- Impact: While this maintains the zero-build, double-click-to-run architecture, editing module content or adding interactive features requires navigating a large single file.
- Fix approach: If a lightweight compilation script or static site generator is ever introduced, split sections into HTML partials (`partials/course-ai.html`, `partials/course-word.html`) that bundle into `index.html` for release.

**Global Window Namespace & Script Order Coupling:**
- Issue: Client-side modules attach to `window.AppState`, `window.SearchEngine`, and `window.LEARNWITH_CONFIG` via traditional script tags without an ES module bundler.
- Files: `config.js`, `assets/js/state.js`, `assets/js/search.js`, `assets/js/app.js`
- Impact: Strict script load order in `index.html` is required (`config.js` → `state.js` → `search.js` → `app.js`). If scripts load asynchronously or out of order, controllers fail to initialize.
- Fix approach: Adopt native browser ES modules (`<script type="module">`) with explicit imports when target browser requirements permit.

## Known Bugs & Edge Cases

**Browser Privacy Mode / Storage Quota Blocking:**
- Symptoms: Checklists and form inputs fail to persist across page refreshes.
- Files: `assets/js/state.js`
- Trigger: Opening `index.html` in strict Incognito/Private windows that block `localStorage` access entirely, or when storage quota is exceeded on `localhost`.
- Workaround: Handled via `try...catch` guards that fall back to in-memory state.

**Node.js 25 Global `localStorage` Shadowing in Unit Tests:**
- Symptoms: In Node.js 25+, a global `localStorage` object exists by default but lacks standard methods (`getItem is not a function`), causing test suites that check `typeof localStorage === 'undefined'` to skip mocking.
- Files: `tests/word-quiz-report.test.js`, `tests/*.test.js`
- Workaround: Polyfill tests must explicitly assign `global.localStorage = { getItem: ..., setItem: ..., ... }` rather than relying on `typeof localStorage === 'undefined'`.

## Security Considerations

**Cryptographic Passcode Protection (Mitigated in v2.2):**
- Previous Risk: Plaintext passcodes stored in JavaScript files or HTML placeholders.
- Files: `config.js`, `assets/js/app.js`, `index.html`
- Current mitigation: One-way SHA-256 hashes stored in `config.js`, verified in-browser using Web Crypto API (`crypto.subtle.digest`). Plaintext credentials removed from DOM and console.
- Recommendations: Keep salt/hashing schemes reviewed if server-side authentication is added in v3.0.

**Content Security Policy (CSP) & Clickjacking (Mitigated in v2.2):**
- Current mitigation: Rigid CSP `<meta>` header restricting `script-src`, `connect-src` (Google Gemini API & Telegram only), `style-src`, and `object-src 'none'`. Inline anti-clickjacking frame-busting CSS/script prevents embedding in external iframes.

**XSS Risk via User-Supplied Form Inputs:**
- Risk: Pasting malicious HTML into participant fields or search bars could trigger DOM-based XSS.
- Files: `assets/js/app.js`
- Current mitigation: Robust `escapeHtml()` utility sanitizes strings before DOM injection; search engine uses DOM `TextNode` splitting instead of `innerHTML`.

## Performance Bottlenecks

**Full DOM Search Scanning on Large Documents:**
- Problem: `SearchEngine.performSearch()` iterates over indexed sections in `index.html` (>7,400 lines).
- Files: `assets/js/search.js`
- Current mitigation: 150ms debounce timer on input prevents UI freeze during typing.

## Fragile Areas

**Dual Course State Isolation Invariant:**
- Files: `assets/js/state.js`, `assets/js/app.js`
- Why fragile: State operations must strictly use `this.activeStorageKey` (`learnwith_ai_state_v1` vs `learnwith_word_state_v1`). Any hardcoded fallback to `STORAGE_KEY` risks contaminating Course 1 state with Course 2 quiz or checklist data.
- Safe modification: All state methods route through `this.getActiveStorageKey()` and respect `this.activeCourse`.
- Test coverage: Verified in `tests/multi-course.test.js` and `tests/word-quiz-report.test.js`.

## Scaling Limits

**LocalStorage Capacity:**
- Current capacity: Combined state payload for both courses is ~8 KB.
- Limit: Standard browser `localStorage` cap is 5 MB per domain (>600x safety margin).

## Dependencies at Risk

**External Web Fonts Availability:**
- Resource: Google Fonts (`Inter`, `JetBrains Mono` via `fonts.googleapis.com`)
- Risk: If running in an air-gapped corporate intranet without internet access, font requests fail.
- Impact: Visual styling degrades gracefully to system sans-serif and monospace font stacks.
- Migration plan: Bundle local WOFF2 font files in `assets/fonts/` for true offline-first portability.

---

*Concerns audit: 2026-09-08*
