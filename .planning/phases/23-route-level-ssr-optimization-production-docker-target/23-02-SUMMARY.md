---
phase: 23-route-level-ssr-optimization-production-docker-target
plan: "02"
subsystem: container-infrastructure
tags: [docker, alpine, tini, non-root, healthcheck, multi-stage]

requires:
  - phase: 23-01
    provides: Optimized route-level SSR and structured request logging
provides:
  - Hardened multi-stage Dockerfile with Node 20 Alpine and layer-cached npm ci
  - Tini init system (/sbin/tini) as PID 1 entrypoint for signal trapping and zombie process cleanup
  - Non-root unprivileged container execution as USER node (UID 1000)
  - Zero-dependency inline Node.js fetch healthcheck probe
  - Docker Compose configuration with dynamic PORT override and healthcheck
affects:
  - 23-03

actuals:
  tokens: 1650
  tasks: 3
  commits: 1

tech-stack:
  added:
    - tini (Alpine package for PID 1 signal trapping)
  patterns:
    - Multi-stage build caching npm ci manifests before copying application source code
    - Non-root container execution: USER node with --chown=node:node ownership
    - Zero-dependency inline healthcheck: node -e fetch('http://localhost:3173/')
    - Init process entrypoint: ENTRYPOINT ["/sbin/tini", "--"]

key-files:
  created: []
  modified:
    - Dockerfile
    - docker-compose.yml

key-decisions:
  - "D-05: Enforced non-root unprivileged user node (UID 1000) in runner stage with strict chown ownership."
  - "D-06: Configured inline Node.js fetch healthcheck with zero curl/wget dependencies in Alpine."
  - "D-07: Optimized multi-stage Docker build to cache npm ci layers before copying application code."
  - "D-08: Configured /sbin/tini as PID 1 init entrypoint for instant SIGTERM/SIGINT trapping and zombie reaping."
  - "D-11: Set explicit production defaults (PORT=3173, HOST=0.0.0.0) with dynamic override in docker-compose.yml."

requirements-completed:
  - DEPLOY-01
  - DEPLOY-03

coverage:
  - id: D-05
    description: "Non-root execution with USER node and chown ownership"
    requirement: DEPLOY-03
    verification:
      - kind: container
        ref: "docker inspect --format='{{.Config.User}}' learnwith:phase23-final"
        status: pass
  - id: D-06
    description: "Native Node.js inline fetch healthcheck probe"
    requirement: DEPLOY-03
    verification:
      - kind: container
        ref: "docker inspect --format='{{json .Config.Healthcheck.Test}}' learnwith:phase23-final"
        status: pass
  - id: D-07
    description: "Multi-stage layering copying only .output and public to runner"
    requirement: DEPLOY-01
    verification:
      - kind: build
        ref: "docker build -t learnwith:phase23-final ."
        status: pass
  - id: D-08
    description: "Tini init system as PID 1 entrypoint"
    requirement: DEPLOY-03
    verification:
      - kind: container
        ref: "docker inspect --format='{{json .Config.Entrypoint}}' learnwith:phase23-final"
        status: pass
---

# Phase 23 Plan 02: Production Docker Hardening, Multi-Stage Layering, Non-Root User & Signal Trapping Summary

## Overview
Plan 23-02 hardened the production Docker container runtime on Node 20 Alpine. It implemented CIS/OWASP compliant non-root execution (`USER node`), integrated `tini` as PID 1 to trap SIGTERM/SIGINT signals preventing container stop timeouts, configured native zero-dependency Node.js healthchecks, and optimized multi-stage build layering.

## Accomplishments
1. **Multi-Stage Dockerfile Optimization (`Dockerfile`)**:
   - Stage 1 (`builder`): copies `package*.json`, `tests/package.json`, and `assets/package.json` to leverage Docker layer caching on `npm ci` before copying application source code. Synchronizes static assets into `public/assets/` and performs both `npm run build` and `npm run typecheck`.
   - Stage 2 (`runner`): minimal runtime copying strictly `/app/.output` and `/app/public` with `--chown=node:node`.
2. **Signal Trapping & Zombie Reaping with Tini (`Dockerfile`)**:
   - Installed `/sbin/tini` via `apk add --no-cache tini`.
   - Set `ENTRYPOINT ["/sbin/tini", "--"]` to intercept termination signals cleanly and prevent ungraceful 10s SIGKILL timeouts.
3. **Non-Root Execution (`Dockerfile`)**:
   - Set `USER node` (UID 1000) for unprivileged runtime execution, mitigating container breakout threats (T-23-01).
4. **Native Node Inline Healthcheck (`Dockerfile`, `docker-compose.yml`)**:
   - Implemented `HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 CMD node -e "fetch('http://localhost:' + (process.env.PORT || 3173) + '/').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"`.
   - Updated `docker-compose.yml` to support `${PORT:-3173}:3173` port mapping with matching healthcheck parameters.

## Verification
- `docker compose config`: Valid Compose syntax.
- `docker build -t learnwith:phase23-final .`: Clean multi-stage build completed with exit code 0.
- `docker inspect`: Confirmed `USER=node`, `ENTRYPOINT=["/sbin/tini","--"]`, and inline Node fetch healthcheck.
