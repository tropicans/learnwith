---
phase: "33"
slug: "global-platform-configuration-announcement-banner-e2e-zero-regression"
status: draft
nyquist_compliant: true
wave_0_complete: false
created: "2026-09-09"
---

# Phase 33 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Node.js native test runner (`node:test`, `node:assert`) |
| **Config file** | none — native test runner |
| **Quick run command** | `node --test tests/admin-config.test.js` |
| **Full suite command** | `npm test` |
| **Estimated runtime** | ~2.5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `node --test tests/admin-config.test.js`
- **After every plan wave:** Run `npm test` and `npm run typecheck`
- **Before `/gsd-verify-work`:** Full suite must be green (all 26 test files, 225+ tests, 0 regressions)
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 33-01-01 | 01 | 1 | ADMIN-CFG-01, ADMIN-CFG-02 | T-33-01, T-33-03 | In-memory configuration store, deterministic defaults, version tracking, schema validation | unit / integration | `node --test tests/admin-config.test.js` | ❌ W0 | ⬜ pending |
| 33-01-02 | 01 | 1 | ADMIN-CFG-01, ADMIN-CFG-02, ADMIN-QA-01 | T-33-02, T-33-05 | Admin session verification on config mutations, secret quarantine in public vs admin config | unit / RPC | `node --test tests/admin-config.test.js` | ❌ W0 | ⬜ pending |
| 33-01-03 | 01 | 1 | ADMIN-CFG-01, ADMIN-CFG-02 | T-33-02 | Interactive Admin Settings Console, workshop mode toggle card, live banner preview, styling | component | `node --test tests/admin-config.test.js` | ❌ W0 | ⬜ pending |
| 33-02-01 | 02 | 2 | ADMIN-CFG-02 | T-33-04 | Global Announcement Banner component, top-level layout mount in `__root.tsx`, dismissibility | component / layout | `node --test tests/admin-config.test.js` | ❌ W0 | ⬜ pending |
| 33-02-02 | 02 | 2 | ADMIN-QA-01, ADMIN-QA-02 | T-33-01..05 | Comprehensive test suite (`tests/admin-config.test.js`), 0 TypeScript errors, 100% test pass rate | unit / E2E / regression | `npm test` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/admin-config.test.js` — test suite for platform configuration store, workshop mode toggle, announcement banner lifecycle, secret isolation, and admin session enforcement.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Banner Visual Theme & Dismiss Animation | ADMIN-CFG-02 | Visual layout check in browser across desktop and mobile screens | Open `http://localhost:3000/`, verify banner renders above navigation, click dismiss button, refresh and confirm banner remains hidden. Change banner in admin console and verify it reappears with new content. |
| Workshop Mode Indicator in Client Header | ADMIN-CFG-01 | Visual badge placement | Verify platform shows subtle mode pill (e.g. "Mode Workshop: Pre-Training" vs "Live Class") when appropriate. |

---

## Validation Sign-Off Checklist

- [ ] All task verification rows mapped to automated test commands
- [ ] Wave 0 test file stub defined
- [ ] No regression across existing 213 test cases in 25 test files
- [ ] TypeScript compilation clean with 0 errors
