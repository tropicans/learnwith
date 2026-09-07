# Phase 12: Interactive Knowledge Quiz (Bab V), Rubrik Evaluasi & Laporan Kelulusan BPSDM - Research
**Researched:** 2026-09-07
**Domain:** Word Processing Evaluation, Automated Assessment Engine, Competency Rubric, Multi-Channel Report Exporter, BPSDM DKI Jakarta Certification Standards
**Confidence:** HIGH

---

## Summary

Phase 12 is the capstone phase of Milestone v2.0 for Course 2 (**Pengolahan Kata Tingkat Lanjut: Dari Dokumen Berantakan ke Standar Kedinasan Otomatis**). It delivers the comprehensive interactive evaluation, self-reflection rubric, and official graduation report exporter, fulfilling requirements **QUIZ-01**, **QUIZ-02**, **QUIZ-03**, **WORD-RPT-01**, and **WORD-RPT-02**.

This phase operationalizes **Bab V (*"Refleksi Diri dan Evaluasi"*)**, **Lampiran 1 (Kunci Jawaban)**, **Lampiran 3 (Daftar Periksa Dokumen Final)**, and **Lampiran 5 (Matriks Bukti Kompetensi)** from the authoritative BPSDM 2026 module by Yudhi Ardinal:
1. **Interactive Knowledge Evaluation Quiz (QUIZ-01 & QUIZ-02)**: Exactly 20 multiple-choice questions covering Bab I to IV (Styles, TOC, Section Breaks, Unlink Header, Page Numbers, Mail Merge, Track Changes, Compare/Combine, Cloud Governance). Features immediate answer validation, instant pedagogical explanations in Indonesian, dynamic scoring (0–100), and a passing threshold of 80% (16/20 correct).
2. **Self-Reflection & Competency Rubric (QUIZ-03)**:
   - 5 structured self-reflection prompts from Bab V.A assessing repetitive workload reduction, challenging areas, template candidacy, mass data risks, and cloud collaboration hygiene.
   - 6-component Competency Rubric from Bab V Table 5.1 (Struktur & Styles 20%, Section & Tata Letak 15%, Template & Mutu 15%, Mail Merge 20%, Review & Kolaborasi 20%, Kerapian & Bukti 10%).
   - 9-item Final Document Quality Verification Checklist from Lampiran 3.
   - 6-item Portfolio Competency Artifact Matrix from Lampiran 5.
3. **BPSDM Graduation Report Generator & Multi-Channel Exporter (WORD-RPT-01 & WORD-RPT-02)**:
   - Form Laporan Kelulusan Pelatihan Pengolahan Kata summarizing participant identity (Nama, NIP, Unit Kerja, Target Naskah Dinas, Tanggal), Checkpoint 1–3 statuses (`[X]` / `[ ]`), Quiz Score, Portfolio Rubric score, combined final score (Praktik 70% + Pengetahuan 30%), and ASN competency status (*"KOMPETEN (LULUS)"* vs *"PERLU REMEDIASI"*).
   - 1-click formatted copy for **WhatsApp** (rich emojis, asterisks, bullet points).
   - 1-click formatted copy for **Telegram Markdown** (monospace tags, clean markdown headers, backtick checkmarks).
   - High-fidelity **Print / PDF export** formatted as an official BPSDM Training Completion Certificate / Transkrip Kelulusan with Kop Surat BPSDM Pemprov DKI Jakarta, formal evaluation grid, and signature verification block.

All quiz answers, reflections, and report inputs are strictly isolated within the `learnwith_word_state_v1` LocalStorage namespace with zero pollution of Course 1 (`Hands-on Agentic AI`).

---

## Architectural Responsibility Map

