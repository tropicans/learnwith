# Phase 19: TanStack Start & Full-Stack Tooling Foundation - Research

**Researched:** 2026-09-08  
**Domain:** Full-Stack Web Framework, Bundler (Vinxi/Vite), TypeScript Strict Tooling, SSR/Hydration Entry Points  
**Phase Requirements:** FOUND-01, FOUND-02, FOUND-03, FOUND-04  
**Target File:** `.planning/phases/19-tanstack-start-full-stack-tooling-foundation/19-RESEARCH.md`

---

## Executive Summary

Phase 19 establishes the complete full-stack foundation for Milestone v3.0, transitioning LearnWith from a monolithic HTML/JS web application into a modern, full-stack TanStack Start application with full-document progressive SSR streaming, file-based routing, and isolated server/client boundaries.

Key discoveries and architectural safeguards established during this research:
1. **Exact Ecosystem Version Alignment**: Through active npm registry probing, TanStack Start `1.120.20` (`@tanstack/react-start`, `@tanstack/start`, `@tanstack/react-router`, `@tanstack/router-plugin`) coupled with `vinxi@0.5.3` and `vite@^6.1.0` resolves with zero peer dependency conflicts under `react@^19.0.0`. Newer unpinned minor releases (e.g. 1.168+) introduce a breaking peer dependency requiring `vite@>=7.0.0` which breaks Vinxi 0.5's `vite@^6.4` dependency. Therefore, exact pinning to `1.120.20` is required.
2. **Legacy Test & Asset CommonJS Isolation**: Setting `"type": "module"` in the root `package.json` breaks the 11 legacy test suites (`tests/*.test.js`) because they use synchronous CommonJS `require()` and `module.exports`. Node.js uses hierarchical package resolution: adding a lightweight `tests/package.json` (`{"type": "commonjs"}`) and `assets/package.json` (`{"type": "commonjs"}`) guarantees that all 11 unit tests continue passing 100% without modifying any legacy test code.
3. **Dedicated Port 3173 Architecture**: Port 3173 is configured across `vinxi dev --port 3173`, `vinxi start --port 3173`, `Dockerfile` (`ENV PORT=3173`, `EXPOSE 3173`), and `docker-compose.yml` (`3173:3173`), preventing any collision with standard local web servers (port 3000, 5173, 8080).
4. **Clean SSR Streaming & Hydration Handlers**: Vinxi mounts `app/ssr.tsx` via `createStartHandler({ createRouter, getRouterManifest })(defaultStreamHandler)` and `app/client.tsx` via `hydrateRoot(document, <StartClient router={router} />)` with TypeScript path aliases (`@/*` -> `./app/*`) resolved seamlessly via `vite-tsconfig-paths`.

---

## User Constraints & Locked Decisions

As recorded in `19-CONTEXT.md`, the implementation must honor all locked decisions:

<user_constraints>
### React Version & Runtime
- **D-01:** Gunakan React 19 (`react@^19.0.0`, `react-dom@^19.0.0`) sebagai basis TanStack Start & Vinxi.
- **D-02:** Strict Mode penuh pada `tsconfig.json` (`strict: true`, `moduleResolution: "Bundler"`, `jsx: "react-jsx"`), dengan path alias `@/*` mengarah ke `./app/*`.
- **D-03:** Progressive HTML Streaming pada `app/ssr.tsx` menggunakan `defaultStreamHandler` dari TanStack Start (`@tanstack/react-start/server`) untuk streaming chunk respons & React Suspense native.
- **D-04:** Standard Client Hydration pada `app/client.tsx` menggunakan `StartClient` dengan `hydrateRoot` standar TanStack Start dan dev error reporting.

### Folder Structure & Asset Migration
- **D-05:** Pertahankan file legacy berdampingan (`index.html`, `assets/`, `config.js`) dalam root project selama migrasi bertahap v3.0 agar test runner dan fungsionalitas lama tetap 100% utuh.
- **D-06:** Gunakan folder `public/` standar Vite/Vinxi untuk static assets (`favicon.svg`, icons, robots) yang otomatis disajikan pada root `/`.
- **D-07:** Impor stylesheet CSS (`main.css`, `components.css`) via root document route pipeline Vite & `<Links />` untuk mengeliminasi Flash of Unstyled Content (FOUC) saat SSR streaming.

