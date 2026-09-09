import { useState, useEffect, useCallback } from 'react'

export interface PretrainingState {
  checklists: Record<string, boolean>
  checkpoints: Record<'cp-1' | 'cp-2' | 'cp-3', 'pending' | 'passed' | 'failed'>
  participantInfo: {
    name?: string
    nodeVersion: string
    telegramUsername: string
    telegramUserId: string
  }
}

export interface ProgressStats {
  totalTasks: number // 13 official module tasks
  completedTasks: number
  totalCheckpoints: number // 3 checkpoints (cp-1, cp-2, cp-3)
  passedCheckpoints: number
  percentage: number // 0..100 (weighted: 60% tasks + 40% CPs)
}

export interface ReadinessResult {
  status: 'ready' | 'clinic' | 'pending'
  label: string
  badgeClass: string
  description: string
  color: string
}

export const PRETRAINING_CHECKLIST_TASK_IDS = [
  // Module 1 (3 tasks)
  'm1-check-node',
  'm1-verify-lts',
  'm1-check-npm',
  // Module 2 (4 tasks)
  'm2-install-pkg',
  'm2-start-service',
  'm2-open-dashboard',
  'm2-verify-local',
  // Module 3 (4 tasks - note: Step D has no checkbox)
  'm3-start-botfather',
  'm3-create-newbot',
  'm3-save-token-secure',
  'm3-get-userid',
  // Module 4 (2 tasks)
  'm4-open-console',
  'm4-verify-login',
] as const

export const DEFAULT_PRETRAINING_STATE: PretrainingState = {
  checklists: PRETRAINING_CHECKLIST_TASK_IDS.reduce((acc, id) => {
    acc[id] = false
    return acc
  }, {} as Record<string, boolean>),
  checkpoints: {
    'cp-1': 'pending',
    'cp-2': 'pending',
    'cp-3': 'pending',
  },
  participantInfo: {
    name: '',
    nodeVersion: '',
    telegramUsername: '',
    telegramUserId: '',
  },
}

export const STORAGE_KEY_AI_STATE = 'learnwith_ai_state_v1'
export const STORAGE_KEY_AI_CHECKLIST = 'learnwith_ai_checklist'
export const LEGACY_STORAGE_KEY_AI = 'pretraining_app_state_v1'

// Multi-course isolation policy:
// Under NO circumstances may usePretrainingState read, modify, or delete:
// - 'learnwith_word_state_v1'
// - 'learnwith_word_unlocked'

let memoryState: PretrainingState = {
  checklists: { ...DEFAULT_PRETRAINING_STATE.checklists },
  checkpoints: { ...DEFAULT_PRETRAINING_STATE.checkpoints },
  participantInfo: { ...DEFAULT_PRETRAINING_STATE.participantInfo },
}

let isInitialized = false
const subscribers = new Set<() => void>()

function emitChange() {
  subscribers.forEach((subscriber) => subscriber())
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('pretraining:stateChange', { detail: memoryState })
    )
  }
}

function loadStateFromStorage(): PretrainingState {
  if (typeof window === 'undefined') {
    return {
      checklists: { ...DEFAULT_PRETRAINING_STATE.checklists },
      checkpoints: { ...DEFAULT_PRETRAINING_STATE.checkpoints },
      participantInfo: { ...DEFAULT_PRETRAINING_STATE.participantInfo },
    }
  }

  try {
    const raw =
      localStorage.getItem(STORAGE_KEY_AI_STATE) ||
      localStorage.getItem(LEGACY_STORAGE_KEY_AI)
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        checklists: {
          ...DEFAULT_PRETRAINING_STATE.checklists,
          ...(parsed.checklists || {}),
        },
        checkpoints: {
          'cp-1': parsed.checkpoints?.['cp-1'] || 'pending',
          'cp-2': parsed.checkpoints?.['cp-2'] || 'pending',
          'cp-3': parsed.checkpoints?.['cp-3'] || 'pending',
        },
        participantInfo: {
          name: parsed.participantInfo?.name || '',
          nodeVersion: parsed.participantInfo?.nodeVersion || '',
          telegramUsername: parsed.participantInfo?.telegramUsername || '',
          telegramUserId: parsed.participantInfo?.telegramUserId || '',
        },
      }
    }
  } catch (error) {
    console.error('Failed to load pretraining state from localStorage:', error)
  }

  return {
    checklists: { ...DEFAULT_PRETRAINING_STATE.checklists },
    checkpoints: { ...DEFAULT_PRETRAINING_STATE.checkpoints },
    participantInfo: { ...DEFAULT_PRETRAINING_STATE.participantInfo },
  }
}