| Component / Layer | Physical Location | Primary Architectural Responsibilities |
|---|---|---|
| **Content Markup (`#container-course-word`)** | `index.html` (inside `#container-course-word`) | Hosts Bab V sections: `#sec-word-quiz` (20 question cards, score counter, explanation containers), `#sec-word-rubrik` (reflections, rubric table, Lampiran 3 checklist), and `#sec-word-report` (participant identity inputs, live report preview, multi-channel action buttons, print certificate card). |
| **Course 2 Sidebar Nav (`#nav-group-word`)** | `index.html` (inside `<aside id="app-sidebar">`) | Houses dedicated sub-group for Bab V (`#sec-word-quiz`, `#sec-word-rubrik`, `#sec-word-report`) with reactive status badges (`#badge-nav-word-quiz`, `#status-nav-word-report`). |
| **State Storage & Progress Engine** | `assets/js/state.js` | Extends `WORD_DEFAULT_STATE` with `quiz` (answers, score, submitted, passed), `reflections` (5 prompts), and `rubric` (checklists). Implements `updateQuizAnswer()`, `calculateQuizScore()`, `resetQuiz()`, `updateWordReflection()`, `updateWordRubric()`, and `calculateWordGraduation()`. Preserves existing 28-task baseline in `calculateProgress()`. |
| **Course 2 App Controller** | `assets/js/app.js` | Initializes `setupWordQuiz()`, `setupWordRubrik()`, and `setupWordGraduationReport()`. Manages interactive option selection, immediate explanation expander, live score calculation, reactive report text generation, clipboard copy (WhatsApp & Telegram) with toast alerts, and `window.print()` trigger. |
| **Styling & Design Tokens** | `assets/css/components.css`, `assets/css/main.css` | Implements `.quiz-container`, `.quiz-card`, `.quiz-option-btn` (default, selected, correct, incorrect), `.quiz-explanation-box`, `.rubric-table`, `.reflection-card`, `.bpsdm-report-card`, and `@media print` rules for certificate output. |
| **Automated Verification Suite** | `tests/word-quiz-report.test.js` | Comprehensive unit & regression test suite verifying question bank integrity (all 20 questions, answer keys, explanations), scoring logic, reflection/rubric persistence, multi-channel report text formatting, print element readiness, and strict multi-course state isolation. |

---

## Standard Stack

| Technology / Library | Standard / Version | Purpose / Constraints |
|---|---|---|
| **Vanilla JavaScript (ES6+)** | ES2022 Native | Zero external client-side packages. 100% offline capability. Runs in modern browsers and headless Node.js tests (`C:\nvm4w\nodejs\node.exe`). |
| **HTML5 Semantic Markup** | W3C Standard / WCAG 2.1 AA | Accessible `<section>`, `<article>`, `<button>`, `<textarea>`, `<fieldset>`, `<legend>`, ARIA live regions for instant quiz scoring and report generation. |
| **CSS3 Custom Properties** | Native `:root` variables | Theming support (light/dark mode) for quiz option states, feedback badges, report preview container, and print styling. |
| **LocalStorage API** | Browser Native | Scoped under `learnwith_word_state_v1`. Strict isolation from Course 1 keys (`learnwith_ai_state_v1`). |
| **Testing Harness** | Node.js native assert + DOM mocks (`tests/`) | High-speed automated test execution without external runners. |

---

## Authoritative Curriculum Data (Bab V BPSDM 2026)

### 1. Evaluasi Pengetahuan (20 Soal Pilihan Ganda & Kunci Lampiran 1)

