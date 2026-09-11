# Phase 34: Course Lifecycle Schema & Server Store Architecture - Research

## Executive Summary
Phase 34 lays the technical foundation for Milestone v3.3 by introducing a typed lifecycle state store for courses, validating allowable state transitions, exposing Master Admin server functions (via TanStack Start createServerFn), and providing a public projection query.

## Current System Analysis
1. **Course Data Layer (app/data/courses.ts)**:
   - Static definitions: COURSE_AI_BASE and COURSE_WORD_BASE.
   - Function getCoursesList() returns both courses unconditionally.
   - Course structure includes: id, title, subtitle, description, category, badge, modulesCount, checkpointsCount, modules, sessionMode.

2. **Server Architecture Pattern (app/server/)**:
   - app/server/platformStore.ts: Demonstrates clean in-memory state store pattern with version counters, update mutators, and test reset functions.
   - app/server/platform.ts: Implements assertAdminAuthorized() for Master Admin protection via session token.
   - app/schemas/platformConfig.ts: Zod schemas for input validation and output types.

## Design Requirements for Phase 34
1. **Lifecycle Status Model (COURSE-STATUS-01)**:
   - Statuses: active (show), hidden (hide), archived (archive), and deleted (soft-delete).
   - Valid state transitions: active <-> hidden, active <-> archived, hidden <-> archived, active|hidden|archived -> deleted, deleted -> active (restore).

2. **In-Memory Server Store (app/server/courseLifecycleStore.ts) (COURSE-STATUS-02, COURSE-STATUS-03)**:
   - Initialized at startup with ai: active and word: active.
   - Tracks: id, status, updatedAt, updatedBy, reason.
   - Store versioning for optimistic concurrency / reactive client updates.
   - Test helper: clearCourseLifecycleStoreForTesting().

3. **Master Admin RPC Server Functions (app/server/courseLifecycle.ts) (COURSE-MUTATE-01, COURSE-MUTATE-02)**:
   - adminGetCoursesLifecycleFn: Requires Master Admin auth token; returns full status registry and audit log.
   - adminUpdateCourseLifecycleFn: Validates Master Admin auth token and input payload (courseId, targetStatus, reason); mutates status and returns updated record with incremented version.
   - getPublicCourseStatusesFn: Returns public projection of course statuses.

4. **Testing Strategy (COURSE-TEST-01)**:
   - Unit tests covering Zod schemas, allowable and disallowed state transitions, store immutability, session token verification, and server function RPCs.