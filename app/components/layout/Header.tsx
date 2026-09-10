import { Link, useRouterState } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { CourseSwitcher } from './CourseSwitcher'

export function Header() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const isCoursePage = pathname.startsWith('/course')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('learnwith_theme') as 'light' | 'dark' | null
      const current = savedTheme || (document.documentElement.getAttribute('data-theme') as 'light' | 'dark') || 'light'
      setTheme(current)
      document.documentElement.setAttribute('data-theme', current)
    }
  }, [])

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-theme', next)
      localStorage.setItem('learnwith_theme', next)
    }
  }

  const toggleMobileSidebar = () => {
    if (typeof window !== 'undefined') {
      const sidebar = document.getElementById('app-sidebar')
      if (sidebar) {
        sidebar.classList.toggle('open')
      }
      const backdrop = document.getElementById('drawer-backdrop')
      if (backdrop) {
        backdrop.classList.toggle('active')
      }
    }
  }

  return (
    <header className="app-header">
      <div className="header-brand">
        {isCoursePage && (
          <button
            type="button"
            id="btn-mobile-nav"
            className="btn-mobile-nav"
            aria-label="Buka Navigasi Modul"
            title="Buka Navigasi Modul"
            onClick={toggleMobileSidebar}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        )}

        <Link to="/" search={{ filter: 'all' }} id="brand-home-link" className="brand-home-link" aria-label="Beranda LearnWith">
          <div className="header-brand-icon">
            <img src="/favicon.svg?v=2.3.0" alt="LearnWith Logo" className="brand-logo-img" />
          </div>
          <div className="header-brand-platform">
            <span className="platform-logo-text">LearnWith</span>
          </div>
        </Link>
        <span className="brand-breadcrumb-separator" aria-hidden="true">/</span>

        {/* Course Switcher Component */}
        <CourseSwitcher />

        {/* Accessible title for Screen Readers */}
        <h1 id="header-brand-title" className="sr-only">LearnWith Platform</h1>
      </div>

      {/* Global Search Input placeholder */}
      <div className="header-search-container">
        <div className="header-search-input-wrapper">
          <svg className="header-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="search"
            id="global-search-input"
            className="header-search-input"
            placeholder="Cari perintah, modul, solusi error, atau istilah..."
            autoComplete="off"
            aria-label="Cari panduan"
          />
          <kbd className="header-search-kbd">Ctrl+K</kbd>
        </div>
      </div>

      {/* Header Actions: Theme Toggle & Admin Console Link */}
      <div className="header-actions">
        <button
          type="button"
          id="btn-theme-toggle"
          className="btn-icon"
          onClick={toggleTheme}
          aria-label={theme === 'light' ? 'Beralih ke Mode Gelap' : 'Beralih ke Mode Terang'}
          title={theme === 'light' ? 'Mode Gelap' : 'Mode Terang'}
        >
          {theme === 'light' ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          )}
        </button>

        <Link
          to="/admin"
          search={{ tab: 'dashboard' }}
          className="btn btn-outline header-admin-link"
          title="Konsol Master Admin"
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span aria-hidden="true">🛡️</span>
            <span>Admin</span>
          </span>
        </Link>
      </div>
    </header>
  )
}
