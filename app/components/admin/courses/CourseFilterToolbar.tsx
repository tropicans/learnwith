import React from 'react'
import type { CourseLifecycleStatus } from '../../../schemas/courseLifecycle'

export type FilterStatusOption = 'all' | CourseLifecycleStatus

export interface CourseFilterToolbarProps {
  selectedStatus: FilterStatusOption
  onSelectStatus: (status: FilterStatusOption) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  counts: Record<FilterStatusOption, number>
}

interface FilterTabItem {
  id: FilterStatusOption
  label: string
  pillId: string
  badgeId: string
}

const FILTER_TABS: FilterTabItem[] = [
  { id: 'all', label: 'Semua', pillId: 'filter-pill-all', badgeId: 'badge-count-all' },
  { id: 'active', label: 'Aktif', pillId: 'filter-pill-active', badgeId: 'badge-count-active' },
  { id: 'hidden', label: 'Tersembunyi', pillId: 'filter-pill-hidden', badgeId: 'badge-count-hidden' },
  { id: 'archived', label: 'Diarsipkan', pillId: 'filter-pill-archived', badgeId: 'badge-count-archived' },
  { id: 'deleted', label: 'Dinonaktifkan', pillId: 'filter-pill-deleted', badgeId: 'badge-count-deleted' },
]

export function CourseFilterToolbar({
  selectedStatus,
  onSelectStatus,
  searchQuery,
  onSearchChange,
  counts,
}: CourseFilterToolbarProps) {
  return (
    <div className="course-filter-toolbar" id="course-filter-toolbar">
      {/* Status Filter Pills */}
      <div className="course-filter-pills" role="tablist" aria-label="Filter Status Kursus">
        {FILTER_TABS.map((tab) => {
          const isSelected = selectedStatus === tab.id
          const count = counts[tab.id] ?? 0
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              id={tab.pillId}
              className={`course-filter-pill ${isSelected ? 'is-active' : ''}`}
              onClick={() => onSelectStatus(tab.id)}
            >
              <span>{tab.label}</span>
              <span className="course-filter-count-badge" id={tab.badgeId}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Live Search Input */}
      <div className="course-search-box">
        <span className="search-icon" aria-hidden="true">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
        <input
          type="text"
          id="course-search-input"
          className="course-search-input"
          placeholder="Cari kursus berdasarkan judul atau ID..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Cari kursus berdasarkan judul atau ID"
        />
        {searchQuery.length > 0 && (
          <button
            type="button"
            className="search-clear-btn"
            id="btn-clear-course-search"
            onClick={() => onSearchChange('')}
            title="Bersihkan kata kunci pencarian"
            aria-label="Bersihkan kata kunci pencarian"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}
