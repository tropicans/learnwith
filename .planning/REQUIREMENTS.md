# Requirements: Milestone v3.3 Admin Course Lifecycle & Visibility Management

**Milestone:** v3.3  
**Status:** Complete  

---

## Requirements Grouped by Category

### Category 1: Course Lifecycle State & Server Store (COURSE-STATUS)

- [x] **COURSE-STATUS-01**: System provides strongly-typed course lifecycle status model: `'active'` (show), `'hidden'` (hide), `'archived'` (archive), and `'deleted'` (soft-delete).
- [x] **COURSE-STATUS-02**: System provides an in-memory server course registry in `app/server/courseLifecycleStore.ts` initialized with existing curriculum (`ai` and `word`), retaining status, lastUpdated, updatedBy, and version.
- [x] **COURSE-STATUS-03**: Course status store validates mutations against valid state transitions (e.g. active <-> hidden, active <-> archived, archived <-> active, deleted <-> active restore).

### Category 2: Admin Course Management Interface (COURSE-ADMIN)

- [x] **COURSE-ADMIN-01**: Admin Command Center (`/admin`) features a dedicated "Manajemen Kursus" view/tab in `AdminShell` displaying all courses with their current status badge, metadata, and quick stats.
- [x] **COURSE-ADMIN-02**: Admin can toggle course visibility with 1-click `Tampilkan` (Show) / `Sembunyikan` (Hide) action buttons with instant visual feedback.
- [x] **COURSE-ADMIN-03**: Admin can archive/restore a course with `Arsipkan` (Archive) / `Pulihkan` (Restore) action buttons and dedicated status filter tabs (`Semua`, `Aktif`, `Tersembunyi`, `Diarsipkan`).
- [x] **COURSE-ADMIN-04**: Admin can soft-delete a course with `Hapus` (Delete) trigger that requires explicit user confirmation in a safety modal before deactivation.

### Category 3: Secure Server Functions & Mutations (COURSE-MUTATE)

- [x] **COURSE-MUTATE-01**: Server function `adminGetCoursesStatusFn` (or `adminGetCoursesLifecycleFn`) returns full course status registry for authenticated Master Admin sessions via `createServerFn`.
- [x] **COURSE-MUTATE-02**: Server function `adminUpdateCourseStatusFn` validates admin session token, executes status mutation, increments store version, and records audit trail.
- [x] **COURSE-MUTATE-03**: Public server function or loader `getPublicCoursesListFn` projects only non-deleted, non-archived courses for public consumption, excluding hidden courses from public listings while keeping them reachable via direct route.

### Category 4: Public Catalog & Navigation Reactive Synchronization (COURSE-SYNC)

- [x] **COURSE-SYNC-01**: Frontpage Hub (`/`) reactively filters workshop cards: displays only `active` courses; omits `hidden`, `archived`, and `deleted` courses.
- [x] **COURSE-SYNC-02**: Global header course dropdown / course switcher displays only `active` courses for normal navigation.
- [x] **COURSE-SYNC-03**: Direct workspace access (`/course/ai`, `/course/word`) for `hidden` courses remains functional when accessed directly (with passkey requirement intact if applicable), while `deleted` courses render an informative inactive/archived notice.

### Category 5: Quality Assurance & Zero-Regression (COURSE-TEST)

- [x] **COURSE-TEST-01**: Automated test suites verify course lifecycle state transitions, store immutability, server mutation RPCs, and admin session authorization guards.
- [x] **COURSE-TEST-02**: Zero regression across public workshop workflows, passkey gates, participant telemetry, and existing 242 unit/integration tests.

---

## Traceability Matrix

| Requirement | Phase | Status |
|-------------|-------|--------|
| COURSE-STATUS-01 | Phase 34 | Complete |
| COURSE-STATUS-02 | Phase 34 | Complete |
| COURSE-STATUS-03 | Phase 34 | Complete |
| COURSE-MUTATE-01 | Phase 34 | Complete |
| COURSE-MUTATE-02 | Phase 34 | Complete |
| COURSE-ADMIN-01 | Phase 35 | Complete |
| COURSE-ADMIN-02 | Phase 35 | Complete |
| COURSE-ADMIN-03 | Phase 35 | Complete |
| COURSE-ADMIN-04 | Phase 35 | Complete |
| COURSE-SYNC-01 | Phase 36 | Complete |
| COURSE-SYNC-02 | Phase 36 | Complete |
| COURSE-SYNC-03 | Phase 36 | Complete |
| COURSE-MUTATE-03 | Phase 36 | Complete |
| COURSE-TEST-01 | Phase 37 | Complete |
| COURSE-TEST-02 | Phase 37 | Complete |

---

## Out of Scope

- Hard deleting course content files or curriculum assets from the disk/repository (all deletes are soft-delete deactivations with safety guard).
- Dynamic runtime creation of completely new course markdown curricula from the web interface (reserved for future CMS milestone).
- Modifying course lesson content or checkpoint configurations inside this lifecycle visibility scope.