| # | Pertanyaan | Pilihan Jawaban | Kunci | Pembahasan Resmi (BPSDM 2026) |
|---|---|---|:---:|---|
| **1** | Fungsi utama Heading adalah ... | A. mengubah warna halaman<br>B. membentuk struktur logis dokumen<br>C. menyisipkan gambar<br>D. mengunci dokumen | **B** | Heading (Heading 1, 2, 3) berfungsi membentuk hierarki dan struktur logis dokumen, memungkinkan pembuatan Daftar Isi otomatis, navigasi melalui Navigation Pane, dan pengindeksan dokumen standar kedinasan. |
| **2** | Perintah yang tepat untuk memperbarui judul dan nomor halaman pada daftar isi adalah ... | A. Update page numbers only<br>B. Update entire table<br>C. Refresh Styles<br>D. Replace All | **B** | Opsi *Update entire table* memperbarui nomor halaman sekaligus mendeteksi judul/subjudul baru atau teks heading yang diubah. Opsi *Update page numbers only* hanya memperbarui angka halaman tanpa memperbarui teks judul. |
| **3** | Pemisah yang memungkinkan header berbeda pada halaman berikutnya adalah ... | A. Line Break<br>B. Page Break<br>C. Next Page Section Break<br>D. Column Break | **C** | *Section Break (Next Page)* memecah dokumen menjadi bagian (section) independen sehingga pengaturan header, footer, margin, dan orientasi halaman dapat dibuat berbeda antar-bagian. *Page Break* biasa tidak memisahkan section. |
| **4** | Sebelum mengubah header pada section baru, langkah penting adalah ... | A. menghapus footer<br>B. menonaktifkan Link to Previous<br>C. mengubah zoom<br>D. menyalakan Track Changes | **B** | Secara default, header pada section baru terhubung ke section sebelumnya (*Same as Previous*). Menekan tombol *Link to Previous* untuk menonaktifkannya adalah syarat mutlak agar perubahan header tidak merusak section sebelumnya. |
| **5** | Format template Word tanpa macro adalah ... | A. .docx<br>B. .xlsx<br>C. .dotx<br>D. .pptx | **C** | Ekstensi `.dotx` adalah format Word Template standar tanpa kode makro (aman dari ancaman keamanan makro), yang menghasilkan dokumen baru berformat `.docx` setiap kali dibuka dengan klik ganda. Format dengan makro adalah `.dotm`. |
| **6** | Satu baris pada sumber data mail merge mewakili ... | A. satu penerima atau record<br>B. satu halaman<br>C. satu style<br>D. satu section | **A** | Dalam basis data atau tabel Excel mail merge, baris pertama adalah nama-nama field (header kolom), sedangkan setiap baris berikutnya mewakili satu record data penerima (misalnya satu pegawai/peserta). |
| **7** | Fitur untuk memeriksa hasil personalisasi sebelum penggabungan adalah ... | A. Navigation Pane<br>B. Preview Results<br>C. Word Count<br>D. Restrict Editing | **B** | Tombol *Preview Results* pada tab *Mailings* memungkinkan pengguna meninjau bagaimana field merge terisi oleh data nyata dari setiap record secara dinamis sebelum diekspor atau dicetak. |
| **8** | Pada label mail merge, aturan untuk berpindah penerima adalah ... | A. Skip If<br>B. Next Record<br>C. Ask<br>D. Fill-in | **B** | Aturan `<<Next Record>>` (`Rules > Next Record`) wajib disisipkan di awal sel label berikutnya agar Word membaca data baris selanjutnya pada sheet Excel, bukan mencetak nama penerima yang sama berulang kali di satu lembar label. |
| **9** | No Markup pada Track Changes berarti ... | A. semua perubahan diterima<br>B. semua perubahan dihapus<br>C. markup disembunyikan dari tampilan<br>D. dokumen dikunci | **C** | Mode *No Markup* menyembunyikan coretan, garis bawah, dan balon komentar dari layar tampilan sehingga naskah terlihat rapi seperti hasil akhir, namun revisi belum diputuskan (belum diterima/ditolak). |
| **10** | Komentar sebaiknya digunakan untuk ... | A. mengganti seluruh isi otomatis<br>B. diskusi dan masukan kontekstual<br>C. mengubah margin<br>D. membuat daftar isi | **B** | Komentar (*Modern Comments*) dirancang untuk memberikan umpan balik kontekstual, pertanyaan telaah, diskusi thread, dan catatan telaah naskah dinas tanpa mengubah isi teks dokumen secara langsung. |
| **11** | Izin paling tepat untuk pihak yang hanya memberi saran adalah ... | A. review jika tersedia<br>B. pemilik penuh<br>C. tautan publik edit<br>D. akses tanpa autentikasi | **A** | Memberikan izin *Reviewing* (*Can Review*) memastikan penelaah hanya dapat memberi komentar dan menyarankan perubahan (secara otomatis terlacak lewat Track Changes) tanpa kewenangan mengubah naskah master secara permanen. |
| **12** | Cara terbaik menghindari konflik versi adalah ... | A. membuat banyak salinan lokal<br>B. bekerja pada satu dokumen bersama di lokasi resmi<br>C. mengirim file melalui banyak kanal<br>D. menonaktifkan penyimpanan | **B** | Menerapkan *single source of truth* dengan mengedit dokumen bersama (co-authoring) di cloud resmi (OneDrive/SharePoint/Server Dinas) mencegah kekacauan akibat peredaran belasan file lokal yang saling bertolak belakang. |
| **13** | Fungsi Navigation Pane adalah ... | A. memeriksa struktur heading dan berpindah bagian<br>B. mengubah orientasi<br>C. membuat label<br>D. menghapus metadata | **A** | *Navigation Pane* (`Ctrl+F` atau *View > Navigation Pane*) menampilkan outline hierarki dokumen secara interaktif, memungkinkan penataan ulang bab dengan drag-and-drop, dan lompat ke bagian naskah secara instan. |
| **14** | Jika nomor halaman isi harus dimulai dari 1, pilih ... | A. Continue from previous<br>B. Start at: 1<br>C. Different Odd Page<br>D. AutoFit | **B** | Pada kotak dialog *Page Number Format*, memilih opsi *Start at: 1* mereset penomoran halaman pada section tersebut ke angka 1 (misalnya saat beralih dari bagian pengantar bernomor Romawi ke Bab I naskah utama). |
| **15** | Langkah akhir sebelum dokumen review dinyatakan bersih adalah ... | A. memilih No Markup<br>B. memeriksa Reviewing Pane dan menyelesaikan perubahan/komentar<br>C. menutup Navigation Pane<br>D. menghapus daftar isi | **B** | Memeriksa *Reviewing Pane* memastikan semua revisi telah diputuskan (*Accept/Reject*) dan semua komentar telah ditandai *Resolve* atau dihapus, lalu dilanjutkan pembersihan jejak reviewer melalui *Document Inspector*. Memilih *No Markup* saja tidak menghapus revisi yang tertinggal. |
| **16** | Nomor bab tidak konsisten setelah bagian dipindahkan. Perbaikan paling tepat adalah ... | A. mengetik ulang semua nomor<br>B. menautkan multilevel list ke heading<br>C. mengubah ukuran font<br>D. menyisipkan page break | **B** | Menautkan *Multilevel List* ke Style Heading (*Define New Multilevel List > Link level to style: Heading 1, 2*) membuat penomoran bab dan subbab memperbarui dirinya sendiri secara otomatis saat paragraf dipindahkan atau disisipkan. |
| **17** | Semua label menampilkan penerima yang sama. Penyebab paling mungkin adalah ... | A. aturan Next Record hilang<br>B. Link to Previous aktif<br>C. TOC belum diperbarui<br>D. template berformat DOTX | **A** | Jika aturan `<<Next Record>>` tidak disisipkan sebelum field pertama pada kotak label ke-2 dan seterusnya, Word akan terus mengulang data penerima pertama di seluruh stiker label dalam satu halaman kertas. |
| **18** | Header section sebelumnya ikut berubah ketika header baru diedit. Tindakan korektif adalah ... | A. memutus Link to Previous pada section baru<br>B. menghapus seluruh section<br>C. menjalankan mail merge<br>D. menerima Track Changes | **A** | Gejala ini terjadi karena hubungan antar-section masih aktif. Solusinya adalah masuk ke header section yang baru lalu klik *Link to Previous* pada tab *Header & Footer* untuk mematikan keterhubungan tersebut (*unlink*). |
| **19** | Risiko utama tautan publik edit untuk dokumen kedinasan adalah ... | A. ukuran font berubah<br>B. akses dan perubahan tidak dibatasi pada pihak berwenang<br>C. daftar isi hilang<br>D. nomor halaman menjadi Romawi | **B** | Membagikan link edit tanpa proteksi akun/autentikasi memungkinkan pihak mana pun di luar instansi mengubah isi naskah dinas, membocorkan data pribadi (melanggar Pergub DKI No. 14/2020), dan merusak integritas hukum dokumen. |
| **20** | Dua reviewer mengirim salinan revisi tanpa Track Changes. Fitur paling sesuai untuk merekonsiliasi perubahan adalah ... | A. Word Count<br>B. Compare/Combine<br>C. Replace All<br>D. Format Painter | **B** | Fitur *Compare* atau *Combine Documents* (*Review > Compare*) secara cerdas membandingkan dua versi dokumen Word terpisah dan menyatukan seluruh perbedaan kata, kalimat, maupun format ke dalam satu naskah baru yang dilengkapi tanda revisi Track Changes. |

