---
phase: 22-typed-server-functions-boundary-isolation
plan: "01"
subsystem: auth-security
tags: [tanstack-start, server-fn, zod, timingSafeEqual, boundary-isolation, node-crypto]

requires:
  - phase: 21-tanstack-start-ssr-hydration-file-based-router
    provides: Full-document SSR and TanStack Router infrastructure
provides:
  - Isomorphic Zod RPC schemas for passkey authentication and diagnostics
  - Quarantined server configuration with timing-safe SHA-256 hash comparison
  - Automated boundary isolation audit test suite
affects:
  - 22-02
  - 22-03

actuals:
  tokens: 1500
  tasks: 3
  commits: 1

tech-stack:
  added: []
  patterns:
    - Quarantined server module pattern (app/server/config.ts)
    - Timing-safe cryptographic comparison using node:crypto timingSafeEqual
    - Automated AST/boundary audit against client bundle leakage

key-files:
  created:
    - app/schemas/serverFn.ts
    - app/server/config.ts
    - tests/server-boundary-audit.test.js
  modified: []

key-decisions:
  - "Quarantined secret hashes and node:crypto strictly in app/server/config.ts away from client imports."
  - "Employed crypto.timingSafeEqual on fixed-length hex Buffers to eliminate timing side-channel attacks."
  - "Created tests/server-boundary-audit.test.js to systematically scan client routes/components for leakage."

patterns-established:
  - "Server quarantine: Client code must only import RPC callable symbols, never backend config directly."

requirements-completed:
  - SRV-02

coverage:
  - id: D1
    description: "Quarantined server configuration and timing-safe hash comparison in app/server/config.ts"
    requirement: SRV-02
    verification:
      - kind: unit
        ref: "tests/server-boundary-audit.test.js#performs timing-safe hash comparison correctly"
        status: pass
  - id: D2
    description: "Isomorphic RPC Zod schemas in app/schemas/serverFn.ts"
    requirement: SRV-02
    verification:
      - kind: unit
        ref: "tests/server-boundary-audit.test.js#guarantees shared schemas file is isomorphic"
        status: pass
  - id: D3
    description: "Automated boundary leakage audit test"
    requirement: SRV-02
    verification:
      - kind: unit
        ref: "node --test tests/server-boundary-audit.test.js"
        status: pass
---

# Phase 22 Plan 01: Quarantined Server Config, Zod RPC Schemas & Boundary Audit Summary

## Overview
Plan 22-01 established the foundational server security boundary for Phase 22. It quarantined server secret configuration and cryptographic hash checks in `app/server/config.ts`, created the isomorphic Zod contract schemas in `app/schemas/serverFn.ts`, and built the automated boundary audit test in `tests/server-boundary-audit.test.js`.

## Accomplishments
1. **Isomorphic Zod Schemas (`app/schemas/serverFn.ts`)**:
   - `verifyPasskeyInputSchema` validating `courseId` ('ai' | 'word') and `passkey` (trimmed 1-100 characters).
   - `verifyPasskeyResultSchema` specifying typed responses (`success`, `message`, `unlockedAt`).
   - `diagnosticsInputSchema` and `diagnosticsResultSchema` providing structured contracts for system diagnostics.
2. **Server Configuration & Cryptographic Quarantine (`app/server/config.ts`)**:
   - Quarantined `process.env.AI_PASSKEY_HASH` and `process.env.WORD_PASSKEY_HASH` behind `getServerConfig()`.
   - Built `verifyPasskeyWithHash(courseId, candidate)` using `crypto.timingSafeEqual` with length-guarded Buffers to prevent timing attacks.
3. **Automated Boundary Audit Test (`tests/server-boundary-audit.test.js`)**:
   - Audits that client routes and components do not import `app/server/config`, `node:crypto`, or reference raw hash constants.
   - Audits timing-safe validation logic across valid, trimmed, invalid, and cross-course inputs.
   - All 5 test cases passing cleanly.

## Verification
- `npm run typecheck`: 0 TypeScript errors.
- `node --test tests/server-boundary-audit.test.js`: 5/5 passing tests.
