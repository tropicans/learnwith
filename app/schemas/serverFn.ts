import { z } from 'zod'

export const verifyPasskeyInputSchema = z.object({
  courseId: z.enum(['ai', 'word']),
  passkey: z.string().trim().min(1, 'Passkey wajib diisi').max(100, 'Passkey terlalu panjang'),
  clientId: z.string().optional(),
})

export type VerifyPasskeyInput = z.infer<typeof verifyPasskeyInputSchema>

export const verifyPasskeyResultSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  unlockedAt: z.number().optional(),
  rateLimited: z.boolean().optional(),
})

export type VerifyPasskeyResult = z.infer<typeof verifyPasskeyResultSchema>

export const diagnosticsInputSchema = z.object({
  includeMemory: z.boolean().default(false),
})

export type DiagnosticsInput = z.infer<typeof diagnosticsInputSchema>

export const diagnosticsResultSchema = z.object({
  status: z.literal('healthy'),
  timestamp: z.string(),
  uptimeSeconds: z.number(),
  environment: z.string(),
  memory: z
    .object({
      rssMb: z.number(),
      heapUsedMb: z.number(),
    })
    .optional(),
})

export type DiagnosticsResult = z.infer<typeof diagnosticsResultSchema>