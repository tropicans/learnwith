# Phase 26 Research: Checklist Engine, Checkpoint Gates & Dynamic Readiness

**Phase**: 26  
**Directory**: `.planning/phases/26-checklist-engine-checkpoint-gates-dynamic-readiness`  
**Goal**: Research and architect the self-verification engine for Agentic AI Pre-Training: 13-step checklist persistence (`learnwith_ai_checklist` / `learnwith_ai_state_v1`), 3 Checkpoint Gates (Checkpoint 1, 2, 3), real-time readiness status evaluation ("SIAP WORKSHOP" vs "PERLU TECHNICAL CLINIC" vs "MENUNGGU PENYELESAIAN LANGKAH"), and safe progress reset modal with zero regressions across multi-course isolation.  
**Requirements Covered**: `PRE-CHK-01`, `PRE-CHK-02`, `PRE-CHK-03`, `PRE-CHK-04`  
**Dependencies**: Phase 25 (Interactive Modules 1–5 & 1-Click Copy Engine)

---

## 1. Executive Summary & Scope

Phase 26 bridges the static module presentation built in Phase 25 with interactive participant state tracking and milestone verification.

In the baseline prototype (`index.html` lines 1820–2250, `assets/js/state.js`, `assets/js/app.js`), participants actively verified their progress through three interlocking systems:
1. **13 Step Checklist Items (`PRE-CHK-01`)**: Granular checkboxes embedded inside Module 1 through Module 4 (3 tasks in M1, 4 tasks in M2, 4 tasks in M3, 2 tasks in M4) that automatically track step completion and persist across browser reloads.
2. **3 Checkpoint Verification Gates (`PRE-CHK-02`)**: Three structured checkpoint gate sections (`#sec-checkpoint-1`, `#sec-checkpoint-2`, `#sec-checkpoint-3`) allowing participants to test and confirm runtime availability (Node.js & npm LTS, 9Router local dashboard on port 20128, Bot Telegram with secure token and numerical User ID), record participant metadata (Node version, Bot username, User ID), and mark status (`passed`, `failed`, or `pending`).
3. **Dynamic Workshop Readiness Badge & Calculator (`PRE-CHK-03`)**: A reactive evaluation card (`#sec-readiness-summary`, `#card-readiness-status`) computing composite readiness based on checkpoint outcomes and checklist completion percentage (weighted formula: 60% checklist items, 40% checkpoints), updating visual badges ("🎉 SIAP MENGIKUTI WORKSHOP" vs "⚠️ PERLU TECHNICAL CLINIC" vs "⏳ MENUNGGU PENYELESAIAN LANGKAH").
4. **Safe Progress Reset Modal (`PRE-CHK-04`)**: A dedicated confirmation dialog (`#modal-reset-confirm`) that securely wipes progress, resets all checklist and checkpoint states to pending, clears participant form inputs, and provides non-blocking toast feedback without corrupting Course 2 (`learnwith_word_state_v1`) or legacy state.

This research establishes the exact data structures, component breakdown, React state management hooks, localStorage persistence isolation, and automated test strategies needed for Phase 26.

---

## 2. Requirements & Source Analysis

### 2.1 Requirements Mapping

| Requirement | Scope | Baseline Source | TanStack Start React Target |
| :--- | :--- | :--- | :--- |
| **`PRE-CHK-01`** | 13-step checklist across Modul 1–4 with persistent localStorage storage | `index.html` lines 1154–1775, `assets/js/state.js` | `PretrainingModuleCard.tsx`, `usePretrainingState.ts`, localStorage key `learnwith_ai_checklist` / `learnwith_ai_state_v1` |
| **`PRE-CHK-02`** | 3 Checkpoint Gates (CP1: Node.js, CP2: 9Router, CP3: Telegram Bot) with manual/auto verification | `index.html` lines 1965–2160 (`sec-checkpoint-1..3`), `assets/js/app.js` | `PretrainingCheckpointsSection.tsx`, `CheckpointGateCard.tsx` |
| **`PRE-CHK-03`** | Dynamic Readiness Status Badge & Progress Tracker (Ready vs Clinic vs Pending) | `index.html` lines 2165–2240 (`sec-readiness-summary`), `assets/js/state.js` | `PretrainingReadinessSection.tsx`, `PretrainingHero.tsx` stats sync |
| **`PRE-CHK-04`** | Safe Progress Reset Modal with confirmation & non-corrupting state clear | `index.html` lines 7430–7470 (`modal-reset-confirm`), `assets/js/app.js` | `ResetProgressModal.tsx` |

