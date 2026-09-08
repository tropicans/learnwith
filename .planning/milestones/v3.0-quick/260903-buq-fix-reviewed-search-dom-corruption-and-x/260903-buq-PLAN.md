---
quick_id: 260903-buq
type: execute
mode: quick-full
validation: true
files_modified:
  - assets/js/search.js
  - assets/js/app.js
  - assets/js/state.js
  - tests/checkpoint-engine.test.js
  - tests/troubleshooting-exporter.test.js
  - tests/search-security.test.js
  - tests/index.html
autonomous: true
must_haves:
  truths:
    - Global search can highlight and clear matches without replacing searchable elements, losing their runtime state, or disconnecting their event listeners.
    - Search text and every toast message are rendered as text rather than executable HTML, including malicious-looking input.
    - The readiness preview uses the persisted participant name on its first render and Telegram usernames contain exactly one leading @.
    - Automated tests import or load the production StateManager, redaction, report, toast, and search implementations rather than duplicating those implementations in test files.
  artifacts:
    - path: assets/js/search.js
      provides: DOM-preserving search highlighting and restoration
    - path: assets/js/app.js
      provides: safe toast construction and corrected readiness-report formatting/initialization
    - path: assets/js/state.js
      provides: browser-safe production exports needed by the Node test harness
    - path: tests/search-security.test.js
      provides: regression coverage for DOM identity/listener preservation and injection-shaped search/toast input
    - path: tests/checkpoint-engine.test.js
      provides: tests against the production StateManager
    - path: tests/troubleshooting-exporter.test.js
      provides: tests against the production sanitizer and report generator
    - path: tests/index.html
      provides: browser runner loading production scripts before regression tests
  key_links:
    - from: assets/js/search.js
      to: assets/js/app.js
      via: zero-result queries pass untrusted query text to window.showToast, whose DOM construction must remain text-only
    - from: assets/js/app.js
      to: assets/js/state.js
      via: readiness report reads participantInfo, checkpoint readiness, and module progress from window.AppState
    - from: tests/checkpoint-engine.test.js
      to: assets/js/state.js
      via: direct CommonJS import in Node and window.AppState in the browser runner
    - from: tests/troubleshooting-exporter.test.js
      to: assets/js/app.js
      via: direct use of exported sanitizeLogText and generateReportText production functions
    - from: tests/search-security.test.js
      to: assets/js/search.js
      via: direct SearchEngine construction against a minimal DOM fixture
---

<objective>
Fix the reviewed global-search DOM corruption and injection paths, correct readiness-report initialization and Telegram formatting, and turn the existing tests into meaningful production-code regressions.

Purpose: Preserve all application interactions across search cycles, prevent user-controlled markup from reaching the DOM, make the initial report accurate, and ensure future regressions fail the automated suite.
Output: Hardened production JavaScript plus direct production-code tests runnable in Node and the existing browser test page.
</objective>

<context>
@.planning/STATE.md
@.planning/PROJECT.md
@assets/js/search.js
@assets/js/app.js
@assets/js/state.js
@tests/checkpoint-engine.test.js
@tests/troubleshooting-exporter.test.js
@tests/index.html
</context>

<tasks>

<task type="auto">
  <name>Task 1: Preserve live DOM state during search and eliminate HTML injection sinks</name>
  <files>assets/js/search.js, assets/js/app.js</files>
  <action>
    Replace SearchEngine's `innerHTML` snapshot/restore strategy with DOM-preserving highlighting. Remove reliance on `data-original-html`; before each query, unwrap only marks created by search, then traverse eligible text nodes and wrap matched text using DOM node APIs (`createElement`, `createTextNode`, fragments/ranges as appropriate). Skip script/style/form-control content and existing generated marks, preserve element objects and current control values, and normalize text nodes when clearing. Keep filtering, expansion, keyboard shortcuts, and zero-result behavior intact.

    Harden `window.showToast` by constructing the icon and message spans with DOM APIs and assigning the message through `textContent`; do not interpolate `message` into `innerHTML`. Ensure a query such as `<img src=x onerror=alert(1)>` can only appear as literal toast text and cannot create an element or event handler.
  </action>
  <verify>
    Run `node --check assets/js/search.js` and `node --check assets/js/app.js`. Then run the search/security regression test added in Task 3 and confirm that the same checkbox/input element identity, current value/checked state, and attached click listener survive search followed by clear, while injection-shaped query/toast strings create no attacker-supplied elements.
  </verify>
  <done>Search highlights and clears without rebuilding indexed application markup, all existing interaction targets remain live, and user-controlled notification content is text-only.</done>
