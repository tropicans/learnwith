/**
 * ==========================================================================
 * PRE-TRAINING INTERACTIVE WEB APP - REAL-TIME SEARCH & HIGHLIGHTING ENGINE
 * ==========================================================================
 */

class SearchEngine {
  constructor() {
    this.searchInput = null;
    this.searchItems = [];
    this.debounceTimer = null;
    this.activeQuery = '';
    this.resultsCountEl = null;
  }

  /**
   * Initialize search listeners and index DOM items
   */
  init() {
    this.searchInput = document.getElementById('global-search-input');
    if (!this.searchInput) return;

    this.buildIndex();

    // Event listener on search input with debounce
    this.searchInput.addEventListener('input', (e) => {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.performSearch(e.target.value.trim());
      }, 150);
    });

    // Keyboard Shortcuts: Ctrl+K / Cmd+K or / to focus, Escape to clear
    document.addEventListener('keydown', (e) => {
      // Ignore if user is typing in another input / textarea
      const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
      if (['textarea', 'select'].includes(activeTag) || (activeTag === 'input' && document.activeElement !== this.searchInput)) {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.searchInput.focus();
        this.searchInput.select();
      } else if (e.key === '/' && document.activeElement !== this.searchInput) {
        e.preventDefault();
        this.searchInput.focus();
      } else if (e.key === 'Escape' && document.activeElement === this.searchInput) {
        this.clearSearch();
        this.searchInput.blur();
      }
    });
  }

  /**
   * Scan DOM and index searchable elements
   */
  buildIndex() {
    this.searchItems = [];
    const elements = document.querySelectorAll('.content-section, .card, .step-card, .module-card, .step-section, .alert-box, .checkpoint-gate-card');

    elements.forEach((el, index) => {
      // Store original HTML for highlight restoration
      if (!el.hasAttribute('data-search-id')) {
        el.setAttribute('data-search-id', `s-item-${index}`);
        el.dataset.originalHtml = el.innerHTML;
      }

      const text = el.innerText || el.textContent || '';
      this.searchItems.push({
        id: `s-item-${index}`,
        element: el,
        text: text.toLowerCase(),
        originalHtml: el.dataset.originalHtml
      });
    });
  }

  /**
   * Rebuild index (useful after dynamically populating or expanding modules)
   */
  rebuildIndex() {
    this.buildIndex();
  }

  /**
   * Execute real-time query search
   */
  performSearch(query) {
    this.activeQuery = query;
    const lowerQuery = query.toLowerCase();

    // If query is empty, reset all elements to visible and restore original HTML
    if (!query) {
      this.clearHighlights();
      this.searchItems.forEach(item => {
        item.element.style.display = '';
        const parentSection = item.element.closest('.content-section');
        if (parentSection) parentSection.style.display = '';
      });
      return;
    }

    let matchCount = 0;
    const matchedSections = new Set();
    const matchedModules = new Set();

    this.searchItems.forEach(item => {
      const isMatch = item.text.includes(lowerQuery);
      
      if (isMatch) {
        matchCount++;
        item.element.style.display = '';
        
        // Auto-expand parent module card if it's collapsed
        const parentModule = item.element.closest('.module-card');
        if (parentModule) {
          parentModule.classList.remove('collapsed');
          const chevron = parentModule.querySelector('.module-chevron');
          if (chevron) chevron.style.transform = 'rotate(0deg)';
          matchedModules.add(parentModule);
        }

        const parentSection = item.element.closest('.content-section');
        if (parentSection) {
          parentSection.style.display = '';
          matchedSections.add(parentSection);
        }
        this.highlightText(item.element, query);
      } else {
        // Only hide direct cards or steps if parent isn't matched
        if (item.element.classList.contains('card') || item.element.classList.contains('step-card')) {
          item.element.style.display = 'none';
        }
      }
    });

    // Hide sections that have zero matches
    document.querySelectorAll('.content-section').forEach(section => {
      if (!matchedSections.has(section) && !section.innerText.toLowerCase().includes(lowerQuery)) {
        section.style.display = 'none';
      } else {
        section.style.display = '';
      }
    });

    if (window.showToast && matchCount === 0) {
      window.showToast(`Tidak ditemukan hasil untuk "${query}"`, 'info', 2000);
    }
  }

  /**
   * Highlight matching query text in element
   */
  highlightText(element, query) {
    if (!query) return;
    const original = element.dataset.originalHtml;
    if (!original) return;

    try {
      const regex = new RegExp(`(${this.escapeRegExp(query)})`, 'gi');
      // Simple safe replacer preserving HTML tags
      element.innerHTML = original.replace(/(>[^<]+<)/g, (match) => {
        return match.replace(regex, '<mark class="search-highlight">$1</mark>');
      });
    } catch (e) {
      // Fallback
    }
  }

  /**
   * Restore elements to original unhighlighted state
   */
  clearHighlights() {
    this.searchItems.forEach(item => {
      if (item.element.dataset.originalHtml) {
        item.element.innerHTML = item.element.dataset.originalHtml;
      }
    });
  }

  /**
   * Clear search input and restore view
   */
  clearSearch() {
    if (this.searchInput) {
      this.searchInput.value = '';
    }
    this.performSearch('');
  }

  escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}

// Global SearchEngine Singleton
window.SearchEngine = new SearchEngine();

