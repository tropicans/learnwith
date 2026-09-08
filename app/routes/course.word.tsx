import { createFileRoute } from '@tanstack/react-router'
import { courseWordSearchSchema } from '@/schemas/searchParams'

export const Route = createFileRoute('/course/word')({
  validateSearch: (search) => courseWordSearchSchema.parse(search),
  head: () => ({
    meta: [
      { title: 'Pengolahan Kata Tingkat Lanjut (ASN) — Workspace' },
    ],
  }),
  component: CourseWordComponent,
})

function CourseWordComponent() {
  const search = Route.useSearch()

  return (
    <main className="app-main course-main" id="container-course-word">
      <div className="course-header-banner">
        <h2>Pengolahan Kata Tingkat Lanjut (Standar BPSDM)</h2>
        <p>Format Dokumen Kedinasan, Styles, TOC Otomatis & Mail Merge.</p>
      </div>

      <div className="course-content-placeholder">
        <p>Status Modul: Aktif dalam navigasi rute TanStack Router.</p>
      </div>
    </main>
  )
}
