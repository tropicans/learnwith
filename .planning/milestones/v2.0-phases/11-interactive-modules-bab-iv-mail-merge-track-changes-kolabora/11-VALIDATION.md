---
phase: "11"
slug: "interactive-modules-bab-iv-mail-merge-track-changes-kolaborasi-dokumen"
status: draft
nyquist_compliant: true
wave_0_complete: false
created: "2026-09-07"
---

# Phase 11 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Node.js Built-in assert / Custom Runner (`tests/*.test.js`) |
| **Config file** | `tests/word-modules.test.js` |
| **Quick run command** | `cmd /c "set PATH=C:\nvm4w\nodejs;%PATH% && node tests/word-modules.test.js"` |
| **Full suite command** | `cmd /c "set PATH=C:\nvm4w\nodejs;%PATH% && node tests/word-modules.test.js && node tests/multi-course.test.js && node tests/checkpoint-engine.test.js"` |
| **Estimated runtime** | ~2 seconds |

---

## Sampling Rate

- **After every task commit:** Run `cmd /c "set PATH=C:\nvm4w\nodejs;%PATH% && node tests/word-modules.test.js"`
- **After every plan wave:** Run `cmd /c "set PATH=C:\nvm4w\nodejs;%PATH% && node tests/word-modules.test.js && node tests/multi-course.test.js && node tests/checkpoint-engine.test.js"`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 11-01-01 | 01 | 0 | WORD-04, WORD-05 | T-11-01 | Test scaffolding and assertions for Bab IV and Checkpoint 3 | unit | `cmd /c "set PATH=C:\nvm4w\nodejs;%PATH% && node tests/word-modules.test.js"` | ✅ | ⬜ pending |
| 11-01-02 | 01 | 1 | WORD-04 | T-11-02 | Scoped state defaults, Bab IV checklist & Checkpoint 3 tracking | unit | `cmd /c "set PATH=C:\nvm4w\nodejs;%PATH% && node tests/word-modules.test.js"` | ✅ | ⬜ pending |
| 11-01-03 | 01 | 1 | WORD-04 | T-11-03 | CourseManager & Checkpoint 3 Gate event handling in app.js | integration | `cmd /c "set PATH=C:\nvm4w\nodejs;%PATH% && node tests/word-modules.test.js && node tests/multi-course.test.js"` | ✅ | ⬜ pending |
| 11-02-01 | 02 | 2 | WORD-04, WORD-05 | T-11-04 | Bab IV interactive module markup, 8 steps, Mail Merge rules | DOM / unit | `cmd /c "set PATH=C:\nvm4w\nodejs;%PATH% && node tests/word-modules.test.js"` | ✅ | ⬜ pending |
| 11-02-02 | 02 | 2 | WORD-04 | T-11-05 | Checkpoint 3 gate card, verification criteria, action buttons | DOM / unit | `cmd /c "set PATH=C:\nvm4w\nodejs;%PATH% && node tests/word-modules.test.js"` | ✅ | ⬜ pending |
| 11-02-03 | 02 | 3 | WORD-04, WORD-05 | T-11-06 | Sidebar navigation, search index sync, browser runner | integration | `cmd /c "set PATH=C:\nvm4w\nodejs;%PATH% && node tests/word-modules.test.js && node tests/multi-course.test.js"` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/word-modules.test.js` — expanded with assertions for 8 Bab IV tasks (`word-b4-*`), `word-cp-3`, and updated readiness evaluation

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|---|---|---|---|
| Visual rendering of Mail Merge rule code cards and diff cards | WORD-04, WORD-05 | Visual styling fidelity & layout responsiveness | Open `index.html` in browser, navigate to Bab IV, check formula styling and mobile responsiveness |
| 1-click clipboard copy for Mail Merge rule formulas | WORD-05 | Native browser clipboard API permission | Click 1-click copy buttons for IF-THEN formulas and verify toast notification |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 5s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending 2026-09-07
