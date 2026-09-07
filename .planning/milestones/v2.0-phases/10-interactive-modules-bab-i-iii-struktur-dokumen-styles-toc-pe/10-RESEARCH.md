# Phase 10: Interactive Modules Bab I–III (Struktur Dokumen, Styles, TOC & Penomoran Halaman) - Research
**Researched:** 2026-09-07
**Domain:** Multi-Course Interactive Learning, Document Hierarchy Engineering, Word Processing Automation (Styles, TOC, Sections, Page Numbering, Templates, Civil Service Governance)
**Confidence:** HIGH

---

## Summary

Phase 10 delivers the core interactive guide modules for Course 2 (**Pengolahan Kata Tingkat Lanjut** / Word Processing for Civil Servants / ASN Pemprov DKI Jakarta), building directly upon the multi-course architecture and gate protection established in Phase 9. 

The domain of this phase operationalizes the authoritative curriculum from the official BPSDM module (*"Pelatihan Komputer Tingkat Lanjutan: Pengolahan Kata Tingkat Lanjut (2026)"* by Yudhi Ardinal) into the client-side interactive web application. The module covers:
1. **Bab I (Pendahuluan)**: Instructional objectives (TPU & 7 Indikator), cloud dataset download links (`https://t.ppkasn.id/pengolahankatalanjut`), practice file mapping (`01_Dokumen_Berantakan.docx`, `02_Dokumen_Panjang_Section.docx`), ASN file naming conventions (`NamaPeserta_NamaTugas_v01.docx`), and initial competency readiness check (**WORD-01**).
2. **Bab II (Struktur dan Otomatisasi Dokumen)**: Interactive step-by-step guide for Styles & Heading hierarchy (Heading 1–3 vs Normal), Navigation Pane inspection & drag-and-drop restructuring, Multilevel List numbering linked to Headings, Custom Automatic Table of Contents (3 levels, tab leader dots, Update Page Numbers Only vs Update Entire Table), dynamic captions & cross-references (`Ctrl+A` -> `F9`), and **Checkpoint 1 Gate** (**WORD-02**).
3. **Bab III (Tata Letak dan Template Dokumen)**: Interactive step-by-step guide for Section Breaks vs Page Breaks (Next Page, Continuous, Even/Odd), Header/Footer unlinking (`Link to Previous` decoupling), complex mixed page numbering (Roman `i, ii, iii` for preliminary sections vs Arabic `1, 2, 3` starting at 1 for body text), mixed page orientation (isolated Landscape table section within Portrait flow), reusable Word Templates (`.dotx` master templates), Content Controls (Developer Tab: Rich Text, Plain Text, Date Picker, Dropdown), Document Inspector & Accessibility Checker, and **Checkpoint 2 Gate** (**WORD-03**).
4. **ASN Civil Service Standards & Ergonomics**: Visual keyboard shortcut cheatsheets (`<kbd>` badges), callout cards for official civil service document governance (Pergub DKI Jakarta No. 14/2020 tentang Tata Naskah Dinas: margin 4-3-3-3 cm, typography Arial/Bookman Old Style 12 pt spasi 1.5, privacy guidelines prohibiting public sharing of NIP/drafts), and 1-click text/code copying with clipboard toast notifications (**WORD-05**).

All interactive progress and checkpoint statuses will be persisted strictly within the namespaced localStorage key `learnwith_word_state_v1`, ensuring zero regression to Course 1 (`Hands-on Agentic AI`).

---

## Architectural Responsibility Map

