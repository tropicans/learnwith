---
phase: "37"
slug: "end-to-end-verification-zero-regression-audit"
status: draft
nyquist_compliant: false
wave_0_complete: false
created: "2026-09-10"
---

# Phase 37 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Node.js Test Runner (`node --test`) |
| **Config file** | `package.json` |
| **Quick run command** | `node --test tests/course-lifecycle-e2e.test.js` |
| **Full suite command** | `node --test tests/*.test.js` |
| **Estimated runtime** | ~3 seconds |

---

## Sampling Rate

- **After every task commit:** Run `node --test tests/course-lifecycle-e2e.test.js`
- **After every plan wave:** Run `node --test tests/course-lifecycle-*.test.js`
- **Before `/gsd-verify-work`:** Full suite must be green (`node --test tests/*.test.js`, 33 suites, ≥ 305 tests) + `npm run typecheck` passes with 0 errors
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 37-01-01 | 01 | 1 | COURSE-TEST-01 | T-37-01 | Store immutability: defensive cloning prevents external tampering of store state | unit | `node --test tests/course-lifecycle-store.test.js` | ✅ | ⬜ pending |
| 37-01-02 | 01 | 1 | COURSE-TEST-01 | T-37-02 | Comprehensive 16-combination transition matrix & invalid transition rejection | unit | `node --test tests/course-lifecycle-e2e.test.js` | ❌ W0 | ⬜ pending |
| 37-01-03 | 01 | 1 | COURSE-TEST-01 | T-37-03 | Mutation RPC execution, audit trail integrity & unauthorized session denial | integration | `node --test tests/course-lifecycle-e2e.test.js` | ❌ W0 | ⬜ pending |
| 37-02-01 | 02 | 2 | COURSE-TEST-02 | T-37-04 | Public catalog filtering, empty states, and direct workspace access verification | integration | `node --test tests/course-lifecycle-e2e.test.js` | ❌ W0 | ⬜ pending |
| 37-02-02 | 02 | 2 | COURSE-TEST-02 | T-37-05 | Zero regression across all existing 32 suites (289+ baseline tests) & passkey gates | integration | `node --test tests/*.test.js` | ✅ | ⬜ pending |
| 37-02-03 | 02 | 2 | COURSE-TEST-02 | — | TypeScript typecheck compilation & CSS mirror parity | build | `npm run typecheck` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/course-lifecycle-e2e.test.js` — comprehensive end-to-end audit test suite covering store immutability, full 4x4 transition matrix, mutation RPC security, public catalog filtering, and direct route access UX.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Multi-tab real-time sync audit | COURSE-TEST-02 | Cross-window visual verification of BroadcastChannel reactive updates | Open `/` in Window A, toggle visibility in `/admin` on Window B; verify card instantly disappears/re-appears in Window A. |
| Production Docker smoke container test | COURSE-TEST-02 | Containerized environment runtime verification | Execute `npm run test:smoke` or build and run Docker image to verify production SSR container runs cleanly. |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending