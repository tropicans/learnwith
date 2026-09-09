import type {
  ParticipantTelemetryInput,
  ParticipantRecord,
  TelemetryQueryFilter,
  TelemetryDashboardStats,
} from '../schemas/telemetry.ts'

// In-memory participant telemetry storage
const participantRegistry = new Map<string, ParticipantRecord>()

/**
 * Ingest or update a participant telemetry record.
 * Idempotent based on participantId.
 */
export function ingestTelemetry(input: ParticipantTelemetryInput): ParticipantRecord {
  const now = Date.now()
  const existing = participantRegistry.get(input.participantId)

  const record: ParticipantRecord = {
    ...input,
    serverReceivedAt: existing ? existing.serverReceivedAt : now,
    lastActiveAt: now,
  }

  participantRegistry.set(input.participantId, record)
  return record
}

/**
 * Retrieve participants sorted by latest activity with optional filtering.
 */
export function getParticipants(filter?: TelemetryQueryFilter): ParticipantRecord[] {
  initSeedDataIfEmpty()

  let list = Array.from(participantRegistry.values()).sort(
    (a, b) => b.lastActiveAt - a.lastActiveAt
  )

  if (!filter) return list

  if (filter.courseId && filter.courseId !== 'all') {
    list = list.filter((p) => p.courseId === filter.courseId)
  }

  if (filter.readiness && filter.readiness !== 'all') {
    list = list.filter((p) => p.readinessStatus === filter.readiness)
  }

  if (filter.search && filter.search.trim().length > 0) {
    const q = filter.search.trim().toLowerCase()
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.agency.toLowerCase().includes(q) ||
        p.participantId.toLowerCase().includes(q)
    )
  }

  return list
}

/**
 * Retrieve single participant record by ID.
 */
export function getParticipantById(id: string): ParticipantRecord | null {
  initSeedDataIfEmpty()
  return participantRegistry.get(id) || null
}

/**
 * Calculate aggregate KPI metrics across all participants.
 */
export function getTelemetryStats(): TelemetryDashboardStats {
  initSeedDataIfEmpty()

  const all = Array.from(participantRegistry.values())
  const totalParticipants = all.length

  if (totalParticipants === 0) {
    return {
      totalParticipants: 0,
      activeParticipants: 0,
      checkpointCompletionRate: 0,
      averageQuizScore: 0,
      readyRatio: 0,
      clinicRatio: 0,
    }
  }

  const fifteenMinutesAgo = Date.now() - 15 * 60 * 1000
  const activeParticipants = all.filter((p) => p.lastActiveAt >= fifteenMinutesAgo).length

  let totalPassedCheckpoints = 0
  let totalPossibleCheckpoints = 0
  let totalQuizScore = 0
  let quizTakersCount = 0
  let readyCount = 0
  let clinicCount = 0

  for (const p of all) {
    const cpValues = Object.values(p.checkpoints)
    totalPossibleCheckpoints += cpValues.length
    totalPassedCheckpoints += cpValues.filter((v) => v === 'passed').length

    if (p.quizScore !== undefined && typeof p.quizScore === 'number') {
      totalQuizScore += p.quizScore
      quizTakersCount++
    }

    if (p.readinessStatus === 'ready') readyCount++
    if (p.readinessStatus === 'clinic') clinicCount++
  }

  const checkpointCompletionRate =
    totalPossibleCheckpoints > 0
      ? Math.round((totalPassedCheckpoints / totalPossibleCheckpoints) * 100)
      : 0

  const averageQuizScore =
    quizTakersCount > 0 ? Math.round(totalQuizScore / quizTakersCount) : 0

  const readyRatio = Math.round((readyCount / totalParticipants) * 100)
  const clinicRatio = Math.round((clinicCount / totalParticipants) * 100)

  return {
    totalParticipants,
    activeParticipants,
    checkpointCompletionRate,
    averageQuizScore,
    readyRatio,
    clinicRatio,
  }
}

/**
 * Seed data for offline development and initial admin preview.
 */
