# Phase 01 — UI Review

**Audited:** 2026-09-03  
**Baseline:** Abstract 6-pillar standards (no `UI-SPEC.md` exists)  
**Screenshots:** Not captured. The local site responded on port 8000, but Playwright was unavailable in the audit environment. The supplied screenshot demonstrates the desktop composition only; the reported smartphone issue still needs real-device/viewport evidence.

---

## Pillar Scores

| Pillar | Score | Key Finding |
|--------|-------|-------------|
| 1. Copywriting | 2/4 | Beginner-oriented Indonesian is generally clear, but copy is dense and the guide contradicts itself on the 9Router port. |
| 2. Visuals | 2/4 | Desktop hierarchy is recognizable, but the interface relies on 100+ emoji-bearing lines and offers no instructional screenshots for a novice workflow. |
| 3. Color | 2/4 | Theme tokens are coherent, but important green/red controls use white text at contrast ratios below WCAG AA. |
| 4. Typography | 2/4 | The core scale is sensible, but 12px text dominates supporting UI and four referenced typography tokens are undefined. |
| 5. Spacing | 2/4 | Desktop spacing is orderly, but large desktop paddings and a 300px minimum card width remain active on narrow phones. |
| 6. Experience Design | 1/4 | Mobile removes global search and readiness progress, key touch targets are undersized, and drawer/accordion keyboard behavior is incomplete. |

**Overall: 11/24**

---

## Top 3 Priority Fixes

1. **Rebuild the mobile header instead of hiding core features** — At `max-width: 768px`, global search and readiness are set to `display: none`, while the full brand block, hamburger, logo, and theme button still compete for one row. This makes the phone header cramped and removes two primary orientation tools. Add a compact mobile header, a search action/sheet, and a visible compact progress indicator; hide or shorten only secondary brand copy.
2. **Add a true phone-density breakpoint (approximately 480px)** — Hero, card, module, checkpoint, redaction, and report containers retain 24–36px desktop padding, and `.card-grid` retains `minmax(300px, 1fr)`. Reduce nested padding, use `minmax(0, 1fr)`, stack header/meta rows, and make action buttons full-width where appropriate.
3. **Make interactions touch- and keyboard-complete** — Enforce at least 44×44px targets for menu, theme, copy, filter, and compact buttons; update drawer ARIA state and support Escape/focus return; add Enter/Space handling for accordion headers; and consolidate the mismatched `.code-copy-btn`/`.btn-copy-code` implementations.

---

## Detailed Findings

### Pillar 1: Copywriting (2/4)

- **BLOCKER — Conflicting setup endpoint:** The success criteria say `http://localhost:20042` in `index.html:299`, while the actual module, checkpoint, and troubleshooting instructions consistently use `http://localhost:20128` (`index.html:785-789`, `index.html:835`, `index.html:872`, `index.html:1839-1851`). A beginner can follow the first instruction exactly and conclude that setup failed. Choose one canonical endpoint and reuse it from a single source.
- **WARNING — Long mobile headings and descriptions:** Examples such as “Aturan Keamanan & Perlindungan Rahasia,” “Pusat Bantuan & Troubleshooting Kendala,” and “Alat Bantu Sensor Log Rahasia (Redaction Tool)” are informative but occupy several phone lines (`index.html:1688-1689`, `index.html:1970-1971`). Use a short heading plus one concise explanatory sentence.
- **WARNING — Mixed language and terminology:** The primary language is Indonesian, but visible copy mixes “Workshop Pre-Training Guide,” “Non-Coding Friendly,” “Troubleshooting,” “Redaction Tool,” and “Pending” (`index.html:244`, `index.html:1688`, `index.html:1957`, `index.html:186`). Standardize the user-facing vocabulary while retaining technical product names.
- **Positive evidence:** Labels generally explain consequences and next actions, especially checkpoint, reset, error, and privacy copy (`index.html:1459-1467`, `index.html:2162-2180`).

### Pillar 2: Visuals (2/4)

- **WARNING — Decorative icon overload:** There are no `<img>` elements, only 9 inline SVG occurrences, and more than 100 lines containing emoji icons. Emoji appearance varies by OS/browser, weakens brand consistency, and can create uneven alignment on Android. Replace repeated navigation/status emoji with one consistent SVG icon set; reserve emoji for occasional emphasis.
- **WARNING — No instructional visual aids:** The audience is explicitly beginner/non-coding, yet installation, BotFather, browser, and Google Cloud steps are entirely text/code. Small annotated screenshots or simple diagrams at the highest-friction steps would reduce cognitive load. The architecture flow is useful (`assets/css/components.css:1203-1282`) but does not replace task screenshots.
- **WARNING — Repetitive card treatment flattens hierarchy:** Cards, module containers, checkpoints, troubleshooting items, workbenches, and previews all use similar bordered dark surfaces (`assets/css/components.css:6-17`, `assets/css/components.css:478-485`, `assets/css/components.css:875-882`, `assets/css/components.css:1363-1371`, `assets/css/components.css:1443-1448`, `assets/css/components.css:1535-1540`). On a long phone page, this becomes a visually uniform stream. Strengthen section-level differentiation and reduce nested boxes.
- **Needs real-device screenshot:** Verify emoji baseline differences, perceived density, drawer overlay coverage, and whether the first viewport has a clear focal point at 320px, 360px, 375px, and 430px widths.

