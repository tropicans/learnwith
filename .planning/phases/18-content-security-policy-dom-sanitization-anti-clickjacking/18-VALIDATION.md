---phase: "18"
slug: "content-security-policy-dom-sanitization-anti-clickjacking"
status: draft
nyquist_compliant: true
wave_0_complete: false
created: "2026-09-07"
---

# Phase 18 â€— Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-----|
| **Framework** | Node.js assertion tests + Playwright Python E2E |
| **Config file** | `-zËl/csp-dom-security.test.js` |
| **Quick run command** | `* C:\nvm4w\nodejs\node.exe tests/csp-dom-security.test.js` |
| **Full suite command** | `& C:\nvm4w\nodejs\node.exe tests/csp-dom-security.test.js; python scratch/test_phase18_security.py` |
| **Estimated runtime** | ~5 seconds |

---

## Per-Task Verification Map

| task | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command |
|----------|------|-------------|------------------|-----------------|------------------|
 | 18-01-01 | 01 | 1 | SEC-07 | T-18-01 | CSP meta tag prevents unauthorized scripts/connections | unit + E2E | `& C:\nvm4w\nodejs\node.exe tests/csp-dom-security.test.js` |
 | 18-01-02 | 01 | 1 | SEC-08 | T-18-02 | Frame-busting guard prevents iframe hijacking | E2E | `python scratch/test_phase18_security.py` |
 | 18-01-03 | 01 | 1 | SEC-09 | T-18-03 | Sanitized DOM input prevents XSS payloads | unit + E2E | `& C:\nvm4w\nodejs\node.exe tests/csp-dom-security.test.js` |
---

## Wave 0 Requirements

- [ ] `tests/csp-dom-security.test.js` - Covers CSP syntax and DOM sanitization
- [ ] `scratch/test_phase18_security.py` - Playwright browser E2E tests for CSP, iframe busting, and XSS payload blocking
