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

  // Module accordion expansion state (default all open)
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
    <section id="sec-live-modules" className="content-section">
      <div className="section-header">
        <div className="section-title-wrap">
          <div
            className="section-badge-icon"
            style={{
              background: 'rgba(52, 211, 153, 0.12)',
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
            ⚡
          </div>
          <div>
            <h3 className="section-title">Rangkaian Modul Praktik Hari-H (M6 s.d. M11)</h3>
            <p className="section-desc">
              Panduan terminal langkah demi langkah dari arsitektur router hingga otomasi kalender dinas.
            </p>
          </div>
        </div>

        {/* Global Expand/Collapse Module Controls matching Pra-Training */}
        <div className="module-controls">
          <button
            id="btn-expand-all-modules"
            className="btn btn-sm btn-outline"
            onClick={handleExpandAll}
            type="button"
          >
            <span>📖</span> Buka Semua Modul
          </button>
          <button
            id="btn-collapse-all-modules"
            className="btn btn-sm btn-outline"
            onClick={handleCollapseAll}
            type="button"
          >
            <span>📁</span> Tutup Semua Modul
          </button>
        </div>
      </div>

      <div id="dynamic-modules-container">
        {LIVE_CLASS_MODULES.map((module: LiveModule) => {
          const isExpanded = Boolean(expandedModules[module.id])
          const completedStepsCount = module.steps.filter((s) => s.taskId && checkedTasks[s.taskId]).length
          const totalStepsCount = module.steps.length
          const isAllStepsDone = totalStepsCount > 0 && completedStepsCount === totalStepsCount

          return (
            <div
              key={module.id}
              id={module.id}
              className={`module-card ${isExpanded ? 'active-module' : 'collapsed'}`}
            >
              {/* Module Card Header matching Pra-Training */}
              <div
                className="module-header"
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
                <div className="module-header-main">
                  <div className="module-icon-badge">{module.icon}</div>
                  <div className="module-title-group">
                    <h3>
                      {module.title}
                      {isAllStepsDone && <span style={{ color: 'var(--color-success)', fontSize: '1rem' }}>✓</span>}
                    </h3>
                    <p>{module.subtitle}</p>
                  </div>
                </div>

                <div className="module-header-meta">
                  <span className={`badge badge-pill ${module.badgeClass}`}>
                    {module.badgeLabel}
                  </span>
                  <span className="badge badge-pill badge-neutral">
                    ⏱️ {module.estimatedMinutes} menit
                  </span>
                  {isUnlocked && (
                    <span className={`badge badge-pill ${isAllStepsDone ? 'badge-success' : 'badge-neutral'}`}>
                      {completedStepsCount}/{totalStepsCount} Tugas
                    </span>
                  )}
                  <span className="module-chevron" aria-hidden="true">
                    ▼
                  </span>
                </div>
              </div>

              {/* Module Body */}
              <div className="module-body">
                {!isUnlocked && (
                  <div className="alert-box alert-warning" style={{ margin: '0 0 1.25rem 0' }}>
                    <div className="alert-icon">🔒</div>
                    <div className="alert-content">
                      <h5>Materi Praktik Dilindungi Passkey Instruktur</h5>
                      <p>
                        Instruksi kode terminal PowerShell dan checklist mandiri untuk {module.title} terlindungi.
                        Buka sesi menggunakan passkey kelas untuk mengeksekusi langkah-langkah di bawah ini.
                      </p>
                      <button
                        type="button"
                        className="btn btn-sm btn-primary"
                        onClick={onOpenUnlockModal}
                        style={{ marginTop: '0.6rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                      >
                        <span>🔒</span> Buka Akses Instruktur
                      </button>
                    </div>
                  </div>
                )}

                {/* Steps Section */}
                {module.steps.map((step) => {
                  const isTaskDone = Boolean(step.taskId && checkedTasks[step.taskId])

                  return (
                    <div key={step.nodeId} className="step-section">
                      <div className="step-section-node">{step.nodeId}</div>
                      <div className="step-section-title">
                        <span>{step.title}</span>
                        <span className={`badge badge-pill ${step.badgeClass || 'badge-neutral'}`}>
                          {step.badgeLabel}
                        </span>
                      </div>

                      <p className="card-body" style={{ margin: '0.5rem 0' }}>
                        {step.description}
                      </p>

                      {step.command && (
                        <div style={{ margin: '0.75rem 0' }}>
                          {isUnlocked ? (
                            <CopyableCodeBlock
                              code={step.command}
                              language={step.commandLanguage || 'PowerShell'}
                              label={step.commandLanguage || 'PowerShell'}
                            />
                          ) : (
                            <div
                              style={{
                                padding: '0.85rem 1rem',
                                background: 'var(--bg-surface-subtle)',
                                border: '1px dashed var(--border-subtle)',
                                borderRadius: 'var(--radius-md)',
                                color: 'var(--text-muted)',
                                fontSize: 'var(--font-size-sm)',
                                fontFamily: 'var(--font-family-mono, monospace)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                              }}
                            >
                              <span>🔒</span> Perintah CLI tersembunyi — Masukkan passkey instruktur untuk membuka
                            </div>
                          )}
                        </div>
                      )}

                      {step.outputBadge && (
                        <div className="command-output-badge" style={{ marginTop: '0.5rem' }}>
                          <span>{step.outputBadge.label}</span> <code>{step.outputBadge.value}</code>
                        </div>
                      )}

                      {step.taskId && isUnlocked && (
                        <div className="checklist-group" style={{ marginTop: '0.85rem' }}>
                          <label
                            className="checklist-item"
                            style={{
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.65rem',
                              padding: '0.5rem 0.75rem',
                              background: isTaskDone ? 'rgba(52, 211, 153, 0.08)' : 'transparent',
                              borderRadius: 'var(--radius-sm)',
                              border: isTaskDone ? '1px solid rgba(52, 211, 153, 0.25)' : '1px solid transparent',
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={isTaskDone}
                              onChange={() => toggleChecklist(step.taskId)}
                              style={{ width: '17px', height: '17px', cursor: 'pointer', accentColor: 'var(--accent-primary)' }}
                            />
                            <span className="checklist-label" style={{ fontSize: 'var(--font-size-sm)' }}>
                              <strong>Tugas Mandiri:</strong> Verifikasi langkah {step.nodeId} berhasil dieksekusi di Windows PowerShell
                            </span>
                          </label>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}