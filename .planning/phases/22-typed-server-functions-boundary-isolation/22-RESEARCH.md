# Phase 22: Typed Server Functions & Boundary Isolation - Research

**Researched:** 2026-09-08  
**Domain:** TanStack Start `createServerFn`, Server Boundaries, Zod Input Validation, Environment Isolation, Timing-Safe Cryptography, Internal Diagnostics RPC  
**Confidence:** HIGH  
**Phase Requirements:** SRV-01, SRV-02, SRV-03  
**Target Directory:** `.planning/phases/22-typed-server-functions-boundary-isolation/`

---

## Summary

Phase 22 transitions sensitive authentication and diagnostic operations from exposed client-side JavaScript (`assets/js/app.js` which previously exposed `INSTRUCTOR_PASSCODES` and `DEFAULT_WORD_PASSCODE_HASHES`) to secure, strongly-typed server functions behind TanStack Start's `createServerFn` boundary.

In the legacy architecture, instructor unlock codes and passkey hashes were readable in plain text within browser scripts. In Phase 22, all passkey validation, secret hash management, and environment variables are quarantined within the `app/server/` directory. Code in `app/server/` is never bundled into the client browser package, and access is mediated exclusively via typed RPC server functions with rigorous Zod schema validation.

**Primary recommendation:** Build a dedicated `app/server/` isolation layer comprising `app/server/auth.ts` (passkey verification via `createServerFn` with Zod validation and timing-safe hash comparison), `app/server/config.ts` (quarantined server environment variables and defaults), and `app/server/diagnostics.ts` (internal health and telemetry RPC). Connect client components to these server functions using TanStack Start's type-safe RPC invocation.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Passkey Verification Logic | **Frontend Server (SSR / Nitro)** | — | Passkeys and secret hashes must NEVER reach the browser bundle. Comparison occurs on the server in a timing-safe manner. |
| Server Environment & Secrets | **Frontend Server (SSR / Nitro)** | — | Private configuration (hashes, master keys, node env flags) is quarantined in `app/server/config.ts`. |
| Diagnostic Telemetry & Health | **Frontend Server (SSR / Nitro)** | Browser / Client | Server gathers sanitized runtime metrics (memory, node version, uptime); client calls RPC to display health stats. |
| Modal & Unlock Form UI | **Browser / Client** | — | Interactive dialog prompting instructor for passkey, invoking RPC with pending state, and storing unlock session in client state. |
| Client Route Lock State | **Browser / Client** | — | Determines whether locked modules/tabs in the workspace are unlocked for the current user session. |

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `@tanstack/react-start` | 1.120.20 [VERIFIED: package.json:17] | Full-stack React framework with `createServerFn` RPC | Official TanStack full-stack primitives; zero bundle leakage for server handlers. |
| `@tanstack/react-router` | 1.120.20 [VERIFIED: package.json:16] | Type-safe router & navigation | Provides route-level RPC consumption and loader integration. |
| `zod` | ^3.24.2 [VERIFIED: package.json:25] | Schema validation for RPC payloads | First-class validation validator for `createServerFn`, guarantees runtime type safety. |
| `node:crypto` | built-in (Node 22) [VERIFIED: node -v] | SHA-256 hashing & timing-safe equality check | Built-in zero-dependency cryptographic module; prevents timing side-channel attacks. |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `vinxi` | 0.5.3 [VERIFIED: package.json:22] | Bundler & multi-router server runtime | Manages the server/client compilation separation via Vite/Nitro. |
| `react` / `react-dom` | ^19.0.0 [VERIFIED: package.json:20-21] | UI rendering | Powers interactive unlock dialogs and status feedback. |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `createServerFn` | Raw REST API Routes (`/api/auth`) | API routes require manual fetch calls, custom JSON response typing, and route handlers. `createServerFn` provides end-to-end TypeScript inference from server to client with automatic RPC endpoints. |
| `node:crypto` timing-safe | Simple `===` string comparison | Plain string equality `===` leaks character length and matching prefix timing, enabling timing side-channel attacks. `crypto.timingSafeEqual` eliminates this vulnerability. |

---

## Package Legitimacy Audit

| Package | Registry | Age | Downloads | Source Repo | Verdict | Disposition |
|---------|----------|-----|-----------|-------------|---------|-------------|
| `@tanstack/react-start` | npm | 1+ yr | ~200k/wk | github.com/tanstack/router | [OK] | Approved (already in project) |
| `zod` | npm | 4+ yrs | 30M+/wk | github.com/colinhacks/zod | [OK] | Approved (already in project) |
| `node:crypto` | node built-in | N/A | N/A | nodejs/node | [OK] | Approved (built-in standard library) |

---

## Architecture Patterns

### System Architecture Diagram

```
[Browser Client]
   │
   │ 1. User submits passkey via Unlock Dialog
   ▼
[RPC Invocation: verifyInstructorPasskeyFn({ courseId, passkey })]
   │ (POST /_server/?_serverFnId=...)
   │ [Network Boundary]
   ▼
[TanStack Start Server Boundary: createServerFn]
   │
   │ 2. Zod Validation: verifyPasskeySchema.parse(payload)
   ▼
[app/server/auth.ts]
   │
   │ 3. Fetch Salt & Hash from app/server/config.ts (process.env.INSTRUCTOR_PASSKEY_HASH)
   │ 4. Compute SHA-256 of candidate passkey
   │ 5. Execute crypto.timingSafeEqual(computedHash, targetHash)
   ▼
[Response Payload]
   │ Return: { success: boolean, message: string, unlockedAt?: number }
   ▼
[Client State / ChecklistIsland / Session]
   │ Store unlock token / boolean in client session
```

