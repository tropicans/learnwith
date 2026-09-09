import React, { useState, useEffect, useCallback } from 'react'
import type {
  AdminPlatformConfig,
  UpdateAnnouncementBannerInput,
  WorkshopMode,
} from '../../../schemas/platformConfig.ts'
import {
  adminGetPlatformConfigFn,
  adminUpdateAnnouncementBannerFn,
  adminUpdateWorkshopModeFn,
} from '../../../server/platform.ts'
import { WorkshopModeCard } from './WorkshopModeCard.tsx'
import { AnnouncementBannerEditor } from './AnnouncementBannerEditor.tsx'
import { PlatformReadinessCard } from './PlatformReadinessCard.tsx'

export function AdminSettingsView() {
  const [config, setConfig] = useState<AdminPlatformConfig | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUpdatingMode, setIsUpdatingMode] = useState(false)
  const [isUpdatingBanner, setIsUpdatingBanner] = useState(false)
  const [notification, setNotification] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  // Auto-clear notification after 4 seconds
  useEffect(() => {
    if (!notification) return
    const timer = setTimeout(() => {
      setNotification(null)
    }, 4000)
    return () => clearTimeout(timer)
  }, [notification])

  const fetchConfig = useCallback(async (showLoading = false) => {
    if (showLoading) setIsLoading(true)
    setError(null)
    try {
      const data = await adminGetPlatformConfigFn()
      setConfig(data)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memuat konfigurasi platform dari server.'
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchConfig(true)
  }, [fetchConfig])

  const handleUpdateWorkshopMode = async (mode: WorkshopMode, reason?: string) => {
    setIsUpdatingMode(true)
    try {
      const res = await adminUpdateWorkshopModeFn({
        data: { mode, reason },
      })
      setNotification({
        type: 'success',
        message: res.message,
      })
      await fetchConfig(false)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal mengubah mode workshop.'
      setNotification({
        type: 'error',
        message: msg,
      })
    } finally {
      setIsUpdatingMode(false)
    }
  }

  const handleUpdateBanner = async (
    input: Omit<UpdateAnnouncementBannerInput, 'sessionToken'>
  ) => {
    setIsUpdatingBanner(true)
    try {
      const res = await adminUpdateAnnouncementBannerFn({
        data: input,
      })
      setNotification({
        type: 'success',
        message: res.message,
      })
      await fetchConfig(false)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memperbarui pengumuman.'
      setNotification({
        type: 'error',
        message: msg,
      })
    } finally {
      setIsUpdatingBanner(false)
    }
  }

  return (
    <div className="admin-settings-view" id="admin-settings-view-root">
      {/* Top Header Bar */}
      <div className="admin-view-header">
        <div>
          <h2 className="admin-view-title">Konfigurasi & Pengumuman Platform</h2>
          <p className="admin-view-subtitle">
            Pusat kendali operasional workshop: pergantian mode tatap muka, siaran banner pengumuman global, dan kesiapan sistem.
          </p>
        </div>

        <div className="admin-view-actions">
          <button
            type="button"
            className="btn-admin-secondary"
            id="btn-refresh-platform-config"
            onClick={() => fetchConfig(false)}
            disabled={isLoading}
            title="Segarkan data konfigurasi dari server"
          >
            <span className={isLoading ? 'admin-spinner-small' : ''} aria-hidden="true">
              🔄
            </span>
            <span>{isLoading ? 'Menyinkronkan...' : 'Segarkan'}</span>
          </button>
        </div>
      </div>

      {/* Floating / Inline Notification Toast */}
      {notification && (
        <div
          className={`admin-feedback-toast ${
            notification.type === 'success' ? 'toast-success' : 'toast-error'
          }`}
          role="alert"
        >
          <span className="toast-icon">
            {notification.type === 'success' ? '✅' : '❌'}
          </span>
          <span className="toast-message">{notification.message}</span>
        </div>
      )}

      {/* Top Error Alert */}
      {error && (
        <div className="admin-alert-banner alert-danger" role="alert">
          <span className="alert-icon">⚠️</span>
          <div className="alert-content">
            <strong>Kesalahan Sistem:</strong> {error}
          </div>
        </div>
      )}

      {/* Main Content Layout */}
      {isLoading && !config ? (
        <div className="admin-loading-state">
          <div className="admin-spinner" aria-hidden="true" />
          <p>Memuat parameter platform...</p>
        </div>
      ) : config ? (
        <div className="settings-grid">
          {/* Card 1: Workshop Mode */}
          <WorkshopModeCard
            currentMode={config.workshopMode}
            lastModeChange={config.lastModeChange}
            isUpdating={isUpdatingMode}
            onUpdateMode={handleUpdateWorkshopMode}
          />

          {/* Card 2: Announcement Banner Editor */}
          <AnnouncementBannerEditor
            currentBanner={config.banner}
            isUpdating={isUpdatingBanner}
            onUpdateBanner={handleUpdateBanner}
          />

          {/* Card 3: Platform Readiness Diagnostics */}
          <PlatformReadinessCard config={config} />
        </div>
      ) : null}
    </div>
  )
}
