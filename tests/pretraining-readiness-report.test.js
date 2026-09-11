/**
 * Automated Unit Tests for Participant Readiness Report Generator (Phase 28)
 * Requirements: PRE-RPT-01, PRE-RPT-02, PRE-RPT-03, PRE-NAV-03
 */

const { describe, it, before } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

describe('Phase 28 Readiness Report Generator & Multi-Course Parity Suite', () => {
  let reportModule
  let redactionModule
  let pretrainingStateModule

  before(async () => {
    reportModule = await import('../app/utils/reportGenerator.ts')
    redactionModule = await import('../app/utils/redaction.ts')
    pretrainingStateModule = await import('../app/hooks/usePretrainingState.ts')
  })

  // =========================================================================
  // SUITE 1: REPORT GENERATOR CORE INVARIANTS (PRE-RPT-02)
  // =========================================================================
  describe('Suite 1: Report Generator Formatting Invariants (PRE-RPT-02)', () => {
    it('exports generateReportText and normalizeTelegramUsername as functions', () => {
      assert.equal(typeof reportModule.generateReportText, 'function')
      assert.equal(typeof reportModule.normalizeTelegramUsername, 'function')
    })

    it('generates a full standard report with all checkpoints passed and custom participant', () => {
      const report = reportModule.generateReportText({
        name: 'Budi Hartono',
        os: 'Windows 11',
        participantInfo: {
          name: 'Budi Hartono',
          nodeVersion: 'v20.11.0',
          telegramUsername: 'budi_bot',
          telegramUserId: '987654321'
        },
        checkpoints: {
          'cp-1': 'passed',
          'cp-2': 'passed',
          'cp-3': 'passed'
        },
        m4TasksComplete: true,
        status: 'ready'
      })

      assert.ok(report.includes('Nama: Budi Hartono'), 'Contains participant name')
      assert.ok(report.includes('Sistem operasi: Windows 11'), 'Contains OS')
      assert.ok(report.includes('[X] Checkpoint 1 — Node.js dan npm siap (v20.11.0)'), 'CP1 marked [X] with node version')
      assert.ok(report.includes('[X] Checkpoint 2 — dashboard 9Router terbuka'), 'CP2 marked [X]')
      assert.ok(report.includes('[X] Checkpoint 3 — bot Telegram dan user ID siap (@budi_bot, ID: 987654321)'), 'CP3 marked [X] with Telegram info')
      assert.ok(report.includes('[X] Google Cloud Console dapat dibuka'), 'Google Cloud marked [X]')
      assert.ok(report.includes('Status: SIAP MENGIKUTI WORKSHOP'), 'Status states SIAP MENGIKUTI WORKSHOP')
      assert.ok(report.includes('Nomor langkah yang bermasalah (jika ada): Nihil'), 'Problem step defaults to Nihil')
      assert.ok(report.includes('Pesan error yang sudah disensor:\nNihil'), 'Sanitized error defaults to Nihil')
    })

    it('marks checkpoints [ ] and status PERLU TECHNICAL CLINIC when any checkpoint fails', () => {
      const report = reportModule.generateReportText({
        name: 'Siti Rahma',
        os: 'Windows 10',
        participantInfo: {
          telegramUsername: '@siti_agent',
          telegramUserId: ''
        },
        checkpoints: {
          'cp-1': 'passed',
          'cp-2': 'failed',
          'cp-3': 'pending'
        },
        m4TasksComplete: false,
        probStep: 'Modul 2 Langkah C (Port Conflict 20128)',
        errorMsg: 'Port 20128 already in use by PID 1420'
      })

      assert.ok(report.includes('[X] Checkpoint 1'), 'CP1 is [X]')
      assert.ok(report.includes('[ ] Checkpoint 2'), 'CP2 is [ ]')
      assert.ok(report.includes('[ ] Checkpoint 3'), 'CP3 is [ ]')
      assert.ok(report.includes('[ ] Google Cloud Console dapat dibuka'), 'Google Cloud is [ ]')
      assert.ok(report.includes('Status: PERLU TECHNICAL CLINIC'), 'States clinic status on failure')
      assert.ok(report.includes('Nomor langkah yang bermasalah (jika ada): Modul 2 Langkah C (Port Conflict 20128)'))
      assert.ok(report.includes('Port 20128 already in use by PID 1420'))
    })

    it('evaluates moduleChecklists to calculate Google Cloud mark [X] when both m4 tasks are true', () => {
      const reportPassed = reportModule.generateReportText({
        moduleChecklists: {
          'm4-open-console': true,
          'm4-verify-login': true
        }
      })
      assert.ok(reportPassed.includes('[X] Google Cloud Console dapat dibuka'))

      const reportPartial = reportModule.generateReportText({
        moduleChecklists: {
          'm4-open-console': true,
          'm4-verify-login': false
        }
      })
      assert.ok(reportPartial.includes('[ ] Google Cloud Console dapat dibuka'))
    })
  })

  // =========================================================================
  // SUITE 2: TELEGRAM USERNAME NORMALIZATION & FALLBACKS
  // =========================================================================
  describe('Suite 2: Telegram Username Normalization & Fallbacks', () => {
    it('normalizes multiple @ prefixes to exactly one @ in the report', () => {
      assert.equal(reportModule.normalizeTelegramUsername('@@@hermes_bot'), 'hermes_bot')
      assert.equal(reportModule.normalizeTelegramUsername('@hermes_bot'), 'hermes_bot')
      assert.equal(reportModule.normalizeTelegramUsername('hermes_bot'), 'hermes_bot')

      const report = reportModule.generateReportText({
        participantInfo: {
          telegramUsername: '@@@hermes_bot',
          telegramUserId: '554433'
        }
      })
      assert.ok(report.includes('(@hermes_bot, ID: 554433)'))
      assert.ok(!report.includes('@@@hermes_bot'))
    })

    it('formats Telegram info cleanly when only user ID is present', () => {
      const report = reportModule.generateReportText({
        participantInfo: {
          telegramUsername: '',
          telegramUserId: '778899'
        }
      })
      assert.ok(report.includes('(-, ID: 778899)'))
    })

    it('formats Telegram info cleanly when only username is present', () => {
      const report = reportModule.generateReportText({
        participantInfo: {
          telegramUsername: 'solo_bot',
          telegramUserId: ''
        }
      })
      assert.ok(report.includes('(@solo_bot, ID: -)'))
    })

    it('omits Telegram info parentheses entirely when both username and ID are missing', () => {
      const report = reportModule.generateReportText({
        participantInfo: {
          telegramUsername: '',
          telegramUserId: ''
        }
      })
      assert.ok(report.includes('Checkpoint 3 — bot Telegram dan user ID siap\n'))
    })
  })

  // =========================================================================
  // SUITE 3: ERROR LOG SANITIZATION & REDACTION (STRIDE PRE-TOOL-03)
  // =========================================================================
  describe('Suite 3: Error Log Sanitization & Token Redaction (PRE-TOOL-03, PRE-RPT-02)', () => {
    it('automatically sanitizes sensitive tokens inside errorMsg in the report output', () => {
      const dummyOpenAiKey = ['sk', 'proj', '1234567890abcdef1234567890'].join('-')
      const dummyGoogleKey = ['AIza', 'SyD1234567890abcdefghijklmnopqrstuv'].join('')
      const dirtyError = `Fatal error:
User: budi.santoso@jakarta.go.id
Path: C:\\Users\\budi_santoso\\AgenticAI\\hermes
Failed key: ${dummyOpenAiKey}
Telegram token: 987654321:abcdefghijklmnopqrstuvwxyz012345678
Google API: ${dummyGoogleKey}
Auth: Bearer eyJhbGciOiJIUzI1Ni.secretjwttoken`

      const report = reportModule.generateReportText({
        errorMsg: dirtyError
      })

      assert.ok(!report.includes('budi.santoso@jakarta.go.id'), 'Email masked')
      assert.ok(report.includes('[REDACTED_EMAIL]'))

      assert.ok(!report.includes('budi_santoso\\AgenticAI'), 'Windows path masked')
      assert.ok(report.includes('C:\\Users\\[USER]\\AgenticAI'))

      assert.ok(!report.includes(dummyOpenAiKey), 'OpenAI key masked')
      assert.ok(report.includes('[REDACTED_API_KEY]'))

      assert.ok(!report.includes('987654321:abcdefghijklmnopqrstuvwxyz012345678'), 'Telegram bot token masked')
      assert.ok(report.includes('[REDACTED_TELEGRAM_BOT_TOKEN]'))

      assert.ok(!report.includes(dummyGoogleKey), 'Google Cloud API key masked')
      assert.ok(report.includes('[REDACTED_GOOGLE_API_KEY]'))

      assert.ok(!report.includes('eyJhbGciOiJIUzI1Ni.secretjwttoken'), 'Bearer token masked')
      assert.ok(report.includes('Bearer [REDACTED_BEARER_TOKEN]'))
    })
  })

  // =========================================================================
  // SUITE 4: TELEGRAM MARKDOWN FORMAT SUPPORT
  // =========================================================================
  describe('Suite 4: Telegram Markdown Format Support', () => {
    it('produces Telegram markdown when format: "telegram" is requested', () => {
      const report = reportModule.generateReportText({
        name: 'Ahmad',
        os: 'Windows 11',
        format: 'telegram',
        errorMsg: 'Simple test error'
      })

      assert.ok(report.includes('*Laporan Kesiapan Peserta Workshop*'))
      assert.ok(report.includes('Nama: `Ahmad`'))
      assert.ok(report.includes('Sistem operasi: `Windows 11`'))
      assert.ok(report.includes('```\nSimple test error\n```'))
    })
  })

  // =========================================================================
  // SUITE 5: DATA MODEL & MULTI-COURSE ISOLATION (PRE-NAV-03)
  // =========================================================================
  describe('Suite 5: Data Model & Multi-Course Isolation (PRE-NAV-03)', () => {
    it('DEFAULT_PRETRAINING_STATE contains name field initialized to empty string', () => {
      const defaultState = pretrainingStateModule.DEFAULT_PRETRAINING_STATE
      assert.ok('name' in defaultState.participantInfo, 'participantInfo has name')
      assert.equal(defaultState.participantInfo.name, '')
    })

    it('maintains strict isolation from learnwith_word_state_v1 storage key', () => {
      const aiKeys = [
        pretrainingStateModule.STORAGE_KEY_AI_STATE,
        pretrainingStateModule.STORAGE_KEY_AI_CHECKLIST,
        pretrainingStateModule.LEGACY_STORAGE_KEY_AI
      ]

      for (const k of aiKeys) {
        assert.ok(!k.includes('word'), `Key ${k} must not reference word course`)
      }
    })
  })

  // =========================================================================
  // SUITE 6: UI COMPONENT & ROUTE INTEGRITY (PRE-RPT-01, PRE-RPT-03, PRE-NAV-01, PRE-NAV-02)
  // =========================================================================
  describe('Suite 6: UI Component & Route Integrity (PRE-RPT-01, PRE-RPT-03, PRE-NAV-01, PRE-NAV-02)', () => {
    it('verifies PretrainingReadinessReportSection component exists and has required DOM element IDs', () => {
      const filePath = path.resolve(__dirname, '../app/components/course/pretraining/PretrainingReadinessReportSection.tsx')
      assert.ok(fs.existsSync(filePath), 'Component file must exist')
      const content = fs.readFileSync(filePath, 'utf8')

      assert.ok(content.includes('id="sec-readiness-report"'), 'Must contain sec-readiness-report')
      assert.ok(content.includes('id="input-report-name"'), 'Must contain input-report-name')
      assert.ok(content.includes('id="select-report-os"'), 'Must contain select-report-os')
      assert.ok(content.includes('id="input-report-problem-step"'), 'Must contain input-report-problem-step')
      assert.ok(content.includes('id="input-report-error-msg"'), 'Must contain input-report-error-msg')
      assert.ok(content.includes('id="report-output-preview"'), 'Must contain report-output-preview')
      assert.ok(content.includes('id="btn-copy-report"'), 'Must contain btn-copy-report')
      assert.ok(content.includes('id="btn-print-report"'), 'Must contain btn-print-report')
      assert.ok(content.includes('window.print()'), 'Must wire window.print()')
    })

    it('verifies PretrainingSidebar component exists with required navigation and dynamic badge IDs', () => {
      const filePath = path.resolve(__dirname, '../app/components/course/pretraining/PretrainingSidebar.tsx')
      assert.ok(fs.existsSync(filePath), 'Sidebar component file must exist')
      const content = fs.readFileSync(filePath, 'utf8')

      assert.ok(content.includes('id="app-sidebar"'), 'Must contain app-sidebar')
      assert.ok(content.includes('id="btn-sidebar-course-select"'), 'Must contain course selector button')
      assert.ok(content.includes('id="sidebar-mode-switcher-container"'), 'Must contain mode switcher container')
      assert.ok(content.includes('id="tab-pretraining-sidebar"'), 'Must contain tab-pretraining-sidebar')
      assert.ok(content.includes('id="tab-liveclass-sidebar"'), 'Must contain tab-liveclass-sidebar')
      assert.ok(content.includes('id="badge-nav-m1"'), 'Must contain badge-nav-m1')
      assert.ok(content.includes('id="badge-nav-m2"'), 'Must contain badge-nav-m2')
      assert.ok(content.includes('id="badge-nav-m3"'), 'Must contain badge-nav-m3')
      assert.ok(content.includes('id="badge-nav-m4"'), 'Must contain badge-nav-m4')
      assert.ok(content.includes('id="status-nav-cp1"'), 'Must contain status-nav-cp1')
      assert.ok(content.includes('id="status-nav-cp2"'), 'Must contain status-nav-cp2')
      assert.ok(content.includes('id="status-nav-cp3"'), 'Must contain status-nav-cp3')
    })

    it('verifies app/routes/course.ai.tsx imports and renders both PretrainingSidebar and PretrainingReadinessReportSection', () => {
      const filePath = path.resolve(__dirname, '../app/routes/course.ai.tsx')
      assert.ok(fs.existsSync(filePath), 'Route file must exist')
      const content = fs.readFileSync(filePath, 'utf8')

      assert.ok(content.includes('PretrainingSidebar'), 'Must import and mount PretrainingSidebar')
      assert.ok(content.includes('<PretrainingSidebar'), 'Must render PretrainingSidebar tag')
      assert.ok(content.includes('PretrainingReadinessReportSection'), 'Must import and mount PretrainingReadinessReportSection')
      assert.ok(content.includes('<PretrainingReadinessReportSection />'), 'Must render PretrainingReadinessReportSection tag')
    })
  })
})

