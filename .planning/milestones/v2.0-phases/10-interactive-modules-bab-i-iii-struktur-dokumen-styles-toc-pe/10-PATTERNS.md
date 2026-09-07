# Phase 10: Interactive Modules Bab I–III (Struktur Dokumen, Styles, TOC & Penomoran Halaman) - Pattern Mapping

**Generated:** 2026-09-07  
**Status:** READY FOR PLANNING  
**Target:** Course 2 Interactive Guides (Bab I, II, III), Checkpoint Gates 1 & 2, Scoped State & Progress, Visual Cheatsheets  

---

## 1. Executive Summary

Phase 10 populates Course 2 (**Pengolahan Kata Tingkat Lanjut** / Word Processing for Civil Servants / ASN Pemprov DKI Jakarta) with production-grade interactive modules, operationalizing the official BPSDM DKI Jakarta curriculum into the client-side single-page application.

This document maps every file to be created or modified to its closest existing analog in the codebase. By extracting exact code excerpts, data-flow patterns, and component signatures, this pattern map prevents regressions to Course 1 (*Hands-on Agentic AI*), ensures DOM ID uniqueness, guarantees state isolation in `learnwith_word_state_v1`, and maintains zero external runtime dependencies.

---

## 2. File Inventory & Classification

| File Path | Action | Role | Data Flow / Architectural Position |
|---|---|---|---|
| [`index.html`](file:///c:/Users/yudhiar/Downloads/AgenticAI/index.html) | **Modify** | View / Semantic DOM Markup | Hosts Course 2 hero section, Bab I overview, Pergub 14/2020 governance cards, visual keyboard shortcut grids, Bab II accordion module, Checkpoint 1 gate, Bab III accordion module, Checkpoint 2 gate, and structural diagnosis matrix inside `#container-course-word`. Also adds `#nav-group-word` within `<aside id="app-sidebar">`. |
| [`assets/js/state.js`](file:///c:/Users/yudhiar/Downloads/AgenticAI/assets/js/state.js) | **Modify** | Model / Reactive State Store | Manages `learnwith_word_state_v1` default state (`WORD_DEFAULT_STATE`), scoped checklist items (`word-b1-*`, `word-b2-*`, `word-b3-*`), checkpoint statuses (`word-cp-1`, `word-cp-2`), weighted progress math (60% checklists, 40% checkpoints), and Course 2 readiness calculation (`calculateWordReadiness()`). |
| [`assets/js/app.js`](file:///c:/Users/yudhiar/Downloads/AgenticAI/assets/js/app.js) | **Modify** | Controller / UI Orchestrator | Wires `#nav-group-word` visibility on `switchCourse('word')`, binds Checkpoint 1 & 2 action buttons (`btn-cp-action`), re-syncs checklist checkboxes for Course 2, updates Word navigation badges, and coordinates 1-click clipboard copy triggers. |
| [`tests/word-modules.test.js`](file:///c:/Users/yudhiar/Downloads/AgenticAI/tests/word-modules.test.js) | **Create** | Verification / Regression Suite | Automated test suite validating Course 2 state isolation, checklist updates, checkpoint gate transitions, weighted progress calculation, DOM integrity, and course switcher behavior in headless Node.js. |
| [`tests/index.html`](file:///c:/Users/yudhiar/Downloads/AgenticAI/tests/index.html) | **Modify** | Test Runner / Browser Harness | Registers `tests/word-modules.test.js` and adds required Course 2 DOM mock fixtures for browser-based automated verification. |

---

## 3. Pattern Mapping & Code Excerpts

---

### A. Markup View: [`index.html`](file:///c:/Users/yudhiar/Downloads/AgenticAI/index.html)

#### 1. Role & Data Flow
`index.html` provides the semantic DOM structure. When `switchCourse('word')` is invoked:
- `#container-course-ai` is hidden (`style.display = 'none'`).
- `#container-course-word` is displayed (`style.display = 'block'`).
- In the sidebar, `#nav-group-pretraining` and `#nav-group-liveclass` are hidden, while `#nav-group-word` is displayed.
- The user interacts with step checkboxes (`.checklist-checkbox`), checkpoint buttons (`.btn-cp-action`), code copy buttons (`.code-copy-btn`), and accordion headers (`.module-header`), which trigger state updates and UI feedback.

#### 2. Closest Existing Analogs

##### a. Sidebar Navigation Group Analog: `#nav-group-pretraining` & `#nav-group-liveclass`
*Location in codebase:* [`index.html:L221-L255`](file:///c:/Users/yudhiar/Downloads/AgenticAI/index.html#L221-L255)
```html
<!-- Existing Pre-Training Nav Group Analog -->
<div id="nav-group-pretraining" class="sidebar-nav-group active">
  <nav class="nav-group" aria-label="Navigasi Pendahuluan">
    <div class="nav-group-title">Pendahuluan</div>
    <a href="#sec-target" class="nav-link active">
      <div class="nav-link-content">
        <span class="nav-link-icon">🎯</span>
        <span>Target & Alur Kerja</span>
      </div>
    </a>
    ...
  </nav>
  <nav class="nav-group" aria-label="Navigasi Modul Praktik Mandiri">
    <div class="nav-group-title">Modul Praktik Mandiri</div>
    <a href="#sec-module-1" class="nav-link">
      <div class="nav-link-content">
        <span class="nav-link-icon">🟢</span>
        <span>Modul 1: Node.js & npm</span>
      </div>
      <span class="badge badge-pill badge-neutral" id="badge-nav-m1">0/3</span>
    </a>
    ...
  </nav>
  <nav class="nav-group" aria-label="Navigasi Checkpoint">
    <div class="nav-group-title">Gerbang Checkpoint</div>
    <a href="#sec-checkpoint-1" class="nav-link">
      <div class="nav-link-content">
        <span class="nav-link-icon">📍</span>
        <span>Checkpoint 1: Node.js</span>
      </div>
      <span class="badge badge-pill badge-warning" id="status-nav-cp1">Pending</span>
    </a>
    ...
  </nav>
</div>
```

##### b. Module Card & Accordion Header Analog: `#sec-module-1`
*Location in codebase:* [`index.html:L774-L805`](file:///c:/Users/yudhiar/Downloads/AgenticAI/index.html#L774-L805)
```html
<!-- Existing Module Accordion Analog -->
<section id="sec-module-1" class="content-section">
  <div class="module-card">
    <div class="module-header" role="button" tabindex="0" aria-expanded="true" aria-controls="module-body-1">
      <div class="module-header-main">
        <div class="module-icon-badge">🟢</div>
        <div class="module-title-group">
          <h3>Modul 1: Memeriksa & Menginstal Node.js</h3>
          <p>Memastikan runtime Node.js LTS terpasang pada Windows Anda</p>
        </div>
      </div>
      <div class="module-header-meta">
        <span class="badge badge-pill badge-primary">3 Langkah</span>
        <span class="module-chevron" aria-hidden="true">▼</span>
      </div>
    </div>
    <div id="module-body-1" class="module-body">
      ...
    </div>
  </div>
</section>
```

##### c. Step Checklist Item Analog: `.step-checklist-action`
*Location in codebase:* [`index.html:L819-L823`](file:///c:/Users/yudhiar/Downloads/AgenticAI/index.html#L819-L823)
```html
<!-- Existing Checklist Action Analog -->
<label class="step-checklist-action">
  <input type="checkbox" class="checklist-checkbox" data-task-id="m1-check-node">
  <span class="checklist-label">Langkah A selesai: Perintah <code>node --version</code> menghasilkan versi v24/v22</span>
</label>
```

##### d. Checkpoint Gate Card Analog: `#sec-checkpoint-1`
*Location in codebase:* [`index.html:L1420-L1470`](file:///c:/Users/yudhiar/Downloads/AgenticAI/index.html#L1420-L1470)
```html
<!-- Existing Checkpoint Gate Card Analog -->
<div class="checkpoint-gate-card" id="card-cp-1">
  <div class="checkpoint-header-row">
    <div class="checkpoint-title-wrap">
      <div class="checkpoint-badge-icon">1</div>
      <div>
        <h4 style="font-size: var(--font-size-base); font-weight: var(--font-weight-bold); color: var(--text-primary); margin-bottom: 0.15rem;">
          Verifikasi Checkpoint 1: Node.js Siap
        </h4>
        <span style="font-size: var(--font-size-xs); color: var(--text-muted);">Prasyarat dasar sebelum menjalankan 9Router</span>
      </div>
    </div>
    <span id="status-card-cp1" class="badge badge-pill badge-warning">Pending</span>
  </div>
  ...
  <div class="cp-action-btn-group">
    <button type="button" class="btn btn-success btn-cp-action" data-checkpoint="cp-1" data-status="passed">
      <span>✓</span> Lolos Verifikasi
    </button>
    <button type="button" class="btn btn-outline-danger btn-cp-action" data-checkpoint="cp-1" data-status="failed">
      <span>✕</span> Ada Kendala (Gagal)
    </button>
    <button type="button" class="btn btn-secondary btn-cp-action btn-sm" data-checkpoint="cp-1" data-status="pending">
      <span>↺</span> Reset Status
    </button>
  </div>
</div>
```

##### e. Copy Button & Code Container Analog: `.code-container`
*Location in codebase:* [`index.html:L880-L894`](file:///c:/Users/yudhiar/Downloads/AgenticAI/index.html#L880-L894)
```html
<!-- Existing Copy Button Container Analog -->
<div class="code-container">
  <div class="code-header">
    <div class="code-dots">
      <span class="code-dot red"></span>
      <span class="code-dot yellow"></span>
      <span class="code-dot green"></span>
    </div>
    <span class="code-label">PowerShell</span>
    <button class="code-copy-btn" aria-label="Salin perintah">
      <span>📋 Salin Perintah</span>
    </button>
  </div>
  <pre class="code-content"><code>npm --version</code></pre>
</div>
```

#### 3. Target Implementation Rules for Course 2 (`index.html`)

1. **Sidebar Navigation (`#nav-group-word`)**:
   Insert immediately after `#nav-group-liveclass` (around line 442):
   ```html
   <!-- Group 3: Navigasi Pengolahan Kata Tingkat Lanjut (Course 2) -->
   <div id="nav-group-word" class="sidebar-nav-group" style="display: none;">
     <!-- Sub-Group: Pendahuluan & Standar -->
     <nav class="nav-group" aria-label="Navigasi Dasar & Regulasi">
       <div class="nav-group-title">Dasar & Tata Naskah</div>
       <a href="#sec-word-intro" class="nav-link active">
         <div class="nav-link-content">
           <span class="nav-link-icon">🎯</span>
           <span>Bab I: Pendahuluan & Berkas</span>
         </div>
         <span class="badge badge-pill badge-neutral" id="badge-nav-word-b1">0/4</span>
       </a>
       <a href="#sec-word-standards" class="nav-link">
         <div class="nav-link-content">
           <span class="nav-link-icon">⚖️</span>
           <span>Standar Tata Naskah ASN</span>
         </div>
       </a>
       <a href="#sec-word-shortcuts" class="nav-link">
         <div class="nav-link-content">
           <span class="nav-link-icon">⌨️</span>
           <span>Pintasan Keyboard Word</span>
         </div>
       </a>
     </nav>

     <!-- Sub-Group: Bab II Struktur & Checkpoint 1 -->
     <nav class="nav-group" aria-label="Navigasi Struktur & Otomatisasi">
       <div class="nav-group-title">Bab II: Struktur & TOC</div>
       <a href="#sec-word-module-2" class="nav-link">
         <div class="nav-link-content">
           <span class="nav-link-icon">📑</span>
           <span>Modul Bab II: Styles & TOC</span>
         </div>
         <span class="badge badge-pill badge-neutral" id="badge-nav-word-b2">0/8</span>
       </a>
       <a href="#sec-word-cp-1" class="nav-link">
         <div class="nav-link-content">
           <span class="nav-link-icon">📍</span>
           <span>Checkpoint 1: Bab II</span>
         </div>
         <span class="badge badge-pill badge-warning" id="status-nav-word-cp1">Pending</span>
       </a>
     </nav>

     <!-- Sub-Group: Bab III Tata Letak & Checkpoint 2 -->
     <nav class="nav-group" aria-label="Navigasi Tata Letak & Template">
       <div class="nav-group-title">Bab III: Tata Letak & Template</div>
       <a href="#sec-word-module-3" class="nav-link">
         <div class="nav-link-content">
           <span class="nav-link-icon">📄</span>
           <span>Modul Bab III: Section & Dotx</span>
         </div>
         <span class="badge badge-pill badge-neutral" id="badge-nav-word-b3">0/8</span>
       </a>
       <a href="#sec-word-cp-2" class="nav-link">
         <div class="nav-link-content">
           <span class="nav-link-icon">📍</span>
           <span>Checkpoint 2: Bab III</span>
         </div>
         <span class="badge badge-pill badge-warning" id="status-nav-word-cp2">Pending</span>
       </a>
     </nav>

     <!-- Sub-Group: Diagnosis Masalah -->
     <nav class="nav-group" aria-label="Navigasi Solusi Kendala Dokumen">
       <div class="nav-group-title">Bantuan Kendala</div>
       <a href="#sec-word-diagnosis" class="nav-link">
         <div class="nav-link-content">
           <span class="nav-link-icon">🛠️</span>
           <span>Matriks Diagnosis Dokumen</span>
         </div>
       </a>
     </nav>
   </div>
   ```

2. **Main Content Container (`#container-course-word`)**:
   Replace the placeholder card at line 4496 with full interactive sections:
   - `#sec-word-intro`: Bab I Pendahuluan (TPU, 7 Indikator, Cloud download card `https://t.ppkasn.id/pengolahankatalanjut`, file mapping table: `01_Dokumen_Berantakan.docx`, `02_Dokumen_Panjang_Section.docx`, and 4 checklist items `word-b1-download-pkg`, `word-b1-setup-folder`, `word-b1-inspect-messy`, `word-b1-check-version`).
   - `#sec-word-standards`: Standar Naskah Dinas Pergub DKI Jakarta No. 14/2020 (Margin 4-3-3-3 cm, Bookman Old Style / Arial 12pt spasi 1.5, privacy rules on NIP redaction).
   - `#sec-word-shortcuts`: Visual keyboard shortcut grid (`Ctrl+Alt+1..3`, `Ctrl+A` -> `F9`, `Ctrl+Shift+Enter`, `Alt+Shift+D`, etc.) using `<kbd class="header-search-kbd">` styling.
   - `#sec-word-module-2`: Bab II Modul Accordion (Steps A–H: Heading 1-3 vs Normal, Navigation Pane, Multilevel list numbering, Automatic Table of Contents, Tab leaders, Update page numbers vs entire table, Dynamic Captions & Cross References) with 8 checklist items (`word-b2-apply-h1` through `word-b2-captions-ref`).
   - `#sec-word-cp-1`: Gerbang Checkpoint 1 card (`#card-word-cp-1`) with status badge (`#status-card-word-cp1`), 5 verification criteria, and action buttons (`data-checkpoint="word-cp-1"`).
   - `#sec-word-module-3`: Bab III Modul Accordion (Steps A–H: Section Breaks Next Page vs Continuous, Unlinking `Link to Previous` Header/Footer, Mixed page numbers Roman `i, ii` vs Arabic `1, 2, 3`, Landscape table orientation within Portrait document, Reusable master templates `.dotx`, Developer Tab Content Controls, Document Inspector & Accessibility Checker) with 8 checklist items (`word-b3-section-breaks` through `word-b3-doc-inspection`).
   - `#sec-word-cp-2`: Gerbang Checkpoint 2 card (`#card-word-cp-2`) with status badge (`#status-card-word-cp2`), 5 verification criteria, and action buttons (`data-checkpoint="word-cp-2"`).
   - `#sec-word-diagnosis`: Structural Document Diagnostic Matrix (Gejala Masalah, Penyebab Teknis, dan Solusi 1-Klik / Langkah Perbaikan).

---

### B. State Management: [`assets/js/state.js`](file:///c:/Users/yudhiar/Downloads/AgenticAI/assets/js/state.js)

#### 1. Role & Data Flow
`assets/js/state.js` maintains application persistence.
- When `activeCourse === 'word'`, loads and saves to `learnwith_word_state_v1`.
- Provides fallback defaults for all Course 2 checklist and checkpoint keys.
- Computes progress scoped to Course 2: Checklist tasks = 60%, Checkpoints = 40%.
- Calculates Word course readiness: `ready` (all passed, >=80%), `clinic` (any failed), `pending` (in progress).

#### 2. Closest Existing Analogs

##### a. Default State Object: `DEFAULT_STATE`
*Location in codebase:* [`assets/js/state.js:L29-L117`](file:///c:/Users/yudhiar/Downloads/AgenticAI/assets/js/state.js#L29-L117)
```javascript
// Existing Course 1 Default State Analog
const DEFAULT_STATE = {
  theme: 'light',
  checklists: {
    'prereq-laptop': false,
    ...
  },
  checkpoints: {
    'cp-1': 'pending',
    ...
  },
  participantInfo: { ... },
  activeSection: 'sec-target',
  activeMode: 'pretraining',
  lastUpdated: null
};
```

##### b. State Hydration in `loadState()`
*Location in codebase:* [`assets/js/state.js:L179-L208`](file:///c:/Users/yudhiar/Downloads/AgenticAI/assets/js/state.js#L179-L208)
```javascript
// Existing loadState Analog
loadState() {
  try {
    const storageKey = this.getStorageKey();
    let serialized = (typeof localStorage !== 'undefined') ? localStorage.getItem(storageKey) : null;
    ...
    const parsed = JSON.parse(serialized);
    return {
      ...DEFAULT_STATE,
      ...parsed,
      activeMode,
      checklists: { ...DEFAULT_STATE.checklists, ...(parsed.checklists || {}) },
      checkpoints: { ...DEFAULT_STATE.checkpoints, ...(parsed.checkpoints || {}) },
      participantInfo: { ...DEFAULT_STATE.participantInfo, ...(parsed.participantInfo || {}) }
    };
  } catch (e) {
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
  }
}
```

##### c. Progress Calculation: `calculateProgress()`
*Location in codebase:* [`assets/js/state.js:L340-L372`](file:///c:/Users/yudhiar/Downloads/AgenticAI/assets/js/state.js#L340-L372)
```javascript
// Existing calculateProgress Analog
calculateProgress(mode = null) {
  const checklists = this.state.checklists || {};
  let taskKeys = Object.keys(checklists);
  let cpKeys = Object.keys(this.state.checkpoints || {});

  if (mode === 'pretraining') {
    taskKeys = taskKeys.filter(k => k.startsWith('prereq-') || k.startsWith('m1-') || k.startsWith('m2-') || k.startsWith('m3-') || k.startsWith('m4-'));
    cpKeys = cpKeys.filter(k => ['cp-1', 'cp-2', 'cp-3'].includes(k));
  } else if (mode === 'live-class') {
    ...
  }

  const totalTasks = taskKeys.length;
  const completedTasks = taskKeys.filter(k => checklists[k] === true).length;
  const totalCheckpoints = cpKeys.length;
  const passedCheckpoints = cpKeys.filter(k => (this.state.checkpoints || {})[k] === 'passed').length;

  // Weighted calculation: Checklists = 60%, Checkpoints = 40%
  const taskPercent = totalTasks > 0 ? (completedTasks / totalTasks) * 60 : 0;
  const cpPercent = totalCheckpoints > 0 ? (passedCheckpoints / totalCheckpoints) * 40 : 0;
  const overallPercent = Math.min(100, Math.round(taskPercent + cpPercent));

  return { totalTasks, completedTasks, totalCheckpoints, passedCheckpoints, percentage: overallPercent };
}
```

##### d. Readiness Calculation: `calculateReadiness()`
*Location in codebase:* [`assets/js/state.js:L389-L425`](file:///c:/Users/yudhiar/Downloads/AgenticAI/assets/js/state.js#L389-L425)
```javascript
// Existing calculateReadiness Analog
calculateReadiness() {
  const progress = this.calculateProgress('pretraining');
  const cps = this.state.checkpoints || {};
  const pretrainingCpIds = ['cp-1', 'cp-2', 'cp-3'];
  const cpValues = pretrainingCpIds.map(id => cps[id] || 'pending');
  
  const hasFailure = cpValues.some(v => v === 'failed');
  const allCheckpointsPassed = cpValues.every(v => v === 'passed');
  ...
}
```

#### 3. Target Implementation Rules for Course 2 (`assets/js/state.js`)

1. **Define `WORD_DEFAULT_STATE`**:
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

2. **Course-Discriminating `loadState()` & `resetState()`**:
   ```javascript
   loadState() {
     try {
       const isWord = this.activeCourse === 'word';
       const defaultState = isWord ? WORD_DEFAULT_STATE : DEFAULT_STATE;
       const storageKey = this.getStorageKey();
       let serialized = (typeof localStorage !== 'undefined') ? localStorage.getItem(storageKey) : null;
       if (!serialized && !isWord && typeof localStorage !== 'undefined') {
         serialized = localStorage.getItem(COURSE_CONFIGS.ai.legacyKey);
       }
       if (!serialized) {
         return JSON.parse(JSON.stringify(defaultState));
       }
       const parsed = JSON.parse(serialized);
       const activeMode = (!isWord && (parsed.activeMode === 'live-class' || parsed.activeMode === 'pretraining'))
         ? parsed.activeMode
         : (isWord ? undefined : DEFAULT_STATE.activeMode);

       return {
         ...defaultState,
         ...parsed,
         ...(activeMode ? { activeMode } : {}),
         checklists: { ...defaultState.checklists, ...(parsed.checklists || {}) },
         checkpoints: { ...defaultState.checkpoints, ...(parsed.checkpoints || {}) },
         participantInfo: { ...defaultState.participantInfo, ...(parsed.participantInfo || {}) }
       };
     } catch (e) {
       console.warn('Failed to load state from localStorage:', e);
       return JSON.parse(JSON.stringify(this.activeCourse === 'word' ? WORD_DEFAULT_STATE : DEFAULT_STATE));
     }
   }

   resetState() {
     const defaultState = this.activeCourse === 'word' ? WORD_DEFAULT_STATE : DEFAULT_STATE;
     this.state = JSON.parse(JSON.stringify(defaultState));
     this.saveState();
     this.emit('stateReset', this.state);
   }
   ```

3. **Course-Discriminating `calculateProgress()`**:
   ```javascript
   calculateProgress(mode = null) {
     if (this.activeCourse === 'word') {
       const checklists = this.state.checklists || {};
       const taskKeys = Object.keys(checklists).filter(k => k.startsWith('word-b1-') || k.startsWith('word-b2-') || k.startsWith('word-b3-'));
       const cpKeys = Object.keys(this.state.checkpoints || {}).filter(k => k.startsWith('word-cp-'));

       const totalTasks = taskKeys.length;
       const completedTasks = taskKeys.filter(k => checklists[k] === true).length;
       const totalCheckpoints = cpKeys.length;
       const passedCheckpoints = cpKeys.filter(k => (this.state.checkpoints || {})[k] === 'passed').length;

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
     // ... existing AI progress logic
   }
   ```

4. **Add `calculateWordReadiness()`**:
   ```javascript
   calculateWordReadiness() {
     const progress = this.calculateProgress();
     const cps = this.state.checkpoints || {};
     const cpIds = ['word-cp-1', 'word-cp-2'];
     const cpValues = cpIds.map(id => cps[id] || 'pending');

     const hasFailure = cpValues.some(v => v === 'failed');
     const allPassed = cpValues.every(v => v === 'passed');

     if (hasFailure) {
       return {
         status: 'clinic',
         label: '⚠️ PERLU KONSULTASI / KLINIK',
         badgeClass: 'badge-danger',
         description: 'Terdapat kendala pada verifikasi struktur dokumen atau tata letak section. Periksa kembali panduan perbaikan atau konsultasikan dengan fasilitator.',
         color: 'var(--color-danger)'
       };
     }

     if (allPassed && progress.percentage >= 80) {
       return {
         status: 'ready',
         label: '🎉 DOKUMEN SESUAI STANDAR DINAS',
         badgeClass: 'badge-success',
         description: 'Selamat! Seluruh checklist Bab I–III dan Checkpoint 1 & 2 berhasil diverifikasi. Dokumen Anda memenuhi standar hierarki, penomoran section, dan template ASN!',
         color: 'var(--color-success)'
       };
     }

     return {
       status: 'pending',
       label: '⏳ DALAM PENYUSUNAN PRAKTIK',
       badgeClass: 'badge-warning',
       description: 'Lengkapi checklist praktik Bab I, II, dan III serta verifikasi Checkpoint 1 dan 2 untuk menuntaskan standardisasi dokumen dinas Anda.',
       color: 'var(--color-warning)'
     };
   }
   ```

5. **Update Module Exports**:
   Export `WORD_DEFAULT_STATE` in `module.exports`.

---

### C. Application Controller: [`assets/js/app.js`](file:///c:/Users/yudhiar/Downloads/AgenticAI/assets/js/app.js)

#### 1. Role & Data Flow
`assets/js/app.js` is the central orchestrator:
- Manages course transitions via `switchCourse(courseId)`.
- Updates navigation displays (`#nav-group-word` vs `#nav-group-pretraining`).
- Re-syncs checkbox states and checkpoint UI states upon course changes.
- Updates progress UI badges: `#badge-nav-word-b1`, `#badge-nav-word-b2`, `#badge-nav-word-b3`, `#status-nav-word-cp1`, `#status-nav-word-cp2`.

#### 2. Closest Existing Analogs

##### a. Course Switcher Container Toggling: `switchCourse()`
*Location in codebase:* [`assets/js/app.js:L1580-L1676`](file:///c:/Users/yudhiar/Downloads/AgenticAI/assets/js/app.js#L1580-L1676)
```javascript
// Existing switchCourse Analog
function switchCourse(courseId, updateUrl = true, showNotification = true) {
  const validCourse = (courseId === 'word') ? 'word' : 'ai';
  ...
  const containerAi = document.getElementById('container-course-ai');
  const containerWord = document.getElementById('container-course-word');
  const headerModeSwitcher = document.getElementById('header-mode-switcher');
  const sidebarModeSwitcher = document.getElementById('sidebar-mode-switcher-container');
  const navGroupPretraining = document.getElementById('nav-group-pretraining');
  const navGroupLiveclass = document.getElementById('nav-group-liveclass');

  if (validCourse === 'word') {
    if (containerAi) containerAi.style.display = 'none';
    if (containerWord) containerWord.style.display = 'block';
    if (headerModeSwitcher) headerModeSwitcher.style.display = 'none';
    if (sidebarModeSwitcher) sidebarModeSwitcher.style.display = 'none';
    if (navGroupPretraining) navGroupPretraining.style.display = 'none';
    if (navGroupLiveclass) navGroupLiveclass.style.display = 'none';
  } else { ... }
  ...
}
```

##### b. Checkpoint Card & Badge Handler: `updateCheckpointCardUI()`
*Location in codebase:* [`assets/js/app.js:L551-L581`](file:///c:/Users/yudhiar/Downloads/AgenticAI/assets/js/app.js#L551-L581)
```javascript
// Existing updateCheckpointCardUI Analog
function updateCheckpointCardUI(cpId, status) {
  const card = document.getElementById(`card-${cpId}`);
  const statusBadge = document.getElementById(`status-card-${cpId.replace('-', '')}`);
  
  if (card) {
    card.classList.remove('passed', 'failed');
    if (status === 'passed') card.classList.add('passed');
    else if (status === 'failed') card.classList.add('failed');
    ...
  }

  if (statusBadge) {
    if (status === 'passed') {
      statusBadge.className = 'badge badge-pill badge-success';
      statusBadge.innerText = 'Lolos Verifikasi ✓';
    } else if (status === 'failed') {
      statusBadge.className = 'badge badge-pill badge-danger';
      statusBadge.innerText = 'Ada Kendala ✕';
    } else {
      statusBadge.className = 'badge badge-pill badge-warning';
      statusBadge.innerText = 'Pending';
    }
  }
}
```

##### c. Checklist Checkbox Synchronization: `setupChecklistListeners()`
*Location in codebase:* [`assets/js/app.js:L246-L273`](file:///c:/Users/yudhiar/Downloads/AgenticAI/assets/js/app.js#L246-L273)
```javascript
// Existing setupChecklistListeners Analog
function setupChecklistListeners() {
  const state = window.AppState.getState();
  const checklists = state.checklists || {};

  document.querySelectorAll('.checklist-checkbox[data-task-id]').forEach(checkbox => {
    const taskId = checkbox.getAttribute('data-task-id');
    if (taskId && checklists[taskId] !== undefined) {
      checkbox.checked = checklists[taskId];
      const item = checkbox.closest('.checklist-item, .step-checklist-action');
      if (item) {
        if (checkbox.checked) item.classList.add('completed');
        else item.classList.remove('completed');
      }
    }
    ...
  });
}
```

#### 3. Target Implementation Rules for Course 2 (`assets/js/app.js`)

1. **In `switchCourse(courseId, ...)`**:
   - Reference `const navGroupWord = document.getElementById('nav-group-word');`.
   - When `validCourse === 'word'`:
     - `navGroupWord.style.display = 'block'`.
     - `navGroupWord.classList.add('active')`.
     - Re-sync Course 2 checklist checkboxes and checkpoint cards from `window.AppState.getState()`.
     - Trigger `updateProgressUI()` so that header progress reflects Word course metrics.
   - When `validCourse === 'ai'`:
     - `if (navGroupWord) { navGroupWord.style.display = 'none'; navGroupWord.classList.remove('active'); }`.
     - Restore Course 1 mode switcher and re-sync Course 1 checkboxes and checkpoint cards.

2. **In `setupCheckpointGates()` & `updateCheckpointCardUI()`**:
   - Support both Course 1 (`cp-1`..`cp-9`) and Course 2 (`word-cp-1`, `word-cp-2`).
   - Fix badge selector logic so that both `status-card-cp1` and `status-card-word-cp1` are resolved cleanly:
     ```javascript
     function getStatusBadge(cpId) {
       return document.getElementById(`status-card-${cpId}`)
         || document.getElementById(`status-card-${cpId.replace(/-/g, '')}`)
         || document.getElementById(`status-card-${cpId.replace('-', '')}`);
     }
     ```
   - Update sidebar checkpoint badges: `#status-nav-word-cp1`, `#status-nav-word-cp2`.

3. **In `updateProgressUI()`**:
   - When `AppState.getActiveCourse() === 'word'`:
     - Update `#badge-nav-word-b1` using `window.AppState.getModuleProgress('word-b1-')`.
     - Update `#badge-nav-word-b2` using `window.AppState.getModuleProgress('word-b2-')`.
     - Update `#badge-nav-word-b3` using `window.AppState.getModuleProgress('word-b3-')`.
     - Update `#status-nav-word-cp1` and `#status-nav-word-cp2`.
     - Update `#stat-word-progress-count` if present.

---

### D. Automated Test Suite: [`tests/word-modules.test.js`](file:///c:/Users/yudhiar/Downloads/AgenticAI/tests/word-modules.test.js)

#### 1. Role & Data Flow
`tests/word-modules.test.js` provides comprehensive test coverage for Phase 10:
- Validates state defaults, isolation, and persistence in `learnwith_word_state_v1`.
- Tests checklist toggle operations for Bab I, Bab II, and Bab III.
- Tests Checkpoint 1 and Checkpoint 2 transitions (`pending` -> `passed`, `pending` -> `failed`, reset).
- Tests weighted progress calculation (60% checklists, 40% checkpoints) and zero bleed into Course 1.
- Validates DOM elements, unique IDs, ARIA roles, and course switching behaviors.

#### 2. Closest Existing Analogs
- [`tests/multi-course.test.js`](file:///c:/Users/yudhiar/Downloads/AgenticAI/tests/multi-course.test.js): Mock DOM creation (`createMockElement`), `localStorage` mock, `assert` / `assertEquals` helpers, and course switching tests.
- [`tests/checkpoint-engine.test.js`](file:///c:/Users/yudhiar/Downloads/AgenticAI/tests/checkpoint-engine.test.js): Module checklist verification, checkpoint state updates, and weighted progress asserts.

#### 3. Target Implementation Rules for Course 2 Test Suite

The test suite must contain 5 targeted test suites:
1. **Suite 1: StateManager Course 2 Isolation & Default State**:
   - Verify `WORD_DEFAULT_STATE` contains exactly 20 checklist tasks (4 for Bab I, 8 for Bab II, 8 for Bab III) and 2 checkpoints (`word-cp-1`, `word-cp-2`).
   - Verify switching to `word` loads `learnwith_word_state_v1`.
   - Verify mutating Course 2 state does not pollute `learnwith_ai_state_v1`.
2. **Suite 2: Checkpoint 1 & 2 Gates Workflow**:
   - Verify initial status is `'pending'`.
   - Verify transition to `'passed'` and `'failed'`.
   - Verify reset returns to `'pending'`.
   - Verify persistence in `localStorage`.
3. **Suite 3: Course 2 Weighted Progress & Readiness**:
   - Verify 0% on initial state.
   - Verify completion of all 20 tasks yields 60% progress (with checkpoints pending).
   - Verify passing 1 checkpoint adds 20% (total 80%).
   - Verify passing both checkpoints yields 100%.
   - Verify `calculateWordReadiness()` returns `ready`, `clinic`, or `pending` as expected.
4. **Suite 4: DOM Element & Attribute Integrity**:
   - Verify presence of `#container-course-word`, `#nav-group-word`.
   - Verify all 8 section IDs exist (`#sec-word-intro`, `#sec-word-standards`, `#sec-word-shortcuts`, `#sec-word-module-2`, `#sec-word-cp-1`, `#sec-word-module-3`, `#sec-word-cp-2`, `#sec-word-diagnosis`).
   - Verify checkpoint cards `#card-word-cp-1` and `#card-word-cp-2` contain required `.btn-cp-action` buttons and status badges.
5. **Suite 5: Course Switcher & Navigation Sync**:
   - Verify `switchCourse('word')` toggles `#nav-group-word` to visible and hides Course 1 groups.
   - Verify `switchCourse('ai')` restores Course 1 navigation.

---

### E. Browser Test Runner: [`tests/index.html`](file:///c:/Users/yudhiar/Downloads/AgenticAI/tests/index.html)

#### 1. Role & Data Flow
Hosts the in-browser test runner displaying output in a `<pre id="output">` container.

#### 2. Closest Existing Analogs
*Location in codebase:* [`tests/index.html:L23-L58`](file:///c:/Users/yudhiar/Downloads/AgenticAI/tests/index.html#L23-L58)
```html
<!-- Existing Test Runner Script Tag Analog -->
<div style="display:none;" id="test-dom-fixtures">
  <div id="container-pretraining"></div>
  <div id="container-liveclass"></div>
  <div id="nav-group-pretraining"></div>
  <div id="nav-group-liveclass"></div>
  ...
</div>
...
<script src="multi-course.test.js"></script>
```

#### 3. Target Implementation Rules (`tests/index.html`)
- Add `#container-course-word` and `#nav-group-word` to `#test-dom-fixtures`.
- Append `<script src="word-modules.test.js"></script>` after `multi-course.test.js`.

---

## 4. Architectural Rules & Invariants

### 1. ID Naming Convention Matrix

To prevent DOM collisions with Course 1 elements:

| Component Type | Course 1 Prefix | Course 2 (Phase 10) Prefix | Examples |
|---|---|---|---|
| **Content Section** | `sec-` | `sec-word-` | `sec-word-intro`, `sec-word-standards`, `sec-word-shortcuts`, `sec-word-module-2`, `sec-word-cp-1`, `sec-word-module-3`, `sec-word-cp-2`, `sec-word-diagnosis` |
| **Checklist Task ID** | `prereq-`, `m1-`..`m11-` | `word-b1-`, `word-b2-`, `word-b3-` | `word-b1-download-pkg`, `word-b2-apply-h1`, `word-b3-section-breaks` |
| **Checkpoint ID** | `cp-1`..`cp-9` | `word-cp-1`, `word-cp-2` | `word-cp-1`, `word-cp-2` |
| **Checkpoint Card ID**| `card-cp-1`..`card-cp-9` | `card-word-cp-1`, `card-word-cp-2` | `card-word-cp-1`, `card-word-cp-2` |
| **Card Status Badge** | `status-card-cp1` | `status-card-word-cp1`, `status-card-word-cp2` | `status-card-word-cp1`, `status-card-word-cp2` |
| **Sidebar Nav Badge** | `status-nav-cp1` | `status-nav-word-cp1`, `status-nav-word-cp2` | `status-nav-word-cp1`, `status-nav-word-cp2` |
| **Module Progress Nav**| `badge-nav-m1` | `badge-nav-word-b1`, `badge-nav-word-b2`, `badge-nav-word-b3` | `badge-nav-word-b1`, `badge-nav-word-b2`, `badge-nav-word-b3` |

### 2. State Key & Progress Calculation Invariants

- **Storage Key**: `learnwith_word_state_v1` (strict separation from `learnwith_ai_state_v1`).
- **Checklist Count**: Exactly 20 tasks across Bab I (4), Bab II (8), Bab III (8).
- **Checkpoint Count**: Exactly 2 checkpoints (`word-cp-1`, `word-cp-2`).
- **Weighted Progress Formula**:
  $$\text{Percentage} = \min\left(100, \text{round}\left(\frac{\text{completedTasks}}{20} \times 60 + \frac{\text{passedCheckpoints}}{2} \times 40\right)\right)$$
- **Zero Pollution Invariant**: Modifying any `word-*` key must never alter Course 1 checklist counts or checkpoint statuses.

---

## 5. Anti-Patterns to Avoid

| Anti-Pattern | Why It Breaks | How to Implement Correctly |
|---|---|---|
| **Reusing Course 1 IDs (e.g. `card-cp-1`)** | Collision with Course 1 card breaks `document.getElementById` and button actions. | Prefix all Course 2 elements with `word-` or `sec-word-` (`card-word-cp-1`). |
| **Hardcoding Course 1 defaults in `loadState()`** | Merging Course 2 state with `DEFAULT_STATE` injects `prereq-`, `m1-` keys into Course 2. | Condition default state selection on `this.activeCourse === 'word' ? WORD_DEFAULT_STATE : DEFAULT_STATE`. |
| **Un-namespaced string replace for badges (`cpId.replace('-', '')`)** | `word-cp-1` becomes `wordcp-1` if only the first dash is replaced. | Support explicit badge IDs `status-card-${cpId}` or use robust lookup helper. |
| **Inline event handlers (`onclick="..."`)** | Violates CSP and prevents clean unit testing in headless Node.js. | Use standard event delegation (`.btn-cp-action`, `.checklist-checkbox`, `.code-copy-btn`). |
| **Manual DOM scroll calculations** | Breaks on mobile viewports and inconsistent header offsets. | Rely on existing `IntersectionObserver` spy and native `scrollIntoView({ behavior: 'smooth' })`. |

---

## 6. Verification Commands

To run the automated verification suite during and after implementation:

```powershell
cmd /c "set PATH=C:\nvm4w\nodejs;%PATH% && node tests/word-modules.test.js && node tests/multi-course.test.js"
```
