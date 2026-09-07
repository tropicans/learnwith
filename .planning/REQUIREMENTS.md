# Milestone v2.2 Requirements — Application Security Hardening & Anti-Breach Protection

**Status:** 🟡 ACTIVE (In Progress)  
**Milestone:** v2.2  

---

## Requirements Traceability

### 1. Cryptographic Gate & Secret Protection (SEC-CRYPTO)

- [x] **SEC-01**: Seluruh teks polos kata sandi (`['buka-kata', 'kata-sandi-asn']`) dihapus dari kode sumber JavaScript, dan variabel `window.WORD_PASSCODES` dihapus total dari global scope browser console.
- [x] **SEC-02**: Formulir modal penguncian modul bersih dari kebocoran kredensial; teks `placeholder="Contoh: buka-kata"` diganti menjadi placeholder netral dan aman (`placeholder="Masukkan kode sandi instruktur..."`).
- [x] **SEC-03**: Verifikasi kata sandi menggunakan enkripsi hash satu arah SHA-256 via Web Crypto API standar (`crypto.subtle.digest`), mencocokkan hash input dengan array hash tersimpan tanpa pernah menyimpan string sandi asli di client.
- [x] **SEC-04**: Konfigurasi keamanan dan penguncian modul dipisahkan ke dalam file konfigurasi mandiri [`config.js`](file:///c:/Users/yudhiar/Downloads/AgenticAI/config.js) (`window.LEARNWITH_CONFIG`) sehingga memudahkan pembaruan sandi instruktur tanpa memodifikasi logika aplikasi.

### 2. URL Hardening, Session Management & Anti-Tampering (SEC-SESSION)

- [x] **SEC-05**: Penutupan celah bypass URL parameter tanpa otorisasi (`?unlock=dev`, `?unlock=word`, `?unlock=1`); parameter URL hanya dapat membuka modul jika menyertakan token/hash instruktur yang sah.
- [x] **SEC-06**: Mekanisme auto-lock / session timeout: modul yang telah dibuka akan otomatis terkunci kembali jika sesi tidak aktif atau saat browser ditutup, mencegah akses tidak sah pada perangkat yang ditinggalkan.

### 3. Content Security Policy, DOM Sanitization & Anti-Clickjacking (SEC-GUARD)

- [ ] **SEC-07**: Pemasangan header meta Content Security Policy (CSP) ketat di `<head>` untuk mencegah injeksi skrip asing, cross-site scripting (XSS), dan muatan konten eksternal tidak terpercaya.
- [ ] **SEC-08**: Pelindung anti-clickjacking (frame-busting guard) memastikan platform `learnwith` tidak dapat disusupi atau dimanipulasi di dalam `<iframe>` situs web jahat.
- [ ] **SEC-09**: Audit sanitasi DOM input: seluruh input pengguna (nama peserta, NIP, instansi, kuis, dan pencarian) wajib diproses secara aman menggunakan sanitasi karakter atau `textContent` murni, menjamin 0% celah DOM-based XSS.

---

## Traceability Table

| Requirement | Phase | Status |
|---|---|---|
| SEC-01 | Phase 16 | Complete |
| SEC-02 | Phase 16 | Complete |
| SEC-03 | Phase 16 | Complete |
| SEC-04 | Phase 16 | Complete |
| SEC-05 | Phase 17 | Complete |
| SEC-06 | Phase 17 | Complete |
| SEC-07 | Phase 18 | Pending |
| SEC-08 | Phase 18 | Pending |
| SEC-09 | Phase 18 | Pending |
