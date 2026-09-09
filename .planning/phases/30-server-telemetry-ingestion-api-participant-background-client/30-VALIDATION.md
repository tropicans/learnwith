# Phase 30 Validation Plan: Server Telemetry Ingestion API & Participant Background Client

## Test Coverage Gates

### Gate 1: Telemetry Schema & Payload Validation (ADMIN-TELEM-02)
- Validate `participantTelemetrySchema`:
  - Course ID: only `'ai'` and `'word'` accepted.
  - Progress percentage: must be between 0 and 100.
  - Readiness status: must be `'ready' | 'clinic' | 'pending'`.
  - Negative tests: reject negative progress percent, reject empty participant ID, reject missing timestamps.

### Gate 2: In-Memory Telemetry Store (ADMIN-TELEM-02)
- Record insertion and idempotency: updating existing `participantId` updates fields and `lastActiveAt` without duplicating rows.
- Filter queries: filter by `courseId` ('ai' vs 'word'), filter by readiness status ('ready' vs 'clinic'), case-insensitive search by participant name or agency.
- Aggregation calculation: verify accurate calculation of total, active, checkpoint completion rate, average quiz score, and ready/clinic ratios.

### Gate 3: Server Functions RPC (ADMIN-TELEM-01)
- `ingestParticipantTelemetryFn`: POST method accepts valid telemetry and returns success with timestamp.
- `getParticipantTelemetryListFn`: GET method returns telemetry records and summary stats.

### Gate 4: Non-Blocking Background Client & Course Integration (ADMIN-TELEM-03)
- `telemetryClient`: verifies debounced submission, persistent client identifier, and silent error handling (no unhandled rejections).
- Integration: hooks into `usePretrainingState` (Course 1) and Course 2 state changes.

### Gate 5: Security & Zero Regression (ADMIN-QA-01, ADMIN-QA-02)
- AST boundary audit ensuring telemetry modules never import node secrets or leak server state to client routes.
- 100% passing tests on full suite (`npm test`).
