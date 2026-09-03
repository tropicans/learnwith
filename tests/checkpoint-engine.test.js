/** Automated production-code tests for the checkpoint and state engine. */
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
  global.document = { documentElement: { setAttribute() {} }, getElementById() { return null; } };
}

const ProductionStateManager = typeof module !== 'undefined' && module.exports
  ? require('../assets/js/state.js').StateManager
  : window.AppState && window.AppState.constructor;

let passedTests = 0;
let failedTests = 0;
const results = [];
function assert(condition, testName) {
  if (condition) {
    passedTests++;
    results.push({ name: testName, status: 'PASSED' });
    console.log(`  ✓ PASS: ${testName}`);
  } else {
    failedTests++;
    results.push({ name: testName, status: 'FAILED' });
    console.error(`  ✕ FAIL: ${testName}`);
  }
}
function assertEquals(actual, expected, testName) {
  assert(JSON.stringify(actual) === JSON.stringify(expected), `${testName} (expected: ${JSON.stringify(expected)}, got: ${JSON.stringify(actual)})`);
}

function runTests() {
  console.log('--- STARTING CHECKPOINT & STATE ENGINE TESTS ---\n');
  assert(typeof ProductionStateManager === 'function', 'Production StateManager export is available');
  localStorage.clear();
  const sm = new ProductionStateManager();

  console.log('\n[Suite 1: Step Checklists & Module Counters]');
  assertEquals(sm.getModuleProgress('m1-').total, 3, 'Module 1 has 3 tasks');
  assertEquals(sm.getModuleProgress('m2-').total, 4, 'Module 2 has 4 tasks');
  assertEquals(sm.getModuleProgress('m3-').total, 4, 'Module 3 has 4 tasks');
  assertEquals(sm.getModuleProgress('m4-').total, 2, 'Module 4 has 2 tasks');
  assertEquals(sm.getModuleProgress('prereq-').total, 7, 'Prerequisites has 7 tasks');
  sm.updateChecklist('m1-check-node', true);
  sm.updateChecklist('m1-check-npm', true);
  assertEquals(sm.getModuleProgress('m1-').completed, 2, 'Module 1 reflects 2 completed tasks');
  assertEquals(sm.getModuleProgress('m1-').percentage, 67, 'Module 1 reflects 67% completion');

  console.log('\n[Suite 2: Checkpoint Verification Gates]');
  assertEquals(sm.getState().checkpoints['cp-1'], 'pending', 'Checkpoint 1 initial status is pending');
  sm.updateCheckpoint('cp-1', 'passed');
  assertEquals(sm.getState().checkpoints['cp-1'], 'passed', 'Checkpoint 1 updates to passed');
  sm.updateCheckpoint('cp-2', 'failed');
  assertEquals(sm.getState().checkpoints['cp-2'], 'failed', 'Checkpoint 2 updates to failed');

  console.log('\n[Suite 3: Dynamic Readiness Calculation]');
  assertEquals(sm.calculateReadiness().status, 'clinic', 'Status is clinic when any checkpoint is failed');
  sm.updateCheckpoint('cp-2', 'pending');
  assertEquals(sm.calculateReadiness().status, 'pending', 'Status is pending when checkpoints are not fully passed');
  ['cp-1', 'cp-2', 'cp-3'].forEach(id => sm.updateCheckpoint(id, 'passed'));
  Object.keys(sm.getState().checklists).forEach(key => sm.updateChecklist(key, true));
  assertEquals(sm.calculateReadiness().status, 'ready', "Status evaluates to 'ready' when all requirements pass");

  console.log('\n[Suite 4: Persistence & Reset Engine]');
  const restored = new ProductionStateManager();
  assertEquals(restored.calculateReadiness().status, 'ready', 'Production state reloads persisted readiness');
  restored.resetState();
  assertEquals(restored.calculateProgress().completedTasks, 0, 'Reset state restores completed tasks to 0');
  assertEquals(restored.getState().checkpoints['cp-1'], 'pending', 'Reset state restores cp-1 to pending');
  assertEquals(restored.calculateReadiness().status, 'pending', 'Reset state restores readiness to pending');

  console.log(`\nTEST SUMMARY: ${passedTests} PASSED, ${failedTests} FAILED\n`);
  if (failedTests && typeof process !== 'undefined') process.exitCode = 1;
  return { passedTests, failedTests, results };
}

if (typeof module !== 'undefined' && module.exports) module.exports = { runTests };
runTests();
})();