function saveStateToStorage(state: PretrainingState) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY_AI_STATE, JSON.stringify(state))
    localStorage.setItem(
      STORAGE_KEY_AI_CHECKLIST,
      JSON.stringify(state.checklists)
    )
  } catch (error) {
    console.error('Failed to save pretraining state to localStorage:', error)
  }
}

export function initPretrainingState(): PretrainingState {
  if (!isInitialized && typeof window !== 'undefined') {
    memoryState = loadStateFromStorage()
    isInitialized = true
  }
  return memoryState
}

export function getPretrainingSnapshot(): PretrainingState {
  return memoryState
}

export function calculatePretrainingProgress(
  state: PretrainingState
): ProgressStats {
  const taskKeys = PRETRAINING_CHECKLIST_TASK_IDS
  const cpKeys: Array<'cp-1' | 'cp-2' | 'cp-3'> = ['cp-1', 'cp-2', 'cp-3']

  const totalTasks = taskKeys.length // 13
  const completedTasks = taskKeys.filter(
    (k) => state.checklists[k] === true
  ).length
  const totalCheckpoints = cpKeys.length // 3
  const passedCheckpoints = cpKeys.filter(
    (k) => state.checkpoints[k] === 'passed'
  ).length

  const taskPercent = totalTasks > 0 ? (completedTasks / totalTasks) * 60 : 0
  const cpPercent =
    totalCheckpoints > 0 ? (passedCheckpoints / totalCheckpoints) * 40 : 0
  const percentage = Math.min(100, Math.round(taskPercent + cpPercent))

  return {
    totalTasks,
    completedTasks,
    totalCheckpoints,
    passedCheckpoints,
    percentage,
  }
}

export function calculatePretrainingReadiness(
  progress: ProgressStats,
  checkpoints: PretrainingState['checkpoints']
): ReadinessResult {
  const cpValues = ['cp-1', 'cp-2', 'cp-3'].map(
    (id) => checkpoints[id as 'cp-1'] || 'pending'
  )

  const hasFailure = cpValues.some((v) => v === 'failed')
  const allCheckpointsPassed = cpValues.every((v) => v === 'passed')

  // Rule 1: ANY checkpoint failed -> Technical Clinic
  if (hasFailure) {
    return {
      status: 'clinic',
      label: '⚠️ PERLU TECHNICAL CLINIC',
      badgeClass: 'status-clinic',
      description:
        'Terdapat kendala teknis pada satu atau lebih gerbang checkpoint. Jangan khawatir! Silakan konsultasikan kendala Anda dengan instruktur atau ikuti sesi Technical Clinic sebelum kelas dimulai.',
      color: 'var(--color-danger, #ef4444)',
    }
  }

  // Rule 2: All 3 checkpoints passed AND overall progress >= 80% -> SIAP WORKSHOP
  if (allCheckpointsPassed && progress.percentage >= 80) {
    return {
      status: 'ready',
      label: '🎉 SIAP MENGIKUTI WORKSHOP',
      badgeClass: 'status-ready',
      description:
        'Selamat! Seluruh prasyarat dan gerbang checkpoint teknis telah berhasil Anda selesaikan. Laptop Anda 100% siap untuk praktik mengelola Google Calendar melalui Telegram bersama Hermes Agent saat workshop!',
      color: 'var(--color-success, #10b981)',
    }
  }

  // Rule 3: Otherwise -> MENUNGGU PENYELESAIAN LANGKAH (Pending)
  return {
    status: 'pending',
    label: '⏳ MENUNGGU PENYELESAIAN LANGKAH',
    badgeClass: 'status-pending',
    description:
      'Anda masih memiliki langkah atau verifikasi checkpoint yang belum selesai. Selesaikan Modul 1 sampai 5 dan verifikasi Checkpoint 1, 2, dan 3 untuk mencapai status kesiapan penuh.',
    color: 'var(--color-warning, #f59e0b)',
  }
}

