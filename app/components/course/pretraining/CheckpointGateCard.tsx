import React from 'react'

export interface CheckpointGateCardProps {
  id: 'cp-1' | 'cp-2' | 'cp-3'
  num: number
  title: string
  subtitle: string
  criteriaTitle: string
  criteria: string[]
  status: 'pending' | 'passed' | 'failed'
  onStatusChange: (status: 'pending' | 'passed' | 'failed') => void
  children?: React.ReactNode
}

export function CheckpointGateCard({
  id,
  num,
  title,
  subtitle,
  criteriaTitle,
  criteria,
  status,
  onStatusChange,
  children,
}: CheckpointGateCardProps) {
  const statusBadge =
    status === 'passed' ? (
      <span id={`status-card-${id}`} className="badge badge-pill badge-success">
        ✓ Lolos
      </span>
    ) : status === 'failed' ? (
      <span id={`status-card-${id}`} className="badge badge-pill badge-danger">
        ✕ Kendala
      </span>
    ) : (
      <span id={`status-card-${id}`} className="badge badge-pill badge-warning">
        Pending
      </span>
    )

  return (
    <div
      className={`checkpoint-gate-card ${status !== 'pending' ? status : ''}`}
      id={`card-${id}`}
    >
      <div className="checkpoint-header-row">
        <div className="checkpoint-title-wrap">
          <div className="checkpoint-badge-icon">{num}</div>
          <div>
            <h4
              style={{
                fontSize: 'var(--font-size-base)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--text-primary)',
                marginBottom: '0.15rem',
              }}
            >
              {title}
            </h4>
            <span
              style={{
                fontSize: 'var(--font-size-xs)',
                color: 'var(--text-muted)',
              }}
            >
              {subtitle}
            </span>
          </div>
        </div>
        {statusBadge}
      </div>

      <p
        className="card-body"
        dangerouslySetInnerHTML={{ __html: criteriaTitle }}
      />

      <div className="checklist-group" style={{ margin: '0.75rem 0 1rem 0' }}>
        {criteria.map((crit, idx) => (
          <div key={idx} className="checklist-item" style={{ cursor: 'default' }}>
            <span
              style={{
                fontSize: '1.1rem',
                color: 'var(--color-success)',
                fontWeight: 'bold',
              }}
            >
              ✓
            </span>
            <div
              className="checklist-label"
              dangerouslySetInnerHTML={{ __html: crit }}
            />
          </div>
        ))}
      </div>

      {children}

      <div className="cp-action-btn-group">
        <button
          type="button"
          className="btn btn-success btn-cp-action"
          data-checkpoint={id}
          data-status="passed"
          onClick={() => onStatusChange('passed')}
        >
          <span>✓</span> Lolos Verifikasi
        </button>
        <button
          type="button"
          className="btn btn-outline-danger btn-cp-action"
          data-checkpoint={id}
          data-status="failed"
          onClick={() => onStatusChange('failed')}
        >
          <span>✕</span> Ada Kendala (Gagal)
        </button>
        <button
          type="button"
          className="btn btn-secondary btn-cp-action btn-sm"
          data-checkpoint={id}
          data-status="pending"
          onClick={() => onStatusChange('pending')}
        >
          <span>↺</span> Reset Status
        </button>
      </div>
    </div>
  )
}
