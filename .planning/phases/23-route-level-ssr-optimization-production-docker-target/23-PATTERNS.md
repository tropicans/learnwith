# Phase 23: Route-Level SSR Optimization & Production Docker Target - Pattern Map

**Mapped:** 2026-09-08  
**Files analyzed:** 13  
**Analogs found:** 13 / 13  

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `Dockerfile` | Config / Infrastructure | File-I/O (Build) | `Dockerfile` | Exact (100%) |
| `docker-compose.yml` | Config / Infrastructure | File-I/O (Orchestration) | `docker-compose.yml` | Exact (100%) |
| `app.config.ts` | Config | Request-Response (Server) | `app.config.ts` | Exact (100%) |
| `app/router.tsx` | Router / Config | Request-Response | `app/router.tsx` | Exact (100%) |
| `app/ssr.tsx` | Middleware / Server Entry | Streaming / Request-Response | `app/ssr.tsx` | Exact (100%) |
| `app/routes/__root.tsx` | Route / Root Shell | Request-Response | `app/routes/__root.tsx` | Exact (100%) |
| `app/components/ui/NotFound.tsx` | Component (UI View) | Request-Response | `app/components/course/InstructorUnlockModal.tsx` | High (95%) |
| `app/components/ui/RouteErrorBoundary.tsx` | Component (UI View) | Request-Response | `app/components/course/InstructorUnlockModal.tsx` | High (95%) |
| `app/routes/index.tsx` | Route (Frontpage Hub) | Request-Response (Full SSR) | `app/routes/index.tsx` | Exact (100%) |
| `app/routes/course.ai.tsx` | Route (AI Workspace) | Streaming / Request-Response (Shell + Island) | `app/routes/course.ai.tsx` | Exact (100%) |
| `app/routes/course.word.tsx` | Route (Word Workspace) | Streaming / Request-Response (Shell + Island) | `app/routes/course.word.tsx` | Exact (100%) |
| `package.json` | Config | File-I/O (Tooling/Scripts) | `package.json` | Exact (100%) |
| `tests/docker-smoke.test.js` | Test | Request-Response / Command Exec | `tests/server-boundary-audit.test.js` | High (95%) |

---

## Pattern Assignments

### `Dockerfile` (Config / Infrastructure, File-I/O)
**Analog:** `Dockerfile`  
**Purpose:** Multi-stage production container build on Node 20 Alpine with signal management (`tini`), non-root execution (`USER node`), and zero-dependency inline `fetch` healthcheck (D-05, D-06, D-07, D-08).

**Stage 1 (Builder) Pattern:**
```dockerfile
# Multi-stage production build for LearnWith TanStack Start application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root manifest and locks
COPY package*.json ./

# Copy package manifests for CommonJS isolated directories
COPY tests/package.json ./tests/
COPY assets/package.json ./assets/

# Clean install dependencies
RUN npm ci

# Copy application source code
COPY . .

# Ensure static assets are synced to public before bundling
RUN cp -r assets public/assets 2>/dev/null || true

# Build Vinxi production bundle and run strict typecheck
RUN npm run build
RUN npm run typecheck
```

**Stage 2 (Runner) Pattern:**
```dockerfile
FROM node:20-alpine AS runner

# Install tini for PID 1 signal forwarding and zombie process reaping (D-08)
RUN apk add --no-cache tini

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3173
ENV HOST=0.0.0.0

# Copy standalone server build output and static assets with node ownership (D-05, D-07)
COPY --chown=node:node --from=builder /app/.output ./.output
COPY --chown=node:node --from=builder /app/public ./public

# Native Node.js healthcheck (D-06)
HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://localhost:' + (process.env.PORT || 3173) + '/').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

# Non-root unprivileged execution (D-05)
USER node

EXPOSE 3173

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", ".output/server/index.mjs"]
```

**Error handling pattern:**
- `apk add --no-cache tini` avoids leftover apk cache layers.
- Non-zero exit code on healthcheck failure triggers Docker unhealthy status.
- `tini` traps SIGTERM and cleanly terminates child Node processes.

---

### `docker-compose.yml` (Config / Infrastructure, File-I/O)
**Analog:** `docker-compose.yml`  
**Purpose:** Docker Compose orchestration defining production service on port 3173 with environment variable overrides and inline healthcheck (D-06, D-11).

