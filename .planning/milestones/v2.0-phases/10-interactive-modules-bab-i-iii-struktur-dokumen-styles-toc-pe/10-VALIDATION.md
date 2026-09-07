---
phase: "10"
slug: "interactive-modules-bab-i-iii-struktur-dokumen-styles-toc-penomoran-halaman"
status: draft
nyquist_compliant: true
wave_0_complete: false
created: "2026-09-07"
---

# Phase 10 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Node.js Built-in assert / Custom Runner (`tests/*.test.js`) |
| **Config file** | `tests/word-modules.test.js` (Wave 0) |
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
| 10-01-01 | 01 | 0 | WORD-01, WORD-02, WORD-03, WORD-05 | T-10-01 | Test scaffolding and assertions for Course 2 | unit | `cmd /c "set PATH=C:\nvm4w\nodejs;%PATH% && node tests/word-modules.test.js"` | ❌ W0 | ⬜ pending |
| 10-01-02 | 01 | 1 | WORD-01, WORD-02, WORD-03 | T-10-02 | Scoped state defaults, checklist & checkpoint tracking | unit | `cmd /c "set PATH=C:\nvm4w\nodejs;%PATH% && node tests/word-modules.test.js"` | ✅ | ⬜ pending |
| 10-01-03 | 01 | 1 | WORD-01, WORD-02, WORD-03 | T-10-03 | CourseManager & Checkpoint Gate event handling | integration | `cmd /c "set PATH=C:\nvm4w\nodejs;%PATH% && node tests/word-modules.test.js && node tests/multi-course.test.js"` | ✅ | ⬜ pending |
| 10-02-01 | 02 | 2 | WORD-01, WORD-05 | T-10-04 | Bab I briefing, dataset cards, shortcuts, standards | DOM / unit | `cmd /c "set PATH=C:\nvm4w\nodejs;%PATH% && node tests/word-modules.test.js"` | ✅ | ⬜ pending |
| 10-02-02 | 02 | 2 | WORD-02, WORD-03 | T-10-05 | Bab II-III guides, TOC, Section breaks, Checkpoints 1 & 2 | DOM / unit | `cmd /c "set PATH=C:\nvm4w\nodejs;%PATH% && node tests/word-modules.test.js"` | ✅ | ⬜ pending |
| 10-02-03 | 02 | 3 | WORD-01..05 | T-10-06 | Sidebar navigation, search index sync, browser runner | integration | `cmd /c "set PATH=C:\nvm4w\nodejs;%PATH% && node tests/word-modules.test.js && node tests/multi-course.test.js"` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/word-modules.test.js` — covers WORD-01, WORD-02, WORD-03, WORD-05 with mock DOM and assertion harness
- [ ] Update `tests/index.html` — register `word-modules.test.js` in browser test suite runner

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Visual rendering of keyboard shortcut badges and callouts | WORD-05 | Visual styling fidelity & layout responsiveness | Open `index.html` in browser, switch to Word course, check grid responsiveness and contrast |
| 1-click clipboard copy feedback | WORD-05 | Native browser clipboard API permission | Click shortcut copy buttons and verify toast/badge feedback |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 5s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
