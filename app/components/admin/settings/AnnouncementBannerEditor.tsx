import React, { useState } from 'react'
import type {
  AnnouncementBanner,
  AnnouncementBannerType,
  UpdateAnnouncementBannerInput,
} from '../../../schemas/platformConfig.ts'

interface AnnouncementBannerEditorProps {
  currentBanner: AnnouncementBanner
  isUpdating: boolean
  onUpdateBanner: (input: Omit<UpdateAnnouncementBannerInput, 'sessionToken'>) => Promise<void>
}

export function AnnouncementBannerEditor({
  currentBanner,
  isUpdating,
  onUpdateBanner,
}: AnnouncementBannerEditorProps) {
  const [enabled, setEnabled] = useState<boolean>(currentBanner.enabled)
  const [type, setType] = useState<AnnouncementBannerType>(currentBanner.type)
  const [message, setMessage] = useState<string>(currentBanner.message)
  const [linkText, setLinkText] = useState<string>(currentBanner.linkText || '')
  const [linkUrl, setLinkUrl] = useState<string>(currentBanner.linkUrl || '')
  const [urlError, setUrlError] = useState<string | null>(null)

  // Sync state if currentBanner updates externally
  React.useEffect(() => {
    setEnabled(currentBanner.enabled)
    setType(currentBanner.type)
    setMessage(currentBanner.message)
    setLinkText(currentBanner.linkText || '')
    setLinkUrl(currentBanner.linkUrl || '')
  }, [currentBanner])

  const validateUrl = (val: string): boolean => {
    if (!val.trim()) {
      setUrlError(null)
      return true
    }
    const trimmed = val.trim()
    if (trimmed.startsWith('/')) {
      if (/^\/[a-zA-Z0-9/_#-]*$/.test(trimmed)) {
        setUrlError(null)
        return true
      }
      setUrlError('Format path relatif tidak valid (contoh: /course/ai#checkpoint-2)')
      return false
    }
    try {
      new URL(trimmed)
      setUrlError(null)
      return true
    } catch {
      setUrlError('URL harus diawali dengan https:// atau path relatif /...')
      return false
    }
  }

  const handleLinkUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setLinkUrl(val)
    validateUrl(val)
  }

  const handleBroadcast = async (broadcastEnabled: boolean) => {
    if (broadcastEnabled && !message.trim()) {
      return
    }
    if (linkUrl.trim() && !validateUrl(linkUrl)) {
      return
    }

    await onUpdateBanner({
      enabled: broadcastEnabled,
      message: message.trim(),
      type,
      linkText: linkText.trim() || undefined,
      linkUrl: linkUrl.trim() || undefined,
    })
  }

  const charCount = message.length
  const isMessageValid = message.trim().length > 0 && message.length <= 280

  const getUrgencyIcon = (t: AnnouncementBannerType) => {
    switch (t) {
      case 'warning':
        return '⚠️'
      case 'alert':
        return '🚨'
      case 'info':
      default:
        return 'ℹ️'
    }
  }

  return (
    <div className="settings-card" id="announcement-banner-editor-card">
      <div className="settings-card-header">
        <div className="settings-card-title-group">
          <div className="settings-card-icon" aria-hidden="true">
            📢
          </div>
          <div>
            <h2 className="settings-card-title">Pengumuman Global (Announcement Banner)</h2>
            <p className="settings-card-subtitle">
              Siarkan pesan pengumuman real-time ke bilah atas layar seluruh peserta. Pembaruan pengumuman otomatis mereset cache penutupan peserta.
            </p>
          </div>
        </div>

        <div className="current-mode-badge-wrap">
          <span className="mode-status-label">Status Siaran:</span>
          <span
            className={`admin-status-pill ${
              currentBanner.enabled ? 'status-pill-resolved' : 'status-pill-open'
            }`}
            id="badge-banner-status"
          >
            <span className="admin-live-dot" aria-hidden="true" />
            {currentBanner.enabled ? 'Aktif Mengudara (Broadcast Live)' : 'Tidak Aktif (Off)'}
          </span>
        </div>
      </div>

      <div className="banner-editor-container">
        {/* Urgency Type Selector */}
        <div className="settings-form-row">
          <label className="settings-field-label">Tingkat Urgensi Pengumuman:</label>
          <div className="urgency-selector-group" role="radiogroup" aria-label="Tingkat Urgensi">
            <button
              type="button"
              role="radio"
              aria-checked={type === 'info'}
              className={`urgency-pill-btn urgency-info ${type === 'info' ? 'selected' : ''}`}
              onClick={() => setType('info')}
              id="urgency-opt-info"
            >
              <span className="urgency-icon">ℹ️</span>
              <span className="urgency-label">Info (Biru)</span>
              <span className="urgency-desc">Panduan umum / materi baru</span>
            </button>

            <button
              type="button"
              role="radio"
              aria-checked={type === 'warning'}
              className={`urgency-pill-btn urgency-warning ${type === 'warning' ? 'selected' : ''}`}
              onClick={() => setType('warning')}
              id="urgency-opt-warning"
            >
              <span className="urgency-icon">⚠️</span>
              <span className="urgency-label">Perhatian (Kuning)</span>
              <span className="urgency-desc">Pengingat waktu & checkpoint</span>
            </button>

            <button
              type="button"
              role="radio"
              aria-checked={type === 'alert'}
              className={`urgency-pill-btn urgency-alert ${type === 'alert' ? 'selected' : ''}`}
              onClick={() => setType('alert')}
              id="urgency-opt-alert"
            >
              <span className="urgency-icon">🚨</span>
              <span className="urgency-label">Darurat (Merah)</span>
              <span className="urgency-desc">Pergantian link Zoom / kendala</span>
            </button>
          </div>
        </div>

        {/* Message Input */}
        <div className="settings-form-row">
          <div className="field-label-with-meta">
            <label htmlFor="banner-message-textarea" className="settings-field-label">
              Pesan Pengumuman: <span className="field-required">*</span>
            </label>
            <span
              className={`char-counter ${charCount > 280 ? 'counter-danger' : charCount > 240 ? 'counter-warning' : ''}`}
            >
              {charCount} / 280 karakter
            </span>
          </div>
          <textarea
            id="banner-message-textarea"
            rows={3}
            maxLength={280}
            placeholder="Tuliskan pesan pengumuman untuk peserta di sini (contoh: Sesi Praktik Hari-H telah dimulai. Silakan buka checkpoint 2!)..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="settings-textarea"
          />
        </div>

        {/* Action Link Inputs */}
        <div className="link-inputs-grid">
          <div className="settings-form-row">
            <label htmlFor="banner-link-text" className="settings-field-label">
              Teks Tombol / Tautan (opsional, maks 40 char):
            </label>
            <input
              id="banner-link-text"
              type="text"
              maxLength={40}
              placeholder="Contoh: Buka Zoom Sesi Praktik"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              className="settings-text-input"
            />
          </div>

          <div className="settings-form-row">
            <label htmlFor="banner-link-url" className="settings-field-label">
              URL / Tautan Tindakan (opsional):
            </label>
            <input
              id="banner-link-url"
              type="text"
              placeholder="https://meet.google.com/xyz atau /course/ai#checkpoint"
              value={linkUrl}
              onChange={handleLinkUrlChange}
              className={`settings-text-input ${urlError ? 'input-error' : ''}`}
            />
            {urlError && <span className="field-error-text">{urlError}</span>}
          </div>
        </div>

        {/* Real-time Preview Box */}
        <div className="banner-preview-section">
          <div className="banner-preview-header">
            <span className="preview-heading">👁️ Tampilan Langsung di Layar Peserta (Live Preview):</span>
            <span className="preview-hint">
              {message.trim() ? 'Pratinjau real-time' : 'Ketikkan pesan untuk melihat pratinjau'}
            </span>
          </div>

          <div
            className={`banner-preview-box banner-preview-${type}`}
            id="banner-live-preview-box"
            role="region"
            aria-label="Live Banner Preview"
          >
            <div className="banner-preview-inner">
              <span className="banner-preview-icon" aria-hidden="true">
                {getUrgencyIcon(type)}
              </span>
              <p className="banner-preview-text">
                {message.trim() || 'Pesan pengumuman akan ditampilkan di sini dengan kontras tinggi...'}
              </p>
              {linkText.trim() && (
                <span className="banner-preview-link-btn">
                  <span>{linkText.trim()}</span>
                  <span className="preview-arrow">→</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="settings-action-row banner-action-row">
          <div className="banner-audit-meta">
            {currentBanner.updatedAt ? (
              <span>
                Terakhir diperbarui:{' '}
                {new Date(currentBanner.updatedAt).toLocaleString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}{' '}
                oleh {currentBanner.updatedBy} (ID: {currentBanner.id})
              </span>
            ) : null}
          </div>

          <div className="banner-btn-group">
            {currentBanner.enabled && (
              <button
                type="button"
                className="btn-admin-danger"
                id="btn-deactivate-banner"
                disabled={isUpdating}
                onClick={() => handleBroadcast(false)}
              >
                {isUpdating ? 'Memproses...' : '🚫 Nonaktifkan Pengumuman'}
              </button>
            )}

            <button
              type="button"
              className="btn-admin-primary"
              id="btn-broadcast-banner"
              disabled={!isMessageValid || Boolean(urlError) || isUpdating}
              onClick={() => handleBroadcast(true)}
            >
              {isUpdating ? (
                <>
                  <span className="admin-spinner-small" aria-hidden="true" />
                  <span>Menyiarkan...</span>
                </>
              ) : (
                <>
                  <span>📢 Siarkan Pengumuman Sekarang</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