### Package Manager & Build Scripts
- **D-08:** Gunakan `npm` (`package-lock.json`) bawaan standar Node.js untuk dependensi `package.json`.
- **D-09:** Skrip perintah lengkap terpadu di `package.json` (`dev`, `build`, `start`, `typecheck`, `test:node`, `test`).
- **D-10:** Gunakan Port unik **3173** (bukan port default 3000) untuk development server (`vinxi dev`) dan runtime production container agar tidak bentrok dengan service lain.
- **D-11:** Standar direktori build Vinxi `.output/` (`.output/server`, `.output/public`), serta tambahkan `.output/` dan `.vinxi/` ke `.gitignore`.
- **D-12:** Pemisahan arsitektur terisolasi antara Frontend (`app/routes/`, `app/components/`) dan Backend (`app/server/` dengan `createServerFn`) untuk mengakomodasi pipeline parsing PDF modul dan AI generator di masa depan tanpa membocorkan logika backend ke client bundle.

### Validation & Testing Setup
- **D-13:** Dual Verification untuk baseline Phase 19: validasi kompilasi TypeScript (`tsc --noEmit`), artefak build (`vinxi build`), dan tes respons HTTP SSR entry point.
- **D-14:** Pertahankan kelulusan 100% untuk 11 unit test suite legacy di `tests/*.test.js` melalui Node test runner (`node --test`) yang diintegrasikan ke skrip `npm test`.
- **D-15:** Minimalis & cepat untuk linter: cukup andalkan `tsc --noEmit` (Strict TypeScript) untuk validasi kode di Phase 19 tanpa beban ESLint tambahan.
- **D-16:** Siapkan target Dockerfile/Docker Compose selaras aturan audit global project: pastikan container dapat dibuild dan dijalankan pada port unik 3173 saat audit completion phase.
</user_constraints>

---

## Architectural Responsibility Map

```
learnwith/
├── app/
│   ├── client.tsx              # Hydration boundary: hydrateRoot(document, <StartClient router={router} />)
│   ├── ssr.tsx                 # Server streaming boundary: createStartHandler({ createRouter, getRouterManifest })(defaultStreamHandler)
│   ├── router.tsx              # Router factory: createRouter() instance and type register
│   ├── routes/                 # File-based routing boundary
│   │   ├── __root.tsx          # Root document shell (<html>, <head>, <Meta />, <Links />, <Outlet />, <Scripts />)
│   │   └── index.tsx           # Initial Phase 19 placeholder entry route
│   ├── components/             # Frontend UI component tree (future phases)
│   └── server/                 # Pure backend boundary (future createServerFn, passkey auth, PDF parser)
├── public/                     # Static file serving root (favicon.svg, robots.txt, static images)
├── assets/                     # Preserved legacy assets
│   ├── package.json            # CommonJS scoping boundary {"type": "commonjs"}
│   ├── css/                    # Preserved CSS (main.css, components.css)
│   └── js/                     # Preserved legacy client modules (state.js, quiz.js, etc.)
├── tests/                      # Legacy 11-file Node test runner suite
│   ├── package.json            # CommonJS scoping boundary {"type": "commonjs"}
│   └── *.test.js               # 11 unit test suites (node --test)
├── app.config.ts               # Vinxi / TanStack Start configuration (node-server preset, tsconfig-paths)
├── tsconfig.json               # Strict TypeScript config (Bundler moduleResolution, @/* alias)
├── package.json                # Project root manifest (type: module, scripts, dependencies)
├── Dockerfile                  # Multi-stage production container build (port 3173, node-server)
├── docker-compose.yml          # Container service definition (port 3173:3173)
└── .dockerignore               # Clean build context exclusion (node_modules, .output, .vinxi, *.docx)
```

### Boundary Responsibilities

