/**
 * Automated tests for Live Workshop Phase 6: Modules 6-8 and Checkpoints 4-6 (CLASS-01..03, GATE-01..03).
 */
(function () {
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

    console.log('\n[Suite 5: Phase 7 Modules 9, 10, 11 Checklists & Progress]');
    assertEquals(sm.getModuleProgress('m9-').total, 7, 'Modul 9 has 7 tasks (setup, telegram, token, allowed, start, status, verify-dm)');
    assertEquals(sm.getModuleProgress('m10-').total, 6, 'Modul 10 has 6 tasks (open-cloud, enable-calendar, oauth-screen, desktop-client, download-secret, auth-hermes)');
    assertEquals(sm.getModuleProgress('m11-').total, 5, 'Modul 11 has 5 tasks (prompt-read, prompt-create, verify-calendar, clean-dummy, reboot-sequence)');

    // Completing tasks in Modul 9
    sm.updateChecklist('m9-run-setup', true);
    sm.updateChecklist('m9-select-telegram', true);
    sm.updateChecklist('m9-enter-token', true);
    sm.updateChecklist('m9-enter-allowed', true);
    sm.updateChecklist('m9-start-gateway', true);
    sm.updateChecklist('m9-check-status', true);
    sm.updateChecklist('m9-verify-dm', true);
    assertEquals(sm.getModuleProgress('m9-').completed, 7, 'Modul 9 reflects 7 completed tasks');
    assertEquals(sm.getModuleProgress('m9-').percentage, 100, 'Modul 9 reflects 100% completion');

    // Completing tasks in Modul 10 & 11
    sm.updateChecklist('m10-open-cloud', true);
    sm.updateChecklist('m10-enable-calendar', true);
    sm.updateChecklist('m10-oauth-screen', true);
    assertEquals(sm.getModuleProgress('m10-').completed, 3, 'Modul 10 reflects 3 completed tasks');
    assertEquals(sm.getModuleProgress('m10-').percentage, 50, 'Modul 10 reflects 50% completion');

    sm.updateChecklist('m11-prompt-read', true);
    sm.updateChecklist('m11-prompt-create', true);
    assertEquals(sm.getModuleProgress('m11-').completed, 2, 'Modul 11 reflects 2 completed tasks');
    assertEquals(sm.getModuleProgress('m11-').percentage, 40, 'Modul 11 reflects 40% completion');

    console.log('\n[Suite 6: Phase 7 Checkpoint 7, 8, 9 Gates]');
    assertEquals(sm.getState().checkpoints['cp-7'], 'pending', 'Checkpoint 7 initial status is pending');
    assertEquals(sm.getState().checkpoints['cp-8'], 'pending', 'Checkpoint 8 initial status is pending');
    assertEquals(sm.getState().checkpoints['cp-9'], 'pending', 'Checkpoint 9 initial status is pending');

    sm.updateCheckpoint('cp-7', 'passed');
    assertEquals(sm.getState().checkpoints['cp-7'], 'passed', 'Checkpoint 7 updates to passed');

    sm.updateCheckpoint('cp-8', 'failed');
    assertEquals(sm.getState().checkpoints['cp-8'], 'failed', 'Checkpoint 8 updates to failed');

    sm.updateCheckpoint('cp-8', 'passed');
    sm.updateCheckpoint('cp-9', 'passed');
    assertEquals(sm.getState().checkpoints['cp-8'], 'passed', 'Checkpoint 8 updates to passed');
    assertEquals(sm.getState().checkpoints['cp-9'], 'passed', 'Checkpoint 9 updates to passed');

    console.log('\n[Suite 7: Phase 7 Persistence Across Sessions]');
    const smPhase7Reloaded = new ProductionStateManager();
    assertEquals(smPhase7Reloaded.getState().checkpoints['cp-7'], 'passed', 'Persisted cp-7 is passed after reload');
    assertEquals(smPhase7Reloaded.getState().checkpoints['cp-8'], 'passed', 'Persisted cp-8 is passed after reload');
    assertEquals(smPhase7Reloaded.getState().checkpoints['cp-9'], 'passed', 'Persisted cp-9 is passed after reload');
    assertEquals(smPhase7Reloaded.getModuleProgress('m9-').completed, 7, 'Persisted m9 tasks intact after reload');
    assertEquals(smPhase7Reloaded.getModuleProgress('m10-').completed, 3, 'Persisted m10 tasks intact after reload');
    assertEquals(smPhase7Reloaded.getModuleProgress('m11-').completed, 2, 'Persisted m11 tasks intact after reload');

    // Verify live-class progress calculation
    const liveProgress = smPhase7Reloaded.calculateProgress('live-class');
    assert(liveProgress.totalTasks > 0, 'Live class progress has totalTasks');
    assert(liveProgress.totalCheckpoints === 6, 'Live class tracks 6 checkpoints (cp-4..cp-9)');
    assert(liveProgress.passedCheckpoints === 6, 'All 6 live checkpoints passed');

    console.log('\n[Suite 8: Phase 8 calculateLiveReadiness Status Engine (GATE-07)]');
    localStorage.clear();
    const smReadiness = new ProductionStateManager();
    // Fresh state: all CP 4..9 are pending, progress = 0% (< 50%) -> clinic
    assertEquals(smReadiness.calculateLiveReadiness().status, 'clinic', 'Initial fresh state with 0% progress is clinic');
    assertEquals(smReadiness.calculateLiveReadiness().label, '⚠️ BELUM SIAP / BUTUH BANTUAN', 'Label is BELUM SIAP / BUTUH BANTUAN');

    // Complete all checklists for Modul 6..11 to get task completion > 50%
    const allLiveTasks = [
      'm6-run-router', 'm6-open-dashboard', 'm6-select-model', 'm6-create-key',
      'm7-install-cli', 'm7-restart-shell', 'm7-run-doctor',
      'm8-run-setup', 'm8-enter-endpoint', 'm8-enter-key', 'm8-test-response',
      'm9-run-setup', 'm9-select-telegram', 'm9-enter-token', 'm9-enter-allowed', 'm9-start-gateway', 'm9-check-status', 'm9-verify-dm',
      'm10-open-cloud', 'm10-enable-calendar', 'm10-oauth-screen', 'm10-create-desktop-client', 'm10-download-secret', 'm10-auth-hermes',
      'm11-prompt-read', 'm11-prompt-create', 'm11-verify-calendar', 'm11-clean-dummy', 'm11-reboot-sequence'
    ];
    allLiveTasks.forEach(task => smReadiness.updateChecklist(task, true));
    
    // Now task progress is 100% * 60% = 60%, checkpoints still pending (0% * 40% = 0%) -> total 60% (>= 50%, no failures, but not all passed) -> in_progress
    assertEquals(smReadiness.calculateLiveReadiness().status, 'in_progress', 'Progress >= 50% with pending checkpoints is in_progress');
    assertEquals(smReadiness.calculateLiveReadiness().label, '⏳ DALAM PRAKTIK', 'Label is DALAM PRAKTIK');

    // If any checkpoint fails -> clinic
    smReadiness.updateCheckpoint('cp-5', 'failed');
    assertEquals(smReadiness.calculateLiveReadiness().status, 'clinic', 'Any failed checkpoint returns clinic');
    assertEquals(smReadiness.calculateLiveReadiness().label, '⚠️ BELUM SIAP / BUTUH BANTUAN', 'Failed checkpoint label is BELUM SIAP / BUTUH BANTUAN');

    // Pass all checkpoints 4 through 9 -> ready (100% total progress)
    ['cp-4', 'cp-5', 'cp-6', 'cp-7', 'cp-8', 'cp-9'].forEach(cp => smReadiness.updateCheckpoint(cp, 'passed'));
    assertEquals(smReadiness.calculateLiveReadiness().status, 'ready', 'All checkpoints passed with full progress returns ready');
    assertEquals(smReadiness.calculateLiveReadiness().label, '🎉 SELESAI (SUKSES)', 'Ready label is SELESAI (SUKSES)');

    console.log('\n[Suite 9: Phase 8 Form Laporan Hasil Praktik Generator & Dual Export (RPT-04, RPT-05)]');
    const productionApp = typeof module !== 'undefined' && module.exports
      ? require('../assets/js/app.js')
      : {
          generateLiveReportText: window.generateLiveReportText,
          setupLiveTroubleshootingHub: window.setupLiveTroubleshootingHub
        };

    assert(typeof productionApp.generateLiveReportText === 'function', 'generateLiveReportText function is available');

    window.AppState = smReadiness;
    const waReport = productionApp.generateLiveReportText('whatsapp', {
      name: 'Ahmad Peserta',
      model: 'hermes-3-llama-3.1-8b',
      os: 'Windows 11',
      probStep: 'Nihil / Sukses Penuh',
      errorMsg: 'Nihil'
    });

    assert(waReport.includes('*LAPORAN HASIL PRAKTIK KELAS (HARI-H)*'), 'WhatsApp format includes bold header');
    assert(waReport.includes('Ahmad Peserta'), 'WhatsApp format includes participant name');
    assert(waReport.includes('hermes-3-llama-3.1-8b'), 'WhatsApp format includes model name');
    assert(waReport.includes('[X] Checkpoint 4'), 'Checkpoint 4 is marked [X]');
    assert(waReport.includes('[X] Checkpoint 9'), 'Checkpoint 9 is marked [X]');
    assert(waReport.includes('SELESAI (SUKSES)'), 'Status Akhir shows SELESAI (SUKSES)');

    // Telegram markdown format
    const tgReport = productionApp.generateLiveReportText('telegram', {
      name: 'Ahmad Peserta',
      model: 'hermes-3-llama-3.1-8b',
      os: 'Windows 11',
      probStep: 'Nihil',
      errorMsg: 'Error with token 123456789:ABCDefGhIjKlMnOpQrStUvWxYz012345678 and key sk-123456789012345678901234567890'
    });

    assert(tgReport.includes('**LAPORAN HASIL PRAKTIK KELAS (HARI-H)**'), 'Telegram format includes markdown header');
    assert(tgReport.includes('`hermes-3-llama-3.1-8b`'), 'Telegram format includes backtick model name');
    assert(tgReport.includes('[REDACTED_TELEGRAM_BOT_TOKEN]'), 'Telegram report redacts bot token');
    assert(tgReport.includes('[REDACTED_API_KEY]'), 'Telegram report redacts API key');
    assert(!tgReport.includes('123456789:ABCDefGhIjKlMnOpQrStUvWxYz012345678'), 'Original bot token is completely absent');

    console.log('\n[Suite 10: Phase 8 Live Troubleshooting Hub Categories & Scenarios (TRBL-04, TRBL-05)]');
    assert(typeof productionApp.setupLiveTroubleshootingHub === 'function' || typeof window.setupLiveTroubleshootingHub === 'function', 'setupLiveTroubleshootingHub function is available');

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
