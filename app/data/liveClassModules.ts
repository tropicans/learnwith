/**
 * Strongly-Typed Dataset for Agentic AI Live-Class Modules 6–11
 * Requirements: LIVE-MOD-01, LIVE-MOD-02, LIVE-MOD-03
 *
 * Provides structured steps, terminal commands, checkpoints, and checklists
 * for the interactive live classroom workshop.
 */

export interface LiveStep {
  nodeId: string
  title: string
  badgeLabel: string
  badgeClass?: string
  description: string
  url?: string
  command?: string
  commandLanguage?: string
  outputBadge?: {
    label: string
    value: string
  }
  instructions?: string[]
  taskId?: string
  checklistLabel?: string
}

export interface LiveModule {
  id: string
  num: number
  title: string
  subtitle: string
  estimatedMinutes: number
  badgeLabel: string
  badgeClass: string
  icon: string
  checkpointTitle: string
  checkpointDescription: string
  steps: LiveStep[]
}

export const LIVE_CLASS_MODULES: LiveModule[] = [
  {
    id: 'sec-module-6',
    num: 6,
    title: '9Router Model Alignment & Routing Matrix',
    subtitle: 'Konfigurasi multi-model fallback, prioritas provider, dan penerbitan Virtual API Key',
    estimatedMinutes: 30,
    badgeLabel: 'Modul 6',
    badgeClass: 'badge-primary',
    icon: '⚡',
    checkpointTitle: 'Checkpoint 6: Virtual API Key, Model & Combos 9Router Siap',
    checkpointDescription: 'Pastikan 9Router telah mengaktifkan model LLM, menyusun konfigurasi Combos fallback, dan menerbitkan virtual API key pada port 20128.',
    steps: [
      {
        nodeId: '6A',
        title: 'Verifikasi Status 9Router Gateway di Port 20128',
        badgeLabel: 'Koneksi Gateway',
        badgeClass: 'badge-info',
        description: 'Pastikan layanan 9Router yang telah diinstal saat pra-training sedang aktif dan siap menerima koneksi.',
        command: 'Get-NetTCPConnection -LocalPort 20128 -State Listen -ErrorAction SilentlyContinue',
        commandLanguage: 'PowerShell',
        outputBadge: {
          label: 'Status Port:',
          value: 'Listen (Port 20128 Aktif)',
        },
        taskId: 'm6-verify-port',
        checklistLabel: 'Port 20128 9Router terverifikasi aktif (Listen) di Windows PowerShell',
      },
      {
        nodeId: '6B',
        title: 'Buka Web Dashboard 9Router & Terbitkan Virtual Key',
        badgeLabel: 'Web 9Router',
        badgeClass: 'badge-info',
        description: 'Buka peramban di alamat http://localhost:20128, navigasi ke tab API Keys, dan buat API Key baru dengan nama "Hermes-Agent-Key".',
        url: 'http://localhost:20128',
        instructions: [
          'Buka peramban web dan akses <code>http://localhost:20128</code> (atau klik tautan tombol di atas).',
          'Klik menu <strong>API Keys</strong> di bilah navigasi kiri dashboard 9Router.',
          'Klik tombol <strong>+ Create New Key</strong> dan beri nama/label <code>Hermes-Agent-Key</code>.',
          'Salin virtual key yang terbit (diawali <code>sk-9r-...</code>) dan simpan di notepad aman untuk konfigurasi agen.',
        ],
        taskId: 'm6-create-key',
        checklistLabel: 'Virtual API Key "Hermes-Agent-Key" berhasil diterbitkan di web dashboard 9Router',
      },
      {
        nodeId: '6C',
        title: 'Konfigurasi Provider & Setup Model LLM di Web 9Router',
        badgeLabel: 'Web 9Router',
        badgeClass: 'badge-info',
        description: 'Daftarkan provider AI dan aktifkan model bahasa (LLM) di dashboard 9Router yang akan menjadi mesin kecerdasan agen Hermes Anda.',
        url: 'http://localhost:20128',
        instructions: [
          'Navigasi ke menu <strong>Providers</strong> atau <strong>Models</strong> di dashboard 9Router.',
          'Pilih provider yang Anda miliki (misal: Google AI / Gemini API, Groq, OpenRouter, atau Ollama lokal).',
          'Masukkan API Key resmi provider Anda lalu simpan kredensial.',
          'Pilih dan aktifkan model target yang disepakati di kelas (misal: <code>gemini-2.5-flash</code>, <code>gemini-1.5-flash</code>, atau <code>llama-3.3-70b-versatile</code>).',
          'Pastikan status model di dashboard menampilkan status aktif / siap melayani kueri.',
        ],
        taskId: 'm6-setup-models',
        checklistLabel: 'Provider LLM dan model aktif berhasil dikonfigurasi di web dashboard 9Router',
      },
      {
        nodeId: '6D',
        title: 'Konfigurasi Combos Matriks Fallback Routing di Web 9Router',
        badgeLabel: 'Web 9Router',
        badgeClass: 'badge-warning',
        description: 'Susun konfigurasi Combos di dashboard 9Router untuk menghubungkan model utama dengan model cadangan otomatis guna mencegah gangguan kuota (rate limit).',
        url: 'http://localhost:20128',
        instructions: [
          'Navigasi ke menu <strong>Combos</strong> di dashboard 9Router.',
          'Klik tombol <strong>+ Create New Combo</strong> untuk membuat jalur perutean cerdas.',
          'Beri nama combo Anda (misal: <code>default-combo</code> atau <code>hermes-combo</code>).',
          'Atur urutan model: tetapkan model utama di urutan teratas, lalu tambahkan model fallback sebagai cadangan jika model utama gagal/limit.',
          'Simpan konfigurasi combo dan pastikan statusnya siap digunakan sebagai endpoint model.',
        ],
        taskId: 'm6-setup-combos',
        checklistLabel: 'Matriks Routing Combos berhasil dibuat di web dashboard 9Router',
      },
      {
        nodeId: '6E',
        title: 'Uji Endpoint Chat Completion 9Router via cURL',
        badgeLabel: 'Uji Endpoint',
        badgeClass: 'badge-success',
        description: 'Lakukan pengujian HTTP POST sederhana untuk memastikan model atau combo merespons permintaan chat completion. Ganti [VIRTUAL_API_KEY] dengan key Anda dan [NAMA_MODEL] dengan nama model atau combo yang terdaftar di 9Router.',
        command: 'curl.exe -s -X POST "http://localhost:20128/v1/chat/completions" -H "Content-Type: application/json" -H "Authorization: Bearer [VIRTUAL_API_KEY]" -d "{\\"model\\":\\"[NAMA_MODEL]\\",\\"messages\\":[{\\"role\\":\\"user\\",\\"content\\":\\"Ping 9Router\\"}]}"',
        commandLanguage: 'PowerShell',
        instructions: [
          'Ganti <code>[VIRTUAL_API_KEY]</code> dengan Virtual API Key yang Anda terbitkan pada Langkah 6B (contoh: <code>sk-9r-...</code>).',
          'Ganti <code>[NAMA_MODEL]</code> dengan nama model atau nama combo yang telah dipetakan di dashboard 9Router Anda (contoh: <code>gemini-2.5-flash</code>, <code>hermes-combo</code>, dll).',
          'Pastikan service 9Router aktif di terminal latar belakang pada port 20128.',
        ],
        taskId: 'm6-test-curl',
        checklistLabel: 'Uji chat completion 9Router berhasil mengembalikan respons JSON di Windows PowerShell',
      },
    ],
  },
  {
    id: 'sec-module-7',
    num: 7,
    title: 'Hermes Agent Windows Native & Setup Wizard',
    subtitle: 'Instalasi resmi Windows via PowerShell dan setup interaktif gateway 9Router',
    estimatedMinutes: 25,
    badgeLabel: 'Modul 7',
    badgeClass: 'badge-primary',
    icon: '🤖',
    checkpointTitle: 'Checkpoint 7: Hermes Agent Terpasang & Setup Selesai',
    checkpointDescription: 'Hermes Agent terpasang via installer resmi Nous Research dan setup wizard berhasil menghubungkan agen ke gateway 9Router.',
    steps: [
      {
        nodeId: '7A',
        title: 'Instalasi Resmi Hermes Agent di Windows',
        badgeLabel: 'PowerShell Installer',
        badgeClass: 'badge-primary',
        description: 'Jalankan installer resmi Nous Research satu baris di PowerShell untuk memasang runtime, dependensi, dan CLI Hermes ke sistem Windows.',
        command: 'iex (irm https://hermes-agent.nousresearch.com/install.ps1)',
        commandLanguage: 'PowerShell',
        taskId: 'm7-install-cli',
        checklistLabel: 'Installer resmi Hermes Agent (install.ps1) berhasil dieksekusi di PowerShell',
      },
      {
        nodeId: '7B',
        title: 'Setup Wizard Otomatis (atau Jalankan hermes setup)',
        badgeLabel: 'Setup Interaktif',
        badgeClass: 'badge-success',
        description: 'Setelah instalasi selesai, installer otomatis memulai wizard (Starting setup wizard...). Hubungkan Hermes ke endpoint 9Router lokal Anda (http://localhost:20128/v1), masukkan [VIRTUAL_API_KEY] Anda, dan pilih [NAMA_MODEL] default.',
        command: 'hermes setup',
        commandLanguage: 'PowerShell',
        instructions: [
          'Installer otomatis memicu wizard konfigurasi di akhir proses unduhan file.',
          'Jika terminal tertutup atau perlu konfigurasi ulang, buka PowerShell baru lalu jalankan "hermes setup".',
          'Pilih Custom Endpoint: <code>http://localhost:20128/v1</code>, masukkan Virtual API Key Anda (<code>[VIRTUAL_API_KEY]</code>), dan tentukan model default (<code>[NAMA_MODEL]</code>).',
        ],
        outputBadge: {
          label: 'Setup Status:',
          value: 'CONFIGURATION SAVED [OK]',
        },
        taskId: 'm7-restart-shell',
        checklistLabel: 'Setup wizard Hermes selesai menghubungkan agen ke gateway 9Router',
      },
      {
        nodeId: '7C',
        title: 'Verifikasi Kesiapan Runtime via hermes doctor',
        badgeLabel: 'Verifikasi',
        badgeClass: 'badge-info',
        description: 'Jalankan pemeriksaan diagnostik resmi hermes doctor untuk memverifikasi lingkungan instalasi, dependensi, dan kesiapan sistem sebelum menghubungkan modul berikutnya.',
        command: 'hermes doctor',
        commandLanguage: 'PowerShell',
        outputBadge: {
          label: 'Doctor Status:',
          value: 'ALL CHECKS PASSED [OK]',
        },
        taskId: 'm7-run-doctor',
        checklistLabel: 'Perintah hermes doctor dijalankan dan status kesiapan agen lolos verifikasi',
      },
    ],
  },
  {
    id: 'sec-module-8',
    num: 8,
    title: 'Hermes Configuration Wizard & Agent Testing',
    subtitle: 'Konfigurasi provider endpoint 9Router, sistem prompt agent, dan first chat test',
    estimatedMinutes: 25,
    badgeLabel: 'Modul 8',
    badgeClass: 'badge-primary',
    icon: '⚙️',
    checkpointTitle: 'Checkpoint 8: Hermes Chat Test Berhasil',
    checkpointDescription: 'Agen Hermes berhasil merespons pesan pertama melalui terminal dan mengenali instruksi sistem.',
    steps: [
      {
        nodeId: '8A',
        title: 'Jalankan Konfigurasi Wizard Hermes (hermes setup)',
        badgeLabel: 'Setup Wizard',
        badgeClass: 'badge-primary',
        description: 'Jalankan wizard konfigurasi interaktif untuk menghubungkan Hermes ke 9Router gateway lokal.',
        command: 'hermes setup',
        commandLanguage: 'PowerShell',
        instructions: [
          'Jalankan perintah <code>hermes setup</code> di jendela PowerShell.',
          'Pilih opsi Custom Endpoint / OpenAI-Compatible.',
          'Saat diminta Base URL, masukkan: <code>http://localhost:20128/v1</code>.',
          'Saat diminta API Key, tempelkan Virtual Key 9Router dari Modul 6 (<code>[VIRTUAL_API_KEY]</code>).',
          'Pilih model default: masukkan nama model atau nama combo yang Anda petakan di 9Router (<code>[NAMA_MODEL]</code>, misal: <code>gemini-2.5-flash</code>).',
          'Simpan konfigurasi ke file $HOME/.hermes/config.json.',
        ],
        taskId: 'm8-run-wizard',
        checklistLabel: 'Wizard konfigurasi hermes setup selesai dan tersimpan di .hermes/config.json',
      },
      {
        nodeId: '8B',
        title: 'Uji Percakapan Pertama dengan Agen via Terminal',
        badgeLabel: 'Live Chat',
        badgeClass: 'badge-success',
        description: 'Kirim prompt pertama untuk memverifikasi agen dapat memproses bahasa alami dan mengembalikan jawaban.',
        command: 'hermes chat "Halo Hermes, perkenalkan dirimu sebagai asisten ASN terpercaya."',
        commandLanguage: 'PowerShell',
        taskId: 'm8-test-chat',
        checklistLabel: 'Uji chat terminal berhasil menerima respons perkenalan dari agen',
      },
    ],
  },
  {
    id: 'sec-module-9',
    num: 9,
    title: 'Telegram Gateway Bridge & Security Allowlist',
    subtitle: 'Aktivasi Telegram bot gateway, chat ID filtering, dan DM authentication',
    estimatedMinutes: 35,
    badgeLabel: 'Modul 9',
    badgeClass: 'badge-primary',
    icon: '💬',
    checkpointTitle: 'Checkpoint 9: Telegram DM Bot Responsif',
    checkpointDescription: 'Bot Telegram merespons perintah pesan langsung (DM) hanya dari akun Telegram peserta yang terdaftar.',
    steps: [
      {
        nodeId: '9A',
        title: 'Konfigurasi Token Bot & Allowlist via hermes gateway setup',
        badgeLabel: 'Keamanan Telegram',
        badgeClass: 'badge-warning',
        description: 'Jalankan wizard gateway resmi Hermes untuk menautkan token bot dari Modul 3 dan membatasi akses hanya untuk Telegram User ID numerik pribadi Anda (TELEGRAM_ALLOWED_USERS).',
        command: 'hermes gateway setup',
        commandLanguage: 'PowerShell',
        instructions: [
          'Jalankan perintah <code>hermes gateway setup</code> di terminal PowerShell.',
          'Pilih platform <strong>Telegram</strong>.',
          'Masukkan Bot Token rahasia yang Anda peroleh dari @BotFather (dari Modul 3).',
          'Masukkan User ID numerik Anda dari @userinfobot (contoh: <code>123456789</code>) ke daftar allowed users.',
          'Gunakan mode Long Polling lokal bawaan (jangan gunakan webhook publik).',
        ],
        taskId: 'm9-setup-bridge',
        checklistLabel: 'Wizard hermes gateway setup terkonfigurasi dengan token bot dan allowlist numerik',
      },
      {
        nodeId: '9B',
        title: 'Jalankan Service Gateway Telegram (Polling Mode)',
        badgeLabel: 'Background Service',
        badgeClass: 'badge-primary',
        description: 'Nyalakan service gateway Telegram dalam mode Long Polling lokal untuk mendengarkan pesan masuk.',
        command: 'hermes gateway start',
        commandLanguage: 'PowerShell',
        instructions: [
          'Jalankan <code>hermes gateway start</code> untuk menyalakan daemon gateway.',
          'Jalankan <code>hermes gateway status</code> untuk memverifikasi status koneksi aktif.',
          'Jika ingin menghentikan service, gunakan perintah <code>hermes gateway stop</code>.',
        ],
        outputBadge: {
          label: 'Service State:',
          value: 'Telegram Bot Gateway Listening (Long Polling)...',
        },
        taskId: 'm9-start-gateway',
        checklistLabel: 'Gateway Telegram aktif mendengarkan pesan (Long Polling Mode)',
      },
      {
        nodeId: '9C',
        title: 'Kirim Pesan Uji dari Ponsel/Desktop Telegram',
        badgeLabel: 'Verifikasi DM',
        badgeClass: 'badge-success',
        description: 'Buka aplikasi Telegram Anda, cari bot yang telah dibuat, lalu kirimkan pesan Direct Message pertama.',
        instructions: [
          'Buka bot di Telegram (t.me/NamaBotAnda).',
          'Kirimkan pesan uji: <code>Halo! Apakah kamu sudah terhubung ke Hermes?</code> (atau <code>/status</code>).',
          'Pastikan bot membalas secara cerdas melalui model AI yang terhubung ke 9Router.',
          'Jika bot membalas "unauthorized", periksa kecocokan User ID numerik allowlist dengan hasil @userinfobot.',
        ],
        taskId: 'm9-verify-dm',
        checklistLabel: 'Bot Telegram berhasil membalas pesan DM langsung dari akun yang diizinkan',
      },
    ],
  },
  {
    id: 'sec-module-10',
    num: 10,
    title: 'Google Calendar OAuth 2.0 Desktop Integration',
    subtitle: 'Consent screen, credentials.json client ID, dan pertukaran token OAuth',
    estimatedMinutes: 40,
    badgeLabel: 'Modul 10',
    badgeClass: 'badge-primary',
    icon: '📅',
    checkpointTitle: 'Checkpoint 10: OAuth 2.0 Token Terhubung',
    checkpointDescription: 'Token akses Google Calendar tersimpan secara lokal dan agen dapat membaca daftar kalender pengguna.',
    steps: [
      {
        nodeId: '10A',
        title: 'Tempatkan File credentials.json ke Workspace',
        badgeLabel: 'OAuth Client',
        badgeClass: 'badge-info',
        description: 'Salin file credentials.json yang telah diunduh dari Google Cloud Console ke direktori workspace Hermes.',
        command: 'Copy-Item "$HOME/Downloads/client_secret_*.json" "$HOME/hermes-workspace/credentials.json" -Force',
        commandLanguage: 'PowerShell',
        taskId: 'm10-copy-credentials',
        checklistLabel: 'File credentials.json tersimpan rapi di workspace agen',
      },
      {
        nodeId: '10B',
        title: 'Otentikasi Akun Google via Browser Flow',
        badgeLabel: 'Browser OAuth',
        badgeClass: 'badge-primary',
        description: 'Jalankan otentikasi interaktif untuk memberikan izin akses membaca dan membuat agenda di Google Calendar.',
        command: 'hermes auth google-calendar --credentials "$HOME/hermes-workspace/credentials.json"',
        commandLanguage: 'PowerShell',
        instructions: [
          'Browser akan terbuka otomatis menampilkan halaman login Google.',
          'Pilih akun Google Anda dan setujui izin akses Google Calendar.',
          'Kembali ke terminal setelah melihat pesan "Authentication Successful".',
        ],
        taskId: 'm10-auth-google',
        checklistLabel: 'Proses otentikasi Google Calendar berhasil dan token tersimpan',
      },
      {
        nodeId: '10C',
        title: 'Uji Pembacaan Jadwal Kalender oleh Agen',
        badgeLabel: 'Uji Tool Kalender',
        badgeClass: 'badge-success',
        description: 'Perintahkan agen untuk mengambil daftar agenda kalender hari ini untuk membuktikan integrasi API aktif.',
        command: 'hermes run-tool calendar.list_events --timeMin "today"',
        commandLanguage: 'PowerShell',
        taskId: 'm10-test-calendar',
        checklistLabel: 'Agen berhasil membaca daftar agenda kalender dari akun Google Anda',
      },
    ],
  },
  {
    id: 'sec-module-11',
    num: 11,
    title: 'Operasional Agentic End-to-End & Uji Perintah',
    subtitle: 'Perintah natural language untuk booking kalender, query jadwal, dan failover sequence',
    estimatedMinutes: 45,
    badgeLabel: 'Modul 11',
    badgeClass: 'badge-primary',
    icon: '🚀',
    checkpointTitle: 'Checkpoint 11: End-to-End Kalender Scheduling Valid',
    checkpointDescription: 'Peserta mengirim pesan natural language via Telegram dan agen otomatis membuat jadwal di Google Calendar.',
    steps: [
      {
        nodeId: '11A',
        title: 'Uji Skenario 1: Tanya Jadwal Lewat Telegram',
        badgeLabel: 'Skenario 1',
        badgeClass: 'badge-primary',
        description: 'Kirim pesan percakapan di Telegram: "Apakah saya ada agenda kosong besok jam 10 pagi?". Agen akan membaca Google Calendar dan merespons ketersediaan waktu Anda.',
        instructions: [
          'Ketik di chat Telegram: "Cek jadwal saya untuk besok siang."',
          'Amati terminal Hermes: agen menjalankan tool calendar.list_events.',
          'Telegram menerima jawaban ringkasan jadwal secara rapi dan akurat.',
        ],
        taskId: 'm11-query-schedule',
        checklistLabel: 'Agen berhasil menjawab pertanyaan jadwal via Telegram dengan data real-time',
      },
      {
        nodeId: '11B',
        title: 'Uji Skenario 2: Booking Agenda Otomatis via Chat',
        badgeLabel: 'Skenario 2',
        badgeClass: 'badge-success',
        description: 'Kirim perintah pembuatan agenda: "Jadwalkan Rapat Koordinasi Evaluasi SPBE besok jam 14:00 selama 1 jam bersama Tim IT".',
        instructions: [
          'Kirim pesan booking di Telegram.',
          'Agen meminta konfirmasi detail acara sebelum mengeksekusi.',
          'Ketik "Ya, setujui".',
          'Buka Google Calendar di browser dan lihat acara baru yang otomatis tercipta.',
        ],
        taskId: 'm11-book-event',
        checklistLabel: 'Acara kalender baru berhasil terbit di Google Calendar hasil perintah Telegram',
      },
      {
        nodeId: '11C',
        title: 'Uji Skenario 3: Failover & Safe Handling',
        badgeLabel: 'Resiliensi',
        badgeClass: 'badge-warning',
        description: 'Uji ketahanan agen saat terjadi konflik waktu atau input tidak jelas. Agen harus mampu mengajukan pertanyaan klarifikasi secara sopan.',
        taskId: 'm11-verify-failover',
        checklistLabel: 'Agen menangani konflik jadwal dan memberikan saran alternatif waktu',
      },
    ],
  },
]