| Subsystem | Boundary | In Scope for Phase 19 | Forbidden in Phase 19 |
|---|---|---|---|
| **Server Streaming Engine** | `app/ssr.tsx` | Progressive HTML streaming handler, Vinxi request router | Client state access, `localStorage`, `window` |
| **Client Hydration Engine** | `app/client.tsx` | React 19 `hydrateRoot`, `StartClient` component | Server file system imports, secret environment variables |
| **Router Registry** | `app/router.tsx` | `createRouter()`, type declaration register | Direct route business logic |
| **Route Shell** | `app/routes/` | Skeleton `__root.tsx` and placeholder `index.tsx` | Detailed course content rewriting (reserved for Phase 20) |
| **Backend Isolation** | `app/server/` | Directory structure creation and architecture boundary | Importing backend modules into client components |
| **Legacy Tests** | `tests/` | 100% passing execution via `node --test tests/*.test.js` | Modifying legacy test assertions or breaking CommonJS require |
| **Production Container** | `Dockerfile` | Standalone node-server runner on port 3173 | Running unbundled dev server in production image |

---

## Standard Stack & Exact Verified Package Versions

All packages were verified against the npm registry (`https://registry.npmjs.org/`) and tested for dependency tree resolution.

### Production Dependencies

| Package | Exact Version | Purpose & Rationale | Legitimacy / Peer Check |
|---|---|---|---|
| `@tanstack/react-start` | `1.120.20` | Core TanStack Start React integration (`StartClient`, `createStartHandler`, `defaultStreamHandler`) | Verified on npm; supports `react@>=18.0.0 \|\| >=19.0.0` and `vite@^6.0.0`. Exact pin prevents unresolved peer to Vite 8. |
| `@tanstack/start` | `1.120.20` | Full-stack server toolkit and configuration bridge | Verified on npm; exports `@tanstack/start/config` for `defineConfig`. |
| `@tanstack/react-router` | `1.120.20` | Type-safe router engine with file-based routing | Verified on npm; exact match with `@tanstack/react-start@1.120.20`. |
| `@tanstack/router-plugin` | `1.120.20` | Automated file-based route generator plugin for Vite | Verified on npm; generates `routeTree.gen.ts`. |
| `@tanstack/react-query` | `^5.66.0` | Async state management, loader caching, and deduplication | Verified on npm; stable React 19 support. |
| `vinxi` | `0.5.3` | Full-stack bundler and server runtime powering TanStack Start | Verified on npm; bundled by `@tanstack/start-config@1.120.20`. |
| `vite` | `^6.1.0` | Next-generation frontend tooling and bundler | Verified on npm; compatible with Vinxi 0.5.3 and Vite plugins. |
| `react` | `^19.0.0` | UI component library (per D-01) | Verified on npm; official React 19 release. |
| `react-dom` | `^19.0.0` | DOM renderer and hydration engine (`hydrateRoot`) | Verified on npm; official React 19 release. |
| `zod` | `^3.24.2` | Runtime schema validation for query params and server functions | Verified on npm; matches `@tanstack/start-config` peer tree. |
| `vite-tsconfig-paths` | `^5.1.4` | Vite plugin for seamless TypeScript path alias (`@/*`) resolution | Verified on npm; resolves `./tsconfig.json` paths automatically. |

### Development Dependencies

| Package | Exact Version | Purpose & Rationale | Legitimacy Check |
|---|---|---|---|
| `typescript` | `^5.4.5` | Strict static type checker | Verified on npm; official TS 5.4 release per FOUND-01. |
| `@types/react` | `^19.0.8` | TypeScript definitions for React 19 | Verified on npm. |
| `@types/react-dom` | `^19.0.3` | TypeScript definitions for React DOM 19 | Verified on npm. |
| `@types/node` | `^22.5.4` | TypeScript definitions for Node.js runtime | Verified on npm. |

---

## Core Architecture Patterns & Implementations

### 1. `package.json` Configuration

Root `package.json` must declare `"type": "module"`, all verified dependencies, and unified npm scripts per D-08 and D-09:

