---
phase: 32
status: clean
files_reviewed: 23
findings:
  critical: 0
  warning: 0
  info: 0
  total: 0
resolved_in: 0316e5d
---

# Phase 32 Code Review: Workshop Access Passkey Management & Troubleshooting Audit Hub

**Review Date**: 2026-09-09  
**Branch**: `master`  
**Reviewer**: GSD Code Reviewer  
**Scope**: 23 files across schemas, server functions, in-memory stores, UI components, stylesheets, and automated tests.  
**Requirements Reviewed**: `ADMIN-PASS-01`, `ADMIN-PASS-02`, `ADMIN-PASS-03`, `ADMIN-LOG-01`, `ADMIN-LOG-02`

---

## 1. Executive Summary

Phase 32 introduces two mission-critical administrative console modules to the LearnWith command center:
1. **Workshop Access Passkey Management Console (`ADMIN-PASS-01`, `ADMIN-PASS-02`, `ADMIN-PASS-03`)**: Dynamic in-memory passkey rotation with zero server downtime, constant-time SHA-256 verification (`crypto.timingSafeEqual`), sliding-window brute-force rate limiting, and tamper-evident audit logging with 8-hex character prefix masking.
2. **Troubleshooting Audit Hub & Triage Console (`ADMIN-LOG-01`, `ADMIN-LOG-02`)**: Ingestion and automated regex classification of classroom runtime issues (Port 20128 conflict, PowerShell ExecutionPolicy, OAuth/Gemini API keys, Telegram 409, EPERM, Network timeouts) with 1-click PowerShell remediation command generation, dual-layer secret redaction, and multi-criteria filtering.

The overall architecture, TypeScript typing, and test coverage are high quality (34/34 phase tests passing, 213 total regression suite tests passing, 0 TypeScript errors). However, **3 non-blocking warnings** and **1 info finding** were identified regarding rate-limiter cooldown reset mechanics, shared client ID clumping, and pre-transmission client-side redaction.

---

## 2. Requirements Compliance Matrix

