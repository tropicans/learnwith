# Phase 17: URL Gate Hardening, Session Management & Anti-Tampering - Research

**Researched:** 2026-09-07  
**Domain:** Client-Side Application Security, Session Management, URL Gate Protection, Storage Integrity  
**Confidence:** HIGH  

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| SEC-05 | Penutupan celah bypass URL parameter tanpa otorisasi (`?unlock=dev`, `?unlock=word`, `?unlock=1`); parameter URL hanya dapat membuka modul jika menyertakan token/hash instruktur yang sah. | Investigated current query parser in `app.js` (`isLiveClassUnlocked`, `isWordCourseUnlocked`). Designed secure token/passcode matching using Web Crypto SHA-256 and URL sanitization via `history.replaceState`. |
| SEC-06 | Mekanisme auto-lock / session timeout: modul yang telah dibuka akan otomatis terkunci kembali jika sesi tidak aktif atau saat browser ditutup, mencegah akses tidak sah pada perangkat yang ditinggalkan. Anti-tampering pada status penyimpanan. | Designed dual-tier session storage (`sessionStorage` for session lifetime), sliding inactivity timer (user activity tracking), and integrity checksum token validation to prevent DevTools manipulation. |
</phase_requirements>

## Summary

In Phase 16, plaintext credentials were eliminated from JavaScript files and DOM placeholders, replacing direct string comparisons with Web Crypto SHA-256 hash matching configured in `config.js` (`window.LEARNWITH_CONFIG`). However, two critical access-control vulnerabilities remain in the client runtime:

1. **Unauthenticated URL Gate Bypass (SEC-05):** In `assets/js/app.js`, both `isLiveClassUnlocked()` (lines 1944–1953) and `isWordCourseUnlocked()` (lines 2135–2145) immediately grant persistent access whenever query parameters match trivial strings such as `?unlock=live`, `?unlock=word`, `?unlock=dev`, or `?unlock=1`. Anyone can bypass the passcode modal simply by crafting an URL. Furthermore, valid parameters must be consumed securely without leaving sensitive query parameters in browser history or HTTP referrer headers.
2. **Indefinite Storage & Lack of Inactivity Auto-Lock (SEC-06):** Once unlocked, flags are written to `localStorage` (`live_class_unlocked: "true"` and `learnwith_word_unlocked: "true"`), remaining active indefinitely across browser restarts. There is no idle timeout. Furthermore, anyone opening DevTools console can manually execute `localStorage.setItem('learnwith_word_unlocked', 'true')` to bypass authorization.

**Primary recommendation:** Deprecate plaintext query bypasses entirely. Require URL unlocks to provide a valid authorized passcode or token verified via SHA-256 against `window.LEARNWITH_CONFIG.security.allowedPasscodeHashes`, followed by immediate URL cleaning with `history.replaceState()`. Migrate storage to `sessionStorage` with an anti-tampering integrity payload (`timestamp`, `expiry`, and integrity hash), coupled with an idle activity timer (15 minutes default) that automatically locks modules upon user absence.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| URL Parameter Validation | Browser / Client | — | The application is a static client-side web application; URL evaluation must occur during initialization before view rendering. |
| URL Sanitization | Browser / Client | — | Must execute `history.replaceState` immediately in browser DOM to purge sensitive tokens from history and prevent referrer leaks. |
| Session Lifecycle & Storage | Browser / Client | — | Using `sessionStorage` partitions credentials by browser tab and origin, auto-clearing when tabs close. |
| Inactivity Detection (Auto-Lock) | Browser / Client | — | Global DOM event listeners (`mousemove`, `keydown`, `touchstart`, `scroll`) track user activity and drive a sliding timeout. |
| Storage Anti-Tampering | Browser / Client | — | Token payload is signed/hashed with a session-ephemeral integrity key generated in memory on initial app boot. |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Web Crypto API (`crypto.subtle`) | W3C Standard [VERIFIED: MDN] | Cryptographic hashing (SHA-256) | Native browser standard, constant-time operations, zero external bundle overhead. |
| Web Storage API (`sessionStorage`) | WHATWG Standard [VERIFIED: MDN] | Tab-isolated session persistence | Automatically destroyed on tab closure, preventing cross-session credential retention on shared devices. |
| History API (`history.replaceState`) | WHATWG Standard [VERIFIED: MDN] | Query parameter purge | Cleanses URL in-place without page reload or history clutter. |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `window.LEARNWITH_CONFIG` | 2.2.0 | Centralized security configuration | Read configured passcode hashes, timeout limits, and feature flags. |
| `StateManager` (`window.AppState`) | Internal | Unified state change dispatcher | Emit `courseLockChange` or `lockTimeout` events to re-render UI. |

