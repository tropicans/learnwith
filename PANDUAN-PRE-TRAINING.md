# Panduan Pre-Training untuk Peserta Pemula

## Workshop Hermes Agent + 9Router: Mengelola Google Calendar melalui Telegram

Panduan ini ditulis untuk peserta **tanpa pengalaman coding atau dasar IT**. Ikuti langkah secara berurutan. Tidak perlu memahami semua istilah teknis terlebih dahulu.

Panduan utama menggunakan **laptop Windows 10/11 dan PowerShell**. Jika Anda memakai macOS atau Linux, jangan menebak perintah yang berbeda; hubungi instruktur untuk panduan khusus perangkat Anda.

**Perkiraan waktu:** 45–75 menit  
**Tugas sebelum kelas:** memasang 9Router, memastikan dashboard lokal dapat dibuka, dan membuat bot Telegram melalui BotFather.  
**Dikerjakan bersama saat kelas:** memilih provider/model, instalasi Hermes Agent, Full Setup, menghubungkan Hermes ke 9Router dan Telegram, serta menghubungkan Google Calendar.

### Ringkasan tugas Anda

Kerjakan lima kegiatan berikut secara berurutan:

1. Periksa laptop, internet, akun Telegram, dan akun Google.
2. Periksa atau instal Node.js.
3. Instal 9Router dan buka dashboard-nya.
4. Buat bot Telegram dan catat user ID.
5. Periksa bahwa Google Cloud Console dapat dibuka.

Berhenti dan minta bantuan jika sebuah **checkpoint** belum berhasil. Jangan melompat ke langkah berikutnya.

---

## 1. Target pre-training

Pre-training selesai ketika:

```text
9Router berhasil dipasang
          ↓
Dashboard lokal dapat dibuka di browser
          ↓
Bot Telegram sudah dibuat, token aman, dan user ID sudah dicatat
```

Anda **belum perlu menginstal Hermes Agent**. Hermes akan diinstal dan dikonfigurasi bersama instruktur saat kelas.

### Arti beberapa istilah

- **Browser:** aplikasi untuk membuka situs, misalnya Google Chrome atau Microsoft Edge.
- **PowerShell/Terminal:** aplikasi tempat kita mengetik perintah kepada komputer.
- **Node.js:** aplikasi pendukung yang dibutuhkan agar 9Router dapat berjalan.
- **npm:** alat bawaan Node.js yang digunakan untuk memasang 9Router.
- **LTS:** versi Node.js yang stabil dan disarankan untuk kebanyakan pengguna.
- **9Router:** aplikasi lokal yang nanti akan menghubungkan Hermes dengan model AI.
- **Provider:** layanan penyedia model AI; akan dipilih bersama saat kelas.
- **Model:** AI yang akan menerima pertanyaan dan menghasilkan jawaban; akan dipilih bersama saat kelas.
- **Dashboard lokal:** halaman aplikasi yang hanya berjalan di laptop Anda, bukan situs publik.
- **Token/API key:** kode rahasia untuk mengakses suatu layanan. Perlakukan seperti kata sandi.
- **BotFather:** akun resmi Telegram untuk membuat dan mengatur bot.
- **Bot token:** kode rahasia yang memungkinkan aplikasi mengendalikan bot Telegram Anda.
- **Telegram user ID:** nomor tetap yang mengenali akun Telegram Anda; berbeda dari nama `@username`.
- **Password manager:** aplikasi khusus untuk menyimpan kata sandi atau token secara aman. Penggunaannya tidak wajib dalam panduan ini.
- **Google Cloud Console:** halaman pengaturan layanan Google yang akan digunakan untuk mengaktifkan akses Google Calendar saat kelas.
- **Checkpoint:** tanda bahwa satu tahap sudah berhasil dan Anda boleh melanjutkan.
- **Technical clinic:** sesi bantuan teknis sebelum kelas untuk peserta yang mengalami kendala.
- **Full Setup:** rangkaian pertanyaan konfigurasi Hermes yang akan diikuti bersama saat kelas.

---

## 2. Aturan keamanan

