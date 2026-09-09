import { useState } from 'react'
import { PRETRAINING_MODULES } from '@/data/pretrainingModules'
import { PretrainingModuleCard } from './PretrainingModuleCard'
import { ToastContainer, showToast } from '@/components/ui/Toast'
import { usePretrainingState } from '@/hooks/usePretrainingState'

export function PretrainingModulesSection() {
  const { state, toggleChecklist } = usePretrainingState()
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    PRETRAINING_MODULES.forEach((mod) => {
      initial[mod.id] = true
    })
    return initial
  })

  const toggleModule = (id: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handleExpandAll = () => {
    const next: Record<string, boolean> = {}
    PRETRAINING_MODULES.forEach((mod) => {
      next[mod.id] = true
    })
    setExpandedModules(next)
    showToast('Semua modul dibuka 📖', 'info', 1800)
  }

  const handleCollapseAll = () => {
    const next: Record<string, boolean> = {}
    PRETRAINING_MODULES.forEach((mod) => {
      next[mod.id] = false
    })
    setExpandedModules(next)
    showToast('Semua modul disembunyikan 📁', 'info', 1800)
  }

  return (
    <div id="dynamic-modules-container">
      {/* Global Expand/Collapse Module Controls */}
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

      <ToastContainer />

      {PRETRAINING_MODULES.map((mod) => (
        <PretrainingModuleCard
          key={mod.id}
          module={mod}
          isExpanded={!!expandedModules[mod.id]}
          onToggle={() => toggleModule(mod.id)}
          checklists={state.checklists}
          onToggleChecklist={toggleChecklist}
        />
      ))}
    </div>
  )
}
