# Testing Patterns

**Analysis Date:** 2026-09-08

## Test Framework

**Runner:**
- Custom Zero-Dependency Dual-Environment Test Harness (`tests/index.html`, `tests/*.test.js`)
- Runs natively in modern browsers and in Node.js (v20+ / v22+ / v25+) without requiring Jest, Vitest, Mocha, or Playwright.

**Assertion Library:**
- Lightweight built-in assertion helpers in each test module (`assert`, `assertEquals`, `assert.strictEqual`).

**Run Commands:**
```bash
# Run all automated test suites via Node.js
node tests/checkpoint-engine.test.js
node tests/troubleshooting-exporter.test.js
node tests/search-security.test.js
node tests/mobile-accessibility.test.js
node tests/mode-switcher.test.js
node tests/live-class-modules.test.js
node tests/multi-course.test.js
node tests/word-modules.test.js
node tests/word-quiz-report.test.js
node tests/session-security.test.js
node tests/csp-dom-security.test.js

# Or run interactively in the browser:
# Open tests/index.html in Chrome, Firefox, Safari, or Edge
```

## Test File Organization

**Location:**
- Centrally located in the `tests/` directory at the repository root.

**Test Suites:**
1. `tests/checkpoint-engine.test.js`: State manager, checklists, checkpoints, and readiness evaluation.
2. `tests/troubleshooting-exporter.test.js`: Secret redaction engine, report generation, and Telegram formatting.
3. `tests/search-security.test.js`: DOM search highlighting, XSS sanitization, and toast safety.
4. `tests/mobile-accessibility.test.js`: ARIA roles, focus trapping, mobile navigation drawer, and 44px touch targets.
5. `tests/mode-switcher.test.js`: Pra-Training vs Hari-H mode switching and navigation shell.
6. `tests/live-class-modules.test.js`: Live workshop modules 6–11 and checkpoints 4–9.
7. `tests/multi-course.test.js`: Multi-course state isolation (`learnwith_ai_*` vs `learnwith_word_*`) and gate modal.
8. `tests/word-modules.test.js`: Course 2 Bab I–IV guides, checklist tracking, and checkpoints.
9. `tests/word-quiz-report.test.js`: Bab V 20-question quiz scoring (KKM 80), self-reflection, rubric, and BPSDM report.
10. `tests/session-security.test.js`: URL gate hardening, session tokens, auto-lock timeout, anti-tampering.
11. `tests/csp-dom-security.test.js`: Content Security Policy header, anti-clickjacking frame guard, and DOM sanitization.

## Mocking

**Framework:** Custom minimal mock objects tailored for headless Node.js execution.

**Patterns:**
- **LocalStorage & SessionStorage Mock:** In-memory objects implementing `getItem()`, `setItem()`, `removeItem()`, and `clear()`. Note: In Node.js 22+, `global.localStorage` should be assigned explicitly before loading modules.
- **DOM Mock:** Lightweight mock element tree implementing `getElementById()`, `querySelector()`, `querySelectorAll()`, `classList`, and `style`.

**What to Mock:**
- Browser globals when running in Node.js (`window`, `localStorage`, `sessionStorage`, `document`, `crypto.subtle`).
- Hardware APIs like `navigator.clipboard`.

**What NOT to Mock:**
- State transitions, checklist calculation math, quiz evaluation, and readiness status logic (`StateManager`).
- Regex replacement engines and token redaction logic (`sanitizeLogText`).
- String formatting logic for readiness reports and BPSDM certificate generation.

## Test Types

**1. Unit Tests:**
- State management algorithms, progress calculation, and quiz scoring accuracy.
- Regex redaction pattern matching.
- SHA-256 passcode hashing verification.

**2. Integration & Security Tests:**
- End-to-end multi-course isolation without cross-contamination.
- Auto-lock session expiration and URL history cleansing.
- CSP directive syntax and frame-busting guard presence.

**3. Accessibility & Mobile Tests:**
- ARIA expanded/controls binding, mobile navigation transitions, 44px touch targets.

---

*Testing analysis: 2026-09-08*
