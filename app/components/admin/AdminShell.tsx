import React, { useState } from 'react'
import type { AdminUser } from '../../schemas/admin'
import { adminLogoutFn } from '../../server/adminAuth'
import { AdminDashboardView } from './AdminDashboardView'
import { AdminPasskeyView } from './passkeys/AdminPasskeyView'
import { AdminTroubleshootingView } from './troubleshooting/AdminTroubleshootingView'
import { AdminSettingsView } from './settings/AdminSettingsView'

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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
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
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="3" width="7" height="9" rx="1" />
              <rect x="14" y="3" width="7" height="5" rx="1" />
              <rect x="14" y="12" width="7" height="9" rx="1" />
              <rect x="3" y="16" width="7" height="5" rx="1" />
            </svg>
            <span>Dashboard & Monitoring</span>
          </button>

          <button
            type="button"
            className={`admin-nav-tab ${activeTab === 'telemetry' ? 'active' : ''}`}
            onClick={() => setActiveTab('telemetry')}
            id="tab-admin-telemetry"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span>Peserta & Telemetri</span>
          </button>

          <button
            type="button"
            className={`admin-nav-tab ${activeTab === 'passkeys' ? 'active' : ''}`}
            onClick={() => setActiveTab('passkeys')}
            id="tab-admin-passkeys"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m21 2-2 2m-1.5 1.5L14 9a5 5 0 1 0 3 3l3.5-3.5" />
              <circle cx="7.5" cy="16.5" r="2.5" />
            </svg>
            <span>Passkey Modul Dinas</span>
          </button>

          <button
            type="button"
            className={`admin-nav-tab ${activeTab === 'troubleshooting' ? 'active' : ''}`}
            onClick={() => setActiveTab('troubleshooting')}
            id="tab-admin-troubleshooting"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span>Log Kendala</span>
          </button>

          <button
            type="button"
            className={`admin-nav-tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
            id="tab-admin-settings"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="4" y1="21" x2="4" y2="14" />
              <line x1="4" y1="10" x2="4" y2="3" />
              <line x1="12" y1="21" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12" y2="3" />
              <line x1="20" y1="21" x2="20" y2="16" />
              <line x1="20" y1="12" x2="20" y2="3" />
              <line x1="1" y1="14" x2="7" y2="14" />
              <line x1="9" y1="8" x2="15" y2="8" />
              <line x1="17" y1="16" x2="23" y2="16" />
            </svg>
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
            <AdminPasskeyView sessionToken={adminUser.token} />
          ) : activeTab === 'troubleshooting' ? (
            <AdminTroubleshootingView sessionToken={adminUser.token} />
          ) : (
            <AdminSettingsView sessionToken={adminUser.token} />
          )
        )}
      </main>
    </div>
  )
}
