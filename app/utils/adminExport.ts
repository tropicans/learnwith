import type {
  ParticipantRecord,
  TelemetryDashboardStats,
  TelemetryQueryFilter,
  CheckpointStatus,
} from '../schemas/telemetry'

/**
 * Standard CSV Header according to ADMIN-DASH-04 specification.
 */
export const CSV_HEADERS = [
  'ID Peserta',
  'Nama Peserta',
  'Instansi / Unit Kerja',
  'Kategori Kursus',
  'Progres (%)',
  'Tugas Selesai',
  'Total Tugas',
  'Checkpoint 1',
  'Checkpoint 2',
  'Checkpoint 3',
  'Skor Kuis',
  'Status Kesiapan',
  'Waktu Terdaftar',
  'Aktivitas Terakhir',
]

export interface TaskGroup {
  id: string
  title: string
  tasks: Array<{
    id: string
    label: string
  }>
}

export const AI_TASK_GROUPS: TaskGroup[] = [
  {
    id: 'module-1',
    title: 'Modul 1: Fondasi Runtime & Lingkungan',
    tasks: [
      { id: 'm1-check-node', label: 'Verifikasi Node.js (v18+ LTS)' },
      { id: 'm1-verify-lts', label: 'Pemeriksaan Dukungan Versi LTS' },
      { id: 'm1-check-npm', label: 'Validasi Package Manager npm' },
    ],
  },
  {
    id: 'module-2',
    title: 'Modul 2: Setup & Layanan Lokal',
    tasks: [
      { id: 'm2-install-pkg', label: 'Instalasi Paket Dependensi Workshop' },
      { id: 'm2-start-service', label: 'Menjalankan Layanan Lokal Agentic AI' },
      { id: 'm2-open-dashboard', label: 'Akses UI Dashboard Lokal' },
      { id: 'm2-verify-local', label: 'Pengujian Endpoint Layanan Lokal' },
    ],
  },
  {
    id: 'module-3',
    title: 'Modul 3: Kredensial BotFather Telegram',
    tasks: [
      { id: 'm3-start-botfather', label: 'Inisiasi BotFather di Telegram' },
      { id: 'm3-create-newbot', label: 'Pembuatan Bot Baru & Username' },
      { id: 'm3-save-token-secure', label: 'Penyimpanan Aman Token Bot' },
      { id: 'm3-get-userid', label: 'Pengambilan Telegram User ID' },
    ],
  },
  {
    id: 'module-4',
    title: 'Modul 4: Integrasi Konsol Agentic AI',
    tasks: [
      { id: 'm4-open-console', label: 'Membuka Konsol Terminal AI' },
      { id: 'm4-verify-login', label: 'Verifikasi Otentikasi & Login Bot' },
    ],
  },
]

export const WORD_TASK_GROUPS: TaskGroup[] = [
  {
    id: 'bab-1',
    title: 'Bab I: Navigasi Ribbon & Tipografi ASN',
    tasks: [
      { id: 'word-b1-nav-ribbon', label: 'Navigasi Pita Ribbon & Tampilan Standar' },
      { id: 'word-b1-font-paragraf', label: 'Format Tipografi & Paragraf Resmi ASN' },
    ],
  },
  {
    id: 'bab-2',
    title: 'Bab II: Gaya Heading & Daftar Isi',
    tasks: [
      { id: 'word-b2-custom-style', label: 'Kustomisasi Gaya Heading Sesuai Pergub' },
      { id: 'word-b2-daftar-isi', label: 'Pembuatan Daftar Isi Otomatis Terstruktur' },
    ],
  },
  {
    id: 'bab-3',
    title: 'Bab III: Tata Letak & Header/Footer',
    tasks: [
      { id: 'word-b3-page-break', label: 'Pengaturan Section Break & Margin Halaman' },
      { id: 'word-b3-header-footer', label: 'Penomoran Header & Footer Berbeda' },
    ],
  },
  {
    id: 'bab-4',
    title: 'Bab IV: Kolaborasi & Mail Merge',
    tasks: [
      { id: 'word-b4-mailmerge', label: 'Integrasi Data Mail Merge Naskah Dinas' },
      { id: 'word-b4-label-amplop', label: 'Pencetakan Label & Amplop Resmi' },
    ],
  },
  {
    id: 'bab-5',
    title: 'Bab V: Evaluasi & Uji Mandiri',
    tasks: [
      { id: 'word-b5-eval-quiz', label: 'Evaluasi Pemahaman Dokumen Digital Pergub' },
    ],
  },
]

