import React, { useState } from 'react'
import type { AdminUser } from '../../schemas/admin'
import { adminLogoutFn } from '../../server/adminAuth'
import { AdminDashboardView } from './AdminDashboardView'
import { AdminPasskeyView } from './passkeys/AdminPasskeyView'

interface AdminShellProps {
  adminUser: AdminUser
  onLogout: () => void
  children?: React.ReactNode
}

type AdminTab = 'dashboard' | 'telemetry' | 'passkeys' | 'troubleshooting' | 'settings'

export function AdminShell({ adminUser, onLogout, children }: AdminShellProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard')
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await adminLogoutFn()
    } catch {
      // Continue client logout regardless of network hiccups
    } finally {
      setIsLoggingOut(false)
      onLogout()
    }
  }

  const formatSessionTime = (timestamp: number) => {
    try {
      const d = new Date(timestamp)
      return d.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return 'Aktif'
    }
  }

  return (
    <div className="admin-shell" id="admin-shell-container">
      <header className="admin-shell-header">
        <div className="admin-top-bar">
          <div className="admin-title-area">
            <div className="admin-shield-icon" aria-hidden="true">
              🛡️
            </div>
            <div className="admin-title-group">
              <h1>
                <span>LearnWith Admin</span>
                <span className="admin-env-pill">Command Center</span>
              </h1>
            </div>
          </div>

          <div className="admin-actions-area">
            <div className="admin-session-badge" id="admin-session-status">
              <span className="admin-live-dot" aria-hidden="true" />
              <span>
                Master Admin • Sesi Sejak {formatSessionTime(adminUser.authenticatedAt)}
              </span>
            </div>

            <button
              type="button"
              id="btn-admin-logout"
              className="btn-admin-logout"
              onClick={handleLogout}
              disabled={isLoggingOut}
              title="Akhiri sesi administrator"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>{isLoggingOut ? 'Keluar...' : 'Keluar'}</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="admin-nav-tabs" aria-label="Navigasi Command Center">
          <button
            type="button"
            className={`admin-nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
            id="tab-admin-dashboard"
          >
            <span>📊</span>
            <span>Dashboard & Monitoring</span>
          </button>

          <button
            type="button"
            className={`admin-nav-tab ${activeTab === 'telemetry' ? 'active' : ''}`}
            onClick={() => setActiveTab('telemetry')}
            id="tab-admin-telemetry"
          >
            <span>👥</span>
            <span>Peserta & Telemetri</span>
          </button>

          <button
            type="button"
            className={`admin-nav-tab ${activeTab === 'passkeys' ? 'active' : ''}`}
            onClick={() => setActiveTab('passkeys')}
            id="tab-admin-passkeys"
          >
            <span>🔑</span>
            <span>Passkey Modul Dinas</span>
          </button>

          <button
            type="button"
            className={`admin-nav-tab ${activeTab === 'troubleshooting' ? 'active' : ''}`}
            onClick={() => setActiveTab('troubleshooting')}
            id="tab-admin-troubleshooting"
          >
            <span>🛠️</span>
            <span>Log Kendala</span>
          </button>

          <button
            type="button"
            className={`admin-nav-tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
            id="tab-admin-settings"
          >
            <span>⚙️</span>
            <span>Pengaturan Platform</span>
          </button>
        </nav>
      </header>

      {/* Main Body */}
      <main className="admin-content-body">
        {children || (
          activeTab === 'dashboard' || activeTab === 'telemetry' ? (
            <AdminDashboardView initialTab={activeTab} />
          ) : activeTab === 'passkeys' ? (
            <AdminPasskeyView />
          ) : (
            <div className="admin-placeholder-card" id="admin-active-view">
              <div className="admin-placeholder-icon" aria-hidden="true">
                {activeTab === 'troubleshooting' && '🛠️'}
                {activeTab === 'settings' && '⚙️'}
              </div>

              <h2 className="admin-placeholder-title">
                {activeTab === 'troubleshooting' && 'Log Kendala & Export Laporan'}
                {activeTab === 'settings' && 'Konfigurasi & Integrasi Platform'}
              </h2>

              <p className="admin-placeholder-desc">
                {activeTab === 'troubleshooting' &&
                  'Penyaringan insiden, troubleshooting ekspor WhatsApp/Telegram, dan pemulihan kendala (Fase 32).'}
                {activeTab === 'settings' &&
                  'Konfigurasi environment server, kesiapan Google Workspace OAuth SSO, dan parameter operasional (Fase 33).'}
              </p>

              <div className="admin-quick-stats">
                <div className="admin-stat-card">
                  <span className="admin-stat-label">Status Autentikasi</span>
                  <span className="admin-stat-value">Terverifikasi</span>
                  <span className="admin-stat-hint">Metode: Master Passkey SHA-256</span>
                </div>
                <div className="admin-stat-card">
                  <span className="admin-stat-label">Session Protection</span>
                  <span className="admin-stat-value">HttpOnly + Lax</span>
                  <span className="admin-stat-hint">Token Entropy: 256-bit Hex</span>
                </div>
                <div className="admin-stat-card">
                  <span className="admin-stat-label">Google OAuth Readiness</span>
                  <span className="admin-stat-value">Arsitektur Siap</span>
                  <span className="admin-stat-hint">Menunggu Client ID Enterprise</span>
                </div>
              </div>
            </div>
          )
        )}
      </main>
    </div>
  )
}