| Component / Layer | Physical Location | Primary Architectural Responsibilities |
|---|---|---|
| **Content Markup (`#container-course-word`)** | `index.html` (lines 4455+) | Hosts Course 2 hero section, Bab I overview, DKI Jakarta governance standards, keyboard shortcut grids, Bab II accordion module, Checkpoint 1 card, Bab III accordion module, Checkpoint 2 card, and structural diagnostic matrix. |
| **Course 2 Sidebar Nav (`#nav-group-word`)** | `index.html` (within `<aside id="app-sidebar">`) | Provides dedicated section jumping for Course 2 (`#sec-word-intro`, `#sec-word-standards`, `#sec-word-shortcuts`, `#sec-word-module-2`, `#sec-word-cp-1`, `#sec-word-module-3`, `#sec-word-cp-2`, `#sec-word-diagnosis`) with real-time badges. |
| **State Storage & Progress Engine** | `assets/js/state.js` | Handles isolated `learnwith_word_state_v1` state, defaults for `word-b1-*`, `word-b2-*`, `word-b3-*` checklists, `word-cp-1`, `word-cp-2` checkpoints, `calculateWordReadiness()`, and scoped progress percentage calculation. |
| **Course Lifecycle & Checkpoint Controller** | `assets/js/app.js` | Coordinates Course 2 UI initialization, activates `#nav-group-word` on `switchCourse('word')`, wires Checkpoint 1 & 2 action buttons (`btn-cp-action`), updates status badges, and triggers 1-click clipboard copies. |
| **Scoped Real-Time Search** | `assets/js/search.js` | Dynamically indexes visible Course 2 modules when Word course is active, automatically excluding hidden Course 1 elements. |
| **Styling & Design Tokens** | `assets/css/components.css`, `assets/css/main.css` | Renders cards, tables, kbd tags, checkpoint gates, callouts, progress tracks, and mobile responsive drawers conforming to high-contrast accessibility standards. |
| **Verification & Regression Suite** | `tests/word-modules.test.js`, `tests/index.html` | Automated test suite validating state isolation, checklist updates, checkpoint transitions, progress calculation, DOM integrity, and search compatibility. |

---

## Standard Stack

| Technology / Library | Standard / Version | Purpose / Constraints |
|---|---|---|
| **Vanilla JavaScript (ES6+)** | ES2022 Native | Zero external client-side dependencies. Must run smoothly offline in local browser and under Node.js test environments. |
| **HTML5 Semantic Markup** | W3C Standard / WCAG 2.1 AA | Accessible headings (`h2`, `h3`, `h4`), semantic `<section>`, `<aside>`, `<kbd>`, `<details>/<summary>`, ARIA attributes (`role="button"`, `aria-expanded`). |
| **CSS3 Design Tokens & Grid/Flexbox** | CSS Custom Properties (`:root`) | Native theming (`--bg-surface`, `--text-primary`, `--accent-primary`, `--border-subtle`) supporting seamless Light/Dark theme switching. |
| **LocalStorage API** | Browser Native | Keyed as `learnwith_word_state_v1`. Strict separation from `learnwith_ai_state_v1` and legacy keys. |
| **Testing Harness** | Node.js native assert + DOM mocks (`tests/`) + Browser runner (`tests/index.html`) | Automated regression testing for headless CLI and in-browser testing. |

---

## Package Legitimacy Audit

This phase adheres to the project's zero external dependency constraint:
- **No npm dependencies required for runtime**: The interactive guides, search indexing, checklist state, and checkpoint gates are built purely with vanilla web standards.
- **No external fonts/CDN dependencies**: All fonts fallback cleanly to system stacks (`-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`), SVGs are embedded inline, and CSS is stored locally.

---

## Architecture Patterns

### 1. Scoped Checklist & Checkpoint Key Architecture
Course 1 uses task IDs prefixed by `prereq-`, `m1-`..`m11-` and checkpoint IDs `cp-1`..`cp-9`.
To prevent DOM ID collisions and guarantee seamless state isolation, Course 2 items MUST use a distinct naming namespace:
- **Checklists**:
  - Bab I: `word-b1-download-pkg`, `word-b1-setup-folder`, `word-b1-inspect-messy`, `word-b1-check-version` (4 tasks)
  - Bab II: `word-b2-apply-h1`, `word-b2-apply-h2-h3`, `word-b2-modify-styles`, `word-b2-nav-pane`, `word-b2-multilevel`, `word-b2-insert-toc`, `word-b2-update-toc`, `word-b2-captions-ref` (8 tasks)
  - Bab III: `word-b3-section-breaks`, `word-b3-unlink-header`, `word-b3-page-num-roman`, `word-b3-page-num-arabic`, `word-b3-landscape-mix`, `word-b3-save-dotx`, `word-b3-content-controls`, `word-b3-doc-inspection` (8 tasks)
- **Checkpoints**:
  - `word-cp-1`: Checkpoint 1 (Struktur & TOC Otomatis Bab II)
  - `word-cp-2`: Checkpoint 2 (Section Breaks, Penomoran Halaman & Template Bab III)
- **Participant Info**:
  - `wordParticipantName`: Participant name
  - `wordParticipantNip`: NIP ASN (optional for simulation)
  - `wordUnitKerja`: Unit kerja / SKPD Pemprov DKI Jakarta
  - `wordTargetDoc`: Nama naskah dinas target standardisasi

