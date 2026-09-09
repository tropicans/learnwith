/**
 * Strongly-Typed Dataset for Agentic AI Pre-Training Modules 1–5
 * Requirements: PRE-MOD-01, PRE-MOD-02, PRE-MOD-03, PRE-MOD-04, PRE-MOD-05, PRE-MOD-06
 *
 * Extracted with 100% fidelity from index.html (lines 1099–1960).
 */

export type AlertType = 'info' | 'warning' | 'danger' | 'success'

export interface StepAlert {
  type: AlertType
  icon: string
  title: string
  content?: string
  bullets?: string[]
  note?: string
}

export interface StepLink {
  url: string
  label: string
  isExternal: boolean
  note?: string
}

export interface ComparisonGrid {
  box1: {
    title: string
    value: string
    desc: string
  }
  box2: {
    title: string
    value: string
    desc: string
  }
}

export interface ModuleStep {
  nodeId: string // e.g. "A", "B", "1", "2"
  title: string
  badgeLabel: string
  badgeClass?: string
  description: string
  command?: string
  commandLanguage?: string
  outputBadge?: {
    label: string
    value: string
  }
  instructions?: string[]
  externalLink?: StepLink
  alerts?: StepAlert[]
  comparisonGrid?: ComparisonGrid
  taskId?: string // data-task-id e.g. "m1-check-node"
  checklistLabel?: string
}

export interface CheckpointPreview {
  checkpointNum: number
  title: string
  badge: string
  description: string
  requirements: string[]
  note?: string
}

export interface ArchFlowNode {
  id: string
  icon: string
  title: string
  desc: string
}

export interface ArchFlowArrow {
  label: string
}

export interface PretrainingModule {
  id: string // e.g. "sec-module-1"
  num: number // 1 to 5
  title: string
  subtitle: string
  icon: string
  badgeLabel: string // e.g. "3 Langkah", "Wajib Dibaca"
  badgeClass: string
  steps: ModuleStep[]
  checkpoint?: CheckpointPreview
  hasArchFlow?: boolean // specifically for Module 5
}

