---
phase: "35"
slug: "admin-management-ui-action-controls"
status: draft
nyquist_compliant: true
wave_0_complete: false
created: "2026-09-10"
---

# Phase 35 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Node.js built-in test runner (`node:test`, `node:assert`) |
| **Config file** | `package.json` |
| **Quick run command** | `& "C:\nvm4w\nodejs\node.exe" --test tests/course-lifecycle-admin-ui.test.js` |
| **Full suite command** | `& "C:\nvm4w\nodejs\node.exe" --test tests/course-lifecycle-*.test.js` |
| **Estimated runtime** | ~2 seconds |

---

## Sampling Rate

- **After every task commit:** Run `& "C:\nvm4w\nodejs\node.exe" --test tests/course-lifecycle-admin-ui.test.js`
- **After every plan wave:** Run `& "C:\nvm4w\nodejs\node.exe" --test tests/course-lifecycle-*.test.js`
- **Before `/gsd-verify-work`:** Full suite must be green & typecheck clean
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 35-01-01 | 01 | 1 | COURSE-ADMIN-01 | — | Tab 'Manajemen Kursus' mounted in AdminShell | integration | `& "C:\nvm4w\nodejs\node.exe" --test tests/course-lifecycle-admin-ui.test.js` | ❌ W0 | ⬜ pending |
| 35-01-02 | 01 | 1 | COURSE-ADMIN-01 | — | KPI cards render correct status tallies | unit | `& "C:\nvm4w\nodejs\node.exe" --test tests/course-lifecycle-admin-ui.test.js` | ❌ W0 | ⬜ pending |
| 35-01-03 | 01 | 1 | COURSE-ADMIN-02 | T-35-01 | Visibility toggle validates authorization & updates store | integration | `& "C:\nvm4w\nodejs\node.exe" --test tests/course-lifecycle-admin-ui.test.js` | ❌ W0 | ⬜ pending |
| 35-02-01 | 02 | 2 | COURSE-ADMIN-03 | — | Status filter tabs filter course list reactively | unit | `& "C:\nvm4w\nodejs\node.exe" --test tests/course-lifecycle-admin-ui.test.js` | ❌ W0 | ⬜ pending |
| 35-02-02 | 02 | 2 | COURSE-ADMIN-03 | T-35-02 | Archive & restore action buttons trigger allowed mutations | integration | `& "C:\nvm4w\nodejs\node.exe" --test tests/course-lifecycle-admin-ui.test.js` | ❌ W0 | ⬜ pending |
| 35-02-03 | 02 | 2 | COURSE-ADMIN-04 | T-35-03 | Soft-delete requires exact confirmation phrase and reason | integration | `& "C:\nvm4w\nodejs\node.exe" --test tests/course-lifecycle-admin-ui.test.js` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/course-lifecycle-admin-ui.test.js` — covers COURSE-ADMIN-01..04 and CSS mirroring
- [ ] Ensure `assets/css/admin.css` and `public/assets/css/admin.css` mirror identical styles for course management and delete modal

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Visual aesthetic of modal & toast | COURSE-ADMIN-01, 04 | Human visual verification of frosted dark tile CSS | Open `/admin`, switch to tab 'Manajemen Kursus', trigger toggle/archive/delete |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 5s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending 2026-09-10
