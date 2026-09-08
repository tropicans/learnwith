import { createServerFn } from '@tanstack/react-start'
import { verifyPasskeyInputSchema, type VerifyPasskeyResult } from '@/schemas/serverFn'
import { verifyPasskeyWithHash } from './config'

export const verifyInstructorPasskeyFn = createServerFn({ method: 'POST' })
  .validator((data: unknown) => verifyPasskeyInputSchema.parse(data))
  .handler(async ({ data }): Promise<VerifyPasskeyResult> => {
    const isAuthorized = verifyPasskeyWithHash(data.courseId, data.passkey)

    if (!isAuthorized) {
      return {
        success: false,
        message: 'Passkey instruktur tidak valid atau salah.',
      }
    }

    return {
      success: true,
      message: 'Sesi instruktur berhasil diverifikasi.',
      unlockedAt: Date.now(),
    }
  })