### 2. State Isolation & Default State Hydration
In `assets/js/state.js`, when `activeCourse === 'word'`, `loadState()` loads from `learnwith_word_state_v1`. To avoid bloating Course 1 state and ensure pristine initialization for Course 2:
```javascript
const WORD_DEFAULT_STATE = {
  theme: 'light',
  checklists: {
    // Bab I: Pendahuluan & Berkas Praktik
    'word-b1-download-pkg': false,
    'word-b1-setup-folder': false,
    'word-b1-inspect-messy': false,
    'word-b1-check-version': false,
    // Bab II: Struktur & Otomatisasi Dokumen
    'word-b2-apply-h1': false,
    'word-b2-apply-h2-h3': false,
    'word-b2-modify-styles': false,
    'word-b2-nav-pane': false,
    'word-b2-multilevel': false,
    'word-b2-insert-toc': false,
    'word-b2-update-toc': false,
    'word-b2-captions-ref': false,
    // Bab III: Tata Letak & Template Dokumen
    'word-b3-section-breaks': false,
    'word-b3-unlink-header': false,
    'word-b3-page-num-roman': false,
    'word-b3-page-num-arabic': false,
    'word-b3-landscape-mix': false,
    'word-b3-save-dotx': false,
    'word-b3-content-controls': false,
    'word-b3-doc-inspection': false
  },
  checkpoints: {
    'word-cp-1': 'pending', // 'pending' | 'passed' | 'failed'
    'word-cp-2': 'pending'
  },
  participantInfo: {
    name: '',
    nip: '',
    unitKerja: '',
    targetDoc: ''
  },
  activeSection: 'sec-word-intro',
  lastUpdated: null
};
```
When `activeCourse === 'word'`, `loadState()` merges with `WORD_DEFAULT_STATE`, while Course 1 merges with `DEFAULT_STATE`.

### 3. Dynamic Sidebar Navigation Group Switching
In `index.html`, add `<div id="nav-group-word" class="sidebar-nav-group" style="display: none;">`.
In `switchCourse(courseId)` within `assets/js/app.js`:
- If `validCourse === 'word'`:
  - Show `navGroupWord` (`style.display = 'block'`).
  - Hide `navGroupPretraining` and `navGroupLiveclass` (`style.display = 'none'`).
  - Hide Course 1 mode switcher tabs (`headerModeSwitcher.style.display = 'none'`).
  - Re-sync Course 2 checklist checkboxes and checkpoint cards from `AppState.getState()`.
  - Update `header-progress-bar` and `header-progress-text` with Word progress.
- If `validCourse === 'ai'`:
  - Hide `navGroupWord` (`style.display = 'none'`).
  - Restore Course 1 mode switcher and active mode navigation.

---

## Don't Hand-Roll

| Problem | Standard Existing Solution | Why Not Hand-Roll |
|---|---|---|
| **1-Click Text/Formula Copying** | Reuse existing `.code-copy-btn` and `.code-container` pattern wired to `setupCodeCopy()` in `app.js` | Hand-rolling custom event listeners risks clipboard API compatibility bugs, unstyled feedback, or missing fallback for non-secure contexts. |
| **Module Expand / Collapse** | Reuse `.module-card`, `.module-header`, and `.module-body` with `setupModuleAccordion()` in `app.js` | Accordion keyboard accessibility (`Enter`, `Space`, ARIA expanded) and URL hash auto-expansion are already fully implemented and tested. |
| **Scroll Spy Navigation** | Existing `IntersectionObserver` in `setupNavigationSpy()` in `app.js` | Automatically highlights `.nav-link` whose `href` matches the intersecting `.content-section` ID without requiring custom scroll math. |
| **Search Highlighting & Indexing** | Existing `SearchEngine.buildIndex()` and `performSearch()` in `search.js` | Scopes automatically to visible `#container-course-word`, strips tags safely, creates secure `<mark>` highlights, and avoids DOM destruction. |

---

## Common Pitfalls

