---
phase: "12"
slug: "interactive-knowledge-quiz-bab-v-rubrik-evaluasi-laporan-kelulusan-bpsdm"
status: complete
nyquist_compliant: true
wave_0_complete: true
created: "2026-09-07"
---

# Phase 12 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Node.js Built-in assert / Custom Runner (`tests/*.test.js`) |
| **Config file** | `tests/word-quiz-report.test.js` |
| **Quick run command** | `cmd /c "set PATH=C:\nvm4w\nodejs;%PATH% && node tests/word-quiz-report.test.js"` |
| **Full suite command** | `cmd /c "set PATH=C:\nvm4w\nodejs;%PATH% && node tests/word-quiz-report.test.js && node tests/word-modules.test.js && node tests/multi-course.test.js && node tests/checkpoint-engine.test.js"` |
| **Estimated runtime** | ~2 seconds |

---

## Sampling Rate

- **After every task commit:** Run `cmd /c "set PATH=C:\nvm4w\nodejs;%PATH% && node tests/word-quiz-report.test.js"`
- **After every plan wave:** Run `cmd /c "set PATH=C:\nvm4w\nodejs;%PATH% && node tests/word-quiz-report.test.js && node tests/word-modules.test.js && node tests/multi-course.test.js && node tests/checkpoint-engine.test.js"`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 12-01-01 | 01 | 0 | QUIZ-01, QUIZ-02, QUIZ-03, WORD-RPT-01, WORD-RPT-02 | T-12-01 | Test scaffolding and comprehensive assertion suite for Quiz, Rubric, and Report | unit | `cmd /c "set PATH=C:\nvm4w\nodejs;%PATH% && node tests/word-quiz-report.test.js"` | ✅ | ✅ green |
| 12-01-02 | 01 | 1 | QUIZ-01, QUIZ-02, QUIZ-03 | T-12-02 | Official 20-question bank with answer keys, explanations, and scoped state in word-course.js | unit | `cmd /c "set PATH=C:\nvm4w\nodejs;%PATH% && node tests/word-quiz-report.test.js"` | ✅ | ✅ green |
| 12-01-03 | 01 | 1 | WORD-RPT-01, WORD-RPT-02 | T-12-03 | Report generator, multi-channel copy formatters, and graduation verdict calculation | unit | `cmd /c "set PATH=C:\nvm4w\nodejs;%PATH% && node tests/word-quiz-report.test.js"` | ✅ | ✅ green |
| 12-02-01 | 02 | 2 | QUIZ-01, QUIZ-02 | T-12-04 | Interactive Quiz UI markup, question carousel/cards, answer selection & instant explanation display | DOM / unit | `cmd /c "set PATH=C:\nvm4w\nodejs;%PATH% && node tests/word-quiz-report.test.js"` | ✅ | ✅ green |
| 12-02-02 | 02 | 2 | QUIZ-03 | T-12-05 | Self-reflection textarea cards, Lampiran 3 rubric checklists, and portfolio items in index.html | DOM / unit | `cmd /c "set PATH=C:\nvm4w\nodejs;%PATH% && node tests/word-quiz-report.test.js"` | ✅ | ✅ green |
| 12-02-03 | 02 | 3 | WORD-RPT-01, WORD-RPT-02 | T-12-06 | Graduation report generator UI, print certificate layout, clipboard exporters, and event bindings in app.js | integration | `cmd /c "set PATH=C:\nvm4w\nodejs;%PATH% && node tests/word-quiz-report.test.js && node tests/word-modules.test.js && node tests/multi-course.test.js"` | ✅ | ✅ green |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [x] `tests/word-quiz-report.test.js` — comprehensive test suite covering Suites 1 to 6 (Question bank integrity, Quiz scoring, Rubric engine, BPSDM report formatting, Exporters, and State isolation)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|---|---|---|---|
| Print-friendly layout of BPSDM Certificate & Graduation Transcript | WORD-RPT-01, WORD-RPT-02 | Browser `@media print` formatting fidelity and page-break rules | Open `index.html`, complete quiz and rubrics, click "Cetak / Simpan PDF", verify print preview has official BPSDM Kop Surat, clean styling, and no navigation clutter |
| Native clipboard copy across desktop browsers | WORD-RPT-02 | Native browser clipboard API and permission prompt | Click WhatsApp and Telegram copy buttons, paste into text editor, verify proper emojis, bolding, and bulleted formatting |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 5s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** verified 2026-09-07