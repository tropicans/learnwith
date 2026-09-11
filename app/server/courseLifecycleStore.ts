import {
  type CourseLifecycleAuditEntry,
  type CourseLifecycleRecord,
  type CourseLifecycleStatus,
  type PublicCourseStatusProjection,
  isValidStatusTransition,
} from '../schemas/courseLifecycle.ts'

// In-memory course store state
const DEFAULT_COURSES: Record<string, { title: string; defaultStatus: CourseLifecycleStatus }> = {
  ai: {
    title: 'Hands-on Agentic AI: Dari Chat ke Kalender',
    defaultStatus: 'active',
  },
  word: {
    title: 'Pengolahan Kata Tingkat Lanjut',
    defaultStatus: 'active',
  },
}

let courseStore = new Map<string, CourseLifecycleRecord>()
let auditLog: CourseLifecycleAuditEntry[] = []
let storeVersion = 1

function initDefaults() {
  courseStore.clear()
  auditLog = []
  storeVersion = 1
  const now = Date.now()
  for (const [id, def] of Object.entries(DEFAULT_COURSES)) {
    courseStore.set(id, {
      id,
      title: def.title,
      status: def.defaultStatus,
      updatedAt: now,
      updatedBy: 'system',
    })
  }
}

// Run initial setup
initDefaults()

/*** Get all course records */
export function getCourseLifecycleRecords(): CourseLifecycleRecord[] {
  return Array.from(courseStore.values()).map((rec) => ({ ...rec }))
}

/*** Get single course record by ID */
export function getCourseLifecycleRecord(courseId: string): CourseLifecycleRecord | undefined {
  const rec = courseStore.get(courseId)
  return rec ? { ...rec } : undefined
}

/*** Get current store version counter */
export function getCourseStoreVersion(): number {
  return storeVersion
}

/*** Get audit log */
export function getCourseLifecycleAuditLog(): CourseLifecycleAuditEntry[] {
  return auditLog.map((entry) => ({ ...entry }))
}

/*** Update course status */
export function updateCourseLifecycleStatus(
  courseId: string,
  targetStatus: CourseLifecycleStatus,
  operator = 'master-admin',
  reason?: string,
): { success: boolean; record: CourseLifecycleRecord; version: number } {
  const existing = courseStore.get(courseId)
  if (!existing) {
    throw new Error('Kursus dengan ID "' + courseId + '" tidak ditemukan.')
  }

  if (!isValidStatusTransition(existing.status, targetStatus)) {
    throw new Error(
      'Transisi status dari "' + existing.status + '" ke "' + targetStatus + '" tidak diizinkan.',
    )
  }

  const now = Date.now()
  const updatedRecord: CourseLifecycleRecord = {
    ...existing,
    status: targetStatus,
    updatedAt: now,
    updatedBy: operator,
    reason: reason?.trim() || undefined,
  }

  courseStore.set(courseId, updatedRecord)
  storeVersion += 1

  auditLog.unshift({
    id: 'audit_' + now + '_' + Math.random().toString(36).slice(2, 7),
    courseId,
    fromStatus: existing.status,
    toStatus: targetStatus,
    timestamp: now,
    operator,
    reason: reason?.trim() || undefined,
  })

  return {
    success: true,
    record: updatedRecord,
    version: storeVersion,
  }
}

/*** Get public projection for frontpage and nav */
export function getPublicCourseStatusProjections(): PublicCourseStatusProjection[] {
  return Array.from(courseStore.values()).map((rec) => ({
    id: rec.id,
    status: rec.status,
    isDiscoverable: rec.status === 'active',
    isAvailable: rec.status === 'active' || rec.status === 'hidden',
  }))
}

/*** Reset store for testing */
export function clearCourseLifecycleStoreForTesting(): void {
  initDefaults()
}
