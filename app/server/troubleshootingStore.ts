import crypto from 'node:crypto'
import { sanitizeLogText } from '../utils/redaction.ts'
import type {
  TroubleshootingLogRecord,
  TroubleshootingCategory,
  TroubleshootingSeverity,
  IngestTroubleshootingInput,
  TroubleshootingFilter,
  TroubleshootingStats,
  UpdateTroubleshootingStatusInput,
} from '../schemas/troubleshooting.ts'

export interface ClassificationResult {
  category: TroubleshootingCategory
  severity: TroubleshootingSeverity
  suggestedCommand?: string
  suggestedRemediation: string
}

/**
 * Classification Rule Engine for Classroom Runtime Errors
 * Maps error patterns to standardized categories and PowerShell remediation commands.
 * Requirements: ADMIN-LOG-01, ADMIN-LOG-02
 */
export function classifyErrorLog(errorText: string): ClassificationResult {
  if (!errorText) {
    return {
      category: 'other',
      severity: 'low',
      suggestedRemediation:
        'Kendala umum di luar kategori terdefinisi. Periksa detail log terminal untuk analisis manual.',
    }
  }

  // 1. Port 20128 conflict (EADDRINUSE)
  if (/(?:20128|EADDRINUSE|address already in use|listen EADDRINUSE)/i.test(errorText)) {
    return {
      category: 'port_conflict',
      severity: 'high',
      suggestedCommand:
        'Stop-Process -Id (Get-NetTCPConnection -LocalPort 20128).OwningProcess -Force',
      suggestedRemediation:
        'Port 20128 digunakan proses lain. Hentikan proses yang memblokir port lalu jalankan ulang 9Router.',
    }
  }

  // 2. PowerShell execution policy
  if (
    /(?:Execution_Policies|execution[_ ]?policy|running scripts is disabled|ps1 cannot be loaded|PSScriptRoot|Set-ExecutionPolicy|restricted)/i.test(
      errorText
    )
  ) {
    return {
      category: 'powershell_policy',
      severity: 'medium',
      suggestedCommand:
        'Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass',
      suggestedRemediation:
        'PowerShell memblokir eksekusi skrip otomatis. Ubah kebijakan eksekusi untuk sesi terminal saat ini.',
    }
  }

  // 3. OAuth & API Key errors
  if (
    /(?:401 Unauthorized|Invalid API Key|GOOGLE_CLIENT_ID|AIza|unauthorized_client|gemini|bad credential|oauth error|token expired)/i.test(
      errorText
    )
  ) {
    return {
      category: 'oauth_api_key',
      severity: 'critical',
      suggestedCommand:
        'Check API Key in 9Router config or re-issue in Google Cloud Console',
      suggestedRemediation:
        'Kredensial Google OAuth atau Gemini API Key tidak valid. Verifikasi kunci di console pengembang.',
    }
  }

  // 4. Telegram 409 conflict
  if (
    /(?:409 Conflict|getUpdates|terminated by other|conflict: terminated|hermes gateway)/i.test(
      errorText
    )
  ) {
    return {
      category: 'telegram_conflict',
      severity: 'medium',
      suggestedCommand: 'hermes gateway stop; hermes gateway start',
      suggestedRemediation:
        'Bot Telegram aktif di tempat lain atau polling bertabrakan. Hentikan instance kembar dan restart gateway.',
    }
  }

  // 5. Windows Permissions / EPERM
  if (
    /(?:EPERM|Access is denied|Access denied|Permission denied|operation not permitted)/i.test(
      errorText
    )
  ) {
    return {
      category: 'permissions_eperm',
      severity: 'high',
      suggestedCommand: 'Start-Process powershell -Verb RunAs',
      suggestedRemediation:
        'Hak akses Administrator diperlukan untuk menulis ke direktori program atau menginstal paket global.',
    }
  }

  // 6. Network / Timeout / Connection refused
  if (
    /(?:ETIMEDOUT|ENOTFOUND|ECONNREFUSED|fetch failed|socket hang up)/i.test(
      errorText
    )
  ) {
    return {
      category: 'network_runtime',
      severity: 'medium',
      suggestedCommand:
        'Test-NetConnection -ComputerName generativelanguage.googleapis.com -Port 443',
      suggestedRemediation:
        'Koneksi jaringan terputus atau proxy instansi memblokir panggilan API. Uji konektivitas gateway.',
    }
  }

  // 7. Fallback other
  return {
    category: 'other',
    severity: 'low',
    suggestedRemediation:
      'Kendala umum di luar kategori terdefinisi. Periksa detail log terminal untuk analisis manual.',
  }
}

