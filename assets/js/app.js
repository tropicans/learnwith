/**
 * ==========================================================================
 * PRE-TRAINING INTERACTIVE WEB APP - MAIN APP CONTROLLER & INTERACTION WIREUP
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize State and Theme
  window.AppState.init();

  // 2. Initialize Search Engine
  window.SearchEngine.init();

  // 3. Setup Theme Switcher
  setupThemeToggle();

  // 4. Setup Mobile Navigation Drawer
  setupMobileDrawer();

  // 5. Setup Active Navigation Link Spy & Smooth Scroll
  setupNavigationSpy();

  // 6. Setup Global 1-Click Code Copy Engine
  setupCodeCopy();

  // 7. Setup Checkbox Listeners for Interactive Items
  setupChecklistListeners();

  // 8. Setup Module Accordions & Collapsible Guides
  setupModuleAccordions();

  // 9. Setup Interactive Glossary Tooltips
  setupGlossaryTooltips();

  // 10. Setup Reactive Progress Tracker
  setupProgressTracker();

  // 11. Setup Checkpoint Gates
  setupCheckpointGates();

  // 12. Setup Participant Form Inputs & Validation
  setupParticipantInputs();

  // 13. Setup Reset Confirmation Modal
  setupResetModal();

  // 14. Setup Troubleshooting Hub Search & Filter
  setupTroubleshootingHub();

  // 15. Setup Sensitive Data Redaction Tool
  setupRedactionTool();

  // 16. Setup Form Laporan Kesiapan & Export
  setupReadinessReport();

  // 17. Initial Progress calculation
  updateProgressUI();
});

/**
 * --- 1. THEME TOGGLE CONTROLLER ---
 */
function setupThemeToggle() {
  const themeBtn = document.getElementById('btn-theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const newTheme = window.AppState.toggleTheme();
      showToast(`Tema beralih ke mode ${newTheme === 'dark' ? 'Gelap 🌙' : 'Terang ☀️'}`, 'info', 2000);
    });
  }
}

/**
 * --- 2. MOBILE DRAWER CONTROLLER ---
 */
function setupMobileDrawer() {
  const mobileMenuBtn = document.getElementById('btn-mobile-menu');
  const sidebar = document.getElementById('app-sidebar');
  const backdrop = document.getElementById('drawer-backdrop');

  if (!mobileMenuBtn || !sidebar || !backdrop) return;

  function openDrawer() {
    sidebar.classList.add('open');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    sidebar.classList.remove('open');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  mobileMenuBtn.addEventListener('click', () => {
    if (sidebar.classList.contains('open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  backdrop.addEventListener('click', closeDrawer);

  // Close drawer when any nav link is clicked on mobile
  sidebar.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        closeDrawer();
      }
    });
  });
}

/**
 * --- 3. NAVIGATION SPY & ACTIVE HIGHLIGHTING ---
 */
function setupNavigationSpy() {
  const sections = document.querySelectorAll('.content-section');
  const navLinks = document.querySelectorAll('.nav-link');

  if (sections.length === 0 || navLinks.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

/**
 * --- 4. 1-CLICK CODE COPY ENGINE ---
 */
function setupCodeCopy() {
  document.addEventListener('click', async (e) => {
    const copyBtn = e.target.closest('.code-copy-btn');
    if (!copyBtn) return;

    const codeContainer = copyBtn.closest('.code-container');
    if (!codeContainer) return;

    const codeContent = codeContainer.querySelector('.code-content code, .code-content');
    if (!codeContent) return;

    const rawText = codeContent.innerText || codeContent.textContent || '';
    // Strip leading comment markers or prompt indicators if necessary
    const cleanedText = rawText.trim();

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(cleanedText);
      } else {
        // Fallback for older browsers or non-https
        const textarea = document.createElement('textarea');
        textarea.value = cleanedText;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      // Visual feedback
      const originalHtml = copyBtn.innerHTML;
      copyBtn.classList.add('copied');
      copyBtn.innerHTML = `<span>✓ Tersalin!</span>`;
      showToast('Perintah berhasil disalin ke clipboard 📋', 'success', 2200);

      setTimeout(() => {
        copyBtn.classList.remove('copied');
        copyBtn.innerHTML = originalHtml;
      }, 2000);

    } catch (err) {
      console.error('Failed to copy text:', err);
      showToast('Gagal menyalin perintah secara otomatis', 'warning', 2500);
    }
  });
}

/**
 * --- 5. CHECKLIST INTERACTION LISTENERS ---
 */
function setupChecklistListeners() {
  // Sync existing state on load
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

    checkbox.addEventListener('change', (e) => {
      const completed = e.target.checked;
      window.AppState.updateChecklist(taskId, completed);
      const item = e.target.closest('.checklist-item, .step-checklist-action');
      if (item) {
        if (completed) item.classList.add('completed');
        else item.classList.remove('completed');
      }
      updateProgressUI();
    });
  });
}