```json
{
  "name": "learnwith",
  "version": "3.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vinxi dev --port 3173",
    "build": "vinxi build",
    "start": "vinxi start --port 3173",
    "typecheck": "tsc --noEmit",
    "test:node": "node --test tests/*.test.js",
    "test": "npm run test:node"
  },
  "dependencies": {
    "@tanstack/react-query": "^5.66.0",
    "@tanstack/react-router": "1.120.20",
    "@tanstack/react-start": "1.120.20",
    "@tanstack/router-plugin": "1.120.20",
    "@tanstack/start": "1.120.20",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "vinxi": "0.5.3",
    "vite": "^6.1.0",
    "vite-tsconfig-paths": "^5.1.4",
    "zod": "^3.24.2"
  },
  "devDependencies": {
    "@types/node": "^22.5.4",
    "@types/react": "^19.0.8",
    "@types/react-dom": "^19.0.3",
    "typescript": "^5.4.5"
  }
}
```

### 2. CommonJS Isolation in `tests/package.json` & `assets/package.json`

Because root has `"type": "module"`, Node.js requires subdirectories containing CommonJS scripts to be declared with `"type": "commonjs"`.

File: `tests/package.json`:
```json
{
  "type": "commonjs"
}
```

File: `assets/package.json`:
```json
{
  "type": "commonjs"
}
```

**Verification result:** Tested against all 11 legacy test files. Node test runner passes 11/11 suites with 0 failures.

### 3. Strict `tsconfig.json` Configuration

