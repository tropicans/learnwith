# Requirements: Pre-Training & Live Workshop Interactive Web App

**Defined:** 2026-09-04
**Core Value:** Empower non-technical participants to complete all pre-training prerequisites and live in-class practical exercises independently, safely, and without anxiety through clear visual guidance, interactive checklists, and automated checkpoint reporting.

## v1.1 Requirements (Milestone: Live Workshop Guide)

Requirements for Milestone v1.1: Live Workshop Guide (Hari-H Praktik Kelas). Each maps to roadmap phases.

### Mode Switcher & Navigation (MODE)

- [ ] **MODE-01**: User can toggle between "Pra-Training (Persiapan)" and "Hari-H (Praktik Kelas)" via tab switchers in the header and sidebar.
- [ ] **MODE-02**: Switching modes dynamically updates the sidebar navigation links, section visibility, and active progress counters while preserving state across modes.

### In-Class Guide Modules (CLASS)

- [ ] **CLASS-01**: User can follow collapsible interactive guides for Modul 6 (Menyamakan 9Router: provider, model, API key lokal, dan endpoint `http://localhost:20128/v1`).
- [ ] **CLASS-02**: User can follow Modul 7 with 1-click copy for Hermes Windows installation script (`iex (irm https://hermes-agent.nousresearch.com/install.ps1)`) and `hermes doctor` command.
- [ ] **CLASS-03**: User can follow Modul 8 for `hermes setup` wizard (model, endpoint, API key) and testing Hermes response via 9Router.
- [ ] **CLASS-04**: User can follow Modul 9 for Telegram Gateway interactive setup (`hermes gateway setup`, `hermes gateway start`, `status`, `stop`) with allowlist user ID enforcement.
- [ ] **CLASS-05**: User can follow Modul 10 for Google Cloud OAuth 2.0 (Desktop app type), client secret JSON download, and Google Calendar skill authorization.
- [ ] **CLASS-06**: User can follow Modul 11 for end-to-end testing prompts (read agenda, create dummy agenda) and post-workshop operational restart procedures.

### Live Workshop Checkpoints (GATE)

- [ ] **GATE-01**: User can validate Checkpoint 4 (9Router active, model/provider synchronized, API key private) with Pass/Fail buttons.
- [ ] **GATE-02**: User can validate Checkpoint 5 (`hermes doctor` passes and Hermes CLI is recognized) with Pass/Fail buttons.
- [ ] **GATE-03**: User can validate Checkpoint 6 (Hermes test response received via 9Router) with Pass/Fail buttons.
- [ ] **GATE-04**: User can validate Checkpoint 7 (Telegram bot replies to allowlisted User ID via long polling) with Pass/Fail buttons.
- [ ] **GATE-05**: User can validate Checkpoint 8 (Google Calendar OAuth authorization active and calendar readable) with Pass/Fail buttons.
- [ ] **GATE-06**: User can validate Checkpoint 9 (End-to-end calendar event action succeeded via Telegram) with Pass/Fail buttons.
- [ ] **GATE-07**: State engine tracks in-class readiness and displays overall Live Workshop completion badge (`BELUM SIAP` -> `DALAM PRAKTIK` -> `SELESAI (SUKSES)`).

### In-Class Troubleshooting Hub (TRBL)

- [ ] **TRBL-04**: User can browse and search 7 specific live workshop error solutions (`hermes` not recognized, 9Router endpoint connection, API key invalid, bot silence, `unauthorized` allowlist error, OAuth Desktop app mismatch, wrong Google Calendar).
- [ ] **TRBL-05**: User can filter troubleshooting cards specifically for in-class workshop categories (`9router-live`, `hermes-cli`, `telegram-gateway`, `google-oauth`).

### Live Workshop Completion Exporter (RPT)

- [ ] **RPT-04**: User can view a pre-filled Form Laporan Hasil Praktik Kelas summarizing Checkpoints 4–9 status, provider/model used, and end-to-end test results.
- [ ] **RPT-05**: User can export the final workshop report via 1-click copy formatted for WhatsApp and Telegram instructor chats with sensitive credentials masked.

## Future Requirements (v1.2+)

### Interactive Sandbox & Health Checks

- **SAND-01**: In-browser interactive PowerShell terminal simulation sandbox for trying commands safely.
- **PING-01**: Live 9Router ping button using `fetch('http://localhost:20128/v1/models')` to test local connectivity directly from the browser.
- **I18N-01**: Multilingual toggle (Indonesian / English) across all guides and checklists.
- **PWA-01**: Service worker and Web App Manifest for complete offline PWA installation.

## Out of Scope

| Feature | Reason |
|---------|--------|
| Automatic remote installation on participant PC | Security risk; PowerShell commands must be explicitly inspected and executed by the participant. |
| Backend server or remote database | Static client-side architecture guarantees complete privacy for student local keys and files. |
| Storing Google OAuth client secret JSON in `localStorage` | High security risk; files must reside exclusively on participant's local disk. |
| Webhook-based Telegram deployment | Workshop explicitly mandates local long-polling mode; no public tunnels or domain setups required. |

## Traceability

Which phases cover which requirements. Populated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| MODE-01 | Phase 5 | Pending |
| MODE-02 | Phase 5 | Pending |
| CLASS-01 | Phase 6 | Pending |
| CLASS-02 | Phase 6 | Pending |
| CLASS-03 | Phase 6 | Pending |
| CLASS-04 | Phase 7 | Pending |
| CLASS-05 | Phase 7 | Pending |
| CLASS-06 | Phase 7 | Pending |
| GATE-01 | Phase 6 | Pending |
| GATE-02 | Phase 6 | Pending |
| GATE-03 | Phase 6 | Pending |
| GATE-04 | Phase 7 | Pending |
| GATE-05 | Phase 7 | Pending |
| GATE-06 | Phase 7 | Pending |
| GATE-07 | Phase 8 | Pending |
| TRBL-04 | Phase 8 | Pending |
| TRBL-05 | Phase 8 | Pending |
| RPT-04 | Phase 8 | Pending |
| RPT-05 | Phase 8 | Pending |

**Coverage:**
- v1.1 requirements: 19 total
- Mapped to phases: 19
- Unmapped: 0 ✓

---
*Requirements defined: 2026-09-04*
*Last updated: 2026-09-04 after Milestone v1.1 definition*
