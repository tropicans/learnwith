/**
 * Automated Unit & Integration Tests for Phase 30:
 * Server Telemetry Ingestion API & Participant Background Client
 * Requirements: ADMIN-TELEM-01, ADMIN-TELEM-02, ADMIN-QA-01, ADMIN-QA-02
 */
const { describe, it, before, beforeEach } = require('node:test')
const assert = require('node:assert')
const fs = require('node:fs')
const path = require('node:path')

const ROOT_DIR = path.resolve(__dirname, '..')

describe('Phase 30 Server Telemetry Engine & Store Suite', () => {
  let telemetrySchemas
  let telemetryStore
  let telemetryServer

  before(async () => {
    telemetrySchemas = await import('../app/schemas/telemetry.ts')
    telemetryStore = await import('../app/server/telemetryStore.ts')
    telemetryServer = await import('../app/server/telemetry.ts')
  })

  beforeEach(() => {
    telemetryStore.clearTelemetryStoreForTesting()
  })

  describe('Suite 1: Telemetry Schema Validation (ADMIN-TELEM-02)', () => {
    it('validates a complete valid participant telemetry payload', () => {
      const validPayload = {
        participantId: 'usr-1234-abcd',
        name: 'Budi Santoso',
        agency: 'Bappeda Prov. Jawa Barat',
        courseId: 'ai',
        progressPercent: 75,
        completedTasks: 15,
        totalTasks: 20,
        checkpoints: {
          'ai-cp-1': 'passed',
          'ai-cp-2': 'passed',
          'ai-cp-3': 'pending',
        },
        readinessStatus: 'pending',
        quizScore: 85,
        clientTimestamp: Date.now(),
      }

      const parsed = telemetrySchemas.participantTelemetrySchema.parse(validPayload)
      assert.strictEqual(parsed.participantId, 'usr-1234-abcd')
      assert.strictEqual(parsed.name, 'Budi Santoso')
      assert.strictEqual(parsed.agency, 'Bappeda Prov. Jawa Barat')
      assert.strictEqual(parsed.courseId, 'ai')
      assert.strictEqual(parsed.progressPercent, 75)
      assert.strictEqual(parsed.readinessStatus, 'pending')
      assert.strictEqual(parsed.quizScore, 85)
    })

    it('applies default name and agency when omitted or empty', () => {
      const payloadWithDefaults = {
        participantId: 'usr-default-check',
        courseId: 'word',
        progressPercent: 20,
        completedTasks: 5,
        totalTasks: 28,
        checkpoints: { 'word-cp-1': 'pending' },
        readinessStatus: 'pending',
        clientTimestamp: 1710000000000,
      }

      const parsed = telemetrySchemas.participantTelemetrySchema.parse(payloadWithDefaults)
      assert.strictEqual(parsed.name, 'Peserta')
      assert.strictEqual(parsed.agency, '-')
    })

    it('rejects invalid participantId (empty or overly long)', () => {
      const base = {
        name: 'Test',
        agency: 'Test Agency',
        courseId: 'ai',
        progressPercent: 50,
        completedTasks: 10,
        totalTasks: 20,
        checkpoints: {},
        readinessStatus: 'pending',
        clientTimestamp: Date.now(),
      }

      assert.throws(() => {
        telemetrySchemas.participantTelemetrySchema.parse({ ...base, participantId: '' })
      }, /ID peserta/)

      assert.throws(() => {
        telemetrySchemas.participantTelemetrySchema.parse({
          ...base,
          participantId: 'a'.repeat(65),
        })
      }, /ID peserta/)
    })

    it('rejects invalid courseId values', () => {
      const base = {
        participantId: 'usr-course-err',
        progressPercent: 50,
        completedTasks: 10,
        totalTasks: 20,
        checkpoints: {},
        readinessStatus: 'pending',
        clientTimestamp: Date.now(),
      }

      assert.throws(() => {
        telemetrySchemas.participantTelemetrySchema.parse({ ...base, courseId: 'python' })
      })

      assert.throws(() => {
        telemetrySchemas.participantTelemetrySchema.parse({ ...base, courseId: 'excel' })
      })
    })

    it('rejects invalid progress percentages (<0 or >100)', () => {
      const base = {
        participantId: 'usr-pct-err',
        courseId: 'ai',
        completedTasks: 10,
        totalTasks: 20,
        checkpoints: {},
        readinessStatus: 'pending',
        clientTimestamp: Date.now(),
      }

      assert.throws(() => {
        telemetrySchemas.participantTelemetrySchema.parse({ ...base, progressPercent: -5 })
      })

      assert.throws(() => {
        telemetrySchemas.participantTelemetrySchema.parse({ ...base, progressPercent: 105 })
      })
    })

    it('rejects invalid readiness status values', () => {
      const base = {
        participantId: 'usr-ready-err',
        courseId: 'ai',
        progressPercent: 50,
        completedTasks: 10,
        totalTasks: 20,
        checkpoints: {},
        clientTimestamp: Date.now(),
      }

      assert.throws(() => {
        telemetrySchemas.participantTelemetrySchema.parse({ ...base, readinessStatus: 'lulus' })
      })
    })

    it('validates and applies defaults for query filter schema', () => {
      const emptyFilter = telemetrySchemas.telemetryQueryFilterSchema.parse({})
      assert.strictEqual(emptyFilter.courseId, 'all')
      assert.strictEqual(emptyFilter.readiness, 'all')
      assert.strictEqual(emptyFilter.search, undefined)

      const specificFilter = telemetrySchemas.telemetryQueryFilterSchema.parse({
        courseId: 'word',
        readiness: 'clinic',
        search: 'Kominfo',
      })
      assert.strictEqual(specificFilter.courseId, 'word')
      assert.strictEqual(specificFilter.readiness, 'clinic')
      assert.strictEqual(specificFilter.search, 'Kominfo')
    })
  })

  describe('Suite 2: Telemetry In-Memory Store Operations (ADMIN-TELEM-02)', () => {
    it('ingests participant telemetry and stores timestamps', () => {
      const input = {
        participantId: 'usr-test-1',
        name: 'Ahmad Fauzi',
        agency: 'Diskominfo Bandung',
        courseId: 'ai',
        progressPercent: 60,
        completedTasks: 12,
        totalTasks: 20,
        checkpoints: { 'ai-cp-1': 'passed', 'ai-cp-2': 'pending' },
        readinessStatus: 'pending',
        quizScore: 70,
        clientTimestamp: Date.now(),
      }

      const record = telemetryStore.ingestTelemetry(input)
      assert.strictEqual(record.participantId, 'usr-test-1')
      assert.ok(record.serverReceivedAt > 0)
      assert.ok(record.lastActiveAt >= record.serverReceivedAt)

      const retrieved = telemetryStore.getParticipantById('usr-test-1')
      assert.ok(retrieved)
      assert.strictEqual(retrieved.name, 'Ahmad Fauzi')
    })

    it('updates idempotently preserving serverReceivedAt across multiple ingests', async () => {
      const initial = {
        participantId: 'usr-idempotent-1',
        name: 'Siti Rahma',
        agency: 'BKD Jabar',
        courseId: 'word',
        progressPercent: 30,
        completedTasks: 8,
        totalTasks: 28,
        checkpoints: { 'word-cp-1': 'pending' },
        readinessStatus: 'pending',
        clientTimestamp: Date.now(),
      }

      const rec1 = telemetryStore.ingestTelemetry(initial)
      const initialReceivedAt = rec1.serverReceivedAt

      // Small delay to verify lastActiveAt changes
      await new Promise((r) => setTimeout(r, 15))

      const updated = {
        ...initial,
        progressPercent: 70,
        completedTasks: 20,
        checkpoints: { 'word-cp-1': 'passed', 'word-cp-2': 'pending' },
      }

      const rec2 = telemetryStore.ingestTelemetry(updated)
      assert.strictEqual(rec2.participantId, 'usr-idempotent-1')
      assert.strictEqual(rec2.progressPercent, 70)
      assert.strictEqual(rec2.serverReceivedAt, initialReceivedAt, 'serverReceivedAt must remain invariant')
      assert.ok(rec2.lastActiveAt >= initialReceivedAt)

      const list = telemetryStore.getParticipants()
      const matches = list.filter((p) => p.participantId === 'usr-idempotent-1')
      assert.strictEqual(matches.length, 1, 'Store must not duplicate entries with same participantId')
    })

    it('filters participants accurately by courseId, readiness, and search terms', () => {
      telemetryStore.ingestTelemetry({
        participantId: 'p-1',
        name: 'Budi Hartono',
        agency: 'Dinas Kesehatan',
        courseId: 'ai',
        progressPercent: 100,
        completedTasks: 20,
        totalTasks: 20,
        checkpoints: { 'ai-cp-1': 'passed', 'ai-cp-2': 'passed' },
        readinessStatus: 'ready',
        quizScore: 90,
        clientTimestamp: Date.now(),
      })

      telemetryStore.ingestTelemetry({
        participantId: 'p-2',
        name: 'Dewi Lestari',
        agency: 'Dinas Pendidikan',
        courseId: 'ai',
        progressPercent: 40,
        completedTasks: 8,
        totalTasks: 20,
        checkpoints: { 'ai-cp-1': 'failed' },
        readinessStatus: 'clinic',
        quizScore: 50,
        clientTimestamp: Date.now(),
      })

      telemetryStore.ingestTelemetry({
        participantId: 'p-3',
        name: 'Eko Prasetyo',
        agency: 'Dinas Perhubungan',
        courseId: 'word',
        progressPercent: 85,
        completedTasks: 24,
        totalTasks: 28,
        checkpoints: { 'word-cp-1': 'passed', 'word-cp-2': 'passed' },
        readinessStatus: 'ready',
        quizScore: 85,
        clientTimestamp: Date.now(),
      })

      // Filter by courseId
      const aiList = telemetryStore.getParticipants({ courseId: 'ai', readiness: 'all' })
      assert.strictEqual(aiList.length, 2)

      const wordList = telemetryStore.getParticipants({ courseId: 'word', readiness: 'all' })
      assert.strictEqual(wordList.length, 1)
      assert.strictEqual(wordList[0].name, 'Eko Prasetyo')

      // Filter by readiness
      const readyList = telemetryStore.getParticipants({ courseId: 'all', readiness: 'ready' })
      assert.strictEqual(readyList.length, 2)

      const clinicList = telemetryStore.getParticipants({ courseId: 'all', readiness: 'clinic' })
      assert.strictEqual(clinicList.length, 1)
      assert.strictEqual(clinicList[0].name, 'Dewi Lestari')

      // Filter by search query
      const searchKesehatan = telemetryStore.getParticipants({
        courseId: 'all',
        readiness: 'all',
        search: 'kesehatan',
      })
      assert.strictEqual(searchKesehatan.length, 1)
      assert.strictEqual(searchKesehatan[0].name, 'Budi Hartono')

      const searchDewi = telemetryStore.getParticipants({
        courseId: 'all',
        readiness: 'all',
        search: 'dewi',
      })
      assert.strictEqual(searchDewi.length, 1)
      assert.strictEqual(searchDewi[0].participantId, 'p-2')
    })

    it('computes aggregate KPI statistics correctly', () => {
      telemetryStore.ingestTelemetry({
        participantId: 'kpi-1',
        name: 'User 1',
        agency: 'Agency 1',
        courseId: 'ai',
        progressPercent: 100,
        completedTasks: 20,
        totalTasks: 20,
        checkpoints: { cp1: 'passed', cp2: 'passed' },
        readinessStatus: 'ready',
        quizScore: 90,
        clientTimestamp: Date.now(),
      })

      telemetryStore.ingestTelemetry({
        participantId: 'kpi-2',
        name: 'User 2',
        agency: 'Agency 2',
        courseId: 'word',
        progressPercent: 50,
        completedTasks: 14,
        totalTasks: 28,
        checkpoints: { cp1: 'passed', cp2: 'failed' },
        readinessStatus: 'clinic',
        quizScore: 70,
        clientTimestamp: Date.now(),
      })

      const stats = telemetryStore.getTelemetryStats()
      assert.strictEqual(stats.totalParticipants, 2)
      assert.strictEqual(stats.activeParticipants, 2)
      // Checkpoint completion: 3 passed out of 4 total = 75%
      assert.strictEqual(stats.checkpointCompletionRate, 75)
      // Average quiz: (90 + 70) / 2 = 80%
      assert.strictEqual(stats.averageQuizScore, 80)
      // Ready ratio: 1/2 = 50%
      assert.strictEqual(stats.readyRatio, 50)
      // Clinic ratio: 1/2 = 50%
      assert.strictEqual(stats.clinicRatio, 50)
    })

    it('populates realistic seed data when registry is empty and requested', () => {
      // Calling getParticipants with empty store triggers initSeedDataIfEmpty()
      const seedList = telemetryStore.getParticipants()
      assert.strictEqual(seedList.length, 8, 'Default seed must contain 8 demo participants')

      const stats = telemetryStore.getTelemetryStats()
      assert.strictEqual(stats.totalParticipants, 8)
      assert.ok(stats.averageQuizScore > 0)
    })
  })

  describe('Suite 3: Server Functions & RPC Execution (ADMIN-TELEM-01)', () => {
    it('exports ingestParticipantTelemetryFn and getParticipantTelemetryListFn', () => {
      assert.ok(telemetryServer.ingestParticipantTelemetryFn, 'ingest function must be defined')
      assert.ok(telemetryServer.getParticipantTelemetryListFn, 'list function must be defined')
    })

    it('successfully processes simulated RPC ingestion call', async () => {
      const payload = {
        participantId: 'usr-rpc-01',
        name: 'Ratna Sari',
        agency: 'Setda Jabar',
        courseId: 'ai',
        progressPercent: 80,
        completedTasks: 16,
        totalTasks: 20,
        checkpoints: { 'ai-cp-1': 'passed', 'ai-cp-2': 'passed' },
        readinessStatus: 'ready',
        quizScore: 88,
        clientTimestamp: Date.now(),
      }

      // Test ingestion through store directly as mirrored by RPC handler
      const record = telemetryStore.ingestTelemetry(payload)
      assert.strictEqual(record.participantId, 'usr-rpc-01')

      const queryResult = {
        participants: telemetryStore.getParticipants({ courseId: 'ai', readiness: 'all' }),
        stats: telemetryStore.getTelemetryStats(),
      }

      assert.ok(queryResult.participants.some((p) => p.participantId === 'usr-rpc-01'))
      assert.strictEqual(queryResult.stats.totalParticipants, 1)
    })
  })

  describe('Suite 4: Security, Secret Boundary & Quarantine (ADMIN-QA-01, ADMIN-QA-02)', () => {
    it('verifies telemetry schemas and client-accessible code do not import server secrets', () => {
      const schemasPath = path.join(ROOT_DIR, 'app', 'schemas', 'telemetry.ts')
      const content = fs.readFileSync(schemasPath, 'utf8')

      assert.ok(!content.includes('config'), 'telemetry schema must not import config')
      assert.ok(!content.includes('ADMIN_PASSKEY'), 'telemetry schema must not reference ADMIN_PASSKEY')
      assert.ok(!content.includes('SESSION_SECRET'), 'telemetry schema must not reference SESSION_SECRET')
      assert.ok(!content.includes('TELEGRAM_BOT_TOKEN'), 'telemetry schema must not reference TELEGRAM_BOT_TOKEN')
      assert.ok(!content.includes('GOOGLE_CLIENT_SECRET'), 'telemetry schema must not reference GOOGLE_CLIENT_SECRET')
    })

    it('verifies telemetry payload structure contains zero secret or credential fields', () => {
      const shape = telemetrySchemas.participantTelemetrySchema.shape
      const forbiddenFields = [
        'password',
        'passkey',
        'token',
        'secret',
        'botToken',
        'apiKey',
        'authKey',
        'session',
        'cookie',
      ]

      for (const field of forbiddenFields) {
        assert.strictEqual(
          shape[field],
          undefined,
          `Telemetry schema must never accept sensitive field: ${field}`
        )
      }
    })
  })
})
