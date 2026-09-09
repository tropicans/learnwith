# Requirements: Milestone v3.2 Admin Command Center, Telemetry & Authentication

**Milestone:** v3.2  
**Status:** In Progress  

---

## Requirements Grouped by Category

### Category 1: Admin Authentication & Security Gates (ADMIN-AUTH)

- [ ] **ADMIN-AUTH-01**: Admin dapat mengakses rute `/admin` yang diproteksi oleh Master Admin Passkey login screen.
- [ ] **ADMIN-AUTH-02**: Verifikasi kredensial admin dieksekusi melalui `createServerFn` dengan timing-safe SHA-256 hash comparison dan secure session token.
- [ ] **ADMIN-AUTH-03**: Admin dapat melihat arsitektur & antarmuka login Google OAuth (Google Sign-In readiness) dengan konfigurasi Client ID dan alur callback terproteksi.
- [ ] **ADMIN-AUTH-04**: Admin dapat melakukan logout untuk mengakhiri sesi autentikasi admin di browser secara aman.

### Category 2: Server Telemetry Ingestion & API (ADMIN-TELEM)

- [ ] **ADMIN-TELEM-01**: Endpoint server internal TanStack Start menerima payload heartbeat & progres peserta (nama, instansi, courseId, progres persen, status checkpoint, timestamp).
- [ ] **ADMIN-TELEM-02**: Endpoint server memvalidasi schema payload telemetri dengan Zod dan menyimpannya ke server store terstruktur yang aman.
- [ ] **ADMIN-TELEM-03**: Klien peserta (`/course/ai` dan `/course/word`) memiliki background telemetry client yang secara non-blocking mengirimkan pembaharuan progres saat checkpoint diverifikasi atau kuis diselesaikan.

### Category 3: Participant Progress & Monitoring Dashboard (ADMIN-DASH)

- [x] **ADMIN-DASH-01**: Admin dapat memantau kartu ringkasan KPI agregat (Total Peserta Aktif, Tingkat Penyelesaian Checkpoint, Rata-rata Skor Kuis, Rasio Siap Workshop vs Perlu Klinik).
- [x] **ADMIN-DASH-02**: Admin dapat melihat tabel daftar peserta dengan filter kategori kursus (`ai` vs `word`), status kesiapan, pencarian instansi/nama, dan status aktivitas.
- [x] **ADMIN-DASH-03**: Admin dapat menginspeksi detail peserta (rincian checklist modul yang telah diselesaikan, riwayat checkpoint 1–3, dan nilai evaluasi kuis).
- [x] **ADMIN-DASH-04**: Admin dapat mengekspor seluruh data rekapitulasi progres dan kesiapan peserta ke format CSV dan JSON dalam 1-klik.

### Category 4: Course Access & Passkey Management Console (ADMIN-PASS)

- [x] **ADMIN-PASS-01**: Admin dapat memantau status aktif passkey modul kedinasan (Course 2: Pengolahan Kata Tingkat Lanjut) beserta riwayat hash server.
- [x] **ADMIN-PASS-02**: Admin dapat memperbarui atau merotasi passkey workshop dinas secara dinamis melalui antarmuka admin yang terverifikasi.
- [x] **ADMIN-PASS-03**: Admin dapat melihat audit log percobaan unlock passkey (termasuk deteksi kegagalan berulang / rate limiting guard).

### Category 5: Runtime Troubleshooting Hub & Incident Audit (ADMIN-LOG)

- [x] **ADMIN-LOG-01**: Admin dapat memantau agregasi kendala teknis dan log troubleshooting runtime yang dialami peserta (bentrok port 20128, error OAuth, kegagalan ExecutionPolicy PowerShell).
- [x] **ADMIN-LOG-02**: Admin dapat memfilter dan mencari log kendala berdasarkan kategori error dan frekuensi untuk memandu asistensi instruktur di kelas.

### Category 6: Global Platform Configuration & Banner Controls (ADMIN-CFG)

- [ ] **ADMIN-CFG-01**: Admin dapat mengubah mode workshop (toggle Pre-training / Live Class) secara global dari antarmuka admin.
- [ ] **ADMIN-CFG-02**: Admin dapat membuat dan menyiarkan Banner Pengumuman Global (instruksi darurat, link zoom, atau reminder jadwal kelas) yang tampil di seluruh halaman peserta.

### Category 7: Quality Assurance & Zero-Regression (ADMIN-QA)

- [ ] **ADMIN-QA-01**: Seluruh rute `/admin`, komponen dashboard, dan server functions memiliki test suite otomatis (unit test, server RPC test, schema validation test).
- [ ] **ADMIN-QA-02**: Nol regresi terhadap fitur publik (`/`), rute workspace peserta (`/course/ai`, `/course/word`), dan seluruh test suite existing (116 tests) lulus 100%.

---

## Out of Scope

- Mengirim atau menyimpan data kredensial rahasia peserta (seperti API key bot Telegram atau OAuth secret) ke server admin.
- Database eksternal yang memerlukan instalasi database server terpisah yang rumit untuk demo lokal (menggunakan lightweight server store terisolasi).
- Fitur administrasi multi-tenant yang membutuhkan sistem billing / payment gateway.

---

## Traceability Matrix

*(Akan dipetakan dan diperbarui oleh Roadmap setelah pemetaan fase selesai)*

| Requirement | Phase | Status | Verification Evidence |
|---|---|---|---|
| ADMIN-AUTH-01 | Phase 29 | Pending | Route /admin login gate |
| ADMIN-AUTH-02 | Phase 29 | Pending | Timing-safe server function test |
| ADMIN-AUTH-03 | Phase 29 | Pending | Google OAuth readiness UI & state |
| ADMIN-AUTH-04 | Phase 29 | Pending | Logout session destruction test |
| ADMIN-TELEM-01 | Phase 30 | Pending | Telemetry API endpoint test |
| ADMIN-TELEM-02 | Phase 30 | Pending | Zod validation & server store test |
| ADMIN-TELEM-03 | Phase 30 | Pending | Client background telemetry sync test |
| ADMIN-DASH-01 | Phase 31 | Complete | 31-VERIFICATION.md |
| ADMIN-DASH-02 | Phase 31 | Complete | 31-VERIFICATION.md |
| ADMIN-DASH-03 | Phase 31 | Complete | 31-VERIFICATION.md |
| ADMIN-DASH-04 | Phase 31 | Complete | 31-VERIFICATION.md |
| ADMIN-PASS-01 | Phase 32 | Complete | 32-VERIFICATION.md |
| ADMIN-PASS-02 | Phase 32 | Complete | 32-VERIFICATION.md |
| ADMIN-PASS-03 | Phase 32 | Complete | 32-VERIFICATION.md |
| ADMIN-LOG-01 | Phase 32 | Complete | 32-VERIFICATION.md |
| ADMIN-LOG-02 | Phase 32 | Complete | 32-VERIFICATION.md |
| ADMIN-CFG-01 | Phase 33 | Pending | Workshop mode toggle server function |
| ADMIN-CFG-02 | Phase 33 | Pending | Global announcement banner rendered on client |
| ADMIN-QA-01 | Phase 29, 30, 33 | Pending | Automated test suite passing |
| ADMIN-QA-02 | Phase 33 | Pending | 116 existing tests passing + 0 regressions |
