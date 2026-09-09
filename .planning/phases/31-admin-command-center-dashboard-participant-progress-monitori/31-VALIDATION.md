---
phase: "31"
slug: "admin-command-center-dashboard-participant-progress-monitoring"
status: draft
nyquist_compliant: true
wave_0_complete: false
created: "2026-09-09"
---

# Phase 31 — Validation Strategy: Admin Command Center Dashboard & Participant Progress Monitoring

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Node.js Test Runner (`node --test`) |
| **Config file** | `package.json` |
| **Quick run command** | `node --test tests/admin-dashboard.test.js` |
| **Full suite command** | `node --test tests/*.test.js` |
| **Estimated runtime** | ~3 seconds |

---

## Test Coverage Gates

### Gate 1: Aggregate KPI Metrics Engine (ADMIN-DASH-01)
- Verify `getTelemetryStats()` computes correct `totalParticipants`, `activeParticipants` (within 15m window).
- Verify checkpoint completion rate percentage calculation across all modules.
- Verify average quiz score calculation across quiz takers only (safely excluding non-takers).
- Verify ready ratio and clinic ratio calculations.
- Zero-division safety: ensure empty participant registry produces valid zero stats without `NaN` or exceptions.

### Gate 2: Multi-Criteria Filtering & Search Engine (ADMIN-DASH-02)
- Filter by `courseId` (`all`, `ai`, `word`).
- Filter by `readinessStatus` (`all`, `ready`, `clinic`, `pending`).
- Case-insensitive search by participant name, agency/instansi, and participant ID.
- Combined filtering (e.g., `word` + `clinic` + search query).
- Active vs Idle detection based on `lastActiveAt`.

### Gate 3: Detail Inspector Data Integrity (ADMIN-DASH-03)
- Verify single participant lookup by ID.
- Verify granular checkpoint statuses (Checkpoints 1–3) correctly reflect record data.
- Verify quiz evaluation scores and pass/fail thresholds.
- Verify granular module task checklist mapping (`taskChecklist`) for AI and Word modules.

### Gate 4: 1-Click Export Engine (ADMIN-DASH-04)
- Verify CSV generation contains UTF-8 BOM (`\uFEFF`) for Microsoft Excel compatibility.
- Verify RFC 4180 double-quote escaping for values with commas, double quotes, and line breaks.
- Verify formula injection sanitization (protecting fields starting with `=`, `+`, `-`, `@`).
- Verify JSON export formatting and data fidelity.

### Gate 5: Security & Zero Regression (ADMIN-QA-01, ADMIN-QA-02)
- Verify client dashboard components and export utilities do not import or leak server secrets (`ADMIN_PASSKEY`, `SESSION_SECRET`, etc.).
- 100% pass on all existing test suites (`tests/telemetry.test.js`, etc.).

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Secure Behavior | Test Type | Automated Command | Status |
|---------|------|------|-------------|-----------------|-----------|-------------------|--------|
| 31-01-01 | 01 | 1 | ADMIN-DASH-01 | Safe schema & store defaults | unit | `node --test tests/admin-dashboard.test.js` | ⬜ pending |
| 31-01-02 | 01 | 1 | ADMIN-DASH-01 | Aggregate KPI stats calculation | unit | `node --test tests/admin-dashboard.test.js` | ⬜ pending |
| 31-01-03 | 01 | 2 | ADMIN-DASH-02 | Filter & search table logic | unit/integration | `node --test tests/admin-dashboard.test.js` | ⬜ pending |
| 31-02-01 | 02 | 1 | ADMIN-DASH-03 | Participant detail modal data integrity | unit/integration | `node --test tests/admin-dashboard.test.js` | ⬜ pending |
| 31-02-02 | 02 | 1 | ADMIN-DASH-04 | CSV/JSON export sanitization & escaping | unit | `node --test tests/admin-dashboard.test.js` | ⬜ pending |
| 31-02-03 | 02 | 2 | ADMIN-QA-02 | Full suite zero regression | regression | `node --test tests/*.test.js` | ⬜ pending |
