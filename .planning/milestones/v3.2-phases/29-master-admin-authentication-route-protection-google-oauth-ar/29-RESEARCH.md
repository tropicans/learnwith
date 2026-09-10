# Research: Phase 29 — Master Admin Authentication, Route Protection & Google OAuth Architecture

## Executive Summary

Phase 29 delivers the foundational security and access control layer for the LearnWith Admin Command Center (`/admin`). It establishes:
1. **Server-Side Timing-Safe Master Passkey Verification** using Node.js `crypto.timingSafeEqual` and SHA-256 via TanStack Start `createServerFn`.
2. **HttpOnly Cookie-Based Admin Session Management** with cryptographically secure session tokens, expiration enforcement, and safe logout.
3. **Route-Level Access Control Gate** on `/admin` that gracefully swaps between an authenticating Master Passkey screen (with Google Sign-In architectural readiness) and the authenticated Admin Shell.
4. **Google OAuth Architecture & Readiness** with environmental configuration (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`), callback structure, and clear UI status indicators for multi-provider auth.

---

## 1. Architectural Decisions & Patterns

### 1.1 Server Passkey Verification (`app/server/config.ts` & `app/server/auth.ts`)
- **Pattern**: Reuses the proven timing-safe SHA-256 pattern from Course 2 passkey verification (`verifyPasskeyWithHash`).
- **Secret Storage**: Master Admin passkey hash is quarantined on the server via `getServerConfig()`.
  - Default development passkey: `admin-learnwith` (SHA-256: `942008f51ec6a93863750ebce5b3b0df36ca024b4238bfe4bb14798c87abf066`).
  - Production override: `process.env.ADMIN_PASSKEY_HASH`.
- **Timing-Safe Equality**:
  ```ts
  const candidateHash = crypto.createHash('sha256').update(candidate.trim()).digest('hex');
  const targetBuf = Buffer.from(adminHash, 'hex');
  const candidateBuf = Buffer.from(candidateHash, 'hex');
  return targetBuf.length === candidateBuf.length && crypto.timingSafeEqual(targetBuf, candidateBuf);
  ```

### 1.2 Session Token & Cookie Management (`app/server/session.ts`)
- **Cookie Specification**:
  - Name: `learnwith_admin_session`
  - Flags: `HttpOnly`, `SameSite=Lax`, `Path=/`, `Max-Age=86400` (24 hours).
  - Production: `Secure` when `process.env.NODE_ENV === 'production'`.
- **Token Generation & Validation**:
  - Token: Cryptographically secure 32-byte hex string (`crypto.randomBytes(32).toString('hex')`) signed with server secret or verified against a server-side session registry.
  - Revocation: `clearSessionCookie()` sets `Max-Age=0` and invalidates token.

### 1.3 TanStack Start Server Functions (`app/server/adminAuth.ts`)
- `adminLoginFn`: POST method, Zod input schema `{ passkey: string }`. Validates hash, issues session token, sets response cookie.
- `adminCheckSessionFn`: GET method. Reads request cookie header, validates session, returns `{ authenticated: boolean, adminUser?: { email: string, role: 'admin' } }`.
- `adminLogoutFn`: POST method. Revokes session, clears response cookie, returns `{ success: true }`.
- `adminGetAuthConfigFn`: GET method. Returns public OAuth configuration status (e.g. `{ googleAuthAvailable: boolean, googleClientIdConfigured: boolean }`) without leaking secrets.

### 1.4 Google OAuth Architecture & Readiness
- **Design Intent**: Prepare the platform for Google Workspace / Google Account instructor sign-in while maintaining zero-dependency runtime resilience.
- **Components**:
  - UI Component: `GoogleSignInButton.tsx` rendering Google G logo, sign-in CTA, and status badge ("Siap Diaktifkan" bila `GOOGLE_CLIENT_ID` terpasang, atau "Mode Passkey Mandiri" bila belum terpasang).
  - Callback Route Stub / Architecture: `/api/auth/google/callback` endpoint contract ready to exchange OAuth auth code with Google Token API.

### 1.5 Route Structure (`app/routes/admin.tsx`)
- TanStack Router file route: `app/routes/admin.tsx`.
- Utilizes `loader` calling `adminCheckSessionFn()`.
- If `!authenticated`: Renders `AdminLoginGate` component (Master Passkey input + Google Sign-In card + error feedback).
- If `authenticated`: Renders `AdminShell` (Header, Admin Navigation tabs, active session badge, and `<Outlet />`).

---

## 2. Validation Architecture

### 2.1 Automated Unit & Integration Tests (`tests/admin-auth.test.js`)
1. **Timing-Safe Hash Validation**: Verify correct passkey succeeds, incorrect passkey fails, empty/malformed passkeys rejected cleanly.
2. **Session Cookie Lifecyle**: Setting, reading, and clearing cookie headers match security invariants.
3. **Server Functions Schema Validation**: Zod rejects invalid inputs, verifies return shapes.
4. **Zero Client Leakage**: Verifies `admin-learnwith` hash is NOT present in client-accessible assets or router client bundles.
5. **Zero Regression**: Runs alongside all 116 existing tests.

---

## 3. Implementation Roadmap for Phase 29

- **Plan 29-01**: Backend Server Security, Hash Engine, Session Management & RPC Functions
  - Files: `app/server/config.ts`, `app/server/session.ts`, `app/server/adminAuth.ts`, `app/schemas/admin.ts`, `tests/admin-auth.test.js`.
- **Plan 29-02**: Frontend Route, Admin Login Gate, Google OAuth Readiness UI & Shell Navigation
  - Files: `app/routes/admin.tsx`, `app/components/admin/AdminLoginGate.tsx`, `app/components/admin/AdminShell.tsx`, `app/components/admin/GoogleSignInButton.tsx`, `assets/css/admin.css`.
