import { z } from 'zod'

export const checkpointStatusSchema = z.enum(['pending', 'passed', 'failed'])
export type CheckpointStatus = z.infer<typeof checkpointStatusSchema>

export const readinessStatusSchema = z.enum(['ready', 'clinic', 'pending'])
export type ReadinessStatus = z.infer<typeof readinessStatusSchema>

export const participantTelemetrySchema = z.object({
  participantId: z.string().trim().min(1, 'ID peserta wajib diisi').max(64, 'ID peserta terlalu panjang'),
  name: z.string().trim().default('Peserta'),
  agency: z.string().trim().default('-'),
  courseId: z.enum(['ai', 'word']),
  progressPercent: z.number().min(0, 'Progress minimal 0%').max(100, 'Progress maksimal 100%'),
  completedTasks: z.number().min(0),
  totalTasks: z.number().min(1),
  checkpoints: z.record(z.string(), checkpointStatusSchema),
  readinessStatus: readinessStatusSchema,
  quizScore: z.number().min(0).max(100).optional(),
  taskChecklist: z.record(z.string(), z.boolean()).optional(),
  clientTimestamp: z.number(),
})

export type ParticipantTelemetryInput = z.infer<typeof participantTelemetrySchema>

export const participantRecordSchema = participantTelemetrySchema.extend({
  serverReceivedAt: z.number(),
  lastActiveAt: z.number(),
})

export type ParticipantRecord = z.infer<typeof participantRecordSchema>

export const telemetryIngestResultSchema = z.object({
  success: z.boolean(),
  receivedAt: z.number(),
  participantId: z.string(),
})

export type TelemetryIngestResult = z.infer<typeof telemetryIngestResultSchema>

export const telemetryQueryFilterSchema = z.object({
  courseId: z.enum(['all', 'ai', 'word']).default('all'),
  readiness: z.enum(['all', 'ready', 'clinic', 'pending']).default('all'),
  search: z.string().optional(),
})

export type TelemetryQueryFilter = z.infer<typeof telemetryQueryFilterSchema>

export const telemetryDashboardStatsSchema = z.object({
  totalParticipants: z.number(),
  activeParticipants: z.number(),
  checkpointCompletionRate: z.number(),
  averageQuizScore: z.number(),
  readyRatio: z.number(),
  clinicRatio: z.number(),
})

export type TelemetryDashboardStats = z.infer<typeof telemetryDashboardStatsSchema>
