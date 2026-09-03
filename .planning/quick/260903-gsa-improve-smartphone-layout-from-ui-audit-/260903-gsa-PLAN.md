---
quick_id: 260903-gsa
type: execute
mode: quick-full
validation: true
files_modified:
  - index.html
  - assets/css/main.css
  - assets/css/components.css
  - assets/js/app.js
  - tests/mobile-accessibility.test.js
  - tests/index.html
autonomous: true
must_haves:
  truths:
    - At 320-430px widths the header retains an operable global search, a visible readiness percentage, menu access, and theme access without horizontal clipping or control collisions.
    - Phone layouts use compact padding, single-column grids, readable supporting text, horizontally scrollable code where needed, and predictable full-width action groups while the existing desktop composition remains unchanged.
    - Every compact interactive control has at least a 44 by 44 CSS-pixel touch target, filled success/danger buttons meet WCAG AA contrast, and all referenced typography/z-index tokens resolve.
    - The mobile drawer, module accordions, and troubleshooting filters expose correct accessible state and work from the keyboard, including Escape/focus return for the drawer and Enter/Space for accordions.
    - Every displayed command-copy control invokes the same command-copy implementation and copies its adjacent command; redaction/report output-copy controls retain their purpose-specific behavior, and every 9Router dashboard instruction uses the canonical localhost port 20128.
    - Automated regressions inspect production HTML/CSS and exercise production interaction code for mobile semantics, accessibility state, keyboard behavior, copy controls, and port consistency.
  artifacts:
    - path: index.html
      provides: Mobile-complete header markup, accessible drawer/accordion/filter semantics, unified command-copy markup, and canonical endpoint copy
    - path: assets/css/main.css
      provides: Responsive two-row mobile shell/header and complete design tokens without changing desktop behavior
    - path: assets/css/components.css
      provides: Phone-density, touch-target, action stacking, readable type, command-copy, and contrast rules
    - path: assets/js/app.js
      provides: Drawer focus/state lifecycle, keyboard accordion/filter handling, and one command-copy path
    - path: tests/mobile-accessibility.test.js
      provides: Static and DOM regression coverage against the production mobile/accessibility contracts
    - path: tests/index.html
      provides: Browser-runner inclusion of the new mobile/accessibility suite
  key_links:
    - from: index.html
      to: assets/css/main.css
      via: Header search/progress/action classes remain present and are reflowed, rather than hidden, by mobile media queries
    - from: index.html
      to: assets/js/app.js
      via: aria-controls, aria-expanded, aria-pressed, and copy-target markup is kept synchronized by interaction controllers
    - from: assets/js/app.js
      to: assets/css/components.css
      via: open/collapsed/active/copied states and unified command-copy classes have visible mobile styles and minimum touch sizes
    - from: tests/mobile-accessibility.test.js
      to: index.html
      via: Production markup is parsed to assert canonical ports and accessible control relationships
    - from: tests/mobile-accessibility.test.js
      to: assets/css/main.css
      via: Production stylesheet assertions guard the phone breakpoint, retained search/progress, overflow prevention, and 44px controls
    - from: tests/mobile-accessibility.test.js
      to: assets/js/app.js
      via: Exported browser-safe setup functions are exercised with a deterministic minimal DOM fixture
---

<objective>
Make the existing static guide comfortable and complete on smartphones while preserving its desktop layout and no-build deployment.

Purpose: Resolve the validated UI-audit findings that hide orientation tools on mobile, waste narrow-screen space, undersize touch controls, leave keyboard/ARIA behavior incomplete, split copy behavior across incompatible components, and contradict the 9Router port.
Output: Responsive HTML/CSS, accessible interaction wiring, unified command-copy controls with separate output-copy behavior, canonical endpoint copy, and production-linked regression tests with no new dependencies.
</objective>

<context>
@.planning/STATE.md
@.planning/milestones/v1.0-phases/01-core-foundation-shell/01-UI-REVIEW.md
@index.html
@assets/css/main.css
@assets/css/components.css
@assets/js/app.js
@tests/checkpoint-engine.test.js
@tests/search-security.test.js
@tests/troubleshooting-exporter.test.js
@tests/index.html
</context>

<tasks>

