# Project Retrospective

## Milestone: v1.0 — Pre-Training Interactive Web App

**Shipped:** 2026-09-03
**Phases:** 4 | **Plans:** 11 | **Requirements:** 18/18 (100%)

### What Was Built
A modern, responsive, and beginner-friendly web application designed to guide workshop participants through `PANDUAN-PRE-TRAINING.md` (Workshop Hermes Agent + 9Router). Features 5 structured pre-training modules, 1-click command copying with toast alerts, interactive glossary popovers, 13 persistent checklist items, 3 gated checkpoint validation cards with regex checks, dynamic readiness badge evaluation, a 10-issue Troubleshooting Hub, client-side regex Token Redaction workbench, and an automated Section 15 Form Laporan Kesiapan with 1-click WhatsApp/Telegram clipboard export.

### What Worked
- **Vanilla Stack Selection**: Choosing pure HTML5, CSS custom properties, and ES6 JavaScript without Node build steps or framework dependencies made development ultra-fast, zero-overhead, and completely free of build tooling failures.
- **Single Source of Truth in AppState**: Using a clean reactive event bus (`AppState.subscribe` and `AppState.notify`) ensured that ticking a step checkbox instantly updated sidebar counters, global progress bar, checkpoint readiness, and Section 15 export text synchronously.
- **Specification-Driven Milestones**: Structuring requirements across 4 distinct phases (Foundation $\to$ Guide Modules $\to$ Checkpoints $\to$ Exporter) allowed clean compartmentalized execution with zero regression between phases.
- **Browser-Based Automated Testing**: Running 46 automated assertions via headless Edge directly against DOM elements ensured all user flows (checkbox toggling, validation logic, redaction, and report generation) were validated before milestone closure.

### What Was Inefficient
- **Initial Plan Fragmentation**: Splitting Phase 1 and 2 into separate static layout and styling steps could have been batched slightly tighter.
- **Testing Setup**: Testing required headless browser execution rather than lightweight Node test runners due to the browser DOM dependencies, though headless Edge proved reliable.

### Patterns Established
- **Glassmorphic Modern UI**: Curated slate/indigo color tokens with dark mode defaults, backdrop blur filters, and clear visual card hierarchy.
- **Secret Redaction Safety**: Pre-submission regex masking for sensitive credentials (Telegram bot tokens, Google Cloud API keys) to protect participants in public chat rooms.
- **Dual Export Paths**: Providing both copy-to-clipboard (WhatsApp/Telegram formatted) and `@media print` CSS for physical or PDF archiving.

### Key Lessons
- Clear error guidance (Troubleshooting Hub) paired with automated log redaction eliminates the single largest support hurdle in pre-workshop onboarding.
- Visual checkpoint feedback (`SIAP MENGIKUTI WORKSHOP` vs `PERLU TECHNICAL CLINIC`) gives participants immediate confidence before entering the live training room.

---

## Milestone: v3.0 — TanStack Start Full-Document SSR & File-Based Router Migration

**Shipped:** 2026-09-08
**Phases:** 5 | **Plans:** 15 | **Requirements:** 20/20 (100%)

### What Was Built
Migrated the entire interactive multi-course web platform to a type-safe full-stack application using TanStack Start, React 19, Vinxi, and Nitro node-server. Features file-based routing (`/`, `/course/ai`, `/course/word`, `/diagnostics`), Zod-validated query parameters, strongly-typed server route loaders, progressive Suspense streaming with animated skeleton states, `<ClientOnly>` island encapsulation for interactive state widgets, timing-safe `createServerFn` instructor passkey authentication, quarantined backend boundaries in `app/server/`, and a production-hardened multi-stage Docker container on Port 3173.

### What Worked
- **CommonJS Boundary Isolation**: Subdirectory `package.json` files with `{"type": "commonjs"}` in `tests/` and `assets/` allowed modern ESM/TypeScript TanStack Start to coexist with legacy CommonJS tests with zero regression.
- **Progressive Streaming with Route Loaders**: Preloading curriculum structures on the server and streaming HTML chunks via React Suspense eliminated layout shifts and optimized TTFB.
- **AST Server Boundary Audits**: Static analysis tests verifying AST imports and client build outputs ensured server secrets and `node:crypto` modules never leak into browser bundles.
- **Multi-Tier Testing Harness**: Splitting tests into `test:smoke`, `test:node`, and `test:docker` provided instant feedback during development while securing production container verification.

### What Was Inefficient
- **Ecosystem Version Alignments**: Vite 7 peer dependency incompatibilities with early TanStack Start / Vinxi releases required explicitly pinned dependencies.
- **Node 25 Global Mock Collisions**: Node 25's experimental built-in `localStorage` required defensive mocking in unit test setups.

