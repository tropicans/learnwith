import React, { useState, useEffect, useCallback } from 'react'
import type { CourseLifecycleRecord, CourseLifecycleStatus } from '../../../schemas/courseLifecycle'
import {
  adminGetCoursesLifecycleFn,
  adminUpdateCourseStatusFn,
} from '../../../server/courseLifecycle'
import { getClientAdminToken } from '../../../utils/adminToken'
import { showToast } from '../../ui/Toast'

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
    </div>
  )
}