<task type="auto">
  <name>Task 1: Reflow the mobile shell and apply true phone density</name>
  <files>index.html, assets/css/main.css, assets/css/components.css</files>
  <action>
    Rebuild the existing header responsively without duplicating search/progress state: at 768px and below use a compact first row for menu, shortened brand, progress percentage, and theme toggle, then place the existing search input on a full-width second row. Keep the search and percentage visible (never `display:none`), hide only secondary brand/subtitle and desktop-only keyboard-hint copy as space narrows, update the responsive header/grid sizing so sticky content and scroll offsets remain correct, add safe-area-aware horizontal padding, and ensure flex/grid children use `min-width: 0` so 320px screens do not clip. Preserve the current desktop rules above the mobile breakpoint.

    Add an approximately 480px phone-density layer: reduce main/hero/card/module/checkpoint/troubleshooting/redaction/report/modal nested padding and section gaps; change narrow grids, including `.card-grid` and hero stats, to `minmax(0, 1fr)`/one column; stack module meta/header content where needed; keep code blocks horizontally scrollable; raise sustained-reading helper/form/report text from 12px on phones; and make module/checkpoint/redaction/report/readiness/modal actions full-width in a predictable order. Enforce a 44px minimum block/inline size for menu, theme, chevron, code-copy, small buttons, filter buttons, and other tap controls without inflating desktop-only presentation.

    Define the currently missing `--font-size-md`, `--font-weight-normal`, `--font-weight-extrabold`, `--font-mono`, and `--z-dropdown` tokens. Introduce dedicated dark-enough action colors for filled success/danger buttons (including active checkpoint states) so white labels meet 4.5:1 in both themes rather than changing semantic status colors globally. Replace the lone `localhost:20042` success criterion with the established canonical `http://localhost:20128`; all visible 9Router dashboard URLs must agree.
  </action>
  <verify>
    Run `node tests/mobile-accessibility.test.js` after Task 3 and confirm its production-source checks find: viewport metadata, a phone breakpoint, no mobile rule hiding `.header-search-container` or `.header-progress-box`, single-column/minmax-zero narrow grids, 44px target declarations, WCAG-safe action colors, and zero `20042` occurrences. The suite must also collect every `var(--token)` reference in production HTML/CSS, collect all declared custom properties, and fail with the names of any unresolved references rather than checking only a hardcoded token list. Serve the app and inspect 320x568, 360x800, 375x812, and 430x932 viewports in both themes: no horizontal page scrolling; header controls do not overlap; search/progress remain usable; long code scrolls within its box; primary phone actions span the available width. Recheck a desktop viewport at 1440px to confirm header/sidebar/content proportions are unchanged.
  </verify>
  <done>The complete orientation header and all content fit narrow phones with readable density, thumb-sized controls, consistent endpoint copy, accessible action contrast, and no desktop regression.</done>
</task>

<task type="auto">
  <name>Task 2: Complete drawer, accordion, filter, and copy interactions</name>
  <files>index.html, assets/css/components.css, assets/js/app.js</files>
  <action>
    Give the mobile menu Indonesian accessible text, `aria-controls="app-sidebar"`, and initial `aria-expanded="false"`. In `setupMobileDrawer`, synchronize expanded state on every open/close, move focus into the drawer on open, trap Tab/Shift+Tab among its focusable controls while open, close on backdrop/navigation/Escape, and restore focus to the menu button. Keep desktop sidebar behavior unaffected and avoid applying mobile-only `aria-hidden` in a way that hides desktop navigation.

    Make each module header one coherent keyboard control: retain its `role="button"`/`tabindex`, replace the nested chevron button with a decorative non-interactive element, assign a unique module-body id through `aria-controls`, and centralize toggling so click, Enter, Space, expand-all, collapse-all, and hash expansion all update `.collapsed`, `aria-expanded`, and chevron presentation consistently. Prevent Space from scrolling the page.

    Treat troubleshooting filters as toggle buttons rather than incomplete tabs: use an Indonesian labelled group, `aria-pressed` on each button, update pressed state with the existing active class, and add ArrowLeft/ArrowRight/Home/End roving focus without changing filtering results. Consolidate `.code-copy-btn` and `.btn-copy-code` into a single documented command-copy markup/handler contract that discovers the adjacent command in both guide and troubleshooting blocks, uses the existing secure-clipboard/fallback path, supplies Indonesian labels for every displayed command-copy button, and restores button content/state after feedback. Explicitly leave the redaction-output and readiness-report output copy controls on their existing purpose-specific handlers; they are not adjacent-command controls and must not be routed through this contract. Do not use inline onclick handlers or add a library.
  </action>
  <verify>
    Run `node --check assets/js/app.js` and `node tests/mobile-accessibility.test.js`. In the browser, open the drawer using keyboard and touch, cycle focus, press Escape, and confirm focus returns to the menu with `aria-expanded=false`; activate every module using Enter and Space and confirm its linked body/state matches; traverse filters with arrow/Home/End and confirm `aria-pressed` and results; activate both a normal guide command-copy button and each troubleshooting command-copy button and confirm the adjacent command—not surrounding explanatory text—is copied with visible feedback. Also confirm the redaction and readiness-report copy controls still copy their generated output through their own handlers.
  </verify>
  <done>Mobile navigation, accordions, filters, and every displayed command-copy action are touch- and keyboard-complete with truthful ARIA state and one reliable command-copy implementation, while redaction/report output copying remains intact.</done>
