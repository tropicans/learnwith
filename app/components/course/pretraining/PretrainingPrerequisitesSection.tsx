import { useState, useEffect } from 'react'
import { PRETRAINING_PREREQUISITES } from '@/data/pretrainingFoundation'

const STORAGE_KEY = 'learnwith_ai_prereq'

export function PretrainingPrerequisitesSection() {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setCheckedItems(JSON.parse(stored))
      }
    } catch {
      // safe fallback
    }
  }, [])

  const handleToggle = (id: string) => {
    const updated = {
      ...checkedItems,
      [id]: !checkedItems[id],
    }
    setCheckedItems(updated)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch {
      // safe fallback
    }
  }

  const completedCount = PRETRAINING_PREREQUISITES.filter(
    (item) => checkedItems[item.id]
  ).length

  return (
    <section id="sec-prerequisites" className="content-section">
      <div className="section-header">
        <div className="section-title-wrap">
          <div className="section-badge-num">4</div>
          <div>
            <h3 className="section-title">Alat & Persiapan Perangkat</h3>
            <p className="section-desc">
              Daftar kelengkapan yang wajib Anda miliki sebelum memulai langkah instalasi.
            </p>
          </div>
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted, #64748b)' }}>
          {isClient ? `${completedCount}/${PRETRAINING_PREREQUISITES.length} Siap` : '7 Prasyarat'}
        </div>
      </div>

      <div className="card">
        <div className="checklist-group" id="prereq-checklist">
          {PRETRAINING_PREREQUISITES.map((item) => (
            <label key={item.id} className="checklist-item" style={{ cursor: 'pointer' }}>
              <input
                type="checkbox"
                className="checklist-checkbox"
                data-task-id={item.id}
                checked={isClient ? !!checkedItems[item.id] : false}
                onChange={() => handleToggle(item.id)}
              />
              <span className="checklist-label">{item.label}</span>
            </label>
          ))}
        </div>
      </div>
    </section>
  )
}