/**
 * Initial representative classroom seed incidents
 */
function createSeedIncidents(): TroubleshootingLogRecord[] {
  const now = Date.now()
  return [
    {
      id: 'inc-seed-01',
      timestamp: now - 1000 * 60 * 35,
      participantId: 'usr-budi-pratama',
      participantName: 'Budi Pratama (Bappeda)',
      courseId: 'ai',
      category: 'port_conflict',
      severity: 'high',
      rawErrorText:
        'Error: listen EADDRINUSE: address already in use :::20128\n    at Server.setupListenHandle [as _listen2] (node:net:1904:16)',
      problemStep: 'Modul 2 - Menjalankan 9Router',
      os: 'Windows 11',
      status: 'open',
      suggestedCommand:
        'Stop-Process -Id (Get-NetTCPConnection -LocalPort 20128).OwningProcess -Force',
      suggestedRemediation:
        'Port 20128 digunakan proses lain. Hentikan proses yang memblokir port lalu jalankan ulang 9Router.',
    },
    {
      id: 'inc-seed-02',
      timestamp: now - 1000 * 60 * 25,
      participantId: 'usr-siti-nurhaliza',
      participantName: 'Siti Nurhaliza (Diskominfo)',
      courseId: 'ai',
      category: 'powershell_policy',
      severity: 'medium',
      rawErrorText:
        'File C:\\Users\\[USER]\\AppData\\Roaming\\npm\\9router.ps1 cannot be loaded because running scripts is disabled on this system.',
      problemStep: 'Modul 2 - Instalasi 9Router CLI',
      os: 'Windows 10',
      status: 'investigating',
      suggestedCommand:
        'Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass',
      suggestedRemediation:
        'PowerShell memblokir eksekusi skrip otomatis. Ubah kebijakan eksekusi untuk sesi terminal saat ini.',
      instructorNotes:
        'Sedang dipandu mengubah execution policy via chat kelas.',
    },
    {
      id: 'inc-seed-03',
      timestamp: now - 1000 * 60 * 18,
      participantId: 'usr-agus-setiawan',
      participantName: 'Agus Setiawan (Inspektorat)',
      courseId: 'ai',
      category: 'oauth_api_key',
      severity: 'critical',
      rawErrorText:
        '401 Unauthorized: Invalid API Key provided for Gemini 2.0 Flash model endpoint.',
      problemStep: 'Modul 3 - Konfigurasi Gemini API',
      os: 'Windows 11',
      status: 'open',
      suggestedCommand:
        'Check API Key in 9Router config or re-issue in Google Cloud Console',
      suggestedRemediation:
        'Kredensial Google OAuth atau Gemini API Key tidak valid. Verifikasi kunci di console pengembang.',
    },
    {
      id: 'inc-seed-04',
      timestamp: now - 1000 * 60 * 12,
      participantId: 'usr-dewi-lestari',
      participantName: 'Dewi Lestari (BKPSDM)',
      courseId: 'ai',
      category: 'telegram_conflict',
      severity: 'medium',
      rawErrorText:
        'TelegramError: 409 Conflict: terminated by other getUpdates request; make sure that only one bot instance is running',
      problemStep: 'Modul 4 - Polling Gateway Telegram',
      os: 'Windows 11',
      status: 'open',
      suggestedCommand: 'hermes gateway stop; hermes gateway start',
      suggestedRemediation:
        'Bot Telegram aktif di tempat lain atau polling bertabrakan. Hentikan instance kembar dan restart gateway.',
    },
    {
      id: 'inc-seed-05',
      timestamp: now - 1000 * 60 * 8,
      participantId: 'usr-hendra-wijaya',
      participantName: 'Hendra Wijaya (Dinas Pendidikan)',
      courseId: 'word',
      category: 'permissions_eperm',
      severity: 'high',
      rawErrorText:
        'npm ERR! code EPERM\nnpm ERR! syscall open\nnpm ERR! path C:\\Program Files\\nodejs\\node_modules\nnpm ERR! errno -4048\nnpm ERR! Error: EPERM: operation not permitted',
      problemStep: 'Langkah 1 - Setup Lingkungan Word',
      os: 'Windows 10',
      status: 'investigating',
      suggestedCommand: 'Start-Process powershell -Verb RunAs',
      suggestedRemediation:
        'Hak akses Administrator diperlukan untuk menulis ke direktori program atau menginstal paket global.',
      instructorNotes: 'Mengarahkan peserta buka Terminal as Administrator.',
    },
    {
      id: 'inc-seed-06',
      timestamp: now - 1000 * 60 * 45,
      participantId: 'usr-rina-astuti',
      participantName: 'Rina Astuti (Dinas Kesehatan)',
      courseId: 'ai',
      category: 'network_runtime',
      severity: 'medium',
      rawErrorText:
        'FetchError: request to https://generativelanguage.googleapis.com failed, reason: connect ETIMEDOUT 142.250.190.42:443',
      problemStep: 'Modul 3 - Uji Koneksi API',
      os: 'Windows 11',
      status: 'resolved',
      suggestedCommand:
        'Test-NetConnection -ComputerName generativelanguage.googleapis.com -Port 443',
      suggestedRemediation:
        'Koneksi jaringan terputus atau proxy instansi memblokir panggilan API. Uji konektivitas gateway.',
      instructorNotes:
        'Peserta beralih dari WiFi kantor yang memblokir Google API ke tethering seluler. Masalah tuntas.',
      resolvedAt: now - 1000 * 60 * 30,
    },
  ]
}

