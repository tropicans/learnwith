# Phase 27 Research: Troubleshooting Hub & Secret Token Redaction Assistant

**Phase**: 27  
**Directory**: `.planning/phases/27-troubleshooting-hub-secret-token-redaction-assistant`  
**Goal**: Research and architect the Pre-Training Troubleshooting Hub with real-time text search and category filtering (Node.js, 9Router, Telegram, Hermes, PowerShell), 10+ error resolution cards with 1-click copyable steps, and the Secret Token Redaction Assistant for masking sensitive credentials before sharing logs.  
**Requirements Covered**: `PRE-TOOL-01`, `PRE-TOOL-02`, `PRE-TOOL-03`  
**Dependencies**: Phase 26 (Checklist Engine, Checkpoint Gates & Dynamic Readiness)  

---

## 1. Executive Summary & Scope

Phase 27 equips non-technical participants and workshop attendees with self-service troubleshooting tools and active privacy protection. During pre-training preparation, participants run local command-line tools (Node.js, 9Router, Telegram Bot creation via BotFather, PowerShell scripts, and early Hermes CLI setup). Technical friction and errors naturally arise—from blocked PowerShell execution policies to port conflicts and leaked tokens.

In the baseline prototype (`index.html` lines 2251–2606, `assets/js/app.js` lines 880–1130, `tests/troubleshooting-exporter.test.js`), these capabilities were provided via:
1. **Interactive Troubleshooting Hub (`PRE-TOOL-01`, `PRE-TOOL-02`)**:
   - A search bar with instant substring matching across error titles, codes, causes, and step-by-step instructions.
   - Category filter pills for rapid categorization: Node.js, 9Router, Telegram Bot, Hermes Agent, and PowerShell.
   - 10+ structured error resolution cards detailing root causes, step-by-step guidance, and copyable terminal commands for common issues (including `EADDRINUSE`, `401 Unauthorized`, `Execution_Policies`, and `Telegram 409 Conflict`).
2. **Secret Token Redaction Assistant (`PRE-TOOL-03`)**:
   - A privacy workbench allowing participants to paste raw error logs or terminal dumps.
   - Client-side regex engine that automatically masks Telegram Bot tokens, OpenAI API keys, Google Cloud / Gemini API keys, Bearer/JWT tokens, email addresses, and Windows user directories.
   - Real-time detection badge counter (`X data sensitif disensor 🛡️`) and 1-click copy button for the sanitized output.

This research establishes the typed data structures, regex redaction specifications, React 19 component architecture, route integration in `app/routes/course.ai.tsx`, and automated test suites for Phase 27.

---

## 2. Requirements & Source Analysis

### 2.1 Requirements Mapping

| Requirement | Scope | Baseline Prototype Source | TanStack Start React Target |
| :--- | :--- | :--- | :--- |
| **`PRE-TOOL-01`** | Instant search & category filter buttons (Node.js, 9Router, Telegram, Hermes, PowerShell) | `index.html` lines 2263–2281, `assets/js/app.js` lines 883–949 | `PretrainingTroubleshootingSection.tsx`, `app/data/pretrainingTroubleshooting.ts` |
| **`PRE-TOOL-02`** | 10+ error resolution cards (including `EADDRINUSE`, `401 Unauthorized`, `Execution_Policies`, `Telegram 409 Conflict`) with 1-click copy | `index.html` lines 2284–2531, `assets/js/app.js` lines 895–911 | `TroubleshootingCard.tsx`, `CopyableCodeBlock.tsx` |
| **`PRE-TOOL-03`** | Secret Token Redaction Assistant to paste log text and mask Telegram tokens, Gemini/GCP keys, Bearer tokens, etc. | `index.html` lines 2537–2606, `assets/js/app.js` lines 1028–1105 | `PretrainingRedactionSection.tsx`, `app/utils/redaction.ts` |

### 2.2 Traceability with Existing Tests

