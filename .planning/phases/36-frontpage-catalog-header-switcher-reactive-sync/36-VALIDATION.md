---
phase: "36"
slug: "frontpage-catalog-header-switcher-reactive-sync"
status: draft
nyquist_compliant: false
wave_0_complete: false
created: "2026-09-10"
---

# Phase 36 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Node.js Test Runner (`node --test`) |
| **Config file** | `package.json` |
| **Quick run command** | `node --test tests/course-lifecycle-sync.test.js` |
| **Full suite command** | `node --test tests/course-lifecycle-*.test.js` |
| **Estimated runtime** | ~3 seconds |

---

## Sampling Rate

- **After every task commit:** Run `node --test tests/course-lifecycle-sync.test.js`
- **After every plan wave:** Run `node --test tests/course-lifecycle-*.test.js`
- **Before `/gsd-verify-work`:** Full suite must be green + `npm run typecheck` passes
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 36-01-01 | 01 | 0 | COURSE-MUTATE-03 | T-36-01 | Test fixtures for active/hidden/deleted lifecycle filtering | unit | `node --test tests/course-lifecycle-sync.test.js` | ❌ W0 | ⬜ pending |
| 36-01-02 | 01 | 1 | COURSE-MUTATE-03 | T-36-01 | Server function `getPublicCoursesListFn` omits non-active courses | unit | `node --test tests/course-lifecycle-sync.test.js` | ❌ W0 | ⬜ pending |
| 36-02-01 | 02 | 1 | COURSE-SYNC-01 | T-36-01 | SSR public catalog filter + empty state rendering | integration | `node --test tests/course-lifecycle-sync.test.js` | ❌ W0 | ⬜ pending |
| 36-02-02 | 02 | 1 | COURSE-SYNC-02 | T-36-02 | Global root loader & header course switcher dynamic options | integration | `node --test tests/course-lifecycle-sync.test.js` | ❌ W0 | ⬜ pending |
| 36-03-01 | 03 | 2 | COURSE-SYNC-03 | T-36-03 | Direct access handling (unlisted banner vs inactive notice) | integration | `node --test tests/course-lifecycle-sync.test.js` | ❌ W0 | ⬜ pending |
| 36-03-02 | 03 | 2 | COURSE-SYNC-01 | T-36-04 | Admin mutation BroadcastChannel & cache invalidation sync | integration | `node --test tests/course-lifecycle-sync.test.js` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/course-lifecycle-sync.test.js` — test suite covering public list RPC, catalog filtering, empty states, switcher options, and direct route access status handling.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Cross-tab reactivity UI visual update | COURSE-SYNC-01 | Real-time BroadcastChannel observation across distinct browser window tabs | Open `/` in tab 1 and `/admin` in tab 2. Change course status in tab 2; tab 1 should update without manual reload. |
| In-flight notification banner display | COURSE-SYNC-03 | Mid-session administrative status change simulation | While completing tasks on `/course/ai`, de-activate course in `/admin`; observe unobtrusive advisory toast rather than unexpected kickout. |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending 2026-09-10