Selama mengikuti panduan:

1. Jangan mengirim token, API key, atau kata sandi ke grup kelas.
2. Jangan mengambil screenshot jika layar sedang menampilkan kode rahasia.
3. Jangan mengubah pengaturan jaringan atau firewall laptop.
4. Jika diminta bantuan, kirim hanya pesan error yang sudah disensor.

Contoh penyensoran:

```text
API key asli : sk-abcd1234-rahasia
Yang dikirim : sk-****-****
```

---

## 3. Yang harus disiapkan

Pastikan Anda memiliki:

- Laptop Windows 10/11. Pengguna macOS/Linux perlu meminta panduan khusus kepada instruktur.
- Charger laptop.
- Koneksi internet yang stabil.
- Google Chrome atau Microsoft Edge versi terbaru.
- Hak untuk memasang aplikasi pada laptop.
- Akun Google pribadi yang dapat membuka Google Cloud Console.
- Akun Telegram aktif di ponsel.

> Jika laptop dikelola kantor dan Anda tidak diizinkan memasang aplikasi, hubungi instruktur sebelum hari pelatihan.

Informasi kontak dan jadwal technical clinic akan disampaikan oleh instruktur secara terpisah.

---

## 4. Khusus pengguna Windows: membuka PowerShell

Sebagian besar peserta dapat mengikuti langkah Windows berikut.

1. Klik tombol **Start/Windows** di kiri bawah layar.
2. Ketik `PowerShell`.
3. Klik **Windows PowerShell** atau **PowerShell**.
4. Jendela biru atau hitam akan terbuka.

Anda akan melihat baris yang kurang lebih seperti ini:

```text
PS C:\Users\NamaAnda>
```

Teks tersebut normal. Jangan ikut mengetik bagian `PS C:\Users\NamaAnda>`.

### Cara menjalankan perintah

1. Salin hanya teks di dalam kotak perintah.
2. Tempelkan ke PowerShell dengan klik kanan atau `Ctrl+V`.
3. Tekan `Enter` satu kali.
4. Tunggu sampai proses selesai sebelum menjalankan perintah berikutnya.

---

## 5. Memeriksa Node.js

9Router membutuhkan Node.js. Node.js adalah aplikasi pendukung yang memungkinkan 9Router berjalan.

### Langkah A — periksa apakah sudah terpasang

Di PowerShell, jalankan:

```powershell
node --version
```

### Hasil yang benar

Jika muncul nomor versi seperti berikut, lanjutkan ke pemeriksaan npm:

```text
v24.x.x
```

Angka dapat berbeda. Untuk instalasi baru, pilih versi **LTS** yang ditawarkan situs resmi Node.js (saat panduan ini diperiksa: v24). Node.js `v22...` yang sudah terpasang juga dapat digunakan. Jika versi Anda `v20...` atau lebih rendah, perbarui ke versi LTS melalui Langkah B atau minta bantuan technical clinic.

Jika muncul pesan seperti `node is not recognized`, berarti Node.js belum terpasang.

Jika `node --version` dan `npm --version` sama-sama menampilkan `not recognized`, hal itu normal pada laptop yang belum memiliki Node.js. Jangan mencoba memasang 9Router terlebih dahulu; lanjutkan langsung ke Langkah B di bawah ini.

### Langkah B — instal Node.js jika belum tersedia

