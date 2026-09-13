# Learnwith Course AI Visual Migration Audit
**Document Version:** 1.0.0  
**Status:** Approved Architectural Audit & Implementation Map  
**Target Route:** `/course/ai` (`http://localhost:3173/course/ai`)  
**Design Reference:** Design System & UI Reference (`http://localhost:3174/`)  
**Scope:** Specification, Component Inventory, Behavioral Invariant Mapping, and Implementation Sequencing ONLY. (**Zero application code modified**).

---

## 1. Actual File & Component Inventory

A comprehensive code-trace of route `/course/ai` reveals the following concrete architecture:

### 1.1 Route Entry & Page Shell
- **Route Definition:** `app/routes/course.ai.tsx`
  - Search Parameter Validation: `courseAiSearchSchema` (`mode: 'pretraining' | 'live-class'`)
  - Server Data Loaders: `getCourseAiData(deps.mode)`, `getPublicCourseStatusesFn()`, `getCourseStatsAsync('ai')`
  - In-flight Status Banner: `UnlistedCourseBanner` (for `hidden`, `archived`, `deleted`)
  - Course Unavailability Boundary: `CourseUnavailableNotice`
  - Mode Switcher Bar: Persistent tabs switching between `📋 Pra-Training` and `🚀 Hari-H Kelas 🔒/🔓`
  - Modals: `InstructorUnlockModal` (session unlock `live_class_unlocked`), `ResetProgressModal` (full state reset)

### 1.2 Course Navigation / Sidebar
- **Component:** `app/components/course/pretraining/PretrainingSidebar.tsx`
  - Mode Switcher Tablist (`#tab-pretraining-sidebar`, `#tab-liveclass-sidebar`)
  - Course Indicator (`#btn-sidebar-course-select`)
  - Pra-Training Navigation Groups:
    - *Pendahuluan:* `#sec-target` (Target & Alur), `#sec-glosarium` (Glosarium), `#sec-security` (Keamanan), `#sec-prerequisites` (Alat & Persiapan), `#sec-powershell` (Dasar PowerShell)
    - *Modul Praktik (with dynamic completion badges):* `#sec-module-1` (Node.js, 0/3), `#sec-module-2` (9Router, 0/4), `#sec-module-3` (Telegram, 0/4), `#sec-module-4` (Google Cloud, 0/2), `#sec-module-5` (Catatan Sebelum Kelas)
    - *Gerbang Checkpoint (with dynamic status chips):* `#sec-checkpoint-1` (Node.js), `#sec-checkpoint-2` (9Router), `#sec-checkpoint-3` (Telegram)
    - *Bantuan & Laporan:* `#sec-troubleshooting` (Solusi Kendala), `#sec-redaction` (Sensor Rahasia), `#sec-readiness-report` (Laporan Kesiapan)
  - Dynamic Scrollspy tracking active section in viewport.

### 1.3 Pra-Training Mode Sections (`mode=pretraining`)
1. **Hero & Metrics:** `app/components/course/pretraining/PretrainingHero.tsx`
   - Dynamic 4-pillar hero metrics from `PRETRAINING_HERO_STATS` with live task counter (`${completedTasks}/13`).
2. **Target & Flow:** `app/components/course/pretraining/PretrainingTargetSection.tsx`
   - 3 Target Criteria cards (`PRETRAINING_TARGET_CRITERIA`).
3. **Glossary:** `app/components/course/pretraining/PretrainingGlossarySection.tsx`
   - 6 Core Terms (`PRETRAINING_GLOSSARY_TERMS`): Node.js, 9Router, Telegram Bot, Hermes Agent, Google Cloud, OAuth 2.0.
4. **Security Directives:** `app/components/course/pretraining/PretrainingSecuritySection.tsx`
   - 3 Strict Security Rules (`PRETRAINING_SECURITY_RULES`).
5. **Prerequisites Checklist:** `app/components/course/pretraining/PretrainingPrerequisitesSection.tsx`
   - Hardware/software readiness items (`PRETRAINING_PREREQUISITES`).
6. **PowerShell Guide:** `app/components/course/pretraining/PretrainingPowerShellSection.tsx`
   - Step-by-step terminal instructions with quick keyword copy helper.
