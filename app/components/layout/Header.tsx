import { Link } from '@tanstack/react-router'
import { CourseSwitcher } from './CourseSwitcher'

export function Header() {
  return (
    <header className="app-header">
      <div className="header-brand">
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
    </header>
  )
}