### Pitfall 1: DOM ID Duplication Across Course Containers
**Symptom**: Checkpoint clicks in Course 2 update Course 1 cards, or navigation anchors jump to Course 1 sections.
**Root Cause**: Both `container-course-ai` and `container-course-word` exist concurrently in the DOM. Using identical IDs like `sec-checkpoint-1`, `card-cp-1`, or `status-card-cp1` breaks `document.getElementById()`.
**Prevention**: Strictly prefix all Course 2 elements with `word-` or `sec-word-`:
- Sections: `sec-word-intro`, `sec-word-standards`, `sec-word-shortcuts`, `sec-word-module-2`, `sec-word-cp-1`, `sec-word-module-3`, `sec-word-cp-2`, `sec-word-diagnosis`.
- Cards: `card-word-cp-1`, `card-word-cp-2`.
- Badges: `status-card-word-cp1`, `status-card-word-cp2`, `status-nav-word-cp1`, `status-nav-word-cp2`.

### Pitfall 2: State Leaking Between AI and Word Courses
**Symptom**: Checklists completed in Course 1 count towards Course 2 progress, or switching courses resets progress.
**Root Cause**: Shared keys in `AppState.checklists` or `DEFAULT_STATE` merging without course discernment.
**Prevention**: Course-specific defaults in `loadState()` and course filtering in `calculateProgress()`. When `activeCourse === 'word'`, only evaluate keys starting with `word-b` and checkpoints starting with `word-cp-`.

### Pitfall 3: "Link to Previous" Confusion in Word Instruction
**Symptom**: Learners unlink headers in Section 2, but when modifying Section 3, Section 2 is overwritten.
**Root Cause**: Microsoft Word's `Link to Previous` operates per section *and* per header/footer type (Odd/Even/First Page).
**Prevention**: The interactive guide for Bab III Step B must prominently highlight:
- `Link to Previous` is active by default in *every* newly created section.
- You must double-click the Header/Footer of the *new section* and turn off `Link to Previous` *before* editing the text.
- Footer and Header have independent `Link to Previous` toggles.

### Pitfall 4: Page Number Restarting Issues
**Symptom**: Document shows page 1 on cover, or Roman numerals continue as 4, 5, 6 into body text.
**Root Cause**: Learners insert page numbers without configuring `Format Page Numbers... > Start at: 1` on the body section.
**Prevention**: Provide clear visual step-by-step breakdown:
1. Cover page: `Different First Page` checked OR Section 1 dedicated without page number field.
2. Preliminary section (Kata Pengantar/Daftar Isi): Number format `i, ii, iii`.
3. Body section (Bab I): Footer unlinked (`Link to Previous` off) -> `Format Page Numbers` -> Number format `1, 2, 3` -> `Start at: 1`.

---

## Code Examples

### 1. StateManager Course 2 Defaults & Scoped Progress
```javascript
// In assets/js/state.js

const WORD_DEFAULT_STATE = {
  theme: 'light',
  checklists: {
    // Bab I
    'word-b1-download-pkg': false,
    'word-b1-setup-folder': false,
    'word-b1-inspect-messy': false,
    'word-b1-check-version': false,
    // Bab II
    'word-b2-apply-h1': false,
    'word-b2-apply-h2-h3': false,
    'word-b2-modify-styles': false,
    'word-b2-nav-pane': false,
    'word-b2-multilevel': false,
    'word-b2-insert-toc': false,
    'word-b2-update-toc': false,
    'word-b2-captions-ref': false,
    // Bab III
    'word-b3-section-breaks': false,
    'word-b3-unlink-header': false,
    'word-b3-page-num-roman': false,
    'word-b3-page-num-arabic': false,
    'word-b3-landscape-mix': false,
    'word-b3-save-dotx': false,
    'word-b3-content-controls': false,
    'word-b3-doc-inspection': false
  },
  checkpoints: {
    'word-cp-1': 'pending',
    'word-cp-2': 'pending'
  },
  participantInfo: {
    name: '',
    nip: '',
    unitKerja: '',
    targetDoc: ''
  },
  activeSection: 'sec-word-intro',
  lastUpdated: null
};

// In StateManager.calculateProgress():
calculateProgress(mode = null) {
  if (this.activeCourse === 'word') {
    const checklists = this.state.checklists || {};
    const taskKeys = Object.keys(checklists).filter(k => k.startsWith('word-b1-') || k.startsWith('word-b2-') || k.startsWith('word-b3-'));
    const cpKeys = Object.keys(this.state.checkpoints || {}).filter(k => k.startsWith('word-cp-'));

    const totalTasks = taskKeys.length;
    const completedTasks = taskKeys.filter(k => checklists[k] === true).length;
    const totalCheckpoints = cpKeys.length;
    const passedCheckpoints = cpKeys.filter(k => this.state.checkpoints[k] === 'passed').length;

    // Checklists = 60%, Checkpoints = 40%
    const taskPercent = totalTasks > 0 ? (completedTasks / totalTasks) * 60 : 0;
    const cpPercent = totalCheckpoints > 0 ? (passedCheckpoints / totalCheckpoints) * 40 : 0;
    const overallPercent = Math.min(100, Math.round(taskPercent + cpPercent));

    return {
      totalTasks,
      completedTasks,
      totalCheckpoints,
      passedCheckpoints,
      percentage: overallPercent
    };
  }
  // ... existing Course 1 mode calculation
}
```

