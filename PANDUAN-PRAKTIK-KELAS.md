# Panduan Praktik Kelas untuk Instruktur

## Hands-on Agentic AI: Dari Chat ke Kalender — Praktik Deploy Hermes Agent & 9Router

Gunakan dokumen ini ketika memandu sesi Zoom 08.30–11.00. Dokumen ini melengkapi `PANDUAN-PRE-TRAINING.md`; peserta tetap tidak boleh memasang Hermes atau mengonfigurasi provider sebelum sesi dimulai.

## Persiapan instruktur sebelum Zoom

Lakukan dry run lengkap pada laptop Windows yang setara dengan laptop peserta, paling lambat H-1.

1. Pilih **satu** provider dan **satu** model 9Router untuk seluruh kelas.
2. Catat nama model persis seperti yang tampil di dashboard 9Router.
3. Pastikan model dapat menjawab melalui endpoint `http://localhost:20128/v1` menggunakan API key yang dibuat oleh dashboard.
4. Uji instalasi Hermes, `hermes doctor`, koneksi model, Telegram, dan Google Calendar dengan akun latihan baru.
5. Siapkan kalender Google latihan kosong dan satu agenda dummy untuk demonstrasi.
6. Siapkan satu pendamping di breakout room untuk peserta yang tertinggal pada checkpoint dasar.

> Jangan memilih provider yang mengharuskan peserta memasukkan kartu pembayaran tanpa persetujuan tertulis. Sampaikan bila provider/model memerlukan akun, autentikasi, kuota, atau biaya.

## Nilai yang harus diumumkan instruktur saat kelas

Isi bagian berikut setelah dry run. Jangan membagikan API key, token bot, client secret JSON, atau kredensial peserta.

```text
Provider 9Router:
Nama model di dashboard:
Endpoint: http://localhost:20128/v1
API key: dibuat peserta sendiri dari dashboard 9Router
Mode Telegram: long polling lokal
Kalender yang digunakan: kalender latihan
```

## Rundown yang diperkuat

| Waktu | Fokus | Hasil yang harus terlihat |
|---|---|---|
| 08.30–08.40 | Pembukaan, keamanan, dan cek kesiapan | Peserta tahu token tidak boleh dikirim ke chat atau screen share. |
| 08.40–08.50 | Arsitektur dan pembagian technical clinic | Peserta yang belum lolos checkpoint pre-training dipindahkan ke pendamping. |
| 08.50–09.05 | 9Router: provider, model, API key lokal | Dashboard berjalan dan pilihan model sudah disamakan. |
| 09.05–09.30 | Instalasi Hermes | `hermes doctor` dapat dijalankan atau tidak menunjukkan kendala kritis. |
| 09.30–09.45 | Full Setup: model dan endpoint | Hermes dapat memberi respons uji melalui 9Router. |
| 09.45–10.05 | Telegram | Bot membalas akun dengan user ID yang diizinkan. |
| 10.05–10.30 | Google Cloud dan OAuth | Peserta memiliki OAuth client tipe Desktop app dan client-secret JSON tersimpan lokal. |
| 10.30–10.45 | Otorisasi Google Calendar | Hermes dapat mengakses kalender latihan. |
| 10.45–10.55 | Uji end-to-end | Perintah dari Telegram membaca atau membuat satu agenda uji. |
| 10.55–11.00 | Status akhir | Peserta mengirim status tanpa data rahasia. |

## 1. Menyamakan 9Router

1. Minta peserta menjalankan `9router` pada terminal yang terpisah.
2. Peserta membuka `http://localhost:20128` dan masuk ke dashboard lokal.
3. Instruktur mendemonstrasikan pemilihan provider dan model yang telah diuji.
4. Peserta membuat API key sendiri di dashboard bila konfigurasi Hermes memintanya. API key tidak boleh dikirim melalui chat atau diperlihatkan pada screen share.
5. Minta peserta menyimpan empat informasi di catatan pribadi: provider, nama model, endpoint, dan API key.

**Checkpoint 4:** dashboard aktif, provider/model sesuai, dan API key tersedia secara privat.

## 2. Instalasi dan pemeriksaan Hermes di Windows

Tampilkan satu perintah pada satu waktu. Perintah instalasi CLI resmi Hermes untuk Windows native adalah:

```powershell
iex (irm https://hermes-agent.nousresearch.com/install.ps1)
```

Setelah installer selesai, tutup dan buka kembali PowerShell bila perintah `hermes` belum dikenali. Lalu jalankan:

```powershell
hermes doctor
```

Jika `hermes` tidak dikenali, peserta mengirim pesan error yang sudah disensor ke breakout room. Jangan memasang ulang secara berulang tanpa diagnosis.

**Checkpoint 5:** `hermes doctor` berjalan dan peserta dapat memulai wizard Hermes.

## 3. Full Setup dan koneksi ke 9Router

1. Jalankan wizard berikut:

```powershell
hermes setup
```

2. Pilih setup model/provider sesuai dry run instruktur.
3. Masukkan endpoint OpenAI-compatible berikut bila wizard meminta base URL:

```text
http://localhost:20128/v1
```

4. Masukkan API key yang dibuat peserta di dashboard 9Router, hanya pada laptop peserta.
5. Pilih nama model yang persis sama dengan hasil dry run.
6. Jalankan uji respons singkat dari Hermes.