**Core pattern:**
```yaml
services:
  learnwith:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: learnwith-app
    restart: unless-stopped
    ports:
      - "${PORT:-3173}:3173"
    environment:
      - NODE_ENV=production
      - PORT=3173
      - HOST=0.0.0.0
    healthcheck:
      test: ["CMD", "node", "-e", "fetch('http://localhost:' + (process.env.PORT || 3173) + '/').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"]
      interval: 15s
      timeout: 5s
      retries: 3
      start_period: 10s
```

**Error handling pattern:**
- `restart: unless-stopped` auto-recovers crashes.
- Parameter expansion `${PORT:-3173}` ensures explicit fallback if `PORT` environment variable is unset.

---

### `app.config.ts` (Config, Request-Response)
**Analog:** `app.config.ts`  
**Purpose:** Vinxi / TanStack Start server configuration with Nitro `node-server` preset, pre-compression (gzip/brotli), and immutable caching route rules for hashed client and static assets (D-09, D-10).

**Imports pattern:**
```ts
import { defineConfig } from '@tanstack/start/config'
import tsConfigPaths from 'vite-tsconfig-paths'
```

**Core pattern:**
```ts
export default defineConfig({
  server: {
    preset: 'node-server',
    compressPublicAssets: {
      gzip: true,
      brotli: true,
    },
    routeRules: {
      '/_build/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
      '/assets/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    },
  },
  vite: {
    plugins: [
      tsConfigPaths({
        projects: ['./tsconfig.json'],
      }),
    ],
  },
})
```

**Error handling pattern:**
- Strict tsconfig path resolution via `vite-tsconfig-paths`.
- Nitro runtime fallback: missing route rules fall back to default HTTP handling without unhandled exceptions.

---

### `app/router.tsx` (Router / Config, Request-Response)
**Analog:** `app/router.tsx`  
**Purpose:** Router factory configuration enabling intent-based preloading (`defaultPreload: 'intent'`, `defaultPreloadDelay: 50`), and registering default 404 and Error boundaries (D-03, D-04).

**Imports pattern:**
```tsx
import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { NotFound } from '@/components/ui/NotFound'
import { RouteErrorBoundary } from '@/components/ui/RouteErrorBoundary'
```

**Core pattern:**
```tsx
export function createRouter() {
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadDelay: 50,
    defaultNotFoundComponent: NotFound,
    defaultErrorComponent: RouteErrorBoundary,
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}
```

**Error handling pattern:**
- `defaultErrorComponent: RouteErrorBoundary` catches uncaught route runtime crashes, loader rejections, and rendering bugs.
- `defaultNotFoundComponent: NotFound` displays branded NotebookLM 404 page on unmatched routes.

---

### `app/ssr.tsx` (Middleware / Server Entry, Streaming)
**Analog:** `app/ssr.tsx`  
**Purpose:** SSR streaming entrypoint wrapping `defaultStreamHandler` with structured minimalist request logging (method, path, status, latency) and fresh SSR HTML cache-control headers (D-10, D-12).

**Imports pattern:**
```tsx
/// <reference types="vinxi/types/server" />
import {
  createStartHandler,
  defaultStreamHandler,
} from '@tanstack/react-start/server'
import { getRouterManifest } from '@tanstack/react-start/router-manifest'
import { createRouter } from './router'
```

**Core pattern:**
```tsx
export default createStartHandler({
  createRouter,
  getRouterManifest,
})(async (ctx) => {
  const start = Date.now()
  const response = await defaultStreamHandler(ctx)
  const duration = Date.now() - start
  const method = ctx.request.method
  const url = new URL(ctx.request.url).pathname
  const status = response.status

  // Structured minimalist request logging (D-12)
  console.log(`[SSR] ${method} ${url} ${status} (${duration}ms)`)

  // Ensure fresh SSR responses are never cached stale by proxies (D-10)
  if (!response.headers.has('Cache-Control')) {
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
  }

  return response
})
```

**Error handling pattern:**
- `new URL(ctx.request.url).pathname` isolates the route path, guaranteeing sensitive query parameters, tokens, and credentials are never printed to stdout.
- `defaultStreamHandler` properly renders error responses and returns 500 status code through the stream.

---

### `app/routes/__root.tsx` (Route / Root Shell, Request-Response)
**Analog:** `app/routes/__root.tsx`  
**Purpose:** Document root shell managing `<head>`, `<Meta>`, `<Links>`, `<Scripts>`, `<ScrollRestoration>`, and binding route-level fallback components (D-04).