/**
 * --- 6. REACTIVE PROGRESS TRACKER ---
 */
function setupProgressTracker() {
  window.AppState.on('stateChange', () => {
    updateProgressUI();
  });
}

function updateProgressUI() {
  const progress = window.AppState.calculateProgress();
  
  // Header Progress Text & Bar
  const progressText = document.getElementById('header-progress-text');
  const progressBar = document.getElementById('header-progress-bar');
  if (progressText) {
    progressText.innerText = `${progress.percentage}%`;
    if (progress.percentage === 100) {
      progressText.className = 'badge badge-pill badge-success';
    } else if (progress.percentage > 0) {
      progressText.className = 'badge badge-pill badge-primary';
    } else {
      progressText.className = 'badge badge-pill badge-neutral';
    }
  }

  if (progressBar) {
    progressBar.style.width = `${progress.percentage}%`;
  }

  // Hero Stat Counter
  const statCount = document.getElementById('stat-progress-count');
  if (statCount) {
    statCount.innerText = `${progress.completedTasks}/${progress.totalTasks}`;
  }

  // Update Module Progress Badges in Sidebar
  ['m1', 'm2', 'm3', 'm4'].forEach(mod => {
    const el = document.getElementById(`badge-nav-${mod}`);
    if (el) {
      const p = window.AppState.getModuleProgress(`${mod}-`);
      el.innerText = `${p.completed}/${p.total}`;
      if (p.total > 0 && p.completed === p.total) {
        el.className = 'badge badge-pill badge-success';
      } else if (p.completed > 0) {
        el.className = 'badge badge-pill badge-primary';
      } else {
        el.className = 'badge badge-pill badge-neutral';
      }
    }
  });

  // Update Checkpoint Status Badges in Sidebar
  const state = window.AppState.getState();
  const cps = state.checkpoints || {};
  ['cp-1', 'cp-2', 'cp-3'].forEach((id, idx) => {
    const el = document.getElementById(`status-nav-cp${idx + 1}`);
    if (el) {
      const status = cps[id] || 'pending';
      if (status === 'passed') {
        el.className = 'badge badge-pill badge-success';
        el.innerText = 'Lolos ✓';
      } else if (status === 'failed') {
        el.className = 'badge badge-pill badge-danger';
        el.innerText = 'Gagal';
      } else {
        el.className = 'badge badge-pill badge-warning';
        el.innerText = 'Pending';
      }
    }
  });

  // Update Readiness Summary Status Badge & Description
  const readiness = window.AppState.calculateReadiness();
  const readinessBadge = document.getElementById('readiness-status-badge');
  const readinessDesc = document.getElementById('readiness-status-desc');
  const readinessCard = document.getElementById('card-readiness-status');

  if (readinessBadge) {
    readinessBadge.className = `readiness-badge status-${readiness.status}`;
    readinessBadge.innerText = readiness.label;
  }

  if (readinessDesc) {
    readinessDesc.innerText = readiness.description;
  }

  if (readinessCard) {
    readinessCard.style.borderColor = readiness.color;
  }
}

