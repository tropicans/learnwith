# Testing Patterns

**Analysis Date:** 2026-09-04

## Test Framework

**Runner:**
- Custom Zero-Dependency Dual-Environment Test Harness (`tests/index.html`, `tests/*.test.js`)
- Runs natively in modern browsers and in Node.js (v20+ / v22+) without requiring Jest, Vitest, Mocha, or Playwright.

**Assertion Library:**
- Lightweight built-in assertion helpers in each test module:
  - `assert(condition, testName)`: Basic truthiness assertion.
  - `assertEquals(actual, expected, testName)`: Deep structural equality using `JSON.stringify` comparison.

**Run Commands:**
```bash
# Run all automated test suites via Node.js
node tests/checkpoint-engine.test.js
node tests/troubleshooting-exporter.test.js
node tests/search-security.test.js
node tests/mobile-accessibility.test.js

# Or run interactively in the browser:
# Open tests/index.html in Chrome, Firefox, Safari, or Edge
```

## Test File Organization

**Location:**
- Centrally located in the `tests/` directory at the repository root.

**Naming:**
- Kebab-case naming with `.test.js` extension:
  - `tests/checkpoint-engine.test.js`: State manager, checklists, checkpoints, and readiness evaluation.
  - `tests/troubleshooting-exporter.test.js`: Secret redaction engine, report generation, and Telegram formatting.
  - `tests/search-security.test.js`: DOM search highlighting, XSS sanitization, and toast safety.
  - `tests/mobile-accessibility.test.js`: ARIA roles, focus trapping, mobile navigation drawer, and 44px touch targets.
  - `tests/index.html`: Browser test harness page that executes all test files and displays formatted logs.

## Test Structure

**Suite Organization:**
```javascript
(function () {
  // 1. Environment Polyfills for Node.js
  if (typeof window === 'undefined') global.window = {};
  if (typeof localStorage === 'undefined') {
    global.localStorage = {
      _data: {},
      getItem(key) { return this._data[key] || null; },
      setItem(key, val) { this._data[key] = String(val); },
      clear() { this._data = {}; }
    };
  }
  if (typeof document === 'undefined') {
    global.document = { ... };
  }

  // 2. Production Code Import
  const ProductionStateManager = typeof module !== 'undefined' && module.exports
    ? require('../assets/js/state.js').StateManager
    : window.AppState && window.AppState.constructor;

  // 3. Test Suites & Assertions
  function runTests() {
    console.log('--- STARTING TESTS ---');
    assert(typeof ProductionStateManager === 'function', 'Export is available');
    // ... test suites
  }

  runTests();
})();
```

## Mocking

**Framework:** Custom minimal mock objects tailored for headless Node.js execution.

**Patterns:**
- **LocalStorage Mock:** An in-memory object implementing `getItem()`, `setItem()`, `removeItem()`, and `clear()`.
- **DOM Mock:** Minimal mocked `document` implementing `getElementById()`, `querySelector()`, `addEventListener()`, and `setAttribute()`.
- **Production Code Isolation:** Always tests production source files (`assets/js/*.js`), never duplicate mock implementations.

**What to Mock:**
- Browser globals when running in Node.js (`window`, `localStorage`, `document`).
- Hardware APIs like `navigator.clipboard`.

**What NOT to Mock:**
- State transitions, checklist calculation math, and readiness status logic (`StateManager`).
- Regex replacement engines and token redaction logic (`sanitizeLogText`).
- String formatting logic for readiness reports.

## Coverage

**Requirements:**
- 100% pass rate on all 62 assertions across the 4 test suites.
- Strict zero-regression policy on security (XSS prevention) and token redaction.

**View Test Results:**
- Node CLI output prints passing badges (`✓ PASS`) and exit code `0`.
- Browser UI in `tests/index.html` renders color-coded terminal cards.

## Test Types

**1. Unit Tests:**
- `tests/checkpoint-engine.test.js`: Verifies isolated logic of `StateManager` (module task counting, percentage calculations, status state machine).
- `tests/troubleshooting-exporter.test.js`: Verifies individual regex patterns for masking sensitive tokens (Telegram, OpenAI, Google Cloud, Bearer tokens).

**2. Integration Tests:**
- Full flow verification: Loading state from `localStorage`, updating multiple checklist items, verifying checkpoint gate conditions, and generating the final formatted WhatsApp/Telegram report.

**3. Security & DOM Integrity Tests:**
- `tests/search-security.test.js`: Ensures search queries containing malicious HTML (`<img src=x onerror=alert(1)>`) are escaped and do not create executable DOM nodes.
- Verifies that search highlight unwrapping preserves live input states and existing event listeners.

**4. Accessibility & Mobile UX Tests:**
- `tests/mobile-accessibility.test.js`: Checks mobile drawer opening, backdrop clicks, Escape key listeners, aria attributes (`aria-expanded`, `aria-controls`), and minimum 44px touch targets.

## Common Patterns

**Asserting State Mutations:**
```javascript
localStorage.clear();
const sm = new ProductionStateManager();
sm.updateChecklist('m1-check-node', true);
assertEquals(sm.getModuleProgress('m1-').completed, 1, 'Module 1 reflects 1 completed task');
```

**Asserting Redaction of Sensitive Tokens:**
```javascript
const sensitiveLog = 'Bot token: 123456789:ABCdefGHIjklMNOpqrsTUVwxyz1234567';
const sanitized = sanitizeLogText(sensitiveLog);
assert(!sanitized.includes('123456789:ABCdefGHIjklMNOpqrsTUVwxyz1234567'), 'Token is redacted');
assert(sanitized.includes('[REDACTED_TELEGRAM_BOT_TOKEN]'), 'Masking placeholder present');
```

---

*Testing analysis: 2026-09-04*