---

## 3. Deep Architectural Investigation

### 3.1 The 13 Checklist Items Breakdown

Investigation of `index.html` and `assets/js/state.js` confirms the exact 13 step checklist task IDs distributed across the first 4 modules:

| Module | Step Node | Task ID | Label & Verification Criteria |
| :--- | :---: | :--- | :--- |
| **Modul 1** | A | `m1-check-node` | Langkah A selesai: Perintah `node --version` menghasilkan versi v24/v22 |
| **Modul 1** | B | `m1-verify-lts` | Langkah B selesai: Node.js LTS terpasang via installer .msi dengan Add to PATH |
| **Modul 1** | C | `m1-check-npm` | Langkah C selesai: Perintah `npm --version` menghasilkan nomor versi |
| **Modul 2** | A | `m2-install-pkg` | Langkah A selesai: Perintah `npm install -g 9router` sukses tanpa error |
| **Modul 2** | B | `m2-start-service` | Langkah B selesai: Perintah `9router` berjalan aktif dan jendela terminal tetap terbuka |
| **Modul 2** | C | `m2-open-dashboard` | Langkah C selesai: Dashboard `http://localhost:20128` berhasil dibuka dan login `123456` |
| **Modul 2** | D | `m2-verify-local` | Langkah D selesai: Memahami kendali `Ctrl + C` untuk menghentikan & menjalankan kembali |
| **Modul 3** | A | `m3-start-botfather` | Langkah A selesai: Membuka akun resmi `@BotFather` (centang biru) |
| **Modul 3** | B | `m3-create-newbot` | Langkah B selesai: Membuat bot baru dengan `/newbot` dan username unik berakhiran `bot` |
| **Modul 3** | C | `m3-save-token-secure` | Langkah C selesai: Bot Token tersimpan aman (tidak pernah dibagikan ke pihak lain) |
| **Modul 3** | E | `m3-get-userid` | Langkah E selesai: Memperoleh nomor Telegram User ID (hanya angka) dari `@userinfobot` |
| **Modul 4** | A | `m4-open-console` | Langkah A selesai: Membuka `https://console.cloud.google.com` di browser |
| **Modul 4** | B | `m4-verify-login` | Langkah B selesai: Login akun Google terverifikasi & memahami batasan pra-kelas |

> [!NOTE]
> In `app/data/pretrainingModules.ts`, Step D of Modul 3 ("Buka Bot Anda & Tekan Start") originally contained an extra task ID `m3-start-chat`. However, `index.html` line 1630 and `assets/js/state.js` omit a checkbox for step D (as bot responses are not expected until live workshop). To maintain 100% parity with the 13-item standard specified in `PRE-CHK-01` and `checkpoint-engine.test.js`, Modul 3 contains exactly 4 checklist tasks (`m3-start-botfather`, `m3-create-newbot`, `m3-save-token-secure`, `m3-get-userid`).

### 3.2 The 3 Checkpoint Gates Specification

Each Checkpoint Gate in `index.html` (`#sec-checkpoint-1`, `#sec-checkpoint-2`, `#sec-checkpoint-3`) is an interactive card with 3 states (`passed`, `failed`, `pending`), action buttons, verification criteria, and participant inputs:

#### Checkpoint 1: Node.js & npm Siap (`#sec-checkpoint-1`, `#card-cp-1`)
- **Title**: Gerbang Checkpoint 1: Node.js & npm Siap
- **Subtitle**: Prasyarat dasar sebelum menjalankan 9Router
- **Criteria**:
  1. `node --version` menghasilkan output nomor versi LTS (contoh: `v24.x.x` atau `v22.x.x`).
  2. `npm --version` menghasilkan output nomor versi (contoh: `10.x.x` atau `9.x.x`).
- **Participant Input**: `nodeVersion` (e.g. `v24.2.0`, optional).
- **Actions**:
  - `btn-success`: "✓ Lolos Verifikasi" (`status = "passed"`)
  - `btn-outline-danger`: "✕ Ada Kendala (Gagal)" (`status = "failed"`)
  - `btn-secondary`: "↺ Reset Status" (`status = "pending"`)