---

### 2. Refleksi Diri (Bab V.A - 5 Pertanyaan Terstruktur)

1. **Refleksi 1 (Otomatisasi & Efisiensi)**: *"Fitur apa yang paling dapat mengurangi pekerjaan berulang pada dokumen Anda?"* (Target: Styles, Multilevel Lists, TOC, Mail Merge).
2. **Refleksi 2 (Area Tantangan)**: *"Bagian mana yang masih membingungkan: styles, section, mail merge, atau proses review?"* (Target: Diagnosis kendala peserta).
3. **Refleksi 3 (Standardisasi Template)**: *"Dokumen kerja apa yang paling tepat dijadikan template (.dotx) di unit Anda?"* (Target: SOP, Nota Dinas, Laporan Kinerja, Surat Edaran).
4. **Refleksi 4 (Mitigasi Risiko Data)**: *"Risiko apa yang muncul jika dokumen massal dibuat tanpa pemeriksaan data?"* (Target: Kesalahan nama/NIP, leading zeros hilang, salah SKPD, kebocoran data pribadi).
5. **Refleksi 5 (Tata Kelola Kolaborasi Daring)**: *"Bagaimana Anda akan menjaga agar kolaborasi daring tetap aman dan tidak menimbulkan banyak versi?"* (Target: Single source of truth cloud, izin reviewing, password lock tracking, pembersihan metadata via Document Inspector).

