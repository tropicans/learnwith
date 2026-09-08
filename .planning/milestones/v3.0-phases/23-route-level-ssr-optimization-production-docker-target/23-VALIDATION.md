---
phase: "23"
slug: "route-level-ssr-optimization-production-docker-target"
status: approved
nyquist_compliant: true
wave_0_complete: false
created: "2026-09-08"
---

# Phase 23 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Node.js Test Runner (`node:test` + `node:assert`) |
| **Config file** | `package.json` |
| **Quick run command** | `npm test` |
| **Full suite command** | `npm run test:all` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm test`
- **After every plan wave:** Run `npm run test:all`
- **Before `/gsd-verify-work`:** Full suite must be green (100% pass on legacy unit tests, container smoke test, and typecheck)
- **Max feedback latency:** 20 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 23-01-01 | 01 | 1 | DEPLOY-02 | T-23-04 | Isolate client state in `<ClientOnly>` with clean skeleton fallback | unit/build | `npm run typecheck && npm run build` | ✅ | ⬜ pending |
| 23-01-02 | 01 | 1 | DEPLOY-02 | T-23-03 | Log request method, path, status, latency without leaking auth headers | unit/build | `npm run typecheck && npm run build` | ✅ | ⬜ pending |
| 23-01-03 | 01 | 1 | DEPLOY-02 | — | Branded 404 and error boundaries catch invalid URLs safely | unit/build | `npm run typecheck && npm run build` | ✅ | ⬜ pending |
| 23-02-01 | 02 | 2 | DEPLOY-01, DEPLOY-03 | T-23-01 | Enforce non-root execution (`USER node`) and tini signal handling | smoke | `npm run build && docker build -t learnwith:phase23-test .` | ✅ | ⬜ pending |
| 23-02-02 | 02 | 2 | DEPLOY-03 | T-23-01 | Native Node.js healthcheck validates container health status | smoke | `docker inspect --format="{{json .State.Health.Status}}" learnwith-app` | ✅ | ⬜ pending |
| 23-03-01 | 03 | 3 | DEPLOY-01, DEPLOY-03 | — | Static asset caching headers and gzip/brotli compression | smoke | `node tests/docker-smoke.test.js` | ❌ W0 | ⬜ pending |
| 23-03-02 | 03 | 3 | DEPLOY-04 | — | 100% zero-regression guarantee across all 13 legacy test suites | regression | `npm test` | ✅ | ⬜ pending |
| 23-03-03 | 03 | 3 | DEPLOY-04 | — | Multi-tier test scripts in `package.json` (`test`, `test:smoke`, `test:e2e`, `test:all`) | integration | `npm run test:all` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/docker-smoke.test.js` — Automated smoke test verifying container health and SSR HTML integrity
- [ ] `public/assets/` — Synchronization of static CSS/assets for standalone Nitro runtime serving

*If none: "Existing infrastructure covers all phase requirements."*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Visual Inspection of Branded 404 | DEPLOY-02 | Visual styling verification | Access `http://localhost:3173/non-existent-page` in browser and confirm NotebookLM aesthetic, LY monogram, and working home button |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 20s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending 2026-09-08
