---
phase: "25"
slug: "interactive-modules-1-5-1-click-copy-engine"
status: draft
nyquist_compliant: true
wave_0_complete: false
created: "2026-09-08"
---

# Phase 25 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Node.js Test Runner (node:test, node:assert) |
| **Config file** | package.json |
| **Quick run command** | `& 'C:\nvm4w\nodejs\node.exe' --test tests/pretraining-modules.test.js` |
| **Full suite command** | `& 'C:\nvm4w\nodejs\node.exe' --test tests/*.test.js` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `& 'C:\nvm4w\nodejs\node.exe' --test tests/pretraining-modules.test.js`
- **After every plan wave:** Run `& 'C:\nvm4w\nodejs\node.exe' --test tests/*.test.js`
- **Before `/gsd-verify-work`:** Full suite must be green + `tsc --noEmit` clean
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 25-01-01 | 01 | 1 | PRE-MOD-01, PRE-MOD-02, PRE-MOD-03, PRE-MOD-04, PRE-MOD-05 | — | Typesafe content dataset for modules 1-5 | unit | `pwsh -Command "& 'C:\nvm4w\nodejs\node.exe' -e \"import('./app/data/pretrainingModules.ts').catch(() => { require('esbuild').buildSync({ entryPoints: ['app/data/pretrainingModules.ts'], write: false }); console.log('Modules data compiled successfully'); })\""` | ❌ W0 | ⬜ pending |
| 25-01-02 | 01 | 1 | PRE-MOD-06 | — | Safe clipboard fallback, preserve whitespace, visual feedback | unit | `pwsh -Command "Test-Path app/components/course/pretraining/CopyableCodeBlock.tsx, app/components/ui/Toast.tsx"` | ❌ W0 | ⬜ pending |
| 25-01-03 | 01 | 1 | PRE-MOD-01, PRE-MOD-02, PRE-MOD-03, PRE-MOD-04, PRE-MOD-05 | — | Accessible module card with keyboard & aria support | unit | `pwsh -Command "Test-Path app/components/course/pretraining/PretrainingModuleCard.tsx, app/components/course/pretraining/ModuleArchitectureFlow.tsx, app/components/course/pretraining/CheckpointPreviewCard.tsx"` | ❌ W0 | ⬜ pending |
| 25-02-01 | 02 | 2 | PRE-MOD-01, PRE-MOD-02, PRE-MOD-03, PRE-MOD-04, PRE-MOD-05 | — | Master controls open/close all and route integration | integration | `pwsh -Command "& 'C:\nvm4w\nodejs\node.exe' ./node_modules/typescript/bin/tsc --noEmit"` | ❌ W0 | ⬜ pending |
| 25-02-02 | 02 | 2 | PRE-MOD-01..06 | — | Automated regression test suite for modules 1-5 and copy engine | unit/integration | `& 'C:\nvm4w\nodejs\node.exe' --test tests/pretraining-modules.test.js` | ❌ W0 | ⬜ pending |
| 25-02-03 | 02 | 2 | PRE-MOD-01..06 | — | Full suite zero regression check | regression | `& 'C:\nvm4w\nodejs\node.exe' --test tests/*.test.js` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/pretraining-modules.test.js` — test suite covering PRE-MOD-01 through PRE-MOD-06

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Visual Toast Animation | PRE-MOD-06 | Browser CSS transitions and rendering | Click "Salin Perintah", verify green "Tersalin!" badge appears and auto-dismisses after 2s |
| Master Accordion Behavior | PRE-MOD-01..05 | Interactive browser UX | Click "Buka Semua Modul" -> all 5 open; Click "Tutup Semua Modul" -> all 5 close |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 10s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** 2026-09-08
