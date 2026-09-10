# Roadmap: learnwith — Interactive Training Platform (Multi-Course)

## Milestones

- ✅ **v1.0 Pre-Training Interactive Web App (Agentic AI)** - Phases 1-4 (shipped 2026-09-03) — [Archive](milestones/v1.0-ROADMAP.md)
- ✅ **v1.1 Live Workshop Guide (Agentic AI Hari-H)** - Phases 5-8 (shipped 2026-09-07) — [Archive](milestones/v1.1-ROADMAP.md)
- ✅ **v2.0 Multi-Course Platform & Modul Pengolahan Kata Tingkat Lanjut** - Phases 9-12 (shipped 2026-09-07) — [Archive](milestones/v2.0-ROADMAP.md)
- ✅ **v2.1 Google NotebookLM-Inspired UI/UX Overhaul & Workspace Architecture** - Phases 13-15 (shipped 2026-09-07) — [Archive](milestones/v2.1-ROADMAP.md)
- ✅ **v2.2 Application Security Hardening & Anti-Breach Protection** - Phases 16-18 (shipped 2026-09-07) — [Archive](milestones/v2.2-phases)
- ✅ **v3.0 TanStack Start Full-Document SSR & File-Based Router Migration** - Phases 19-23 (shipped 2026-09-08) — [Archive](milestones/v3.0-ROADMAP.md)
- ✅ **v3.1 Pre-Training Parity in TanStack Start** - Phases 24-28 (shipped 2026-09-09) — [Archive](milestones/v3.1-ROADMAP.md)
- ✅ **v3.2 Admin Command Center, Telemetry & Authentication** - Phases 29-33 (shipped 2026-09-09) — [Archive](milestones/v3.2-ROADMAP.md)

---

## Current Milestone: v3.3 Admin Course Lifecycle & Visibility Management

**Phases:** 34–37 (4 phases)  
**Requirements mapped:** 15/15 (100% covered)  

| # | Phase | Goal | Requirements | Success Criteria |
|---|-------|------|--------------|------------------|
| 34 | [x] Course Lifecycle Schema & Server Store Architecture | Define strongly-typed course status schema and server store with Master Admin RPCs | `COURSE-STATUS-01..03`, `COURSE-MUTATE-01..02` | 3/3 ✓ |
| 35 | [ ] Admin Management UI & Action Controls | Build dedicated "Manajemen Kursus" view in AdminShell with Show/Hide/Archive/Delete buttons & confirmation modal | `COURSE-ADMIN-01..04` | 4 |
| 36 | [ ] Frontpage Catalog & Header Switcher Reactive Sync | Filter public courses reactively on `/` and navigation switcher based on lifecycle status | `COURSE-SYNC-01..03`, `COURSE-MUTATE-03` | 3 |
| 37 | [ ] End-to-End Verification & Zero-Regression Audit | Comprehensive unit, RPC, and integration tests verifying lifecycle transitions and zero regression | `COURSE-TEST-01..02` | 2 |

### Phase Details

#### Phase 34: Course Lifecycle Schema & Server Store Architecture (Complete: 2026-09-10)
- **Goal:** Establish typed course status model (`active`, `hidden`, `archived`, `deleted`) and server registry with Master Admin RPCs.
- **Requirements:** `COURSE-STATUS-01`, `COURSE-STATUS-02`, `COURSE-STATUS-03`, `COURSE-MUTATE-01`, `COURSE-MUTATE-02`
- **Success Criteria:**
  1. `CourseStatus` enum/schema defined with transition validation.
  2. `courseLifecycleStore.ts` manages in-memory course registry with mutation audit log.
  3. `adminGetCoursesStatusFn` and `adminUpdateCourseStatusFn` enforce Master Admin auth token.

