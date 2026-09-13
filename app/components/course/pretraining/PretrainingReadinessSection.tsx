import React from 'react'
import {
  usePretrainingState,
  ReadinessResult,
} from '../../../hooks/usePretrainingState'

export interface PretrainingReadinessSectionProps {
  readiness: ReadinessResult
  onOpenResetModal: () => void
}

export function PretrainingReadinessSection({
  readiness,
  onOpenResetModal,
}: PretrainingReadinessSectionProps) {
  const { progress, checkpoints } = usePretrainingState()

  const cpList = [
    { id: 'cp-1', name: 'Node.js & npm', status: checkpoints['cp-1'] },
    { id: 'cp-2', name: '9Router Dashboard', status: checkpoints['cp-2'] },
    { id: 'cp-3', name: 'Bot Telegram & User ID', status: checkpoints['cp-3'] },
  ]

  return (
    <section id="sec-readiness-summary" className="content-section">
      <div className="section-header">
        <div className="section-title-wrap">
          <div className="section-badge-icon readiness-header-badge">
            🏆
          </div>
          <div>
            <h3 className="section-title">Status Kelayakan Pre-Training Peserta</h3>
            <p className="section-desc">
              Evaluasi otomatis kelayakan laptop dan kesiapan akun Anda untuk
              mengikuti sesi workshop.
            </p>
          </div>
        </div>
      </div>

      <div
        className={`card card-glass readiness-status-card readiness-status-${readiness.status}`}
        id="card-readiness-status"
      >
        {/* Top: Status Headline & Badge */}
        <div className="readiness-console-header">
          <div className="readiness-console-title-wrap">
            <span className="readiness-console-prefix">SYSTEM READINESS CONSOLE</span>
            <h4 className="readiness-console-heading">Hasil Evaluasi Kesiapan Mandiri</h4>
          </div>
          <div
            id="readiness-status-badge"
            className={`readiness-badge ${readiness.badgeClass}`}
          >
            <span className="status-dot"></span> {readiness.label}
          </div>
        </div>

        {/* Middle: Progress Bar & Verification Gate Status */}
        <div className="readiness-console-body">
          <div className="readiness-progress-block">
            <div className="readiness-progress-labels">
              <span className="readiness-progress-label">Tingkat Kesiapan Kumulatif</span>
              <span className="readiness-progress-value">{progress.percentage}%</span>
            </div>
            <div className="readiness-progress-track">
              <div
                className={`readiness-progress-fill status-${readiness.status}`}
                style={{ width: `${Math.min(100, Math.max(0, progress.percentage))}%` }}
              ></div>
            </div>
            <div className="readiness-progress-meta">
              <span>Modul Praktik: <strong>{progress.completedTasks}/{progress.totalTasks} Selesai</strong></span>
              <span>Gerbang Checkpoint: <strong>{progress.passedCheckpoints}/{progress.totalCheckpoints} Lolos</strong></span>
            </div>
          </div>

          <div className="readiness-gates-summary">
            {cpList.map((cp, idx) => (
              <div key={cp.id} className={`readiness-gate-item gate-${cp.status}`}>
                <span className="gate-item-dot"></span>
                <span className="gate-item-num">CP{idx + 1}</span>
                <span className="gate-item-name">{cp.name}</span>
                <span className="gate-item-status">
                  {cp.status === 'passed' ? 'Lolos' : cp.status === 'failed' ? 'Kendala' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <p id="readiness-status-desc" className="readiness-desc">
          {readiness.description}
        </p>

        {/* Bottom: Action Row */}
        <div className="readiness-actions">
          <a href="#sec-readiness-report" className="btn btn-primary btn-readiness-report">
            <span>📋</span> Buka Form Laporan Kesiapan
          </a>
          <button
            type="button"
            id="btn-open-reset-modal"
            className="btn btn-outline-danger btn-readiness-reset"
            onClick={onOpenResetModal}
          >
            <span>🔄</span> Reset Semua Progres
          </button>
        </div>
      </div>
    </section>
  )
}
