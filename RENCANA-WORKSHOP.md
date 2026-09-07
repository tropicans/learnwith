# Rencana Pembelajaran Workshop

## Hands-on Agentic AI: Dari Chat ke Kalender — Praktik Deploy Hermes Agent & 9Router

**Durasi:** 08.30–11.00 WIB (150 menit)  
**Moda:** Zoom Meeting  
**Sasaran:** Peserta pemula tanpa pengalaman coding atau dasar IT  
**Metode:** Demonstrasi langsung, praktik terbimbing, checkpoint, dan tanya jawab

## Tujuan pembelajaran

Pada akhir workshop, peserta mampu:

1. Memahami alur integrasi Hermes Agent, 9Router, model AI, Telegram, dan Google Calendar.
2. Memilih provider dan model AI pada 9Router sesuai arahan instruktur.
3. Menginstal Hermes Agent dan menyelesaikan proses Full Setup.
4. Menghubungkan Hermes Agent dengan 9Router menggunakan alamat lokal `http://localhost:20128/v1`.
5. Menghubungkan bot Telegram dan membatasi aksesnya menggunakan Telegram user ID.
6. Menghubungkan Google Calendar untuk melakukan uji baca atau pembuatan agenda melalui Telegram.

## Prasyarat peserta

Sebelum masuk Zoom, peserta diharapkan sudah memenuhi checklist pada `PANDUAN-PRE-TRAINING.md`:

- Node.js dan npm siap.
- 9Router sudah terinstal dan dashboard `http://localhost:20128` dapat dibuka.
- Bot Telegram telah dibuat; bot token tersimpan aman dan Telegram user ID sudah dicatat.
- Google Cloud Console dapat dibuka dengan akun latihan.
- Peserta belum memilih provider/model, belum memasang Hermes, dan belum mengaktifkan Google Calendar API.

Peserta yang belum memenuhi Checkpoint 1, 2, atau 3 masuk jalur **technical clinic** melalui breakout room atau pendamping teknis.

Sebelum kelas, instruktur wajib melakukan dry run dari 9Router sampai uji Telegram dan Google Calendar. Instruktur menetapkan satu provider dan satu model yang sudah diuji, menjelaskan kebutuhan autentikasi/biaya bila ada, serta menyiapkan kalender latihan.

## Rundown pembelajaran

| Waktu | Durasi | Kegiatan | Aktivitas peserta | Output/checkpoint |
|---|---:|---|---|---|
| 08.30–08.40 | 10 mnt | Pembukaan, tujuan, dan aturan Zoom | Absensi, memastikan laptop memakai daya/charger, menyiapkan PowerShell, browser, Telegram ponsel, serta akun Google. | Peserta memahami target sesi dan aturan keamanan token/API key. |
| 08.40–08.50 | 10 mnt | Arsitektur dan technical clinic | Meninjau alur `Telegram → Hermes Agent → 9Router → Model AI`; peserta yang belum lolos pre-training dipindahkan ke pendamping. | Kesiapan awal terpetakan tanpa menghambat kelas utama. |
| 08.50–09.05 | 15 mnt | Menyamakan 9Router | Menjalankan `9router`, membuka dashboard, memilih provider/model yang telah diuji instruktur, dan membuat API key lokal bila diminta. | **Checkpoint 4:** dashboard, provider/model, dan API key siap secara privat. |
| 09.05–09.30 | 25 mnt | Instalasi Hermes Agent | Menjalankan installer Hermes Windows, membuka ulang terminal bila perlu, lalu menjalankan `hermes doctor`. | **Checkpoint 5:** Hermes terinstal dan dapat dijalankan. |
| 09.30–09.45 | 15 mnt | Full Setup Hermes dan koneksi ke 9Router | Menjalankan `hermes setup`, memasukkan endpoint OpenAI-compatible `http://localhost:20128/v1`, API key lokal, dan nama model yang dipilih. | **Checkpoint 6:** Hermes memberi respons melalui 9Router. |
| 09.45–10.05 | 20 mnt | Integrasi Telegram | Menjalankan `hermes gateway setup`, memasukkan token lokal serta user ID allowlist, lalu memeriksa gateway. | **Checkpoint 7:** bot menerima pesan dari pemilik yang diizinkan. |
| 10.05–10.30 | 25 mnt | Google Cloud dan OAuth | Menyiapkan project latihan, Google Calendar API, OAuth consent screen, serta OAuth client tipe Desktop app. | Client secret JSON tersedia di laptop peserta. |
| 10.30–10.45 | 15 mnt | Otorisasi Google Calendar | Mengikuti URL otorisasi yang dibuat Hermes dan menguji akses ke kalender latihan. | **Checkpoint 8:** Hermes mendapat otorisasi Google Calendar. |
| 10.45–10.55 | 10 mnt | Uji skenario end-to-end | Mengirim perintah sederhana dari Telegram, misalnya meminta agenda hari ini atau membuat agenda uji di kalender latihan. Verifikasi hasil di Telegram dan Google Calendar. | **Checkpoint 9:** satu tindakan Calendar berhasil melalui Telegram. |
| 10.55–11.00 | 5 mnt | Penutup dan tindak lanjut | Mengisi status akhir, menyampaikan kendala yang belum selesai tanpa token/API key, dan menerima jalur bantuan lanjutan. | Status peserta: selesai, perlu pendampingan, atau perlu technical clinic lanjutan. |