Jika konfigurasi sebelumnya sudah ada, `hermes setup` membuka wizard konfigurasi ulang; peserta dapat menekan Enter untuk mempertahankan nilai yang benar.

**Checkpoint 6:** Hermes memberi respons uji melalui 9Router.

## 4. Telegram dengan allowlist

Untuk peserta pemula, gunakan wizard interaktif:

```powershell
hermes gateway setup
```

Pilih Telegram saat diminta. Wizard akan meminta bot token dan allowed user ID. Masukkan token dari BotFather dan user ID numerik peserta secara lokal.

Nilai yang relevan bila perlu diperiksa pada konfigurasi lokal:

```text
TELEGRAM_BOT_TOKEN=<token-bot-pribadi>
TELEGRAM_ALLOWED_USERS=<user-id-numerik-peserta>
```

Jalankan dan periksa gateway:

```powershell
hermes gateway start
hermes gateway status
```

Saat sesi selesai atau troubleshooting memerlukannya:

```powershell
hermes gateway stop
```

Untuk workshop lokal, gunakan long polling bawaan. Jangan mengatur webhook publik.

**Checkpoint 7:** bot membalas DM dari user ID yang tercantum di allowlist. Bila muncul `unauthorized`, periksa user ID dan konfigurasi allowlist, bukan token di chat.

## 5. Google Calendar dan OAuth

Gunakan akun Google dan kalender latihan. Hindari kalender kerja/produksi.

1. Buka Google Cloud Console, lalu buat atau pilih project latihan.
2. Aktifkan Google Calendar API untuk project tersebut.
3. Konfigurasikan OAuth consent screen sesuai arahan Google. Gunakan akun latihan sebagai test user bila aplikasi masih berada dalam mode testing.
4. Buat OAuth 2.0 Client ID dengan tipe **Desktop app**.
5. Unduh file client secret JSON dan simpan hanya di laptop peserta.
6. Di Hermes, minta agent untuk menyiapkan Google Workspace atau ikuti alur skill Google Workspace. Hermes akan memberi URL otorisasi.
7. Buka URL tersebut, setujui akses untuk akun latihan, lalu salin URL redirect kembali ke Hermes bila diminta.
8. Jalankan uji baca kalender latihan sebelum membuat agenda baru.

**Checkpoint 8:** Hermes memiliki otorisasi OAuth yang aktif dan dapat membaca kalender latihan.

## 6. Skenario uji dan bukti keberhasilan

Gunakan prompt pendek berikut dari Telegram:

```text
Tampilkan agenda saya hari ini.
```

Setelah berhasil, gunakan agenda dummy:

```text
Buat agenda uji "Workshop Hermes" besok pukul 09.00 selama 15 menit di kalender latihan.
```

Peserta memeriksa hasil pada Telegram dan Google Calendar. Hapus agenda dummy setelah verifikasi bila tidak dibutuhkan.

**Checkpoint 9:** satu tindakan Calendar berhasil melalui Telegram dan terlihat di kalender latihan.

## 7. Troubleshooting cepat

| Gejala | Pemeriksaan pertama | Tindakan aman |
|---|---|---|
| `hermes` tidak dikenali | Terminal belum dibuka ulang setelah instalasi | Tutup semua PowerShell, buka lagi, lalu jalankan `hermes doctor`. |
| Hermes tidak menjawab | 9Router masih berjalan dan endpoint benar | Pastikan `9router` berjalan, periksa endpoint dan nama model. |
| Model gagal dipanggil | API key 9Router atau provider belum siap | Buat ulang API key di dashboard bila perlu dan ulangi setup model. Jangan kirim key ke chat. |
| Bot tidak merespons | Gateway belum aktif atau token salah | Jalankan `hermes gateway status`; periksa token lokal dan log gateway. |
| Bot membalas `unauthorized` | User ID tidak ada di allowlist | Cocokkan dengan nomor dari `@userinfobot`, lalu perbarui konfigurasi lokal. |
| OAuth Google gagal | Client bukan tipe Desktop app atau test user belum ditambahkan | Periksa jenis OAuth client, consent screen, dan akun Google latihan. |
| Google Calendar tidak berubah | Peserta memakai akun/kalender berbeda | Ulangi uji baca kalender, kemudian buat agenda dummy baru. |

## 8. Operasional setelah workshop

Urutan menyalakan ulang pada hari berikutnya:

```text
1. Jalankan 9Router dan pastikan dashboard lokal terbuka.
2. Pastikan Hermes masih menggunakan endpoint dan model yang benar.
3. Jalankan hermes gateway start.
4. Jalankan hermes gateway status.
5. Kirim pesan uji ke bot Telegram.
```

Jika token bot bocor, segera jalankan `/revoke` di `@BotFather`, masukkan token baru ke konfigurasi lokal Hermes, lalu restart gateway. Jangan gunakan token lama.

## Referensi yang diverifikasi

- [Instalasi Hermes untuk Windows](https://hermes-agent.nousresearch.com/docs/getting-started/installation)
- [Perintah setup Hermes](https://hermes-agent.nousresearch.com/docs/reference/cli-commands/)
- [Konfigurasi Telegram Hermes](https://hermes-agent.nousresearch.com/docs/user-guide/messaging/telegram)
- [Skill Google Workspace Hermes](https://hermes-agent.nousresearch.com/docs/user-guide/skills/google-workspace)
- [Quick start 9Router](https://github.com/decolua/9router)
