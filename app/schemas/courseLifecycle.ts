import { z } from "zod"

export const courseLifecycleStatusSchema = z.enum([
  "active",
  "hidden",
  "archived",
  "deleted",
])
export type CourseLifecycleStatus = z.infer<typeof courseLifecycleStatusSchema>

export const courseLifecycleAuditEntrySchema = z.object({
  id: z.string(),
  courseId: z.string(),
  fromStatus: courseLifecycleStatusSchema,
  toStatus: courseLifecycleStatusSchema,
  timestamp: z.number(),
  operator: z.string(),
  reason: z.string().optional(),
})
export type CourseLifecycleAuditEntry = z.infer<typeof courseLifecycleAuditEntrySchema>

export const courseLifecycleRecordSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: courseLifecycleStatusSchema,
  updatedAt: z.number(),
  updatedBy: z.string(),
  reason: z.string().optional(),
})
export type CourseLifecycleRecord = z.infer<typeof courseLifecycleRecordSchema>

export const publicCourseStatusProjectionSchema = z.object({
  id: z.string(),
  status: courseLifecycleStatusSchema,
  isDiscoverable: z.boolean(),
  isAvailable: z.boolean(),
})
export type PublicCourseStatusProjection = z.infer<typeof publicCourseStatusProjectionSchema>

export const updateCourseStatusInputSchema = z.object({
  courseId: z.string().min(1, "ID kursus wajib diisi"),
  targetStatus: courseLifecycleStatusSchema,
  reason: z.string().max(200, "Alasan maksimal 200 karakter").optional(),
  sessionToken: z.string().optional(),
})
export type UpdateCourseStatusInput = z.infer<typeof updateCourseStatusInputSchema>

export const ALLOWED_STATUS_TRANSITIONS: Record<CourseLifecycleStatus, CourseLifecycleStatus[]> = {
  active: ["hidden", "archived", "deleted"],
  hidden: ["active", "archived", "deleted"],
  archived: ["active", "hidden", "deleted"],
  deleted: ["active"],
}

export function isValidStatusTransition(
  fromStatus: CourseLifecycleStatus,
  toStatus: CourseLifecycleStatus,
): boolean {
  if (fromStatus === toStatus) return true
  const allowed = ALLOWED_STATUS_TRANSITIONS[fromStatus]
  return Array.isArray(allowed) && allowed.includes(toStatus)
}
