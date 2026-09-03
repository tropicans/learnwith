/**
 * ==========================================================================
 * PRE-TRAINING INTERACTIVE WEB APP - AUTOMATED TEST SUITE: CHECKPOINT ENGINE
 * Requirements: CHK-01, CHK-02, CHK-03, CHK-04
 * ==========================================================================
 */

// Mock LocalStorage environment if running in node/headless without DOM
if (typeof window === 'undefined') {
  global.localStorage = {
    _data: {},
    getItem(key) { return this._data[key] || null; },
    setItem(key, value) { this._data[key] = String(value); },
    removeItem(key) { delete this._data[key]; },
    clear() { this._data = {}; }
  };
  global.document = {
    documentElement: {
      setAttribute: () => {}
    },
    getElementById: () => null
  };
}

// Minimal Test Runner Assertion Framework
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
  const isMatch = JSON.stringify(actual) === JSON.stringify(expected);
  assert(isMatch, `${testName} (expected: ${JSON.stringify(expected)}, got: ${JSON.stringify(actual)})`);
}

// Load or define StateManager if needed
function runTests() {
  console.log('--- STARTING CHECKPOINT & STATE ENGINE TESTS ---\n');

  // Test 1: StateManager Initialization
  const STORAGE_KEY = 'pretraining_app_state_v1';
  localStorage.clear();

  // Test default state keys
  const DEFAULT_STATE = {
    theme: 'dark',
    checklists: {
      'prereq-laptop': false, 'prereq-charger': false, 'prereq-internet': false,
      'prereq-browser': false, 'prereq-admin': false, 'prereq-telegram': false,
      'prereq-google': false, 'm1-check-node': false, 'm1-check-npm': false,
      'm1-verify-lts': false, 'm2-install-pkg': false, 'm2-start-service': false,
      'm2-open-dashboard': false, 'm2-verify-local': false, 'm3-start-botfather': false,
      'm3-create-newbot': false, 'm3-save-token-secure': false, 'm3-get-userid': false,
      'm4-open-console': false, 'm4-verify-login': false
    },
    checkpoints: { 'cp-1': 'pending', 'cp-2': 'pending', 'cp-3': 'pending' },
    participantInfo: { name: '', email: '', telegramUsername: '', telegramUserId: '', nodeVersion: '', routerStatus: '' }
  };

  // Instantiate or use window.AppState / local StateManager
  let sm;
  if (typeof window !== 'undefined' && window.AppState) {
    sm = window.AppState;
    sm.resetState();
  } else {
    // Isolated Mock instance for headless
    class TestStateManager {
      constructor() {
        this.listeners = new Map();
        this.state = JSON.parse(JSON.stringify(DEFAULT_STATE));
      }
      saveState() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
        this.emit('stateChange', this.state);
      }
      getState() { return JSON.parse(JSON.stringify(this.state)); }
      updateChecklist(taskId, completed) {
        this.state.checklists[taskId] = !!completed;
        this.saveState();
      }
      updateCheckpoint(checkpointId, status) {
        this.state.checkpoints[checkpointId] = status;
        this.saveState();
      }
      updateParticipantInfo(field, value) {
        this.state.participantInfo[field] = value;
        this.saveState();
      }
      getModuleProgress(prefix) {
        const checklists = this.state.checklists || {};
        const taskKeys = Object.keys(checklists).filter(k => k.startsWith(prefix));
        const total = taskKeys.length;
        const completed = taskKeys.filter(k => checklists[k] === true).length;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        return { completed, total, percentage };
      }
      calculateProgress() {
        const checklists = this.state.checklists || {};
        const taskKeys = Object.keys(checklists);
        const totalTasks = taskKeys.length;
        const completedTasks = taskKeys.filter(k => checklists[k] === true).length;
        const checkpoints = this.state.checkpoints || {};
        const cpKeys = Object.keys(checkpoints);
        const totalCheckpoints = cpKeys.length;
        const passedCheckpoints = cpKeys.filter(k => checkpoints[k] === 'passed').length;
        const taskPercent = totalTasks > 0 ? (completedTasks / totalTasks) * 60 : 0;
        const cpPercent = totalCheckpoints > 0 ? (passedCheckpoints / totalCheckpoints) * 40 : 0;
        return { totalTasks, completedTasks, totalCheckpoints, passedCheckpoints, percentage: Math.min(100, Math.round(taskPercent + cpPercent)) };
      }
      calculateReadiness() {
        const progress = this.calculateProgress();
        const cps = this.state.checkpoints || {};
        const cpValues = Object.values(cps);
        const hasFailure = cpValues.some(v => v === 'failed');
        const allCheckpointsPassed = cpValues.length === 3 && cpValues.every(v => v === 'passed');
        if (hasFailure) return { status: 'clinic', label: '⚠️ PERLU TECHNICAL CLINIC' };
        if (allCheckpointsPassed && progress.percentage >= 80) return { status: 'ready', label: '🎉 SIAP MENGIKUTI WORKSHOP' };
        return { status: 'pending', label: '⏳ MENUNGGU PENYELESAIAN LANGKAH' };
      }
      resetState() {
        this.state = JSON.parse(JSON.stringify(DEFAULT_STATE));
        this.saveState();
      }
      emit(event, data) {
        if (this.listeners.has(event)) {
          for (const cb of this.listeners.get(event)) cb(data);
        }
      }
    }
    sm = new TestStateManager();
  }

  // --- TEST SUITE 1: CHK-01 Step Checklists & Module Progress ---
  console.log('\n[Suite 1: Step Checklists & Module Counters]');
  assertEquals(sm.getModuleProgress('m1-').total, 3, 'Module 1 has 3 tasks');
  assertEquals(sm.getModuleProgress('m2-').total, 4, 'Module 2 has 4 tasks');
  assertEquals(sm.getModuleProgress('m3-').total, 4, 'Module 3 has 4 tasks');
  assertEquals(sm.getModuleProgress('m4-').total, 2, 'Module 4 has 2 tasks');
  assertEquals(sm.getModuleProgress('prereq-').total, 7, 'Prerequisites has 7 tasks');

  // Toggle tasks in Module 1
  sm.updateChecklist('m1-check-node', true);
  sm.updateChecklist('m1-check-npm', true);
  assertEquals(sm.getModuleProgress('m1-').completed, 2, 'Module 1 reflects 2 completed tasks');
  assertEquals(sm.getModuleProgress('m1-').percentage, 67, 'Module 1 reflects 67% completion');

  // --- TEST SUITE 2: CHK-02 Checkpoint Gates Verification ---
  console.log('\n[Suite 2: Checkpoint Verification Gates]');
  assertEquals(sm.getState().checkpoints['cp-1'], 'pending', 'Checkpoint 1 initial status is pending');
  sm.updateCheckpoint('cp-1', 'passed');
  assertEquals(sm.getState().checkpoints['cp-1'], 'passed', 'Checkpoint 1 updates to passed');
  sm.updateCheckpoint('cp-2', 'failed');
  assertEquals(sm.getState().checkpoints['cp-2'], 'failed', 'Checkpoint 2 updates to failed');

  // --- TEST SUITE 3: CHK-03 Dynamic Readiness Status Engine ---
  console.log('\n[Suite 3: Dynamic Readiness Calculation]');
  // Case A: One checkpoint failed -> clinic
  let readiness = sm.calculateReadiness();
  assertEquals(readiness.status, 'clinic', 'Status is clinic when any checkpoint is failed');

  // Case B: Reset cp-2 to pending -> pending
  sm.updateCheckpoint('cp-2', 'pending');
  readiness = sm.calculateReadiness();
  assertEquals(readiness.status, 'pending', 'Status is pending when checkpoints are not fully passed');

  // Case C: All 3 checkpoints passed + complete all tasks -> ready
  sm.updateCheckpoint('cp-1', 'passed');
  sm.updateCheckpoint('cp-2', 'passed');
  sm.updateCheckpoint('cp-3', 'passed');
  Object.keys(sm.getState().checklists).forEach(k => sm.updateChecklist(k, true));
  readiness = sm.calculateReadiness();
  assertEquals(readiness.status, 'ready', "Status evaluates to 'ready' (SIAP MENGIKUTI WORKSHOP) when all pass");

  // --- TEST SUITE 4: CHK-04 Participant Validation & State Reset ---
  console.log('\n[Suite 4: Participant Validation & Reset Engine]');
  // Regex tests for Telegram User ID
  const numRegex = /^\d+$/;
  assert(numRegex.test('123456789'), 'User ID 123456789 is valid digits');
  assert(!numRegex.test('@budi123'), 'User ID with @ is invalid');
  assert(!numRegex.test('abc123'), 'User ID with letters is invalid');

  // Regex tests for Telegram Bot Username
  const botRegex = /(bot|_bot)$/i;
  assert(botRegex.test('@jadwal_budi_bot'), 'Username @jadwal_budi_bot is valid');
  assert(botRegex.test('asisten_bot'), 'Username asisten_bot is valid');
  assert(!botRegex.test('@jadwal_budi'), "Username without 'bot' suffix is invalid");

  // Test State Reset
  sm.resetState();
  assertEquals(sm.calculateProgress().completedTasks, 0, 'Reset state restores completed tasks to 0');
  assertEquals(sm.getState().checkpoints['cp-1'], 'pending', 'Reset state restores cp-1 to pending');
  assertEquals(sm.calculateReadiness().status, 'pending', 'Reset state restores readiness to pending');

  console.log(`\n=============================================`);
  console.log(`TEST SUMMARY: ${passedTests} PASSED, ${failedTests} FAILED`);
  console.log(`=============================================\n`);

  return { passedTests, failedTests, results };
}

// Auto-run if in Node or browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { runTests };
}
runTests();
