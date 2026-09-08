/**
 * Automated tests for Multi-Course Architecture & Course Gate Protection (Phase 9: GATEWAY-01, GATEWAY-02, GATEWAY-03).
 */
(async function () {
  if (typeof window === 'undefined') global.window = {};
  if (typeof localStorage === 'undefined' || !localStorage.getItem) {
    global.localStorage = {
      _data: {},
      getItem(key) { return Object.prototype.hasOwnProperty.call(this._data, key) ? this._data[key] : null; },
      setItem(key, value) { this._data[key] = String(value); },
      removeItem(key) { delete this._data[key]; },
      clear() { this._data = {}; }
    };
  }
  if (typeof sessionStorage === 'undefined' || !sessionStorage.getItem) {
    global.sessionStorage = {
      _data: {},
      getItem(key) { return Object.prototype.hasOwnProperty.call(this._data, key) ? this._data[key] : null; },
      setItem(key, value) { this._data[key] = String(value); },
      removeItem(key) { delete this._data[key]; },
      clear() { this._data = {}; }
    };
  }

  // Minimal DOM mock for Node environment
  if (typeof document === 'undefined' || !document.getElementById) {
    const createMockElement = (id, tag = 'div') => {
      const classes = new Set();
      const attrs = {};
      const children = [];
      return {
        id,
        tagName: tag.toUpperCase(),
        style: { display: '' },
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
        textContent: '',
        innerText: '',
        value: '',
        children,
        appendChild(child) { children.push(child); return child; },
        addEventListener(event, fn) {}
      };
    };

    const mockElements = {
      'container-course-ai': createMockElement('container-course-ai'),
      'container-course-word': createMockElement('container-course-word'),
      'container-pretraining': createMockElement('container-pretraining'),
      'container-liveclass': createMockElement('container-liveclass'),
      'nav-group-pretraining': createMockElement('nav-group-pretraining'),
      'nav-group-liveclass': createMockElement('nav-group-liveclass'),
      'header-brand-title': createMockElement('header-brand-title'),
      'header-brand-subtitle': createMockElement('header-brand-subtitle'),
      'modal-wordcourse-locked': createMockElement('modal-wordcourse-locked'),
      'btn-close-word-locked': createMockElement('btn-close-word-locked', 'button'),
      'input-word-unlock-code': createMockElement('input-word-unlock-code', 'input'),
      'btn-submit-word-unlock': createMockElement('btn-submit-word-unlock', 'button'),
      'word-unlock-feedback': createMockElement('word-unlock-feedback', 'span')
    };

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
        return [];
      }
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

  const { StateManager, COURSE_CONFIGS, DEFAULT_STATE } = require('../assets/js/state.js');

  console.log('\n--- STARTING MULTI-COURSE ARCHITECTURE & GATE TESTS ---');

  // Suite 1: StateManager Multi-Course Namespacing & Migration
  console.log('\n[Suite 1: StateManager Namespacing & Legacy Migration]');
  localStorage.clear();

  // Seed legacy data
  const legacySeed = {
    theme: 'dark',
    checklists: { 'prereq-laptop': true, 'm1-check-node': true },
    checkpoints: { 'cp-1': 'passed' },
    activeMode: 'pretraining'
  };
  localStorage.setItem('pretraining_app_state_v1', JSON.stringify(legacySeed));

  const mgr = new StateManager();

  // Test 1: Default active course is 'ai'
  assertEquals(mgr.getActiveCourse(), 'ai', 'Default active course is ai');

  // Test 2: Legacy state migrated to learnwith_ai_state_v1 without modifying pretraining_app_state_v1
  const aiState = mgr.getState();
  assertEquals(aiState.checklists['prereq-laptop'], true, 'Migrated prereq-laptop is true in ai state');
  assertEquals(aiState.checkpoints['cp-1'], 'passed', 'Migrated checkpoint cp-1 is passed in ai state');
  assert(localStorage.getItem('learnwith_ai_state_v1') !== null, 'learnwith_ai_state_v1 was populated');
  assert(localStorage.getItem('pretraining_app_state_v1') !== null, 'pretraining_app_state_v1 preserved untouched');

  // Test 3: Course 2 ('word') namespacing
  mgr.setCourse('word');
  assertEquals(mgr.getActiveCourse(), 'word', 'Active course switched to word');
  const wordState = mgr.getState();
  assertEquals(wordState.checklists['prereq-laptop'], undefined, 'Course 2 checklists start with defaults (not polluted by Course 1)');

  // Test 4: Mutating Course 2 does not mutate Course 1
  mgr.updateChecklist('word-task-1', true);
  assertEquals(mgr.getState().checklists['word-task-1'], true, 'Word task 1 set in word state');

  mgr.setCourse('ai');
  assertEquals(mgr.getState().checklists['word-task-1'], undefined, 'Word task 1 does not exist in ai state');
  assertEquals(mgr.getState().checklists['prereq-laptop'], true, 'AI checklist item still true');

  // Test 5: resetState() only resets active course
  mgr.setCourse('word');
  mgr.resetState();
  assertEquals(mgr.getState().checklists['word-task-1'], undefined, 'Word state reset cleanly');

  mgr.setCourse('ai');
  assertEquals(mgr.getState().checklists['prereq-laptop'], true, 'AI state preserved despite Word reset');

  // Suite 2: Course 2 Developer Gate Protection & Unlock
  console.log('\n[Suite 2: Course 2 Developer Gate Protection]');
  const appModule = require('../assets/js/app.js');
  localStorage.clear();

  // Test 6: Word course locked by default
  assert(!appModule.isWordCourseUnlocked(), 'Course 2 is locked by default');

  // Test 7: setWordCourseUnlocked(true) unlocks Course 2
  appModule.setWordCourseUnlocked(true);
  assert(appModule.isWordCourseUnlocked(), 'Course 2 is unlocked after setWordCourseUnlocked(true)');
  assert(sessionStorage.getItem('lw_session_word') !== null || localStorage.getItem('learnwith_word_unlocked') === 'true', 'Unlock token persisted');

  // Test 8: setWordCourseUnlocked(false) locks Course 2
  appModule.setWordCourseUnlocked(false);
  assert(!appModule.isWordCourseUnlocked(), 'Course 2 is locked after setWordCourseUnlocked(false)');
  assert(sessionStorage.getItem('lw_session_word') === null, 'Unlock token removed');

  // Test 9: Zero-Plaintext Security & Cryptographic Hash Verification (SEC-01, SEC-03)
  assert(window.WORD_PASSCODES === undefined, 'WORD_PASSCODES must NOT be exposed globally on window');
  assert(typeof appModule.verifyWordPasscode === 'function', 'verifyWordPasscode must be a function');
  const validPass = await appModule.verifyWordPasscode('buka-kata');
  assert(validPass === true, 'verifyWordPasscode returns true for buka-kata');
  const invalidPass = await appModule.verifyWordPasscode('salah-kode');
  assert(invalidPass === false, 'verifyWordPasscode returns false for invalid password');

  // Suite 3: Course Switcher UI & Container Visibility
  console.log('\n[Suite 3: Course Switcher & Container Visibility]');
  window.AppState = mgr;
  appModule.switchCourse('ai', false, false);

  const containerAi = document.getElementById('container-course-ai');
  const containerWord = document.getElementById('container-course-word');
  const headerBrandTitle = document.getElementById('header-brand-title');
  const headerBrandSubtitle = document.getElementById('header-brand-subtitle');

  assertEquals(containerAi.style.display, 'block', 'container-course-ai is visible in ai course');
  assertEquals(containerWord.style.display, 'none', 'container-course-word is hidden in ai course');
  assertEquals(headerBrandTitle.textContent, 'Hands-on Agentic AI', 'Brand title is Hands-on Agentic AI');

  // Switch to Word course
  appModule.switchCourse('word', false, false);
  assertEquals(containerAi.style.display, 'none', 'container-course-ai is hidden in word course');
  assertEquals(containerWord.style.display, 'block', 'container-course-word is visible in word course');
  assertEquals(headerBrandTitle.textContent, 'Pengolahan Kata Tingkat Lanjut', 'Brand title updated for Word course');

  // Switch back to AI course
  appModule.switchCourse('ai', false, false);
  assertEquals(containerAi.style.display, 'block', 'container-course-ai is restored in ai course');
  assertEquals(containerWord.style.display, 'none', 'container-course-word is hidden in ai course');

  console.log(`\nTEST SUMMARY: ${passedTests} PASSED, ${failedTests} FAILED`);
  if (failedTests > 0) process.exit(1);
})();