### Pillar 3: Color (2/4)

- **WARNING — Success-button contrast fails:** `.btn-success` uses white on `#10b981` in light mode and white on `#34d399` in dark mode (`assets/css/components.css:172-175`; tokens at `assets/css/main.css:53` and `assets/css/main.css:163`). Calculated contrast is approximately 2.54:1 and 1.92:1, below 4.5:1 for normal text.
- **WARNING — Danger-button contrast fails:** `.btn-danger` uses white text (`assets/css/components.css:855-858`) on `#ef4444`/`#f87171` (`assets/css/main.css:63`, `assets/css/main.css:173`), approximately 3.76:1/2.77:1. Use a darker filled red/green for white text, or dark foreground text on the current bright fills.
- **WARNING — Token discipline is incomplete:** The audited files contain 109 hex-color occurrences and 52 unique values. Many are legitimate theme definitions, but component-local colors and 97 inline `style` attributes in `index.html` make later contrast/theme changes harder to apply consistently.
- **Positive evidence:** Dark/light surface, border, status, and accent families are centrally defined (`assets/css/main.css:30-188`), and most long-form text uses high-contrast theme tokens.
- **Needs real-device screenshot:** Check dark-mode readability outdoors and light-mode badge legibility under typical phone brightness; code alone cannot assess glare or perceived color separation.

### Pillar 4: Typography (2/4)

- **WARNING — Small text is overused:** `var(--font-size-xs)` (12px) is referenced 36 times across the audited HTML/CSS, including badges, form labels, validation text, tooltip descriptions, filter pills, redaction editors, and report preview (`assets/css/components.css:579-582`, `assets/css/components.css:617-620`, `assets/css/components.css:1093-1105`, `assets/css/components.css:1332-1341`, `assets/css/components.css:1479-1489`, `assets/css/components.css:1568-1575`). On smartphones this is too small for sustained reading and precise interaction.
- **WARNING — Undefined design tokens silently invalidate declarations:** `--font-weight-extrabold`, `--font-size-md`, `--font-mono`, and `--z-dropdown` are consumed but never declared (`assets/css/components.css:808`, `assets/css/components.css:1012`, `assets/css/components.css:1044`, `assets/css/components.css:1082`). The browser falls back to inherited/default behavior, causing inconsistent typography and tooltip stacking.
- **WARNING — No narrow-screen type tuning:** The only phone-specific type adjustment changes `.hero-title` from 30px to 24px (`assets/css/main.css:673-681`). Section titles, long module headings, badge text, form labels, and dense body content keep desktop sizing/line structure.
- **Positive evidence:** Inter for prose and JetBrains Mono for commands establish a useful distinction (`index.html:9-11`, `assets/css/main.css:21`, `assets/css/components.css:267-273`).

### Pillar 5: Spacing (2/4)

- **WARNING — Nested desktop padding consumes the phone viewport:** `.main-hero` keeps 36px padding (`assets/css/main.css:450-458`), standard cards keep 24px (`assets/css/components.css:6-15`), checkpoints keep 28px (`assets/css/components.css:478-485`), module headers/bodies keep 20–24px (`assets/css/components.css:894-903`, `assets/css/components.css:973-975`), redaction keeps 28px (`assets/css/components.css:1443-1448`), and reports keep 32px (`assets/css/components.css:1535-1540`). Only `.app-main` padding changes on mobile (`assets/css/main.css:681-683`). Nested combinations leave narrow text measures and make the page feel oversized.
- **WARNING — Narrow phones can overflow:** `.card-grid` uses `repeat(auto-fit, minmax(300px, 1fr))` (`assets/css/components.css:59-63`). At a 320px viewport, `.app-main` leaves about 288px before any card border; the 300px grid minimum can exceed it. Because `body` globally hides horizontal overflow (`assets/css/main.css:27`), clipped content may be concealed rather than visibly scrollable.
- **WARNING — Mobile actions do not get a consistent stacking rule:** `.module-controls`, checkpoint actions, redaction actions, report actions, and modal footer merely wrap (`assets/css/components.css:536-543`, `assets/css/components.css:868-873`, `assets/css/components.css:1505-1513`, `assets/css/components.css:1584-1589`; inline footer at `index.html:2178`). Short and long controls can form uneven two-column rows on phones. Add a small-screen rule with full-width primary actions and predictable order.
- **Positive evidence:** Two-column comparison, architecture, redaction, and report layouts do eventually collapse (`assets/css/components.css:1173-1177`, `assets/css/components.css:1273-1282`, `assets/css/components.css:1458-1462`, `assets/css/components.css:1550-1554`).
- **Needs real-device screenshot:** Confirm horizontal clipping in glossary cards and long PowerShell code, and measure above-the-fold content density with Android font scaling at 100%, 120%, and 140%.

