# Requirements: Milestone v3.1 Pre-Training Parity in TanStack Start

**Milestone:** v3.1  
**Status:** In Progress  

---

## Requirements Grouped by Category

### Category 1: Foundation & Context Sections (PRE-BASE)

- [ ] **PRE-BASE-01**: User dapat membaca Target & Alur Pre-Training (`sec-target`) dengan tahapan visual dan estimasi durasi belajar mandiri.
- [ ] **PRE-BASE-02**: User dapat mengakses Glosarium Interaktif (`sec-glosarium`) yang mendefinisikan istilah teknis AI (LLM, Agent, API Key, Reverse Proxy, Daemon, Webhook, CLI, JSON, Port, Process Manager) secara jelas.
- [ ] **PRE-BASE-03**: User dapat membaca Aturan Keamanan & Perlindungan Rahasia (`sec-security`) dengan panduan menjaga API key & token bot agar tidak terekspos ke publik.
- [ ] **PRE-BASE-04**: User dapat membaca Alat & Persiapan Perangkat (`sec-prerequisites`) berisi spesifikasi sistem Windows, koneksi internet, akun Telegram, dan software prasyarat.
- [ ] **PRE-BASE-05**: User dapat membaca Panduan Khusus PowerShell (`sec-powershell`) dengan tata cara membuka administrator terminal, eksekusi perintah, dan tips penanganan policy.

### Category 2: Interactive Modules 1–5 (PRE-MOD)

- [ ] **PRE-MOD-01**: User dapat membuka/menutup accordion Modul 1 (Pemeriksaan & Instalasi Node.js) dengan panduan verifikasi versi node, nvm-windows, dan perintah `node -v` dengan 1-click copy.
- [ ] **PRE-MOD-02**: User dapat berinteraksi dengan Modul 2 (Instalasi & Menjalankan 9Router) dengan copyable commands untuk proxy/router API lokal, konfigurasi port 20128/9000, dan instruksi pengujian curl.
- [ ] **PRE-MOD-03**: User dapat mengikuti panduan langkah demi langkah Modul 3 (Pembuatan Bot Telegram & Telegram User ID) melalui @BotFather, token bot protection, dan pencarian User ID via @userinfobot.
- [ ] **PRE-MOD-04**: User dapat mengikuti instruksi Modul 4 (Instalasi & Konfigurasi Hermes Agent) dengan perintah CLI, konfigurasi provider 9Router, dan uji coba Hermes.
- [ ] **PRE-MOD-05**: User dapat mengikuti instruksi Modul 5 (Pengujian Integrasi Akhir & Uji Coba Chat) untuk memverifikasi alur interaksi live chat Telegram ke Hermes dan 9Router.
- [ ] **PRE-MOD-06**: Tombol 1-Click Copy pada semua blok kode perintah modul dengan visual feedback tooltip/toast "Tersalin!" serta preserving syntax whitespace.

### Category 3: Checklist Engine, Checkpoints & Dynamic Readiness (PRE-CHK)

- [ ] **PRE-CHK-01**: User dapat mencentang 13 item checklist langkah demi langkah yang tersebar di Modul 1–5 dengan penyimpanan persisten di browser localStorage (`learnwith_ai_checklist`).
- [ ] **PRE-CHK-02**: User dapat memvalidasi 3 Checkpoint Gates (Checkpoint 1: Lingkungan Node.js, Checkpoint 2: 9Router & Kunci API, Checkpoint 3: Bot Telegram & Hermes Running) dengan kalkulasi otomatis status LULUS / BELUM LULUS.
- [ ] **PRE-CHK-03**: User dapat melihat Status Kesiapan Peserta (Dynamic Readiness Badge & Summary) yang menghitung persentase kemajuan dan menampilkan status visual "SIAP WORKSHOP" atau "PERLU KLINIK PERSIAPAN".
- [ ] **PRE-CHK-04**: User dapat mereset seluruh progres checklist dan checkpoint pre-training secara aman melalui modal konfirmasi reset.

### Category 4: Troubleshooting Hub & Token Redaction (PRE-TOOL)

