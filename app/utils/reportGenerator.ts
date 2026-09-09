/**
 * Participant Readiness Report Generator Engine
 * Requirements: PRE-RPT-01, PRE-RPT-02, PRE-RPT-03, PRE-NAV-03
 * Produces standardized WhatsApp and Telegram formatted readiness reports.
 */

import { sanitizeLogText } from './redaction.ts'

export interface ParticipantInfoReport {
  name?: string
  nodeVersion?: string
  telegramUsername?: string
  telegramUserId?: string
}

export interface ReportOptions {
  name?: string
  os?: string
  probStep?: string
  errorMsg?: string
  participantInfo?: ParticipantInfoReport
  checkpoints?: Record<string, 'pending' | 'passed' | 'failed' | string>
  moduleChecklists?: Record<string, boolean>
  m4TasksComplete?: boolean
  status?: 'ready' | 'clinic' | 'pending' | string
  format?: 'whatsapp' | 'telegram'
}

/**
 * Normalizes a Telegram username to ensure a single '@' prefix.
 * e.g. "@@username" -> "username", "username" -> "username" (empty string remains empty)
 */
export function normalizeTelegramUsername(username?: string): string {
  if (!username) return ''
  return String(username).trim().replace(/^@+/, '')
}

/**
 * Pure generator creating formatted report text.
 */
export function generateReportText(overrides: ReportOptions = {}): string {
  const info = overrides.participantInfo || {}
  const cps = overrides.checkpoints || {}

  const name = overrides.name || info.name || '[Nama Anda]'
  const os = overrides.os || 'Windows 11 / Windows 10'

  // Checkpoints 1 - 3
  const cp1Mark = cps['cp-1'] === 'passed' ? '[X]' : '[ ]'
  const cp2Mark = cps['cp-2'] === 'passed' ? '[X]' : '[ ]'
  const cp3Mark = cps['cp-3'] === 'passed' ? '[X]' : '[ ]'

  // Module 4 (Google Cloud)
  let isM4Complete = false
  if (typeof overrides.m4TasksComplete === 'boolean') {
    isM4Complete = overrides.m4TasksComplete
  } else if (overrides.moduleChecklists) {
    const m4Open = overrides.moduleChecklists['m4-open-console'] === true
    const m4Verify = overrides.moduleChecklists['m4-verify-login'] === true
    isM4Complete = m4Open && m4Verify
  }
  const gcloudMark = isM4Complete ? '[X]' : '[ ]'

  // Status computation
  let statusState = overrides.status
  if (!statusState) {
    // If not provided, infer from checkpoints:
    const anyFailed = Object.values(cps).some((v) => v === 'failed')
    const allPassed =
      cps['cp-1'] === 'passed' &&
      cps['cp-2'] === 'passed' &&
      cps['cp-3'] === 'passed'
    if (anyFailed) {
      statusState = 'clinic'
    } else if (allPassed) {
      statusState = 'ready'
    } else {
      statusState = 'pending'
    }
  }

  let statusText = 'MENUNGGU VERIFIKASI'
  if (statusState === 'ready') {
    statusText = 'SIAP MENGIKUTI WORKSHOP'
  } else if (statusState === 'clinic') {
    statusText = 'PERLU TECHNICAL CLINIC'
  }

  // Problem step & Error msg
  const probStep = (overrides.probStep && overrides.probStep.trim()) ? overrides.probStep.trim() : 'Nihil'
  const rawError = (overrides.errorMsg && overrides.errorMsg.trim()) ? overrides.errorMsg.trim() : 'Nihil'
  const sanitizedError = (rawError === 'Nihil') ? 'Nihil' : sanitizeLogText(rawError).sanitized

  // Node version & telegram info
  const nodeVer = info.nodeVersion ? ` (${info.nodeVersion})` : ''
  const cleanTelegramUsername = normalizeTelegramUsername(info.telegramUsername)
  const tgInfo = (cleanTelegramUsername || info.telegramUserId)
    ? ` (${cleanTelegramUsername ? `@${cleanTelegramUsername}` : '-'}, ID: ${info.telegramUserId || '-'})`
    : ''

  if (overrides.format === 'telegram') {
    return `*Laporan Kesiapan Peserta Workshop*
Nama: \`${name}\`
Sistem operasi: \`${os}\`

${cp1Mark} Checkpoint 1 — Node.js dan npm siap${nodeVer}
${cp2Mark} Checkpoint 2 — dashboard 9Router terbuka
${cp3Mark} Checkpoint 3 — bot Telegram dan user ID siap${tgInfo}
${gcloudMark} Google Cloud Console dapat dibuka

Status: *${statusText}*
Nomor langkah yang bermasalah (jika ada): ${probStep}
Pesan error yang sudah disensor:
\`\`\`
${sanitizedError}
\`\`\``
  }

  // Default: Standard WhatsApp / Plaintext Markdown
  return `Nama: ${name}
Sistem operasi: ${os}

${cp1Mark} Checkpoint 1 — Node.js dan npm siap${nodeVer}
${cp2Mark} Checkpoint 2 — dashboard 9Router terbuka
${cp3Mark} Checkpoint 3 — bot Telegram dan user ID siap${tgInfo}
${gcloudMark} Google Cloud Console dapat dibuka

Status: ${statusText}
Nomor langkah yang bermasalah (jika ada): ${probStep}
Pesan error yang sudah disensor:
${sanitizedError}`
}
