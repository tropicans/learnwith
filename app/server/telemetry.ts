import { createServerFn } from '@tanstack/react-start'
import {
  participantTelemetrySchema,
  telemetryQueryFilterSchema,
  type TelemetryIngestResult,
  type ParticipantRecord,
  type TelemetryDashboardStats,
} from '../schemas/telemetry.ts'
import {
  ingestTelemetry,
  getParticipants,
  getTelemetryStats,
} from './telemetryStore.ts'

/**
 * Server function: Ingest Participant Telemetry
 * Receives participant progress heartbeat, validates schema, and records into telemetry store.
 */
export const ingestParticipantTelemetryFn = createServerFn({ method: 'POST' })
  .validator((data: unknown) => participantTelemetrySchema.parse(data))
  .handler(async ({ data }): Promise<TelemetryIngestResult> => {
    const record = ingestTelemetry(data)

    return {
      success: true,
      receivedAt: record.serverReceivedAt,
      participantId: record.participantId,
    }
  })

/**
 * Server function: Get Participant Telemetry List & KPI Stats
 * Returns sorted, filtered participant records alongside aggregated platform metrics.
 */
export const getParticipantTelemetryListFn = createServerFn({ method: 'GET' })
  .validator((data: unknown) => {
    if (!data) return undefined
    return telemetryQueryFilterSchema.parse(data)
  })
  .handler(async ({ data }): Promise<{ participants: ParticipantRecord[]; stats: TelemetryDashboardStats }> => {
    const participants = getParticipants(data)
    const stats = getTelemetryStats()

    return {
      participants,
      stats,
    }
  })
