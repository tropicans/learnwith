import React from 'react'
import type { CourseLifecycleAuditEntry, CourseLifecycleStatus } from '../../../schemas/courseLifecycle'

export interface CourseLifecycleAuditTableProps {
  auditLog: CourseLifecycleAuditEntry[]
  isLoading?: boolean
}

export function CourseLifecycleAuditTable({
  auditLog,
  isLoading = false,
}: CourseLifecycleAuditTableProps) {
  const formatDateTime = (timestamp: number) => {
    try {
      return new Date(timestamp).toLocaleString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    } catch {
      return 'Baru saja'
    }
  }

  const renderStatusBadge = (status: CourseLifecycleStatus) => {
    switch (status) {
      case 'active':
        return (
          <span className="audit-status-badge status-active">
            <span className="status-dot" aria-hidden="true" />
            <span>Aktif</span>
          </span>
        )
      case 'hidden':
        return (
          <span className="audit-status-badge status-hidden">
            <span className="status-dot" aria-hidden="true" />
            <span>Tersembunyi</span>
          </span>
        )
      case 'archived':
        return (
          <span className="audit-status-badge status-archived">
            <span className="status-dot" aria-hidden="true" />
            <span>Diarsipkan</span>
          </span>
        )
      case 'deleted':
        return (
          <span className="audit-status-badge status-deleted">
            <span className="status-dot" aria-hidden="true" />
            <span>Dinonaktifkan</span>
          </span>
        )
      default:
        return <span>{status}</span>
    }
  }

  return (
    <div className="admin-audit-section" id="course-audit-section">
      <div className="admin-audit-header">
        <div className="admin-audit-title-wrap">
          <h3 className="admin-audit-title">Riwayat Audit Perubahan Status Kursus</h3>
          <p className="admin-audit-subtitle">
            Catatan historis transisi status kursus, operator penanggung jawab, dan catatan perubahan.
          </p>
        </div>
        <span className="admin-audit-count-tag" id="audit-log-count">
          {auditLog.length} Entri
        </span>
      </div>

      <div className="admin-audit-table-wrapper">
        <table className="admin-audit-table" id="admin-audit-table">
          <thead>
            <tr>
              <th scope="col" style={{ width: '180px' }}>Waktu Transisi</th>
              <th scope="col" style={{ width: '120px' }}>Kursus</th>
              <th scope="col" style={{ width: '220px' }}>Perubahan Status</th>
              <th scope="col" style={{ width: '150px' }}>Operator</th>
              <th scope="col">Alasan / Catatan</th>
            </tr>
          </thead>
          <tbody>
            {auditLog.length === 0 ? (
              <tr>
                <td colSpan={5} className="audit-table-empty">
                  Belum ada riwayat perubahan status kursus.
                </td>
              </tr>
            ) : (
              auditLog.map((entry) => (
                <tr key={entry.id} className="audit-table-row">
                  <td className="audit-timestamp">
                    <span className="audit-mono">{formatDateTime(entry.timestamp)}</span>
                  </td>
                  <td className="audit-course-id">
                    <span className="audit-id-badge">{entry.courseId.toUpperCase()}</span>
                  </td>
                  <td className="audit-transition">
                    <div className="audit-transition-wrap">
                      {renderStatusBadge(entry.fromStatus)}
                      <span className="audit-arrow" aria-hidden="true">→</span>
                      {renderStatusBadge(entry.toStatus)}
                    </div>
                  </td>
                  <td className="audit-operator">
                    <span className="audit-operator-badge">{entry.operator || 'master-admin'}</span>
                  </td>
                  <td className="audit-reason">
                    {entry.reason ? (
                      <span className="audit-reason-text">{entry.reason}</span>
                    ) : (
                      <span className="audit-reason-muted">-</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