/**
 * --- 7. TOAST NOTIFICATION UTILITY ---
 */
window.showToast = function(message, type = 'info', duration = 3000) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const icon = type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️';
  toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
  
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'toastSlideOut 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, duration);
};

/**
 * --- 8. MODULE ACCORDION & COLLAPSIBLE CONTROLLER ---
 */
function setupModuleAccordions() {
  // Toggle individual module accordion
  document.addEventListener('click', (e) => {
    const header = e.target.closest('.module-header');
    if (!header) return;

    // Ignore clicks if user clicked directly on a button or link inside header
    if (e.target.closest('button:not(.module-chevron), a')) return;

    const moduleCard = header.closest('.module-card');
    if (!moduleCard) return;

    const isCollapsed = moduleCard.classList.toggle('collapsed');
    const chevron = moduleCard.querySelector('.module-chevron');
    if (chevron) {
      chevron.style.transform = isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)';
    }

    header.setAttribute('aria-expanded', !isCollapsed);
  });

  // Handle URL hash on load or change (auto expand targeted module)
  function handleHashTarget() {
    const hash = window.location.hash;
    if (!hash) return;
    const targetEl = document.querySelector(hash);
    if (targetEl) {
      const parentModule = targetEl.closest('.module-card') || (targetEl.classList.contains('module-card') ? targetEl : null);
      if (parentModule && parentModule.classList.contains('collapsed')) {
        parentModule.classList.remove('collapsed');
        const chevron = parentModule.querySelector('.module-chevron');
        if (chevron) chevron.style.transform = 'rotate(0deg)';
      }
      setTimeout(() => {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }

  window.addEventListener('hashchange', handleHashTarget);
  // Check once on initial load
  setTimeout(handleHashTarget, 200);

  // Global Expand / Collapse All buttons if present
  document.addEventListener('click', (e) => {
    const expandAllBtn = e.target.closest('#btn-expand-all-modules');
    const collapseAllBtn = e.target.closest('#btn-collapse-all-modules');

    if (expandAllBtn) {
      document.querySelectorAll('.module-card').forEach(card => {
        card.classList.remove('collapsed');
        const chevron = card.querySelector('.module-chevron');
        if (chevron) chevron.style.transform = 'rotate(0deg)';
      });
      showToast('Semua modul dibuka 📖', 'info', 1800);
    }

    if (collapseAllBtn) {
      document.querySelectorAll('.module-card').forEach(card => {
        card.classList.add('collapsed');
        const chevron = card.querySelector('.module-chevron');
        if (chevron) chevron.style.transform = 'rotate(-90deg)';
      });
      showToast('Semua modul disembunyikan 📁', 'info', 1800);
    }
  });
}

/**
 * --- 9. GLOSSARY TOOLTIPS CONTROLLER ---
 */
function setupGlossaryTooltips() {
  // Mobile / Touch support: toggle active state on tap
  document.addEventListener('click', (e) => {
    const term = e.target.closest('.glossary-term');
    
    // Close other open tooltips
    document.querySelectorAll('.glossary-term.active').forEach(el => {
      if (el !== term) el.classList.remove('active');
    });

    if (term) {
      term.classList.toggle('active');
      e.stopPropagation();
    }
  });

  // Close when clicking outside
  document.addEventListener('click', () => {
    document.querySelectorAll('.glossary-term.active').forEach(el => {
      el.classList.remove('active');
    });
  });
}

/**
 * --- 10. CHECKPOINT GATES CONTROLLER ---
 */
function setupCheckpointGates() {
  const state = window.AppState.getState();
  const checkpoints = state.checkpoints || {};

  ['cp-1', 'cp-2', 'cp-3'].forEach(cpId => {
    updateCheckpointCardUI(cpId, checkpoints[cpId] || 'pending');
  });

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-cp-action');
    if (!btn) return;

    const cpId = btn.getAttribute('data-checkpoint');
    const newStatus = btn.getAttribute('data-status');
    if (!cpId || !newStatus) return;

    window.AppState.updateCheckpoint(cpId, newStatus);
    updateCheckpointCardUI(cpId, newStatus);

    const cpNum = cpId.replace('cp-', '');
    if (newStatus === 'passed') {
      showToast(`Checkpoint ${cpNum} berhasil diverifikasi (Lolos ✓)`, 'success', 2500);
    } else if (newStatus === 'failed') {
      showToast(`Checkpoint ${cpNum} ditandai memiliki kendala ⚠️`, 'warning', 2500);
    } else {
      showToast(`Checkpoint ${cpNum} diatur ulang ke status Pending`, 'info', 2000);
    }
  });

  window.AppState.on('checkpointUpdate', ({ checkpointId, status }) => {
    updateCheckpointCardUI(checkpointId, status);
  });
}

