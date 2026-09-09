import { z } from 'zod'

export const courseIdSchema = z.enum(['ai', 'word'])
export type CourseId = z.infer<typeof courseIdSchema>

export const coursePasskeyRecordSchema = z.object({
  courseId: courseIdSchema,
  title: z.string(),
  currentHash: z.string(),
  clearTextPreview: z.string(),
  lastRotatedAt: z.number(),
  rotatedBy: z.string(),
  version: z.number().int().min(1),
  status: z.enum(['active', 'deprecated']),
})
export type CoursePasskeyRecord = z.infer<typeof coursePasskeyRecordSchema>

export const passkeyRotationHistoryEntrySchema = z.object({
  id: z.string(),
  courseId: courseIdSchema,
  version: z.number(),
  hash: z.string(),
  rotatedAt: z.number(),
  rotatedBy: z.string(),
  reason: z.string().optional(),
})
export type PasskeyRotationHistoryEntry = z.infer<typeof passkeyRotationHistoryEntrySchema>

export const passkeyUnlockAttemptSchema = z.object({
  id: z.string(),
  courseId: courseIdSchema,
  timestamp: z.number(),
  clientId: z.string(),
  ipAddress: z.string().optional(),
  success: z.boolean(),
  attemptHashPrefix: z.string(),
  failureReason: z.string().optional(),
  rateLimited: z.boolean().optional(),
})
export type PasskeyUnlockAttempt = z.infer<typeof passkeyUnlockAttemptSchema>

export const rotatePasskeyInputSchema = z.object({
  courseId: courseIdSchema,
  newPasskey: z
    .string()
    .trim()
    .min(6, 'Passkey minimal 6 karakter')
    .max(64, 'Passkey maksimal 64 karakter'),
  reason: z.string().max(200, 'Alasan maksimal 200 karakter').optional(),
})
export type RotatePasskeyInput = z.infer<typeof rotatePasskeyInputSchema>

export const rotatePasskeyResultSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  courseId: courseIdSchema,
  version: z.number(),
  hashPreview: z.string(),
  rotatedAt: z.number(),
})
export type RotatePasskeyResult = z.infer<typeof rotatePasskeyResultSchema>

export const passkeyStatusResponseSchema = z.object({
  passkeys: z.record(courseIdSchema, coursePasskeyRecordSchema),
  recentAttempts: z.array(passkeyUnlockAttemptSchema),
  rotationHistory: z.array(passkeyRotationHistoryEntrySchema),
  stats: z.object({
    totalAttempts: z.number(),
    successAttempts: z.number(),
    failedAttempts: z.number(),
    rateLimitedAttempts: z.number(),
  }),
})
export type PasskeyStatusResponse = z.infer<typeof passkeyStatusResponseSchema>

export const passkeyAuditFilterSchema = z.object({
  courseId: z.enum(['all', 'ai', 'word']).default('all'),
  status: z.enum(['all', 'success', 'failed', 'rate_limited']).default('all'),
  search: z.string().optional(),
  limit: z.number().default(50),
})
export type PasskeyAuditFilter = z.infer<typeof passkeyAuditFilterSchema>
