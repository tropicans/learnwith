# Phase 11: Interactive Modules Bab IV (Mail Merge, Track Changes & Kolaborasi Dokumen) - Pattern Mapping

**Generated:** 2026-09-07  
**Status:** READY FOR PLANNING  
**Target:** Course 2 Interactive Guides (Bab IV), Checkpoint Gate 3, Scoped State & Progress, Mail Merge Formulas & Review Cheatsheets  

---

## 1. Executive Summary

Phase 11 populates Course 2 (**Pengolahan Kata Tingkat Lanjut: Dari Dokumen Berantakan ke Standar Kedinasan Otomatis**) with the comprehensive automation and collaboration curriculum from Bab IV of the official BPSDM module (by Yudhi Ardinal 2026):
1. **Mail Merge Automation**: Surat massal, label 103 Tom & Jerry, aturan kondisional IF-THEN-ELSE, filter penerima, dan ekspor dokumen.
2. **Reviewing Tools**: Track Changes, markup view modes, comment resolution, password-protected lock tracking.
3. **Compare & Combine**: Perbandingan naskah dinas versi asli vs revisi, penggabungan komentar tim penelaah.
4. **Cloud Collaboration & Document Hygiene**: Co-authoring OneDrive/SharePoint, izin tautan, riwayat versi, dan pembersihan metadata via Document Inspector.
5. **Gerbang Checkpoint 3**: Verifikasi 5 kriteria otomatisasi dan kolaborasi.

This document maps all files to be modified and establishes structural code patterns directly from Phase 10 analogs to prevent regressions.

---

## 2. File Inventory & Classification

