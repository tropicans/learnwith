/**
 * Strongly-Typed Course Curriculum Data Layer
 * Requirements: SSR-01, SSR-03
 *
 * Provides typed data models and server-side loader preloading functions
 * for Agentic AI, Word ASN, and Frontpage Hub course overviews.
 */

export interface CourseModule {
  id: string
  num: number
  title: string
  subtitle: string
  estimatedMinutes: number
  checkpoints?: string[]
}

export interface CourseData {
  id: string
  title: string
  subtitle: string
  description: string
  category: 'ai' | 'word'
  badge: string
  modulesCount: number
  checkpointsCount: number
  modules: CourseModule[]
  sessionMode?: string
}

export interface CourseStats {
  activeParticipants: number
  completionRate: number
  lastUpdated: string
}

const AI_PRETRAINING_MODULES: CourseModule[] = [
  {
    id: 'm1',
    num: 1,
    title: 'Fondasi Lingkungan Windows & Node.js',
    subtitle: 'Instalasi Node.js LTS, verifikasi PATH, dan CLI PowerShell Admin',
    estimatedMinutes: 20,
    checkpoints: ['Verifikasi Node.js & npm PATH'],
  },
  {
    id: 'm2',
    num: 2,
    title: 'Arsitektur 9Router Local Proxy Engine',
    subtitle: 'Setup 9Router gateway, web dashboard port 20128, dan routing model',
    estimatedMinutes: 30,
    checkpoints: ['9Router Gateway Online (Port 20128)'],
  },
  {
    id: 'm3',
    num: 3,
    title: 'Pembuatan Bot Telegram via @BotFather',
    subtitle: 'Registrasi bot, token credential security, dan ID tracking',
    estimatedMinutes: 25,
    checkpoints: ['Token Bot Valid & Tersimpan Aman'],
  },
  {
    id: 'm4',
    num: 4,
    title: 'Inisialisasi Google Cloud Project & Service API',
    subtitle: 'Konfigurasi Google Cloud Console dan aktivasi Google Calendar API',
    estimatedMinutes: 35,
    checkpoints: ['Google Calendar API Diaktifkan'],
  },
  {
    id: 'm5',
    num: 5,
    title: 'Audit Kesiapan Pra-Training & Self-Assessment',
    subtitle: 'Pemeriksaan checklist diagnostik mandiri sebelum kelas hari-H',
    estimatedMinutes: 15,
  },
]

const AI_LIVE_MODULES: CourseModule[] = [
  {
    id: 'm6',
    num: 6,
    title: '9Router Model Alignment & Routing Matrix',
    subtitle: 'Konfigurasi multi-model fallback dan virtual API keys',
    estimatedMinutes: 25,
    checkpoints: ['Virtual API Key 9Router Terbit'],
  },
  {
    id: 'm7',
    num: 7,
    title: 'Hermes Agent Windows Native Engine',
    subtitle: 'Instalasi hermes-cli, environment verification, dan system doctor',
    estimatedMinutes: 30,
    checkpoints: ['Hermes Doctor Report Passed'],
  },
  {
    id: 'm8',
    num: 8,
    title: 'Hermes Configuration Wizard & Agent Testing',
    subtitle: 'Konfigurasi endpoint, model provider, dan first chat test',
    estimatedMinutes: 25,
    checkpoints: ['Hermes Chat Test Berhasil'],
  },
  {
    id: 'm9',
    num: 9,
    title: 'Telegram Gateway Bridge & Security Allowlist',
    subtitle: 'Aktivasi Telegram bot gateway, chat ID filtering, dan DM authentication',
    estimatedMinutes: 35,
    checkpoints: ['Telegram DM Bot Responsif'],
  },
  {
    id: 'm10',
    num: 10,
    title: 'Google Calendar OAuth 2.0 Desktop Integration',
    subtitle: 'OAuth consent screen, desktop client ID, download credentials.json, dan token exchange',
    estimatedMinutes: 40,
    checkpoints: ['OAuth 2.0 Token Terhubung'],
  },
  {
    id: 'm11',
    num: 11,
    title: 'Operasional Agentic End-to-End & Uji Perintah',
    subtitle: 'Perintah natural language untuk booking kalender, query jadwal, dan failover sequence',
    estimatedMinutes: 45,
    checkpoints: ['End-to-End Kalender Scheduling Valid'],
  },
]

