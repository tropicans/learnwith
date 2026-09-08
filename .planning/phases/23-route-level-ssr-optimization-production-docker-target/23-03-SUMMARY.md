---
phase: 23-route-level-ssr-optimization-production-docker-target
plan: "03"
subsystem: testing-deployment
tags: [nitro, asset-caching, compression, container-smoke, multi-tier-test, zero-regression]

requires:
  - phase: 23-01
    provides: Optimized route-level SSR and structured request logging
  - phase: 23-02
    provides: Hardened Docker container and compose orchestration
provides:
  - Nitro standalone static asset delivery with gzip/brotli compression and 1-year immutable caching
  - Synchronized public/assets directory for standalone Nitro resolution
  - Dedicated automated container smoke test suite (tests/docker-smoke.test.js) with 7 comprehensive assertions
  - Multi-tier testing scripts in package.json (test, test:smoke, test:e2e, test:all)
  - 100% zero-regression guarantee across all 13 legacy unit test suites (24/24 passing)
affects: []

actuals:
  tokens: 1950
  tasks: 3
  commits: 1

tech-stack:
  added: []
  patterns:
    - Standalone Nitro asset delivery with compressPublicAssets and routeRules
    - CommonJS automated container smoke test suite with graceful skip guard
    - Multi-tier npm test pipeline for CI and local verification

key-files:
  created:
    - tests/docker-smoke.test.js
  modified:
    - app.config.ts
    - package.json
    - package-lock.json
    - public/assets/

key-decisions:
  - "D-09: Implemented standalone Nitro server delivering assets directly without external reverse proxies."
  - "D-10: Configured routeRules for 1-year immutable caching on /_build/** and /assets/** with gzip/brotli compression."
  - "D-13: Deployed dedicated tests/docker-smoke.test.js verifying container liveness, non-root user, and SSR payload integrity."
  - "D-14: Configured multi-tier test pipeline (test, test:smoke, test:e2e, test:all) in package.json."
  - "D-15: Enforced full document integrity assertions for Frontpage Hub, Agentic AI, Word ASN, and 404 routes."
  - "D-16: Maintained 100% zero-regression legacy guarantee across 13 test suites (24/24 passing)."

requirements-completed:
  - DEPLOY-01
  - DEPLOY-03
  - DEPLOY-04

coverage:
  - id: D-09
    description: "Standalone Nitro static server"
    requirement: DEPLOY-01
    verification:
      - kind: build
        ref: "app.config.ts"
        status: pass
  - id: D-10
    description: "Immutable asset caching & compression"
    requirement: DEPLOY-01
    verification:
      - kind: smoke
        ref: "tests/docker-smoke.test.js#verifies static asset delivers immutable caching headers"
        status: pass
  - id: D-13
    description: "Dedicated container smoke test suite"
    requirement: DEPLOY-04
    verification:
      - kind: smoke
        ref: "npm run test:smoke"
        status: pass
  - id: D-14
    description: "Multi-tier test script harness"
    requirement: DEPLOY-04
    verification:
      - kind: config
        ref: "package.json#scripts"
        status: pass
  - id: D-15
    description: "Full document SSR integrity across routes"
    requirement: DEPLOY-02
    verification:
      - kind: smoke
        ref: "tests/docker-smoke.test.js"
        status: pass
  - id: D-16
    description: "100% zero-regression on 13 legacy test suites"
    requirement: DEPLOY-04
    verification:
      - kind: unit
        ref: "npm test"
        status: pass
---

# Phase 23 Plan 03: Standalone Nitro Asset Caching, Automated Container Smoke Test & Multi-Tier Test Suite Summary

## Overview
Plan 23-03 concluded the final wave of Phase 23: configured standalone Nitro static asset serving with immutable caching rules and gzip/brotli compression, deployed an automated container smoke test suite validating container health, non-root execution, and full document SSR payload integrity across all routes, integrated multi-tier testing scripts into `package.json`, guaranteed 100% zero-regression across all 13 legacy unit test suites, and completed the multi-source coverage audit.

## Accomplishments
1. **Nitro Standalone Asset Serving & Caching (`app.config.ts`, `public/assets/`)**:
   - Expanded `app.config.ts` server configuration with `preset: 'node-server'`, `compressPublicAssets: { gzip: true, brotli: true }`, and `routeRules` applying `Cache-Control: public, max-age=31536000, immutable` to `/_build/**` and `/assets/**`.
   - Mirrored static stylesheets and icons into `public/assets/` to ensure immediate asset resolution by Vinxi's public router without 404s.
2. **Automated Container Smoke Test Suite (`tests/docker-smoke.test.js`)**:
   - Implemented 7 automated assertions:
     1. Container liveness & health (`learnwith-app` reporting `healthy`).
     2. Non-root user execution (`docker exec learnwith-app whoami` asserting `node`).
     3. Frontpage Hub (`/`): full document SSR with OpenGraph tags and course cards.
     4. Course AI (`/course/ai?mode=pretraining`): syllabus outline and streaming banner.
     5. Course Word (`/course/word`): syllabus outline and Pergub 14/2020 reference.
     6. Unknown route (`/route-that-does-not-exist`): HTTP 404 with branded NotebookLM recovery view.
     7. Static asset delivery: HTTP 200 on `/favicon.svg`.
   - Included graceful skip guard so standard unit test runs remain independent of Docker availability.
3. **Multi-Tier Test Harness & Zero Regression (`package.json`)**:
   - Registered `test:node`, `test`, `test:smoke`, `test:e2e`, and `test:all`.
   - Pinned `@tanstack/start-server-functions-fetcher: 1.120.19` in overrides to align with TanStack Start 1.120.x runtime requirements.
   - Executed `npm test`: 24/24 tests passing across 13 legacy suites (100% passing guarantee).
   - Executed `npm run test:smoke`: 7/7 container and SSR assertions passing cleanly.

## Verification
- `npm run typecheck`: 0 TypeScript errors.
- `npm test`: 13 suites, 24/24 passed with 0 failures.
- `docker compose up --build -d`: Container healthy in 6 seconds.
- `npm run test:smoke`: 7/7 tests passed in 438ms.
