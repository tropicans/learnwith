import React, { useEffect, useRef } from 'react'

export interface ResetProgressModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export function ResetProgressModal({
  isOpen,
  onClose,
  onConfirm,
}: ResetProgressModalProps) {
  const confirmBtnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      // Focus the confirmation button when modal opens
      setTimeout(() => {
        confirmBtnRef.current?.focus()
      }, 50)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      id="modal-reset-confirm"
      className="modal-backdrop open"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-reset-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div className="modal-content modal-reset-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header modal-reset-header">
          <h3 id="modal-reset-title" className="modal-reset-title">
            <span className="modal-reset-icon">⚠️</span> Atur Ulang Semua Progres?
          </h3>
        </div>

        <div className="modal-body modal-reset-body">
          <p className="modal-reset-lead">
            Tindakan ini akan <strong>menghapus seluruh progres</strong> yang
            tersimpan di browser Anda, termasuk:
          </p>
          <ul className="modal-reset-list">
            <li>
              Semua tanda centang langkah persiapan dan modul praktik (13 langkah).
            </li>
            <li>Status kelulusan verifikasi Checkpoint 1, 2, dan 3.</li>
            <li>
              Data identitas peserta, versi Node.js, dan Telegram User ID.
            </li>
          </ul>
          <div className="alert-box alert-danger modal-reset-alert">
            <div className="alert-icon">🛑</div>
            <div className="alert-content">
              <p className="modal-reset-alert-text">
                Peringatan: Data yang telah direset tidak dapat dipulihkan kembali.
              </p>
            </div>
          </div>
        </div>

        <div className="modal-footer modal-reset-footer">
          <button
            type="button"
            id="btn-cancel-reset"
            className="btn btn-secondary btn-modal-cancel"
            onClick={onClose}
          >
            Batal
          </button>
          <button
            ref={confirmBtnRef}
            type="button"
            id="btn-confirm-reset"
            className="btn btn-danger btn-modal-confirm"
            onClick={onConfirm}
            autoFocus
          >
            Ya, Reset Semua Progres
          </button>
        </div>
      </div>
    </div>
  )
}
