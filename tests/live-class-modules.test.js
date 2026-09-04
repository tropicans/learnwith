/**
 * Automated tests for Live Workshop Phase 6: Modules 6-8 and Checkpoints 4-6 (CLASS-01..03, GATE-01..03).
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

  if (typeof document === 'undefined') {
    global.document = {
      documentElement: { setAttribute() {} },
      getElementById() { return null; },
      querySelectorAll() { return []; }
    };
  }

  const ProductionStateManager = typeof module !== 'undefined' && module.exports
    ? require('../assets/js/state.js').StateManager
    : window.AppState && window.AppState.constructor;

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
    console.log('--- STARTING LIVE WORKSHOP PHASE 6 TESTS ---\n');
    localStorage.clear();
    const sm = new ProductionStateManager();

    console.log('[Suite 1: Live Class Checklists & Module Progress]');
    assertEquals(sm.getModuleProgress('m6-').total, 4, 'Modul 6 has 4 tasks (run, dashboard, model, key)');
    assertEquals(sm.getModuleProgress('m7-').total, 3, 'Modul 7 has 3 tasks (install, restart, doctor)');
    assertEquals(sm.getModuleProgress('m8-').total, 4, 'Modul 8 has 4 tasks (setup, endpoint, key, test)');

    // Completing tasks in Modul 6
    sm.updateChecklist('m6-run-router', true);
    sm.updateChecklist('m6-open-dashboard', true);
    assertEquals(sm.getModuleProgress('m6-').completed, 2, 'Modul 6 reflects 2 completed tasks');
    assertEquals(sm.getModuleProgress('m6-').percentage, 50, 'Modul 6 reflects 50% completion');

    // Completing tasks in Modul 7 & 8
    sm.updateChecklist('m7-install-cli', true);
    assertEquals(sm.getModuleProgress('m7-').completed, 1, 'Modul 7 reflects 1 completed task');
    sm.updateChecklist('m8-run-setup', true);
    sm.updateChecklist('m8-enter-endpoint', true);
    assertEquals(sm.getModuleProgress('m8-').completed, 2, 'Modul 8 reflects 2 completed tasks');

    console.log('\n[Suite 2: Checkpoint 4, 5, 6 Gates]');
    assertEquals(sm.getState().checkpoints['cp-4'], 'pending', 'Checkpoint 4 initial status is pending');
    assertEquals(sm.getState().checkpoints['cp-5'], 'pending', 'Checkpoint 5 initial status is pending');
    assertEquals(sm.getState().checkpoints['cp-6'], 'pending', 'Checkpoint 6 initial status is pending');

    sm.updateCheckpoint('cp-4', 'passed');
    assertEquals(sm.getState().checkpoints['cp-4'], 'passed', 'Checkpoint 4 updates to passed');

    sm.updateCheckpoint('cp-5', 'failed');
    assertEquals(sm.getState().checkpoints['cp-5'], 'failed', 'Checkpoint 5 updates to failed');

    sm.updateCheckpoint('cp-5', 'passed');
    sm.updateCheckpoint('cp-6', 'passed');
    assertEquals(sm.getState().checkpoints['cp-5'], 'passed', 'Checkpoint 5 updates to passed');
    assertEquals(sm.getState().checkpoints['cp-6'], 'passed', 'Checkpoint 6 updates to passed');

    console.log('\n[Suite 3: Participant Info for Live Class]');
    sm.updateParticipantInfo('routerProvider', 'Groq');
    sm.updateParticipantInfo('routerModel', 'llama-3.3-70b-versatile');
    assertEquals(sm.getState().participantInfo.routerProvider, 'Groq', 'Participant routerProvider persisted');
    assertEquals(sm.getState().participantInfo.routerModel, 'llama-3.3-70b-versatile', 'Participant routerModel persisted');

    console.log('\n[Suite 4: Persistence Across Sessions]');
    const smReloaded = new ProductionStateManager();
    assertEquals(smReloaded.getState().checkpoints['cp-4'], 'passed', 'Persisted cp-4 is passed after reload');
    assertEquals(smReloaded.getState().checkpoints['cp-5'], 'passed', 'Persisted cp-5 is passed after reload');
    assertEquals(smReloaded.getState().checkpoints['cp-6'], 'passed', 'Persisted cp-6 is passed after reload');
    assertEquals(smReloaded.getModuleProgress('m6-').completed, 2, 'Persisted m6 tasks intact after reload');
    assertEquals(smReloaded.getState().participantInfo.routerProvider, 'Groq', 'Persisted provider intact after reload');

    // Pretraining readiness calculation independence
    smReloaded.updateCheckpoint('cp-1', 'passed');
    smReloaded.updateCheckpoint('cp-2', 'passed');
    smReloaded.updateCheckpoint('cp-3', 'passed');
    Object.keys(smReloaded.getState().checklists).forEach(k => smReloaded.updateChecklist(k, true));
    assertEquals(smReloaded.calculateReadiness().status, 'ready', 'Pretraining readiness evaluates to ready when cp 1-3 pass');

    console.log(`\nTEST SUMMARY: ${passedTests} PASSED, ${failedTests} FAILED\n`);
    if (failedTests > 0 && typeof process !== 'undefined') process.exitCode = 1;
    return { passedTests, failedTests };
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { runTests };
    runTests();
  } else if (typeof window !== 'undefined') {
    window.addEventListener('load', runTests);
  }
})();
