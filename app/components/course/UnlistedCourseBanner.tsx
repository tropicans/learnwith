interface UnlistedCourseBannerProps {
  courseId: string
  isInFlight?: boolean
  targetStatus?: string
}

export function UnlistedCourseBanner({
  courseId,
  isInFlight,
  targetStatus,
}: UnlistedCourseBannerProps) {
  if (isInFlight) {
    const statusLabel =
      targetStatus === 'deleted'
        ? 'dinonaktifkan'
        : targetStatus === 'archived'
          ? 'diarsipkan'
          : targetStatus === 'hidden'
            ? 'akses terbatas'
            : targetStatus || 'diperbarui'

    return (
      <div
        className="course-inflight-banner"
        role="status"
        aria-live="polite"
        id="banner-inflight-status"
      >
        <span className="inflight-icon" aria-hidden="true">⚠️</span>
        <div className="inflight-content">
          <span className="inflight-title">Perhatian Sesi Aktif:</span>
          <span className="inflight-msg">
            Status pelatihan ini telah diperbarui menjadi <strong>{statusLabel}</strong> oleh administrator. Anda dapat menyelesaikan pengerjaan sesi ini, namun akses baru telah dibatasi.
          </span>
        </div>
      </div>
    )
  }

  return (
    <div
      className="unlisted-course-banner"
      role="note"
      id="banner-unlisted-course"
    >
      <span className="unlisted-icon" aria-hidden="true">👁️‍🗨️</span>
      <span className="unlisted-text">
        <strong>Workshop Akses Terbatas (Unlisted)</strong> — Modul ini dapat diakses melalui tautan langsung namun tidak terdaftar di katalog publik.
      </span>
    </div>
  )
}