| Requirement | Description | Status | Evidence / Implementation |
|---|---|---|---|
| **ADMIN-PASS-01** | Admin can monitor active passkey status for Course 2 (Word) and Course 1 (AI) with server hash history | **Pass** | [app/components/admin/passkeys/PasskeyStatusCards.tsx](file:///c:/Users/yudhiar/Downloads/AgenticAI/app/components/admin/passkeys/PasskeyStatusCards.tsx) & [PasskeyHistoryTable.tsx](file:///c:/Users/yudhiar/Downloads/AgenticAI/app/components/admin/passkeys/PasskeyHistoryTable.tsx); canonical SHA-256 hashes `ddf62f40...` and `b9967472...` displayed with masked previews (`buk****ta`, `buk****as`). |
| **ADMIN-PASS-02** | Admin can dynamically update or rotate workshop passkeys via authenticated admin interface | **Pass** | [app/server/passkey.ts](file:///c:/Users/yudhiar/Downloads/AgenticAI/app/server/passkey.ts) (`adminRotatePasskeyFn`) protected by `assertAdminAuthorized`; [PasskeyRotateModal.tsx](file:///c:/Users/yudhiar/Downloads/AgenticAI/app/components/admin/passkeys/PasskeyRotateModal.tsx) enforces 6–64 char limits and immediately updates active hash in memory. |
| **ADMIN-PASS-03** | Admin can view passkey unlock attempt audit trail with brute-force rate limiting guard | **Pass** | [app/server/passkeyStore.ts](file:///c:/Users/yudhiar/Downloads/AgenticAI/app/server/passkeyStore.ts) & [PasskeyAuditLogTable.tsx](file:///c:/Users/yudhiar/Downloads/AgenticAI/app/components/admin/passkeys/PasskeyAuditLogTable.tsx); logs timestamp, client ID, status, and 8-hex prefix; blocks excessive failures. |
| **ADMIN-LOG-01** | Admin can monitor aggregated technical errors and runtime troubleshooting logs | **Pass** | [app/server/troubleshootingStore.ts](file:///c:/Users/yudhiar/Downloads/AgenticAI/app/server/troubleshootingStore.ts) (`classifyErrorLog`) categorizes Port 20128, PowerShell policy, OAuth, Telegram 409, EPERM, and network errors; pairs each with actionable remediation commands. |
| **ADMIN-LOG-02** | Admin can filter and search error logs by category, status, and frequency for instructor assistance | **Pass** | [app/components/admin/troubleshooting/TroubleshootingFilterToolbar.tsx](file:///c:/Users/yudhiar/Downloads/AgenticAI/app/components/admin/troubleshooting/TroubleshootingFilterToolbar.tsx), [TroubleshootingLogTable.tsx](file:///c:/Users/yudhiar/Downloads/AgenticAI/app/components/admin/troubleshooting/TroubleshootingLogTable.tsx), and [TroubleshootingDetailModal.tsx](file:///c:/Users/yudhiar/Downloads/AgenticAI/app/components/admin/troubleshooting/TroubleshootingDetailModal.tsx); supports multi-criteria filtering, lifecycle status management, and instructor notes. |

---

## 3. Security & Cryptographic Review

### 3.1 Timing Attack Immunity
In [app/server/passkeyStore.ts:L240-246](file:///c:/Users/yudhiar/Downloads/AgenticAI/app/server/passkeyStore.ts#L240-L246), passkey candidate verification converts SHA-256 hashes to fixed 32-byte buffers and validates equality via `crypto.timingSafeEqual(targetBuf, candidateBuf)`:
```ts
const targetBuf = Buffer.from(targetHash, 'hex')
const candidateBuf = Buffer.from(candidateHash, 'hex')

let matches = false
if (targetBuf.length === candidateBuf.length && trimmedCandidate.length > 0) {
  matches = crypto.timingSafeEqual(targetBuf, candidateBuf)
}
```
This strictly prevents length and byte-comparison timing leaks against workshop entrance gates.

### 3.2 Secret Quarantine
- **Passkeys**: Neither cleartext passkeys nor full candidate hashes are recorded in `auditLogs`. Only the first 8 hex characters (`attemptHashPrefix`) are persisted ([app/server/passkeyStore.ts:L221](file:///c:/Users/yudhiar/Downloads/AgenticAI/app/server/passkeyStore.ts#L221)). Active keys store masked hints (`buk****ta`) and SHA-256 digests.
- **Redaction Engine**: [app/server/troubleshootingStore.ts:L271-273](file:///c:/Users/yudhiar/Downloads/AgenticAI/app/server/troubleshootingStore.ts#L271-L273) processes all inbound error text through `sanitizeLogText()`, masking Telegram bot tokens, OpenAI keys, Google Cloud API keys, and local Windows user directory paths (`C:\Users\[USER]\...`).

### 3.3 Administrative Authorization Enforcement
Both [app/server/passkey.ts](file:///c:/Users/yudhiar/Downloads/AgenticAI/app/server/passkey.ts) and [app/server/troubleshooting.ts](file:///c:/Users/yudhiar/Downloads/AgenticAI/app/server/troubleshooting.ts) enforce session authentication via `assertAdminAuthorized(data?.sessionToken)`.
- Rejects missing, null, or invalid tokens with `UNAUTHORIZED` HTTP/RPC exceptions.
- Validates token against the active 256-bit cryptographically secure session registry.
- Learner log ingestion (`ingestTroubleshootingLogFn`) remains appropriately public without admin credentials.

---

## 4. Findings & Issues Identified

### 4.1 Warning: Rate Limiter Cooldown Loop (Extended Lockout Duration)
- **File**: [app/server/passkeyStore.ts:L139-151](file:///c:/Users/yudhiar/Downloads/AgenticAI/app/server/passkeyStore.ts#L139-L151)
- **Severity**: Warning
- **Description**: In `checkRateLimit(clientId)`:
  ```ts
  // If cooldown passed, clear it and purge expired timestamps
  if (entry.cooldownUntil && now >= entry.cooldownUntil) {
    entry.cooldownUntil = undefined
  }

  // Filter timestamps to active sliding window
  entry.timestamps = entry.timestamps.filter((t) => now - t <= FAILURE_WINDOW_MS)

  if (entry.timestamps.length >= MAX_FAILED_ATTEMPTS) {
    entry.cooldownUntil = now + COOLDOWN_DURATION_MS
    return { isLimited: true, remainingCooldownMs: COOLDOWN_DURATION_MS }
  }
  ```
  Because `FAILURE_WINDOW_MS` is 5 minutes (300,000 ms) while `COOLDOWN_DURATION_MS` is 2 minutes (120,000 ms), a client who completes their 2-minute cooldown at $t = 121\text{s}$ will still have their 5 original failure timestamps retained in `entry.timestamps` (since $121\text{s} \le 300\text{s}$). `checkRateLimit` immediately trips `entry.timestamps.length >= MAX_FAILED_ATTEMPTS` again and applies another 2-minute cooldown *before the client can attempt a single verification*. This loops until the full 5-minute window has elapsed, causing a 5-to-6-minute lockout instead of the specified 2-minute cooldown.
- **Remediation**: When `cooldownUntil` has elapsed (`now >= entry.cooldownUntil`), decrement or prune the timestamps to `MAX_FAILED_ATTEMPTS - 1` (or clear the window) so the user is given at least one valid retry attempt following cooldown completion.

---

### 4.2 Warning: Missing `clientId` in `InstructorUnlockModal.tsx` Causes Shared Rate-Limiting
- **File**: [app/components/course/InstructorUnlockModal.tsx:L54-56](file:///c:/Users/yudhiar/Downloads/AgenticAI/app/components/course/InstructorUnlockModal.tsx#L54-L56)
- **Severity**: Warning
- **Description**: When participants submit the unlock modal, `clientId` is omitted from the request payload:
  ```ts
  const result = await verifyInstructorPasskeyFn({
    data: { courseId, passkey: passkey.trim() },
  })
  ```
  In [app/server/auth.ts:L11](file:///c:/Users/yudhiar/Downloads/AgenticAI/app/server/auth.ts#L11), this causes all modal users to default to `'anonymous'`:
  ```ts
  const result = verifyPasskeyWithStore(
    data.courseId,
    data.passkey,
    data.clientId || 'anonymous'
  )
  ```
  If any single participant in a workshop mistypes their passkey 5 times, all workshop participants using the unlock modal are throttled under the `'anonymous'` bucket.
- **Remediation**: Import `getOrCreateClientId` from `@/utils/telemetryClient` in `InstructorUnlockModal.tsx` and pass `clientId: getOrCreateClientId()` inside the `data` payload.

---

### 4.3 Warning: Omission of Client-Side Redaction in Pre-Training Cloud Sync
- **File**: [app/components/course/pretraining/PretrainingReadinessReportSection.tsx:L78-87](file:///c:/Users/yudhiar/Downloads/AgenticAI/app/components/course/pretraining/PretrainingReadinessReportSection.tsx#L78-L87)
- **Severity**: Warning
- **Description**: Requirement `T-32-04` specifies dual-layer sanitization (client-side pre-redaction before sending + server-side ingestion redaction). In `handleCloudSyncReport()`, `errorMsg.trim()` is dispatched directly without invoking `sanitizeLogText()`:
  ```ts
  const result = await ingestTroubleshootingLogFn({
    data: {
      participantId,
      participantName: participantInfo.name || 'Peserta Mandiri',
      courseId: 'ai',
      errorMsg: errorMsg.trim(),
      problemStep: probStep.trim() || undefined,
      os,
    },
  })
  ```
  While the server-side store correctly redacts secrets before in-memory storage and admin presentation, unredacted tokens still traverse the network boundary in the request body.
- **Remediation**: Apply `sanitizeLogText(errorMsg.trim()).sanitized` in `handleCloudSyncReport()` before dispatching to `ingestTroubleshootingLogFn`.

---

### 4.4 Info: Unbounded In-Memory Store Capacities
- **Files**: [app/server/passkeyStore.ts:L112](file:///c:/Users/yudhiar/Downloads/AgenticAI/app/server/passkeyStore.ts#L112), [app/server/troubleshootingStore.ts:L256](file:///c:/Users/yudhiar/Downloads/AgenticAI/app/server/troubleshootingStore.ts#L256)
- **Severity**: Info
- **Description**: Both `auditLogs` and `incidentsStore` prepend records indefinitely (`unshift`) without a maximum retention capacity. Under high-throughput workshop loads or persistent automated requests, array sizes could grow unbounded in memory.
- **Remediation**: Implement a FIFO retention cap (e.g. `auditLogs = auditLogs.slice(0, 1000)` and `incidentsStore = incidentsStore.slice(0, 1000)`).

---

## 5. Code Quality & Styling

1. **Type Safety**: Zod schemas in [app/schemas/passkey.ts](file:///c:/Users/yudhiar/Downloads/AgenticAI/app/schemas/passkey.ts) and [app/schemas/troubleshooting.ts](file:///c:/Users/yudhiar/Downloads/AgenticAI/app/schemas/troubleshooting.ts) are strictly bound to TypeScript types with zero `any` coercions.
2. **CSS Consistency**: All styling in [assets/css/admin.css](file:///c:/Users/yudhiar/Downloads/AgenticAI/assets/css/admin.css) and [public/assets/css/admin.css](file:///c:/Users/yudhiar/Downloads/AgenticAI/public/assets/css/admin.css) uses existing design tokens (`var(--bg-surface)`, `var(--border-subtle)`, `var(--accent-primary)`) and maintains responsive layouts across mobile (375px), tablet (768px), and desktop (1440px).
3. **Accessibility**: Modals provide `aria-modal="true"`, `role="dialog"`, `aria-labelledby`, Escape key handling, and background scroll containment.

---

## 6. Verification Summary

```powershell
# Automated Test Execution
node --test tests/admin-passkey.test.js tests/admin-troubleshooting.test.js
# Result: 34 tests, 12 suites, 34 pass, 0 fail (458ms)

# TypeScript Typecheck
npm run typecheck
# Result: 0 errors
```

---

## 7. Resolution Status (Resolved in `0316e5d`)

All 3 warnings and 1 info finding were resolved in commit `0316e5d`:
1. **Rate Limiter Cooldown Reset**: When cooldown timer expires, `passkeyStore.ts` now resets both `cooldownUntil` and clears the failure timestamp array (`state.failureTimestamps = []`), preventing infinite cooldown loops.
2. **Client ID Isolation**: `InstructorUnlockModal.tsx` now passes `clientId: getOrCreateClientId()` to `verifyInstructorPasskeyFn`, properly partitioning rate limit counters per browser session.
3. **Dual-Layer Redaction**: Client-side sanitization via `sanitizeLogText` was added in `PretrainingReadinessReportSection.tsx` before logging transmission, complementing the server-side redaction.
4. **Unbounded Growth Safeguard**: FIFO retention cap (`slice(0, 1000)`) was implemented on both `auditLogs` and `incidentsStore`.

All 213 test cases pass across 25 suites, and `npm run typecheck` passes with zero errors.