### 2. Checkpoint Card Markup Pattern for Course 2
```html
<!-- CHECKPOINT 1 (BAB II): STRUKTUR & TOC OTOMATIS -->
<section id="sec-word-cp-1" class="content-section">
  <div class="section-header">
    <div class="section-title-wrap">
      <div class="section-badge-icon" style="background: var(--accent-primary-subtle); color: var(--accent-primary); width: 36px; height: 36px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; font-size: 1.1rem;">📍</div>
      <div>
        <h3 class="section-title">Gerbang Checkpoint 1: Struktur & Daftar Isi Otomatis</h3>
        <p class="section-desc">Verifikasi penerapan hierarki Heading 1–3, Navigation Pane, dan Table of Contents dinamis.</p>
      </div>
    </div>
  </div>

  <div class="checkpoint-gate-card" id="card-word-cp-1">
    <div class="checkpoint-header-row">
      <div class="checkpoint-title-wrap">
        <div class="checkpoint-badge-icon">1</div>
        <div>
          <h4 style="font-size: var(--font-size-base); font-weight: var(--font-weight-bold); color: var(--text-primary); margin-bottom: 0.15rem;">
            Verifikasi Struktur Dokumen & TOC (Bab II)
          </h4>
          <span style="font-size: var(--font-size-xs); color: var(--text-muted);">Bukti Berkas: <code>Latihan_Styles_NamaPeserta.docx</code></span>
        </div>
      </div>
      <span id="status-card-word-cp1" class="badge badge-pill badge-warning">Pending</span>
    </div>

    <p class="card-body">
      Gerbang Checkpoint 1 dinyatakan <strong>Lolos Verifikasi</strong> apabila 5 kriteria pemeriksaan hasil berikut terpenuhi:
    </p>

    <div class="checklist-group" style="margin: 0.75rem 0 1rem 0;">
      <div class="checklist-item" style="cursor: default;">
        <span style="font-size: 1.1rem; color: var(--color-success); font-weight: bold;">✓</span>
        <div class="checklist-label">Seluruh judul dan subbagian memakai style <code>Heading 1</code>, <code>Heading 2</code>, atau <code>Heading 3</code> (tidak ada format manual semata).</div>
      </div>
      <div class="checklist-item" style="cursor: default;">
        <span style="font-size: 1.1rem; color: var(--color-success); font-weight: bold;">✓</span>
        <div class="checklist-label">Hierarki pada <strong>Navigation Pane</strong> (<code>Ctrl+F</code>) rapi berurutan dan tidak melompati tingkatan.</div>
      </div>
      <div class="checklist-item" style="cursor: default;">
        <span style="font-size: 1.1rem; color: var(--color-success); font-weight: bold;">✓</span>
        <div class="checklist-label">Daftar Isi Otomatis menampilkan judul dan nomor halaman yang sesuai serta memiliki tab leader titik-titik.</div>
      </div>
      <div class="checklist-item" style="cursor: default;">
        <span style="font-size: 1.1rem; color: var(--color-success); font-weight: bold;">✓</span>
        <div class="checklist-label">Uji pembaruan berhasil: penambahan satu subbagian baru tercermin di daftar isi setelah memilih <code>Update entire table</code>.</div>
      </div>
      <div class="checklist-item" style="cursor: default;">
        <span style="font-size: 1.1rem; color: var(--color-success); font-weight: bold;">✓</span>
        <div class="checklist-label">Paragraf isi menggunakan style <strong>Normal</strong>, dan opsi <strong>Keep with next</strong> aktif pada heading agar judul tidak terpisah di akhir halaman.</div>
      </div>
    </div>

    <div class="cp-action-btn-group">
      <button type="button" class="btn btn-success btn-cp-action" data-checkpoint="word-cp-1" data-status="passed">
        <span>✓</span> Lolos Verifikasi
      </button>
      <button type="button" class="btn btn-outline-danger btn-cp-action" data-checkpoint="word-cp-1" data-status="failed">
        <span>✕</span> Ada Kendala (Gagal)
      </button>
      <button type="button" class="btn btn-secondary btn-cp-action btn-sm" data-checkpoint="word-cp-1" data-status="pending">
        <span>↺</span> Reset Status
      </button>
    </div>
  </div>
</section>
```

