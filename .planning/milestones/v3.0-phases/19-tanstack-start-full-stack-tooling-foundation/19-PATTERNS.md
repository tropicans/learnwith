# Phase 19: TanStack Start & Full-Stack Tooling Foundation - Pattern Map

**Phase:** 19 - TanStack Start & Full-Stack Tooling Foundation  
**Status:** Ready for Planning  
**Target File:** `.planning/phases/19-tanstack-start-full-stack-tooling-foundation/19-PATTERNS.md`  

---

## Executive Summary

This document establishes the authoritative code and structural patterns for all files to be created and modified in Phase 19. It defines file classifications, closest analogs, import/export contracts, boundary restrictions, and concrete code blueprints. Following these patterns ensures strict compliance with user decisions (`19-CONTEXT.md`) and technical research findings (`19-RESEARCH.md`).

---

## File Classification & Architectural Boundaries

| File Path | Role | Boundary / Data Flow | Action | Analogs / Precedents |
|---|---|---|---|---|
| `package.json` | Project Root Manifest | Tooling / Runtime Manifest | Create | Root NPM standard; replaces ad-hoc script execution |
| `tests/package.json` | Module Scoping Marker | Node.js CommonJS Isolation | Create | Node.js hierarchical resolution pattern |
| `assets/package.json` | Module Scoping Marker | Node.js CommonJS Isolation | Create | Node.js hierarchical resolution pattern |
| `tsconfig.json` | TypeScript Configuration | Static Analysis & Type Checking | Create | TypeScript 5.4 bundler configuration pattern |
| `app.config.ts` | Framework & Bundler Config | Vinxi / Vite Build Pipeline | Create | `config.js` (legacy config) -> modern Vinxi config |
| `app/router.tsx` | Router Factory & Registry | Hybrid (SSR + Client Router) | Create | TanStack Router instance factory pattern |
| `app/client.tsx` | Hydration Entry Point | Pure Client-Side Hydration | Create | React 19 `hydrateRoot` + `<StartClient />` |
| `app/ssr.tsx` | Server Streaming Handler | Pure Server-Side Request Handling | Create | Vinxi handler + `defaultStreamHandler` |
| `app/routes/__root.tsx` | Root Document Route Shell | Hybrid (SSR HTML Shell + Client Tree) | Create | `index.html` (legacy HTML document shell) |
| `app/routes/index.tsx` | Entry Route Component | Hybrid (SSR Content + Client UI) | Create | Minimal route placeholder |
| `app/server/.gitkeep` | Backend Boundary Anchor | Server-Side Isolated Runtime | Create | Backend isolation boundary per D-12 |
| `public/favicon.svg` | Static Asset Serving | Vite Static Asset Pipeline | Copy/Create | `favicon.svg` (root legacy asset) |
| `Dockerfile` | Container Build Specification | Production Deployment Image | Create | Multi-stage Node 20 Alpine builder/runner |
| `docker-compose.yml` | Container Orchestration | Docker Service Definition | Create | Production container runner on Port 3173 |
| `.dockerignore` | Build Context Filter | Docker Build Context Exclusions | Create | Standard Docker ignore pattern |
| `.gitignore` | Version Control Filter | Git Working Tree Exclusions | Modify | Existing `.gitignore` |

---

## Pattern Assignments

### 1. `package.json`

- **Role**: Root dependency manifest and unified task runner script coordinator.
- **Closest Analog**: Standard Node.js modern ESM root manifest.
- **Imports**: N/A (JSON).
- **Key Fields & Scripts**:
  - `"type": "module"`: Enables modern ESM resolution across `app/` and `app.config.ts`.
  - `"scripts"`:
    - `"dev": "vinxi dev --port 3173"`: Development server on Port 3173.
    - `"build": "vinxi build"`: Full production bundle generation to `.output/`.
    - `"start": "vinxi start --port 3173"`: Production server runtime on Port 3173.
    - `"typecheck": "tsc --noEmit"`: Strict static type verification.
    - `"test:node": "node --test tests/*.test.js"`: Legacy Node.js test runner execution.
    - `"test": "npm run test:node"`: Unified test command.
- **Exact Pinned Dependencies**:
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

---

### 2. `tests/package.json` & `assets/package.json`

- **Role**: CommonJS module isolation markers.
- **Problem Solved**: Setting `"type": "module"` in the root `package.json` causes Node.js to interpret `tests/*.test.js` and `assets/js/*.js` as ES Modules. Because legacy files use `require()` and `module.exports` (e.g. `tests/checkpoint-engine.test.js:19`), Node would throw `ReferenceError: require is not defined in ES module scope`.
- **Mechanism**: Node.js resolves module types from the nearest ancestor `package.json`. Creating `tests/package.json` and `assets/package.json` with `{"type": "commonjs"}` isolates legacy JavaScript completely without modifying a single line of legacy test or asset code.
- **Exact Content**:
  ```json
  {
    "type": "commonjs"
  }
  ```

---

### 3. `tsconfig.json`