function updateCheckpointCardUI(cpId, status) {
  const card = document.getElementById(`card-${cpId}`);
  const statusBadge = document.getElementById(`status-card-${cpId.replace('-', '')}`);
  
  if (card) {
    card.classList.remove('passed', 'failed');
    if (status === 'passed') card.classList.add('passed');
    else if (status === 'failed') card.classList.add('failed');

    card.querySelectorAll('.btn-cp-action').forEach(b => {
      if (b.getAttribute('data-status') === status) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });
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

/**
 * --- 11. PARTICIPANT INPUTS & VALIDATION CONTROLLER ---
 */
function setupParticipantInputs() {
  const state = window.AppState.getState();
  const info = state.participantInfo || {};

  document.querySelectorAll('[data-participant-field]').forEach(input => {
    const field = input.getAttribute('data-participant-field');
    if (field && info[field] !== undefined) {
      input.value = info[field];
      validateParticipantField(input, field, info[field]);
    }

    input.addEventListener('input', (e) => {
      const val = e.target.value;
      validateParticipantField(input, field, val);
      window.AppState.updateParticipantInfo(field, val);
    });
  });
}

function validateParticipantField(input, field, value) {
  const trimmed = (value || '').trim();
  if (field === 'telegramUserId') {
    const msg = document.getElementById('msg-val-tg-userid');
    if (!trimmed) {
      input.classList.remove('is-valid', 'is-invalid');
      if (msg) {
        msg.className = 'form-validation-msg';
        msg.innerText = 'Hanya boleh berupa angka murni (tanpa huruf, spasi, atau @).';
      }
    } else if (/^\d+$/.test(trimmed)) {
      input.classList.add('is-valid');
      input.classList.remove('is-invalid');
      if (msg) {
        msg.className = 'form-validation-msg valid';
        msg.innerText = '✓ Format Telegram User ID valid (angka murni).';
      }
    } else {
      input.classList.add('is-invalid');
      input.classList.remove('is-valid');
      if (msg) {
        msg.className = 'form-validation-msg invalid';
        msg.innerText = '✕ Salah: Telegram User ID hanya berupa angka (misal: 123456789), bukan username @.';
      }
    }
  } else if (field === 'telegramUsername') {
    const msg = document.getElementById('msg-val-tg-username');
    if (!trimmed) {
      input.classList.remove('is-valid', 'is-invalid');
      if (msg) {
        msg.className = 'form-validation-msg';
        msg.innerText = "Wajib diakhiri kata 'bot' atau '_bot' (contoh: @jadwal_budi_bot).";
      }
    } else if (/(bot|_bot)$/i.test(trimmed)) {
      input.classList.add('is-valid');
      input.classList.remove('is-invalid');
      if (msg) {
        msg.className = 'form-validation-msg valid';
        msg.innerText = "✓ Format username bot valid (berakhiran 'bot').";
      }
    } else {
      input.classList.add('is-invalid');
      input.classList.remove('is-valid');
      if (msg) {
        msg.className = 'form-validation-msg invalid';
        msg.innerText = "✕ Username bot Telegram wajib diakhiri dengan kata 'bot' atau '_bot'.";
      }
    }
  }
}

/**
 * --- 12. RESET MODAL CONTROLLER ---
 */
function setupResetModal() {
  const modal = document.getElementById('modal-reset-confirm');
  const openBtn = document.getElementById('btn-open-reset-modal');
  const cancelBtn = document.getElementById('btn-cancel-reset');
  const confirmBtn = document.getElementById('btn-confirm-reset');

  if (!modal) return;

  function openModal() {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (confirmBtn) confirmBtn.focus();
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (openBtn) {
    openBtn.addEventListener('click', openModal);
  }

  if (cancelBtn) {
    cancelBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });

  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      window.AppState.resetState();

      // Uncheck all checkboxes in DOM
      document.querySelectorAll('.checklist-checkbox').forEach(cb => {
        cb.checked = false;
        const item = cb.closest('.checklist-item, .step-checklist-action');
        if (item) item.classList.remove('completed');
      });

      // Clear input fields
      document.querySelectorAll('[data-participant-field]').forEach(inp => {
        inp.value = '';
        inp.classList.remove('is-valid', 'is-invalid');
      });

      // Reset validation messages
      const v1 = document.getElementById('msg-val-tg-username');
      if (v1) {
        v1.className = 'form-validation-msg';
        v1.innerText = "Wajib diakhiri kata 'bot' atau '_bot' (contoh: @jadwal_budi_bot).";
      }
      const v2 = document.getElementById('msg-val-tg-userid');
      if (v2) {
        v2.className = 'form-validation-msg';
        v2.innerText = 'Hanya boleh berupa angka murni (tanpa huruf, spasi, atau @).';
      }

      // Reset checkpoint cards
      ['cp-1', 'cp-2', 'cp-3'].forEach(cpId => {
        updateCheckpointCardUI(cpId, 'pending');
      });

      closeModal();
      updateProgressUI();
      showToast('Semua progres dan verifikasi berhasil diatur ulang 🔄', 'info', 3000);
    });
  }
}