### 3. Visual Keyboard Shortcuts Grid Component
```html
<div class="shortcut-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; margin-top: 1rem;">
  <div class="card" style="padding: 1rem; border: 1px solid var(--border-subtle);">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
      <strong>Terapkan Heading 1</strong>
      <div class="kbd-group">
        <kbd class="header-search-kbd">Ctrl</kbd> + <kbd class="header-search-kbd">Alt</kbd> + <kbd class="header-search-kbd">1</kbd>
      </div>
    </div>
    <p style="font-size: var(--font-size-xs); color: var(--text-secondary); margin: 0;">Mengubah paragraf judul utama/bab menjadi style Heading 1 secara instan.</p>
  </div>
  
  <div class="card" style="padding: 1rem; border: 1px solid var(--border-subtle);">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
      <strong>Update Seluruh Field / TOC</strong>
      <div class="kbd-group">
        <kbd class="header-search-kbd">Ctrl</kbd> + <kbd class="header-search-kbd">A</kbd> lalu <kbd class="header-search-kbd">F9</kbd>
      </div>
    </div>
    <p style="font-size: var(--font-size-xs); color: var(--text-secondary); margin: 0;">Memperbarui seluruh daftar isi, cross-reference, nomor halaman, dan nomor gambar/tabel.</p>
  </div>
</div>
```

---

## State of the Art

| Technique | Old / Inefficient Way | Modern Standardized Approach (Course 2) |
|---|---|---|
| **Document Hierarchy** | Changing font size to 16pt and pressing Bold manually on every heading. | Assigning Semantic Styles (`Heading 1`, `Heading 2`, `Heading 3`) linked to Multilevel Lists and monitored in the Navigation Pane. |
| **Table of Contents** | Typing chapter titles and tapping space or tab dots manually to align page numbers. | Automatic Table of Contents (`References > Table of Contents`) synced with headings and refreshed with `F9`. |
| **Page Layout & Orientations** | Creating separate Word files for Portrait and Landscape pages and printing them separately. | Multi-Section Architecture using Next Page Section Breaks and decoupled headers/footers with `Link to Previous` toggles. |
| **Numbering Systems** | Starting page numbers at 1 on cover, or printing Roman numeral preliminary pages as separate files. | Section-scoped Page Numbering (`Format Page Numbers: i, ii, iii` vs `Start at: 1` on body section). |
| **Standardization** | Sending empty DOCX files or copying old letters and risking residual sensitive data. | Clean Master Templates (`.dotx`) with Content Controls, stripped metadata (`Inspect Document`), and accessibility validation. |

---

## Assumptions Log

