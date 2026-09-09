import React, { useState, useEffect } from 'react'
import type {
  TroubleshootingLogRecord,
  TroubleshootingStatus,
} from '../../../schemas/troubleshooting'

interface TroubleshootingDetailModalProps {
  incident: TroubleshootingLogRecord | null
  isOpen: boolean
  onClose: () => void
  onUpdateStatus: (
    incidentId: string,
    status: TroubleshootingStatus,
    notes?: string
  ) => Promise<void>
  isSaving?: boolean
}

export function TroubleshootingDetailModal({
  incident,
  isOpen,
  onClose,
  onUpdateStatus,
  isSaving = false,
}: TroubleshootingDetailModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<TroubleshootingStatus>('open')
  const [notes, setNotes] = useState('')
  const [copiedType, setCopiedType] = useState<'cmd' | 'error' | null>(null)

  useEffect(() => {
    if (incident) {
      setSelectedStatus(incident.status)
      setNotes(incident.instructorNotes || '')
      setCopiedType(null)
    }
  }, [incident])

  if (!isOpen || !incident) return null

  const handleCopy = async (text: string, type: 'cmd' | 'error') => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text)
      } else {
        const textarea = document.createElement('textarea')
        textarea.value = text
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }
      setCopiedType(type)
      setTimeout(() => setCopiedType(null), 2500)
    } catch {
      // Fallback
    }
  }

  const handleSave = async () => {
    await onUpdateStatus(incident.id, selectedStatus, notes)
  }

  const formatFullDate = (timestamp: number) => {
    try {
      return new Date(timestamp).toLocaleString('id-ID', {
        dateStyle: 'full',
        timeStyle: 'medium',
      })
    } catch {
      return 'Waktu tidak valid'
    }
  }

  return (
    <div className="admin-modal-backdrop" onClick={onClose} id="troubleshoot-modal-backdrop">
      <div
        className="admin-modal-container troubleshoot-detail-modal"
        id="troubleshoot-detail-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '780px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* Header */}
        <div className="admin-modal-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '1.25rem' }}>🛠️</span>
              <h2 className="admin-modal-title" style={{ margin: 0, fontSize: '1.2rem' }}>
                Triage Insiden Teknis
              </h2>
              <code style={{ fontSize: '0.8rem', background: 'var(--bg-card, #f3f4f6)', padding: '0.15rem 0.4rem', borderRadius: 4 }}>
                {incident.id}
              </code>
            </div>
            <p style={{ margin: 0, fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
              Dilaporkan oleh <strong>{incident.participantName || incident.participantId}</strong> • {formatFullDate(incident.timestamp)}
            </p>
          </div>

          <button
            type="button"
            className="admin-modal-close"
            onClick={onClose}
            aria-label="Tutup modal"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="admin-modal-body" style={{ overflowY: 'auto', padding: '1.25rem', flex: 1 }}>
          {/* Metadata Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div className="detail-meta-box">
              <span className="detail-meta-label">Kategori</span>
              <span className="detail-meta-value" style={{ fontWeight: 600 }}>
                {incident.category.toUpperCase().replace('_', ' ')}
              </span>
            </div>
            <div className="detail-meta-box">
              <span className="detail-meta-label">Severity</span>
              <span
                className="detail-meta-value"
                style={{
                  fontWeight: 700,
                  color:
                    incident.severity === 'critical'
                      ? '#ef4444'
                      : incident.severity === 'high'
                        ? '#f59e0b'
                        : '#3b82f6',
                }}
              >
                {incident.severity.toUpperCase()}
              </span>
            </div>
            <div className="detail-meta-box">
              <span className="detail-meta-label">Lingkungan Peserta</span>
              <span className="detail-meta-value">
                {incident.os || 'Windows (Default)'} • Modul {incident.courseId.toUpperCase()}
              </span>
            </div>
            {incident.problemStep && (
              <div className="detail-meta-box">
                <span className="detail-meta-label">Langkah Kendala</span>
                <span className="detail-meta-value">{incident.problemStep}</span>
              </div>
            )}
          </div>

          {/* PowerShell Remediation Command (Prominent) */}
          {incident.suggestedCommand && (
            <div className="remediation-command-section" style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700, color: 'var(--accent-primary, #6366f1)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  ⚡ Perintah Rekomendasi Solusi (PowerShell)
                </span>
                <button
                  type="button"
                  className={`btn-admin-filter cmd-copy-btn ${copiedType === 'cmd' ? 'active' : ''}`}
                  onClick={() => handleCopy(incident.suggestedCommand!, 'cmd')}
                  id="btn-copy-solution-cmd"
                  style={{ fontSize: 'var(--font-size-xs)', padding: '0.25rem 0.6rem' }}
                >
                  {copiedType === 'cmd' ? '✅ Perintah Tersalin!' : '📋 Salin Perintah Solusi'}
                </button>
              </div>
              <div className="remediation-command-box" id="remediation-command-box">
                <code>{incident.suggestedCommand}</code>
              </div>
              {incident.suggestedRemediation && (
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', marginTop: '0.4rem', marginBottom: 0 }}>
                  💡 <strong>Analisis Solusi:</strong> {incident.suggestedRemediation}
                </p>
              )}
            </div>
          )}

          {/* Full Sanitized Error Stack */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Pesan Error Terminal (Sanitized & Masked):
              </span>
              <button
                type="button"
                className="btn-passkey-toggle-reveal"
                onClick={() => handleCopy(incident.rawErrorText, 'error')}
                id="btn-copy-raw-error"
                style={{ fontSize: '11px' }}
              >
                {copiedType === 'error' ? '✅ Error Tersalin' : '📋 Salin Log'}
              </button>
            </div>
            <pre
              className="error-stack-trace-box"
              id="error-stack-trace-box"
              style={{
                background: 'var(--bg-code, #1e1e2e)',
                color: '#f8fafc',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md, 8px)',
                fontSize: 'var(--font-size-xs)',
                fontFamily: 'var(--font-mono, monospace)',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                maxHeight: '180px',
                overflowY: 'auto',
                margin: 0,
              }}
            >
              {incident.rawErrorText}
            </pre>
          </div>

          {/* Status Lifecycle Selector */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              Ubah Status Insiden:
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className={`btn-admin-filter ${selectedStatus === 'open' ? 'active' : ''}`}
                onClick={() => setSelectedStatus('open')}
                id="modal-status-open"
                style={{
                  color: selectedStatus === 'open' ? '#fff' : '#ef4444',
                  background: selectedStatus === 'open' ? '#ef4444' : undefined,
                  borderColor: '#ef4444',
                }}
              >
                🔴 Buka (Open)
              </button>
              <button
                type="button"
                className={`btn-admin-filter ${selectedStatus === 'investigating' ? 'active' : ''}`}
                onClick={() => setSelectedStatus('investigating')}
                id="modal-status-investigating"
                style={{
                  color: selectedStatus === 'investigating' ? '#fff' : '#f59e0b',
                  background: selectedStatus === 'investigating' ? '#f59e0b' : undefined,
                  borderColor: '#f59e0b',
                }}
              >
                🟡 Sedang Investigasi
              </button>
              <button
                type="button"
                className={`btn-admin-filter ${selectedStatus === 'resolved' ? 'active' : ''}`}
                onClick={() => setSelectedStatus('resolved')}
                id="modal-status-resolved"
                style={{
                  color: selectedStatus === 'resolved' ? '#fff' : '#10b981',
                  background: selectedStatus === 'resolved' ? '#10b981' : undefined,
                  borderColor: '#10b981',
                }}
              >
                🟢 Selesai (Resolved)
              </button>
            </div>
          </div>

          {/* Instructor Notes Textarea */}
          <div style={{ marginBottom: '0.5rem' }}>
            <label
              htmlFor="textarea-instructor-notes"
              style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}
            >
              Catatan Koordinasi Instruktur:
            </label>
            <textarea
              id="textarea-instructor-notes"
              className="form-input instructor-notes-area"
              rows={3}
              placeholder="Contoh: Sudah dibantu via remote AnyDesk, port 20128 dibebaskan dari proses lama..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{ fontSize: 'var(--font-size-xs)', resize: 'vertical' }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="admin-modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', padding: '1rem 1.25rem' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            id="btn-close-modal"
          >
            Batal
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSave}
            disabled={isSaving}
            id="btn-save-incident-status"
          >
            {isSaving ? 'Menyimpan...' : 'Simpan Perubahan ✓'}
          </button>
        </div>
      </div>
    </div>
  )
}
