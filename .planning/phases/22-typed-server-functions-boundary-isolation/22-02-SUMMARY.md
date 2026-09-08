---
phase: 22-typed-server-functions-boundary-isolation
plan: "02"
subsystem: auth-api
tags: [tanstack-start, createServerFn, server-functions, zod, rpc, diagnostics, telemetry]

requires:
  - phase: 22-typed-server-functions-boundary-isolation
    provides: Quarantined server config (app/server/config.ts) and Zod RPC schemas (app/schemas/serverFn.ts)
provides:
  - verifyInstructorPasskeyFn typed server function (POST) with Zod validation
  - getSystemDiagnosticsFn typed telemetry server function (GET) with Zod validation
  - Comprehensive unit and integration test suite (tests/server-functions.test.js)
affects:
  - 22-03

actuals:
  tokens: 1650
  tasks: 3
  commits: 1

tech-stack:
  added: []
  patterns:
    - TanStack Start createServerFn RPC pattern
    - Server-side Zod input validation via .validator()
    - Sanitized telemetry metrics reporting without credential exposure

key-files:
  created:
    - app/server/auth.ts
    - app/server/diagnostics.ts
    - tests/server-functions.test.js
  modified: []

key-decisions:
  - "Implemented verifyInstructorPasskeyFn via createServerFn({ method: 'POST' }) for type-safe passkey verification."
  - "Implemented getSystemDiagnosticsFn via createServerFn({ method: 'GET' }) returning sanitized telemetry without secrets."
  - "Validated all RPC inputs with .validator() using Zod schemas before handler execution."

patterns-established:
  - "Typed server functions: All backend operations are exposed strictly via createServerFn with Zod validation."

requirements-completed:
  - SRV-01
  - SRV-03

coverage:
  - id: D1
    description: "verifyInstructorPasskeyFn typed server function in app/server/auth.ts"
    requirement: SRV-01
    verification:
      - kind: unit
        ref: "tests/server-functions.test.js#authenticates valid passkeys and rejects invalid candidates"
        status: pass
  - id: D2
    description: "getSystemDiagnosticsFn telemetry server function in app/server/diagnostics.ts"
    requirement: SRV-03
    verification:
      - kind: unit
        ref: "tests/server-functions.test.js#generates sanitized system telemetry without memory"
        status: pass
  - id: D3
    description: "Server functions automated unit & integration test suite"
    requirement: SRV-01
    verification:
      - kind: unit
        ref: "node --test tests/server-functions.test.js"
        status: pass
---

# Phase 22 Plan 02: Typed Server Functions & Telemetry Summary

## Overview
Plan 22-02 implemented the typed server functions for instructor authentication (`verifyInstructorPasskeyFn`) and internal system telemetry (`getSystemDiagnosticsFn`) using TanStack Start's `createServerFn` primitive and Zod input validators. It also built comprehensive automated unit and integration tests covering positive, negative, and edge-case behaviors.

## Accomplishments
1. **Passkey Verification Server Function (`app/server/auth.ts`)**:
   - Built `verifyInstructorPasskeyFn` using `createServerFn({ method: 'POST' })`.
   - Validates payloads with `verifyPasskeyInputSchema.parse(data)`.
   - Delegates to `verifyPasskeyWithHash` in `app/server/config.ts` for timing-safe SHA-256 comparison.
   - Returns `{ success: true, message: ..., unlockedAt: ... }` on match, `{ success: false, message: ... }` on mismatch.
2. **Internal Diagnostics & Telemetry Server Function (`app/server/diagnostics.ts`)**:
   - Built `getSystemDiagnosticsFn` using `createServerFn({ method: 'GET' })`.
   - Validates options with `diagnosticsInputSchema.parse(data || {})`.
   - Returns status (`healthy`), ISO timestamp, uptime in seconds, environment name, and optional memory stats (`rssMb`, `heapUsedMb`).
   - Guarantees zero credential or secret hash exposure.
3. **Automated Unit & Integration Test Suite (`tests/server-functions.test.js`)**:
   - 8 test cases verifying input validation, trimmed strings, invalid course IDs, passkey length limits, timing-safe checks, memory reporting flag, and secret leakage prevention.
   - All 8 tests pass cleanly under Node test runner.

## Verification
- `npm run typecheck`: 0 TypeScript compilation errors.
- `node --test tests/server-functions.test.js`: 8/8 passing tests.
- `npm test`: 13/13 test suites passing cleanly.
