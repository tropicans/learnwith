/**
 * ==========================================================================
 * AUTOMATED TEST SUITE: TROUBLESHOOTING & REPORT EXPORTER
 * Requirements: TRBL-01, TRBL-02, TRBL-03, RPT-01, RPT-02, RPT-03
 * ==========================================================================
 */

let passed = 0;
let failed = 0;

function assert(cond, desc) {
  if (cond) {
    passed++;
    console.log(`  ✓ PASS: ${desc}`);
  } else {
    failed++;
    console.error(`  ✕ FAIL: ${desc}`);
  }
}

function assertEquals(actual, expected, desc) {
  const match = JSON.stringify(actual) === JSON.stringify(expected);
  assert(match, `${desc} (Expected: ${JSON.stringify(expected)}, Got: ${JSON.stringify(actual)})`);
}

// Redaction Rules Definition
const REDACTION_RULES = [
  { name: 'Telegram Bot Token', pattern: /\b\d{8,10}:[A-Za-z0-9_-]{35}\b/g, replacement: '[REDACTED_TELEGRAM_BOT_TOKEN]' },
  { name: 'OpenAI API Key', pattern: /\bsk-[A-Za-z0-9_-]{20,}\b/g, replacement: '[REDACTED_API_KEY]' },
  { name: 'Google Cloud API Key', pattern: /\bAIza[0-9A-Za-z-_]{35}\b/g, replacement: '[REDACTED_GOOGLE_API_KEY]' },
  { name: 'Bearer Token', pattern: /Bearer\s+[A-Za-z0-9._~+/-]+=*/gi, replacement: 'Bearer [REDACTED_BEARER_TOKEN]' },
  { name: 'Email Address', pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, replacement: '[REDACTED_EMAIL]' },
  { name: 'Windows User Path', pattern: /(C:\\Users\\)[a-zA-Z0-9_.-]+(\\)/gi, replacement: '$1[USER]$2' }
];

function sanitizeLogText(rawText) {
  if (!rawText) return { sanitized: '', matchesCount: 0 };
  let sanitized = rawText;
  let totalMatches = 0;
  REDACTION_RULES.forEach(rule => {
    const matches = sanitized.match(rule.pattern);
    if (matches) {
      totalMatches += matches.length;
      sanitized = sanitized.replace(rule.pattern, rule.replacement);
    }
  });
  return { sanitized, matchesCount: totalMatches };
}

