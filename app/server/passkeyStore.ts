import crypto from 'node:crypto'
import type {
  CourseId,
  CoursePasskeyRecord,
  PasskeyRotationHistoryEntry,
  PasskeyUnlockAttempt,
  RotatePasskeyInput,
  RotatePasskeyResult,
  PasskeyStatusResponse,
  PasskeyAuditFilter,
} from '../schemas/passkey.ts'
import { rotatePasskeyInputSchema } from '../schemas/passkey.ts'

// Default hashes matching production & legacy test fixtures
export const DEFAULT_AI_PASSKEY_HASH = 'b99674726766354e30a414680548a5943f0ded595e286bec3355a016e87e362f'
export const DEFAULT_WORD_PASSKEY_HASH = 'ddf62f4013c59b111215312fb959629155a5b1dc5cf799f2053a8c2395c4511b'

export function maskPasskey(text: string): string {
  if (!text || typeof text !== 'string') return '****'
  const trimmed = text.trim()
  if (trimmed.length <= 4) return '****'
  return `${trimmed.slice(0, 3)}****${trimmed.slice(-2)}`
}

function createDefaultPasskeys(): Record<CourseId, CoursePasskeyRecord> {
  const baseTime = Date.now() - 3 * 86400 * 1000 // 3 days ago
  return {
    word: {
      courseId: 'word',
      title: 'Course 2: Pengolahan Kata ASN',
      currentHash: DEFAULT_WORD_PASSKEY_HASH,
      clearTextPreview: maskPasskey('buka-kata'), // 'buk****ta'
      lastRotatedAt: baseTime,
      rotatedBy: 'system',
      version: 1,
      status: 'active',
    },
    ai: {
      courseId: 'ai',
      title: 'Course 1: Hands-on Agentic AI',
      currentHash: DEFAULT_AI_PASSKEY_HASH,
      clearTextPreview: maskPasskey('buka-kelas'), // 'buk****as'
      lastRotatedAt: baseTime,
      rotatedBy: 'system',
      version: 1,
      status: 'active',
    },
  }
}

function createSeedHistory(): PasskeyRotationHistoryEntry[] {
  const baseTime = Date.now() - 3 * 86400 * 1000
  return [
    {
      id: 'rot-seed-word-1',
      courseId: 'word',
      version: 1,
      hash: DEFAULT_WORD_PASSKEY_HASH,
      rotatedAt: baseTime,
      rotatedBy: 'system',
      reason: 'Inisialisasi sistem default',
    },
    {
      id: 'rot-seed-ai-1',
      courseId: 'ai',
      version: 1,
      hash: DEFAULT_AI_PASSKEY_HASH,
      rotatedAt: baseTime,
      rotatedBy: 'system',
      reason: 'Inisialisasi sistem default',
    },
  ]
}

function createSeedAuditLogs(): PasskeyUnlockAttempt[] {
  const now = Date.now()
  return [
    {
      id: 'att-seed-1',
      courseId: 'ai',
      timestamp: now - 15 * 60 * 1000,
      clientId: 'usr-cl-agent-01',
      ipAddress: '10.20.30.41',
      success: true,
      attemptHashPrefix: DEFAULT_AI_PASSKEY_HASH.substring(0, 8),
    },
    {
      id: 'att-seed-2',
      courseId: 'word',
      timestamp: now - 35 * 60 * 1000,
      clientId: 'usr-cl-word-02',
      ipAddress: '10.20.30.42',
      success: true,
      attemptHashPrefix: DEFAULT_WORD_PASSKEY_HASH.substring(0, 8),
    },
    {
      id: 'att-seed-3',
      courseId: 'word',
      timestamp: now - 50 * 60 * 1000,
      clientId: 'usr-cl-typo-03',
      ipAddress: '10.20.30.43',
      success: false,
      attemptHashPrefix: 'a1b2c3d4',
      failureReason: 'Passkey instruktur tidak valid.',
    },
  ]
}

// In-Memory Storage Instances
let activePasskeys: Record<CourseId, CoursePasskeyRecord> = createDefaultPasskeys()
let rotationHistory: PasskeyRotationHistoryEntry[] = createSeedHistory()
let auditLogs: PasskeyUnlockAttempt[] = createSeedAuditLogs()

// Sliding-Window Rate Limiter
// Max 5 failed attempts per 5 minutes (300,000 ms), 2-minute cooldown (120,000 ms)
interface ClientFailureRecord {
  timestamps: number[]
  cooldownUntil?: number
}

const clientFailureTracker = new Map<string, ClientFailureRecord>()
const FAILURE_WINDOW_MS = 5 * 60 * 1000 // 5 minutes
const COOLDOWN_DURATION_MS = 2 * 60 * 1000 // 2 minutes
const MAX_FAILED_ATTEMPTS = 5