| # | Assumption | Status | Impact if False |
|---|---|---|---|
| 1 | Course 2 participants access practice files via Google Drive / Cloud URL `https://t.ppkasn.id/pengolahankatalanjut` as defined in official curriculum. | CONFIRMED (Author's BPSDM Module) | If URL changes, external link card can be updated in `index.html` without affecting app code. |
| 2 | Checkpoint 1 corresponds to Bab II (Struktur & TOC), Checkpoint 2 corresponds to Bab III (Tata Letak & Template), and Checkpoint 3 corresponds to Bab IV (Mail Merge & Kolaborasi in Phase 11). | CONFIRMED (Roadmap & Module) | Clean alignment across Phases 10, 11, and 12. |
| 3 | In browser runtime, both `container-course-ai` and `container-course-word` exist in the DOM with visibility toggled via `style.display`. | CONFIRMED (Phase 9 Implementation) | Unique element IDs required for all Course 2 elements. |
| 4 | Search engine should automatically index Course 2 content when Word course is active. | CONFIRMED (`search.js` already checks `#container-course-*` visibility) | Seamless search experience without extra configuration. |

---

## Open Questions

- **None**: Authoritative curriculum text, exercise definitions, tables (1.1, 1.2, 2.1, 2.2, 3.1, 3.2), and checkpoint criteria were extracted directly from the author's official module docx located in the workspace.

---

## Environment Availability

- **Node.js**: `v22.22.3` at `C:\nvm4w\nodejs\node.exe` (functional).
- **Python**: `3.13.14` (functional).
- **Git**: Branch `master`, working directory clean.
- **Test Harnesses**: All 7 existing test suites passing (`tests/multi-course.test.js`, `tests/checkpoint-engine.test.js`, etc.).

---

## Validation Architecture

### Automated Verification Framework
1. **New Unit & Integration Test Suite**: `tests/word-modules.test.js`
   - **Suite 1: Course 2 State Initialization & Scoped Namespaces**: Verify `learnwith_word_state_v1` default state loads all Bab I (4 tasks), Bab II (8 tasks), Bab III (8 tasks), and checkpoints (`word-cp-1`, `word-cp-2`).
   - **Suite 2: Checkpoint 1 & 2 Gates Workflow**: Test pending -> passed, pending -> failed, reset actions, and persistence across StateManager reloads.
   - **Suite 3: Word Progress Calculation**: Verify weighted formula (60% checklists, 40% checkpoints) and zero interference with Course 1 progress.
   - **Suite 4: DOM Rendering & Attribute Completeness**: Verify all sections (`#sec-word-intro`, `#sec-word-standards`, `#sec-word-shortcuts`, `#sec-word-module-2`, `#sec-word-cp-1`, `#sec-word-module-3`, `#sec-word-cp-2`, `#sec-word-diagnosis`) exist with required IDs, classes, copy buttons, and ARIA roles.
   - **Suite 5: Course Switcher & Navigation Sync**: Test switching between `ai` and `word` accurately toggles `#nav-group-word` vs `#nav-group-pretraining` and updates document title and header badges.
2. **Browser Test Runner**: Include `tests/word-modules.test.js` in `tests/index.html`.
3. **Execution Command**:
   `cmd /c "set PATH=C:\nvm4w\nodejs;%PATH% && node tests/word-modules.test.js && node tests/multi-course.test.js"`

---

## Security Domain

- **Data Privacy & Redaction**: Adhere to BPSDM civil service data governance. The interactive guides explicitly instruct participants to practice with simulated dummy data (`01_Dokumen_Berantakan.docx`) and prohibit using genuine civil servant NIPs, personal identifiable information (PII), or confidential municipal documents.
- **XSS Prevention in Search**: Ensure all newly added Course 2 headings and callout contents are indexed and highlighted using the safe DOM text node unwrapping engine in `search.js` without `innerHTML` interpolation of user queries.
- **Clipboard API Security**: Code copy buttons use `navigator.clipboard.writeText` within secure contexts and cleanly sanitize trailing newlines without injecting unescaped tags.

---

## Sources

- **Primary Source**: `01_Modul Peserta - Pengolahan Kata Tingkat Lanjut - Final Spasi 1.5 Nomor Romawi Daftar Gambar Rapi.docx` (BPSDM Provinsi DKI Jakarta, 2026, Penulis: Yudhi Ardinal).
- **Project Specifications**:
  - `.planning/ROADMAP.md` (Milestone v2.0, Phase 10)
  - `.planning/REQUIREMENTS.md` (WORD-01, WORD-02, WORD-03, WORD-05)
  - `.planning/STATE.md` (Current project state & Phase 9 history)
- **Codebase Context**:
  - `index.html` (Multi-course shell, containers, and drawer navigation)
  - `assets/js/state.js` (StateManager, namespaced keys, reactive events)
  - `assets/js/app.js` (CourseManager, Checkpoint gates, accordion, copy buttons)
  - `assets/js/search.js` (Course-scoped indexer)

---

## Metadata

- **Researched By**: GSD Phase Researcher
- **Phase Target**: Phase 10 (Interactive Modules Bab I–III)
- **Target Files to Modify**:
  1. `index.html` (Replace placeholder in `#container-course-word` with full interactive content; add `#nav-group-word` in sidebar).
  2. `assets/js/state.js` (Add `WORD_DEFAULT_STATE`, word progress calculation, and module helper).
  3. `assets/js/app.js` (Update `switchCourse`, `setupCheckpointGates`, and progress updates for Course 2).
  4. `tests/word-modules.test.js` (New comprehensive automated test suite).
  5. `tests/index.html` (Register new test suite in browser runner).
