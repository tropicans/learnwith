import React, { useState } from 'react'
import type { WorkshopMode } from '../../../schemas/platformConfig.ts'

interface WorkshopModeCardProps {
  currentMode: WorkshopMode
  lastModeChange?: {
    mode: WorkshopMode
    changedAt: number
    changedBy: string
    reason?: string
  }
  isUpdating: boolean
  onUpdateMode: (mode: WorkshopMode, reason?: string) => Promise<void>
}

export function WorkshopModeCard({
  currentMode,
  lastModeChange,
  isUpdating,
  onUpdateMode,
}: WorkshopModeCardProps) {
  const [selectedMode, setSelectedMode] = useState<WorkshopMode>(currentMode)
  const [reason, setReason] = useState('')

  // Sync selected mode if currentMode changes externally
  React.useEffect(() => {
    setSelectedMode(currentMode)
  }, [currentMode])

  const hasModeChanged = selectedMode !== currentMode

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!hasModeChanged || isUpdating) return
    await onUpdateMode(selectedMode, reason.trim() || undefined)
    setReason('')
  }

  const formatTimestamp = (timestamp?: number) => {
    if (!timestamp) return 'Belum pernah diubah'
    try {
      const d = new Date(timestamp)
      return d.toLocaleString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return 'Tanggal tidak valid'
    }
  }

  return (
    <div className="settings-card" id="workshop-mode-card">
      <div className="settings-card-header">
        <div className="settings-card-title-group">
          <div className="settings-card-icon" aria-hidden="true">
            🔄
          </div>
          <div>
            <h2 className="settings-card-title">Mode Operasional Workshop</h2>
            <p className="settings-card-subtitle">
              Atur alur navigasi global dan prioritas modul yang ditampilkan kepada seluruh peserta secara instan tanpa restart server.
            </p>
          </div>
        </div>

        <div className="current-mode-badge-wrap">
          <span className="mode-status-label">Mode Aktif Saat Ini:</span>
          <span
            className={`admin-status-pill ${
              currentMode === 'live-class' ? 'status-pill-resolved' : 'status-pill-investigating'
            }`}
            id="badge-active-workshop-mode"
          >
            <span className="admin-live-dot" aria-hidden="true" />
            {currentMode === 'live-class'
              ? '🚀 Mode Sesi Tatap Muka (Live Class / Hari-H)'
              : '📋 Mode Pra-Pelatihan Mandiri (Pre-Training)'}
          </span>
        </div>
      </div>

      <form onSubmit={handleApply} className="workshop-mode-form">
        <div className="mode-selector-group" role="radiogroup" aria-label="Pilihan Mode Workshop">
          {/* Option A: Pre-training */}
          <button
            type="button"
            role="radio"
            aria-checked={selectedMode === 'pretraining'}
            className={`mode-option-btn ${selectedMode === 'pretraining' ? 'selected' : ''}`}
            onClick={() => setSelectedMode('pretraining')}
            id="opt-mode-pretraining"
          >
            <div className="mode-option-header">
              <div className="mode-option-radio">
                <span className="radio-inner-circle" />
              </div>
              <div className="mode-option-title-wrap">
                <span className="mode-option-name">📋 Pra-Pelatihan Mandiri (Pre-Training)</span>
                <span className="mode-option-tag">Persiapan & Asinkron</span>
              </div>
            </div>
            <p className="mode-option-desc">
              Peserta fokus pada instalasi terminal, konfigurasi 9Router, dan uji checkpoint 1-3. Banner navigasi mengarahkan peserta ke modul persiapan mandiri.
            </p>
          </button>

          {/* Option B: Live Class */}
          <button
            type="button"
            role="radio"
            aria-checked={selectedMode === 'live-class'}
            className={`mode-option-btn ${selectedMode === 'live-class' ? 'selected' : ''}`}
            onClick={() => setSelectedMode('live-class')}
            id="opt-mode-live-class"
          >
            <div className="mode-option-header">
              <div className="mode-option-radio">
                <span className="radio-inner-circle" />
              </div>
              <div className="mode-option-title-wrap">
                <span className="mode-option-name">🚀 Sesi Tatap Muka (Live Class Hari-H)</span>
                <span className="mode-option-tag tag-live">Interaktif & Sinkron</span>
              </div>
            </div>
            <p className="mode-option-desc">
              Sesi workshop interaktif sedang berlangsung. Navigasi peserta secara otomatis memprioritaskan panduan live-class dan workspace praktik aktif.
            </p>
          </button>
        </div>

        {hasModeChanged && (
          <div className="mode-change-reason-row">
            <label htmlFor="mode-change-reason" className="settings-field-label">
              Catatan Perubahan (opsional, maks 200 karakter):
            </label>
            <input
              id="mode-change-reason"
              type="text"
              maxLength={200}
              placeholder="Contoh: Pembukaan Batch 2 BPSDM / Masuk Sesi Praktik Siang"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="settings-text-input"
            />
          </div>
        )}

        <div className="settings-action-row">
          <div className="mode-audit-text">
            {lastModeChange ? (
              <span>
                Terakhir diubah:{' '}
                <strong>{formatTimestamp(lastModeChange.changedAt)}</strong> oleh{' '}
                <span className="audit-author">{lastModeChange.changedBy}</span>
                {lastModeChange.reason ? ` — "${lastModeChange.reason}"` : ''}
              </span>
            ) : (
              <span>Status default sistem in-memory</span>
            )}
          </div>

          <button
            type="submit"
            className="btn-admin-primary"
            id="btn-apply-workshop-mode"
            disabled={!hasModeChanged || isUpdating}
          >
            {isUpdating ? (
              <>
                <span className="admin-spinner-small" aria-hidden="true" />
                <span>Menerapkan Mode...</span>
              </>
            ) : (
              <>
                <span>⚡ Terapkan Mode Workshop</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
