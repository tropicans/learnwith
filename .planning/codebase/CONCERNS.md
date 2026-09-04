# Codebase Concerns

**Analysis Date:** 2026-09-04

## Tech Debt

**Monolithic Single-Page HTML (`index.html`):**
- Issue: `index.html` contains over 2,000 lines of markup incorporating the header, sidebar, 5 guide modules, 3 checkpoint gates, participant forms, troubleshooting cards, modals, and templates.
- Files: `index.html`
- Impact: While this maintains the strict zero-build, double-click-to-run architecture, editing module content or adding troubleshooting scenarios requires editing a large file.
- Fix approach: In future iterations, if a lightweight build step is introduced, HTML templates could be componentized or loaded via modular partials (e.g., using a build script or template literal injector), while preserving the single-file distribution bundle.

**Global Window Namespace Coupling:**
- Issue: Client-side modules attach to `window.AppState` and `window.SearchEngine` via script tags without an ES module import system.
- Files: `assets/js/state.js`, `assets/js/search.js`, `assets/js/app.js`
- Impact: Strict script load order in `index.html` is required (`state.js` before `search.js` before `app.js`). If scripts load asynchronously or out of order, controllers will fail to initialize.
- Fix approach: Use native browser ES modules (`<script type="module">`) with explicit `import`/`export` syntax if browser compatibility baseline allows.

## Known Bugs & Edge Cases

**Browser Privacy Mode / Storage Quota Blocking:**
- Symptoms: Checklists and form inputs fail to persist across page refreshes.
- Files: `assets/js/state.js:L62-96`
- Trigger: Opening `index.html` in strict Incognito/Private windows that block `localStorage` access entirely, or when storage quota is exceeded on `localhost`.
- Workaround: Handled via `try...catch` guards that fall back to in-memory state; a visual warning banner could be displayed to notify users that their progress will not survive a reload.

**Double Search Highlighting on Re-indexing:**
- Symptoms: Multiple overlapping `<mark>` tags if `buildIndex()` is called repeatedly without clearing existing highlights.
- Files: `assets/js/search.js:L58-75`
- Trigger: Calling `rebuildIndex()` during an active search query.
- Current mitigation: `clearHighlights()` is invoked before index building and before applying new matches.

## Security Considerations

**Participant Secret Exposure in Shared Reports:**
- Risk: Workshop participants copying terminal logs or bot credentials into the Form Laporan Kesiapan or WhatsApp chats could expose sensitive tokens (e.g., Telegram Bot Tokens, OpenAI API keys).
- Files: `assets/js/app.js:L810-870`, `index.html:L1920-1980`
- Current mitigation: An interactive Token & Secret Redaction Helper automatically detects and masks credentials matching known patterns before output generation.
- Recommendations: Keep regex patterns updated for emerging AI API key formats (Anthropic `sk-ant-api03-*`, Google Gemini `AIza*`, Groq, Cerebras).

**XSS Risk via User-Supplied Form Inputs:**
- Risk: Pasting malicious HTML or script payloads into participant name or log text areas could lead to DOM-based XSS when rendering the report preview.
- Files: `assets/js/app.js:L890-950`
- Current mitigation: `escapeHtml()` helper converts `<`, `>`, `&`, `"`, and `'` to safe HTML entities before inserting values into report templates.

## Performance Bottlenecks

**Full DOM Search Scanning on Large Documents:**
- Problem: `SearchEngine.performSearch()` iterates over all indexed containers (`.content-section`, `.card`, `.step-card`) and performs text matching.
- Files: `assets/js/search.js:L87-140`
- Cause: Traverses live DOM elements and modifies TextNodes on every keystroke.
- Current mitigation: 150ms debounce timer on input prevents UI freeze during typing.
- Improvement path: Pre-compute normalized text tokens during `buildIndex()` and only modify DOM nodes that have confirmed query hits.

## Fragile Areas

**Hardcoded Checkpoint and Module ID Coupling:**
- Files: `assets/js/state.js:L11-53`, `assets/js/app.js:L360-450`
- Why fragile: `StateManager.getModuleProgress()` and `getReadinessStatus()` hardcode module prefixes (`prereq-`, `m1-`, `m2-`, `m3-`, `m4-`) and checkpoint keys (`cp-1`, `cp-2`, `cp-3`). Adding a new module or renaming an ID requires synchronized changes across `index.html`, `state.js`, and test suites.
- Safe modification: When introducing new modules, register them in `DEFAULT_STATE.checklists` and update `getModuleProgress()` configurations.
- Test coverage: Covered by `tests/checkpoint-engine.test.js`.

**Clipboard API Browser Permissions:**
- Files: `assets/js/app.js:L160-190`
- Why fragile: `navigator.clipboard.writeText` requires secure context (HTTPS) or `localhost` in some browsers, and may throw errors under `file:///` in certain Firefox or Safari configurations.
- Safe modification: Maintain fallback `document.execCommand('copy')` or clear visual feedback when clipboard access is rejected.

## Scaling Limits

**LocalStorage Capacity:**
- Current capacity: State payload is ~2 KB.
- Limit: Standard browser `localStorage` cap is 5 MB per domain.
- Scaling path: Ample headroom (>2,500x safety margin). If detailed per-command execution logs are stored in the future, IndexedDB would be required.

## Dependencies at Risk

**External Web Fonts Availability:**
- Package/Resource: Google Fonts (`Inter`, `JetBrains Mono` via `fonts.googleapis.com`)
- Risk: If running in an air-gapped corporate intranet without internet access, font requests will fail.
- Impact: Visual styling degrades gracefully to system sans-serif and monospace fonts; no functional breakage.
- Migration plan: Bundle WOFF2 font files locally in `assets/fonts/` for true offline-first portability.

## Missing Critical Features (Candidates for v1.1)

- **In-browser PowerShell Sandbox Simulation:** Interactive simulated terminal allowing participants to practice commands before running them in Windows PowerShell.
- **Live 9Router Ping / Health Check:** A 1-click button using `fetch('http://localhost:3000/health')` with CORS handling to verify local service health automatically.
- **Multilingual Localization:** Language switcher toggle (Bahasa Indonesia / English).
- **Service Worker / PWA:** Add `manifest.json` and service worker for full offline desktop installation.

## Test Coverage Gaps

**Clipboard Fallback Execution:**
- What's not tested: Fallback behavior when `navigator.clipboard.writeText` rejects in restrictive browser sandboxes.
- Files: `assets/js/app.js:L165-185`
- Risk: Users on non-standard browser settings may receive silent copy failures.
- Priority: Medium

---

*Concerns audit: 2026-09-04*
