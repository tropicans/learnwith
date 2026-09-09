# Phase 25 Research: Interactive Modules 1–5 & 1-Click Copy Engine

**Phase**: 25  
**Directory**: `.planning/phases/25-interactive-modules-1-5-1-click-copy-engine`  
**Goal**: Research and architect interactive modules 1 through 5 (Node.js, 9Router, Bot Telegram & User ID, Google Cloud / Hermes Agent readiness, and Architecture Boundaries & Live Chat flow), master open/close accordion controls, and a robust 1-click copy engine with visual feedback and clipboard fallback.  
**Requirements Covered**: `PRE-MOD-01`, `PRE-MOD-02`, `PRE-MOD-03`, `PRE-MOD-04`, `PRE-MOD-05`, `PRE-MOD-06`  
**Dependencies**: Phase 24 (Pre-Training Foundation Sections & Data Extraction)

---

## 1. Executive Summary & Scope

Phase 25 transitions the core educational substance of the Agentic AI Pre-Training curriculum (`index.html` lines 1083–1960) into modular, type-safe React 19 components for the TanStack Start platform.

In the original prototype (`index.html`), modules 1 through 5 were implemented as static HTML with vanilla JavaScript handlers (`assets/js/app.js`) managing accordion state and 1-click clipboard actions. In this phase, we design the production-grade architecture that delivers:
1. **Interactive Modules 1–5 (`PRE-MOD-01` .. `PRE-MOD-05`)**: Full faithful rendering of all 5 modules including step nodes (Langkah A, B, C...), command blocks, expected terminal output badges, security alerts, caution banners, external links, comparison cards, and checkpoint preview cards.
2. **Accessible Accordion Engine**: Independent module toggle plus master controls ("📖 Buka Semua Modul" / "📁 Tutup Semua Modul") with WCAG-compliant ARIA states (`role="button"`, `aria-expanded`, `aria-controls`) and keyboard interaction (`Enter` / `Space`).
3. **1-Click Copy Engine (`PRE-MOD-06`)**: High-performance clipboard copier supporting modern `navigator.clipboard.writeText` with legacy fallback (`document.execCommand('copy')` via a hidden `<textarea>`), 2-second visual feedback ("✓ Tersalin!", green state, `.copied` class), whitespace/newline preservation, and non-blocking toast notifications.

---

## 2. Requirements & Source Analysis

### 2.1 Requirements Mapping

| Requirement | Scope | Primary Source (`index.html`) | React Target |
| :--- | :--- | :--- | :--- |
| **`PRE-MOD-01`** | Modul 1: Pemeriksaan & Instalasi Node.js (3 Langkah: node check, installer LTS, npm check, Checkpoint 1 preview) | Lines 1099–1260 | `PretrainingModulesSection.tsx` & `PretrainingModuleCard.tsx` (Module 1) |
| **`PRE-MOD-02`** | Modul 2: Instalasi & Menjalankan 9Router (4 Langkah: install global, start service, dashboard port 20128 & password, restart / curl test, Checkpoint 2 preview) | Lines 1265–1446 | `PretrainingModulesSection.tsx` & `PretrainingModuleCard.tsx` (Module 2) |
| **`PRE-MOD-03`** | Modul 3: Pembuatan Bot Telegram & Telegram User ID (5 Langkah: @BotFather verified, `/newbot` rules, token security & `/revoke`, start bot, @userinfobot ID vs username, Checkpoint 3 preview) | Lines 1451–1719 | `PretrainingModulesSection.tsx` & `PretrainingModuleCard.tsx` (Module 3) |
| **`PRE-MOD-04`** | Modul 4: Pemeriksaan Akun Google Cloud & Hermes Agent CLI readiness (Console check, pre-class boundaries, Hermes CLI preview & instructions) | Lines 1724–1815 | `PretrainingModulesSection.tsx` & `PretrainingModuleCard.tsx` (Module 4) |
| **`PRE-MOD-05`** | Modul 5: Catatan & Batasan Penting Sebelum Kelas & Integrasi Flow (9Router & Hermes boundaries, interactive 4-node flow diagram, live chat testing concept) | Lines 1820–1960 | `PretrainingModulesSection.tsx` & `PretrainingModuleCard.tsx` (Module 5) |
| **`PRE-MOD-06`** | 1-Click Copy Engine across all command code blocks with tooltip/toast "Tersalin!" and whitespace/newline preservation | `assets/js/app.js` lines 230–279 | `CopyableCodeBlock.tsx` & `useClipboard` / `showToast` |

