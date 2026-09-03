/**
 * ==========================================================================
 * PRE-TRAINING INTERACTIVE WEB APP - STATE MANAGEMENT & LOCALSTORAGE ENGINE
 * ==========================================================================
 */

const STORAGE_KEY = 'pretraining_app_state_v1';

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
  },
  checkpoints: {
    'cp-1': 'pending', // 'pending' | 'passed' | 'failed'
    'cp-2': 'pending',
    'cp-3': 'pending'
  },
  participantInfo: {
    name: '',
    email: '',
    telegramUsername: '',
    telegramUserId: '',
    nodeVersion: '',
    routerStatus: ''
  },
  activeSection: 'sec-target',
  lastUpdated: null
};

class StateManager {
  constructor() {
    this.listeners = new Map();
    this.state = this.loadState();
  }

  /**
   * Load state from localStorage or initialize defaults
   */
  loadState() {
    try {
      const serialized = localStorage.getItem(STORAGE_KEY);
      if (!serialized) {
        return JSON.parse(JSON.stringify(DEFAULT_STATE));
      }
      const parsed = JSON.parse(serialized);
      // Merge with default state to handle newly added fields
      return {
        ...DEFAULT_STATE,
        ...parsed,
        checklists: { ...DEFAULT_STATE.checklists, ...(parsed.checklists || {}) },
        checkpoints: { ...DEFAULT_STATE.checkpoints, ...(parsed.checkpoints || {}) },
        participantInfo: { ...DEFAULT_STATE.participantInfo, ...(parsed.participantInfo || {}) }
      };
    } catch (e) {
      console.warn('Failed to load state from localStorage:', e);
      return JSON.parse(JSON.stringify(DEFAULT_STATE));
    }
  }

  /**
   * Persist current state to localStorage
   */
  saveState() {
    try {
      this.state.lastUpdated = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
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
   * Calculate overall completion progress
   */
  calculateProgress() {
    const checklists = this.state.checklists || {};
    const taskKeys = Object.keys(checklists);
    const totalTasks = taskKeys.length;
    const completedTasks = taskKeys.filter(k => checklists[k] === true).length;

    const checkpoints = this.state.checkpoints || {};
    const cpKeys = Object.keys(checkpoints);
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
   * Calculate dynamic workshop readiness status
   */
  calculateReadiness() {
    const progress = this.calculateProgress();
    const cps = this.state.checkpoints || {};
    const cpValues = Object.values(cps);
    
    const hasFailure = cpValues.some(v => v === 'failed');
    const allCheckpointsPassed = cpValues.length === 3 && cpValues.every(v => v === 'passed');
    
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
   * Reset all progress
   */
  resetState() {
    this.state = JSON.parse(JSON.stringify(DEFAULT_STATE));
    this.saveState();
    this.setTheme('dark', false);
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
  module.exports = { StateManager, DEFAULT_STATE, STORAGE_KEY };
}
