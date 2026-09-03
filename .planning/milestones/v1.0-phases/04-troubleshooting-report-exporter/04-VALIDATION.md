# Phase 4 Validation Strategy: Troubleshooting & Report Exporter

## Validation Criteria Matrix

| Req ID | Description | Test Method | Success Criteria |
|---|---|---|---|
| **TRBL-01** | Searchable and categorizable Troubleshooting Knowledge Base | Manual / DOM Inspection | Typing a keyword (e.g. `EPERM` or `PATH`) filters cards. Selecting category pill (e.g., `Node.js`) displays only relevant issues. |
| **TRBL-02** | Step-by-step resolution cards with 1-click copy snippets | User Action / DOM Click | Each failure mode card has a structured list of steps and code blocks with working copy buttons. |
| **TRBL-03** | Interactive Token & Secret Redaction Helper | Automated Test / Manual input | Pasting text containing bot tokens, API keys, emails, and Windows user paths automatically masks them with `[REDACTED_*]` placeholders. |
| **RPT-01** | Pre-filled Form Laporan Kesiapan | State Binding / DOM Inspection | Live preview updates immediately when user changes participant info or marks checkpoints passed/failed. |
| **RPT-02** | 1-Click Copy for WhatsApp/Telegram | Clipboard Inspection | Clicking "Salin Laporan" writes text adhering to Section 15 template to the system clipboard with visual confirmation. |
| **RPT-03** | Print & PDF-Ready Styling | Browser Print Preview / CSS Audit | `@media print` rules hide UI chrome (sidebar, search modal, buttons, toast container) and format cleanly on white background. |

## Automated Test Coverage
- `tests/troubleshooting-exporter.test.js`:
  - 6 regex sanitization tests for sensitive token types.
  - Report template generation matching Section 15 template across multiple status variations.
  - Search filter predicate testing.
