import React from 'react'
import type { TroubleshootingItem } from '@/data/pretrainingTroubleshooting'
import { CopyableCodeBlock } from './CopyableCodeBlock'

export interface TroubleshootingCardProps {
  item: TroubleshootingItem
}

export function TroubleshootingCard({ item }: TroubleshootingCardProps) {
  const badgeClass =
    item.severity === 'danger'
      ? 'badge badge-pill badge-danger'
      : item.severity === 'warning'
      ? 'badge badge-pill badge-warning'
      : item.severity === 'primary'
      ? 'badge badge-pill badge-primary'
      : 'badge badge-pill badge-neutral'

  return (
    <div
      className={`trouble-card ${item.severity === 'danger' ? 'danger' : ''}`}
      data-trouble-category={item.category}
      id={`trouble-${item.id}`}
    >
      <div className="trouble-header">
        <div className="trouble-title-wrap">
          <div className="trouble-icon">{item.icon}</div>
          <div>
            <h4 className="trouble-title">{item.title}</h4>
            <span className={badgeClass}>{item.categoryLabel}</span>
          </div>
        </div>
      </div>

      <div className="trouble-cause">
        <strong>Penyebab:</strong> {item.cause}
      </div>

      <ol className="trouble-steps">
        {item.steps.map((step, idx) => (
          <li key={idx}>{step}</li>
        ))}
      </ol>

      {item.codeBlock && (
        <div style={{ marginTop: '0.75rem' }}>
          <CopyableCodeBlock
            code={item.codeBlock.code}
            language={item.codeBlock.language}
            label={item.codeBlock.label}
            ariaLabel={item.codeBlock.ariaLabel}
            toastMessage={item.codeBlock.toastMessage}
          />
        </div>
      )}
    </div>
  )
}
