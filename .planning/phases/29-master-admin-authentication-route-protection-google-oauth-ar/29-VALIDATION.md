# Phase 29 Validation Strategy: Master Admin Authentication, Route Protection & Google OAuth Architecture

## Overview
- **Phase**: 29
- **Goal**: Establish the foundational security, Master Admin Passkey authentication, session cookie management, and Google OAuth readiness for the LearnWith Admin Command Center (`/admin`).
- **Date**: 2026-09-09

---

## 1. Automated Verification Gates

### 1.1 Backend Unit & Security Tests (`tests/admin-auth.test.js`)
- [ ] Passkey equality verification: Valid passkey returns `success: true`; invalid passkey returns `success: false`.
- [ ] Timing-safe buffer comparison: Ensures variable-length inputs do not trigger timing leaks.
- [ ] Session cookie parsing & creation: Confirms `HttpOnly`, `SameSite=Lax`, and `Max-Age` flags.
- [ ] Server function RPC schemas: Zod validates payload shapes and types.
- [ ] Secret quarantine check: AST or text scan ensuring `ADMIN_PASSKEY_HASH` is never exported to client bundle.

### 1.2 Route & Client Verification
- [ ] Route `/admin` renders without crashes.
- [ ] Unauthenticated state renders the Admin Passkey Login Gate and Google Sign-In button.
- [ ] Authenticated state renders the Admin Command Center navigation shell.
- [ ] Logout action successfully clears the session and resets the view to the login gate.

### 1.3 Zero-Regression Invariant
- [ ] All 116 existing unit and module tests pass with 0 failures (`npm test`).
- [ ] Strict TypeScript type-check passes with 0 errors (`npx tsc --noEmit`).

---

## 2. Manual Verification Checklist
- [ ] Open `/admin` in browser; verify that unauthorized access is blocked by the login screen.
- [ ] Enter incorrect passkey; verify clear error message without revealing internal hash.
- [ ] Enter valid passkey (`admin-learnwith`); verify smooth unlock into Admin Command Center.
- [ ] Inspect Google OAuth card; verify clear status indicators.
- [ ] Click "Logout"; verify session is cleared and view returns to login screen.