</task>

<task type="auto">
  <name>Task 3: Add production-linked mobile and accessibility regressions</name>
  <files>assets/js/app.js, tests/mobile-accessibility.test.js, tests/index.html</files>
  <action>
    Add browser-safe CommonJS exports for only the interaction setup functions needed by the tests (`setupMobileDrawer`, `setupModuleAccordions`, `setupTroubleshootingHub`, and `setupCodeCopy`, plus a small shared toggle/copy helper only if required) while preserving existing `window.*` behavior and `DOMContentLoaded` initialization.

    Create a dependency-free Node/browser test suite. Use `fs` in Node to inspect the real `index.html`, `main.css`, and `components.css` for the markup/style contracts from Task 1: canonical 20128 endpoint with no 20042, menu relationship and initial state, module `aria-controls` targets and non-nested interactive chevrons, labelled filter group with one pressed filter, accessible unified command-copy buttons, phone media rules that retain search/progress, narrow-grid/overflow safeguards, and 44px targets. Implement a general custom-property audit that extracts every `var(--token)` reference from production HTML/CSS and compares it with all custom-property declarations, reporting and failing for any unresolved token; this must cover future tokens as well as `--font-size-md`, `--font-weight-normal`, `--font-weight-extrabold`, `--font-mono`, and `--z-dropdown`. Add a minimal deterministic DOM/event fixture that invokes the exported production setup functions and asserts drawer open/close/Escape/focus return, accordion Enter/Space state synchronization, filter pressed-state/keyboard navigation, and command copying from both supported code-container shapes. Assert separately that redaction/report output-copy controls retain distinct ids/classes and are not captured by the command-copy selector. Do not duplicate production controller logic inside the tests. Load the new suite from `tests/index.html` after production scripts and make failures set a nonzero Node exit code and appear in the browser runner.
  </action>
  <verify>
    Run `node tests/checkpoint-engine.test.js`, `node tests/troubleshooting-exporter.test.js`, `node tests/search-security.test.js`, and `node tests/mobile-accessibility.test.js`; all must exit 0. Run `node --check assets/js/app.js` and `node --check tests/mobile-accessibility.test.js`. Open `tests/index.html` and confirm the combined browser runner reports zero failures and no uncaught console errors.
  </verify>
  <done>A repeatable no-dependency suite fails on regressions that hide mobile search/progress, reintroduce narrow overflow or small targets, leave any custom property unresolved, break ARIA/keyboard behavior, split command-copy handling, capture output-copy controls, or restore the wrong 9Router port.</done>
</task>

</tasks>

<verification>
- [ ] Existing three Node suites and the new mobile/accessibility suite all pass with zero failures.
- [ ] Production and test JavaScript pass `node --check`; the browser runner has no uncaught errors.
- [ ] At 320, 360, 375, and 430px in light and dark themes, the page has no horizontal scroll and search/progress remain visible and usable.
- [ ] Menu, theme, copy, filter, chevron, small, and action buttons expose at least 44x44px touch targets on phones.
- [ ] Drawer Escape/focus return, accordion Enter/Space, and filter arrow/Home/End behavior work and synchronize ARIA state.
- [ ] Guide and troubleshooting command-copy controls copy only their adjacent command through one implementation; redaction/report output-copy controls retain their separate behavior.
- [ ] A general production-source scan reports zero unresolved `var(--token)` references, including `--font-weight-normal`.
- [ ] `20042` is absent and every 9Router dashboard instruction uses `20128`.
- [ ] A 1440px desktop smoke test confirms the existing header, sidebar, cards, and action layout are preserved.
</verification>

<success_criteria>
- The smartphone experience retains all core desktop capabilities and is usable at 320px without clipping or collisions.
- Narrow-screen density, readable support text, action stacking, and touch sizing address every mobile blocker in the audit.
- Interactive state is perceivable and operable by pointer, touch, and keyboard with truthful ARIA semantics.
- Filled success/danger actions meet WCAG AA contrast in both themes and all consumed design tokens exist.
- No new runtime or test dependency is introduced; the static deployment model remains unchanged.
- Production-linked automated tests protect the mobile, accessibility, command-copy, output-copy separation, custom-property resolution, and endpoint fixes.
</success_criteria>

<output>
After execution, create `.planning/quick/260903-gsa-improve-smartphone-layout-from-ui-audit-/260903-gsa-SUMMARY.md`.
</output>
