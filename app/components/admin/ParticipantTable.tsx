import React from 'react'
import type { ParticipantRecord } from '../../schemas/telemetry'

export interface ParticipantTableProps {
  participants: ParticipantRecord[]
  isLoading?: boolean
  onInspectParticipant: (participant: ParticipantRecord) => void
  sortBy: string
  sortOrder: 'asc' | 'desc'
  onSort: (column: string) => void
}

function formatRelativeTime(timestamp: number): string {
  try {
    const diffMs = Date.now() - timestamp
    const diffSec = Math.floor(diffMs / 1000)
    const diffMin = Math.floor(diffSec / 60)
    const diffHours = Math.floor(diffMin / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffSec < 45) return 'Baru saja'
    if (diffMin < 60) return `${diffMin} mnt lalu`
    if (diffHours < 24) return `${diffHours} jam lalu`
    if (diffDays === 1) return 'Kemarin'
    if (diffDays < 7) return `${diffDays} hr lalu`
    return new Date(timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
  } catch {
    return 'Waktu tidak valid'
  }
}

function getCheckpointStatus(
  checkpoints: Record<string, 'pending' | 'passed' | 'failed'>,
  index: 1 | 2 | 3
): 'pending' | 'passed' | 'failed' {
  if (!checkpoints) return 'pending'
  const val =
    checkpoints[`cp-${index}`] ||
    checkpoints[`word-cp-${index}`] ||
    checkpoints[`cp${index}`]
  return val || 'pending'
}

export function ParticipantTable({
  participants,
  isLoading = false,
  onInspectParticipant,
  sortBy,
  sortOrder,
  onSort,
}: ParticipantTableProps) {
  const fifteenMinutesAgo = Date.now() - 15 * 60 * 1000

  const renderSortIndicator = (column: string) => {
    if (sortBy !== column) {
      return <span className="sort-icon-idle" aria-hidden="true">↕</span>
    }
    return (
      <span className="sort-icon-active" aria-hidden="true">
        {sortOrder === 'asc' ? '▲' : '▼'}
      </span>
    )
  }

  return (
    <div className="admin-table-container" role="region" aria-label="Tabel Direktori Peserta">
      <div className="admin-table-scroll">
        <table className="admin-table">
          <thead>
            <tr>
              <th scope="col" className="col-participant sortable" onClick={() => onSort('name')}>
                <div className="th-content">
                  <span>Peserta & Instansi</span>
                  {renderSortIndicator('name')}
                </div>
              </th>
              <th scope="col" className="col-course">Kursus</th>
              <th scope="col" className="col-progress sortable" onClick={() => onSort('progress')}>
                <div className="th-content">
                  <span>Progres</span>
                  {renderSortIndicator('progress')}
                </div>
              </th>
              <th scope="col" className="col-checkpoints">Checkpoints</th>
              <th scope="col" className="col-quiz">Nilai Kuis</th>
              <th scope="col" className="col-readiness">Status Kesiapan</th>
              <th scope="col" className="col-activity sortable" onClick={() => onSort('lastActive')}>
                <div className="th-content">
                  <span>Aktivitas Terakhir</span>
                  {renderSortIndicator('lastActive')}
                </div>
              </th>
              <th scope="col" className="col-actions text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && participants.length === 0 ? (
              <tr>
                <td colSpan={8} className="admin-table-loading-cell">
                  <div className="admin-table-loading-spinner">
                    <svg className="spin" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                      <path d="M12 2a10 10 0 0 1 10 10" />
                    </svg>
                    <span>Memuat data peserta...</span>
                  </div>
                </td>
              </tr>
            ) : participants.length === 0 ? (
              <tr>
                <td colSpan={8} className="admin-table-empty-cell">
                  <div className="admin-table-empty-state">
                    <div className="empty-state-icon" aria-hidden="true">🔍</div>
                    <h3 className="empty-state-title">Tidak Ada Peserta yang Sesuai</h3>
                    <p className="empty-state-desc">
                      Tidak ditemukan data peserta dengan filter atau kriteria pencarian saat ini. Silakan ubah filter kursus, kesiapan, atau bersihkan kata kunci.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              participants.map((p) => {
                const isActive = p.lastActiveAt >= fifteenMinutesAgo
                const cp1 = getCheckpointStatus(p.checkpoints, 1)
                const cp2 = getCheckpointStatus(p.checkpoints, 2)
                const cp3 = getCheckpointStatus(p.checkpoints, 3)

                return (
                  <tr key={p.participantId} className="admin-table-row">
                    {/* Peserta & Instansi */}
                    <td className="col-participant">
                      <div className="participant-info-cell">
                        <span className="participant-name">{p.name || 'Peserta'}</span>
                        <span className="participant-agency">{p.agency || '-'}</span>
                        <code className="participant-id-badge">{p.participantId}</code>
                      </div>
                    </td>

                    {/* Kursus */}
                    <td className="col-course">
                      <span className={`course-badge course-badge-${p.courseId}`}>
                        {p.courseId === 'ai' ? '🤖 AI' : '📝 Word'}
                      </span>
                    </td>

                    {/* Progres */}
                    <td className="col-progress">
                      <div className="progress-cell">
                        <div className="progress-label-row">
                          <span className="progress-pct-bold">{p.progressPercent}%</span>
                          <span className="task-counter-badge">
                            {p.completedTasks}/{p.totalTasks} tugas
                          </span>
                        </div>
                        <div className="table-progress-track">
                          <div
                            className="table-progress-fill"
                            style={{ width: `${Math.min(100, Math.max(0, p.progressPercent))}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Checkpoints */}
                    <td className="col-checkpoints">
                      <div className="checkpoint-pills-row" title={`CP1: ${cp1}, CP2: ${cp2}, CP3: ${cp3}`}>
                        {([1, 2, 3] as const).map((idx) => {
                          const status = getCheckpointStatus(p.checkpoints, idx)
                          const icon = status === 'passed' ? '✓' : status === 'failed' ? '✗' : '○'
                          return (
                            <span
                              key={idx}
                              className={`cp-mini-pill cp-${status}`}
                              title={`CP${idx}: ${status}`}
                            >
                              <span className="cp-idx">CP{idx}</span>
                              <span className="cp-icon" aria-hidden="true">{icon}</span>
                            </span>
                          )
                        })}
                      </div>
                    </td>

                    {/* Nilai Kuis */}
                    <td className="col-quiz">
                      {p.quizScore !== undefined && p.quizScore !== null ? (
                        <span
                          className={`quiz-score-pill ${
                            p.quizScore >= 70 ? 'quiz-pass' : 'quiz-fail'
                          }`}
                        >
                          {p.quizScore}/100
                        </span>
                      ) : (
                        <span className="quiz-empty-dash" title="Tidak ada evaluasi kuis">—</span>
                      )}
                    </td>

                    {/* Status Kesiapan */}
                    <td className="col-readiness">
                      <span className={`readiness-pill readiness-${p.readinessStatus}`}>
                        {p.readinessStatus === 'ready' && (
                          <>
                            <span className="readiness-icon" aria-hidden="true">✅</span>
                            <span>Siap Workshop</span>
                          </>
                        )}
                        {p.readinessStatus === 'clinic' && (
                          <>
                            <span className="readiness-icon" aria-hidden="true">🚨</span>
                            <span>Perlu Klinik</span>
                          </>
                        )}
                        {p.readinessStatus === 'pending' && (
                          <>
                            <span className="readiness-icon" aria-hidden="true">⏳</span>
                            <span>Berprogres</span>
                          </>
                        )}
                      </span>
                    </td>

                    {/* Aktivitas Terakhir */}
                    <td className="col-activity">
                      <div
                        className="activity-cell"
                        title={new Date(p.lastActiveAt).toLocaleString('id-ID')}
                      >
                        <span
                          className={`activity-dot ${isActive ? 'dot-active' : 'dot-idle'}`}
                          title={isActive ? 'Aktif dalam 15 menit terakhir' : 'Tidak aktif >15 menit'}
                        />
                        <span className="activity-time-text">
                          {formatRelativeTime(p.lastActiveAt)}
                        </span>
                      </div>
                    </td>

                    {/* Aksi */}
                    <td className="col-actions text-center">
                      <button
                        type="button"
                        className="btn-inspect-participant"
                        onClick={() => onInspectParticipant(p)}
                        title={`Inspeksi detail peserta ${p.name}`}
                        aria-label={`Inspeksi detail peserta ${p.name}`}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        <span>Inspeksi</span>
                      </button>
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
