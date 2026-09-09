import type { CheckpointPreview } from '@/data/pretrainingModules'

export interface CheckpointPreviewCardProps {
  checkpoint: CheckpointPreview
}

export function CheckpointPreviewCard({ checkpoint }: CheckpointPreviewCardProps) {
  return (
    <div
      className="card card-glass"
      style={{ borderLeft: '4px solid var(--color-success)', marginTop: '1rem' }}
    >
      <div className="card-header">
        <h4 className="card-title" style={{ color: 'var(--color-success)' }}>
          {checkpoint.title}
        </h4>
        <span className="badge badge-pill badge-success">{checkpoint.badge}</span>
      </div>
      <div className="card-body">
        <p>{checkpoint.description}</p>
        {checkpoint.requirements && checkpoint.requirements.length > 0 && (
          <ul style={{ margin: '0.5rem 0 0 1.25rem', color: 'var(--text-secondary)' }}>
            {checkpoint.requirements.map((req, idx) => (
              <li key={idx} dangerouslySetInnerHTML={{ __html: req }} />
            ))}
          </ul>
        )}
        {checkpoint.note && (
          <p
            style={{
              marginTop: '0.75rem',
              fontSize: 'var(--font-size-xs)',
              color: 'var(--text-muted)',
            }}
            dangerouslySetInnerHTML={{ __html: checkpoint.note }}
          />
        )}
      </div>
    </div>
  )
}