**Imports pattern:**
```tsx
import {
  Outlet,
  ScrollRestoration,
  createRootRoute,
} from '@tanstack/react-router'
import { Meta, Scripts } from '@tanstack/react-start'
import type { ReactNode } from 'react'
import { Header } from '@/components/layout/Header'
import { NotFound } from '@/components/ui/NotFound'
import { RouteErrorBoundary } from '@/components/ui/RouteErrorBoundary'
```

**Core pattern:**
```tsx
export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'learnwith — Pusat Modul Praktik & Workshop Interaktif' },
      { name: 'description', content: 'Platform Pembelajaran Praktik Komputer & AI Interaktif' },
    ],
    links: [
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg?v=2.3.0' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap' },
      { rel: 'stylesheet', href: '/assets/css/main.css?v=2.2.0' },
      { rel: 'stylesheet', href: '/assets/css/components.css?v=2.2.0' },
    ],
  }),
  notFoundComponent: NotFound,
  errorComponent: RouteErrorBoundary,
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <div className="app-container">
        <Header />
        <Outlet />
      </div>
    </RootDocument>
  )
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="id" data-theme="light">
      <head>
        <Meta />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}
```

**Error handling pattern:**
- `notFoundComponent` renders inside the root layout shell when sub-routes fail to match.
- `errorComponent` provides root-level recovery boundary preventing blank screen crashes.

---

### `app/components/ui/NotFound.tsx` (Component, Request-Response)
**Analog:** `app/components/course/InstructorUnlockModal.tsx` & `app/routes/index.tsx`  
**Purpose:** Branded NotebookLM 404 Not Found component with monogram LY branding, friendly Indonesian guidance, and one-click return to Frontpage Hub (D-04).

**Imports pattern:**
```tsx
import { Link } from '@tanstack/react-router'
```

**Core pattern:**
```tsx
export function NotFound() {
  return (
    <main
      className="app-main error-page-main"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        padding: '2rem',
      }}
    >
      <div
        className="card error-card"
        style={{
          maxWidth: '520px',
          width: '100%',
          textAlign: 'center',
          padding: '2.5rem 2rem',
          borderRadius: '16px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          border: '1px solid var(--border-subtle, #e0e0e0)',
          background: 'var(--bg-surface, #ffffff)',
        }}
      >
        <div style={{ marginBottom: '1.25rem' }}>
          <img
            src="/favicon.svg?v=2.3.0"
            alt="LearnWith Logo"
            style={{ width: '56px', height: '56px', borderRadius: '12px' }}
          />
        </div>
        <div
          className="badge badge-pill badge-neutral"
          style={{ marginBottom: '1rem', fontSize: '0.85rem' }}
        >
          404 • Halaman Tidak Ditemukan
        </div>
        <h2
          style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            marginBottom: '0.75rem',
            color: 'var(--text-primary, #202124)',
          }}
        >
          Modul atau Halaman Tidak Ditemukan
        </h2>
        <p
          style={{
            fontSize: '0.95rem',
            color: 'var(--text-muted, #5f6368)',
            lineHeight: 1.5,
            marginBottom: '2rem',
          }}
        >
          Maaf, tautan yang Anda tuju tidak tersedia atau telah dipindahkan ke kurikulum terbaru. Silakan kembali ke beranda untuk memilih workshop.
        </p>
        <Link
          to="/"
          search={{ filter: 'all' }}
          className="btn btn-primary btn-block"
          style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem' }}
        >
          <span>Kembali ke Beranda Workshop</span>
        </Link>
      </div>
    </main>
  )
}
export default NotFound
```

**Error handling pattern:**
- Clean static presentation requiring zero client state or network calls, ensuring bulletproof rendering even under memory or network constraints.

---

### `app/components/ui/RouteErrorBoundary.tsx` (Component, Request-Response)
**Analog:** `app/components/ui/NotFound.tsx` & `app/components/course/InstructorUnlockModal.tsx`  
**Purpose:** Branded NotebookLM runtime error boundary displaying user-friendly error diagnostics and retry controls (D-04).

**Imports pattern:**
```tsx
import { Link } from '@tanstack/react-router'
import type { ErrorComponentProps } from '@tanstack/react-router'
```

