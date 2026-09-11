/**
 * Automated Unit & Integration Tests for Phase 32:
 * Workshop Troubleshooting Audit Hub, Error Aggregation & Remediation Console
 * Requirements: ADMIN-LOG-01, ADMIN-LOG-02, T-32-02, T-32-04
 */
const { describe, it, before, beforeEach } = require('node:test')
const assert = require('node:assert')

describe('Phase 32 Troubleshooting Audit Hub & Triage Console Suite', () => {
  let trblStore
  let trblServer
  let trblSchemas
  let sessionModule
  let redactionModule

  before(async () => {
    trblStore = await import('../app/server/troubleshootingStore.ts')
    trblServer = await import('../app/server/troubleshooting.ts')
    trblSchemas = await import('../app/schemas/troubleshooting.ts')
    sessionModule = await import('../app/server/session.ts')
    redactionModule = await import('../app/utils/redaction.ts')
  })

  beforeEach(() => {
    trblStore.clearTroubleshootingStoreForTesting()
    sessionModule.clearAllSessionsForTesting()
  })

  // =========================================================================
  // Suite 1: Error Log Ingestion & Secret Redaction Enforcement (ADMIN-LOG-01, T-32-04)
  // =========================================================================
  describe('Suite 1: Error Log Ingestion & Secret Redaction Enforcement (ADMIN-LOG-01, T-32-04)', () => {
    it('masks raw Telegram bot token with [REDACTED_TELEGRAM_BOT_TOKEN]', () => {
      const rawSecret = '1234567890:ABCdefGHIjklMNOpqrsTUVwxyz123456789'
      const rawError = `Telegram polling failed with token ${rawSecret} on endpoint /getUpdates`

      const record = trblStore.ingestTroubleshootingLog({
        participantId: 'usr-tg-tester',
        participantName: 'Budi Telegram',
        errorMsg: rawError,
        courseId: 'ai',
      })

      assert.ok(record.id)
      assert.strictEqual(record.rawErrorText.includes(rawSecret), false)
      assert.strictEqual(
        record.rawErrorText.includes('[REDACTED_TELEGRAM_BOT_TOKEN]'),
        true
      )
    })

    it('masks OpenAI API key and Google Cloud API key before persistent storage', () => {
      const openAiKey = ['sk', 'abc12345678901234567890'].join('-')
      const googleKey = ['AIza', 'SyD-1234567890123456789012345678901'].join('')
      const rawError = `Failed auth using OpenAI key ${openAiKey} and Google key ${googleKey}`

      const record = trblStore.ingestTroubleshootingLog({
        participantId: 'usr-api-tester',
        participantName: 'Siti API',
        errorMsg: rawError,
        courseId: 'ai',
      })

      assert.strictEqual(record.rawErrorText.includes(openAiKey), false)
      assert.strictEqual(record.rawErrorText.includes(googleKey), false)
      assert.strictEqual(record.rawErrorText.includes('[REDACTED_API_KEY]'), true)
      assert.strictEqual(
        record.rawErrorText.includes('[REDACTED_GOOGLE_API_KEY]'),
        true
      )
    })

    it('sanitizes Windows user paths to prevent user directory leakage', () => {
      const userPath = 'C:\\Users\\JohnDoe\\AppData\\Roaming\\npm\\node_modules'
      const rawError = `Cannot access path ${userPath} during global package link`

      const record = trblStore.ingestTroubleshootingLog({
        participantId: 'usr-path-tester',
        errorMsg: rawError,
        courseId: 'ai',
      })

      assert.strictEqual(record.rawErrorText.includes('JohnDoe'), false)
      assert.strictEqual(
        record.rawErrorText.includes('C:\\Users\\[USER]\\AppData\\Roaming'),
        true
      )
    })

    it('sanitizes problemStep input if it contains sensitive tokens', () => {
      const record = trblStore.ingestTroubleshootingLog({
        participantId: 'usr-step-tester',
        errorMsg: 'Simple test error',
        problemStep: 'C:\\Users\\SecretUser\\test.ps1',
      })

      assert.strictEqual(record.problemStep?.includes('SecretUser'), false)
      assert.strictEqual(
        record.problemStep?.includes('C:\\Users\\[USER]\\test.ps1'),
        true
      )
    })
  })

  // =========================================================================
  // Suite 2: Auto-Categorization & Remediation Command Engine (ADMIN-LOG-01)
  // =========================================================================
  describe('Suite 2: Auto-Categorization & Remediation Command Engine (ADMIN-LOG-01)', () => {
    it('classifies port conflict (EADDRINUSE 20128) with high severity and Stop-Process command', () => {
      const errorText =
        'Error: listen EADDRINUSE: address already in use :::20128 at Server.setupListenHandle'
      const classification = trblStore.classifyErrorLog(errorText)

      assert.strictEqual(classification.category, 'port_conflict')
      assert.strictEqual(classification.severity, 'high')
      assert.strictEqual(
        classification.suggestedCommand,
        'Stop-Process -Id (Get-NetTCPConnection -LocalPort 20128).OwningProcess -Force'
      )
      assert.ok(classification.suggestedRemediation.includes('Port 20128'))
    })

    it('classifies PowerShell execution policy lock with medium severity and bypass command', () => {
      const errorText =
        'File script.ps1 cannot be loaded because running scripts is disabled on this system'
      const classification = trblStore.classifyErrorLog(errorText)

      assert.strictEqual(classification.category, 'powershell_policy')
      assert.strictEqual(classification.severity, 'medium')
      assert.strictEqual(
        classification.suggestedCommand,
        'Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass'
      )
    })

    it('classifies 401 Unauthorized / Invalid API Key as oauth_api_key with critical severity', () => {
      const errorText =
        'Response 401 Unauthorized - Invalid API Key provided for Gemini model endpoint'
      const classification = trblStore.classifyErrorLog(errorText)

      assert.strictEqual(classification.category, 'oauth_api_key')
      assert.strictEqual(classification.severity, 'critical')
      assert.ok(classification.suggestedRemediation.includes('Google OAuth'))
    })

    it('classifies Telegram 409 conflict as telegram_conflict with medium severity and restart command', () => {
      const errorText =
        'TelegramError: 409 Conflict: terminated by other getUpdates request'
      const classification = trblStore.classifyErrorLog(errorText)

      assert.strictEqual(classification.category, 'telegram_conflict')
      assert.strictEqual(classification.severity, 'medium')
      assert.strictEqual(
        classification.suggestedCommand,
        'hermes gateway stop; hermes gateway start'
      )
    })

    it('classifies EPERM / Access denied as permissions_eperm with high severity and RunAs command', () => {
      const errorText =
        'npm ERR! code EPERM: operation not permitted, unlink C:\\Program Files\\nodejs'
      const classification = trblStore.classifyErrorLog(errorText)

      assert.strictEqual(classification.category, 'permissions_eperm')
      assert.strictEqual(classification.severity, 'high')
      assert.strictEqual(
        classification.suggestedCommand,
        'Start-Process powershell -Verb RunAs'
      )
    })

    it('classifies network connection timeout as network_runtime with test connection command', () => {
      const errorText =
        'FetchError: connect ETIMEDOUT 142.250.190.42:443 to Google Generative Language API'
      const classification = trblStore.classifyErrorLog(errorText)

      assert.strictEqual(classification.category, 'network_runtime')
      assert.strictEqual(classification.severity, 'medium')
      assert.strictEqual(
        classification.suggestedCommand,
        'Test-NetConnection -ComputerName generativelanguage.googleapis.com -Port 443'
      )
    })

    it('classifies unknown / general errors as other with low severity', () => {
      const errorText = 'SyntaxError: Unexpected token < in JSON at position 0'
      const classification = trblStore.classifyErrorLog(errorText)

      assert.strictEqual(classification.category, 'other')
      assert.strictEqual(classification.severity, 'low')
      assert.ok(classification.suggestedRemediation)
    })
  })

  // =========================================================================
  // Suite 3: Aggregated Metrics & Multi-Criteria Filtering (ADMIN-LOG-02)
  // =========================================================================
  describe('Suite 3: Aggregated Metrics & Multi-Criteria Filtering (ADMIN-LOG-02)', () => {
    it('accurately computes frequency KPIs, open counts, and top incident category', () => {
      // Ingest 3 port conflicts, 1 powershell, 1 other
      trblStore.ingestTroubleshootingLog({
        participantId: 'p1',
        errorMsg: 'Port 20128 EADDRINUSE conflict 1',
      })
      trblStore.ingestTroubleshootingLog({
        participantId: 'p2',
        errorMsg: 'Port 20128 EADDRINUSE conflict 2',
      })
      trblStore.ingestTroubleshootingLog({
        participantId: 'p3',
        errorMsg: 'Port 20128 EADDRINUSE conflict 3',
      })
      trblStore.ingestTroubleshootingLog({
        participantId: 'p4',
        errorMsg: 'running scripts is disabled by policy',
      })
      trblStore.ingestTroubleshootingLog({
        participantId: 'p5',
        errorMsg: 'completely custom unmapped error text',
      })

      const stats = trblStore.getTroubleshootingStats()

      assert.strictEqual(stats.totalIncidents, 5)
      assert.strictEqual(stats.openCount, 5)
      assert.strictEqual(stats.categoryCounts.port_conflict, 3)
      assert.strictEqual(stats.categoryCounts.powershell_policy, 1)
      assert.strictEqual(stats.categoryCounts.other, 1)
      assert.strictEqual(stats.topCategory, 'port_conflict')
    })

    it('filters incidents accurately by category', () => {
      trblStore.ingestTroubleshootingLog({
        participantId: 'cat-p1',
        errorMsg: 'Port 20128 conflict',
      })
      trblStore.ingestTroubleshootingLog({
        participantId: 'cat-p2',
        errorMsg: 'Execution_Policies restricted',
      })

      const portOnly = trblStore.getTroubleshootingLogs({
        category: 'port_conflict',
        severity: 'all',
        status: 'all',
        courseId: 'all',
        limit: 10,
      })

      assert.strictEqual(portOnly.length, 1)
      assert.strictEqual(portOnly[0].category, 'port_conflict')

      const psOnly = trblStore.getTroubleshootingLogs({
        category: 'powershell_policy',
        severity: 'all',
        status: 'all',
        courseId: 'all',
        limit: 10,
      })

      assert.strictEqual(psOnly.length, 1)
      assert.strictEqual(psOnly[0].category, 'powershell_policy')
    })

    it('filters incidents accurately by status (open vs resolved)', () => {
      const rec1 = trblStore.ingestTroubleshootingLog({
        participantId: 'stat-p1',
        errorMsg: 'Issue 1',
      })
      const rec2 = trblStore.ingestTroubleshootingLog({
        participantId: 'stat-p2',
        errorMsg: 'Issue 2',
      })

      trblStore.updateTroubleshootingStatus({
        id: rec1.id,
        status: 'resolved',
      })

      const openOnly = trblStore.getTroubleshootingLogs({
        category: 'all',
        severity: 'all',
        status: 'open',
        courseId: 'all',
        limit: 10,
      })

      assert.strictEqual(openOnly.length, 1)
      assert.strictEqual(openOnly[0].id, rec2.id)

      const resolvedOnly = trblStore.getTroubleshootingLogs({
        category: 'all',
        severity: 'all',
        status: 'resolved',
        courseId: 'all',
        limit: 10,
      })

      assert.strictEqual(resolvedOnly.length, 1)
      assert.strictEqual(resolvedOnly[0].id, rec1.id)
    })

    it('filters incidents accurately by search query across participant, id, and error message', () => {
      trblStore.ingestTroubleshootingLog({
        participantId: 'user-unique-9876',
        participantName: 'Dr. Surya Atmaja',
        errorMsg: 'Special failure in step 2B',
      })
      trblStore.ingestTroubleshootingLog({
        participantId: 'user-standard',
        participantName: 'Normal User',
        errorMsg: 'Standard failure text',
      })

      const searchByName = trblStore.getTroubleshootingLogs({
        category: 'all',
        severity: 'all',
        status: 'all',
        courseId: 'all',
        search: 'Surya',
        limit: 10,
      })
      assert.strictEqual(searchByName.length, 1)
      assert.strictEqual(searchByName[0].participantId, 'user-unique-9876')

      const searchByError = trblStore.getTroubleshootingLogs({
        category: 'all',
        severity: 'all',
        status: 'all',
        courseId: 'all',
        search: 'step 2b',
        limit: 10,
      })
      assert.strictEqual(searchByError.length, 1)
    })
  })

  // =========================================================================
  // Suite 4: Incident Status Lifecycle & Instructor Notes Management (ADMIN-LOG-02)
  // =========================================================================
  describe('Suite 4: Incident Status Lifecycle & Instructor Notes Management (ADMIN-LOG-02)', () => {
    it('transitions incident through lifecycle open -> investigating -> resolved with resolvedAt timestamp', () => {
      const record = trblStore.ingestTroubleshootingLog({
        participantId: 'usr-lifecycle',
        errorMsg: 'Port 20128 conflict testing',
      })
      assert.strictEqual(record.status, 'open')
      assert.strictEqual(record.resolvedAt, undefined)

      // Transition to investigating
      const investigating = trblStore.updateTroubleshootingStatus({
        id: record.id,
        status: 'investigating',
        instructorNotes: 'Memandu via AnyDesk',
      })
      assert.ok(investigating)
      assert.strictEqual(investigating.status, 'investigating')
      assert.strictEqual(investigating.instructorNotes, 'Memandu via AnyDesk')
      assert.strictEqual(investigating.resolvedAt, undefined)

      // Transition to resolved
      const resolved = trblStore.updateTroubleshootingStatus({
        id: record.id,
        status: 'resolved',
        instructorNotes: 'Selesai: Port dilepaskan dan 9Router berjalan normal',
      })
      assert.ok(resolved)
      assert.strictEqual(resolved.status, 'resolved')
      assert.ok(resolved.resolvedAt)
      assert.ok(resolved.resolvedAt <= Date.now())
    })

    it('returns null when updating non-existent incident', () => {
      const result = trblStore.updateTroubleshootingStatus({
        id: 'inc-non-existent-999',
        status: 'resolved',
      })
      assert.strictEqual(result, null)
    })
  })

  // =========================================================================
  // Suite 5: Admin Session Security & Public Ingestion Boundary (T-32-02, ADMIN-QA-01)
  // =========================================================================
  describe('Suite 5: Admin Session Security & Public Ingestion Boundary (T-32-02, ADMIN-QA-01)', () => {
    it('rejects unauthenticated calls to assertAdminAuthorized', () => {
      assert.throws(() => {
        trblServer.assertAdminAuthorized(null)
      }, /UNAUTHORIZED/)

      assert.throws(() => {
        trblServer.assertAdminAuthorized('bad-token')
      }, /UNAUTHORIZED/)
    })

    it('allows access to protected data when valid Master Admin session is provided', () => {
      const session = sessionModule.createAdminSession('passkey')
      assert.ok(session.token)

      const user = trblServer.assertAdminAuthorized(session.token)
      assert.ok(user)
      assert.strictEqual(user.role, 'admin')
    })

    it('allows public ingestion of learner troubleshooting logs via ingestTroubleshootingLog', () => {
      // Ingestion does not require admin credentials
      const record = trblStore.ingestTroubleshootingLog({
        participantId: 'learner-public-1',
        participantName: 'Peserta Mandiri',
        errorMsg: 'listen EADDRINUSE: address already in use :::20128',
        courseId: 'ai',
      })

      assert.ok(record.id)
      assert.strictEqual(record.category, 'port_conflict')
      assert.strictEqual(record.status, 'open')
    })
  })
})
