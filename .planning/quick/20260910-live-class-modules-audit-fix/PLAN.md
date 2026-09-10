---
status: complete
date: 2026-09-10
description: Align and refine commands and pedagogical accuracy for Live Class Modules 6-11
---

# Live Class Modules 6–11 Command Precision & Pedagogical Alignment

## Objective
Refine and ensure strict pedagogical alignment and command accuracy across Modules 6 through 11:
1. **Modul 7 (Hermes Agent Runtime)**: Align Step 7C command to `hermes doctor` as primary diagnostic verification command with ALL CHECKS PASSED status badge.
2. **Modul 8 (Hermes Setup)**: Set Step 8A primary command to `hermes setup` interactive wizard targeting `http://localhost:20128/v1` with 9Router virtual key.
3. **Modul 9 (Telegram Gateway)**: Replace legacy/divergent command with official `hermes gateway setup` and `hermes gateway start`, emphasizing local Long Polling mode and numeric `TELEGRAM_ALLOWED_USERS`.
4. **Checkpoint 9 Criteria**: Replace contradictory "Webhook 2-arah" text with "Koneksi Long Polling lokal terhubung dan memproses pesan masuk" in `LiveClassCheckpointsSection.tsx`.
5. **Verification**: Verify type safety via `npm run typecheck` and verify all 242 automated tests via `npm test`.
