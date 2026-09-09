import { createServerFn } from '@tanstack/react-start'
import { verifyPasskeyInputSchema, type VerifyPasskeyResult } from '@/schemas/serverFn'
import { verifyPasskeyWithStore } from './passkeyStore.ts'

export const verifyInstructorPasskeyFn = createServerFn({ method: 'POST' })
  .validator((data: unknown) => verifyPasskeyInputSchema.parse(data))
  .handler(async ({ data }): Promise<VerifyPasskeyResult> => {
    const result = verifyPasskeyWithStore(
      data.courseId,
      data.passkey,
      data.clientId || 'anonymous'
    )

    return {
      success: result.success,
      message: result.message,
      unlockedAt: result.unlockedAt,
      rateLimited: result.rateLimited,
    }
  })
