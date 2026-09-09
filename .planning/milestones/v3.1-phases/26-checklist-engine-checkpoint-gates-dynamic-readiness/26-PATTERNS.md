# Phase 26 Patterns: Checklist Engine, Checkpoint Gates & Dynamic Readiness

**Phase**: 26  
**Directory**: `.planning/phases/26-checklist-engine-checkpoint-gates-dynamic-readiness`  
**Research Source**: `.planning/phases/26-checklist-engine-checkpoint-gates-dynamic-readiness/26-RESEARCH.md`  
**Requirements**: `PRE-CHK-01`, `PRE-CHK-02`, `PRE-CHK-03`, `PRE-CHK-04`  

---

## 1. Executive Pattern Mapping Overview

Phase 26 delivers the interactive self-verification and readiness engine for the Hands-on Agentic AI course:
1. **13-Step Checklist Persistence Engine (`PRE-CHK-01`)**: Granular checkboxes embedded across Modules 1 to 4 persisting into `learnwith_ai_state_v1` and `learnwith_ai_checklist`.
2. **3 Checkpoint Verification Gates (`PRE-CHK-02`)**: Checkpoint 1 (Node.js/npm), Checkpoint 2 (9Router Dashboard), and Checkpoint 3 (Telegram Bot & User ID) with 3-state transitions (`pending`, `passed`, `failed`), interactive validation, and participant inputs.
3. **Dynamic Workshop Readiness Badge & Calculator (`PRE-CHK-03`)**: Weighted composite evaluation (60% checklists, 40% checkpoints) driving reactive badges ("🎉 SIAP MENGIKUTI WORKSHOP", "⚠️ PERLU TECHNICAL CLINIC", "⏳ MENUNGGU PENYELESAIAN LANGKAH").
4. **Safe Progress Reset Modal (`PRE-CHK-04`)**: Accessible confirmation dialog resetting progress and participant metadata with non-blocking toast notifications and zero cross-course pollution (`learnwith_word_state_v1` strictly preserved).

---

## 2. Target File to Analogs Mapping Table

