import { Link } from '@tanstack/react-router'

interface CourseUnavailableNoticeProps {
  status: 'deleted' | 'archived'
  courseId: string
  courseTitle?: string
}

export function CourseUnavailableNotice({
  status,
  courseId,
  courseTitle,
}: CourseUnavailableNoticeProps) {
  const isDeleted = status === 'deleted'

  return (
    <main
      className="app-main course-unavailable-main"
      id={isDeleted ? 'course-unavailable-deleted' : 'course-unavailable-archived'}
    >
      <div className="card course-unavailable-card">
        <div className="unavailable-icon-wrapper">
          <span className="unavailable-icon" aria-hidden="true">
            {isDeleted ? '🚫' : '📦'}
          </span>
          <span className={`badge badge-pill ${isDeleted ? 'badge-danger' : 'badge-neutral'}`}>
            {isDeleted ? 'Dinonaktifkan' : 'Diarsipkan'}
          </span>
        </div>

        <h2 className="unavailable-title">
          {isDeleted ? 'Pelatihan Tidak Tersedia' : 'Pelatihan Telah Diarsipkan'}
        </h2>

        {courseTitle && <p className="unavailable-course-name">{courseTitle}</p>}

        <p className="unavailable-desc">
          {isDeleted
            ? 'Modul pelatihan ini saat ini telah dinonaktifkan oleh administrator. Seluruh akses materi dan exercise praktikum ditangguhkan sementara.'
            : 'Sesi workshop untuk materi ini telah selesai dan diarsipkan. Pendaftaran baru serta akses kurikulum publik saat ini telah ditutup.'}
        </p>

        <div className="unavailable-actions">
          <Link
            to="/"
            search={{ filter: 'all' }}
            className="btn btn-primary unavailable-back-btn"
            id="btn-return-home"
          >
            Kembali ke Beranda Workshop
          </Link>
        </div>
      </div>
    </main>
  )
}