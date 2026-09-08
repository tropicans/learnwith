/**
 * Automated Unit Tests for Pre-Training Foundation Sections & Data Extraction (Phase 24)
 * Requirements: PRE-BASE-01, PRE-BASE-02, PRE-BASE-03, PRE-BASE-04, PRE-BASE-05
 */
const { describe, it, before } = require('node:test')
const assert = require('node:assert')
const fs = require('node:fs')
const path = require('node:path')

describe('Phase 24 Pre-Training Foundation Suite (PRE-BASE-01..05)', () => {
  let foundationData

  before(async () => {
    foundationData = await import('../app/data/pretrainingFoundation.ts')
  })

  describe('Suite 1: Foundation Data Layer (app/data/pretrainingFoundation.ts)', () => {
    it('exports hero stats with complete metadata', () => {
      const stats = foundationData.PRETRAINING_HERO_STATS
      assert.ok(Array.isArray(stats), 'Hero stats should be an array')
      assert.strictEqual(stats.length, 4, 'Should have 4 hero stat items')
      stats.forEach((stat) => {
        assert.ok(stat.icon, 'Stat icon should exist')
        assert.ok(stat.value, 'Stat value should exist')
        assert.ok(stat.label, 'Stat label should exist')
      })
    })

    it('exports 3 target criteria with step numbers and descriptions (PRE-BASE-01)', () => {
      const criteria = foundationData.PRETRAINING_TARGET_CRITERIA
      assert.strictEqual(criteria.length, 3, 'Must have 3 target criteria steps')
      assert.strictEqual(criteria[0].step, 1)
      assert.ok(criteria[0].title.includes('9Router'))
      assert.strictEqual(criteria[1].step, 2)
      assert.ok(criteria[1].title.includes('Dashboard'))
      assert.strictEqual(criteria[2].step, 3)
      assert.ok(criteria[2].title.includes('Bot Telegram'))
    })

    it('exports at least 8 technical glossary definitions (PRE-BASE-02)', () => {
      const terms = foundationData.PRETRAINING_GLOSSARY_TERMS
      assert.ok(terms.length >= 8, 'Glossary must have at least 8 items')
      const termNames = terms.map((t) => t.term)
      assert.ok(termNames.some((t) => t.includes('Browser')))
      assert.ok(termNames.some((t) => t.includes('PowerShell')))
      assert.ok(termNames.some((t) => t.includes('Node.js')))
      assert.ok(termNames.some((t) => t.includes('9Router')))
      assert.ok(termNames.some((t) => t.includes('Token')))
      assert.ok(termNames.some((t) => t.includes('BotFather')))
      assert.ok(termNames.some((t) => t.includes('Telegram User ID')))
      assert.ok(termNames.some((t) => t.includes('Checkpoint')))
    })

    it('exports 4 mandatory security protocols (PRE-BASE-03)', () => {
      const rules = foundationData.PRETRAINING_SECURITY_RULES
      assert.strictEqual(rules.length, 4, 'Must have exactly 4 security rules')
      assert.ok(rules[0].highlight.includes('DILARANG'))
      assert.ok(rules[1].highlight.includes('DILARANG'))
      assert.ok(rules[2].highlight.includes('DILARANG'))
      assert.ok(rules[3].highlight.includes('WAJIB SENSOR'))
    })

    it('exports 7 hardware and software prerequisite checklist items (PRE-BASE-04)', () => {
      const prereqs = foundationData.PRETRAINING_PREREQUISITES
      assert.strictEqual(prereqs.length, 7, 'Must have 7 prerequisite items')
      const ids = prereqs.map((p) => p.id)
      assert.ok(ids.includes('prereq-laptop'))
      assert.ok(ids.includes('prereq-charger'))
      assert.ok(ids.includes('prereq-internet'))
      assert.ok(ids.includes('prereq-browser'))
      assert.ok(ids.includes('prereq-admin'))
      assert.ok(ids.includes('prereq-telegram'))
      assert.ok(ids.includes('prereq-google'))
    })

    it('exports 3 PowerShell setup steps with prompt explanation (PRE-BASE-05)', () => {
      const steps = foundationData.PRETRAINING_POWERSHELL_STEPS
      assert.strictEqual(steps.length, 3, 'Must have 3 PowerShell setup steps')
      assert.strictEqual(steps[0].step, 1)
      assert.strictEqual(steps[1].step, 2)
      assert.strictEqual(steps[2].step, 3)
      assert.ok(steps[2].description.includes('PS C:\\Users'))
    })
  })

  describe('Suite 2: Component Architecture & Route Integration Parity', () => {
    const compDir = path.resolve(__dirname, '../app/components/course/pretraining')
    const routeFile = path.resolve(__dirname, '../app/routes/course.ai.tsx')

    it('verifies all 6 pretraining foundation component files exist', () => {
      const requiredComponents = [
        'PretrainingHero.tsx',
        'PretrainingTargetSection.tsx',
        'PretrainingGlossarySection.tsx',
        'PretrainingSecuritySection.tsx',
        'PretrainingPrerequisitesSection.tsx',
        'PretrainingPowerShellSection.tsx',
      ]
      for (const comp of requiredComponents) {
        const filePath = path.join(compDir, comp)
        assert.ok(fs.existsSync(filePath), `Component file ${comp} must exist`)
      }
    })

    it('verifies components define the exact section IDs from index.html', () => {
      const targetContent = fs.readFileSync(
        path.join(compDir, 'PretrainingTargetSection.tsx'),
        'utf8'
      )
      assert.ok(targetContent.includes('id="sec-target"'), 'sec-target ID must be present')

      const glossaryContent = fs.readFileSync(
        path.join(compDir, 'PretrainingGlossarySection.tsx'),
        'utf8'
      )
      assert.ok(
        glossaryContent.includes('id="sec-glosarium"'),
        'sec-glosarium ID must be present'
      )

      const securityContent = fs.readFileSync(
        path.join(compDir, 'PretrainingSecuritySection.tsx'),
        'utf8'
      )
      assert.ok(
        securityContent.includes('id="sec-security"'),
        'sec-security ID must be present'
      )

      const prereqContent = fs.readFileSync(
        path.join(compDir, 'PretrainingPrerequisitesSection.tsx'),
        'utf8'
      )
      assert.ok(
        prereqContent.includes('id="sec-prerequisites"'),
        'sec-prerequisites ID must be present'
      )

      const psContent = fs.readFileSync(
        path.join(compDir, 'PretrainingPowerShellSection.tsx'),
        'utf8'
      )
      assert.ok(
        psContent.includes('id="sec-powershell"'),
        'sec-powershell ID must be present'
      )
    })

    it('verifies app/routes/course.ai.tsx renders foundation components in mode pretraining', () => {
      const routeContent = fs.readFileSync(routeFile, 'utf8')
      assert.ok(
        routeContent.includes('PretrainingHero'),
        'PretrainingHero must be imported and rendered'
      )
      assert.ok(
        routeContent.includes('PretrainingTargetSection'),
        'PretrainingTargetSection must be imported and rendered'
      )
      assert.ok(
        routeContent.includes('PretrainingGlossarySection'),
        'PretrainingGlossarySection must be imported and rendered'
      )
      assert.ok(
        routeContent.includes('PretrainingSecuritySection'),
        'PretrainingSecuritySection must be imported and rendered'
      )
      assert.ok(
        routeContent.includes('PretrainingPrerequisitesSection'),
        'PretrainingPrerequisitesSection must be imported and rendered'
      )
      assert.ok(
        routeContent.includes('PretrainingPowerShellSection'),
        'PretrainingPowerShellSection must be imported and rendered'
      )
      assert.ok(
        routeContent.includes('id="container-pretraining"'),
        'container-pretraining wrapper must be rendered'
      )
    })
  })
})