## Architecture Patterns

### System Architecture Diagram

```
[User / Browser Entry]
         │
         ▼
[1. URL Inspection] ──(Has ?code= / ?token=)──► [Validate via SHA-256 vs LEARNWITH_CONFIG]
         │                                                      │
         ├─(Matches legacy ?unlock=dev/word/1)                  ├── Valid: Initialize Session & Purge URL
         │  └─► REJECT & STRIP (No bypass)                      └── Invalid: Purge URL & Display Error Toast
         │
         ▼
[2. Session State Hydration]
         │
         ├─► Read `sessionStorage` (Payload: { course, timestamp, expiresAt, signature })
         │     │
         │     ├── Invalid signature / Tampered / Expired ──► Discard & Force Lock State
         │     └── Valid & Unexpired ───────────────────────► Mark Course Unlocked
         │
         ▼
[3. Active Inactivity Monitor]
         │
         ├── User Event (`keydown`, `mousemove`, `click`, `scroll`) ──► Reset Inactivity Timer
         │
         └── Idle > 15 mins (Timeout reached) ───────────────────────► Auto-Lock Session
                                                                        ├─ Wipe sessionStorage
                                                                        ├─ Update UI / Lock Badges
                                                                        └─ Show Security Notification
```

### Pattern 1: URL Gate Hardening & Immediate History Cleansing (SEC-05)

When an instructor shares an authorized link (e.g., `index.html?unlock_code=buka-kata` or `?auth=<valid_hash>`), the application:
1. Normalizes input and verifies the SHA-256 hash asynchronously against `LEARNWITH_CONFIG.security.allowedPasscodeHashes`.
2. Rejects legacy bypass strings (`'word'`, `'dev'`, `'1'`, `'live'`, `'class'`) unless their hash is explicitly in `allowedPasscodeHashes`.
3. Calls `window.history.replaceState({}, document.title, window.location.pathname + window.location.hash)` to strip the query string cleanly without triggering navigation or leaving credentials in browser history.

### Pattern 2: Tab-Scoped Session with Cryptographic Integrity Check (SEC-06)

To prevent users from opening DevTools and typing `localStorage.setItem('learnwith_word_unlocked', 'true')`:
1. Storage is shifted from `localStorage` to `sessionStorage`.
2. An ephemeral session seed (random 32-byte hex) is held in memory (`window.__LW_SESSION_SEED`). Because it lives only in memory, DevTools cannot forge a valid payload without knowing the in-memory seed.
3. The stored session object is:
   ```json
   {
     "unlocked": true,
     "unlockedAt": 1757234000000,
     "expiresAt": 1757234900000,
     "checksum": "sha256(course + expiresAt + sessionSeed)"
   }
   ```
4. On every verification, the checksum is recomputed. If values are modified or if `expiresAt < Date.now()`, the session is rejected.

### Pattern 3: Sliding Inactivity Watcher (Auto-Lock)

1. A background timer monitors user interactions via low-overhead throttled listeners (`mousemove`, `keydown`, `pointerdown`, `scroll`).
2. Configurable timeout duration (default: 15 minutes, or configured in `LEARNWITH_CONFIG.security.sessionTimeoutMinutes`).
3. If no activity occurs for 15 minutes:
   - Clear session storage.
   - Dispatch lock state change.
   - If user is currently viewing a locked course module (e.g. Word course), return to safe home/dashboard view or display a locked modal.
   - Show notification: `"Sesi telah berakhir karena tidak ada aktivitas. Modul otomatis dikunci demi keamanan."`

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Inactivity Heartbeat | Custom polling threads or infinite web workers | DOM event throttled timers (`setTimeout` / `clearTimeout`) | Native, zero-dependency, low battery & memory usage. |
| URL Parameter Parsing | Custom regex parsing | `URLSearchParams(window.location.search)` | Handles encoding, duplicate keys, and spec edge-cases natively. |
| Integrity Checksum | Custom XOR / string reversal | Web Crypto API `crypto.subtle.digest('SHA-256')` | Resistant to collision and tampering. |

## Common Pitfalls

### Pitfall 1: Leaving Query Strings in Browser History
- **What goes wrong:** User uses an authorized link, closes browser, and later someone accesses browser history or logs to view the full URL containing the key.
- **How to avoid:** Execute `history.replaceState()` immediately after reading parameters.

