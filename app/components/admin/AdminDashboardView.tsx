import React, { useState, useEffect, useCallback, useMemo } from 'react'
import type { ParticipantRecord, TelemetryDashboardStats } from '../../schemas/telemetry'
import { getParticipantTelemetryListFn } from '../../server/telemetry'
import { DashboardKPIs } from './DashboardKPIs'
import { ParticipantFilterToolbar } from './ParticipantFilterToolbar'
import { ParticipantTable } from './ParticipantTable'

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

  return (
    <div className="admin-dashboard-view" id="admin-dashboard-view">
      {/* Dashboard View Header */}
      <div className="admin-view-header">
        <div className="admin-view-title-group">
          <h2 className="admin-view-title">
            {initialTab === 'telemetry' ? 'Direktori & Telemetri Peserta' : 'Pusat Kendali Peserta & Pelatihan'}
          </h2>
          <p className="admin-view-subtitle">
            Pemantauan langsung progres modul, verifikasi checkpoint teknis, dan kesiapan praktikum peserta workshop.
          </p>
        </div>
      </div>

      {/* Aggregate KPI Cards (ADMIN-DASH-01) */}
      <DashboardKPIs stats={stats} isLoading={isLoading} />

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
    </div>
  )
}