7. **Instructional Modules 1–5:** `app/components/course/pretraining/PretrainingModulesSection.tsx`
   - Orchestrates `PRETRAINING_MODULES` via `PretrainingModuleCard.tsx`
   - Global expand/collapse controls (`#btn-expand-all-modules`, `#btn-collapse-all-modules`)
   - `CopyableCodeBlock.tsx` (Clipboard API + fallback, preserves newlines and syntax formatting)
   - `ModuleArchitectureFlow.tsx` (Architecture diagram for Module 5)
   - `CheckpointPreviewCard.tsx` (Bridge to checkpoints)
   - Task checkboxes bound to `toggleChecklist(taskId)`.
8. **Checkpoints 1–3 Gates:** `app/components/course/pretraining/PretrainingCheckpointsSection.tsx`
   - Orchestrates `CheckpointGateCard.tsx` for CP-1, CP-2, CP-3.
   - CP-1: Node.js & npm validation + `nodeVersion` input field.
   - CP-2: 9Router port 20128 dashboard verification.
   - CP-3: Telegram Bot & User ID validation with live regex validation:
     - Telegram username regex: `/(bot|_bot)$/i`
     - Telegram User ID regex: `/^\d+$/`
9. **Readiness Status Evaluation:** `app/components/course/pretraining/PretrainingReadinessSection.tsx`
   - Live badge & card styling dynamically reflecting `readiness.status` (`ready` | `clinic` | `pending`).
   - Action triggers: Jump to `#sec-readiness-report` or open `#btn-open-reset-modal`.
10. **Troubleshooting Center:** `app/components/course/pretraining/PretrainingTroubleshootingSection.tsx`
    - Search input across 15 technical solutions (`PRETRAINING_TROUBLESHOOTING_ITEMS`).
    - Accessible category filter pills (`all`, `node`, `router`, `telegram`, `powershell`, `hermes`) with keyboard arrow/Home/End navigation.
    - Card renderer: `TroubleshootingCard.tsx`.
11. **Secret Token Redaction Workbench:** `app/components/course/pretraining/PretrainingRedactionSection.tsx`
    - Privacy sanitization engine utilizing `app/utils/redaction.ts`.
    - Auto-detects and masks Telegram Bot tokens, OpenAI keys, Windows usernames, emails, and IP addresses.
    - Live match counter chip, copy sanitized log button, clear workbench button.
12. **Readiness Report Exporter:** `app/components/course/pretraining/PretrainingReadinessReportSection.tsx`
    - Generates standard WhatsApp/Telegram report text via `app/utils/reportGenerator.ts`.
    - Direct cloud error reporting via server function `ingestTroubleshootingLogFn` (`app/server/troubleshooting.ts`).

### 1.4 Hari-H Live Class Mode Sections (`mode=live-class`)
- `LiveClassContainer.tsx`:
  - `LiveClassHero.tsx`: Passkey unlock hero with lock status badge (`isUnlocked`).
  - `LiveClassTargetSection.tsx`: Target outcomes for live session.
  - `LiveClassStats.tsx`: Live cohort metrics and completion progress.
  - `LiveClassModulesSection.tsx`: Modules M6 to M11 (`LIVE_CLASS_MODULES`), terminal code snippets protected behind passkey unlock.
  - `LiveClassCheckpointsSection.tsx`: Checkpoint gates CP-6 through CP-11 with pass/fail evaluation.
  - `ChecklistIsland.tsx`: Hydration-safe live checklist.

---

## 2. Component Responsibility Map