| Target File to Create/Modify | Primary Codebase Analog | Key Patterns & Code to Copy |
| :--- | :--- | :--- |
| `app/hooks/usePretrainingState.ts` (NEW) | `assets/js/state.js` (lines 7–117, 640–788, 1004–1015)<br>`app/components/ui/Toast.tsx` (lines 19–49)<br>`app/components/course/ChecklistIsland.tsx` (lines 17–45) | State interface (`PretrainingState`), external subscriber/event store, SSR hydration safety, weighted progress formula (60% tasks + 40% CPs), multi-course key isolation. |
| `app/components/course/pretraining/CheckpointGateCard.tsx` (NEW) | `index.html` (lines 1978–2204)<br>`app/components/course/pretraining/CheckpointPreviewCard.tsx`<br>`assets/css/components.css` (lines 526–600, 668–685) | Card styling (`.checkpoint-gate-card.passed / .failed`), header row, badge icons, validation regexes (`/(bot\|_bot)$/i`, `/^\d+$/`), 3-button action group (`.btn-cp-action`). |
| `app/components/course/pretraining/PretrainingCheckpointsSection.tsx` (NEW) | `index.html` (lines 1965–2206)<br>`app/components/course/pretraining/PretrainingModulesSection.tsx` | Section container for CP1 (`#sec-checkpoint-1`), CP2 (`#sec-checkpoint-2`), CP3 (`#sec-checkpoint-3`), section title headers, layout. |
| `app/components/course/pretraining/PretrainingReadinessSection.tsx` (NEW) | `index.html` (lines 2210–2246)<br>`assets/css/components.css` (lines 838–910)<br>`assets/js/app.js` (lines 476–495) | Section `#sec-readiness-summary`, card `#card-readiness-status`, dynamic status badge (`.status-ready`, `.status-clinic`, `.status-pending`), border color styling, action triggers. |
| `app/components/course/pretraining/ResetProgressModal.tsx` (NEW) | `index.html` (lines 7362–7388)<br>`app/components/course/InstructorUnlockModal.tsx` (lines 28–109)<br>`assets/js/app.js` (lines 800–878) | Accessible dialog `#modal-reset-confirm`, focus trapping, `Escape` key and backdrop click handlers, confirmation button `#btn-confirm-reset`, toast trigger. |
| `app/components/course/pretraining/PretrainingModuleCard.tsx` (MODIFY) | `app/components/course/pretraining/PretrainingModuleCard.tsx` (lines 191–201)<br>`app/components/course/ChecklistIsland.tsx` (lines 118–141) | Replace `readOnly` checkbox with controlled `checked={!!checklists[step.taskId]}` and `onChange={() => toggleChecklist(step.taskId)}`. Add `.completed` class to `.step-checklist-action`. |
| `app/components/course/pretraining/PretrainingHero.tsx` (MODIFY) | `app/components/course/pretraining/PretrainingHero.tsx`<br>`app/data/pretrainingFoundation.ts` (lines 70–75) | Update stat card 4 (`0/13`) dynamically to reflect `completedTasks`/`totalTasks` ("X/13 Langkah Selesai") based on `usePretrainingState`. |
| `app/routes/course.ai.tsx` (MODIFY) | `app/routes/course.ai.tsx` (lines 80–90) | Mount `PretrainingCheckpointsSection`, `PretrainingReadinessSection`, and `ResetProgressModal` inside `mode === 'pretraining'`. |
| `tests/pretraining-checklist.test.js` (NEW) | `tests/checkpoint-engine.test.js`<br>`tests/word-modules.test.js`<br>`tests/pretraining-modules.test.js` | Node test runner (`node:test`, `node:assert`), Mock localStorage, 4 comprehensive test suites covering PRE-CHK-01..04. |

---

## 3. Concrete Architectural Patterns & Code Specifications

### 3.1 Hook & State Engine: `app/hooks/usePretrainingState.ts`

#### Analog Reference
From `assets/js/state.js` lines 7–117, 640–788, and `app/components/ui/Toast.tsx` lines 19–49.

#### Exact Data Types
```typescript
export interface PretrainingState {
  checklists: Record<string, boolean>
  checkpoints: Record<'cp-1' | 'cp-2' | 'cp-3', 'pending' | 'passed' | 'failed'>
  participantInfo: {
    nodeVersion: string
    telegramUsername: string
    telegramUserId: string
  }
}

export interface ProgressStats {
  totalTasks: number      // 13 official module tasks
  completedTasks: number
  totalCheckpoints: number // 3 checkpoints (cp-1, cp-2, cp-3)
  passedCheckpoints: number
  percentage: number      // 0..100 (weighted: 60% tasks + 40% CPs)
}

export interface ReadinessResult {
  status: 'ready' | 'clinic' | 'pending'
  label: string
  badgeClass: string
  description: string
  color: string
}
```

#### Official 13 Checklist Task IDs (`PRE-CHK-01`)
```typescript
export const PRETRAINING_CHECKLIST_TASK_IDS = [
  // Module 1 (3 tasks)
  'm1-check-node',
  'm1-verify-lts',
  'm1-check-npm',
  // Module 2 (4 tasks)
  'm2-install-pkg',
  'm2-start-service',
  'm2-open-dashboard',
  'm2-verify-local',
  // Module 3 (4 tasks - note: Step D has no checkbox)
  'm3-start-botfather',
  'm3-create-newbot',
  'm3-save-token-secure',
  'm3-get-userid',
  // Module 4 (2 tasks)
  'm4-open-console',
  'm4-verify-login',
] as const

export const DEFAULT_PRETRAINING_STATE: PretrainingState = {
  checklists: PRETRAINING_CHECKLIST_TASK_IDS.reduce((acc, id) => {
    acc[id] = false
    return acc
  }, {} as Record<string, boolean>),
  checkpoints: {
    'cp-1': 'pending',
    'cp-2': 'pending',
    'cp-3': 'pending',
  },
  participantInfo: {
    nodeVersion: '',
    telegramUsername: '',
    telegramUserId: '',
  },
}
```