---

## 3. Architectural Responsibility Map

```
app/
├── components/
│   ├── course/
│   │   └── pretraining/
│   │       ├── CopyableCodeBlock.tsx          <-- 1-Click Copy Engine with terminal chrome & feedback
│   │       ├── PretrainingModuleCard.tsx      <-- Collapsible module card with accessible header
│   │       ├── PretrainingModulesSection.tsx   <-- Section container with Master Controls (Open/Close All)
│   │       ├── ModuleArchitectureFlow.tsx     <-- Interactive 4-Node Flow diagram (Modul 5)
│   │       └── CheckpointPreviewCard.tsx      <-- Checkpoint 1, 2, 3 preview indicator cards
│   └── ui/
│       └── Toast.tsx                          <-- Lightweight toast notification container/helper
├── data/
│   └── pretrainingModules.ts                  <-- Strongly-typed structured data for Modules 1–5
└── routes/
    └── course.ai.tsx                          <-- Host page rendering Modules 1-5 in mode='pretraining'
```

### 3.1 Data Flow & State Hierarchy

1. **State Isolation**:
   - Master accordion state (`expandedModules: Record<string, boolean>`) is maintained in `PretrainingModulesSection`.
   - Clicking "Buka Semua Modul" sets all modules (`sec-module-1` through `sec-module-5`) to `true`.
   - Clicking "Tutup Semua Modul" sets all modules to `false`.
   - Clicking an individual module card header flips only that module's boolean.
2. **Copy Engine State**:
   - `CopyableCodeBlock` manages its own temporary copied state (`isCopied: boolean`) with an automatic 2000ms timer reset.
   - Copy action invokes `copyToClipboard(text)`, handles browser security context checks, falls back gracefully to `textarea + execCommand`, triggers `showToast`, and toggles the button visual appearance.
3. **Checklist Compatibility for Phase 26**:
   - Each step's checkbox (`<input type="checkbox" className="checklist-checkbox" data-task-id="m1-check-node" />`) is rendered with its standard `data-task-id` attribute.
   - In Phase 25, checkboxes render in their default state, preparing for Phase 26 when the reactive `learnwith_ai_checklist` localStorage engine is connected.

---

## 4. Technical Specifications & Stack Integration

### 4.1 Standard Stack (No External Dependencies Needed)
- **Framework**: React 19 (`useState`, `useCallback`, `useRef`, `useEffect`).
- **Styling**: Existing CSS variables and rules defined in `public/assets/css/components.css` (`.module-card`, `.module-header`, `.collapsed`, `.code-container`, `.code-header`, `.code-dots`, `.code-copy-btn`, `.code-copy-btn.copied`, `.toast`, `.toast-container`, `.alert-box`, `.step-section`).
- **Icons**: Inline SVGs and Unicode emoji matching `index.html` (e.g. 🟢, 🚀, 🤖, ☁️, ⚠️, 📋, 📖, 📁).
- **No Extra Libraries**: Zero need for `react-hot-toast` or external accordion libraries. The existing vanilla styles handle transitions and animations natively.

### 4.2 Don't Hand-Roll: Reusing Established Patterns
- Do **not** inject custom CSS files or inline layout styles that break the existing theme (`public/assets/css/components.css` contains all needed classes).
- Do **not** use `navigator.clipboard` without the `window.isSecureContext` fallback; corporate laptops, local HTTP dev servers, or older WebViews will throw a `NotAllowedError` or `undefined` TypeError.
- Do **not** strip newlines or internal indentations during copy text preparation. Only strip accidental trailing carriage returns.

