import React from 'react'
import type { TelemetryDashboardStats } from '../../schemas/telemetry'

export interface DashboardKPIsProps {
  stats: TelemetryDashboardStats
  isLoading?: boolean
}

export function DashboardKPIs({ stats, isLoading = false }: DashboardKPIsProps) {
  if (isLoading) {
    return (
      <div className="admin-kpi-grid" aria-busy="true" aria-label="Memuat ringkasan KPI">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="admin-kpi-card admin-kpi-skeleton">
            <div className="skeleton-line skeleton-title" />
            <div className="skeleton-line skeleton-value" />
            <div className="skeleton-line skeleton-subtitle" />
          </div>
        ))}
      </div>
    )
  }

  const isQuizAvailable = stats.averageQuizScore > 0
  const quizBadgeClass = isQuizAvailable
    ? stats.averageQuizScore >= 70
      ? 'kpi-badge-success'
      : 'kpi-badge-warning'
    : 'kpi-badge-muted'

  const quizBadgeText = isQuizAvailable
    ? stats.averageQuizScore >= 70
      ? 'Memenuhi'
      : 'Di Bawah Target'
    : 'Belum ada data'

  return (
    <div className="admin-kpi-grid" role="region" aria-label="Ringkasan Metrik KPI">
      {/* 1. Total Peserta Terdaftar */}
      <div className="admin-kpi-card" id="kpi-total-participants">
        <div className="kpi-header">
          <span className="kpi-title">Total Peserta Terdaftar</span>
          <span className="kpi-live-indicator" title="Indikator Pemantauan Langsung">
            <span className="admin-live-dot" aria-hidden="true" />
            <span className="kpi-live-text">Live</span>
          </span>
        </div>
        <div className="kpi-body">
          <div className="kpi-value-row">
            <span className="kpi-primary-val">{stats.totalParticipants}</span>
            <span className="kpi-unit">orang</span>
          </div>
          <p className="kpi-subtitle">
            <strong className="kpi-highlight-active">{stats.activeParticipants}</strong> aktif dalam 15 menit terakhir
          </p>
        </div>
      </div>

      {/* 2. Kelulusan Checkpoint */}
      <div className="admin-kpi-card" id="kpi-checkpoint-rate">
        <div className="kpi-header">
          <span className="kpi-title">Kelulusan Checkpoint</span>
          <span className="kpi-icon-pill" aria-hidden="true">🎯</span>
        </div>
        <div className="kpi-body">
          <div className="kpi-value-row">
            <span className="kpi-primary-val">{stats.checkpointCompletionRate}%</span>
          </div>
          <div className="kpi-progress-track" title={`Kelulusan Checkpoint: ${stats.checkpointCompletionRate}%`}>
            <div
              className="kpi-progress-fill"
              style={{ width: `${Math.min(100, Math.max(0, stats.checkpointCompletionRate))}%` }}
              role="progressbar"
              aria-valuenow={stats.checkpointCompletionRate}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
          <p className="kpi-subtitle">Akumulasi Checkpoint 1–3 seluruh modul</p>
        </div>
      </div>

      {/* 3. Rata-rata Evaluasi Kuis */}
      <div className="admin-kpi-card" id="kpi-average-quiz">
        <div className="kpi-header">
          <span className="kpi-title">Rata-rata Evaluasi Kuis</span>
          <span className={`kpi-status-badge ${quizBadgeClass}`}>
            {quizBadgeText}
          </span>
        </div>
        <div className="kpi-body">
          <div className="kpi-value-row">
            <span className="kpi-primary-val">
              {isQuizAvailable ? stats.averageQuizScore : '—'}
            </span>
            {isQuizAvailable && <span className="kpi-unit">/ 100</span>}
          </div>
          <p className="kpi-subtitle">Evaluasi pemahaman ASN (Modul Word)</p>
        </div>
      </div>

      {/* 4. Kesiapan Workshop */}
      <div className="admin-kpi-card" id="kpi-readiness-ratio">
        <div className="kpi-header">
          <span className="kpi-title">Kesiapan Workshop</span>
          <span className="kpi-icon-pill" aria-hidden="true">⚡</span>
        </div>
        <div className="kpi-body">
          <div className="kpi-value-row">
            <span className="kpi-primary-val">{stats.readyRatio}%</span>
            <span className="kpi-unit-label">Siap</span>
          </div>
          <div className="kpi-split-bar" title={`Siap: ${stats.readyRatio}%, Klinik: ${stats.clinicRatio}%`}>
            <div
              className="kpi-split-segment kpi-split-ready"
              style={{ width: `${Math.min(100, Math.max(0, stats.readyRatio))}%` }}
              aria-label={`Siap ${stats.readyRatio}%`}
            />
            <div
              className="kpi-split-segment kpi-split-clinic"
              style={{ width: `${Math.min(100, Math.max(0, stats.clinicRatio))}%` }}
              aria-label={`Klinik ${stats.clinicRatio}%`}
            />
          </div>
          <p className="kpi-subtitle">
            <strong className="kpi-highlight-clinic">{stats.clinicRatio}%</strong> Perlu Pendampingan Klinik
          </p>
        </div>
      </div>
    </div>
  )
}
