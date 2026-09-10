---
phase: "32"
slug: "workshop-access-passkey-management-troubleshooting-audit-hub"
status: draft
nyquist_compliant: true
wave_0_complete: false
created: "2026-09-09"
---

# Phase 32 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Node.js native test runner (`node:test`, `node:assert`) |
| **Config file** | none — native test runner |
| **Quick run command** | `node --test tests/admin-passkey.test.js tests/admin-troubleshooting.test.js` |
| **Full suite command** | `npm run test:node` |
| **Estimated runtime** | ~2 seconds |

---

## Sampling Rate

- **After every task commit:** Run `node --test tests/admin-passkey.test.js` or `tests/admin-troubleshooting.test.js`
- **After every plan wave:** Run `npm run test:node`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 32-01-01 | 01 | 1 | ADMIN-PASS-01, ADMIN-PASS-02, ADMIN-PASS-03 | T-32-01, T-32-03, T-32-05 | Timing-safe hash comparison, dynamic rotation, sliding-window rate limit, masked audit prefix | unit / integration | `node --test tests/admin-passkey.test.js` | ❌ W0 | ⬜ pending |
| 32-01-02 | 01 | 1 | ADMIN-PASS-01, ADMIN-PASS-02, ADMIN-PASS-03 | T-32-02 | Admin authentication required for passkey rotation RPCs | unit / component | `node --test tests/admin-passkey.test.js` | ❌ W0 | ⬜ pending |
| 32-02-01 | 02 | 2 | ADMIN-LOG-01, ADMIN-LOG-02 | T-32-04 | Error message ingestion with dual-layer secret redaction & regex categorization | unit / integration | `node --test tests/admin-troubleshooting.test.js` | ❌ W0 | ⬜ pending |
| 32-02-02 | 02 | 2 | ADMIN-LOG-01, ADMIN-LOG-02 | T-32-04 | Incident management, frequency badges, search filters & drawer modal | component / E2E | `node --test tests/admin-troubleshooting.test.js` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/admin-passkey.test.js` — test suite for passkey retrieval, rotation, rate limiting, and audit logging
- [ ] `tests/admin-troubleshooting.test.js` — test suite for error log ingestion, auto-classification, and filtering

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Passkey rotation visual confirmation | ADMIN-PASS-02 | Visual UX review in browser | Open `/admin`, switch to Passkeys tab, rotate passkey, verify new hash appears |
| Troubleshooting drawer review | ADMIN-LOG-02 | Layout & accessibility review | Open `/admin`, switch to Troubleshooting tab, click incident row to inspect drawer |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 5s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** verified 2026-09-09