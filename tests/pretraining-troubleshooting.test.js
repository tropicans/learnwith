/**
 * Automated Unit Tests for Troubleshooting Hub Dataset, Search & Filter Logic,
 * and Secret Token Redaction Engine (Phase 27)
 * Requirements: PRE-TOOL-01, PRE-TOOL-02, PRE-TOOL-03
 */

const { describe, it, before } = require('node:test')
const assert = require('node:assert/strict')

describe('Phase 27 Troubleshooting Hub & Secret Redaction Engine Suite', () => {
  let troubleshootingModule
  let redactionModule

  before(async () => {
    troubleshootingModule = await import(
      '../app/data/pretrainingTroubleshooting.ts'
    )
    redactionModule = await import('../app/utils/redaction.ts')
  })

  // =========================================================================
  // SUITE 1: DATA MODEL & ERROR RESOLUTION CARDS (PRE-TOOL-01, PRE-TOOL-02)
  // =========================================================================
  describe('Suite 1: Data Model & Error Cards (PRE-TOOL-01, PRE-TOOL-02)', () => {
    it('contains exactly 15 troubleshooting items meeting the requirement of >= 10', () => {
      const items = troubleshootingModule.PRETRAINING_TROUBLESHOOTING_ITEMS
      assert.ok(Array.isArray(items), 'Items must be an array')
      assert.equal(items.length, 15, 'Must contain exactly 15 error resolution cards')
    })

    it('covers all 5 functional categories plus the all filter option', () => {
      const categories = troubleshootingModule.TROUBLESHOOTING_CATEGORIES
      assert.equal(categories.length, 6, 'Must contain 6 category options')
      const catIds = categories.map((c) => c.id)
      assert.deepEqual(catIds, [
        'all',
        'node',
        'router',
        'telegram',
        'hermes',
        'powershell',
      ])

      const items = troubleshootingModule.PRETRAINING_TROUBLESHOOTING_ITEMS
      const itemCategories = new Set(items.map((i) => i.category))
      assert.ok(itemCategories.has('node'), 'Must contain node items')
      assert.ok(itemCategories.has('router'), 'Must contain router items')
      assert.ok(itemCategories.has('telegram'), 'Must contain telegram items')
      assert.ok(itemCategories.has('hermes'), 'Must contain hermes items')
      assert.ok(itemCategories.has('powershell'), 'Must contain powershell items')
    })

    it('includes all explicit named cards: EADDRINUSE, 401 Unauthorized, Execution_Policies, Telegram 409 Conflict', () => {
      const items = troubleshootingModule.PRETRAINING_TROUBLESHOOTING_ITEMS

      // 1. EADDRINUSE
      const eaddrinuseCard = items.find(
        (i) =>
          i.title.includes('EADDRINUSE') ||
          i.cause.includes('EADDRINUSE') ||
          i.keywords?.includes('eaddrinuse')
      )
      assert.ok(eaddrinuseCard, 'Must contain EADDRINUSE card')
      assert.equal(eaddrinuseCard.category, 'router')
      assert.ok(
        eaddrinuseCard.codeBlock?.code.includes('20128'),
        'EADDRINUSE card must reference port 20128'
      )

      // 2. 401 Unauthorized
      const unauthorizedCard = items.find(
        (i) =>
          i.title.includes('401') ||
          i.cause.includes('401') ||
          i.keywords?.includes('401')
      )
      assert.ok(unauthorizedCard, 'Must contain 401 Unauthorized card')
      assert.equal(unauthorizedCard.category, 'router')

      // 3. Execution_Policies
      const execPolicyCard = items.find(
        (i) =>
          i.title.includes('Execution_Policies') ||
          i.title.includes('running scripts is disabled') ||
          i.keywords?.includes('execution_policies')
      )
      assert.ok(execPolicyCard, 'Must contain Execution_Policies card')
      assert.equal(execPolicyCard.category, 'powershell')

      // 4. Telegram 409 Conflict
      const tgConflictCard = items.find(
        (i) =>
          i.title.includes('Telegram 409 Conflict') ||
          i.title.includes('getUpdates') ||
          i.keywords?.includes('telegram 409 conflict')
      )
      assert.ok(tgConflictCard, 'Must contain Telegram 409 Conflict card')
      assert.equal(tgConflictCard.category, 'telegram')
      assert.ok(
        tgConflictCard.codeBlock?.code.includes('hermes gateway stop'),
        'Telegram 409 card must provide hermes gateway stop'
      )
    })

    it('validates that every item contains valid, non-empty attributes and non-empty steps', () => {
      const items = troubleshootingModule.PRETRAINING_TROUBLESHOOTING_ITEMS
      const validSeverities = ['neutral', 'warning', 'danger', 'primary']

      for (const item of items) {
        assert.ok(item.id && typeof item.id === 'string', `Item ${item.id} must have string id`)
        assert.ok(item.title && typeof item.title === 'string', `Item ${item.id} must have title`)
        assert.ok(item.cause && typeof item.cause === 'string', `Item ${item.id} must have cause`)
        assert.ok(item.icon && typeof item.icon === 'string', `Item ${item.id} must have icon`)
        assert.ok(
          validSeverities.includes(item.severity),
          `Item ${item.id} severity ${item.severity} must be valid`
        )
        assert.ok(
          Array.isArray(item.steps) && item.steps.length >= 1,
          `Item ${item.id} must have at least 1 step`
        )

        if (item.codeBlock) {
          assert.ok(
            item.codeBlock.language && typeof item.codeBlock.language === 'string',
            `Item ${item.id} codeBlock must have language`
          )
          assert.ok(
            item.codeBlock.code && typeof item.codeBlock.code === 'string',
            `Item ${item.id} codeBlock must have non-empty code`
          )
        }
      }
    })
  })

  // =========================================================================
  // SUITE 2: SEARCH & CATEGORY FILTER LOGIC (PRE-TOOL-01)
  // =========================================================================
  describe('Suite 2: Search & Filter Logic Simulation (PRE-TOOL-01)', () => {
    const items = () => troubleshootingModule.PRETRAINING_TROUBLESHOOTING_ITEMS

    function simulateFilter(category, query) {
      const q = query.toLowerCase().trim()
      return items().filter((item) => {
        const matchesCategory = category === 'all' || item.category === category
        if (!matchesCategory) return false

        if (!q) return true

        const matchTitle = item.title.toLowerCase().includes(q)
        const matchCause = item.cause.toLowerCase().includes(q)
        const matchSteps = item.steps.some((s) => s.toLowerCase().includes(q))
        const matchKeywords =
          item.keywords?.some((k) => k.toLowerCase().includes(q)) || false
        const matchCategory = item.categoryLabel.toLowerCase().includes(q)

        return (
          matchTitle || matchCause || matchSteps || matchKeywords || matchCategory
        )
      })
    }

    it('filters items correctly by category', () => {
      const allItems = simulateFilter('all', '')
      assert.equal(allItems.length, 15)

      const nodeItems = simulateFilter('node', '')
      assert.ok(nodeItems.length >= 2)
      assert.ok(nodeItems.every((i) => i.category === 'node'))

      const psItems = simulateFilter('powershell', '')
      assert.ok(psItems.length >= 2)
      assert.ok(psItems.every((i) => i.category === 'powershell'))

      const routerItems = simulateFilter('router', '')
      assert.ok(routerItems.length >= 5)
      assert.ok(routerItems.every((i) => i.category === 'router'))

      const tgItems = simulateFilter('telegram', '')
      assert.ok(tgItems.length >= 4)
      assert.ok(tgItems.every((i) => i.category === 'telegram'))

      const hermesItems = simulateFilter('hermes', '')
      assert.ok(hermesItems.length >= 2)
      assert.ok(hermesItems.every((i) => i.category === 'hermes'))
    })

    it('performs live case-insensitive substring search matching titles, causes, and steps', () => {
      const eaddrResults = simulateFilter('all', 'eaddrinuse')
      assert.ok(eaddrResults.length >= 1)
      assert.equal(eaddrResults[0].id, 'trbl-router-eaddrinuse')

      const botFatherResults = simulateFilter('all', 'BotFather')
      assert.ok(botFatherResults.length >= 2)

      const bypassResults = simulateFilter('all', 'bypass')
      assert.ok(bypassResults.length >= 1)
      assert.equal(bypassResults[0].id, 'trbl-ps-execution-policies')
    })

    it('returns empty array when search query matches no items', () => {
      const noResults = simulateFilter('all', 'nonexistent_random_error_xyz123')
      assert.deepEqual(noResults, [])
    })

    it('combines category filtering and search query simultaneously', () => {
      // Searching for 'node' inside 'powershell' category should yield 0 items
      const crossFilter = simulateFilter('powershell', 'node is not recognized')
      assert.equal(crossFilter.length, 0)

      // Searching for 'node' inside 'node' category should yield items
      const matchFilter = simulateFilter('node', 'node is not recognized')
      assert.equal(matchFilter.length, 1)
      assert.equal(matchFilter[0].id, 'trbl-node-not-recognized')
    })
  })

  // =========================================================================
  // SUITE 3: SECRET TOKEN REDACTION ENGINE (PRE-TOOL-03)
  // =========================================================================
  describe('Suite 3: Secret Token Redaction Engine (PRE-TOOL-03)', () => {
    it('masks Telegram Bot Token correctly and tracks match count', () => {
      const token = '123456789:ABCDefGhIjKlMnOpQrStUvWxYz012345678'
      const input = `Error: Polling failed for token ${token}`
      const result = redactionModule.sanitizeLogText(input)

      assert.ok(result.sanitized.includes('[REDACTED_TELEGRAM_BOT_TOKEN]'))
      assert.ok(!result.sanitized.includes(token))
      assert.equal(result.matchesCount, 1)
    })

    it('masks OpenAI API Key correctly', () => {
      const key = 'sk-proj-1234567890abcdef1234567890'
      const input = `OpenAI authorization failed for key: ${key}`
      const result = redactionModule.sanitizeLogText(input)

      assert.ok(result.sanitized.includes('[REDACTED_API_KEY]'))
      assert.ok(!result.sanitized.includes(key))
      assert.equal(result.matchesCount, 1)
    })

    it('masks Google Cloud / Gemini API Key correctly', () => {
      const key = 'AIzaSyD1234567890abcdefghijklmnopqrstuv'
      const input = `gemini-pro call error with apiKey=${key}`
      const result = redactionModule.sanitizeLogText(input)

      assert.ok(result.sanitized.includes('[REDACTED_GOOGLE_API_KEY]'))
      assert.ok(!result.sanitized.includes(key))
      assert.equal(result.matchesCount, 1)
    })

    it('masks Bearer / JWT Token correctly', () => {
      const header = 'Bearer eyJhbGciOiJIUzI1Ni.x1y2z3'
      const input = `Authorization: ${header}`
      const result = redactionModule.sanitizeLogText(input)

      assert.ok(result.sanitized.includes('Bearer [REDACTED_BEARER_TOKEN]'))
      assert.ok(!result.sanitized.includes('eyJhbGciOiJIUzI1Ni.x1y2z3'))
      assert.equal(result.matchesCount, 1)
    })

    it('masks Email Address correctly', () => {
      const email = 'budi.santoso@example.co.id'
      const input = `Contact support at ${email} for escalation.`
      const result = redactionModule.sanitizeLogText(input)

      assert.ok(result.sanitized.includes('[REDACTED_EMAIL]'))
      assert.ok(!result.sanitized.includes(email))
      assert.equal(result.matchesCount, 1)
    })

    it('masks Windows User Directory paths correctly', () => {
      const path = 'C:\\Users\\budi_santoso\\AppData\\Roaming\\npm'
      const input = `Failed loading module at ${path}`
      const result = redactionModule.sanitizeLogText(input)

      assert.ok(result.sanitized.includes('C:\\Users\\[USER]\\AppData'))
      assert.ok(!result.sanitized.includes('budi_santoso'))
      assert.equal(result.matchesCount, 1)
    })

    it('handles multi-secret inputs redacting all entities and summing matchesCount accurately', () => {
      const combined = `User: budi.santoso@example.co.id
Path: C:\\Users\\budi_santoso\\AppData
Bot: 123456789:ABCDefGhIjKlMnOpQrStUvWxYz012345678
OpenAI: sk-proj-1234567890abcdef1234567890
Gemini: AIzaSyD1234567890abcdefghijklmnopqrstuv
Header: Bearer secret-token-value-12345`

      const result = redactionModule.sanitizeLogText(combined)
      assert.equal(result.matchesCount, 6)
      assert.ok(result.sanitized.includes('[REDACTED_EMAIL]'))
      assert.ok(result.sanitized.includes('C:\\Users\\[USER]\\AppData'))
      assert.ok(result.sanitized.includes('[REDACTED_TELEGRAM_BOT_TOKEN]'))
      assert.ok(result.sanitized.includes('[REDACTED_API_KEY]'))
      assert.ok(result.sanitized.includes('[REDACTED_GOOGLE_API_KEY]'))
      assert.ok(result.sanitized.includes('Bearer [REDACTED_BEARER_TOKEN]'))
    })

    it('handles empty, null, and undefined inputs safely without throwing', () => {
      assert.deepEqual(redactionModule.sanitizeLogText(null), {
        sanitized: '',
        matchesCount: 0,
      })
      assert.deepEqual(redactionModule.sanitizeLogText(undefined), {
        sanitized: '',
        matchesCount: 0,
      })
      assert.deepEqual(redactionModule.sanitizeLogText(''), {
        sanitized: '',
        matchesCount: 0,
      })
      assert.deepEqual(redactionModule.sanitizeLogText('clean log without secrets'), {
        sanitized: 'clean log without secrets',
        matchesCount: 0,
      })
    })

    it('resets RegExp lastIndex properly across consecutive invocations', () => {
      const token = '123456789:ABCDefGhIjKlMnOpQrStUvWxYz012345678'
      const res1 = redactionModule.sanitizeLogText(`Token: ${token}`)
      const res2 = redactionModule.sanitizeLogText(`Token: ${token}`)
      assert.equal(res1.matchesCount, 1)
      assert.equal(res2.matchesCount, 1)
      assert.equal(res1.sanitized, res2.sanitized)
    })
  })
})
