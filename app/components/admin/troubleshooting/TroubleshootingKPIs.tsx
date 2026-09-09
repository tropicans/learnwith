import React from 'react'
import type { TroubleshootingStats } from '../../../schemas/troubleshooting'

interface TroubleshootingKPIsProps {
  stats: TroubleshootingStats | null
  isLoading?: boolean
}

export function TroubleshootingKPIs({ stats, isLoading = false }: TroubleshootingKPIsProps) {
  const total = stats?.totalIncidents ?? 0
  const portCount = stats?.categoryCounts?.port_conflict ?? 0
  const psCount = stats?.categoryCounts?.powershell_policy ?? 0
  const oauthCount = stats?.categoryCounts?.oauth_api_key ?? 0
  const openCount = stats?.openCount ?? 0
  const resolvedCount = stats?.resolvedCount ?? 0

  const resolutionRate =
    total > 0 ? Math.round((resolvedCount / total) * 100) : 100

  return (
    <div className="admin-quick-stats troubleshoot-kpi-grid" id="troubleshoot-kpi-grid">
      {/* 1. Total Incidents */}
      <div className={`admin-stat-card ${isLoading ? 'is-loading' : ''}`} id="stat-card-total-incidents">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="admin-stat-label">Total Insiden Terlaporkan</span>
          <span className="admin-live-dot" style={{ background: '#10b981' }} title="Monitoring Aktif" />
        </div>
        <span className="admin-stat-value" id="val-total-incidents">
          {total}
        </span>
        <span className="admin-stat-hint">
          {openCount} Terbuka • {stats?.investigatingCount ?? 0} Investigasi
        </span>
      </div>

      {/* 2. Port Conflict */}
      <div className={`admin-stat-card ${isLoading ? 'is-loading' : ''}`} id="stat-card-port-conflict">
        <span className="admin-stat-label">Bentrok Port 20128 (EADDRINUSE)</span>
        <span
          className="admin-stat-value"
          id="val-port-conflict"
          style={{ color: portCount > 0 ? '#ef4444' : 'inherit' }}
        >
          {portCount}
        </span>
        <span className="admin-stat-hint">9Router Process Conflict</span>
      </div>

      {/* 3. PowerShell Policy */}
      <div className={`admin-stat-card ${isLoading ? 'is-loading' : ''}`} id="stat-card-powershell-policy">
        <span className="admin-stat-label">PowerShell Execution Policy</span>
        <span
          className="admin-stat-value"
          id="val-powershell-policy"
          style={{ color: psCount > 0 ? '#f59e0b' : 'inherit' }}
        >
          {psCount}
        </span>
        <span className="admin-stat-hint">Script Execution Restrict</span>
      </div>

      {/* 4. OAuth & API Key */}
      <div className={`admin-stat-card ${isLoading ? 'is-loading' : ''}`} id="stat-card-oauth-error">
        <span className="admin-stat-label">OAuth & Gemini API Key</span>
        <span
          className="admin-stat-value"
          id="val-oauth-error"
          style={{ color: oauthCount > 0 ? '#dc2626' : 'inherit' }}
        >
          {oauthCount}
        </span>
        <span className="admin-stat-hint">401 Unauthorized / Expired</span>
      </div>

      {/* 5. Resolution Ratio */}
      <div className={`admin-stat-card ${isLoading ? 'is-loading' : ''}`} id="stat-card-resolution-ratio">
        <span className="admin-stat-label">Rasio Penanganan</span>
        <span className="admin-stat-value" id="val-resolution-ratio" style={{ color: '#10b981' }}>
          {resolutionRate}%
        </span>
        <span className="admin-stat-hint">
          {resolvedCount} Selesai / {openCount} Terbuka
        </span>
      </div>
    </div>
  )
}
