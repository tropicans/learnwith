# Roadmap: learnwith — Multi-Course Platform & Pengolahan Kata Tingkat Lanjut

## Milestones

- ✅ **v1.0 Pre-Training Interactive Web App (Agentic AI)** - Phases 1-4 (shipped 2026-09-03) — [Archive](milestones/v1.0-ROADMAP.md)
- ✅ **v1.1 Live Workshop Guide (Agentic AI Hari-H)** - Phases 5-8 (shipped 2026-09-07) — [Archive](milestones/v1.1-ROADMAP.md)
- ✅ **v2.0 Multi-Course Platform & Modul Pengolahan Kata Tingkat Lanjut** - Phases 9-12 (shipped 2026-09-07) — [Archive](milestones/v2.0-ROADMAP.md)
- ✅ **v2.1 Google NotebookLM-Inspired UI/UX Overhaul & Workspace Architecture** - Phases 13-15 (shipped 2026-09-07) — [Archive](milestones/v2.1-ROADMAP.md)
- ✅ **v2.2 Application Security Hardening & Anti-Breach Protection** - Phases 16-18 (shipped 2026-09-07)

## Active Milestone: v2.2 (Phases 16-18) — COMPLETED

- [x] **Phase 16: Cryptographic Passcode Hashing & Secret Protection (Zero-Plaintext)**
  - Hapus seluruh kata sandi teks polos dari file JavaScript dan console DevTools (`window.WORD_PASSCODES`).
  - Hapus kebocoran kredensial di form modal placeholder.
  - Implementasi Web Crypto API (`crypto.subtle.digest`) dengan algoritma SHA-256 untuk memverifikasi kecocokan sandi tanpa pernah menyimpan string rahasia asli di client.
  - Pisahkan konfigurasi penguncian modul dan hash kredensial ke file mandiri `config.js` (`window.LEARNWITH_CONFIG`).

- [x] **Phase 17: URL Gate Hardening, Session Management & Anti-Tampering**
  - Matikan bypass URL parameter tidak aman (`?unlock=dev`, `?unlock=word`, `?unlock=1`) di mode normal.
  - Terapkan mekanisme auto-lock session timeout (misal: otomatis mengunci kembali modul setelah periode inaktivitas tertentu atau saat tab ditutup).
  - Tambahkan proteksi anti-tampering pada kunci status penyimpanan local storage.

- [x] **Phase 18: Content Security Policy (CSP), DOM Sanitization & Anti-Clickjacking**
  - Terapkan meta tag Content Security Policy (CSP) ketat pada `<head>` untuk mencegah eksploitasi skrip asing dan XSS.
  - Tambahkan script pelindung anti-clickjacking untuk mencegah halaman dibajak atau di-embed dalam `<iframe>` pihak ketiga.
  - Lakukan audit sanitasi menyeluruh pada semua titik input pengguna (nama, NIP, instansi, form pencarian, dan perakitan kuis) untuk memastikan 0% celah DOM XSS.

---

### Phase 16: Cryptographic Passcode Hashing & Secret Protection (Zero-Plaintext)

**Goal**: Menghilangkan seluruh jejak kata sandi teks polos, mengamankan objek global browser, membersihkan placeholder input, dan menerapkan Web Crypto SHA-256 hash matching dengan file konfigurasi terisolasi `config.js`.  
**Depends on**: Milestone v2.1  
**Requirements**: SEC-01, SEC-02, SEC-03, SEC-04  
**Plans**: 1 plan  

### Phase 17: URL Gate Hardening, Session Management & Anti-Tampering

**Goal**: Mengamankan gerbang otorisasi dari manipulasi parameter URL bebas dan menerapkan auto-lock session timeout untuk melindungi sesi yang ditinggalkan tanpa pengawasan.  
**Depends on**: Phase 16  
**Requirements**: SEC-05, SEC-06  
**Plans**: 1 plan  

### Phase 18: Content Security Policy (CSP), DOM Sanitization & Anti-Clickjacking

**Goal**: Memasang pertahanan Content Security Policy ketat, pelindung anti-clickjacking frame-busting, dan audit sanitasi DOM untuk menjamin 0% kerentanan XSS.  
**Depends on**: Phase 17  
**Requirements**: SEC-07, SEC-08, SEC-09  
**Plans**: 1 plan  

## Completed Milestones

<details>
<summary>✅ v2.1 Google NotebookLM-Inspired UI/UX Overhaul & Workspace Architecture (Phases 13-15) - SHIPPED 2026-09-07</summary>

- [x] **Phase 13: NotebookLM Top Bar, Anti-Cache Critical CSS & Clean Course Selector**
- [x] **Phase 14: Workspace Studio Navigation, Sidebar De-duplication & Material 3 Polishing**
- [x] **Phase 15: Google NotebookLM Frontpage Hub & Seamless Studio Navigation**

</details>

<details>
<summary>✅ v2.0 Multi-Course Platform & Modul Pengolahan Kata Tingkat Lanjut (Phases 9-12) - SHIPPED 2026-09-07</summary>

- [x] **Phase 9: Multi-Course Architecture & Course Gate Protection**
- [x] **Phase 10: Modul Bab I–III Praktik Interaktif, Checkpoint 1–2, & Standar Tata Naskah Dinas**
- [x] **Phase 11: Modul Bab IV Otomasi Dokumen, Reviewing & Checkpoint 3**
- [x] **Phase 12: Evaluasi Akhir, Kuis Interaktif 20 Soal, & Mesin Kelulusan BPSDM**

</details>
