# Phase 11: Interactive Modules Bab IV (Mail Merge, Track Changes & Kolaborasi Dokumen) - Research
**Researched:** 2026-09-07
**Domain:** Word Processing Automation, Mail Merge Systems, Review & Document Collaboration, Version Comparison, Civil Service Governance (Pemprov DKI Jakarta)
**Confidence:** HIGH

---

## Summary

Phase 11 delivers the interactive guide modules for Bab IV of Course 2 (**Pengolahan Kata Tingkat Lanjut: Dari Dokumen Berantakan ke Standar Kedinasan Otomatis**), fulfilling requirements **WORD-04** and **WORD-05**. This phase directly continues the multi-course modular architecture and gate protection established in Phase 9 and the document hierarchy foundations built in Phase 10.

The domain operationalizes Bab IV (*"Otomatisasi Dokumen dan Kolaborasi"*) from the authoritative curriculum by Yudhi Ardinal (BPSDM 2026):
1. **Mail Merge Automation (Surat & Label Massal)**: Data source schema separation (Excel `.xlsx`/`.csv` vs Word template), Field mapping (`<<Nama>>`, `<<NIP>>`, `<<Jabatan>>`, `<<Unit_Kerja>>`), dynamic conditional logic (`{ IF { MERGEFIELD Status } = "PNS" "Pegawai Negeri Sipil" "PPPK" }`), Next Record logic for label printing (e.g. format label Tom & Jerry No. 103), filter & sort recipient records, and final merge outputs (Edit Individual Documents vs Print vs Email).
2. **Reviewing & Change Tracking (Track Changes & Comments)**: Document lifecycle tracking modes (Simple Markup, All Markup, No Markup, Original), change attribution by user identity, comment management (Modern Comments vs Classic, threads, @mentions, resolving vs deleting), Lock Tracking with password enforcement, and change review decisions (Accept/Reject and Move to Next vs Accept/Reject All).
3. **Document Comparison & Combination (Compare & Combine)**: Three-way comparison between Original Document and Revised Document, tracking legal edits across multiple reviewer drafts, Reviewing Pane (Vertical/Horizontal), and resolving conflicting edits into a single authoritative master civil service document.
4. **Cloud Collaboration & Document Hygiene**: Real-time co-authoring via OneDrive / SharePoint / MS 365, permission boundaries (View Only vs Can Edit vs Reviewing Mode, link expiry), version history audit & restoration, and mandatory Document Inspector metadata cleansing (removing personal reviewer traces, hidden text, and comment histories before public/official publication).
5. **Gerbang Checkpoint 3 Gate**: 5 verification criteria assessing end-to-end mastery of Mail Merge, conditional rules, change tracking, and document comparison.
6. **Civil Service Ergonomics (WORD-05 Extension)**: Keyboard shortcuts cheatsheet for Review & Mailings (`Ctrl+Shift+E`, `Ctrl+Alt+M`, `Alt+Shift+D`, `Alt+Shift+F`), 1-click copyable Mail Merge conditional formula templates, and Pergub DKI Jakarta No. 14/2020 privacy & compliance callouts forbidding unencrypted personal data (NIP, NIK, salary) in cloud drafts.

All interactive progress and checkpoint statuses will be stored in the isolated `learnwith_word_state_v1` localStorage namespace with zero impact on Course 1 (`Hands-on Agentic AI`).

---

## Architectural Responsibility Map

| Component / Layer | Physical Location | Primary Architectural Responsibilities |
|---|---|---|
| **Content Markup (`#container-course-word`)** | `index.html` (inside `#container-course-word`) | Hosts Bab IV accordion module (`#sec-word-module-4`), Checkpoint 3 gate card (`#sec-word-cp-3`), Mail Merge rules formula cards, Track Changes cheatsheets, and civil service confidentiality notices. |
| **Course 2 Sidebar Nav (`#nav-group-word`)** | `index.html` (inside `<aside id="app-sidebar">`) | Houses dedicated sub-group for Bab IV (`#sec-word-module-4`) and Checkpoint 3 (`#sec-word-cp-3`) with real-time badges (`#badge-nav-word-b4`, `#status-nav-word-cp3`). |
| **State Storage & Progress Engine** | `assets/js/state.js` | Manages `WORD_DEFAULT_STATE` with 8 Bab IV checklist tasks (`word-b4-*`), `word-cp-3` checkpoint, updated `calculateProgress()` weighting, and updated `calculateWordReadiness()` factoring all 3 checkpoints. |
| **Course Lifecycle Controller** | `assets/js/app.js` | Initializes Course 2 state listeners, binds Checkpoint 3 action buttons (`btn-cp-action`), updates status badges, handles 1-click syntax copying, and integrates scroll spy navigation. |
| **Scoped Real-Time Search** | `assets/js/search.js` | Dynamically indexes visible Bab IV steps and Checkpoint 3 verification criteria when Course 2 is active. |
| **Styling & Design Tokens** | `assets/css/components.css`, `assets/css/main.css` | Renders formula syntax cards, review comparison diff boxes, `<kbd>` shortcuts, and checkpoint gate visual states. |
| **Verification & Regression Suite** | `tests/word-modules.test.js` | Automated test suite validating state defaults, checklist toggles, Checkpoint 3 transitions, updated Course 2 readiness, and DOM element integrity. |

