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

  // 11. Initial Progress calculation
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
      const item = checkbox.closest('.checklist-item');
      if (item) {
        if (checkbox.checked) item.classList.add('completed');
        else item.classList.remove('completed');
      }
    }

    checkbox.addEventListener('change', (e) => {
      const completed = e.target.checked;
      window.AppState.updateChecklist(taskId, completed);
      const item = e.target.closest('.checklist-item');
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