export const PRETRAINING_MODULES: PretrainingModule[] = [
  // ==========================================
  // MODUL 1: PEMERIKSAAN & INSTALASI NODE.JS
  // ==========================================
  {
    id: 'sec-module-1',
    num: 1,
    title: 'Modul 1: Pemeriksaan & Instalasi Node.js',
    subtitle: 'Aplikasi pendukung wajib agar 9Router dapat berjalan di komputer Anda',
    icon: '🟢',
    badgeLabel: '3 Langkah',
    badgeClass: 'badge-primary',
    steps: [
      {
        nodeId: 'A',
        title: 'Periksa Apakah Node.js Sudah Terpasang',
        badgeLabel: 'PowerShell',
        badgeClass: 'badge-neutral',
        description:
          'Buka jendela PowerShell, lalu jalankan perintah berikut untuk memeriksa apakah Node.js sudah tersedia:',
        command: 'node --version',
        commandLanguage: 'PowerShell',
        outputBadge: {
          label: '✓ Hasil yang benar:',
          value: 'v24.x.x atau v22.x.x',
        },
        alerts: [
          {
            type: 'info',
            icon: '💡',
            title: 'Penjelasan Versi:',
            content:
              'Jika muncul nomor versi LTS seperti v24... atau v22..., langsung lanjutkan ke Langkah C (Periksa npm). Jika muncul pesan node is not recognized, hal itu wajar jika laptop Anda belum pernah diinstal Node.js; lanjutkan ke Langkah B di bawah ini.',
          },
        ],
        taskId: 'm1-check-node',
        checklistLabel:
          'Langkah A selesai: Perintah node --version menghasilkan versi v24/v22',
      },
      {
        nodeId: 'B',
        title: 'Instal Node.js (Jika Belum Tersedia)',
        badgeLabel: 'Hanya jika belum ada',
        badgeClass: 'badge-warning',
        description:
          'Ikuti langkah-langkah resmi berikut untuk mengunduh dan memasang Node.js pada Windows:',
        externalLink: {
          url: 'https://nodejs.org',
          label: 'https://nodejs.org',
          isExternal: true,
        },
        instructions: [
          'Buka browser (Google Chrome atau Microsoft Edge).',
          'Kunjungi situs resmi: https://nodejs.org',
          'Pilih versi yang bertuliskan <strong>LTS</strong>, lalu unduh file <strong>Windows Installer (.msi) 64-bit / x64</strong>.',
          'Buka file installer <code>.msi</code> yang telah selesai diunduh.',
          'Klik <strong>Next</strong>, centang persetujuan lisensi (Accept), dan gunakan seluruh opsi bawaan (default).',
          'Pastikan opsi <strong>npm package manager</strong> dan <strong>Add to PATH</strong> tetap dicentang aktif.',
          'Jika sistem Windows meminta izin hak Administrator (UAC), klik <strong>Yes</strong>.',
          'Setelah selesai, klik <strong>Finish</strong>.',
          '<strong>Tutup SEMUA jendela PowerShell</strong> yang terbuka, lalu buka jendela PowerShell yang baru.',
          'Jalankan kembali <code>node --version</code> dan <code>npm --version</code> untuk memastikan.',
        ],
        alerts: [
          {
            type: 'warning',
            icon: '⚠️',
            title: 'Perhatian Penting:',
            content:
              'Jangan memilih file ZIP atau Source Code. Pastikan selalu menggunakan file installer .msi agar konfigurasi PATH berjalan otomatis.',
          },
        ],
        taskId: 'm1-verify-lts',
        checklistLabel:
          'Langkah B selesai: Node.js LTS terpasang via installer .msi dengan Add to PATH',
      },
      {
        nodeId: 'C',
        title: 'Periksa npm (Node Package Manager)',
        badgeLabel: 'PowerShell',
        badgeClass: 'badge-neutral',
        description:
          'Di jendela PowerShell yang baru, periksa ketersediaan npm dengan perintah:',
        command: 'npm --version',
        commandLanguage: 'PowerShell',
        outputBadge: {
          label: '✓ Hasil yang benar:',
          value: 'Menampilkan angka versi npm (contoh: 10.x.x atau 9.x.x)',
        },
        taskId: 'm1-check-npm',
        checklistLabel:
          'Langkah C selesai: Perintah npm --version menghasilkan nomor versi',
      },
    ],
    checkpoint: {
      checkpointNum: 1,
      title: '📍 Gerbang Checkpoint 1: Node.js Siap',
      badge: 'Target Tahap 1',
      description: 'Tahap ini berhasil jika kedua perintah di atas menampilkan nomor versi:',
      requirements: [
        '<code>node --version</code> → menampilkan nomor versi',
        '<code>npm --version</code> → menampilkan nomor versi',
      ],
      note: 'Jika salah satunya gagal atau tidak dikenali, lihat panduan di bagian <strong>Solusi Kendala</strong> atau hubungi tim technical clinic.',
    },
  },

  // ==========================================
  // MODUL 2: INSTALASI & MENJALANKAN 9ROUTER
  // ==========================================
  {
    id: 'sec-module-2',
    num: 2,
    title: 'Modul 2: Instalasi & Menjalankan 9Router',
    subtitle: 'Memasang router model AI lokal dan memastikan dashboard dapat dibuka',
    icon: '🚀',
    badgeLabel: '4 Langkah',
    badgeClass: 'badge-primary',
    steps: [
      {
        nodeId: 'A',
        title: 'Instalasi Global 9Router',
        badgeLabel: 'PowerShell',
        badgeClass: 'badge-neutral',
        description:
          'Pastikan jendela PowerShell tetap terbuka dan terhubung ke internet. Salin dan jalankan perintah:',
        command: 'npm install -g 9router',
        commandLanguage: 'PowerShell',
        alerts: [
          {
            type: 'info',
            icon: '⏳',
            title: 'Proses Pemasangan:',
            content:
              'Proses instalasi membutuhkan waktu 1–3 menit. Tulisan bergerak atau pesan npm notice di layar adalah hal yang wajar. Jangan menutup terminal sampai PowerShell kembali menampilkan baris perintah PS C:\\...>.',
          },
        ],
        taskId: 'm2-install-pkg',
        checklistLabel:
          'Langkah A selesai: Perintah npm install -g 9router sukses tanpa error',
      },
      {
        nodeId: 'B',
        title: 'Menjalankan 9Router & Membuka Dashboard',
        badgeLabel: 'PowerShell',
        badgeClass: 'badge-neutral',
        description: 'Jalankan aplikasi 9Router dengan mengetikkan:',
        command: '9router',
        commandLanguage: 'PowerShell',
        instructions: [
          'Setelah menekan Enter, tunggu sekitar 10–30 detik. Browser Anda mungkin akan terbuka secara otomatis.',
          'Jika tidak terbuka otomatis, buka Google Chrome / Microsoft Edge dan kunjungi:',
        ],
        externalLink: {
          url: 'http://localhost:20128',
          label: 'http://localhost:20128',
          isExternal: true,
          note: '(atau http://127.0.0.1:20128)',
        },
        alerts: [
          {
            type: 'warning',
            icon: '🛡️',
            title: 'Jendela PowerShell Wajib Tetap Terbuka!',
            content:
              'PowerShell harus tetap terbuka di latar belakang agar 9Router terus aktif. localhost berjalan secara pribadi di laptop Anda. Jika muncul permintaan izin Firewall jaringan publik, batalkan/tutup peringatan tersebut.',
          },
        ],
        taskId: 'm2-start-service',
        checklistLabel:
          'Langkah B selesai: Perintah 9router berjalan aktif dan jendela terminal tetap terbuka',
      },
      {
        nodeId: 'C',
        title: 'Login Dashboard & Kata Sandi Awal',
        badgeLabel: 'Penting',
        badgeClass: 'badge-primary',
        description: 'Jika halaman pertama dashboard 9Router meminta Password / Login:',
        instructions: [
          'Masukkan kata sandi awal default: <code>123456</code>.',
          'Klik tombol <strong>Login / Sign in</strong>.',
          'Jika diminta membuat kata sandi baru, buat kata sandi sederhana yang tidak Anda pakai pada akun lain.',
          'Simpan kata sandi baru tersebut di catatan pribadi Anda.',
          'Pastikan tampilan dashboard utama 9Router telah terlihat.',
        ],
        alerts: [
          {
            type: 'info',
            icon: '🔑',
            title: 'Catatan Keamanan Kata Sandi:',
            content:
              '123456 adalah kata sandi awal instalasi lokal 9Router, BUKAN kata sandi akun Google atau Telegram Anda. Jangan mengirimkan kata sandi kepada instruktur atau peserta lain.',
          },
        ],
        taskId: 'm2-open-dashboard',
        checklistLabel:
          'Langkah C selesai: Dashboard http://localhost:20128 berhasil dibuka dan login 123456',
      },
      {
        nodeId: 'D',
        title: 'Cara Menghentikan & Menjalankan Kembali',
        badgeLabel: 'Opsional',
        badgeClass: 'badge-neutral',
        description: 'Jika Anda ingin menghentikan 9Router sementara:',
        command: 'Ctrl + C',
        commandLanguage: 'Tombol Keyboard',
        instructions: [
          'Untuk menjalankannya kembali sewaktu-waktu, cukup buka PowerShell baru dan jalankan <code>9router</code>.',
        ],
        taskId: 'm2-verify-local',
        checklistLabel:
          'Langkah D selesai: Memahami kendali Ctrl + C untuk menghentikan & menjalankan kembali',
      },
    ],
    checkpoint: {
      checkpointNum: 2,
      title: '📍 Gerbang Checkpoint 2: Dashboard 9Router Terbuka',
      badge: 'Target Tahap 2',
      description:
        'Checkpoint 2 dinyatakan lolos jika halaman http://localhost:20128 berhasil terbuka di browser dan menampilkan antarmuka 9Router.',
      requirements: [
        'Halaman <code>http://localhost:20128</code> berhasil terbuka di browser.',
        'Menampilkan antarmuka dan dashboard utama 9Router.',
      ],
    },
  },

  // ==========================================
  // MODUL 3: PEMBUATAN BOT TELEGRAM & USER ID
  // ==========================================
  {
    id: 'sec-module-3',
    num: 3,
    title: 'Modul 3: Pembuatan Bot Telegram & Telegram User ID',
    subtitle:
      'Membuat bot Telegram melalui BotFather resmi, mengamankan token bot, dan mencatat nomor Telegram User ID',
    icon: '🤖',
    badgeLabel: '5 Langkah',
    badgeClass: 'badge-primary',
    steps: [
      {
        nodeId: 'A',
        title: 'Buka Akun Resmi @BotFather di Telegram',
        badgeLabel: 'Aplikasi Telegram',
        badgeClass: 'badge-info',
        description:
          'Buka aplikasi Telegram di ponsel atau laptop Anda. Gunakan fitur pencarian untuk menemukan akun resmi pembuat bot Telegram:',
        instructions: [
          'Buka aplikasi Telegram di ponsel Anda.',
          'Tekan ikon pencarian (kaca pembesar) di bagian atas.',
          'Cari akun: <code>@BotFather</code>.',
          '<strong>PENTING:</strong> Pastikan username yang Anda pilih tepat bertuliskan <strong>@BotFather</strong> dan memiliki <strong>tanda centang biru resmi (verified badge)</strong> dari Telegram.',
          'Buka ruang percakapan tersebut, lalu tekan tombol <strong>Start</strong> di bagian bawah layar.',
        ],
        externalLink: {
          url: 'https://t.me/BotFather',
          label: 'https://t.me/BotFather',
          isExternal: true,
          note: 'Tautan resmi Telegram menuju BotFather.',
        },
        alerts: [
          {
            type: 'warning',
            icon: '⚠️',
            title: 'Waspada Akun Tiruan / Palsu!',
            content:
              'Banyak akun tiruan yang menggunakan nama serupa tanpa centang biru. Jangan pernah berinteraksi dengan akun selain @BotFather yang memiliki lencana centang biru resmi.',
          },
        ],
        taskId: 'm3-start-botfather',
        checklistLabel:
          'Langkah A selesai: Membuka akun resmi @BotFather (centang biru)',
      },
      {
        nodeId: 'B',
        title: 'Buat Bot Baru dengan Perintah /newbot',
        badgeLabel: 'Telegram Chat',
        badgeClass: 'badge-neutral',
        description: 'Kirim perintah berikut ke ruang percakapan dengan @BotFather:',
        command: '/newbot',
        commandLanguage: 'Perintah Telegram',
        instructions: [
          'Setelah mengirim <code>/newbot</code>, BotFather akan meminta <strong>Nama Tampilan Bot</strong> (Display Name). Ketik nama yang mudah dikenali, contoh: <code>Asisten Jadwal Budi</code>.',
          'BotFather kemudian akan meminta <strong>Username Bot</strong>. Aturan penulisan username bot:<ul><li>Harus <strong>unik</strong> di seluruh dunia (belum pernah dipakai orang lain).</li><li><strong>Tidak boleh memakai spasi</strong>.</li><li>Hanya boleh memakai huruf, angka, dan garis bawah (<code>_</code>).</li><li><strong>Wajib diakhiri dengan kata <code>bot</code></strong> (contoh: <code>jadwal_budi_2026_bot</code> atau <code>asisten_kalender_bot</code>).</li></ul>',
          'Jika muncul pesan <em>"Sorry, this username is already taken"</em>, variasikan username Anda dengan menambahkan angka atau nama Anda sampai diterima.',
          'Jika berhasil, BotFather akan membalas dengan pesan selamat yang berisi tautan ke bot Anda serta <strong>Bot Token</strong> rahasia.',
        ],
        alerts: [
          {
            type: 'info',
            icon: '💡',
            title: 'Privasi Nama & Username:',
            content:
              'Nama dan username bot dapat dilihat publik di Telegram. Jangan mencantumkan nomor handphone, alamat email pribadi, atau kata sandi pada nama bot Anda.',
          },
        ],
        taskId: 'm3-create-newbot',
        checklistLabel:
          'Langkah B selesai: Membuat bot baru dengan /newbot dan username unik berakhiran bot',
      },
      {
        nodeId: 'C',
        title: 'Simpan Bot Token dengan Aman & Aturan Kerahasiaan',
        badgeLabel: 'Sangat Rahasia',
        badgeClass: 'badge-danger',
        description:
          'Bot Token terlihat seperti deretan angka dan huruf panjang (contoh: 7123456789:AAFlxyz123...). Token setiap peserta berbeda dan unik.',
        command: '/revoke',
        commandLanguage: 'Perintah Darurat BotFather',
        instructions: [
          '<strong>Perintah Pencabutan Darurat (Jika Token Bocor):</strong> Jika Anda tidak sengaja mengirimkan atau memperlihatkan bot token kepada orang lain, segera batalkan token tersebut dengan mengirim perintah <code>/revoke</code> ke @BotFather.',
          'Pilih bot Anda, lalu BotFather akan menonaktifkan token lama dan memberikan token baru yang aman.',
        ],
        alerts: [
          {
            type: 'danger',
            icon: '🛑',
            title: 'DILARANG KERAS MENYEBARKAN BOT TOKEN!',
            content:
              'Siapa pun yang mengetahui bot token dapat mengendalikan bot Anda sepenuhnya. Ikuti aturan wajib ini:',
            bullets: [
              '<strong>JANGAN</strong> mengirim token ke grup kelas WhatsApp atau Telegram.',
              '<strong>JANGAN</strong> mengambil screenshot layar saat token sedang terlihat.',
              '<strong>JANGAN</strong> menyimpan token di dokumen atau folder bersama (Google Drive umum, dsb.).',
              'Biarkan token tetap berada di riwayat percakapan pribadi Anda dengan @BotFather (aman), atau simpan di aplikasi Password Manager pribadi Anda.',
            ],
          },
        ],
        taskId: 'm3-save-token-secure',
        checklistLabel:
          'Langkah C selesai: Bot Token tersimpan aman (tidak pernah dibagikan ke pihak lain)',
      },
      {
        nodeId: 'D',
        title: 'Buka Bot Anda & Tekan Start',
        badgeLabel: 'Telegram Chat',
        badgeClass: 'badge-neutral',
        description: 'Setelah bot berhasil dibuat di BotFather:',
        instructions: [
          'Klik tautan bot yang dikirimkan oleh BotFather (misal: <code>t.me/jadwal_budi_2026_bot</code>).',
          'Ruang obrolan dengan bot baru Anda akan terbuka.',
          'Tekan tombol <strong>Start</strong> (atau Mulai) di bagian bawah obrolan.',
        ],
        alerts: [
          {
            type: 'info',
            icon: 'ℹ️',
            title: 'Bot Belum Merespons Adalah Hal Normal!',
            content:
              'Setelah menekan Start, bot Anda belum akan membalas pesan. Hal ini sepenuhnya wajar dan normal karena aplikasi Hermes Agent belum dihubungkan ke bot Anda. Penyambungan bot ke Hermes akan dilakukan bersama instruktur saat kelas workshop.',
          },
        ],
        taskId: 'm3-start-chat',
        checklistLabel:
          'Langkah D selesai: Membuka bot baru di Telegram dan menekan tombol Start',
      },
      {
        nodeId: 'E',
        title: 'Dapatkan Nomor Telegram User ID Anda via @userinfobot',
        badgeLabel: 'Penting',
        badgeClass: 'badge-primary',
        description:
          'Hermes Agent membutuhkan Telegram User ID Anda untuk sistem keamanan, memastikan hanya Anda sendiri yang berhak memerintah bot untuk mengelola kalender:',
        instructions: [
          'Di aplikasi Telegram ponsel Anda, cari akun pembantu: <code>@userinfobot</code>.',
          'Buka percakapan resmi tersebut, atau klik tautan: https://t.me/userinfobot',
          'Tekan tombol <strong>Start</strong> di bagian bawah layar.',
          'Bot akan langsung menampilkan rincian profil Anda. Cari baris bertuliskan <strong>Id</strong> atau <strong>User ID</strong> yang <strong>hanya berupa angka</strong> (contoh: <code>123456789</code>).',
          'Catat hanya nomor angka tersebut di catatan pribadi laptop Anda agar siap disalin saat kelas.',
        ],
        externalLink: {
          url: 'https://t.me/userinfobot',
          label: 'https://t.me/userinfobot',
          isExternal: true,
        },
        comparisonGrid: {
          box1: {
            title: 'Username Telegram',
            value: '@nama_pengguna',
            desc: 'Bisa diubah sewaktu-waktu oleh pengguna, diawali karakter @.',
          },
          box2: {
            title: 'Telegram User ID (Yang Dibutuhkan)',
            value: '123456789',
            desc: '✓ Nomor angka murni permanen bawaan Telegram, tidak pernah berubah.',
          },
        },
        alerts: [
          {
            type: 'warning',
            icon: '⚠️',
            title: 'Aturan Keamanan @userinfobot:',
            content:
              'Jangan pernah mengirim bot token, password, atau kode login kepada @userinfobot. Anda hanya perlu menekan tombol Start dan mencatat nomor ID angka yang ditampilkan.',
          },
        ],
        taskId: 'm3-get-userid',
        checklistLabel:
          'Langkah E selesai: Memperoleh nomor Telegram User ID (hanya angka) dari @userinfobot',
      },
    ],
    checkpoint: {
      checkpointNum: 3,
      title: '📍 Gerbang Checkpoint 3: Bot Telegram & User ID Siap',
      badge: 'Target Tahap 3',
      description:
        'Checkpoint 3 dinyatakan lolos jika keempat syarat berikut terpenuhi:',
      requirements: [
        'Bot baru sudah dibuat di Telegram dan tombol <strong>Start</strong> sudah ditekan.',
        'Bot token tersimpan aman di obrolan BotFather atau password manager (tidak pernah dibagikan ke publik).',
        'Nomor Telegram User ID (hanya angka) sudah dicatat di catatan pribadi.',
        'Token bot tidak pernah dikirimkan ke orang lain.',
      ],
    },
  },

  // ==========================================
  // MODUL 4: PEMERIKSAAN AKUN GOOGLE CLOUD
  // ==========================================
  {
    id: 'sec-module-4',
    num: 4,
    title: 'Modul 4: Pemeriksaan Akun Google Cloud',
    subtitle:
      'Memastikan akun Google pribadi dapat mengakses Google Cloud Console tanpa konfigurasi API atau billing sebelum kelas',
    icon: '☁️',
    badgeLabel: '2 Langkah',
    badgeClass: 'badge-primary',
    steps: [
      {
        nodeId: 'A',
        title: 'Buka & Login ke Google Cloud Console',
        badgeLabel: 'Browser',
        badgeClass: 'badge-neutral',
        description:
          'Tidak ada konfigurasi rumit yang perlu dilakukan sebelum kelas. Anda hanya perlu memastikan akun Google Anda dapat mengakses halaman utama konsol cloud Google:',
        instructions: [
          'Buka browser Anda (Google Chrome atau Microsoft Edge disarankan).',
          'Kunjungi alamat resmi: https://console.cloud.google.com',
          'Login menggunakan akun Google pribadi yang Anda siapkan untuk workshop.',
          'Jika muncul jendela persetujuan awal (Terms of Service) dan pemilihan negara, baca lalu setujui jika Anda berkenan untuk melanjutkan.',
          'Pastikan Anda berhasil melihat tampilan dashboard utama Google Cloud Console.',
        ],
        externalLink: {
          url: 'https://console.cloud.google.com',
          label: 'https://console.cloud.google.com',
          isExternal: true,
        },
        taskId: 'm4-open-console',
        checklistLabel:
          'Langkah A selesai: Membuka https://console.cloud.google.com di browser',
      },
      {
        nodeId: 'B',
        title: 'Verifikasi Tampilan & Batasan Penting Pra-Kelas',
        badgeLabel: 'Cukup Buka Saja',
        badgeClass: 'badge-warning',
        description:
          'Setelah halaman Google Cloud Console terbuka dengan profil akun Anda di sudut kanan atas, tugas Anda di tahap ini sudah selesai.',
        alerts: [
          {
            type: 'warning',
            icon: '⚠️',
            title: 'BATASAN PENTING PRA-KELAS GOOGLE CLOUD:',
            content:
              'Demi kenyamanan dan keseragaman latihan saat workshop, patuhi aturan berikut:',
            bullets: [
              '<strong>JANGAN membuat Project baru</strong> terlebih dahulu.',
              '<strong>JANGAN mengaktifkan Google Calendar API</strong> sebelum kelas.',
              '<strong>JANGAN memasukkan nomor kartu kredit atau informasi penagihan (Billing)</strong>.',
            ],
            note: 'Seluruh proses pembuatan Project, aktivasi Google Calendar API, dan pengaturan OAuth 2.0 Credentials akan dipandu langsung oleh instruktur langkah demi langkah saat workshop.',
          },
          {
            type: 'info',
            icon: '💡',
            title: 'Saran Pemilihan Akun Google:',
            content:
              'Disarankan menggunakan akun Google pribadi/latihan atau membuat kalender Google baru khusus workshop, agar kegiatan uji coba kalender AI tidak bercampur dengan kalender kerja atau jadwal pribadi utama Anda.',
          },
        ],
        taskId: 'm4-verify-login',
        checklistLabel:
          'Langkah B selesai: Login akun Google terverifikasi & memahami batasan pra-kelas',
      },
    ],
  },

  // ==========================================
  // MODUL 5: CATATAN & BATASAN PENTING SEBELUM KELAS
  // ==========================================
  {
    id: 'sec-module-5',
    num: 5,
    title: 'Modul 5: Catatan & Batasan Penting Sebelum Kelas',
    subtitle:
      'Daftar batasan konfigurasi pra-workshop dan pemahaman diagram alur hubungan sistem Hermes Agent + 9Router',
    icon: '⚠️',
    badgeLabel: 'Wajib Dibaca',
    badgeClass: 'badge-warning',
    hasArchFlow: true,
    steps: [
      {
        nodeId: '1',
        title: 'Jangan Memilih Provider atau Model AI Terlebih Dahulu',
        badgeLabel: 'Batasan 9Router',
        badgeClass: 'badge-warning',
        description:
          'Jika dashboard 9Router di http://localhost:20128 sudah terbuka, tugas persiapan Anda terkait 9Router sudah 100% selesai.',
        alerts: [
          {
            type: 'warning',
            icon: '⚠️',
            title: 'Sebelum kelas workshop dimulai:',
            content:
              'Pemilihan provider dan model AI dilakukan bersama saat kelas agar semua peserta menggunakan konfigurasi yang seragam dan dapat mengikuti penjelasan instruktur tanpa kendala kompatibilitas.',
            bullets: [
              '<strong>Jangan membuka atau mengubah menu Providers</strong> di dashboard 9Router.',
              '<strong>Jangan memilih model AI</strong> apapun terlebih dahulu.',
              '<strong>Jangan melakukan login provider</strong> melalui dashboard 9Router.',
              '<strong>Jangan menyalin, membuat, atau membeli API key</strong> sendiri.',
            ],
            note: '<strong>Mengapa?</strong> Pemilihan provider dan model AI dilakukan bersama saat kelas agar semua peserta menggunakan konfigurasi yang seragam dan dapat mengikuti penjelasan instruktur tanpa kendala kompatibilitas.',
          },
        ],
      },
      {
        nodeId: '2',
        title: 'Jangan Menginstal Hermes Agent Terlebih Dahulu',
        badgeLabel: 'Batasan Hermes',
        badgeClass: 'badge-danger',
        description:
          'Instalasi Hermes Agent serta tahapan Full Setup adalah materi praktik utama saat workshop.',
        alerts: [
          {
            type: 'danger',
            icon: '🛑',
            title: 'Larangan Instalasi Mandiri Pra-Kelas:',
            content:
              'Mencoba menginstal Hermes secara mandiri sebelum kelas dapat menimbulkan bentrok port atau konfigurasi yang rusak dan membutuhkan reset ulang saat kelas.',
            bullets: [
              '<strong>Jangan menjalankan installer Hermes</strong>.',
              '<strong>Jangan mengetikkan perintah <code>hermes setup</code></strong> di terminal.',
              '<strong>Jangan mengetikkan perintah <code>hermes model</code></strong> di terminal.',
              '<strong>Jangan mencoba mengaktifkan Google Calendar API</strong> sendiri.',
            ],
            note: 'Mencoba menginstal Hermes secara mandiri sebelum kelas dapat menimbulkan bentrok port atau konfigurasi yang rusak dan membutuhkan reset ulang saat kelas.',
          },
        ],
      },
      {
        nodeId: '3',
        title: 'Diagram Alur & Hubungan Antar Komponen',
        badgeLabel: 'Konsep Arsitektur',
        badgeClass: 'badge-primary',
        description:
          'Agar Anda memiliki gambaran menyeluruh, berikut adalah diagram sederhana bagaimana seluruh komponen bekerja sama saat workshop nanti:',
        alerts: [
          {
            type: 'success',
            icon: '✨',
            title: 'Pre-Training Anda Siap!',
            content:
              'Setelah menyelesaikan Modul 1 sampai Modul 5, Anda telah memenuhi seluruh prasyarat teknis. Pastikan Anda mencatat hasil di bagian Laporan Kesiapan untuk dilaporkan ke instruktur.',
          },
        ],
      },
    ],
  },
]