```
app/routes/course.ai.tsx (Route Controller & Loader)
 │
 ├── PretrainingSidebar (Fixed Navigation Rail, Scrollspy, Progress Counters)
 │
 ├── Mode Tabs ('pretraining' vs 'live-class')
 │
 ├── [mode === 'pretraining']
 │    ├── PretrainingHero (Stats Pills, Dynamic Count)
 │    ├── PretrainingTargetSection (Criteria Cards)
 │    ├── PretrainingGlossarySection (Terminology Grid)
 │    ├── PretrainingSecuritySection (Security Rules)
 │    ├── PretrainingPrerequisitesSection (Setup Requirements)
 │    ├── PretrainingPowerShellSection (Terminal Guide & Copy)
 │    ├── PretrainingModulesSection (Modules 1–5 Accordion)
 │    │    └── PretrainingModuleCard (Steps, CodeBlock, Alerts, Checkboxes)
 │    │         ├── CopyableCodeBlock (1-Click Copy, Toast)
 │    │         ├── ModuleArchitectureFlow (SVG/Visual Diagram)
 │    │         └── CheckpointPreviewCard (Bridge Card)
 │    ├── PretrainingCheckpointsSection (CP-1, CP-2, CP-3 Gates)
 │    │    └── CheckpointGateCard (Pass/Fail/Reset, Regex Validators)
 │    ├── PretrainingReadinessSection (SIAP / CLINIC / PENDING Calculation)
 │    ├── PretrainingTroubleshootingSection (Search, 15 Cards, Filter Pills)
 │    │    └── TroubleshootingCard (Accordion Solution Item)
 │    ├── PretrainingRedactionSection (Interactive Log Sanitizer)
 │    ├── PretrainingReadinessReportSection (Report Text Generator + Cloud Sync)
 │    └── ResetProgressModal (Safe Confirmation Dialog)
 │
 └── [mode === 'live-class']
      ├── LiveClassHero (Passkey Status & Gate Trigger)
      ├── LiveClassTargetSection
      ├── LiveClassStats (Streaming Stats)
      ├── LiveClassModulesSection (M6–M11, Passkey Protected Code)
      ├── LiveClassCheckpointsSection (CP-6–CP-11 Gates)
      └── ChecklistIsland (Course 1 Live Tasks)
```

---

## 3. A / B / C Classification

Every component and UI region in Course AI is classified strictly into one of three migration categories:

| Category | Component / Region | Scope & Constraints |
| :--- | :--- | :--- |
| **A. SAFE UI** | `PretrainingHero`<br>`PretrainingTargetSection`<br>`PretrainingGlossarySection`<br>`PretrainingSecuritySection`<br>`PretrainingPrerequisitesSection`<br>`PretrainingPowerShellSection`<br>`ModuleArchitectureFlow`<br>`CheckpointPreviewCard`<br>`LiveClassTargetSection` | Visual-only restyling is completely safe. Modernize to obsidian surfaces, hairline borders, frosted cards, and refined typography. Retain all existing semantic IDs and copy text. |
| **B. CAREFUL** | `PretrainingSidebar`<br>`PretrainingModulesSection`<br>`PretrainingModuleCard`<br>`CopyableCodeBlock`<br>`PretrainingCheckpointsSection`<br>`CheckpointGateCard`<br>`PretrainingReadinessSection`<br>`PretrainingTroubleshootingSection`<br>`TroubleshootingCard`<br>`PretrainingRedactionSection`<br>`PretrainingReadinessReportSection`<br>`ResetProgressModal`<br>`LiveClassContainer`<br>`LiveClassHero`<br>`LiveClassModulesSection`<br>`LiveClassCheckpointsSection`<br>`ChecklistIsland` | **Visual changes allowed, but strict behavioral & state contracts must be preserved**: Task IDs, DOM attributes (`data-task-id`, `data-checkpoint`, `data-participant-field`), regex validators, event dispatching, copy-to-clipboard handlers, toast triggers, and modal callbacks must remain 100% intact. |
| **C. DO NOT TOUCH** | `app/server/*`<br>`app/schemas/*`<br>`app/hooks/usePretrainingState.ts`<br>`app/utils/telemetryClient.ts`<br>`app/utils/redaction.ts`<br>`app/utils/reportGenerator.ts`<br>`app/data/pretrainingFoundation.ts`<br>`app/data/pretrainingModules.ts`<br>`app/data/pretrainingTroubleshooting.ts`<br>`app/data/liveClassModules.ts`<br>`assets/js/state.js`<br>`tests/*`<br>`Dockerfile` | **Strictly forbidden from modification during visual migration.** Do not alter logic, schemas, storage keys, server functions, data arrays, or test specifications. |

---

## 4. Behavioral Invariants (Must Remain 100% Identical)

The visual migration must guarantee zero deviation in the following operational behaviors:

### 4.1 13 Official Pre-Training Checklist Tasks & Order
The exact 13 task IDs defined in `PRETRAINING_CHECKLIST_TASK_IDS` must be wired to their corresponding checkboxes in Modules 1–4:
- **Module 1 (3 tasks):**
  1. `m1-check-node`: Check Node.js version
  2. `m1-verify-lts`: Verify LTS release
  3. `m1-check-npm`: Check npm version
- **Module 2 (4 tasks):**
  4. `m2-install-pkg`: Install 9Router package
  5. `m2-start-service`: Start 9Router service
  6. `m2-open-dashboard`: Open dashboard
  7. `m2-verify-local`: Verify localhost:20128