- [ ] **PRE-TOOL-01**: User dapat mencari solusi kendala teknis pre-training secara instan melalui input pencarian real-time dan tombol filter kategori (Node.js, 9Router, Telegram, Hermes, PowerShell).
- [ ] **PRE-TOOL-02**: User dapat membaca 10+ kartu solusi error umum (seperti `EADDRINUSE`, `401 Unauthorized`, `Execution_Policies`, `Telegram 409 Conflict`) lengkap dengan deskripsi penyebab dan solusinya.
- [ ] **PRE-TOOL-03**: User dapat menggunakan Tool Sensor Rahasia / Token Redaction Helper untuk mem-paste teks log/konfigurasi dan otomatis menyensor format token rahasia sebelum dibagikan.

### Category 5: Readiness Report Generator & Export (PRE-RPT)

- [ ] **PRE-RPT-01**: User dapat mengisi nama peserta dan instansi pada Form Laporan Kesiapan Peserta yang terisi otomatis dengan rekap checkpoint yang telah diselesaikan.
- [ ] **PRE-RPT-02**: User dapat mengekspor laporan kesiapan ke clipboard dengan format siap kirim WhatsApp dan Telegram Markdown dalam 1 kali klik.
- [ ] **PRE-RPT-03**: Tampilan cetak rapi (`@media print`) untuk mencetak atau menyimpan laporan kesiapan peserta sebagai PDF dokumen resmi.

### Category 6: Sidebar Navigation, Layout & Zero-Regression (PRE-NAV)

- [ ] **PRE-NAV-01**: Sidebar navigasi menampilkan tautan kurikulum pre-training lengkap dengan indikator progres modul dan scrollspy / jump-to-section.
- [ ] **PRE-NAV-02**: Mode switcher terintegrasi mulus antara `📋 Pra-Training` dan `🚀 Hari-H Kelas` via query parameter URL `?mode=pretraining` pada arsitektur TanStack Start.
- [ ] **PRE-NAV-03**: Seluruh test suite (Node unit tests, Playwright E2E browser tests) lulus 100% tanpa regresi terhadap fungsionalitas Course 1, Course 2, maupun Frontpage Hub.

---

## Out of Scope

- Menjalankan instalasi paket otomatis secara remote di komputer peserta (berisiko keamanan; peserta mengeksekusi sendiri di PowerShell).
- Menyimpan kredensial token mentah peserta ke server publik atau remote database.
- Mengubah skema persistensi localStorage yang sudah ada agar data peserta terdahulu tidak hilang (`learnwith_ai_*`).

---

## Traceability Matrix

*(Akan diisi dan diperbarui oleh Roadmap setelah pemetaan fase selesai)*

| Requirement | Phase | Status | Verification Evidence |
|---|---|---|---|
| PRE-BASE-01 | Pending | Pending | — |
| PRE-BASE-02 | Pending | Pending | — |
| PRE-BASE-03 | Pending | Pending | — |
| PRE-BASE-04 | Pending | Pending | — |
| PRE-BASE-05 | Pending | Pending | — |
| PRE-MOD-01 | Pending | Pending | — |
| PRE-MOD-02 | Pending | Pending | — |
| PRE-MOD-03 | Pending | Pending | — |
| PRE-MOD-04 | Pending | Pending | — |
| PRE-MOD-05 | Pending | Pending | — |
| PRE-MOD-06 | Pending | Pending | — |
| PRE-CHK-01 | Pending | Pending | — |
| PRE-CHK-02 | Pending | Pending | — |
| PRE-CHK-03 | Pending | Pending | — |
| PRE-CHK-04 | Pending | Pending | — |
| PRE-TOOL-01 | Pending | Pending | — |
| PRE-TOOL-02 | Pending | Pending | — |
| PRE-TOOL-03 | Pending | Pending | — |
| PRE-RPT-01 | Pending | Pending | — |
| PRE-RPT-02 | Pending | Pending | — |
| PRE-RPT-03 | Pending | Pending | — |
| PRE-NAV-01 | Pending | Pending | — |
| PRE-NAV-02 | Pending | Pending | — |
| PRE-NAV-03 | Pending | Pending | — |
