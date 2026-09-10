import React, { useState, useRef, useEffect } from 'react'
import { adminLoginFn } from '../../server/adminAuth'
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
  const [passkey, setPasskey] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const activeError = errorMessage || externalErrorMessage

  // Detect and sync password manager autofill
  useEffect(() => {
    const syncAutofill = () => {
      if (inputRef.current?.value && inputRef.current.value !== passkey) {
        setPasskey(inputRef.current.value)
      }
    }
    const timer1 = setTimeout(syncAutofill, 200)
    const timer2 = setTimeout(syncAutofill, 600)
    const timer3 = setTimeout(syncAutofill, 1200)
    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [passkey])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const formVal = (formData.get('passkey') as string) || ''
    const domVal = inputRef.current?.value || ''
    const effectivePasskey = (formVal || domVal || passkey).trim()

    if (!effectivePasskey) {
      setErrorMessage('Silakan masukkan Master Passkey Admin.')
      return
    }

    setIsLoading(true)
    setErrorMessage(null)

    try {
      const result = await adminLoginFn({
        data: { passkey: effectivePasskey },
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

        <form onSubmit={handleSubmit} className="admin-login-form" id="form-admin-login">
          <div className="admin-form-group">
            <label htmlFor="admin-passkey-input" className="admin-label">
              Master Admin Passkey
            </label>
            <div className="admin-input-wrapper">
              <input
                ref={inputRef}
                id="admin-passkey-input"
                name="passkey"
                type="password"
                className="admin-input"
                placeholder="Masukkan Master Passkey Admin..."
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                onInput={(e) => setPasskey(e.currentTarget.value)}
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
            disabled={isLoading}
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

        {(() => {
          const redirectUri = typeof window !== 'undefined'
            ? `${window.location.origin}/admin`
            : 'http://localhost:3173/admin'
          const authUrl = googleClientId
            ? `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(googleClientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token%20id_token&scope=${encodeURIComponent('email profile openid')}&nonce=${Date.now()}&prompt=select_account`
            : undefined

          return (
            <GoogleSignInButton
              isConfigured={googleClientIdConfigured}
              authUrl={authUrl}
              disabled={isLoading}
            />
          )
        })()}
      </div>
    </div>
  )
}
