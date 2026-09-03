# Phase 3 Validation Strategy: Checklist & Checkpoint Engine

## Phase Objective
Implement interactive checkboxes, 3 gated checkpoints, automated readiness calculation, and localStorage sync.

## Target Requirements
- **CHK-01**: User can check off interactive items across all stages (Persiapan, Node.js, 9Router, Telegram Bot, Google Cloud).
- **CHK-02**: User can validate Checkpoint 1 (Node.js & npm), Checkpoint 2 (9Router Dashboard), and Checkpoint 3 (Bot Telegram & User ID).
- **CHK-03**: User can view real-time readiness status badge: `SIAP MENGIKUTI WORKSHOP` or `PERLU TECHNICAL CLINIC`.
- **CHK-04**: User progress and checked states are automatically saved to `localStorage` and can be reset if needed.

## Verification Matrix

| Verification Target | Expected Behavior | Verification Method |
|---|---|---|
| **Step-Level Checklists** | Checkbox on each step in Modules 1-4 updates completed state and persists across page reloads. | Toggle checkboxes, reload browser, inspect `localStorage` item `pretraining_app_state_v1`. |
| **Sidebar Navigation Badges** | Badges `badge-nav-m1` through `badge-nav-m4` display dynamic step counts (e.g., `0/3` → `3/3`) and update colors. | Check step items and observe sidebar badge updates. |
| **Checkpoint Gates 1, 2, 3** | Sections `#sec-checkpoint-1`, `#sec-checkpoint-2`, `#sec-checkpoint-3` offer Pass/Fail buttons that update status badges. | Click Pass and Fail on each checkpoint; verify sidebar status (`Lolos ✓` / `Gagal`). |
| **Participant Input Validation** | Telegram User ID accepts only digits; Telegram Bot Username validates `@...bot`. | Input valid and invalid values; verify feedback and localStorage persistence. |
| **Dynamic Readiness Evaluation** | All checkpoints passed + high task completion yields `SIAP MENGIKUTI WORKSHOP`; any checkpoint failed yields `PERLU TECHNICAL CLINIC`. | Test all combinations of checkpoint statuses and verify the readiness badge and explanation text. |
| **Reset Confirmation Modal** | Clicking Reset opens modal dialog; dismissing with Esc cancels; confirming clears all state and updates UI. | Open modal, press Esc, open again, confirm reset, verify clean initial state and toast notification. |
| **Automated Test Suite** | Test script `tests/checkpoint-engine.test.js` runs state transitions, calculations, and reset routines. | Execute automated test suite and ensure 100% passing tests. |
