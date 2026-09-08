---
phase: 22-typed-server-functions-boundary-isolation
plan: "03"
subsystem: ui-auth-integration
tags: [tanstack-start, instructor-modal, course-routes, boundary-isolation, zero-leakage, vinxi-build]

requires:
  - phase: 22-typed-server-functions-boundary-isolation
    provides: verifyInstructorPasskeyFn in app/server/auth.ts and isomorphic schemas in app/schemas/serverFn.ts
provides:
  - InstructorUnlockModal interactive client dialog (app/components/course/InstructorUnlockModal.tsx)
  - Seamless passkey verification integration into Agentic AI workspace (app/routes/course.ai.tsx)
  - Seamless passkey verification integration into Word ASN workspace (app/routes/course.word.tsx)
  - Full production build and test suite regression verification
affects:
  - 23-route-level-ssr-optimization-production-docker-target

actuals:
  tokens: 1800
  tasks: 3
  commits: 1

tech-stack:
  added: []
  patterns:
    - Client RPC invocation via verifyInstructorPasskeyFn
    - Zero plain text credential exposure in UI components
    - Multi-course session storage integration with SSR boundary isolation

key-files:
  created:
    - app/components/course/InstructorUnlockModal.tsx
  modified:
    - app/routes/course.ai.tsx
    - app/routes/course.word.tsx

key-decisions:
  - "Built InstructorUnlockModal with accessible keyboard controls (Escape to cancel), pending indicators, and error feedback."
  - "Connected modal to verifyInstructorPasskeyFn, writing to session state on success without storing plain text passcodes."
  - "Eliminated all client-exposed passcodes from course workspace routes and verified zero build leaks via Vinxi compiler."

patterns-established:
  - "Client RPC consumption: Client components invoke typed server functions directly with end-to-end type safety."

requirements-completed:
  - SRV-01
  - SRV-02
  - SRV-03

coverage:
  - id: D1
    description: "InstructorUnlockModal client component in app/components/course/InstructorUnlockModal.tsx"
    requirement: SRV-01
    verification:
      - kind: automated_ui
        ref: "npm run build (successful client bundle extraction)"
        status: pass
  - id: D2
    description: "Course routes integration with typed server passkey RPC"
    requirement: SRV-01
    verification:
      - kind: unit
        ref: "tests/server-boundary-audit.test.js#prohibits direct imports of app/server/config"
        status: pass
  - id: D3
    description: "Zero client leakage audit and full regression verification"
    requirement: SRV-02
    verification:
      - kind: unit
        ref: "npm test (13/13 test suites pass)"
        status: pass
---

# Phase 22 Plan 03: Client Modal Integration, Workspace Wiring & Legacy Sanitization Summary

## Overview
Plan 22-03 completed the end-to-end instructor unlock flow by building the accessible client dialog `InstructorUnlockModal.tsx`, wiring it into the Agentic AI and Word ASN course routes (`app/routes/course.ai.tsx` and `app/routes/course.word.tsx`), sanitizing client-exposed credentials, and performing full production compilation and regression testing.

## Accomplishments
1. **Interactive Client Unlock Modal (`app/components/course/InstructorUnlockModal.tsx`)**:
   - Built a dialog modal with backdrop blur, password masking, pending state, error feedback, and keyboard event handling (Escape to close).
   - Invokes `verifyInstructorPasskeyFn({ data: { courseId, passkey } })` to perform RPC passkey verification.
   - On success, triggers `onUnlocked()` callback and persists unlock status to course session.
2. **Course Workspaces Wiring**:
   - `app/routes/course.ai.tsx`: Integrated unlock button and active session badge into Live Class mode header; toggles `isUnlockModalOpen` and renders `InstructorUnlockModal`.
   - `app/routes/course.word.tsx`: Integrated unlock button and competency status badge into course header banner; renders `InstructorUnlockModal`.
   - Zero plain text passcodes or hashes are present in client components or routes.
3. **Production Build & Test Suite Verification**:
   - `npm run typecheck`: 0 TypeScript errors.
   - `npm run build`: Production Vinxi client, SSR, and server bundles built cleanly.
   - `node --test tests/server-boundary-audit.test.js`: 5/5 tests passing.
   - `node --test tests/server-functions.test.js`: 8/8 tests passing.
   - `npm test`: 13/13 test suites passing cleanly with zero regressions.

## Verification
- TypeScript strict checking: PASS
- Vinxi full-stack production build: PASS
- Boundary leakage audit: PASS
- All unit and integration test suites: PASS
