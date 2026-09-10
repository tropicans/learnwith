import React from 'react'
import type { AdminUser } from '../../schemas/admin'
import { GoogleSignInButton } from './GoogleSignInButton'

interface AdminLoginGateProps {
  onLoginSuccess: (user: AdminUser) => void
  googleClientIdConfigured?: boolean
  googleClientId?: string
  externalErrorMessage?: string | null
}

export function AdminLoginGate({
  onLoginSuccess,
  googleClientIdConfigured = false,
  googleClientId,
  externalErrorMessage = null,
}: AdminLoginGateProps) {
  const activeError = externalErrorMessage

  const redirectUri = typeof window !== 'undefined'
    ? `${window.location.origin}/admin`
    : 'http://localhost:3173/admin'
  const authUrl = googleClientId
    ? `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(googleClientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token%20id_token&scope=${encodeURIComponent('email profile openid')}&nonce=${Date.now()}&prompt=select_account`
    : undefined

  return (
    <div className="admin-gate-wrapper" id="admin-login-gate">
      <div className="admin-login-card">
        <div className="admin-card-header">
          <div className="admin-brand-icon" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h2 className="admin-card-title">Command Center Instruktur</h2>
          <p className="admin-card-subtitle">
            Ruang kendali terpadu untuk monitoring peserta, telemetri kendala, dan konfigurasi passkey modul.
          </p>
        </div>

        {activeError && (
          <div className="admin-alert admin-alert-error" role="alert" id="admin-login-error">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{activeError}</span>
          </div>
        )}

        <div className="admin-login-oauth-section">
          <p className="admin-login-hint">
            Masuk dengan akun Google resmi Master Administrator untuk melanjutkan:
          </p>
          <GoogleSignInButton
            isConfigured={googleClientIdConfigured}
            authUrl={authUrl}
          />
        </div>
      </div>
    </div>
  )
}
