---
phase: "26"
slug: "checklist-engine-checkpoint-gates-dynamic-readiness"
status: draft
nyquist_compliant: true
wave_0_complete: false
created: "2026-09-09"
---

# Phase 26 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Node.js Test Runner (node:test, node:assert) |
| **Config file** | package.json |
| **Quick run command** | `& 'C:\nvm4w\nodejs\node.exe' --test tests/pretraining-checklist.test.js` |
| **Full suite command** | `& 'C:\nvm4w\nodejs\node.exe' --test tests/*.test.js` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `& 'C:\nvm4w\nodejs\node.exe' --test tests/pretraining-checklist.test.js`
- **After every plan wave:** Run `& 'C:\nvm4w\nodejs\node.exe' --test tests/*.test.js`
- **Before `/gsd-verify-work`:** Full suite must be green + `tsc --noEmit` clean
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 26-01-01 | 01 | 1 | PRE-CHK-01, PRE-CHK-02, PRE-CHK-03 | — | Typesafe pretraining state hook and normalized 13-step dataset | unit | `pwsh -Command "Test-Path app/hooks/usePretrainingState.ts"` | ❌ W0 | ⬜ pending |
| 26-01-02 | 01 | 1 | PRE-CHK-02 | — | Checkpoint gate cards with validation and 3-state buttons | unit | `pwsh -Command "Test-Path app/components/course/pretraining/CheckpointGateCard.tsx, app/components/course/pretraining/PretrainingCheckpointsSection.tsx"` | ❌ W0 | ⬜ pending |
| 26-01-03 | 01 | 1 | PRE-CHK-03, PRE-CHK-04 | — | Dynamic readiness status section and safe reset modal | unit | `pwsh -Command "Test-Path app/components/course/pretraining/PretrainingReadinessSection.tsx, app/components/course/pretraining/ResetProgressModal.tsx"` | ❌ W0 | ⬜ pending |
| 26-02-01 | 02 | 2 | PRE-CHK-01, PRE-CHK-02, PRE-CHK-03, PRE-CHK-04 | — | Route integration, hero stats sync, and checkbox interactivity | integration | `pwsh -Command "& 'C:\nvm4w\nodejs\node.exe' ./node_modules/typescript/bin/tsc --noEmit"` | ❌ W0 | ⬜ pending |
| 26-02-02 | 02 | 2 | PRE-CHK-01..04 | — | Automated unit/integration test suite for checklist, gates & readiness | unit/integration | `& 'C:\nvm4w\nodejs\node.exe' --test tests/pretraining-checklist.test.js` | ❌ W0 | ⬜ pending |
| 26-02-03 | 02 | 2 | PRE-CHK-01..04 | — | Full suite zero regression verification | regression | `& 'C:\nvm4w\nodejs\node.exe' --test tests/*.test.js` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/pretraining-checklist.test.js` — test suite covering PRE-CHK-01 through PRE-CHK-04

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Checkbox State Persistence | PRE-CHK-01 | Browser LocalStorage | Check items in Module 1, refresh browser, verify checkboxes remain checked |
| Reset Progress Dialog | PRE-CHK-04 | Interactive Modal UX | Click Reset Progres button, verify modal appears, cancel preserves state, confirm resets all |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 10s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** 2026-09-09
