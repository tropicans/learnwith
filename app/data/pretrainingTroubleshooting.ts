/**
 * Strongly-Typed Troubleshooting Dataset & Categories for Agentic AI Pre-Training
 * Requirements: PRE-TOOL-01, PRE-TOOL-02
 */

export type TroubleshootingCategory =
  | 'all'
  | 'node'
  | 'router'
  | 'telegram'
  | 'hermes'
  | 'powershell'

export type TroubleSeverity = 'neutral' | 'warning' | 'danger' | 'primary'

export interface TroubleshootingCodeBlock {
  language: string
  code: string
  label?: string
  ariaLabel?: string
  toastMessage?: string
}

export interface TroubleshootingItem {
  id: string
  title: string
  category: TroubleshootingCategory
  categoryLabel: string
  icon: string
  severity: TroubleSeverity
  cause: string
  steps: string[]
  codeBlock?: TroubleshootingCodeBlock
  keywords?: string[]
}

export interface TroubleshootingCategoryOption {
  id: TroubleshootingCategory
  label: string
}

export const TROUBLESHOOTING_CATEGORIES: TroubleshootingCategoryOption[] = [
  { id: 'all', label: 'Semua Kendala (15)' },
  { id: 'node', label: 'Node.js & npm' },
  { id: 'router', label: '9Router & Port' },
  { id: 'telegram', label: 'Telegram Bot' },
  { id: 'hermes', label: 'Hermes Agent' },
  { id: 'powershell', label: 'PowerShell Security' },
]

