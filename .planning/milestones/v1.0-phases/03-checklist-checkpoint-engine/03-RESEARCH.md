# Phase 3 Technical Research: Checklist & Checkpoint Engine

## Overview
Phase 3 implements the interactive checklist and verification engine for the Pre-Training Web App. It brings active state tracking to every step across all 5 modules, introduces 3 dedicated checkpoint gates (`#sec-checkpoint-1`, `#sec-checkpoint-2`, `#sec-checkpoint-3`) with pass/fail controls, computes real-time readiness status (`SIAP MENGIKUTI WORKSHOP` vs `PERLU TECHNICAL CLINIC`), and guarantees seamless persistence via `localStorage` with a safe reset confirmation modal.

## Target Requirements Breakdown

### 1. CHK-01: Interactive Step Checklists Across All Stages
- **Prerequisites (7 items)**: `prereq-laptop`, `prereq-charger`, `prereq-internet`, `prereq-browser`, `prereq-admin`, `prereq-telegram`, `prereq-google` (already in `index.html`).
- **Module 1: Node.js (3 items)**:
  - `m1-check-node`: `node --version` menampilkan versi `v24.x.x` atau `v22.x.x`.
  - `m1-verify-lts`: Node.js LTS terinstalasi resmi via Windows Installer (.msi) 64-bit dengan Add to PATH.
  - `m1-check-npm`: `npm --version` menampilkan nomor versi (contoh: `10.x.x`).
- **Module 2: 9Router (4 items)**:
  - `m2-install-pkg`: Paket `npm install -g 9router` berhasil dipasang global tanpa error fatal.
  - `m2-start-service`: Perintah `9router` berjalan di PowerShell/Terminal dan jendela tetap terbuka.
  - `m2-open-dashboard`: Dashboard lokal `http://localhost:20128` berhasil dibuka di Google Chrome atau Microsoft Edge.
  - `m2-verify-local`: Berhasil masuk dengan kata sandi bawaan `123456`.
- **Module 3: Telegram Bot (4 items)**:
  - `m3-start-botfather`: Membuka akun resmi `@BotFather` (centang biru) di Telegram.
  - `m3-create-newbot`: Menjalankan perintah `/newbot`, memberi nama bot, dan membuat username unik berakhiran `bot`.
  - `m3-save-token-secure`: Menyimpan bot token rahasia di tempat aman dan tidak membagikannya ke publik.
  - `m3-get-userid`: Membuka `@userinfobot`, menekan Start, dan mencatat nomor Telegram User ID (angka murni).
- **Module 4: Google Cloud (2 items)**:
  - `m4-open-console`: Membuka `https://console.cloud.google.com` di browser.
  - `m4-verify-login`: Login akun Google latihan dan memastikan dashboard terbuka tanpa membuat project atau konfigurasi billing.

### 2. CHK-02: Checkpoint Verification Gates (1, 2, and 3)
Dedicated section wrappers `#sec-checkpoint-1`, `#sec-checkpoint-2`, `#sec-checkpoint-3` linked directly from sidebar navigation:
- **Checkpoint 1 (Node.js & npm)**:
  - Verifikasi: `node --version` dan `npm --version` keduanya menghasilkan output nomor versi yang valid.
  - Actions: Tombol `✓ Lolos Verifikasi` dan `✕ Ada Kendala`.
  - Status display: Badge `Pending` (kuning), `Lolos ✓` (hijau), `Gagal` (merah).
  - Quick input helper: Input opsional untuk memasukkan versi Node.js & npm yang terdeteksi, tersinkronisasi ke `participantInfo`.
- **Checkpoint 2 (9Router Dashboard)**:
  - Verifikasi: 9Router aktif berjalan dan dashboard lokal `http://localhost:20128` bisa diakses.
  - Actions: Tombol `✓ Lolos Verifikasi` dan `✕ Ada Kendala`.
  - Status display: Badge `Pending`, `Lolos ✓`, `Gagal`.
  - Quick input helper: Radio/toggle konfirmasi dashboard terbuka & sandi `123456` dicoba.
