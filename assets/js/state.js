/**
 * ==========================================================================
 * PRE-TRAINING INTERACTIVE WEB APP - STATE MANAGEMENT & LOCALSTORAGE ENGINE
 * ==========================================================================
 */

const STORAGE_KEY = 'learnwith_ai_state_v1';
const LEGACY_STORAGE_KEY = 'pretraining_app_state_v1';

const COURSE_CONFIGS = {
  ai: {
    id: 'ai',
    storageKey: 'learnwith_ai_state_v1',
    legacyKey: 'pretraining_app_state_v1',
    title: 'Hands-on Agentic AI',
    subtitle: 'Hands-on Agentic AI • Pra-Training',
    icon: '🤖'
  },
  word: {
    id: 'word',
    storageKey: 'learnwith_word_state_v1',
    unlockKey: 'learnwith_word_unlocked',
    title: 'Pengolahan Kata Tingkat Lanjut',
    subtitle: 'Pengolahan Kata Tingkat Lanjut • Modul Praktik ASN',
    icon: '📝'
  }
};

const DEFAULT_STATE = {
  theme: 'light',
  checklists: {
    // Prerequisites
    'prereq-laptop': false,
    'prereq-charger': false,
    'prereq-internet': false,
    'prereq-browser': false,
    'prereq-admin': false,
    'prereq-telegram': false,
    'prereq-google': false,
    // Module 1 (Node.js)
    'm1-check-node': false,
    'm1-check-npm': false,
    'm1-verify-lts': false,
    // Module 2 (9Router)
    'm2-install-pkg': false,
    'm2-start-service': false,
    'm2-open-dashboard': false,
    'm2-verify-local': false,
    // Module 3 (Telegram Bot)
    'm3-start-botfather': false,
    'm3-create-newbot': false,
    'm3-save-token-secure': false,
    'm3-get-userid': false,
    // Module 4 (Google Cloud)
    'm4-open-console': false,
    'm4-verify-login': false,
    // Module 6 (9Router Model Alignment)
    'm6-run-router': false,
    'm6-open-dashboard': false,
    'm6-select-model': false,
    'm6-create-key': false,
    // Module 7 (Hermes Windows Native Install)
    'm7-install-cli': false,
    'm7-restart-shell': false,
    'm7-run-doctor': false,
    // Module 8 (Hermes Setup Wizard)
    'm8-run-setup': false,
    'm8-enter-endpoint': false,
    'm8-enter-key': false,
    'm8-test-response': false,
    // Module 9 (Telegram Gateway & Allowlist)
    'm9-run-setup': false,
    'm9-select-telegram': false,
    'm9-enter-token': false,
    'm9-enter-allowed': false,
    'm9-start-gateway': false,
    'm9-check-status': false,
    'm9-verify-dm': false,
    // Module 10 (Google Calendar & OAuth 2.0 Desktop)
    'm10-open-cloud': false,
    'm10-enable-calendar': false,
    'm10-oauth-screen': false,
    'm10-create-desktop-client': false,
    'm10-download-secret': false,
    'm10-auth-hermes': false,
    // Module 11 (Skenario Uji End-to-End & Operasional)
    'm11-prompt-read': false,
    'm11-prompt-create': false,
    'm11-verify-calendar': false,
    'm11-clean-dummy': false,
    'm11-reboot-sequence': false,
  },
  checkpoints: {
    'cp-1': 'pending', // 'pending' | 'passed' | 'failed'
    'cp-2': 'pending',
    'cp-3': 'pending',
    'cp-4': 'pending',
    'cp-5': 'pending',
    'cp-6': 'pending',
    'cp-7': 'pending',
    'cp-8': 'pending',
    'cp-9': 'pending'
  },
  participantInfo: {
    name: '',
    email: '',
    telegramUsername: '',
    telegramUserId: '',
    nodeVersion: '',
    routerStatus: '',
    routerProvider: '',
    routerModel: ''
  },
  activeSection: 'sec-target',
  activeMode: 'pretraining', // 'pretraining' | 'live-class'
  lastUpdated: null
};

