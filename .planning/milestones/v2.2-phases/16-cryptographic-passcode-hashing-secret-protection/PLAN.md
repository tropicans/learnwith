# Plan: Phase 16 — Cryptographic Passcode Hashing & Secret Protection (Zero-Plaintext)

## Overview
Menghilangkan seluruh jejak kata sandi teks polos, mengamankan objek global browser dari pembacaan console DevTools, membersihkan kebocoran kredensial pada placeholder modal, dan menerapkan verifikasi berbasis Web Crypto API SHA-256 hash matching dengan file konfigurasi terisolasi `config.js`.

## Requirements Addressed
- **SEC-01**: Seluruh teks polos kata sandi (`['buka-kata', 'kata-sandi-asn']`) dihapus dari kode sumber JavaScript, dan variabel `window.WORD_PASSCODES` dihapus total dari global scope browser console.
- **SEC-02**: Formulir modal penguncian modul bersih dari kebocoran kredensial; teks `placeholder="Contoh: buka-kata"` diganti menjadi placeholder netral dan aman (`placeholder="Masukkan kode sandi instruktur..."`).
- **SEC-03**: Verifikasi kata sandi menggunakan enkripsi hash satu arah SHA-256 via Web Crypto API standar (`crypto.subtle.digest`), mencocokkan hash input dengan array hash tersimpan tanpa pernah menyimpan string sandi asli di client.
- **SEC-04**: Konfigurasi keamanan dan penguncian modul dipisahkan ke dalam file konfigurasi mandiri `config.js` (`window.LEARNWITH_CONFIG`) sehingga memudahkan pembaruan sandi instruktur tanpa memodifikasi logika aplikasi.

## Proposed Tasks

### Task 1: Create Centralized Secure Configuration (`config.js`) [SEC-04]
- Buat file baru `config.js` di root workspace.
- Definisikan `window.LEARNWITH_CONFIG` dengan konfigurasi penguncian modul dan daftar `allowedPasscodeHashes` (SHA-256).
- Sertakan hash SHA-256 untuk passkey bawaan instruktur (`buka-kata` dan `kata-sandi-asn`) agar alur pengujian dan pemakaian tetap mulus tanpa menyimpan plaintext.

### Task 2: Clean UI Credential Leak in `index.html` [SEC-02]
- Muat `config.js?v=2.2.0` di `<head>` sebelum script aplikasi.
- Ubah placeholder pada `<input id="input-word-unlock-code">`:
  - Sebelum: `placeholder="Contoh: buka-kata"`
  - Sesudah: `placeholder="Masukkan kode sandi instruktur..."`

### Task 3: Implement Web Crypto SHA-256 Hashing & Zero-Plaintext in `assets/js/app.js` [SEC-01, SEC-03]
- Hapus array plaintext `WORD_PASSCODES`.
- Hapus eksposisi global `window.WORD_PASSCODES`.
- Buat fungsi utilitas kriptografi `hashPasscodeSha256(rawStr)` menggunakan Web Crypto API `crypto.subtle.digest('SHA-256', ...)` dengan fallback heksadesimal yang aman.
- Perbarui `handleWordUnlockSubmit()` menjadi asynchronous untuk menghitung hash dari input pengguna dan mencocokkannya dengan `LEARNWITH_CONFIG.security.allowedPasscodeHashes`.

### Task 4: Update Tests & Verification Suite
- Perbarui `tests/multi-course.test.js` untuk memverifikasi bahwa `WORD_PASSCODES` plaintext sudah tidak diekspos (`assert.strictEqual(window.WORD_PASSCODES, undefined)`), serta memvalidasi mekanisme hash matching baru.
- Jalankan `scratch/test_integration.py` untuk memastikan seluruh 38 skenario E2E tetap 100% lulus.

## Verification Plan
1. **Automated Unit & E2E Tests:**
   - Run `python scratch/test_integration.py` → 38/38 PASS.
   - Run Node.js multi-course test suite → 100% assertions pass.
2. **Security Audit Verification:**
   - Verify `window.WORD_PASSCODES` is `undefined` in browser console.
   - Verify no plaintext password string appears in `assets/js/app.js` or `index.html`.
   - Verify typing valid passcode (`buka-kata`) hashes and unlocks module correctly.
   - Verify typing invalid passcode fails and shows error toast/feedback.
