# Phase 37: End-to-End Verification & Zero-Regression Audit - Pattern Map

## File Classification

| Target File | Action | Role | Data Flow | Closest Analog |
|---|---|---|---|---|
| `app/server/courseLifecycleStore.ts` | Modify | Server Store | In-memory registry with defensive copy getters -> protects internal state from reference leakage | `app/server/courseLifecycleStore.ts` |
| `tests/course-lifecycle-e2e.test.js` | Create | Test Suite | Exhaustive verification across all 6 lifecycle layers -> asserts zero defect & zero regression | `tests/course-lifecycle-sync.test.js`, `tests/course-lifecycle-rpc.test.js` |
| `.planning/REQUIREMENTS.md` | Modify | Documentation | Flips `COURSE-TEST-01` and `COURSE-TEST-02` to `[x]` | `.planning/REQUIREMENTS.md` |
| `.planning/ROADMAP.md` | Modify | Documentation | Marks Phase 37 complete and summarizes v3.3 milestone achievement | `.planning/ROADMAP.md` |
| `.planning/STATE.md` | Modify | Documentation | Records Phase 37 completion and key decisions in project memory | `.planning/STATE.md` |

---

## Pattern Assignments

### 1. `app/server/courseLifecycleStore.ts` (Store Immutability Hardening)
- **Role:** Server Store (`COURSE-TEST-01`)
- **Analog:** Existing `app/server/courseLifecycleStore.ts` lines 44-55

#### Existing Code (Vulnerable to Reference Mutation):
```ts
export function getCourseLifecycleRecords(): CourseLifecycleRecord[] {
  return Array.from(courseStore.values())
}

export function getCourseLifecycleRecord(id: string): CourseLifecycleRecord | undefined {
  return courseStore.get(id)
}

export function getCourseLifecycleAuditLog(): CourseLifecycleAuditEntry[] {
  return [...auditLog]
}
```

#### Hardened Pattern (Defensive Copies):
```ts
export function getCourseLifecycleRecords(): CourseLifecycleRecord[] {
  return Array.from(courseStore.values()).map((r) => ({ ...r }))
}

export function getCourseLifecycleRecord(id: string): CourseLifecycleRecord | undefined {
  const rec = courseStore.get(id)
  return rec ? { ...rec } : undefined
}

export function getCourseLifecycleAuditLog(): CourseLifecycleAuditEntry[] {
  return auditLog.map((entry) => ({ ...entry }))
}
```

---

### 2. `tests/course-lifecycle-e2e.test.js` (E2E Verification Suite)
- **Role:** Test Suite (`COURSE-TEST-01`, `COURSE-TEST-02`)
- **Analog:** `tests/course-lifecycle-sync.test.js` and `tests/course-lifecycle-rpc.test.js`

#### Structure:
```js
import test, { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

// Load modules via dynamic imports or node-compatible loaders
// 6 Suites:
// Suite 1: Store Immutability & Reference Defense
// Suite 2: Complete 4x4 State Transition Matrix
// Suite 3: Server Mutation RPCs & Audit Logging
// Suite 4: Master Admin Authorization & Security Boundaries
// Suite 5: Public Catalog & Reactive Discovery Invariants
// Suite 6: Direct Workspace Route UX & Passkey Gate Preservation
```

---

### 3. Documentation Sync Pattern
- **Role:** Quality Gates & Project Memory
- **Analogs:** Prior phase summaries in `.planning/phases/36-frontpage-catalog-header-switcher-reactive-sync/36-03-SUMMARY.md`