- **Role**: Strict TypeScript configuration supporting Vite/Vinxi bundler resolution and React 19 JSX.
- **Closest Analog**: Modern strict TypeScript 5.4+ bundler configuration.
- **Key Compiler Options**:
  - `target: "ES2022"`, `module: "ESNext"`: Modern JavaScript emission target.
  - `moduleResolution: "Bundler"`: Allows package exports resolution and extensionless imports.
  - `strict: true`: Enables all strict type-checking options (`noImplicitAny`, `strictNullChecks`, etc.).
  - `jsx: "react-jsx"`: React 19 automatic runtime transformation.
  - `baseUrl: "."`, `paths: { "@/*": ["./app/*"] }`: Clean absolute path alias mapping.
  - `exclude`: Explicitly excludes `node_modules`, `.output`, `.vinxi`, and `tests` (tests remain standalone CommonJS).
- **Exact Content**:
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

---

### 4. `app.config.ts`

- **Role**: Vinxi / TanStack Start bundler and server runtime configuration.
- **Closest Analog**: Root build config (`vite.config.ts` or legacy `config.js`).
- **Imports**:
  - `defineConfig` from `@tanstack/start/config`
  - `tsConfigPaths` from `vite-tsconfig-paths`
- **Exports**: `export default defineConfig(...)`
- **Key Specifications**:
  - Configures `server.preset: 'node-server'` for clean standalone Node deployment in container environments.
  - Injects `vite-tsconfig-paths` pointing to `./tsconfig.json` so `@/*` paths resolve across SSR and client bundler pipelines.
- **Exact Blueprint**:
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

---

### 5. `app/router.tsx`

- **Role**: Type-safe router factory and module declaration registry.
- **Closest Analog**: TanStack Router standard router instantiation factory.
- **Imports**:
  - `createRouter as createTanStackRouter` from `@tanstack/react-router`
  - `routeTree` from `./routeTree.gen` (generated automatically by `@tanstack/router-plugin`)
- **Exports**:
  - `export function createRouter()`
  - `declare module '@tanstack/react-router'` interface `Register` augmentation
- **Conventions**:
  - Router factory function must be exported (not a singleton) to avoid SSR cross-request state contamination.
  - `scrollRestoration: true` ensures standard web document navigation UX.
- **Exact Blueprint**:
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

---

### 6. `app/client.tsx`

- **Role**: Client-side hydration entry point.
- **Closest Analog**: React 19 hydration entry point (`main.jsx` / `client.tsx`).
- **Imports**:
  - Reference directive: `/// <reference types="vinxi/types/client" />`
  - `hydrateRoot` from `react-dom/client`
  - `StartClient` from `@tanstack/react-start`
  - `createRouter` from `./router`
- **Boundary Restrictions**: Pure client bundle. MUST NOT import Node.js built-ins (`fs`, `path`, `process.env` server secrets).
- **Exact Blueprint**:
  ```tsx
  /// <reference types="vinxi/types/client" />
  import { hydrateRoot } from 'react-dom/client'
  import { StartClient } from '@tanstack/react-start'
  import { createRouter } from './router'

  const router = createRouter()

  hydrateRoot(document, <StartClient router={router} />)
  ```

---

### 7. `app/ssr.tsx`

- **Role**: Server-side rendering and progressive HTML streaming request handler.
- **Closest Analog**: Modern SSR handler / Nitro event handler.
- **Imports**:
  - Reference directive: `/// <reference types="vinxi/types/server" />`
  - `createStartHandler`, `defaultStreamHandler` from `@tanstack/react-start/server`
  - `getRouterManifest` from `@tanstack/react-start/router-manifest`
  - `createRouter` from `./router`
- **Boundary Restrictions**: Pure server runtime. MUST NOT reference DOM globals (`window`, `document`, `localStorage`).
- **Exact Blueprint**:
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

---

### 8. `app/routes/__root.tsx`

- **Role**: Root HTML document shell, head manager, and top-level outlet.
- **Closest Analog**: Legacy `index.html` lines 1–35 (doctype, meta tags, link relations).
- **Imports**:
  - `Outlet`, `ScrollRestoration`, `createRootRoute` from `@tanstack/react-router`
  - `Meta`, `Scripts` from `@tanstack/react-start`
  - `type { ReactNode }` from `react`
- **Conventions**:
  - Renders the single outer `<html>`, `<head>`, and `<body>` tags for the application.
  - Eliminates FOUC by inserting `<Meta />` and linked static stylesheet relations before streaming `<Outlet />`.
  - In Phase 19, renders the skeleton document shell. CSS asset links and full component shells migrate in Phase 20.
- **Exact Blueprint**:
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

---

### 9. `app/routes/index.tsx`

- **Role**: Baseline index route verifying successful router compilation, SSR rendering, and hydration.
- **Closest Analog**: Minimal test route.
- **Imports**:
  - `createFileRoute` from `@tanstack/react-router`
- **Exports**: `export const Route = createFileRoute('/')(...)`
- **Exact Blueprint**:
  ```tsx
  import { createFileRoute } from '@tanstack/react-router'

  export const Route = createFileRoute('/')({
    component: HomeComponent,
  })

  function HomeComponent() {
    return (
      <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
        <h1>LearnWith Platform v3.0</h1>
        <p>TanStack Start Full-Stack Tooling Foundation Active (Port 3173).</p>
      </main>
    )
  }
  ```

