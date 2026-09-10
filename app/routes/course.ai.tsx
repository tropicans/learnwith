import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect, useRef } from 'react'
import { courseAiSearchSchema } from '@/schemas/searchParams'
import { getCourseAiData, getCourseStatsAsync } from '@/data/courses'
import { getPublicCourseStatusesFn } from '@/server/courseLifecycle'
import { CourseUnavailableNotice } from '@/components/course/CourseUnavailableNotice'
import { UnlistedCourseBanner } from '@/components/course/UnlistedCourseBanner'
import { InstructorUnlockModal } from '@/components/course/InstructorUnlockModal'
import { PretrainingHero } from '@/components/course/pretraining/PretrainingHero'
import { PretrainingTargetSection } from '@/components/course/pretraining/PretrainingTargetSection'
import { PretrainingGlossarySection } from '@/components/course/pretraining/PretrainingGlossarySection'
import { PretrainingSecuritySection } from '@/components/course/pretraining/PretrainingSecuritySection'
import { PretrainingPrerequisitesSection } from '@/components/course/pretraining/PretrainingPrerequisitesSection'
import { PretrainingPowerShellSection } from '@/components/course/pretraining/PretrainingPowerShellSection'
import { PretrainingModulesSection } from '@/components/course/pretraining/PretrainingModulesSection'
import { PretrainingCheckpointsSection } from '@/components/course/pretraining/PretrainingCheckpointsSection'
import { PretrainingReadinessSection } from '@/components/course/pretraining/PretrainingReadinessSection'
import { PretrainingTroubleshootingSection } from '@/components/course/pretraining/PretrainingTroubleshootingSection'
import { PretrainingRedactionSection } from '@/components/course/pretraining/PretrainingRedactionSection'
import { PretrainingReadinessReportSection } from '@/components/course/pretraining/PretrainingReadinessReportSection'
import { PretrainingSidebar } from '@/components/course/pretraining/PretrainingSidebar'
import { ResetProgressModal } from '@/components/course/pretraining/ResetProgressModal'
import { LiveClassContainer } from '@/components/course/liveclass/LiveClassContainer'
import { usePretrainingState } from '@/hooks/usePretrainingState'
import { showToast } from '@/components/ui/Toast'

export const Route = createFileRoute('/course/ai')({
  validateSearch: (search) => courseAiSearchSchema.parse(search),
  loaderDeps: ({ search }) => ({ mode: search.mode }),
  loader: async ({ deps }) => {
    const [course, statuses] = await Promise.all([
      getCourseAiData(deps.mode),
      getPublicCourseStatusesFn().catch(() => []),
    ])
    const statusRecord = statuses.find((s) => s.id === 'ai')
    const lifecycleStatus = statusRecord?.status ?? 'active'
    return {
      course,
      lifecycleStatus,
      deferredStats: getCourseStatsAsync(course.id),
    }
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
  const { course, lifecycleStatus, deferredStats } = Route.useLoaderData()
  const initialStatusRef = useRef(lifecycleStatus)
  const [isInFlightChanged, setIsInFlightChanged] = useState(false)
  const { readiness, resetState } = usePretrainingState()
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [isResetModalOpen, setIsResetModalOpen] = useState(false)

  useEffect(() => {
    const wasAccessible = initialStatusRef.current === 'active' || initialStatusRef.current === 'hidden'
    const isNowRestricted = lifecycleStatus === 'deleted' || lifecycleStatus === 'archived'
    if (wasAccessible && isNowRestricted) {
      setIsInFlightChanged(true)
    }
  }, [lifecycleStatus])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('live_class_unlocked') === 'true'
      setIsUnlocked(stored)
    }
  }, [])

  const handleUnlocked = () => {
    setIsUnlocked(true)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('live_class_unlocked', 'true')
    }
    showToast('Akses Instruktur Terbuka! Selamat Datang.', 'success', 3000)
  }

  const handleRelock = () => {
    setIsUnlocked(false)
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('live_class_unlocked')
    }
    showToast('Sesi Hari-H dikunci kembali 🔒', 'info', 2000)
  }

  if (initialStatusRef.current === 'deleted' || initialStatusRef.current === 'archived') {
    return (
      <CourseUnavailableNotice
        status={initialStatusRef.current}
        courseId="ai"
        courseTitle={course.title}
      />
    )
  }

  return (
    <>
      <PretrainingSidebar currentMode={mode} />
      <main className="app-main course-main" id="container-course-ai">
        {isInFlightChanged && (
          <UnlistedCourseBanner courseId="ai" isInFlight targetStatus={lifecycleStatus} />
        )}
        {initialStatusRef.current === 'hidden' && !isInFlightChanged && (
          <UnlistedCourseBanner courseId="ai" />
        )}

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
            🚀 Hari-H Kelas {isUnlocked ? '🔓' : '🔒'}
          </Link>
        </div>

        {mode === 'pretraining' ? (
          <div id="container-pretraining" className="mode-container active">
            <PretrainingHero />
            <PretrainingTargetSection />
            <PretrainingGlossarySection />
            <PretrainingSecuritySection />
            <PretrainingPrerequisitesSection />
            <PretrainingPowerShellSection />
            <PretrainingModulesSection />
            <PretrainingCheckpointsSection />
            <PretrainingReadinessSection
              readiness={readiness}
              onOpenResetModal={() => setIsResetModalOpen(true)}
            />
            <PretrainingTroubleshootingSection />
            <PretrainingRedactionSection />
            <PretrainingReadinessReportSection />
            <ResetProgressModal
              isOpen={isResetModalOpen}
              onClose={() => setIsResetModalOpen(false)}
              onConfirm={() => {
                resetState()
                setIsResetModalOpen(false)
                showToast(
                  'Semua progres dan verifikasi berhasil diatur ulang 🔄',
                  'info',
                  2500
                )
              }}
            />
          </div>
        ) : (
          <LiveClassContainer
            course={course}
            deferredStats={deferredStats}
            isUnlocked={isUnlocked}
            onOpenUnlockModal={() => setIsUnlockModalOpen(true)}
            onRelock={handleRelock}
          />
        )}

        {/* Instructor Unlock Modal */}
        <InstructorUnlockModal
          courseId="ai"
          isOpen={isUnlockModalOpen}
          onClose={() => setIsUnlockModalOpen(false)}
          onUnlocked={handleUnlocked}
        />
      </main>
    </>
  )
}