The codebase already contains `tests/troubleshooting-exporter.test.js`, which verifies:
- `sanitizeLogText(rawText)` masking Telegram Bot tokens, OpenAI keys, Google Cloud API keys, Bearer tokens, emails, and Windows user paths.
- Match counts and regex safety.
- Category pills existence: `all`, `node`, `router`, `telegram`.

Phase 27 will preserve 100% backward compatibility with `tests/troubleshooting-exporter.test.js` while providing clean TypeScript implementations in `app/utils/redaction.ts` and `app/data/pretrainingTroubleshooting.ts`.

---

## 3. Deep Architectural Investigation

### 3.1 Data Model: Troubleshooting Hub (`app/data/pretrainingTroubleshooting.ts`)

To satisfy `PRE-TOOL-01` and `PRE-TOOL-02`, we design a strongly-typed schema and complete dataset of **15 error resolution cards** spanning all 5 required categories.

```typescript
export type TroubleshootingCategory = 'all' | 'node' | 'router' | 'telegram' | 'hermes' | 'powershell'

export type TroubleSeverity = 'neutral' | 'warning' | 'danger' | 'primary'

export interface TroubleshootingCodeBlock {
  language: string
  code: string
  label?: string
  ariaLabel?: string
  toastMessage?: string
}

export interface TroubleshootingItem {
  id: string
  title: string
  category: TroubleshootingCategory
  categoryLabel: string
  icon: string
  severity: TroubleSeverity
  cause: string
  steps: string[]
  codeBlock?: TroubleshootingCodeBlock
  keywords?: string[]
}

export interface TroubleshootingCategoryOption {
  id: TroubleshootingCategory
  label: string
}
```

#### Categories Specification
1. `'all'`: "Semua Kendala (15)"
2. `'node'`: "Node.js & npm"
3. `'router'`: "9Router & Port"
4. `'telegram'`: "Telegram Bot"
5. `'hermes'`: "Hermes Agent"
6. `'powershell'`: "PowerShell Security"

#### Dataset: 15 Error Resolution Cards

| # | ID | Category | Title / Error Message | Required Pattern Named in PRE-TOOL-02 | Key Solution / Copyable Command |
|---|---|---|---|---|---|
| 1 | `trbl-node-not-recognized` | `node` | Pesan: `node is not recognized` / tidak dikenali | - | Unduh installer LTS dari nodejs.org, centang Add to PATH |
| 2 | `trbl-npm-not-recognized` | `node` | Pesan: `npm tidak dikenali` / `The term 'npm' is not recognized` | - | Muat ulang PATH: `$env:Path = [Environment]::GetEnvironmentVariable('Path','Machine') + ';' + [Environment]::GetEnvironmentVariable('Path','User')` |
| 3 | `trbl-ps-execution-policies` | `powershell` | Pesan: `running scripts is disabled on this system` | `Execution_Policies` | Gunakan Command Prompt (cmd.exe) atau `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` |
| 4 | `trbl-ps-eperm` | `powershell` | Pesan: `Access denied`, `Permission denied`, atau `EPERM` | - | Jalankan PowerShell via "Run as administrator" untuk `npm install -g 9router` |
| 5 | `trbl-router-eaddrinuse` | `router` | Pesan: `EADDRINUSE: address already in use :::20128` | `EADDRINUSE` | Hentikan proses pada port 20128: `Stop-Process -Id (Get-NetTCPConnection -LocalPort 20128).OwningProcess -Force` |
| 6 | `trbl-router-not-recognized` | `router` | Pesan: `9router tidak dikenali` / global executable hilang | - | Jalankan alternatif via `npx 9router` |
| 7 | `trbl-router-dashboard-unreachable` | `router` | Browser tidak dapat menampilkan dashboard (`http://localhost:20128`) | - | Pastikan jendela terminal aktif, gunakan `http://` bukan `https://`, coba `http://127.0.0.1:20128` |
| 8 | `trbl-router-401-unauthorized` | `router` | Pesan: `401 Unauthorized / Invalid API Key` | `401 Unauthorized` | Periksa menu Models & API Keys di dashboard 9Router; buat ulang key tanpa membagikannya ke publik |
| 9 | `trbl-router-install-stuck` | `router` | Proses instalasi `npm install -g 9router` terlihat macet / lambat | - | Tunggu hingga 5-10 menit, periksa koneksi via `npm ping` |
| 10 | `trbl-tg-409-conflict` | `telegram` | Pesan: `Telegram 409 Conflict: terminated by other getUpdates request` | `Telegram 409 Conflict` | Hentikan instance ganda: `hermes gateway stop` sebelum memulai gateway baru |
| 11 | `trbl-tg-username-taken` | `telegram` | Username bot sudah digunakan orang lain (`already taken`) | - | Tambahkan inisial/tahun/angka unik berakhiran `bot` atau `_bot` |
| 12 | `trbl-tg-bot-no-reply` | `telegram` | Bot Telegram tidak membalas saat dikirimi pesan | - | Penjelasan: Normal di pra-training; Hermes Agent baru dihubungkan pada sesi workshop |
| 13 | `trbl-tg-token-leaked` | `telegram` | Bot token tidak sengaja terkirim ke grup / publik | - | Segera revoke ke @BotFather: `/revoke` |
| 14 | `trbl-hermes-not-recognized` | `hermes` | Pesan: `'hermes' tidak dikenali` / `command not found` | - | Diagnosis via `hermes doctor`, daftarkan `~/.hermes/bin` ke PATH |
| 15 | `trbl-hermes-unauthorized` | `hermes` | Pesan: Bot membalas `unauthorized` / `Akses ditolak` di chat | - | Daftarkan User ID Telegram numerik ke `TELEGRAM_ALLOWED_USERS` via `hermes gateway setup` |