/**
 * --- 13. TROUBLESHOOTING HUB CONTROLLER (TRBL-01, TRBL-02) ---
 */
function setupTroubleshootingHub() {
  const searchInput = document.getElementById('troubleshoot-search-input');
  const filterBtns = document.querySelectorAll('.troubleshoot-filter-btn');
  const cards = document.querySelectorAll('.trouble-card');

  let currentCategory = 'all';
  let searchQuery = '';

  function filterCards() {
    const q = searchQuery.toLowerCase().trim();

    cards.forEach(card => {
      const cardCategory = card.getAttribute('data-trouble-category') || '';
      const textContent = card.innerText.toLowerCase();

      const categoryMatch = currentCategory === 'all' || cardCategory === currentCategory;
      const searchMatch = !q || textContent.includes(q);

      if (categoryMatch && searchMatch) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-category') || 'all';
      filterCards();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      filterCards();
    });
  }
}

/**
 * --- 14. SENSITIVE DATA REDACTION TOOL (TRBL-03) ---
 */
const REDACTION_RULES = [
  {
    name: 'Telegram Bot Token',
    pattern: /\b\d{8,10}:[A-Za-z0-9_-]{35}\b/g,
    replacement: '[REDACTED_TELEGRAM_BOT_TOKEN]'
  },
  {
    name: 'OpenAI API Key',
    pattern: /\bsk-[A-Za-z0-9_-]{20,}\b/g,
    replacement: '[REDACTED_API_KEY]'
  },
  {
    name: 'Google Cloud API Key',
    pattern: /\bAIza[0-9A-Za-z-_]{35}\b/g,
    replacement: '[REDACTED_GOOGLE_API_KEY]'
  },
  {
    name: 'Bearer Token',
    pattern: /Bearer\s+[A-Za-z0-9._~+/-]+=*/gi,
    replacement: 'Bearer [REDACTED_BEARER_TOKEN]'
  },
  {
    name: 'Email Address',
    pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
    replacement: '[REDACTED_EMAIL]'
  },
  {
    name: 'Windows User Path',
    pattern: /(C:\\Users\\)[a-zA-Z0-9_.-]+(\\)/gi,
    replacement: '$1[USER]$2'
  }
];

