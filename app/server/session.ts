import crypto from 'node:crypto'
import type { AdminUser } from '../schemas/admin'

function safeSetResponseHeader(name: string, value: string): void {
  if (typeof window !== 'undefined') return
  try {
    const pkg = 'h3'
    const h3 = typeof require !== 'undefined' ? require(pkg) : null
    if (h3 && typeof h3.setResponseHeader === 'function') {
      h3.setResponseHeader(name, value)
    }
  } catch {
    // Ignored in mock or non-Nitro environments
  }
}

function safeGetRequestHeader(name: string): string | undefined {
  if (typeof window !== 'undefined') return undefined
  try {
    const pkg = 'h3'
    const h3 = typeof require !== 'undefined' ? require(pkg) : null
    if (h3 && typeof h3.getRequestHeader === 'function') {
      return h3.getRequestHeader(name)
    }
  } catch {
    return undefined
  }
  return undefined
}

export const SESSION_COOKIE_NAME = 'learnwith_admin_session'
export const SESSION_TTL_SECONDS = 60 * 60 * 24 // 24 hours

export interface AdminSession {
  token: string
  createdAt: number
  expiresAt: number
  authMethod: 'passkey' | 'google'
  role: 'admin'
}

// In-memory active session registry
const sessionRegistry = new Map<string, AdminSession>()

/**
 * Generates a cryptographically secure 256-bit hex session token.
 */
export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Creates and registers a new active admin session.
 */
export function createAdminSession(authMethod: 'passkey' | 'google' = 'passkey'): AdminSession {
  const token = generateSessionToken()
  const now = Date.now()
  const session: AdminSession = {
    token,
    createdAt: now,
    expiresAt: now + SESSION_TTL_SECONDS * 1000,
    authMethod,
    role: 'admin',
  }
  sessionRegistry.set(token, session)
  return session
}

/**
 * Validates whether a token belongs to an active, non-expired session.
 */
export function validateAdminSession(token: string | null | undefined): AdminUser | null {
  if (!token || typeof token !== 'string') {
    return null
  }

  const session = sessionRegistry.get(token)
  if (!session) {
    return null
  }

  // Check TTL
  if (Date.now() > session.expiresAt) {
    sessionRegistry.delete(token)
    return null
  }

  return {
    role: 'admin',
    authenticatedAt: session.createdAt,
    authMethod: session.authMethod,
  }
}

/**
 * Revokes an existing admin session.
 */
export function revokeAdminSession(token: string | null | undefined): boolean {
  if (!token || typeof token !== 'string') {
    return false
  }
  return sessionRegistry.delete(token)
}

/**
 * Formats a Set-Cookie header value with security flags.
 */
export function formatSessionCookie(
  token: string,
  maxAge: number = SESSION_TTL_SECONDS,
  isSecure: boolean = process.env.NODE_ENV === 'production'
): string {
  const parts = [
    `${SESSION_COOKIE_NAME}=${token}`,
    'HttpOnly',
    'SameSite=Lax',
    'Path=/',
    `Max-Age=${maxAge}`,
  ]
  if (isSecure) {
    parts.push('Secure')
  }
  return parts.join('; ')
}

/**
 * Sets the admin session cookie on the outgoing response.
 */
export function setSessionCookie(token: string): string {
  const cookieValue = formatSessionCookie(token)
  try {
    safeSetResponseHeader('Set-Cookie', cookieValue)
  } catch {
    // Graceful fallback in non-H3 or mock test environments
  }
  return cookieValue
}

/**
 * Formats a clearing Set-Cookie header value.
 */
export function formatClearCookie(isSecure: boolean = process.env.NODE_ENV === 'production'): string {
  const parts = [
    `${SESSION_COOKIE_NAME}=`,
    'HttpOnly',
    'SameSite=Lax',
    'Path=/',
    'Max-Age=0',
  ]
  if (isSecure) {
    parts.push('Secure')
  }
  return parts.join('; ')
}

/**
 * Clears the admin session cookie on the outgoing response.
 */
export function clearSessionCookie(): string {
  const cookieValue = formatClearCookie()
  try {
    safeSetResponseHeader('Set-Cookie', cookieValue)
  } catch {
    // Graceful fallback in non-H3 or mock test environments
  }
  return cookieValue
}

/**
 * Extracts the admin session token from incoming request cookies.
 */
export function readSessionToken(explicitCookieHeader?: string): string | null {
  let header = explicitCookieHeader
  if (header === undefined) {
    header = safeGetRequestHeader('cookie')
    if (header === undefined && typeof document !== 'undefined') {
      try {
        header = document.cookie
      } catch {
        header = undefined
      }
    }
  }

  if (!header || typeof header !== 'string') {
    return null
  }

  const parts = header.split(/;\s*/)
  for (const part of parts) {
    const eq = part.indexOf('=')
    if (eq === -1) continue
    const name = part.slice(0, eq).trim()
    if (name === SESSION_COOKIE_NAME) {
      return part.slice(eq + 1).trim()
    }
  }

  return null
}

/**
 * Utility for test reset.
 */
export function clearAllSessionsForTesting(): void {
  sessionRegistry.clear()
}

/**
 * Inspect active session count (for diagnostics/tests).
 */
export function getActiveSessionCount(): number {
  return sessionRegistry.size
}

/**
 * Validates Master Admin session token.
 * Throws an unauthorized Error if invalid or expired.
 */
export function assertAdminAuthorized(explicitToken?: string | null): AdminUser {
  const token = explicitToken || readSessionToken()
  const adminUser = validateAdminSession(token)
  if (!adminUser) {
    throw new Error('UNAUTHORIZED: Sesi Master Admin diperlukan untuk mengakses konfigurasi platform.')
  }
  return adminUser
}