---

### 3.2 Secret Token Redaction Engine (`app/utils/redaction.ts`)

#### 3.2.1 Redaction Rules Matrix

```typescript
export interface RedactionRule {
  name: string
  pattern: RegExp
  replacement: string
}

export const REDACTION_RULES: RedactionRule[] = [
  {
    name: 'Telegram Bot Token',
    pattern: /\b\d{8,10}:[A-Za-z0-9_-]{35}\b/g,
    replacement: '[REDACTED_TELEGRAM_BOT_TOKEN]',
  },
  {
    name: 'OpenAI API Key',
    pattern: /\bsk-[A-Za-z0-9_-]{20,}\b/g,
    replacement: '[REDACTED_API_KEY]',
  },
  {
    name: 'Google Cloud API Key',
    pattern: /\bAIza[0-9A-Za-z-_]{35}\b/g,
    replacement: '[REDACTED_GOOGLE_API_KEY]',
  },
  {
    name: 'Bearer Token',
    pattern: /Bearer\s+[A-Za-z0-9._~+/-]+=*/gi,
    replacement: 'Bearer [REDACTED_BEARER_TOKEN]',
  },
  {
    name: 'Email Address',
    pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
    replacement: '[REDACTED_EMAIL]',
  },
  {
    name: 'Windows User Path',
    pattern: /(C:\\Users\\)[a-zA-Z0-9_.-]+(\\)/gi,
    replacement: '$1[USER]$2',
  },
]
```

#### 3.2.2 Sanitization Function
```typescript
export interface SanitizeResult {
  sanitized: string
  matchesCount: number
}

export function sanitizeLogText(rawText: string | null | undefined): SanitizeResult {
  if (!rawText) {
    return { sanitized: '', matchesCount: 0 }
  }

  let sanitized = String(rawText)
  let totalMatches = 0

  for (const rule of REDACTION_RULES) {
    // Reset lastIndex for stateful RegExp instances
    rule.pattern.lastIndex = 0
    const matches = sanitized.match(rule.pattern)
    if (matches) {
      totalMatches += matches.length
      sanitized = sanitized.replace(rule.pattern, rule.replacement)
    }
  }

  return { sanitized, matchesCount: totalMatches }
}
```

#### 3.2.3 Security & ReDoS Invariants
- All token regex patterns use bounded lengths (`{8,10}`, `{35}`, `{20,}`).
- No nested quantifiers `(a+)+` exist, ensuring zero risk of catastrophic backtracking (ReDoS).
- Pure client-side execution ensures no unredacted participant tokens touch network sockets or server logs.