- **Module 3 (4 tasks):**
  8. `m3-start-botfather`: Start @BotFather
  9. `m3-create-newbot`: Create /newbot
  10. `m3-save-token-secure`: Securely store token
  11. `m3-get-userid`: Retrieve User ID via @userinfobot (Note: Step D has no checkbox)
- **Module 4 (2 tasks):**
  12. `m4-open-console`: Open Google Cloud Console
  13. `m4-verify-login`: Verify Google account login

### 4.2 Weighted Progress Formula
$$\text{Progress \%} = \min\left(100, \operatorname{round}\left(\frac{\text{Completed Tasks}}{13} \times 60 + \frac{\text{Passed Checkpoints}}{3} \times 40\right)\right)$$
- Must strictly weight tasks at 60% and checkpoints at 40%.

### 4.3 Readiness Tri-State Determination Rules
The readiness evaluator (`calculatePretrainingReadiness`) follows three non-negotiable rules:
1. **Rule 1 (Clinic):** If **ANY** checkpoint (`cp-1`, `cp-2`, `cp-3`) is `'failed'` $\rightarrow$ Status: `clinic` (`⚠️ PERLU TECHNICAL CLINIC`), color: `--color-danger`.
2. **Rule 2 (Ready):** If **ALL 3** checkpoints are `'passed'` **AND** progress $\ge 80\%$ $\rightarrow$ Status: `ready` (`🎉 SIAP MENGIKUTI WORKSHOP`), color: `--color-success`.
3. **Rule 3 (Pending):** Otherwise $\rightarrow$ Status: `pending` (`⏳ MENUNGGU PENYELESAIAN LANGKAH`), color: `--color-warning`.

### 4.4 Checkpoint Predicates & Field Validators
- **Checkpoint 1:** Validates Node & npm installation; saves optional `nodeVersion` to state.
- **Checkpoint 2:** Validates 9Router dashboard listening on port 20128 with initial password `123456`.
- **Checkpoint 3:** Validates Telegram bot creation with strict real-time input validators:
  - `telegramUsername`: Regex `/(bot|_bot)$/i` (must end with `bot` or `_bot`).
  - `telegramUserId`: Regex `/^\d+$/` (numeric digits only).

### 4.5 Multi-Course Storage Isolation & State Persistence
- **Storage Keys for Course 1:**
  - `learnwith_ai_state_v1`: Complete JSON state (`checklists`, `checkpoints`, `participantInfo`).
  - `learnwith_ai_checklist`: JSON mirror of checklist boolean map.
  - `pretraining_app_state_v1`: Legacy fallback read key.
  - `live_class_unlocked`: Session storage boolean for instructor passkey.
  - `learnwith_ai_live_checklist_state`: Live class task progress.
  - `learnwith_ai_live_checkpoints_v1`: Live class checkpoints (CP-6..CP-11).
- **Isolation Guarantee:** Course 1 must **NEVER** read, write, or clear `learnwith_word_state_v1` or `learnwith_word_unlocked`.

### 4.6 Telemetry & Background Sync
- State changes in Course 1 automatically emit `pretraining:stateChange` custom event and non-blocking background telemetry via `sendParticipantTelemetry` (`courseId: 'ai'`).

### 4.7 Copy-to-Clipboard Mechanics
- Must use `copyToClipboard` helper with fallback to hidden `textarea` for non-secure contexts.
- Must preserve internal newlines, indentation, and trailing arguments in multi-line shell commands.

### 4.8 Redaction Sandbox Invariants
- Must run input through `sanitizeLogText(text)`.
- Correctly scrub Telegram bot tokens (`\d{8,10}:[A-Za-z0-9_-]{35}`), OpenAI keys (`sk-[A-Za-z0-9]{32,}`), Google Cloud OAuth tokens, Windows user paths, and emails.
- Preserve text formatting while reporting precise `matchesCount`.

### 4.9 Troubleshooting Search & Categorization
- 15 predefined troubleshooting guides across 6 categories (`all`, `node`, `router`, `telegram`, `powershell`, `hermes`).
- Real-time case-insensitive keyword filtering with accessible keyboard pill navigation.

---

## 5. Visual Migration Opportunities (3174 Design System Alignment)

Aligning Course AI with the visual language of `http://localhost:3174/` requires treating the page as a **Focused Technical Learning IDE / Workspace**, not a landing page:

