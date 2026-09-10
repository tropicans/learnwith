import { Link } from '@tanstack/react-router'
import type { CourseData } from '@/data/courses'
import {
  IconCpu,
  IconFileText,
  IconBook,
  IconCheckCircle,
  IconActivity,
  IconArrowRight,
  IconLock,
  IconSparkles
} from './Icons'

interface WorkshopCatalogProps {
  courses: CourseData[]
  activeFilter: 'all' | 'ai' | 'word'
}

export function WorkshopCatalog({ courses, activeFilter }: WorkshopCatalogProps) {
  const filteredCourses = courses.filter((c) => {
    if (activeFilter === 'all') return true
    return c.category === activeFilter
  })

  return (
    <section className="home-section catalog-section" id="pilihan-modul" aria-label="Katalog Jalur Belajar dan Modul Praktik">
      <div className="section-header text-center">
        <span className="section-eyebrow">JALUR BELAJAR TERSEDIA</span>
        <h2 className="section-title">Pilihan Modul &amp; Ruang Kerja Studio</h2>
        <p className="section-subtitle">
          Pilih jalur workshop interaktif di bawah ini untuk membuka command center dan memulai praktikum mandiri Anda.
        </p>

        {/* Filter Chips - responsive, wrapping naturally on mobile without forced scroll */}
        <div className="catalog-filters-container" role="tablist" aria-label="Filter Kategori Workshop">
          <Link
            to="/"
            search={{ filter: 'all' }}
            resetScroll={false}
            className={`catalog-chip ${activeFilter === 'all' ? 'active' : ''}`}
            role="tab"
            aria-selected={activeFilter === 'all'}
          >
            <IconSparkles width={15} height={15} />
            <span>Semua Workshop</span>
          </Link>

          <Link
            to="/"
            search={{ filter: 'ai' }}
            resetScroll={false}
            className={`catalog-chip ${activeFilter === 'ai' ? 'active' : ''}`}
            role="tab"
            aria-selected={activeFilter === 'ai'}
          >
            <IconCpu width={15} height={15} />
            <span>Agentic AI &amp; Otomasi</span>
          </Link>

          <Link
            to="/"
            search={{ filter: 'word' }}
            resetScroll={false}
            className={`catalog-chip ${activeFilter === 'word' ? 'active' : ''}`}
            role="tab"
            aria-selected={activeFilter === 'word'}
          >
            <IconFileText width={15} height={15} />
            <span>Administrasi Dokumen ASN</span>
          </Link>
        </div>
      </div>

      {/* Cards Grid or Friendly Empty States */}
      {courses.length === 0 ? (
        <div className="card catalog-empty-state-card" id="catalog-empty-state">
          <div className="empty-state-icon" aria-hidden="true">📦</div>
          <h3 className="empty-state-title">Belum Ada Workshop Publik Aktif Saat Ini</h3>
          <p className="empty-state-desc">
            Semua modul pelatihan saat ini sedang dalam masa pemeliharaan kurikulum atau diarsipkan. Hubungi administrator jika Anda memerlukan akses khusus.
          </p>
          <a href="mailto:support@learnwith.id" className="btn btn-secondary empty-state-cta">
            Hubungi Tim Pelatihan
          </a>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="catalog-category-empty" id="catalog-category-empty">
          <p>
            Belum ada modul aktif di kategori ini. Silakan pilih tab &quot;Semua Workshop&quot; untuk melihat jalur belajar lainnya.
          </p>
        </div>
      ) : (
        <div className="catalog-cards-grid">
          {filteredCourses.map((course) => {
            const isAi = course.category === 'ai'
            const cardId = isAi ? 'card-home-course-ai' : 'card-home-course-word'
            const buttonId = isAi ? 'btn-home-enter-ai' : 'btn-home-enter-word'
            const targetRoute = isAi ? '/course/ai' : '/course/word'
            const searchParams = isAi ? { mode: 'pretraining' as const } : undefined
            const buttonText = isAi ? 'Buka Ruang Kerja AI' : 'Buka Ruang Kerja Word'

            return (
              <div
                key={course.id}
                className={`catalog-card ${isAi ? 'catalog-card-ai' : 'catalog-card-word'}`}
                id={cardId}
                data-category={course.category}
              >
                {/* Card Header Zone */}
                <div className="catalog-card-header">
                  <div className="catalog-card-badge-row">
                    <span className={`badge badge-pill ${isAi ? 'badge-success' : 'badge-neutral'}`}>
                      {!isAi && <IconLock width={12} height={12} className="inline-icon" />}
                      {course.badge.replace(/[\u2705\u{1F512}]/gu, '').trim()}
                    </span>
                    <span className="catalog-category-tag">
                      {isAi ? 'WORKSHOP AI' : 'DOKUMEN KEDINASAN'}
                    </span>
                  </div>

                  <div className="catalog-card-visual-icon">
                    {isAi ? <IconCpu width={32} height={32} /> : <IconFileText width={32} height={32} />}
                  </div>

                  <h3 className="catalog-card-title">{course.title}</h3>
                  <p className="catalog-card-subtitle">{course.subtitle}</p>
                </div>

                {/* Card Body */}
                <div className="catalog-card-body">
                  <p className="catalog-card-desc">{course.description}</p>

                  {/* Telemetry Strip */}
                  <div className="catalog-telemetry-list">
                    <div className="telemetry-row">
                      <IconBook width={16} height={16} />
                      <span>{course.modulesCount} Modul Praktik Terstruktur</span>
                    </div>
                    <div className="telemetry-row">
                      <IconCheckCircle width={16} height={16} />
                      <span>{course.checkpointsCount} Checkpoint Terverifikasi</span>
                    </div>
                    <div className="telemetry-row">
                      <IconActivity width={16} height={16} />
                      <span>{isAi ? 'Dual-Mode (Pra-Training & Kelas)' : 'Sertifikasi Kompetensi Sesuai Pergub'}</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer Action */}
                <div className="catalog-card-footer">
                  <Link
                    to={targetRoute}
                    search={searchParams}
                    preload="intent"
                    className="btn btn-primary btn-block catalog-enter-btn"
                    id={buttonId}
                  >
                    <span>{buttonText}</span>
                    <IconArrowRight width={16} height={16} />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