---

### 3.3 UI Component Hierarchy & Interaction Design

```
app/
├── components/course/pretraining/
│   ├── CopyableCodeBlock.tsx                     (Phase 25 - Reused for 1-click copy)
│   ├── TroubleshootingCard.tsx                  (Single error resolution card)
│   ├── PretrainingTroubleshootingSection.tsx     (Search input, category pills, card grid, empty state)
│   └── PretrainingRedactionSection.tsx           (Privacy workbench, dual textareas, badge count, copy)
├── data/
│   └── pretrainingTroubleshooting.ts            (15 structured error items, categories)
├── utils/
│   └── redaction.ts                             (REDACTION_RULES, sanitizeLogText)
└── routes/
    └── course.ai.tsx                            (Mounts sections beneath PretrainingReadinessSection)
```

#### 3.3.1 `PretrainingTroubleshootingSection.tsx`
- Section ID: `#sec-troubleshooting`
- Header with wrench badge `🔧`, title "Pusat Bantuan & Troubleshooting Kendala", subtitle.
- **Search bar**:
  - Input ID: `#troubleshoot-search-input`
  - Classes: `.troubleshoot-search-wrap`, `.troubleshoot-search-icon`, `.troubleshoot-search-input`.
  - Substring search against `title`, `cause`, `steps`, `keywords`, and `categoryLabel` (case-insensitive).
  - Clear search button when query is present.
- **Category Filter Pills**:
  - Container ID: `troubleshoot-filter-pills` (role="group", aria-label="Filter kategori kendala").
  - Buttons: `.troubleshoot-filter-btn`, with `.active` class and `aria-pressed="true"` for active category.
  - Keyboard navigation: ArrowLeft, ArrowRight, Home, End cycle focus between filter pills.
- **Card Grid**:
  - Container ID: `#troubleshoot-cards-container`, class `.troubleshoot-grid`.
  - Renders matched `TroubleshootingCard` components.
- **Empty State**:
  - When no cards match query: display helpful message ("Tidak ditemukan solusi untuk kata kunci ... Coba cari kata kunci lain atau gunakan Alat Bantu Sensor Log di bawah").

#### 3.3.2 `TroubleshootingCard.tsx`
- Class: `.trouble-card` (and `.danger` modifier if severity is `'danger'`).
- Attribute: `data-trouble-category={item.category}`.
- Header with icon (`.trouble-icon`), title (`.trouble-title`), and badge pill (`.badge.badge-pill`).
- Cause callout: `.trouble-cause` with bold "Penyebab: " prefix.
- Steps list: `<ol className="trouble-steps">` with ordered `<li>` items.
- Optional code block: Embedded `CopyableCodeBlock` with 1-click copy and toast notification.

#### 3.3.3 `PretrainingRedactionSection.tsx`
- Section ID: `#sec-redaction`
- Header with shield badge `🛡️`, title "Alat Bantu Sensor Log Rahasia (Redaction Tool)", subtitle.
- Workbench: `.redaction-workbench`
- Status badge: `#redaction-count-badge`
  - 0 detected & empty: "0 data terdeteksi" (`badge-neutral`)
  - matchesCount > 0: `"{matchesCount} data sensitif disensor 🛡️"` (`badge-warning`)
  - raw.length > 0 & matchesCount === 0: `"Aman (tidak terdeteksi token rahasia) ✓"` (`badge-success`)
- Dual-pane grid:
  - Left pane: Raw textarea `#redaction-input`, placeholder with sample bot token and path.
  - Right pane: Redacted textarea `#redaction-output`, read-only, highlighted styling (`.redaction-output`).
- Action buttons:
  - `#btn-trigger-redaction`: "🔍 Periksa Sekarang"
  - `#btn-copy-redacted`: "📋 Salin Log Tersensor" (copies sanitized text to clipboard via `copyToClipboard()` with toast feedback "Log tersensor berhasil disalin ke clipboard 🛡️").
  - Clear button: "🗑️ Bersihkan" to reset both input and output.