function sanitizeLogText(rawText) {
  if (!rawText) return { sanitized: '', matchesCount: 0 };
  let sanitized = rawText;
  let totalMatches = 0;

  REDACTION_RULES.forEach(rule => {
    const matches = sanitized.match(rule.pattern);
    if (matches) {
      totalMatches += matches.length;
      sanitized = sanitized.replace(rule.pattern, rule.replacement);
    }
  });

  return { sanitized, matchesCount: totalMatches };
}

window.sanitizeLogText = sanitizeLogText;
window.REDACTION_RULES = REDACTION_RULES;

function setupRedactionTool() {
  const inputEl = document.getElementById('redaction-input');
  const outputEl = document.getElementById('redaction-output');
  const countBadge = document.getElementById('redaction-count-badge');
  const copyBtn = document.getElementById('btn-copy-redacted');
  const triggerBtn = document.getElementById('btn-trigger-redaction');

  if (!inputEl || !outputEl) return;

  function performRedaction() {
    const raw = inputEl.value;
    const { sanitized, matchesCount } = sanitizeLogText(raw);
    outputEl.value = sanitized;

    if (countBadge) {
      if (matchesCount > 0) {
        countBadge.className = 'badge badge-pill badge-warning';
        countBadge.innerText = `${matchesCount} data sensitif disensor 🛡️`;
      } else if (raw.trim().length > 0) {
        countBadge.className = 'badge badge-pill badge-success';
        countBadge.innerText = `Aman (tidak terdeteksi token rahasia) ✓`;
      } else {
        countBadge.className = 'badge badge-pill badge-neutral';
        countBadge.innerText = `0 data terdeteksi`;
      }
    }
  }

  inputEl.addEventListener('input', performRedaction);
  if (triggerBtn) triggerBtn.addEventListener('click', performRedaction);

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      if (!outputEl.value.trim()) {
        showToast('Tidak ada teks log untuk disalin', 'warning', 2000);
        return;
      }
      navigator.clipboard.writeText(outputEl.value).then(() => {
        showToast('Log yang disensor berhasil disalin ke clipboard! 📋', 'success', 2500);
      }).catch(() => {
        outputEl.select();
        document.execCommand('copy');
        showToast('Log tersensor disalin!', 'success', 2000);
      });
    });
  }
}

/**
 * --- 16. FORM LAPORAN KESIAPAN CONTROLLER (RPT-01, RPT-02, RPT-03) ---
 */
