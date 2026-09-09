import React, { useState } from 'react'
import { adminLoginFn } from '../../server/adminAuth'
import type { AdminUser } from '../../schemas/admin'
import { GoogleSignInButton } from './GoogleSignInButton'

interface AdminLoginGateProps {
  onLoginSuccess: (user: AdminUser) => void
  googleClientIdConfigured?: boolean
}

export function AdminLoginGate({
  onLoginSuccess,
  googleClientIdConfigured = false,
}: AdminLoginGateProps) {
  const [passkey, setPasskey] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!passkey.trim()) {
      setErrorMessage('Silakan masukkan Master Passkey Admin.')
      return
    }

    setIsLoading(true)
    setErrorMessage(null)

    try {
      const result = await adminLoginFn({
        data: { passkey },
      })

      if (result.success && result.authenticatedAt) {
        onLoginSuccess({
          role: 'admin',
          authenticatedAt: result.authenticatedAt,
          authMethod: 'passkey',
        })
      } else {
        setErrorMessage(result.message || 'Passkey Master Admin tidak valid.')
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan sistem saat verifikasi.'
      setErrorMessage(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="admin-gate-wrapper" id="admin-login-gate">
      <div className="admin-login-card">
        <div className="admin-card-header">
          <div className="admin-brand-icon" aria-hidden="true">
            ⚡
          </div>
          <h2 className="admin-card-title">Command Center Instruktur</h2>
          <p className="admin-card-subtitle">
            Ruang kendali terpadu untuk monitoring peserta, telemetri kendala, dan konfigurasi passkey modul.
          </p>
        </div>

        {errorMessage && (
          <div className="admin-alert admin-alert-error" role="alert" id="admin-login-error">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-login-form" id="form-admin-login">
          <div className="admin-form-group">
            <label htmlFor="admin-passkey-input" className="admin-label">
              Master Admin Passkey
            </label>
            <div className="admin-input-wrapper">
              <input
                id="admin-passkey-input"
                name="passkey"
                type="password"
                className="admin-input"
                placeholder="Masukkan Master Passkey Admin..."
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                disabled={isLoading}
                autoComplete="current-password"
                autoFocus
              />
            </div>
          </div>

          <button
            type="submit"
            id="btn-admin-submit-login"
            className="btn-admin-submit"
            disabled={isLoading || !passkey.trim()}
          >
            {isLoading ? (
              <span>Memverifikasi...</span>
            ) : (
              <>
                <span>Masuk ke Command Center</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </>
            )}
          </button>
        </form>

        <div className="admin-divider">
          <span>atau</span>
        </div>

        <GoogleSignInButton
          isConfigured={googleClientIdConfigured}
          disabled={isLoading}
        />
      </div>
    </div>
  )
}