---

## Standard Stack

| Technology / Library | Standard / Version | Purpose / Constraints |
|---|---|---|
| **Vanilla JavaScript (ES6+)** | ES2022 Native | 100% offline, zero external client-side packages. Runs natively in all standard browsers and under headless Node.js tests. |
| **HTML5 Semantic Elements** | W3C Standard / WCAG 2.1 AA | Accessible `<section>`, `<details>/<summary>`, `<kbd>`, `<table>`, `aria-expanded`, and ARIA live region support. |
| **CSS3 Design Tokens** | CSS Custom Properties (`:root`) | Native light/dark theme variables (`--bg-surface`, `--text-primary`, `--accent-primary`, `--color-success`, `--color-warning`, `--color-danger`). |
| **LocalStorage API** | Browser Native | Keyed under `learnwith_word_state_v1`. Strict isolation from Course 1 storage keys. |
| **Testing Harness** | Node.js native assert + DOM mocks (`tests/`) | High-speed unit & integration test runner (`tests/word-modules.test.js`). |

---

## Package Legitimacy Audit

Zero external runtime dependencies are introduced in this phase:
- **No npm dependencies**: Pure client-side vanilla JavaScript architecture.
- **No external fonts/CDNs**: Fully self-contained styling with local CSS and SVG icons.

---

## Architecture Patterns

### 1. Scoped Checklist & Checkpoint Keys for Bab IV
Following the established Course 2 conventions:
- **Bab IV Checklist Tasks (8 tasks)**:
  1. `word-b4-prepare-source`: Persiapan tabel data sumber Excel (Header baris pertama, format teks untuk NIP/NIK, tanpa baris/kolom kosong).
  2. `word-b4-setup-mailmerge`: Menghubungkan naskah dinas Word ke sumber data (Mailings > Select Recipients > Use an Existing List).
  3. `word-b4-insert-fields`: Menyisipkan Field Merge (`<<Nama>>`, `<<NIP>>`, `<<Jabatan>>`, `<<Unit_Kerja>>`) dan format tampilan.
  4. `word-b4-merge-rules`: Menerapkan aturan kondisional (`Rules > If...Then...Else`) untuk predikat/sapaan otomatis dan Next Record pada label.
  5. `word-b4-preview-finish`: Preview Results, navigasi record, pengecekan error, dan ekspor dokumen individu (Finish & Merge).
  6. `word-b4-track-changes`: Mengaktifkan Track Changes (`Ctrl+Shift+E`), konfigurasi tampilan markup, dan penguncian pelacakan (Lock Tracking).
  7. `word-b4-comments-resolve`: Mengelola komentar review (Modern Comments), menanggapi thread, menandai Resolve, dan pembersihan metadata.
  8. `word-b4-compare-combine`: Melakukan perbandingan dokumen (Compare) & penggabungan revisi naskah dinas (Combine) serta inspeksi keamanan.

- **Checkpoint 3 Gate**:
  - `word-cp-3`: Gerbang Checkpoint 3 (Otomatisasi Mail Merge, Review & Kolaborasi Dokumen).
  - Status values: `'pending'` | `'passed'` | `'failed'`.

- **Updated Total State Metrics for Course 2**:
  - Total Checklists: 28 tasks (Bab I: 4, Bab II: 8, Bab III: 8, Bab IV: 8).
  - Total Checkpoints: 3 checkpoints (`word-cp-1`, `word-cp-2`, `word-cp-3`).
  - Weighted Progress: Checklists = 60%, Checkpoints = 40%.

