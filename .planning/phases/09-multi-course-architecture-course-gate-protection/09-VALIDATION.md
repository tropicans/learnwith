---
phase: "9"
slug: "multi-course-architecture-course-gate-protection"
status: validated
nyquist_compliant: true
wave_0_complete: true
created: "2026-09-07"
---

# Phase 9 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Native Node.js test runner & Edge browser headless runner |
| **Config file** | none (vanilla ES6 assertions in `tests/`) |
| **Quick run command** | `node tests/multi-course.test.js` |
| **Full suite command** | `node tests/multi-course.test.js && node tests/mode-switcher.test.js && node tests/live-class-modules.test.js` |
| **Estimated runtime** | ~3 seconds |

---

## Sampling Rate

- **After every task commit:** Run `node tests/multi-course.test.js`
- **After every plan wave:** Run full test suite (`tests/multi-course.test.js`, `tests/mode-switcher.test.js`, `tests/live-class-modules.test.js`)
- **Before `/gsd-verify-work`:** Full suite must be green (100% pass)
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 09-01-01 | 01 | 1 | GATEWAY-01, GATEWAY-03 | T-09-01 | State storage namespaced with zero cross-course bleed; legacy state migrated smoothly | unit | `node tests/multi-course.test.js` | ✅ | ✅ green |
| 09-01-02 | 01 | 1 | GATEWAY-01 | T-09-01 | Legacy `pretraining_app_state_v1` untouched and functional without regression | unit | `node tests/mode-switcher.test.js` | ✅ | ✅ green |
| 09-02-01 | 02 | 2 | GATEWAY-02 | T-09-02 | Course 2 gate modal blocks unauthenticated entry until passcode 'buka-kata' or '?course=word&unlock=dev' | unit / dom | `node tests/multi-course.test.js` | ✅ | ✅ green |
| 09-02-02 | 02 | 2 | GATEWAY-01, GATEWAY-02 | T-09-02 | Course Switcher seamlessly toggles course containers and updates document metadata | unit / dom | `node tests/multi-course.test.js` | ✅ | ✅ green |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [x] `tests/multi-course.test.js` — Test suite stubs for multi-course switching, namespaced StateManager, migration, and gate protection.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Course switcher dropdown visual animation and mobile drawer responsiveness | GATEWAY-01, GATEWAY-02 | Visual UX fidelity | Open `index.html` on mobile viewport, click course dropdown, toggle between courses |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 5s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending 2026-09-07
