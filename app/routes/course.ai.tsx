import { createFileRoute, Link } from '@tanstack/react-router'
import { courseAiSearchSchema } from '@/schemas/searchParams'

export const Route = createFileRoute('/course/ai')({
  validateSearch: (search) => courseAiSearchSchema.parse(search),
  head: () => ({
    meta: [
      { title: 'Hands-on Agentic AI — Workspace Workshop' },
    ],
  }),
  component: CourseAiComponent,
})

function CourseAiComponent() {
  const { mode } = Route.useSearch()

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

      <div className="course-content-placeholder">
        <h2>Workshop Agentic AI: {mode === 'pretraining' ? 'Sesi Pra-Training' : 'Sesi Hari-H Praktik'}</h2>
        <p>Navigasi rute terverifikasi. Komponen kurikulum interaktif dimuat pada workspace ini.</p>
      </div>
    </main>
  )
}