---

### 3. Rubrik Asesmen Praktik Terpadu (Bab V Tabel 5.1 BPSDM)

| Komponen Kompetensi | Bobot | Deskripsi Indikator Keberhasilan |
|---|:---:|---|
| **1. Struktur dan Styles** | **20%** | Hierarki heading benar (H1, H2, H3); multilevel list, caption, dan referensi stabil; Table of Contents otomatis dapat diperbarui dengan benar. |
| **2. Section dan Tata Letak** | **15%** | Section Break Next Page diterapkan tepat; Link to Previous diputus; penomoran halaman Romawi (i, ii) vs Arab (1, 2, 3) bekerja benar; halaman Landscape tidak merusak Portrait. |
| **3. Template dan Kontrol Mutu** | **15%** | Template master tersimpan berformat `.dotx` dapat digunakan ulang; placeholder / content control terpasang rapi; metadata diperiksa via Document Inspector. |
| **4. Mail Merge Massal** | **20%** | Sumber data Excel bersih (tanpa merged cells); field mapping akurat; aturan kondisional `If...Then...Else` dan `Next Record` berfungsi; preview diperiksa. |
| **5. Review dan Kolaborasi** | **20%** | Fitur Track Changes dan Modern Comments dikelola; seluruh revisi diterima/ditolak; komentar di-resolve; fitur Compare/Combine berhasil menggabungkan draf; izin sharing aman. |
| **6. Kerapian dan Bukti** | **10%** | Standar penamaan berkas ASN terpenuhi, tata bahasa naskah dinas baku, keterbacaan tipografi sesuai Pergub DKI, dan kelengkapan berkas portofolio terverifikasi. |

**Kriteria Kelulusan Akhir Modul**:
$$\text{Nilai Akhir} = (\text{Praktik Terpadu} \times 70\%) + (\text{Kuis Pengetahuan} \times 30\%)$$
- Peserta dinyatakan **KOMPETEN (LULUS)** jika Nilai Akhir $\ge 80$ (atau $\ge 75$ batas minimum BPSDM) dan tidak terjadi kegagalan kritis pada Checkpoints 1, 2, dan 3.
- Predikat:
  - $\ge 90$: Sangat Memuaskan (A)
  - $80 - 89.9$: Memuaskan (B)
  - $75 - 79.9$: Cukup (C)
  - $< 75$ atau Checkpoint Gagal: Belum Memenuhi Syarat / Perlu Remediasi

---

## Architecture Patterns

