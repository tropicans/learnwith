---
phase: 25-interactive-modules-1-5-1-click-copy-engine
plan: "01"
subsystem: course-pretraining
tags: [pretraining, modules-1-5, copy-engine, toast, checkpoint-preview, architecture-flow, accordion]

requires:
  - phase: 24-pre-training-foundation-ui-components-interactive-glossary
    provides: Foundation data models and UI sections for Pre-Training
provides:
  - Typed pretraining modules dataset for Modules 1 through 5 with 100% fidelity to index.html
  - 1-Click Copy Engine with terminal chrome and clipboard fallback
  - Global Toast Notification Engine and UI Container
  - Checkpoint Preview Card for Checkpoints 1, 2, and 3
  - Interactive 4-Node Architecture Flow Diagram for Modul 5
  - Accessible Pretraining Module Card with keyboard navigation and step rendering
affects:
  - 25-02

actuals:
  tasks: 3
  commits: 3

tech-stack:
  added: []
  patterns:
    - Strongly-typed dataset schema for curriculum steps, alerts, links, badges, and checkpoints
    - 1-Click Copy Engine with navigator.clipboard write and hidden textarea fallback
    - CustomEvent-backed global Toast notification dispatcher
    - Accessible collapsible module headers with ARIA attributes and keyboard Enter/Space triggers
    - 4-node architecture diagram matching production layout

key-files:
  created:
    - app/data/pretrainingModules.ts
    - app/components/course/pretraining/CopyableCodeBlock.tsx
    - app/components/ui/Toast.tsx
    - app/components/course/pretraining/CheckpointPreviewCard.tsx
    - app/components/course/pretraining/ModuleArchitectureFlow.tsx
    - app/components/course/pretraining/PretrainingModuleCard.tsx

key-decisions:
  - "D-01: Extracted Modules 1–5 data into app/data/pretrainingModules.ts preserving exact command syntax, warning boxes, and checklist task IDs."
  - "D-02: Preserved multiline indentation in CopyableCodeBlock without destructive whitespace regex collapsing."
  - "D-03: Built Toast notification system supporting both direct React state subscribers and DOM CustomEvent ('app:toast') for cross-boundary integration."
  - "D-04: Enforced ARIA accessibility standards on PretrainingModuleCard with role='button', aria-expanded, aria-controls, and Enter/Space keyboard listeners."

requirements-completed:
  - PRE-MOD-01
  - PRE-MOD-02
  - PRE-MOD-03
  - PRE-MOD-04
  - PRE-MOD-05
  - PRE-MOD-06
---

# Phase 25 Plan 01: Pre-Training Interactive Modules 1–5 Dataset, 1-Click Copy Engine & Component Architecture Summary

## Overview
Plan 25-01 established the foundational data layer and presentation building blocks for Pre-Training Modules 1 through 5. It extracted typed content from `index.html` with 100% fidelity, built a resilient 1-Click Copy Engine with toast notifications, and delivered accessible, modular UI cards for checkpoints, architecture flow diagrams, and step sequences.

## Accomplishments
1. **Typed Curriculum Dataset (`app/data/pretrainingModules.ts`)**:
   - Defined TypeScript interfaces (`PretrainingModule`, `ModuleStep`, `StepAlert`, `StepLink`, `CheckpointPreview`, `ComparisonGrid`).
   - Populated Modules 1 through 5 with exact commands (`node --version`, `npm --version`, `npm install -g 9router`, `9router`, `/newbot`, `/revoke`), target criteria, security guidelines, and task IDs (`m1-check-node` .. `m4-verify-login`).
2. **1-Click Copy Engine & Toast System (`app/components/course/pretraining/CopyableCodeBlock.tsx`, `app/components/ui/Toast.tsx`)**:
   - Implemented `CopyableCodeBlock` with terminal chrome dots, language pill, and interactive copy button displaying `✓ Tersalin!` for 2000ms.
   - Built dual-mode clipboard writer leveraging `navigator.clipboard.writeText` with legacy hidden `<textarea>` fallback.
   - Developed `Toast.tsx` featuring `showToast()` dispatcher and `ToastContainer` with smooth animations and alert type stylings.
3. **Module Card, Architecture Flow & Checkpoint Cards (`app/components/course/pretraining/PretrainingModuleCard.tsx`, `ModuleArchitectureFlow.tsx`, `CheckpointPreviewCard.tsx`)**:
   - Built `PretrainingModuleCard` with accessible accordion header (`role="button"`, `tabIndex={0}`, `aria-expanded`, `aria-controls`, `Enter` / `Space` keyboard support) and step rendering.
   - Built `ModuleArchitectureFlow` with the 4-node diagram (Telegram Ponsel -> Hermes Agent -> 9Router -> Model AI Cloud) and completion alert box.
   - Built `CheckpointPreviewCard` with green success highlight and target milestone requirements.

## Verification Evidence
- Task 1: `& 'C:\nvm4w\nodejs\node.exe' -e "require('esbuild').buildSync({ entryPoints: ['app/data/pretrainingModules.ts'], write: false }); console.log('Modules data compiled successfully');"` -> Passed (`Modules data compiled successfully`).
- Task 2: `pwsh -Command "Test-Path app/components/course/pretraining/CopyableCodeBlock.tsx, app/components/ui/Toast.tsx"` -> Passed (`True`, `True`). Build validation passed.
- Task 3: `pwsh -Command "Test-Path app/components/course/pretraining/PretrainingModuleCard.tsx, app/components/course/pretraining/ModuleArchitectureFlow.tsx, app/components/course/pretraining/CheckpointPreviewCard.tsx"` -> Passed (`True`, `True`, `True`). Build validation passed.