### 2. State Isolation & Default State Hydration
In `assets/js/state.js`, `WORD_DEFAULT_STATE` must include:
```javascript
const WORD_DEFAULT_STATE = {
  theme: 'light',
  checklists: {
    // Bab I (4 tasks)
    'word-b1-download-pkg': false,
    'word-b1-setup-folder': false,
    'word-b1-inspect-messy': false,
    'word-b1-check-version': false,
    // Bab II (8 tasks)
    'word-b2-apply-h1': false,
    'word-b2-apply-h2-h3': false,
    'word-b2-modify-styles': false,
    'word-b2-nav-pane': false,
    'word-b2-multilevel': false,
    'word-b2-insert-toc': false,
    'word-b2-update-toc': false,
    'word-b2-captions-ref': false,
    // Bab III (8 tasks)
    'word-b3-section-breaks': false,
    'word-b3-unlink-header': false,
    'word-b3-page-num-roman': false,
    'word-b3-page-num-arabic': false,
    'word-b3-landscape-mix': false,
    'word-b3-save-dotx': false,
    'word-b3-content-controls': false,
    'word-b3-doc-inspection': false,
    // Bab IV (8 tasks)
    'word-b4-prepare-source': false,
    'word-b4-setup-mailmerge': false,
    'word-b4-insert-fields': false,
    'word-b4-merge-rules': false,
    'word-b4-preview-finish': false,
    'word-b4-track-changes': false,
    'word-b4-comments-resolve': false,
    'word-b4-compare-combine': false
  },
  checkpoints: {
    'word-cp-1': 'pending',
    'word-cp-2': 'pending',
    'word-cp-3': 'pending'
  }
};
```

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---|---|---|---|
| **Mail Merge Rule Syntax** | Complex regex or fake syntax generator | Native Word field codes syntax `{ IF { MERGEFIELD Status } = "PNS" "..." "..." }` with toggle instructions (`Alt+F9`) | Word requires literal nested field braces generated via `Ctrl+F9`, not typed curly brackets. Providing the exact code and step-by-step keystrokes prevents fatal merge errors. |
| **Diff & Comparison Visualization** | Complex JS diff algorithms | Clean two-column table and visual callout cards mirroring Microsoft Word's Reviewing Pane and Compare Dialog | The web app guides the user to perform actions inside Microsoft Word on their actual document files rather than running a simulated word processor in browser. |
| **State Persistence** | Custom storage database or cookie jar | Namespaced LocalStorage (`learnwith_word_state_v1`) through `StateManager` | Guarantees instant sync, zero network dependency, and strict data isolation across courses. |

---

## Common Pitfalls

### Pitfall 1: Typing Curly Brackets in Mail Merge Field Codes
**What goes wrong:** Participants manually type `{ IF ... }` using the keyboard `{` and `}` keys, and Word treats it as literal text rather than an executable field code, causing the rule to fail.  
**How to avoid:** Explicitly guide participants to press `Ctrl+F9` to create the field bracket pair, or use Word's GUI dialog **Mailings > Rules > If...Then...Else...**. Add an alert callout card highlighting this distinction.

### Pitfall 2: Leading Zero Loss in Excel NIP/NIK Data Source
**What goes wrong:** Excel stores NIP numbers (e.g., `1985...` or `0123...`) as standard numbers, stripping leading zeros, or formatting dates into US format (`MM/DD/YYYY`).  
**How to avoid:** Step A in Bab IV instructs formatting the Excel column as **Text** (`'0123...`) before saving, or using Word's numeric switch formatting `\# "000000000000000000"` / `\@ "dd MMMM yyyy"`.

### Pitfall 3: Distributing Track Changes and Comments to Public
**What goes wrong:** Civil servants send final `.docx` files to external agencies without realizing that resolved comments, deleted draft paragraphs, and reviewer identities remain embedded in the file metadata.  
**How to avoid:** Step H in Bab IV enforces running **File > Info > Check for Issues > Inspect Document** to scrub reviewer comments, hidden metadata, and personal data before publishing or converting to PDF.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|---|---|---|
| A1 | Bab IV contains 8 tasks (`word-b4-prepare-source` to `word-b4-compare-combine`) matching Bab II & III's 8-task structure | Architecture Patterns | Minor checklist numbering adjustment |
| A2 | Checkpoint 3 has 5 evaluation criteria consistent with Checkpoints 1 & 2 | Architecture Patterns | Minor criteria adjustment |

---

## Environment Availability

All dependencies are local and available:
- Node.js v22.22.3 (`C:\nvm4w\nodejs\node.exe`)
- Testing harness: `tests/word-modules.test.js`

---

## Validation Architecture

Nyquist validation sampling:
- **Test suite command**: `cmd /c "set PATH=C:\nvm4w\nodejs;%PATH% && node tests/word-modules.test.js"`
- **Full regression command**: `cmd /c "set PATH=C:\nvm4w\nodejs;%PATH% && node tests/word-modules.test.js && node tests/multi-course.test.js && node tests/checkpoint-engine.test.js"`
- **Target metrics**: 100% passing tests, 0 failures, 0 regressions.
