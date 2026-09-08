---
phase: "21"
slug: "typed-route-loaders-full-document-ssr-progressive-streaming"
status: draft
nyquist_compliant: true
wave_0_complete: false
created: "2026-09-08"
---

# Phase 21 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | TypeScript (`tsc --noEmit`), Vinxi Bundler (`vinxi build`), Node.js Test Runner (`node --test`), HTTP Route Probe (`curl`) |
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
| 21-01-01 | 01 | 1 | SSR-01 | T-21-01 | Strongly-typed course data layer provides immutable curriculum objects for server loaders | unit | `npm run typecheck` | ✅ | ⬜ pending |
| 21-01-02 | 01 | 1 | SSR-01, SSR-03 | T-21-02 | Route loaders on `/`, `/course/ai`, `/course/word` preload curriculum & dynamic head metadata | integration | `npm run typecheck && npm run build` | ✅ | ⬜ pending |
| 21-02-01 | 02 | 2 | SSR-02 | T-21-03 | Progressive HTML streaming with React Suspense & `<Await>` renders skeleton loaders without layout shift | integration | `npm run typecheck && npm run build` | ✅ | ⬜ pending |
| 21-02-02 | 02 | 2 | SSR-04 | T-21-04 | Client-only interactive widgets (checklists, quizzes) guarded with `<ClientOnly>` to prevent hydration mismatch | integration | `npm run typecheck && npm run build` | ✅ | ⬜ pending |
| 21-03-01 | 03 | 3 | SSR-01..04 | T-21-05 | Production server stream probe confirms HTTP 200, dynamic titles, and stream chunks on Port 3173 | E2E probe | `node .output/server/index.mjs` & curl probe | ✅ | ⬜ pending |
| 21-03-02 | 03 | 3 | FOUND-01..04 | — | 11/11 legacy test suites pass with 0 regressions | regression | `npm test` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements (`npm run typecheck`, `npm run build`, `npm test`).

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|---|---|---|---|
| Progressive Streaming Visual Flow | SSR-02 | Visual verification of skeleton-to-content transition over simulated slow network | Throttle network to Slow 3G in browser devtools, navigate to `/course/ai`, observe instant skeleton appearance followed by seamless content stream |
| Hydration Mismatch Silence | SSR-04 | Browser console clean verification | Open browser DevTools console on `/course/ai` and verify 0 React warning messages regarding hydration mismatch or text content mismatch |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 15s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending 2026-09-08
