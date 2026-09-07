# Phase 12: Interactive Knowledge Quiz (Bab V), Rubrik Evaluasi & Laporan Kelulusan BPSDM - Pattern Mapping

**Generated:** 2026-09-07  
**Status:** READY FOR PLANNING  
**Target:** Course 2 Interactive Evaluation (Bab V), 20-Question Knowledge Bank, Self-Reflection Rubric, Multi-Channel Report Exporter, and BPSDM Graduation Certificate  

---

## 1. Executive Summary

Phase 12 completes Milestone v2.0 for Course 2 (**Pengolahan Kata Tingkat Lanjut: Dari Dokumen Berantakan ke Standar Kedinasan Otomatis**). It translates Bab V (*"Refleksi Diri dan Evaluasi"*), Lampiran 1 (*Kunci Jawaban*), Lampiran 3 (*Daftar Periksa Dokumen Final*), and Lampiran 5 (*Matriks Bukti Kompetensi*) of the official BPSDM DKI Jakarta 2026 module into:
1. **Interactive Knowledge Quiz (QUIZ-01, QUIZ-02)**: Exactly 20 multiple-choice questions covering Bab I to IV, instant validation feedback (`.correct` / `.incorrect`), automatic pedagogical explanation disclosure, live score banner (0–100), and 80% passing threshold (16/20 correct).
2. **Self-Reflection & Competency Rubric (QUIZ-03)**: 5 structured reflection prompts from Bab V.A, 6-component competency rubric from Table 5.1, 9-item quality checklist from Lampiran 3, and 6-item portfolio evidence matrix from Lampiran 5.
3. **BPSDM Graduation Report Generator (WORD-RPT-01, WORD-RPT-02)**: Form Laporan Kelulusan Pelatihan Pengolahan Kata summarizing participant identity, Checkpoint 1–3 statuses (`[X]` / `[ ]`), Quiz Score, Portfolio Rubric score, combined final score (Praktik 70% + Pengetahuan 30%), and ASN competency status (*"KOMPETEN (LULUS)"* vs *"PERLU REMEDIASI"*).
4. **Multi-Channel Exporters & Print Certificate (WORD-RPT-02)**: 1-click WhatsApp copy, 1-click Telegram Markdown copy with toast notifications, and official high-fidelity printable BPSDM Certificate slip (`#card-word-bpsdm-certificate`) with Kop Surat Pemprov DKI Jakarta.

This document maps all files to be created and modified, identifies their closest analogs across the codebase, extracts concrete code excerpts with exact line numbers, and details the architectural invariants to preserve.

---

## 2. File Inventory & Classification

