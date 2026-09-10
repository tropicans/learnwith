import { createServerFn } from '@tanstack/react-start'
import {

  updateCourseStatusInputSchema,
  type CourseLifecycleAuditEntry,
  type CourseLifecycleRecord,
  type PublicCourseStatusProjection,
  type UpdateCourseStatusInput,
} from '../schemas/courseLifecycle.ts'
import {
  getCourseLifecycleAuditLog,
  getCourseLifecycleRecords,
  getCourseStoreVersion,
  getPublicCourseStatusProjections,
  updateCourseLifecycleStatus,
} from './courseLifecycleStore.ts'
import { assertAdminAuthorized } from './platform.ts'

import { getCoursesList, type CourseData } from '../data/courses.ts'

/***
 * Server Function: Get Public Course Lifecycle Statuses
 * Public endpoint for frontpage and navigation dropdown.
 */
export const getPublicCourseStatusesFn = createServerFn({ method: 'GET' }).handler(
  async (): Promise<PublicCourseStatusProjection[]> => {
    return getPublicCourseStatusProjections()
  },
)

/***
 * Server Function: Get Public Courses List
 * Returns active-only courses for frontpage catalog discovery (COURSE-MUTATE-03).
 */
const getPublicCoursesListServerFn = createServerFn({ method: 'GET' }).handler(
  async (): Promise<CourseData[]> => {
    const fullList = await getCoursesList()
    const records = getCourseLifecycleRecords()
    const statusMap = new Map(records.map((r) => [r.id, r.status]))
    return fullList.filter((course) => (statusMap.get(course.id) ?? 'active') === 'active')
  },
)

export const getPublicCoursesListFn = new Proxy(getPublicCoursesListServerFn, {
  apply: async (target, thisArg, argArray) => {
    const res = await Reflect.apply(target, thisArg, argArray)
    if (res !== undefined) return res
    const fullList = await getCoursesList()
    const records = getCourseLifecycleRecords()
    const statusMap = new Map(records.map((r) => [r.id, r.status]))
    return fullList.filter((course) => (statusMap.get(course.id) ?? 'active') === 'active')
  },
})

/***
 * Server Function: Get Course Lifecycle for Admin
 * Protected endpoint for Master Admin Command Center.
 */
export const adminGetCoursesLifecycleFn = createServerFn({ method: 'GET' })
  .validator((data?: unknown) => {
    if (data && typeof data === 'object' && 'sessionToken' in (data as any)) {
      return data as { sessionToken?: string }
    }
    return undefined
  })
  .handler(async ({ data }): Promise<{
    courses: CourseLifecycleRecord[]
    auditLog: CourseLifecycleAuditEntry[]
    version: number
  }> => {
    assertAdminAuthorized(data?.sessionToken)
    return {
      courses: getCourseLifecycleRecords(),
      auditLog: getCourseLifecycleAuditLog(),
      version: getCourseStoreVersion(),
    }
  })

/***
 * Server Function: Update Course Lifecycle Status
 * Protected mutation endpoint for Master Admin status changes.
 */
export const adminUpdateCourseStatusFn = createServerFn({ method: 'POST' })
  .validator((data: unknown) => {
    return updateCourseStatusInputSchema.parse(data) as UpdateCourseStatusInput
  })
  .handler(async ({ data }) => {
    const user = assertAdminAuthorized(data.sessionToken)
    const result = updateCourseLifecycleStatus(
      data.courseId,
      data.targetStatus,
      user.role || 'master-admin',
      data.reason,
    )

    return {
      success: true,
      record: result.record,
      version: result.version,
      message: 'Status kursus "' + data.courseId + '" berhasil diubah menjadi "' + data.targetStatus + '".',
    }
  })
