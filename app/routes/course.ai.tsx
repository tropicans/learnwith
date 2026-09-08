import { createFileRoute, Link } from '@tanstack/react-router'
import { courseAiSearchSchema } from '@/schemas/searchParams'
import { getCourseAiData } from '@/data/courses'

export const Route = createFileRoute('/course/ai')({
  validateSearch: (search) => courseAiSearchSchema.parse(search),
  loaderDeps: ({ search }) => ({ mode: search.mode }),
  loader: async ({ deps }) => {
    const course = await getCourseAiData(deps.mode)
    return { course }
  },
  head: ({ loaderData }) => {
    const title = loaderData?.course?.title || 'Hands-on Agentic AI — Workspace Workshop'
    const desc = loaderData?.course?.subtitle || 'Praktik Deploy Hermes Agent & 9Router di Windows'
    return {
      meta: [
        { title: `${title} — learnwith Yudhi` },
        { name: 'description', content: desc },
        { property: 'og:title', content: title },
        { property: 'og:type', content: 'website' },
      ],
    }
  },
  component: CourseAiComponent,
})

function CourseAiComponent() {
  const { mode } = Route.useSearch()
  const { course } = Route.useLoaderData()

  return (
    <main className="app-main course-main" id="container-course-ai">
      <div className="course-mode-tabs">
        <Link
          to="/course/ai"
          search={{ mode: 'pretraining' }}
          className={`mode-tab ${mode === 'pretraining' ? 'active' : ''}`}
        >
          📋 Pra-Training
        </Link>
        <Link
          to="/course/ai"
          search={{ mode: 'live-class' }}
          className={`mode-tab ${mode === 'live-class' ? 'active' : ''}`}
        >
          🚀 Hari-H Kelas 🔒
        </Link>
      </div>

      <section className="course-hero-header">
        <div className="course-hero-badge">
          <span className="badge badge-pill badge-success">{course.badge}</span>
          <span className="course-session-pill">
            {mode === 'pretraining' ? 'Mode Persiapan Mandiri' : 'Mode Kelas Terbimbing'}
          </span>
        </div>
        <h2 className="course-title">{course.title}</h2>
        <p className="course-subtitle">{course.subtitle}</p>
        <p className="course-desc">{course.description}</p>
      </section>

      {/* Curriculum Outline */}
      <section className="course-syllabus-section">
        <div className="syllabus-header">
          <h3 className="section-title">Silabus & Rangkaian Modul Praktik</h3>
          <span className="syllabus-meta">
            {course.modulesCount} Modul • {course.checkpointsCount} Checkpoint Otomatis
          </span>
        </div>

        <div className="modules-list">
          {course.modules.map((m) => (
            <div key={m.id} className="module-item-card" data-module-id={m.id}>
              <div className="module-item-header">
                <span className="module-badge">Modul {m.num}</span>
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
