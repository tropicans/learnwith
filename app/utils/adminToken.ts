/**
 * Client-side admin session token persistence and retrieval utility.
 * Allows authorization across admin RPCs even when third-party cookies or 
 * cross-origin redirects prevent automatic cookie attachment.
 */

export const ADMIN_TOKEN_STORAGE_KEY = 'learnwith_admin_token'

export function getClientAdminToken(): string | undefined {
  if (typeof window === 'undefined') return undefined
  try {
    const token = sessionStorage.getItem(ADMIN_TOKEN_STORAGE_KEY)
    return token ? token.trim() : undefined
  } catch {
    return undefined
  }
}

export function setClientAdminToken(token: string): void {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, token.trim())
  } catch {}
}

export function clearClientAdminToken(): void {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY)
  } catch {}
}