#### Phase 35: Admin Management UI & Action Controls
- **Goal:** Create dedicated course management tab in Admin Command Center with status action buttons and delete safety guard.
- **Requirements:** `COURSE-ADMIN-01`, `COURSE-ADMIN-02`, `COURSE-ADMIN-03`, `COURSE-ADMIN-04`
- **Success Criteria:**
  1. Tab "Manajemen Kursus" rendered in `AdminShell` alongside existing tabs.
  2. Action buttons `Tampilkan` (Show), `Sembunyikan` (Hide), and `Arsipkan` (Archive) toggle course state with instant feedback.
  3. Status filter tabs (`Semua`, `Aktif`, `Tersembunyi`, `Diarsipkan`) allow quick list inspection.
  4. Confirmation modal prevents accidental soft-deletion.

#### Phase 36: Frontpage Catalog & Header Switcher Reactive Sync
- **Goal:** Ensure Frontpage Hub (`/`) and navigation course switchers reactively reflect live course visibility.
- **Requirements:** `COURSE-SYNC-01`, `COURSE-SYNC-02`, `COURSE-SYNC-03`, `COURSE-MUTATE-03`
- **Success Criteria:**
  1. `getCoursesList()` / loader consumes lifecycle state: only `active` courses appear on `/`.
  2. Global header switcher omits hidden, archived, and deleted courses from navigation.
  3. Direct URLs for hidden courses remain accessible, while deleted courses show appropriate notice.

#### Phase 37: End-to-End Verification & Zero-Regression Audit
- **Goal:** Validate all course lifecycle actions, state transitions, security boundaries, and zero regression across the platform.
- **Requirements:** `COURSE-TEST-01`, `COURSE-TEST-02`
- **Success Criteria:**
  1. Unit and RPC tests verify all status transitions, invalid transition rejections, and unauthorized mutation denials.
  2. 100% test suite pass rate (242+ tests) with zero regression on `/`, `/course/ai`, `/course/word`, and `/admin`.

---

## Phases Archive

<details>
<summary>✅ v3.2 Admin Command Center, Telemetry & Authentication (Phases 29-33) — SHIPPED 2026-09-09</summary>

- [x] Phase 29: Master Admin Authentication, Route Protection & Google OAuth Architecture (2/2 plans) — completed 2026-09-09
- [x] Phase 30: Server Telemetry Ingestion API & Participant Background Client (2/2 plans) — completed 2026-09-09
- [x] Phase 31: Admin Command Center Dashboard & Participant Progress Monitoring (2/2 plans) — completed 2026-09-09
- [x] Phase 32: Workshop Access Passkey Management & Troubleshooting Audit Hub (2/2 plans) — completed 2026-09-09
- [x] Phase 33: Global Platform Configuration, Announcement Banner & E2E Zero-Regression (2/2 plans) — completed 2026-09-09

</details>

<details>
<summary>✅ v3.1 Pre-Training Parity in TanStack Start (Phases 24-28) — SHIPPED 2026-09-09</summary>

- [x] Phase 24: Pre-Training Foundation Sections & Data Extraction (2/2 plans) — completed 2026-09-08
- [x] Phase 25: Interactive Modules 1–5 & 1-Click Copy Engine (2/2 plans) — completed 2026-09-09
- [x] Phase 26: Checklist Engine, Checkpoint Gates & Dynamic Readiness (2/2 plans) — completed 2026-09-09
- [x] Phase 27: Troubleshooting Hub & Secret Token Redaction Assistant (2/2 plans) — completed 2026-09-09
- [x] Phase 28: Laporan Kesiapan Generator, Sidebar Sync & E2E Zero-Regression (2/2 plans) — completed 2026-09-09

</details>

<details>
<summary>✅ v3.0 TanStack Start Full-Document SSR & File-Based Router Migration (Phases 19-23) — SHIPPED 2026-09-08</summary>

- [x] Phase 19: TanStack Start & Full-Stack Tooling Foundation (4/4 plans) — completed 2026-09-08
- [x] Phase 20: File-Based Routes & Search Params Validation (3/3 plans) — completed 2026-09-08
- [x] Phase 21: Typed Route Loaders, Full-Document SSR & Progressive Streaming (3/3 plans) — completed 2026-09-08
- [x] Phase 22: Typed Server Functions & Boundary Isolation (3/3 plans) — completed 2026-09-08
- [x] Phase 23: Route-Level SSR Optimization & Production Docker Target (2/2 plans) — completed 2026-09-08

</details>