#### Storage Keys & Multi-Course Isolation Policy
```typescript
export const STORAGE_KEY_AI_STATE = 'learnwith_ai_state_v1'
export const STORAGE_KEY_AI_CHECKLIST = 'learnwith_ai_checklist'
export const LEGACY_STORAGE_KEY_AI = 'pretraining_app_state_v1'

// Forbidden keys (Multi-Course Isolation invariant)
// Under NO circumstances may usePretrainingState read, modify, or delete:
// - 'learnwith_word_state_v1'
// - 'learnwith_word_unlocked'
```

#### Hydration & External Store Pattern
Follow the reactive subscriber pattern established in `app/components/ui/Toast.tsx`:
```typescript
import { useState, useEffect } from 'react'

let memoryState: PretrainingState = { ...DEFAULT_PRETRAINING_STATE }
const listeners = new Set<() => void>()

function emitChange() {
  for (const listener of listeners) {
    listener()
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('pretraining:stateChange', { detail: memoryState }))
  }
}

// Hydration on client boot:
export function initPretrainingState(): PretrainingState {
  if (typeof window === 'undefined') return DEFAULT_PRETRAINING_STATE
  try {
    const raw = localStorage.getItem(STORAGE_KEY_AI_STATE) || localStorage.getItem(LEGACY_STORAGE_KEY_AI)
    if (raw) {
      const parsed = JSON.parse(raw)
      memoryState = {
        checklists: { ...DEFAULT_PRETRAINING_STATE.checklists, ...(parsed.checklists || {}) },
        checkpoints: { ...DEFAULT_PRETRAINING_STATE.checkpoints, ...(parsed.checkpoints || {}) },
        participantInfo: { ...DEFAULT_PRETRAINING_STATE.participantInfo, ...(parsed.participantInfo || {}) },
      }
    }
  } catch {
    // Quota or access error handling
  }
  return memoryState
}
```

#### Progress & Readiness Calculation Formulas (`PRE-CHK-03`)
```typescript
export function calculatePretrainingProgress(state: PretrainingState): ProgressStats {
  const taskKeys = PRETRAINING_CHECKLIST_TASK_IDS
  const cpKeys: Array<'cp-1' | 'cp-2' | 'cp-3'> = ['cp-1', 'cp-2', 'cp-3']

  const totalTasks = taskKeys.length // 13
  const completedTasks = taskKeys.filter((k) => state.checklists[k] === true).length
  const totalCheckpoints = cpKeys.length // 3
  const passedCheckpoints = cpKeys.filter((k) => state.checkpoints[k] === 'passed').length

  const taskPercent = totalTasks > 0 ? (completedTasks / totalTasks) * 60 : 0
  const cpPercent = totalCheckpoints > 0 ? (passedCheckpoints / totalCheckpoints) * 40 : 0
  const percentage = Math.min(100, Math.round(taskPercent + cpPercent))

  return { totalTasks, completedTasks, totalCheckpoints, passedCheckpoints, percentage }
}

export function calculatePretrainingReadiness(
  progress: ProgressStats,
  checkpoints: PretrainingState['checkpoints']
): ReadinessResult {
  const cpValues = ['cp-1', 'cp-2', 'cp-3'].map((id) => checkpoints[id as 'cp-1'] || 'pending')

  const hasFailure = cpValues.some((v) => v === 'failed')
  const allCheckpointsPassed = cpValues.every((v) => v === 'passed')

  // Rule 1: ANY checkpoint failed -> Technical Clinic
  if (hasFailure) {
    return {
      status: 'clinic',
      label: '⚠️ PERLU TECHNICAL CLINIC',
      badgeClass: 'status-clinic',
      description:
        'Terdapat kendala teknis pada satu atau lebih gerbang checkpoint. Jangan khawatir! Silakan konsultasikan kendala Anda dengan instruktur atau ikuti sesi Technical Clinic sebelum kelas dimulai.',
      color: 'var(--color-danger, #ef4444)',
    }
  }

  // Rule 2: All 3 checkpoints passed AND overall progress >= 80% -> SIAP WORKSHOP
  if (allCheckpointsPassed && progress.percentage >= 80) {
    return {
      status: 'ready',
      label: '🎉 SIAP MENGIKUTI WORKSHOP',
      badgeClass: 'status-ready',
      description:
        'Selamat! Seluruh prasyarat dan gerbang checkpoint teknis telah berhasil Anda selesaikan. Laptop Anda 100% siap untuk praktik mengelola Google Calendar melalui Telegram bersama Hermes Agent saat workshop!',
      color: 'var(--color-success, #10b981)',
    }
  }

  // Rule 3: Otherwise -> MENUNGGU PENYELESAIAN LANGKAH (Pending)
  return {
    status: 'pending',
    label: '⏳ MENUNGGU PENYELESAIAN LANGKAH',
    badgeClass: 'status-pending',
    description:
      'Anda masih memiliki langkah atau verifikasi checkpoint yang belum selesai. Selesaikan Modul 1 sampai 5 dan verifikasi Checkpoint 1, 2, dan 3 untuk mencapai status kesiapan penuh.',
    color: 'var(--color-warning, #f59e0b)',
  }
}
```