#### Checkpoint 2: 9Router Dashboard Berjalan (`#sec-checkpoint-2`, `#card-cp-2`)
- **Title**: Gerbang Checkpoint 2: 9Router Dashboard Berjalan
- **Subtitle**: Perute model AI penghubung Hermes Agent
- **Criteria**:
  1. Jendela PowerShell tempat Anda menjalankan `9router` tetap terbuka dan tidak tertutup.
  2. Alamat `http://localhost:20128` berhasil terbuka di browser.
  3. Berhasil login menggunakan kata sandi awal `123456` dan melihat dashboard utama 9Router.
- **Actions**: Identical 3 action buttons (`passed`, `failed`, `pending`).

#### Checkpoint 3: Bot Telegram & User ID Terverifikasi (`#sec-checkpoint-3`, `#card-cp-3`)
- **Title**: Gerbang Checkpoint 3: Bot Telegram & User ID Terverifikasi
- **Subtitle**: Kanal antarmuka percakapan perintah jadwal
- **Criteria**:
  1. Bot Telegram baru telah dibuat via `@BotFather` resmi dan tombol Start telah ditekan.
  2. Bot Token rahasia tersimpan aman di obrolan pribadi BotFather.
  3. Nomor Telegram User ID (angka murni) telah didapatkan dari `@userinfobot`.
- **Participant Inputs**:
  - `telegramUsername`: Validated with regex `/(bot|_bot)$/i`. Displays green validation message if valid, red alert if invalid.
  - `telegramUserId`: Validated with regex `/^\d+$/` (strictly numbers only). Displays green check if numeric, red error if contains `@`, letters, or spaces.
- **Actions**: Identical 3 action buttons (`passed`, `failed`, `pending`).

### 3.3 Dynamic Readiness Evaluation Formulas (`PRE-CHK-03`)

The readiness evaluation engine follows the proven mathematical model from `assets/js/state.js`:

#### Weighted Progress Calculation
```typescript
interface ProgressStats {
  totalTasks: number      // 13
  completedTasks: number
  totalCheckpoints: number // 3
  passedCheckpoints: number
  percentage: number      // 0 to 100
}

function calculateProgress(checklists: Record<string, boolean>, checkpoints: Record<string, string>): ProgressStats {
  const taskKeys = [
    "m1-check-node", "m1-verify-lts", "m1-check-npm",
    "m2-install-pkg", "m2-start-service", "m2-open-dashboard", "m2-verify-local",
    "m3-start-botfather", "m3-create-newbot", "m3-save-token-secure", "m3-get-userid",
    "m4-open-console", "m4-verify-login"
  ];
  const cpKeys = ["cp-1", "cp-2", "cp-3"];

  const totalTasks = taskKeys.length;
  const completedTasks = taskKeys.filter(k => checklists[k] === true).length;
  const totalCheckpoints = cpKeys.length;
  const passedCheckpoints = cpKeys.filter(k => checkpoints[k] === "passed").length;

  // Weighted calculation: Checklists = 60%, Checkpoints = 40%
  const taskPercent = totalTasks > 0 ? (completedTasks / totalTasks) * 60 : 0;
  const cpPercent = totalCheckpoints > 0 ? (passedCheckpoints / totalCheckpoints) * 40 : 0;
  const percentage = Math.min(100, Math.round(taskPercent + cpPercent));

  return { totalTasks, completedTasks, totalCheckpoints, passedCheckpoints, percentage };
}
```

