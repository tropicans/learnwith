import React, { useState, useEffect, useCallback } from 'react'
import type { CourseLifecycleRecord, CourseLifecycleStatus } from '../../../schemas/courseLifecycle'
import {
  adminGetCoursesLifecycleFn,
  adminUpdateCourseStatusFn,
} from '../../../server/courseLifecycle'
import { getClientAdminToken } from '../../../utils/adminToken'
import { showToast } from '../../ui/Toast'
import { CourseLifecycleKPIs } from './CourseLifecycleKPIs'
import { CourseStatusCards } from './CourseStatusCards'
import { CourseFilterToolbar, type FilterStatusOption } from './CourseFilterToolbar'

interface AdminCourseManagementViewProps {
  sessionToken?: string
}

export function AdminCourseManagementView({
  sessionToken,
}: AdminCourseManagementViewProps = {}) {
  const [records, setRecords] = useState<CourseLifecycleRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [lastRefreshedAt, setLastRefreshedAt] = useState<number>(Date.now())
  const [mutatingCourseId, setMutatingCourseId] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<FilterStatusOption>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const fetchCourses = useCallback(
    async (showLoadingSpinner = false) => {
      if (showLoadingSpinner) {
        setIsLoading(true)
      }
      setError(null)

      try {
        const activeToken = sessionToken || getClientAdminToken()
        const response = await adminGetCoursesLifecycleFn({
          data: activeToken ? { sessionToken: activeToken } : undefined,
        })
        if (response && response.courses) {
          setRecords(response.courses)
        }
        setLastRefreshedAt(Date.now())
      } catch (err: unknown) {
        const msg =
          'Gagal memuat data status kursus dari server. Periksa koneksi jaringan dan pastikan sesi Master Admin Anda masih aktif, lalu klik tombol \'Segarkan Data\'.'
        setError(msg)
      } finally {
        setIsLoading(false)
      }
    },
    [sessionToken],
  )

  useEffect(() => {
    fetchCourses(true)
  }, [fetchCourses])

  // 15-second polling interval when autoRefresh is enabled
  useEffect(() => {
    if (!autoRefresh) return

    const intervalId = setInterval(() => {
      fetchCourses(false)
    }, 15000)

    return () => clearInterval(intervalId)
  }, [autoRefresh, fetchCourses])

  const handleToggleVisibility = async (
    courseId: string,
    currentStatus: CourseLifecycleStatus,
  ) => {
    const targetStatus = currentStatus === 'active' ? 'hidden' : 'active'
    const actionLabel = targetStatus === 'hidden' ? 'disembunyikan' : 'ditampilkan'
    setMutatingCourseId(courseId)

    try {
      const activeToken = sessionToken || getClientAdminToken()
      const res = await adminUpdateCourseStatusFn({
        data: {
          courseId,
          targetStatus,
          sessionToken: activeToken,
        },
      })
      showToast(
        res?.message || `Status kursus "${courseId}" berhasil ${actionLabel}.`,
        'success',
      )
      await fetchCourses(false)
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Gagal memperbarui visibilitas kursus.'
      showToast(msg, 'danger')
    } finally {
      setMutatingCourseId(null)
    }
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

  // Calculate status counts for filter pills
  const statusCounts: Record<FilterStatusOption, number> = {
    all: records.length,
    active: records.filter((r) => r.status === 'active').length,
    hidden: records.filter((r) => r.status === 'hidden').length,
    archived: records.filter((r) => r.status === 'archived').length,
    deleted: records.filter((r) => r.status === 'deleted').length,
  }

  // Filter courses by selectedStatus and searchQuery
  const filteredCourses = records.filter((course) => {
    // 1. Status Filter
    if (selectedStatus !== 'all' && course.status !== selectedStatus) {
      return false
    }

    // 2. Search Query Filter (title or id case-insensitive)
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim()
      const titleMatch = course.title.toLowerCase().includes(q)
      const idMatch = course.id.toLowerCase().includes(q)
      if (!titleMatch && !idMatch) {
        return false
      }
    }

    return true
  })

  const handleResetFilters = () => {
    setSelectedStatus('all')
    setSearchQuery('')
  }

  return (
    <div className="admin-courses-container" id="admin-courses-view">
      {/* View Header */}
      <div className="admin-view-header">
        <div>
          <h2 className="admin-view-title">Manajemen Kursus &amp; Status Siklus</h2>
          <p className="admin-view-subtitle">
            Kelola visibilitas katalog publik, arsip kurikulum, dan penonaktifan kursus secara aman.
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
            onClick={() => fetchCourses(true)}
            disabled={isLoading}
            title="Refresh manual data kursus"
            id="btn-refresh-courses"
          >
            <span className={isLoading ? 'spinner-sm' : ''} aria-hidden="true">
              {isLoading ? '⏳' : '🔄'}
            </span>
            <span>Segarkan Data</span>
          </button>

          <span className="admin-last-sync-tag">
            Sinkron: {formatLastRefresh(lastRefreshedAt)}
          </span>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="admin-alert admin-alert-error" role="alert">
          <span>⚠️</span>
          <span style={{ flex: 1 }}>{error}</span>
          <button
            type="button"
            className="btn-retry"
            onClick={() => fetchCourses(true)}
          >
            Segarkan Data
          </button>
        </div>
      )}

      {/* Course Lifecycle KPIs */}
      <CourseLifecycleKPIs records={records} isLoading={isLoading} />

      {/* Course Filter Toolbar */}
      <CourseFilterToolbar
        selectedStatus={selectedStatus}
        onSelectStatus={setSelectedStatus}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        counts={statusCounts}
      />

      {/* Course Status Cards */}
      <CourseStatusCards
        courses={filteredCourses}
        onToggleVisibility={handleToggleVisibility}
        onResetFilters={handleResetFilters}
        mutatingCourseId={mutatingCourseId}
        isLoading={isLoading}
      />
    </div>
  )
}