### Pillar 6: Experience Design (1/4)

- **BLOCKER — Core mobile capabilities are removed:** The mobile breakpoint hides both `.header-search-container` and `.header-progress-box` (`assets/css/main.css:673-679`). There is no alternate global-search affordance or mobile progress surface in `index.html:23-91`. This directly contradicts the phase requirement that search and progress orient users through the guide.
- **BLOCKER — Header likely collides on narrow phones:** The 768px rule retains the full brand title/subtitle, 38px logo, hamburger, theme control, 24px horizontal header padding, and 16px action gap (`assets/css/main.css:203-221`, `assets/css/main.css:229-255`, `assets/css/main.css:310-321`, `assets/css/main.css:643-681`). No 480px/360px fallback hides secondary brand text or reduces spacing.
- **WARNING — Touch targets are below the recommended 44×44px:** Icon buttons are 38×38px (`assets/css/components.css:183-194`); `.btn-sm` uses only 5.6px vertical padding with 12px text (`assets/css/components.css:177-180`); copy buttons and filter pills are similarly compact (`assets/css/components.css:242-253`, `assets/css/components.css:1332-1341`). This affects the hamburger/theme buttons, module controls, copy actions, filter chips, and reset/checkpoint controls.
- **WARNING — Drawer state is not accessible:** The drawer does lock page scrolling and close on backdrop/navigation (`assets/js/app.js:76-113`), but it never updates `aria-expanded`, does not expose `aria-controls`, does not close on Escape, and does not trap/return focus. The menu's accessible label is also English in an Indonesian app (`index.html:26`).
- **WARNING — Accordion keyboard interaction is incomplete:** `.module-header` declares `role="button"` and `tabindex="0"` (`index.html:533`, `index.html:699`), but the controller listens only to document click (`assets/js/app.js:358-377`). Enter/Space on the focused header does nothing, and the nested chevron button creates two overlapping interaction targets.
- **WARNING — Two incompatible copy-component contracts exist:** The working handler only recognizes `.code-copy-btn` inside `.code-container` (`assets/js/app.js:151-160`), while troubleshooting uses `.btn-copy-code` inside `.code-block-wrap` (`index.html:1757-1765`, `index.html:1797-1805`). The latter classes have no normal-screen definitions in `components.css` and their copy buttons do not trigger the handler.
- **WARNING — Filter semantics are incomplete:** The troubleshooting filter wrapper declares `role="tablist"`, but its buttons have no `role="tab"`, `aria-selected`, or keyboard arrow behavior (`index.html:1707-1712`; controller at `assets/js/app.js:682-722`).
- **Positive evidence:** Checklists persist, destructive reset has confirmation, errors have explanatory copy, redaction has input/output states, and mobile glossary taps are explicitly supported (`assets/js/app.js:202-228`, `assets/js/app.js:429-451`, `assets/js/app.js:598-666`, `assets/js/app.js:726-797`).
- **Needs real-device screenshot/test:** Validate drawer scrolling and focus, on-screen-keyboard overlap in forms, toast placement above mobile browser chrome, sticky-header behavior, tap accuracy, landscape layout, safe-area insets, and 200% text zoom.

---

## Mobile Verification Checklist Requiring Real-Device Evidence

1. Capture full-page and first-viewport screenshots at 320×568, 360×800, 375×812, and 430×932 in both themes.
2. Open/close the drawer with touch; verify background scroll lock, sidebar scroll, Escape/back behavior, focus return, and that the last navigation item remains reachable.
3. Test the header at 320px and with Android/iOS text scaling enabled; look for collision between hamburger, brand, and theme button.
4. Exercise every copy button, checkpoint action, filter chip, redaction control, and report action using one thumb.
5. Test long PowerShell commands and long Indonesian headings for clipping rather than relying on `overflow-x: hidden`.
6. Focus each form field with the on-screen keyboard open and verify that labels, validation messages, and actions remain visible.

---

## Files Audited

- `.planning/milestones/v1.0-phases/01-core-foundation-shell/01-01-PLAN.md`
- `.planning/milestones/v1.0-phases/01-core-foundation-shell/01-01-SUMMARY.md`
- `.planning/milestones/v1.0-phases/01-core-foundation-shell/01-02-PLAN.md`
- `.planning/milestones/v1.0-phases/01-core-foundation-shell/01-02-SUMMARY.md`
- `.planning/milestones/v1.0-phases/01-core-foundation-shell/01-03-PLAN.md`
- `.planning/milestones/v1.0-phases/01-core-foundation-shell/01-03-SUMMARY.md`
- `index.html`
- `assets/css/main.css`
- `assets/css/components.css`
- `assets/js/app.js`

Registry audit: skipped; `components.json` is not present and there is no third-party component registry declared.
