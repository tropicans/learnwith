/**
 * Strongly-Typed Foundation Data for Agentic AI Pre-Training
 * Requirements: PRE-BASE-01, PRE-BASE-02, PRE-BASE-03, PRE-BASE-04, PRE-BASE-05
 *
 * Extracted with 100% fidelity from index.html (lines 795–1082).
 */

export interface HeroStat {
  icon: string
  value: string
  label: string
  bgStyle?: string
  colorStyle?: string
}

export interface TargetCriterion {
  step: number
  title: string
  description: string
  codeSnippet?: string
}

export interface GlossaryTerm {
  id: string
  term: string
  icon: string
  definition: string
}

export interface SecurityRule {
  id: string
  highlight: string
  text: string
}

export interface PrerequisiteItem {
  id: string
  label: string
}

export interface PowerShellStep {
  step: number
  title: string
  description: string
  codeSnippet?: string
}

export const PRETRAINING_HERO_STATS: HeroStat[] = [
  {
    icon: '⏱️',
    value: '45–75 mnt',
    label: 'Estimasi Waktu',
    bgStyle: 'var(--accent-primary-subtle)',
    colorStyle: 'var(--accent-primary)',
  },
  {
    icon: '🎯',
    value: '3 Gerbang',
    label: 'Checkpoint Mandiri',
    bgStyle: 'var(--color-success-subtle)',
    colorStyle: 'var(--color-success)',
  },
  {
    icon: '💻',
    value: '0 Coding',
    label: 'Dirancang Bagi Pemula',
    bgStyle: 'var(--color-info-subtle)',
    colorStyle: 'var(--color-info)',
  },
  {
    icon: '💾',
    value: '0/13',
    label: 'Langkah Selesai',
    bgStyle: 'var(--color-warning-subtle)',
    colorStyle: 'var(--color-warning)',
  },
]

export const PRETRAINING_TARGET_CRITERIA: TargetCriterion[] = [
  {
    step: 1,
    title: '9Router Berhasil Dipasang',
    description: 'Aplikasi 9Router terpasang di sistem dan perintah npx 9router start dapat dijalankan.',
    codeSnippet: 'npx 9router start',
  },
  {
    step: 2,
    title: 'Dashboard Lokal Terbuka',
    description: 'Halaman http://localhost:20128 dapat diakses di Chrome/Edge pada laptop Anda.',
    codeSnippet: 'http://localhost:20128',
  },
  {
    step: 3,
    title: 'Bot Telegram Dibuat & User ID Dicatat',
    description: 'Bot Telegram telah dibuat via BotFather, token disimpan secara aman, dan Telegram User ID telah diperoleh.',
  },
]

export const PRETRAINING_GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: 'browser',
    term: 'Browser',
    icon: '🌐',
    definition: 'Aplikasi untuk membuka situs internet, misalnya Google Chrome atau Microsoft Edge.',
  },
  {
    id: 'powershell',
    term: 'PowerShell / Terminal',
    icon: '📟',
    definition: 'Aplikasi tempat kita mengetikkan perintah langsung kepada sistem komputer laptop.',
  },
  {
    id: 'nodejs',
    term: 'Node.js & npm',
    icon: '🟢',
    definition: 'Aplikasi lingkungan runtime dan pengelola paket yang dibutuhkan agar 9Router dapat berjalan.',
  },
  {
    id: '9router',
    term: '9Router',
    icon: '🚀',
    definition: 'Aplikasi lokal perute model AI yang menghubungkan agen pintar (Hermes) dengan model bahasa AI.',
  },
  {
    id: 'token',
    term: 'Token / API Key',
    icon: '🔑',
    definition: 'Kode rahasia akses ke suatu layanan AI/Telegram. Wajib dijaga layaknya kata sandi rahasia akun bank.',
  },
  {
    id: 'botfather',
    term: 'BotFather',
    icon: '🤖',
    definition: 'Akun resmi dari Telegram (terverifikasi centang biru) yang digunakan untuk membuat dan mengatur bot Telegram baru.',
  },
  {
    id: 'telegram-user-id',
    term: 'Telegram User ID',
    icon: '🆔',
    definition: 'Nomor unik permanen (angka murni) yang menandai akun Telegram Anda, berbeda dari nama @username.',
  },
  {
    id: 'checkpoint',
    term: 'Checkpoint',
    icon: '📍',
    definition: 'Gerbang konfirmasi bahwa satu tahap berhasil 100% dan Anda diperbolehkan lanjut ke tahap berikutnya.',
  },
]

export const PRETRAINING_SECURITY_RULES: SecurityRule[] = [
  {
    id: 'sec-rule-1',
    highlight: '1. DILARANG',
    text: 'mengirim token bot, API key, atau kata sandi ke grup kelas WhatsApp/Telegram.',
  },
  {
    id: 'sec-rule-2',
    highlight: '2. DILARANG',
    text: 'mengambil screenshot layar jika jendela sedang menampilkan token/kode rahasia secara terbuka.',
  },
  {
    id: 'sec-rule-3',
    highlight: '3. DILARANG',
    text: 'mengubah konfigurasi jaringan internal, proxy kantor, atau mematikan firewall laptop tanpa arahan.',
  },
  {
    id: 'sec-rule-4',
    highlight: '4. WAJIB SENSOR',
    text: 'setiap pesan error sebelum dibagikan ke instruktur dengan fitur Sensor Rahasia.',
  },
]

export const PRETRAINING_PREREQUISITES: PrerequisiteItem[] = [
  {
    id: 'prereq-laptop',
    label: 'Laptop Windows 10/11 (atau macOS/Linux dengan arahan instruktur)',
  },
  {
    id: 'prereq-charger',
    label: 'Charger laptop siap digunakan',
  },
  {
    id: 'prereq-internet',
    label: 'Koneksi internet stabil (disarankan minimal 10 Mbps)',
  },
  {
    id: 'prereq-browser',
    label: 'Google Chrome atau Microsoft Edge versi terbaru terpasang',
  },
  {
    id: 'prereq-admin',
    label: 'Hak akses memasang aplikasi (Administrator) pada laptop',
  },
  {
    id: 'prereq-telegram',
    label: 'Akun Telegram aktif di ponsel Anda',
  },
  {
    id: 'prereq-google',
    label: 'Akun Google pribadi aktif yang dapat membuka Google Cloud Console',
  },
]

export const PRETRAINING_POWERSHELL_STEPS: PowerShellStep[] = [
  {
    step: 1,
    title: 'Buka Start Menu',
    description: 'Klik tombol Start / Windows di sudut kiri bawah layar Anda.',
  },
  {
    step: 2,
    title: 'Ketikkan "PowerShell"',
    description: 'Ketik kata PowerShell lalu klik aplikasi Windows PowerShell.',
    codeSnippet: 'PowerShell',
  },
  {
    step: 3,
    title: 'Memahami Prompt Perintah',
    description: 'Anda akan melihat baris awal seperti PS C:\\Users\\NamaAnda>. Teks tersebut normal dan tidak perlu diketik ulang.',
    codeSnippet: 'PS C:\\Users\\NamaAnda>',
  },
]