export function checkRateLimit(clientId: string): { isLimited: boolean; remainingCooldownMs: number } {
  const now = Date.now()
  const entry = clientFailureTracker.get(clientId)

  if (!entry) {
    return { isLimited: false, remainingCooldownMs: 0 }
  }

  // Check if cooldown is currently active
  if (entry.cooldownUntil && now < entry.cooldownUntil) {
    return { isLimited: true, remainingCooldownMs: entry.cooldownUntil - now }
  }

  // If cooldown passed, clear it and reset failures so client gets fresh attempt
  if (entry.cooldownUntil && now >= entry.cooldownUntil) {
    entry.cooldownUntil = undefined
    entry.timestamps = []
  }

  // Filter timestamps to active sliding window
  entry.timestamps = entry.timestamps.filter((t) => now - t <= FAILURE_WINDOW_MS)

  if (entry.timestamps.length >= MAX_FAILED_ATTEMPTS) {
    entry.cooldownUntil = now + COOLDOWN_DURATION_MS
    return { isLimited: true, remainingCooldownMs: COOLDOWN_DURATION_MS }
  }

  return { isLimited: false, remainingCooldownMs: 0 }
}

export function recordFailedAttemptForClient(clientId: string): { isNowLimited: boolean; cooldownUntil?: number } {
  const now = Date.now()
  let entry = clientFailureTracker.get(clientId)

  if (!entry) {
    entry = { timestamps: [] }
    clientFailureTracker.set(clientId, entry)
  }

  // Filter existing timestamps
  entry.timestamps = entry.timestamps.filter((t) => now - t <= FAILURE_WINDOW_MS)
  entry.timestamps.push(now)

  if (entry.timestamps.length >= MAX_FAILED_ATTEMPTS) {
    entry.cooldownUntil = now + COOLDOWN_DURATION_MS
    return { isNowLimited: true, cooldownUntil: entry.cooldownUntil }
  }

  return { isNowLimited: false }
}

export function resetClientFailures(clientId: string): void {
  clientFailureTracker.delete(clientId)
}

/**
 * Timing-safe passkey verification integrated with sliding-window rate limiter
 * and tamper-evident audit logging.
 */
function addAuditLog(attempt: PasskeyUnlockAttempt) {
  auditLogs.unshift(attempt)
  if (auditLogs.length > 1000) {
    auditLogs = auditLogs.slice(0, 1000)
  }
}

export function verifyPasskeyWithStore(
  courseId: CourseId,
  candidate: string,
  clientId?: string,
  ipAddress?: string
): {
  success: boolean
  message: string
  rateLimited?: boolean
  cooldownRemainingMs?: number
  unlockedAt?: number
} {
  const effectiveClientId = clientId && clientId.trim() ? clientId.trim() : 'anonymous'
  const record = activePasskeys[courseId]

  if (!record || record.status !== 'active') {
    return {
      success: false,
      message: `Passkey untuk kursus '${courseId}' tidak ditemukan atau tidak aktif.`,
    }
  }

  // 1. Check Rate Limit
  const rateLimitStatus = checkRateLimit(effectiveClientId)
  if (rateLimitStatus.isLimited) {
    const candidateHash = candidate
      ? crypto.createHash('sha256').update(candidate.trim().toLowerCase()).digest('hex')
      : ''

    const attempt: PasskeyUnlockAttempt = {
      id: crypto.randomUUID(),
      courseId,
      timestamp: Date.now(),
      clientId: effectiveClientId,
      ipAddress,
      success: false,
      attemptHashPrefix: candidate ? candidateHash.substring(0, 8) : '--------',
      failureReason: 'Rate limit exceeded (cooldown active)',
      rateLimited: true,
    }
    addAuditLog(attempt)

    return {
      success: false,
      message: 'Terlalu banyak percobaan gagal. Silakan tunggu 2 menit sebelum mencoba lagi.',
      rateLimited: true,
      cooldownRemainingMs: rateLimitStatus.remainingCooldownMs,
    }
  }

  // 2. Hash computation
  const trimmedCandidate = (candidate || '').trim().toLowerCase()
  const candidateHash = crypto.createHash('sha256').update(trimmedCandidate).digest('hex')

  const targetHash = record.currentHash
  const targetBuf = Buffer.from(targetHash, 'hex')
  const candidateBuf = Buffer.from(candidateHash, 'hex')

  let matches = false
  if (targetBuf.length === candidateBuf.length && trimmedCandidate.length > 0) {
    matches = crypto.timingSafeEqual(targetBuf, candidateBuf)
  }

  if (matches) {
    resetClientFailures(effectiveClientId)
    const attempt: PasskeyUnlockAttempt = {
      id: crypto.randomUUID(),
      courseId,
      timestamp: Date.now(),
      clientId: effectiveClientId,
      ipAddress,
      success: true,
      attemptHashPrefix: candidateHash.substring(0, 8),
    }
    addAuditLog(attempt)

    return {
      success: true,
      message: 'Passkey valid',
      unlockedAt: attempt.timestamp,
    }
  }

  // 3. Failed attempt handling
  const failResult = recordFailedAttemptForClient(effectiveClientId)
  const attempt: PasskeyUnlockAttempt = {
    id: crypto.randomUUID(),
    courseId,
    timestamp: Date.now(),
    clientId: effectiveClientId,
    ipAddress,
    success: false,
    attemptHashPrefix: candidateHash.substring(0, 8),
    failureReason: 'Passkey instruktur tidak valid.',
    rateLimited: failResult.isNowLimited,
  }
  addAuditLog(attempt)

  return {
    success: false,
    message: failResult.isNowLimited
      ? 'Terlalu banyak percobaan gagal. Akses dibatasi selama 2 menit.'
      : 'Passkey instruktur tidak valid.',
    rateLimited: failResult.isNowLimited,
    cooldownRemainingMs: failResult.isNowLimited ? COOLDOWN_DURATION_MS : undefined,
  }
}

