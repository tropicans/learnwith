# Phase 4 Research: Troubleshooting, Redaction Tool, & Report Exporter

## 1. Domain & Requirements Breakdown

Phase 4 fulfills the remaining product requirements from the roadmap:
- **TRBL-01**: User can search and filter troubleshooting guide for common issues (PowerShell policy, PATH, port collision, token leak).
- **TRBL-02**: User can view step-by-step resolution cards for each failure mode with actionable command snippets.
- **TRBL-03**: User can use interactive token redaction tool to sanitize error logs before sharing (masking API keys, tokens, bot tokens, email, etc.).
- **RPT-01**: User can view a pre-filled "Form Laporan Kesiapan" aggregating all participant data and checkpoint status.
- **RPT-02**: User can 1-click copy formatted readiness report ready to paste into WhatsApp / Telegram.
- **RPT-03**: Print and PDF-ready styling (`@media print`) ensures the guide and readiness certificate are cleanly exportable for offline review.

---

## 2. Troubleshooting Knowledge Base (Section 12 Mapping)

We will categorize the 10 failure modes into 4 filter tabs:
1. **Semua Masalah** (`all`)
2. **Node.js & npm** (`node`)
3. **9Router & Port** (`router`)
4. **Telegram & Akun** (`telegram`)

### Catalog of Issues:
1. **`node is not recognized`**:
   - Cause: Node.js is not installed or not registered in Windows environment PATH.
   - Solution: Run LTS installer or check PATH in Command Prompt.
2. **`npm tidak dikenali`**:
   - Cause: Fresh install terminal session has stale PATH.
   - Solution: Reload PATH dynamically in PowerShell:
     `$env:Path = [Environment]::GetEnvironmentVariable('Path','Machine') + ';' + [Environment]::GetEnvironmentVariable('Path','User')`
3. **`running scripts is disabled` (PowerShell ExecutionPolicy)**:
   - Cause: Windows Restricted execution policy.
   - Safe Solution (Zero-Risk): Do NOT change global policy; open standard `Command Prompt` (cmd.exe) and run `npm install -g 9router`.
4. **`9router tidak dikenali`**:
   - Cause: npm global binary directory not loaded.
   - Solution: Restart terminal or run `npm prefix -g` to check location.
5. **Browser tidak menampilkan dashboard (`http://localhost:20128`)**:
   - Cause: Terminal closed or using `https://` by mistake.
   - Solution: Verify terminal is alive, wait 30 seconds, try `http://127.0.0.1:20128`, ensure no `https://`.
6. **Instalasi terlihat berhenti**:
   - Cause: Network stall on npm package download.
   - Solution: Wait up to 10 minutes; if still frozen, take sanitized screenshot without tokens.
7. **`Access denied`, `Permission denied`, or `EPERM`**:
   - Cause: Restricted write access to Global npm folder on Windows.
   - Solution: Launch PowerShell with "Run as Administrator" only for this install step.
8. **Username bot sudah digunakan di Telegram**:
   - Cause: Global Telegram username collision.
   - Solution: Add unique numbers or personal initials, ensuring it still ends with `bot`.
9. **Bot tidak membalas pesan**:
   - Cause: Participant expects bot to chat before workshop.
   - Solution: Explain this is expected behavior during pre-training; Hermes agent connects during live class.
10. **Bot token tidak sengaja terkirim ke orang lain**:
    - Cause: Accidental token leak in chat/screenshot.
    - Solution: Open `@BotFather`, send `/revoke`, pick bot, obtain and store new token immediately.

---

## 3. Redaction Engine Architecture (TRBL-03)

The Redaction tool intercepts raw log text and sanitizes sensitive credentials before students post to public discussion groups or instructors.

### Regex Sanitization Rules:
```javascript
const REDACTION_RULES = [
  {
    name: 'Telegram Bot Token',
    pattern: /\b\d{8,10}:[A-Za-z0-9_-]{35}\b/g,
    replacement: '[REDACTED_TELEGRAM_BOT_TOKEN]'
  },
  {
    name: 'Generic API Key (sk-...)',
    pattern: /\bsk-[A-Za-z0-9_-]{20,}\b/g,
    replacement: '[REDACTED_API_KEY]'
  },
  {
    name: 'Google Cloud API Key (AIza...)',
    pattern: /\bAIza[0-9A-Za-z-_]{35}\b/g,
    replacement: '[REDACTED_GOOGLE_API_KEY]'
  },
  {
    name: 'Bearer Token',
    pattern: /Bearer\s+[A-Za-z0-9._~+/-]+=*/gi,
    replacement: 'Bearer [REDACTED_BEARER_TOKEN]'
  },
  {
    name: 'Email Address',
    pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
    replacement: '[REDACTED_EMAIL]'
  },
  {
    name: 'Windows User Path',
    pattern: /(C:\\Users\\)[a-zA-Z0-9_.-]+(\\)/gi,
    replacement: '$1[USER]$2'
  }
];
```

The tool provides:
- Raw input `<textarea>`
- Interactive "Sensor Informasi Rahasia" button (and real-time debounced sanitization)
- Sanitized output `<textarea>` with detected items counter (e.g., `2 token rahasia disensor`)
- 1-click copy sanitized log button

---

## 4. Form Laporan Kesiapan (RPT-01, RPT-02)

Official format from Section 15 of `PANDUAN-PRE-TRAINING.md`:
```text
Nama: [Peserta Name]
Sistem operasi: [Windows 11 / Windows 10]

[X] Checkpoint 1 — Node.js dan npm siap ([nodeVersion])
[X] Checkpoint 2 — dashboard 9Router terbuka
[X] Checkpoint 3 — bot Telegram dan user ID siap (@[telegramUsername], ID: [telegramUserId])
[X] Google Cloud Console dapat dibuka

Status: [SIAP MENGIKUTI WORKSHOP / PERLU TECHNICAL CLINIC]
Nomor langkah yang bermasalah (jika ada): [Custom Input]
Pesan error yang sudah disensor: [Pesan Error / Nihil]
```

Interactive controls:
- Dynamic live preview updated via `AppState` events and form inputs.
- 1-click "Salin Format Laporan (WhatsApp / Telegram)" with toast and icon feedback.
- "Cetak Laporan / Simpan PDF" button triggering `window.print()`.

---

## 5. Print & PDF Stylesheet Architecture (RPT-03)

Using `@media print` in `assets/css/components.css`:
- Hide sticky navbar, sidebar, theme toggle, search trigger, reset modal, action buttons.
- Force light background and high-contrast text (`color: #000; background: #fff`).
- Clean printable certificate layout for `#sec-readiness-report` and `#sec-readiness-summary`.
- Avoid page breaks inside cards (`break-inside: avoid; page-break-inside: avoid;`).
