/**
 * Automated production tests for Mode Switcher & Navigation Shell (MODE-01 & MODE-02).
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

  // Minimal DOM mock for Node environment if document is not available or incomplete
  if (typeof document === 'undefined' || !document.getElementById) {
    const createMockElement = (id, tag = 'div') => {
      const classes = new Set();
      const attrs = {};
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
        addEventListener(event, fn) {}
      };
    };

    const mockElements = {
      'container-pretraining': createMockElement('container-pretraining'),
      'container-liveclass': createMockElement('container-liveclass'),
      'nav-group-pretraining': createMockElement('nav-group-pretraining'),
      'nav-group-liveclass': createMockElement('nav-group-liveclass'),
      'header-brand-subtitle': createMockElement('header-brand-subtitle')
    };

    const mockTabs = [
      Object.assign(createMockElement('tab-pretraining-header', 'button'), {
        getAttribute: (attr) => attr === 'data-mode' ? 'pretraining' : null
      }),
      Object.assign(createMockElement('tab-liveclass-header', 'button'), {
        getAttribute: (attr) => attr === 'data-mode' ? 'live-class' : null
      }),
      Object.assign(createMockElement('tab-pretraining-sidebar', 'button'), {
        getAttribute: (attr) => attr === 'data-mode' ? 'pretraining' : null
      }),
      Object.assign(createMockElement('tab-liveclass-sidebar', 'button'), {
        getAttribute: (attr) => attr === 'data-mode' ? 'live-class' : null
      })
    ];

    global.document = {
      documentElement: { setAttribute() {} },
      getElementById(id) { return mockElements[id] || null; },
      querySelectorAll(selector) {
        if (selector === '.mode-tab') return mockTabs;
        return [];
      }
    };
  }

  const ProductionStateManager = typeof module !== 'undefined' && module.exports
    ? require('../assets/js/state.js').StateManager
    : window.AppState && window.AppState.constructor;

  const appModule = typeof module !== 'undefined' && module.exports
    ? require('../assets/js/app.js')
    : window;

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

  function runTests() {
    console.log('--- STARTING MODE SWITCHER & NAVIGATION SHELL TESTS ---\n');
    localStorage.clear();

    console.log('[Suite 1: StateManager Mode Persistence]');
    const sm = new ProductionStateManager();
    assertEquals(sm.getActiveMode(), 'pretraining', 'Initial mode is pretraining by default');

    // Mutate checklist to test data preservation
    sm.updateChecklist('m1-check-node', true);
    assertEquals(sm.getState().checklists['m1-check-node'], true, 'Checklist item is set to true');

    // Switch to live-class mode
    const switchRes = sm.setMode('live-class');
    assert(switchRes === true, 'setMode(live-class) returns true');
    assertEquals(sm.getActiveMode(), 'live-class', 'Active mode updated to live-class');

    // Verify existing checklist was preserved
    assertEquals(sm.getState().checklists['m1-check-node'], true, 'Checklist item preserved after mode change');

    // Reload from localStorage
    const smReloaded = new ProductionStateManager();
    assertEquals(smReloaded.getActiveMode(), 'live-class', 'Persisted mode live-class restored from localStorage');
    assertEquals(smReloaded.getState().checklists['m1-check-node'], true, 'Persisted checklist item restored alongside mode');

    // Resetting state
    smReloaded.resetState();
    assertEquals(smReloaded.getActiveMode(), 'pretraining', 'resetState() restores activeMode to pretraining');

    console.log('\n[Suite 2: Event Notification & Validation Guard]');
    let modeChangeEventFired = false;
    let receivedMode = null;
    smReloaded.on('modeChange', (mode) => {
      modeChangeEventFired = true;
      receivedMode = mode;
    });

    smReloaded.setMode('live-class');
    assert(modeChangeEventFired === true, 'modeChange event dispatched on valid mode change');
    assertEquals(receivedMode, 'live-class', 'modeChange payload contains target mode');

    // Invalid mode rejected
    modeChangeEventFired = false;
    const invalidResult = smReloaded.setMode('invalid-session-mode');
    assert(invalidResult === false, 'Invalid mode name rejected by setMode()');
    assertEquals(smReloaded.getActiveMode(), 'live-class', 'Active mode remains live-class after invalid attempt');
    assert(modeChangeEventFired === false, 'No event emitted for invalid mode');

    console.log('\n[Suite 3: UI Controller & Container Toggling]');
    if (appModule && typeof appModule.updateModeUI === 'function') {
      // Test Pra-Training Mode UI
      appModule.updateModeUI('pretraining', false);
      const preContainer = document.getElementById('container-pretraining');
      const liveContainer = document.getElementById('container-liveclass');
      const preNav = document.getElementById('nav-group-pretraining');
      const liveNav = document.getElementById('nav-group-liveclass');
      const subtitle = document.getElementById('header-brand-subtitle');

      assertEquals(preContainer.style.display, '', 'Pretraining container display is visible in pretraining mode');
      assertEquals(liveContainer.style.display, 'none', 'Liveclass container is hidden in pretraining mode');
      assertEquals(preNav.style.display, '', 'Pretraining nav is visible in pretraining mode');
      assertEquals(liveNav.style.display, 'none', 'Liveclass nav is hidden in pretraining mode');
      assertEquals(subtitle.textContent, 'Hermes Agent + 9Router • Pemula', 'Subtitle updated for pretraining mode');

      // Test Live Class Mode UI
      appModule.updateModeUI('live-class', false);
      assertEquals(preContainer.style.display, 'none', 'Pretraining container is hidden in live-class mode');
      assertEquals(liveContainer.style.display, '', 'Liveclass container is visible in live-class mode');
      assertEquals(preNav.style.display, 'none', 'Pretraining nav is hidden in live-class mode');
      assertEquals(liveNav.style.display, '', 'Liveclass nav is visible in live-class mode');
      assertEquals(subtitle.textContent, 'Hermes Agent + 9Router • Live Praktik Kelas', 'Subtitle updated for live-class mode');
    } else {
      assert(false, 'updateModeUI controller export not found');
    }

    console.log('\n[Suite 4: Live Workshop Lock / Unlock Controller]');
    if (appModule && typeof appModule.isLiveClassUnlocked === 'function') {
      localStorage.removeItem('live_class_unlocked');
      assert(appModule.isLiveClassUnlocked() === false, 'Live class is locked by default');

      appModule.setLiveClassUnlocked(true);
      assert(appModule.isLiveClassUnlocked() === true, 'Live class is unlocked after setLiveClassUnlocked(true)');
      assertEquals(localStorage.getItem('live_class_unlocked'), 'true', 'Unlock state persisted in localStorage');

      appModule.setLiveClassUnlocked(false);
      assert(appModule.isLiveClassUnlocked() === false, 'Live class is locked after setLiveClassUnlocked(false)');
      assertEquals(localStorage.getItem('live_class_unlocked'), null, 'Unlock key removed from localStorage');

      // Test Passcode Configuration
      if (appModule.INSTRUCTOR_PASSCODES) {
        assertEquals(appModule.INSTRUCTOR_PASSCODES, ['buka-kelas'], 'INSTRUCTOR_PASSCODES only contains buka-kelas');
      }
    } else {
      assert(false, 'isLiveClassUnlocked or setLiveClassUnlocked export not found');
    }


    console.log(`\nTEST SUMMARY: ${passedTests} PASSED, ${failedTests} FAILED\n`);
    if (failedTests > 0) {
      if (typeof process !== 'undefined') process.exit(1);
    }
  }

  if (typeof module !== 'undefined' && module.exports) {
    runTests();
  } else if (typeof window !== 'undefined') {
    window.addEventListener('load', runTests);
  }
})();