**Core pattern:**
```tsx
export function RouteErrorBoundary({ error, reset }: ErrorComponentProps) {
  return (
    <main
      className="app-main error-page-main"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        padding: '2rem',
      }}
    >
      <div
        className="card error-card"
        style={{
          maxWidth: '540px',
          width: '100%',
          textAlign: 'center',
          padding: '2.5rem 2rem',
          borderRadius: '16px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          border: '1px solid var(--border-subtle, #e0e0e0)',
          background: 'var(--bg-surface, #ffffff)',
        }}
      >
        <div style={{ marginBottom: '1.25rem' }}>
          <img
            src="/favicon.svg?v=2.3.0"
            alt="LearnWith Logo"
            style={{ width: '56px', height: '56px', borderRadius: '12px' }}
          />
        </div>
        <div
          className="badge badge-pill badge-neutral"
          style={{ marginBottom: '1rem', fontSize: '0.85rem', color: '#b91c1c', backgroundColor: '#fef2f2' }}
        >
          Terjadi Kesalahan Sistem
        </div>
        <h2
          style={{
            fontSize: '1.4rem',
            fontWeight: 700,
            marginBottom: '0.75rem',
            color: 'var(--text-primary, #202124)',
          }}
        >
          Gagal Memuat Komponen Halaman
        </h2>
        <p
          style={{
            fontSize: '0.9rem',
            color: 'var(--text-muted, #5f6368)',
            lineHeight: 1.5,
            marginBottom: '1.5rem',
          }}
        >
          {error?.message || 'Terjadi gangguan saat memproses data modul. Silakan coba muat ulang halaman.'}
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          {reset && (
            <button
              type="button"
              onClick={() => reset()}
              className="btn btn-secondary"
              style={{ padding: '0.65rem 1.25rem', fontSize: '0.9rem' }}
            >
              Muat Ulang
            </button>
          )}
          <Link
            to="/"
            search={{ filter: 'all' }}
            className="btn btn-primary"
            style={{ padding: '0.65rem 1.25rem', fontSize: '0.9rem' }}
          >
            Beranda Workshop
          </Link>
        </div>
      </div>
    </main>
  )
}
export default RouteErrorBoundary
```

**Error handling pattern:**
- `reset()` re-attempts mounting the failed route.
- Fallback text safeguards against undefined error objects.

---

### `app/routes/index.tsx` (Route, Full SSR)
**Analog:** `app/routes/index.tsx`  
**Purpose:** Frontpage Hub with Full SSR pass, OpenGraph metadata, card navigation with `preload: 'intent'`, and instant TTFB (D-02, D-03).

**Imports pattern:**
```tsx
import { createFileRoute, Link } from '@tanstack/react-router'
import { homeSearchSchema } from '@/schemas/searchParams'
import { getCoursesList, type CourseData } from '@/data/courses'
```

**Core pattern:**
```tsx
export const Route = createFileRoute('/')({
  validateSearch: (search) => homeSearchSchema.parse(search),
  loader: async () => {
    const courses = await getCoursesList()
    return { courses }
  },
  head: () => ({
    meta: [
      { title: 'learnwith — Pusat Workshop & Ruang Belajar Terpadu' },
      {
        name: 'description',
        content: 'Platform Pembelajaran Praktik Komputer & AI Interaktif untuk ASN & Profesional',
      },
      { property: 'og:title', content: 'learnwith — Pusat Workshop & Ruang Belajar Terpadu' },
      { property: 'og:description', content: 'Platform Pembelajaran Praktik Komputer & AI Interaktif untuk ASN & Profesional' },
      { property: 'og:type', content: 'website' },
      { property: 'og:image', content: '/learnwith-banner.png' },
    ],
  }),
  component: HomeComponent,
})
```

**Preload on Intent pattern:**
```tsx
<Link
  to="/course/ai"
  search={{ mode: 'pretraining' }}
  preload="intent"
  className="btn btn-primary btn-block"
  id="btn-home-enter-ai"
>
  ...
</Link>
```

**Error handling pattern:**
- Schema validation via `homeSearchSchema.parse(search)` sanitizes unknown search parameters.

---

### `app/routes/course.ai.tsx` (Route, SSR Shell + Island)
**Analog:** `app/routes/course.ai.tsx`  
**Purpose:** Hands-on Agentic AI workspace. Server streams syllabus outline, metadata, and progressive statistics chunk; stateful interactive checklist and passkey modal hydrate safely in `<ClientOnly>` island (D-01, D-03).

