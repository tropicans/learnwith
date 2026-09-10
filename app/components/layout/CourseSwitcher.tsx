import { Link, useRouterState } from '@tanstack/react-router'
import { useState, useRef, useEffect } from 'react'
import type { PublicCourseStatusProjection } from '@/schemas/courseLifecycle'
import { COURSE_NAV_REGISTRY } from '@/data/courses'

interface CourseSwitcherProps {
  courseStatuses?: PublicCourseStatusProjection[]
}

export function CourseSwitcher({ courseStatuses = [] }: CourseSwitcherProps = {}) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const routerState = useRouterState()
  const pathname = routerState.location.pathname

  const isHome = pathname === '/'
  const statusMap = new Map(courseStatuses.map((s) => [s.id, s.status]))

  // Find active course key from registry paths
  const currentCourseEntry = Object.entries(COURSE_NAV_REGISTRY).find(([_, item]) =>
    pathname.startsWith(item.path),
  )
  const currentCourseKey = currentCourseEntry ? currentCourseEntry[0] : null
  const currentItem = currentCourseKey ? COURSE_NAV_REGISTRY[currentCourseKey] : null
  const currentItemStatus = currentCourseKey ? (statusMap.get(currentCourseKey) ?? 'active') : null
  const isCurrentUnlisted = currentItemStatus === 'hidden'

  let currentIcon = '🏠'
  let currentName = 'Beranda Kursus'

  if (currentItem) {
    currentIcon = currentItem.icon
    currentName = isCurrentUnlisted ? `${currentItem.title} (Akses Terbatas)` : currentItem.title
  }

  // Count active courses across registry
  const activeCoursesCount = Object.values(COURSE_NAV_REGISTRY).filter(
    (item) => (statusMap.get(item.id) ?? 'active') === 'active',
  ).length

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
        <svg className="dropdown-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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

          {Object.values(COURSE_NAV_REGISTRY).map((item) => {
            const status = statusMap.get(item.id) ?? 'active'
            const isActive = status === 'active'
            const isDirectUnlisted = item.id === currentCourseKey && status === 'hidden'
            const isCurrentPage = item.id === currentCourseKey

            // Only display active courses, or hidden course IF user is currently directly accessing it (D-07)
            if (!isActive && !isDirectUnlisted) {
              return null
            }

            return (
              <li
                key={item.id}
                className={`course-dropdown-item ${isCurrentPage ? 'active' : ''}`}
                role="option"
                aria-selected={isCurrentPage}
                id={`dropdown-item-${item.id}`}
              >
                <Link
                  to={item.path}
                  search={item.searchParams}
                  onClick={() => setIsOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', textDecoration: 'none', color: 'inherit' }}
                >
                  <span className="course-item-icon">{item.icon}</span>
                  <div className="course-item-info">
                    <span className="course-item-title">{item.title}</span>
                    <span className="course-item-desc">{item.desc}</span>
                  </div>
                  {isDirectUnlisted ? (
                    <span className="badge badge-pill badge-warning switcher-unlisted-badge">
                      Akses Terbatas
                    </span>
                  ) : item.isLocked ? (
                    <span className="course-lock-badge" id={`badge-${item.id}-locked`}>🔒</span>
                  ) : null}
                </Link>
              </li>
            )
          })}

          {activeCoursesCount === 0 && !isCurrentUnlisted && (
            <li
              className="course-dropdown-item disabled switcher-empty-note"
              id="course-dropdown-empty-note"
              role="note"
            >
              Tidak ada workshop aktif saat ini
            </li>
          )}
        </ul>
      )}
    </div>
  )
}