### 1. State Isolation & Schema Definition
In `assets/js/state.js`, `WORD_DEFAULT_STATE` will be expanded cleanly:
```javascript
const WORD_DEFAULT_STATE = {
  theme: 'light',
  checklists: {
    // Bab I (4 tasks), Bab II (8 tasks), Bab III (8 tasks), Bab IV (8 tasks) = 28 tasks
    'word-b1-download-pkg': false,
    ...
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
  quiz: {
    answers: {},       // e.g. { 1: 'B', 2: 'B', ... }
    score: 0,          // 0 to 100
    submitted: false,  // true once user answers or evaluates
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

> [!IMPORTANT]
> **Preserving Progress Engine Invariants:**
> In `assets/js/state.js`, `calculateProgress()` for Course 2 filters:
> `const taskKeys = Object.keys(checklists).filter(k => k.startsWith('word-b1-') || k.startsWith('word-b2-') || k.startsWith('word-b3-') || k.startsWith('word-b4-'));`
> Because `rubric` checkboxes are kept in the separate `state.rubric` object (or with distinct prefix `word-chk-` / `word-port-`), the baseline `totalTasks` of 28 is strictly preserved. Existing unit tests in `tests/word-modules.test.js` will pass with 0 modifications or regressions.

### 2. Immediate Feedback Quiz Engine
When a user selects an option in the UI:
1. The answer is registered into `state.quiz.answers[questionId] = optionKey`.
2. Immediate validation triggers:
   - Selected option button is highlighted with `.selected`.
   - If option matches `question.correct`, it receives `.correct` (green styling).
   - If option is wrong, it receives `.incorrect` (red styling), and the button matching `question.correct` is also highlighted to teach the user.
   - The `.quiz-explanation-box` for that question becomes visible immediately (`display: block` with smooth transition), displaying the pedagogical explanation.
3. Score is dynamically recalculated:
   $$\text{Score} = \text{Count of Correct Answers} \times 5$$
4. Live score banner updates: e.g. *"18/20 Soal Benar — Nilai: 90 / 100 — Status: KOMPETEN (LULUS)"*.
5. State is persisted automatically to `learnwith_word_state_v1`.

### 3. Multi-Channel Report Exporter
In `assets/js/app.js`:
Function `generateWordReportText(format, overrides)`:
- Formats:
  - `'whatsapp'`: Clean WhatsApp formatting with bold `*...*`, bullet points `•`, and status emojis (`✅`, `📋`, `🏆`, `⚠️`).
  - `'telegram'`: Telegram Markdown v1/v2 compatible syntax with backtick checkpoints (`` `[X]` ``), bold `*...*`, italic `_..._`, and clean section headers.
- Aggregates live state:
  - Participant info (`name`, `nip`, `unitKerja`, `targetDoc`, `reportDate`).
  - Checkpoint 1, 2, 3 statuses (`[X]` for passed, `[ ]` for pending/failed).
  - Quiz score (e.g. `90/100 (18/20 Benar)`).
  - Portfolio rubric score (e.g. `95/100 (6/6 Bukti Terverifikasi)`).
  - Combined final score & Predikat Kelulusan.

### 4. High-Fidelity BPSDM Print Certificate Slip
When `#btn-print-word-report` is clicked, `window.print()` is executed. Under `@media print`:
- `#sec-word-report` contains an official BPSDM Certificate / Transkrip Hasil Evaluasi layout (`.bpsdm-certificate-card`).
- The layout includes:
  - Kop Surat Pemprov DKI Jakarta & BPSDM.
  - Judul: **SURAT KETERANGAN HASIL EVALUASI KOMPETENSI TEKNIS**
  - Nomor sertifikasi / registrasi dinas otomatis: `BPSDM-PKTL/2026/[TIMESTAMP-SLUG]`.
  - Tabel identitas peserta (Nama, NIP, Unit Kerja, Naskah Dinas Portofolio).
  - Tabel rincian nilai (Checkpoint 1–3, Kuis Bab V 30%, Portofolio 70%, Nilai Akhir, Predikat).
  - Kolom tanda tangan resmi (Peserta Pelatihan & Fasilitator/Instruktur BPSDM).
