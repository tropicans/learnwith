---
phase: 33-global-platform-configuration-announcement-banner-e2e-zero-regression
plan: "01"
subsystem: api, ui, admin
tags: [admin, platform-config, announcement-banner, zod, server-rpc, zero-secret-leakage]

requires:
  - phase: 31-master-admin-session-hardening-auth-architecture
    provides: Session validation and cookie hardening
  - phase: 32-workshop-passkey-management-troubleshooting-audit-hub
    provides: AdminShell tab navigation and test fixtures

provides:
  - Strongly-typed platform configuration store (Zod schemas and in-memory state)
  - Strict secret quarantine preventing credential leakage to public endpoints
  - Public RPC and protected Master Admin RPC mutation endpoints
  - Admin Settings Console UI (WorkshopModeCard, AnnouncementBannerEditor, PlatformReadinessCard, AdminSettingsView)
  - Comprehensive unit and integration test suite (tests/admin-platform.test.js)

affects:
  - 33-02
  - public learner workspace banner display
  - admin operational controls

actuals:
  tokens: 1540
  tasks: 3
  commits: 1

tech-stack:
  added: []
  patterns:
    - In-memory state store with strict secret quarantine projections
    - Master Admin session authorization gating on RPC mutations
    - Unique ID rotation on announcement banner updates to clear client dismissal caches
    - Synchronized dual CSS stylesheets (`assets/css/admin.css` and `public/assets/css/admin.css`)

key-files:
  created:
    - app/schemas/platformConfig.ts
    - app/server/platformStore.ts
    - app/server/platform.ts
    - app/components/admin/settings/WorkshopModeCard.tsx
    - app/components/admin/settings/AnnouncementBannerEditor.tsx
    - app/components/admin/settings/PlatformReadinessCard.tsx
    - app/components/admin/settings/AdminSettingsView.tsx
    - tests/admin-platform.test.js
  modified:
    - app/server/session.ts
    - app/components/admin/AdminShell.tsx
    - assets/css/admin.css
    - public/assets/css/admin.css

key-decisions:
  - "Enforced strict secret isolation in `getPublicPlatformConfig()`: only operational mode, public banner projection, and server timestamp are exposed."
  - "Rotated banner IDs (`banner_${Date.now()}`) upon banner publication to reliably invalidate client-side dismissal states across all participant browsers."
  - "Exported `assertAdminAuthorized` from `session.ts` and `platform.ts` for unified Master Admin session verification."

patterns-established:
  - "Admin mutation RPC functions use centralized session token checking with explicit error throwing (`UNAUTHORIZED`)."

requirements-completed:
  - ADMIN-CFG-01
  - ADMIN-CFG-02

coverage:
  - id: D1
    description: "In-memory Platform Configuration Store with dynamic workshop mode toggle and strict secret quarantine"
    requirement: "ADMIN-CFG-01"
    verification:
      - kind: unit
        ref: "tests/admin-platform.test.js#Suite 1: In-Memory Platform Configuration Store & Defaults (ADMIN-CFG-01)"
        status: pass
      - kind: unit
        ref: "tests/admin-platform.test.js#Suite 3: Strict Secret Quarantine & Boundary Isolation (T-33-02, T-33-05)"
        status: pass
    human_judgment: false
  - id: D2
    description: "Announcement banner editor with ID rotation, urgency types, character counter, and real-time visual preview"
    requirement: "ADMIN-CFG-02"
    verification:
      - kind: unit
        ref: "tests/admin-platform.test.js#Suite 2: Announcement Banner Rotation & Validation (ADMIN-CFG-02)"
        status: pass
    human_judgment: false
  - id: D3
    description: "Admin Settings Console UI mounted into AdminShell settings tab with zero TypeScript errors"
    requirement: "ADMIN-CFG-01"
    verification:
      - kind: unit
        ref: "node ./node_modules/typescript/bin/tsc --noEmit"
        status: pass
    human_judgment: false

duration: 12 min
completed: 2026-09-09
status: complete
---

# Phase 33 Plan 01: Platform Configuration Store & Admin Settings Console Summary

