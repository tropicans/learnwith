import React, { useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { usePretrainingState } from '@/hooks/usePretrainingState'

interface PretrainingSidebarProps {
  currentMode?: 'pretraining' | 'live-class'
}

export function PretrainingSidebar({ currentMode = 'pretraining' }: PretrainingSidebarProps) {
  const { checklists, checkpoints } = usePretrainingState()
  const [activeSection, setActiveSection] = useState('sec-target')

  // Calculate module badge counts
  const m1Done = ['m1-check-node', 'm1-verify-lts', 'm1-check-npm'].filter(
    (id) => checklists[id]
  ).length
  const m2Done = [
    'm2-install-pkg',
    'm2-start-service',
    'm2-open-dashboard',
    'm2-verify-local',
  ].filter((id) => checklists[id]).length
  const m3Done = [
    'm3-start-botfather',
    'm3-create-newbot',
    'm3-save-token-secure',
    'm3-get-userid',
  ].filter((id) => checklists[id]).length
  const m4Done = ['m4-open-console', 'm4-verify-login'].filter(
    (id) => checklists[id]
  ).length

  // Checkpoint badge labels & styles
  const getCheckpointBadge = (status: 'pending' | 'passed' | 'failed') => {
    if (status === 'passed') {
      return { text: 'Passed', className: 'badge badge-pill badge-success' }
    }
    if (status === 'failed') {
      return { text: 'Failed', className: 'badge badge-pill badge-danger' }
    }
    return { text: 'Pending', className: 'badge badge-pill badge-warning' }
  }

  const cp1 = getCheckpointBadge(checkpoints['cp-1'])
  const cp2 = getCheckpointBadge(checkpoints['cp-2'])
  const cp3 = getCheckpointBadge(checkpoints['cp-3'])

  useEffect(() => {
    setActiveSection(currentMode === 'live-class' ? 'sec-live-hero' : 'sec-target')
  }, [currentMode])

  // Scrollspy to set active nav link
  useEffect(() => {
    if (typeof window === 'undefined') return

    const sectionIds = currentMode === 'live-class'
      ? [
          'sec-live-hero',
          'sec-live-stats',
          'sec-module-6',
          'sec-module-7',
          'sec-module-8',
          'sec-module-9',
          'sec-module-10',
          'sec-module-11',
          'sec-live-checkpoints',
          'sec-live-checklist',
        ]
      : [
          'sec-target',
          'sec-glosarium',
          'sec-security',
          'sec-prerequisites',
          'sec-powershell',
          'sec-module-1',
          'sec-module-2',
          'sec-module-3',
          'sec-module-4',
          'sec-module-5',
          'sec-checkpoint-1',
          'sec-checkpoint-2',
          'sec-checkpoint-3',
          'sec-troubleshooting',
          'sec-redaction',
          'sec-readiness-report',
        ]

    const handleScroll = () => {
      const scrollY = window.scrollY + 120
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i])
        if (el && el.offsetTop <= scrollY) {
          setActiveSection(sectionIds[i])
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [currentMode])

  return (
    <aside id="app-sidebar" className="app-sidebar" aria-label="Sidebar Navigasi Modul">
      {/* Sidebar Course Selector */}
      <div className="sidebar-course-selector-container">
        <div className="sidebar-course-label">Pilihan Workshop</div>
        <button
          type="button"
          className="sidebar-course-btn"
          id="btn-sidebar-course-select"
          aria-label="Ganti Workshop"
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span id="sidebar-course-icon">🤖</span>
            <span id="sidebar-course-name">Hands-on Agentic AI</span>
          </span>
          <span className="course-lock-badge unlocked" id="sidebar-word-locked">
            🔓
          </span>
        </button>
      </div>

      {/* Sidebar Mode Switcher (Specific to Course 1) */}
      <div className="sidebar-mode-switcher-container" id="sidebar-mode-switcher-container">
        <div className="sidebar-mode-label">Mode Sesi Workshop</div>
        <div className="sidebar-mode-switcher" role="tablist" aria-label="Pilihan Sesi Workshop (Sidebar)">
          <Link
            to="/course/ai"
            search={{ mode: 'pretraining' }}
            className={`mode-tab ${currentMode === 'pretraining' ? 'active' : ''}`}
            role="tab"
            aria-selected={currentMode === 'pretraining'}
            id="tab-pretraining-sidebar"
          >
            <span className="mode-tab-icon">📋</span>
            <span className="mode-tab-label">Pra-Training</span>
          </Link>
          <Link
            to="/course/ai"
            search={{ mode: 'live-class' }}
            className={`mode-tab ${currentMode === 'live-class' ? 'active' : ''}`}
            role="tab"
            aria-selected={currentMode === 'live-class'}
            id="tab-liveclass-sidebar"
          >
            <span className="mode-tab-icon">🚀</span>
            <span className="mode-tab-label">Hari-H Kelas</span>
          </Link>
        </div>
      </div>

      {/* Mode Group 1: Navigasi Pra-Training */}
      <div id="nav-group-pretraining" className={`sidebar-nav-group ${currentMode === 'pretraining' ? 'active' : ''}`}>
        {/* Group 1: Pendahuluan */}
        <nav className="nav-group" aria-label="Navigasi Pendahuluan">
          <div className="nav-group-title">Pendahuluan</div>
          <a
            href="#sec-target"
            className={`nav-link ${activeSection === 'sec-target' ? 'active' : ''}`}
          >
            <div className="nav-link-content">
              <span className="nav-link-icon">🎯</span>
              <span>Target & Alur Kerja</span>
            </div>
          </a>
          <a
            href="#sec-glosarium"
            className={`nav-link ${activeSection === 'sec-glosarium' ? 'active' : ''}`}
          >
            <div className="nav-link-content">
              <span className="nav-link-icon">📖</span>
              <span>Glosarium Istilah</span>
            </div>
          </a>
          <a
            href="#sec-security"
            className={`nav-link ${activeSection === 'sec-security' ? 'active' : ''}`}
          >
            <div className="nav-link-content">
              <span className="nav-link-icon">🛡️</span>
              <span>Aturan Keamanan</span>
            </div>
          </a>
          <a
            href="#sec-prerequisites"
            className={`nav-link ${activeSection === 'sec-prerequisites' ? 'active' : ''}`}
          >
            <div className="nav-link-content">
              <span className="nav-link-icon">💻</span>
              <span>Alat & Persiapan</span>
            </div>
          </a>
          <a
            href="#sec-powershell"
            className={`nav-link ${activeSection === 'sec-powershell' ? 'active' : ''}`}
          >
            <div className="nav-link-content">
              <span className="nav-link-icon">📟</span>
              <span>Dasar PowerShell</span>
            </div>
          </a>
        </nav>

        {/* Group 2: Modul Utama */}
        <nav className="nav-group" aria-label="Navigasi Modul Utama">
          <div className="nav-group-title">Modul Praktik</div>
          <a
            href="#sec-module-1"
            className={`nav-link ${activeSection === 'sec-module-1' ? 'active' : ''}`}
          >
            <div className="nav-link-content">
              <span className="nav-link-icon">🟢</span>
              <span>Modul 1: Node.js</span>
            </div>
            <span className="badge badge-pill badge-neutral" id="badge-nav-m1">
              {m1Done}/3
            </span>
          </a>
          <a
            href="#sec-module-2"
            className={`nav-link ${activeSection === 'sec-module-2' ? 'active' : ''}`}
          >
            <div className="nav-link-content">
              <span className="nav-link-icon">🚀</span>
              <span>Modul 2: 9Router</span>
            </div>
            <span className="badge badge-pill badge-neutral" id="badge-nav-m2">
              {m2Done}/4
            </span>
          </a>
          <a
            href="#sec-module-3"
            className={`nav-link ${activeSection === 'sec-module-3' ? 'active' : ''}`}
          >
            <div className="nav-link-content">
              <span className="nav-link-icon">🤖</span>
              <span>Modul 3: Telegram Bot</span>
            </div>
            <span className="badge badge-pill badge-neutral" id="badge-nav-m3">
              {m3Done}/4
            </span>
          </a>
          <a
            href="#sec-module-4"
            className={`nav-link ${activeSection === 'sec-module-4' ? 'active' : ''}`}
          >
            <div className="nav-link-content">
              <span className="nav-link-icon">☁️</span>
              <span>Modul 4: Google Cloud</span>
            </div>
            <span className="badge badge-pill badge-neutral" id="badge-nav-m4">
              {m4Done}/2
            </span>
          </a>
          <a
            href="#sec-module-5"
            className={`nav-link ${activeSection === 'sec-module-5' ? 'active' : ''}`}
          >
            <div className="nav-link-content">
              <span className="nav-link-icon">⚠️</span>
              <span>Catatan Sebelum Kelas</span>
            </div>
          </a>
        </nav>

        {/* Group 3: Checkpoints */}
        <nav className="nav-group" aria-label="Navigasi Checkpoints">
          <div className="nav-group-title">Gerbang Checkpoint</div>
          <a
            href="#sec-checkpoint-1"
            className={`nav-link ${activeSection === 'sec-checkpoint-1' ? 'active' : ''}`}
          >
            <div className="nav-link-content">
              <span className="nav-link-icon">📍</span>
              <span>Checkpoint 1: Node.js</span>
            </div>
            <span className={cp1.className} id="status-nav-cp1">
              {cp1.text}
            </span>
          </a>
          <a
            href="#sec-checkpoint-2"
            className={`nav-link ${activeSection === 'sec-checkpoint-2' ? 'active' : ''}`}
          >
            <div className="nav-link-content">
              <span className="nav-link-icon">📍</span>
              <span>Checkpoint 2: 9Router</span>
            </div>
            <span className={cp2.className} id="status-nav-cp2">
              {cp2.text}
            </span>
          </a>
          <a
            href="#sec-checkpoint-3"
            className={`nav-link ${activeSection === 'sec-checkpoint-3' ? 'active' : ''}`}
          >
            <div className="nav-link-content">
              <span className="nav-link-icon">📍</span>
              <span>Checkpoint 3: Telegram</span>
            </div>
            <span className={cp3.className} id="status-nav-cp3">
              {cp3.text}
            </span>
          </a>
        </nav>

        {/* Group 4: Bantuan & Laporan */}
        <nav className="nav-group" aria-label="Navigasi Bantuan dan Laporan">
          <div className="nav-group-title">Bantuan & Laporan</div>
          <a
            href="#sec-troubleshooting"
            className={`nav-link ${activeSection === 'sec-troubleshooting' ? 'active' : ''}`}
          >
            <div className="nav-link-content">
              <span className="nav-link-icon">🛠️</span>
              <span>Solusi Kendala</span>
            </div>
          </a>
          <a
            href="#sec-redaction"
            className={`nav-link ${activeSection === 'sec-redaction' ? 'active' : ''}`}
          >
            <div className="nav-link-content">
              <span className="nav-link-icon">🔒</span>
              <span>Sensor Rahasia</span>
            </div>
          </a>
          <a
            href="#sec-readiness-report"
            className={`nav-link ${activeSection === 'sec-readiness-report' ? 'active' : ''}`}
          >
            <div className="nav-link-content">
              <span className="nav-link-icon">📋</span>
              <span>Laporan Kesiapan</span>
            </div>
          </a>
        </nav>
      </div>

      {/* Mode Group 2: Navigasi Hari-H Kelas */}
      <div id="nav-group-liveclass" className={`sidebar-nav-group ${currentMode === 'live-class' ? 'active' : ''}`}>
        {/* Group 1: Informasi Sesi */}
        <nav className="nav-group" aria-label="Navigasi Informasi Sesi Hari-H">
          <div className="nav-group-title">Sesi Hari-H Praktik</div>
          <a
            href="#sec-live-hero"
            className={`nav-link ${activeSection === 'sec-live-hero' ? 'active' : ''}`}
          >
            <div className="nav-link-content">
              <span className="nav-link-icon">🎯</span>
              <span>Ringkasan &amp; Gerbang</span>
            </div>
          </a>
          <a
            href="#sec-live-stats"
            className={`nav-link ${activeSection === 'sec-live-stats' ? 'active' : ''}`}
          >
            <div className="nav-link-content">
              <span className="nav-link-icon">📊</span>
              <span>Telemetri Partisipasi</span>
            </div>
          </a>
        </nav>

        {/* Group 2: Modul Praktik Hari-H */}
        <nav className="nav-group" aria-label="Navigasi Modul Praktik Hari-H">
          <div className="nav-group-title">Modul Praktik Hari-H</div>
          <a
            href="#sec-module-6"
            className={`nav-link ${activeSection === 'sec-module-6' ? 'active' : ''}`}
          >
            <div className="nav-link-content">
              <span className="nav-link-icon">⚡</span>
              <span>Modul 6: 9Router Matrix</span>
            </div>
            <span className="badge badge-pill badge-neutral">CP-6</span>
          </a>
          <a
            href="#sec-module-7"
            className={`nav-link ${activeSection === 'sec-module-7' ? 'active' : ''}`}
          >
            <div className="nav-link-content">
              <span className="nav-link-icon">🤖</span>
              <span>Modul 7: Hermes Engine</span>
            </div>
            <span className="badge badge-pill badge-neutral">CP-7</span>
          </a>
          <a
            href="#sec-module-8"
            className={`nav-link ${activeSection === 'sec-module-8' ? 'active' : ''}`}
          >
            <div className="nav-link-content">
              <span className="nav-link-icon">⚙️</span>
              <span>Modul 8: Hermes Wizard</span>
            </div>
            <span className="badge badge-pill badge-neutral">CP-8</span>
          </a>
          <a
            href="#sec-module-9"
            className={`nav-link ${activeSection === 'sec-module-9' ? 'active' : ''}`}
          >
            <div className="nav-link-content">
              <span className="nav-link-icon">💬</span>
              <span>Modul 9: Telegram Gateway</span>
            </div>
            <span className="badge badge-pill badge-neutral">CP-9</span>
          </a>
          <a
            href="#sec-module-10"
            className={`nav-link ${activeSection === 'sec-module-10' ? 'active' : ''}`}
          >
            <div className="nav-link-content">
              <span className="nav-link-icon">📅</span>
              <span>Modul 10: Google Calendar</span>
            </div>
            <span className="badge badge-pill badge-neutral">CP-10</span>
          </a>
          <a
            href="#sec-module-11"
            className={`nav-link ${activeSection === 'sec-module-11' ? 'active' : ''}`}
          >
            <div className="nav-link-content">
              <span className="nav-link-icon">🚀</span>
              <span>Modul 11: Operasional E2E</span>
            </div>
            <span className="badge badge-pill badge-neutral">CP-11</span>
          </a>
        </nav>

        {/* Group 3: Checkpoint & Checklist */}
        <nav className="nav-group" aria-label="Navigasi Checkpoint dan Checklist Hari-H">
          <div className="nav-group-title">Evaluasi &amp; Checklist</div>
          <a
            href="#sec-live-checkpoints"
            className={`nav-link ${activeSection === 'sec-live-checkpoints' ? 'active' : ''}`}
          >
            <div className="nav-link-content">
              <span className="nav-link-icon">🎯</span>
              <span>6 Gerbang Checkpoint</span>
            </div>
          </a>
          <a
            href="#sec-live-checklist"
            className={`nav-link ${activeSection === 'sec-live-checklist' ? 'active' : ''}`}
          >
            <div className="nav-link-content">
              <span className="nav-link-icon">✅</span>
              <span>Lembar Checklist Mandiri</span>
            </div>
          </a>
        </nav>
      </div>
    </aside>
  )
}