---

### 3.2 Checkpoint Gate Card: `app/components/course/pretraining/CheckpointGateCard.tsx`

#### Analog Reference
From `index.html` lines 1978–2204 and `assets/css/components.css` lines 526–600.

#### Exact Component Structure
```tsx
export interface CheckpointGateCardProps {
  id: 'cp-1' | 'cp-2' | 'cp-3'
  num: number
  title: string
  subtitle: string
  criteriaTitle: string
  criteria: string[]
  status: 'pending' | 'passed' | 'failed'
  onStatusChange: (status: 'pending' | 'passed' | 'failed') => void
  children?: React.ReactNode // For participant input forms
}

export function CheckpointGateCard({
  id,
  num,
  title,
  subtitle,
  criteriaTitle,
  criteria,
  status,
  onStatusChange,
  children,
}: CheckpointGateCardProps) {
  const statusBadge =
    status === 'passed' ? (
      <span id={`status-card-${id}`} className="badge badge-pill badge-success">
        ✓ Lolos
      </span>
    ) : status === 'failed' ? (
      <span id={`status-card-${id}`} className="badge badge-pill badge-danger">
        ✕ Kendala
      </span>
    ) : (
      <span id={`status-card-${id}`} className="badge badge-pill badge-warning">
        Pending
      </span>
    )

  return (
    <div className={`checkpoint-gate-card ${status !== 'pending' ? status : ''}`} id={`card-${id}`}>
      <div className="checkpoint-header-row">
        <div className="checkpoint-title-wrap">
          <div className="checkpoint-badge-icon">{num}</div>
          <div>
            <h4 style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--text-primary)', marginBottom: '0.15rem' }}>
              {title}
            </h4>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>{subtitle}</span>
          </div>
        </div>
        {statusBadge}
      </div>

      <p className="card-body" dangerouslySetInnerHTML={{ __html: criteriaTitle }} />

      <div className="checklist-group" style={{ margin: '0.75rem 0 1rem 0' }}>
        {criteria.map((crit, idx) => (
          <div key={idx} className="checklist-item" style={{ cursor: 'default' }}>
            <span style={{ fontSize: '1.1rem', color: 'var(--color-success)', fontWeight: 'bold' }}>✓</span>
            <div className="checklist-label" dangerouslySetInnerHTML={{ __html: crit }} />
          </div>
        ))}
      </div>

      {children}

      <div className="cp-action-btn-group">
        <button
          type="button"
          className="btn btn-success btn-cp-action"
          onClick={() => onStatusChange('passed')}
        >
          <span>✓</span> Lolos Verifikasi
        </button>
        <button
          type="button"
          className="btn btn-outline-danger btn-cp-action"
          onClick={() => onStatusChange('failed')}
        >
          <span>✕</span> Ada Kendala (Gagal)
        </button>
        <button
          type="button"
          className="btn btn-secondary btn-cp-action btn-sm"
          onClick={() => onStatusChange('pending')}
        >
          <span>↺</span> Reset Status
        </button>
      </div>
    </div>
  )
}
```