export function usePretrainingState() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [state, setState] = useState<PretrainingState>(() => {
    if (typeof window !== 'undefined') {
      return initPretrainingState()
    }
    return DEFAULT_PRETRAINING_STATE
  })

  useEffect(() => {
    const initialState = initPretrainingState()
    setState(initialState)
    setIsLoaded(true)

    const handleUpdate = () => {
      setState({ ...memoryState })
    }

    subscribers.add(handleUpdate)

    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY_AI_STATE || e.key === LEGACY_STORAGE_KEY_AI) {
        memoryState = loadStateFromStorage()
        emitChange()
      }
    }

    window.addEventListener('storage', handleStorage)

    return () => {
      subscribers.delete(handleUpdate)
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  const toggleChecklist = useCallback(
    (taskId: string, value?: boolean) => {
      const nextVal =
        value !== undefined ? !!value : !memoryState.checklists[taskId]
      memoryState = {
        ...memoryState,
        checklists: {
          ...memoryState.checklists,
          [taskId]: nextVal,
        },
      }
      saveStateToStorage(memoryState)
      emitChange()
    },
    []
  )

  const setCheckpoint = useCallback(
    (
      checkpointId: 'cp-1' | 'cp-2' | 'cp-3',
      status: 'pending' | 'passed' | 'failed'
    ) => {
      memoryState = {
        ...memoryState,
        checkpoints: {
          ...memoryState.checkpoints,
          [checkpointId]: status,
        },
      }
      saveStateToStorage(memoryState)
      emitChange()
    },
    []
  )

  const setParticipantInfo = useCallback(
    (
      field: 'name' | 'nodeVersion' | 'telegramUsername' | 'telegramUserId',
      value: string
    ) => {
      memoryState = {
        ...memoryState,
        participantInfo: {
          ...memoryState.participantInfo,
          [field]: value,
        },
      }
      saveStateToStorage(memoryState)
      emitChange()
    },
    []
  )

  const resetState = useCallback(() => {
    memoryState = {
      checklists: { ...DEFAULT_PRETRAINING_STATE.checklists },
      checkpoints: { ...DEFAULT_PRETRAINING_STATE.checkpoints },
      participantInfo: { ...DEFAULT_PRETRAINING_STATE.participantInfo },
    }
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(
          STORAGE_KEY_AI_STATE,
          JSON.stringify(memoryState)
        )
        localStorage.setItem(
          STORAGE_KEY_AI_CHECKLIST,
          JSON.stringify(memoryState.checklists)
        )
        localStorage.removeItem(LEGACY_STORAGE_KEY_AI)
      } catch (error) {
        console.error('Failed to reset pretraining state in localStorage:', error)
      }
    }
    emitChange()
  }, [])

  const progress = calculatePretrainingProgress(state)
  const readiness = calculatePretrainingReadiness(progress, state.checkpoints)

  return {
    state,
    checklists: state.checklists,
    checkpoints: state.checkpoints,
    participantInfo: state.participantInfo,
    progress,
    readiness,
    isLoaded,
    toggleChecklist,
    setCheckpoint,
    setParticipantInfo,
    resetState,
  }
}
