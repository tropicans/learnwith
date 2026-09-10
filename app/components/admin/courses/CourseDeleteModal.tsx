import React, { useState, useEffect } from 'react'
import type { CourseLifecycleRecord } from '../../../schemas/courseLifecycle'

export interface CourseDeleteModalProps {
  isOpen: boolean
  course: CourseLifecycleRecord | null
  onClose: () => void
  onConfirm: (courseId: string, reason?: string) => Promise<void>
  isSubmitting: boolean
}

export function CourseDeleteModal({
  isOpen,
  course,
  onClose,
  onConfirm,
  isSubmitting,
}: CourseDeleteModalProps) {
  const [typedConfirmation, setTypedConfirmation] = useState('')
  const [reason, setReason] = useState('')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Reset inputs whenever modal opens or course changes
  useEffect(() => {
    if (isOpen) {
      setTypedConfirmation('')
      setReason('')
      setErrorMsg(null)
    }
  }, [isOpen, course])

  // Escape key dismiss listener
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, isSubmitting, onClose])

  if (!isOpen || !course) return null

  // Guard condition: matches course ID case-insensitively OR exact keyword 'HAPUS' (case-insensitive)
  const normalizedTyped = typedConfirmation.trim().toLowerCase()
  const isConfirmed =
    normalizedTyped === course.id.toLowerCase() ||
    normalizedTyped === 'hapus'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isConfirmed || isSubmitting) return

    setErrorMsg(null)
    try {
      await onConfirm(course.id, reason.trim() || undefined)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal menonaktifkan kursus.'
      setErrorMsg(msg)
    }
  }

  return (
    <div
      className="admin-modal-backdrop"
      id="course-delete-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-delete-title"
      onClick={() => {
        if (!isSubmitting) onClose()
      }}
    >
      <div
        className="admin-modal-container course-delete-modal"
        id="course-delete-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="admin-modal-header modal-header-danger">
          <div className="modal-danger-badge" id="badge-delete-warning">
            <span>⚠️ Tindakan Sensitif</span>
          </div>
          <h3 className="admin-modal-title" id="modal-delete-title">
            Konfirmasi Penonaktifan Kursus
          </h3>
        </div>

        {/* Modal Body & Form */}
        <form onSubmit={handleSubmit} className="admin-modal-body">
          <p className="modal-warning-text" id="delete-warning-text">
            Anda akan menonaktifkan kursus <strong>{course.title}</strong> (
            <code>{course.id.toUpperCase()}</code>). Kursus tidak akan muncul di katalog publik
            dan akses materi dinonaktifkan. Data kurikulum tidak terhapus permanen dan dapat dipulihkan
            kembali oleh Master Admin.
          </p>

          {/* Reason Input (Optional, Max 200 chars) */}
          <div className="modal-form-group">
            <label htmlFor="delete-reason" className="modal-label">
              Alasan Penonaktifan (Opsional, maks. 200 karakter):
            </label>
            <input
              type="text"
              id="delete-reason"
              className="modal-input"
              placeholder="Contoh: Pembaruan kurikulum angkatan baru"
              maxLength={200}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={isSubmitting}
            />
            <span className="modal-char-count">{reason.length}/200</span>
          </div>

          {/* Confirmation Input Guard */}
          <div className="modal-form-group">
            <label htmlFor="delete-confirm" className="modal-label">
              Ketik <code>{course.id}</code> atau <code>HAPUS</code> untuk konfirmasi:
            </label>
            <input
              type="text"
              id="delete-confirm"
              className="modal-input input-confirm-guard"
              placeholder={`Ketik "${course.id}" atau "HAPUS"`}
              value={typedConfirmation}
              onChange={(e) => setTypedConfirmation(e.target.value)}
              disabled={isSubmitting}
              autoFocus
              autoComplete="off"
            />
          </div>

          {errorMsg && (
            <div className="modal-alert-error" role="alert" id="modal-delete-error">
              <span>⚠️ {errorMsg}</span>
            </div>
          )}

          {/* Modal Actions Footer */}
          <div className="admin-modal-footer">
            <button
              type="button"
              className="btn-modal-cancel"
              id="btn-cancel-delete"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Batalkan Perubahan
            </button>
            <button
              type="submit"
              className="btn-modal-danger"
              id="btn-confirm-delete"
              disabled={!isConfirmed || isSubmitting}
            >
              {isSubmitting ? 'Memproses...' : 'Ya, Nonaktifkan Kursus'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
