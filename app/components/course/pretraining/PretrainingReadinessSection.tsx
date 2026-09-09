import React from 'react'
import { ReadinessResult } from '../../../hooks/usePretrainingState'

export interface PretrainingReadinessSectionProps {
  readiness: ReadinessResult
  onOpenResetModal: () => void
}

export function PretrainingReadinessSection({
  readiness,
  onOpenResetModal,
}: PretrainingReadinessSectionProps) {
  return (
    <section id="sec-readiness-summary" className="content-section">
      <div className="section-header">
        <div className="section-title-wrap">
          <div
            className="section-badge-icon"
            style={{
              background: 'var(--color-success-subtle)',
              color: 'var(--color-success)',
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.1rem',
            }}
          >
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
        className="card card-glass readiness-status-card"
        id="card-readiness-status"
        style={{ borderColor: readiness.color }}
      >
        <div style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>🎯</div>
        <h4
          style={{
            fontSize: 'var(--font-size-lg)',
            fontWeight: 'var(--font-weight-extrabold)',
            color: 'var(--text-primary)',
          }}
        >
          Hasil Evaluasi Kesiapan Mandiri
        </h4>

        <div>
          <div
            id="readiness-status-badge"
            className={`readiness-badge ${readiness.badgeClass}`}
          >
            {readiness.label}
          </div>
        </div>

        <p id="readiness-status-desc" className="readiness-desc">
          {readiness.description}
        </p>

        <div className="readiness-actions">
          <a href="#sec-readiness-report" className="btn btn-primary">
            <span>📋</span> Buka Form Laporan Kesiapan
          </a>
          <button
            type="button"
            id="btn-open-reset-modal"
            className="btn btn-outline-danger"
            onClick={onOpenResetModal}
          >
            <span>🔄</span> Reset Semua Progres
          </button>
        </div>
      </div>
    </section>
  )
}
