import { createFileRoute, Await } from '@tanstack/react-router'
import { Suspense, useState, useEffect } from 'react'
import { courseWordSearchSchema } from '@/schemas/searchParams'
import { getCourseWordData, getCourseStatsAsync, type CourseStats } from '@/data/courses'
import { StatsSkeleton } from '@/components/ui/Skeleton'
import { ChecklistIsland } from '@/components/course/ChecklistIsland'
import { InstructorUnlockModal } from '@/components/course/InstructorUnlockModal'

export const Route = createFileRoute('/course/word')({
  validateSearch: (search) => courseWordSearchSchema.parse(search),
  loader: async () => {
    const course = await getCourseWordData()
    return {
      course,
      deferredStats: getCourseStatsAsync(course.id),
    }
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
  const { course, deferredStats } = Route.useLoaderData()
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false)
  const [isUnlocked, setIsUnlocked] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('learnwith_word_unlocked') === 'true'
      setIsUnlocked(stored)
    }
  }, [])

  const handleUnlocked = () => {
    setIsUnlocked(true)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('learnwith_word_unlocked', 'true')
    }
  }

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

        <div style={{ marginTop: '1rem' }}>
          {isUnlocked ? (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                backgroundColor: '#f0fdf4',
                color: '#166534',
                borderRadius: '8px',
                border: '1px solid #bbf7d0',
                fontSize: '0.9rem',
                fontWeight: 600,
              }}
            >
              ✅ Materi Uji Kompetensi Terbuka
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsUnlockModalOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 1.2rem',
                backgroundColor: '#0f172a',
                color: '#ffffff',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 600,
                boxShadow: '0 2px 4px rgba(15, 23, 42, 0.15)',
              }}
            >
              🔒 Buka Kunci Instruktur (Passkey)
            </button>
          )}
        </div>
      </div>

      {/* Progressive Streaming Section (SSR-02) */}
      <section className="course-streaming-stats">
        <Suspense fallback={<StatsSkeleton />}>
          <Await promise={deferredStats}>
            {(stats: CourseStats) => (
              <div
                className="course-stats-banner"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  padding: '1rem 1.5rem',
                  background: 'var(--bg-surface, #ffffff)',
                  border: '1px solid var(--border-subtle, #e0e0e0)',
                  borderRadius: 'var(--radius-md, 10px)',
                  margin: '1.25rem 0',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.75rem' }}>👥</span>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted, #5f6368)' }}>
                      Alumni ASN Terakreditasi
                    </div>
                    <strong style={{ fontSize: '1.15rem', color: 'var(--text-primary, #202124)' }}>
                      {stats.activeParticipants} ASN
                    </strong>
                  </div>
                </div>
                <div style={{ height: '36px', width: '1px', background: 'var(--border-subtle, #e0e0e0)' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.75rem' }}>🎯</span>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted, #5f6368)' }}>
                      Tingkat Kelulusan Uji Kompetensi
                    </div>
                    <strong style={{ fontSize: '1.15rem', color: 'var(--text-primary, #202124)' }}>
                      {stats.completionRate}% Lulus Pergub 14/2020
                    </strong>
                  </div>
                </div>
              </div>
            )}
          </Await>
        </Suspense>
      </section>

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

      {/* Hydration-Safe Client-Only Checklist Island (SSR-04) */}
      <section className="course-island-section" style={{ marginTop: '2rem' }}>
        <ChecklistIsland courseId={course.id} modules={course.modules} />
      </section>

      {/* Instructor Unlock Modal */}
      <InstructorUnlockModal
        courseId="word"
        isOpen={isUnlockModalOpen}
        onClose={() => setIsUnlockModalOpen(false)}
        onUnlocked={handleUnlocked}
      />
    </main>
  )
}