// Official 20-Question Knowledge Evaluation Bank (Bab V & Lampiran 1 Table L1.1 BPSDM DKI Jakarta 2026)
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
  {
    id: 2,
    question: "Perintah yang tepat untuk memperbarui judul dan nomor halaman pada daftar isi adalah ...",
    options: {
      A: "Update page numbers only",
      B: "Update entire table",
      C: "Refresh Styles",
      D: "Replace All"
    },
    correct: "B",
    explanation: "Opsi Update entire table memperbarui nomor halaman sekaligus mendeteksi judul/subjudul baru atau teks heading yang diubah. Opsi Update page numbers only hanya memperbarui angka halaman tanpa memperbarui teks judul."
  },
  {
    id: 3,
    question: "Pemisah yang memungkinkan header berbeda pada halaman berikutnya adalah ...",
    options: {
      A: "Line Break",
      B: "Page Break",
      C: "Next Page Section Break",
      D: "Column Break"
    },
    correct: "C",
    explanation: "Section Break (Next Page) memecah dokumen menjadi bagian (section) independen sehingga pengaturan header, footer, margin, dan orientasi halaman dapat dibuat berbeda antar-bagian. Page Break biasa tidak memisahkan section."
  },
  {
    id: 4,
    question: "Sebelum mengubah header pada section baru, langkah penting adalah ...",
    options: {
      A: "menghapus footer",
      B: "menonaktifkan Link to Previous",
      C: "mengubah zoom",
      D: "menyalakan Track Changes"
    },
    correct: "B",
    explanation: "Secara default, header pada section baru terhubung ke section sebelumnya (Same as Previous). Menekan tombol Link to Previous untuk menonaktifkannya adalah syarat mutlak agar perubahan header tidak merusak section sebelumnya."
  },
  {
    id: 5,
    question: "Format template Word tanpa macro adalah ...",
    options: {
      A: ".docx",
      B: ".xlsx",
      C: ".dotx",
      D: ".pptx"
    },
    correct: "C",
    explanation: "Ekstensi .dotx adalah format Word Template standar tanpa kode makro (aman dari ancaman keamanan makro), yang menghasilkan dokumen baru berformat .docx setiap kali dibuka dengan klik ganda. Format dengan makro adalah .dotm."
  },
  {
    id: 6,
    question: "Satu baris pada sumber data mail merge mewakili ...",
    options: {
      A: "satu penerima atau record",
      B: "satu halaman",
      C: "satu style",
      D: "satu section"
    },
    correct: "A",
    explanation: "Dalam basis data atau tabel Excel mail merge, baris pertama adalah nama-nama field (header kolom), sedangkan setiap baris berikutnya mewakili satu record data penerima (misalnya satu pegawai/peserta)."
  },
  {
    id: 7,
    question: "Fitur untuk memeriksa hasil personalisasi sebelum penggabungan adalah ...",
    options: {
      A: "Navigation Pane",
      B: "Preview Results",
      C: "Word Count",
      D: "Restrict Editing"
    },
    correct: "B",
    explanation: "Tombol Preview Results pada tab Mailings memungkinkan pengguna meninjau bagaimana field merge terisi oleh data nyata dari setiap record secara dinamis sebelum diekspor atau dicetak."
  },
  {
    id: 8,
    question: "Pada label mail merge, aturan untuk berpindah penerima adalah ...",
    options: {
      A: "Skip If",
      B: "Next Record",
      C: "Ask",
      D: "Fill-in"
    },
    correct: "B",
    explanation: "Aturan <<Next Record>> (Rules > Next Record) wajib disisipkan di awal sel label berikutnya agar Word membaca data baris selanjutnya pada sheet Excel, bukan mencetak nama penerima yang sama berulang kali di satu lembar label."
  },
  {
    id: 9,
    question: "No Markup pada Track Changes berarti ...",
    options: {
      A: "semua perubahan diterima",
      B: "semua perubahan dihapus",
      C: "markup disembunyikan dari tampilan",
      D: "dokumen dikunci"
    },
    correct: "C",
    explanation: "Mode No Markup menyembunyikan coretan, garis bawah, dan balon komentar dari layar tampilan sehingga naskah terlihat rapi seperti hasil akhir, namun revisi belum diputuskan (belum diterima/ditolak)."
  },
  {
    id: 10,
    question: "Komentar sebaiknya digunakan untuk ...",
    options: {
      A: "mengganti seluruh isi otomatis",
      B: "diskusi dan masukan kontekstual",
      C: "mengubah margin",
      D: "membuat daftar isi"
    },
    correct: "B",
    explanation: "Komentar (Modern Comments) dirancang untuk memberikan umpan balik kontekstual, pertanyaan telaah, diskusi thread, dan catatan telaah naskah dinas tanpa mengubah isi teks dokumen secara langsung."
  },
  {
    id: 11,
    question: "Izin paling tepat untuk pihak yang hanya memberi saran adalah ...",
    options: {
      A: "review jika tersedia",
      B: "pemilik penuh",
      C: "tautan publik edit",
      D: "akses tanpa autentikasi"
    },
    correct: "A",
    explanation: "Memberikan izin Reviewing (Can Review) memastikan penelaah hanya dapat memberi komentar dan menyarankan perubahan (secara otomatis terlacak lewat Track Changes) tanpa kewenangan mengubah naskah master secara permanen."
  },
  {
    id: 12,
    question: "Cara terbaik menghindari konflik versi adalah ...",
    options: {
      A: "membuat banyak salinan lokal",
      B: "bekerja pada satu dokumen bersama di lokasi resmi",
      C: "mengirim file melalui banyak kanal",
      D: "menonaktifkan penyimpanan"
    },
    correct: "B",
    explanation: "Menerapkan single source of truth dengan mengedit dokumen bersama (co-authoring) di cloud resmi (OneDrive/SharePoint/Server Dinas) mencegah kekacauan akibat peredaran belasan file lokal yang saling bertolak belakang."
  },
  {
    id: 13,
    question: "Fungsi Navigation Pane adalah ...",
    options: {
      A: "memeriksa struktur heading dan berpindah bagian",
      B: "mengubah orientasi",
      C: "membuat label",
      D: "menghapus metadata"
    },
    correct: "A",
    explanation: "Navigation Pane (Ctrl+F atau View > Navigation Pane) menampilkan outline hierarki dokumen secara interaktif, memungkinkan penataan ulang bab dengan drag-and-drop, dan lompat ke bagian naskah secara instan."
  },
  {
    id: 14,
    question: "Jika nomor halaman isi harus dimulai dari 1, pilih ...",
    options: {
      A: "Continue from previous",
      B: "Start at: 1",
      C: "Different Odd Page",
      D: "AutoFit"
    },
    correct: "B",
    explanation: "Pada kotak dialog Page Number Format, memilih opsi Start at: 1 mereset penomoran halaman pada section tersebut ke angka 1 (misalnya saat beralih dari bagian pengantar bernomor Romawi ke Bab I naskah utama)."
  },
  {
    id: 15,
    question: "Langkah akhir sebelum dokumen review dinyatakan bersih adalah ...",
    options: {
      A: "memilih No Markup",
      B: "memeriksa Reviewing Pane dan menyelesaikan perubahan/komentar",
      C: "menutup Navigation Pane",
      D: "menghapus daftar isi"
    },
    correct: "B",
    explanation: "Memeriksa Reviewing Pane memastikan semua revisi telah diputuskan (Accept/Reject) dan semua komentar telah ditandai Resolve atau dihapus, lalu dilanjutkan pembersihan jejak reviewer melalui Document Inspector. Memilih No Markup saja tidak menghapus revisi yang tertinggal."
  },
  {
    id: 16,
    question: "Nomor bab tidak konsisten setelah bagian dipindahkan. Perbaikan paling tepat adalah ...",
    options: {
      A: "mengetik ulang semua nomor",
      B: "menautkan multilevel list ke heading",
      C: "mengubah ukuran font",
      D: "menyisipkan page break"
    },
    correct: "B",
    explanation: "Menautkan Multilevel List ke Style Heading (Define New Multilevel List > Link level to style: Heading 1, 2) membuat penomoran bab dan subbab memperbarui dirinya sendiri secara otomatis saat paragraf dipindahkan atau disisipkan."
  },
  {
    id: 17,
    question: "Semua label menampilkan penerima yang sama. Penyebab paling mungkin adalah ...",
    options: {
      A: "aturan Next Record hilang",
      B: "Link to Previous aktif",
      C: "TOC belum diperbarui",
      D: "template berformat DOTX"
    },
    correct: "A",
    explanation: "Jika aturan <<Next Record>> tidak disisipkan sebelum field pertama pada kotak label ke-2 dan seterusnya, Word akan terus mengulang data penerima pertama di seluruh stiker label dalam satu halaman kertas."
  },
  {
    id: 18,
    question: "Header section sebelumnya ikut berubah ketika header baru diedit. Tindakan korektif adalah ...",
    options: {
      A: "memutus Link to Previous pada section baru",
      B: "menghapus seluruh section",
      C: "menjalankan mail merge",
      D: "menerima Track Changes"
    },
    correct: "A",
    explanation: "Gejala ini terjadi karena hubungan antar-section masih aktif. Solusinya adalah masuk ke header section yang baru lalu klik Link to Previous pada tab Header & Footer untuk mematikan keterhubungan tersebut (unlink)."
  },
  {
    id: 19,
    question: "Risiko utama tautan publik edit untuk dokumen kedinasan adalah ...",
    options: {
      A: "ukuran font berubah",
      B: "akses dan perubahan tidak dibatasi pada pihak berwenang",
      C: "daftar isi hilang",
      D: "nomor halaman menjadi Romawi"
    },
    correct: "B",
    explanation: "Membagikan link edit tanpa proteksi akun/autentikasi memungkinkan pihak mana pun di luar instansi mengubah isi naskah dinas, membocorkan data pribadi (melanggar Pergub DKI No. 14/2020), dan merusak integritas hukum dokumen."
  },
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