**In-memory platform configuration store with strict secret quarantine projections, public & admin RPCs, and an interactive Admin Settings Console UI for real-time workshop mode switching and announcement banner broadcasts.**

## Performance

- **Duration:** ~12 min
- **Started:** 2026-09-09T13:12:46+07:00
- **Completed:** 2026-09-09T13:16:30+07:00
- **Tasks:** 3
- **Files modified:** 12

## Accomplishments

- **Platform Configuration Store & Zod Validation:**
  - Implemented `app/schemas/platformConfig.ts` with schemas for `WorkshopMode` (`pretraining` | `live-class`), `AnnouncementBanner` (`info` | `warning` | `alert`), and mutation inputs.
  - Built `app/server/platformStore.ts` storing runtime state with deterministic defaults (`pretraining`, disabled banner) and strict secret quarantine.
- **Server RPCs & Session Security Gating:**
  - Implemented public query `getPublicPlatformConfigFn` and protected admin RPCs (`adminGetPlatformConfigFn`, `adminUpdateWorkshopModeFn`, `adminUpdateAnnouncementBannerFn`) in `app/server/platform.ts`.
  - Added centralized Master Admin session verification via `assertAdminAuthorized` in `app/server/session.ts`.
- **Interactive Admin Settings Console UI:**
  - Built `WorkshopModeCard.tsx` with live mode badge, explanation cards, and change reason tracking.
  - Built `AnnouncementBannerEditor.tsx` with urgency selectors, 280-char textarea counter, optional action link fields, live broadcast/deactivate actions, and a real-time styled preview box.
  - Built `PlatformReadinessCard.tsx` showing passkey validation, session hardening, and Google OAuth SSO readiness.
  - Built `AdminSettingsView.tsx` and mounted it inside `AdminShell.tsx` replacing the placeholder card for the `settings` tab.
  - Synchronized styling between `assets/css/admin.css` and `public/assets/css/admin.css`.
- **Automated Verification:**
  - Added test suite `tests/admin-platform.test.js` verifying store defaults, mode transitions, banner rotation, secret quarantine, and admin authorization.
  - Full test suite passing with 221 tests (0 failures) and clean TypeScript typecheck (`tsc --noEmit`).

## Task Commits

1. **Tasks 33-01-01, 33-01-02, 33-01-03** - `cb5e20f` (feat(33-01): implement platform configuration store and admin settings console)

## Files Created/Modified

- `app/schemas/platformConfig.ts` - Zod validation schemas for platform configuration and banner mutations.
- `app/server/platformStore.ts` - In-memory configuration store, defaults, mutation methods, and secret quarantine projections.
- `app/server/platform.ts` - Public RPC query and protected administrative mutation RPC functions.
- `app/server/session.ts` - Exported centralized `assertAdminAuthorized` utility.
- `app/components/admin/settings/WorkshopModeCard.tsx` - Workshop mode toggle card with audit metadata.
- `app/components/admin/settings/AnnouncementBannerEditor.tsx` - Announcement banner authoring form with live preview box.
- `app/components/admin/settings/PlatformReadinessCard.tsx` - Diagnostic card displaying platform security readiness.
- `app/components/admin/settings/AdminSettingsView.tsx` - Main container for admin settings tab.
- `app/components/admin/AdminShell.tsx` - Mounted `AdminSettingsView` in `settings` tab.
- `assets/css/admin.css` & `public/assets/css/admin.css` - Responsive styling for settings console and preview box.
- `tests/admin-platform.test.js` - Automated unit and integration tests.

## Decisions Made

- Implemented automatic banner ID rotation (`banner_${Date.now()}`) upon banner publication to reliably invalidate client dismissal localStorage states.
- Kept the public config projection strictly stripped of server-side metadata (timestamps, author information, secret keys) to guarantee zero secret leakage.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- Fixed minor TypeScript shorthand property initializer in `updateWorkshopMode` (`changedBy: updatedBy`), resolving compilation cleanly.

## User Setup Required

None - all state is managed in-memory with automatic defaults.

## Next Phase Readiness

- Plan 33-01 is complete and ready for Plan 33-02 (learner client banner rendering, dismiss caching, and global workshop mode reactivity).
