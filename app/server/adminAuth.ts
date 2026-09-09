import { createServerFn } from '@tanstack/react-start'
import {
  adminLoginInputSchema,
  type AdminLoginResult,
  type AdminSessionResult,
  type AdminLogoutResult,
  type AdminAuthConfig,
} from '../schemas/admin'
import { verifyAdminPasskey, getServerConfig } from './config'
import {
  createAdminSession,
  validateAdminSession,
  revokeAdminSession,
  setSessionCookie,
  clearSessionCookie,
  readSessionToken,
} from './session'

/**
 * Server function: Master Admin Passkey Login
 * Validates passkey, issues HttpOnly session cookie, and returns session confirmation.
 */
export const adminLoginFn = createServerFn({ method: 'POST' })
  .validator((data: unknown) => adminLoginInputSchema.parse(data))
  .handler(async ({ data }): Promise<AdminLoginResult> => {
    const isAuthorized = verifyAdminPasskey(data.passkey)

    if (!isAuthorized) {
      return {
        success: false,
        message: 'Passkey Master Admin tidak valid.',
      }
    }

    const session = createAdminSession('passkey')
    setSessionCookie(session.token)

    return {
      success: true,
      message: 'Autentikasi Master Admin berhasil.',
      token: session.token,
      authenticatedAt: session.createdAt,
    }
  })

/**
 * Server function: Session Verification Check
 * Reads session cookie from incoming request and returns authentication status.
 */
export const adminCheckSessionFn = createServerFn({ method: 'GET' })
  .handler(async (): Promise<AdminSessionResult> => {
    const token = readSessionToken()
    const adminUser = validateAdminSession(token)

    if (!adminUser) {
      return {
        authenticated: false,
      }
    }

    return {
      authenticated: true,
      adminUser,
    }
  })

/**
 * Server function: Master Admin Logout
 * Revokes active session token and clears the HttpOnly session cookie.
 */
export const adminLogoutFn = createServerFn({ method: 'POST' })
  .handler(async (): Promise<AdminLogoutResult> => {
    const token = readSessionToken()
    if (token) {
      revokeAdminSession(token)
    }
    clearSessionCookie()

    return {
      success: true,
      message: 'Sesi Master Admin telah diakhiri.',
    }
  })

/**
 * Server function: Get Admin Auth Platform Configuration
 * Safely exposes Google OAuth readiness state and configured auth modes without leaking secrets.
 */
export const adminGetAuthConfigFn = createServerFn({ method: 'GET' })
  .handler(async (): Promise<AdminAuthConfig> => {
    const config = getServerConfig()
    const googleClientIdConfigured = Boolean(config.googleClientId && config.googleClientId.trim().length > 0)

    return {
      googleAuthAvailable: false, // Architectural readiness, disabled by default until enterprise OAuth configured
      googleClientIdConfigured,
      authModes: ['passkey', 'google'],
    }
  })