---

### 10. `app/server/` Boundary & Future Architecture

- **Role**: Pure server logic directory for future phases (Phase 20+ passkey auth, PDF parser, AI workshop generator).
- **Constraint**: Code placed inside `app/server/` must never be directly imported by client components or route views. Client components must interact with server logic exclusively through `createServerFn` RPC wrappers.
- **Phase 19 Action**: Establish the directory structure with `.gitkeep` to prepare the architectural boundary.

---

### 11. `public/favicon.svg`

- **Role**: Static brand icon served at root `/favicon.svg`.
- **Closest Analog**: Existing root `favicon.svg`.
- **Action**: Copy or move root `favicon.svg` into `public/favicon.svg`. Vite and Vinxi automatically serve the contents of `public/` at the root path `/`.

---

### 12. `Dockerfile`, `docker-compose.yml`, and `.dockerignore`

- **Role**: Multi-stage production container build and orchestration locked to Port 3173.
- **Key Requirements**:
  - Builder stage installs dependencies (`npm ci`), builds Vinxi output (`npm run build`), and checks types (`npm run typecheck`).
  - Runner stage uses lightweight `node:20-alpine`, sets `PORT=3173`, `HOST=0.0.0.0`, copies `.output` and `public`, exposes port 3173, and launches `node .output/server/index.mjs`.
  - `docker-compose.yml` maps `"3173:3173"`.
  - `.dockerignore` excludes `node_modules`, `.output`, `.vinxi`, and large documentation binaries (`*.docx`).

#### `Dockerfile` Blueprint:
```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package manifests for dependency layer caching
COPY package*.json ./
COPY tests/package.json ./tests/
COPY assets/package.json ./assets/

# Install dependencies strictly
RUN npm ci

# Copy full project source
COPY . .

# Build production artifacts and verify TypeScript
RUN npm run build
RUN npm run typecheck

# Production runner stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3173
ENV HOST=0.0.0.0

# Copy built server bundle and public static assets
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/public ./public

EXPOSE 3173

CMD ["node", ".output/server/index.mjs"]
```

#### `docker-compose.yml` Blueprint:
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

#### `.dockerignore` Blueprint:
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

### 13. `.gitignore` Modifications

- **Role**: Prevent build outputs and temporary bundler caches from being committed.
- **Existing Content**:
  ```gitignore
  node_modules/
  tmp/
  output/
  .DS_Store
  Thumbs.db
  .gsd/
  .codex-finalizer/
  .pptx-*
  ```
- **Additions Required**:
  ```gitignore
  .output/
  .vinxi/
  ```

---

## Shared Patterns & Conventions Summary

### 1. The CommonJS Isolation Pattern
```
Root (package.json: "type": "module")
├── app/ (ESM / TypeScript Bundler)
├── tests/ (package.json: "type": "commonjs") -> Node test runner uses require() cleanly
└── assets/ (package.json: "type": "commonjs") -> Legacy scripts use module.exports cleanly
```
*Rationale*: Eliminates any risk of `ReferenceError: require is not defined in ES module scope` when running `npm test` (`node --test tests/*.test.js`).

### 2. Path Aliases Convention
- **Configured in**: `tsconfig.json` (`compilerOptions.paths`) + `app.config.ts` (`vite-tsconfig-paths`).
- **Syntax**: Use `@/components/...` or `@/server/...` instead of brittle relative paths (`../../`).

### 3. Port 3173 Invariant
- **Dev**: `vinxi dev --port 3173`
- **Start**: `vinxi start --port 3173`
- **Container**: `ENV PORT=3173`, `EXPOSE 3173`, `ports: ["3173:3173"]`
- *Rationale*: Guarantees zero port collision with typical 3000 / 5173 / 8080 local servers.

### 4. Progressive SSR Streaming
- Handled at `app/ssr.tsx` via `defaultStreamHandler`.
- Enables out-of-order streaming chunk transmission with React 19 native `Suspense`.

---

## Verification Pipeline & Quality Gates

Each task in Phase 19 must validate against the following sequential gates:

1. **Gate 1: CommonJS Test Stability**  
   Command: `npm test`  
   Expectation: All 11 legacy test suites in `tests/*.test.js` pass 100% (0 failures).

2. **Gate 2: Static TypeScript Type Checking**  
   Command: `npm run typecheck`  
   Expectation: `tsc --noEmit` exits with status code 0 and zero type errors.

3. **Gate 3: Vinxi Production Build Generation**  
   Command: `npm run build`  
   Expectation: Vinxi builds without errors, generating `.output/server/index.mjs` and `.output/public/`.

4. **Gate 4: SSR HTTP Response Verification**  
   Command: Run `vinxi start --port 3173` (or background process) and probe `curl -I http://localhost:3173/`.  
   Expectation: Returns `HTTP/1.1 200 OK` with `Content-Type: text/html`.

5. **Gate 5: Container Build Verification**  
   Command: `docker build -t learnwith:phase19 .`  
   Expectation: Clean multi-stage build completes successfully.
