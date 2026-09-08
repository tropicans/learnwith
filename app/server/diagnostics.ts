import { createServerFn } from '@tanstack/react-start'
import { diagnosticsInputSchema, type DiagnosticsResult } from '@/schemas/serverFn'
import { getServerConfig } from './config'

export const getSystemDiagnosticsFn = createServerFn({ method: 'GET' })
  .validator((data: unknown) => diagnosticsInputSchema.parse(data || {}))
  .handler(async ({ data }): Promise<DiagnosticsResult> => {
    const config = getServerConfig()

    return {
      status: 'healthy' as const,
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      environment: config.nodeEnv,
      memory: data.includeMemory
        ? {
            rssMb: Math.round(process.memoryUsage().rss / (1024 * 1024)),
            heapUsedMb: Math.round(process.memoryUsage().heapUsed / (1024 * 1024)),
          }
        : undefined,
    }
  })