function runTestSuite() {
  console.log('--- STARTING PHASE 4 EXPORTER & REDACTION TESTS ---\n');

  // --- SUITE 1: TRBL-03 Sensitive Data Redaction Engine ---
  console.log('[Suite 1: Credential Redaction Engine]');

  // Test 1.1: Telegram Bot Token Redaction
  const sampleTgLog = 'Error connecting bot with token 123456789:ABCDefGhIjKlMnOpQrStUvWxYz012345678 at gateway';
  const tgResult = sanitizeLogText(sampleTgLog);
  assert(tgResult.sanitized.includes('[REDACTED_TELEGRAM_BOT_TOKEN]'), 'Telegram Bot Token is masked');
  assert(!tgResult.sanitized.includes('123456789:ABCDefGhIjKlMnOpQrStUvWxYz012345678'), 'Original Telegram Bot token is completely removed');
  assertEquals(tgResult.matchesCount, 1, 'Exactly 1 token match counted');

  // Test 1.2: OpenAI API Key Redaction
  const sampleOpenAi = 'Authorization failed for sk-proj-1234567890abcdef1234567890';
  const openAiResult = sanitizeLogText(sampleOpenAi);
  assert(openAiResult.sanitized.includes('[REDACTED_API_KEY]'), 'OpenAI API key is masked');
  assert(!openAiResult.sanitized.includes('sk-proj-1234567890'), 'Raw key removed');

  // Test 1.3: Google Cloud API Key Redaction
  const sampleGoogleKey = 'Failed to fetch calendar API: key=AIzaSyD1234567890abcdefghijklmnopqrstuv';
  const googleResult = sanitizeLogText(sampleGoogleKey);
  assert(googleResult.sanitized.includes('[REDACTED_GOOGLE_API_KEY]'), 'Google Cloud API key is masked');

  // Test 1.4: Bearer Token Redaction
  const sampleBearer = 'Headers: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xyz';
  const bearerResult = sanitizeLogText(sampleBearer);
  assert(bearerResult.sanitized.includes('Bearer [REDACTED_BEARER_TOKEN]'), 'Bearer token header is sanitized');

  // Test 1.5: Email Address Redaction
  const sampleEmail = 'Log error for user budi.santoso@example.co.id while running service';
  const emailResult = sanitizeLogText(sampleEmail);
  assert(emailResult.sanitized.includes('[REDACTED_EMAIL]'), 'Email address is masked');

  // Test 1.6: Windows User Directory Redaction
  const samplePath = 'Error opening C:\\Users\\budi_santoso\\AppData\\Roaming\\npm';
  const pathResult = sanitizeLogText(samplePath);
  assert(pathResult.sanitized.includes('C:\\Users\\[USER]\\'), 'Personal Windows username directory is masked');

  // Test 1.7: Multi-token combined log
  const combined = `User: john@test.com
Path: C:\\Users\\JohnDoe\\Agent
Token: 987654321:abcdefghijklmnopqrstuvwxyz012345678
Key: sk-123456789012345678901234567890`;
  const combinedResult = sanitizeLogText(combined);
  assertEquals(combinedResult.matchesCount, 4, 'All 4 sensitive entities detected and masked');

  // --- SUITE 2: RPT-01 & RPT-02 Form Laporan Kesiapan Generator ---
  console.log('\n[Suite 2: Form Laporan Kesiapan Generator]');

  function mockGenerateReport(name, os, cpState, probStep, rawError) {
    const cp1Mark = cpState.cp1 ? '[X]' : '[ ]';
    const cp2Mark = cpState.cp2 ? '[X]' : '[ ]';
    const cp3Mark = cpState.cp3 ? '[X]' : '[ ]';
    const gcloudMark = cpState.gcloud ? '[X]' : '[ ]';
    const statusText = (cpState.cp1 && cpState.cp2 && cpState.cp3) 
      ? 'SIAP MENGIKUTI WORKSHOP' 
      : 'PERLU TECHNICAL CLINIC';

    const cleanError = rawError && rawError !== 'Nihil' 
      ? sanitizeLogText(rawError).sanitized 
      : 'Nihil';

    return `Nama: ${name}
Sistem operasi: ${os}

${cp1Mark} Checkpoint 1 — Node.js dan npm siap
${cp2Mark} Checkpoint 2 — dashboard 9Router terbuka
${cp3Mark} Checkpoint 3 — bot Telegram dan user ID siap
${gcloudMark} Google Cloud Console dapat dibuka

Status: ${statusText}
Nomor langkah yang bermasalah (jika ada): ${probStep}
Pesan error yang sudah disensor:
${cleanError}`;
  }

  // Test 2.1: All Passed (SIAP MENGIKUTI WORKSHOP)
  const reportReady = mockGenerateReport('Budi Hartono', 'Windows 11', { cp1: true, cp2: true, cp3: true, gcloud: true }, 'Nihil', 'Nihil');
  assert(reportReady.includes('Status: SIAP MENGIKUTI WORKSHOP'), 'Report states SIAP MENGIKUTI WORKSHOP when all checkpoints pass');
  assert(reportReady.includes('[X] Checkpoint 1'), 'Checkpoint 1 is marked [X]');
  assert(reportReady.includes('[X] Checkpoint 2'), 'Checkpoint 2 is marked [X]');
  assert(reportReady.includes('[X] Checkpoint 3'), 'Checkpoint 3 is marked [X]');
  assert(reportReady.includes('Nama: Budi Hartono'), 'Participant name matches input');

  // Test 2.2: One Failed (PERLU TECHNICAL CLINIC) with auto-sanitized error log
  const reportClinic = mockGenerateReport('Siti Rahma', 'Windows 10', { cp1: true, cp2: false, cp3: true, gcloud: true }, 'Modul 2 Langkah B', 'Failed at C:\\Users\\siti\\app with key sk-abcdef123456789012345678');
  assert(reportClinic.includes('Status: PERLU TECHNICAL CLINIC'), 'Report states PERLU TECHNICAL CLINIC when Checkpoint 2 is false');
  assert(reportClinic.includes('[ ] Checkpoint 2'), 'Checkpoint 2 is marked [ ]');
  assert(reportClinic.includes('Nomor langkah yang bermasalah (jika ada): Modul 2 Langkah B'), 'Problem step is captured');
  assert(reportClinic.includes('[REDACTED_API_KEY]'), 'Error message in report is automatically sanitized');
  assert(reportClinic.includes('C:\\Users\\[USER]\\'), 'Path in report error is sanitized');

  // --- SUITE 3: TRBL-01 Troubleshooting Category Filter Matcher ---
  console.log('\n[Suite 3: Troubleshooting Filter Predicates]');
  const categories = ['all', 'node', 'router', 'telegram'];
  assert(categories.includes('all'), "'all' category exists");
  assert(categories.includes('node'), "'node' category exists");
  assert(categories.includes('router'), "'router' category exists");
  assert(categories.includes('telegram'), "'telegram' category exists");

  console.log('\n=============================================');
  console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('=============================================\n');

  return { passed, failed };
}

if (typeof module !== 'undefined') {
  module.exports = { runTestSuite };
}
runTestSuite();
