---
phase: "20"
slug: "file-based-routes-validated-search-params"
status: draft
nyquist_compliant: true
wave_0_complete: false
created: "2026-09-08"
---

# Phase 20 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | TypeScript (`tsc --noEmit`), Vinxi Bundler (`vinxi build`), Node.js Test Runner (`node --test`), HTTP Probe (`curl`) |
| **Config file** | `tsconfig.json`, `app.config.ts`, `package.json` |
| **Quick run command** | `npm run typecheck` |
| **Full suite command** | `npm run typecheck && npm run build && npm test` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run typecheck`
- **After every plan wave:** Run `npm run typecheck && npm run build && npm test`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 20-01-01 | 01 | 1 | ROUTE-05 | T-20-01 | Zod schemas with .catch() prevent invalid parameter crashes and prototype pollution | unit | `npm run typecheck` | ✅ | ⬜ pending |
| 20-01-02 | 01 | 1 | ROUTE-01 | T-20-02 | Full document HTML shell with meta and stylesheets linked in head | unit | `npm run typecheck` | ✅ | ⬜ pending |
| 20-02-01 | 02 | 2 | ROUTE-02 | — | Frontpage Hub notebook gallery and filter chips render correctly | integration | `npm run typecheck && npm run build` | ✅ | ⬜ pending |
| 20-02-02 | 02 | 2 | ROUTE-03, ROUTE-04 | T-20-03 | File-based course workspaces load with type-safe parameters | integration | `npm run typecheck && npm run build` | ✅ | ⬜ pending |
| 20-03-01 | 03 | 3 | ROUTE-01..05 | T-20-04 | End-to-end SSR server routes return HTTP 200 on Port 3173 | E2E probe | `node .output/server/index.mjs` & probe `/`, `/course/ai`, `/course/word` | ✅ | ⬜ pending |
| 20-03-02 | 03 | 3 | FOUND-01..04 | — | 11/11 legacy test suites pass with 0 regressions | regression | `npm test` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements (`npm run typecheck`, `npm run build`, `npm test`).

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|---|---|---|---|
| Responsive Drawer & Mobile Navigation | ROUTE-01 | Visual layout check across mobile viewports | Open browser at 375px width and verify header menu button opens navigation drawer |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 15s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending 2026-09-08
