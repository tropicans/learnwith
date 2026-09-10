import React from 'react'
import type {
  CourseLifecycleRecord,
  CourseLifecycleStatus,
} from '../../../schemas/courseLifecycle'

export interface CourseKPISummary {
  total: number
  active: number
  hidden: number
  archived: number
  deleted: number
}

export function calculateCourseKPIs(
  records: Array<{ status: CourseLifecycleStatus }>,
): CourseKPISummary {
  return {
    total: records.length,
    active: records.filter((r) => r.status === 'active').length,
    hidden: records.filter((r) => r.status === 'hidden').length,
    archived: records.filter((r) => r.status === 'archived').length,
    deleted: records.filter((r) => r.status === 'deleted').length,
  }
}

export interface CourseLifecycleKPIsProps {
  records: CourseLifecycleRecord[]
  isLoading?: boolean
}

export function CourseLifecycleKPIs({
  records,
  isLoading = false,
}: CourseLifecycleKPIsProps) {
  if (isLoading) {
    return (
      <div className="admin-kpi-grid admin-course-kpi-grid" aria-busy="true" aria-label="Memuat ringkasan KPI kursus">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="admin-kpi-card admin-kpi-skeleton">
            <div className="skeleton-line skeleton-title" />
            <div className="skeleton-line skeleton-value" />
            <div className="skeleton-line skeleton-subtitle" />
          </div>
        ))}
      </div>
    )
  }

  const kpis = calculateCourseKPIs(records)

  return (
    <div className="admin-kpi-grid admin-course-kpi-grid" role="region" aria-label="Ringkasan Metrik Status Kursus">
      {/* 1. Total Kursus */}
      <div className="admin-kpi-card" id="kpi-total-courses">
        <div className="kpi-header">
          <span className="kpi-title">Total Kursus</span>
          <span className="kpi-icon-pill" aria-hidden="true">📚</span>
        </div>
        <div className="kpi-body">
          <div className="kpi-value-row">
            <span className="kpi-primary-val">{kpis.total}</span>
            <span className="kpi-unit">modul</span>
          </div>
          <p className="kpi-subtitle">Seluruh kursus terdaftar</p>
        </div>
      </div>

      {/* 2. Aktif di Katalog */}
      <div className="admin-kpi-card" id="kpi-active-courses">
        <div className="kpi-header">
          <span className="kpi-title">Aktif di Katalog</span>
          <span className="kpi-status-badge kpi-badge-success">Aktif</span>
        </div>
        <div className="kpi-body">
          <div className="kpi-value-row">
            <span className="kpi-primary-val text-success">{kpis.active}</span>
            <span className="kpi-unit">publik</span>
          </div>
          <p className="kpi-subtitle">Tersedia untuk publik</p>
        </div>
      </div>

      {/* 3. Tersembunyi */}
      <div className="admin-kpi-card" id="kpi-hidden-courses">
        <div className="kpi-header">
          <span className="kpi-title">Tersembunyi</span>
          <span className="kpi-status-badge kpi-badge-warning">Hidden</span>
        </div>
        <div className="kpi-body">
          <div className="kpi-value-row">
            <span className="kpi-primary-val text-warning">{kpis.hidden}</span>
            <span className="kpi-unit">khusus</span>
          </div>
          <p className="kpi-subtitle">Akses via link langsung</p>
        </div>
      </div>

      {/* 4. Diarsipkan */}
      <div className="admin-kpi-card" id="kpi-archived-courses">
        <div className="kpi-header">
          <span className="kpi-title">Diarsipkan</span>
          <span className="kpi-status-badge kpi-badge-muted">Arsip</span>
        </div>
        <div className="kpi-body">
          <div className="kpi-value-row">
            <span className="kpi-primary-val text-muted">{kpis.archived}</span>
            <span className="kpi-unit">modul</span>
          </div>
          <p className="kpi-subtitle">Riwayat kurikulum lampau</p>
        </div>
      </div>

      {/* 5. Dinonaktifkan */}
      <div className="admin-kpi-card" id="kpi-deleted-courses">
        <div className="kpi-header">
          <span className="kpi-title">Dinonaktifkan</span>
          <span className="kpi-status-badge kpi-badge-danger">Nonaktif</span>
        </div>
        <div className="kpi-body">
          <div className="kpi-value-row">
            <span className="kpi-primary-val text-danger">{kpis.deleted}</span>
            <span className="kpi-unit">nonaktif</span>
          </div>
          <p className="kpi-subtitle">Dinonaktifkan aman</p>
        </div>
      </div>
    </div>
  )
}
