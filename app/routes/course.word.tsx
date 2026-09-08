import { createFileRoute } from '@tanstack/react-router'
import { courseWordSearchSchema } from '@/schemas/searchParams'
import { getCourseWordData } from '@/data/courses'

export const Route = createFileRoute('/course/word')({
  validateSearch: (search) => courseWordSearchSchema.parse(search),
  loader: async () => {
    const course = await getCourseWordData()
    return { course }
  },
  head: ({ loaderData }) => {
    const title = loaderData?.course?.title || 'Pengolahan Kata Tingkat Lanjut (ASN)'
    const desc = loaderData?.course?.subtitle || 'Standardisasi Dokumen Dinas Sesuai Pergub DKI No. 14/2020'
    return {
      meta: [
        { title: `${title} — learnwith Yudhi` },
        { name: 'description', content: desc },
        { property: 'og:title', content: title },
        { property: 'og:type', content: 'website' },
      ],
    }
  },
  component: CourseWordComponent,
})

function CourseWordComponent() {
  const search = Route.useSearch()
  const { course } = Route.useLoaderData()

  return (
    <main className="app-main course-main" id="container-course-word">
      <div className="course-header-banner">
        <div className="course-hero-badge">
          <span className="badge badge-pill badge-neutral">{course.badge}</span>
          <span className="course-session-pill">Standardisasi Dokumen Kedinasan ASN</span>
        </div>
        <h2>{course.title}</h2>
        <p className="course-subtitle">{course.subtitle}</p>
        <p className="course-desc">{course.description}</p>
      </div>

      {/* Curriculum Bab Overview */}
      <section className="course-syllabus-section">
        <div className="syllabus-header">
          <h3 className="section-title">Struktur Kurikulum & Bab Pembelajaran</h3>
          <span className="syllabus-meta">
            {course.modulesCount} Bab • 28 Checklist Praktik • 3 Checkpoint BPSDM
          </span>
        </div>

        <div className="modules-list">
          {course.modules.map((m) => (
            <div key={m.id} className="module-item-card" data-module-id={m.id}>
              <div className="module-item-header">
                <span className="module-badge">{m.id.toUpperCase()}</span>
                <h4 className="module-title">{m.title}</h4>
                <span className="module-time">⏱️ {m.estimatedMinutes} menit</span>
              </div>
              <p className="module-desc">{m.subtitle}</p>
              {m.checkpoints && m.checkpoints.length > 0 && (
                <div className="module-checkpoints">
                  {m.checkpoints.map((cp, idx) => (
                    <span key={idx} className="checkpoint-tag">
                      🎯 {cp}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
