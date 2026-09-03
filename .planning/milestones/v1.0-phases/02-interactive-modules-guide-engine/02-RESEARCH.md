# Phase 2 Technical Research: Interactive Modules & Guide Engine

## Overview
Phase 2 transforms all five practical activities and key guidance from `PANDUAN-PRE-TRAINING.md` into rich, structured interactive modules within the web application. The focus is delivering crystal-clear step hierarchy, 1-click copyable PowerShell commands with instant visual feedback, interactive glossary tooltips, caution/alert banners for pre-class prohibitions, and secure external link integrations.

## Target Modules & Structure

### Module 1: Node.js (Pemeriksaan & Instalasi)
- **Sections**:
  - Langkah A: Periksa apakah sudah terpasang (`node --version`) with expected output badge (`v24.x.x` / `v22.x.x`).
  - Langkah B: Panduan instalasi Node.js LTS jika belum tersedia (link download resmi https://nodejs.org, panduan .msi 64-bit, PATH configuration, PowerShell restart).
  - Langkah C: Periksa npm (`npm --version`).
  - Checkpoint 1 Intro: Node.js & npm siap.
- **Commands**:
  - `node --version`
  - `npm --version`
- **Key Warnings**:
  - Jika muncul `not recognized`, normal pada laptop baru, lanjutkan ke Langkah B.
  - Jangan memilih ZIP/source code; selalu gunakan Windows Installer (.msi) 64-bit.

### Module 2: 9Router (Instalasi & Menjalankan)
- **Sections**:
  - Langkah A: Instalasi global 9Router (`npm install -g 9router`).
  - Langkah B: Menjalankan 9Router (`9router`) & akses dashboard lokal (`http://localhost:20128`).
  - Langkah C: Penanganan login / password awal (`123456`).
  - Langkah D: Cara menghentikan (`Ctrl+C`) dan menjalankan kembali.
- **Commands**:
  - `npm install -g 9router`
  - `9router`
- **Key Warnings**:
  - PowerShell/Terminal harus tetap terbuka agar 9Router terus berjalan.
  - `123456` adalah kata sandi awal instalasi lokal, bukan akun Google/Telegram.
  - Jangan izinkan akses jaringan publik jika Windows Firewall memunculkan dialog.

### Module 3: Telegram Bot (Pembuatan Bot & User ID)
- **Sections**:
  - Langkah A: Buka BotFather resmi (`@BotFather` centang biru terverifikasi).
  - Langkah B: Buat bot baru (`/newbot`, nama bot, username unik berakhiran `bot`).
  - Langkah C: Simpan bot token dengan aman (penjelasan token, bahaya kebocoran).
  - Langkah D: Buka bot baru dan tekan Start.
  - Langkah E: Dapatkan Telegram User ID via `@userinfobot` (ID angka murni vs username @).
- **Commands & Inputs**:
  - `/newbot`
  - `/revoke` (jika token bocor)
- **Key Warnings & Rules**:
  - Bot token adalah kode rahasia pengendali bot — jangan pernah kirim ke grup/pihak lain.
  - Telegram user ID hanya berupa angka murni (misal `123456789`), berbeda dari `@username`.
  - Bot belum membalas pesan saat pre-training (normal sebelum dihubungkan ke Hermes).

### Module 4: Google Cloud (Pemeriksaan Akun)
- **Sections**:
  - Langkah A: Buka Google Cloud Console (`https://console.cloud.google.com`).
  - Langkah B: Login akun Google latihan & verifikasi akses dashboard.
  - Langkah C: Konfirmasi akun siap tanpa konfigurasi berlebih.
- **Key Warnings**:
  - Cukup pastikan halaman console terbuka; JANGAN membuat project, mengaktifkan API, atau memasukkan billing/pembayaran sebelum kelas.
  - Gunakan akun latihan / kalender workshop khusus.

### Module 5: Catatan Sebelum Kelas (Prohibitions & Boundaries)
- **Sections**:
  - Batasan 1: Jangan memilih provider atau model AI dulu di 9Router.
  - Batasan 2: Jangan menginstal Hermes Agent dulu (`hermes setup`, `hermes model`, dsb.).
  - Penjelasan arsitektur pra-kelas: `Hermes Agent -> 9Router (http://localhost:20128/v1) -> Model AI`.

---

## Technical Implementations

### 1. Interactive Collapsible/Expandable Module Containers
- Clean accordion-style design with CSS transitions.
- State preservation or auto-expansion when navigated via sidebar links (`#sec-module-X`).
- Expand all / Collapse all toggle for quick scanning.

### 2. Enhanced 1-Click Code Snippet Engine
- Code container with language label (`PowerShell`, `Command`), monospaced typography (`JetBrains Mono`), and integrated copy button.
- Clean visual states: Normal → Hover → Copied (`✓ Tersalin!` + toast + haptic animation).
- Text sanitizer to prevent accidental leading/trailing spaces or prompt symbols (`PS >`).

### 3. Interactive Glossary Tooltips & Popovers
- Custom inline glossary spans: `<span class="glossary-term" data-term="Node.js">Node.js<span class="tooltip-bubble">...</span></span>`.
- Keyboard accessible (`focus` / `blur`) and hover friendly (`mouseenter` / `mouseleave`).
- Seamless cross-linking to Glossary section.

### 4. Styled Caution & Alert Callout Cards
- Distinct alert hierarchy:
  - `alert-danger`: Dilarang kirim token / API key, bahaya kebocoran.
  - `alert-warning`: Jangan pilih provider/model dulu, Jangan install Hermes dulu.
  - `alert-info`: Penjelasan istilah, tip PowerShell, default port localhost.
  - `alert-success`: Checkpoint readiness indicators.

### 5. Secure External Links
- All external links configured with `target="_blank" rel="noopener noreferrer"`.
- External link icon badge ↗ and security tooltip reminding users to verify authentic URLs.