#### Participant Input Validation Handlers for Checkpoint 1 & 3
```tsx
// Checkpoint 1: Node Version Form Input
<div className="form-group" style={{ marginTop: '1rem' }}>
  <label htmlFor="input-node-version" className="form-label">
    <span>📟</span> Catat Nomor Versi Node.js yang Tampil (Opsional):
  </label>
  <input
    type="text"
    id="input-node-version"
    className="form-input"
    placeholder="Contoh: v24.2.0"
    value={nodeVersion}
    onChange={(e) => onNodeVersionChange(e.target.value)}
    autoComplete="off"
  />
</div>

// Checkpoint 3: Telegram Username & User ID Form with Live Regex Validation
// Regex rules:
// - telegramUsername: /(bot|_bot)$/i
// - telegramUserId: /^\d+$/
```

---

### 3.3 Dynamic Readiness Section: `app/components/course/pretraining/PretrainingReadinessSection.tsx`

#### Analog Reference
From `index.html` lines 2210–2246 and `assets/css/components.css` lines 838–910.

#### Exact Component Structure
```tsx
export interface PretrainingReadinessSectionProps {
  readiness: ReadinessResult
  onOpenResetModal: () => void
}

export function PretrainingReadinessSection({
  readiness,
  onOpenResetModal,
}: PretrainingReadinessSectionProps) {
  return (
    <section id="sec-readiness-summary" className="content-section">
      <div className="section-header">
        <div className="section-title-wrap">
          <div
            className="section-badge-icon"
            style={{
              background: 'var(--color-success-subtle)',
              color: 'var(--color-success)',
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.1rem',
            }}
          >
            🏆
          </div>
          <div>
            <h3 className="section-title">Status Kelayakan Pre-Training Peserta</h3>
            <p className="section-desc">
              Evaluasi otomatis kelayakan laptop dan kesiapan akun Anda untuk mengikuti sesi workshop.
            </p>
          </div>
        </div>
      </div>

      <div
        className="card card-glass readiness-status-card"
        id="card-readiness-status"
        style={{ borderColor: readiness.color }}
      >
        <div style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>🎯</div>
        <h4 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-extrabold)', color: 'var(--text-primary)' }}>
          Hasil Evaluasi Kesiapan Mandiri
        </h4>

        <div>
          <div id="readiness-status-badge" className={`readiness-badge ${readiness.badgeClass}`}>
            {readiness.label}
          </div>
        </div>

        <p id="readiness-status-desc" className="readiness-desc">
          {readiness.description}
        </p>

        <div className="readiness-actions">
          <a href="#sec-readiness-report" className="btn btn-primary">
            <span>📋</span> Buka Form Laporan Kesiapan
          </a>
          <button
            type="button"
            id="btn-open-reset-modal"
            className="btn btn-outline-danger"
            onClick={onOpenResetModal}
          >
            <span>🔄</span> Reset Semua Progres
          </button>
        </div>
      </div>
    </section>
  )
}
```

---

### 3.4 Safe Progress Reset Modal: `app/components/course/pretraining/ResetProgressModal.tsx`

#### Analog Reference
From `index.html` lines 7362–7388 and `app/components/course/InstructorUnlockModal.tsx` lines 28–109.