---

## 5. Detailed Component Architecture

### 5.1 The 1-Click Copy Engine (`CopyableCodeBlock.tsx`)

#### Algorithm & Implementation Pattern
```tsx
export interface CopyableCodeBlockProps {
  code: string
  language?: string
  ariaLabel?: string
  showDots?: boolean
}

export function copyToClipboard(text: string): Promise<boolean> {
  return new Promise((resolve) => {
    // 1. Try modern Async Clipboard API
    if (typeof navigator !== 'undefined' && navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text)
        .then(() => resolve(true))
        .catch(() => fallbackCopy(text, resolve))
    } else {
      fallbackCopy(text, resolve)
    }
  })
}

function fallbackCopy(text: string, resolve: (val: boolean) => void) {
  try {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.left = '-9999px'
    textarea.style.top = '-9999px'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.focus()
    textarea.select()
    const success = document.execCommand('copy')
    document.body.removeChild(textarea)
    resolve(success)
  } catch (err) {
    console.error('Fallback copy failed:', err)
    resolve(false)
  }
}
```

#### Visual State Transition
- Normal state:
  - Button text: `📋 Salin Perintah`
  - Classes: `code-copy-btn`
- Copied state:
  - Button text: `✓ Tersalin!`
  - Classes: `code-copy-btn copied` (CSS applies `background: var(--action-success); color: #ffffff;`)
  - Toast: Trigger `showToast('Perintah berhasil disalin ke clipboard 📋', 'success', 2000)`
  - Duration: 2000ms, then reverts cleanly.

### 5.2 Accordion State Engine & Master Controls

#### State Hierarchy
```tsx
const DEFAULT_EXPANDED_MODULES: Record<string, boolean> = {
  'sec-module-1': true,
  'sec-module-2': true,
  'sec-module-3': true,
  'sec-module-4': true,
  'sec-module-5': true,
}
```

#### Master Toggle Behavior
```tsx
const handleExpandAll = () => {
  setExpandedModules({
    'sec-module-1': true,
    'sec-module-2': true,
    'sec-module-3': true,
    'sec-module-4': true,
    'sec-module-5': true,
  })
  showToast('Semua modul dibuka 📖', 'info', 1800)
}

const handleCollapseAll = () => {
  setExpandedModules({
    'sec-module-1': false,
    'sec-module-2': false,
    'sec-module-3': false,
    'sec-module-4': false,
    'sec-module-5': false,
  })
  showToast('Semua modul disembunyikan 📁', 'info', 1800)
}
```

#### Accessibility & Keyboard Handling
```tsx
<div
  className="module-header"
  role="button"
  tabIndex={0}
  aria-expanded={isExpanded}
  aria-controls={`module-body-${module.num}`}
  onClick={onToggle}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onToggle()
    }
  }}
>
  ...
  <span className="module-chevron" aria-hidden="true">▼</span>
</div>
```

---

## 6. Content Specification: Modules 1–5 Data Model

All text, instructions, external URLs, warnings, and code commands are mapped directly from `index.html` into `app/data/pretrainingModules.ts`.

### 6.1 Modul 1: Pemeriksaan & Instalasi Node.js (`sec-module-1`)
- **Icon**: 🟢
- **Sub-steps**:
  - **Langkah A**: Periksa Apakah Node.js Sudah Terpasang (`node --version`)
    - Output badge: `✓ Hasil yang benar: v24.x.x atau v22.x.x`
    - Alert Info: Penjelasan Versi LTS vs not recognized.
    - Checkbox ID: `m1-check-node`
  - **Langkah B**: Instal Node.js (Jika Belum Tersedia)
    - Link: `https://nodejs.org`
    - 10-step numbered instruction list (LTS download, .msi 64-bit installer, PATH checkbox, terminal restart).
    - Alert Warning: Wajib installer .msi, hindari file ZIP/Source Code.
    - Checkbox ID: `m1-verify-lts`
  - **Langkah C**: Periksa npm (Node Package Manager) (`npm --version`)
    - Output badge: `✓ Hasil yang benar: Menampilkan angka versi npm (contoh: 10.x.x atau 9.x.x)`
    - Checkbox ID: `m1-check-npm`