- Pill list of protected entities: `.redaction-pill-list`
  - "✓ Telegram Bot Token"
  - "✓ Google Gemini / Cloud API Key"
  - "✓ OpenAI API Key"
  - "✓ Bearer / JWT Token"
  - "✓ Alamat Email"
  - "✓ Direktori User Windows"

---

## 4. Validation Architecture & Automated Testing Plan

### 4.1 Test File Strategy

Create `tests/pretraining-troubleshooting.test.js` executed via Node's native test runner (`node --test tests/pretraining-troubleshooting.test.js`).

### 4.2 Test Suites Breakdown

```
Phase 27 Troubleshooting Hub & Secret Redaction Assistant Suite
├── Suite 1: Data Model & Error Cards (PRE-TOOL-01, PRE-TOOL-02)
│   ├── Exports PRETRAINING_TROUBLESHOOTING_ITEMS with >= 10 items (exactly 15)
│   ├── Verifies representation across all 5 categories (node, router, telegram, hermes, powershell)
│   ├── Validates presence of named error card: EADDRINUSE (port 20128)
│   ├── Validates presence of named error card: 401 Unauthorized / Invalid API Key
│   ├── Validates presence of named error card: Execution_Policies (PowerShell script disabled)
│   ├── Validates presence of named error card: Telegram 409 Conflict (multiple bot instances)
│   └── Validates every card has non-empty id, title, cause, steps (>= 1), and valid severity
├── Suite 2: Search & Category Filter Logic (PRE-TOOL-01)
│   ├── Filters items by category ('node', 'router', 'telegram', 'hermes', 'powershell', 'all')
│   ├── Substring search matches title, cause, steps, and keywords
│   ├── Case-insensitive query matching (e.g. "eaddrinuse" matches "EADDRINUSE")
│   └── Returns empty array when query does not match any items
├── Suite 3: Secret Token Redaction Engine (PRE-TOOL-03)
│   ├── Telegram Bot Token is masked to [REDACTED_TELEGRAM_BOT_TOKEN]
│   ├── OpenAI API Key is masked to [REDACTED_API_KEY]
│   ├── Google Cloud / Gemini API Key is masked to [REDACTED_GOOGLE_API_KEY]
│   ├── Bearer / JWT Token is masked to Bearer [REDACTED_BEARER_TOKEN]
│   ├── Email address is masked to [REDACTED_EMAIL]
│   ├── Windows username in file path is masked to C:\Users\[USER]\...
│   ├── Multi-secret string correctly redacts all tokens and computes exact matchesCount
│   └── Handles empty, null, and whitespace inputs safely without throwing
└── Suite 4: Component Rendering & Route Integration
    ├── Verifies DOM section fixtures #sec-troubleshooting and #sec-redaction exist
    ├── Verifies search input #troubleshoot-search-input and category pills exist
    ├── Verifies redaction input #redaction-input, output #redaction-output, and copy button exist
    └── Verifies app/routes/course.ai.tsx renders both sections when mode === 'pretraining'
```

### 4.3 Regression Safety Invariants
- Existing test `tests/troubleshooting-exporter.test.js` MUST continue to pass 100% (30/30 assertions).
- Existing pretraining test suites `tests/pretraining-*.test.js` MUST pass 100%.
- TypeScript compiler `tsc --noEmit` MUST pass with 0 errors.

---

## 5. Security Domain & Risk Analysis

1. **Token Protection Guarantee**:
   - Participants must never share raw bot tokens or API keys with instructors, peers, or public chat channels.
   - The redaction engine operates strictly client-side within the browser JavaScript runtime.
   - The copy button on the redaction assistant only copies the *sanitized* text (`outputEl.value`), never the raw input.
2. **Regex Safety (ReDoS)**:
   - All quantifiers are bounded or linear.
   - No catastrophic backtracking combinations.
3. **Clipboard Isolation**:
   - `copyToClipboard()` trims bounding whitespace but preserves line breaks.
   - Falls back gracefully to `document.execCommand('copy')` if clipboard API is restricted by iframe/security permissions.

