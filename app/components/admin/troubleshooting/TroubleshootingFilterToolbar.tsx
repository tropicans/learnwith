import React from 'react'
import type { TroubleshootingFilter } from '../../../schemas/troubleshooting'

interface TroubleshootingFilterToolbarProps {
  filter: TroubleshootingFilter
  onFilterChange: (newFilter: TroubleshootingFilter) => void
  onRefresh: () => void
  isAutoRefresh: boolean
  onToggleAutoRefresh: () => void
  isLoading?: boolean
}

export function TroubleshootingFilterToolbar({
  filter,
  onFilterChange,
  onRefresh,
  isAutoRefresh,
  onToggleAutoRefresh,
  isLoading = false,
}: TroubleshootingFilterToolbarProps) {
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filter,
      category: e.target.value as any,
    })
  }

  const handleStatusChange = (status: 'all' | 'open' | 'investigating' | 'resolved') => {
    onFilterChange({
      ...filter,
      status,
    })
  }

  const handleCourseChange = (courseId: 'all' | 'ai' | 'word') => {
    onFilterChange({
      ...filter,
      courseId,
    })
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filter,
      search: e.target.value,
    })
  }

  const handleClearSearch = () => {
    onFilterChange({
      ...filter,
      search: '',
    })
  }

  return (
    <div className="admin-audit-filters troubleshoot-filter-toolbar" id="troubleshoot-filter-toolbar">
      {/* Top row: search & refresh actions */}
      <div className="admin-audit-filter-row" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Search input with clear */}
        <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: '420px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Cari error, peserta, langkah, atau catatan..."
            value={filter.search || ''}
            onChange={handleSearchChange}
            id="input-troubleshoot-search"
            style={{
              paddingLeft: '2.2rem',
              paddingRight: filter.search ? '2rem' : '0.75rem',
              fontSize: 'var(--font-size-sm)',
            }}
          />
          <span
            style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              opacity: 0.6,
              pointerEvents: 'none',
            }}
          >
            🔍
          </span>
          {filter.search && (
            <button
              type="button"
              onClick={handleClearSearch}
              id="btn-clear-search"
              aria-label="Hapus pencarian"
              style={{
                position: 'absolute',
                right: '0.6rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                opacity: 0.6,
                fontSize: '0.85rem',
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Category selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label htmlFor="select-troubleshoot-category" style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Kategori:
          </label>
          <select
            id="select-troubleshoot-category"
            className="form-input"
            value={filter.category}
            onChange={handleCategoryChange}
            style={{ fontSize: 'var(--font-size-xs)', padding: '0.4rem 0.75rem', width: 'auto' }}
          >
            <option value="all">Semua Kategori</option>
            <option value="port_conflict">⚡ Port 20128 Conflict</option>
            <option value="powershell_policy">🛡️ PowerShell Execution Policy</option>
            <option value="oauth_api_key">🔑 OAuth & API Key Error</option>
            <option value="telegram_conflict">🤖 Telegram 409 Conflict</option>
            <option value="permissions_eperm">🛑 Hak Akses (EPERM)</option>
            <option value="network_runtime">🌐 Network / Timeout</option>
            <option value="other">📦 Lainnya</option>
          </select>
        </div>

        {/* Refresh & Auto-refresh Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            type="button"
            className={`btn-admin-filter ${isAutoRefresh ? 'active' : ''}`}
            onClick={onToggleAutoRefresh}
            id="btn-toggle-autorefresh"
            title="Auto-refresh setiap 15 detik"
            style={{ fontSize: 'var(--font-size-xs)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <span
              style={{
                display: 'inline-block',
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: isAutoRefresh ? '#10b981' : '#9ca3af',
              }}
            />
            <span>{isAutoRefresh ? 'Auto-Sync (15s)' : 'Auto-Sync Nonaktif'}</span>
          </button>

          <button
            type="button"
            className="btn-admin-refresh"
            onClick={onRefresh}
            disabled={isLoading}
            id="btn-refresh-troubleshoot"
            title="Muat ulang log kendala sekarang"
          >
            <span className={isLoading ? 'spinning' : ''}>🔄</span>
            <span>{isLoading ? 'Memuat...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Second row: Status & Course filter pills */}
      <div
        className="admin-audit-filter-row"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          marginTop: '0.75rem',
          paddingTop: '0.5rem',
          borderTop: '1px dashed var(--border-color, #e5e7eb)',
        }}
      >
        {/* Status Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--text-secondary)', marginRight: '0.25rem' }}>
            Status:
          </span>
          <button
            type="button"
            className={`btn-admin-filter ${filter.status === 'all' ? 'active' : ''}`}
            onClick={() => handleStatusChange('all')}
            id="btn-status-all"
          >
            Semua
          </button>
          <button
            type="button"
            className={`btn-admin-filter ${filter.status === 'open' ? 'active' : ''}`}
            onClick={() => handleStatusChange('open')}
            id="btn-status-open"
            style={{ color: filter.status === 'open' ? undefined : '#ef4444' }}
          >
            🔴 Open
          </button>
          <button
            type="button"
            className={`btn-admin-filter ${filter.status === 'investigating' ? 'active' : ''}`}
            onClick={() => handleStatusChange('investigating')}
            id="btn-status-investigating"
            style={{ color: filter.status === 'investigating' ? undefined : '#f59e0b' }}
          >
            🟡 Investigating
          </button>
          <button
            type="button"
            className={`btn-admin-filter ${filter.status === 'resolved' ? 'active' : ''}`}
            onClick={() => handleStatusChange('resolved')}
            id="btn-status-resolved"
            style={{ color: filter.status === 'resolved' ? undefined : '#10b981' }}
          >
            🟢 Resolved
          </button>
        </div>

        {/* Course Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--text-secondary)', marginRight: '0.25rem' }}>
            Modul:
          </span>
          <button
            type="button"
            className={`btn-admin-filter ${filter.courseId === 'all' ? 'active' : ''}`}
            onClick={() => handleCourseChange('all')}
            id="btn-course-all"
          >
            Semua Modul
          </button>
          <button
            type="button"
            className={`btn-admin-filter ${filter.courseId === 'ai' ? 'active' : ''}`}
            onClick={() => handleCourseChange('ai')}
            id="btn-course-ai"
          >
            🤖 AI
          </button>
          <button
            type="button"
            className={`btn-admin-filter ${filter.courseId === 'word' ? 'active' : ''}`}
            onClick={() => handleCourseChange('word')}
            id="btn-course-word"
          >
            📝 Word
          </button>
        </div>
      </div>
    </div>
  )
}
