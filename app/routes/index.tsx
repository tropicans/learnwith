import { createFileRoute, Link } from '@tanstack/react-router'
import { homeSearchSchema } from '@/schemas/searchParams'
import { getCoursesList, type CourseData } from '@/data/courses'

export const Route = createFileRoute('/')({
  validateSearch: (search) => homeSearchSchema.parse(search),
  loader: async () => {
    const courses = await getCoursesList()
    return { courses }
  },
  head: () => ({
    meta: [
      { title: 'learnwith — Pusat Workshop & Ruang Belajar Terpadu' },
      {
        name: 'description',
        content: 'Platform Pembelajaran Praktik Komputer & AI Interaktif untuk ASN & Profesional',
      },
      { property: 'og:title', content: 'learnwith — Pusat Workshop & Ruang Belajar Terpadu' },
      {
        property: 'og:description',
        content: 'Platform Pembelajaran Praktik Komputer & AI Interaktif untuk ASN & Profesional',
      },
      { property: 'og:type', content: 'website' },
      { property: 'og:image', content: '/learnwith-banner.png' },
    ],
  }),
  component: HomeComponent,
})

function HomeComponent() {
  const { filter } = Route.useSearch()
  const { courses } = Route.useLoaderData()

  const aiCourse = courses.find((c) => c.category === 'ai')
  const wordCourse = courses.find((c) => c.category === 'word')

  return (
    <main className="app-main home-main" id="container-home">
      <section className="home-hero">
        <div className="home-hero-badge">
          <span className="home-hero-sparkle">✨</span> Pusat Workshop & Ruang Belajar Terpadu
        </div>
        <h2 className="home-hero-title">
          Selamat Datang di <span className="text-accent">learnwith Yudhi</span>
        </h2>
        <p className="home-hero-subtitle">
          Ruang kerja pembelajaran dan panduan interaktif praktikum teknologi terstandar untuk Aparatur Sipil Negara & profesional modern. Pilih workshop di bawah ini untuk memulai ruang kerja praktik mandiri Anda.
        </p>

        {/* Filter Chips */}
        <div className="home-chips-container">
          <Link to="/" search={{ filter: 'all' }} className={`home-chip ${filter === 'all' ? 'active' : ''}`}>
            Semua Workshop
          </Link>
          <Link to="/" search={{ filter: 'ai' }} className={`home-chip ${filter === 'ai' ? 'active' : ''}`}>
            🤖 Agentic AI
          </Link>
          <Link to="/" search={{ filter: 'word' }} className={`home-chip ${filter === 'word' ? 'active' : ''}`}>
            📝 Administrasi Dokumen ASN
          </Link>
        </div>
      </section>

      {/* Notebook Cards Grid */}
      <div className="notebook-section-header">
        <div>
          <h3 className="notebook-section-title">Pilihan Modul & Ruang Kerja</h3>
          <p className="notebook-section-subtitle">Pilih modul untuk masuk ke ruang kerja studio interaktif</p>
        </div>
      </div>

      <div className="notebook-grid">
        {(filter === 'all' || filter === 'ai') && aiCourse && (
          <div className="notebook-card" id="card-home-course-ai" data-category="ai">
            <div className="notebook-card-cover cover-gradient-ai">
              <div className="notebook-card-icon-wrapper">
                <span className="notebook-card-icon">🤖</span>
              </div>
              <div className="notebook-card-status">
                <span className="badge badge-pill badge-success">{aiCourse.badge}</span>
              </div>
            </div>
            <div className="notebook-card-body">
              <div className="notebook-card-category">Workshop AI & Otomasi</div>
              <h4 className="notebook-card-title">{aiCourse.title}</h4>
              <p className="notebook-card-subtitle">{aiCourse.subtitle}</p>
              <p className="notebook-card-desc">{aiCourse.description}</p>
              <div className="notebook-card-meta">
                <span className="meta-item">
                  <span className="meta-icon">📚</span> {aiCourse.modulesCount} Modul Praktik
                </span>
                <span className="meta-item">
                  <span className="meta-icon">🎯</span> {aiCourse.checkpointsCount} Checkpoint Otomatis
                </span>
                <span className="meta-item">
                  <span className="meta-icon">⚡</span> Dual-Mode (Pra-Training & Kelas)
                </span>
              </div>
            </div>
            <div className="notebook-card-footer">
              <Link
                to="/course/ai"
                search={{ mode: 'pretraining' }}
                preload="intent"
                className="btn btn-primary btn-block"
                id="btn-home-enter-ai"
              >
                <span>Buka Ruang Kerja AI</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>
            </div>
          </div>
        )}

        {(filter === 'all' || filter === 'word') && wordCourse && (
          <div className="notebook-card" id="card-home-course-word" data-category="word">
            <div className="notebook-card-cover cover-gradient-word">
              <div className="notebook-card-icon-wrapper">
                <span className="notebook-card-icon">📝</span>
              </div>
              <div className="notebook-card-status">
                <span className="badge badge-pill badge-neutral" id="home-badge-word-status">
                  {wordCourse.badge}
                </span>
              </div>
            </div>
            <div className="notebook-card-body">
              <div className="notebook-card-category">Standardisasi ASN DKI Jakarta</div>
              <h4 className="notebook-card-title">{wordCourse.title}</h4>
              <p className="notebook-card-subtitle">{wordCourse.subtitle}</p>
              <p className="notebook-card-desc">{wordCourse.description}</p>
              <div className="notebook-card-meta">
                <span className="meta-item">
                  <span className="meta-icon">📑</span> {wordCourse.modulesCount} Bab Kurikulum
                </span>
                <span className="meta-item">
                  <span className="meta-icon">🎯</span> {wordCourse.checkpointsCount} Checkpoint Praktik
                </span>
                <span className="meta-item">
                  <span className="meta-icon">✅</span> 28 Checklist Mandiri
                </span>
                <span className="meta-item">
                  <span className="meta-icon">🎓</span> Sertifikat Kelulusan BPSDM
                </span>
              </div>
            </div>
            <div className="notebook-card-footer">
              <Link to="/course/word" search={{}} preload="intent" className="btn btn-secondary btn-block" id="btn-home-enter-word">
                <span id="btn-home-word-label">Buka Modul Pengolahan Kata</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
