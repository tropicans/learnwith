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
  .validator((data?: unknown) => {
    if (data && typeof data === 'object' && 'sessionToken' in (data as any)) {
      return data as { sessionToken?: string }
    }
    return undefined
  })
  .handler(async ({ data }): Promise<AdminSessionResult> => {
    const token = data?.sessionToken || readSessionToken()
    const adminUser = validateAdminSession(token)

    if (!adminUser) {
      return {
        authenticated: false,
      }
    }

    return {
      authenticated: true,
      adminUser,
      token: adminUser.token || token || undefined,
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
 * Server function: Google OAuth Login / Token Verification
 * Validates token with Google tokeninfo endpoint, establishes admin session cookie.
 */
export const adminGoogleLoginFn = createServerFn({ method: 'POST' })
  .validator((data: unknown) => {
    const { credentialToken } = (data as { credentialToken: string }) || {}
    if (!credentialToken || typeof credentialToken !== 'string') {
      throw new Error('Token Google tidak valid.')
    }
    return { credentialToken }
  })
  .handler(async ({ data }): Promise<AdminLoginResult> => {
    const { credentialToken } = data

    try {
      // Validate token with Google tokeninfo endpoint or userinfo
      let email: string | undefined

      const idTokenRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credentialToken)}`)
      if (idTokenRes.ok) {
        const data = await idTokenRes.json()
        email = data.email
      } else {
        // Fallback: check as access_token via tokeninfo
        const accessTokenRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?access_token=${encodeURIComponent(credentialToken)}`)
        if (accessTokenRes.ok) {
          const data = await accessTokenRes.json()
          email = data.email
        } else {
          // Fallback: check via userinfo endpoint with bearer authorization
          const userinfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${credentialToken}` },
          })
          if (userinfoRes.ok) {
            const data = await userinfoRes.json()
            email = data.email
          }
        }
      }

      if (!email) {
        return {
          success: false,
          message: 'Verifikasi akun Google gagal. Token tidak valid atau tidak memiliki akses email.',
        }
      }

      // Check allowed email whitelist
      const config = getServerConfig()
      const allowedEmails = config.googleAllowedEmail
        ? config.googleAllowedEmail.split(',').map((e) => e.trim().toLowerCase()).filter(Boolean)
        : ['tropicans@gmail.com']

      if (!allowedEmails.includes(email.trim().toLowerCase())) {
        return {
          success: false,
          message: `Akses ditolak. Email (${email}) tidak terdaftar sebagai Master Administrator. Hanya tropicans@gmail.com yang diizinkan.`,
        }
      }

      const session = createAdminSession('google')
      setSessionCookie(session.token)

      return {
        success: true,
        message: 'Autentikasi Google Workspace berhasil.',
        token: session.token,
        authenticatedAt: session.createdAt,
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kegagalan jaringan saat verifikasi Google.'
      return {
        success: false,
        message: msg,
      }
    }
  })

/**
 * Server function: Get Admin Auth Platform Configuration
 * Safely exposes Google OAuth readiness state and configured auth modes without leaking secrets.
 */
export const adminGetAuthConfigFn = createServerFn({ method: 'GET' })
  .handler(async (): Promise<AdminAuthConfig> => {
    const config = getServerConfig()
    const googleClientId = config.googleClientId?.trim() || undefined
    const googleClientIdConfigured = Boolean(googleClientId)

    return {
      googleAuthAvailable: googleClientIdConfigured,
      googleClientIdConfigured,
      googleClientId,
      authModes: ['passkey', 'google'],
    }
  })