const WORD_MODULES: CourseModule[] = [
  {
    id: 'word-b1',
    num: 1,
    title: 'Bab I: Standardisasi Tata Naskah Dinas & Anatomi Dokumen',
    subtitle: 'Pedoman Pergub DKI No. 14/2020, margin baku, tipografi kedinasan, dan setup folder kerja',
    estimatedMinutes: 30,
    checkpoints: ['Format Naskah Sesuai Pergub 14/2020'],
  },
  {
    id: 'word-b2',
    num: 2,
    title: 'Bab II: Sistem Heading Styles, Navigation Pane & TOC Otomatis',
    subtitle: 'Heading 1-3 bertingkat, skema penomoran Bab/Sub-bab, dan Daftar Isi otomatis terbarukan',
    estimatedMinutes: 45,
    checkpoints: ['TOC Otomatis & Heading Styles Valid'],
  },
  {
    id: 'word-b3',
    num: 3,
    title: 'Bab III: Section Breaks, Nomor Halaman Campuran & Layout Landscape',
    subtitle: 'Next Page Breaks, pemutusan Link to Previous, format angka Romawi/Arab, tabel landscape, dan template .dotx',
    estimatedMinutes: 50,
    checkpoints: ['Page Numbering & Landscape Section Terpisah'],
  },
  {
    id: 'word-b4',
    num: 4,
    title: 'Bab IV: Mail Merge Otomatis, Proteksi & Kolaborasi Naskah',
    subtitle: 'Penggabungan data Excel untuk surat masal, rules Next Record/If-Then-Else, Track Changes, dan pembandingan dokumen',
    estimatedMinutes: 45,
    checkpoints: ['Mail Merge Massal & Track Changes Selesai'],
  },
  {
    id: 'word-b5',
    num: 5,
    title: 'Bab V: Evaluasi Kompetensi BPSDM & Sertifikat Kelulusan',
    subtitle: 'Kuis interaktif 20 butir soal kedinasan, batas kelulusan 75%, dan penerbitan sertifikat digital BPSDM',
    estimatedMinutes: 30,
    checkpoints: ['Kelulusan Ambang Batas 75% Tercapai'],
  },
]

const COURSE_AI_BASE: CourseData = {
  id: 'ai',
  title: 'Hands-on Agentic AI: Dari Chat ke Kalender',
  subtitle: 'Praktik Deploy Hermes Agent & 9Router di Windows',
  description:
    'Panduan praktis langkah-demi-langkah integrasi Telegram Bot dengan model LLM lokal/cloud via 9Router, sinkronisasi Google Calendar OAuth, dan sensor token keamanan tanpa coding.',
  category: 'ai',
  badge: '✅ Terbuka untuk Umum',
  modulesCount: 5,
  checkpointsCount: 3,
  modules: AI_PRETRAINING_MODULES,
  sessionMode: 'pretraining',
}

const COURSE_WORD_BASE: CourseData = {
  id: 'word',
  title: 'Pengolahan Kata Tingkat Lanjut',
  subtitle: 'Standardisasi Dokumen Dinas Sesuai Pergub DKI No. 14/2020',
  description:
    'Modul komprehensif penyusunan tata naskah dinas baku: Heading Styles, Multilevel List, Daftar Isi Otomatis, Section Breaks & Landscape, Mail Merge, Kuis 20 Soal, & Sertifikat BPSDM.',
  category: 'word',
  badge: '🔒 Perlu Kode Sandi',
  modulesCount: 5,
  checkpointsCount: 3,
  modules: WORD_MODULES,
  sessionMode: 'standard',
}

/**
 * Preload full course list for Frontpage Hub (SSR-01)
 */
export async function getCoursesList(): Promise<CourseData[]> {
  return [COURSE_AI_BASE, COURSE_WORD_BASE]
}

/**
 * Preload Agentic AI course data with dynamic sessionMode switching (pretraining vs live-class)
 */
export async function getCourseAiData(mode: string = 'pretraining'): Promise<CourseData> {
  const isLive = mode === 'live-class'
  return {
    ...COURSE_AI_BASE,
    sessionMode: isLive ? 'live-class' : 'pretraining',
    title: isLive
      ? 'Hands-on Agentic AI: Sesi Hari-H Praktik'
      : 'Hands-on Agentic AI: Sesi Pra-Training Mandiri',
    subtitle: isLive
      ? 'Implementasi Live Telegram Gateway & Kalender Google dengan Hermes Agent'
      : 'Persiapan Mandiri: Node.js, 9Router, BotFather, dan Google Cloud Setup',
    modulesCount: isLive ? AI_LIVE_MODULES.length : AI_PRETRAINING_MODULES.length,
    checkpointsCount: isLive ? 6 : 3,
    modules: isLive ? AI_LIVE_MODULES : AI_PRETRAINING_MODULES,
  }
}

/**
 * Preload Pengolahan Kata Tingkat Lanjut curriculum data
 */
export async function getCourseWordData(): Promise<CourseData> {
  return COURSE_WORD_BASE
}

/**
 * Asynchronous stats calculation for progressive streaming via TanStack Suspense & <Await> (SSR-02)
 */
export async function getCourseStatsAsync(courseId: string): Promise<CourseStats> {
  // Simulate asynchronous database/analytics fetch with deterministic values
  await new Promise((resolve) => setTimeout(resolve, 80))

  if (courseId === 'word') {
    return {
      activeParticipants: 142,
      completionRate: 88,
      lastUpdated: 'Hari ini',
    }
  }

  return {
    activeParticipants: 328,
    completionRate: 94,
    lastUpdated: 'Hari ini',
  }
}
