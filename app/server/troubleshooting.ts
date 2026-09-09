import { createServerFn } from '@tanstack/react-start'
import {
  ingestTroubleshootingInputSchema,
  troubleshootingFilterSchema,
  updateTroubleshootingStatusSchema,
  type IngestTroubleshootingInput,
  type TroubleshootingFilter,
  type TroubleshootingLogRecord,
  type TroubleshootingStats,
  type UpdateTroubleshootingStatusInput,
} from '../schemas/troubleshooting.ts'
import {
  ingestTroubleshootingLog,
  getTroubleshootingLogs,
  getTroubleshootingStats,
  updateTroubleshootingStatus,
} from './troubleshootingStore.ts'
import { readSessionToken, validateAdminSession } from './session.ts'

/**
 * Validates Master Admin session token.
 * Throws an unauthorized Error if invalid or expired.
 */
export function assertAdminAuthorized(explicitToken?: string | null) {
  const token = explicitToken || readSessionToken()
  const adminUser = validateAdminSession(token)
  if (!adminUser) {
    throw new Error('UNAUTHORIZED: Sesi Master Admin diperlukan untuk mengakses data troubleshooting.')
  }
  return adminUser
}

/**
 * Server function: Ingest Learner Troubleshooting Error Log
 * Public / learner accessible endpoint from pretraining and workshop tools.
 * Requirements: ADMIN-LOG-01, T-32-04
 */
export const ingestTroubleshootingLogFn = createServerFn({ method: 'POST' })
  .validator((data: unknown) => {
    return ingestTroubleshootingInputSchema.parse(data) as IngestTroubleshootingInput
  })
  .handler(async ({ data }): Promise<{
    success: boolean
    id: string
    category: string
    record: TroubleshootingLogRecord
  }> => {
    const record = ingestTroubleshootingLog(data)
    return {
      success: true,
      id: record.id,
      category: record.category,
      record,
    }
  })

/**
 * Server function: Get Troubleshooting Incident Logs and KPIs
 * Protected by Master Admin session.
 * Requirements: ADMIN-LOG-02
 */
export const getTroubleshootingLogsFn = createServerFn({ method: 'GET' })
  .validator((data?: unknown) => {
    if (!data) return undefined
    return troubleshootingFilterSchema
      .partial()
      .passthrough()
      .parse(data) as TroubleshootingFilter & { sessionToken?: string }
  })
  .handler(async ({ data }): Promise<{
    logs: TroubleshootingLogRecord[]
    incidents: TroubleshootingLogRecord[]
    stats: TroubleshootingStats
    kpis: TroubleshootingStats
  }> => {
    assertAdminAuthorized((data as any)?.sessionToken)
    const logs = getTroubleshootingLogs(data)
    const stats = getTroubleshootingStats()
    return {
      logs,
      incidents: logs,
      stats,
      kpis: stats,
    }
  })

/**
 * Server function: Update Incident Status and Instructor Notes
 * Protected by Master Admin session.
 * Requirements: ADMIN-LOG-02
 */
export const updateTroubleshootingLogStatusFn = createServerFn({ method: 'POST' })
  .validator((data: unknown) => {
    return updateTroubleshootingStatusSchema.parse(data) as UpdateTroubleshootingStatusInput & { sessionToken?: string }
  })
  .handler(async ({ data }): Promise<{
    success: boolean
    record: TroubleshootingLogRecord | null
  }> => {
    assertAdminAuthorized(data.sessionToken)
    const record = updateTroubleshootingStatus(data)
    if (!record) {
      throw new Error(`NOT_FOUND: Insiden dengan ID ${data.id || data.incidentId} tidak ditemukan.`)
    }
    return {
      success: true,
      record,
    }
  })
