import React, { useState } from 'react'
import type {
  ParticipantRecord,
  TelemetryDashboardStats,
  TelemetryQueryFilter,
} from '../../schemas/telemetry'
import {
  generateParticipantCsv,
  generateParticipantJson,
  triggerFileDownload,
} from '../../utils/adminExport'

export interface ExportControlsProps {
  participants: ParticipantRecord[]
  stats?: TelemetryDashboardStats
  filter?: TelemetryQueryFilter
  disabled?: boolean
}

export function ExportControls({
  participants,
  stats,
  filter,
  disabled = false,
}: ExportControlsProps) {
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (message: string) => {
    setToastMessage(message)
    setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current))
    }, 2500)
  }

  const getDateSuffix = () => {
    try {
      return new Date().toISOString().slice(0, 10)
    } catch {
      return 'rekap'
    }
  }

  const handleExportCsv = () => {
    if (disabled || participants.length === 0) return

    try {
      const csvContent = generateParticipantCsv(participants)
      const filename = `learnwith-peserta-${getDateSuffix()}.csv`
      triggerFileDownload(csvContent, filename, 'text/csv;charset=utf-8;')
      showToast(`✓ Berhasil mengekspor ${participants.length} data peserta ke CSV (Excel)`)
    } catch (err) {
      console.error('Gagal mengekspor CSV:', err)
      showToast('⚠️ Terjadi kesalahan saat mengekspor data CSV')
    }
  }

  const handleExportJson = () => {
    if (disabled || participants.length === 0) return

    try {
      const jsonContent = generateParticipantJson(participants, stats, filter)
      const filename = `learnwith-peserta-${getDateSuffix()}.json`
      triggerFileDownload(jsonContent, filename, 'application/json;charset=utf-8;')
      showToast(`✓ Berhasil mengekspor ${participants.length} data peserta ke format JSON`)
    } catch (err) {
      console.error('Gagal mengekspor JSON:', err)
      showToast('⚠️ Terjadi kesalahan saat mengekspor data JSON')
    }
  }

  const isButtonDisabled = disabled || participants.length === 0

  return (
    <div className="admin-export-controls">
      <div className="admin-export-btn-group">
        <button
          type="button"
          className="admin-btn-export admin-btn-export-csv"
          onClick={handleExportCsv}
          disabled={isButtonDisabled}
          title={
            isButtonDisabled
              ? 'Tidak ada data peserta untuk diekspor'
              : `Ekspor ${participants.length} data peserta ke CSV (Excel)`
          }
          data-testid="export-csv-btn"
        >
          <span className="export-icon">📄</span>
          <span>Ekspor CSV (Excel)</span>
        </button>

        <button
          type="button"
          className="admin-btn-export admin-btn-export-json"
          onClick={handleExportJson}
          disabled={isButtonDisabled}
          title={
            isButtonDisabled
              ? 'Tidak ada data peserta untuk diekspor'
              : `Ekspor ${participants.length} data peserta ke format JSON`
          }
          data-testid="export-json-btn"
        >
          <span className="export-icon">📦</span>
          <span>Ekspor JSON</span>
        </button>
      </div>

      {toastMessage && (
        <div className="admin-export-toast" role="status" aria-live="polite">
          {toastMessage}
        </div>
      )}
    </div>
  )
}