- **Checkpoint Preview**: Checkpoint 1 (Node.js & npm Siap).

### 6.2 Modul 2: Instalasi & Menjalankan 9Router (`sec-module-2`)
- **Icon**: 🚀
- **Sub-steps**:
  - **Langkah A**: Instalasi Global 9Router (`npm install -g 9router`)
    - Alert Info: Durasi proses pemasangan 1–3 menit, jangan tutup terminal.
    - Checkbox ID: `m2-install-pkg`
  - **Langkah B**: Menjalankan 9Router & Membuka Dashboard (`9router`)
    - URL link: `http://localhost:20128` (or `http://127.0.0.1:20128`).
    - Alert Warning: Jendela PowerShell Wajib Tetap Terbuka! Localhost port 20128.
    - Checkbox ID: `m2-start-service`
  - **Langkah C**: Login Dashboard & Kata Sandi Awal (`123456`)
    - 5-step numbered instruction list for default password login and personal note.
    - Alert Info: Catatan Keamanan Kata Sandi lokal vs akun pribadi.
    - Checkbox ID: `m2-open-dashboard`
  - **Langkah D**: Cara Menghentikan & Menjalankan Kembali (`Ctrl + C`)
    - Code command: `Ctrl + C`
    - Instruction for restarting service via `9router`.
    - Verification snippet: `curl http://localhost:20128/v1/models` (supports PRE-MOD-02).
    - Checkbox ID: `m2-verify-local`
- **Checkpoint Preview**: Checkpoint 2 (Dashboard 9Router Terbuka).

### 6.3 Modul 3: Pembuatan Bot Telegram & Telegram User ID (`sec-module-3`)
- **Icon**: 🤖
- **Sub-steps**:
  - **Langkah A**: Buka Akun Resmi @BotFather di Telegram
    - Link: `https://t.me/BotFather`
    - Alert Warning: Waspada Akun Tiruan / Palsu (wajib verified blue badge).
    - Checkbox ID: `m3-start-botfather`
  - **Langkah B**: Buat Bot Baru dengan Perintah `/newbot`
    - Code command: `/newbot`
    - Instructions: Display Name, Username rules (unique, alphanumeric + `_`, ending with `bot`).
    - Alert Info: Privasi Nama & Username.
    - Checkbox ID: `m3-create-newbot`
  - **Langkah C**: Simpan Bot Token dengan Aman & Aturan Kerahasiaan
    - Alert Danger: DILARANG KERAS MENYEBARKAN BOT TOKEN!
    - Emergency code command: `/revoke`
    - Checkbox ID: `m3-save-token-secure`
  - **Langkah D**: Buka Bot Anda & Tekan Start
    - Instructions: Klik `t.me/bot_anda`, tekan Start.
    - Alert Info: Bot belum merespons adalah hal normal sebelum dihubungkan ke Hermes Agent.
  - **Langkah E**: Dapatkan Nomor Telegram User ID Anda via @userinfobot
    - Link: `https://t.me/userinfobot`
    - Comparison grid: Username Telegram (`@nama_pengguna`, mutable) vs Telegram User ID (`123456789`, immutable pure numbers).
    - Alert Warning: Aturan Keamanan @userinfobot.
    - Checkbox ID: `m3-get-userid`
- **Checkpoint Preview**: Checkpoint 3 (Bot Telegram & User ID Siap).