### Patterns Established
- **Client Islands for Browser State**: Wrapping components accessing `localStorage` in `<ClientOnly fallback={<Skeleton />}>` completely eliminates React 19 hydration mismatch errors.
- **Typed Server Functions (`createServerFn`)**: Direct server function invocation via typed POST RPC with timing-safe SHA-256 hash comparison for secure instructor authentication.
- **Hardened Multi-Stage Containerization**: Multi-stage Docker builds running standalone Nitro output with Alpine `tini` as PID 1, non-root user `node`, and native healthchecks.

### Key Lessons
- Migrating an existing rich interactive client application to SSR is cleanest when stateful widgets are encapsulated into islands first, keeping document shells and routes declarative and server-rendered.

## Milestone: v3.1 — Pre-Training Parity in TanStack Start

**Shipped:** 2026-09-09
**Phases:** 5 | **Plans:** 10 | **Requirements:** 24/24 (100%)

### What Was Built
Achieved 100% complete feature and visual parity for Course 1 Pre-Training on TanStack Start (`/course/ai?mode=pretraining`). Modularized React 19 architecture featuring Foundation sections (Target & Alur, Glosarium with 8+ AI terms, Aturan Keamanan, Alat & Persiapan, Panduan PowerShell), accordion-controlled Modules 1–5 with a zero-whitespace 1-click clipboard copy engine and visual toast alerts, a 13-step checklist engine with 3 automated Pass/Fail checkpoint validation gates, dynamic readiness status scoring (SIAP WORKSHOP vs PERLU KLINIK PERSIAPAN), a 15-issue troubleshooting hub with instant live search and category filtering, a client-side Secret Token Redaction Assistant to scrub credentials, Form Laporan Kesiapan Peserta with 1-click WhatsApp/Telegram export, `@media print` official document styling, and a synchronized curriculum sidebar with scrollspy and dynamic badges.

### What Worked
- **Data & Presentation Decoupling**: Separating data definitions (`pretrainingFoundation.ts`, `pretrainingModules.ts`, `pretrainingTroubleshooting.ts`) from React 19 presentation components ensured clean code boundaries, effortless testability, and zero hydration mismatches.
- **Strict Backward-Compatible State Schema**: Preserving the existing `learnwith_ai_checklist` localStorage schema guaranteed that user progress from earlier versions was retained without data corruption.
- **ReDoS-Safe Linear Token Redaction**: Designing ReDoS-safe linear regex patterns with explicit `lastIndex = 0` resets provided bulletproof protection for Telegram bot tokens, OpenAI/Gemini API keys, and sensitive paths.
- **Wave-Based Execution with Continuous Verification**: Running 19 automated test suites after every plan caught regressions instantly and kept the entire test harness at 100% green throughout development.

### What Was Inefficient
- **YAML Frontmatter Omission in Phase 28 Verification**: A missing YAML frontmatter header in `28-VERIFICATION.md` prevented CLI parsing until manually reconciled with standard frontmatter format.

### Patterns Established
- **Modular Island Architecture**: Encapsulating reactive pre-training features into modular React 19 components mounted within a single container (`#container-pretraining`) under `/course/ai.tsx`.
- **Dual-Method Clipboard Copying**: Using modern `navigator.clipboard.writeText` with transparent fallback to hidden textarea selection ensures copy buttons work across all browser security policies and iframe contexts.
- **Multi-Channel Exporter Engine**: Structuring the report generator to cleanly produce plain text, WhatsApp formatted, and Telegram Markdown text from a single participant state snapshot.

### Key Lessons
- Rebuilding complex legacy SPA features in a modern SSR framework like TanStack Start is fastest and safest when guided by a 3-source verification matrix (Requirements, Phase Verification, and Automated Integration Tests).

---

## Cross-Milestone Trends

| Milestone | Phases | Plans | Tests | Pass Rate | Shipped Date |
|-----------|--------|-------|-------|-----------|--------------|
| v1.0 | 4 | 11 | 46 | 100% | 2026-09-03 |
| v1.1 | 4 | 8 | 153 | 100% | 2026-09-07 |
| v2.0 | 4 | 8 | 304 | 100% | 2026-09-07 |
| v2.1 | 3 | 3 | 38 | 100% | 2026-09-07 |
| v2.2 | 3 | 3 | 24 | 100% | 2026-09-07 |
| v3.0 | 5 | 15 | 36 | 100% | 2026-09-08 |
| v3.1 | 5 | 10 | 100 | 100% | 2026-09-09 |

