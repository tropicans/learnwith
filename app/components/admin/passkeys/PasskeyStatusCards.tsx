import React, { useState } from 'react'
import type { CourseId, CoursePasskeyRecord } from '../../../schemas/passkey'

interface PasskeyStatusCardsProps {
  passkeys: Partial<Record<CourseId, CoursePasskeyRecord>>
  onRotate: (courseId: CourseId) => void
  isLoading?: boolean
}

export function PasskeyStatusCards({
  passkeys,
  onRotate,
  isLoading = false,
}: PasskeyStatusCardsProps) {
  const [copiedHash, setCopiedHash] = useState<string | null>(null)
  const [revealedKeys, setRevealedKeys] = useState<Record<CourseId, boolean>>({
    word: false,
    ai: false,
  })

  const copyToClipboard = async (text: string, keyId: string) => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text)
      } else {
        const textarea = document.createElement('textarea')
        textarea.value = text
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }
      setCopiedHash(keyId)
      setTimeout(() => setCopiedHash(null), 2500)
    } catch {
      // Fallback
    }
  }

  const toggleReveal = (courseId: CourseId) => {
    setRevealedKeys((prev) => ({
      ...prev,
      [courseId]: !prev[courseId],
    }))
  }

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

  const courses: CourseId[] = ['word', 'ai']

  return (
    <div className="admin-passkey-cards-grid" id="admin-passkey-cards-grid">
      {courses.map((courseId) => {
        const record = passkeys[courseId]
        if (!record) return null

        const isWord = courseId === 'word'
        const courseIcon = isWord ? '📝' : '🤖'
        const isRevealed = Boolean(revealedKeys[courseId])
        const isCopied = copiedHash === courseId

        return (
          <div
            key={courseId}
            className={`admin-passkey-card ${isWord ? 'theme-word' : 'theme-ai'} ${
              isLoading ? 'is-loading' : ''
            }`}
            id={`passkey-card-${courseId}`}
          >
            <div className="passkey-card-header">
              <div className="passkey-course-info">
                <div className="passkey-course-icon" aria-hidden="true">
                  {courseIcon}
                </div>
                <div>
                  <h3 className="passkey-course-title">{record.title}</h3>
                  <span className="passkey-course-id-tag">Modul: {courseId.toUpperCase()}</span>
                </div>
              </div>
              <div className="passkey-status-pill active">
                <span className="passkey-active-dot" aria-hidden="true" />
                <span>Aktif • Versi {record.version}</span>
              </div>
            </div>

            <div className="passkey-card-body">
              {/* Masked Passkey Preview */}
              <div className="passkey-field-group">
                <div className="passkey-field-label-row">
                  <span className="passkey-field-label">Masked Passkey Preview</span>
                  <button
                    type="button"
                    className="btn-passkey-toggle-reveal"
                    onClick={() => toggleReveal(courseId)}
                    title={isRevealed ? 'Sembunyikan format terselubung' : 'Lihat format terselubung'}
                  >
                    {isRevealed ? '👁️ Sembunyikan' : '👁️‍🗨️ Perlihatkan'}
                  </button>
                </div>
                <div className="passkey-preview-box">
                  <span className="passkey-preview-text">
                    {isRevealed ? record.clearTextPreview : '••••••••••••'}
                  </span>
                  <span className="passkey-masked-hint">
                    {isRevealed ? '(Disimpan sebagai hash satu arah)' : '(Klik untuk lihat hint)'}
                  </span>
                </div>
              </div>

              {/* SHA-256 Hash Display */}
              <div className="passkey-field-group">
                <div className="passkey-field-label-row">
                  <span className="passkey-field-label">SHA-256 Hash Digest</span>
                  <button
                    type="button"
                    className={`btn-passkey-copy ${isCopied ? 'copied' : ''}`}
                    onClick={() => copyToClipboard(record.currentHash, courseId)}
                    title="Salin SHA-256 Hash lengkap"
                  >
                    {isCopied ? '✅ Tersalin!' : '📋 Salin Hash'}
                  </button>
                </div>
                <div className="passkey-hash-box">
                  <code className="passkey-hash-code" title={record.currentHash}>
                    {record.currentHash}
                  </code>
                </div>
              </div>

              {/* Metadata row */}
              <div className="passkey-meta-row">
                <div className="passkey-meta-item">
                  <span className="passkey-meta-label">Terakhir Dirotasi:</span>
                  <span className="passkey-meta-value">{formatDate(record.lastRotatedAt)}</span>
                </div>
                <div className="passkey-meta-item">
                  <span className="passkey-meta-label">Dirotasi Oleh:</span>
                  <span className="passkey-meta-badge">{record.rotatedBy}</span>
                </div>
              </div>
            </div>

            <div className="passkey-card-footer">
              <button
                type="button"
                className="btn-admin-rotate-passkey"
                onClick={() => onRotate(courseId)}
                id={`btn-rotate-${courseId}`}
              >
                <span>🔄</span>
                <span>Rotasi Passkey {isWord ? 'Word' : 'AI'}</span>
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