- Clean `@media print` rules ensure sidebar, header buttons, inputs, and browser navigation are hidden, producing a crisp 1-page document.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---|---|---|---|
| **Question Shuffling Corruption** | Runtime index scrambling | Stable question numbering (1 to 20) matching official module Lampiran 1 | Randomizing question IDs in place causes answer key mismatch and confuses participants following the physical printed BPSDM workbook. |
| **PDF Generation Library** | Heavy client-side libraries (e.g., `jspdf`, `pdfmake`, `html2canvas`) | Native `window.print()` with `@media print` CSS rules | Adding 2MB+ of third-party JS libraries violates the zero-dependency offline architecture of the platform and risks rendering bugs on mobile devices. |
| **Custom Clipboard APIs** | Flash/obscure clipboard polyfills | `navigator.clipboard.writeText()` with `textarea` + `execCommand('copy')` fallback | Universal browser support, 100% reliable in both modern HTTPS and local `file://` / `localhost` environments. |
| **State Persistence** | Custom indexedDB or separate localStorage keys | Namespaced `StateManager` with `learnwith_word_state_v1` | Ensures atomic state updates, instant cross-tab sync, and total course isolation. |

---

## Common Pitfalls

### Pitfall 1: Modifying `checklists` Keys and Breaking the 28-Task Progress Invariant
**What goes wrong:** If the 9 Lampiran 3 checklist items or 6 portfolio verification items are added directly into `state.checklists` with a `word-` prefix that matches `calculateProgress()`, `totalTasks` changes from 28 to 43, causing `tests/word-modules.test.js` (which asserts `cleanProg.totalTasks === 28` and `percentage === 60`) to fail immediately.  
**How to avoid:** Store reflection text in `state.reflections`, store Lampiran 3 & 5 checklists in `state.rubric`, and keep `state.checklists` strictly for the 28 step-by-step tasks of Bab I to IV.

### Pitfall 2: Double At-Sign (`@@`) or Monospace Escaping in Telegram Export
**What goes wrong:** Participants or code prepending `@` to usernames or leaving unescaped underscores in markdown strings causes syntax corruption when pasted into Telegram.  
**How to avoid:** Normalize usernames and use safe Telegram Markdown escaping. Checkpoint marks should use clean code backticks `` `[X]` `` and `` `[ ]` ``.

### Pitfall 3: Print Dialog Outputting Entire Page Instead of Certificate Slip
**What goes wrong:** When `window.print()` is triggered while Course 2 is active, the browser prints all 6000+ lines of accordion modules and shortcuts instead of the clean single-page graduation slip.  
**How to avoid:** In `@media print`, hide non-report sections (e.g. `#sec-word-intro`, `#sec-word-standards`, `#sec-word-shortcuts`, `#sec-word-module-2`, `#sec-word-module-3`, `#sec-word-module-4`, `#sec-word-diagnosis`) or style `#bpsdm-certificate-card` as the primary printable target with `page-break-inside: avoid;`.

### Pitfall 4: Passing Grade Discrepancy (75 vs 80)
**What goes wrong:** The official BPSDM module mentions: *"Peserta kompeten jika nilai akhir minimal 75"*, while QUIZ-03 mentions 80% passing grade logic.  
**How to avoid:** Align both clearly: Set the quiz passing score threshold at 80% (16/20 correct = 80/100), and the overall module competency threshold at $\ge 80$ (with $\ge 75$ as minimum passing C), providing consistent feedback across both UI badges and report text.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|---|---|---|
| A1 | Quiz consists of exactly 20 multiple-choice questions matching Bab V Section B of the official BPSDM module. | Authoritative Curriculum Data | None (verified directly from official `.docx` body and Lampiran 1). |
| A2 | Answer keys from Lampiran 1 Table L1.1 are 100% authoritative: 1:B, 2:B, 3:C, 4:B, 5:C, 6:A, 7:B, 8:B, 9:C, 10:B, 11:A, 12:B, 13:A, 14:B, 15:B, 16:B, 17:A, 18:A, 19:B, 20:B. | Authoritative Curriculum Data | None (extracted from docx XML). |
| A3 | Keeping `state.checklists` at 28 tasks preserves existing test suites while allowing rubric checklists to live in `state.rubric`. | Architecture Patterns | Low (tested and architecturally validated). |

---

## Environment Availability

All dependencies are local and available:
- Node.js v22.22.3 (`C:\nvm4w\nodejs\node.exe`)
- Shell: `pwsh` on Windows (using `cmd.exe /c "..."` for batch commands)
- Test runner: Native Node.js assert in `tests/`
- Zero external runtime or build dependencies.

---

## Validation Architecture (Nyquist Test Mapping)

