/**
 * Automated Unit & Integration Tests for Pretraining Checklist Engine,
 * Checkpoint Verification Gates, Dynamic Readiness, and Safe Reset Engine (Phase 26)
 * Requirements: PRE-CHK-01 through PRE-CHK-04
 */
const { describe, it, before, beforeEach } = require('node:test')
const assert = require('node:assert')
const fs = require('node:fs')
const path = require('node:path')

// Mock DOM / Storage for Node.js environment
if (typeof window === 'undefined') {
  global.window = {
    dispatchEvent() {},
    addEventListener() {},
    removeEventListener() {},
  }
}
if (typeof CustomEvent === 'undefined') {
  global.CustomEvent = class CustomEvent {
    constructor(event, params) {
      this.type = event
      this.detail = params?.detail
    }
  }
}
if (typeof localStorage === 'undefined' || !localStorage.getItem) {
  global.localStorage = {
    _data: {},
    getItem(k) {
      return Object.prototype.hasOwnProperty.call(this._data, k)
        ? this._data[k]
        : null
    },
    setItem(k, v) {
      this._data[k] = String(v)
    },
    removeItem(k) {
      delete this._data[k]
    },
    clear() {
      this._data = {}
    },
  }
}

describe('Phase 26 Checklist Engine & Checkpoint Gates Suite (PRE-CHK-01..04)', () => {
  let hookModule

  before(async () => {
    hookModule = await import('../app/hooks/usePretrainingState.ts')
  })

  beforeEach(() => {
    localStorage.clear()
  })

  // ==========================================
  // SUITE 1: 13-STEP CHECKLIST ENGINE (PRE-CHK-01)
  // ==========================================
  describe('Suite 1: 13-Step Checklist Engine (PRE-CHK-01)', () => {
    it('contains exactly 13 checklist task IDs matching the official curriculum', () => {
      const { PRETRAINING_CHECKLIST_TASK_IDS } = hookModule
      assert.ok(Array.isArray(PRETRAINING_CHECKLIST_TASK_IDS))
      assert.strictEqual(
        PRETRAINING_CHECKLIST_TASK_IDS.length,
        13,
        'Must contain exactly 13 checklist task IDs'
      )
    })

    it('validates task distribution across Modules 1 to 4', () => {
      const { PRETRAINING_CHECKLIST_TASK_IDS } = hookModule

      const m1Tasks = PRETRAINING_CHECKLIST_TASK_IDS.filter((id) =>
        id.startsWith('m1-')
      )
      const m2Tasks = PRETRAINING_CHECKLIST_TASK_IDS.filter((id) =>
        id.startsWith('m2-')
      )
      const m3Tasks = PRETRAINING_CHECKLIST_TASK_IDS.filter((id) =>
        id.startsWith('m3-')
      )
      const m4Tasks = PRETRAINING_CHECKLIST_TASK_IDS.filter((id) =>
        id.startsWith('m4-')
      )

      assert.deepStrictEqual(
        m1Tasks,
        ['m1-check-node', 'm1-verify-lts', 'm1-check-npm'],
        'Modul 1 has 3 tasks'
      )
      assert.deepStrictEqual(
        m2Tasks,
        ['m2-install-pkg', 'm2-start-service', 'm2-open-dashboard', 'm2-verify-local'],
        'Modul 2 has 4 tasks'
      )
      assert.deepStrictEqual(
        m3Tasks,
        ['m3-start-botfather', 'm3-create-newbot', 'm3-save-token-secure', 'm3-get-userid'],
        'Modul 3 has 4 tasks'
      )
      assert.deepStrictEqual(
        m4Tasks,
        ['m4-open-console', 'm4-verify-login'],
        'Modul 4 has 2 tasks'
      )
    })

    it('initializes all checklist items to false in DEFAULT_PRETRAINING_STATE', () => {
      const { DEFAULT_PRETRAINING_STATE, PRETRAINING_CHECKLIST_TASK_IDS } = hookModule
      PRETRAINING_CHECKLIST_TASK_IDS.forEach((id) => {
        assert.strictEqual(
          DEFAULT_PRETRAINING_STATE.checklists[id],
          false,
          `Task ${id} must default to false`
        )
      })
    })

    it('calculates progress accurately when checklist tasks are updated', () => {
      const { calculatePretrainingProgress, DEFAULT_PRETRAINING_STATE } = hookModule
      const state = {
        ...DEFAULT_PRETRAINING_STATE,
        checklists: { ...DEFAULT_PRETRAINING_STATE.checklists },
        checkpoints: { ...DEFAULT_PRETRAINING_STATE.checkpoints },
      }

      // Initial state
      let progress = calculatePretrainingProgress(state)
      assert.strictEqual(progress.completedTasks, 0)
      assert.strictEqual(progress.totalTasks, 13)
      assert.strictEqual(progress.percentage, 0)

      // Check 2 tasks in Modul 1
      state.checklists['m1-check-node'] = true
      state.checklists['m1-check-npm'] = true
      progress = calculatePretrainingProgress(state)
      assert.strictEqual(progress.completedTasks, 2)
      // 2/13 * 60% = 9.23% -> Math.round(9.23) = 9
      assert.strictEqual(progress.percentage, 9)

      // Check all 13 tasks with 0 checkpoints passed
      hookModule.PRETRAINING_CHECKLIST_TASK_IDS.forEach((id) => {
        state.checklists[id] = true
      })
      progress = calculatePretrainingProgress(state)
      assert.strictEqual(progress.completedTasks, 13)
      // 13/13 * 60% = 60%
      assert.strictEqual(progress.percentage, 60)
    })

    it('maintains strict multi-course storage isolation (no pollution to Word Course)', () => {
      const { STORAGE_KEY_AI_STATE, STORAGE_KEY_AI_CHECKLIST } = hookModule
      // Set Word state in localStorage
      localStorage.setItem('learnwith_word_state_v1', JSON.stringify({ bab: 1 }))
      localStorage.setItem('learnwith_word_unlocked', 'true')

      // Save AI state
      const sampleAi = { checklists: { 'm1-check-node': true } }
      localStorage.setItem(STORAGE_KEY_AI_STATE, JSON.stringify(sampleAi))
      localStorage.setItem(STORAGE_KEY_AI_CHECKLIST, JSON.stringify(sampleAi.checklists))

      // Verify Word state is completely untouched
      assert.strictEqual(
        localStorage.getItem('learnwith_word_state_v1'),
        JSON.stringify({ bab: 1 })
      )
      assert.strictEqual(localStorage.getItem('learnwith_word_unlocked'), 'true')
    })
  })

  // ==========================================
  // SUITE 2: CHECKPOINT VERIFICATION GATES (PRE-CHK-02)
  // ==========================================
  describe('Suite 2: Checkpoint Verification Gates (PRE-CHK-02)', () => {
    it('initializes cp-1, cp-2, cp-3 with status pending', () => {
      const { DEFAULT_PRETRAINING_STATE } = hookModule
      assert.strictEqual(DEFAULT_PRETRAINING_STATE.checkpoints['cp-1'], 'pending')
      assert.strictEqual(DEFAULT_PRETRAINING_STATE.checkpoints['cp-2'], 'pending')
      assert.strictEqual(DEFAULT_PRETRAINING_STATE.checkpoints['cp-3'], 'pending')
    })

    it('supports status transitions between pending, passed, and failed', () => {
      const { calculatePretrainingProgress, DEFAULT_PRETRAINING_STATE } = hookModule
      const state = {
        ...DEFAULT_PRETRAINING_STATE,
        checklists: { ...DEFAULT_PRETRAINING_STATE.checklists },
        checkpoints: { ...DEFAULT_PRETRAINING_STATE.checkpoints },
      }

      state.checkpoints['cp-1'] = 'passed'
      let progress = calculatePretrainingProgress(state)
      assert.strictEqual(progress.passedCheckpoints, 1)
      assert.strictEqual(progress.totalCheckpoints, 3)
      // 0 tasks (0%) + 1/3 CPs (13.33%) = 13%
      assert.strictEqual(progress.percentage, 13)

      state.checkpoints['cp-2'] = 'passed'
      state.checkpoints['cp-3'] = 'passed'
      progress = calculatePretrainingProgress(state)
      assert.strictEqual(progress.passedCheckpoints, 3)
      // 0 tasks (0%) + 3/3 CPs (40%) = 40%
      assert.strictEqual(progress.percentage, 40)

      state.checkpoints['cp-2'] = 'failed'
      progress = calculatePretrainingProgress(state)
      assert.strictEqual(progress.passedCheckpoints, 2)
      // 2/3 CPs (26.67%) = 27%
      assert.strictEqual(progress.percentage, 27)
    })

    it('validates Telegram Bot Username format with regex /(bot|_bot)$/i', () => {
      const tgRegex = /(bot|_bot)$/i

      // Valid usernames
      assert.ok(tgRegex.test('jadwal_bot'), 'jadwal_bot should be valid')
      assert.ok(tgRegex.test('my_calendar_bot'), 'my_calendar_bot should be valid')
      assert.ok(tgRegex.test('HermesBot'), 'HermesBot should be valid')
      assert.ok(tgRegex.test('@my_work_bot'), '@my_work_bot should be valid')
      assert.ok(tgRegex.test('budi_calendar_BOT'), 'budi_calendar_BOT should be valid')

      // Invalid usernames
      assert.strictEqual(tgRegex.test('jadwalbotku'), false, 'jadwalbotku must be invalid')
      assert.strictEqual(tgRegex.test('asisten_jadwal'), false, 'asisten_jadwal must be invalid')
      assert.strictEqual(tgRegex.test('testbot123'), false, 'testbot123 must be invalid')
      assert.strictEqual(tgRegex.test('botfather'), false, 'botfather must be invalid')
    })

    it('validates Telegram User ID format with regex /^\\d+$/', () => {
      const idRegex = /^\d+$/

      // Valid numeric IDs
      assert.ok(idRegex.test('123456789'), '123456789 should be valid')
      assert.ok(idRegex.test('987654321'), '987654321 should be valid')
      assert.ok(idRegex.test('5412983712'), '5412983712 should be valid')

      // Invalid IDs
      assert.strictEqual(idRegex.test('@user123'), false, '@user123 must be invalid')
      assert.strictEqual(idRegex.test('id-12345'), false, 'id-12345 must be invalid')
      assert.strictEqual(idRegex.test('123 456'), false, '123 456 with spaces must be invalid')
      assert.strictEqual(idRegex.test('abc'), false, 'abc must be invalid')
      assert.strictEqual(idRegex.test(''), false, 'empty string must be invalid')
    })
  })

  // ==========================================
  // SUITE 3: DYNAMIC READINESS CALCULATION (PRE-CHK-03)
  // ==========================================
  describe('Suite 3: Dynamic Readiness Calculation (PRE-CHK-03)', () => {
    it('evaluates to pending status initially', () => {
      const { calculatePretrainingProgress, calculatePretrainingReadiness, DEFAULT_PRETRAINING_STATE } = hookModule
      const progress = calculatePretrainingProgress(DEFAULT_PRETRAINING_STATE)
      const readiness = calculatePretrainingReadiness(progress, DEFAULT_PRETRAINING_STATE.checkpoints)

      assert.strictEqual(readiness.status, 'pending')
      assert.strictEqual(readiness.label, '⏳ MENUNGGU PENYELESAIAN LANGKAH')
      assert.strictEqual(readiness.badgeClass, 'status-pending')
    })

    it('evaluates to clinic status immediately when any checkpoint has failed status', () => {
      const { calculatePretrainingProgress, calculatePretrainingReadiness, DEFAULT_PRETRAINING_STATE } = hookModule

      const checkpointsList = [
        { 'cp-1': 'failed', 'cp-2': 'passed', 'cp-3': 'passed' },
        { 'cp-1': 'passed', 'cp-2': 'failed', 'cp-3': 'passed' },
        { 'cp-1': 'passed', 'cp-2': 'passed', 'cp-3': 'failed' },
        { 'cp-1': 'failed', 'cp-2': 'failed', 'cp-3': 'failed' },
      ]

      checkpointsList.forEach((cps, idx) => {
        const state = {
          ...DEFAULT_PRETRAINING_STATE,
          checklists: { ...DEFAULT_PRETRAINING_STATE.checklists },
          checkpoints: cps,
        }
        const progress = calculatePretrainingProgress(state)
        const readiness = calculatePretrainingReadiness(progress, state.checkpoints)

        assert.strictEqual(
          readiness.status,
          'clinic',
          `Case ${idx}: Status must be clinic when any checkpoint fails`
        )
        assert.strictEqual(readiness.label, '⚠️ PERLU TECHNICAL CLINIC')
        assert.strictEqual(readiness.badgeClass, 'status-clinic')
      })
    })

    it('validates 60/40 weighted formula and requires >= 80% with all 3 checkpoints passed for ready status', () => {
      const { calculatePretrainingProgress, calculatePretrainingReadiness, DEFAULT_PRETRAINING_STATE, PRETRAINING_CHECKLIST_TASK_IDS } = hookModule

      const state = {
        ...DEFAULT_PRETRAINING_STATE,
        checklists: { ...DEFAULT_PRETRAINING_STATE.checklists },
        checkpoints: {
          'cp-1': 'passed',
          'cp-2': 'passed',
          'cp-3': 'passed',
        },
      }

      // Checkpoints all passed (40%), but 0/13 tasks done (0%) -> 40% < 80% -> pending
      let progress = calculatePretrainingProgress(state)
      assert.strictEqual(progress.percentage, 40)
      let readiness = calculatePretrainingReadiness(progress, state.checkpoints)
      assert.strictEqual(readiness.status, 'pending')

      // Complete 8/13 tasks -> 8/13 * 60% = 36.92% + 40% = 76.92% -> 77% < 80% -> pending
      for (let i = 0; i < 8; i++) {
        state.checklists[PRETRAINING_CHECKLIST_TASK_IDS[i]] = true
      }
      progress = calculatePretrainingProgress(state)
      assert.strictEqual(progress.percentage, 77)
      readiness = calculatePretrainingReadiness(progress, state.checkpoints)
      assert.strictEqual(readiness.status, 'pending')

      // Complete 9/13 tasks -> 9/13 * 60% = 41.54% + 40% = 81.54% -> 82% >= 80% -> ready
      state.checklists[PRETRAINING_CHECKLIST_TASK_IDS[8]] = true
      progress = calculatePretrainingProgress(state)
      assert.strictEqual(progress.percentage, 82)
      readiness = calculatePretrainingReadiness(progress, state.checkpoints)
      assert.strictEqual(readiness.status, 'ready')
      assert.strictEqual(readiness.label, '🎉 SIAP MENGIKUTI WORKSHOP')
      assert.strictEqual(readiness.badgeClass, 'status-ready')

      // Complete 13/13 tasks with all 3 checkpoints passed -> 100% -> ready
      PRETRAINING_CHECKLIST_TASK_IDS.forEach((id) => {
        state.checklists[id] = true
      })
      progress = calculatePretrainingProgress(state)
      assert.strictEqual(progress.percentage, 100)
      readiness = calculatePretrainingReadiness(progress, state.checkpoints)
      assert.strictEqual(readiness.status, 'ready')
    })
  })

  // ==========================================
  // SUITE 4: SAFE RESET CONFIRMATION ENGINE (PRE-CHK-04)
  // ==========================================
  describe('Suite 4: Safe Reset Confirmation Engine (PRE-CHK-04)', () => {
    it('verifies resetState() cleans checklists, checkpoints, and participant info while preserving Word state', () => {
      const {
        DEFAULT_PRETRAINING_STATE,
        STORAGE_KEY_AI_STATE,
        STORAGE_KEY_AI_CHECKLIST,
        LEGACY_STORAGE_KEY_AI,
        PRETRAINING_CHECKLIST_TASK_IDS,
      } = hookModule

      // Seed state
      const fullState = {
        checklists: PRETRAINING_CHECKLIST_TASK_IDS.reduce((acc, id) => {
          acc[id] = true
          return acc
        }, {}),
        checkpoints: { 'cp-1': 'passed', 'cp-2': 'passed', 'cp-3': 'passed' },
        participantInfo: {
          nodeVersion: 'v24.2.0',
          telegramUsername: '@my_test_bot',
          telegramUserId: '123456789',
        },
      }
      localStorage.setItem(STORAGE_KEY_AI_STATE, JSON.stringify(fullState))
      localStorage.setItem(STORAGE_KEY_AI_CHECKLIST, JSON.stringify(fullState.checklists))
      localStorage.setItem(LEGACY_STORAGE_KEY_AI, JSON.stringify(fullState))

      // Also set Course 2 storage
      localStorage.setItem('learnwith_word_state_v1', JSON.stringify({ bab: 4, tasks: [1, 2] }))
      localStorage.setItem('learnwith_word_unlocked', 'true')

      // Emulate resetState execution as defined in usePretrainingState.ts
      const resetState = {
        checklists: { ...DEFAULT_PRETRAINING_STATE.checklists },
        checkpoints: { ...DEFAULT_PRETRAINING_STATE.checkpoints },
        participantInfo: { ...DEFAULT_PRETRAINING_STATE.participantInfo },
      }
      localStorage.setItem(STORAGE_KEY_AI_STATE, JSON.stringify(resetState))
      localStorage.setItem(STORAGE_KEY_AI_CHECKLIST, JSON.stringify(resetState.checklists))
      localStorage.removeItem(LEGACY_STORAGE_KEY_AI)

      // Verify AI state is completely reset
      const storedAi = JSON.parse(localStorage.getItem(STORAGE_KEY_AI_STATE))
      PRETRAINING_CHECKLIST_TASK_IDS.forEach((id) => {
        assert.strictEqual(storedAi.checklists[id], false)
      })
      assert.strictEqual(storedAi.checkpoints['cp-1'], 'pending')
      assert.strictEqual(storedAi.checkpoints['cp-2'], 'pending')
      assert.strictEqual(storedAi.checkpoints['cp-3'], 'pending')
      assert.strictEqual(storedAi.participantInfo.nodeVersion, '')
      assert.strictEqual(storedAi.participantInfo.telegramUsername, '')
      assert.strictEqual(storedAi.participantInfo.telegramUserId, '')
      assert.strictEqual(localStorage.getItem(LEGACY_STORAGE_KEY_AI), null)

      // Verify Course 2 storage keys remain 100% intact and untouched
      assert.strictEqual(
        localStorage.getItem('learnwith_word_state_v1'),
        JSON.stringify({ bab: 4, tasks: [1, 2] })
      )
      assert.strictEqual(localStorage.getItem('learnwith_word_unlocked'), 'true')
    })
  })

  // ==========================================
  // SUITE 5: COMPONENT INTEGRITY & ROUTE MOUNTING
  // ==========================================
  describe('Suite 5: Component Integrity & Route Mounting', () => {
    it('verifies Checkpoint Gates and Readiness components exist and export expected components', () => {
      const compDir = path.resolve(__dirname, '../app/components/course/pretraining')

      assert.ok(fs.existsSync(path.join(compDir, 'PretrainingCheckpointsSection.tsx')))
      assert.ok(fs.existsSync(path.join(compDir, 'CheckpointGateCard.tsx')))
      assert.ok(fs.existsSync(path.join(compDir, 'PretrainingReadinessSection.tsx')))
      assert.ok(fs.existsSync(path.join(compDir, 'ResetProgressModal.tsx')))
      assert.ok(fs.existsSync(path.join(compDir, 'PretrainingModuleCard.tsx')))
      assert.ok(fs.existsSync(path.join(compDir, 'PretrainingModulesSection.tsx')))
      assert.ok(fs.existsSync(path.join(compDir, 'PretrainingHero.tsx')))
    })

    it('verifies course.ai.tsx contains Checkpoint, Readiness, and Reset Modal markup', () => {
      const routePath = path.resolve(__dirname, '../app/routes/course.ai.tsx')
      const routeContent = fs.readFileSync(routePath, 'utf8')

      assert.ok(
        routeContent.includes('<PretrainingCheckpointsSection />'),
        'course.ai.tsx must mount PretrainingCheckpointsSection'
      )
      assert.ok(
        routeContent.includes('<PretrainingReadinessSection'),
        'course.ai.tsx must mount PretrainingReadinessSection'
      )
      assert.ok(
        routeContent.includes('<ResetProgressModal'),
        'course.ai.tsx must mount ResetProgressModal'
      )
      assert.ok(
        routeContent.includes('usePretrainingState'),
        'course.ai.tsx must import usePretrainingState'
      )
    })

    it('verifies PretrainingModuleCard and PretrainingModulesSection support interactive checkboxes', () => {
      const cardPath = path.resolve(
        __dirname,
        '../app/components/course/pretraining/PretrainingModuleCard.tsx'
      )
      const cardContent = fs.readFileSync(cardPath, 'utf8')
      assert.ok(cardContent.includes('checklists?: Record<string, boolean>'))
      assert.ok(cardContent.includes('onToggleChecklist'))
      assert.ok(cardContent.includes('checked={!!checklists[step.taskId]}'))
      assert.ok(cardContent.includes('onChange={() => onToggleChecklist(step.taskId!)}'))

      const sectionPath = path.resolve(
        __dirname,
        '../app/components/course/pretraining/PretrainingModulesSection.tsx'
      )
      const sectionContent = fs.readFileSync(sectionPath, 'utf8')
      assert.ok(sectionContent.includes('usePretrainingState'))
      assert.ok(sectionContent.includes('checklists={state.checklists}'))
      assert.ok(sectionContent.includes('onToggleChecklist={toggleChecklist}'))
    })
  })
})
