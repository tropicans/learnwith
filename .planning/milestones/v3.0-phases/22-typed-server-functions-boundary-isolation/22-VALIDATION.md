---
phase: "22"
slug: "typed-server-functions-boundary-isolation"
status: draft
nyquist_compliant: true
wave_0_complete: false
created: "2026-09-08"
---

# Phase 22 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Node.js Test Runner (`node --test`), TypeScript Compiler (`tsc --noEmit`), Vinxi Bundler (`vinxi build`) |
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
| 22-01-01 | 01 | 1 | SRV-02 | T-22-01 | Server environment config and SHA-256 hash comparison isolated in `app/server/config.ts` | unit | `npm run typecheck` | ✅ | ⬜ pending |
| 22-01-02 | 01 | 1 | SRV-01, SRV-03 | T-22-02 | Shared Zod schemas strictly validate server function inputs and outputs | unit | `npm run typecheck` | ✅ | ⬜ pending |
| 22-01-03 | 01 | 1 | SRV-02 | T-22-03 | Build audit test asserts `app/server/` files and secret hashes never leak into client bundles | audit | `node --test tests/server-boundary-audit.test.js` | ❌ W0 | ⬜ pending |
| 22-02-01 | 02 | 2 | SRV-01 | T-22-04 | `verifyInstructorPasskeyFn` executes via `createServerFn` with Zod validation & timing-safe verification | unit | `npm run typecheck` | ✅ | ⬜ pending |
| 22-02-02 | 02 | 2 | SRV-03 | T-22-05 | `getSystemDiagnosticsFn` executes via `createServerFn` returning sanitized telemetry | unit | `npm run typecheck` | ✅ | ⬜ pending |
| 22-02-03 | 02 | 2 | SRV-01, SRV-03 | T-22-04, T-22-05 | Automated test suite validates successful unlock, rejected passkey, and diagnostics metrics | integration | `node --test tests/server-functions.test.js` | ❌ W0 | ⬜ pending |
| 22-03-01 | 03 | 3 | SRV-01 | T-22-06 | Client modal component calls typed RPC and updates unlock state on course workspaces | integration | `npm run typecheck && npm run build` | ✅ | ⬜ pending |
| 22-03-02 | 03 | 3 | SRV-01..03 | — | All 11+ legacy test suites and new server tests pass with 0 regressions | regression | `npm test` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/server-boundary-audit.test.js` — Client bundle scan test verifying no secret hashes leak into `.output/public`
- [ ] `tests/server-functions.test.js` — Unit/integration tests for `verifyInstructorPasskeyFn` and `getSystemDiagnosticsFn`

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|---|---|---|---|
| Instructor Passkey Modal UX | SRV-01 | Visual & interaction validation of password input, pending spinner, and error toast | Open `/course/ai?mode=live-class`, click unlock, submit incorrect passkey (verify error message), submit valid passkey (verify session unlock and modal dismiss) |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 15s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending 2026-09-08