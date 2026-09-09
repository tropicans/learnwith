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
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3
            id="modal-reset-title"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--color-danger)',
              fontSize: 'var(--font-size-lg)',
              fontWeight: 'var(--font-weight-bold)',
              margin: 0,
            }}
          >
            <span>⚠️</span> Atur Ulang Semua Progres?
          </h3>
        </div>

        <div
          className="modal-body"
          style={{
            margin: '1.25rem 0',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            fontSize: 'var(--font-size-sm)',
          }}
        >
          <p>
            Tindakan ini akan <strong>menghapus seluruh progres</strong> yang
            tersimpan di browser Anda, termasuk:
          </p>
          <ul style={{ margin: '0.75rem 0 0.75rem 1.25rem' }}>
            <li>
              Semua tanda centang langkah persiapan dan modul praktik (13 langkah).
            </li>
            <li>Status kelulusan verifikasi Checkpoint 1, 2, dan 3.</li>
            <li>
              Data identitas peserta, versi Node.js, dan Telegram User ID.
            </li>
          </ul>
          <div
            className="alert-box alert-danger"
            style={{ margin: '1rem 0 0 0', padding: '0.75rem 1rem' }}
          >
            <div className="alert-icon">🛑</div>
            <div className="alert-content">
              <p
                style={{
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                Peringatan: Data yang telah direset tidak dapat dipulihkan kembali.
              </p>
            </div>
          </div>
        </div>

        <div
          className="modal-footer"
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            marginTop: '1.5rem',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '1rem',
          }}
        >
          <button
            type="button"
            id="btn-cancel-reset"
            className="btn btn-secondary"
            onClick={onClose}
          >
            Batal
          </button>
          <button
            ref={confirmBtnRef}
            type="button"
            id="btn-confirm-reset"
            className="btn btn-danger"
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