#### Dynamic Readiness Badge Rules
```typescript
export interface ReadinessResult {
  status: "ready" | "clinic" | "pending";
  label: string;
  badgeClass: string;
  description: string;
  color: string;
}

function calculateReadiness(progress: ProgressStats, checkpoints: Record<string, string>): ReadinessResult {
  const pretrainingCpIds = ["cp-1", "cp-2", "cp-3"];
  const cpValues = pretrainingCpIds.map(id => checkpoints[id] || "pending");

  const hasFailure = cpValues.some(v => v === "failed");
  const allCheckpointsPassed = cpValues.every(v => v === "passed");

  // Rule 1: ANY checkpoint failed -> Technical Clinic
  if (hasFailure) {
    return {
      status: "clinic",
      label: "⚠️ PERLU TECHNICAL CLINIC",
      badgeClass: "status-clinic",
      description: "Terdapat kendala teknis pada satu atau lebih gerbang checkpoint. Jangan khawatir! Silakan konsultasikan kendala Anda dengan instruktur atau ikuti sesi Technical Clinic sebelum kelas dimulai.",
      color: "var(--color-danger)"
    };
  }

  // Rule 2: All 3 checkpoints passed AND progress >= 80% -> SIAP WORKSHOP
  if (allCheckpointsPassed && progress.percentage >= 80) {
    return {
      status: "ready",
      label: "🎉 SIAP MENGIKUTI WORKSHOP",
      badgeClass: "status-ready",
      description: "Selamat! Seluruh prasyarat dan gerbang checkpoint teknis telah berhasil Anda selesaikan. Laptop Anda 100% siap untuk praktik mengelola Google Calendar melalui Telegram bersama Hermes Agent saat workshop!",
      color: "var(--color-success)"
    };
  }

  // Rule 3: Otherwise -> MENUNGGU PENYELESAIAN LANGKAH (Pending)
  return {
    status: "pending",
    label: "⏳ MENUNGGU PENYELESAIAN LANGKAH",
    badgeClass: "status-pending",
    description: "Anda masih memiliki langkah atau verifikasi checkpoint yang belum selesai. Selesaikan Modul 1 sampai 5 dan verifikasi Checkpoint 1, 2, dan 3 untuk mencapai status kesiapan penuh.",
    color: "var(--color-warning)"
  };
}
```

### 3.4 LocalStorage Key Isolation & Multi-Course Safety

To satisfy `PRE-CHK-01` without introducing regressions against Course 2 (`learnwith_word_state_v1`), the persistence engine must strictly follow these rules:

1. **Primary Key**: `learnwith_ai_checklist` (dedicated key) and/or synchronized to `learnwith_ai_state_v1.checklists` & `checkpoints`.
2. **Backward Compatibility**: If `learnwith_ai_state_v1` exists, hydrate from its `checklists` and `checkpoints` sub-objects.
3. **Zero Pollution**: Mutating AI checklist/checkpoint state must never touch `learnwith_word_state_v1` or `learnwith_word_unlocked`.
4. **Hydration Safety**: In SSR / TanStack Start, localStorage access must be wrapped in `useEffect` or client-only guards to avoid React hydration mismatches.

### 3.5 Reset Modal Mechanics (`PRE-CHK-04`)

- **Modal Trigger**: Button `#btn-open-reset-modal` in `#card-readiness-status`.
- **Modal Container**: `#modal-reset-confirm` (`role="dialog"`, `aria-modal="true"`, `aria-labelledby="modal-reset-title"`).
- **Focus Trapping & Keyboard Accessibility**:
  - `Escape` key closes modal.
  - Backdrop click closes modal.
  - Cancel button closes modal without state mutation.
  - Confirm button (`#btn-confirm-reset`):
    1. Resets AI state (checklists = all false, checkpoints = all pending, participantInfo fields cleared).
    2. Persists reset state to localStorage.
    3. Closes modal and returns focus.
    4. Triggers toast: `"Semua progres dan verifikasi berhasil diatur ulang 🔄"`.

---

## 4. Component Architecture & File Layout

```
app/
├── components/
│   └── course/
│       └── pretraining/
│           ├── CheckpointGateCard.tsx          <-- Gate card (1, 2, 3) with criteria, badges, actions, inputs
│           ├── PretrainingCheckpointsSection.tsx <-- Container for CP1, CP2, CP3 (#sec-checkpoint-1..3)
│           ├── PretrainingReadinessSection.tsx   <-- Status summary (#sec-readiness-summary, #card-readiness-status)
│           ├── ResetProgressModal.tsx          <-- Accessible confirmation modal (#modal-reset-confirm)
│           ├── PretrainingModuleCard.tsx       <-- Connected with interactive checkbox onClick/onChange
│           └── PretrainingHero.tsx             <-- Dynamically displays X/13 langkah and readiness stat
├── hooks/
│   └── usePretrainingState.ts                  <-- React hook managing checklists, checkpoints, participantInfo, & reset
└── routes/
    └── course.ai.tsx                           <-- Mounts Checkpoints & Readiness sections in pretraining mode
```

### 4.1 React State Hook: `usePretrainingState`

```typescript
export interface PretrainingState {
  checklists: Record<string, boolean>;
  checkpoints: Record<"cp-1" | "cp-2" | "cp-3", "pending" | "passed" | "failed">;
  participantInfo: {
    nodeVersion: string;
    telegramUsername: string;
    telegramUserId: string;
  };
}
```

