import React, { useState, useEffect, useCallback, useRef } from 'react'
import type {
  TroubleshootingLogRecord,
  TroubleshootingFilter,
  TroubleshootingStats,
  TroubleshootingStatus,
} from '../../../schemas/troubleshooting'
import {
  getTroubleshootingLogsFn,
  updateTroubleshootingLogStatusFn,
} from '../../../server/troubleshooting'
import { TroubleshootingKPIs } from './TroubleshootingKPIs'
import { TroubleshootingFilterToolbar } from './TroubleshootingFilterToolbar'
import { TroubleshootingLogTable } from './TroubleshootingLogTable'
import { TroubleshootingDetailModal } from './TroubleshootingDetailModal'
import { showToast } from '../../ui/Toast'

export function AdminTroubleshootingView() {
  const [incidents, setIncidents] = useState<TroubleshootingLogRecord[]>([])
  const [stats, setStats] = useState<TroubleshootingStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAutoRefresh, setIsAutoRefresh] = useState(true)
  const [selectedIncident, setSelectedIncident] = useState<TroubleshootingLogRecord | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [filter, setFilter] = useState<TroubleshootingFilter>({
    category: 'all',
    severity: 'all',
    status: 'all',
    courseId: 'all',
    search: '',
    limit: 100,
  })

  const autoRefreshTimerRef = useRef<NodeJS.Timeout | null>(null)

  const fetchIncidents = useCallback(
    async (isBackground = false) => {
      if (!isBackground) {
        setIsLoading(true)
      }
      try {
        const res = await getTroubleshootingLogsFn({
          data: {
            ...filter,
          },
        })
        if (res) {
          setIncidents(res.logs || res.incidents || [])
          setStats(res.stats || res.kpis || null)
        }
      } catch (err: any) {
        if (!isBackground) {
          showToast('Gagal memuat log troubleshooting: ' + (err.message || 'Error server'), 'danger')
        }
      } finally {
        if (!isBackground) {
          setIsLoading(false)
        }
      }
    },
    [filter]
  )

  // Fetch whenever filters change
  useEffect(() => {
    fetchIncidents(false)
  }, [fetchIncidents])

  // Polling interval: 15s (paused while inspection modal is open)
  useEffect(() => {
    if (autoRefreshTimerRef.current) {
      clearInterval(autoRefreshTimerRef.current)
      autoRefreshTimerRef.current = null
    }

    if (isAutoRefresh && !isModalOpen) {
      autoRefreshTimerRef.current = setInterval(() => {
        fetchIncidents(true)
      }, 15000)
    }

    return () => {
      if (autoRefreshTimerRef.current) {
        clearInterval(autoRefreshTimerRef.current)
      }
    }
  }, [isAutoRefresh, isModalOpen, fetchIncidents])

  const handleSelectIncident = (incident: TroubleshootingLogRecord) => {
    setSelectedIncident(incident)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedIncident(null)
  }

  const handleQuickResolve = async (incidentId: string) => {
    try {
      const res = await updateTroubleshootingLogStatusFn({
        data: {
          id: incidentId,
          status: 'resolved',
          instructorNotes: 'Ditandai selesai via quick resolve.',
        },
      })
      if (res && res.success) {
        showToast('Insiden berhasil ditandai selesai! 🎉', 'success', 3000)
        fetchIncidents(true)
      }
    } catch (err: any) {
      showToast('Gagal mengubah status: ' + (err.message || 'Error server'), 'danger')
    }
  }

  const handleUpdateStatus = async (
    incidentId: string,
    status: TroubleshootingStatus,
    notes?: string
  ) => {
    setIsSaving(true)
    try {
      const res = await updateTroubleshootingLogStatusFn({
        data: {
          id: incidentId,
          status,
          instructorNotes: notes,
        },
      })
      if (res && res.success) {
        showToast('Status insiden berhasil diperbarui! 🚀', 'success', 3000)
        handleCloseModal()
        fetchIncidents(true)
      }
    } catch (err: any) {
      showToast('Gagal menyimpan: ' + (err.message || 'Error server'), 'danger')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="admin-troubleshooting-view" id="admin-troubleshooting-view">
      {/* Header section */}
      <div className="admin-section-header" style={{ marginBottom: '1.25rem' }}>
        <div>
          <h2 className="admin-section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>🛠️</span>
            <span>Troubleshooting Audit Hub & Triage Console</span>
            <span className="badge badge-primary" style={{ fontSize: '11px', textTransform: 'none' }}>
              Fase 32
            </span>
          </h2>
          <p className="admin-section-desc">
            Pusat pemantauan kegagalan runtime (Port 20128, PowerShell Policy, OAuth/API Key, Telegram 409) dengan auto-klasifikasi dan generator solusi 1-klik.
          </p>
        </div>
      </div>

      {/* Aggregate KPI Cards */}
      <TroubleshootingKPIs stats={stats} isLoading={isLoading} />

      {/* Filter Toolbar */}
      <TroubleshootingFilterToolbar
        filter={filter}
        onFilterChange={setFilter}
        onRefresh={() => fetchIncidents(false)}
        isAutoRefresh={isAutoRefresh}
        onToggleAutoRefresh={() => setIsAutoRefresh(!isAutoRefresh)}
        isLoading={isLoading}
      />

      {/* Incident List Table */}
      <TroubleshootingLogTable
        incidents={incidents}
        onSelectIncident={handleSelectIncident}
        onQuickResolve={handleQuickResolve}
        isLoading={isLoading}
      />

      {/* Inspection & Remediation Drawer Modal */}
      <TroubleshootingDetailModal
        incident={selectedIncident}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onUpdateStatus={handleUpdateStatus}
        isSaving={isSaving}
      />
    </div>
  )
}
