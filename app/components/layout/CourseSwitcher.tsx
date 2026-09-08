import { Link, useRouterState } from '@tanstack/react-router'
import { useState, useRef, useEffect } from 'react'

export function CourseSwitcher() {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const routerState = useRouterState()
  const pathname = routerState.location.pathname

  const isHome = pathname === '/'
  const isAi = pathname.startsWith('/course/ai')
  const isWord = pathname.startsWith('/course/word')

  let currentIcon = '🏠'
  let currentName = 'Beranda Kursus'

  if (isAi) {
    currentIcon = '🤖'
    currentName = 'Hands-on Agentic AI'
  } else if (isWord) {
    currentIcon = '📝'
    currentName = 'Pengolahan Kata Lanjut'
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="header-course-switcher" id="course-switcher-container" ref={menuRef}>
      <button
        type="button"
        className="course-dropdown-btn"
        id="btn-course-dropdown"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Pilih Workshop / Course"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="course-icon" id="current-course-icon">{currentIcon}</span>
        <span className="course-name" id="current-course-name">{currentName}</span>
        <svg className="dropdown-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {isOpen && (
        <ul className="course-dropdown-menu" id="course-dropdown-menu" role="listbox" style={{ display: 'block' }}>
          <li className={`course-dropdown-item ${isHome ? 'active' : ''}`} role="option" aria-selected={isHome}>
            <Link to="/" search={{ filter: 'all' }} onClick={() => setIsOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', textDecoration: 'none', color: 'inherit' }}>
              <span className="course-item-icon">🏠</span>
              <div className="course-item-info">
                <span className="course-item-title">Beranda Kursus</span>
                <span className="course-item-desc">Galeri Modul & Workshop</span>
              </div>
            </Link>
          </li>
          <li className={`course-dropdown-item ${isAi ? 'active' : ''}`} role="option" aria-selected={isAi}>
            <Link to="/course/ai" search={{ mode: 'pretraining' }} onClick={() => setIsOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', textDecoration: 'none', color: 'inherit' }}>
              <span className="course-item-icon">🤖</span>
              <div className="course-item-info">
                <span className="course-item-title">Hands-on Agentic AI</span>
                <span className="course-item-desc">Hermes Agent & 9Router</span>
              </div>
            </Link>
          </li>
          <li className={`course-dropdown-item ${isWord ? 'active' : ''}`} role="option" aria-selected={isWord}>
            <Link to="/course/word" search={{}} onClick={() => setIsOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', textDecoration: 'none', color: 'inherit' }}>
              <span className="course-item-icon">📝</span>
              <div className="course-item-info">
                <span className="course-item-title">Pengolahan Kata Lanjut</span>
                <span className="course-item-desc">Modul Praktik ASN (Styles, TOC, Merge)</span>
              </div>
              <span className="course-lock-badge" id="badge-word-locked">🔒</span>
            </Link>
          </li>
        </ul>
      )}
    </div>
  )
}
