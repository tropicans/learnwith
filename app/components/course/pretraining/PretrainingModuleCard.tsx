import type { PretrainingModule } from '@/data/pretrainingModules'
import { CopyableCodeBlock } from './CopyableCodeBlock'
import { CheckpointPreviewCard } from './CheckpointPreviewCard'
import { ModuleArchitectureFlow } from './ModuleArchitectureFlow'

export interface PretrainingModuleCardProps {
  module: PretrainingModule
  isExpanded: boolean
  onToggle: () => void
  checklists?: Record<string, boolean>
  onToggleChecklist?: (taskId: string) => void
}

export function PretrainingModuleCard({
  module,
  isExpanded,
  onToggle,
  checklists = {},
  onToggleChecklist = () => {},
}: PretrainingModuleCardProps) {
  return (
    <section id={module.id} className="content-section">
      <div className={`module-card ${isExpanded ? 'active-module' : 'collapsed'}`}>
        <div
          className="module-header"
          role="button"
          tabIndex={0}
          aria-expanded={isExpanded}
          aria-controls={`module-body-${module.num}`}
          onClick={onToggle}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onToggle()
            }
          }}
        >
          <div className="module-header-main">
            <div className="module-icon-badge">{module.icon}</div>
            <div className="module-title-group">
              <h3>{module.title}</h3>
              <p>{module.subtitle}</p>
            </div>
          </div>
          <div className="module-header-meta">
            <span className={`badge badge-pill ${module.badgeClass}`}>
              {module.badgeLabel}
            </span>
            <span className="module-chevron" aria-hidden="true">
              ▼
            </span>
          </div>
        </div>

        <div id={`module-body-${module.num}`} className="module-body">
          {module.steps.map((step) => (
            <div key={step.nodeId} className="step-section">
              <div className="step-section-node">{step.nodeId}</div>
              <div className="step-section-title">
                <span>{step.title}</span>
                <span className={`badge badge-pill ${step.badgeClass || 'badge-neutral'}`}>
                  {step.badgeLabel}
                </span>
              </div>

              <p className="card-body">{step.description}</p>

              {step.command && (
                <CopyableCodeBlock
                  code={step.command}
                  language={step.commandLanguage || 'PowerShell'}
                  label={step.commandLanguage}
                />
              )}

              {step.outputBadge && (
                <div className="command-output-badge">
                  <span>{step.outputBadge.label}</span>{' '}
                  <code>{step.outputBadge.value}</code>
                </div>
              )}

              {step.externalLink && (
                <div style={{ margin: '0.5rem 0 1rem 0' }}>
                  <a
                    href={step.externalLink.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="external-link"
                    style={{ fontSize: 'var(--font-size-md)' }}
                  >
                    🔗 {step.externalLink.label}
                    <svg
                      className="external-link-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                  {step.externalLink.note && (
                    <div
                      className="link-security-note"
                      style={{ marginTop: '0.35rem' }}
                    >
                      <span>🛡️</span> {step.externalLink.note}
                    </div>
                  )}
                </div>
              )}

              {step.instructions && step.instructions.length > 0 && (
                <ol className="step-instruction-list">
                  {step.instructions.map((inst, idx) => (
                    <li key={idx} dangerouslySetInnerHTML={{ __html: inst }} />
                  ))}
                </ol>
              )}

              {step.comparisonGrid && (
                <div className="comparison-grid">
                  <div className="comparison-box">
                    <h5>{step.comparisonGrid.box1.title}</h5>
                    <div className="comparison-value">
                      {step.comparisonGrid.box1.value}
                    </div>
                    <p
                      style={{
                        fontSize: 'var(--font-size-xs)',
                        color: 'var(--text-muted)',
                        marginTop: '0.35rem',
                      }}
                    >
                      {step.comparisonGrid.box1.desc}
                    </p>
                  </div>
                  <div
                    className="comparison-box"
                    style={{
                      borderColor: 'var(--accent-primary)',
                      background: 'rgba(79, 70, 229, 0.05)',
                    }}
                  >
                    <h5>{step.comparisonGrid.box2.title}</h5>
                    <div className="comparison-value">
                      {step.comparisonGrid.box2.value}
                    </div>
                    <p
                      style={{
                        fontSize: 'var(--font-size-xs)',
                        color: 'var(--color-success-text)',
                        marginTop: '0.35rem',
                      }}
                    >
                      {step.comparisonGrid.box2.desc}
                    </p>
                  </div>
                </div>
              )}

              {step.alerts?.map((alert, aIdx) => (
                <div key={aIdx} className={`alert-box alert-${alert.type}`}>
                  <div className="alert-icon">{alert.icon}</div>
                  <div className="alert-content">
                    <h5>{alert.title}</h5>
                    {alert.content && <p>{alert.content}</p>}
                    {alert.bullets && alert.bullets.length > 0 && (
                      <ul style={{ margin: '0.35rem 0 0 1.25rem' }}>
                        {alert.bullets.map((b, bIdx) => (
                          <li key={bIdx} dangerouslySetInnerHTML={{ __html: b }} />
                        ))}
                      </ul>
                    )}
                    {alert.note && (
                      <p
                        style={{
                          marginTop: '0.5rem',
                          fontSize: 'var(--font-size-xs)',
                          color:
                            alert.type === 'danger'
                              ? 'var(--color-danger-text)'
                              : 'var(--text-secondary)',
                        }}
                        dangerouslySetInnerHTML={{ __html: alert.note }}
                      />
                    )}
                  </div>
                </div>
              ))}

              {step.taskId && step.checklistLabel && (
                <label className={`step-checklist-action ${checklists[step.taskId] ? 'completed' : ''}`}>
                  <input
                    type="checkbox"
                    className="checklist-checkbox"
                    data-task-id={step.taskId}
                    checked={!!checklists[step.taskId]}
                    onChange={() => onToggleChecklist(step.taskId!)}
                  />
                  <span className="checklist-label">{step.checklistLabel}</span>
                </label>
              )}
            </div>
          ))}

          {module.hasArchFlow && <ModuleArchitectureFlow />}
          {module.checkpoint && (
            <CheckpointPreviewCard checkpoint={module.checkpoint} />
          )}
        </div>
      </div>
    </section>
  )
}