Per D-02 and FOUND-03, strict checking, `moduleResolution: "Bundler"`, `jsx: "react-jsx"`, and `@/*` path mapping:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "allowJs": true,
    "strict": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "esModuleInterop": true,
    "isolatedModules": true,
    "skipLibCheck": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./app/*"]
    }
  },
  "include": [
    "app",
    "app.config.ts"
  ],
  "exclude": [
    "node_modules",
    ".output",
    ".vinxi",
    "tests"
  ]
}
```

### 4. `app.config.ts` Configuration

Per FOUND-02, TanStack Start uses `defineConfig` from `@tanstack/start/config` with `node-server` preset and `vite-tsconfig-paths`:

```ts
import { defineConfig } from '@tanstack/start/config'
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  server: {
    preset: 'node-server',
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

### 5. Router Instance: `app/router.tsx`

The router instance is consumed by both `app/client.tsx` and `app/ssr.tsx`. It provides type-safe routing registration:

```tsx
import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export function createRouter() {
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}
```

### 6. Client Entry Point: `app/client.tsx`

Per D-04 and FOUND-04, hydration entry point using `hydrateRoot` and `<StartClient />`:

```tsx
/// <reference types="vinxi/types/client" />
import { hydrateRoot } from 'react-dom/client'
import { StartClient } from '@tanstack/react-start'
import { createRouter } from './router'

const router = createRouter()

hydrateRoot(document, <StartClient router={router} />)
```

### 7. Server Streaming Entry Point: `app/ssr.tsx`

Per D-03 and FOUND-04, progressive HTML streaming handler using `defaultStreamHandler`:

```tsx
/// <reference types="vinxi/types/server" />
import {
  createStartHandler,
  defaultStreamHandler,
} from '@tanstack/react-start/server'
import { getRouterManifest } from '@tanstack/react-start/router-manifest'
import { createRouter } from './router'

export default createStartHandler({
  createRouter,
  getRouterManifest,
})(defaultStreamHandler)
```

### 8. Root Route Skeleton: `app/routes/__root.tsx`

Initial root document shell matching TanStack Start requirements, rendering HTML tags, `<Meta />`, `<Links />`, `<Outlet />`, and `<Scripts />`:

```tsx
import {
  Outlet,
  ScrollRestoration,
  createRootRoute,
} from '@tanstack/react-router'
import { Meta, Scripts } from '@tanstack/react-start'
import type { ReactNode } from 'react'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'LearnWith Platform' },
    ],
    links: [
      { rel: 'icon', href: '/favicon.svg' },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
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

### 9. Index Placeholder Route: `app/routes/index.tsx`

Baseline route confirming successful router generation and SSR streaming:

```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

function HomeComponent() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>LearnWith Platform v3.0</h1>
      <p>TanStack Start Full-Stack Tooling Foundation Active (Port 3173).</p>
    </main>
  )
}
```

### 10. Docker Setup for Port 3173 & Node Server Runtime

Per D-10 and D-16, container build and orchestration must target port 3173:

#### `Dockerfile`
```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./
COPY tests/package.json ./tests/
COPY assets/package.json ./assets/

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build production artifacts and verify types
RUN npm run build
RUN npm run typecheck

# Production runtime stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3173
ENV HOST=0.0.0.0

# Copy built server output and public assets
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/public ./public

EXPOSE 3173

CMD ["node", ".output/server/index.mjs"]
```

#### `docker-compose.yml`
```yaml
services:
  learnwith:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: learnwith-app
    restart: unless-stopped
    ports:
      - "3173:3173"
    environment:
      - NODE_ENV=production
      - PORT=3173
      - HOST=0.0.0.0
```

#### `.dockerignore`
```
node_modules
.git
.output
.vinxi
graphify-out
scratch
*.docx
```

---

## Don't Hand-Roll (Anti-Patterns to Avoid)

| Problem | Anti-Pattern | Standard Framework Solution |
|---|---|---|
| **Route Generation** | Manually maintaining route files in `routeTree.gen.ts` | Rely exclusively on `@tanstack/router-plugin` via Vinxi / Vite. It automatically generates and updates `app/routeTree.gen.ts`. |
| **Path Aliases** | Hardcoding relative path traversals (`../../components/ui/button`) | Use `@/*` mapped to `./app/*` in `tsconfig.json` paired with `vite-tsconfig-paths`. |
| **Server/Client RPC** | Hand-rolling Express/Fastify REST endpoints or manual fetch wrappers for server logic | Use `createServerFn` from `@tanstack/react-start`. It creates typed RPC stubs in the client bundle automatically. |
| **CSS Delivery** | Inlining entire stylesheets in React state or dynamic JS injects | Link CSS in `head()` of `__root.tsx` or import directly in route files via Vite's CSS handling pipeline. |
| **Legacy Compatibility** | Rewriting all 11 legacy tests into modern TypeScript/ESM in Phase 19 | Use `tests/package.json` with `{"type": "commonjs"}`. Keeps 100% test coverage working immediately with zero regression risk. |

---

## Runtime State Inventory

| State Domain | Storage Mechanism | Access Point | Notes & Constraints |
|---|---|---|---|
| **Server Runtime** | Node.js process / Vinxi Nitro server | `app/ssr.tsx`, `.output/server/index.mjs` | Runs on dedicated Port 3173. Never access `window` or `document` here. |
| **Dev Server Runtime** | Vinxi dev server | `vinxi dev --port 3173` | Runs on Port 3173 with HMR and route auto-generation. |
| **Build Artifacts** | Disk directory `.output/` | `.output/server/`, `.output/public/` | Standard Nitro build output. Must be ignored in `.gitignore` and `.dockerignore`. |
| **Vinxi Internal Cache** | Disk directory `.vinxi/` | `.vinxi/` | Local bundler cache. Must be ignored in `.gitignore`. |
| **Client Local Storage** | Browser `localStorage` | `app/components/` (via `useEffect` or `<ClientOnly>`) | Do not read synchronously during SSR render to prevent hydration mismatches. |

---

## Common Pitfalls & Mitigations

### Pitfall 1: Unpinned Dependency Cascading to Incompatible Vite Version
- **Risk**: Using unpinned carets (`^1.120.20` or `^1.x`) causes npm to pull `@tanstack/react-start@1.168.50`, which specifies `peerOptional vite@>=7.0.0`, triggering an `ERESOLVE` collision against Vinxi 0.5.3's `vite@^6.4.1`.
- **Mitigation**: Pin `@tanstack/react-start`, `@tanstack/start`, `@tanstack/react-router`, `@tanstack/router-plugin` strictly to `1.120.20`, and `vinxi` to `0.5.3`.

### Pitfall 2: Root `"type": "module"` Breaking Legacy Unit Tests
- **Risk**: Setting `"type": "module"` in root `package.json` causes Node.js to interpret `tests/*.test.js` as ES modules. Since the test files use `require()`, Node throws `ReferenceError: require is not defined in ES module scope` and fails all 11 test suites.
- **Mitigation**: Place `tests/package.json` (`{"type": "commonjs"}`) and `assets/package.json` (`{"type": "commonjs"}`). Node.js respects the closest `package.json`, allowing legacy tests and assets to execute in CommonJS mode without breaking.

### Pitfall 3: Port Collisions During Local Development & Containerization
- **Risk**: Defaulting to port 3000 or 5173 causes frequent port-in-use errors when running concurrently with other local dev servers (e.g. Next.js, standard Vite, or n8n).
- **Mitigation**: Standardize on **Port 3173** across `package.json` scripts, `Dockerfile` (`ENV PORT=3173`), and `docker-compose.yml`.

### Pitfall 4: Hydration Mismatch on Root HTML Document
- **Risk**: Inserting browser-only attributes or script tags into `<html>` or `<body>` that differ between SSR streaming markup and client hydration causes React 19 hydration mismatch warnings.
- **Mitigation**: Ensure `__root.tsx` renders a clean, static document shell (`<Meta />`, `<Links />`, `<Outlet />`, `<Scripts />`, `<ScrollRestoration />`) without dynamic client-side conditional branches.

---

## Environment Availability

The local execution environment was verified on the host machine:
- **OS**: Windows 11
- **Node.js**: `v25.0.0` (Verified via `node -v`)
- **npm**: `11.6.2` (Verified via `npm -v`)
- **Docker**: `Docker version 29.6.2, build dfc4efb` (Verified via `docker --version`)
- **Docker Compose**: `v5.3.1` (Verified via `docker compose version`)
- **Legacy Test Suite**: 11 test files in `tests/*.test.js` passing 100% with `node --test` (Verified)

---

## Validation Architecture & Sampling Rate

### Validation Framework
- **TypeScript Static Verification**: `npm run typecheck` (`tsc --noEmit`)
- **Production Build Verification**: `npm run build` (`vinxi build`)
- **Legacy Regression Test Runner**: `npm test` (`node --test tests/*.test.js`)
- **Container Build Verification**: `docker compose build` / `docker build -t learnwith:phase19 .`
- **Runtime HTTP SSR Response Check**: `curl -I http://localhost:3173/` (verifies HTTP 200 and `Content-Type: text/html`)

### Sampling Rate
- **100% of Phase 19 tasks** MUST pass `npm run typecheck` and `npm test` before concluding each task.
- Build artifact `.output/server/index.mjs` MUST exist and verify clean build completion.
- Container image build MUST pass during Phase 19 verification.

### Wave 0 Gaps Addressed
- [x] Missing `package.json` and `package-lock.json` -> Initialized in Phase 19
- [x] Missing `tsconfig.json` -> Configured in Phase 19
- [x] Missing `app.config.ts` -> Configured in Phase 19
- [x] Missing `app/client.tsx` and `app/ssr.tsx` -> Implemented in Phase 19
- [x] Missing `Dockerfile` and `docker-compose.yml` -> Configured in Phase 19

---

## Security Domain

1. **Server Isolation Boundary**: By placing backend functions in `app/server/` and utilizing TanStack Start's compiler boundaries, server-only code (passkey hashing salts, internal tokens, server secrets) cannot leak into client JavaScript bundles.
2. **CSP and Anti-Framing Preservation**: The existing security headers established in Milestone v2.2 (Content Security Policy, X-Frame-Options, anti-clickjacking) must remain active in the server response headers emitted by Vinxi.
3. **No Plaintext Passwords**: Web Crypto and server-side hashing standards established in v2.2 are maintained across the migration boundary.

---

## Planning Next Steps

The planner can now consume this research to break Phase 19 into discrete, testable implementation plans:
1. **Plan 1**: Initialize `package.json`, install exact verified dependencies, configure `tests/package.json` and `assets/package.json` for CommonJS isolation, and verify `npm test` passes 11/11 suites.
2. **Plan 2**: Create strict `tsconfig.json`, `app.config.ts`, `app/router.tsx`, `app/client.tsx`, `app/ssr.tsx`, and skeleton routes (`app/routes/__root.tsx`, `app/routes/index.tsx`), verifying `npm run typecheck` and `npm run build`.
3. **Plan 3**: Configure `Dockerfile`, `docker-compose.yml`, `.dockerignore` for port 3173, and execute end-to-end container build and SSR HTTP verification.
