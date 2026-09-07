# Phase 8: In-Class Troubleshooting Hub, Completion Status Engine & Final Report Exporter - Context

**Gathered:** 2026-09-07
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 8 completes Milestone v1.1 by delivering:
1. An expanded Live Workshop Troubleshooting Hub in `#sec-live-troubleshooting` featuring 7 runtime error cards and category filtering (`GATE-07`, `TRBL-04`, `TRBL-05`).
2. An overall Live Workshop completion status evaluation engine in `state.js` tracking Checkpoints 4–9 (`GATE-07`).
3. An interactive Form Laporan Hasil Praktik Kelas in `#sec-live-report` with 1-click export formatted for WhatsApp and Telegram instructor chats, with credential masking (`RPT-04`, `RPT-05`).
4. Regression test coverage for new state logic, in-class troubleshooting filters, and report formatting.

</domain>

<decisions>
## Implementation Decisions

### 1. Kategori & Layout Troubleshooting In-Class (TRBL-04, TRBL-05)
- **D-01: Dedicated In-Class Hub Layout.** Implement a dedicated toolbar search and category filter button group inside `#sec-live-troubleshooting` (keeping it separate from Pra-Training to keep in-class focus tight and distraction-free).
- **D-02: 4 In-Class Categories.** Category pills for Hari-H:
  - `Semua Kendala Live (7)` (`all`)
  - `9Router & Endpoint` (`9router-live`)
  - `Hermes CLI` (`hermes-cli`)
  - `Telegram Gateway` (`telegram-gateway`)
  - `Google OAuth` (`google-oauth`)
- **D-03: 7 In-Class Scenarios.** Provide actionable resolution cards for:
  1. `hermes` tidak dikenali (PowerShell path & restart terminal)
  2. Hermes tidak menjawab / 9Router connection refused (`http://localhost:20128/v1`)
  3. Model gagal dipanggil / API key 9Router invalid
  4. Bot Telegram tidak merespons (Gateway status & token check)
  5. Bot membalas `unauthorized` (Telegram User ID allowlist mismatch)
  6. OAuth Google gagal (Client mismatch bukan Desktop app / consent screen test users)
  7. Google Calendar tidak berubah (Akun/kalender berbeda / dummy agenda)

### 2. Status Engine Kesiapan Praktik Kelas (GATE-07)
- **D-04: Multi-tier In-Class Status Engine.** Calculate in-class completion state in `StateManager.calculateLiveReadiness()`:
  - `BELUM SIAP` (`clinic` / `danger`): Jika terdapat minimal 1 Checkpoint (CP 4–9) berstatus `failed`, atau persentase progres < 50%.
  - `DALAM PRAKTIK` (`in_progress` / `warning`): Jika belum ada yang `failed`, tetapi belum seluruh CP 4–9 `passed` (50% – 99%).
  - `SELESAI (SUKSES)` (`ready` / `success`): Jika seluruh Checkpoint 4, 5, 6, 7, 8, dan 9 berstatus `passed` (100%).
- **D-05: Real-time UI Binding.** Dynamically update the in-class status badge in the header, sidebar, and report summary card upon any checkpoint update.

### 3. Format & Fitur Form Laporan Hasil Praktik (RPT-04, RPT-05)
- **D-06: Participant & Model Fields.** Pre-fill participant name and selected model (from `DEFAULT_STATE.participantInfo`), plus optional OS selection.
- **D-07: Dual Export Actions.** Provide two 1-click copy buttons:
  - 1-Klik Salin Format WhatsApp (menggunakan bold `*`, bullet `-`, dan emoji rapi).
  - 1-Klik Salin Format Telegram (menggunakan Markdown V2 / backtick code snippet untuk error log).
- **D-08: Checkpoints 4–9 Summary.** Display checkboxes `[X]` / `[ ]` for each Checkpoint 4 through 9, followed by overall Status, problem step (if any), and automatically sanitized terminal error messages using `sanitizeLogText`.

### Antigravity's Discretion
- Reuse existing CSS classes (`.troubleshoot-toolbar`, `.troubleshoot-filter-btn`, `.trouble-card`, `.report-workbench`, `.btn-success`, `.btn-primary`) in `assets/css/components.css` to maintain visual consistency.
- Add comprehensive automated unit tests in `tests/live-class-modules.test.js` or a dedicated test file to guarantee 100% pass rate.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Workshop Guides & Roadmaps
- `PANDUAN-PRAKTIK-KELAS.md` §7 — Official 7 troubleshooting scenarios and safe resolution actions.
- `.planning/ROADMAP.md` §Phase 8 — Phase 8 goals, success criteria, and plans.
- `.planning/REQUIREMENTS.md` §GATE-07, TRBL-04, TRBL-05, RPT-04, RPT-05 — Specific functional requirements.
- `.planning/STATE.md` — Milestone v1.1 tracking and test baseline.

### Implementation Architecture
- `assets/js/state.js` — StateManager, `calculateProgress`, and readiness methods.
- `assets/js/app.js` — Troubleshooting hub controller, log redaction, and report generation logic.
- `index.html` — `#sec-live-troubleshooting` and `#sec-live-report` placeholders.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `sanitizeLogText(rawText)` in `assets/js/app.js`: Automatically redacts bot tokens, API keys, email addresses, and Windows user paths.
- `setupTroubleshootingHub()` in `assets/js/app.js`: Category filter and real-time search logic easily adaptable or parametrizable for live class cards.
- `calculateProgress('live-class')` in `assets/js/state.js`: Already calculates completion for Modul 6–11 checklists and Checkpoints 4–9.

### Established Patterns
- ARIA accessibility: Keyboard navigation (Arrow keys, Home, End) and `aria-pressed` for category filter pills.
- Checkpoint Gate structure: Cards with `data-checkpoint="cp-N"`, status badges, and Pass/Fail/Reset action buttons.
- 1-click clipboard copy with feedback toasts (`showToast`).

### Integration Points
- `#sec-live-troubleshooting` in `index.html` currently contains placeholder text; will host toolbar and 7 `.trouble-card` elements.
- `#sec-live-report` in `index.html` currently contains placeholder text; will host Form Laporan Hasil Praktik Kelas and preview workbench.

</code_context>

<specifics>
## Specific Ideas
- Clean differentiation between Pra-Training and Live Class troubleshooting tools.
- Both WhatsApp and Telegram formatted exports so participants can copy directly into whatever platform instructors use for the class.

</specifics>

<deferred>
## Deferred Ideas
None — discussion stayed strictly within Phase 8 scope.

</deferred>

---
*Phase: 08-in-class-troubleshooting-hub-completion-status-engine-final-report-exporter*
*Context gathered: 2026-09-07*