### Test Suites Execution
1. **Wave 0 Automated Test Suite**:
   ```pwsh
   cmd.exe /c "set PATH=C:\nvm4w\nodejs;%PATH% && node tests/word-quiz-report.test.js"
   ```
2. **Full Milestone Regression Suite**:
   ```pwsh
   cmd.exe /c "set PATH=C:\nvm4w\nodejs;%PATH% && node tests/word-quiz-report.test.js && node tests/word-modules.test.js && node tests/multi-course.test.js && node tests/checkpoint-engine.test.js"
   ```

### Requirements Test Traceability Matrix

| Requirement | Test Suite Name | Test Cases / Assertions |
|---|---|---|
| **QUIZ-01** | `[Suite 1: Bab V Question Bank Integrity]` | 20 questions present; unique IDs 1–20; 4 options A, B, C, D per question; valid answer keys matching Lampiran 1; non-empty Indonesian explanations. |
| **QUIZ-02** | `[Suite 2: Interactive Scoring & State Transitions]` | Answers registered in `state.quiz.answers`; score calculated correctly (each correct = 5 pts); instant answer validation; score $\ge 80$ marks `passed: true`; reset restores defaults. |
| **QUIZ-03** | `[Suite 3: Self-Reflection & Competency Rubric Engine]` | Storing 5 reflection prompts in `state.reflections`; toggling 9 Lampiran 3 checklist items & 6 portfolio items in `state.rubric`; graduation qualification calculation. |
| **WORD-RPT-01** | `[Suite 4: BPSDM Graduation Report Generation]` | `generateWordReportText()` generates structured report; pre-fills Nama, NIP, Unit Kerja, Target Dokumen; summarizes Checkpoints 1–3, quiz score, rubric score, and final competency verdict. |
| **WORD-RPT-02** | `[Suite 5: Multi-Channel Exporter & Print Readiness]` | Generates valid WhatsApp format; generates valid Telegram Markdown format; validates DOM element IDs for inputs, buttons, and print certificate container. |
| **GATEWAY-03** | `[Suite 6: Multi-Course State Isolation]` | Quiz, reflections, and Word report inputs stored strictly in `learnwith_word_state_v1`; zero pollution into `learnwith_ai_state_v1`. |

---

## Recommended Plan Partitioning

### Plan 12-01: Wave 0 Automated Test Suite, Quiz Question Bank & State/Rubric Engine
- **Focus**: Data layer, state management, calculation formulas, and automated test suite.
- **Tasks**:
  1. Create `tests/word-quiz-report.test.js` asserting all 6 test suites (Question bank, scoring, reflection/rubric state, report generation, multi-channel export, state isolation).
  2. Define `WORD_QUIZ_QUESTIONS` constant with 20 official questions, options, answer keys, and explanations in `assets/js/state.js`.
  3. Extend `WORD_DEFAULT_STATE` in `assets/js/state.js` with `quiz`, `reflections`, and `rubric`.
  4. Implement StateManager methods: `updateQuizAnswer()`, `calculateQuizScore()`, `resetQuiz()`, `updateWordReflection()`, `updateWordRubric()`, and `calculateWordGraduation()`.
  5. Run test suite to verify 100% passing tests.

### Plan 12-02: Interactive UI Markup (Bab V Quiz, Rubrik & Refleksi), BPSDM Graduation Report Form & Exporter
- **Focus**: User interface, CSS styles, interactivity, multi-channel copy, and print certification slip.
- **Tasks**:
  1. Add semantic UI markup in `index.html` inside `#container-course-word`:
     - `#sec-word-quiz`: 20 interactive question cards with options, instant feedback, explanation containers, score banner, and reset button.
     - `#sec-word-rubrik`: 5 reflection prompts, 6-component rubric table, and Lampiran 3 quality checklist.
     - `#sec-word-report`: Participant identity inputs, live report preview, WhatsApp/Telegram copy buttons, and official BPSDM Certificate slip.
  2. Update sidebar `#nav-group-word` with Bab V navigation links and reactive badges.
  3. Add component and print styles in `assets/css/components.css`.
  4. Implement controllers in `assets/js/app.js`: `setupWordQuiz()`, `setupWordRubrik()`, `setupWordGraduationReport()`, and `generateWordReportText()`.
  5. Run full test regression suite to ensure zero regressions across the entire platform.