| File Path | Action | Role | Data Flow / Architectural Position | Closest Analog |
|---|---|---|---|---|
| [`tests/word-quiz-report.test.js`](file:///c:/Users/yudhiar/Downloads/AgenticAI/tests/word-quiz-report.test.js) | **Create** | Verification / Wave 0 Automated Test Suite | Validates 20-question bank integrity, answer keys, scoring formulas, reflection/rubric state persistence, graduation calculations, multi-channel report text formatting (WhatsApp & Telegram), DOM fixture elements, and strict multi-course state isolation. | [`tests/word-modules.test.js`](file:///c:/Users/yudhiar/Downloads/AgenticAI/tests/word-modules.test.js) & [`tests/troubleshooting-exporter.test.js`](file:///c:/Users/yudhiar/Downloads/AgenticAI/tests/troubleshooting-exporter.test.js) |
| [`assets/js/state.js`](file:///c:/Users/yudhiar/Downloads/AgenticAI/assets/js/state.js) | **Modify** | Model / Reactive State Store | Exports `WORD_QUIZ_QUESTIONS` constant; extends `WORD_DEFAULT_STATE` with `quiz`, `reflections`, and `rubric`; implements `updateQuizAnswer()`, `calculateQuizScore()`, `resetQuiz()`, `updateWordReflection()`, `updateWordRubric()`, and `calculateWordGraduation()`; preserves the 28-task baseline in `calculateProgress()`. | Existing `WORD_DEFAULT_STATE` ([`assets/js/state.js:L119-L168`](file:///c:/Users/yudhiar/Downloads/AgenticAI/assets/js/state.js#L119-L168)) & `calculateWordReadiness()` ([`assets/js/state.js:L548-L584`](file:///c:/Users/yudhiar/Downloads/AgenticAI/assets/js/state.js#L548-L584)) |
| [`assets/js/app.js`](file:///c:/Users/yudhiar/Downloads/AgenticAI/assets/js/app.js) | **Modify** | Controller / UI Orchestrator | Implements `generateWordReportText(format, overrides)`, `setupWordQuiz()`, `setupWordRubrik()`, and `setupWordGraduationReport()`; handles option button clicks, immediate visual feedback, explanation expanders, live score banners, clipboard copy (WhatsApp & Telegram), print trigger, and syncs Bab V navigation badges in `updateWordNavBadges()`. | Existing `generateLiveReportText()` & `setupLiveReport()` ([`assets/js/app.js:L1232-L1375`](file:///c:/Users/yudhiar/Downloads/AgenticAI/assets/js/app.js#L1232-L1375)) |
| [`index.html`](file:///c:/Users/yudhiar/Downloads/AgenticAI/index.html) | **Modify** | View / Semantic DOM Markup | Adds Bab V navigation sub-group into `#nav-group-word` with reactive badges (`#badge-nav-word-quiz`, `#badge-nav-word-rubrik`, `#status-nav-word-report`); adds `#sec-word-quiz` (20 question cards, score counter, reset button), `#sec-word-rubrik` (5 reflection prompts, Table 5.1 rubric table, Lampiran 3 checklist), and `#sec-word-report` (participant inputs, live preview, action buttons, printable BPSDM certificate card) inside `#container-course-word`. | Existing Course 2 markup ([`index.html:L508-L538`](file:///c:/Users/yudhiar/Downloads/AgenticAI/index.html#L508-L538) & [`index.html:L6111-L6288`](file:///c:/Users/yudhiar/Downloads/AgenticAI/index.html#L6111-L6288)) |
| [`assets/css/components.css`](file:///c:/Users/yudhiar/Downloads/AgenticAI/assets/css/components.css) | **Modify** | Presentation / CSS Custom Properties | Defines styles for `.quiz-container`, `.quiz-card`, `.quiz-option-btn` (`.selected`, `.correct`, `.incorrect`), `.quiz-explanation-box`, `.quiz-score-banner`, `.rubric-table`, `.reflection-card`, `.bpsdm-certificate-card`, `.bpsdm-kop`, and `@media print` rules for single-page transcript/certificate output. | Existing Report Workbench ([`assets/css/components.css:L1586-L1640`](file:///c:/Users/yudhiar/Downloads/AgenticAI/assets/css/components.css#L1586-L1640)) & Print Styles ([`assets/css/components.css:L1853-L1920`](file:///c:/Users/yudhiar/Downloads/AgenticAI/assets/css/components.css#L1853-L1920)) |

---

## 3. Pattern Mapping & Concrete Code Excerpts

### A. State Model: [`assets/js/state.js`](file:///c:/Users/yudhiar/Downloads/AgenticAI/assets/js/state.js)

#### 1. Extension of `WORD_DEFAULT_STATE`
Analog from existing `WORD_DEFAULT_STATE` ([`assets/js/state.js:L119-L168`](file:///c:/Users/yudhiar/Downloads/AgenticAI/assets/js/state.js#L119-L168)):
```javascript
// Existing state structure in assets/js/state.js
const WORD_DEFAULT_STATE = {
  theme: 'light',
  checklists: {
    // Bab I (4 tasks), Bab II (8 tasks), Bab III (8 tasks), Bab IV (8 tasks) = Exactly 28 tasks
    'word-b1-download-pkg': false,
    // ...
    'word-b4-compare-combine': false
  },
  checkpoints: {
    'word-cp-1': 'pending', // 'pending' | 'passed' | 'failed'
    'word-cp-2': 'pending',
    'word-cp-3': 'pending'
  },
  participantInfo: {
    name: '',
    nip: '',
    unitKerja: '',
    targetDoc: '',
    reportDate: ''
  },
  // --- Phase 12 Additions ---
  quiz: {
    answers: {},       // e.g. { 1: 'B', 2: 'B', 3: 'C', ... }
    score: 0,          // 0 to 100
    submitted: false,  // true once any option is selected
    passed: false      // true if score >= 80
  },
  reflections: {
    'ref-repetitive': '',
    'ref-challenging': '',
    'ref-template': '',
    'ref-risks': '',
    'ref-collaboration': ''
  },
  rubric: {
    // Lampiran 3: 9 Verification Checklist Items
    'word-chk-headings': false,
    'word-chk-toc': false,
    'word-chk-section-link': false,
    'word-chk-page-num': false,
    'word-chk-mailmerge-valid': false,
    'word-chk-mergefield-clean': false,
    'word-chk-track-decided': false,
    'word-chk-comments-resolved': false,
    'word-chk-sharing-inspected': false,
    // Lampiran 5: 6 Portfolio Artifact Verification
    'word-port-structure': false,
    'word-port-multisection': false,
    'word-port-template': false,
    'word-port-merge': false,
    'word-port-review': false,
    'word-port-qa-log': false
  },
  activeSection: 'sec-word-intro',
  lastUpdated: null
};
```

#### 2. Official 20-Question Knowledge Bank Constant
In `assets/js/state.js`, define `WORD_QUIZ_QUESTIONS` matching Lampiran 1 BPSDM 2026:
```javascript
const WORD_QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "Fungsi utama Heading adalah ...",
    options: {
      A: "mengubah warna halaman",
      B: "membentuk struktur logis dokumen",
      C: "menyisipkan gambar",
      D: "mengunci dokumen"
    },
    correct: "B",
    explanation: "Heading (Heading 1, 2, 3) berfungsi membentuk hierarki dan struktur logis dokumen, memungkinkan pembuatan Daftar Isi otomatis, navigasi melalui Navigation Pane, dan pengindeksan dokumen standar kedinasan."
  },
  // ... Questions 2 through 20 matching Lampiran 1 Table L1.1
  {
    id: 20,
    question: "Dua reviewer mengirim salinan revisi tanpa Track Changes. Fitur paling sesuai untuk merekonsiliasi perubahan adalah ...",
    options: {
      A: "Word Count",
      B: "Compare/Combine",
      C: "Replace All",
      D: "Format Painter"
    },
    correct: "B",
    explanation: "Fitur Compare atau Combine Documents (Review > Compare) secara cerdas membandingkan dua versi dokumen Word terpisah dan menyatukan seluruh perbedaan kata, kalimat, maupun format ke dalam satu naskah baru yang dilengkapi tanda revisi Track Changes."
  }
];
```

#### 3. StateManager Methods for Quiz, Rubric, and Graduation
Analog from existing StateManager pattern in [`assets/js/state.js:L381-L417`](file:///c:/Users/yudhiar/Downloads/AgenticAI/assets/js/state.js#L381-L417):
```javascript
updateQuizAnswer(questionId, selectedOption) {
  if (!this.state.quiz) {
    this.state.quiz = { answers: {}, score: 0, submitted: false, passed: false };
  }
  this.state.quiz.answers[questionId] = selectedOption;
  this.state.quiz.submitted = true;
  this.calculateQuizScore();
  this.saveState();
  this.emit('quizUpdate', this.state.quiz);
}

calculateQuizScore() {
  if (!this.state.quiz || !this.state.quiz.answers) return 0;
  let correctCount = 0;
  WORD_QUIZ_QUESTIONS.forEach(q => {
    if (this.state.quiz.answers[q.id] === q.correct) {
      correctCount++;
    }
  });
  const score = correctCount * 5; // 20 questions * 5 = 100 points
  this.state.quiz.score = score;
  this.state.quiz.passed = (score >= 80);
  return score;
}

resetQuiz() {
  this.state.quiz = { answers: {}, score: 0, submitted: false, passed: false };
  this.saveState();
  this.emit('quizReset', this.state.quiz);
}

updateWordReflection(promptId, text) {
  if (!this.state.reflections) this.state.reflections = {};
  this.state.reflections[promptId] = text;
  this.saveState();
  this.emit('reflectionUpdate', { promptId, text });
}

updateWordRubric(rubricKey, checked) {
  if (!this.state.rubric) this.state.rubric = {};
  this.state.rubric[rubricKey] = !!checked;
  this.saveState();
  this.emit('rubricUpdate', { rubricKey, checked });
}

calculateWordGraduation() {
  const cps = this.state.checkpoints || {};
  const cpIds = ['word-cp-1', 'word-cp-2', 'word-cp-3'];
  const allCpPassed = cpIds.every(id => cps[id] === 'passed');
  const hasCpFailure = cpIds.some(id => cps[id] === 'failed');

  const quizScore = this.state.quiz?.score || 0;
  
  // Calculate Portfolio Rubric score (6 portfolio items, each ~16.67 pts, total 100)
  const rubric = this.state.rubric || {};
  const portKeys = ['word-port-structure', 'word-port-multisection', 'word-port-template', 'word-port-merge', 'word-port-review', 'word-port-qa-log'];
  const completedPortItems = portKeys.filter(k => rubric[k] === true).length;
  const portfolioScore = Math.round((completedPortItems / portKeys.length) * 100);

  // Nilai Akhir = (Praktik Terpadu * 70%) + (Kuis Pengetahuan * 30%)
  const finalScore = Math.round((portfolioScore * 0.7) + (quizScore * 0.3));

  let status = 'pending';
  let label = 'BELUM MEMENUHI SYARAT / PERLU REMEDIASI';
  let badgeClass = 'badge-warning';
  let grade = 'D';

  if (hasCpFailure || finalScore < 75) {
    status = 'remediasi';
    label = 'PERLU REMEDIASI';
    badgeClass = 'badge-danger';
    grade = 'D';
  } else if (allCpPassed && finalScore >= 80 && quizScore >= 80) {
    status = 'lulus';
    label = 'KOMPETEN (LULUS)';
    badgeClass = 'badge-success';
    if (finalScore >= 90) grade = 'Sangat Memuaskan (A)';
    else grade = 'Memuaskan (B)';
  } else if (allCpPassed && finalScore >= 75) {
    status = 'lulus_cukup';
    label = 'KOMPETEN (LULUS CUKUP)';
    badgeClass = 'badge-success';
    grade = 'Cukup (C)';
  }

  return {
    quizScore,
    portfolioScore,
    finalScore,
    status,
    label,
    badgeClass,
    grade,
    allCpPassed
  };
}
```

---

### B. Controller: [`assets/js/app.js`](file:///c:/Users/yudhiar/Downloads/AgenticAI/assets/js/app.js)

#### 1. Multi-Channel Report Generator
Analog from `generateLiveReportText()` in [`assets/js/app.js:L1232-L1307`](file:///c:/Users/yudhiar/Downloads/AgenticAI/assets/js/app.js#L1232-L1307):
```javascript
function generateWordReportText(format = 'whatsapp', overrides = {}) {
  const state = window.AppState ? window.AppState.getState() : {};
  const info = { ...(state.participantInfo || {}), ...overrides.participantInfo };
  const cps = { ...(state.checkpoints || {}), ...overrides.checkpoints };
  const grad = (window.AppState && window.AppState.calculateWordGraduation)
    ? window.AppState.calculateWordGraduation()
    : { finalScore: 0, quizScore: 0, portfolioScore: 0, label: 'DALAM PROSES' };

  const name = overrides.name || info.name || '[Nama Lengkap Pegawai]';
  const nip = overrides.nip || info.nip || '[NIP]';
  const unit = overrides.unitKerja || info.unitKerja || '[SKPD / Unit Kerja]';
  const targetDoc = overrides.targetDoc || info.targetDoc || '[Jenis Naskah Dinas Portofolio]';
  const reportDate = overrides.reportDate || info.reportDate || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  // Checkpoints 1, 2, 3
  const cp1Mark = cps['word-cp-1'] === 'passed' ? '[X]' : '[ ]';
  const cp2Mark = cps['word-cp-2'] === 'passed' ? '[X]' : '[ ]';
  const cp3Mark = cps['word-cp-3'] === 'passed' ? '[X]' : '[ ]';

  const quizScore = overrides.quizScore !== undefined ? overrides.quizScore : grad.quizScore;
  const portScore = overrides.portfolioScore !== undefined ? overrides.portfolioScore : grad.portfolioScore;
  const finalScore = overrides.finalScore !== undefined ? overrides.finalScore : grad.finalScore;
  const statusLabel = overrides.statusLabel || grad.label || 'DALAM PROSES';

  if (format === 'whatsapp') {
    return `*LAPORAN HASIL EVALUASI & KELULUSAN PELATIHAN*
*Pengolahan Kata Tingkat Lanjut — BPSDM DKI Jakarta 2026*

*Data Aparatur Sipil Negara (ASN):*
• Nama: ${name}
• NIP: ${nip}
• Unit Kerja: ${unit}
• Naskah Dinas: ${targetDoc}
• Tanggal Evaluasi: ${reportDate}

*Status Gerbang Checkpoint Praktik:*
${cp1Mark} Checkpoint 1 — Struktur Heading & TOC Otomatis
${cp2Mark} Checkpoint 2 — Section Break & Tata Letak Campuran
${cp3Mark} Checkpoint 3 — Mail Merge & Etika Kolaborasi

*Rincian Hasil Evaluasi:*
• Kuis Pengetahuan Bab V (Bobot 30%): ${quizScore} / 100
• Portofolio Praktik Terpadu (Bobot 70%): ${portScore} / 100
• *Nilai Akhir Kelulusan: ${finalScore} / 100*

*Keputusan Hasil Kelulusan:*
🏆 *${statusLabel}*
_${statusLabel.includes('LULUS') ? 'Memenuhi kriteria kompetensi pengolahan naskah dinas otomatis BPSDM.' : 'Diperlukan pengulangan materi dan penyelesaian perbaikan checkpoint.'}_`;
  }

  // Telegram format (Markdown)
  return `📋 **LAPORAN HASIL EVALUASI & KELULUSAN PELATIHAN**
**Pengolahan Kata Tingkat Lanjut — BPSDM DKI Jakarta 2026**

👤 **Data Aparatur Sipil Negara (ASN):**
- Nama: ${name}
- NIP: \`${nip}\`
- Unit Kerja: ${unit}
- Naskah Dinas: \`${targetDoc}\`
- Tanggal Evaluasi: ${reportDate}

🏁 **Status Gerbang Checkpoint Praktik:**
\`${cp1Mark}\` Checkpoint 1 — Struktur Heading & TOC Otomatis
\`${cp2Mark}\` Checkpoint 2 — Section Break & Tata Letak Campuran
\`${cp3Mark}\` Checkpoint 3 — Mail Merge & Etika Kolaborasi

📊 **Rincian Hasil Evaluasi:**
- Kuis Pengetahuan Bab V (30%): \`${quizScore} / 100\`
- Portofolio Praktik Terpadu (70%): \`${portScore} / 100\`
- **Nilai Akhir Kelulusan:** \`${finalScore} / 100\`

🎯 **Keputusan Hasil Kelulusan:**
**${statusLabel}**`;
}
```

#### 2. Quiz Controller & Instant Visual Feedback
Analog from setup controllers in `assets/js/app.js`:
```javascript
function setupWordQuiz() {
  const container = document.getElementById('sec-word-quiz');
  if (!container) return;

  const scoreBanner = document.getElementById('word-quiz-score-banner');
  const resetBtn = document.getElementById('btn-reset-word-quiz');

  function renderQuizUI() {
    const quizState = (window.AppState && window.AppState.getState().quiz) || { answers: {}, score: 0 };
    
    // For each question card in DOM
    WORD_QUIZ_QUESTIONS.forEach(q => {
      const card = document.getElementById(`quiz-card-${q.id}`);
      if (!card) return;
      
      const explBox = card.querySelector('.quiz-explanation-box');
      const selectedOption = quizState.answers[q.id];

      const optionBtns = card.querySelectorAll('.quiz-option-btn');
      optionBtns.forEach(btn => {
        const optKey = btn.getAttribute('data-option');
        btn.classList.remove('selected', 'correct', 'incorrect');
        
        if (selectedOption) {
          if (optKey === selectedOption) {
            btn.classList.add('selected');
            if (selectedOption === q.correct) {
              btn.classList.add('correct');
            } else {
              btn.classList.add('incorrect');
            }
          }
          // Highlight correct answer if user got it wrong
          if (optKey === q.correct && selectedOption !== q.correct) {
            btn.classList.add('correct');
          }
        }
      });

      if (explBox) {
        explBox.style.display = selectedOption ? 'block' : 'none';
      }
    });

    if (scoreBanner && window.AppState) {
      const grad = window.AppState.calculateWordGraduation();
      const answeredCount = Object.keys(quizState.answers || {}).length;
      scoreBanner.innerHTML = `
        <div class="score-banner-content">
          <div class="score-val">${quizState.score} / 100</div>
          <div class="score-meta">${answeredCount}/20 Terjawab — Status Kuis: <strong>${quizState.passed ? 'LULUS (≥ 80%)' : 'BELUM LULUS'}</strong></div>
        </div>
      `;
    }
  }

  container.addEventListener('click', (e) => {
    const btn = e.target.closest('.quiz-option-btn');
    if (!btn) return;
    const qId = parseInt(btn.getAttribute('data-question-id'), 10);
    const optKey = btn.getAttribute('data-option');
    if (window.AppState) {
      window.AppState.updateQuizAnswer(qId, optKey);
      renderQuizUI();
    }
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Reset seluruh jawaban kuis evaluasi Bab V?')) {
        if (window.AppState) {
          window.AppState.resetQuiz();
          renderQuizUI();
        }
      }
    });
  }

  renderQuizUI();
}
```

#### 3. Report Exporter Controller & Clipboard/Print Handlers
Analog from `setupLiveReport()` in [`assets/js/app.js:L1311-L1375`](file:///c:/Users/yudhiar/Downloads/AgenticAI/assets/js/app.js#L1311-L1375):
```javascript
function setupWordGraduationReport() {
  const nameInput = document.getElementById('input-word-report-name');
  const nipInput = document.getElementById('input-word-report-nip');
  const unitInput = document.getElementById('input-word-report-unit');
  const docInput = document.getElementById('input-word-report-doc');
  const previewBox = document.getElementById('word-report-output-preview');
  const copyWaBtn = document.getElementById('btn-copy-word-report-wa');
  const copyTgBtn = document.getElementById('btn-copy-word-report-tg');
  const printBtn = document.getElementById('btn-print-word-report');

  if (!previewBox) return;

  function updatePreview() {
    const overrides = {
      name: nameInput ? nameInput.value.trim() : '',
      nip: nipInput ? nipInput.value.trim() : '',
      unitKerja: unitInput ? unitInput.value.trim() : '',
      targetDoc: docInput ? docInput.value.trim() : ''
    };

    const text = generateWordReportText('whatsapp', overrides);
    previewBox.innerText = text;

    // Update print certificate slip values
    const certName = document.getElementById('cert-word-name');
    const certNip = document.getElementById('cert-word-nip');
    const certUnit = document.getElementById('cert-word-unit');
    const certDoc = document.getElementById('cert-word-doc');
    const certScore = document.getElementById('cert-word-final-score');
    const certVerdict = document.getElementById('cert-word-verdict');

    if (certName) certName.innerText = overrides.name || '-';
    if (certNip) certNip.innerText = overrides.nip || '-';
    if (certUnit) certUnit.innerText = overrides.unitKerja || '-';
    if (certDoc) certDoc.innerText = overrides.targetDoc || '-';

    if (window.AppState) {
      const grad = window.AppState.calculateWordGraduation();
      if (certScore) certScore.innerText = `${grad.finalScore} / 100 (${grad.grade})`;
      if (certVerdict) certVerdict.innerText = grad.label;
    }
  }

  [nameInput, nipInput, unitInput, docInput].forEach(inp => {
    if (inp) {
      inp.addEventListener('input', (e) => {
        const field = inp.getAttribute('data-field');
        if (window.AppState && field) {
          window.AppState.updateParticipantInfo(field, e.target.value);
        }
        updatePreview();
      });
    }
  });

  if (copyWaBtn) {
    copyWaBtn.addEventListener('click', () => {
      const text = generateWordReportText('whatsapp');
      navigator.clipboard.writeText(text).then(() => {
        showToast('Laporan kelulusan WhatsApp berhasil disalin! 📲', 'success', 3000);
      }).catch(() => {
        // execCommand fallback
      });
    });
  }

  if (copyTgBtn) {
    copyTgBtn.addEventListener('click', () => {
      const text = generateWordReportText('telegram');
      navigator.clipboard.writeText(text).then(() => {
        showToast('Format Markdown Telegram berhasil disalin! ✈️', 'success', 3000);
      }).catch(() => {
        // execCommand fallback
      });
    });
  }

  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  updatePreview();
}
```

---

### C. Markup: [`index.html`](file:///c:/Users/yudhiar/Downloads/AgenticAI/index.html)

#### 1. Sidebar Nav Group Insertion inside `#nav-group-word`
Analog from existing sub-groups in [`index.html:L508-L538`](file:///c:/Users/yudhiar/Downloads/AgenticAI/index.html#L508-L538):
```html
<!-- Sub-Group: Bab V Evaluasi & Kelulusan (Phase 12) -->
<nav class="nav-group" aria-label="Navigasi Evaluasi & Kelulusan">
  <div class="nav-group-title">Bab V: Evaluasi & Kelulusan</div>
  <a href="#sec-word-quiz" class="nav-link">
    <div class="nav-link-content">
      <span class="nav-link-icon">📝</span>
      <span>Kuis Pengetahuan (20 Soal)</span>
    </div>
    <span class="badge badge-pill badge-neutral" id="badge-nav-word-quiz">0/20</span>
  </a>
  <a href="#sec-word-rubrik" class="nav-link">
    <div class="nav-link-content">
      <span class="nav-link-icon">📊</span>
      <span>Refleksi & Rubrik Praktik</span>
    </div>
    <span class="badge badge-pill badge-neutral" id="badge-nav-word-rubrik">0/6</span>
  </a>
  <a href="#sec-word-report" class="nav-link">
    <div class="nav-link-content">
      <span class="nav-link-icon">🎓</span>
      <span>Laporan & Transkrip BPSDM</span>
    </div>
    <span class="badge badge-pill badge-warning" id="status-nav-word-report">Pending</span>
  </a>
</nav>
```

#### 2. Section `#sec-word-quiz` (20 Question Cards)
Placed inside `#container-course-word` after `#sec-word-diagnosis`:
```html
<section id="sec-word-quiz" class="content-section">
  <div class="section-header">
    <div class="section-title-wrap">
      <div class="section-badge-icon" style="background: rgba(59, 130, 246, 0.15); color: #3b82f6;">📝</div>
      <div>
        <h3 class="section-title">Kuis Evaluasi Pengetahuan (Bab V.B)</h3>
        <p class="section-desc">20 butir soal pilihan ganda standar BPSDM DKI Jakarta 2026 mencakup Styles, Section, Mail Merge, dan Review Kolaboratif.</p>
      </div>
    </div>
    <div id="word-quiz-score-banner" class="quiz-score-banner"></div>
  </div>

  <div class="quiz-container" id="word-quiz-cards-container">
    <!-- Card Soal 1 -->
    <article class="card quiz-card" id="quiz-card-1">
      <div class="card-header">
        <span class="badge badge-pill badge-primary">Soal #1</span>
        <h4 class="quiz-question-text">Fungsi utama Heading adalah ...</h4>
      </div>
      <div class="card-body">
        <div class="quiz-options-grid">
          <button type="button" class="quiz-option-btn" data-question-id="1" data-option="A">A. mengubah warna halaman</button>
          <button type="button" class="quiz-option-btn" data-question-id="1" data-option="B">B. membentuk struktur logis dokumen</button>
          <button type="button" class="quiz-option-btn" data-question-id="1" data-option="C">C. menyisipkan gambar</button>
          <button type="button" class="quiz-option-btn" data-question-id="1" data-option="D">D. mengunci dokumen</button>
        </div>
        <div class="quiz-explanation-box" style="display: none;">
          <strong>💡 Pembahasan Resmi (Lampiran 1 BPSDM):</strong>
          <p>Heading (Heading 1, 2, 3) berfungsi membentuk hierarki dan struktur logis dokumen, memungkinkan pembuatan Daftar Isi otomatis, navigasi melalui Navigation Pane, dan pengindeksan dokumen standar kedinasan.</p>
        </div>
      </div>
    </article>
    <!-- Repeat for Soal 2 through 20 -->
  </div>

  <div class="quiz-footer-actions">
    <button type="button" class="btn btn-outline-danger" id="btn-reset-word-quiz">↺ Reset Jawaban Kuis</button>
  </div>
</section>
```

#### 3. Section `#sec-word-rubrik` (Refleksi Diri, Rubrik & Lampiran 3 Checklist)
```html
<section id="sec-word-rubrik" class="content-section">
  <div class="section-header">
    <div class="section-title-wrap">
      <div class="section-badge-icon" style="background: rgba(16, 185, 129, 0.15); color: #10b981;">📊</div>
      <div>
        <h3 class="section-title">Refleksi Diri & Rubrik Asesmen Praktik ASN</h3>
        <p class="section-desc">Instrumen evaluasi mandiri (Bab V.A), bobot kompetensi (Tabel 5.1), dan daftar periksa kualitas naskah dinas (Lampiran 3 & 5).</p>
      </div>
    </div>
  </div>

  <!-- 5 Reflection Prompts with textareas #input-word-ref-1 to #input-word-ref-5 -->
  <!-- Table 5.1 Rubric Summary -->
  <!-- Lampiran 3: 9-Item Document Quality Checklist -->
  <!-- Lampiran 5: 6-Item Portfolio Artifact Checklist -->
</section>
```

#### 4. Section `#sec-word-report` (Laporan Kelulusan & Printable Certificate)
Analog from `#sec-live-report` in `index.html`:
```html
<section id="sec-word-report" class="content-section">
  <!-- Participant Form, Preview, Multi-Channel Buttons -->
  <div class="report-workbench">
    <div class="report-grid">
      <div class="report-form-pane">
        <input type="text" id="input-word-report-name" data-field="name" class="form-input" placeholder="Nama Lengkap & Gelar">
        <input type="text" id="input-word-report-nip" data-field="nip" class="form-input" placeholder="NIP (18 Digit)">
        <input type="text" id="input-word-report-unit" data-field="unitKerja" class="form-input" placeholder="Unit Kerja / SKPD">
        <input type="text" id="input-word-report-doc" data-field="targetDoc" class="form-input" placeholder="Naskah Dinas Portofolio">
      </div>
      <div class="report-preview-pane">
        <div class="report-preview-box" id="word-report-output-preview"></div>
        <div class="report-btn-group">
          <button type="button" class="btn btn-primary" id="btn-copy-word-report-wa">📲 Salin Format WhatsApp</button>
          <button type="button" class="btn btn-info" id="btn-copy-word-report-tg">✈️ Salin Format Telegram</button>
          <button type="button" class="btn btn-outline" id="btn-print-word-report">🖨️ Cetak / Simpan PDF Transkrip</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Official Printable Certificate Slip (Rendered on Print) -->
  <div class="bpsdm-certificate-card" id="card-word-bpsdm-certificate">
    <div class="bpsdm-kop">
      <div class="bpsdm-kop-text">
        <h3>PEMERINTAH PROVINSI DAERAH KHUSUS IBUKOTA JAKARTA</h3>
        <h4>BADAN PENGEMBANGAN SUMBER DAYA MANUSIA</h4>
        <p>Jl. KH. Abdul Wahab, Duren Sawit, Jakarta Timur | Telp: (021) 8615460</p>
      </div>
    </div>
    <div class="bpsdm-cert-divider"></div>
    <h3 class="bpsdm-cert-title">SURAT KETERANGAN HASIL EVALUASI KOMPETENSI TEKNIS</h3>
    <!-- Participant details, score breakdown, and signature block -->
  </div>
</section>
```

---

### D. CSS Styling & `@media print`: [`assets/css/components.css`](file:///c:/Users/yudhiar/Downloads/AgenticAI/assets/css/components.css)

#### 1. Interactive Quiz Option Styling
Analog from button states in `assets/css/components.css`:
```css
.quiz-options-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.65rem;
  margin: 1rem 0;
}

.quiz-option-btn {
  display: flex;
  align-items: center;
  text-align: left;
  padding: 0.85rem 1.15rem;
  background: var(--bg-surface-elevated);
  border: 1.5px solid var(--border-subtle);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all 0.2s ease;
}

.quiz-option-btn:hover {
  border-color: var(--color-primary);
  background: var(--bg-surface-hover);
}

.quiz-option-btn.selected {
  border-color: var(--color-primary);
  background: rgba(59, 130, 246, 0.1);
  font-weight: 600;
}

.quiz-option-btn.correct {
  border-color: #10b981 !important;
  background: rgba(16, 185, 129, 0.15) !important;
  color: #065f46 !important;
}

.quiz-option-btn.incorrect {
  border-color: #ef4444 !important;
  background: rgba(239, 68, 68, 0.15) !important;
  color: #991b1b !important;
}

.quiz-explanation-box {
  background: var(--bg-surface-subtle);
  border-left: 4px solid var(--color-primary);
  padding: 1rem 1.25rem;
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
  margin-top: 0.75rem;
  font-size: var(--font-size-xs);
  line-height: 1.6;
}
```

#### 2. Official Print Isolation for BPSDM Certificate Slip
Analog from `@media print` in [`assets/css/components.css:L1853-L1920`](file:///c:/Users/yudhiar/Downloads/AgenticAI/assets/css/components.css#L1853-L1920):
```css
@media print {
  /* Hide interactive app elements during print */
  .app-header,
  .app-sidebar,
  .report-form-pane,
  .report-preview-pane,
  .report-btn-group,
  .quiz-container,
  .reflection-grid,
  .quiz-footer-actions,
  #sec-word-intro,
  #sec-word-standards,
  #sec-word-shortcuts,
  #sec-word-module-2,
  #sec-word-cp-1,
  #sec-word-module-3,
  #sec-word-cp-2,
  #sec-word-module-4,
  #sec-word-cp-3,
  #sec-word-diagnosis,
  #sec-word-quiz,
  #sec-word-rubrik {
    display: none !important;
  }

  /* Make Certificate Slip the clean printable target */
  #sec-word-report {
    display: block !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  .bpsdm-certificate-card {
    display: block !important;
    width: 100% !important;
    border: none !important;
    box-shadow: none !important;
    padding: 0 !important;
    page-break-inside: avoid;
    break-inside: avoid;
  }
}
```

---

## 4. Architectural Invariants to Maintain

1. **Strict 28-Task Baseline Invariant**:
   - `calculateProgress()` for Course 2 MUST ONLY count tasks starting with `word-b1-`, `word-b2-`, `word-b3-`, and `word-b4-` (exactly 28 tasks).
   - Reflection inputs are kept in `state.reflections` and rubric checklist items are kept in `state.rubric`. Under no circumstances should rubric items be added to `state.checklists` with matching prefixes, which would break existing regression tests in `tests/word-modules.test.js`.
2. **Strict Multi-Course State Isolation**:
   - All Phase 12 state (quiz answers, score, reflection answers, rubric checks, participant identity) lives solely inside `learnwith_word_state_v1`.
   - `learnwith_ai_state_v1` must never receive any Course 2 keys or mutations.
3. **Deterministic Question Bank Ordering**:
   - The 20 multiple-choice questions must maintain stable IDs 1 through 20 matching Lampiran 1 Table L1.1 of the physical BPSDM workbook. No runtime shuffling.
4. **Passing Threshold Alignment**:
   - Quiz passing score is exactly 80% (16/20 correct = 80/100).
   - Module competency requires all Checkpoints 1–3 passed, Quiz Score ≥ 80, and Final Score ≥ 80 (with minimum passing grade ≥ 75 marked as Cukup).
5. **Zero External Runtime Dependencies**:
   - Pure client-side vanilla JavaScript and native browser APIs (`navigator.clipboard.writeText`, `window.print()`).

---

## 5. Verification Command Traceability

- **Wave 0 Test Runner**:
  ```pwsh
  cmd.exe /c "set PATH=C:\nvm4w\nodejs;%PATH% && node tests/word-quiz-report.test.js"
  ```
- **Full Milestone Regression Suite**:
  ```pwsh
  cmd.exe /c "set PATH=C:\nvm4w\nodejs;%PATH% && node tests/word-quiz-report.test.js && node tests/word-modules.test.js && node tests/multi-course.test.js && node tests/checkpoint-engine.test.js"
  ```