| UI Element | Current Legacy State | Modernized 3174 Direction |
| :--- | :--- | :--- |
| **Page Canvas** | Light/grey surface (`var(--bg-app)`) | Deep obsidian backdrop (`#08080a` / `#0e0e14`) |
| **Left Rail Sidebar** | Basic light grey list | Frosted translucent container (`rgba(14, 14, 20, 0.85)`), hairline right border (`rgba(255, 255, 255, 0.08)`), active indicator with soft violet pip glow |
| **Typography** | Generic system sans | Display headings in high-contrast crisp sans, tracked uppercase chapter tags (`MODUL 01 / 05`), laser-sharp monospace snippets (`JetBrains Mono`) |
| **Module Cards** | Standard white cards with heavy drop-shadows | Obsidian bento panels (`#14141e`) with 1px hairline border (`rgba(255, 255, 255, 0.08)`), subtle violet rim hover (`rgba(168, 85, 247, 0.25)`) |
| **Terminal Snippets** | Plain dark grey container | Deep terminal canvas (`#0b0b10`), colored macOS-style window dots, subtle purple syntax highlights, polished pill copy button with green confirmation |
| **Checkpoints** | Standard form cards | Distinct gateway milestone panels with luminous status halos (emerald for passed, amber for pending, crimson for clinic) |
| **Readiness Banner** | Plain alert container | Elevated glass cockpit with radial gradient backing matching calculated state |
| **Filter Pills & Tabs** | Plain buttons | Translucent capsule pills with active white-on-dark pill highlights |

*Restraint Enforcement:* Do NOT copy AI image-generation controls, aspect ratio selectors, remix sliders, or prompt builder concepts from 3174.

---

## 6. Responsive Findings & Viewport Strategy

Headless browser audit across viewports revealed specific structural dynamics:

### 6.1 Desktop ($1440 \times 900\text{ px}$)
- **Current Behavior:** Clean split layout: 260px fixed left sidebar + fluid main content canvas.
- **Improvement:** Increase sidebar width to 280px for better readability of module titles and completion counts. Anchor the main content container to `max-width: 1280px` centered with balanced breathing room.

### 6.2 Tablet ($1024 \times 900\text{ px}$)
- **Current Behavior:** Sidebar remains visible, but content cards compress horizontally.
- **Improvement:** Refine padding on module cards and comparison grids. Maintain single-row display for code block headers.

### 6.3 Mobile ($390 \times 844\text{ px}$)
- **Current Behavior:** Sidebar is off-canvas, toggled via hamburger drawer button (`#btn-mobile-nav`). Mode tabs stack or scroll.
- **Improvement:**
  - Ensure mobile drawer has backdrop blur (`backdrop-filter: blur(12px)`) and obsidian background (`#0e0e14`).
  - Code snippets must have smooth horizontal scrolling (`overflow-x: auto`) with zero viewport blowout.
  - Form inputs and action buttons must maintain touch targets $\ge 44 \times 44\text{ px}$.

---

## 7. Security & State Boundaries

The following files and subsystems are strictly protected and must remain untouched:

```
[PROTECTED SYSTEM FILES]
├── app/server/*                     (All server functions & admin RPCs)
├── app/schemas/*                    (Zod validation schemas)
├── app/hooks/usePretrainingState.ts (Course 1 state machine & calculations)
├── assets/js/state.js               (Legacy state manager & cross-course engine)
├── assets/js/app.js                 (Legacy DOM controller)
├── tests/*                          (Test specifications & assertions)
├── Dockerfile                       (Container build definition)
└── docker-compose*                  (Container orchestration)
```

Within Course AI components, files with complex event handlers (`PretrainingCheckpointsSection.tsx`, `PretrainingRedactionSection.tsx`, `PretrainingReadinessReportSection.tsx`) must be modified **strictly for presentation/styling/DOM hierarchy** while leaving props, states, hooks, and callback signatures 100% intact.

---

## 8. Test & Regression Inventory

Existing tests that protect Course AI features:

