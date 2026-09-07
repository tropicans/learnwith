/**
 * ==========================================================================
 * PRE-TRAINING INTERACTIVE WEB APP - MAIN APP CONTROLLER & INTERACTION WIREUP
 * ==========================================================================
 */

/**
 * Robust DOM Sanitization Utility (SEC-09)
 * Guarantees zero DOM-based XSS when escaping user-supplied strings.
 */
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

if (typeof window !== 'undefined') {
  window.escapeHtml = escapeHtml;
}

if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') {
  document.addEventListener('DOMContentLoaded', async () => {
    // 0. Initialize Session Security & URL Authorization (SEC-05, SEC-06)
    if (typeof SessionSecurityManager !== 'undefined' && typeof SessionSecurityManager.init === 'function') {
      await SessionSecurityManager.init();
    }

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
    setupLiveTroubleshootingHub();

    // 15. Setup Sensitive Data Redaction Tool
    setupRedactionTool();

    // 16. Setup Form Laporan Kesiapan & Export
    setupReadinessReport();
    setupLiveReport();

    // 16.5. Setup Course 2 Bab V Controllers (Quiz, Rubrik & Laporan Kelulusan)
    setupWordQuiz();
    setupWordRubrik();
    setupWordGraduationReport();

    // 17. Setup Dual-Purpose Mode Switcher (Pra-Training vs Hari-H Kelas)
    setupModeSwitcher();

    // 18. Setup Multi-Course Switcher & Developer Gate Protection (Phase 9)
    setupCourseManager();

    // 19. Initial Progress calculation
    updateProgressUI();
  });
}

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

  const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function openDrawer() {
    sidebar.classList.add('open');
    backdrop.classList.add('active');
    mobileMenuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    const firstFocusable = sidebar.querySelector(focusableSelector);
    if (firstFocusable) firstFocusable.focus();
  }

  function closeDrawer(restoreFocus = true) {
    const wasOpen = sidebar.classList.contains('open');
    sidebar.classList.remove('open');
    backdrop.classList.remove('active');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (wasOpen && restoreFocus) mobileMenuBtn.focus();
  }

  mobileMenuBtn.addEventListener('click', () => {
    if (sidebar.classList.contains('open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  backdrop.addEventListener('click', () => closeDrawer());

  document.addEventListener('keydown', (e) => {
    if (!sidebar.classList.contains('open')) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      closeDrawer();
      return;
    }

    if (e.key !== 'Tab') return;
    const focusable = Array.from(sidebar.querySelectorAll(focusableSelector));
    if (focusable.length === 0) {
      e.preventDefault();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

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
        // Skip sections within hidden course or mode containers
        const parentCourse = entry.target.closest('#container-course-ai, #container-course-word');
        if (parentCourse && parentCourse.style.display === 'none') return;
        const parentMode = entry.target.closest('#container-pretraining, #container-liveclass');
        if (parentMode && parentMode.style.display === 'none') return;

        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            // Only deactivate if link belongs to visible nav group
            const linkNavGroup = link.closest('.sidebar-nav-group');
            if (!linkNavGroup || linkNavGroup.style.display !== 'none') {
              link.classList.remove('active');
            }
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

    const codeContainer = copyBtn.closest('.code-container, .code-block-wrap');
    if (!codeContainer) return;

    const codeContent = codeContainer.querySelector('.code-content code, .code-content, .code-block-content code, .code-block-content');
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

    if (!checkbox.hasAttribute('data-has-checklist-listener')) {
      checkbox.setAttribute('data-has-checklist-listener', 'true');
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
    }
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
  const isWord = window.AppState.getActiveCourse && window.AppState.getActiveCourse() === 'word';
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
  const statWordCount = document.getElementById('stat-word-progress-count');
  if (statWordCount) {
    statWordCount.innerText = `${progress.completedTasks}/${progress.totalTasks}`;
  }

  if (isWord) {
    // Update Module Progress Badges in Sidebar (Bab I, II, III, IV)
    ['b1', 'b2', 'b3', 'b4'].forEach(mod => {
      const el = document.getElementById(`badge-nav-word-${mod}`);
      if (el) {
        const p = window.AppState.getModuleProgress(`word-${mod}-`);
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

    // Update Checkpoint Status Badges in Sidebar for Course 2
    const state = window.AppState.getState();
    const cps = state.checkpoints || {};
    ['word-cp-1', 'word-cp-2', 'word-cp-3'].forEach((id, idx) => {
      const el = document.getElementById(`status-nav-word-cp${idx + 1}`);
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

    // Update Word Document Readiness Summary Status Badge & Description
    if (typeof window.AppState.calculateWordReadiness === 'function') {
      const readiness = window.AppState.calculateWordReadiness();
      const readinessBadge = document.getElementById('readiness-word-badge') || document.getElementById('readiness-status-badge');
      const readinessDesc = document.getElementById('readiness-word-desc') || document.getElementById('readiness-status-desc');
      const readinessCard = document.getElementById('card-word-readiness-status') || document.getElementById('card-readiness-status');

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

    if (typeof updateWordNavBadges === 'function') {
      updateWordNavBadges();
    }

    return;
  }

  // Update Module Progress Badges in Sidebar (Pre-Training & Live Class)
  ['m1', 'm2', 'm3', 'm4', 'm6', 'm7', 'm8'].forEach(mod => {
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

  // Update Live Class Checkpoint Status in Sidebar
  const liveCpNav = document.getElementById('status-nav-live-cp');
  if (liveCpNav) {
    const liveCps = ['cp-4', 'cp-5', 'cp-6', 'cp-7', 'cp-8', 'cp-9'];
    const hasLiveFail = liveCps.some(id => cps[id] === 'failed');
    const allLivePass = liveCps.every(id => cps[id] === 'passed');
    if (hasLiveFail) {
      liveCpNav.className = 'badge badge-pill badge-danger';
      liveCpNav.innerText = 'Ada Kendala';
    } else if (allLivePass) {
      liveCpNav.className = 'badge badge-pill badge-success';
      liveCpNav.innerText = 'Lolos 4-9 ✓';
    } else {
      liveCpNav.className = 'badge badge-pill badge-warning';
      liveCpNav.innerText = 'Pending';
    }
  }

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
function showToast(message, type = 'info', duration = 3000) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const icon = type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️';
  const iconSpan = document.createElement('span');
  iconSpan.textContent = icon;
  const messageSpan = document.createElement('span');
  messageSpan.textContent = String(message);
  toast.appendChild(iconSpan);
  toast.appendChild(messageSpan);
  
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'toastSlideOut 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, duration);
}

if (typeof window !== 'undefined') {
  window.showToast = showToast;
}

/**
 * --- 8. MODULE ACCORDION & COLLAPSIBLE CONTROLLER ---
 */
function setupModuleAccordions() {
  function setModuleExpanded(moduleCard, expanded) {
    if (!moduleCard) return;
    moduleCard.classList.toggle('collapsed', !expanded);
    const moduleHeader = moduleCard.querySelector('.module-header');
    if (moduleHeader) moduleHeader.setAttribute('aria-expanded', String(expanded));
  }

  function toggleHeader(header) {
    const moduleCard = header.closest('.module-card');
    if (!moduleCard) return;
    setModuleExpanded(moduleCard, moduleCard.classList.contains('collapsed'));
  }

  // Toggle individual module accordion.
  document.addEventListener('click', (e) => {
    const header = e.target.closest('.module-header');
    if (!header || e.target.closest('a, button')) return;
    toggleHeader(header);
  });

  document.addEventListener('keydown', (e) => {
    const header = e.target.closest('.module-header');
    if (!header || (e.key !== 'Enter' && e.key !== ' ')) return;
    e.preventDefault();
    toggleHeader(header);
  });

  // Handle URL hash on load or change (auto expand targeted module)
  function handleHashTarget() {
    const hash = window.location.hash;
    if (!hash) return;
    const targetEl = document.querySelector(hash);
    if (targetEl) {
      const parentModule = targetEl.closest('.module-card') || (targetEl.classList.contains('module-card') ? targetEl : null);
      if (parentModule) setModuleExpanded(parentModule, true);
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
        setModuleExpanded(card, true);
      });
      showToast('Semua modul dibuka 📖', 'info', 1800);
    }

    if (collapseAllBtn) {
      document.querySelectorAll('.module-card').forEach(card => {
        setModuleExpanded(card, false);
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

  const allCheckpointIds = ['cp-1', 'cp-2', 'cp-3', 'cp-4', 'cp-5', 'cp-6', 'cp-7', 'cp-8', 'cp-9', 'word-cp-1', 'word-cp-2', 'word-cp-3'];
  allCheckpointIds.forEach(cpId => {
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

    const isWordCp = cpId.startsWith('word-cp-');
    const cpLabel = isWordCp
      ? `Bab ${cpId === 'word-cp-1' ? 'II' : cpId === 'word-cp-2' ? 'III' : 'IV'} (CP-${cpId.replace('word-cp-', '')})`
      : `Checkpoint ${cpId.replace('cp-', '')}`;

    if (newStatus === 'passed') {
      showToast(`${cpLabel} berhasil diverifikasi (Lolos ✓)`, 'success', 2500);
    } else if (newStatus === 'failed') {
      showToast(`${cpLabel} ditandai memiliki kendala ⚠️`, 'warning', 2500);
    } else {
      showToast(`${cpLabel} diatur ulang ke status Pending`, 'info', 2000);
    }
  });

  window.AppState.on('checkpointUpdate', ({ checkpointId, status }) => {
    updateCheckpointCardUI(checkpointId, status);
  });
}

function updateCheckpointCardUI(cpId, status) {
  const card = document.getElementById(`card-${cpId}`);
  const statusBadge = document.getElementById(`status-card-${cpId}`)
    || document.getElementById(`status-card-${cpId.replace('cp-', 'cp')}`)
    || document.getElementById(`status-card-${cpId.replace(/-/g, '')}`)
    || document.getElementById(`status-card-${cpId.replace('-', '')}`);
  
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

  // Update sidebar checkpoint badge for Course 2
  if (cpId.startsWith('word-cp-')) {
    const num = cpId.replace('word-cp-', '');
    const navBadge = document.getElementById(`status-nav-word-cp${num}`);
    if (navBadge) {
      if (status === 'passed') {
        navBadge.className = 'badge badge-pill badge-success';
        navBadge.innerText = 'Lolos ✓';
      } else if (status === 'failed') {
        navBadge.className = 'badge badge-pill badge-danger';
        navBadge.innerText = 'Gagal';
      } else {
        navBadge.className = 'badge badge-pill badge-warning';
        navBadge.innerText = 'Pending';
      }
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
      ['cp-1', 'cp-2', 'cp-3', 'cp-4', 'cp-5', 'cp-6', 'cp-7', 'cp-8', 'cp-9'].forEach(cpId => {
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

  filterBtns.forEach((btn, index) => {
    btn.tabIndex = btn.classList.contains('active') || (index === 0 && !Array.from(filterBtns).some(item => item.classList.contains('active'))) ? 0 : -1;
  });

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
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
        b.tabIndex = -1;
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      btn.tabIndex = 0;
      currentCategory = btn.getAttribute('data-category') || 'all';
      filterCards();
    });

    btn.addEventListener('keydown', (e) => {
      const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
      if (!keys.includes(e.key)) return;
      e.preventDefault();
      const buttons = Array.from(filterBtns);
      const currentIndex = buttons.indexOf(btn);
      let nextIndex = currentIndex;
      if (e.key === 'Home') nextIndex = 0;
      if (e.key === 'End') nextIndex = buttons.length - 1;
      if (e.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + buttons.length) % buttons.length;
      if (e.key === 'ArrowRight') nextIndex = (currentIndex + 1) % buttons.length;
      buttons.forEach((button, index) => { button.tabIndex = index === nextIndex ? 0 : -1; });
      buttons[nextIndex].focus();
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
 * --- 13B. LIVE WORKSHOP TROUBLESHOOTING HUB CONTROLLER (TRBL-04, TRBL-05) ---
 */
function setupLiveTroubleshootingHub() {
  const searchInput = document.getElementById('live-troubleshoot-search-input');
  const filterPills = document.getElementById('live-troubleshoot-filter-pills');
  const filterBtns = filterPills ? filterPills.querySelectorAll('.troubleshoot-filter-btn') : document.querySelectorAll('#sec-live-troubleshooting .troubleshoot-filter-btn');
  const cards = document.querySelectorAll('#live-troubleshoot-cards-container .trouble-card');

  let currentCategory = 'all';
  let searchQuery = '';

  filterBtns.forEach((btn, index) => {
    btn.tabIndex = btn.classList.contains('active') || (index === 0 && !Array.from(filterBtns).some(item => item.classList.contains('active'))) ? 0 : -1;
  });

  function filterLiveCards() {
    const q = searchQuery.toLowerCase().trim();

    cards.forEach(card => {
      const cardCategory = card.getAttribute('data-live-trouble-category') || '';
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
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
        b.tabIndex = -1;
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      btn.tabIndex = 0;
      currentCategory = btn.getAttribute('data-category') || 'all';
      filterLiveCards();
    });

    btn.addEventListener('keydown', (e) => {
      const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
      if (!keys.includes(e.key)) return;
      e.preventDefault();
      const buttons = Array.from(filterBtns);
      const currentIndex = buttons.indexOf(btn);
      let nextIndex = currentIndex;
      if (e.key === 'Home') nextIndex = 0;
      if (e.key === 'End') nextIndex = buttons.length - 1;
      if (e.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + buttons.length) % buttons.length;
      if (e.key === 'ArrowRight') nextIndex = (currentIndex + 1) % buttons.length;
      buttons.forEach((button, index) => { button.tabIndex = index === nextIndex ? 0 : -1; });
      buttons[nextIndex].focus();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      filterLiveCards();
    });
  }
}

window.setupLiveTroubleshootingHub = setupLiveTroubleshootingHub;

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
  const normalizedTelegramUsername = String(info.telegramUsername || '').replace(/^@+/, '');
  const tgInfo = (normalizedTelegramUsername || info.telegramUserId)
    ? ` (${normalizedTelegramUsername ? `@${normalizedTelegramUsername}` : '-'}, ID: ${info.telegramUserId || '-'})`
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
window.setupReadinessReport = setupReadinessReport;

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

  if (nameInput) {
    nameInput.value = (window.AppState && window.AppState.getState().participantInfo.name) || '';
    nameInput.addEventListener('input', (e) => {
      if (window.AppState) window.AppState.updateParticipantInfo('name', e.target.value);
      updatePreview();
    });
  }

  // Hydrate persisted participant data before the first preview render.
  updatePreview();

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

/**
 * --- 16B. FORM LAPORAN HASIL PRAKTIK KELAS CONTROLLER (GATE-07, RPT-04, RPT-05) ---
 */
function generateLiveReportText(format = 'whatsapp', overrides = {}) {
  const state = window.AppState ? window.AppState.getState() : {};
  const info = { ...(state.participantInfo || {}), ...overrides.participantInfo };
  const cps = { ...(state.checkpoints || {}), ...overrides.checkpoints };
  const liveReadiness = (window.AppState && window.AppState.calculateLiveReadiness)
    ? window.AppState.calculateLiveReadiness()
    : { status: 'in_progress', label: 'DALAM PRAKTIK' };

  const name = overrides.name || info.name || '[Nama Peserta]';
  const model = overrides.model || info.routerModel || 'hermes-3-llama-3.1-8b';
  const os = overrides.os || 'Windows 11 / Windows 10';

  // Checkpoints 4 through 9
  const cp4Mark = cps['cp-4'] === 'passed' ? '[X]' : '[ ]';
  const cp5Mark = cps['cp-5'] === 'passed' ? '[X]' : '[ ]';
  const cp6Mark = cps['cp-6'] === 'passed' ? '[X]' : '[ ]';
  const cp7Mark = cps['cp-7'] === 'passed' ? '[X]' : '[ ]';
  const cp8Mark = cps['cp-8'] === 'passed' ? '[X]' : '[ ]';
  const cp9Mark = cps['cp-9'] === 'passed' ? '[X]' : '[ ]';

  // Problem step & Error msg
  const probStep = overrides.probStep || 'Nihil / Sukses Penuh';
  const rawError = overrides.errorMsg || 'Nihil';
  const sanitizedError = (rawError === 'Nihil') ? 'Nihil' : (window.sanitizeLogText ? window.sanitizeLogText(rawError).sanitized : rawError);

  const statusLabel = overrides.statusLabel || liveReadiness.label || 'DALAM PRAKTIK';

  if (format === 'whatsapp') {
    return `*LAPORAN HASIL PRAKTIK KELAS (HARI-H)*
Hands-on Agentic AI: Dari Chat ke Kalender — Praktik Deploy Hermes Agent & 9Router

*Data Peserta:*
• Nama: ${name}
• Model Digunakan: ${model}
• Sistem Operasi: ${os}

*Status Gerbang Checkpoint:*
${cp4Mark} Checkpoint 4 — 9Router & model sinkron
${cp5Mark} Checkpoint 5 — Hermes CLI & doctor lolos
${cp6Mark} Checkpoint 6 — Respon uji model via 9Router
${cp7Mark} Checkpoint 7 — Telegram Gateway allowlist aktif
${cp8Mark} Checkpoint 8 — Google Calendar Desktop OAuth aktif
${cp9Mark} Checkpoint 9 — Uji E2E kelola kalender via Telegram

*Status Akhir:* ${statusLabel}
*Kendala / Langkah Terakhir:* ${probStep}

*Log Error Terminal (Tersensor):*
${sanitizedError}`;
  }

  // Telegram format (Markdown)
  return `📊 **LAPORAN HASIL PRAKTIK KELAS (HARI-H)**
Hands-on Agentic AI: Dari Chat ke Kalender — Praktik Deploy Hermes Agent & 9Router

👤 **Data Peserta:**
- Nama: ${name}
- Model Digunakan: \`${model}\`
- Sistem Operasi: ${os}

🏁 **Status Gerbang Checkpoint:**
${cp4Mark} Checkpoint 4 — 9Router & model sinkron
${cp5Mark} Checkpoint 5 — Hermes CLI & doctor lolos
${cp6Mark} Checkpoint 6 — Respon uji model via 9Router
${cp7Mark} Checkpoint 7 — Telegram Gateway allowlist aktif
${cp8Mark} Checkpoint 8 — Google Calendar Desktop OAuth aktif
${cp9Mark} Checkpoint 9 — Uji E2E kelola kalender via Telegram

⚡ **Status Akhir:** ${statusLabel}
⚠️ **Kendala / Langkah Terakhir:** ${probStep}

🛑 **Log Error Terminal (Tersensor):**
\`\`\`
${sanitizedError}
\`\`\``;
}

window.generateLiveReportText = generateLiveReportText;

/**
 * Generate formatted evaluation & graduation report text for Course 2 (BPSDM 2026)
 * Supports 'whatsapp' (rich emojis, asterisks, bullet points) and 'telegram' (Markdown)
 */
function generateWordReportText(format = 'whatsapp', overrides = {}) {
  const state = (typeof window !== 'undefined' && window.AppState) ? window.AppState.getState() : {};
  const info = { ...(state.participantInfo || {}), ...(overrides.participantInfo || {}) };
  const cps = { ...(state.checkpoints || {}), ...(overrides.checkpoints || {}) };
  const grad = (typeof window !== 'undefined' && window.AppState && window.AppState.calculateWordGraduation)
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

window.generateWordReportText = generateWordReportText;

function setupLiveReport() {
  const nameInput = document.getElementById('input-live-report-name');
  const modelInput = document.getElementById('input-live-report-model');
  const osSelect = document.getElementById('select-live-report-os');
  const probStepInput = document.getElementById('input-live-report-problem-step');
  const errorMsgInput = document.getElementById('input-live-report-error-msg');
  const previewBox = document.getElementById('live-report-output-preview');
  const charCount = document.getElementById('live-report-char-count');
  const copyWaBtn = document.getElementById('btn-copy-live-report-wa');
  const copyTgBtn = document.getElementById('btn-copy-live-report-tg');
  const readinessBadge = document.getElementById('badge-live-readiness');

  if (!previewBox) return;

  function updateLivePreview() {
    const overrides = {
      name: nameInput ? nameInput.value.trim() : '',
      model: modelInput ? modelInput.value.trim() : '',
      os: osSelect ? osSelect.value : 'Windows 11',
      probStep: probStepInput ? probStepInput.value.trim() : 'Nihil / Sukses Penuh',
      errorMsg: errorMsgInput ? errorMsgInput.value.trim() : 'Nihil'
    };

    const text = generateLiveReportText('whatsapp', overrides);
    previewBox.innerText = text;
    if (charCount) {
      charCount.innerText = `${text.length} karakter`;
    }

    if (readinessBadge && window.AppState && window.AppState.calculateLiveReadiness) {
      const liveReadiness = window.AppState.calculateLiveReadiness();
      readinessBadge.className = `badge badge-pill ${liveReadiness.badgeClass}`;
      readinessBadge.innerText = liveReadiness.label;
    }
  }

  if (nameInput) {
    nameInput.value = (window.AppState && window.AppState.getState().participantInfo.name) || '';
    nameInput.addEventListener('input', (e) => {
      if (window.AppState) window.AppState.updateParticipantInfo('name', e.target.value);
      updateLivePreview();
    });
  }

  if (modelInput) {
    const savedModel = (window.AppState && window.AppState.getState().participantInfo.routerModel);
    if (savedModel) modelInput.value = savedModel;
    modelInput.addEventListener('input', (e) => {
      if (window.AppState) window.AppState.updateParticipantInfo('routerModel', e.target.value);
      updateLivePreview();
    });
  }

  updateLivePreview();

  if (osSelect) osSelect.addEventListener('change', updateLivePreview);
  if (probStepInput) probStepInput.addEventListener('input', updateLivePreview);
  if (errorMsgInput) errorMsgInput.addEventListener('input', updateLivePreview);

  if (window.AppState) {
    window.AppState.on('stateChange', updateLivePreview);
    window.AppState.on('checkpointUpdate', updateLivePreview);
    window.AppState.on('participantInfoUpdate', updateLivePreview);
  }

  if (copyWaBtn) {
    copyWaBtn.addEventListener('click', () => {
      const overrides = {
        name: nameInput ? nameInput.value.trim() : '',
        model: modelInput ? modelInput.value.trim() : '',
        os: osSelect ? osSelect.value : 'Windows 11',
        probStep: probStepInput ? probStepInput.value.trim() : 'Nihil / Sukses Penuh',
        errorMsg: errorMsgInput ? errorMsgInput.value.trim() : 'Nihil'
      };
      const text = generateLiveReportText('whatsapp', overrides);
      navigator.clipboard.writeText(text).then(() => {
        showToast('Format WhatsApp berhasil disalin ke clipboard! 📋', 'success', 3000);
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

  if (copyTgBtn) {
    copyTgBtn.addEventListener('click', () => {
      const overrides = {
        name: nameInput ? nameInput.value.trim() : '',
        model: modelInput ? modelInput.value.trim() : '',
        os: osSelect ? osSelect.value : 'Windows 11',
        probStep: probStepInput ? probStepInput.value.trim() : 'Nihil / Sukses Penuh',
        errorMsg: errorMsgInput ? errorMsgInput.value.trim() : 'Nihil'
      };
      const text = generateLiveReportText('telegram', overrides);
      navigator.clipboard.writeText(text).then(() => {
        showToast('Format Telegram berhasil disalin ke clipboard! ✈️', 'success', 3000);
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
}

window.setupLiveReport = setupLiveReport;

/**
 * --- 16.5. COURSE 2 BAB V: QUIZ, RUBRIK & GRADUATION REPORT CONTROLLERS ---
 */
function updateWordNavBadges() {
  if (typeof window === 'undefined' || !window.AppState) return;
  const state = window.AppState.getState();

  // 1. Quiz badge (#badge-nav-word-quiz)
  const quizBadge = document.getElementById('badge-nav-word-quiz');
  if (quizBadge) {
    const answeredCount = Object.keys(state.quiz?.answers || {}).length;
    quizBadge.innerText = `${answeredCount}/20`;
    if (answeredCount === 20 && state.quiz?.passed) {
      quizBadge.className = 'badge badge-pill badge-success';
    } else if (answeredCount > 0) {
      quizBadge.className = 'badge badge-pill badge-primary';
    } else {
      quizBadge.className = 'badge badge-pill badge-neutral';
    }
  }

  // 2. Rubric badge (#badge-nav-word-rubrik)
  const rubrikBadge = document.getElementById('badge-nav-word-rubrik');
  if (rubrikBadge) {
    const rubric = state.rubric || {};
    const portKeys = ['word-port-structure', 'word-port-multisection', 'word-port-template', 'word-port-merge', 'word-port-review', 'word-port-qa-log'];
    const completedPortItems = portKeys.filter(k => rubric[k] === true).length;
    rubrikBadge.innerText = `${completedPortItems}/${portKeys.length}`;
    if (completedPortItems === portKeys.length) {
      rubrikBadge.className = 'badge badge-pill badge-success';
    } else if (completedPortItems > 0) {
      rubrikBadge.className = 'badge badge-pill badge-primary';
    } else {
      rubrikBadge.className = 'badge badge-pill badge-neutral';
    }
  }

  // 3. Report status badge (#status-nav-word-report)
  const reportStatusBadge = document.getElementById('status-nav-word-report');
  if (reportStatusBadge && typeof window.AppState.calculateWordGraduation === 'function') {
    const grad = window.AppState.calculateWordGraduation();
    if (grad.status === 'lulus' || grad.status === 'lulus_cukup') {
      reportStatusBadge.className = 'badge badge-pill badge-success';
      reportStatusBadge.innerText = 'Kompeten ✓';
    } else if (grad.status === 'remediasi' && (grad.finalScore > 0 || state.quiz?.submitted)) {
      reportStatusBadge.className = 'badge badge-pill badge-danger';
      reportStatusBadge.innerText = 'Remediasi';
    } else {
      reportStatusBadge.className = 'badge badge-pill badge-warning';
      reportStatusBadge.innerText = 'Pending';
    }
  }
}

function setupWordQuiz() {
  const container = document.getElementById('sec-word-quiz');
  if (!container) return;

  const scoreBanner = document.getElementById('banner-word-quiz-score') || document.getElementById('word-quiz-score-banner');
  const resetBtn = document.getElementById('btn-reset-word-quiz');

  function renderQuizUI() {
    if (typeof window === 'undefined' || !window.AppState) return;
    const quizState = window.AppState.getState().quiz || { answers: {}, score: 0, submitted: false, passed: false };
    const questions = (window.WORD_QUIZ_QUESTIONS && window.WORD_QUIZ_QUESTIONS.length)
      ? window.WORD_QUIZ_QUESTIONS
      : (typeof WORD_QUIZ_QUESTIONS !== 'undefined' ? WORD_QUIZ_QUESTIONS : []);

    questions.forEach(q => {
      const card = document.getElementById(`card-quiz-q${q.id}`) || document.getElementById(`quiz-card-${q.id}`);
      if (!card) return;

      const explBox = card.querySelector('.quiz-explanation-box') || document.getElementById(`exp-quiz-q${q.id}`);
      const selectedOption = quizState.answers[q.id];

      const optionBtns = card.querySelectorAll('.quiz-option-btn, .btn-quiz-option');
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

    if (scoreBanner) {
      const answeredCount = Object.keys(quizState.answers || {}).length;
      const safeScore = escapeHtml(quizState.score);
      const safeAnswered = escapeHtml(answeredCount);
      const safeStatus = quizState.passed ? 'LULUS (≥ 80%)' : 'BELUM LULUS';
      scoreBanner.innerHTML = `
        <div class="score-val">${safeScore} / 100</div>
        <div class="score-meta">${safeAnswered}/20 Terjawab — Status: <strong>${safeStatus}</strong></div>
      `;
    }

    updateWordNavBadges();
  }

  container.addEventListener('click', (e) => {
    const btn = e.target.closest('.quiz-option-btn, .btn-quiz-option');
    if (!btn) return;
    const qId = parseInt(btn.getAttribute('data-question-id'), 10);
    const optKey = btn.getAttribute('data-option');
    if (window.AppState && !isNaN(qId) && optKey) {
      window.AppState.updateQuizAnswer(qId, optKey);
      renderQuizUI();
      if (typeof updateWordReportPreview === 'function') {
        updateWordReportPreview();
      }
    }
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      const shouldReset = (typeof confirm === 'function') ? confirm('Reset seluruh jawaban kuis evaluasi Bab V?') : true;
      if (shouldReset && window.AppState) {
        window.AppState.resetQuiz();
        renderQuizUI();
        if (typeof updateWordReportPreview === 'function') {
          updateWordReportPreview();
        }
        if (typeof showToast === 'function') {
          showToast('Jawaban kuis Bab V berhasil diatur ulang', 'info', 2500);
        }
      }
    });
  }

  renderQuizUI();

  if (window.AppState) {
    window.AppState.on('quizUpdate', renderQuizUI);
    window.AppState.on('quizReset', renderQuizUI);
  }
}

function setupWordRubrik() {
  const container = document.getElementById('sec-word-rubrik');
  if (!container || !window.AppState) return;

  const state = window.AppState.getState();
  const reflections = state.reflections || {};
  const rubric = state.rubric || {};

  // 1. Setup 5 Reflection Textareas
  ['ref-repetitive', 'ref-challenging', 'ref-template', 'ref-risks', 'ref-collaboration'].forEach(promptId => {
    const textarea = document.getElementById(promptId) || document.getElementById(`input-word-${promptId}`);
    if (textarea) {
      if (reflections[promptId] !== undefined) {
        textarea.value = reflections[promptId];
      }
      textarea.addEventListener('input', (e) => {
        window.AppState.updateWordReflection(promptId, e.target.value);
      });
    }
  });

  // 2. Setup 15 Quality & Portfolio Checkboxes
  const allRubricKeys = [
    'word-chk-headings', 'word-chk-toc', 'word-chk-section-link', 'word-chk-page-num',
    'word-chk-mailmerge-valid', 'word-chk-mergefield-clean', 'word-chk-track-decided',
    'word-chk-comments-resolved', 'word-chk-sharing-inspected',
    'word-port-structure', 'word-port-multisection', 'word-port-template',
    'word-port-merge', 'word-port-review', 'word-port-qa-log'
  ];

  allRubricKeys.forEach(key => {
    const chk = document.getElementById(`chk-${key}`);
    if (chk) {
      if (rubric[key] !== undefined) {
        chk.checked = !!rubric[key];
      }
      chk.addEventListener('change', (e) => {
        window.AppState.updateWordRubric(key, e.target.checked);
        updateWordNavBadges();
        if (typeof updateWordReportPreview === 'function') {
          updateWordReportPreview();
        }
      });
    }
  });

  updateWordNavBadges();
}

let updateWordReportPreview = null;

function setupWordGraduationReport() {
  const container = document.getElementById('sec-word-report');
  if (!container) return;

  const nameInput = document.getElementById('input-word-participant-name') || document.getElementById('input-word-report-name');
  const nipInput = document.getElementById('input-word-participant-nip') || document.getElementById('input-word-report-nip');
  const unitInput = document.getElementById('input-word-participant-unit') || document.getElementById('input-word-report-unit');
  const docInput = document.getElementById('input-word-target-doc') || document.getElementById('input-word-report-doc');
  const dateInput = document.getElementById('input-word-report-date');
  const previewBox = document.getElementById('preview-word-report-text') || document.getElementById('word-report-output-preview');

  const copyWaBtn = document.getElementById('btn-copy-word-wa') || document.getElementById('btn-copy-word-report-wa');
  const copyTgBtn = document.getElementById('btn-copy-word-tg') || document.getElementById('btn-copy-word-report-tg');
  const printBtn = document.getElementById('btn-print-word-report');

  const state = (window.AppState && window.AppState.getState()) ? window.AppState.getState() : {};
  const pInfo = state.participantInfo || {};
  if (nameInput && pInfo.name) nameInput.value = pInfo.name;
  if (nipInput && pInfo.nip) nipInput.value = pInfo.nip;
  if (unitInput && pInfo.unitKerja) unitInput.value = pInfo.unitKerja;
  if (docInput && pInfo.targetDoc) docInput.value = pInfo.targetDoc;
  if (dateInput && pInfo.reportDate) dateInput.value = pInfo.reportDate;

  function updatePreview() {
    const overrides = {
      name: nameInput ? nameInput.value.trim() : '',
      nip: nipInput ? nipInput.value.trim() : '',
      unitKerja: unitInput ? unitInput.value.trim() : '',
      targetDoc: docInput ? docInput.value.trim() : '',
      reportDate: dateInput ? dateInput.value.trim() : ''
    };

    const text = generateWordReportText('whatsapp', overrides);
    if (previewBox) {
      previewBox.innerText = text;
    }

    // Update Certificate Slip Elements
    const certName = document.getElementById('cert-word-name');
    const certNip = document.getElementById('cert-word-nip');
    const certUnit = document.getElementById('cert-word-unit');
    const certDoc = document.getElementById('cert-word-doc');
    const certSignName = document.getElementById('cert-sign-participant');
    const certSignNip = document.getElementById('cert-sign-nip');

    if (certName) certName.innerText = overrides.name || '[Nama Lengkap Pegawai]';
    if (certNip) certNip.innerText = overrides.nip || '[NIP]';
    if (certUnit) certUnit.innerText = overrides.unitKerja || '[SKPD / Unit Kerja]';
    if (certDoc) certDoc.innerText = overrides.targetDoc || '[Jenis Naskah Dinas Portofolio]';
    if (certSignName) certSignName.innerText = overrides.name || '[Nama Lengkap Pegawai]';
    if (certSignNip) certSignNip.innerText = overrides.nip ? `NIP. ${overrides.nip}` : 'NIP. -';

    const certCp1 = document.getElementById('cert-word-cp1-val');
    const certCp2 = document.getElementById('cert-word-cp2-val');
    const certCp3 = document.getElementById('cert-word-cp3-val');
    const cps = (window.AppState && window.AppState.getState().checkpoints) || {};
    if (certCp1) certCp1.innerText = cps['word-cp-1'] === 'passed' ? 'Lolos ✓' : cps['word-cp-1'] === 'failed' ? 'Gagal ✕' : 'Pending';
    if (certCp2) certCp2.innerText = cps['word-cp-2'] === 'passed' ? 'Lolos ✓' : cps['word-cp-2'] === 'failed' ? 'Gagal ✕' : 'Pending';
    if (certCp3) certCp3.innerText = cps['word-cp-3'] === 'passed' ? 'Lolos ✓' : cps['word-cp-3'] === 'failed' ? 'Gagal ✕' : 'Pending';

    const certQuiz = document.getElementById('cert-word-quiz-score');
    const certPort = document.getElementById('cert-word-port-score');
    const certFinal = document.getElementById('cert-word-final-score');
    const certVerdict = document.getElementById('cert-word-verdict');

    if (window.AppState && typeof window.AppState.calculateWordGraduation === 'function') {
      const grad = window.AppState.calculateWordGraduation();
      if (certQuiz) certQuiz.innerText = `${grad.quizScore} / 100`;
      if (certPort) certPort.innerText = `${grad.portfolioScore} / 100`;
      if (certFinal) certFinal.innerText = `${grad.finalScore} / 100 (${grad.grade})`;
      if (certVerdict) certVerdict.innerText = grad.label;
    }

    updateWordNavBadges();
  }

  updateWordReportPreview = updatePreview;

  [
    { input: nameInput, field: 'name' },
    { input: nipInput, field: 'nip' },
    { input: unitInput, field: 'unitKerja' },
    { input: docInput, field: 'targetDoc' },
    { input: dateInput, field: 'reportDate' }
  ].forEach(({ input, field }) => {
    if (input) {
      input.addEventListener('input', (e) => {
        if (window.AppState) {
          window.AppState.updateParticipantInfo(field, e.target.value);
        }
        updatePreview();
      });
    }
  });

  if (copyWaBtn) {
    copyWaBtn.addEventListener('click', () => {
      const text = generateWordReportText('whatsapp');
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          if (typeof showToast === 'function') showToast('Laporan kelulusan WhatsApp berhasil disalin! 📲', 'success', 3000);
        }).catch(() => fallbackCopy(text, 'WhatsApp'));
      } else {
        fallbackCopy(text, 'WhatsApp');
      }
    });
  }

  if (copyTgBtn) {
    copyTgBtn.addEventListener('click', () => {
      const text = generateWordReportText('telegram');
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          if (typeof showToast === 'function') showToast('Format Markdown Telegram berhasil disalin! ✈️', 'success', 3000);
        }).catch(() => fallbackCopy(text, 'Telegram'));
      } else {
        fallbackCopy(text, 'Telegram');
      }
    });
  }

  if (printBtn) {
    printBtn.addEventListener('click', () => {
      if (typeof window.print === 'function') {
        window.print();
      }
    });
  }

  function fallbackCopy(text, channelName) {
    if (typeof document === 'undefined') return;
    const temp = document.createElement('textarea');
    temp.value = text;
    document.body.appendChild(temp);
    temp.select();
    if (typeof document.execCommand === 'function') {
      document.execCommand('copy');
    }
    document.body.removeChild(temp);
    if (typeof showToast === 'function') showToast(`Format ${channelName} berhasil disalin ke clipboard! 📋`, 'success', 2500);
  }

  updatePreview();

  if (window.AppState) {
    window.AppState.on('checkpointUpdate', updatePreview);
    window.AppState.on('rubricUpdate', updatePreview);
    window.AppState.on('quizUpdate', updatePreview);
    window.AppState.on('stateChanged', updatePreview);
    window.AppState.on('stateReset', updatePreview);
  }
}

/**
 * --- 17. DUAL-PURPOSE MODE SWITCHER CONTROLLER ---
 */
function updateModeUI(mode, showNotification = true) {
  const isPretraining = mode === 'pretraining';

  // 1. Update all mode tabs (header & sidebar)
  const modeTabs = document.querySelectorAll('.mode-tab');
  modeTabs.forEach(tab => {
    const tabMode = tab.getAttribute('data-mode');
    const isActive = tabMode === mode;
    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  // 2. Toggle main content containers
  const pretrainingContainer = document.getElementById('container-pretraining');
  const liveclassContainer = document.getElementById('container-liveclass');

  if (pretrainingContainer) {
    pretrainingContainer.style.display = isPretraining ? '' : 'none';
    pretrainingContainer.classList.toggle('active', isPretraining);
  }
  if (liveclassContainer) {
    liveclassContainer.style.display = isPretraining ? 'none' : '';
    liveclassContainer.classList.toggle('active', !isPretraining);
  }

  // 3. Toggle sidebar navigation groups
  const pretrainingNav = document.getElementById('nav-group-pretraining');
  const liveclassNav = document.getElementById('nav-group-liveclass');

  if (pretrainingNav) {
    pretrainingNav.style.display = isPretraining ? '' : 'none';
    pretrainingNav.classList.toggle('active', isPretraining);
  }
  if (liveclassNav) {
    liveclassNav.style.display = isPretraining ? 'none' : '';
    liveclassNav.classList.toggle('active', !isPretraining);
  }

  // 4. Update header subtitle
  const headerSubtitle = document.getElementById('header-brand-subtitle');
  if (headerSubtitle) {
    headerSubtitle.textContent = isPretraining
      ? 'Hands-on Agentic AI • Pra-Training'
      : 'Hands-on Agentic AI • Live Praktik Kelas';
  }

  // 5. Rebuild search index for active mode
  if (window.SearchEngine) {
    if (typeof window.SearchEngine.buildIndex === 'function') {
      window.SearchEngine.buildIndex();
    } else if (typeof window.SearchEngine.rebuildIndex === 'function') {
      window.SearchEngine.rebuildIndex();
    }
  }

  // 6. Scroll window smoothly to top
  if (typeof window.scrollTo === 'function') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // 7. Optional notification toast
  if (showNotification && typeof showToast === 'function') {
    const modeLabel = isPretraining ? 'Pra-Training (Persiapan)' : 'Hari-H (Praktik Kelas)';
    showToast(`Mode dialihkan ke: ${modeLabel}`, 'info', 2000);
  }
}

const LIVE_CLASS_UNLOCK_KEY = 'live_class_unlocked';
const WORD_COURSE_UNLOCK_KEY = 'learnwith_word_unlocked';
const INSTRUCTOR_PASSCODES = ['buka-kelas'];

// Default authorized SHA-256 hashes (Zero-Plaintext Security)
// 'buka-kata': ddf62f4013c59b111215312fb959629155a5b1dc5cf799f2053a8c2395c4511b
// 'kata-sandi-asn': 487da33ab431e57b68afa84059c0e7a95818f99cd9581054026f224fc7bba174
const DEFAULT_WORD_PASSCODE_HASHES = [
  'ddf62f4013c59b111215312fb959629155a5b1dc5cf799f2053a8c2395c4511b',
  '487da33ab431e57b68afa84059c0e7a95818f99cd9581054026f224fc7bba174'
];

function getAllowedWordPasscodeHashes() {
  if (typeof window !== 'undefined' && window.LEARNWITH_CONFIG && window.LEARNWITH_CONFIG.security && Array.isArray(window.LEARNWITH_CONFIG.security.allowedPasscodeHashes)) {
    return window.LEARNWITH_CONFIG.security.allowedPasscodeHashes;
  }
  return DEFAULT_WORD_PASSCODE_HASHES;
}

async function hashPasscodeSha256(rawStr) {
  const normalized = (rawStr || '').trim().toLowerCase();
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle && window.crypto.subtle.digest) {
    const encoder = new TextEncoder();
    const data = encoder.encode(normalized);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  if (typeof require !== 'undefined') {
    try {
      const crypto = require('crypto');
      return crypto.createHash('sha256').update(normalized).digest('hex');
    } catch (e) {}
  }
  return null;
}

async function verifyWordPasscode(inputCode) {
  if (!inputCode) return false;
  const hash = await hashPasscodeSha256(inputCode);
  if (!hash) return false;
  const allowed = getAllowedWordPasscodeHashes();
  return allowed.includes(hash);
}

/**
 * Session Security & Inactivity Manager (SEC-05, SEC-06)
 * - Tab-scoped session storage isolation
 * - Cryptographic checksum anti-tampering verification
 * - 15-minute sliding inactivity auto-lock
 * - Immediate URL history sanitization
 */
const SessionSecurityManager = (function() {
  'use strict';

  const STORAGE_KEY_PREFIX = 'lw_session_';
  let sessionSeed = null;
  let inactivityTimer = null;
  let lastActivityTimestamp = Date.now();
  let listenersAttached = false;
  const activeSessionChecksums = {};

  function getTimeoutMs() {
    let minutes = 15;
    if (typeof window !== 'undefined' && window.LEARNWITH_CONFIG && window.LEARNWITH_CONFIG.security && typeof window.LEARNWITH_CONFIG.security.sessionTimeoutMinutes === 'number') {
      minutes = window.LEARNWITH_CONFIG.security.sessionTimeoutMinutes;
    }
    return Math.max(1, minutes) * 60 * 1000;
  }

  function getSessionSeed() {
    if (typeof window !== 'undefined' && window.__LW_SESSION_SEED) {
      return window.__LW_SESSION_SEED;
    }
    if (!sessionSeed) {
      if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
        const arr = new Uint8Array(16);
        window.crypto.getRandomValues(arr);
        sessionSeed = Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
      } else if (typeof require !== 'undefined') {
        try {
          const crypto = require('crypto');
          sessionSeed = crypto.randomBytes(16).toString('hex');
        } catch (e) {
          sessionSeed = 'lw_seed_' + Math.random().toString(36).slice(2) + Date.now();
        }
      } else {
        sessionSeed = 'lw_seed_' + Math.random().toString(36).slice(2) + Date.now();
      }
      if (typeof window !== 'undefined') {
        window.__LW_SESSION_SEED = sessionSeed;
      }
    }
    return sessionSeed;
  }

  function computeChecksumSync(course, expiresAt) {
    if (typeof require !== 'undefined') {
      try {
        const crypto = require('crypto');
        const seed = getSessionSeed();
        const raw = `${course}:${expiresAt}:${seed}`.trim().toLowerCase();
        return crypto.createHash('sha256').update(raw).digest('hex');
      } catch (e) {}
    }
    return null;
  }

  async function computeChecksum(course, expiresAt) {
    const syncVal = computeChecksumSync(course, expiresAt);
    if (syncVal) return syncVal;
    const seed = getSessionSeed();
    const raw = `${course}:${expiresAt}:${seed}`;
    return await hashPasscodeSha256(raw);
  }

  function getStorageKey(course) {
    return STORAGE_KEY_PREFIX + (course === 'word' ? 'word' : 'live');
  }

  function purgeLegacyStorage() {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('learnwith_word_unlocked');
      }
    } catch (e) {}
  }

  function isSessionValid(course) {
    try {
      if (typeof sessionStorage === 'undefined') {
        if (course === 'live-class' && typeof localStorage !== 'undefined') {
          return localStorage.getItem(LIVE_CLASS_UNLOCK_KEY) === 'true';
        }
        return false;
      }

      const key = getStorageKey(course);
      const raw = sessionStorage.getItem(key);
      if (!raw) return false;

      let token;
      try {
        token = JSON.parse(raw);
      } catch (e) {
        sessionStorage.removeItem(key);
        delete activeSessionChecksums[course];
        return false;
      }

      if (!token || !token.unlocked || !token.expiresAt || !token.checksum) {
        sessionStorage.removeItem(key);
        delete activeSessionChecksums[course];
        return false;
      }

      // Check expiry
      if (Date.now() > token.expiresAt) {
        sessionStorage.removeItem(key);
        delete activeSessionChecksums[course];
        return false;
      }

      // Check integrity checksum
      const syncExpected = computeChecksumSync(course, token.expiresAt);
      if (syncExpected) {
        if (token.checksum !== syncExpected) {
          sessionStorage.removeItem(key);
          delete activeSessionChecksums[course];
          return false;
        }
        activeSessionChecksums[course] = syncExpected;
        return true;
      }

      // Browser Web Crypto memory validation check:
      if (activeSessionChecksums[course]) {
        if (activeSessionChecksums[course] === token.checksum) {
          return true;
        } else {
          // Token checksum doesn't match active verified session
          sessionStorage.removeItem(key);
          delete activeSessionChecksums[course];
          return false;
        }
      }

      // If token has not been verified yet in memory (e.g. after tab refresh):
      computeChecksum(course, token.expiresAt).then(expected => {
        if (expected && token.checksum === expected) {
          activeSessionChecksums[course] = expected;
        } else {
          sessionStorage.removeItem(key);
          delete activeSessionChecksums[course];
          if (course === 'word' && typeof setWordCourseUnlocked === 'function') {
            setWordCourseUnlocked(false);
          } else if (typeof setLiveClassUnlocked === 'function') {
            setLiveClassUnlocked(false);
          }
        }
      }).catch(() => {});

      return false;
    } catch (e) {
      return false;
    }
  }

  async function createToken(course, unlockedAt = Date.now(), expiresAt = null) {
    const exp = expiresAt || (unlockedAt + getTimeoutMs());
    let checksum = computeChecksumSync(course, exp);
    if (!checksum) {
      checksum = await computeChecksum(course, exp);
    }
    return {
      unlocked: true,
      course,
      unlockedAt,
      expiresAt: exp,
      checksum
    };
  }

  function setSessionSync(course, unlocked) {
    purgeLegacyStorage();
    if (typeof sessionStorage === 'undefined') return;
    const key = getStorageKey(course);

    if (!unlocked) {
      delete activeSessionChecksums[course];
      sessionStorage.removeItem(key);
      return;
    }

    const exp = Date.now() + getTimeoutMs();
    const syncChecksum = computeChecksumSync(course, exp);
    if (syncChecksum) {
      activeSessionChecksums[course] = syncChecksum;
      const token = {
        unlocked: true,
        course,
        unlockedAt: Date.now(),
        expiresAt: exp,
        checksum: syncChecksum
      };
      sessionStorage.setItem(key, JSON.stringify(token));
      startInactivityWatcher();
      return;
    }

    // Web Crypto async path
    computeChecksum(course, exp).then(cs => {
      activeSessionChecksums[course] = cs;
      const token = {
        unlocked: true,
        course,
        unlockedAt: Date.now(),
        expiresAt: exp,
        checksum: cs
      };
      sessionStorage.setItem(key, JSON.stringify(token));
      startInactivityWatcher();
    });
  }

  async function setSession(course, unlocked) {
    setSessionSync(course, unlocked);
  }

  function resetInactivityTimer() {
    const now = Date.now();
    if (now - lastActivityTimestamp < 2000) return;
    lastActivityTimestamp = now;

    const timeoutMs = getTimeoutMs();

    ['word', 'live-class'].forEach(course => {
      const key = getStorageKey(course);
      try {
        if (typeof sessionStorage !== 'undefined') {
          const raw = sessionStorage.getItem(key);
          if (raw) {
            const token = JSON.parse(raw);
            if (token && token.unlocked && Date.now() <= token.expiresAt) {
              token.expiresAt = Date.now() + timeoutMs;
              const newChecksum = computeChecksumSync(course, token.expiresAt);
              if (newChecksum) {
                token.checksum = newChecksum;
                activeSessionChecksums[course] = newChecksum;
                sessionStorage.setItem(key, JSON.stringify(token));
              } else {
                computeChecksum(course, token.expiresAt).then(cs => {
                  token.checksum = cs;
                  activeSessionChecksums[course] = cs;
                  sessionStorage.setItem(key, JSON.stringify(token));
                }).catch(() => {});
              }
            }
          }
        }
      } catch (e) {}
    });

    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
    }
    inactivityTimer = setTimeout(() => {
      triggerAutoLock('inactivity');
    }, timeoutMs);
  }

  function triggerAutoLock(reason = 'inactivity') {
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
      inactivityTimer = null;
    }

    delete activeSessionChecksums['word'];
    delete activeSessionChecksums['live-class'];

    try {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.removeItem(getStorageKey('word'));
        sessionStorage.removeItem(getStorageKey('live-class'));
      }
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(LIVE_CLASS_UNLOCK_KEY);
        localStorage.removeItem(WORD_COURSE_UNLOCK_KEY);
      }
    } catch (e) {}

    if (typeof setWordCourseUnlocked === 'function') {
      setWordCourseUnlocked(false);
    }
    if (typeof setLiveClassUnlocked === 'function') {
      setLiveClassUnlocked(false);
    }

    if (typeof window !== 'undefined' && window.AppState) {
      const currentCourse = window.AppState.getActiveCourse ? window.AppState.getActiveCourse() : null;
      if (currentCourse === 'word') {
        if (typeof switchView === 'function') {
          switchView('home', null, true, false);
        }
      }
    }

    if (reason === 'inactivity' && typeof showToast === 'function') {
      showToast('Sesi telah berakhir karena tidak ada aktivitas. Modul otomatis dikunci demi keamanan.', 'warning', 4500);
    }
  }

  function startInactivityWatcher() {
    if (listenersAttached || typeof window === 'undefined' || !window.addEventListener) return;
    listenersAttached = true;

    const activityEvents = ['mousemove', 'keydown', 'touchstart', 'scroll', 'click'];
    activityEvents.forEach(evt => {
      window.addEventListener(evt, resetInactivityTimer, { passive: true });
    });

    resetInactivityTimer();
  }

  async function processUrlAuthorization() {
    if (typeof window === 'undefined' || !window.location) return;

    purgeLegacyStorage();

    let search = window.location.search;
    if (!search && window.location.href && window.location.href.includes('?')) {
      search = '?' + window.location.href.split('?')[1].split('#')[0];
    }
    if (!search) return;

    const params = new URLSearchParams(search);

    // SEC-05: Check for authorized passcode or token
    const codeParam = params.get('code') || params.get('unlock_code') || params.get('passcode') || params.get('token');

    let authorizedWord = false;
    let authorizedLive = false;

    if (codeParam) {
      const trimmed = codeParam.trim();
      const codeHash = await hashPasscodeSha256(trimmed);
      const allowedWordHashes = getAllowedWordPasscodeHashes();

      if (codeHash && allowedWordHashes.includes(codeHash)) {
        authorizedWord = true;
      }

      if (INSTRUCTOR_PASSCODES.includes(trimmed.toLowerCase())) {
        authorizedLive = true;
      }
    }

    if (authorizedWord) {
      setSessionSync('word', true);
      if (typeof setWordCourseUnlocked === 'function') {
        setWordCourseUnlocked(true);
      }
    }

    if (authorizedLive) {
      setSessionSync('live-class', true);
      if (typeof setLiveClassUnlocked === 'function') {
        setLiveClassUnlocked(true);
      }
    }

    // SEC-05: Cleanse URL immediately via history.replaceState
    if (window.history && typeof window.history.replaceState === 'function') {
      try {
        const cleanParams = new URLSearchParams(search);
        ['code', 'unlock_code', 'passcode', 'token', 'unlock', 'auth'].forEach(k => cleanParams.delete(k));

        let newSearch = cleanParams.toString();
        newSearch = newSearch ? `?${newSearch}` : '';
        const newUrl = `${window.location.pathname}${newSearch}${window.location.hash || ''}`;
        window.history.replaceState({}, document.title, newUrl);
      } catch (e) {}
    }
  }

  async function init() {
    getSessionSeed();
    purgeLegacyStorage();
    await processUrlAuthorization();
    if (isSessionValid('word') || isSessionValid('live-class')) {
      startInactivityWatcher();
    }
  }

  return {
    init,
    createToken,
    isSessionValid,
    setSession,
    setSessionSync,
    computeChecksum,
    computeChecksumSync,
    getSessionSeed,
    resetInactivityTimer,
    triggerAutoLock,
    startInactivityWatcher,
    processUrlAuthorization,
    purgeLegacyStorage
  };
})();

function isLiveClassUnlocked() {
  if (typeof sessionStorage !== 'undefined') {
    return SessionSecurityManager.isSessionValid('live-class');
  }
  try {
    if (typeof localStorage !== 'undefined' && localStorage.getItem(LIVE_CLASS_UNLOCK_KEY) === 'true') {
      return true;
    }
  } catch (e) {}
  return false;
}

function setLiveClassUnlocked(unlocked = true) {
  SessionSecurityManager.setSessionSync('live-class', unlocked);

  try {
    if (unlocked) {
      localStorage.setItem(LIVE_CLASS_UNLOCK_KEY, 'true');
    } else {
      localStorage.removeItem(LIVE_CLASS_UNLOCK_KEY);
    }
  } catch (e) {}

  // Update lock icons in DOM
  const lockHeader = document.getElementById('lock-icon-header');
  const lockSidebar = document.getElementById('lock-icon-sidebar');
  if (lockHeader) lockHeader.classList.toggle('unlocked', unlocked);
  if (lockSidebar) lockSidebar.classList.toggle('unlocked', unlocked);
}

function setupModeSwitcher() {
  const modeTabs = document.querySelectorAll('.mode-tab');
  if (!modeTabs.length) return;

  const lockedModal = document.getElementById('modal-liveclass-locked');
  const closeLockedBtn = document.getElementById('btn-close-locked-modal');
  const toggleUnlockBtn = document.getElementById('toggle-instructor-unlock');
  const unlockForm = document.getElementById('instructor-unlock-form');
  const unlockInput = document.getElementById('input-unlock-code');
  const submitUnlockBtn = document.getElementById('btn-submit-unlock');
  const unlockFeedback = document.getElementById('unlock-feedback');

  function openLockedModal() {
    if (!lockedModal) return;
    lockedModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (closeLockedBtn) closeLockedBtn.focus();
  }

  function closeLockedModal() {
    if (!lockedModal) return;
    lockedModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (closeLockedBtn) {
    closeLockedBtn.addEventListener('click', closeLockedModal);
  }

  if (lockedModal) {
    lockedModal.addEventListener('click', (e) => {
      if (e.target === lockedModal) closeLockedModal();
    });
  }

  if (toggleUnlockBtn && unlockForm) {
    toggleUnlockBtn.addEventListener('click', () => {
      const isVisible = unlockForm.style.display !== 'none';
      unlockForm.style.display = isVisible ? 'none' : 'block';
      if (!isVisible && unlockInput) unlockInput.focus();
    });
  }

  function handleUnlockSubmit() {
    if (!unlockInput) return;
    const code = (unlockInput.value || '').trim().toLowerCase();
    if (INSTRUCTOR_PASSCODES.includes(code)) {
      setLiveClassUnlocked(true);
      closeLockedModal();
      if (typeof showToast === 'function') {
        showToast('🔓 Kunci Sesi Praktik Kelas berhasil dibuka!', 'success', 3000);
      }
      if (window.AppState) {
        window.AppState.setMode('live-class');
      }
    } else {
      if (unlockFeedback) {
        unlockFeedback.textContent = 'Kode salah. Silakan periksa kembali.';
        unlockFeedback.style.display = 'block';
      }
    }
  }

  if (submitUnlockBtn) {
    submitUnlockBtn.addEventListener('click', handleUnlockSubmit);
  }

  if (unlockInput) {
    unlockInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleUnlockSubmit();
      }
    });
  }

  // Sync initial lock icon status
  if (isLiveClassUnlocked()) {
    setLiveClassUnlocked(true);
  }

  // Click handlers on all mode buttons
  modeTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      const targetMode = tab.getAttribute('data-mode');

      // Intercept if target is live-class and still locked
      if (targetMode === 'live-class' && !isLiveClassUnlocked()) {
        openLockedModal();
        return;
      }

      if (targetMode && window.AppState) {
        window.AppState.setMode(targetMode);
      }
    });
  });

  // Listen to state modeChange events
  if (window.AppState) {
    window.AppState.on('modeChange', (newMode) => {
      updateModeUI(newMode, true);
    });

    // Hydrate initial mode from StateManager without alert toast
    const initialMode = window.AppState.getActiveMode ? window.AppState.getActiveMode() : 'pretraining';
    updateModeUI(initialMode, false);
  }
}

function isWordCourseUnlocked() {
  if (typeof sessionStorage !== 'undefined') {
    return SessionSecurityManager.isSessionValid('word');
  }
  try {
    if (typeof localStorage !== 'undefined' && localStorage.getItem(WORD_COURSE_UNLOCK_KEY) === 'true') {
      return true;
    }
  } catch (e) {}
  return false;
}

function setWordCourseUnlocked(unlocked = true) {
  if (typeof sessionStorage !== 'undefined') {
    SessionSecurityManager.setSessionSync('word', unlocked);
  } else {
    try {
      if (unlocked) {
        localStorage.setItem(WORD_COURSE_UNLOCK_KEY, 'true');
      } else {
        localStorage.removeItem(WORD_COURSE_UNLOCK_KEY);
      }
    } catch (e) {}
  }

  const badgeWord = document.getElementById('badge-word-locked');
  const sidebarWordLock = document.getElementById('sidebar-word-locked');
  if (badgeWord) badgeWord.classList.toggle('unlocked', unlocked);
  if (sidebarWordLock) sidebarWordLock.classList.toggle('unlocked', unlocked);

  const homeWordBadge = document.getElementById('home-badge-word-status');
  const btnHomeWordLabel = document.getElementById('btn-home-word-label');
  if (homeWordBadge) {
    homeWordBadge.textContent = unlocked ? '✅ Akses Terbuka' : '🔒 Perlu Kode Sandi';
    homeWordBadge.className = unlocked ? 'badge badge-pill badge-success' : 'badge badge-pill badge-neutral';
  }
  if (btnHomeWordLabel) {
    btnHomeWordLabel.textContent = unlocked ? 'Buka Modul Pengolahan Kata' : 'Buka Akses Modul';
  }
}

function switchView(viewMode, targetCourse = null, updateUrl = true, showNotification = false) {
  const containerHome = document.getElementById('container-home');
  const containerAi = document.getElementById('container-course-ai');
  const containerWord = document.getElementById('container-course-word');
  const appContainer = (typeof document !== 'undefined' && typeof document.querySelector === 'function') ? document.querySelector('.app-container') : null;

  if (viewMode === 'home') {
    if (appContainer) appContainer.classList.add('view-home');
    if (containerHome) containerHome.style.display = 'block';
    if (containerAi) containerAi.style.display = 'none';
    if (containerWord) containerWord.style.display = 'none';

    // Update active state on dropdown items
    const dropdownItems = document.querySelectorAll('.course-dropdown-item');
    dropdownItems.forEach(item => {
      const isHome = item.getAttribute('data-course') === 'home';
      item.classList.toggle('active', isHome);
      item.setAttribute('aria-selected', isHome ? 'true' : 'false');
    });

    document.title = 'learnwith — Pusat Modul Praktik & Workshop Interaktif';

    if (updateUrl && typeof window !== 'undefined' && window.history && window.location) {
      try {
        const url = new URL(window.location.href);
        url.searchParams.delete('course');
        window.history.replaceState({}, '', url.pathname);
      } catch (e) {}
    }

    if (typeof window.scrollTo === 'function') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    return;
  }

  // Viewing Workspace
  if (appContainer) appContainer.classList.remove('view-home');
  if (containerHome) containerHome.style.display = 'none';

  if (targetCourse) {
    switchCourse(targetCourse, updateUrl, showNotification);
  }
}

function switchCourse(courseId, updateUrl = true, showNotification = true) {
  if (courseId === 'home') {
    switchView('home', null, updateUrl, showNotification);
    return;
  }

  const appContainer = (typeof document !== 'undefined' && typeof document.querySelector === 'function') ? document.querySelector('.app-container') : null;
  if (appContainer) appContainer.classList.remove('view-home');
  const containerHome = document.getElementById('container-home');
  if (containerHome) containerHome.style.display = 'none';

  const validCourse = (courseId === 'word') ? 'word' : 'ai';

  // 1. Update StateManager if present
  if (window.AppState && typeof window.AppState.setCourse === 'function') {
    window.AppState.setCourse(validCourse);
  }

  // 2. Update Container Visibility
  const containerAi = document.getElementById('container-course-ai');
  const containerWord = document.getElementById('container-course-word');
  const headerModeSwitcher = document.getElementById('header-mode-switcher');
  const sidebarModeSwitcher = document.getElementById('sidebar-mode-switcher-container');
  const navGroupPretraining = document.getElementById('nav-group-pretraining');
  const navGroupLiveclass = document.getElementById('nav-group-liveclass');
  const navGroupWord = document.getElementById('nav-group-word');

  if (validCourse === 'word') {
    if (containerAi) containerAi.style.display = 'none';
    if (containerWord) containerWord.style.display = 'block';
    if (headerModeSwitcher) headerModeSwitcher.style.display = 'none';
    if (sidebarModeSwitcher) sidebarModeSwitcher.style.display = 'none';
    if (navGroupPretraining) navGroupPretraining.style.display = 'none';
    if (navGroupLiveclass) navGroupLiveclass.style.display = 'none';
    if (navGroupWord) {
      navGroupWord.style.display = 'block';
      navGroupWord.classList.add('active');
    }

    // Re-sync Course 2 checklist checkboxes and checkpoint cards from active state
    if (typeof setupChecklistListeners === 'function') {
      setupChecklistListeners();
    }
    const wordCps = (window.AppState && window.AppState.getState) ? (window.AppState.getState().checkpoints || {}) : {};
    ['word-cp-1', 'word-cp-2', 'word-cp-3'].forEach(cpId => {
      updateCheckpointCardUI(cpId, wordCps[cpId] || 'pending');
    });

    if (typeof updateProgressUI === 'function') {
      updateProgressUI();
    }
  } else {
    if (containerAi) containerAi.style.display = 'block';
    if (containerWord) containerWord.style.display = 'none';
    if (headerModeSwitcher) headerModeSwitcher.style.display = 'flex';
    if (sidebarModeSwitcher) sidebarModeSwitcher.style.display = 'block';
    if (navGroupWord) {
      navGroupWord.style.display = 'none';
      navGroupWord.classList.remove('active');
    }
    
    // Restore Course 1 active mode navigation
    const activeMode = (window.AppState && window.AppState.getActiveMode) ? window.AppState.getActiveMode() : 'pretraining';
    if (typeof updateModeUI === 'function') {
      updateModeUI(activeMode, false);
    }

    // Re-sync Course 1 checkboxes and checkpoints
    if (typeof setupChecklistListeners === 'function') {
      setupChecklistListeners();
    }
    const aiCps = (window.AppState && window.AppState.getState) ? (window.AppState.getState().checkpoints || {}) : {};
    ['cp-1', 'cp-2', 'cp-3', 'cp-4', 'cp-5', 'cp-6', 'cp-7', 'cp-8', 'cp-9'].forEach(cpId => {
      updateCheckpointCardUI(cpId, aiCps[cpId] || 'pending');
    });

    if (typeof updateProgressUI === 'function') {
      updateProgressUI();
    }
  }


  // 3. Update Header & Sidebar UI Titles
  const brandTitle = document.getElementById('header-brand-title');
  const brandSubtitle = document.getElementById('header-brand-subtitle');
  const currentCourseIcon = document.getElementById('current-course-icon');
  const currentCourseName = document.getElementById('current-course-name');
  const sidebarCourseIcon = document.getElementById('sidebar-course-icon');
  const sidebarCourseName = document.getElementById('sidebar-course-name');

  if (validCourse === 'word') {
    if (brandTitle) brandTitle.textContent = 'Pengolahan Kata Tingkat Lanjut';
    if (brandSubtitle) brandSubtitle.textContent = 'Pengolahan Kata Tingkat Lanjut • Modul Praktik ASN';
    if (currentCourseIcon) currentCourseIcon.textContent = '📝';
    if (currentCourseName) currentCourseName.textContent = 'Pengolahan Kata Lanjut';
    if (sidebarCourseIcon) sidebarCourseIcon.textContent = '📝';
    if (sidebarCourseName) sidebarCourseName.textContent = 'Pengolahan Kata Lanjut';
    document.title = 'Pengolahan Kata Tingkat Lanjut — Modul Praktik Terpadu ASN';
  } else {
    if (brandTitle) brandTitle.textContent = 'Hands-on Agentic AI';
    const activeMode = (window.AppState && window.AppState.getActiveMode) ? window.AppState.getActiveMode() : 'pretraining';
    const modeLabel = activeMode === 'live-class' ? 'Live Praktik Kelas' : 'Pra-Training';
    if (brandSubtitle) brandSubtitle.textContent = `Hands-on Agentic AI • ${modeLabel}`;
    if (currentCourseIcon) currentCourseIcon.textContent = '🤖';
    if (currentCourseName) currentCourseName.textContent = 'Hands-on Agentic AI';
    if (sidebarCourseIcon) sidebarCourseIcon.textContent = '🤖';
    if (sidebarCourseName) sidebarCourseName.textContent = 'Hands-on Agentic AI';
    document.title = 'Hands-on Agentic AI: Dari Chat ke Kalender — Panduan Praktik Interaktif';
  }

  // 4. Update Dropdown Items Active State
  const dropdownItems = document.querySelectorAll('.course-dropdown-item');
  dropdownItems.forEach(item => {
    const itemCourse = item.getAttribute('data-course');
    const isSelected = itemCourse === validCourse;
    item.classList.toggle('active', isSelected);
    item.setAttribute('aria-selected', isSelected ? 'true' : 'false');
  });

  // 5. Update URL Parameter without reloading page
  if (updateUrl && typeof window !== 'undefined' && window.history && window.location) {
    try {
      const url = new URL(window.location.href);
      if (validCourse === 'word') {
        url.searchParams.set('course', 'word');
      } else {
        url.searchParams.delete('course');
      }
      window.history.replaceState({}, '', url.toString());
    } catch (e) {}
  }

  // 6. Rebuild Search Index for Active Course
  if (window.SearchEngine && typeof window.SearchEngine.buildIndex === 'function') {
    window.SearchEngine.buildIndex();
  }

  // 7. Notification Toast
  if (showNotification && typeof showToast === 'function') {
    const courseTitle = (validCourse === 'word') ? 'Pengolahan Kata Tingkat Lanjut (ASN)' : 'Hands-on Agentic AI';
    showToast(`Beralih ke kursus: ${courseTitle}`, 'info', 2500);
  }
}

function setupCourseManager() {
  const dropdownBtn = document.getElementById('btn-course-dropdown');
  const dropdownMenu = document.getElementById('course-dropdown-menu');
  const dropdownItems = document.querySelectorAll('.course-dropdown-item');
  const sidebarCourseBtn = document.getElementById('btn-sidebar-course-select');
  const returnAiBtn = document.getElementById('btn-return-course-ai');

  const wordLockedModal = document.getElementById('modal-wordcourse-locked');
  const closeWordLockedBtn = document.getElementById('btn-close-word-locked');
  const wordUnlockInput = document.getElementById('input-word-unlock-code');
  const wordUnlockSubmitBtn = document.getElementById('btn-submit-word-unlock');
  const wordUnlockFeedback = document.getElementById('word-unlock-feedback');

  function openWordLockedModal() {
    if (!wordLockedModal) return;
    wordLockedModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (wordUnlockInput) {
      wordUnlockInput.value = '';
      wordUnlockInput.focus();
    }
    if (wordUnlockFeedback) wordUnlockFeedback.style.display = 'none';
  }

  function closeWordLockedModal() {
    if (!wordLockedModal) return;
    wordLockedModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (closeWordLockedBtn) {
    closeWordLockedBtn.addEventListener('click', () => {
      closeWordLockedModal();
      if (typeof switchView === 'function') {
        switchView('home', null, true, false);
      }
    });
  }

  if (wordLockedModal) {
    wordLockedModal.addEventListener('click', (e) => {
      if (e.target === wordLockedModal) {
        closeWordLockedModal();
        if (typeof switchView === 'function') {
          switchView('home', null, true, false);
        }
      }
    });
  }

  async function handleWordUnlockSubmit() {
    if (!wordUnlockInput) return;
    const code = (wordUnlockInput.value || '').trim();
    if (!code) {
      if (wordUnlockFeedback) {
        wordUnlockFeedback.textContent = 'Silakan masukkan kode sandi terlebih dahulu.';
        wordUnlockFeedback.style.display = 'block';
      }
      return;
    }

    if (wordUnlockSubmitBtn) {
      wordUnlockSubmitBtn.disabled = true;
      wordUnlockSubmitBtn.textContent = 'Memverifikasi...';
    }

    try {
      const isValid = await verifyWordPasscode(code);
      if (isValid) {
        setWordCourseUnlocked(true);
        closeWordLockedModal();
        if (typeof showToast === 'function') {
          showToast('🔓 Modul Pengolahan Kata Tingkat Lanjut berhasil dibuka!', 'success', 3000);
        }
        switchCourse('word', true, true);
      } else {
        if (wordUnlockFeedback) {
          wordUnlockFeedback.textContent = 'Kode sandi salah. Silakan hubungi instruktur pelatihan.';
          wordUnlockFeedback.style.display = 'block';
        }
      }
    } catch (err) {
      if (wordUnlockFeedback) {
        wordUnlockFeedback.textContent = 'Terjadi kesalahan saat memverifikasi kode sandi.';
        wordUnlockFeedback.style.display = 'block';
      }
    } finally {
      if (wordUnlockSubmitBtn) {
        wordUnlockSubmitBtn.disabled = false;
        wordUnlockSubmitBtn.textContent = 'Buka Modul';
      }
    }
  }

  if (wordUnlockSubmitBtn) {
    wordUnlockSubmitBtn.addEventListener('click', handleWordUnlockSubmit);
  }

  if (wordUnlockInput) {
    wordUnlockInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleWordUnlockSubmit();
      }
    });
  }

  // Header Dropdown Toggle
  if (dropdownBtn && dropdownMenu) {
    dropdownBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dropdownMenu.classList.contains('show');
      dropdownMenu.classList.toggle('show', !isOpen);
      dropdownBtn.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
    });

    document.addEventListener('click', (e) => {
      if (!dropdownBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
        dropdownMenu.classList.remove('show');
        dropdownBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Sidebar Course Toggle
  if (sidebarCourseBtn) {
    sidebarCourseBtn.addEventListener('click', () => {
      const current = (window.AppState && window.AppState.getActiveCourse) ? window.AppState.getActiveCourse() : 'ai';
      const target = current === 'ai' ? 'word' : 'ai';
      if (target === 'word' && !isWordCourseUnlocked()) {
        openWordLockedModal();
      } else {
        switchCourse(target, true, true);
      }
    });
  }

  // Return to AI Button
  if (returnAiBtn) {
    returnAiBtn.addEventListener('click', () => {
      switchCourse('ai', true, true);
    });
  }

  // Brand Logo Click -> Return to Home Hub
  const brandHomeLink = document.getElementById('brand-home-link');
  if (brandHomeLink) {
    brandHomeLink.addEventListener('click', (e) => {
      e.preventDefault();
      switchView('home', null, true, false);
    });
  }

  // Home Card Enter AI Button
  const btnHomeEnterAi = document.getElementById('btn-home-enter-ai');
  if (btnHomeEnterAi) {
    btnHomeEnterAi.addEventListener('click', () => {
      switchView('workspace', 'ai', true, false);
    });
  }

  // Home Card Enter Word Button
  const btnHomeEnterWord = document.getElementById('btn-home-enter-word');
  if (btnHomeEnterWord) {
    btnHomeEnterWord.addEventListener('click', () => {
      if (!isWordCourseUnlocked()) {
        openWordLockedModal();
      } else {
        switchView('workspace', 'word', true, false);
      }
    });
  }

  // Home Card View Standards Button
  const btnHomeViewStandards = document.getElementById('btn-home-view-standards');
  if (btnHomeViewStandards) {
    btnHomeViewStandards.addEventListener('click', () => {
      if (!isWordCourseUnlocked()) {
        openWordLockedModal();
      } else {
        switchView('workspace', 'word', true, false);
        const secStandards = document.getElementById('sec-word-standards');
        if (secStandards) secStandards.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Home Filter Chips
  const homeChips = document.querySelectorAll('.home-chip');
  homeChips.forEach(chip => {
    chip.addEventListener('click', () => {
      homeChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const filter = chip.getAttribute('data-filter');
      const cards = document.querySelectorAll('.notebook-card');
      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Dropdown Item Selection
  dropdownItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetCourse = item.getAttribute('data-course');
      if (dropdownMenu) {
        dropdownMenu.classList.remove('show');
        if (dropdownBtn) dropdownBtn.setAttribute('aria-expanded', 'false');
      }

      if (targetCourse === 'home') {
        switchView('home', null, true, false);
        return;
      }

      if (targetCourse === 'word' && !isWordCourseUnlocked()) {
        openWordLockedModal();
        return;
      }

      switchView('workspace', targetCourse, true, true);
    });
  });

  // Sync initial lock status
  if (isWordCourseUnlocked()) {
    setWordCourseUnlocked(true);
  }

  // Determine initial view/course from URL
  let initialMode = 'home';
  let initialCourse = 'ai';
  if (typeof window !== 'undefined' && window.location && window.location.search) {
    const params = new URLSearchParams(window.location.search);
    const courseParam = (params.get('course') || '').toLowerCase();
    if (courseParam === 'word' || courseParam === 'kata') {
      initialMode = 'workspace';
      initialCourse = 'word';
    } else if (courseParam === 'ai') {
      initialMode = 'workspace';
      initialCourse = 'ai';
    }
  }

  if (initialMode === 'workspace') {
    switchView('workspace', initialCourse, false, false);
  } else {
    // Default to Google NotebookLM Frontpage Hub
    switchView('home', null, false, false);
  }
}

if (typeof window !== 'undefined') {
  window.updateModeUI = updateModeUI;
  window.isLiveClassUnlocked = isLiveClassUnlocked;
  window.setLiveClassUnlocked = setLiveClassUnlocked;
  window.INSTRUCTOR_PASSCODES = INSTRUCTOR_PASSCODES;
  window.isWordCourseUnlocked = isWordCourseUnlocked;
  window.setWordCourseUnlocked = setWordCourseUnlocked;
  window.switchView = switchView;
  window.switchCourse = switchCourse;
  window.setupCourseManager = setupCourseManager;
  window.hashPasscodeSha256 = hashPasscodeSha256;
  window.verifyWordPasscode = verifyWordPasscode;
  window.generateWordReportText = generateWordReportText;
  window.setupWordQuiz = setupWordQuiz;
  window.setupWordRubrik = setupWordRubrik;
  window.setupWordGraduationReport = setupWordGraduationReport;
  window.updateWordNavBadges = updateWordNavBadges;
  window.SessionSecurityManager = SessionSecurityManager;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    REDACTION_RULES,
    sanitizeLogText,
    generateReportText,
    setupReadinessReport,
    generateLiveReportText,
    setupLiveReport,
    generateWordReportText,
    setupWordQuiz,
    setupWordRubrik,
    setupWordGraduationReport,
    updateWordNavBadges,
    showToast,
    setupMobileDrawer,
    setupModuleAccordions,
    setupTroubleshootingHub,
    setupLiveTroubleshootingHub,
    setupCodeCopy,
    setupModeSwitcher,
    updateModeUI,
    isLiveClassUnlocked,
    setLiveClassUnlocked,
    INSTRUCTOR_PASSCODES,
    isWordCourseUnlocked,
    setWordCourseUnlocked,
    switchView,
    switchCourse,
    setupCourseManager,
    verifyWordPasscode,
    hashPasscodeSha256,
    getAllowedWordPasscodeHashes,
    SessionSecurityManager,
    escapeHtml
  };
}