// In-memory persistent incidents store
let incidentsStore: TroubleshootingLogRecord[] = createSeedIncidents()

/**
 * Ingests a new troubleshooting error report with automatic dual-layer redaction
 * and regex classification.
 * Requirements: ADMIN-LOG-01, T-32-04
 */
export function ingestTroubleshootingLog(
  input: IngestTroubleshootingInput
): TroubleshootingLogRecord {
  const rawCandidate = input.errorMsg || input.rawError || ''
  const participantId = input.participantId || input.clientId || 'usr-anonymous'
  const problemStep = input.problemStep || input.step

  // Dual-layer redaction on all user text inputs
  const sanitizedError = sanitizeLogText(rawCandidate).sanitized
  const sanitizedStep = problemStep ? sanitizeLogText(problemStep).sanitized : undefined

  // Auto-classify using sanitized error
  const classification = classifyErrorLog(sanitizedError)

  const record: TroubleshootingLogRecord = {
    id: `inc-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
    timestamp: Date.now(),
    participantId,
    participantName: input.participantName,
    courseId: input.courseId || 'ai',
    category: classification.category,
    severity: classification.severity,
    rawErrorText: sanitizedError,
    problemStep: sanitizedStep,
    os: input.os,
    status: 'open',
    suggestedCommand: classification.suggestedCommand,
    suggestedRemediation: classification.suggestedRemediation,
  }

  incidentsStore.unshift(record)
  if (incidentsStore.length > 1000) {
    incidentsStore = incidentsStore.slice(0, 1000)
  }
  return record
}

/**
 * Retrieves troubleshooting incident logs with multi-criteria filtering
 * Requirements: ADMIN-LOG-02
 */
export function getTroubleshootingLogs(
  filter?: TroubleshootingFilter
): TroubleshootingLogRecord[] {
  let results = [...incidentsStore]

  if (filter) {
    if (filter.category && filter.category !== 'all') {
      results = results.filter((r) => r.category === filter.category)
    }

    if (filter.severity && filter.severity !== 'all') {
      results = results.filter((r) => r.severity === filter.severity)
    }

    if (filter.status && filter.status !== 'all') {
      results = results.filter((r) => r.status === filter.status)
    }

    if (filter.courseId && filter.courseId !== 'all') {
      results = results.filter((r) => r.courseId === filter.courseId)
    }

    if (filter.search && filter.search.trim()) {
      const q = filter.search.trim().toLowerCase()
      results = results.filter(
        (r) =>
          r.id.toLowerCase().includes(q) ||
          r.rawErrorText.toLowerCase().includes(q) ||
          (r.participantName && r.participantName.toLowerCase().includes(q)) ||
          r.participantId.toLowerCase().includes(q) ||
          (r.problemStep && r.problemStep.toLowerCase().includes(q)) ||
          (r.instructorNotes && r.instructorNotes.toLowerCase().includes(q))
      )
    }

    if (typeof filter.limit === 'number' && filter.limit > 0) {
      results = results.slice(0, filter.limit)
    }
  }

  // Sort descending by timestamp
  results.sort((a, b) => b.timestamp - a.timestamp)
  return results
}

// Alias matching prompt
export const getTroubleshootingIncidents = getTroubleshootingLogs

/**
 * Computes aggregated incident statistics and frequency KPIs
 * Requirements: ADMIN-LOG-02
 */
export function getTroubleshootingStats(): TroubleshootingStats {
  const categoryCounts: Record<string, number> = {
    port_conflict: 0,
    powershell_policy: 0,
    oauth_api_key: 0,
    telegram_conflict: 0,
    permissions_eperm: 0,
    network_runtime: 0,
    other: 0,
  }

  let openCount = 0
  let investigatingCount = 0
  let resolvedCount = 0

  for (const record of incidentsStore) {
    categoryCounts[record.category] = (categoryCounts[record.category] || 0) + 1
    if (record.status === 'open') {
      openCount++
    } else if (record.status === 'investigating') {
      investigatingCount++
    } else if (record.status === 'resolved') {
      resolvedCount++
    }
  }

  let topCategory = 'other'
  let highestCount = -1
  for (const [cat, count] of Object.entries(categoryCounts)) {
    if (count > highestCount) {
      highestCount = count
      topCategory = cat
    }
  }

  return {
    totalIncidents: incidentsStore.length,
    categoryCounts,
    openCount,
    investigatingCount,
    resolvedCount,
    topCategory: incidentsStore.length > 0 ? topCategory : 'none',
  }
}

// Alias matching prompt
export const getTroubleshootingKPIs = getTroubleshootingStats

/**
 * Updates status, notes, or resolution for an incident
 * Requirements: ADMIN-LOG-02
 */
export function updateTroubleshootingStatus(
  input: UpdateTroubleshootingStatusInput
): TroubleshootingLogRecord | null {
  const targetId = input.id || input.incidentId
  const index = incidentsStore.findIndex((r) => r.id === targetId)
  if (index === -1) {
    return null
  }

  const existing = incidentsStore[index]
  const isNowResolved = input.status === 'resolved' && existing.status !== 'resolved'

  const updated: TroubleshootingLogRecord = {
    ...existing,
    status: input.status,
    instructorNotes:
      input.instructorNotes !== undefined
        ? input.instructorNotes
        : existing.instructorNotes,
    resolvedAt: isNowResolved
      ? Date.now()
      : input.status !== 'resolved'
        ? undefined
        : existing.resolvedAt,
  }

  incidentsStore[index] = updated
  return updated
}

// Alias matching prompt
export const updateIncidentStatus = updateTroubleshootingStatus

/**
 * Clears troubleshooting store for test suites or resets to clean state
 */
export function clearTroubleshootingStoreForTesting(): void {
  incidentsStore = []
}

/**
 * Resets troubleshooting store back to default seed data
 */
export function resetTroubleshootingStoreWithSeeds(): void {
  incidentsStore = createSeedIncidents()
}
