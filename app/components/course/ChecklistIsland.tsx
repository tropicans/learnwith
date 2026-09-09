import React, { useState, useEffect } from 'react'
import { ClientOnly } from '@tanstack/react-router'
import { ChecklistSkeleton } from '@/components/ui/Skeleton'
import type { CourseModule } from '@/data/courses'

interface ChecklistIslandProps {
  courseId: string
  modules: CourseModule[]
}

interface InteractiveChecklistProps {
  courseId: string
  modules: CourseModule[]
}

function InteractiveChecklist({ courseId, modules }: InteractiveChecklistProps) {
  const storageKey = `learnwith_${courseId}_checklist_state`
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})
  const [isLoaded, setIsLoaded] = useState(false)

  // Read saved checklist state safely on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        setCheckedItems(JSON.parse(saved))
      }
    } catch {
      // localStorage disabled or blocked
    }
    setIsLoaded(true)
  }, [storageKey])

  const toggleItem = (itemId: string) => {
    setCheckedItems((prev) => {
      const next = { ...prev, [itemId]: !prev[itemId] }
      try {
        localStorage.setItem(storageKey, JSON.stringify(next))
        if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function' && typeof CustomEvent !== 'undefined') {
          window.dispatchEvent(new CustomEvent(`${courseId}:stateChange`))
        }
      } catch {
        // quota exceeded or blocked
      }
      return next
    })
  }

  const allItems = modules.flatMap((m) => [
    { id: `${m.id}-overview`, label: `Tinjau materi & objektif: ${m.title}`, moduleNum: m.num },
    ...(m.checkpoints || []).map((cp, idx) => ({
      id: `${m.id}-cp-${idx}`,
      label: `Checkpoint Praktik: ${cp}`,
      moduleNum: m.num,
    })),
  ])

  const totalCount = allItems.length
  const completedCount = allItems.filter((item) => checkedItems[item.id]).length
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <div className="checklist-island card" id={`checklist-island-${courseId}`}>
      <div className="checklist-island-header">
        <div>
          <h3 className="card-title">
            <span>✅</span> Lembar Checklist & Progres Mandiri
          </h3>
          <p className="card-subtitle">
            Centang tugas yang telah Anda selesaikan. Progres tersimpan otomatis di browser Anda.
          </p>
        </div>
        <div className="checklist-progress-badge">
          <span className="badge badge-pill badge-primary">
            {completedCount}/{totalCount} Selesai ({progressPercent}%)
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div
        className="checklist-progress-track"
        style={{
          height: '8px',
          backgroundColor: 'var(--border-subtle, #e0e0e0)',
          borderRadius: '4px',
          overflow: 'hidden',
          margin: '1rem 0 1.25rem 0',
        }}
      >
        <div
          className="checklist-progress-fill"
          style={{
            height: '100%',
            width: `${progressPercent}%`,
            backgroundColor: 'var(--color-primary, #1a73e8)',
            transition: 'width 0.3s ease',
          }}
        />
      </div>

      <div className="checklist-items-grid" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {allItems.map((item) => {
          const isChecked = !!checkedItems[item.id]
          return (
            <label
              key={item.id}
              className={`checklist-item-row ${isChecked ? 'item-completed' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.9rem',
                borderRadius: 'var(--radius-sm, 6px)',
                backgroundColor: isChecked ? 'var(--color-success-bg, rgba(52, 168, 83, 0.08))' : 'var(--bg-muted, rgba(0, 0, 0, 0.02))',
                border: `1px solid ${isChecked ? 'var(--color-success-border, rgba(52, 168, 83, 0.3))' : 'var(--border-subtle, #e8e8e8)'}`,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => toggleItem(item.id)}
                className="checklist-native-checkbox"
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <span
                style={{
                  flex: 1,
                  fontSize: '0.9rem',
                  color: isChecked ? 'var(--text-muted, #5f6368)' : 'var(--text-primary, #202124)',
                  textDecoration: isChecked ? 'line-through' : 'none',
                }}
              >
                {item.label}
              </span>
              <span
                className="badge badge-sm"
                style={{ fontSize: '0.75rem', opacity: 0.8 }}
              >
                Modul {item.moduleNum}
              </span>
            </label>
          )
        })}
      </div>
    </div>
  )
}

/**
 * Hydration-Safe Checklist Island (SSR-04)
 * Uses <ClientOnly fallback={<ChecklistSkeleton />}> to guarantee zero hydration mismatch
 */
export function ChecklistIsland({ courseId, modules }: ChecklistIslandProps) {
  return (
    <ClientOnly fallback={<ChecklistSkeleton count={4} />}>
      <InteractiveChecklist courseId={courseId} modules={modules} />
    </ClientOnly>
  )
}
export default ChecklistIsland
