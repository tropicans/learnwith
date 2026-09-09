import React, { useState } from 'react'
import type { PasskeyUnlockAttempt, CourseId } from '../../../schemas/passkey'

interface PasskeyAuditLogTableProps {
  attempts: PasskeyUnlockAttempt[]
  isLoading?: boolean
}

type StatusFilter = 'all' | 'success' | 'failed' | 'rate_limited'

export function PasskeyAuditLogTable({ attempts, isLoading = false }: PasskeyAuditLogTableProps) {
  const [courseFilter, setCourseFilter] = useState<'all' | CourseId>('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const formatDate = (timestamp: number) => {
    try {
      return new Date(timestamp).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    } catch {
      return '-'
    }
  }

  const filteredAttempts = attempts.filter((attempt) => {
    if (courseFilter !== 'all' && attempt.courseId !== courseFilter) {
      return false
    }
    if (statusFilter !== 'all') {
      if (statusFilter === 'success' && !attempt.success) return false
      if (statusFilter === 'failed' && (attempt.success || attempt.rateLimited)) return false
      if (statusFilter === 'rate_limited' && !attempt.rateLimited) return false
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      const matchesClient = attempt.clientId.toLowerCase().includes(q)
      const matchesHash = attempt.attemptHashPrefix.toLowerCase().includes(q)
      const matchesReason = attempt.failureReason?.toLowerCase().includes(q)
      if (!matchesClient && !matchesHash && !matchesReason) {
        return false
      }
    }
    return true
  })

  const resetFilters = () => {
    setCourseFilter('all')
    setStatusFilter('all')
    setSearchQuery('')
  }

  const hasActiveFilters = courseFilter !== 'all' || statusFilter !== 'all' || searchQuery.trim() !== ''

  return (
    <div className="admin-passkey-audit-section" id="admin-passkey-audit-section">
      <div className="admin-section-header">
        <div className="admin-section-title-group">
          <h3 className="admin-section-title">
            <span>🛡️</span> Log Audit Percobaan Unlock Passkey
          </h3>
          <span className="admin-section-badge">
            {filteredAttempts.length} dari {attempts.length} Percobaan
          </span>
        </div>
        <p className="admin-section-desc">
          Audit real-time unlock modul dinas dengan masking SHA-256 (prefix 8 hex) dan deteksi pencegahan brute-force (ADMIN-PASS-03).
        </p>
      </div>

      {/* Toolbar Filter */}
      <div className="admin-audit-toolbar">
        <div className="audit-filter-row">
          <div className="audit-filter-group">
            <span className="filter-group-label">Status:</span>
            <div className="filter-pill-group">
              <button
                type="button"
                className={`filter-pill ${statusFilter === 'all' ? 'active' : ''}`}
                onClick={() => setStatusFilter('all')}
              >
                Semua
              </button>
              <button
                type="button"
                className={`filter-pill ${statusFilter === 'success' ? 'active' : ''}`}
                onClick={() => setStatusFilter('success')}
              >
                Berhasil
              </button>
              <button
                type="button"
                className={`filter-pill ${statusFilter === 'failed' ? 'active' : ''}`}
                onClick={() => setStatusFilter('failed')}
              >
                Gagal
              </button>
              <button
                type="button"
                className={`filter-pill ${statusFilter === 'rate_limited' ? 'active' : ''}`}
                onClick={() => setStatusFilter('rate_limited')}
              >
                Rate Limited ⚠️
              </button>
            </div>
          </div>

          <div className="audit-filter-group">
            <span className="filter-group-label">Kursus:</span>
            <div className="filter-pill-group">
              <button
                type="button"
                className={`filter-pill ${courseFilter === 'all' ? 'active' : ''}`}
                onClick={() => setCourseFilter('all')}
              >
                Semua
              </button>
              <button
                type="button"
                className={`filter-pill ${courseFilter === 'word' ? 'active' : ''}`}
                onClick={() => setCourseFilter('word')}
              >
                📝 Word
              </button>
              <button
                type="button"
                className={`filter-pill ${courseFilter === 'ai' ? 'active' : ''}`}
                onClick={() => setCourseFilter('ai')}
              >
                🤖 AI
              </button>
            </div>
          </div>
        </div>

        <div className="audit-search-row">
          <div className="audit-search-input-wrapper">
            <span className="search-icon" aria-hidden="true">🔍</span>
            <input
              type="text"
              className="audit-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berdasarkan Client ID atau Prefix Hash..."
              aria-label="Cari log audit"
            />
            {searchQuery && (
              <button
                type="button"
                className="btn-clear-search"
                onClick={() => setSearchQuery('')}
                title="Hapus pencarian"
              >
                ✕
              </button>
            )}
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              className="btn-reset-filters"
              onClick={resetFilters}
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="admin-table-container">
        <table className="admin-table" aria-label="Tabel Log Audit Percobaan Unlock">
          <thead>
            <tr>
              <th scope="col" style={{ width: '160px' }}>Waktu</th>
              <th scope="col" style={{ width: '130px' }}>Modul</th>
              <th scope="col">Client ID</th>
              <th scope="col">Hash Prefix (8 char)</th>
              <th scope="col" style={{ width: '140px' }}>Hasil</th>
              <th scope="col">Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && attempts.length === 0 ? (
              <tr>
                <td colSpan={6} className="table-loading-cell">
                  <div className="table-loading-spinner">
                    <span className="spinner-sm" aria-hidden="true" />
                    <span>Memuat log audit passkey...</span>
                  </div>
                </td>
              </tr>
            ) : filteredAttempts.length === 0 ? (
              <tr>
                <td colSpan={6} className="table-empty-cell">
                  {hasActiveFilters
                    ? 'Tidak ada log audit yang cocok dengan filter yang dipilih.'
                    : 'Belum ada catatan percobaan unlock passkey.'}
                </td>
              </tr>
            ) : (
              filteredAttempts.map((attempt) => {
                const isWord = attempt.courseId === 'word'
                const isSuccess = attempt.success
                const isRateLimited = attempt.rateLimited

                return (
                  <tr key={attempt.id} id={`audit-row-${attempt.id}`}>
                    <td className="table-time-cell">
                      {formatDate(attempt.timestamp)}
                    </td>
                    <td>
                      <span className={`passkey-course-pill ${isWord ? 'pill-word' : 'pill-ai'}`}>
                        {isWord ? '📝 Word ASN' : '🤖 AI Workshop'}
                      </span>
                    </td>
                    <td>
                      <code className="passkey-client-id-code">
                        {attempt.clientId}
                      </code>
                    </td>
                    <td>
                      <code className="passkey-hash-prefix-code">
                        {attempt.attemptHashPrefix}…
                      </code>
                    </td>
                    <td>
                      {isRateLimited ? (
                        <span className="status-badge-rate-limited">
                          Rate Limited ⚠️
                        </span>
                      ) : isSuccess ? (
                        <span className="status-badge-success">
                          ✓ Berhasil
                        </span>
                      ) : (
                        <span className="status-badge-failed">
                          ✕ Gagal
                        </span>
                      )}
                    </td>
                    <td className="table-reason-cell">
                      {attempt.failureReason || (isSuccess ? 'Verifikasi sukses' : '-')}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
