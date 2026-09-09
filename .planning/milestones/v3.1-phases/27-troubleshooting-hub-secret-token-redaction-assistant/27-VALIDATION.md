---
phase: "27"
slug: "troubleshooting-hub-secret-token-redaction-assistant"
status: draft
nyquist_compliant: true
wave_0_complete: false
created: "2026-09-09"
---

# Phase 27 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Node.js Native Test Runner (`node:test`, `node:assert/strict`) + TypeScript compiler (`tsc`) |
| **Config file** | none (native test runner using Node.js built-in `node:test`) |
| **Quick run command** | `& 'C:\nvm4w\nodejs\node.exe' --test tests/pretraining-troubleshooting.test.js` |
| **Full suite command** | `& 'C:\nvm4w\nodejs\node.exe' --test tests/*.test.js; if ($LASTEXITCODE -eq 0) { & 'C:\nvm4w\nodejs\node.exe' ./node_modules/typescript/bin/tsc --noEmit } else { exit 1 }` |
| **Estimated runtime** | ~4 seconds |

---

## Sampling Rate

- **After every task commit:** Run `& 'C:\nvm4w\nodejs\node.exe' --test tests/pretraining-troubleshooting.test.js`
- **After every plan wave:** Run full test suite + TypeScript typecheck
- **Before `/gsd-verify-work`:** Full suite must be green (100% tests passing, 0 type errors)
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 27-01-01 | 01 | 1 | PRE-TOOL-01, PRE-TOOL-02 | — | Validates 15 typed troubleshooting error cards across 5 categories with required fields | unit | `& 'C:\nvm4w\nodejs\node.exe' --test tests/pretraining-troubleshooting.test.js` | ❌ W0 | ⬜ pending |
| 27-01-02 | 01 | 1 | PRE-TOOL-03 | T-27-01 | Masks bot tokens, API keys, Bearer tokens, emails, and Windows paths strictly client-side | unit | `& 'C:\nvm4w\nodejs\node.exe' --test tests/pretraining-troubleshooting.test.js` | ❌ W0 | ⬜ pending |
| 27-01-03 | 01 | 1 | PRE-TOOL-01, PRE-TOOL-02, PRE-TOOL-03 | — | Unit test suite creation and baseline verification | integration | `& 'C:\nvm4w\nodejs\node.exe' --test tests/pretraining-troubleshooting.test.js; & 'C:\nvm4w\nodejs\node.exe' --test tests/troubleshooting-exporter.test.js` | ❌ W0 | ⬜ pending |
| 27-02-01 | 02 | 2 | PRE-TOOL-01, PRE-TOOL-02 | — | Render TroubleshootingCard and PretrainingTroubleshootingSection with live search and filter | component | `& 'C:\nvm4w\nodejs\node.exe' ./node_modules/typescript/bin/tsc --noEmit` | ❌ W0 | ⬜ pending |
| 27-02-02 | 02 | 2 | PRE-TOOL-03 | T-27-02 | Render PretrainingRedactionSection with dual-pane workbench, sanitized copy button, and detection counter | component | `& 'C:\nvm4w\nodejs\node.exe' ./node_modules/typescript/bin/tsc --noEmit` | ❌ W0 | ⬜ pending |
| 27-02-03 | 02 | 2 | PRE-TOOL-01, PRE-TOOL-02, PRE-TOOL-03 | — | Route mount in course.ai.tsx, full regression test suite, zero-regression across all 18 test suites | system | `& 'C:\nvm4w\nodejs\node.exe' --test tests/*.test.js; if ($LASTEXITCODE -eq 0) { & 'C:\nvm4w\nodejs\node.exe' ./node_modules/typescript/bin/tsc --noEmit } else { exit 1 }` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/pretraining-troubleshooting.test.js` — comprehensive test suite covering PRE-TOOL-01, PRE-TOOL-02, PRE-TOOL-03
- [ ] `app/data/pretrainingTroubleshooting.ts` — dataset of 15 troubleshooting cards and category definitions
- [ ] `app/utils/redaction.ts` — secret redaction engine with regex patterns and unit tests

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Visual search filter animation and card focus transition | PRE-TOOL-01 | Visual polish and responsive layout testing | Navigate to `/course/ai?mode=pretraining#sec-troubleshooting`, type in search box, verify instant card filtering and smooth rendering. |
| Keyboard navigation across category pills | PRE-TOOL-01 | Focus order in browser DOM | Press ArrowRight/ArrowLeft between category buttons to verify tab/roving focus. |
| Clipboard copy with real OS clipboard | PRE-TOOL-03 | Browser clipboard permissions | Paste a log containing a bot token into Redaction Assistant, click "Salin Log Tersensor", paste in Notepad, verify token is redacted. |

---

## Validation Sign-Off

- [x] All tasks have <automated> verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 10s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