### 6.4 Modul 4: Pemeriksaan Akun Google Cloud & Hermes Agent Readiness (`sec-module-4`)
- **Icon**: ☁️
- **Sub-steps**:
  - **Langkah A**: Buka & Login ke Google Cloud Console
    - Link: `https://console.cloud.google.com`
    - Instructions: Login akun Google pribadi, verifikasi dashboard cloud.
    - Checkbox ID: `m4-open-console`
  - **Langkah B**: Verifikasi Tampilan & Batasan Penting Pra-Kelas
    - Alert Warning: BATASAN PENTING PRA-KELAS (Jangan buat project, jangan aktifkan calendar API, jangan masukkan kartu kredit/billing).
    - Alert Info: Saran pemilihan akun Google pribadi/latihan.
    - Hermes Agent preparation preview: `hermes -v` verification commands and provider alignment rules.
    - Checkbox ID: `m4-verify-login`

### 6.5 Modul 5: Catatan & Batasan Penting Sebelum Kelas & Integrasi Flow (`sec-module-5`)
- **Icon**: ⚠️
- **Sub-steps / Boundaries**:
  - **Batasan 1**: Jangan Memilih Provider atau Model AI Terlebih Dahulu (Batasan 9Router).
  - **Batasan 2**: Jangan Menginstal Hermes Agent Terlebih Dahulu (Larangan instalasi mandiri, `hermes setup`, `hermes model`).
  - **Batasan 3**: Diagram Alur Hubungan Sistem & Live Chat Testing Concept
    - Interactive 4-Node Architecture Flow:
      1. `📱 Telegram Ponsel` (Kirim Pesan Jadwal)
      2. `🤖 Hermes Agent` (Asisten Cerdas di Laptop)
      3. `🚀 9Router` (`:20128/v1` Perute AI Lokal)
      4. `🧠 Model AI Cloud` (Menganalisis & Eksekusi Google Calendar)
    - Live chat endpoint verification command: `curl http://localhost:20128/v1/models`
    - Pre-Training Anda Siap alert banner.

---

## 7. Common Pitfalls & Mitigations

| Pitfall | Risk | Mitigation |
| :--- | :--- | :--- |
| **Whitespace Stripping in Copy** | Multi-line curl or JSON configurations get condensed into single lines or corrupt indentation | Only call `.trim()` on outer boundary; never use regex that replaces `\n` or `\s+` within code strings. |
| **SSR / Hydration Crash** | Accessing `navigator.clipboard` or `window.isSecureContext` during SSR render on the server | Wrap clipboard calls in client-side event handlers and guard with `typeof window !== 'undefined'`. |
| **Accordion Focus Trap / A11y Failure** | Screen readers don't announce toggle state; keyboard users cannot open modules | Implement `role="button"`, `tabIndex={0}`, `aria-expanded={isExpanded}`, `aria-controls`, and listen to `Enter` and `Space` keydown events. |
| **Toast Memory Leaks** | Rapid clicking creates orphaned DOM elements or hanging `setTimeout` closures | Use a managed React state for toasts with cleanup or a safe auto-dismissing timeout tied to component lifecycle. |
| **Premature Checklist Mutation** | Modifying `data-task-id` checkboxes before Phase 26 causes state desynchronization | Render checkboxes with `data-task-id` attributes and disabled/inert or read-only states until Phase 26 wires up `learnwith_ai_checklist`. |

---

## 8. Validation Architecture & Nyquist Test Plan

### 8.1 Test File Strategy
We will create a dedicated automated test suite: `tests/pretraining-modules.test.js`.
The test suite will execute under the Node.js test runner using `& C:\nvm4w\nodejs\node.exe --test tests/pretraining-modules.test.js`.

### 8.2 Test Mapping for Requirements