class StateManager {
  constructor(initialCourse = 'ai') {
    this.listeners = new Map();
    this.activeCourse = (initialCourse === 'word') ? 'word' : 'ai';
    this.migrateLegacyStateIfNeeded();
    this.state = this.loadState();
  }

  /**
   * Migrate legacy state key if present without modifying or deleting it
   */
  migrateLegacyStateIfNeeded() {
    try {
      if (typeof localStorage === 'undefined') return;
      const aiKey = COURSE_CONFIGS.ai.storageKey;
      const legacyKey = COURSE_CONFIGS.ai.legacyKey;
      const currentAiState = localStorage.getItem(aiKey);
      const legacyState = localStorage.getItem(legacyKey);
      if (!currentAiState && legacyState) {
        localStorage.setItem(aiKey, legacyState);
      }
    } catch (e) {
      console.warn('Legacy state migration check failed:', e);
    }
  }

  /**
   * Get current storage key based on active course
   */
  getStorageKey() {
    return COURSE_CONFIGS[this.activeCourse]?.storageKey || COURSE_CONFIGS.ai.storageKey;
  }

  /**
   * Get active course identifier ('ai' | 'word')
   */
  getActiveCourse() {
    return this.activeCourse;
  }

  /**
   * Set active course, reload scoped state, and emit courseChange
   */
  setCourse(courseId) {
    const validCourse = (courseId === 'word') ? 'word' : 'ai';
    if (this.activeCourse === validCourse) return true;
    this.activeCourse = validCourse;
    this.state = this.loadState();
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('learnwith_active_course', validCourse);
      }
    } catch (e) {}
    this.emit('courseChange', { course: validCourse, state: this.state });
    return true;
  }

  /**
   * Load state from localStorage or initialize defaults
   */
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
      // Validate activeMode for AI course
      const activeMode = (!isWord && (parsed.activeMode === 'live-class' || parsed.activeMode === 'pretraining'))
        ? parsed.activeMode
        : (isWord ? undefined : DEFAULT_STATE.activeMode);

      // Merge with default state to handle newly added fields
      return {
        ...defaultState,
        ...parsed,
        ...(activeMode ? { activeMode } : {}),
        checklists: { ...defaultState.checklists, ...(parsed.checklists || {}) },
        checkpoints: { ...defaultState.checkpoints, ...(parsed.checkpoints || {}) },
        participantInfo: { ...defaultState.participantInfo, ...(parsed.participantInfo || {}) },
        ...(isWord ? {
          quiz: {
            ...defaultState.quiz,
            ...(parsed.quiz || {}),
            answers: { ...(defaultState.quiz?.answers || {}), ...(parsed.quiz?.answers || {}) }
          },
          reflections: { ...defaultState.reflections, ...(parsed.reflections || {}) },
          rubric: { ...defaultState.rubric, ...(parsed.rubric || {}) }
        } : {})
      };
    } catch (e) {
      console.warn('Failed to load state from localStorage:', e);
      return JSON.parse(JSON.stringify(this.activeCourse === 'word' ? WORD_DEFAULT_STATE : DEFAULT_STATE));
    }
  }

  /**
   * Get currently active mode ('pretraining' | 'live-class')
   */
  getActiveMode() {
    return this.state.activeMode || 'pretraining';
  }

  /**
   * Set active mode and emit modeChange event
   */
  setMode(mode) {
    if (mode !== 'pretraining' && mode !== 'live-class') {
      console.warn(`Invalid mode: ${mode}. Must be 'pretraining' or 'live-class'.`);
      return false;
    }
    if (this.state.activeMode === mode) {
      return true;
    }
    this.state.activeMode = mode;
    this.saveState();
    this.emit('modeChange', mode);
    return true;
  }

  /**
   * Persist current state to localStorage
   */
  saveState() {
    try {
      this.state.lastUpdated = new Date().toISOString();
      const storageKey = this.getStorageKey();
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(storageKey, JSON.stringify(this.state));
      }
      this.emit('stateChange', this.state);
    } catch (e) {
      console.error('Failed to save state to localStorage:', e);
    }
  }

  /**
   * Return copy of current state
   */
  getState() {
    return JSON.parse(JSON.stringify(this.state));
  }

  /**
   * Initialize state & theme
   */
  init() {
    const theme = this.state.theme || 'light';
    this.setTheme(theme, false);
    this.emit('init', this.state);
    return this.state;
  }

  /**
   * Set theme ('dark' | 'light')
   */
  setTheme(theme, save = true) {
    const validTheme = theme === 'light' ? 'light' : 'dark';
    this.state.theme = validTheme;
    document.documentElement.setAttribute('data-theme', validTheme);
    
    // Update theme icons if present
    const sunIcon = document.getElementById('theme-icon-sun');
    const moonIcon = document.getElementById('theme-icon-moon');
    if (sunIcon && moonIcon) {
      if (validTheme === 'light') {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
      } else {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
      }
    }

    if (save) this.saveState();
    this.emit('themeChange', validTheme);
  }

  /**
   * Toggle between dark and light themes
   */
  toggleTheme() {
    const nextTheme = this.state.theme === 'dark' ? 'light' : 'dark';
    this.setTheme(nextTheme, true);
    return nextTheme;
  }

  /**
   * Update checklist item completion
   */
  updateChecklist(taskId, completed) {
    if (!this.state.checklists) {
      this.state.checklists = {};
    }
    this.state.checklists[taskId] = !!completed;
    this.saveState();
    this.emit('checklistUpdate', { taskId, completed: !!completed });
  }

  /**
   * Update checkpoint status ('pending' | 'passed' | 'failed')
   */
  updateCheckpoint(checkpointId, status) {
    if (!this.state.checkpoints) {
      this.state.checkpoints = {};
    }
    this.state.checkpoints[checkpointId] = status;
    this.saveState();
    this.emit('checkpointUpdate', { checkpointId, status });
  }

  /**
   * Update participant info field
   */
  updateParticipantInfo(field, value) {
    if (!this.state.participantInfo) {
      this.state.participantInfo = {};
    }
    this.state.participantInfo[field] = value;
    this.saveState();
    this.emit('participantInfoUpdate', { field, value });
  }

  /**
   * Calculate overall or mode-specific completion progress
   */
  calculateProgress(mode = null) {
    const checklists = this.state.checklists || {};

    if (this.activeCourse === 'word') {
      const taskKeys = Object.keys(checklists).filter(k => k.startsWith('word-b1-') || k.startsWith('word-b2-') || k.startsWith('word-b3-') || k.startsWith('word-b4-'));
      const cpKeys = Object.keys(this.state.checkpoints || {}).filter(k => k.startsWith('word-cp-'));

      const totalTasks = taskKeys.length;
      const completedTasks = taskKeys.filter(k => checklists[k] === true).length;
      const totalCheckpoints = cpKeys.length;
      const passedCheckpoints = cpKeys.filter(k => (this.state.checkpoints || {})[k] === 'passed').length;

      // Weighted calculation: Checklists = 60%, Checkpoints = 40%
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

    let taskKeys = Object.keys(checklists);
    let cpKeys = Object.keys(this.state.checkpoints || {});

    if (mode === 'pretraining') {
      taskKeys = taskKeys.filter(k => k.startsWith('prereq-') || k.startsWith('m1-') || k.startsWith('m2-') || k.startsWith('m3-') || k.startsWith('m4-'));
      cpKeys = cpKeys.filter(k => ['cp-1', 'cp-2', 'cp-3'].includes(k));
    } else if (mode === 'live-class') {
      taskKeys = taskKeys.filter(k => k.startsWith('m6-') || k.startsWith('m7-') || k.startsWith('m8-') || k.startsWith('m9-') || k.startsWith('m10-') || k.startsWith('m11-'));
      cpKeys = cpKeys.filter(k => ['cp-4', 'cp-5', 'cp-6', 'cp-7', 'cp-8', 'cp-9'].includes(k));
    }

    const totalTasks = taskKeys.length;
    const completedTasks = taskKeys.filter(k => checklists[k] === true).length;

    const checkpoints = this.state.checkpoints || {};
    const totalCheckpoints = cpKeys.length;
    const passedCheckpoints = cpKeys.filter(k => checkpoints[k] === 'passed').length;

    // Weighted calculation: Checklists = 60%, Checkpoints = 40%
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

  /**
   * Get progress for a specific module by prefix (e.g. 'm1-', 'm2-')
   */
  getModuleProgress(modulePrefix) {
    const checklists = this.state.checklists || {};
    const taskKeys = Object.keys(checklists).filter(k => k.startsWith(modulePrefix));
    const total = taskKeys.length;
    const completed = taskKeys.filter(k => checklists[k] === true).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, percentage };
  }

  /**
   * Calculate dynamic workshop readiness status (Pra-Training: Checkpoints 1, 2, 3)
   */
  calculateReadiness() {
    const progress = this.calculateProgress('pretraining');
    const cps = this.state.checkpoints || {};
    const pretrainingCpIds = ['cp-1', 'cp-2', 'cp-3'];
    const cpValues = pretrainingCpIds.map(id => cps[id] || 'pending');
    
    const hasFailure = cpValues.some(v => v === 'failed');
    const allCheckpointsPassed = cpValues.every(v => v === 'passed');
    
    if (hasFailure) {
      return {
        status: 'clinic',
        label: '⚠️ PERLU TECHNICAL CLINIC',
        badgeClass: 'badge-danger',
        description: 'Terdapat kendala teknis pada satu atau lebih gerbang checkpoint. Jangan khawatir! Silakan konsultasikan kendala Anda dengan instruktur atau ikuti sesi Technical Clinic sebelum kelas dimulai.',
        color: 'var(--color-danger)'
      };
    }

    if (allCheckpointsPassed && progress.percentage >= 80) {
      return {
        status: 'ready',
        label: '🎉 SIAP MENGIKUTI WORKSHOP',
        badgeClass: 'badge-success',
        description: 'Selamat! Seluruh prasyarat dan gerbang checkpoint teknis telah berhasil Anda selesaikan. Laptop Anda 100% siap untuk praktik mengelola Google Calendar melalui Telegram bersama Hermes Agent saat workshop!',
        color: 'var(--color-success)'
      };
    }

    return {
      status: 'pending',
      label: '⏳ MENUNGGU PENYELESAIAN LANGKAH',
      badgeClass: 'badge-warning',
      description: 'Anda masih memiliki langkah atau verifikasi checkpoint yang belum selesai. Selesaikan Modul 1 sampai 5 dan verifikasi Checkpoint 1, 2, dan 3 untuk mencapai status kesiapan penuh.',
      color: 'var(--color-warning)'
    };
  }

  /**
   * Calculate dynamic Live Class completion readiness status (Hari-H: Checkpoints 4-9) (GATE-07)
   */
  calculateLiveReadiness() {
    const progress = this.calculateProgress('live-class');
    const cps = this.state.checkpoints || {};
    const liveCpIds = ['cp-4', 'cp-5', 'cp-6', 'cp-7', 'cp-8', 'cp-9'];
    const cpValues = liveCpIds.map(id => cps[id] || 'pending');

    const hasFailure = cpValues.some(v => v === 'failed');
    const allCheckpointsPassed = cpValues.every(v => v === 'passed');

    if (hasFailure || progress.percentage < 50) {
      return {
        status: 'clinic',
        label: '⚠️ BELUM SIAP / BUTUH BANTUAN',
        badgeClass: 'badge-danger',
        description: 'Terdapat kendala pada satu atau lebih gerbang checkpoint in-class atau progres masih di bawah 50%. Silakan periksa Pusat Bantuan Kendala Live Workshop atau tanyakan kepada instruktur.',
        color: 'var(--color-danger)'
      };
    }

    if (allCheckpointsPassed && progress.percentage >= 95) {
      return {
        status: 'ready',
        label: '🎉 SELESAI (SUKSES)',
        badgeClass: 'badge-success',
        description: 'Selamat! Seluruh gerbang checkpoint Hari-H Praktik Kelas (CP 4 s/d CP 9) berhasil diselesaikan. Integrasi Telegram dan Google Calendar Anda telah terverifikasi penuh!',
        color: 'var(--color-success)'
      };
    }

    return {
      status: 'in_progress',
      label: '⏳ DALAM PRAKTIK',
      badgeClass: 'badge-warning',
      description: 'Sesi praktik kelas sedang berlangsung. Lanjutkan modul berikutnya dan selesaikan verifikasi Checkpoint 4 hingga 9 untuk menyelesaikan workshop.',
      color: 'var(--color-warning)'
    };
  }

  /**
   * Calculate dynamic Word Processing document readiness status (Course 2: Bab I-IV, Checkpoints 1, 2, & 3)
   */
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
        description: 'Terdapat kendala pada verifikasi struktur dokumen, section break, atau otomasi/kolaborasi Bab IV. Periksa kembali panduan perbaikan atau konsultasikan dengan fasilitator.',
        color: 'var(--color-danger)'
      };
    }

    if (allPassed && progress.percentage >= 80) {
      return {
        status: 'ready',
        label: '🎉 DOKUMEN SESUAI STANDAR DINAS',
        badgeClass: 'badge-success',
        description: 'Selamat! Seluruh checklist Bab I–IV dan Checkpoint 1, 2, & 3 berhasil diverifikasi. Dokumen Anda memenuhi standar hierarki, penomoran section, otomatisasi mail merge, kolaborasi, dan template ASN!',
        color: 'var(--color-success)'
      };
    }

    return {
      status: 'pending',
      label: '⏳ DALAM PENYUSUNAN PRAKTIK',
      badgeClass: 'badge-warning',
      description: 'Lengkapi checklist praktik Bab I s/d IV serta verifikasi Checkpoint 1, 2, dan 3 untuk menuntaskan standardisasi dan kolaborasi dokumen dinas Anda.',
      color: 'var(--color-warning)'
    };
  }

  /**
   * Update answer for Bab V knowledge quiz question (QUIZ-01, QUIZ-02)
   */
  updateQuizAnswer(questionId, selectedOption) {
    if (!this.state.quiz) {
      this.state.quiz = { answers: {}, score: 0, submitted: false, passed: false };
    }
    if (!this.state.quiz.answers) {
      this.state.quiz.answers = {};
    }
    this.state.quiz.answers[questionId] = selectedOption;
    this.state.quiz.submitted = true;
    this.calculateQuizScore();
    this.saveState();
    this.emit('quizUpdate', this.state.quiz);
    this.emit('stateChanged', this.state);
  }

  /**
   * Calculate score for Bab V knowledge quiz (5 pts per correct answer, 0-100)
   */
  calculateQuizScore() {
    if (!this.state.quiz) {
      this.state.quiz = { answers: {}, score: 0, submitted: false, passed: false };
    }
    if (!this.state.quiz.answers) {
      this.state.quiz.answers = {};
    }
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

  /**
   * Reset Bab V knowledge quiz answers and score
   */
  resetQuiz() {
    this.state.quiz = { answers: {}, score: 0, submitted: false, passed: false };
    this.saveState();
    this.emit('quizReset', this.state.quiz);
    this.emit('stateChanged', this.state);
  }

  /**
   * Update Bab V self-reflection prompt (QUIZ-03)
   */
  updateWordReflection(promptId, text) {
    if (!this.state.reflections) {
      this.state.reflections = {};
    }
    this.state.reflections[promptId] = text;
    this.saveState();
    this.emit('reflectionUpdate', { promptId, text });
    this.emit('stateChanged', this.state);
  }

  /**
   * Update Bab V competency rubric / quality checklist item (QUIZ-03)
   */
  updateWordRubric(rubricKey, checked) {
    if (!this.state.rubric) {
      this.state.rubric = {};
    }
    this.state.rubric[rubricKey] = !!checked;
    this.saveState();
    this.emit('rubricUpdate', { rubricKey, checked: !!checked });
    this.emit('stateChanged', this.state);
  }

  /**
   * Calculate BPSDM Course 2 Graduation Evaluation (70% Practice + 30% Quiz) (WORD-RPT-01)
   */
  calculateWordGraduation() {
    const cps = this.state.checkpoints || {};
    const cpIds = ['word-cp-1', 'word-cp-2', 'word-cp-3'];
    const allCpPassed = cpIds.every(id => cps[id] === 'passed');
    const hasCpFailure = cpIds.some(id => cps[id] === 'failed');

    const quizScore = (this.state.quiz && typeof this.state.quiz.score === 'number') ? this.state.quiz.score : 0;

    // Calculate Portfolio Rubric score (6 portfolio items from Lampiran 5, each ~16.67 pts, total 100)
    const rubric = this.state.rubric || {};
    const portKeys = ['word-port-structure', 'word-port-multisection', 'word-port-template', 'word-port-merge', 'word-port-review', 'word-port-qa-log'];
    const completedPortItems = portKeys.filter(k => rubric[k] === true).length;
    const portfolioScore = Math.round((completedPortItems / portKeys.length) * 100);

    // Nilai Akhir = (Praktik Terpadu * 70%) + (Kuis Pengetahuan * 30%)
    const finalScore = Math.round((portfolioScore * 0.7) + (quizScore * 0.3));

    let status = 'remediasi';
    let label = 'BELUM MEMENUHI SYARAT / PERLU REMEDIASI';
    let badgeClass = 'badge-danger';
    let grade = 'Perlu Remediasi (D)';

    if (hasCpFailure || finalScore < 75 || !allCpPassed) {
      status = 'remediasi';
      label = 'PERLU REMEDIASI';
      badgeClass = 'badge-danger';
      grade = 'Perlu Remediasi (D)';
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

  /**
   * Reset all progress
   */
  resetState() {
    const defaultState = this.activeCourse === 'word' ? WORD_DEFAULT_STATE : DEFAULT_STATE;
    this.state = JSON.parse(JSON.stringify(defaultState));
    this.saveState();
    if (this.activeCourse === 'ai') {
      this.setTheme('dark', false);
    }
    this.emit('stateReset', this.state);
  }

  /**
   * Event Subscription
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      for (const callback of this.listeners.get(event)) {
        try {
          callback(data);
        } catch (err) {
          console.error(`Error in event listener for ${event}:`, err);
        }
      }
    }
  }
}

// Global AppState Singleton
window.AppState = new StateManager();
window.WORD_QUIZ_QUESTIONS = WORD_QUIZ_QUESTIONS;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { StateManager, DEFAULT_STATE, WORD_DEFAULT_STATE, WORD_QUIZ_QUESTIONS, STORAGE_KEY, LEGACY_STORAGE_KEY, COURSE_CONFIGS };
}


