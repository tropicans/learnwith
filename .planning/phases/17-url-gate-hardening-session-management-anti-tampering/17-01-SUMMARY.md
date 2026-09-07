# Phase 17 Plan Summary: URL Gate Hardening, Session Management & Anti-Tampering

**Phase:** 17 - URL Gate Hardening, Session Management & Anti-Tampering  
**Milestone:** v2.2 - Security Hardening & Rate Limiting  
**Requirements Addressed:** SEC-05, SEC-06  
**Status:** Completed  
**Execution Date:** 2026-09-07  

---

## 1. Executive Summary

Phase 17 eliminates unauthenticated URL parameter bypasses, mitigates cross-tab session leakage, defends against browser DevTools client-side tampering, and introduces a 15-minute sliding inactivity auto-lock for sensitive course modules.

All automated unit tests and Playwright E2E headless browser tests have passed with 100% assertion success rate.

---

## 2. Key Changes & Implementations

### A. Configuration (config.js)
- Added `sessionTimeoutMinutes: 15` to `window.LEARNWITH_CONFIG.security` to establish a centralized inactivity auto-lock threshold.

### B. Core Security Engine (assets/js/app.js - SessionSecurityManager)
1. **URL Gate Hardening (SEC-05)**:
   - Closed unauthenticated bypass parameter combinations (`?unlock=dev`, `?unlock=word`, `?unlock=1`, `?unlock=live`, `?unlock=class`).
   - Supports authorized direct links via `?code=<passcode>`. The input is verified using SHA-256 hash comparison against `ALLOWED_WORD_PASSCODE_HASHES` and `INSTRUCTOR_PASSCODES`.
   - URL query parameters (`code`, `unlock_code`, `passcode`, `token`, `unlock`, `auth`) are immediately stripped from the address bar via `window.history.replaceState` upon load.

2. **Tab-Scoped Session Management (SEC-06)**:
   - Replaced cross-tab persistent `localStorage` unlock flags with tab-scoped `sessionStorage` keys (`lw_session_word`, `lw_session_live`).
   - Session tokens conform to `{ unlocked: true, course, unlockedAt, expiresAt, checksum }`.

3. **Anti-Tampering Integrity Protection (SEC-06)**:
   - An ephemeral session seed (`window.__LW_SESSION_SEED`) is generated randomly per page lifecycle in memory via `window.crypto.getRandomValues(new Uint8Array(16))`.
   - Token integrity checksums (`SHA-256(course:expiresAt:sessionSeed)`) are verified on every unlock verification.
   - Forged `sessionStorage` tokens, modified expiration dates, or manual `localStorage.setItem` injections in the DevTools console are immediately detected and rejected.

4. **15-Minute Sliding Inactivity Auto-Lock (SEC-06)**:
   - Throttled event listeners (`mousemove`, `keydown`, `touchstart`, `scroll`, `click`) refresh sliding `expiresAt` timestamps.
   - When 15 minutes of inactivity elapse, `triggerAutoLock('inactivity')` wipes session tokens, resets UI lock badges, switches active view away from restricted content back to `home`, and presents a warning toast notification to the user.

### C. Automated Testing Suite
- **Unit Tests (tests/session-security.test.js)**: 4 test suites covering legacy bypass rejection, authorized passcode URLs + history cleansing, anti-tampering integrity, and inactivity auto-lock.
- **Backward Compatibility**: Existing test suites (`tests/multi-course.test.js`, `tests/mode-switcher.test.js`) maintained 100% pass rate (29/29 tests each).
- **Playwright E2E Audit (scratch/test_phase17_security.py)**: 5 live browser scenarios executing in headless Chromium with visual verification screenshot saved to `scratch/phase17_verified.png`.

---

## 3. Verification & Proof

- **E2E headless browser suite**: 5/5 PASSED
- **Node.js unit test suites**: 3/3 Passed (100%)
  - `session-security.test.js`: ALL PASSED
  - `multi-course.test.js`: 29 PASSED, 0 FAILED
  - `mode-switcher.test.js`: 29 PASSED