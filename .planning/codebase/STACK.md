# Technology Stack

**Analysis Date:** 2026-09-04

## Languages

**Primary:**
- HTML5 - Living Standard (`index.html`, `tests/index.html`) - Semantic web structure, accessible ARIA attributes, forms, and interactive accordions
- CSS3 - Modern CSS with Custom Properties, Flexbox, CSS Grid, Media Queries, and Glassmorphism (`assets/css/main.css`, `assets/css/components.css`)
- JavaScript (ES6+ / ECMAScript 2022) - Client-side state management, search engine, UI controllers, and sanitization (`assets/js/state.js`, `assets/js/search.js`, `assets/js/app.js`)

**Secondary:**
- Python 3.11+ - PDF generation utility for compiling workshop guide to printable A4 PDF (`tmp/pdfs/build_pretraining_pdf.py`)
- Markdown (GFM) - Workshop curriculum guides and planning specifications (`PANDUAN-PRE-TRAINING.md`, `PANDUAN-PRAKTIK-KELAS.md`, `RENCANA-WORKSHOP.md`, `.planning/`)

## Runtime

**Environment:**
- Production: Modern Evergreen Web Browsers (Google Chrome 100+, Mozilla Firefox 100+, Apple Safari 15+, Microsoft Edge 100+)
- Offline / Local: File URI protocol (`file:///`) and static HTTP servers
- Development / Test Runner: Node.js (v20.x, v22.x LTS) for headless dual-environment test execution (`tests/*.test.js`)

**Package Manager:**
- Client-Side: None (Zero-dependency architecture; no `package.json` required to run the application)
- Auxiliary Tooling: npm / pnpm / nvm available in user environment (`C:\nvm4w\nodejs\node.exe`, `C:\Users\yudhiar\AppData\Roaming\npm`)
- Lockfile: Not applicable for client-side web application

## Frameworks

**Core:**
- Vanilla Web Platform Standards - Native DOM API, Web Storage API (`localStorage`), Clipboard API (`navigator.clipboard`), IntersectionObserver API
- Zero runtime UI framework (no React, Vue, or Angular overhead; ultra-fast first contentful paint and instant boot)

**Testing:**
- Custom Zero-Dependency Browser & Node Dual-Environment Test Harness (`tests/index.html`, `tests/checkpoint-engine.test.js`, `tests/troubleshooting-exporter.test.js`, `tests/search-security.test.js`, `tests/mobile-accessibility.test.js`)
- Universal module definition export pattern (`typeof module !== 'undefined' && module.exports`) enabling both browser execution and Node.js CLI test execution

**Build/Dev:**
- Zero Build Step - No bundlers (no Webpack, Vite, or Rollup), no transpilers (no Babel, TypeScript compiler). Edit and refresh immediately in browser.
- Local Server (Optional): `python -m http.server 8000` or VS Code Live Server extension

## Key Dependencies

**Critical:**
- None (100% self-contained client-side codebase)

**External Web Assets:**
- Google Fonts (`https://fonts.googleapis.com`):
  - `Inter` (weights 400, 500, 600, 700, 800) - Primary UI typography
  - `JetBrains Mono` (weights 400, 500, 600) - Code blocks, terminal prompts, and monospace badges
  - Fallback: System sans-serif (`-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`) and monospace font stacks

**Development & Auxiliary Utilities:**
- ReportLab (`reportlab` Python package) - Used in `tmp/pdfs/build_pretraining_pdf.py` for automated PDF generation from Markdown
- GSD Workflow Tools (`.agents/gsd-core/bin/gsd-tools.cjs`) - Project lifecycle and planning management

## Configuration

**Environment:**
- Fully client-side; no `.env` runtime requirement for end users.
- Browser `localStorage` key: `'pretraining_app_state_v1'` (`assets/js/state.js:L7`)

**Theme & Design Tokens:**
- Managed via CSS Custom Properties on `:root` and `[data-theme="dark"]` in `assets/css/main.css:L31-155`:
  - `--bg-body`, `--bg-surface`, `--bg-canvas`, `--bg-glass`
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
- Node.js 20+ (optional, for running automated test suites via CLI)
- Python 3.10+ (optional, for building PDF output)

**Production:**
- Any static hosting provider (GitHub Pages, Cloudflare Pages, Netlify, Vercel, AWS S3) or distribution as an offline standalone directory runnable directly via double-clicking `index.html`.

---

*Stack analysis: 2026-09-04*
