import React from 'react'
import type {
  CourseLifecycleRecord,
  CourseLifecycleStatus,
} from '../../../schemas/courseLifecycle'

export interface CourseStatusCardsProps {
  courses: CourseLifecycleRecord[]
  onToggleVisibility: (courseId: string, currentStatus: CourseLifecycleStatus) => void
  onArchive?: (courseId: string) => void
  onRestore?: (courseId: string) => void
  onDeleteTrigger?: (course: CourseLifecycleRecord) => void
  onResetFilters?: () => void
  mutatingCourseId?: string | null
  isLoading?: boolean
}

export function CourseStatusCards({
  courses,
  onToggleVisibility,
  onArchive,
  onRestore,
  onDeleteTrigger,
  onResetFilters,
  mutatingCourseId = null,
  isLoading = false,
}: CourseStatusCardsProps) {
  const formatDate = (timestamp: number) => {
    try {
      return new Date(timestamp).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return 'Baru saja'
    }
  }

  const renderStatusBadge = (status: CourseLifecycleStatus) => {
    switch (status) {
      case 'active':
        return (
          <span className="course-status-pill status-active" id="badge-status-active">
            <span className="status-dot" aria-hidden="true" />
            <span>Aktif</span>
          </span>
        )
      case 'hidden':
        return (
          <span className="course-status-pill status-hidden" id="badge-status-hidden">
            <span className="status-dot" aria-hidden="true" />
            <span>Tersembunyi</span>
          </span>
        )
      case 'archived':
        return (
          <span className="course-status-pill status-archived" id="badge-status-archived">
            <span className="status-dot" aria-hidden="true" />
            <span>Diarsipkan</span>
          </span>
        )
      case 'deleted':
        return (
          <span className="course-status-pill status-deleted" id="badge-status-deleted">
            <span className="status-dot" aria-hidden="true" />
            <span>Dinonaktifkan</span>
          </span>
        )
      default:
        return null
    }
  }

  const renderCourseIcon = (courseId: string) => {
    if (courseId === 'ai') {
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="11" width="18" height="10" rx="2" />
          <circle cx="12" cy="5" r="2" />
          <path d="M12 7v4" />
          <line x1="8" y1="16" x2="8.01" y2="16" />
          <line x1="16" y1="16" x2="16.01" y2="16" />
        </svg>
      )
    }
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <line x1="10" y1="9" x2="8" y2="9" />
      </svg>
    )
  }

  if (courses.length === 0 && !isLoading) {
    return (
      <div className="admin-courses-empty" id="courses-empty-state">
        <div className="empty-icon" aria-hidden="true">🔍</div>
        <h4 className="empty-title">Tidak Ada Kursus Ditemukan</h4>
        <p className="empty-body">
          Tidak ada kursus yang cocok dengan filter status atau kata kunci pencarian yang dipilih.
          Coba pilih filter 'Semua Kursus' atau bersihkan kata kunci pencarian.
        </p>
        {onResetFilters && (
          <button
            type="button"
            className="btn-empty-reset"
            id="btn-reset-course-filters"
            onClick={onResetFilters}
          >
            <span>Reset Filter &amp; Pencarian</span>
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="admin-course-cards-grid" id="admin-course-cards-grid">
      {courses.map((course) => {
        const isMutating = mutatingCourseId === course.id
        const isWord = course.id === 'word'
        const themeClass = isWord ? 'theme-word' : 'theme-ai'

        return (
          <div
            key={course.id}
            className={`admin-course-card ${themeClass} ${isLoading ? 'is-loading' : ''}`}
            id={`course-card-${course.id}`}
          >
            {/* Header: Icon, Title, ID, Status Badge */}
            <div className="course-card-header">
              <div className="course-card-info">
                <div className="course-card-icon" aria-hidden="true">
                  {renderCourseIcon(course.id)}
                </div>
                <div>
                  <h3 className="course-card-title">{course.title}</h3>
                  <span className="course-card-id-tag">ID: {course.id.toUpperCase()}</span>
                </div>
              </div>
              <div className="course-card-badge-wrap">
                {renderStatusBadge(course.status)}
              </div>
            </div>

            {/* Body: Metadata (last updated, operator, optional reason) */}
            <div className="course-card-body">
              <div className="course-card-meta">
                <div>
                  <span>Diperbarui: </span>
                  <strong>{formatDate(course.updatedAt)}</strong>
                </div>
                <div>
                  <span>Operator: </span>
                  <span className="course-operator-badge">{course.updatedBy || 'master-admin'}</span>
                </div>
              </div>

              {course.reason && (
                <div className="course-card-reason">
                  <span className="reason-label">Catatan: </span>
                  <span>{course.reason}</span>
                </div>
              )}
            </div>

            {/* Action Buttons Group */}
            <div className="course-card-actions">
              {/* Active status: Sembunyikan, Arsipkan, Nonaktifkan */}
              {course.status === 'active' && (
                <>
                  <button
                    type="button"
                    className="btn-course-action btn-action-warning"
                    id={`btn-hide-course-${course.id}`}
                    onClick={() => onToggleVisibility(course.id, 'active')}
                    disabled={isMutating || isLoading}
                    title={`Sembunyikan kursus ${course.title} dari katalog publik`}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                    <span>{isMutating ? 'Menyimpan...' : 'Sembunyikan Kursus'}</span>
                  </button>

                  {onArchive && (
                    <button
                      type="button"
                      className="btn-course-action btn-action-secondary"
                      id={`btn-archive-course-${course.id}`}
                      onClick={() => onArchive(course.id)}
                      disabled={isMutating || isLoading}
                      title={`Arsipkan kursus ${course.title}`}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="21 8 21 21 3 21 3 8" />
                        <rect x="1" y="3" width="22" height="5" />
                        <line x1="10" y1="12" x2="14" y2="12" />
                      </svg>
                      <span>Arsipkan Kursus</span>
                    </button>
                  )}

                  {onDeleteTrigger && (
                    <button
                      type="button"
                      className="btn-course-action btn-action-danger"
                      id={`btn-delete-course-${course.id}`}
                      onClick={() => onDeleteTrigger(course)}
                      disabled={isMutating || isLoading}
                      title={`Nonaktifkan kursus ${course.title}`}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                      </svg>
                      <span>Nonaktifkan Kursus</span>
                    </button>
                  )}
                </>
              )}

              {/* Hidden status: Tampilkan, Arsipkan, Nonaktifkan */}
              {course.status === 'hidden' && (
                <>
                  <button
                    type="button"
                    className="btn-course-action btn-action-primary"
                    id={`btn-show-course-${course.id}`}
                    onClick={() => onToggleVisibility(course.id, 'hidden')}
                    disabled={isMutating || isLoading}
                    title={`Tampilkan kursus ${course.title} ke katalog publik`}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    <span>{isMutating ? 'Menyimpan...' : 'Tampilkan Kursus'}</span>
                  </button>

                  {onArchive && (
                    <button
                      type="button"
                      className="btn-course-action btn-action-secondary"
                      id={`btn-archive-course-${course.id}`}
                      onClick={() => onArchive(course.id)}
                      disabled={isMutating || isLoading}
                      title={`Arsipkan kursus ${course.title}`}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="21 8 21 21 3 21 3 8" />
                        <rect x="1" y="3" width="22" height="5" />
                        <line x1="10" y1="12" x2="14" y2="12" />
                      </svg>
                      <span>Arsipkan Kursus</span>
                    </button>
                  )}

                  {onDeleteTrigger && (
                    <button
                      type="button"
                      className="btn-course-action btn-action-danger"
                      id={`btn-delete-course-${course.id}`}
                      onClick={() => onDeleteTrigger(course)}
                      disabled={isMutating || isLoading}
                      title={`Nonaktifkan kursus ${course.title}`}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                      </svg>
                      <span>Nonaktifkan Kursus</span>
                    </button>
                  )}
                </>
              )}

              {/* Archived status: Pulihkan Kursus, Nonaktifkan Kursus */}
              {course.status === 'archived' && (
                <>
                  {onRestore && (
                    <button
                      type="button"
                      className="btn-course-action btn-action-primary"
                      id={`btn-restore-course-${course.id}`}
                      onClick={() => onRestore(course.id)}
                      disabled={isMutating || isLoading}
                      title={`Pulihkan kursus ${course.title} ke status aktif`}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="1 4 1 10 7 10" />
                        <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                      </svg>
                      <span>Pulihkan Kursus</span>
                    </button>
                  )}

                  {onDeleteTrigger && (
                    <button
                      type="button"
                      className="btn-course-action btn-action-danger"
                      id={`btn-delete-course-${course.id}`}
                      onClick={() => onDeleteTrigger(course)}
                      disabled={isMutating || isLoading}
                      title={`Nonaktifkan kursus ${course.title}`}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                      </svg>
                      <span>Nonaktifkan Kursus</span>
                    </button>
                  )}
                </>
              )}

              {/* Deleted status: Pulihkan Kursus */}
              {course.status === 'deleted' && (
                <>
                  {onRestore && (
                    <button
                      type="button"
                      className="btn-course-action btn-action-primary"
                      id={`btn-restore-course-${course.id}`}
                      onClick={() => onRestore(course.id)}
                      disabled={isMutating || isLoading}
                      title={`Pulihkan kursus ${course.title} ke status aktif`}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="1 4 1 10 7 10" />
                        <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                      </svg>
                      <span>Pulihkan Kursus</span>
                    </button>
                  )}
                  <span className="course-action-status-note status-deleted-note">
                    Modul dinonaktifkan dari sistem.
                  </span>
                </>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