#### Exact Component Structure
```tsx
export interface ResetProgressModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export function ResetProgressModal({ isOpen, onClose, onConfirm }: ResetProgressModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      id="modal-reset-confirm"
      className="modal-backdrop open"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-reset-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3
            id="modal-reset-title"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-danger)', fontSize: 'var(--font-size-lg)' }}
          >
            <span>⚠️</span> Atur Ulang Semua Progres?
          </h3>
        </div>
        <div className="modal-body" style={{ margin: '1.25rem 0', color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: 'var(--font-size-sm)' }}>
          <p>
            Tindakan ini akan <strong>menghapus seluruh progres</strong> yang tersimpan di browser Anda, termasuk:
          </p>
          <ul style={{ margin: '0.75rem 0 0.75rem 1.25rem' }}>
            <li>Semua tanda centang langkah persiapan dan modul praktik (13 langkah).</li>
            <li>Status kelulusan verifikasi Checkpoint 1, 2, dan 3.</li>
            <li>Data identitas peserta, versi Node.js, dan Telegram User ID.</li>
          </ul>
          <div className="alert-box alert-danger" style={{ margin: '1rem 0 0 0', padding: '0.75rem 1rem' }}>
            <div className="alert-icon">🛑</div>
            <div className="alert-content">
              <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600 }}>
                Peringatan: Data yang telah direset tidak dapat dipulihkan kembali.
              </p>
            </div>
          </div>
        </div>
        <div
          className="modal-footer"
          style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}
        >
          <button type="button" id="btn-cancel-reset" className="btn btn-secondary" onClick={onClose}>
            Batal
          </button>
          <button type="button" id="btn-confirm-reset" className="btn btn-danger" onClick={onConfirm} autoFocus>
            Ya, Reset Semua Progres
          </button>
        </div>
      </div>
    </div>
  )
}
```

---

### 3.5 Checkbox Wiring: `PretrainingModuleCard.tsx`

#### Analog Reference
`PretrainingModuleCard.tsx` lines 191–201 vs `ChecklistIsland.tsx` lines 118–141.

#### Modification Pattern
```tsx
// BEFORE (static readOnly in Phase 25):
{step.taskId && step.checklistLabel && (
  <label className="step-checklist-action">
    <input
      type="checkbox"
      className="checklist-checkbox"
      data-task-id={step.taskId}
      readOnly
    />
    <span className="checklist-label">{step.checklistLabel}</span>
  </label>
)}

// AFTER (interactive, controlled checkbox in Phase 26):
{step.taskId && step.checklistLabel && (
  <label className={`step-checklist-action ${checklists[step.taskId] ? 'completed' : ''}`}>
    <input
      type="checkbox"
      className="checklist-checkbox"
      data-task-id={step.taskId}
      checked={!!checklists[step.taskId]}
      onChange={() => onToggleChecklist(step.taskId)}
    />
    <span className="checklist-label">{step.checklistLabel}</span>
  </label>
)}
```

#### Step D in Modul 3 Parity Note
In `app/data/pretrainingModules.ts`, Step D of Modul 3 ("Buka Bot Anda & Tekan Start") does not have a checkbox in `index.html` line 1630. To maintain strict compliance with the 13-item standard (`PRE-CHK-01`):
- Step D should omit `taskId` and `checklistLabel`.
- If Step D already has `taskId: 'm3-start-chat'`, we ensure only the 13 official task IDs are counted in `calculateProgress` and `PRETRAINING_CHECKLIST_TASK_IDS`.

---

## 4. Test Structure & Suite Patterns (`tests/pretraining-checklist.test.js`)

Follow `tests/checkpoint-engine.test.js` and `tests/word-modules.test.js` patterns:

