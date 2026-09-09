/**
 * Automated Unit & Integration Tests for Interactive Pretraining Modules (Phase 25)
 * Requirements: PRE-MOD-01 through PRE-MOD-06
 */
const { describe, it, before } = require('node:test')
const assert = require('node:assert')
const fs = require('node:fs')
const path = require('node:path')

describe('Phase 25 Interactive Pretraining Modules Suite (PRE-MOD-01..06)', () => {
  let modulesData

  before(async () => {
    modulesData = await import('../app/data/pretrainingModules.ts')
  })

  // ==========================================
  // SUITE 1: DATA MODEL COMPLETENESS (PRE-MOD-01..05)
  // ==========================================
  describe('Suite 1: Data Model Completeness (PRE-MOD-01..05)', () => {
    it('exports PRETRAINING_MODULES with exactly 5 modules (sec-module-1..5)', () => {
      const modules = modulesData.PRETRAINING_MODULES
      assert.ok(Array.isArray(modules), 'PRETRAINING_MODULES must be an array')
      assert.strictEqual(modules.length, 5, 'Must contain exactly 5 modules')
      assert.deepStrictEqual(
        modules.map((m) => m.id),
        ['sec-module-1', 'sec-module-2', 'sec-module-3', 'sec-module-4', 'sec-module-5'],
        'Modules must have IDs sec-module-1 through sec-module-5'
      )
      assert.deepStrictEqual(
        modules.map((m) => m.num),
        [1, 2, 3, 4, 5],
        'Module sequence numbers must be 1 to 5'
      )
    })

    it('validates Modul 1 (Node.js) steps, commands, and Checkpoint 1 preview (PRE-MOD-01)', () => {
      const mod1 = modulesData.PRETRAINING_MODULES.find((m) => m.id === 'sec-module-1')
      assert.ok(mod1, 'Modul 1 must exist')
      assert.strictEqual(mod1.steps.length, 3, 'Modul 1 must contain exactly 3 steps')

      const taskIds = mod1.steps.map((s) => s.taskId)
      assert.deepStrictEqual(
        taskIds,
        ['m1-check-node', 'm1-verify-lts', 'm1-check-npm'],
        'Modul 1 step task IDs must match expected progression'
      )

      // Verify node --version and npm --version
      assert.strictEqual(mod1.steps[0].command, 'node --version')
      assert.strictEqual(mod1.steps[2].command, 'npm --version')

      // Checkpoint 1 verification
      assert.ok(mod1.checkpoint, 'Modul 1 must contain checkpoint preview')
      assert.strictEqual(mod1.checkpoint.checkpointNum, 1)
      assert.ok(
        mod1.checkpoint.title.includes('Target Tahap 1') || mod1.checkpoint.badge.includes('Target Tahap 1'),
        'Checkpoint 1 must feature Target Tahap 1'
      )
      assert.ok(
        mod1.checkpoint.requirements.some((r) => r.includes('Node.js') || r.includes('node')),
        'Checkpoint 1 requirements must reference Node.js'
      )
    })

    it('validates Modul 2 (9Router) steps, commands, and Checkpoint 2 preview (PRE-MOD-02)', () => {
      const mod2 = modulesData.PRETRAINING_MODULES.find((m) => m.id === 'sec-module-2')
      assert.ok(mod2, 'Modul 2 must exist')
      assert.strictEqual(mod2.steps.length, 4, 'Modul 2 must contain exactly 4 steps')

      const taskIds = mod2.steps.map((s) => s.taskId)
      assert.deepStrictEqual(
        taskIds,
        ['m2-install-pkg', 'm2-start-service', 'm2-open-dashboard', 'm2-verify-local'],
        'Modul 2 step task IDs must match expected progression'
      )

      // Verify commands: npm install -g 9router, 9router, Ctrl + C
      assert.strictEqual(mod2.steps[0].command, 'npm install -g 9router')
      assert.strictEqual(mod2.steps[1].command, '9router')
      assert.strictEqual(mod2.steps[3].command, 'Ctrl + C')

      const mod2Content = JSON.stringify(mod2)
      assert.ok(
        mod2Content.includes('localhost:20128') || mod2Content.includes('20128'),
        'Modul 2 must include port 20128 dashboard verification'
      )

      // Checkpoint 2 verification
      assert.ok(mod2.checkpoint, 'Modul 2 must contain checkpoint preview')
      assert.strictEqual(mod2.checkpoint.checkpointNum, 2)
      assert.ok(
        mod2.checkpoint.title.includes('Target Tahap 2') || mod2.checkpoint.badge.includes('Target Tahap 2'),
        'Checkpoint 2 must feature Target Tahap 2'
      )
      assert.ok(
        mod2.checkpoint.requirements.some((r) => r.includes('20128') || r.includes('9Router')),
        'Checkpoint 2 requirements must reference 9Router dashboard'
      )
    })

    it('validates Modul 3 (Telegram Bot) steps, commands, links, and Checkpoint 3 preview (PRE-MOD-03)', () => {
      const mod3 = modulesData.PRETRAINING_MODULES.find((m) => m.id === 'sec-module-3')
      assert.ok(mod3, 'Modul 3 must exist')
      assert.strictEqual(mod3.steps.length, 5, 'Modul 3 must contain exactly 5 steps')

      const taskIds = mod3.steps.map((s) => s.taskId)
      assert.deepStrictEqual(
        taskIds,
        ['m3-start-botfather', 'm3-create-newbot', 'm3-save-token-secure', 'm3-start-chat', 'm3-get-userid'],
        'Modul 3 step task IDs must match expected progression'
      )

      // Verify commands: /newbot, /revoke
      assert.strictEqual(mod3.steps[1].command, '/newbot')
      assert.strictEqual(mod3.steps[2].command, '/revoke')

      // Verify external links: BotFather and userinfobot
      assert.ok(mod3.steps[0].externalLink.url.includes('BotFather'))
      assert.ok(mod3.steps[4].externalLink.url.includes('userinfobot'))

      // Checkpoint 3 verification
      assert.ok(mod3.checkpoint, 'Modul 3 must contain checkpoint preview')
      assert.strictEqual(mod3.checkpoint.checkpointNum, 3)
      assert.ok(
        mod3.checkpoint.title.includes('Target Tahap 3') || mod3.checkpoint.badge.includes('Target Tahap 3'),
        'Checkpoint 3 must feature Target Tahap 3'
      )
      assert.ok(
        mod3.checkpoint.requirements.some((r) => r.includes('Token') || r.includes('User ID')),
        'Checkpoint 3 requirements must reference Bot Token or User ID'
      )
    })

    it('validates Modul 4 (Google Cloud & Hermes) steps, console URL, and pre-class boundaries (PRE-MOD-04)', () => {
      const mod4 = modulesData.PRETRAINING_MODULES.find((m) => m.id === 'sec-module-4')
      assert.ok(mod4, 'Modul 4 must exist')
      assert.strictEqual(mod4.steps.length, 2, 'Modul 4 must contain exactly 2 steps')

      const taskIds = mod4.steps.map((s) => s.taskId)
      assert.deepStrictEqual(
        taskIds,
        ['m4-open-console', 'm4-verify-login'],
        'Modul 4 step task IDs must match expected progression'
      )

      assert.ok(
        mod4.steps[0].externalLink.url.includes('console.cloud.google.com'),
        'Modul 4 must link to Google Cloud Console'
      )
      const mod4Content = JSON.stringify(mod4)
      assert.ok(
        mod4Content.includes('Google Cloud') && mod4Content.includes('Project'),
        'Modul 4 must provide guidance regarding Google Cloud Console readiness'
      )
    })

    it('validates Modul 5 (Catatan & Batasan) architectural flow and boundaries (PRE-MOD-05)', () => {
      const mod5 = modulesData.PRETRAINING_MODULES.find((m) => m.id === 'sec-module-5')
      assert.ok(mod5, 'Modul 5 must exist')
      assert.strictEqual(mod5.hasArchFlow, true, 'Modul 5 must enable architecture flow')

      const mod5Content = JSON.stringify(mod5)
      assert.ok(
        mod5Content.includes('Batasan 9Router'),
        'Modul 5 must contain Batasan regarding 9Router'
      )
      assert.ok(
        mod5Content.includes('Batasan Hermes'),
        'Modul 5 must contain Batasan regarding Hermes Agent'
      )
      assert.ok(
        mod5Content.includes('Pre-Training Anda Siap!'),
        'Modul 5 must outline readiness completion banner'
      )
    })
  })

  // ==========================================
  // SUITE 2: 1-CLICK COPY ENGINE & TOAST PARITY (PRE-MOD-06)
  // ==========================================
  describe('Suite 2: 1-Click Copy Engine & Toast Parity (PRE-MOD-06)', () => {
    const copyBlockFile = path.resolve(
      __dirname,
      '../app/components/course/pretraining/CopyableCodeBlock.tsx'
    )
    const toastFile = path.resolve(__dirname, '../app/components/ui/Toast.tsx')

    it('verifies CopyableCodeBlock implements clipboard API and textarea fallback', () => {
      assert.ok(fs.existsSync(copyBlockFile), 'CopyableCodeBlock.tsx must exist')
      const content = fs.readFileSync(copyBlockFile, 'utf8')

      assert.ok(
        content.includes('navigator.clipboard.writeText'),
        'Must support modern navigator.clipboard API'
      )
      assert.ok(
        content.includes("document.execCommand('copy')"),
        'Must provide fallback via document.execCommand copy'
      )
      assert.ok(
        content.includes("document.createElement('textarea')"),
        'Fallback must create offscreen textarea'
      )
    })

    it('verifies copy feedback triggers "✓ Tersalin!" and 2000ms reset timer', () => {
      const content = fs.readFileSync(copyBlockFile, 'utf8')
      assert.ok(
        content.includes('✓ Tersalin!'),
        'Must show "✓ Tersalin!" text on successful copy'
      )
      assert.ok(
        content.includes('setTimeout') && content.includes('2000'),
        'Must reset copied state after 2000ms'
      )
      assert.ok(
        content.includes('code-copy-btn'),
        'Must use .code-copy-btn class matching original design'
      )
    })

    it('verifies multi-line commands preserve newlines and whitespace formatting', () => {
      const content = fs.readFileSync(copyBlockFile, 'utf8')
      assert.ok(
        content.includes('<pre className="code-content">') && content.includes('<code>{code}</code>'),
        'Must render code within pre/code tags preserving formatting'
      )
      assert.ok(
        content.includes('cleanedText = text.replace('),
        'Must clean only outer bounding newlines to preserve inner formatting'
      )
    })

    it('verifies Toast component provides showToast and ToastContainer with design classes', () => {
      assert.ok(fs.existsSync(toastFile), 'Toast.tsx must exist')
      const content = fs.readFileSync(toastFile, 'utf8')

      assert.ok(content.includes('export function showToast'), 'Must export showToast helper')
      assert.ok(content.includes('export function ToastContainer'), 'Must export ToastContainer')
      assert.ok(content.includes('toast-container'), 'Must define toast-container class')
      assert.ok(content.includes('aria-live="polite"'), 'Must define accessible live region')
    })
  })

  // ==========================================
  // SUITE 3: MASTER ACCORDION & COMPONENT ARCHITECTURE
  // ==========================================
  describe('Suite 3: Master Accordion & Component Architecture', () => {
    const compDir = path.resolve(__dirname, '../app/components/course/pretraining')

    it('verifies PretrainingModulesSection implements master controls #btn-expand-all-modules and #btn-collapse-all-modules', () => {
      const filePath = path.join(compDir, 'PretrainingModulesSection.tsx')
      assert.ok(fs.existsSync(filePath), 'PretrainingModulesSection.tsx must exist')
      const content = fs.readFileSync(filePath, 'utf8')

      assert.ok(
        content.includes('id="dynamic-modules-container"'),
        'Must render container #dynamic-modules-container'
      )
      assert.ok(
        content.includes('id="btn-expand-all-modules"'),
        'Must render #btn-expand-all-modules button'
      )
      assert.ok(
        content.includes('id="btn-collapse-all-modules"'),
        'Must render #btn-collapse-all-modules button'
      )
      assert.ok(
        content.includes('Buka Semua Modul'),
        'Must include Buka Semua Modul label'
      )
      assert.ok(
        content.includes('Tutup Semua Modul'),
        'Must include Tutup Semua Modul label'
      )
      assert.ok(
        content.includes('showToast'),
        'Must trigger toast notification upon master toggle'
      )
    })

    it('verifies PretrainingModuleCard implements accessible ARIA attributes', () => {
      const filePath = path.join(compDir, 'PretrainingModuleCard.tsx')
      assert.ok(fs.existsSync(filePath), 'PretrainingModuleCard.tsx must exist')
      const content = fs.readFileSync(filePath, 'utf8')

      assert.ok(content.includes('role="button"'), 'Must have role="button" on module header')
      assert.ok(content.includes('aria-expanded={isExpanded}'), 'Must bind aria-expanded')
      assert.ok(content.includes('aria-controls='), 'Must define aria-controls')
      assert.ok(content.includes('module-chevron'), 'Must render module-chevron indicator')
    })

    it('verifies ModuleArchitectureFlow renders 4 connected workflow nodes', () => {
      const filePath = path.join(compDir, 'ModuleArchitectureFlow.tsx')
      assert.ok(fs.existsSync(filePath), 'ModuleArchitectureFlow.tsx must exist')
      const content = fs.readFileSync(filePath, 'utf8')

      assert.ok(content.includes('Telegram Ponsel'), 'Must render Telegram Ponsel node')
      assert.ok(content.includes('Hermes Agent'), 'Must render Hermes Agent node')
      assert.ok(content.includes('9Router'), 'Must render 9Router node')
      assert.ok(content.includes('Model AI Cloud'), 'Must render Model AI Cloud node')
      assert.ok(content.includes('arch-flow-container'), 'Must use arch-flow-container class')
    })

    it('verifies CheckpointPreviewCard renders milestone title, badge, and checklist', () => {
      const filePath = path.join(compDir, 'CheckpointPreviewCard.tsx')
      assert.ok(fs.existsSync(filePath), 'CheckpointPreviewCard.tsx must exist')
      const content = fs.readFileSync(filePath, 'utf8')

      assert.ok(content.includes('checkpoint.title'), 'Must render checkpoint title')
      assert.ok(content.includes('checkpoint.badge'), 'Must render checkpoint badge')
      assert.ok(content.includes('checkpoint.requirements'), 'Must render requirements list')
    })
  })

  // ==========================================
  // SUITE 4: ROUTE INTEGRATION
  // ==========================================
  describe('Suite 4: Route Integration', () => {
    const routeFile = path.resolve(__dirname, '../app/routes/course.ai.tsx')

    it('verifies app/routes/course.ai.tsx mounts PretrainingModulesSection beneath PretrainingPowerShellSection', () => {
      assert.ok(fs.existsSync(routeFile), 'app/routes/course.ai.tsx must exist')
      const content = fs.readFileSync(routeFile, 'utf8')

      assert.ok(
        content.includes('import { PretrainingModulesSection }'),
        'Must import PretrainingModulesSection'
      )
      assert.ok(
        content.includes('<PretrainingModulesSection />'),
        'Must mount <PretrainingModulesSection /> in mode pretraining'
      )

      // Ensure PretrainingModulesSection follows PretrainingPowerShellSection within #container-pretraining
      const psIdx = content.indexOf('<PretrainingPowerShellSection />')
      const modIdx = content.indexOf('<PretrainingModulesSection />')
      assert.ok(psIdx !== -1, 'PretrainingPowerShellSection must be present')
      assert.ok(modIdx !== -1, 'PretrainingModulesSection must be present')
      assert.ok(
        modIdx > psIdx,
        'PretrainingModulesSection must be placed beneath PretrainingPowerShellSection'
      )
    })
  })
})
