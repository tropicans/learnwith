import React, { useState, useEffect, useCallback, useMemo } from 'react'
import type { ParticipantRecord, TelemetryDashboardStats } from '../../schemas/telemetry'
import { getParticipantTelemetryListFn } from '../../server/telemetry'
import { DashboardKPIs } from './DashboardKPIs'
import { ParticipantFilterToolbar } from './ParticipantFilterToolbar'
import { ParticipantTable } from './ParticipantTable'
import { ParticipantDetailModal } from './ParticipantDetailModal'
import { ExportControls } from './ExportControls'

export interface AdminDashboardViewProps {
  initialTab?: 'dashboard' | 'telemetry'
}

const DEFAULT_STATS: TelemetryDashboardStats = {
  totalParticipants: 0,
  activeParticipants: 0,
  checkpointCompletionRate: 0,
  averageQuizScore: 0,
  readyRatio: 0,
  clinicRatio: 0,
}

export function AdminDashboardView({ initialTab = 'dashboard' }: AdminDashboardViewProps) {
  const [courseFilter, setCourseFilter] = useState<'all' | 'ai' | 'word'>('all')
  const [readinessFilter, setReadinessFilter] = useState<'all' | 'ready' | 'clinic' | 'pending'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  const [participants, setParticipants] = useState<ParticipantRecord[]>([])
  const [stats, setStats] = useState<TelemetryDashboardStats>(DEFAULT_STATS)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [selectedParticipant, setSelectedParticipant] = useState<ParticipantRecord | null>(null)

  const [sortBy, setSortBy] = useState<string>('lastActive')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Debounce search query input by 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Fetch telemetry list and stats
  const fetchData = useCallback(
    async (isBackground = false) => {
      if (!isBackground) {
        setIsRefreshing(true)
      }

      try {
        const result = await getParticipantTelemetryListFn({
          data: {
            courseId: courseFilter,
            readiness: readinessFilter,
            search: debouncedSearch.trim() || undefined,
          },
        })

        if (result) {
          setParticipants(result.participants || [])
          setStats(result.stats || DEFAULT_STATS)
        }
      } catch (err) {
        console.error('Gagal mengambil data telemetri peserta:', err)
      } finally {
        setIsLoading(false)
        setIsRefreshing(false)
      }
    },
    [courseFilter, readinessFilter, debouncedSearch]
  )

  // Initial fetch and fetch on filter change
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // 15-second Polling interval for auto-refresh
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      // Pause polling if tab is backgrounded or modal is open
      if (document.hidden || selectedParticipant !== null) {
        return
      }
      fetchData(true)
    }, 15000)

    return () => clearInterval(interval)
  }, [autoRefresh, selectedParticipant, fetchData])

  // Sort participants client-side
  const sortedParticipants = useMemo(() => {
    const list = [...participants]
    list.sort((a, b) => {
      let cmp = 0
      if (sortBy === 'name') {
        cmp = (a.name || '').localeCompare(b.name || '', 'id')
      } else if (sortBy === 'progress') {
        cmp = a.progressPercent - b.progressPercent
      } else if (sortBy === 'lastActive') {
        cmp = a.lastActiveAt - b.lastActiveAt
      }
      return sortOrder === 'asc' ? cmp : -cmp
    })
    return list
  }, [participants, sortBy, sortOrder])

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(column)
      setSortOrder(column === 'name' ? 'asc' : 'desc')
    }
  }

  const handleInspect = (participant: ParticipantRecord) => {
    setSelectedParticipant(participant)
  }

  // Calculate course breakdown for Dashboard Overview
  const aiStats = useMemo(() => {
    const list = participants.filter((p) => p.courseId === 'ai')
    const ready = list.filter((p) => p.readinessStatus === 'ready').length
    const clinic = list.filter((p) => p.readinessStatus === 'clinic').length
    const avgProg = list.length > 0 ? Math.round(list.reduce((acc, p) => acc + p.progressPercent, 0) / list.length) : 0
    return { count: list.length, ready, clinic, avgProg }
  }, [participants])

  const wordStats = useMemo(() => {
    const list = participants.filter((p) => p.courseId === 'word')
    const ready = list.filter((p) => p.readinessStatus === 'ready').length
    const clinic = list.filter((p) => p.readinessStatus === 'clinic').length
    const avgProg = list.length > 0 ? Math.round(list.reduce((acc, p) => acc + p.progressPercent, 0) / list.length) : 0
    return { count: list.length, ready, clinic, avgProg }
  }, [participants])

  // TAB 1: DASHBOARD & MONITORING (Aggregates, KPIs, Overview, Refresh Controls)
  if (initialTab === 'dashboard') {
    return (
      <div className="admin-dashboard-view" id="admin-dashboard-view">
        <div className="admin-view-header">
          <div className="admin-view-title-group">
            <h2 className="admin-view-title">Pusat Kendali & Monitoring Pelatihan</h2>
            <p className="admin-view-subtitle">
              Ringkasan eksekutif metrik kehadiran peserta, tingkat kelulusan checkpoint, rata-rata evaluasi kuis, dan rasio kesiapan kelas.
            </p>
          </div>

          <div className="admin-toolbar-controls">
            <button
              type="button"
              id="btn-toggle-auto-refresh"
              className={`admin-refresh-btn ${autoRefresh ? 'active' : ''}`}
              onClick={() => setAutoRefresh((prev) => !prev)}
              title={autoRefresh ? 'Matikan pembaruan otomatis (15s)' : 'Aktifkan pembaruan otomatis (15s)'}
            >
              <span
                className={`admin-status-dot ${autoRefresh ? 'dot-active' : 'dot-idle'}`}
                aria-hidden="true"
              />
              <span>{autoRefresh ? 'Auto (15s)' : 'Auto Off'}</span>
            </button>

            <button
              type="button"
              id="btn-manual-refresh"
              className="admin-refresh-btn admin-btn-action"
              onClick={() => fetchData(false)}
              disabled={isRefreshing}
              title="Segarkan data sekarang"
            >
              <svg
                className={`refresh-icon ${isRefreshing ? 'spin' : ''}`}
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M23 4v6h-6" />
                <path d="M1 20v-6h6" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
              <span>{isRefreshing ? 'Memuat...' : 'Segarkan'}</span>
            </button>
          </div>
        </div>

        {/* Aggregate KPI Cards (ADMIN-DASH-01) */}
        <DashboardKPIs stats={stats} isLoading={isLoading} />

        {/* Course Performance & Readiness Breakdown Cards */}
        <div className="admin-overview-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem', marginTop: '0.5rem' }}>
          {/* Kursus AI Agent Card */}
          <div className="admin-kpi-card" style={{ background: '#ffffff' }}>
            <div className="kpi-header">
              <span className="kpi-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>🤖</span> Kursus 1: AI Agent & Dev Local
              </span>
              <span className="kpi-status-badge kpi-badge-success">{aiStats.count} Peserta</span>
            </div>
            <div className="kpi-body" style={{ marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Rata-rata Progres Modul:</span>
                <strong style={{ color: 'var(--text-primary)' }}>{aiStats.avgProg}%</strong>
              </div>
              <div className="kpi-progress-track" style={{ marginBottom: '1rem' }}>
                <div className="kpi-progress-fill" style={{ width: `${aiStats.avgProg}%` }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ background: 'rgba(34, 197, 94, 0.08)', padding: '0.625rem', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#1b7a37', fontWeight: 600 }}>Siap Workshop</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1b7a37' }}>{aiStats.ready}</div>
                </div>
                <div style={{ background: 'rgba(239, 68, 68, 0.08)', padding: '0.625rem', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#b31b14', fontWeight: 600 }}>Perlu Klinik</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#b31b14' }}>{aiStats.clinic}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Kursus Word ASN Card */}
          <div className="admin-kpi-card" style={{ background: '#ffffff' }}>
            <div className="kpi-header">
              <span className="kpi-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>📝</span> Kursus 2: Word ASN & Format Kedinasan
              </span>
              <span className="kpi-status-badge kpi-badge-success">{wordStats.count} Peserta</span>
            </div>
            <div className="kpi-body" style={{ marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Rata-rata Progres Modul:</span>
                <strong style={{ color: 'var(--text-primary)' }}>{wordStats.avgProg}%</strong>
              </div>
              <div className="kpi-progress-track" style={{ marginBottom: '1rem' }}>
                <div className="kpi-progress-fill" style={{ width: `${wordStats.avgProg}%` }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ background: 'rgba(34, 197, 94, 0.08)', padding: '0.625rem', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#1b7a37', fontWeight: 600 }}>Siap Workshop</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1b7a37' }}>{wordStats.ready}</div>
                </div>
                <div style={{ background: 'rgba(239, 68, 68, 0.08)', padding: '0.625rem', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#b31b14', fontWeight: 600 }}>Perlu Klinik</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#b31b14' }}>{wordStats.clinic}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // TAB 2: PESERTA & TELEMETRI (Directory, Filters, Full Table, Detail Inspector Modal, Export)
  return (
    <div className="admin-dashboard-view" id="admin-telemetry-view">
      {/* Telemetry View Header */}
      <div className="admin-view-header">
        <div className="admin-view-title-group">
          <h2 className="admin-view-title">Direktori & Telemetri Peserta</h2>
          <p className="admin-view-subtitle">
            Pencarian langsung peserta, inspeksi rincian checklist modul per bab, status kelulusan checkpoint 1–3, dan ekspor data rekapitulasi.
          </p>
        </div>

        {/* 1-Click Export Controls (ADMIN-DASH-04) */}
        <ExportControls
          participants={sortedParticipants}
          stats={stats}
          filter={{
            courseId: courseFilter,
            readiness: readinessFilter,
            search: debouncedSearch.trim() || undefined,
          }}
          disabled={isLoading}
        />
      </div>

      {/* Participant Filter & Search Toolbar (ADMIN-DASH-02) */}
      <ParticipantFilterToolbar
        courseFilter={courseFilter}
        readinessFilter={readinessFilter}
        searchQuery={searchQuery}
        totalCount={stats.totalParticipants}
        filteredCount={participants.length}
        autoRefresh={autoRefresh}
        isRefreshing={isRefreshing}
        onCourseChange={setCourseFilter}
        onReadinessChange={setReadinessFilter}
        onSearchChange={setSearchQuery}
        onToggleAutoRefresh={() => setAutoRefresh((prev) => !prev)}
        onManualRefresh={() => fetchData(false)}
      />

      {/* Participant Directory Table (ADMIN-DASH-02) */}
      <ParticipantTable
        participants={sortedParticipants}
        isLoading={isRefreshing && participants.length === 0}
        onInspectParticipant={handleInspect}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
      />

      {/* Participant Detail Inspector Modal (ADMIN-DASH-03) */}
      <ParticipantDetailModal
        participant={selectedParticipant}
        isOpen={Boolean(selectedParticipant)}
        onClose={() => setSelectedParticipant(null)}
      />
    </div>
  )
}