export const PRETRAINING_TROUBLESHOOTING_ITEMS: TroubleshootingItem[] = [
  // 1. Node.js Not Recognized (Node)
  {
    id: 'trbl-node-not-recognized',
    title: 'Pesan: node is not recognized / tidak dikenali',
    category: 'node',
    categoryLabel: 'Node.js & npm',
    icon: '📟',
    severity: 'neutral',
    cause:
      'PowerShell belum menemukan program Node.js karena belum terpasang atau belum terbaca di PATH sistem.',
    steps: [
      'Tutup seluruh jendela PowerShell / terminal yang sedang aktif.',
      'Buka kembali Modul 1 dan unduh installer Node.js versi LTS dari https://nodejs.org.',
      'Pastikan mencentang opsi "Add to PATH" saat proses instalasi wizard.',
      'Buka PowerShell baru dan jalankan node -v untuk memverifikasi instalasi.',
    ],
    codeBlock: {
      language: 'powershell',
      code: 'node -v\nnpm -v',
      label: 'powershell',
      ariaLabel: 'Salin perintah verifikasi Node dan npm',
      toastMessage: 'Perintah verifikasi Node disalin! 📋',
    },
    keywords: ['node', 'npm', 'not recognized', 'path', 'install', 'lts'],
  },

  // 2. npm Not Recognized (Node)
  {
    id: 'trbl-npm-not-recognized',
    title: 'Pesan: npm tidak dikenali / The term \'npm\' is not recognized',
    category: 'node',
    categoryLabel: 'Node.js & npm',
    icon: '🔄',
    severity: 'neutral',
    cause:
      'Node.js baru saja diinstal namun variabel lingkungan PATH pada jendela terminal PowerShell yang aktif belum diperbarui.',
    steps: [
      'Tutup seluruh jendela PowerShell / Windows Terminal (bukan hanya satu tab).',
      'Buka PowerShell baru dan uji kembali perintah npm --version.',
      'Jika masih belum dikenali, muat ulang variabel PATH secara langsung di PowerShell dengan menyalin perintah berikut:',
    ],
    codeBlock: {
      language: 'powershell',
      code: "$env:Path = [Environment]::GetEnvironmentVariable('Path','Machine') + ';' + [Environment]::GetEnvironmentVariable('Path','User')",
      label: 'powershell',
      ariaLabel: 'Salin perintah muat ulang PATH PowerShell',
      toastMessage: 'Perintah muat ulang PATH disalin! 📋',
    },
    keywords: ['npm', 'environment', 'path', 'reload', 'powershell'],
  },

  // 3. PowerShell Execution Policies (PowerShell) - Satisfies Execution_Policies requirement
  {
    id: 'trbl-ps-execution-policies',
    title: 'Pesan: running scripts is disabled on this system (Execution_Policies)',
    category: 'powershell',
    categoryLabel: 'PowerShell Security',
    icon: '🛡️',
    severity: 'warning',
    cause:
      'Kebijakan keamanan ExecutionPolicy default pada Windows membatasi pengeksekusian skrip PowerShell lokal (.ps1).',
    steps: [
      'Solusi paling aman tanpa mengubah sistem permanen: gunakan Command Prompt (cmd.exe) bawaan Windows untuk menjalankan perintah npm.',
      'Atau ubah ExecutionPolicy hanya untuk sesi terminal yang sedang aktif dengan perintah bypass berikut:',
    ],
    codeBlock: {
      language: 'powershell',
      code: 'Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass',
      label: 'powershell',
      ariaLabel: 'Salin perintah ExecutionPolicy Bypass',
      toastMessage: 'Perintah ExecutionPolicy Bypass disalin! 📋',
    },
    keywords: [
      'execution_policies',
      'executionpolicy',
      'scripts',
      'disabled',
      'bypass',
      'powershell',
    ],
  },

  // 4. PowerShell EPERM Access Denied (PowerShell)
  {
    id: 'trbl-ps-eperm',
    title: 'Muncul pesan Access denied, Permission denied, atau EPERM',
    category: 'powershell',
    categoryLabel: 'Hak Akses Windows',
    icon: '🛑',
    severity: 'danger',
    cause:
      'Pengguna biasa tidak memiliki hak izin menulis ke folder modul global npm Windows (C:\\Program Files\\nodejs\\node_modules atau AppData).',
    steps: [
      'Tutup seluruh jendela PowerShell aktif.',
      'Klik tombol Start / Windows, ketik PowerShell.',
      'Klik kanan pada ikon Windows PowerShell lalu pilih "Run as administrator".',
      'Jalankan perintah instalasi global 9Router.',
      'Setelah selesai, tutup jendela administrator tersebut demi keamanan.',
    ],
    codeBlock: {
      language: 'powershell',
      code: 'npm install -g 9router',
      label: 'powershell',
      ariaLabel: 'Salin perintah instalasi global 9Router administrator',
      toastMessage: 'Perintah instalasi 9Router disalin! 📋',
    },
    keywords: ['eperm', 'access denied', 'permission', 'administrator', 'rights'],
  },

  // 5. 9Router Port Conflict (Router) - Satisfies EADDRINUSE requirement
  {
    id: 'trbl-router-eaddrinuse',
    title: 'Pesan: EADDRINUSE: address already in use :::20128',
    category: 'router',
    categoryLabel: '9Router & Port',
    icon: '⚡',
    severity: 'danger',
    cause:
      'Port lokal 20128 sedang digunakan oleh proses 9Router lain yang masih berjalan di latar belakang atau aplikasi lain.',
    steps: [
      'Periksa apakah ada terminal lain atau aplikasi latar belakang yang sedang menjalankan 9Router.',
      'Hentikan proses yang menduduki port 20128 di PowerShell dengan perintah berikut:',
      'Setelah proses dihentikan, jalankan kembali perintah 9router di terminal baru.',
    ],
    codeBlock: {
      language: 'powershell',
      code: 'Stop-Process -Id (Get-NetTCPConnection -LocalPort 20128).OwningProcess -Force',
      label: 'powershell',
      ariaLabel: 'Salin perintah Stop-Process port 20128',
      toastMessage: 'Perintah penghentian port 20128 disalin! 📋',
    },
    keywords: ['eaddrinuse', 'port', '20128', 'address already in use', 'conflict'],
  },

  // 6. 9Router Not Recognized (Router)
  {
    id: 'trbl-router-not-recognized',
    title: 'Pesan: 9router tidak dikenali / executable belum termuat',
    category: 'router',
    categoryLabel: '9Router & Port',
    icon: '🚀',
    severity: 'neutral',
    cause:
      'File eksekusi global npm belum terdaftar di sesi terminal aktif atau instalasi global npm belum tuntas.',
    steps: [
      'Tutup jendela PowerShell dan buka jendela baru.',
      'Jika masih belum dikenali, Anda dapat langsung menjalankan 9Router tanpa instalasi global menggunakan npx:',
    ],
    codeBlock: {
      language: 'powershell',
      code: 'npx 9router',
      label: 'powershell',
      ariaLabel: 'Salin perintah npx 9router alternatif',
      toastMessage: 'Perintah npx 9router disalin! 📋',
    },
    keywords: ['9router', 'npx', 'not recognized', 'executable', 'global'],
  },

  // 7. 9Router Dashboard Unreachable (Router)
  {
    id: 'trbl-router-dashboard-unreachable',
    title: 'Browser tidak dapat menampilkan dashboard (localhost:20128)',
    category: 'router',
    categoryLabel: '9Router & Port',
    icon: '🌐',
    severity: 'warning',
    cause:
      'Terminal 9Router tidak sengaja tertutup, service belum siap (warm-up), atau browser salah menggunakan HTTPS://.',
    steps: [
      'Pastikan jendela terminal tempat Anda menjalankan 9router tetap terbuka dan log berjalan.',
      'Tunggu 15–30 detik agar server lokal siap melayani permintaan.',
      'Gunakan alamat http:// biasa, BUKAN https://.',
      'Jika localhost tidak merespons, coba IP loopback: http://127.0.0.1:20128.',
    ],
    codeBlock: {
      language: 'powershell',
      code: 'Start-Process http://localhost:20128',
      label: 'powershell',
      ariaLabel: 'Salin perintah buka dashboard 9Router',
      toastMessage: 'Perintah buka browser disalin! 📋',
    },
    keywords: ['dashboard', 'localhost', '20128', 'unreachable', 'http', 'https'],
  },

  // 8. 9Router 401 Unauthorized (Router) - Satisfies 401 Unauthorized requirement
  {
    id: 'trbl-router-401-unauthorized',
    title: 'Pesan: 401 Unauthorized / Invalid API Key pada 9Router',
    category: 'router',
    categoryLabel: '9Router & Port',
    icon: '🔑',
    severity: 'danger',
    cause:
      'API Key yang dimasukkan pada klien atau Hermes Agent salah, kedaluwarsa, atau belum terkonfigurasi di dashboard 9Router.',
    steps: [
      'Buka dashboard lokal 9Router di browser pada http://localhost:20128.',
      'Buka tab "Models & API Keys" lalu periksa apakah Google Gemini API Key Anda sudah dimasukkan dengan benar.',
      'Jika token rusak, buat API Key baru di Google AI Studio (aistudio.google.com) lalu perbarui di dashboard.',
      'Pastikan tidak ada spasi di awal atau akhir saat menempelkan kunci API.',
    ],
    codeBlock: {
      language: 'bash',
      code: 'curl http://localhost:20128/v1/models',
      label: 'bash',
      ariaLabel: 'Salin perintah uji endpoint models 9Router',
      toastMessage: 'Perintah uji endpoint disalin! 📋',
    },
    keywords: [
      '401',
      'unauthorized',
      'invalid api key',
      'api key',
      'key',
      'gemini',
    ],
  },

  // 9. 9Router Install Stuck / Slow (Router)
  {
    id: 'trbl-router-install-stuck',
    title: 'Proses instalasi npm install -g 9router terlihat macet / lambat',
    category: 'router',
    categoryLabel: 'Koneksi & npm',
    icon: '⏳',
    severity: 'neutral',
    cause:
      'Pengunduhan paket npm memerlukan waktu bergantung pada kestabilan koneksi internet dan registry npm.',
    steps: [
      'Tunggu hingga 5–10 menit tanpa menutup jendela terminal PowerShell.',
      'Uji konektivitas ke registry npm dengan menjalankan perintah npm ping di terminal terpisah:',
      'Jika registry lambat, gunakan koneksi hotspot cadangan atau coba kembali beberapa saat lagi.',
    ],
    codeBlock: {
      language: 'powershell',
      code: 'npm ping',
      label: 'powershell',
      ariaLabel: 'Salin perintah uji konektivitas npm ping',
      toastMessage: 'Perintah npm ping disalin! 📋',
    },
    keywords: ['stuck', 'slow', 'install', 'timeout', 'ping', 'connection'],
  },

  // 10. Telegram 409 Conflict (Telegram) - Satisfies Telegram 409 Conflict requirement
  {
    id: 'trbl-tg-409-conflict',
    title: 'Pesan: Telegram 409 Conflict: terminated by other getUpdates request',
    category: 'telegram',
    categoryLabel: 'Telegram Bot',
    icon: '💥',
    severity: 'danger',
    cause:
      'Dua program atau proses gateway berbeda sedang mencoba mengambil pembaruan (polling getUpdates) dari bot Telegram yang sama pada saat bersamaan.',
    steps: [
      'Pastikan tidak ada terminal lain yang sedang menjalankan hermes gateway atau script bot polling.',
      'Hentikan seluruh instance gateway yang berjalan dengan perintah berikut:',
      'Jika masih berulang, buat bot baru di @BotFather khusus untuk pre-training ini.',
    ],
    codeBlock: {
      language: 'bash',
      code: 'hermes gateway stop',
      label: 'bash',
      ariaLabel: 'Salin perintah penghentian Hermes Gateway',
      toastMessage: 'Perintah hermes gateway stop disalin! 📋',
    },
    keywords: [
      'telegram 409 conflict',
      '409',
      'conflict',
      'getupdates',
      'terminated',
      'polling',
    ],
  },

  // 11. Telegram Username Taken (Telegram)
  {
    id: 'trbl-tg-username-taken',
    title: 'Username bot sudah digunakan orang lain (already taken)',
    category: 'telegram',
    categoryLabel: 'Telegram Bot',
    icon: '🤖',
    severity: 'neutral',
    cause:
      'Username bot di Telegram bersifat global dan unik di seluruh dunia sehingga nama umum sudah terdaftar.',
    steps: [
      'Tambahkan inisial nama, tahun, atau angka acak unik di username bot Anda.',
      'Contoh penamaan yang baik: asisten_budi_2026_bot atau budi_ai_helper_bot.',
      'Pastikan nama bot WAJIB berakhiran "bot" atau "_bot" (aturan ketat dari Telegram).',
    ],
    keywords: ['username', 'taken', 'botfather', 'already taken', 'telegram'],
  },

  // 12. Telegram Bot No Reply (Telegram)
  {
    id: 'trbl-tg-bot-no-reply',
    title: 'Bot Telegram tidak membalas saat dikirimi pesan /start',
    category: 'telegram',
    categoryLabel: 'Informasi Normal',
    icon: '💬',
    severity: 'primary',
    cause:
      'Bot Telegram pada tahap pre-training baru berupa akun wadah komunikasi kosong; otak AI (Hermes Agent) baru akan dihubungkan saat workshop berlangsung.',
    steps: [
      'Kondisi ini sepenuhnya normal dan tidak memerlukan perbaikan teknis pada tahap persiapan.',
      'Pastikan bot token tersimpan aman di catatan pribadi Anda dan tidak dibagikan ke publik.',
      'Lanjutkan pengisian Checkpoint 2 dengan memasukkan Username Bot Anda.',
    ],
    keywords: ['no reply', 'start', 'tidak membalas', 'normal', 'hermes'],
  },

  // 13. Telegram Bot Token Leaked (Telegram)
  {
    id: 'trbl-tg-token-leaked',
    title: 'Bot token tidak sengaja terkirim ke grup / publik',
    category: 'telegram',
    categoryLabel: 'Tindakan Cepat & Keamanan',
    icon: '🚨',
    severity: 'danger',
    cause:
      'Token bot yang tersebar ke publik berisiko disalahgunakan oleh pihak lain untuk mengirim pesan atas nama bot Anda.',
    steps: [
      'Segera buka obrolan dengan @BotFather di aplikasi Telegram.',
      'Kirim perintah /revoke dan pilih bot yang tokennya sempat terkirim.',
      'BotFather akan membatalkan token lama dan memberikan bot token baru.',
      'Ganti token lama dengan token baru di catatan Anda.',
    ],
    codeBlock: {
      language: 'text',
      code: '/revoke',
      label: 'telegram',
      ariaLabel: 'Salin perintah /revoke BotFather',
      toastMessage: 'Perintah /revoke disalin! 📋',
    },
    keywords: ['leaked', 'token', 'revoke', 'security', 'botfather', 'bocor'],
  },

  // 14. Hermes Command Not Recognized (Hermes)
  {
    id: 'trbl-hermes-not-recognized',
    title: 'Pesan: \'hermes\' tidak dikenali / command not found',
    category: 'hermes',
    categoryLabel: 'Hermes Agent',
    icon: '🦅',
    severity: 'neutral',
    cause:
      'Direktori binary Hermes (~/.hermes/bin atau AppData\\Local\\Programs\\hermes) belum terdaftar dalam PATH sistem operasi.',
    steps: [
      'Jalankan utility diagnosis mandiri hermes doctor untuk memeriksa status instalasi.',
      'Jika instalasi belum selesai, ikuti kembali panduan instalasi CLI di Modul 4.',
      'Tutup dan buka kembali PowerShell agar PATH sistem termuat ulang.',
    ],
    codeBlock: {
      language: 'bash',
      code: 'hermes doctor',
      label: 'bash',
      ariaLabel: 'Salin perintah hermes doctor',
      toastMessage: 'Perintah hermes doctor disalin! 📋',
    },
    keywords: ['hermes', 'doctor', 'not recognized', 'command not found', 'cli'],
  },

  // 15. Hermes Bot Replies Unauthorized (Hermes)
  {
    id: 'trbl-hermes-unauthorized',
    title: 'Pesan: Bot membalas unauthorized / Akses ditolak di chat Telegram',
    category: 'hermes',
    categoryLabel: 'Hermes Agent',
    icon: '🔒',
    severity: 'warning',
    cause:
      'ID pengguna Telegram Anda belum dimasukkan ke dalam daftar putih (whitelist) TELEGRAM_ALLOWED_USERS pada konfigurasi Hermes.',
    steps: [
      'Buka bot @userinfobot di Telegram untuk melihat User ID numerik akun Anda.',
      'Jalankan konfigurasi gateway Hermes di terminal dengan menyalin perintah berikut:',
      'Masukkan Telegram User ID Anda pada bagian TELEGRAM_ALLOWED_USERS.',
      'Mulai ulang gateway Hermes dan kirim pesan kembali ke bot.',
    ],
    codeBlock: {
      language: 'bash',
      code: 'hermes gateway setup',
      label: 'bash',
      ariaLabel: 'Salin perintah hermes gateway setup',
      toastMessage: 'Perintah hermes gateway setup disalin! 📋',
    },
    keywords: [
      'unauthorized',
      'akses ditolak',
      'user id',
      'whitelist',
      'allowed users',
      'hermes',
    ],
  },
]