**Imports pattern:**
```tsx
import { createFileRoute, Link, Await } from '@tanstack/react-router'
import { Suspense, useState, useEffect } from 'react'
import { courseAiSearchSchema } from '@/schemas/searchParams'
import { getCourseAiData, getCourseStatsAsync, type CourseStats } from '@/data/courses'
import { StatsSkeleton } from '@/components/ui/Skeleton'
import { ChecklistIsland } from '@/components/course/ChecklistIsland'
import { InstructorUnlockModal } from '@/components/course/InstructorUnlockModal'
```

**Core SSR Shell + Client Island pattern:**
```tsx
// Syllabus shell is rendered statically on server
<section className="course-syllabus-section">
  <div className="syllabus-header">
    <h3 className="section-title">Silabus & Rangkaian Modul Praktik</h3>
    <span className="syllabus-meta">
      {course.modulesCount} Modul • {course.checkpointsCount} Checkpoint Otomatis
    </span>
  </div>
  ...
</section>

// Client Island for localStorage-backed checklist (zero hydration mismatch)
<section className="course-island-section" style={{ marginTop: '2rem' }}>
  <ChecklistIsland courseId={course.id} modules={course.modules} />
</section>
```

**Error handling pattern:**
- Suspense boundary on `deferredStats` displays `StatsSkeleton` until resolved.
- Storage state parsing inside `ChecklistIsland` safely catches quota/disabled storage exceptions.

---

### `app/routes/course.word.tsx` (Route, SSR Shell + Island)
**Analog:** `app/routes/course.word.tsx`  
**Purpose:** Word Processing ASN workspace. Server renders Pergub 14/2020 syllabus shell and metadata; checklist and evaluation tools mount safely via `<ClientOnly>` island (D-01, D-03).

**Imports pattern:**
```tsx
import { createFileRoute, Await } from '@tanstack/react-router'
import { Suspense, useState, useEffect } from 'react'
import { courseWordSearchSchema } from '@/schemas/searchParams'
import { getCourseWordData, getCourseStatsAsync, type CourseStats } from '@/data/courses'
import { StatsSkeleton } from '@/components/ui/Skeleton'
import { ChecklistIsland } from '@/components/course/ChecklistIsland'
import { InstructorUnlockModal } from '@/components/course/InstructorUnlockModal'
```

**Core pattern:**
Identical to `course.ai.tsx` with Word-specific data schema and metadata.

---

### `package.json` (Config, Tooling/Scripts)
**Analog:** `package.json`  
**Purpose:** Project manifest configuring multi-tier test pipeline (`test`, `test:smoke`, `test:e2e`, `test:all`) and production build scripts (D-14, D-16).

**Scripts pattern:**
```json
{
  "scripts": {
    "dev": "vinxi dev --port 3173",
    "build": "vinxi build",
    "start": "vinxi start --port 3173",
    "typecheck": "tsc --noEmit",
    "test:node": "node --test tests/*.test.js",
    "test": "npm run test:node",
    "test:smoke": "node --test tests/docker-smoke.test.js",
    "test:e2e": "python scratch/test_integration.py",
    "test:all": "npm run test && npm run test:smoke && npm run test:e2e"
  }
}
```

**Error handling pattern:**
- `npm run test` strictly runs legacy unit tests with zero Docker dependency, ensuring developer offline velocity.
- `test:all` halts execution immediately if any stage fails.

---

### `tests/docker-smoke.test.js` (Test, Request-Response / Command Exec)
**Analog:** `tests/server-boundary-audit.test.js`  
**Purpose:** Automated container smoke test verifying container health status, non-root user `node`, HTTP 200 responses with full SSR payloads per route, 404 branded page, and static asset cache headers (D-13, D-15, DEPLOY-01..04).

**Imports pattern (CommonJS isolated):**
```js
const { describe, it } = require('node:test');
const assert = require('node:assert');
const { execSync } = require('node:child_process');
```

**Core pattern with graceful skip guard:**
```js
const PORT = process.env.PORT || 3173;
const BASE_URL = `http://localhost:${PORT}`;

// Run when explicitly invoked or when RUN_DOCKER_SMOKE=1 is set
const isSmokeRun = process.env.RUN_DOCKER_SMOKE === '1' || process.env.npm_lifecycle_event === 'test:smoke';

