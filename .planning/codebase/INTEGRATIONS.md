# External Integrations

**Analysis Date:** 2026-09-04

## APIs & External Services

**Typography & CDN Assets:**
- Google Fonts API - Typography delivery for `Inter` and `JetBrains Mono`
  - Endpoint: `https://fonts.googleapis.com` & `https://fonts.gstatic.com`
  - Client: Preconnected `<link rel="stylesheet">` tags in `index.html:L9-12`
  - Fallback: System UI fonts (`-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif`) if offline or unreachable

**Participant Communication Channels:**
- WhatsApp Messenger Integration:
  - Integration Type: Client-side clipboard payload generation and WhatsApp Click-to-Chat deep links (`https://api.whatsapp.com/send` / `https://wa.me/`)
  - Implementation: `setupReadinessReport()` in `assets/js/app.js:L910-940` formats structured checklist summaries for instant messaging
- Telegram Messenger Integration:
  - Integration Type: Direct participant reference links and Telegram share links
  - Referenced Bots: `@BotFather` (`https://t.me/BotFather`) for bot token creation, `@userinfobot` (`https://t.me/userinfobot`) for retrieving Telegram numeric User IDs

**Workshop Companion Services (Local Target Environment):**
- 9Router Local Service:
  - Endpoint: `http://localhost:3000` (referenced across Module 2 guides and Checkpoint 2 validation cards in `index.html:L620-750`)
  - Purpose: Local API router and proxy daemon that workshop participants install and test locally on their machines

**Cloud Providers & Developer Consoles (Referenced Only):**
- Google Cloud Console:
  - Endpoint: `https://console.cloud.google.com` (referenced in Module 4 for Google Calendar API setup)

## Data Storage

**Databases:**
- None (Client-side architecture; no backend database server required)

**File Storage:**
- Local filesystem only (`file:///` protocol support)
- Pre-rendered presentation slides and documents located in `output/` and `assets/`

**Client-Side Persistence & State:**
- Browser Web Storage (`localStorage`):
  - Storage Key: `'pretraining_app_state_v1'` (`assets/js/state.js:L7`)
  - Data Structure: Serialized JSON holding user checklist booleans, checkpoint gate states (`'pending'` | `'passed'` | `'failed'`), participant metadata, and theme preference
  - Security Isolation: Scoped strictly to the browser's origin

**Caching:**
- Browser native HTTP cache for static CSS, JS, SVG, and Google Fonts webfonts

## Authentication & Identity

**Auth Provider:**
- None (No login required; application is open, decentralized, and works offline)

**Identity Handling:**
- Participant Information (`participantInfo` in `assets/js/state.js:L43-50`):
  - Fields: `name`, `email`, `telegramUsername`, `telegramUserId`, `nodeVersion`, `routerStatus`
  - Storage: Persisted locally in browser `localStorage`
  - Normalization: Telegram usernames are automatically normalized to a single `@` prefix (`assets/js/app.js:L895-905`)

**Client-Side Credential Redaction & Sanitization:**
- Token Redaction Helper (`assets/js/app.js:L810-870`):
  - In-browser regex engine to mask sensitive credentials before participants copy logs to WhatsApp/Telegram:
    - Telegram Bot Tokens (`[0-9]{8,10}:[a-zA-Z0-9_-]{35}`)
    - OpenAI API Keys (`sk-[a-zA-Z0-9]{20,}`)
    - Google Cloud API Keys (`AIza[0-9A-Za-z-_]{35}`)
    - HTTP Authorization Bearer Tokens
    - Email addresses and Windows user directory paths (`C:\Users\<username>\...`)

## Monitoring & Observability

**Error Tracking:**
- Native browser console (`console.error`, `console.warn`)
- In-page Toast Notification System (`assets/js/app.js:L990-1010`):
  - Visual feedback for copy operations, checklist updates, checkpoint validations, and errors

**Logs:**
- In-memory event dispatching (`StateManager.listeners` in `assets/js/state.js:L57-59`)
- Zero external logging services or third-party telemetry (100% participant privacy)

## CI/CD & Deployment

**Hosting:**
- Static Web Hosting ready: GitHub Pages, Cloudflare Pages, Vercel, Netlify, Amazon S3, or intranet file shares

**CI Pipeline:**
- Headless test execution scriptable via Node.js:
  - `node tests/checkpoint-engine.test.js`
  - `node tests/troubleshooting-exporter.test.js`
  - `node tests/search-security.test.js`
  - `node tests/mobile-accessibility.test.js`
- In-browser test runner interface: `tests/index.html`

## Environment Configuration

**Required env vars:**
- None (Zero runtime environment variables needed for web client)

**Secrets location:**
- No secrets stored in codebase. The application is completely public and client-side safe.

## Webhooks & Callbacks

**Incoming:**
- None

**Outgoing:**
- None

---

*Integration audit: 2026-09-04*