---

## 6. Common Pitfalls & Edge Cases

| Pitfall | Risk | Mitigation |
| :--- | :--- | :--- |
| **RegExp `lastIndex` Statefulness** | Re-using global regex instances `/g` across calls causes `test()` or `exec()` to miss matches. | In `sanitizeLogText()`, explicitly reset `rule.pattern.lastIndex = 0` before scanning, or use `String.prototype.match()` and `replace()`. |
| **Windows Path Redaction Boundaries** | Paths with uppercase/lowercase drive letters (`c:\users\...` vs `C:\Users\...`) or forward slashes. | Use `/gi` flag and pattern `/(C:\\Users\\)[a-zA-Z0-9_.-]+(\\)/gi`. Maintain exact match with test suite expectations. |
| **Dual Telegram Bot Tokens in One Message** | Multiple tokens on consecutive lines might have one skipped. | Use `sanitized.match(rule.pattern)` which returns all occurrences in a single pass. |
| **Live Input Lag on Huge Log Dumps** | Pasting 10,000 lines of terminal output could freeze the UI thread during typing. | Client-side regex against 6 rules on moderate text (< 50KB) runs in < 2ms. For large pastes, `onChange` triggers efficiently without external network overhead. |
| **Search Filter Collision** | Searching for "node" while "router" category is active could show 0 results unexpectedly. | Clearly display "Menampilkan 0 kendala pada kategori 9Router" with a quick link or pill to switch to "Semua Kendala". |

---

## 7. Recommended Work Breakdown (Plans)

### Plan 27-01: Data Layer, Redaction Engine & Automated Unit Test Suite
- Create `app/data/pretrainingTroubleshooting.ts`:
  - Category types, 15 structured troubleshooting items with root causes, steps, and copyable code blocks.
  - Category options list (`all`, `node`, `router`, `telegram`, `hermes`, `powershell`).
- Create `app/utils/redaction.ts`:
  - Typed `REDACTION_RULES`, `sanitizeLogText()`, `SanitizeResult`.
  - Parity with `assets/js/app.js` and `tests/troubleshooting-exporter.test.js`.
- Create `tests/pretraining-troubleshooting.test.js`:
  - 4 test suites covering data completeness, search/filter logic, regex masking, and component exports.
  - Run and verify all 4 suites pass.

### Plan 27-02: React 19 Components, Route Integration & Full Verification
- Create `app/components/course/pretraining/TroubleshootingCard.tsx`:
  - Accessible card presentation, severity styling, code block copy integration.
- Create `app/components/course/pretraining/PretrainingTroubleshootingSection.tsx`:
  - Live search input, category filter pills with keyboard arrow navigation, cards grid, dynamic result count, and empty state.
- Create `app/components/course/pretraining/PretrainingRedactionSection.tsx`:
  - Dual-pane redaction workbench, live detection badge counter, "Periksa Sekarang", "Salin Log Tersensor", and "Bersihkan" actions.
- Update `app/routes/course.ai.tsx`:
  - Mount `PretrainingTroubleshootingSection` and `PretrainingRedactionSection` directly beneath `PretrainingReadinessSection`.
- Run full test verification:
  - `node --test tests/pretraining-*.test.js`
  - `node --test tests/*.test.js`
  - `tsc --noEmit`

---

## 8. Verification Sign-Off Checklist

- [ ] 15 troubleshooting cards exported across `node`, `router`, `telegram`, `hermes`, `powershell`.
- [ ] Explicit cards for `EADDRINUSE`, `401 Unauthorized`, `Execution_Policies`, and `Telegram 409 Conflict`.
- [ ] Real-time search and category filtering functioning seamlessly.
- [ ] Redaction engine masks Telegram Bot tokens, Google Gemini/Cloud keys, OpenAI keys, Bearer tokens, emails, and Windows user paths.
- [ ] 1-Click copy on troubleshooting steps and redacted logs with toast feedback.
- [ ] 100% test pass rate on all native Node tests and TypeScript compiler.
