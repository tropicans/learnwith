---
phase: "17"
slug: "url-gate-hardening-session-management-anti-tampering"
status: draft
nyquist_compliant: true
wave_0_complete: false
created: "2026-09-07"
---

# Phase 17 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Node.js built-in assertion tests + Playwright Python E2E |
| **Config file** | `tests/session-security.test.js` |
| **Quick run command** | `& C:\nvm4w\nodejs\node.exe tests/session-security.test.js` |
| **Full suite command** | `& C:\nvm4w\nodejs\node.exe tests/session-security.test.js; python scratch/test_phase17_security.py` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `& C:\nvm4w\nodejs\node.exe tests/session-security.test.js`
- **After every plan wave:** Run `& C:\nvm4w\nodejs\node.exe tests/session-security.test.js; python scratch/test_phase17_security.py`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 17-01-01 | 01 | 1 | SEC-05, SEC-06 | T-17-01, T-17-02 | Stubs test harness for URL bypass rejection and session security | unit | `& C:\nvm4w\nodejs\node.exe tests/session-security.test.js` | ❌ W0 | ⬜ pending |
| 17-01-02 | 01 | 2 | SEC-05 | T-17-01 | Rejects unauthenticated bypasses (`?unlock=dev/word/1/live/class`), checks SHA-256 for authorized link, cleans URL history | integration | `& C:\nvm4w\nodejs\node.exe tests/session-security.test.js` | ❌ W0 | ⬜ pending |
| 17-01-03 | 01 | 2 | SEC-06 | T-17-02 | Tab-scoped session storage with integrity checksum and 15-minute inactivity auto-lock | integration / e2e | `python scratch/test_phase17_security.py` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/session-security.test.js` — test suite covering URL parameter rejection, authorized token validation, URL cleansing, and session integrity
- [ ] `scratch/test_phase17_security.py` — Playwright browser test verifying URL stripping and auto-lock in live browser context

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Visual lock icon and modal responsiveness in browser UI | SEC-05, SEC-06 | Visual aesthetics and UI feedback verification | Open `index.html` in browser, verify lock badges on sidebar and topbar, test passcode modal and auto-lock toast. |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 10s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending 2026-09-07
