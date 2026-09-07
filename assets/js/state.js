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
        participantInfo: { ...defaultState.participantInfo, ...(parsed.participantInfo || {}) }
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
      const taskKeys = Object.keys(checklists).filter(k => k.startsWith('word-b1-') || k.startsWith('word-b2-') || k.startsWith('word-b3-'));
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
   * Calculate dynamic Word Processing document readiness status (Course 2: Bab I-III, Checkpoints 1 & 2)
   */
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

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { StateManager, DEFAULT_STATE, WORD_DEFAULT_STATE, STORAGE_KEY, LEGACY_STORAGE_KEY, COURSE_CONFIGS };
}

