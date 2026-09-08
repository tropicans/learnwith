# Technology Stack

**Analysis Date:** 2026-09-08

## Languages

**Primary:**
- HTML5 - Living Standard (`index.html`, `tests/index.html`) - Semantic web structure, accessible ARIA attributes, CSP security metadata, anti-clickjacking frame guards, and multi-course studio markup
- CSS3 - Modern CSS with Custom Properties, Flexbox, CSS Grid, Media Queries, and Glassmorphism (`assets/css/main.css`, `assets/css/components.css`)
- JavaScript (ES6+ / ECMAScript 2022) - Client-side state management, search engine, UI controllers, Web Crypto API security, and DOM sanitization (`config.js`, `assets/js/state.js`, `assets/js/search.js`, `assets/js/app.js`)

**Secondary:**
- Python 3.11+ - PDF generation utility for compiling workshop guide to printable A4 PDF (`tmp/pdfs/build_pretraining_pdf.py`)
- Markdown (GFM) - Workshop curriculum guides, class notes, and GSD planning specifications (`PANDUAN-PRE-TRAINING.md`, `PANDUAN-PRAKTIK-KELAS.md`, `RENCANA-WORKSHOP.md`, `.planning/`)

## Runtime

**Environment:**
- Production: Modern Evergreen Web Browsers (Google Chrome 100+, Mozilla Firefox 100+, Apple Safari 15+, Microsoft Edge 100+)
- Offline / Local: File URI protocol (`file:///`) and static HTTP servers
- Development / Test Runner: Node.js (v20.x, v22.x LTS, v25.x) for headless dual-environment test execution (`tests/*.test.js`)

**Package Manager:**
- Client-Side: None (Zero-dependency architecture; no `package.json` required to run the application)
- Auxiliary Tooling: npm / pnpm / nvm available in user environment (`C:\nvm4w\nodejs\node.exe`, `C:\Users\yudhiar\AppData\Roaming\npm`)
- Lockfile: Not applicable for client-side web application

## Frameworks

**Core:**
- Vanilla Web Platform Standards - Native DOM API, Web Storage API (`localStorage`, `sessionStorage`), Web Crypto API (`crypto.subtle.digest`), Clipboard API (`navigator.clipboard`), IntersectionObserver API
- Zero runtime UI framework (no React, Vue, or Angular overhead; instant boot, zero bundle lag, and extreme longevity)

**Testing:**
- Custom Zero-Dependency Browser & Node Dual-Environment Test Harness (`tests/index.html`, `tests/*.test.js`):
  - `checkpoint-engine.test.js` - Checkpoint and state engine
  - `troubleshooting-exporter.test.js` - Secret redaction and report generation
  - `search-security.test.js` - Search engine and DOM highlighting
  - `mobile-accessibility.test.js` - Mobile drawer and touch accessibility
  - `mode-switcher.test.js` - Pra-Training vs Hari-H mode switching
  - `live-class-modules.test.js` - Moduls 6-11 and checkpoints 4-9
  - `multi-course.test.js` - Multi-course isolation and developer gate
  - `word-modules.test.js` - Course 2 Bab I-IV guides and checklists
  - `word-quiz-report.test.js` - Bab V 20-question quiz, rubrics, and graduation report
  - `session-security.test.js` - URL gate hardening, session tokens, auto-lock timeout
  - `csp-dom-security.test.js` - Content Security Policy, anti-clickjacking, DOM sanitization
- Universal module definition export pattern (`typeof module !== 'undefined' && module.exports`) enabling both browser execution and Node.js CLI test execution

**Build/Dev:**
- Zero Build Step - No bundlers (no Webpack, Vite, or Rollup), no transpilers (no Babel, TypeScript compiler). Edit and refresh immediately in browser.
- Version-tagged cache busting query params (`?v=2.2.0`, `?v=2.2.3`) on stylesheet and script links in `index.html`.
- Local Server (Optional): `python -m http.server 8000` or VS Code Live Server extension

## Key Dependencies

**Critical:**
- None (100% self-contained client-side codebase)

**External Web Assets:**
- Google Fonts (`https://fonts.googleapis.com` & `https://fonts.gstatic.com`):
  - `Inter` (weights 400, 500, 600, 700, 800) - Primary UI typography
  - `JetBrains Mono` (weights 400, 500, 600) - Code blocks, terminal prompts, and monospace badges
  - Fallback: System sans-serif (`-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`) and monospace font stacks

**Security & Platform Configuration:**
- Centralized Configuration (`config.js`):
  - Defines `window.LEARNWITH_CONFIG` with application version (`2.2.0`), course lock status, session timeout limits, and one-way SHA-256 authorized instructor passcode hashes.

## Configuration

**Environment:**
- Fully client-side; no `.env` runtime requirement for end users.
- Browser `localStorage` keys (`assets/js/state.js`):
  - Course 1 (Agentic AI): `'learnwith_ai_state_v1'` (with automatic backward compatibility migration from `'pretraining_app_state_v1'`)
  - Course 2 (Pengolahan Kata): `'learnwith_word_state_v1'` (strictly isolated)
  - Unlock & Session flags: `'learnwith_word_unlocked'` and tab-scoped `sessionStorage` tokens with SHA-256 integrity checksums

**Theme & Design Tokens:**
- Managed via CSS Custom Properties on `:root` and `[data-theme="dark"]` in `assets/css/main.css:L31-155`:
  - `--bg-body`, `--bg-surface`, `--bg-surface-subtle`, `--bg-canvas`, `--bg-glass`
  - `--text-primary`, `--text-secondary`, `--text-muted`, `--text-code`
  - `--accent-primary` (`#2563eb`), `--accent-secondary` (`#0284c7`)
  - Status colors: `--color-success`, `--color-warning`, `--color-danger`, `--color-info`

**Build & Ignore:**
- `.gitignore`: Configured to exclude `node_modules/`, `tmp/`, `output/`, `.DS_Store`, `Thumbs.db`, `.gsd/`

## Platform Requirements

**Development:**
- Any standard operating system (Windows 10/11, macOS, Linux)
- Text editor (VS Code, Cursor, Zed, Antigravity)
- Modern web browser for manual validation
- Node.js 20+ (for running automated test suites via CLI)
- Python 3.10+ (optional, for building PDF output)

**Production:**
- Any static hosting provider (Nginx, GitHub Pages, Cloudflare Pages, Netlify, Vercel, AWS S3) or distribution as an offline standalone directory runnable directly via double-clicking `index.html`.

---

*Stack analysis: 2026-09-08*
