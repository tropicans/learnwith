# External Integrations

**Analysis Date:** 2026-09-08

## APIs & External Services

**Typography & CDN Assets:**
- Google Fonts API - Typography delivery for `Inter` and `JetBrains Mono`
  - Endpoint: `https://fonts.googleapis.com` & `https://fonts.gstatic.com`
  - Client: Preconnected `<link rel="stylesheet">` tags in `index.html`
  - Fallback: System UI fonts (`-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif`) if offline or unreachable

**Content Security Policy (CSP) Whitelisted Endpoints:**
- Google Gemini / Generative Language API (`https://generativelanguage.googleapis.com`)
- Telegram Bot API (`https://api.telegram.org`)
- Google Fonts & GStatic (`https://fonts.googleapis.com`, `https://fonts.gstatic.com`)

**Participant Communication Channels:**
- WhatsApp Messenger Integration:
  - Integration Type: Client-side clipboard payload generation and WhatsApp Click-to-Chat deep links (`https://api.whatsapp.com/send` / `https://wa.me/`)
  - Implementation: `setupReadinessReport()` and `generateWordReportText()` in `assets/js/app.js` format structured checklist summaries and BPSDM evaluation reports for instant messaging
- Telegram Messenger Integration:
  - Integration Type: Direct participant reference links and Telegram share links with formatted markdown
  - Referenced Bots: `@BotFather` (`https://t.me/BotFather`) for bot token creation, `@userinfobot` (`https://t.me/userinfobot`) for retrieving Telegram numeric User IDs

**Workshop Companion Services (Local Target Environment):**
- 9Router Local Service:
  - Endpoint: `http://localhost:3000` (referenced across Module 2 guides and Checkpoint 2 validation cards in `index.html`)
  - Purpose: Local API router and proxy daemon that workshop participants install and test locally on their machines
- Hermes Agent CLI:
  - Windows native execution (`hermes.exe`) interacting with 9Router local endpoint and Telegram Gateway

**Cloud Providers & Developer Consoles (Referenced Only):**
- Google Cloud Console:
  - Endpoint: `https://console.cloud.google.com` (referenced in Module 4 & 10 for Google Calendar API and OAuth 2.0 Desktop credentials)

## Data Storage

**Databases:**
- None (Client-side architecture; no backend database server required)

**File Storage:**
- Local filesystem only (`file:///` protocol support)
- Pre-rendered presentation slides and documents located in `output/` and `assets/`

**Client-Side Persistence & State:**
- Browser Web Storage (`localStorage` & `sessionStorage`):
  - Storage Keys:
    - `'learnwith_ai_state_v1'`: Serialized JSON holding Course 1 user checklists, checkpoints (`'pending'` | `'passed'` | `'failed'`), participant metadata, and theme preference
    - `'learnwith_word_state_v1'`: Serialized JSON holding Course 2 checklists (28 tasks), checkpoints (3 checkpoints), 20-question quiz answers/score/passed state, self-reflection answers, and BPSDM rubric checks
    - `'learnwith_word_unlocked'`: Persistent gate unlock state for Course 2
    - `sessionStorage`: Ephemeral, tab-scoped session token with SHA-256 integrity checksum for authorized instructor sessions
  - Security Isolation: Scoped strictly to the browser's origin, with zero cross-course data pollution

**Caching:**
- Browser native HTTP cache for static CSS, JS, SVG, and Google Fonts webfonts with query string cache-busting (`?v=2.2.0`, `?v=2.2.3`)

## Authentication & Identity

**Auth & Passcode Gate:**
- Instructor / Developer Passcode Gate (`config.js`):
  - Passcodes are never stored in plaintext in the codebase.
  - Validated using Web Crypto API (`crypto.subtle.digest('SHA-256')`) against authorized hashes:
    - `ddf62f4013c59b111215312fb959629155a5b1dc5cf799f2053a8c2395c4511b` (`buka-kata`)
    - `487da33ab431e57b68afa84059c0e7a95818f99cd9581054026f224fc7bba174` (`kata-sandi-asn`)
  - Auto-lock session timeout (default 15 minutes of inactivity) and tab-scoped validation prevent unauthorized lingering sessions

**Identity Handling:**
- Participant Information:
  - Course 1 (`participantInfo`): `name`, `email`, `telegramUsername`, `telegramUserId`, `nodeVersion`, `routerStatus`
  - Course 2 (`participantInfo`): `name`, `nip`, `unit`, `targetDoc`, `reportDate`
  - Storage: Persisted locally in respective browser `localStorage`
  - Normalization: Telegram usernames are automatically normalized to a single `@` prefix

**Client-Side Credential Redaction & Sanitization:**
- Token Redaction Helper (`assets/js/app.js`):
  - In-browser regex engine to mask sensitive credentials before participants copy logs to WhatsApp/Telegram:
    - Telegram Bot Tokens (`[0-9]{8,10}:[a-zA-Z0-9_-]{35}`)
    - OpenAI API Keys (`sk-[a-zA-Z0-9]{20,}`)
    - Google Cloud API Keys (`AIza[0-9A-Za-z-_]{35}`)
    - HTTP Authorization Bearer Tokens
    - Email addresses and Windows user directory paths (`C:\Users\<username>\...`)

## Monitoring & Observability

**Error Tracking:**
- Native browser console (`console.error`, `console.warn`)
- In-page Toast Notification System (`assets/js/app.js`):
  - Visual feedback for copy operations, checklist updates, checkpoint validations, and errors

**Logs:**
- In-memory event dispatching (`StateManager.listeners` in `assets/js/state.js`)
- Zero external logging services or third-party telemetry (100% participant privacy)

## CI/CD & Deployment

**Hosting & Production Deployment:**
- **Production Server:** `learnwith`
- **Root Directory:** `/var/www/learnwith`
- **Web Server:** Nginx (`systemctl reload nginx`)
- **Deployment Command (Pull):**
  ```bash
  cd /var/www/learnwith && git pull origin master
  ```
- Also static web hosting ready: GitHub Pages, Cloudflare Pages, Vercel, Netlify, Amazon S3, or intranet file shares

**CI Pipeline:**
- Headless test execution scriptable via Node.js:
  - `node tests/checkpoint-engine.test.js`
  - `node tests/troubleshooting-exporter.test.js`
  - `node tests/search-security.test.js`
  - `node tests/mobile-accessibility.test.js`
  - `node tests/mode-switcher.test.js`
  - `node tests/live-class-modules.test.js`
  - `node tests/multi-course.test.js`
  - `node tests/word-modules.test.js`
  - `node tests/word-quiz-report.test.js`
  - `node tests/session-security.test.js`
  - `node tests/csp-dom-security.test.js`
- In-browser test runner interface: `tests/index.html`

## Environment Configuration

**Required env vars:**
- None (Zero runtime environment variables needed for web client)

**Secrets location:**
- No plaintext secrets stored in codebase. The application is completely public and client-side safe.

## Webhooks & Callbacks

**Incoming:**
- None

**Outgoing:**
- None

---

*Integration audit: 2026-09-08*
