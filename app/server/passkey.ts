import { createServerFn } from '@tanstack/react-start'
import {
  rotatePasskeyInputSchema,
  passkeyAuditFilterSchema,
  type PasskeyStatusResponse,
  type RotatePasskeyResult,
  type PasskeyUnlockAttempt,
  type RotatePasskeyInput,
  type PasskeyAuditFilter,
} from '../schemas/passkey.ts'
import {
  getPasskeyStatus,
  rotatePasskey,
  getPasskeyAuditLogs,
} from './passkeyStore.ts'
import { readSessionToken, validateAdminSession } from './session.ts'

/**
 * Validates Master Admin session token.
 * Throws an unauthorized Error if invalid or expired.
 */
export function assertAdminAuthorized(explicitToken?: string | null) {
  const token = explicitToken || readSessionToken()
  const adminUser = validateAdminSession(token)
  if (!adminUser) {
    throw new Error('UNAUTHORIZED: Sesi Master Admin diperlukan untuk mengakses konsol passkey.')
  }
  return adminUser
}

/**
 * Server function: Get Active Passkeys Status, History, and Stats
 */
export const adminGetPasskeyStatusFn = createServerFn({ method: 'GET' })
  .validator((data?: unknown) => {
    if (data && typeof data === 'object' && 'sessionToken' in (data as any)) {
      return data as { sessionToken?: string }
    }
    return undefined
  })
  .handler(async ({ data }): Promise<PasskeyStatusResponse> => {
    assertAdminAuthorized(data?.sessionToken)
    return getPasskeyStatus()
  })

/**
 * Server function: Dynamically Rotate Passkey for a Course Module
 */
export const adminRotatePasskeyFn = createServerFn({ method: 'POST' })
  .validator((data: unknown) => {
    return rotatePasskeyInputSchema.passthrough().parse(data) as RotatePasskeyInput & { sessionToken?: string }
  })
  .handler(async ({ data }): Promise<RotatePasskeyResult> => {
    const adminUser = assertAdminAuthorized(data.sessionToken)
    return rotatePasskey(data, adminUser.role || 'master-admin')
  })

/**
 * Server function: Get Filtered Passkey Unlock Attempt Audit Logs
 */
export const adminGetPasskeyAuditLogsFn = createServerFn({ method: 'GET' })
  .validator((data: unknown) => {
    if (!data) return undefined
    return passkeyAuditFilterSchema.passthrough().parse(data) as PasskeyAuditFilter & { sessionToken?: string }
  })
  .handler(async ({ data }): Promise<PasskeyUnlockAttempt[]> => {
    assertAdminAuthorized((data as any)?.sessionToken)
    return getPasskeyAuditLogs(data)
  })