</task>

<task type="auto">
  <name>Task 2: Correct first report render and normalize Telegram username formatting</name>
  <files>assets/js/app.js</files>
  <action>
    In `setupReadinessReport`, hydrate the report name input from persisted AppState before the first `updatePreview()` call so the initial preview contains the saved name. In `generateReportText`, normalize a supplied Telegram username by removing any existing leading `@` characters and adding exactly one display prefix; retain the current ID fallback and omit the Telegram suffix when neither value exists. Keep redaction and readiness calculations unchanged.
  </action>
  <verify>
    Run the direct production report tests from Task 3 and confirm: a persisted name appears on initial setup render; both `nama_bot` and `@nama_bot` render as `@nama_bot` (never `@@nama_bot`); missing username with an ID retains the documented fallback; and sensitive error text is still redacted.
  </verify>
  <done>The report preview is correct immediately after initialization and Telegram usernames always render with exactly one leading @.</done>
</task>

<task type="auto">
  <name>Task 3: Replace test doubles with production imports and add security regressions</name>
  <files>assets/js/state.js, assets/js/search.js, assets/js/app.js, tests/checkpoint-engine.test.js, tests/troubleshooting-exporter.test.js, tests/search-security.test.js, tests/index.html</files>
  <action>
    Add narrowly scoped, browser-safe CommonJS exports (or an equivalent no-build test seam) for `StateManager`/default state, `SearchEngine`, `sanitizeLogText`, `generateReportText`, and any small initialization/toast helper required for direct testing; preserve the existing `window.*` globals and normal `DOMContentLoaded` behavior.

    Remove the copied `TestStateManager`, redaction rules/sanitizer, and `mockGenerateReport` implementations from the existing tests. In Node, install only the minimal window/document/localStorage fixture needed before importing production files, instantiate the exported production classes/functions, and fail loudly if an export is unavailable. In the browser runner, load `search.js` and `app.js` before the tests so the same production globals are exercised.

    Add `tests/search-security.test.js` with a small deterministic DOM fixture covering: matched highlighting, clear-search restoration, preservation of descendant checkbox/input identity and listener behavior, no markup execution/creation from an injection-shaped query, and literal safe rendering of the same value in a toast. Extend report assertions for persisted-name initialization and Telegram normalization. Keep the current checkpoint, readiness, redaction, report, and category assertions, but make every behavioral assertion invoke production code.
  </action>
  <verify>
    Run `node tests/checkpoint-engine.test.js`, `node tests/troubleshooting-exporter.test.js`, and `node tests/search-security.test.js`; all commands must exit 0 with zero failed assertions. Run `node --check` on all three production JavaScript files and all three test files. Open `tests/index.html` in a browser and confirm its combined runner reports zero failures and no uncaught console errors.
  </verify>
  <done>Tests no longer reimplement the features they claim to verify, and automated regressions cover the reviewed search corruption, XSS, initial report, and Telegram-formatting defects against production code.</done>
</task>

</tasks>

<verification>
- [ ] All production and test JavaScript files pass `node --check`.
- [ ] All three Node test commands exit successfully with zero failed assertions.
- [ ] The browser test runner reports zero failures and no uncaught errors.
- [ ] Search/clear preserves live form state, element identity, and event listeners.
- [ ] Injection-shaped search/toast input is displayed literally and creates no executable DOM.
- [ ] Initial report hydration and both prefixed/unprefixed Telegram usernames are covered by production-code tests.
</verification>

<success_criteria>
- Every reviewed defect has a targeted implementation change and a regression assertion.
- No search operation restores a searchable element via `innerHTML`.
- No user-controlled toast message is assigned through an HTML parser sink.
- Existing browser globals and static/no-build application behavior remain compatible.
- All automated tests exercise production implementations and pass in their supported runners.
</success_criteria>

<output>
After execution, create `.planning/quick/260903-buq-fix-reviewed-search-dom-corruption-and-x/260903-buq-SUMMARY.md`.
</output>