| Test File | Total Assertions | Behaviors Protected |
| :--- | :--- | :--- |
| `tests/pretraining-checklist.test.js` | 464 lines, 15 suites | • 13 checklist task IDs, order, and toggle behavior<br>• Weighted progress formula (60% tasks + 40% checkpoints)<br>• Readiness tri-state rules (`ready`, `clinic`, `pending`)<br>• Participant info persistence (`name`, `nodeVersion`, `telegramUsername`, `telegramUserId`)<br>• Safe reset engine |
| `tests/checkpoint-engine.test.js` | 88 lines | • Checkpoint status transitions (`pending` $\rightarrow$ `passed` $\rightarrow$ `failed`)<br>• Module task counter aggregations |
| `tests/pretraining-readiness-report.test.js` | 290 lines | • Formatted report text output for WhatsApp and Telegram<br>• Telegram username normalization (`@` prefixing)<br>• Redaction masking of tokens and sensitive info in reports |
| `tests/pretraining-troubleshooting.test.js` | 350 lines | • 15 troubleshooting items, category filtering, search queries |
| `tests/telemetry.test.js` | 561 lines | • Non-blocking participant telemetry payload delivery |
| `tests/live-class-modules.test.js` | 252 lines | • Modules 6–11 live class task states and CP-6..CP-11 gates |
| `tests/server-boundary-audit.test.js` | 141 lines | • Timing-safe passkey verification & server boundary isolation |

---

## 9. Recommended Implementation Sequence

When authorized to implement the visual redesign, execute in the following sequential waves:

1. **Wave 1 — Course Shell, Rail Navigation & Hero:**
   - Modernize `PretrainingSidebar.tsx` (frosted obsidian rail, hairline borders, luminous active chips).
   - Modernize `course-mode-tabs` in `course.ai.tsx`.
   - Modernize `PretrainingHero.tsx` (dark studio billboard + 4-pillar bento stats).
2. **Wave 2 — Foundational Information Sections:**
   - Modernize `PretrainingTargetSection.tsx`, `PretrainingGlossarySection.tsx`, `PretrainingSecuritySection.tsx`, `PretrainingPrerequisitesSection.tsx`, `PretrainingPowerShellSection.tsx`.
3. **Wave 3 — Modules 1–5 & Terminal Code Blocks:**
   - Modernize `PretrainingModulesSection.tsx` and `PretrainingModuleCard.tsx`.
   - Elevate `CopyableCodeBlock.tsx` with dark IDE styling, JetBrains Mono font, and glowing copy confirmations.
4. **Wave 4 — Checkpoint Gates & Readiness Status:**
   - Restyle `PretrainingCheckpointsSection.tsx` and `CheckpointGateCard.tsx`.
   - Restyle `PretrainingReadinessSection.tsx` with status-aware luminous radial glow.
5. **Wave 5 — Interactive Utilities (Troubleshooting, Redaction, Report):**
   - Restyle `PretrainingTroubleshootingSection.tsx`, `PretrainingRedactionSection.tsx`, and `PretrainingReadinessReportSection.tsx`.
6. **Wave 6 — Hari-H Live Class Shell & Modals:**
   - Align `LiveClassContainer.tsx`, `InstructorUnlockModal.tsx`, and `ResetProgressModal.tsx`.

---

## 10. Explicit DO NOT TOUCH List

1. `app/server/*` — Master admin auth, telemetry store, passkey verification, troubleshooting log ingestion.
2. `app/schemas/*` — Zod schemas for telemetry, search params, troubleshooting, server functions.
3. `app/hooks/usePretrainingState.ts` — State transitions, localStorage persistence keys, progress weight calculations.
4. `app/utils/*` — Redaction regex algorithms, report formatting strings, telemetry client HTTP calls.
5. `app/data/*` — Module copy, instructions, troubleshooting cards, prerequisites, security rules.
6. `assets/js/*` — `state.js`, `app.js`.
7. `tests/*` — All unit, integration, and E2E test files.
8. `Dockerfile`, `docker-compose*` — Container definitions and build steps.

---

## 11. Risks & Uncertainties

- **DOM Fixture Tests:** Several test files (`checkpoint-engine.test.js`, `pretraining-readiness-report.test.js`) query specific DOM IDs (e.g. `#sec-module-1`, `#card-cp-1`, `#readiness-status-badge`). Any modification to element IDs during restyling will break assertions.
  *Mitigation:* All existing IDs and `data-*` attributes must be strictly retained.
- **Docker vs Local Dev Runtime:** Port `3173` is served by an existing Docker container running a static snapshot. Local edits will not be reflected on port `3173` until built and brought up in Docker as mandated by user global rules.
  *Mitigation:* Perform TypeScript verification (`npm run typecheck`) and unit tests (`npm test`) during development, followed by full Docker build/up for browser verification.