| Requirement | Test Description | Success Criteria |
| :--- | :--- | :--- |
| **`PRE-MOD-01`** | Verify Modul 1 data model & step structure | Data exports 3 steps (`m1-check-node`, `m1-verify-lts`, `m1-check-npm`), commands `node --version` and `npm --version`, and Checkpoint 1 preview. |
| **`PRE-MOD-02`** | Verify Modul 2 data model & step structure | Data exports 4 steps (`m2-install-pkg`, `m2-start-service`, `m2-open-dashboard`, `m2-verify-local`), commands `npm install -g 9router`, `9router`, `Ctrl + C`, curl verification, and Checkpoint 2 preview. |
| **`PRE-MOD-03`** | Verify Modul 3 data model & step structure | Data exports 5 steps (`m3-start-botfather`, `m3-create-newbot`, `m3-save-token-secure`, `m3-get-userid`), commands `/newbot` and `/revoke`, and Checkpoint 3 preview. |
| **`PRE-MOD-04`** | Verify Modul 4 data model & step structure | Data exports 2 steps (`m4-open-console`, `m4-verify-login`), Google Cloud Console URL, and Hermes Agent readiness notes. |
| **`PRE-MOD-05`** | Verify Modul 5 data model & flow architecture | Data exports boundaries for 9Router and Hermes Agent, and the 4-node architecture diagram components. |
| **`PRE-MOD-06`** | Verify 1-Click Copy helper & state transitions | `copyToClipboard` executes clipboard API or fallback, preserves multi-line whitespace, and triggers toast/copied feedback. |
| **Accordion** | Verify Master Controls & Component DOM parity | Component markup contains `#btn-expand-all-modules`, `#btn-collapse-all-modules`, `#sec-module-1` through `#sec-module-5`, and valid ARIA attributes. |

### 8.3 CLI Commands for Validation
```powershell
# 1. Run the Phase 25 dedicated unit test
& C:\nvm4w\nodejs\node.exe --test tests/pretraining-modules.test.js

# 2. Run the entire test suite to ensure no regressions
& C:\nvm4w\nodejs\node.exe --test tests/*.test.js

# 3. Verify TypeScript type safety
& C:\nvm4w\nodejs\node.exe ./node_modules/typescript/bin/tsc --noEmit
```

---

## 9. Security Domain & Best Practices

1. **Secret Redaction Reminders**:
   - Explicit alert banners in Modul 3 prominently declare `DILARANG KERAS MENYEBARKAN BOT TOKEN!`.
   - Clear guidelines prevent participants from sharing tokens, passwords, or Google Cloud credentials.
2. **Safe Code Block Rendering**:
   - Code snippets are rendered as pure text children inside `<pre className="code-content"><code>{code}</code></pre>`.
   - Never use `dangerouslySetInnerHTML` for command rendering.
3. **External Link Hardening**:
   - All links to external domains (`nodejs.org`, `t.me/BotFather`, `t.me/userinfobot`, `console.cloud.google.com`) strictly feature `target="_blank" rel="noopener noreferrer"`.

---

## 10. Implementation Roadmap for Phase 25

1. **Step 1: Data Model (`app/data/pretrainingModules.ts`)**:
   - Extract and type all text, steps, commands, badges, alerts, links, and preview cards for Modules 1–5 with 100% fidelity to `index.html`.
2. **Step 2: 1-Click Copy Engine & UI Components**:
   - Create `app/components/course/pretraining/CopyableCodeBlock.tsx` with clipboard API + `<textarea>` fallback and 2000ms visual state transition.
   - Create `app/components/ui/Toast.tsx` / toast dispatcher.
3. **Step 3: Module Card & Master Accordion Components**:
   - Create `PretrainingModuleCard.tsx` with collapsible logic and ARIA support.
   - Create `ModuleArchitectureFlow.tsx` for Modul 5 interactive flow.
   - Create `PretrainingModulesSection.tsx` with Master Controls (`#btn-expand-all-modules` / `#btn-collapse-all-modules`).
4. **Step 4: Route Integration & Regression Testing**:
   - Integrate `PretrainingModulesSection` into `app/routes/course.ai.tsx` under `mode === 'pretraining'`.
   - Implement `tests/pretraining-modules.test.js`.
   - Run typecheck and full test suite.