## Pengaturan Zoom yang disarankan

- Gunakan **Waiting Room** dan ubah nama peserta menjadi `Nama – Instansi` saat masuk.
- Aktifkan **screen share host**, serta izinkan peserta membagikan layar hanya saat troubleshooting.
- Sediakan satu co-host untuk memantau chat, polling, dan breakout room technical clinic.
- Rekam bagian konsep dan demonstrasi umum bila semua peserta menyetujui; hentikan rekaman saat ada layar yang berpotensi menampilkan token, API key, atau data pribadi.
- Gunakan chat hanya untuk nomor checkpoint dan pesan error yang sudah disensor; jangan pernah mengirim token, API key, password, atau screenshot yang memuatnya.

## Strategi pendampingan peserta pemula

- Instruktur menjalankan satu langkah, lalu memberi waktu peserta menirukan sebelum melanjutkan.
- Setiap langkah penting diakhiri dengan checkpoint berupa respons singkat di chat, misalnya `C4 siap` atau `C4 kendala`.
- Peserta yang gagal pada tahap dasar tidak dipaksa mengejar konfigurasi lanjutan; pendamping membantu di breakout room dan mencatat langkah yang masih perlu dilanjutkan.
- Gunakan akun Google dan kalender latihan, bukan kalender kerja/produksi.

## Evaluasi akhir

Peserta dinyatakan berhasil bila dapat menunjukkan:

- 9Router berjalan dan Hermes memakai endpoint `http://localhost:20128/v1`.
- Bot Telegram hanya merespons akun dengan user ID yang diizinkan.
- Google Calendar telah terhubung ke Hermes.
- Minimal satu skenario uji Calendar dari Telegram berhasil dan dapat diverifikasi.

Panduan langkah demi langkah untuk instruktur dan peserta tersedia pada `PANDUAN-PRAKTIK-KELAS.md`.

## Form status akhir di chat atau formulir

```text
Nama:
[ ] Checkpoint 4 — Provider/model di 9Router siap
[ ] Checkpoint 5 — Hermes terinstal
[ ] Checkpoint 6 — Hermes terhubung ke 9Router
[ ] Checkpoint 7 — Bot Telegram merespons
[ ] Checkpoint 8 — Google Calendar terhubung
[ ] Checkpoint 9 — Uji end-to-end berhasil

Status: SELESAI / PERLU PENDAMPINGAN
Kendala (tanpa token/API key):
```
