import React from 'react'

export interface ParticipantFilterToolbarProps {
  courseFilter: 'all' | 'ai' | 'word'
  readinessFilter: 'all' | 'ready' | 'clinic' | 'pending'
  searchQuery: string
  totalCount: number
  filteredCount: number
  autoRefresh: boolean
  isRefreshing: boolean
  onCourseChange: (val: 'all' | 'ai' | 'word') => void
  onReadinessChange: (val: 'all' | 'ready' | 'clinic' | 'pending') => void
  onSearchChange: (val: string) => void
  onToggleAutoRefresh: () => void
  onManualRefresh: () => void
}

export function ParticipantFilterToolbar({
  courseFilter,
  readinessFilter,
  searchQuery,
  totalCount,
  filteredCount,
  autoRefresh,
  isRefreshing,
  onCourseChange,
  onReadinessChange,
  onSearchChange,
  onToggleAutoRefresh,
  onManualRefresh,
}: ParticipantFilterToolbarProps) {
  return (
    <div className="admin-toolbar" role="search" aria-label="Penyaringan dan Pencarian Peserta">
      <div className="admin-toolbar-row admin-toolbar-filters">
        {/* Course Filter Pills */}
        <div className="admin-filter-group" role="group" aria-label="Filter berdasarkan kursus">
          <span className="admin-filter-label">Kursus:</span>
          <div className="admin-pill-group">
            <button
              type="button"
              id="filter-course-all"
              className={`admin-filter-pill ${courseFilter === 'all' ? 'active' : ''}`}
              onClick={() => onCourseChange('all')}
            >
              Semua Kursus
            </button>
            <button
              type="button"
              id="filter-course-ai"
              className={`admin-filter-pill ${courseFilter === 'ai' ? 'active' : ''}`}
              onClick={() => onCourseChange('ai')}
            >
              🤖 AI Agent
            </button>
            <button
              type="button"
              id="filter-course-word"
              className={`admin-filter-pill ${courseFilter === 'word' ? 'active' : ''}`}
              onClick={() => onCourseChange('word')}
            >
              📝 Word ASN
            </button>
          </div>
        </div>

        {/* Readiness Filter Pills */}
        <div className="admin-filter-group" role="group" aria-label="Filter berdasarkan kesiapan">
          <span className="admin-filter-label">Kesiapan:</span>
          <div className="admin-pill-group">
            <button
              type="button"
              id="filter-readiness-all"
              className={`admin-filter-pill ${readinessFilter === 'all' ? 'active' : ''}`}
              onClick={() => onReadinessChange('all')}
            >
              Semua Status
            </button>
            <button
              type="button"
              id="filter-readiness-ready"
              className={`admin-filter-pill pill-ready ${readinessFilter === 'ready' ? 'active' : ''}`}
              onClick={() => onReadinessChange('ready')}
            >
              ✅ Siap Workshop
            </button>
            <button
              type="button"
              id="filter-readiness-clinic"
              className={`admin-filter-pill pill-clinic ${readinessFilter === 'clinic' ? 'active' : ''}`}
              onClick={() => onReadinessChange('clinic')}
            >
              🚨 Perlu Klinik
            </button>
            <button
              type="button"
              id="filter-readiness-pending"
              className={`admin-filter-pill pill-pending ${readinessFilter === 'pending' ? 'active' : ''}`}
              onClick={() => onReadinessChange('pending')}
            >
              ⏳ Berprogres
            </button>
          </div>
        </div>
      </div>

      <div className="admin-toolbar-row admin-toolbar-actions">
        {/* Search Input Box */}
        <div className="admin-search-wrapper">
          <span className="admin-search-icon" aria-hidden="true">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="text"
            id="admin-search-input"
            className="admin-search-input"
            placeholder="Cari nama peserta, instansi, atau ID..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Cari nama peserta, instansi, atau ID"
          />
          {searchQuery && (
            <button
              type="button"
              id="btn-clear-search"
              className="admin-search-clear"
              onClick={() => onSearchChange('')}
              title="Bersihkan pencarian"
              aria-label="Bersihkan pencarian"
            >
              ✕
            </button>
          )}
        </div>

        {/* Counter Badge & Refresh Controls */}
        <div className="admin-toolbar-controls">
          <span className="admin-count-badge" id="participant-count-badge">
            Menampilkan <strong>{filteredCount}</strong> dari {totalCount} peserta
          </span>

          <button
            type="button"
            id="btn-toggle-auto-refresh"
            className={`admin-refresh-btn ${autoRefresh ? 'active' : ''}`}
            onClick={onToggleAutoRefresh}
            title={autoRefresh ? 'Matikan pembaruan otomatis (15s)' : 'Aktifkan pembaruan otomatis (15s)'}
          >
            <span
              className={`admin-status-dot ${autoRefresh ? 'dot-active' : 'dot-idle'}`}
              aria-hidden="true"
            />
            <span>{autoRefresh ? 'Auto (15s)' : 'Auto Off'}</span>
          </button>

          <button
            type="button"
            id="btn-manual-refresh"
            className="admin-refresh-btn admin-btn-action"
            onClick={onManualRefresh}
            disabled={isRefreshing}
            title="Segarkan data sekarang"
          >
            <svg
              className={`refresh-icon ${isRefreshing ? 'spin' : ''}`}
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M23 4v6h-6" />
              <path d="M1 20v-6h6" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            <span>{isRefreshing ? 'Memuat...' : 'Segarkan'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