/**
 * Extract checkpoint status with multiple key naming schemes support.
 */
export function extractCpStatus(
  checkpoints: Record<string, CheckpointStatus> | undefined,
  index: 1 | 2 | 3
): CheckpointStatus {
  if (!checkpoints) return 'pending'
  const keys = [`cp-${index}`, `word-cp-${index}`, `ai-cp-${index}`, `checkpoint-${index}`]
  for (const k of keys) {
    if (checkpoints[k]) return checkpoints[k]
  }
  return 'pending'
}

export const getCheckpointStatus = extractCpStatus

/**
 * Format timestamp to localized date string or fallback.
 */
export function formatDate(timestamp: number): string {
  if (!timestamp || isNaN(timestamp)) return '-'
  try {
    return new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'medium',
    }).format(new Date(timestamp))
  } catch {
    return new Date(timestamp).toISOString()
  }
}

/**
 * Sanitize and format a single CSV cell according to RFC 4180 and prevent formula injection.
 * If value starts with '=', '+', '-', '@', '\t', '\r', prefix with single quote "'".
 * Wrap all cells in double quotes, escaping internal quotes as '""'.
 */
export function sanitizeCsvCell(raw: unknown): string {
  if (raw === null || raw === undefined) {
    return '""'
  }

  let str = String(raw)
  const dangerousChars = ['=', '+', '-', '@', '\t', '\r']

  if (str.length > 0 && dangerousChars.includes(str[0])) {
    str = `'${str}`
  }

  const escaped = str.replace(/"/g, '""')
  return `"${escaped}"`
}

/**
 * Generate RFC 4180 compliant CSV recapitulation with Excel-compatible UTF-8 BOM.
 */
export function generateParticipantCsv(participants: ParticipantRecord[]): string {
  const BOM = '\uFEFF'
  const headerLine = CSV_HEADERS.map((h) => `"${h}"`).join(',')

  const rows = participants.map((p) => {
    const courseLabel = p.courseId === 'ai' ? 'AI Agentic' : 'Pengolahan Kata ASN'
    const cp1 = extractCpStatus(p.checkpoints, 1)
    const cp2 = extractCpStatus(p.checkpoints, 2)
    const cp3 = extractCpStatus(p.checkpoints, 3)
    const quizScoreStr = p.quizScore !== undefined ? String(p.quizScore) : '-'
    const createdStr = p.serverReceivedAt ? new Date(p.serverReceivedAt).toISOString() : '-'
    const activeStr = p.lastActiveAt ? new Date(p.lastActiveAt).toISOString() : '-'

    const cells = [
      sanitizeCsvCell(p.participantId),
      sanitizeCsvCell(p.name || 'Peserta'),
      sanitizeCsvCell(p.agency || '-'),
      sanitizeCsvCell(courseLabel),
      sanitizeCsvCell(p.progressPercent),
      sanitizeCsvCell(p.completedTasks),
      sanitizeCsvCell(p.totalTasks),
      sanitizeCsvCell(cp1),
      sanitizeCsvCell(cp2),
      sanitizeCsvCell(cp3),
      sanitizeCsvCell(quizScoreStr),
      sanitizeCsvCell(p.readinessStatus),
      sanitizeCsvCell(createdStr),
      sanitizeCsvCell(activeStr),
    ]

    return cells.join(',')
  })

  return BOM + [headerLine, ...rows].join('\r\n')
}

/**
 * Export participant directory and aggregate summary to structured JSON.
 */
export function generateParticipantJson(
  participants: ParticipantRecord[],
  stats?: TelemetryDashboardStats,
  filter?: TelemetryQueryFilter
): string {
  const payload = {
    exportedAt: new Date().toISOString(),
    exportedBy: 'Master Admin',
    version: '1.0',
    totalRecords: participants.length,
    summary: stats || null,
    filtersApplied: filter || null,
    participants,
  }

  return JSON.stringify(payload, null, 2)
}

/**
 * Native browser download trigger using temporary Blob and URL.createObjectURL.
 */
export function triggerFileDownload(content: string, filename: string, mimeType: string): void {
  if (typeof window === 'undefined') return

  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)

  // Delay revocation to ensure browser download starts reliably
  setTimeout(() => {
    URL.revokeObjectURL(url)
  }, 1000)
}
