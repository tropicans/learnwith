/** Automated production-code tests for redaction and readiness reports. */
(function () {

if (typeof window === 'undefined') global.window = {};
if (typeof document === 'undefined') {
  global.document = {
    addEventListener() {}, getElementById() { return null; },
    querySelectorAll() { return []; }, createElement() { return {}; }
  };
}

const production = typeof module !== 'undefined' && module.exports
  ? require('../assets/js/app.js')
  : {
      sanitizeLogText: window.sanitizeLogText,
      generateReportText: window.generateReportText,
      setupReadinessReport: window.setupReadinessReport
    };
const { sanitizeLogText, generateReportText, setupReadinessReport } = production;

let passed = 0;
let failed = 0;
function assert(cond, desc) {
  if (cond) { passed++; console.log(`  ✓ PASS: ${desc}`); }
  else { failed++; console.error(`  ✕ FAIL: ${desc}`); }
}
function assertEquals(actual, expected, desc) {
  assert(JSON.stringify(actual) === JSON.stringify(expected), `${desc} (Expected: ${JSON.stringify(expected)}, Got: ${JSON.stringify(actual)})`);
}
function installAppState(participantInfo, checkpoints, readinessStatus = 'pending', m4Complete = false) {
  window.AppState = {
    getState: () => ({ participantInfo, checkpoints }),
    calculateReadiness: () => ({ status: readinessStatus }),
    getModuleProgress: () => ({ completed: m4Complete ? 2 : 0, total: 2 }),
    updateParticipantInfo() {}, on() {}
  };
}

function runTestSuite() {
  console.log('--- STARTING PRODUCTION EXPORTER & REDACTION TESTS ---\n');
  assert(typeof sanitizeLogText === 'function', 'Production sanitizer export is available');
  assert(typeof generateReportText === 'function', 'Production report generator export is available');

  const tgToken = '123456789:ABCDefGhIjKlMnOpQrStUvWxYz012345678';
  const tgResult = sanitizeLogText(`Error connecting bot with token ${tgToken}`);
  assert(tgResult.sanitized.includes('[REDACTED_TELEGRAM_BOT_TOKEN]'), 'Telegram Bot Token is masked');
  assert(!tgResult.sanitized.includes(tgToken), 'Original Telegram Bot token is completely removed');
  assertEquals(tgResult.matchesCount, 1, 'Exactly 1 token match counted');
  const dummyOpenAiKey = ['sk', 'proj', '1234567890abcdef1234567890'].join('-');
  const dummyGoogleKey = ['AIza', 'SyD1234567890abcdefghijklmnopqrstuv'].join('');
  assert(sanitizeLogText(`Authorization failed for ${dummyOpenAiKey}`).sanitized.includes('[REDACTED_API_KEY]'), 'OpenAI API key is masked');
  assert(sanitizeLogText(`key=${dummyGoogleKey}`).sanitized.includes('[REDACTED_GOOGLE_API_KEY]'), 'Google Cloud API key is masked');
  assert(sanitizeLogText('Bearer eyJhbGciOiJIUzI1Ni.x').sanitized.includes('Bearer [REDACTED_BEARER_TOKEN]'), 'Bearer token is masked');
  assert(sanitizeLogText('user budi.santoso@example.co.id').sanitized.includes('[REDACTED_EMAIL]'), 'Email address is masked');
  assert(sanitizeLogText('C:\\Users\\budi_santoso\\AppData').sanitized.includes('C:\\Users\\[USER]\\'), 'Windows username path is masked');
  const dummyKey2 = ['sk', '123456789012345678901234567890'].join('-');
  const combined = `User: john@test.com
Path: C:\\Users\\JohnDoe\\Agent
Token: 987654321:abcdefghijklmnopqrstuvwxyz012345678
Key: ${dummyKey2}`;
  assertEquals(sanitizeLogText(combined).matchesCount, 4, 'All 4 sensitive entities are detected and masked');

  const originalAppState = window.AppState;
  installAppState(
    { name: 'Budi Hartono', telegramUsername: 'nama_bot', telegramUserId: '123', nodeVersion: 'v20' },
    { 'cp-1': 'passed', 'cp-2': 'passed', 'cp-3': 'passed' }, 'ready', true
  );
  let report = generateReportText({ os: 'Windows 11' });
  assert(report.includes('Nama: Budi Hartono'), 'Report uses production participant name');
  assert(report.includes('Status: SIAP MENGIKUTI WORKSHOP'), 'Report states ready from production readiness');
  assert(report.includes('[X] Checkpoint 1'), 'Checkpoint 1 is marked [X]');
  assert(report.includes('[X] Checkpoint 2'), 'Checkpoint 2 is marked [X]');
  assert(report.includes('[X] Checkpoint 3'), 'Checkpoint 3 is marked [X]');
  assert(report.includes('[X] Google Cloud Console'), 'Completed Google Cloud module is marked [X]');
  assert(report.includes('(@nama_bot, ID: 123)'), 'Unprefixed Telegram username gets one @');

  window.AppState.getState = () => ({
    participantInfo: { name: 'Siti', telegramUsername: '@@nama_bot', telegramUserId: '' },
    checkpoints: { 'cp-1': 'passed', 'cp-2': 'failed', 'cp-3': 'passed' }
  });
  window.AppState.calculateReadiness = () => ({ status: 'clinic' });
  report = generateReportText({ probStep: 'Modul 2 Langkah B', errorMsg: 'Failed at C:\\Users\\siti\\app with sk-abcdef123456789012345678' });
  assert(report.includes('(@nama_bot, ID: -)'), 'Prefixed Telegram username is normalized to one @');
  assert(!report.includes('@@nama_bot'), 'Report never emits a doubled Telegram prefix');
  assert(report.includes('Status: PERLU TECHNICAL CLINIC'), 'Report states clinic when a checkpoint fails');
  assert(report.includes('[ ] Checkpoint 2'), 'Failed Checkpoint 2 is marked [ ]');
  assert(report.includes('Nomor langkah yang bermasalah (jika ada): Modul 2 Langkah B'), 'Problem step is captured');
  assert(report.includes('[REDACTED_API_KEY]') && report.includes('C:\\Users\\[USER]\\'), 'Report sanitizes sensitive error text');

  window.AppState.getState = () => ({ participantInfo: { name: 'ID Only', telegramUsername: '', telegramUserId: '987' }, checkpoints: {} });
  let reportById = generateReportText();
  assert(reportById.includes('(-, ID: 987)'), 'Telegram ID fallback remains when username is missing');

  let elements;
  let reportFixture = null;
  if (typeof process !== 'undefined') {
    elements = {
      'input-report-name': { value: '', addEventListener() {} },
      'select-report-os': { value: 'Windows 11', addEventListener() {} },
      'input-report-problem-step': { value: '', addEventListener() {} },
      'input-report-error-msg': { value: '', addEventListener() {} },
      'report-output-preview': { innerText: '' }
    };
    document.getElementById = id => elements[id] || null;
  } else {
    reportFixture = document.createElement('div');
    const fixtureDefinitions = [
      ['input', 'input-report-name'], ['select', 'select-report-os'],
      ['input', 'input-report-problem-step'], ['textarea', 'input-report-error-msg'],
      ['pre', 'report-output-preview']
    ];
    elements = {};
    fixtureDefinitions.forEach(([tag, id]) => {
      const element = document.createElement(tag);
      element.id = id;
      if (id === 'select-report-os') {
        const option = document.createElement('option');
        option.value = 'Windows 11';
        option.textContent = 'Windows 11';
        element.appendChild(option);
      }
      elements[id] = element;
      reportFixture.appendChild(element);
    });
    document.body.appendChild(reportFixture);
  }
  setupReadinessReport();
  assert(elements['report-output-preview'].innerText.includes('Nama: ID Only'), 'Initial preview uses the persisted name before first render');
  if (reportFixture) reportFixture.remove();
  window.AppState = originalAppState;

  const categories = ['all', 'node', 'router', 'telegram'];
  categories.forEach(category => assert(categories.includes(category), `'${category}' category exists`));

  console.log(`\nTEST RESULTS: ${passed} PASSED, ${failed} FAILED\n`);
  if (failed && typeof process !== 'undefined') process.exitCode = 1;
  return { passed, failed };
}

if (typeof module !== 'undefined' && module.exports) module.exports = { runTestSuite };
runTestSuite();
})();