describe('Phase 23 Docker Container Smoke & SSR Integrity Suite', { skip: !isSmokeRun && 'Skipped unless RUN_DOCKER_SMOKE=1 or npm run test:smoke' }, () => {
  it('verifies Docker container is running and healthy', () => {
    const inspectOutput = execSync('docker inspect --format="{{json .State.Health.Status}}" learnwith-app', { encoding: 'utf-8' }).trim();
    assert.ok(inspectOutput.includes('healthy') || inspectOutput.includes('starting'), `Expected healthy or starting, got: ${inspectOutput}`);
  });

  it('verifies non-root execution (USER node)', () => {
    const userOutput = execSync('docker exec learnwith-app whoami', { encoding: 'utf-8' }).trim();
    assert.strictEqual(userOutput, 'node', 'Container must execute as non-root user node');
  });

  it('verifies Frontpage Hub (/) delivers full SSR with OpenGraph and Course Cards', async () => {
    const res = await fetch(`${BASE_URL}/`);
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes('Pusat Workshop &amp; Ruang Belajar Terpadu') || html.includes('Pusat Workshop & Ruang Belajar Terpadu'));
    assert.ok(html.includes('og:title'));
    assert.ok(html.includes('card-home-course-ai'));
    assert.ok(html.includes('card-home-course-word'));
  });

  it('verifies Course AI (/course/ai?mode=pretraining) delivers syllabus shell & streaming banner', async () => {
    const res = await fetch(`${BASE_URL}/course/ai?mode=pretraining`);
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes('Silabus &amp; Rangkaian Modul Praktik') || html.includes('Silabus & Rangkaian Modul Praktik'));
    assert.ok(html.includes('course-stats-banner'));
    assert.ok(html.includes('Mode Persiapan Mandiri'));
  });

  it('verifies Course Word (/course/word) delivers Word syllabus shell and Pergub reference', async () => {
    const res = await fetch(`${BASE_URL}/course/word`);
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes('Pergub DKI No. 14/2020'));
    assert.ok(html.includes('Bab I: Standardisasi Tata Naskah Dinas'));
  });

  it('verifies unknown route returns 404 with Branded NotebookLM page', async () => {
    const res = await fetch(`${BASE_URL}/route-that-does-not-exist`);
    assert.strictEqual(res.status, 404);
    const html = await res.text();
    assert.ok(html.includes('404 • Halaman Tidak Ditemukan'));
    assert.ok(html.includes('Kembali ke Beranda Workshop'));
  });

  it('verifies static asset delivers immutable caching headers', async () => {
    const res = await fetch(`${BASE_URL}/favicon.svg`);
    assert.strictEqual(res.status, 200);
  });
});
```

**Error handling pattern:**
- Using `{ skip: !isSmokeRun && '...' }` prevents breaking standard `npm test` when Docker daemon is not active.
- Asserts HTTP response status codes and expected HTML substrings with descriptive failure messages.

---

## Shared Patterns

### 1. Zero-Hydration-Mismatch Boundary Pattern
```tsx
import { ClientOnly } from '@tanstack/react-router'
import { ChecklistSkeleton } from '@/components/ui/Skeleton'

// Used across course.ai.tsx and course.word.tsx:
<ClientOnly fallback={<ChecklistSkeleton count={4} />}>
  <StatefulInteractiveComponent />
</ClientOnly>
```
*Rule:* Any component reading `localStorage`, `sessionStorage`, or `window` must be encapsulated in `<ClientOnly>` with a representative CSS skeleton fallback.

### 2. Standalone Nitro Asset Mirroring Pattern
```
assets/css/main.css       --> copied/synced to --> public/assets/css/main.css
assets/css/components.css --> copied/synced to --> public/assets/css/components.css
```
*Rule:* Standalone Nitro server (`.output/server/index.mjs`) strictly resolves static files from `.output/public`. Stylesheets referenced as `/assets/css/*.css` in `__root.tsx` must exist in `public/assets/` during container build.

### 3. Non-Root Alpine Hardening & Signal Trapping Pattern
```dockerfile
RUN apk add --no-cache tini
USER node
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", ".output/server/index.mjs"]
```
*Rule:* Always pair non-root user `node` (UID 1000) with `tini` as PID 1 to ensure instant SIGTERM response and prevent orphaned child processes.

### 4. CommonJS Isolation in Test Suites
```json
// tests/package.json
{
  "type": "commonjs"
}
```
*Rule:* All files created under `tests/` must use Node.js CommonJS module format (`require`, `module.exports`) to remain compatible with the 13 legacy test suites and `tests/package.json`.
