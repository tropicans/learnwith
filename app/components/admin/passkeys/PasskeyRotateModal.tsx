import React, { useState, useEffect } from 'react'
import type { CourseId, CoursePasskeyRecord, RotatePasskeyResult } from '../../../schemas/passkey'
import { adminRotatePasskeyFn } from '../../../server/passkey'

import { getClientAdminToken } from '../../../utils/adminToken'

interface PasskeyRotateModalProps {
  isOpen: boolean
  courseId: CourseId | null
  currentRecord?: CoursePasskeyRecord
  sessionToken?: string
  onClose: () => void
  onSuccess: (result: RotatePasskeyResult) => void
}

export function PasskeyRotateModal({
  isOpen,
  courseId,
  currentRecord,
  sessionToken,
  onClose,
  onSuccess,
}: PasskeyRotateModalProps) {
  const [newPasskey, setNewPasskey] = useState('')
  const [reason, setReason] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setNewPasskey('')
      setReason('')
      setShowPassword(false)
      setErrorMessage(null)
      setIsSubmitting(false)
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isSubmitting) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, isSubmitting, onClose])

  if (!isOpen || !courseId || !currentRecord) {
    return null
  }

  const isWord = courseId === 'word'
  const isTooShort = newPasskey.trim().length > 0 && newPasskey.trim().length < 6
  const isTooLong = newPasskey.trim().length > 64
  const isValidLength = newPasskey.trim().length >= 6 && newPasskey.trim().length <= 64

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValidLength) {
      setErrorMessage('Passkey baru harus memiliki panjang antara 6 hingga 64 karakter.')
      return
    }

    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const activeToken = sessionToken || getClientAdminToken()
      const result = await adminRotatePasskeyFn({
        data: {
          courseId,
          newPasskey: newPasskey.trim(),
          reason: reason.trim() || undefined,
          sessionToken: activeToken,
        },
      })

      if (result.success) {
        onSuccess(result)
        onClose()
      } else {
        setErrorMessage(result.message || 'Gagal merotasi passkey.')
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan sistem saat merotasi passkey.'
      setErrorMessage(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="admin-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="rotate-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) {
          onClose()
        }
      }}
    >
      <div className="admin-modal-container admin-rotate-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <div className="admin-modal-title-group">
            <div className="admin-modal-icon" aria-hidden="true">
              🔄
            </div>
            <div>
              <h2 id="rotate-modal-title" className="admin-modal-title">
                Rotasi Passkey Workshop
              </h2>
              <p className="admin-modal-subtitle">
                {currentRecord.title} • Versi Aktif: v{currentRecord.version}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="btn-modal-close"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Tutup dialog"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="admin-rotate-modal-form">
          <div className="admin-modal-body">
            {/* Warning Banner */}
            <div className="admin-modal-warning-banner">
              <span className="warning-banner-icon" aria-hidden="true">
                ⚠️
              </span>
              <div className="warning-banner-content">
                <strong>Perhatian: Tindakan Langsung Berdampak ke Peserta</strong>
                <p>
                  Setelah passkey dirotasi, peserta kelas workshop yang baru membuka gerbang materi
                  harus memasukkan passkey baru ini. Hash versi sebelumnya akan diarsipkan ke riwayat rotasi.
                </p>
              </div>
            </div>

            {/* Current Passkey Notice */}
            <div className="admin-form-group">
              <label className="admin-label">Passkey Terselubung Saat Ini</label>
              <div className="admin-static-display">
                <code>{currentRecord.clearTextPreview}</code>
                <span className="static-display-tag">Versi {currentRecord.version}</span>
              </div>
            </div>

            {/* New Passkey Field */}
            <div className="admin-form-group">
              <div className="admin-label-row">
                <label htmlFor="new-passkey-input" className="admin-label">
                  Passkey Baru <span className="admin-required-star">*</span>
                </label>
                <span className="admin-char-counter">
                  {newPasskey.length}/64 karakter
                </span>
              </div>
              <div className="admin-input-wrapper">
                <input
                  id="new-passkey-input"
                  type={showPassword ? 'text' : 'password'}
                  className={`admin-input ${isTooShort || isTooLong ? 'input-error' : ''}`}
                  value={newPasskey}
                  onChange={(e) => setNewPasskey(e.target.value)}
                  placeholder={`Contoh: ${isWord ? 'asn-unggul-2026' : 'kelas-ai-batch2'}`}
                  disabled={isSubmitting}
                  autoFocus
                  required
                />
                <button
                  type="button"
                  className="btn-input-toggle-pwd"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Sembunyikan teks' : 'Tampilkan teks'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {isTooShort && (
                <span className="admin-input-hint hint-error">
                  Passkey minimal 6 karakter.
                </span>
              )}
              {isTooLong && (
                <span className="admin-input-hint hint-error">
                  Passkey maksimal 64 karakter.
                </span>
              )}
              {!isTooShort && !isTooLong && (
                <span className="admin-input-hint">
                  Gunakan frasa yang mudah dibagikan kepada peserta saat sesi workshop.
                </span>
              )}
            </div>

            {/* Reason Field */}
            <div className="admin-form-group">
              <div className="admin-label-row">
                <label htmlFor="rotate-reason-input" className="admin-label">
                  Alasan Rotasi (Opsional)
                </label>
                <span className="admin-char-counter">{reason.length}/200</span>
              </div>
              <input
                id="rotate-reason-input"
                type="text"
                className="admin-input"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Contoh: Pergantian Sesi Pelatihan Batch 2"
                maxLength={200}
                disabled={isSubmitting}
              />
            </div>

            {/* Error message */}
            {errorMessage && (
              <div className="admin-alert admin-alert-error" role="alert">
                <span>⚠️</span>
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          <div className="admin-modal-footer">
            <button
              type="button"
              className="btn-admin-cancel"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn-admin-primary"
              disabled={isSubmitting || !isValidLength}
              id="btn-confirm-rotate"
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-sm" aria-hidden="true" />
                  <span>Menerapkan Rotasi...</span>
                </>
              ) : (
                <>
                  <span>Simpan & Terapkan Rotasi</span>
                  <span>🚀</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