```javascript
/**
 * Automated Unit & Integration Tests for Pre-Training Checklist Engine (Phase 26)
 * Requirements: PRE-CHK-01, PRE-CHK-02, PRE-CHK-03, PRE-CHK-04
 */
const { describe, it, before, beforeEach } = require('node:test')
const assert = require('node:assert')

// Mock localStorage if in Node environment
if (typeof localStorage === 'undefined' || !localStorage.getItem) {
  global.localStorage = {
    _data: {},
    getItem(k) { return Object.prototype.hasOwnProperty.call(this._data, k) ? this._data[k] : null },
    setItem(k, v) { this._data[k] = String(v) },
    removeItem(k) { delete this._data[k] },
    clear() { this._data = {} }
  }
}

describe('Phase 26 Checklist Engine, Checkpoint Gates & Readiness Suite', () => {
  // Suite 1: 13-Step Checklist Engine (PRE-CHK-01)
  describe('Suite 1: 13-Step Checklist Engine (PRE-CHK-01)', () => {
    it('defines exactly 13 checklist task IDs across Modules 1 to 4', () => {})
    it('tracks step completion in state and persists to learnwith_ai_state_v1', () => {})
    it('computes module-specific completed counts and percentages', () => {})
    it('maintains strict state isolation from learnwith_word_state_v1', () => {})
  })

  // Suite 2: Checkpoint Verification Gates (PRE-CHK-02)
  describe('Suite 2: Checkpoint Verification Gates (PRE-CHK-02)', () => {
    it('initializes cp-1, cp-2, cp-3 to pending', () => {})
    it('updates checkpoint status to passed and failed', () => {})
    it('validates telegram username requiring bot or _bot suffix', () => {})
    it('validates telegram user ID strictly allowing numeric digits', () => {})
  })

  // Suite 3: Dynamic Readiness Calculation (PRE-CHK-03)
  describe('Suite 3: Dynamic Readiness Calculation (PRE-CHK-03)', () => {
    it('evaluates to pending when checkpoints are pending or progress < 80%', () => {})
    it('evaluates to clinic immediately when any checkpoint fails', () => {})
    it('evaluates to ready when all 3 checkpoints pass and progress >= 80%', () => {})
    it('calculates weighted composite score (60% tasks, 40% checkpoints)', () => {})
  })

  // Suite 4: Safe Reset Confirmation Engine (PRE-CHK-04)
  describe('Suite 4: Safe Reset Confirmation Engine (PRE-CHK-04)', () => {
    it('resets all 13 checklist items to false', () => {})
    it('resets checkpoints cp-1..cp-3 to pending', () => {})
    it('clears participant form inputs', () => {})
    it('leaves Course 2 keys completely untouched', () => {})
  })
})
```

---

## 5. Critical Invariants & Anti-Patterns Checklist

| Danger Zone | Anti-Pattern to AVOID | Correct Pattern to FOLLOW |
| :--- | :--- | :--- |
| **Multi-Course Pollution** | Modifying `localStorage.clear()` or wiping all keys on reset. | Explicitly reset ONLY `learnwith_ai_state_v1` and `learnwith_ai_checklist`. Never mutate `learnwith_word_state_v1` or `learnwith_word_unlocked`. |
| **Hydration Mismatch** | Reading `localStorage` during initial React render on server. | Read initial state in client effects (`useEffect`) or hydration-safe store (`useSyncExternalStore` with server fallback). |
| **Uncounted Task ID** | Counting 14 tasks because of Step D in Modul 3. | Strict 13-task invariant (`PRETRAINING_CHECKLIST_TASK_IDS.length === 13`) across all modules. |
| **Hardcoded Color Strings** | Using inline `#10b981` or `#ef4444` directly in styles without CSS variables. | Use CSS custom properties: `var(--color-success)`, `var(--color-danger)`, `var(--color-warning)`. |
| **Blocking Browser Dialogs** | Using native `window.confirm()` or `window.alert()` for reset. | Render accessible DOM dialog `#modal-reset-confirm` and non-blocking toast notifications via `showToast()`. |
