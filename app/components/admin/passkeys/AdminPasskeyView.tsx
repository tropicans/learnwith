import React, { useState, useEffect, useCallback } from 'react'
import type {
  CourseId,
  PasskeyStatusResponse,
  RotatePasskeyResult,
} from '../../../schemas/passkey'
import { adminGetPasskeyStatusFn } from '../../../server/passkey'
import { PasskeyStatusCards } from './PasskeyStatusCards'
import { PasskeyRotateModal } from './PasskeyRotateModal'
import { PasskeyHistoryTable } from './PasskeyHistoryTable'
import { PasskeyAuditLogTable } from './PasskeyAuditLogTable'

export function AdminPasskeyView() {
  const [data, setData] = useState<PasskeyStatusResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [lastRefreshedAt, setLastRefreshedAt] = useState<number>(Date.now())

  // Modal State
  const [rotatingCourseId, setRotatingCourseId] = useState<CourseId | null>(null)
  const [feedbackMessage, setFeedbackMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  const fetchStatus = useCallback(async (showLoadingSpinner = false) => {
    if (showLoadingSpinner) {
      setIsLoading(true)
    }
    setError(null)

    try {
      const response = await adminGetPasskeyStatusFn()
      setData(response)
      setLastRefreshedAt(Date.now())
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memuat status passkey dari server.'
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStatus(true)
  }, [fetchStatus])

  // Auto-refresh interval (15s)
  useEffect(() => {
    if (!autoRefresh) return

    const intervalId = setInterval(() => {
      fetchStatus(false)
    }, 15000)

    return () => clearInterval(intervalId)
  }, [autoRefresh, fetchStatus])

  const handleOpenRotate = (courseId: CourseId) => {
    setRotatingCourseId(courseId)
  }

  const handleCloseRotate = () => {
    setRotatingCourseId(null)
  }

  const handleRotateSuccess = (result: RotatePasskeyResult) => {
    setFeedbackMessage({
      type: 'success',
      text: result.message,
    })
    fetchStatus(false)
    setTimeout(() => {
      setFeedbackMessage(null)
    }, 6000)
  }

  const formatLastRefresh = (timestamp: number) => {
    try {
      return new Date(timestamp).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    } catch {
      return 'Baru saja'
    }
  }

  const stats = data?.stats || {
    totalAttempts: 0,
    successAttempts: 0,
    failedAttempts: 0,
    rateLimitedAttempts: 0,
  }

  return (
    <div className="admin-passkey-view" id="admin-passkey-view">
      {/* View Header */}
      <div className="admin-view-header">
        <div>
          <h2 className="admin-view-title">Manajemen Passkey Modul Dinas</h2>
          <p className="admin-view-subtitle">
            Pusat kendali passkey workshop Course 2 (Pengolahan Kata ASN) dan Course 1 (Agentic AI)
            dengan rotasi dinamis tanpa restart server, audit attempt tamper-evident, dan perlindungan rate limiting.
          </p>
        </div>

        <div className="admin-view-actions">
          <label className="admin-toggle-label" title="Pembaruan otomatis data setiap 15 detik">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="admin-toggle-input"
            />
            <span className="admin-toggle-text">Auto-Refresh (15s)</span>
          </label>

          <button
            type="button"
            className="btn-admin-refresh"
            onClick={() => fetchStatus(true)}
            disabled={isLoading}
            title="Refresh manual data passkey"
          >
            <span className={isLoading ? 'spinner-sm' : ''} aria-hidden="true">
              {isLoading ? '⏳' : '🔄'}
            </span>
            <span>Refresh</span>
          </button>

          <span className="admin-last-sync-tag">
            Sinkron: {formatLastRefresh(lastRefreshedAt)}
          </span>
        </div>
      </div>

      {/* Inline Feedback Banner */}
      {feedbackMessage && (
        <div
          className={`admin-alert ${
            feedbackMessage.type === 'success' ? 'admin-alert-success' : 'admin-alert-error'
          }`}
          role="status"
        >
          <span>{feedbackMessage.type === 'success' ? '🎉' : '⚠️'}</span>
          <span style={{ flex: 1 }}>{feedbackMessage.text}</span>
          <button
            type="button"
            className="btn-dismiss-alert"
            onClick={() => setFeedbackMessage(null)}
            aria-label="Tutup notifikasi"
          >
            ✕
          </button>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="admin-alert admin-alert-error" role="alert">
          <span>⚠️</span>
          <span>{error}</span>
          <button
            type="button"
            className="btn-retry"
            onClick={() => fetchStatus(true)}
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="admin-passkey-kpis-grid">
        <div className="admin-kpi-card" id="kpi-total-attempts">
          <div className="kpi-header">
            <span className="kpi-title">Total Percobaan Unlock</span>
            <span className="kpi-icon-pill">🎯</span>
          </div>
          <div className="kpi-body">
            <div className="kpi-value-row">
              <span className="kpi-primary-val">{stats.totalAttempts}</span>
              <span className="kpi-unit">kali</span>
            </div>
            <p className="kpi-subtitle">Semua modul kursus sejak server aktif</p>
          </div>
        </div>

        <div className="admin-kpi-card" id="kpi-success-attempts">
          <div className="kpi-header">
            <span className="kpi-title">Percobaan Berhasil</span>
            <span className="kpi-icon-pill">✅</span>
          </div>
          <div className="kpi-body">
            <div className="kpi-value-row">
              <span className="kpi-primary-val" style={{ color: '#86efac' }}>
                {stats.successAttempts}
              </span>
              <span className="kpi-unit">
                ({stats.totalAttempts > 0 ? Math.round((stats.successAttempts / stats.totalAttempts) * 100) : 0}%)
              </span>
            </div>
            <p className="kpi-subtitle">Peserta terverifikasi masuk modul</p>
          </div>
        </div>

        <div className="admin-kpi-card" id="kpi-failed-attempts">
          <div className="kpi-header">
            <span className="kpi-title">Percobaan Gagal</span>
            <span className="kpi-icon-pill">❌</span>
          </div>
          <div className="kpi-body">
            <div className="kpi-value-row">
              <span className="kpi-primary-val" style={{ color: '#fca5a5' }}>
                {stats.failedAttempts}
              </span>
              <span className="kpi-unit">kali</span>
            </div>
            <p className="kpi-subtitle">Passkey salah atau typo peserta</p>
          </div>
        </div>

        <div className="admin-kpi-card" id="kpi-ratelimited-attempts">
          <div className="kpi-header">
            <span className="kpi-title">Percobaan Terblokir</span>
            <span className="kpi-icon-pill">🛡️</span>
          </div>
          <div className="kpi-body">
            <div className="kpi-value-row">
              <span className="kpi-primary-val" style={{ color: '#fcd34d' }}>
                {stats.rateLimitedAttempts}
              </span>
              <span className="kpi-unit">dibatasi</span>
            </div>
            <p className="kpi-subtitle">Sliding-window (5 fail/5 min, 2 min cooldown)</p>
          </div>
        </div>
      </div>

      {/* Active Passkey Cards (Course 2 & Course 1) */}
      {data?.passkeys && (
        <PasskeyStatusCards
          passkeys={data.passkeys}
          onRotate={handleOpenRotate}
          isLoading={isLoading}
        />
      )}

      {/* Rotation History Table */}
      {data?.rotationHistory && (
        <PasskeyHistoryTable
          history={data.rotationHistory}
          isLoading={isLoading}
        />
      )}

      {/* Audit Log Table */}
      {data?.recentAttempts && (
        <PasskeyAuditLogTable
          attempts={data.recentAttempts}
          isLoading={isLoading}
        />
      )}

      {/* Rotation Modal */}
      {rotatingCourseId && data?.passkeys && (
        <PasskeyRotateModal
          isOpen={Boolean(rotatingCourseId)}
          courseId={rotatingCourseId}
          currentRecord={data.passkeys[rotatingCourseId]}
          onClose={handleCloseRotate}
          onSuccess={handleRotateSuccess}
        />
      )}
    </div>
  )
}