function generateReportText(overrides = {}) {
  const state = window.AppState ? window.AppState.getState() : {};
  const info = { ...(state.participantInfo || {}), ...overrides.participantInfo };
  const cps = { ...(state.checkpoints || {}), ...overrides.checkpoints };
  const readiness = (window.AppState && window.AppState.calculateReadiness) 
    ? window.AppState.calculateReadiness() 
    : { status: 'pending' };

  const name = overrides.name || info.name || '[Nama Anda]';
  const os = overrides.os || 'Windows 11 / Windows 10';
  
  // Checkpoints
  const cp1Mark = cps['cp-1'] === 'passed' ? '[X]' : '[ ]';
  const cp2Mark = cps['cp-2'] === 'passed' ? '[X]' : '[ ]';
  const cp3Mark = cps['cp-3'] === 'passed' ? '[X]' : '[ ]';
  
  // Module 4 (Google Cloud)
  let gcloudMark = '[ ]';
  if (window.AppState && window.AppState.getModuleProgress) {
    const m4Progress = window.AppState.getModuleProgress('m4-');
    if (m4Progress.completed === m4Progress.total && m4Progress.total > 0) {
      gcloudMark = '[X]';
    }
  }

  // Status
  const statusState = overrides.status || readiness.status;
  const statusText = statusState === 'ready' 
    ? 'SIAP MENGIKUTI WORKSHOP' 
    : (statusState === 'clinic' ? 'PERLU TECHNICAL CLINIC' : 'MENUNGGU VERIFIKASI');

  // Problem step & Error msg
  const probStep = overrides.probStep || 'Nihil';
  const rawError = overrides.errorMsg || 'Nihil';
  const sanitizedError = (rawError === 'Nihil') ? 'Nihil' : (window.sanitizeLogText ? window.sanitizeLogText(rawError).sanitized : rawError);

  // Node version & telegram info
  const nodeVer = info.nodeVersion ? ` (${info.nodeVersion})` : '';
  const tgInfo = (info.telegramUsername || info.telegramUserId) 
    ? ` (@${info.telegramUsername || '-'}, ID: ${info.telegramUserId || '-'})` 
    : '';

  return `Nama: ${name}
Sistem operasi: ${os}

${cp1Mark} Checkpoint 1 — Node.js dan npm siap${nodeVer}
${cp2Mark} Checkpoint 2 — dashboard 9Router terbuka
${cp3Mark} Checkpoint 3 — bot Telegram dan user ID siap${tgInfo}
${gcloudMark} Google Cloud Console dapat dibuka

Status: ${statusText}
Nomor langkah yang bermasalah (jika ada): ${probStep}
Pesan error yang sudah disensor:
${sanitizedError}`;
}

window.generateReportText = generateReportText;

function setupReadinessReport() {
  const nameInput = document.getElementById('input-report-name');
  const osSelect = document.getElementById('select-report-os');
  const probStepInput = document.getElementById('input-report-problem-step');
  const errorMsgInput = document.getElementById('input-report-error-msg');
  const previewBox = document.getElementById('report-output-preview');
  const copyBtn = document.getElementById('btn-copy-report');
  const printBtn = document.getElementById('btn-print-report');

  if (!previewBox) return;

  function updatePreview() {
    const overrides = {
      name: nameInput ? nameInput.value.trim() : '',
      os: osSelect ? osSelect.value : 'Windows 11 / Windows 10',
      probStep: probStepInput ? probStepInput.value.trim() : 'Nihil',
      errorMsg: errorMsgInput ? errorMsgInput.value.trim() : 'Nihil'
    };
    previewBox.innerText = generateReportText(overrides);
  }

  // Initial update & bind listeners
  updatePreview();

  if (nameInput) {
    nameInput.value = (window.AppState && window.AppState.getState().participantInfo.name) || '';
    nameInput.addEventListener('input', (e) => {
      if (window.AppState) window.AppState.updateParticipantInfo('name', e.target.value);
      updatePreview();
    });
  }

  if (osSelect) osSelect.addEventListener('change', updatePreview);
  if (probStepInput) probStepInput.addEventListener('input', updatePreview);
  if (errorMsgInput) errorMsgInput.addEventListener('input', updatePreview);

  if (window.AppState) {
    window.AppState.on('stateChange', updatePreview);
    window.AppState.on('checkpointUpdate', updatePreview);
    window.AppState.on('participantUpdate', updatePreview);
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const overrides = {
        name: nameInput ? nameInput.value.trim() : '',
        os: osSelect ? osSelect.value : 'Windows 11 / Windows 10',
        probStep: probStepInput ? probStepInput.value.trim() : 'Nihil',
        errorMsg: errorMsgInput ? errorMsgInput.value.trim() : 'Nihil'
      };
      const text = generateReportText(overrides);
      navigator.clipboard.writeText(text).then(() => {
        showToast('Format laporan berhasil disalin! Siap dikirim ke WhatsApp / Telegram 📲', 'success', 3000);
      }).catch(() => {
        const temp = document.createElement('textarea');
        temp.value = text;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
        showToast('Laporan disalin ke clipboard!', 'success', 2500);
      });
    });
  }

  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }
}


