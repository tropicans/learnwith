import { useState, useEffect } from 'react'
import { verifyInstructorPasskeyFn } from '@/server/auth'
import { getOrCreateClientId } from '@/utils/telemetryClient'

interface InstructorUnlockModalProps {
  courseId: 'ai' | 'word'
  isOpen: boolean
  onClose: () => void
  onUnlocked: (unlockedAt: number) => void
}

export function InstructorUnlockModal({
  courseId,
  isOpen,
  onClose,
  onUnlocked,
}: InstructorUnlockModalProps) {
  const [passkey, setPasskey] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isPending, setIsPending] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setPasskey('')
      setErrorMessage('')
      setIsPending(false)
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isPending) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, isPending, onClose])

  if (!isOpen) return null

  const courseTitle = courseId === 'ai' ? 'Hands-on Agentic AI' : 'Word Processing ASN'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!passkey.trim()) {
      setErrorMessage('Passkey wajib diisi.')
      return
    }

    setErrorMessage('')
    setIsPending(true)

    try {
      const clientId = getOrCreateClientId()
      const result = await verifyInstructorPasskeyFn({
        data: { courseId, passkey: passkey.trim(), clientId },
      })

      if (result.success) {
        onUnlocked(result.unlockedAt || Date.now())
        onClose()
      } else {
        setErrorMessage(result.message || 'Passkey instruktur tidak valid atau salah.')
      }
    } catch {
      setErrorMessage('Terjadi kesalahan jaringan saat memverifikasi passkey.')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div
      className="modal modal-locked open"
      role="dialog"
      aria-modal="true"
      aria-labelledby="instructor-unlock-title"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1rem',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isPending) {
          onClose()
        }
      }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '2rem',
          maxWidth: '440px',
          width: '100%',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #e2e8f0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '1.25rem',
            }}
          >
            🔒
          </div>
          <div>
            <h3
              id="instructor-unlock-title"
              style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}
            >
              Buka Sesi Instruktur
            </h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
              Akses materi dan live class {courseTitle}
            </p>
          </div>
        </div>

        <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '1.25rem', lineHeight: 1.5 }}>
          Masukkan passkey instruktur yang diberikan saat workshop untuk membuka kunci live class atau modul khusus.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label
              htmlFor="instructor-passkey-input"
              style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}
            >
              Passkey Instruktur
            </label>
            <input
              id="instructor-passkey-input"
              type="password"
              value={passkey}
              onChange={(e) => setPasskey(e.target.value)}
              placeholder="Masukkan passkey..."
              disabled={isPending}
              autoFocus
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: errorMessage ? '1px solid #ef4444' : '1px solid #cbd5e1',
                fontSize: '0.95rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {errorMessage && (
            <div
              role="alert"
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: '#fef2f2',
                color: '#b91c1c',
                borderRadius: '8px',
                fontSize: '0.85rem',
                marginBottom: '1.25rem',
                border: '1px solid #fecaca',
              }}
            >
              ⚠️ {errorMessage}
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#f8fafc',
                color: '#475569',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: isPending ? 'not-allowed' : 'pointer',
              }}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isPending}
              style={{
                padding: '0.65rem 1.5rem',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: isPending ? 'not-allowed' : 'pointer',
                boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)',
              }}
            >
              {isPending ? 'Memverifikasi...' : 'Buka Kunci'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