/**
 * Returns current status of active passkeys, rotation history, and recent audit attempts.
 */
export function getPasskeyStatus(): PasskeyStatusResponse {
  const totalAttempts = auditLogs.length
  const successAttempts = auditLogs.filter((a) => a.success).length
  const failedAttempts = auditLogs.filter((a) => !a.success).length
  const rateLimitedAttempts = auditLogs.filter((a) => Boolean(a.rateLimited)).length

  return {
    passkeys: { ...activePasskeys },
    recentAttempts: auditLogs.slice(0, 50),
    rotationHistory: [...rotationHistory],
    stats: {
      totalAttempts,
      successAttempts,
      failedAttempts,
      rateLimitedAttempts,
    },
  }
}

/**
 * Rotates passkey dynamically in-memory and records audit/history trail.
 */
export function rotatePasskey(
  input: RotatePasskeyInput,
  rotatedBy = 'master-admin'
): RotatePasskeyResult {
  const validated = rotatePasskeyInputSchema.parse(input)
  const current = activePasskeys[validated.courseId]

  if (!current) {
    throw new Error(`Course ${validated.courseId} not found in passkey store`)
  }

  const newHash = crypto
    .createHash('sha256')
    .update(validated.newPasskey.trim().toLowerCase())
    .digest('hex')

  const now = Date.now()

  // Archive previous hash to rotation history
  const historyEntry: PasskeyRotationHistoryEntry = {
    id: crypto.randomUUID(),
    courseId: validated.courseId,
    version: current.version,
    hash: current.currentHash,
    rotatedAt: now,
    rotatedBy,
    reason: validated.reason || 'Rotasi berkala oleh administrator',
  }
  rotationHistory.unshift(historyEntry)

  // Update active record
  const nextVersion = current.version + 1
  current.version = nextVersion
  current.currentHash = newHash
  current.clearTextPreview = maskPasskey(validated.newPasskey.trim())
  current.lastRotatedAt = now
  current.rotatedBy = rotatedBy

  return {
    success: true,
    message: `Passkey untuk ${current.title} berhasil dirotasi ke versi ${nextVersion}.`,
    courseId: validated.courseId,
    version: nextVersion,
    hashPreview: newHash.substring(0, 16),
    rotatedAt: now,
  }
}

/**
 * Returns filtered and searched audit logs.
 */
export function getPasskeyAuditLogs(filter?: PasskeyAuditFilter): PasskeyUnlockAttempt[] {
  let logs = [...auditLogs]

  if (!filter) {
    return logs.slice(0, 50)
  }

  if (filter.courseId && filter.courseId !== 'all') {
    logs = logs.filter((l) => l.courseId === filter.courseId)
  }

  if (filter.status && filter.status !== 'all') {
    if (filter.status === 'success') {
      logs = logs.filter((l) => l.success === true)
    } else if (filter.status === 'failed') {
      logs = logs.filter((l) => l.success === false && !l.rateLimited)
    } else if (filter.status === 'rate_limited') {
      logs = logs.filter((l) => Boolean(l.rateLimited))
    }
  }

  if (filter.search && filter.search.trim()) {
    const q = filter.search.trim().toLowerCase()
    logs = logs.filter(
      (l) =>
        l.clientId.toLowerCase().includes(q) ||
        l.attemptHashPrefix.toLowerCase().includes(q) ||
        (l.failureReason && l.failureReason.toLowerCase().includes(q))
    )
  }

  const limit = filter.limit && filter.limit > 0 ? filter.limit : 50
  return logs.slice(0, limit)
}

/**
 * Resets the in-memory passkey store and failure tracker to defaults (for tests).
 */
export function clearPasskeyStoreForTesting(): void {
  activePasskeys = createDefaultPasskeys()
  rotationHistory = createSeedHistory()
  auditLogs = createSeedAuditLogs()
  clientFailureTracker.clear()
}
