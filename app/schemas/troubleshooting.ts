import { z } from 'zod'

/**
 * Troubleshooting Categories for Pre-Training & Workshop Incident Hub
 * Requirements: ADMIN-LOG-01, ADMIN-LOG-02
 */
export const troubleshootingCategorySchema = z.enum([
  'port_conflict',
  'powershell_policy',
  'oauth_api_key',
  'telegram_conflict',
  'permissions_eperm',
  'network_runtime',
  'other',
])

export type TroubleshootingCategory = z.infer<typeof troubleshootingCategorySchema>

/**
 * Incident Severity Levels
 */
export const troubleshootingSeveritySchema = z.enum([
  'low',
  'medium',
  'high',
  'critical',
])

export type TroubleshootingSeverity = z.infer<typeof troubleshootingSeveritySchema>

/**
 * Incident Lifecycle Status
 */
export const troubleshootingStatusSchema = z.enum([
  'open',
  'investigating',
  'resolved',
])

export type TroubleshootingStatus = z.infer<typeof troubleshootingStatusSchema>

/**
 * Workshop Course Identifier
 */
export const courseIdSchema = z.enum(['ai', 'word', 'system'])
export type CourseId = z.infer<typeof courseIdSchema>

/**
 * Troubleshooting Log Record (Incident Record)
 */
export const troubleshootingLogRecordSchema = z.object({
  id: z.string(),
  timestamp: z.number(),
  participantId: z.string(),
  participantName: z.string().optional(),
  courseId: courseIdSchema,
  category: troubleshootingCategorySchema,
  severity: troubleshootingSeveritySchema,
  rawErrorText: z.string(),
  problemStep: z.string().optional(),
  os: z.string().optional(),
  status: troubleshootingStatusSchema,
  suggestedCommand: z.string().optional(),
  suggestedRemediation: z.string().optional(),
  instructorNotes: z.string().optional(),
  resolvedAt: z.number().optional(),
})

export type TroubleshootingLogRecord = z.infer<typeof troubleshootingLogRecordSchema>
export type TroubleshootingIncident = TroubleshootingLogRecord
export const troubleshootingIncidentSchema = troubleshootingLogRecordSchema

/**
 * Ingestion Input Schema (supports flexible field aliases from client)
 */
export const ingestTroubleshootingInputSchema = z.object({
  participantId: z.string().min(1).optional(),
  clientId: z.string().min(1).optional(),
  participantName: z.string().optional(),
  courseId: courseIdSchema.default('ai'),
  errorMsg: z.string().min(3).max(10000).optional(),
  rawError: z.string().min(3).max(10000).optional(),
  problemStep: z.string().max(200).optional(),
  step: z.string().max(200).optional(),
  os: z.string().max(100).optional(),
  sessionToken: z.string().optional(),
}).passthrough().refine(
  (data) => (data.participantId || data.clientId) && (data.errorMsg || data.rawError),
  { message: 'participantId/clientId and errorMsg/rawError are required' }
)

export type IngestTroubleshootingInput = z.infer<typeof ingestTroubleshootingInputSchema>
export const ingestTroubleshootingLogInputSchema = ingestTroubleshootingInputSchema

/**
 * Filter Query Schema for Log Retrieval
 */
export const troubleshootingFilterSchema = z.object({
  category: z.enum([
    'all',
    'port_conflict',
    'powershell_policy',
    'oauth_api_key',
    'telegram_conflict',
    'permissions_eperm',
    'network_runtime',
    'other',
  ]).default('all'),
  severity: z.enum(['all', 'low', 'medium', 'high', 'critical']).default('all'),
  status: z.enum(['all', 'open', 'investigating', 'resolved']).default('all'),
  courseId: z.enum(['all', 'ai', 'word', 'system']).default('all'),
  search: z.string().optional(),
  limit: z.number().default(100),
})

export type TroubleshootingFilter = z.infer<typeof troubleshootingFilterSchema>

/**
 * Aggregated KPIs / Statistics Schema
 */
export const troubleshootingStatsSchema = z.object({
  totalIncidents: z.number(),
  categoryCounts: z.record(z.string(), z.number()),
  openCount: z.number(),
  investigatingCount: z.number(),
  resolvedCount: z.number(),
  topCategory: z.string(),
})

export type TroubleshootingStats = z.infer<typeof troubleshootingStatsSchema>
export type TroubleshootingKPIs = TroubleshootingStats
export const troubleshootingKPIsSchema = troubleshootingStatsSchema

/**
 * Status Update Schema
 */
export const updateTroubleshootingStatusSchema = z.object({
  id: z.string().optional(),
  incidentId: z.string().optional(),
  status: troubleshootingStatusSchema,
  instructorNotes: z.string().max(1000).optional(),
  sessionToken: z.string().optional(),
}).passthrough().refine((data) => data.id || data.incidentId, {
  message: 'id or incidentId is required',
})

export type UpdateTroubleshootingStatusInput = z.infer<typeof updateTroubleshootingStatusSchema>
export const updateIncidentStatusInputSchema = updateTroubleshootingStatusSchema