1. Buka browser.
2. Kunjungi [https://nodejs.org](https://nodejs.org).
3. Pilih versi yang bertuliskan **LTS**, lalu pilih **Windows Installer (.msi) 64-bit/x64**. Jangan memilih file source code atau ZIP.
4. Buka file `.msi` yang sudah diunduh.
5. Klik **Next**, setujui lisensi, dan gunakan pilihan bawaan/default.
6. Pastikan pilihan untuk memasang **npm package manager** dan menambahkan Node.js ke **PATH** tetap aktif.
7. Jika Windows meminta izin, pilih **Yes**.
8. Setelah instalasi selesai, klik **Finish**.
9. Tutup **semua** jendela PowerShell, kemudian buka PowerShell baru.
10. Jalankan kembali `node --version`, lalu `npm --version`.

Jika keduanya masih tidak dikenali setelah instalasi, restart laptop satu kali dan ulangi pemeriksaan.

### Langkah C — periksa npm

Pemeriksaan dilakukan di **jendela PowerShell yang sedang terbuka**. Klik kembali jendela PowerShell, lalu ketik atau salin perintah berikut dan tekan `Enter`:

```powershell
npm --version
```

### Checkpoint 1 — Node.js siap

Checkpoint berhasil jika kedua perintah menampilkan nomor versi:

```text
node --version     → menampilkan nomor
npm --version      → menampilkan nomor
```

Jika salah satunya gagal, berhenti di sini dan ikuti technical clinic.

---

## 6. Menginstal 9Router

Pastikan PowerShell atau Terminal tetap terbuka.

Salin dan jalankan satu perintah berikut:

```powershell
npm install -g 9router
```

Proses dapat berlangsung beberapa menit. Tulisan yang bergerak di layar adalah normal. Jangan menutup terminal selama proses berlangsung.

### Hasil yang benar

Instalasi selesai ketika PowerShell kembali menampilkan baris yang diawali `PS`, sehingga Anda dapat mengetik perintah baru. Anda mungkin juga melihat kalimat seperti `added ... packages`.

Pesan `warning` atau `npm notice` tidak selalu berarti gagal. Jika ragu, lanjutkan ke langkah menjalankan 9Router.

---

## 7. Menjalankan 9Router

```powershell
9router
```

Setelah menekan `Enter`:

- Jangan tutup jendela PowerShell/Terminal.
- Tunggu sekitar 10–30 detik.
- Browser mungkin terbuka secara otomatis.

Jika Windows menampilkan permintaan untuk mengizinkan akses jaringan, jangan memilih akses jaringan publik. Batalkan/tutup permintaan tersebut dan lanjutkan memeriksa dashboard lokal. Jika dashboard tidak terbuka setelah itu, hubungi instruktur.

Jika browser tidak terbuka, buka Chrome/Edge secara manual dan ketik alamat berikut pada kolom alamat di bagian paling atas browser:

```text
http://localhost:20128
```

### Checkpoint 2 — dashboard terbuka

Checkpoint berhasil jika halaman dashboard 9Router terlihat di browser.

Jika halaman pertama menampilkan kotak **Password/Login** dan Anda belum pernah membuat kata sandi 9Router:

1. Masukkan kata sandi awal `123456`.
2. Klik tombol **Login/Sign in**.
3. Jika diminta membuat kata sandi baru, buat kata sandi yang tidak digunakan pada akun lain.
4. Simpan kata sandi baru di tempat pribadi.
5. Jangan mengirim kata sandi tersebut kepada instruktur.
6. Pastikan halaman utama/dashboard 9Router kemudian terlihat.

> `123456` adalah kata sandi awal instalasi lokal, bukan kata sandi akun Google atau Telegram Anda. Jika kata sandi awal tidak diterima, jangan mencoba berulang kali; catat pesan yang muncul dan hubungi instruktur.

Perhatikan dua hal penting:

- PowerShell/Terminal harus tetap terbuka agar 9Router terus berjalan.
- `localhost` berarti aplikasi berjalan pada laptop Anda sendiri.

### Cara menghentikan dan menjalankan kembali

Untuk menghentikan 9Router, buka jendela terminal tempat 9Router berjalan lalu tekan:

```text
Ctrl+C
```

Jika muncul pertanyaan konfirmasi, jawab `Y` lalu tekan `Enter`. Jika tidak muncul pertanyaan, itu juga normal.

Untuk menjalankannya kembali pada Windows:

```powershell
9router
```

---

## 8. Jangan memilih provider/model terlebih dahulu

Jika dashboard 9Router sudah terbuka, tugas pre-training Anda sudah selesai.

Sebelum kelas:

- Jangan membuka atau mengubah menu **Providers**.
- Jangan memilih model.
- Jangan melakukan login provider melalui 9Router.
- Jangan menyalin atau membuat API key.

Pemilihan provider/model dilakukan bersama saat kelas agar semua peserta menggunakan pilihan yang sama dan dapat mengikuti penjelasan instruktur langkah demi langkah.

---

## 9. Jangan menginstal Hermes terlebih dahulu

Instalasi Hermes Agent dan **Full Setup** dilakukan bersama di kelas. Saat itulah instruktur akan menjelaskan hubungan berikut:

```text
Hermes Agent
     ↓ memakai alamat OpenAI-compatible
http://localhost:20128/v1
     ↓
9Router
     ↓
Model AI
```

Sebelum kelas:

- Jangan menjalankan installer Hermes.
- Jangan menjalankan `hermes setup`.
- Jangan menjalankan `hermes model`.
- Jangan mengaktifkan Google Calendar API.

Langkah-langkah tersebut merupakan materi praktik bersama.

---

## 10. Membuat bot Telegram melalui BotFather

Bot boleh dibuat sebelum kelas karena koneksinya ke Hermes baru akan dilakukan bersama instruktur.

### Langkah A — buka BotFather resmi

1. Buka aplikasi Telegram di ponsel.
2. Tekan tombol pencarian.
3. Cari `@BotFather`.
4. Pastikan username yang terlihat adalah tepat `@BotFather` dan memiliki tanda verifikasi resmi Telegram.
5. Buka percakapan tersebut, lalu tekan **Start**.

### Langkah B — buat bot baru

1. Kirim perintah berikut kepada BotFather:

```text
/newbot
```

2. BotFather meminta **nama bot**. Masukkan nama yang mudah dikenali, misalnya:

```text
Asisten Jadwal Budi
```

Nama dan username bot dapat terlihat oleh pengguna Telegram. Jangan memakai nomor telepon, alamat email, atau informasi pribadi lain pada nama bot.

3. BotFather kemudian meminta **username bot**. Username harus unik, tidak boleh memakai spasi, hanya memakai huruf, angka, atau garis bawah (`_`), dan harus diakhiri dengan `bot`, misalnya:

```text
jadwal_budi_2026_bot
```

4. Jika muncul pesan bahwa username sudah digunakan, buat username lain dengan menambahkan nama atau angka.
5. Jika berhasil, BotFather akan mengirim pesan berisi tautan bot dan **bot token**.

### Langkah C — simpan bot token dengan aman

Bot token terlihat seperti rangkaian angka dan huruf panjang. Token setiap peserta akan berbeda.

1. Untuk pre-training, token boleh tetap berada di percakapan pribadi dengan BotFather. Anda dapat menyalinnya saat kelas.
2. Jika memakai aplikasi password manager, token juga boleh disimpan di sana dengan nama `Token Bot Workshop`.
3. Jangan menyimpan token di grup, dokumen bersama, atau catatan yang dapat dilihat orang lain.
4. Jangan mengirim token ke grup WhatsApp, Telegram, email bersama, atau formulir laporan.
5. Jangan memasukkan token ke panduan ini.

> Siapa pun yang mengetahui bot token dapat mengendalikan bot Anda. Jika token tidak sengaja tersebar, buka BotFather, gunakan `/revoke`, pilih bot terkait, lalu simpan token baru.

### Langkah D — buka bot Anda

1. Tekan tautan bot yang diberikan BotFather.
2. Tekan **Start**.
3. Bot mungkin belum menjawab. Hal ini normal karena Hermes belum dihubungkan.

### Langkah E — cari Telegram user ID

Hermes memerlukan nomor user ID untuk menentukan siapa yang boleh menggunakan bot.

1. Cari `@userinfobot` di Telegram.
2. Buka percakapan dan tekan **Start**.
3. Bot akan menampilkan beberapa informasi. Cari bagian **Id** atau **User ID** yang hanya berisi angka, misalnya `123456789`.
4. Catat hanya nomor tersebut di catatan pribadi agar mudah ditemukan saat kelas.

> Jangan pernah mengirim bot token, kata sandi, atau kode login kepada `@userinfobot`. Anda hanya perlu menekan **Start** dan membaca nomor ID yang ditampilkan.

Jangan tertukar:

```text
Username Telegram : biasanya diawali @
Telegram user ID  : hanya berupa angka
```

### Checkpoint 3 — bot Telegram siap

Checkpoint berhasil jika:

- Bot baru sudah terlihat di Telegram.
- Bot token tersedia di percakapan pribadi BotFather atau tersimpan di password manager.
- Nomor Telegram user ID sudah dicatat.
- Token tidak pernah dikirim kepada orang lain.

---

## 11. Pemeriksaan akun Google

Tidak ada konfigurasi Google yang perlu dilakukan. Cukup lakukan pemeriksaan berikut.

### Google

1. Buka [https://console.cloud.google.com](https://console.cloud.google.com).
2. Login menggunakan akun Google yang akan dipakai untuk latihan.
3. Jika muncul halaman persetujuan awal, baca lalu lanjutkan hanya jika Anda menyetujuinya.
4. Pastikan halaman utama Google Cloud Console dapat dibuka.
5. Jangan membuat project, mengaktifkan API, atau memasukkan informasi pembayaran terlebih dahulu.

Gunakan akun latihan atau kalender khusus workshop. Hindari kalender kerja/produksi yang berisi jadwal penting.

---

## 12. Jika terjadi masalah

### `node is not recognized`

Pesan ini berarti PowerShell belum menemukan Node.js. Jika Anda belum pernah memasang Node.js, kembali ke Bagian 5 dan instal versi LTS. Jika Anda pernah memakai Node.js sebelumnya, jangan langsung menginstal ulang; lanjutkan ke langkah pemeriksaan PATH pada bagian `npm tidak dikenali` di bawah ini.

### `npm` tidak dikenali

Jika muncul pesan `npm is not recognized` atau `The term 'npm' is not recognized`, ada dua kemungkinan: Node.js belum terpasang, atau Node.js sebenarnya sudah ada tetapi PowerShell belum mengenali lokasi instalasinya.

1. Jika Anda pernah memakai Node.js sebelumnya, **jangan langsung menginstal ulang**.
2. Tutup seluruh aplikasi Windows Terminal/PowerShell, bukan hanya satu tab.
3. Buka PowerShell baru dan jalankan `node --version` serta `npm --version`.
4. Jika masih gagal, muat ulang PATH pada PowerShell dengan menyalin perintah berikut sebagai satu baris:

```powershell
$env:Path = [Environment]::GetEnvironmentVariable('Path','Machine') + ';' + [Environment]::GetEnvironmentVariable('Path','User')
```

5. Jalankan kembali `node --version` dan `npm --version`.
6. Jika berhasil, tutup seluruh aplikasi terminal dan restart laptop sebelum kelas agar PATH dimuat secara normal.
7. Jika tetap gagal, ikuti technical clinic agar lokasi instalasi dan PATH dapat diperiksa tanpa merusak instalasi lama.
8. Jika Anda yakin belum pernah memasang Node.js, kembali ke Bagian 5 dan instal Node.js LTS.

### `npm` ditemukan tetapi muncul `running scripts is disabled`

Jangan mengubah pengaturan keamanan PowerShell. Gunakan **Command Prompt** dengan command resmi yang sama:

1. Tutup PowerShell.
2. Klik tombol **Start/Windows**.
3. Ketik `Command Prompt`, lalu buka aplikasinya.
4. Jalankan `npm --version`.
5. Jika nomor versi muncul, lanjutkan dengan `npm install -g 9router`.
6. Setelah instalasi selesai, jalankan `9router`.

### `9router` tidak dikenali

1. Tutup PowerShell.
2. Buka PowerShell baru.
3. Jalankan kembali `9router`.
4. Jika masih gagal, kirim pesan error yang sudah disensor kepada instruktur.

### Browser tidak menampilkan dashboard

1. Pastikan jendela terminal tempat 9Router dijalankan masih terbuka.
2. Tunggu 30 detik.
3. Buka `http://localhost:20128` secara manual.
4. Jika belum terbuka, coba `http://127.0.0.1:20128`.
5. Jangan menggunakan `https://`.

### Instalasi terlihat berhenti

Tunggu maksimal 10 menit. Jika tidak berubah:

1. Ambil screenshot bagian error saja.
2. Pastikan tidak ada token atau informasi akun pada screenshot.
3. Kirim kepada instruktur dengan menyebutkan nomor langkah yang gagal.

### Muncul pesan `Access denied`, `Permission denied`, atau `EPERM`

1. Tutup PowerShell.
2. Klik tombol **Start/Windows** dan cari `PowerShell`.
3. Klik kanan PowerShell, lalu pilih **Run as administrator**.
4. Pilih **Yes** jika Windows meminta izin.
5. Jalankan kembali perintah instalasi 9Router.
6. Gunakan PowerShell sebagai administrator hanya untuk instalasi ini, lalu tutup setelah selesai.

### Username bot sudah digunakan

Username bot harus unik untuk seluruh pengguna Telegram. Tambahkan nama atau beberapa angka, lalu coba kembali. Pastikan username tetap diakhiri dengan `bot`.

### Bot tidak membalas pesan

Hal ini normal pada tahap pre-training. Bot baru akan membalas setelah dihubungkan ke Hermes saat kelas.

### Bot token tidak sengaja terkirim kepada orang lain

Segera buka `@BotFather`, kirim `/revoke`, pilih bot yang terkait, lalu simpan token baru. Token lama tidak boleh digunakan lagi.

---

## 13. Cara meminta bantuan

Gunakan format berikut:

```text
Nama:
Sistem operasi: Windows 10 / Windows 11
Langkah yang gagal: contoh "Langkah 7 — Menjalankan 9Router"
Yang terlihat di layar:
Yang sudah saya coba:
Dashboard dapat dibuka: Ya / Tidak
```

Lampirkan pesan error atau screenshot setelah memastikan tidak ada:

- API key atau token.
- Kata sandi.
- Alamat email pribadi jika tidak diperlukan.
- Informasi rekening atau pembayaran.

---

## 14. Checklist akhir

Centang setiap bagian yang sudah berhasil:

```text
[ ] Laptop dan charger siap
[ ] Internet dan browser berfungsi
[ ] Saya memiliki hak untuk memasang aplikasi
[ ] Bot Telegram sudah dibuat melalui @BotFather
[ ] Bot token tersedia di percakapan pribadi BotFather atau password manager
[ ] Nomor Telegram user ID sudah dicatat
[ ] Google Cloud Console dapat dibuka
[ ] Node.js menampilkan nomor versi
[ ] npm menampilkan nomor versi
[ ] 9Router berhasil diinstal
[ ] Dashboard http://localhost:20128 dapat dibuka
[ ] Saya belum memilih provider atau model
[ ] Saya belum menginstal atau mengonfigurasi Hermes
```

Jika seluruh kotak sudah dicentang, status Anda adalah **SIAP MENGIKUTI WORKSHOP**.

Jika Checkpoint 1, 2, atau 3 belum berhasil, status Anda adalah **PERLU TECHNICAL CLINIC**.

---

## 15. Form laporan kesiapan

Kirim laporan ini kepada instruktur tanpa menyertakan token atau API key:

```text
Nama:
Sistem operasi:

[ ] Checkpoint 1 — Node.js dan npm siap
[ ] Checkpoint 2 — dashboard 9Router terbuka
[ ] Checkpoint 3 — bot Telegram dan user ID siap
[ ] Google Cloud Console dapat dibuka

Status: SIAP / PERLU TECHNICAL CLINIC
Nomor langkah yang bermasalah (jika ada):
Pesan error yang sudah disensor:
```

---

## 16. Referensi resmi

- [9Router](https://github.com/decolua/9router)
- [Hermes Agent Quickstart](https://hermes-agent.nousresearch.com/docs/getting-started/quickstart)
- [Hermes Telegram Gateway](https://hermes-agent.nousresearch.com/docs/user-guide/messaging/telegram)
- [Google Calendar Events API](https://developers.google.com/workspace/calendar/api/v3/reference/events)
