import React, { useEffect, useRef } from 'react'
import type { ParticipantRecord } from '../../schemas/telemetry'
import {
  AI_TASK_GROUPS,
  WORD_TASK_GROUPS,
  getCheckpointStatus,
  formatDate,
  type TaskGroup,
} from '../../utils/adminExport'

export interface ParticipantDetailModalProps {
  participant: ParticipantRecord | null
  isOpen: boolean
  onClose: () => void
}

export { AI_TASK_GROUPS, WORD_TASK_GROUPS, getCheckpointStatus, formatDate, type TaskGroup }

export function ParticipantDetailModal({
  participant,
  isOpen,
  onClose,
}: ParticipantDetailModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  // ESC key listener to dismiss modal
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Body scroll lock and autofocus close button
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      closeButtonRef.current?.focus()

      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [isOpen])

  if (!isOpen || !participant) {
    return null
  }

  const cp1Status = getCheckpointStatus(participant.checkpoints, 1)
  const cp2Status = getCheckpointStatus(participant.checkpoints, 2)
  const cp3Status = getCheckpointStatus(participant.checkpoints, 3)

  const isWordCourse = participant.courseId === 'word'
  const taskGroups = isWordCourse ? WORD_TASK_GROUPS : AI_TASK_GROUPS
  const checklist = participant.taskChecklist || {}

  // Any custom tasks not part of predefined groups
  const predefinedIds = new Set(
    taskGroups.flatMap((g) => g.tasks.map((t) => t.id))
  )
  const extraTaskIds = Object.keys(checklist).filter((k) => !predefinedIds.has(k))

  return (
    <div
      className="admin-modal-backdrop"
      onClick={onClose}
      role="presentation"
      data-testid="participant-modal-backdrop"
    >
      <div
        className="admin-modal-container"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-participant-title"
        onClick={(e) => e.stopPropagation()}
        data-testid="participant-modal-dialog"
      >
        {/* a. Header */}
        <div className="admin-modal-header">
          <div className="modal-header-info">
            <div className="modal-header-badge-row">
              <span
                className={`course-badge ${
                  participant.courseId === 'ai' ? 'course-badge-ai' : 'course-badge-word'
                }`}
              >
                {participant.courseId === 'ai' ? '🤖 AI Agentic' : '📝 Pengolahan Kata ASN'}
              </span>
              <span className="participant-id-badge" title="ID Peserta">
                {participant.participantId}
              </span>
            </div>
            <h2 id="modal-participant-title" className="modal-participant-name">
              {participant.name || 'Peserta'}
            </h2>
            <p className="modal-participant-agency">
              🏛️ {participant.agency || 'Instansi / Unit Kerja Belum Terisi'}
            </p>
          </div>
          <button
            type="button"
            ref={closeButtonRef}
            className="admin-modal-close-btn"
            onClick={onClose}
            aria-label="Tutup Dialog Detail Peserta"
            title="Tutup (ESC)"
          >
            ✕
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="admin-modal-body">
          {/* b. Readiness Hero Banner */}
          {participant.readinessStatus === 'ready' && (
            <div className="modal-hero-banner hero-banner-ready" data-testid="hero-banner-ready">
              <div className="hero-banner-icon">✓</div>
              <div className="hero-banner-content">
                <div className="hero-banner-title">Peserta Siap Mengikuti Sesi Workshop Tatap Muka</div>
                <div className="hero-banner-desc">
                  Seluruh modul mandiri dan checkpoint teknis berhasil diselesaikan dengan baik (Progres: {participant.progressPercent}%).
                </div>
              </div>
            </div>
          )}

          {participant.readinessStatus === 'clinic' && (
            <div className="modal-hero-banner hero-banner-clinic" data-testid="hero-banner-clinic">
              <div className="hero-banner-icon">⚠️</div>
              <div className="hero-banner-content">
                <div className="hero-banner-title">Peserta Memerlukan Pendampingan Khusus di Klinik Teknis</div>
                <div className="hero-banner-desc">
                  Terdapat checkpoint teknis yang gagal verifikasi atau progres peserta di bawah standar minimum kesiapan praktikum.
                </div>
              </div>
            </div>
          )}

          {participant.readinessStatus === 'pending' && (
            <div className="modal-hero-banner hero-banner-pending" data-testid="hero-banner-pending">
              <div className="hero-banner-icon">⏳</div>
              <div className="hero-banner-content">
                <div className="hero-banner-title">Peserta Sedang Menyelesaikan Modul Mandiri</div>
                <div className="hero-banner-desc">
                  Peserta sedang dalam proses pengerjaan modul dan pengujian checkpoint pra-pelatihan (Progres: {participant.progressPercent}%).
                </div>
              </div>
            </div>
          )}

          {/* Quick Metrics Bar */}
          <div className="modal-quick-metrics">
            <div className="modal-metric-card">
              <div className="modal-metric-label">Progres Keseluruhan</div>
              <div className="modal-metric-value">{participant.progressPercent}%</div>
              <div className="modal-metric-sub">
                {participant.completedTasks} dari {participant.totalTasks} tugas
              </div>
            </div>
            <div className="modal-metric-card">
              <div className="modal-metric-label">Checkpoint Valid</div>
              <div className="modal-metric-value">
                {[cp1Status, cp2Status, cp3Status].filter((s) => s === 'passed').length} / 3
              </div>
              <div className="modal-metric-sub">Gerbang Kualifikasi Teknis</div>
            </div>
            <div className="modal-metric-card">
              <div className="modal-metric-label">
                {isWordCourse ? 'Skor Evaluasi Kuis' : 'Validasi AI CLI'}
              </div>
              <div className="modal-metric-value">
                {isWordCourse
                  ? participant.quizScore !== undefined
                    ? `${participant.quizScore}/100`
                    : '-'
                  : 'Otomatis'}
              </div>
              <div className="modal-metric-sub">
                {isWordCourse
                  ? participant.quizScore !== undefined && participant.quizScore >= 70
                    ? 'Lulus Standar'
                    : 'Remediasi'
                  : 'Live Checkpoint'}
              </div>
            </div>
          </div>

          {/* c. Checkpoints 1–3 History */}
          <div className="modal-dossier-section">
            <h3 className="modal-section-title">
              <span className="section-title-icon">🎯</span> Riwayat Checkpoint Teknis (CP-1 s/d CP-3)
            </h3>
            <div className="modal-checkpoint-grid">
              {/* CP-1 */}
              <div className={`modal-cp-card cp-status-${cp1Status}`}>
                <div className="modal-cp-header">
                  <span className="modal-cp-tag">CP-1</span>
                  <span className={`cp-mini-pill cp-${cp1Status}`}>
                    {cp1Status === 'passed' && '✓ Lulus'}
                    {cp1Status === 'failed' && '✕ Gagal'}
                    {cp1Status === 'pending' && '⏳ Menunggu'}
                  </span>
                </div>
                <div className="modal-cp-title">Verifikasi Lingkungan / Format Dasar</div>
                <div className="modal-cp-desc">
                  {isWordCourse
                    ? 'Validasi struktur margin Pergub DKI (4-4-3-3 cm) dan format font Bookman Old Style.'
                    : 'Pemeriksaan instalasi Node.js LTS v18+ dan package manager npm.'}
                </div>
              </div>

              {/* CP-2 */}
              <div className={`modal-cp-card cp-status-${cp2Status}`}>
                <div className="modal-cp-header">
                  <span className="modal-cp-tag">CP-2</span>
                  <span className={`cp-mini-pill cp-${cp2Status}`}>
                    {cp2Status === 'passed' && '✓ Lulus'}
                    {cp2Status === 'failed' && '✕ Gagal'}
                    {cp2Status === 'pending' && '⏳ Menunggu'}
                  </span>
                </div>
                <div className="modal-cp-title">Uji Kredensial / Tata Naskah</div>
                <div className="modal-cp-desc">
                  {isWordCourse
                    ? 'Validasi heading bertingkat, daftar isi otomatis, dan penomoran halaman berbeda.'
                    : 'Pengujian konfigurasi Bot Telegram, BotFather token, dan Telegram User ID.'}
                </div>
              </div>

              {/* CP-3 */}
              <div className={`modal-cp-card cp-status-${cp3Status}`}>
                <div className="modal-cp-header">
                  <span className="modal-cp-tag">CP-3</span>
                  <span className={`cp-mini-pill cp-${cp3Status}`}>
                    {cp3Status === 'passed' && '✓ Lulus'}
                    {cp3Status === 'failed' && '✕ Gagal'}
                    {cp3Status === 'pending' && '⏳ Menunggu'}
                  </span>
                </div>
                <div className="modal-cp-title">Validasi Integrasi / Finalisasi Dokumen</div>
                <div className="modal-cp-desc">
                  {isWordCourse
                    ? 'Penyelesaian simulasi Mail Merge naskah dinas dan format tanda tangan resmi.'
                    : 'Uji eksekusi konsol interaktif agentic AI dan integrasi pipeline webhook.'}
                </div>
              </div>
            </div>
          </div>

          {/* d. Evaluasi Kuis */}
          <div className="modal-dossier-section">
            <h3 className="modal-section-title">
              <span className="section-title-icon">📊</span> Evaluasi Pemahaman & Kuis
            </h3>
            {isWordCourse ? (
              <div className="modal-quiz-dossier">
                <div className="modal-quiz-score-box">
                  <div className="modal-quiz-number">
                    {participant.quizScore !== undefined ? participant.quizScore : '-'}
                  </div>
                  <div className="modal-quiz-max">/ 100</div>
                </div>
                <div className="modal-quiz-details">
                  <div className="modal-quiz-indicator-row">
                    <span className="modal-quiz-label">Status Kelulusan Evaluasi:</span>
                    {participant.quizScore !== undefined ? (
                      participant.quizScore >= 70 ? (
                        <span className="quiz-score-pill quiz-pass">
                          ✓ LULUS EVALUASI (Skor {participant.quizScore} ≥ 70)
                        </span>
                      ) : (
                        <span className="quiz-score-pill quiz-fail">
                          ⚠️ PERLU REMEDIASI (Skor {participant.quizScore} &lt; 70)
                        </span>
                      )
                    ) : (
                      <span className="quiz-score-pill quiz-empty-dash">
                        ⏳ Belum Mengambil Evaluasi
                      </span>
                    )}
                  </div>
                  <p className="modal-quiz-remark">
                    {participant.quizScore !== undefined && participant.quizScore >= 70
                      ? 'Peserta memahami tata kelola naskah dinas elektronik dan format penulisan resmi Pergub DKI Jakarta No. 14/2020.'
                      : participant.quizScore !== undefined
                      ? 'Peserta disarankan mengulang materi Bab II (Heading) dan Bab IV (Mail Merge) sebelum pelaksanaan workshop tatap muka.'
                      : 'Kuis evaluasi mandiri belum diselesaikan oleh peserta. Skor akan otomatis tertera setelah peserta menyelesaikan kuis di Bab V.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="modal-ai-evaluation-box">
                <div className="ai-eval-icon">🤖</div>
                <div className="ai-eval-content">
                  <div className="ai-eval-heading">Verifikasi Berbasis Checkpoint Otomatis</div>
                  <div className="ai-eval-desc">
                    Pelatihan AI Agentic menggunakan validasi berbasis terminal langsung (Checkpoints CP-1, CP-2, dan CP-3) untuk menguji lingkungan kerja, token bot, dan fungsionalitas integrasi secara riil. Tidak memerlukan tes pilihan ganda terpisah.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* e. Rincian Checklist Modul */}
          <div className="modal-dossier-section">
            <h3 className="modal-section-title">
              <span className="section-title-icon">📋</span> Rincian Checklist Modul Peserta
            </h3>
            <div className="modal-task-groups">
              {taskGroups.map((group) => {
                const groupCompletedCount = group.tasks.filter((t) => checklist[t.id]).length
                const groupTotal = group.tasks.length

                return (
                  <div key={group.id} className="modal-task-group-card">
                    <div className="task-group-header">
                      <span className="task-group-title">{group.title}</span>
                      <span className="task-group-counter">
                        {groupCompletedCount} / {groupTotal} Selesai
                      </span>
                    </div>
                    <ul className="modal-task-list">
                      {group.tasks.map((task) => {
                        const isDone = Boolean(checklist[task.id])
                        return (
                          <li
                            key={task.id}
                            className={`modal-task-item ${isDone ? 'task-done' : 'task-pending'}`}
                          >
                            <span className={`task-check-icon ${isDone ? 'icon-done' : 'icon-pending'}`}>
                              {isDone ? '✓' : '○'}
                            </span>
                            <span className="task-label-text">{task.label}</span>
                            <span className={`task-status-text ${isDone ? 'status-done' : 'status-pending'}`}>
                              {isDone ? 'Selesai' : 'Belum'}
                            </span>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )
              })}

              {extraTaskIds.length > 0 && (
                <div className="modal-task-group-card">
                  <div className="task-group-header">
                    <span className="task-group-title">Tugas & Aktivitas Tambahan</span>
                    <span className="task-group-counter">
                      {extraTaskIds.filter((k) => checklist[k]).length} / {extraTaskIds.length} Selesai
                    </span>
                  </div>
                  <ul className="modal-task-list">
                    {extraTaskIds.map((taskId) => {
                      const isDone = Boolean(checklist[taskId])
                      return (
                        <li
                          key={taskId}
                          className={`modal-task-item ${isDone ? 'task-done' : 'task-pending'}`}
                        >
                          <span className={`task-check-icon ${isDone ? 'icon-done' : 'icon-pending'}`}>
                            {isDone ? '✓' : '○'}
                          </span>
                          <span className="task-label-text">{taskId}</span>
                          <span className={`task-status-text ${isDone ? 'status-done' : 'status-pending'}`}>
                            {isDone ? 'Selesai' : 'Belum'}
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* f. Footer Metadata */}
        <div className="admin-modal-footer">
          <div className="modal-meta-item">
            <span className="modal-meta-label">ID Peserta:</span>
            <code className="modal-meta-code">{participant.participantId}</code>
          </div>
          <div className="modal-meta-item">
            <span className="modal-meta-label">Waktu Terdaftar:</span>
            <span className="modal-meta-value">{formatDate(participant.serverReceivedAt)}</span>
          </div>
          <div className="modal-meta-item">
            <span className="modal-meta-label">Aktivitas Terakhir:</span>
            <span className="modal-meta-value">{formatDate(participant.lastActiveAt)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