### Recommended Project Structure
```
app/
├── server/                    # Quarantined backend layer (SRV-02)
│   ├── config.ts              # Server-only env variables and default secret hashes
│   ├── auth.ts                # createServerFn for instructor passkey verification (SRV-01)
│   └── diagnostics.ts         # createServerFn for telemetry & healthchecks (SRV-03)
├── components/
│   └── course/
│       ├── ChecklistIsland.tsx
│       └── InstructorUnlockModal.tsx  # Client dialog calling verifyInstructorPasskeyFn
├── routes/
│   ├── course.ai.tsx          # Agentic AI workspace
│   └── course.word.tsx        # Word ASN workspace
└── schemas/
    └── serverFn.ts            # Shared Zod schemas for server function requests/responses
```

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Client-to-Server RPC | Custom Express router & `fetch('/api/...')` endpoints | TanStack Start `createServerFn` | Provides automated type serialization, URL generation, type safety between caller and callee, and automatic boundary stripping. |
| Timing attack mitigation | Custom string loop comparison | `crypto.timingSafeEqual` | Hand-rolled loops are optimized away by the V8 JIT compiler, re-introducing timing vulnerabilities. |
| Payload schema validation | Manual `typeof` & `if (!x)` condition chains | `zod` `.validator()` | Complex types, coercions, defaults, and sanitization are handled robustly with zero error-handling boilerplate. |

---

## Common Pitfalls

### Pitfall 1: Client Bundle Leakage
**What goes wrong:** A developer imports a function or constant directly from `app/server/config.ts` into a client React component (e.g. `ChecklistIsland.tsx`), causing server secrets or Node.js native modules (`node:crypto`) to be bundled into the client build.  
**Why it happens:** Module bundlers follow ES imports. If a client file imports a server-only file directly without going through `createServerFn`, the bundler attempts to include it in the browser build.  
**How to avoid:** Enforce that client files only import `createServerFn` exports (like `verifyInstructorPasskeyFn`), NEVER `app/server/config.ts`. Run automated bundle inspection during validation.  
**Warning signs:** Vite build error mentioning `node:crypto` cannot be resolved in browser, or appearance of secret hashes in `.output/public/` chunks.

### Pitfall 2: Timing Attacks on Secret Comparison
**What goes wrong:** Comparing candidate passkey hash with stored hash using `candidateHash === targetHash`.  
**Why it happens:** Standard JavaScript string equality terminates early on the first differing character. An attacker measuring network roundtrip latency with high sample count can deduce the secret byte-by-byte.  
**How to avoid:** Always use `crypto.timingSafeEqual(Buffer.from(a, 'hex'), Buffer.from(b, 'hex'))` after verifying identical buffer lengths.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Node.js Test Runner (`node --test`), TypeScript (`tsc --noEmit`), Vinxi Bundler (`vinxi build`) |
| Config file | `tsconfig.json`, `app.config.ts`, `package.json` |
| Quick run command | `npm run typecheck` |
| Full suite command | `npm run typecheck && npm run build && npm test` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SRV-01 | `verifyInstructorPasskeyFn` validates input with Zod and verifies passkey with timing-safe hash comparison | unit / integration | `node --test tests/server-functions.test.js` | ❌ Wave 0 (to create) |
| SRV-02 | Secret hashes and environment variables are quarantined in `app/server/` and absent from client bundle | build audit | `node --test tests/server-boundary-audit.test.js` | ❌ Wave 0 (to create) |
| SRV-03 | `getSystemDiagnosticsFn` returns typed system health without exposing raw environment variables or secrets | unit / integration | `node --test tests/server-functions.test.js` | ❌ Wave 0 (to create) |

---

## Security Domain

### Applicable ASVS Categories
| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | yes | Server-side passkey verification via `createServerFn` |
| V4 Access Control | yes | Restricted instructor features protected by server-side verification |
| V5 Input Validation | yes | Zod schema validation on all `createServerFn` inputs |
| V6 Cryptography | yes | Node `node:crypto` SHA-256 and `timingSafeEqual` |

### Known Threat Patterns
| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Client bundle inspection extracting passkeys | Information Disclosure | Move passkeys and hashes to `app/server/` and exclude from client build. |
| Timing attack on passkey comparison | Information Disclosure / Spoofing | Use `crypto.timingSafeEqual` with identical buffer lengths. |
| Arbitrary input injection to RPC | Tampering | Strict Zod validation with `.min()`, `.max()`, and `.enum()`. |

---

## Sources
- TanStack Start Official Documentation on `createServerFn`: https://tanstack.com/start/latest/docs/framework/react/guide/server-functions.md
- TanStack Start Environment Variables & Code Execution: https://tanstack.com/start/latest/docs/framework/react/guide/code-execution-patterns.md
- Context7 Documentation Library: `/websites/tanstack_start_framework_react`