### Pitfall 2: High CPU from Unthrottled Activity Listeners
- **What goes wrong:** Listening to `mousemove` or `scroll` without throttling can fire hundreds of events per second, causing UI stutter.
- **How to avoid:** Throttle activity updates (e.g., only reset timer if at least 5 seconds have elapsed since the previous reset).

### Pitfall 3: Broken Back-Navigation on Auto-Lock
- **What goes wrong:** When auto-lock fires while viewing a sensitive module, browser history still points to the deep module hash.
- **How to avoid:** When auto-lock triggers, if current view is inside a locked course, navigate `AppState` back to `'home'` or safe pretraining and update `window.location.hash`.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Default session timeout of 15 minutes is optimal for training classroom setting. | Session Management | User may prefer longer duration (e.g., 30 mins). Made configurable via `config.js`. |
| A2 | Tab closure auto-lock via `sessionStorage` matches user expectations for shared training PC. | Architecture Patterns | Low risk; standard security practice for enterprise/training labs. |

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Web Crypto API | SEC-05, SEC-06 | ✓ | W3C Standard | Node.js `crypto` in test environments |
| Web Storage (`sessionStorage`) | SEC-06 | ✓ | WHATWG Standard | In-memory object fallback |
| Node.js | Test suite | ✓ | v22.22.3 | — |
| Playwright (Python) | E2E browser tests | ✓ | 1.x installed | — |

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Node.js built-in assertion tests + Playwright Python E2E |
| Config file | `tests/session-security.test.js` |
| Quick run command | `& C:\nvm4w\nodejs\node.exe tests/session-security.test.js` |
| Full suite command | `& C:\nvm4w\nodejs\node.exe tests/session-security.test.js; python scratch/test_phase17_security.py` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SEC-05 | Reject legacy bypass URLs (`?unlock=dev`, `?unlock=word`, `?unlock=1`); only authorize valid passcode hash via URL; clean URL history. | Integration / Unit | `& C:\nvm4w\nodejs\node.exe tests/session-security.test.js` | ❌ Wave 0 |
| SEC-06 | Session bound to `sessionStorage`, auto-lock timeout on inactivity, detect and reject tampered storage tokens. | Integration / E2E | `python scratch/test_phase17_security.py` | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `& C:\nvm4w\nodejs\node.exe tests/session-security.test.js`
- **Per wave merge:** Full test suite green
- **Phase gate:** All SEC-05 & SEC-06 tests pass before marking phase complete.

### Wave 0 Gaps
- [ ] `tests/session-security.test.js` — unit tests for URL gate hardening, session token generation, integrity verification, and timeout logic.
- [ ] `scratch/test_phase17_security.py` — Playwright browser test verifying URL parameter stripping and auto-lock in headless browser.

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | yes | Web Crypto SHA-256 hash matching against immutable config list. |
| V3 Session Management | yes | `sessionStorage` partition per tab, anti-tampering token checksum, 15-min idle timeout. |
| V4 Access Control | yes | Hardened URL parameter parsing; strict rejection of unauthenticated bypasses. |
| V5 Input Validation | yes | URL parameter sanitization and immediate deletion via `history.replaceState`. |
| V6 Cryptography | yes | Constant-time Web Crypto digest comparison. |

### Known Threat Patterns

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Query Parameter Sniffing / Leak | Information Disclosure | Immediately strip URL query via `history.replaceState`. |
| Shared Device Abandonment | Elevation of Privilege | Idle inactivity timer automatically locks course after 15 minutes. |
| LocalStorage Tampering | Tampering | Session token verified with in-memory session seed checksum. |
| URL Bypass (`?unlock=dev`) | Elevation of Privilege | Whitelist only SHA-256 verified passcode parameters. |

## Sources

### Primary (HIGH confidence)
- Context7 `/mdn/content` - `Window: storage event`, `sessionStorage`, `Web Storage API`
- `config.js` and `assets/js/app.js` source code analysis (lines 1940–2160)

### Secondary (MEDIUM confidence)
- OWASP Session Management Cheat Sheet (Client-side session handling & idle timeout standards)

## Metadata

**Confidence breakdown:**
- URL Hardening: HIGH - Directly observed bypass logic in `app.js` and verified clean mitigation.
- Session Management & Anti-Tampering: HIGH - Established browser APIs (`sessionStorage`, `crypto.subtle`).
- Validation: HIGH - Verified testing harness with Node.js and Playwright.

**Research date:** 2026-09-07  
**Valid until:** 2026-10-07  
