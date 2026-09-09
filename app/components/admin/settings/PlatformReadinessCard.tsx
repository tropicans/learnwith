import React from 'react'
import type { AdminPlatformConfig } from '../../../schemas/platformConfig.ts'

interface PlatformReadinessCardProps {
  config: AdminPlatformConfig
}

export function PlatformReadinessCard({ config }: PlatformReadinessCardProps) {
  const { authReadiness, environment, version, serverTimestamp } = config

  const formatServerTime = (ts: number) => {
    try {
      return new Date(ts).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    } catch {
      return 'N/A'
    }
  }

  return (
    <div className="settings-card" id="platform-readiness-card">
      <div className="settings-card-header">
        <div className="settings-card-title-group">
          <div className="settings-card-icon" aria-hidden="true">
            🛡️
          </div>
          <div>
            <h2 className="settings-card-title">Kesiapan Arsitektur & Keamanan Platform</h2>
            <p className="settings-card-subtitle">
              Diagnostik runtime server, status isolasi kredensial (quarantine), enkripsi sesi, dan kesiapan integrasi Google SSO.
            </p>
          </div>
        </div>

        <span className="admin-status-pill status-pill-resolved" id="badge-security-verified">
          <span className="admin-live-dot" aria-hidden="true" />
          Sistem Aman & Aktif
        </span>
      </div>

      <div className="readiness-stat-grid">
        {/* Passkey Security */}
        <div className="readiness-stat-item">
          <div className="readiness-stat-header">
            <span className="readiness-icon">🔑</span>
            <span className="readiness-label">Master Admin Passkey</span>
          </div>
          <div className="readiness-value-wrap">
            <span className="readiness-value text-emerald">
              {authReadiness.adminPasskeyConfigured ? 'SHA-256 Validated' : 'Default Hash'}
            </span>
            <span className="readiness-desc">
              Proteksi timingSafeEqual dengan zero secret leakage pada respon publik.
            </span>
          </div>
        </div>

        {/* Session Hardening */}
        <div className="readiness-stat-item">
          <div className="readiness-stat-header">
            <span className="readiness-icon">🔒</span>
            <span className="readiness-label">Session Hardening</span>
          </div>
          <div className="readiness-value-wrap">
            <span className="readiness-value text-emerald">HttpOnly + SameSite=Lax</span>
            <span className="readiness-desc">
              Token 256-bit entropy acak kriptografis (TTL: {authReadiness.sessionTtlHours} Jam).
            </span>
          </div>
        </div>

        {/* Google OAuth SSO */}
        <div className="readiness-stat-item">
          <div className="readiness-stat-header">
            <span className="readiness-icon">🌐</span>
            <span className="readiness-label">Google Workspace SSO</span>
          </div>
          <div className="readiness-value-wrap">
            <span
              className={`readiness-value ${
                authReadiness.googleOAuthReady ? 'text-emerald' : 'text-amber'
              }`}
            >
              {authReadiness.googleOAuthReady
                ? 'OAuth Siap / Configured'
                : 'Menunggu Client ID Enterprise'}
            </span>
            <span className="readiness-desc">
              {authReadiness.googleOAuthReady
                ? 'Domain dinas @jakarta.go.id siap terhubung.'
                : 'Arsitektur siap. Fallback ke Passkey Master aktif secara otomatis.'}
            </span>
          </div>
        </div>

        {/* Runtime Environment & Store */}
        <div className="readiness-stat-item">
          <div className="readiness-stat-header">
            <span className="readiness-icon">⚙️</span>
            <span className="readiness-label">Status Node & State Store</span>
          </div>
          <div className="readiness-value-wrap">
            <span className="readiness-value">
              {environment.toUpperCase()} • v{version}
            </span>
            <span className="readiness-desc">
              In-Memory Platform Store sinkron. Waktu server: {formatServerTime(serverTimestamp)}.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
