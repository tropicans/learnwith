import React from 'react'
import type {
  TroubleshootingLogRecord,
  TroubleshootingCategory,
  TroubleshootingSeverity,
  TroubleshootingStatus,
} from '../../../schemas/troubleshooting'

interface TroubleshootingLogTableProps {
  incidents: TroubleshootingLogRecord[]
  onSelectIncident: (incident: TroubleshootingLogRecord) => void
  onQuickResolve: (incidentId: string) => void
  isLoading?: boolean
}

export function TroubleshootingLogTable({
  incidents,
  onSelectIncident,
  onQuickResolve,
  isLoading = false,
}: TroubleshootingLogTableProps) {
  const formatTime = (timestamp: number) => {
    try {
      const d = new Date(timestamp)
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return 'Baru saja'
    }
  }

  const getCategoryBadge = (category: TroubleshootingCategory) => {
    switch (category) {
      case 'port_conflict':
        return { label: '⚡ Port 20128', className: 'category-port' }
      case 'powershell_policy':
        return { label: '🛡️ PS Policy', className: 'category-ps' }
      case 'oauth_api_key':
        return { label: '🔑 OAuth/API', className: 'category-oauth' }
      case 'telegram_conflict':
        return { label: '🤖 TG 409', className: 'category-tg' }
      case 'permissions_eperm':
        return { label: '🛑 EPERM', className: 'category-eperm' }
      case 'network_runtime':
        return { label: '🌐 Network', className: 'category-network' }
      case 'other':
      default:
        return { label: '📦 Lainnya', className: 'category-other' }
    }
  }

  const getSeverityBadge = (severity: TroubleshootingSeverity) => {
    switch (severity) {
      case 'critical':
        return { label: 'CRITICAL', className: 'severity-critical' }
      case 'high':
        return { label: 'HIGH', className: 'severity-high' }
      case 'medium':
        return { label: 'MEDIUM', className: 'severity-medium' }
      case 'low':
      default:
        return { label: 'LOW', className: 'severity-low' }
    }
  }

  const getStatusBadge = (status: TroubleshootingStatus) => {
    switch (status) {
      case 'open':
        return { label: 'Open', className: 'status-open' }
      case 'investigating':
        return { label: 'Investigating', className: 'status-investigating' }
      case 'resolved':
        return { label: 'Resolved', className: 'status-resolved' }
    }
  }

  if (incidents.length === 0) {
    return (
      <div className="admin-empty-state" id="troubleshoot-empty-state">
        <div className="admin-empty-icon" aria-hidden="true">
          🎉
        </div>
        <h3 className="admin-empty-title">Tidak Ada Kendala Ditemukan</h3>
        <p className="admin-empty-desc">
          Semua peserta berjalan lancar atau tidak ada insiden yang cocok dengan filter yang Anda pilih.
        </p>
      </div>
    )
  }

  return (
    <div className="admin-table-container troubleshoot-table-wrap" id="troubleshoot-table-wrap">
      <table className="admin-data-table troubleshoot-table" id="troubleshoot-table">
        <thead>
          <tr>
            <th style={{ width: '130px' }}>Waktu</th>
            <th style={{ width: '180px' }}>Kategori & Severity</th>
            <th style={{ width: '180px' }}>Peserta / OS</th>
            <th>Cuplikan Error (Sanitized)</th>
            <th style={{ width: '120px' }}>Status</th>
            <th style={{ width: '170px', textAlign: 'right' }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {incidents.map((incident) => {
            const cat = getCategoryBadge(incident.category)
            const sev = getSeverityBadge(incident.severity)
            const stat = getStatusBadge(incident.status)

            return (
              <tr
                key={incident.id}
                className={`troubleshoot-row row-status-${incident.status}`}
                id={`row-incident-${incident.id}`}
              >
                {/* Waktu */}
                <td>
                  <span className="log-timestamp" title={new Date(incident.timestamp).toLocaleString('id-ID')}>
                    {formatTime(incident.timestamp)}
                  </span>
                  <div style={{ fontSize: '10px', color: 'var(--text-tertiary, #9ca3af)', fontFamily: 'monospace' }}>
                    {incident.id.slice(-8)}
                  </div>
                </td>

                {/* Kategori & Severity */}
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', alignItems: 'flex-start' }}>
                    <span className={`troubleshoot-category-badge ${cat.className}`}>
                      {cat.label}
                    </span>
                    <span className={`troubleshoot-severity-badge ${sev.className}`}>
                      {sev.label}
                    </span>
                  </div>
                </td>

                {/* Peserta */}
                <td>
                  <div style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>
                    {incident.participantName || 'Peserta Mandiri'}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    {incident.participantId}
                  </div>
                  {incident.os && (
                    <span className="badge badge-neutral" style={{ fontSize: '10px', marginTop: '2px' }}>
                      💻 {incident.os}
                    </span>
                  )}
                </td>

                {/* Cuplikan Error */}
                <td>
                  <div className="error-snippet-box" title={incident.rawErrorText}>
                    <code>
                      {incident.rawErrorText.length > 140
                        ? incident.rawErrorText.slice(0, 140) + '...'
                        : incident.rawErrorText}
                    </code>
                  </div>
                  {incident.problemStep && (
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      📍 <strong>Langkah:</strong> {incident.problemStep}
                    </div>
                  )}
                </td>

                {/* Status */}
                <td>
                  <span className={`troubleshoot-status-pill ${stat.className}`}>
                    {stat.label}
                  </span>
                  {incident.resolvedAt && (
                    <div style={{ fontSize: '10px', color: '#10b981', marginTop: '2px' }}>
                      Selesai
                    </div>
                  )}
                </td>

                {/* Tindakan */}
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className="btn-troubleshoot-inspect"
                      onClick={() => onSelectIncident(incident)}
                      id={`btn-inspect-${incident.id}`}
                      title="Buka detail insiden & perintah perbaikan"
                    >
                      🛠️ Bantu
                    </button>
                    {incident.status !== 'resolved' && (
                      <button
                        type="button"
                        className="btn-troubleshoot-quick-resolve"
                        onClick={() => onQuickResolve(incident.id)}
                        id={`btn-resolve-${incident.id}`}
                        title="Tandai masalah selesai"
                      >
                        ✓
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