export function initSeedDataIfEmpty(): void {
  if (participantRegistry.size > 0) return

  const now = Date.now()
  const minute = 60 * 1000

  const sampleParticipants: ParticipantRecord[] = [
    {
      participantId: 'usr-ai-01',
      name: 'Ahmad Fauzi, S.Kom',
      agency: 'Diskominfotik DKI Jakarta',
      courseId: 'ai',
      progressPercent: 100,
      completedTasks: 13,
      totalTasks: 13,
      checkpoints: { 'cp-1': 'passed', 'cp-2': 'passed', 'cp-3': 'passed' },
      readinessStatus: 'ready',
      taskChecklist: {
        'm1-check-node': true,
        'm1-verify-lts': true,
        'm1-check-npm': true,
        'm2-install-pkg': true,
        'm2-start-service': true,
        'm2-open-dashboard': true,
        'm2-verify-local': true,
        'm3-start-botfather': true,
        'm3-create-newbot': true,
        'm3-save-token-secure': true,
        'm3-get-userid': true,
        'm4-open-console': true,
        'm4-verify-login': true,
      },
      clientTimestamp: now - 3 * minute,
      serverReceivedAt: now - 3 * minute,
      lastActiveAt: now - 2 * minute,
    },
    {
      participantId: 'usr-word-01',
      name: 'Dewi Kartika, S.AP',
      agency: 'BPSDM Provinsi DKI Jakarta',
      courseId: 'word',
      progressPercent: 100,
      completedTasks: 28,
      totalTasks: 28,
      checkpoints: { 'word-cp-1': 'passed', 'word-cp-2': 'passed', 'word-cp-3': 'passed' },
      readinessStatus: 'ready',
      quizScore: 95,
      taskChecklist: {
        'word-b1-nav-ribbon': true,
        'word-b1-font-paragraf': true,
        'word-b2-custom-style': true,
        'word-b2-daftar-isi': true,
        'word-b3-page-break': true,
        'word-b3-header-footer': true,
        'word-b4-mailmerge': true,
        'word-b4-label-amplop': true,
        'word-b5-eval-quiz': true,
      },
      clientTimestamp: now - 8 * minute,
      serverReceivedAt: now - 8 * minute,
      lastActiveAt: now - 5 * minute,
    },
    {
      participantId: 'usr-ai-02',
      name: 'Budi Santoso, M.Si',
      agency: 'Bappeda DKI Jakarta',
      courseId: 'ai',
      progressPercent: 73,
      completedTasks: 10,
      totalTasks: 13,
      checkpoints: { 'cp-1': 'passed', 'cp-2': 'failed', 'cp-3': 'pending' },
      readinessStatus: 'clinic',
      taskChecklist: {
        'm1-check-node': true,
        'm1-verify-lts': true,
        'm1-check-npm': true,
        'm2-install-pkg': true,
        'm2-start-service': true,
        'm2-open-dashboard': true,
        'm2-verify-local': false,
        'm3-start-botfather': true,
        'm3-create-newbot': true,
        'm3-save-token-secure': false,
        'm3-get-userid': true,
        'm4-open-console': true,
        'm4-verify-login': false,
      },
      clientTimestamp: now - 12 * minute,
      serverReceivedAt: now - 12 * minute,
      lastActiveAt: now - 10 * minute,
    },
    {
      participantId: 'usr-word-02',
      name: 'Rina Marlina, S.Sos',
      agency: 'Badan Kepegawaian Daerah (BKD)',
      courseId: 'word',
      progressPercent: 87,
      completedTasks: 24,
      totalTasks: 28,
      checkpoints: { 'word-cp-1': 'passed', 'word-cp-2': 'passed', 'word-cp-3': 'pending' },
      readinessStatus: 'pending',
      quizScore: 85,
      taskChecklist: {
        'word-b1-nav-ribbon': true,
        'word-b1-font-paragraf': true,
        'word-b2-custom-style': true,
        'word-b2-daftar-isi': true,
        'word-b3-page-break': true,
        'word-b3-header-footer': true,
        'word-b4-mailmerge': true,
        'word-b4-label-amplop': false,
        'word-b5-eval-quiz': true,
      },
      clientTimestamp: now - 18 * minute,
      serverReceivedAt: now - 18 * minute,
      lastActiveAt: now - 14 * minute,
    },
    {
      participantId: 'usr-ai-03',
      name: 'Hendra Gunawan, S.T',
      agency: 'Dinas Cipta Karya & Tata Ruang',
      courseId: 'ai',
      progressPercent: 35,
      completedTasks: 5,
      totalTasks: 13,
      checkpoints: { 'cp-1': 'passed', 'cp-2': 'pending', 'cp-3': 'pending' },
      readinessStatus: 'pending',
      taskChecklist: {
        'm1-check-node': true,
        'm1-verify-lts': true,
        'm1-check-npm': true,
        'm2-install-pkg': true,
        'm2-start-service': true,
        'm2-open-dashboard': false,
        'm2-verify-local': false,
        'm3-start-botfather': false,
        'm3-create-newbot': false,
        'm3-save-token-secure': false,
        'm3-get-userid': false,
        'm4-open-console': false,
        'm4-verify-login': false,
      },
      clientTimestamp: now - 25 * minute,
      serverReceivedAt: now - 25 * minute,
      lastActiveAt: now - 20 * minute,
    },
    {
      participantId: 'usr-word-03',
      name: 'Siti Nurhaliza, S.E',
      agency: 'Dinas Pendidikan DKI Jakarta',
      courseId: 'word',
      progressPercent: 100,
      completedTasks: 28,
      totalTasks: 28,
      checkpoints: { 'word-cp-1': 'passed', 'word-cp-2': 'passed', 'word-cp-3': 'passed' },
      readinessStatus: 'ready',
      quizScore: 90,
      taskChecklist: {
        'word-b1-nav-ribbon': true,
        'word-b1-font-paragraf': true,
        'word-b2-custom-style': true,
        'word-b2-daftar-isi': true,
        'word-b3-page-break': true,
        'word-b3-header-footer': true,
        'word-b4-mailmerge': true,
        'word-b4-label-amplop': true,
        'word-b5-eval-quiz': true,
      },
      clientTimestamp: now - 35 * minute,
      serverReceivedAt: now - 35 * minute,
      lastActiveAt: now - 28 * minute,
    },
    {
      participantId: 'usr-ai-04',
      name: 'Reza Pratama, S.Kom',
      agency: 'Diskominfotik DKI Jakarta',
      courseId: 'ai',
      progressPercent: 60,
      completedTasks: 8,
      totalTasks: 13,
      checkpoints: { 'cp-1': 'pending', 'cp-2': 'pending', 'cp-3': 'pending' },
      readinessStatus: 'pending',
      taskChecklist: {
        'm1-check-node': true,
        'm1-verify-lts': true,
        'm1-check-npm': true,
        'm2-install-pkg': true,
        'm2-start-service': true,
        'm2-open-dashboard': true,
        'm2-verify-local': true,
        'm3-start-botfather': true,
        'm3-create-newbot': false,
        'm3-save-token-secure': false,
        'm3-get-userid': false,
        'm4-open-console': false,
        'm4-verify-login': false,
      },
      clientTimestamp: now - 45 * minute,
      serverReceivedAt: now - 45 * minute,
      lastActiveAt: now - 35 * minute,
    },
    {
      participantId: 'usr-word-04',
      name: 'Tri Wahyuni, M.M',
      agency: 'Dinas Kesehatan DKI Jakarta',
      courseId: 'word',
      progressPercent: 65,
      completedTasks: 18,
      totalTasks: 28,
      checkpoints: { 'word-cp-1': 'passed', 'word-cp-2': 'failed', 'word-cp-3': 'pending' },
      readinessStatus: 'clinic',
      quizScore: 70,
      taskChecklist: {
        'word-b1-nav-ribbon': true,
        'word-b1-font-paragraf': true,
        'word-b2-custom-style': true,
        'word-b2-daftar-isi': true,
        'word-b3-page-break': true,
        'word-b3-header-footer': false,
        'word-b4-mailmerge': false,
        'word-b4-label-amplop': false,
        'word-b5-eval-quiz': true,
      },
      clientTimestamp: now - 55 * minute,
      serverReceivedAt: now - 55 * minute,
      lastActiveAt: now - 42 * minute,
    },
  ]

  for (const p of sampleParticipants) {
    participantRegistry.set(p.participantId, p)
  }
}

/**
 * Test helper to reset store state.
 */
export function clearTelemetryStoreForTesting(): void {
  participantRegistry.clear()
}

/**
 * Return current registry record count.
 */
export function getStoreSize(): number {
  return participantRegistry.size
}