- **Checkpoint 3 (Telegram Bot & User ID)**:
  - Verifikasi: Bot dibuat di BotFather, tombol Start ditekan, token tersimpan aman, User ID dicatat.
  - Actions: Tombol `✓ Lolos Verifikasi` dan `✕ Ada Kendala`.
  - Status display: Badge `Pending`, `Lolos ✓`, `Gagal`.
  - Quick input helper: Form pencatatan Bot Username (`@...bot`) dan Telegram User ID (validasi hanya angka) yang langsung tersimpan ke `participantInfo`.

### 3. CHK-03: Real-Time Readiness Calculation Engine
- **Readiness Logic**:
  - `SIAP MENGIKUTI WORKSHOP` (Hijau Neon / Success):
    - Seluruh 3 Checkpoints (`cp-1`, `cp-2`, `cp-3`) bernilai `passed`.
    - Minimal 85% checklist tasks selesai.
  - `PERLU TECHNICAL CLINIC` (Kuning-Oranye / Warning atau Merah):
    - Salah satu checkpoint bernilai `failed`, ATAU
    - Checkpoint masih `pending` padahal workshop akan dimulai, ATAU
    - Ada kendala instalasi yang belum terpecahkan.
- **Visual Presentation**:
  - Prominent banner/card di bagian atas dan di section rangkuman kesiapan.
  - Dynamic status pills di header bar, hero section, dan sidebar navigation.
  - Indikator pesan rekomendasi: "Selamat! Semua prasyarat teknis telah lengkap" vs "Jangan khawatir, ikuti sesi konsultasi kendala bersama tim instruktur sebelum kelas".

### 4. CHK-04: LocalStorage Synchronization & State Reset
- `AppState` bertindak sebagai single source of truth untuk:
  - `checklists`: Record objek `{ [taskId: string]: boolean }`.
  - `checkpoints`: Record objek `{ [cpId: string]: 'pending' | 'passed' | 'failed' }`.
  - `participantInfo`: Objek identitas peserta dan output verifikasi.
- **Reset Flow**:
  - Tombol "Atur Ulang / Reset Progres" di header dan section checklist.
  - Membuka modal konfirmasi kustom yang berpusat di layar dengan backdrop blur (`#modal-reset-confirm`).
  - Dilengkapi tombol "Batal" dan "Ya, Reset Semua".
  - Keyboard accessible: Esc untuk menutup, auto-focus pada tombol konfirmasi.
  - Setelah reset, `localStorage` dibersihkan kembali ke `DEFAULT_STATE`, seluruh checkbox unchecked, badge kembali ke 0%, dan muncul toast feedback.

## Architecture & Wave Breakdown
- **Wave 1: Plan 03-01 (Interactive Checklists & Module Integration)**
  - Inject step checklist items into Modules 1, 2, 3, and 4.
  - Style step checkboxes and module progress badges (`0/3`, `0/4`, etc.).
  - Wire reactive listeners to update module step counts and overall progress.
- **Wave 2: Plan 03-02 (Checkpoint Verification Gates 1, 2, 3)**
  - Implement full `#sec-checkpoint-1`, `#sec-checkpoint-2`, `#sec-checkpoint-3` sections.
  - Add interactive pass/fail toggle controls and verification feedback.
  - Sync participant verification fields (`nodeVersion`, `telegramUsername`, `telegramUserId`).
- **Wave 3: Plan 03-03 (Dynamic Readiness Engine & Reset Modal)**
  - Build real-time readiness status component (`SIAP MENGIKUTI WORKSHOP` vs `PERLU TECHNICAL CLINIC`).
  - Implement accessible confirmation modal for state reset.
  - Unit/integration test validation for persistence, calculation, and reset.
