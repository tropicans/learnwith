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
    this.clearHighlights();
    this.searchItems = [];
    const elements = document.querySelectorAll('.content-section, .card, .step-card, .module-card, .step-section, .alert-box, .checkpoint-gate-card');

    const activeCourse = (window.AppState && typeof window.AppState.getActiveCourse === 'function')
      ? window.AppState.getActiveCourse()
      : 'ai';

    elements.forEach((el, index) => {
      // Skip elements that belong to a currently hidden course container or inactive course
      const parentCourseContainer = el.closest('#container-course-ai, #container-course-word');
      if (parentCourseContainer) {
        if (parentCourseContainer.style.display === 'none') return;
        if (activeCourse === 'word' && parentCourseContainer.id !== 'container-course-word') return;
        if (activeCourse !== 'word' && parentCourseContainer.id !== 'container-course-ai') return;
      }

      // Skip elements that belong to a currently hidden mode container
      const parentModeContainer = el.closest('#container-pretraining, #container-liveclass');
      if (parentModeContainer && parentModeContainer.style.display === 'none') {
        return;
      }

      if (!el.hasAttribute('data-search-id')) {
        el.setAttribute('data-search-id', `s-item-${index}`);
      }

      const text = el.innerText || el.textContent || '';
      this.searchItems.push({
        id: `s-item-${index}`,
        element: el,
        text: text.toLowerCase()
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

    // Remove only highlights created by this engine. This preserves every
    // indexed element, its live form state, and attached event listeners.
    this.clearHighlights();

    // If query is empty, reset all elements to visible.
    if (!query) {
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

    // Hide sections that have zero matches (only within active course container)
    document.querySelectorAll('.content-section').forEach(section => {
      const parentCourse = section.closest('#container-course-ai, #container-course-word');
      if (parentCourse && parentCourse.style.display === 'none') return;

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
    const regex = new RegExp(this.escapeRegExp(query), 'gi');
    const textNodes = [];
    const nodeFilter = typeof NodeFilter !== 'undefined'
      ? NodeFilter
      : { SHOW_TEXT: 4, FILTER_ACCEPT: 1, FILTER_REJECT: 2 };
    const walker = document.createTreeWalker(
      element,
      nodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          const parent = node.parentElement;
          if (!parent || !node.nodeValue || !node.nodeValue.trim()) {
            return nodeFilter.FILTER_REJECT;
          }
          if (parent.closest('script, style, textarea, select, option, input, mark[data-search-highlight]')) {
            return nodeFilter.FILTER_REJECT;
          }
          return nodeFilter.FILTER_ACCEPT;
        }
      }
    );

    while (walker.nextNode()) textNodes.push(walker.currentNode);

    textNodes.forEach(textNode => {
      const text = textNode.nodeValue;
      regex.lastIndex = 0;
      if (!regex.test(text)) return;
      regex.lastIndex = 0;

      const fragment = document.createDocumentFragment();
      let lastIndex = 0;
      let match;
      while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) {
          fragment.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
        }
        const mark = document.createElement('mark');
        mark.className = 'search-highlight';
        mark.setAttribute('data-search-highlight', 'true');
        mark.textContent = match[0];
        fragment.appendChild(mark);
        lastIndex = match.index + match[0].length;
      }
      if (lastIndex < text.length) {
        fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
      }
      textNode.parentNode.replaceChild(fragment, textNode);
    });
  }

  /**
   * Restore elements to original unhighlighted state
   */
  clearHighlights() {
    document.querySelectorAll('mark[data-search-highlight]').forEach(mark => {
      const parent = mark.parentNode;
      if (!parent) return;
      parent.replaceChild(document.createTextNode(mark.textContent || ''), mark);
      parent.normalize();
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

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SearchEngine };
}
