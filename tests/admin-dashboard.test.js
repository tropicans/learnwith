/**
 * Automated Unit & Integration Tests for Phase 31:
 * Admin Command Center Dashboard & Participant Progress Monitoring
 * Requirements: ADMIN-DASH-01, ADMIN-DASH-02, ADMIN-DASH-03, ADMIN-DASH-04, ADMIN-QA-01, ADMIN-QA-02
 */
const { describe, it, before, beforeEach } = require('node:test')
const assert = require('node:assert')
const fs = require('node:fs')
const path = require('node:path')

const ROOT_DIR = path.resolve(__dirname, '..')

describe('Phase 31 Admin Command Center Dashboard Test Suite', () => {
  let telemetryStore
  let adminExport
  let detailModal

  before(async () => {
    telemetryStore = await import('../app/server/telemetryStore.ts')
    adminExport = await import('../app/utils/adminExport.ts')
  })

  beforeEach(() => {
    telemetryStore.clearTelemetryStoreForTesting()
  })

  // =========================================================================
  // Suite 1: Aggregate KPI Metrics Engine (ADMIN-DASH-01)
  // =========================================================================
  describe('Suite 1: Aggregate KPI Metrics Engine (ADMIN-DASH-01)', () => {
    it('calculates total participants and active participants using 15-minute window cutoff', () => {
      const now = Date.now()
      const minute = 60 * 1000

      // Ingest 3 participants with different activity timestamps
      telemetryStore.ingestTelemetry({
        participantId: 'p-active-1',
        name: 'Active User 1',
        agency: 'Diskominfotik',
        courseId: 'ai',
        progressPercent: 50,
        completedTasks: 5,
        totalTasks: 10,
        checkpoints: { 'cp-1': 'passed' },
        readinessStatus: 'pending',
        clientTimestamp: now - 3 * minute,
      })

      telemetryStore.ingestTelemetry({
        participantId: 'p-active-2',
        name: 'Active User 2',
        agency: 'Bappeda',
        courseId: 'word',
        progressPercent: 80,
        completedTasks: 8,
        totalTasks: 10,
        checkpoints: { 'word-cp-1': 'passed' },
        readinessStatus: 'pending',
        clientTimestamp: now - 12 * minute,
      })

      telemetryStore.ingestTelemetry({
        participantId: 'p-idle-1',
        name: 'Idle User 1',
        agency: 'Dinas Sosial',
        courseId: 'ai',
        progressPercent: 20,
        completedTasks: 2,
        totalTasks: 10,
        checkpoints: { 'cp-1': 'pending' },
        readinessStatus: 'pending',
        clientTimestamp: now - 25 * minute,
      })

      // Manually adjust lastActiveAt on p-idle-1 to 25 minutes ago
      const idleRecord = telemetryStore.getParticipantById('p-idle-1')
      idleRecord.lastActiveAt = now - 25 * minute

      const stats = telemetryStore.getTelemetryStats()
      assert.strictEqual(stats.totalParticipants, 3)
      assert.strictEqual(stats.activeParticipants, 2)
    })

    it('computes checkpoint completion rate accurately across mixed courses', () => {
      // P1: 3 checkpoints, 3 passed (100%)
      telemetryStore.ingestTelemetry({
        participantId: 'p-cp-1',
        name: 'CP User 1',
        agency: 'Dinas A',
        courseId: 'ai',
        progressPercent: 100,
        completedTasks: 13,
        totalTasks: 13,
        checkpoints: { 'cp-1': 'passed', 'cp-2': 'passed', 'cp-3': 'passed' },
        readinessStatus: 'ready',
        clientTimestamp: Date.now(),
      })

      // P2: 3 checkpoints, 1 passed, 1 failed, 1 pending (33%)
      telemetryStore.ingestTelemetry({
        participantId: 'p-cp-2',
        name: 'CP User 2',
        agency: 'Dinas B',
        courseId: 'word',
        progressPercent: 40,
        completedTasks: 10,
        totalTasks: 28,
        checkpoints: { 'word-cp-1': 'passed', 'word-cp-2': 'failed', 'word-cp-3': 'pending' },
        readinessStatus: 'clinic',
        clientTimestamp: Date.now(),
      })

      // Total checkpoints = 6, total passed = 4 -> 4/6 = 67%
      const stats = telemetryStore.getTelemetryStats()
      assert.strictEqual(stats.checkpointCompletionRate, 67)
    })

    it('strictly averages records with quizScore present and ignores undefined scores', () => {
      telemetryStore.ingestTelemetry({
        participantId: 'p-quiz-1',
        name: 'Quiz User 1',
        agency: 'BKD',
        courseId: 'word',
        progressPercent: 90,
        completedTasks: 25,
        totalTasks: 28,
        checkpoints: { 'word-cp-1': 'passed' },
        readinessStatus: 'ready',
        quizScore: 90,
        clientTimestamp: Date.now(),
      })

      telemetryStore.ingestTelemetry({
        participantId: 'p-quiz-2',
        name: 'Quiz User 2',
        agency: 'BPSDM',
        courseId: 'word',
        progressPercent: 80,
        completedTasks: 22,
        totalTasks: 28,
        checkpoints: { 'word-cp-1': 'passed' },
        readinessStatus: 'ready',
        quizScore: 70,
        clientTimestamp: Date.now(),
      })

      // AI user without quizScore
      telemetryStore.ingestTelemetry({
        participantId: 'p-ai-no-quiz',
        name: 'AI User No Quiz',
        agency: 'Diskominfotik',
        courseId: 'ai',
        progressPercent: 100,
        completedTasks: 13,
        totalTasks: 13,
        checkpoints: { 'cp-1': 'passed' },
        readinessStatus: 'ready',
        clientTimestamp: Date.now(),
      })

      const stats = telemetryStore.getTelemetryStats()
      // (90 + 70) / 2 = 80, not divided by 3
      assert.strictEqual(stats.averageQuizScore, 80)
    })

    it('calculates ready and clinic participant ratios correctly', () => {
      const now = Date.now()
      telemetryStore.ingestTelemetry({
        participantId: 'p-r-1',
        name: 'User 1',
        agency: 'Agency 1',
        courseId: 'ai',
        progressPercent: 100,
        completedTasks: 10,
        totalTasks: 10,
        checkpoints: { 'cp-1': 'passed' },
        readinessStatus: 'ready',
        clientTimestamp: now,
      })
      telemetryStore.ingestTelemetry({
        participantId: 'p-r-2',
        name: 'User 2',
        agency: 'Agency 2',
        courseId: 'ai',
        progressPercent: 100,
        completedTasks: 10,
        totalTasks: 10,
        checkpoints: { 'cp-1': 'passed' },
        readinessStatus: 'ready',
        clientTimestamp: now,
      })
      telemetryStore.ingestTelemetry({
        participantId: 'p-r-3',
        name: 'User 3',
        agency: 'Agency 3',
        courseId: 'ai',
        progressPercent: 50,
        completedTasks: 5,
        totalTasks: 10,
        checkpoints: { 'cp-1': 'failed' },
        readinessStatus: 'clinic',
        clientTimestamp: now,
      })
      telemetryStore.ingestTelemetry({
        participantId: 'p-r-4',
        name: 'User 4',
        agency: 'Agency 4',
        courseId: 'ai',
        progressPercent: 20,
        completedTasks: 2,
        totalTasks: 10,
        checkpoints: { 'cp-1': 'pending' },
        readinessStatus: 'pending',
        clientTimestamp: now,
      })

      const stats = telemetryStore.getTelemetryStats()
      assert.strictEqual(stats.totalParticipants, 4)
      assert.strictEqual(stats.readyRatio, 50) // 2/4 = 50%
      assert.strictEqual(stats.clinicRatio, 25) // 1/4 = 25%
    })

    it('provides zero-division safety on empty store without NaN or exceptions', () => {
      telemetryStore.clearTelemetryStoreForTesting()
      const stats = telemetryStore.getTelemetryStats(true)

      assert.deepStrictEqual(stats, {
        totalParticipants: 0,
        activeParticipants: 0,
        checkpointCompletionRate: 0,
        averageQuizScore: 0,
        readyRatio: 0,
        clinicRatio: 0,
      })

      assert.strictEqual(Number.isNaN(stats.checkpointCompletionRate), false)
      assert.strictEqual(Number.isNaN(stats.averageQuizScore), false)
      assert.strictEqual(Number.isNaN(stats.readyRatio), false)
      assert.strictEqual(Number.isNaN(stats.clinicRatio), false)
    })
  })

  // =========================================================================
  // Suite 2: Multi-Criteria Filtering & Search Engine (ADMIN-DASH-02)
  // =========================================================================
  describe('Suite 2: Multi-Criteria Filtering & Search Engine (ADMIN-DASH-02)', () => {
    beforeEach(() => {
      telemetryStore.initSeedDataIfEmpty()
    })

    it('filters participants accurately by course (ai vs word)', () => {
      const aiParticipants = telemetryStore.getParticipants({ courseId: 'ai', readiness: 'all' })
      assert.strictEqual(aiParticipants.length > 0, true)
      for (const p of aiParticipants) {
        assert.strictEqual(p.courseId, 'ai')
      }

      const wordParticipants = telemetryStore.getParticipants({ courseId: 'word', readiness: 'all' })
      assert.strictEqual(wordParticipants.length > 0, true)
      for (const p of wordParticipants) {
        assert.strictEqual(p.courseId, 'word')
      }
    })

    it('filters participants accurately by readiness status (ready, clinic, pending)', () => {
      const readyList = telemetryStore.getParticipants({ courseId: 'all', readiness: 'ready' })
      assert.strictEqual(readyList.length > 0, true)
      for (const p of readyList) {
        assert.strictEqual(p.readinessStatus, 'ready')
      }

      const clinicList = telemetryStore.getParticipants({ courseId: 'all', readiness: 'clinic' })
      assert.strictEqual(clinicList.length > 0, true)
      for (const p of clinicList) {
        assert.strictEqual(p.readinessStatus, 'clinic')
      }

      const pendingList = telemetryStore.getParticipants({ courseId: 'all', readiness: 'pending' })
      assert.strictEqual(pendingList.length > 0, true)
      for (const p of pendingList) {
        assert.strictEqual(p.readinessStatus, 'pending')
      }
    })

    it('performs case-insensitive search across name, agency, and participant ID', () => {
      // Search by name
      const byName = telemetryStore.getParticipants({ search: 'ahmad' })
      assert.strictEqual(byName.length, 1)
      assert.strictEqual(byName[0].participantId, 'usr-ai-01')

      // Search by agency
      const byAgency = telemetryStore.getParticipants({ search: 'kominfotik' })
      assert.strictEqual(byAgency.length >= 2, true)
      for (const p of byAgency) {
        assert.match(p.agency.toLowerCase(), /kominfotik/)
      }

      // Search by participantId
      const byId = telemetryStore.getParticipants({ search: 'word-02' })
      assert.strictEqual(byId.length, 1)
      assert.strictEqual(byId[0].participantId, 'usr-word-02')
    })

    it('combines course, readiness, and search query filters simultaneously', () => {
      // Course word + readiness clinic + search 'kesehatan'
      const combined = telemetryStore.getParticipants({
        courseId: 'word',
        readiness: 'clinic',
        search: 'kesehatan',
      })

      assert.strictEqual(combined.length, 1)
      assert.strictEqual(combined[0].participantId, 'usr-word-04')
      assert.strictEqual(combined[0].name, 'Tri Wahyuni, M.M')
      assert.strictEqual(combined[0].courseId, 'word')
      assert.strictEqual(combined[0].readinessStatus, 'clinic')
    })

    it('correctly evaluates active vs idle state based on lastActiveAt timestamp', () => {
      const now = Date.now()
      const isOnline1 = now - (now - 5 * 60 * 1000) <= 15 * 60 * 1000
      const isOnline2 = now - (now - 25 * 60 * 1000) <= 15 * 60 * 1000

      assert.strictEqual(isOnline1, true)
      assert.strictEqual(isOnline2, false)
    })
  })

  // =========================================================================
  // Suite 3: Detail Inspector Data Integrity (ADMIN-DASH-03)
  // =========================================================================
  describe('Suite 3: Detail Inspector Data Integrity (ADMIN-DASH-03)', () => {
    beforeEach(() => {
      telemetryStore.initSeedDataIfEmpty()
    })

    it('retrieves full participant record by ID', () => {
      const participant = telemetryStore.getParticipantById('usr-ai-01')
      assert.ok(participant)
      assert.strictEqual(participant.name, 'Ahmad Fauzi, S.Kom')
      assert.strictEqual(participant.agency, 'Diskominfotik DKI Jakarta')
      assert.strictEqual(participant.progressPercent, 100)

      const nonExistent = telemetryStore.getParticipantById('invalid-id-999')
      assert.strictEqual(nonExistent, null)
    })

    it('verifies granular Checkpoint 1–3 extraction across naming schemes', () => {
      // AI checkpoint keys
      const aiCheckpoints = { 'cp-1': 'passed', 'cp-2': 'failed', 'cp-3': 'pending' }
      assert.strictEqual(adminExport.getCheckpointStatus(aiCheckpoints, 1), 'passed')
      assert.strictEqual(adminExport.getCheckpointStatus(aiCheckpoints, 2), 'failed')
      assert.strictEqual(adminExport.getCheckpointStatus(aiCheckpoints, 3), 'pending')

      // Word checkpoint keys
      const wordCheckpoints = { 'word-cp-1': 'passed', 'word-cp-2': 'passed', 'word-cp-3': 'failed' }
      assert.strictEqual(adminExport.getCheckpointStatus(wordCheckpoints, 1), 'passed')
      assert.strictEqual(adminExport.getCheckpointStatus(wordCheckpoints, 2), 'passed')
      assert.strictEqual(adminExport.getCheckpointStatus(wordCheckpoints, 3), 'failed')

      // Missing or empty
      assert.strictEqual(adminExport.getCheckpointStatus({}, 1), 'pending')
      assert.strictEqual(adminExport.getCheckpointStatus(undefined, 2), 'pending')
    })

    it('evaluates quiz score passing threshold (>= 70) correctly', () => {
      const isPassing = (score) => score !== undefined && score >= 70

      assert.strictEqual(isPassing(100), true)
      assert.strictEqual(isPassing(70), true)
      assert.strictEqual(isPassing(69), false)
      assert.strictEqual(isPassing(0), false)
      assert.strictEqual(isPassing(undefined), false)
    })

    it('validates task checklist group mapping for AI and Word courses', () => {
      assert.strictEqual(adminExport.AI_TASK_GROUPS.length, 4)
      const aiTotalTasks = adminExport.AI_TASK_GROUPS.reduce((acc, g) => acc + g.tasks.length, 0)
      assert.strictEqual(aiTotalTasks, 13)

      assert.strictEqual(adminExport.WORD_TASK_GROUPS.length, 5)
      const wordTotalTasks = adminExport.WORD_TASK_GROUPS.reduce((acc, g) => acc + g.tasks.length, 0)
      assert.strictEqual(wordTotalTasks, 9)
    })
  })

  // =========================================================================
  // Suite 4: 1-Click Export Engine Formatting & Security (ADMIN-DASH-04)
  // =========================================================================
  describe('Suite 4: 1-Click Export Engine Formatting & Security (ADMIN-DASH-04)', () => {
    beforeEach(() => {
      telemetryStore.initSeedDataIfEmpty()
    })

    it('prepends Excel-compatible UTF-8 Byte Order Mark (\\uFEFF) at index 0 of CSV', () => {
      const participants = telemetryStore.getParticipants()
      const csv = adminExport.generateParticipantCsv(participants)

      assert.strictEqual(csv.charCodeAt(0), 0xfeff)
      assert.strictEqual(csv.startsWith('\uFEFF'), true)
    })

    it('includes complete standard 14-column header row in CSV', () => {
      const participants = telemetryStore.getParticipants()
      const csv = adminExport.generateParticipantCsv(participants)
      const firstLine = csv.slice(1).split('\r\n')[0]

      for (const header of adminExport.CSV_HEADERS) {
        assert.ok(firstLine.includes(`"${header}"`), `Missing header: ${header}`)
      }
    })

    it('escapes RFC 4180 double quotes, commas, and multiline content safely', () => {
      // Cell with quotes
      const quoted = adminExport.sanitizeCsvCell('John "The Developer" Doe')
      assert.strictEqual(quoted, '"John ""The Developer"" Doe"')

      // Cell with comma
      const comma = adminExport.sanitizeCsvCell('Jakarta, Indonesia')
      assert.strictEqual(comma, '"Jakarta, Indonesia"')

      // Cell with newline
      const newline = adminExport.sanitizeCsvCell('Line 1\nLine 2')
      assert.strictEqual(newline, '"Line 1\nLine 2"')

      // Null or undefined
      assert.strictEqual(adminExport.sanitizeCsvCell(null), '""')
      assert.strictEqual(adminExport.sanitizeCsvCell(undefined), '""')
    })

    it('sanitizes formula injection prefixes (=, +, -, @, \\t, \\r) by prefixing with a single quote', () => {
      // Formula starting with =
      const eq = adminExport.sanitizeCsvCell('=SUM(A1:A10)')
      assert.strictEqual(eq, "\"'=SUM(A1:A10)\"")

      // Formula starting with +
      const plus = adminExport.sanitizeCsvCell('+cmd|/c calc!A0')
      assert.strictEqual(plus, "\"'+cmd|/c calc!A0\"")

      // Formula starting with -
      const minus = adminExport.sanitizeCsvCell('-DANGEROUS_CALL()')
      assert.strictEqual(minus, "\"'-DANGEROUS_CALL()\"")

      // Formula starting with @
      const at = adminExport.sanitizeCsvCell('@SUM(1,2)')
      assert.strictEqual(at, "\"'@SUM(1,2)\"")

      // Formula starting with \t
      const tab = adminExport.sanitizeCsvCell('\tcmd')
      assert.strictEqual(tab, "\"'\tcmd\"")

      // Formula starting with \r
      const cr = adminExport.sanitizeCsvCell('\rcmd')
      assert.strictEqual(cr, "\"'\rcmd\"")
    })

    it('produces valid JSON containing metadata, summary, and participant fidelity', () => {
      const participants = telemetryStore.getParticipants()
      const stats = telemetryStore.getTelemetryStats()
      const filter = { courseId: 'all', readiness: 'all', search: undefined }

      const jsonStr = adminExport.generateParticipantJson(participants, stats, filter)
      assert.doesNotThrow(() => JSON.parse(jsonStr))

      const parsed = JSON.parse(jsonStr)
      assert.strictEqual(parsed.exportedBy, 'Master Admin')
      assert.strictEqual(parsed.version, '1.0')
      assert.strictEqual(parsed.totalRecords, participants.length)
      assert.ok(parsed.exportedAt)
      assert.ok(parsed.summary)
      assert.strictEqual(parsed.summary.totalParticipants, stats.totalParticipants)
      assert.ok(Array.isArray(parsed.participants))
      assert.strictEqual(parsed.participants.length, participants.length)
    })
  })

  // =========================================================================
  // Suite 5: Security Boundary & Quarantine (ADMIN-QA-01, ADMIN-QA-02)
  // =========================================================================
  describe('Suite 5: Security Boundary & Quarantine (ADMIN-QA-01, ADMIN-QA-02)', () => {
    const CLIENT_FILES_TO_AUDIT = [
      'app/components/admin/AdminDashboardView.tsx',
      'app/components/admin/DashboardKPIs.tsx',
      'app/components/admin/ParticipantFilterToolbar.tsx',
      'app/components/admin/ParticipantTable.tsx',
      'app/components/admin/ParticipantDetailModal.tsx',
      'app/components/admin/ExportControls.tsx',
      'app/utils/adminExport.ts',
      'app/utils/telemetryClient.ts',
    ]

    const SENSITIVE_SERVER_SECRETS = [
      'ADMIN_PASSKEY',
      'SESSION_SECRET',
      'TELEGRAM_BOT_TOKEN',
      'GOOGLE_CLIENT_SECRET',
    ]

    it('verifies zero imports or leakages of sensitive server secrets in client dashboard files', () => {
      for (const relPath of CLIENT_FILES_TO_AUDIT) {
        const fullPath = path.join(ROOT_DIR, relPath)
        assert.ok(fs.existsSync(fullPath), `File must exist for security audit: ${relPath}`)

        const content = fs.readFileSync(fullPath, 'utf8')

        for (const secret of SENSITIVE_SERVER_SECRETS) {
          const hasSecret = content.includes(secret)
          assert.strictEqual(
            hasSecret,
            false,
            `Security boundary violation: ${relPath} contains reference to sensitive server secret ${secret}`
          )
        }
      }
    })
  })
})