| File Path | Action | Role | Data Flow / Architectural Position |
|---|---|---|---|
| [`assets/js/state.js`](file:///c:/Users/yudhiar/Downloads/AgenticAI/assets/js/state.js) | **Modify** | Model / Reactive State Store | Extends `WORD_DEFAULT_STATE` with 8 Bab IV checklist tasks (`word-b4-*`), adds `word-cp-3` checkpoint, updates `calculateProgress()` to filter `word-b4-`, and updates `calculateWordReadiness()` to check all 3 checkpoints (`word-cp-1`, `word-cp-2`, `word-cp-3`). |
| [`tests/word-modules.test.js`](file:///c:/Users/yudhiar/Downloads/AgenticAI/tests/word-modules.test.js) | **Modify** | Verification / Regression Suite | Expands automated test assertions for 28 tasks, 3 checkpoints, Checkpoint 3 transitions, readiness evaluations, and DOM mock fixtures. |
| [`index.html`](file:///c:/Users/yudhiar/Downloads/AgenticAI/index.html) | **Modify** | View / Semantic DOM Markup | Adds Bab IV sub-group to `#nav-group-word` (nav links, badges `#badge-nav-word-b4`, `#status-nav-word-cp3`), adds `#sec-word-module-4` (accordion with Steps A–H and 8 checkboxes), and adds `#sec-word-cp-3` (Checkpoint 3 gate card `#card-word-cp-3`, status `#status-card-word-cp3`, and action buttons). |
| [`assets/js/app.js`](file:///c:/Users/yudhiar/Downloads/AgenticAI/assets/js/app.js) | **Modify** | Controller / UI Orchestrator | Extends checkpoint event binding to include `word-cp-3`, updates Course 2 navigation badge updater to handle Bab IV badge and Checkpoint 3 status badge, and integrates smooth scroll spy. |
| [`assets/js/search.js`](file:///c:/Users/yudhiar/Downloads/AgenticAI/assets/js/search.js) | **Modify** | Real-Time Search Engine | Verifies search indexer properly indexes `#sec-word-module-4` and `#sec-word-cp-3` when Course 2 is active. |

---

## 3. Pattern Mapping & Code Excerpts

### A. State Model: [`assets/js/state.js`](file:///c:/Users/yudhiar/Downloads/AgenticAI/assets/js/state.js)

#### 1. Checklist and Checkpoint Keys
Analog from Phase 10 (`assets/js/state.js:L119-L158`):
```javascript
// Bab IV (8 tasks)
'word-b4-prepare-source': false,
'word-b4-setup-mailmerge': false,
'word-b4-insert-fields': false,
'word-b4-merge-rules': false,
'word-b4-preview-finish': false,
'word-b4-track-changes': false,
'word-b4-comments-resolve': false,
'word-b4-compare-combine': false

// Checkpoints
checkpoints: {
  'word-cp-1': 'pending',
  'word-cp-2': 'pending',
  'word-cp-3': 'pending'
}
```

#### 2. Progress Calculation Extension
Analog from `assets/js/state.js:L386-L399`:
```javascript
if (this.activeCourse === 'word') {
  const taskKeys = Object.keys(checklists).filter(k => 
    k.startsWith('word-b1-') || 
    k.startsWith('word-b2-') || 
    k.startsWith('word-b3-') || 
    k.startsWith('word-b4-')
  );
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
```

#### 3. Readiness Calculation Extension
Analog from `assets/js/state.js:L538-L574`:
```javascript
calculateWordReadiness() {
  const progress = this.calculateProgress();
  const cps = this.state.checkpoints || {};
  const cpIds = ['word-cp-1', 'word-cp-2', 'word-cp-3'];
  const cpValues = cpIds.map(id => cps[id] || 'pending');

  const hasFailure = cpValues.some(v => v === 'failed');
  const allPassed = cpValues.every(v => v === 'passed');

  if (hasFailure) {
    return {
      status: 'clinic',
      label: '⚠️ PERLU KONSULTASI / KLINIK',
      badgeClass: 'badge-danger',
      description: 'Terdapat kendala pada verifikasi struktur dokumen, section, atau otomatisasi Mail Merge & Review. Periksa kembali panduan perbaikan atau konsultasikan dengan fasilitator.',
      color: 'var(--color-danger)'
    };
  }

  if (allPassed && progress.percentage >= 80) {
    return {
      status: 'ready',
      label: '🎉 DOKUMEN SESUAI STANDAR DINAS',
      badgeClass: 'badge-success',
      description: 'Selamat! Seluruh checklist Bab I–IV dan Checkpoint 1, 2, & 3 berhasil diverifikasi. Dokumen Anda memenuhi standar hierarki, tata letak, otomatisasi surat massal, dan etika kolaborasi ASN!',
      color: 'var(--color-success)'
    };
  }

  return {
    status: 'pending',
    label: '⏳ DALAM PENYUSUNAN PRAKTIK',
    badgeClass: 'badge-warning',
    description: 'Lengkapi checklist praktik Bab I s/d IV serta verifikasi Checkpoint 1, 2, dan 3 untuk menuntaskan standardisasi dokumen dinas Anda.',
    color: 'var(--color-warning)'
  };
}
```

---

### B. Controller: [`assets/js/app.js`](file:///c:/Users/yudhiar\Downloads\AgenticAI\assets\js\app.js)

#### 1. Checkpoint Event Binding
Analog from `assets/js/app.js:L233-L245`:
```javascript
['word-cp-1', 'word-cp-2', 'word-cp-3'].forEach((cpId) => {
  const card = document.getElementById(`card-${cpId}`);
  if (!card) return;
  // wire action buttons
});
```

#### 2. Word Navigation Badge Updater
Analog from `assets/js/app.js:L316-L352`:
```javascript
const b4Badge = document.getElementById('badge-nav-word-b4');
if (b4Badge) {
  const b4Prog = stateManager.getModuleProgress('word-b4-');
  b4Badge.textContent = `${b4Prog.completed}/${b4Prog.total}`;
  b4Badge.className = `badge badge-pill ${b4Prog.completed === b4Prog.total && b4Prog.total > 0 ? 'badge-success' : 'badge-neutral'}`;
}

const cp3NavBadge = document.getElementById('status-nav-word-cp3');
if (cp3NavBadge) {
  const st = stateManager.getCheckpointStatus('word-cp-3');
  cp3NavBadge.textContent = st.charAt(0).toUpperCase() + st.slice(1);
  cp3NavBadge.className = `badge badge-pill ${st === 'passed' ? 'badge-success' : st === 'failed' ? 'badge-danger' : 'badge-warning'}`;
}
```

---

### C. Markup: [`index.html`](file:///c:/Users/yudhiar/Downloads/AgenticAI/index.html)

#### 1. Sidebar Nav Group Insertion
Added before `<nav class="nav-group" aria-label="Navigasi Solusi Kendala Dokumen">` in `#nav-group-word`:
```html
<!-- Sub-Group: Bab IV Otomatisasi & Checkpoint 3 -->
<nav class="nav-group" aria-label="Navigasi Otomatisasi & Kolaborasi">
  <div class="nav-group-title">Bab IV: Mail Merge & Kolaborasi</div>
  <a href="#sec-word-module-4" class="nav-link">
    <div class="nav-link-content">
      <span class="nav-link-icon">✉️</span>
      <span>Modul Bab IV: Merge & Review</span>
    </div>
    <span class="badge badge-pill badge-neutral" id="badge-nav-word-b4">0/8</span>
  </a>
  <a href="#sec-word-cp-3" class="nav-link">
    <div class="nav-link-content">
      <span class="nav-link-icon">📍</span>
      <span>Checkpoint 3: Bab IV</span>
    </div>
    <span class="badge badge-pill badge-warning" id="status-nav-word-cp3">Pending</span>
  </a>
</nav>
```

#### 2. Module 4 Accordion & Checkpoint 3 Card Insertion
Added directly after `#sec-word-cp-2` and before `#sec-word-diagnosis` inside `#container-course-word`:
- `#sec-word-module-4`: Bab IV Otomatisasi Dokumen & Kolaborasi. 8 steps (A to H) covering:
  - Step A: Persiapan Database Excel & Pembersihan Karakter
  - Step B: Penautan Sumber Data Mailings & Recipients
  - Step C: Penyisipan Merge Fields & Format Numerik/Tanggal
  - Step D: Aturan Logika Kondisional (Rules: If...Then...Else)
  - Step E: Pencetakan Label Massal (Next Record Rule 103)
  - Step F: Pelacakan Perubahan (Track Changes & Lock Tracking)
  - Step G: Kolaborasi Komentar & Manajemen Thread Review
  - Step H: Perbandingan Dokumen (Compare/Combine) & Pembersihan Metadata
- `#sec-word-cp-3`: Gerbang Checkpoint 3 (Otomatisasi & Kolaborasi Dokumen).
  - 5 verification criteria
  - Status card with action buttons (`btn-word-cp-3-passed`, `btn-word-cp-3-failed`, `btn-word-cp-3-pending`).

---

## 4. Architectural Invariants to Maintain

1. **Zero Impact on Course 1**: Course 1 keys, checkpoints (`cp-1`..`cp-9`), and containers remain untouched.
2. **Deterministic IDs**: All new IDs prefix with `word-b4-`, `sec-word-module-4`, `sec-word-cp-3`, `card-word-cp-3`, `status-card-word-cp3`.
3. **Consistent Progress Weighting**: Checklists count for 60%, Checkpoints count for 40%.
4. **100% Offline Compatibility**: No external CDN scripts or stylesheet dependencies.
