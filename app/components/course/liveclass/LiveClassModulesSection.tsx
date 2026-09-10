import React, { useState, useEffect } from 'react'
import { LIVE_CLASS_MODULES, type LiveModule } from '@/data/liveClassModules'
import { CopyableCodeBlock } from '../pretraining/CopyableCodeBlock'
import { showToast } from '@/components/ui/Toast'

interface LiveClassModulesSectionProps {
  isUnlocked: boolean
  onOpenUnlockModal: () => void
}

export function LiveClassModulesSection({
  isUnlocked,
  onOpenUnlockModal,
}: LiveClassModulesSectionProps) {
  const storageKey = 'learnwith_ai_live_checklist_state'
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>({})

  // Module accordion expansion state
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    LIVE_CLASS_MODULES.forEach((mod) => {
      initial[mod.id] = true
    })
    return initial
  })

  // Hydrate checklist state safely from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        setCheckedTasks(JSON.parse(saved))
      }
    } catch {
      // Ignored if storage unavailable
    }
  }, [storageKey])

  const toggleChecklist = (taskId?: string) => {
    if (!taskId) return
    setCheckedTasks((prev) => {
      const next = { ...prev, [taskId]: !prev[taskId] }
      try {
        localStorage.setItem(storageKey, JSON.stringify(next))
        if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
          window.dispatchEvent(new CustomEvent('ai:liveStateChange'))
        }
      } catch {}
      return next
    })
  }

  const toggleModule = (id: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handleExpandAll = () => {
    const next: Record<string, boolean> = {}
    LIVE_CLASS_MODULES.forEach((mod) => {
      next[mod.id] = true
    })
    setExpandedModules(next)
    showToast('Semua modul Hari-H dibuka 📖', 'info', 1800)
  }

  const handleCollapseAll = () => {
    const next: Record<string, boolean> = {}
    LIVE_CLASS_MODULES.forEach((mod) => {
      next[mod.id] = false
    })
    setExpandedModules(next)
    showToast('Semua modul Hari-H disembunyikan 📁', 'info', 1800)
  }

  return (
    <section id="sec-live-modules" className="live-modules-section">
      <div className="live-section-header">
        <div className="live-section-title-group">
          <div className="live-section-icon" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
          </div>
          <div>
            <h2 className="live-section-title">Rangkaian Modul Praktik Hari-H (Hands-on Lab)</h2>
            <p className="live-section-desc">
              Panduan terminal langkah demi langkah dari Modul 6 hingga Modul 11. Lengkapi setiap checkpoint
              untuk membuktikan keberhasilan operasional agen otonom.
            </p>
          </div>
        </div>

        <div className="live-modules-controls">
          <button
            type="button"
            className="btn btn-sm btn-outline"
            onClick={handleExpandAll}
            title="Buka semua panduan modul"
          >
            <span>Buka Semua</span>
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline"
            onClick={handleCollapseAll}
            title="Tutup semua panduan modul"
          >
            <span>Tutup Semua</span>
          </button>
        </div>
      </div>

      <div className="live-modules-list">
        {LIVE_CLASS_MODULES.map((module: LiveModule) => {
          const isExpanded = Boolean(expandedModules[module.id])
          const completedStepsCount = module.steps.filter((s) => s.taskId && checkedTasks[s.taskId]).length
          const totalStepsCount = module.steps.length
          const isAllStepsDone = totalStepsCount > 0 && completedStepsCount === totalStepsCount

          return (
            <article
              key={module.id}
              id={module.id}
              className={`live-module-card ${isExpanded ? 'is-expanded' : 'is-collapsed'} ${
                isAllStepsDone ? 'is-completed' : ''
              }`}
            >
              {/* Module Card Header */}
              <header
                className="live-module-header"
                role="button"
                tabIndex={0}
                aria-expanded={isExpanded}
                onClick={() => toggleModule(module.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    toggleModule(module.id)
                  }
                }}
              >
                <div className="live-module-header-left">
                  <div className="live-module-icon-pill">
                    <span>{module.icon}</span>
                  </div>
                  <div className="live-module-titles">
                    <div className="live-module-meta-row">
                      <span className={`badge badge-pill ${module.badgeClass}`}>
                        {module.badgeLabel}
                      </span>
                      <span className="live-time-chip">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        <span>{module.estimatedMinutes} menit</span>
                      </span>
                      {isUnlocked && (
                        <span className={`live-progress-chip ${isAllStepsDone ? 'chip-success' : ''}`}>
                          {completedStepsCount}/{totalStepsCount} Tugas Selesai
                        </span>
                      )}
                    </div>
                    <h3 className="live-module-title">{module.title}</h3>
                    <p className="live-module-subtitle">{module.subtitle}</p>
                  </div>
                </div>

                <div className="live-module-header-right">
                  <button
                    type="button"
                    className="live-chevron-btn"
                    aria-label={isExpanded ? 'Tutup modul' : 'Buka modul'}
                    tabIndex={-1}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                      }}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                </div>
              </header>

              {/* Module Card Body */}
              {isExpanded && (
                <div className="live-module-body">
                  {isUnlocked ? (
                    <>
                      {/* Checkpoint Target Callout */}
                      <div className="live-checkpoint-callout">
                        <div className="checkpoint-callout-icon" aria-hidden="true">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <circle cx="12" cy="12" r="6" />
                            <circle cx="12" cy="12" r="2" />
                          </svg>
                        </div>
                        <div className="checkpoint-callout-text">
                          <strong>{module.checkpointTitle}</strong>
                          <p>{module.checkpointDescription}</p>
                        </div>
                      </div>

                      {/* Interactive Step Items */}
                      <div className="live-steps-container">
                        {module.steps.map((step, stepIdx) => {
                          const isChecked = step.taskId ? Boolean(checkedTasks[step.taskId]) : false

                          return (
                            <div key={step.nodeId || stepIdx} className={`live-step-item ${isChecked ? 'step-checked' : ''}`}>
                              <div className="live-step-header">
                                <div className="live-step-node-badge">{step.nodeId}</div>
                                <div className="live-step-title-group">
                                  <h4 className="live-step-title">{step.title}</h4>
                                  {step.badgeLabel && (
                                    <span className={`badge badge-pill ${step.badgeClass || 'badge-neutral'}`}>
                                      {step.badgeLabel}
                                    </span>
                                  )}
                                </div>

                                {step.taskId && (
                                  <label className="live-step-check-label" title="Tandai tugas telah dikerjakan">
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={() => toggleChecklist(step.taskId)}
                                      className="live-step-checkbox"
                                    />
                                    <span>Selesai</span>
                                  </label>
                                )}
                              </div>

                              <p className="live-step-desc">{step.description}</p>

                              {step.instructions && step.instructions.length > 0 && (
                                <ul className="live-step-instructions">
                                  {step.instructions.map((inst, idx) => (
                                    <li key={idx}>
                                      <span className="inst-bullet">•</span>
                                      <span>{inst}</span>
                                    </li>
                                  ))}
                                </ul>
                              )}

                              {step.command && (
                                <CopyableCodeBlock
                                  code={step.command}
                                  language={step.commandLanguage || 'PowerShell'}
                                  label={step.commandLanguage || 'PowerShell'}
                                />
                              )}

                              {step.outputBadge && (
                                <div className="live-output-badge">
                                  <span className="output-label">{step.outputBadge.label}</span>
                                  <code className="output-value">{step.outputBadge.value}</code>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </>
                  ) : (
                    /* Locked Teaser State */
                    <div className="live-module-locked-teaser">
                      <div className="locked-teaser-icon" aria-hidden="true">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                      </div>
                      <div className="locked-teaser-content">
                        <h4>Instruksi Interaktif Modul {module.num} Terkunci</h4>
                        <p>
                          Objektif modul ini adalah {module.subtitle.toLowerCase()}. Buka kunci akses
                          dengan passkey instruktur kelas untuk melihat perintah terminal dan alur kerja lengkap.
                        </p>
                        <div className="locked-teaser-steps-preview">
                          <span className="preview-label">Langkah yang akan dipelajari:</span>
                          <div className="preview-tags-row">
                            {module.steps.map((s) => (
                              <span key={s.nodeId} className="preview-step-pill">
                                <strong>{s.nodeId}</strong>: {s.title}
                              </span>
                            ))}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={onOpenUnlockModal}
                          className="btn btn-primary btn-sm locked-teaser-btn"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="m21 2-2 2m-1.5 1.5L14 9a5 5 0 1 0 3 3l3.5-3.5" />
                            <circle cx="7.5" cy="16.5" r="2.5" />
                          </svg>
                          <span>Buka Akses Hari-H</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </article>
          )
        })}
      </div>
    </section>
  )
}