The hook provides:
- `toggleChecklist(taskId: string, value?: boolean)`
- `setCheckpoint(checkpointId: string, status: "pending" | "passed" | "failed")`
- `setParticipantInfo(field: string, value: string)`
- `resetState()`
- `progress`: `{ totalTasks, completedTasks, totalCheckpoints, passedCheckpoints, percentage }`
- `readiness`: `{ status, label, badgeClass, description, color }`
- `isLoaded`: boolean (for hydration-safe rendering)

---

## 5. Verification & Test Plan (Nyquist Compliance)

### 5.1 New Automated Unit Test Suite: `tests/pretraining-checklist.test.js`

To guarantee zero regression and satisfy all 4 requirements, we construct a comprehensive Node.js test suite with 4 suites:

1. **Suite 1: 13-Step Checklist Engine (`PRE-CHK-01`)**:
   - Verifies exactly 13 checklist task IDs exist across Modul 1–4.
   - Tests `toggleChecklist` updates state and persists to localStorage.
   - Tests module-level progress calculations (`m1-` 3 tasks, `m2-` 4 tasks, `m3-` 4 tasks, `m4-` 2 tasks).
   - Verifies state isolation: mutating AI checklists does not alter Word course keys.

2. **Suite 2: Checkpoint Verification Gates (`PRE-CHK-02`)**:
   - Tests Checkpoint 1, 2, 3 default to `pending`.
   - Tests updating status to `passed`, `failed`, `pending`.
   - Tests participant input validation:
     - `telegramUsername`: rejects strings without `bot` or `_bot`, accepts `@jadwal_bot`.
     - `telegramUserId`: rejects alphanumeric strings or strings with `@`, accepts numeric digits only (`123456789`).

3. **Suite 3: Dynamic Readiness Calculation (`PRE-CHK-03`)**:
   - Tests initial state calculates to `pending` ("⏳ MENUNGGU PENYELESAIAN LANGKAH").
   - Tests any checkpoint marked `failed` immediately triggers `clinic` ("⚠️ PERLU TECHNICAL CLINIC").
   - Tests all 3 checkpoints `passed` + checklists completed >= 80% triggers `ready` ("🎉 SIAP MENGIKUTI WORKSHOP").
   - Tests weighted formula: 60% checklists, 40% checkpoints.

4. **Suite 4: Safe Reset Confirmation Engine (`PRE-CHK-04`)**:
   - Tests `resetState()` clears all 13 checklist items to `false`.
   - Tests `resetState()` reverts checkpoints 1..3 to `pending`.
   - Tests `resetState()` clears participantInfo inputs.
   - Verifies persisted localStorage is updated after reset.
   - Verifies Course 2 state remains completely untouched.

### 5.2 Command Verification
```powershell
C:\nvm4w\nodejs\node.exe --test tests/checkpoint-engine.test.js tests/pretraining-checklist.test.js
```

---

## 6. Key Deliverables & Action Items for Planning

1. **Step D parity fix in Modul 3 data**: Verify step D in `app/data/pretrainingModules.ts` does not emit an uncounted 14th task ID (keep the 13 official IDs).
2. **Implement `usePretrainingState` hook**: Clean, reactive state hook with SSR-safe hydration, custom event dispatching, and multi-course isolation.
3. **Build Checkpoint Gates UI (`PretrainingCheckpointsSection.tsx`, `CheckpointGateCard.tsx`)**: Replicate exact HTML and CSS classes (`checkpoint-gate-card`, `cp-action-btn-group`, `btn-cp-action`).
4. **Build Readiness Summary UI (`PretrainingReadinessSection.tsx`)**: Replicate `#sec-readiness-summary` with dynamic badge, description, and action buttons.
5. **Build Reset Modal UI (`ResetProgressModal.tsx`)**: Full accessible dialog with confirmation button and toast integration.
6. **Connect `PretrainingModuleCard.tsx` checkboxes**: Wire checkboxes to `usePretrainingState` so toggling a checkbox updates state, persists to localStorage, and updates the hero and readiness counters in real time.
7. **Mount in `app/routes/course.ai.tsx`**: Add `PretrainingCheckpointsSection`, `PretrainingReadinessSection`, and `ResetProgressModal` into the `mode === "pretraining"` branch.
8. **Automated Test Coverage**: Add `tests/pretraining-checklist.test.js` and verify with `npm run test:node`.
