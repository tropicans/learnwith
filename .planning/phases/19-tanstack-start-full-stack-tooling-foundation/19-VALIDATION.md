---
phase: "19"
slug: "tanstack-start-full-stack-tooling-foundation"
status: approved
nyquist_compliant: true
wave_0_complete: false
created: "2026-09-08"
---

# Phase 19 — Validation Strategy: TanStack Start & Full-Stack Tooling Foundation

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Node.js Test Runner (`node --test`), TypeScript (`tsc`), Vinxi (`vinxi build`) |
| **Config file** | `tsconfig.json`, `app.config.ts`, `tests/package.json` |
| **Quick run command** | `npm run typecheck` |
| **Full suite command** | `npm test && npm run typecheck && npm run build` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run typecheck`
- **After every plan wave:** Run `npm test && npm run typecheck && npm run build`
- **Before `/gsd-verify-work`:** Full suite must be green, container builds and runs on port 3173
- **Max feedback latency:** 20 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 19-01-01 | 01 | 1 | FOUND-01 | — | Clean package resolution without peer conflicts | integration | `npm ls --depth=0` | ✅ `package.json` | ⬜ pending |
| 19-01-02 | 01 | 1 | FOUND-01 | — | CommonJS isolation keeps all 11 legacy tests passing | unit | `npm test` | ✅ `tests/*.test.js` | ⬜ pending |
| 19-02-01 | 02 | 2 | FOUND-02, FOUND-03 | — | Strict type safety with `@/*` path mapping & Vinxi app config | static | `node -e "..."` | ❌ W0 | ⬜ pending |
| 19-02-02 | 02 | 2 | FOUND-02, FOUND-04 | — | Entry points & router generate valid build & zero type errors | integration | `npm run typecheck && npm run build` | ❌ W0 | ⬜ pending |
| 19-03-01 | 03 | 3 | FOUND-02 | — | Dedicated port 3173 container configuration | container | `docker compose config` | ❌ W0 | ⬜ pending |
| 19-03-02 | 03 | 3 | FOUND-02 | — | Container builds cleanly and passes HTTP SSR response check on port 3173 | e2e | `docker compose build` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/package.json` — CommonJS boundary (`{"type": "commonjs"}`) to isolate 11 legacy test files from root ESM `"type": "module"`
- [ ] `assets/package.json` — CommonJS boundary for legacy assets
- [ ] `tsconfig.json` — Strict TypeScript configuration with `@/*` path alias
- [ ] `app.config.ts` — Vinxi configuration with node-server preset and tsconfig paths
- [ ] `app/routes/__root.tsx` & `app/routes/index.tsx` — Minimum document routes for build compilation

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Browser Hydration & Port 3173 Check | FOUND-04 | Visual and browser network check | Start `npm run dev` or run Docker container, open `http://localhost:3173/`, verify HTTP 200 and console has no hydration error warnings |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 20s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved (gsd-planner)
