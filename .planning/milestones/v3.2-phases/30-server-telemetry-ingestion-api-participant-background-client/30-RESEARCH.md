# Phase 30 Research: Server Telemetry Ingestion API & Participant Background Client

## 1. Executive Summary

Phase 30 establishes the foundational telemetry architecture for the LearnWith platform. While Phase 29 delivered the Master Admin Authentication and Route Protection, Phase 30 builds the participant heartbeat and progress ingestion pipeline. This allows instructors and system administrators to observe real-time workshop progress, completion rates, and learning friction across both workshops (`/course/ai` and `/course/word`) without introducing heavy external databases or disrupting the participant learning experience.

---

## 2. Telemetry Architecture Analysis

### Current Client-Side State:
1. **Course 1 (`/course/ai`):**
   - Managed via `app/hooks/usePretrainingState.ts`.
   - Stores 13 module tasks, 3 checkpoints (`cp-1`, `cp-2`, `cp-3`), weighted progress (60% tasks + 40% checkpoints), readiness status (`ready`, `clinic`, `pending`), and participant info (`name`, `nodeVersion`, `telegramUsername`, `telegramUserId`).
   - Persists to `localStorage['learnwith_ai_state_v1']`.
2. **Course 2 (`/course/word`):**
   - Managed via `assets/js/state.js` and React route `app/routes/course.word.tsx`.
   - Stores 28 checklist tasks across 4 chapters, 3 BPSDM checkpoints, Chapter V 20-question quiz answers/scores, and rubrics.
   - Persists to `localStorage['learnwith_word_state_v1']`.

### Server-Side Requirements:
1. **Validation & Isolation:**
   - Strict Zod schema validation using isomorphic schemas in `app/schemas/telemetry.ts`.
   - Prohibit transmission or persistence of sensitive participant credentials (e.g. Telegram bot tokens, API keys, passwords).
2. **Structured Store:**
   - In-memory structured telemetry database (`app/server/telemetryStore.ts`) with index by `participantId`.
   - Supports atomic updates, filter queries (`courseId`, `readiness`, `search`), aggregation metrics, and default seed data for immediate offline demonstration.
3. **RPC Server Functions:**
   - TanStack Start `createServerFn({ method: 'POST' })` for `ingestParticipantTelemetryFn`.
   - TanStack Start `createServerFn({ method: 'GET' })` for `getParticipantTelemetryListFn` (consumed by Phase 31 dashboard).
4. **Resilient Background Client:**
   - Non-blocking, asynchronous reporter with debouncing (e.g., 500ms debounce) on task changes.
   - Silent error suppression: network failures must never show error toasts or interrupt participant flow.
   - Persistent anonymous client identifier generated via UUIDv4 or random 32-char hex string in `localStorage['learnwith_client_id']`.

---

## 3. Data Contract & Schema Specifications

```typescript
// app/schemas/telemetry.ts
export const participantTelemetrySchema = z.object({
  participantId: z.string().min(1).max(64),
  name: z.string().trim().default('Peserta'),
  agency: z.string().trim().default('-'),
  courseId: z.enum(['ai', 'word']),
  progressPercent: z.number().min(0).max(100),
  completedTasks: z.number().min(0),
  totalTasks: z.number().min(1),
  checkpoints: z.record(z.enum(['pending', 'passed', 'failed'])),
  readinessStatus: z.enum(['ready', 'clinic', 'pending']),
  quizScore: z.number().min(0).max(100).optional(),
  clientTimestamp: z.number(),
})

export const telemetryIngestResultSchema = z.object({
  success: z.boolean(),
  receivedAt: z.number(),
  participantId: z.string(),
})

export const telemetryQueryFilterSchema = z.object({
  courseId: z.enum(['all', 'ai', 'word']).default('all'),
  readiness: z.enum(['all', 'ready', 'clinic', 'pending']).default('all'),
  search: z.string().optional(),
})

export const telemetryDashboardStatsSchema = z.object({
  totalParticipants: z.number(),
  activeParticipants: z.number(),
  checkpointCompletionRate: z.number(),
  averageQuizScore: z.number(),
  readyRatio: z.number(),
  clinicRatio: z.number(),
})
```

---

## 4. Key Decisions & Trade-offs

1. **In-Memory Store vs External DB:**
   - *Decision:* Use an in-memory Map in `app/server/telemetryStore.ts` with seed records.
   - *Rationale:* learnwith is a lightweight, zero-dependency workshop environment designed to run standalone in Docker or desktop environments without requiring a PostgreSQL/MongoDB setup.
2. **Push Model via `createServerFn`:**
   - *Decision:* Use TanStack Start RPC functions directly rather than raw WebSockets or external SSE brokers.
   - *Rationale:* Ensures complete type safety, native bundling, and seamless integration with existing server function security infrastructure.
3. **Debounced Client-side Ingestion:**
   - *Decision:* Debounce client updates by 500ms–1000ms.
   - *Rationale:* Prevents rapid checkbox toggling from flooding server endpoints while guaranteeing that checkpoint completions and quiz submissions are reported immediately.

---

## 5. Verification & Test Plan

- **Schema Validation Tests:** Ensure malformed payloads (negative progress, missing participantId) are cleanly rejected with Zod issues.
- **Store Operations Tests:** Verify record insertion, idempotent updates by `participantId`, course filtering, readiness filtering, and stats aggregation.
- **Server Function RPC Tests:** Test `ingestParticipantTelemetryFn` and `getParticipantTelemetryListFn`.
- **Client Helper Resilience Tests:** Simulate network error and verify no thrown uncaught exceptions.
- **AST Secret Quarantine:** Confirm telemetry payloads never include secrets or sensitive fields.
