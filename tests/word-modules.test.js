/**
 * Automated test suite for Course 2 (Pengolahan Kata Tingkat Lanjut)
 * Requirements: WORD-01, WORD-02, WORD-03, WORD-05
 */
(function () {
  if (typeof window === 'undefined') global.window = {};
  if (typeof localStorage === 'undefined') {
    global.localStorage = {
      _data: {},
      getItem(key) { return Object.prototype.hasOwnProperty.call(this._data, key) ? this._data[key] : null; },
      setItem(key, value) { this._data[key] = String(value); },
      removeItem(key) { delete this._data[key]; },
      clear() { this._data = {}; }
    };
  }

  const createMockElement = (id, tag = 'div', extra = {}) => {
    const classes = new Set(extra.classes || []);
    const attrs = Object.assign({}, extra.attrs || {});
    const children = [];
    const el = {
      id,
      tagName: tag.toUpperCase(),
      style: { display: '', width: '', borderColor: '' },
      classList: {
        add(c) { classes.add(c); },
        remove(c) { classes.delete(c); },
        toggle(c, force) {
          if (force === undefined) {
            if (classes.has(c)) classes.delete(c); else classes.add(c);
          } else if (force) classes.add(c); else classes.delete(c);
        },
        contains(c) { return classes.has(c); }
      },
      setAttribute(name, val) { attrs[name] = String(val); },
      getAttribute(name) { return attrs[name] !== undefined ? attrs[name] : null; },
      hasAttribute(name) { return attrs[name] !== undefined; },
      removeAttribute(name) { delete attrs[name]; },
      textContent: '',
      innerText: '',
      value: '',
      checked: false,
      children,
      appendChild(child) {
        children.push(child);
        child.parentElement = el;
        return child;
      },
      closest(selector) {
        if (selector === '.checkpoint-gate-card' && (this.id === 'card-word-cp-1' || this.id === 'card-word-cp-2')) return this;
        if (selector === '.btn-cp-action' && classes.has('btn-cp-action')) return this;
        if (selector === '.checklist-item' || selector === '.step-checklist-action') return this;
        return this.parentElement ? this.parentElement.closest(selector) : null;
      },
      querySelectorAll(selector) {
        const matches = [];
        function walk(node) {
          for (const c of node.children) {
            if (selector === '.btn-cp-action' && c.classList.contains('btn-cp-action')) {
              matches.push(c);
            }
            if (selector === '.checklist-checkbox' && c.classList.contains('checklist-checkbox')) {
              matches.push(c);
            }
            if (selector === '.checklist-checkbox[data-task-id]' && c.classList.contains('checklist-checkbox') && c.hasAttribute('data-task-id')) {
              matches.push(c);
            }
            walk(c);
          }
        }
        walk(this);
        return matches;
      },
      addEventListener(event, fn) {}
    };
    return el;
  };

  if (typeof document === 'undefined' || !document.getElementById) {
    const mockElements = {
      'container-course-ai': createMockElement('container-course-ai'),
      'container-course-word': createMockElement('container-course-word'),
      'container-pretraining': createMockElement('container-pretraining'),
      'container-liveclass': createMockElement('container-liveclass'),
      'nav-group-pretraining': createMockElement('nav-group-pretraining'),
      'nav-group-liveclass': createMockElement('nav-group-liveclass'),
      'nav-group-word': createMockElement('nav-group-word'),
      'header-mode-switcher': createMockElement('header-mode-switcher'),
      'sidebar-mode-switcher-container': createMockElement('sidebar-mode-switcher-container'),
      'header-brand-title': createMockElement('header-brand-title'),
      'header-brand-subtitle': createMockElement('header-brand-subtitle'),
      'header-progress-text': createMockElement('header-progress-text'),
      'header-progress-bar': createMockElement('header-progress-bar'),
      'stat-progress-count': createMockElement('stat-progress-count'),
      'sec-word-intro': createMockElement('sec-word-intro'),
      'sec-word-standards': createMockElement('sec-word-standards'),
      'sec-word-shortcuts': createMockElement('sec-word-shortcuts'),
      'sec-word-module-2': createMockElement('sec-word-module-2'),
      'sec-word-cp-1': createMockElement('sec-word-cp-1'),
      'sec-word-module-3': createMockElement('sec-word-module-3'),
      'sec-word-cp-2': createMockElement('sec-word-cp-2'),
      'sec-word-diagnosis': createMockElement('sec-word-diagnosis'),
      'card-word-cp-1': createMockElement('card-word-cp-1', 'div', { classes: ['checkpoint-gate-card'] }),
      'card-word-cp-2': createMockElement('card-word-cp-2', 'div', { classes: ['checkpoint-gate-card'] }),
      'status-card-word-cp1': createMockElement('status-card-word-cp1', 'span'),
      'status-card-word-cp2': createMockElement('status-card-word-cp2', 'span'),
      'status-nav-word-cp1': createMockElement('status-nav-word-cp1', 'span'),
      'status-nav-word-cp2': createMockElement('status-nav-word-cp2', 'span'),
      'badge-nav-word-b1': createMockElement('badge-nav-word-b1', 'span'),
      'badge-nav-word-b2': createMockElement('badge-nav-word-b2', 'span'),
      'badge-nav-word-b3': createMockElement('badge-nav-word-b3', 'span'),
      'card-word-readiness-status': createMockElement('card-word-readiness-status', 'div'),
      'readiness-word-badge': createMockElement('readiness-word-badge', 'span')
    };

    // Attach buttons inside checkpoint cards
    ['word-cp-1', 'word-cp-2'].forEach((cpId) => {
      const card = mockElements[`card-${cpId}`];
      ['passed', 'failed', 'pending'].forEach((status) => {
        const btn = createMockElement(`btn-${cpId}-${status}`, 'button', {
          classes: ['btn-cp-action'],
          attrs: { 'data-checkpoint': cpId, 'data-status': status }
        });
        card.appendChild(btn);
      });
    });

    // Checklist checkboxes for 20 Word tasks
    const wordTasks = [
      'word-b1-download-pkg', 'word-b1-setup-folder', 'word-b1-inspect-messy', 'word-b1-check-version',
      'word-b2-apply-h1', 'word-b2-apply-h2-h3', 'word-b2-modify-styles', 'word-b2-nav-pane',
      'word-b2-multilevel', 'word-b2-insert-toc', 'word-b2-update-toc', 'word-b2-captions-ref',
      'word-b3-section-breaks', 'word-b3-unlink-header', 'word-b3-page-num-roman', 'word-b3-page-num-arabic',
      'word-b3-landscape-mix', 'word-b3-save-dotx', 'word-b3-content-controls', 'word-b3-doc-inspection'
    ];

    const checkboxElements = wordTasks.map(taskId => {
      return createMockElement(`chk-${taskId}`, 'input', {
        classes: ['checklist-checkbox'],
        attrs: { 'data-task-id': taskId, type: 'checkbox' }
      });
    });

    const mockCourseDropdownItems = [
      Object.assign(createMockElement('item-course-ai', 'li'), {
        getAttribute: (attr) => attr === 'data-course' ? 'ai' : null
      }),
      Object.assign(createMockElement('item-course-word', 'li'), {
        getAttribute: (attr) => attr === 'data-course' ? 'word' : null
      })
    ];

    global.document = {
      documentElement: { setAttribute() {} },
      getElementById(id) { return mockElements[id] || null; },
      querySelectorAll(selector) {
        if (selector === '.course-dropdown-item') return mockCourseDropdownItems;
        if (selector === '.checklist-checkbox' || selector === '.checklist-checkbox[data-task-id]') return checkboxElements;
        if (selector === '.btn-cp-action') {
          return [
            ...mockElements['card-word-cp-1'].querySelectorAll('.btn-cp-action'),
            ...mockElements['card-word-cp-2'].querySelectorAll('.btn-cp-action')
          ];
        }
        return [];
      },
      addEventListener(event, fn) {}
    };
  }

  let passedTests = 0;
  let failedTests = 0;
  function assert(condition, testName) {
    if (condition) {
      passedTests++;
      console.log(`  ✓ PASS: ${testName}`);
    } else {
      failedTests++;
      console.error(`  ✕ FAIL: ${testName}`);
    }
  }

  function assertEquals(actual, expected, testName) {
    assert(JSON.stringify(actual) === JSON.stringify(expected), `${testName} (expected: ${JSON.stringify(expected)}, got: ${JSON.stringify(actual)})`);
  }

  const { StateManager, WORD_DEFAULT_STATE, COURSE_CONFIGS, DEFAULT_STATE } = require('../assets/js/state.js');
  const appModule = require('../assets/js/app.js');

  console.log('\n--- STARTING COURSE 2 (WORD PROCESSING) AUTOMATED TESTS ---');

  // =========================================================================
  // Suite 1: StateManager Course 2 Isolation & Default State
  // =========================================================================
  console.log('\n[Suite 1: StateManager Course 2 Isolation & Default State]');
  localStorage.clear();

  // Test 1.1: WORD_DEFAULT_STATE has exactly 20 checklist tasks
  assert(WORD_DEFAULT_STATE !== undefined, 'WORD_DEFAULT_STATE is exported');
  const defaultChecklistKeys = Object.keys(WORD_DEFAULT_STATE.checklists);
  assertEquals(defaultChecklistKeys.length, 20, 'WORD_DEFAULT_STATE has exactly 20 checklist tasks');

  const b1Keys = defaultChecklistKeys.filter(k => k.startsWith('word-b1-'));
  const b2Keys = defaultChecklistKeys.filter(k => k.startsWith('word-b2-'));
  const b3Keys = defaultChecklistKeys.filter(k => k.startsWith('word-b3-'));
  assertEquals(b1Keys.length, 4, 'Bab I has 4 checklist tasks');
  assertEquals(b2Keys.length, 8, 'Bab II has 8 checklist tasks');
  assertEquals(b3Keys.length, 8, 'Bab III has 8 checklist tasks');

  // Test 1.2: Checkpoint defaults
  assertEquals(Object.keys(WORD_DEFAULT_STATE.checkpoints).length, 2, 'Course 2 has 2 checkpoints');
  assertEquals(WORD_DEFAULT_STATE.checkpoints['word-cp-1'], 'pending', 'word-cp-1 defaults to pending');
  assertEquals(WORD_DEFAULT_STATE.checkpoints['word-cp-2'], 'pending', 'word-cp-2 defaults to pending');

  // Test 1.3: Isolation from Course 1
  const smAi = new StateManager('ai');
  smAi.updateChecklist('m1-check-node', true);
  smAi.updateCheckpoint('cp-1', 'passed');

  const smWord = new StateManager('word');
  assertEquals(smWord.getActiveCourse(), 'word', 'Active course is word');
  assertEquals(smWord.getState().checklists['word-b1-download-pkg'], false, 'Word b1 task starts false');
  assertEquals(smWord.getState().checklists['m1-check-node'], undefined, 'Course 1 task does not exist in Word state');
  assertEquals(smWord.getState().checkpoints['cp-1'], undefined, 'Course 1 checkpoint does not exist in Word state');

  // Test 1.4: Mutating Course 2 state does not affect Course 1 in localStorage
  smWord.updateChecklist('word-b1-download-pkg', true);
  smWord.updateCheckpoint('word-cp-1', 'passed');
  assertEquals(smWord.getState().checklists['word-b1-download-pkg'], true, 'Word task updated in Word state');
  assertEquals(smWord.getState().checkpoints['word-cp-1'], 'passed', 'word-cp-1 updated in Word state');

  const savedWordState = JSON.parse(localStorage.getItem('learnwith_word_state_v1'));
  const savedAiState = JSON.parse(localStorage.getItem('learnwith_ai_state_v1'));
  assertEquals(savedWordState.checklists['word-b1-download-pkg'], true, 'Word state persisted to learnwith_word_state_v1');
  assertEquals(savedAiState.checklists['word-b1-download-pkg'], undefined, 'learnwith_ai_state_v1 has zero pollution from Course 2');

  // Test 1.5: resetState() on Course 2 resets only Course 2
  smWord.resetState();
  assertEquals(smWord.getState().checklists['word-b1-download-pkg'], false, 'Word task reset to false');
  assertEquals(smWord.getState().checkpoints['word-cp-1'], 'pending', 'word-cp-1 reset to pending');

  const checkAiAfterWordReset = new StateManager('ai');
  assertEquals(checkAiAfterWordReset.getState().checklists['m1-check-node'], true, 'AI state preserved after Word reset');
  assertEquals(checkAiAfterWordReset.getState().checkpoints['cp-1'], 'passed', 'AI checkpoint preserved after Word reset');

  // =========================================================================
  // Suite 2: Checkpoint 1 & 2 Gates Workflow
  // =========================================================================
  console.log('\n[Suite 2: Checkpoint 1 & 2 Gates Workflow]');
  localStorage.clear();
  const mgrGate = new StateManager('word');

  // Test 2.1: Checkpoint transitions
  assertEquals(mgrGate.getState().checkpoints['word-cp-1'], 'pending', 'word-cp-1 begins pending');
  mgrGate.updateCheckpoint('word-cp-1', 'passed');
  assertEquals(mgrGate.getState().checkpoints['word-cp-1'], 'passed', 'word-cp-1 transitions to passed');

  mgrGate.updateCheckpoint('word-cp-1', 'failed');
  assertEquals(mgrGate.getState().checkpoints['word-cp-1'], 'failed', 'word-cp-1 transitions to failed');

  mgrGate.updateCheckpoint('word-cp-1', 'pending');
  assertEquals(mgrGate.getState().checkpoints['word-cp-1'], 'pending', 'word-cp-1 resets to pending');

  // Test 2.2: Persistence across re-instantiation
  mgrGate.updateCheckpoint('word-cp-2', 'passed');
  const mgrReloaded = new StateManager('word');
  assertEquals(mgrReloaded.getState().checkpoints['word-cp-2'], 'passed', 'word-cp-2 persisted across instances');

  // =========================================================================
  // Suite 3: Course 2 Weighted Progress & Readiness
  // =========================================================================
  console.log('\n[Suite 3: Course 2 Weighted Progress & Readiness]');
  localStorage.clear();
  const mgrProg = new StateManager('word');

  // Test 3.1: Clean state = 0%
  const cleanProg = mgrProg.calculateProgress();
  assertEquals(cleanProg.percentage, 0, 'Clean state progress is 0%');
  assertEquals(cleanProg.totalTasks, 20, 'Total tasks count is 20');
  assertEquals(cleanProg.completedTasks, 0, 'Completed tasks count is 0');
  assertEquals(cleanProg.totalCheckpoints, 2, 'Total checkpoints count is 2');
  assertEquals(cleanProg.passedCheckpoints, 0, 'Passed checkpoints count is 0');

  // Test 3.2: 20 checklist tasks = 60%
  b1Keys.concat(b2Keys, b3Keys).forEach(k => mgrProg.updateChecklist(k, true));
  const tasksDoneProg = mgrProg.calculateProgress();
  assertEquals(tasksDoneProg.completedTasks, 20, 'All 20 tasks completed');
  assertEquals(tasksDoneProg.percentage, 60, 'All 20 tasks completed equals 60%');

  // Test 3.3: Passing 1 checkpoint adds 20% (60 + 20 = 80%)
  mgrProg.updateCheckpoint('word-cp-1', 'passed');
  const cp1Prog = mgrProg.calculateProgress();
  assertEquals(cp1Prog.percentage, 80, '20 tasks + 1 checkpoint equals 80%');

  // Test 3.4: Passing both checkpoints = 100%
  mgrProg.updateCheckpoint('word-cp-2', 'passed');
  const allProg = mgrProg.calculateProgress();
  assertEquals(allProg.percentage, 100, '20 tasks + 2 checkpoints equals 100%');

  // Test 3.5: Readiness calculation logic
  assert(typeof mgrProg.calculateWordReadiness === 'function', 'calculateWordReadiness is a function');
  const readyResult = mgrProg.calculateWordReadiness();
  assertEquals(readyResult.status, 'ready', 'Readiness is ready when 100% and all passed');

  mgrProg.updateCheckpoint('word-cp-2', 'failed');
  const failResult = mgrProg.calculateWordReadiness();
  assertEquals(failResult.status, 'clinic', 'Readiness is clinic when any checkpoint fails');

  mgrProg.resetState();
  const pendingResult = mgrProg.calculateWordReadiness();
  assertEquals(pendingResult.status, 'pending', 'Readiness is pending on initial/incomplete state');

  // =========================================================================
  // Suite 4: DOM Element & Attribute Integrity
  // =========================================================================
  console.log('\n[Suite 4: DOM Element & Attribute Integrity]');
  const expectedSections = [
    'sec-word-intro',
    'sec-word-standards',
    'sec-word-shortcuts',
    'sec-word-module-2',
    'sec-word-cp-1',
    'sec-word-module-3',
    'sec-word-cp-2',
    'sec-word-diagnosis'
  ];

  expectedSections.forEach(secId => {
    assert(document.getElementById(secId) !== null, `Section #${secId} exists in DOM fixtures`);
  });

  const cardCp1 = document.getElementById('card-word-cp-1');
  const cardCp2 = document.getElementById('card-word-cp-2');
  assert(cardCp1 !== null, 'Card #card-word-cp-1 exists');
  assert(cardCp2 !== null, 'Card #card-word-cp-2 exists');

  const btnsCp1 = cardCp1.querySelectorAll('.btn-cp-action');
  assertEquals(btnsCp1.length, 3, 'Card 1 contains 3 action buttons');
  const btnsCp2 = cardCp2.querySelectorAll('.btn-cp-action');
  assertEquals(btnsCp2.length, 3, 'Card 2 contains 3 action buttons');

  // =========================================================================
  // Suite 5: Course Switcher & Navigation Synchronization
  // =========================================================================
  console.log('\n[Suite 5: Course Switcher & Navigation Synchronization]');
  localStorage.clear();
  window.AppState = new StateManager('ai');

  // Switch to Word course
  appModule.switchCourse('word', false, false);
  const navWord = document.getElementById('nav-group-word');
  const navPre = document.getElementById('nav-group-pretraining');
  const navLive = document.getElementById('nav-group-liveclass');

  assertEquals(navWord.style.display, 'block', 'nav-group-word is displayed when switching to word');
  assert(navWord.classList.contains('active'), 'nav-group-word has active class');
  assertEquals(navPre.style.display, 'none', 'nav-group-pretraining is hidden');
  assertEquals(navLive.style.display, 'none', 'nav-group-liveclass is hidden');
  assertEquals(window.AppState.getActiveCourse(), 'word', 'AppState switched to word');

  // Switch back to AI course
  appModule.switchCourse('ai', false, false);
  assertEquals(navWord.style.display, 'none', 'nav-group-word is hidden when switching to ai');
  assert(!navWord.classList.contains('active'), 'nav-group-word does not have active class');
  assertEquals(window.AppState.getActiveCourse(), 'ai', 'AppState switched back to ai');

  console.log(`\nTEST SUMMARY: ${passedTests} PASSED, ${failedTests} FAILED`);
  if (failedTests > 0) process.exit(1);
})();
