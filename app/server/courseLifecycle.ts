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
