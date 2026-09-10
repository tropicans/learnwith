import React from 'react'
import type { CourseData, CourseStats } from '@/data/courses'
import { LiveClassHero } from './LiveClassHero'
import { LiveClassStats } from './LiveClassStats'
import { LiveClassModulesSection } from './LiveClassModulesSection'
import { LiveClassCheckpointsSection } from './LiveClassCheckpointsSection'
import { ChecklistIsland } from '../ChecklistIsland'

interface LiveClassContainerProps {
  course: CourseData
  deferredStats: Promise<CourseStats>
  isUnlocked: boolean
  onOpenUnlockModal: () => void
  onRelock?: () => void
}

export function LiveClassContainer({
  course,
  deferredStats,
  isUnlocked,
  onOpenUnlockModal,
  onRelock,
}: LiveClassContainerProps) {
  return (
    <div id="container-liveclass" className="mode-container active">
      <LiveClassHero
        isUnlocked={isUnlocked}
        onOpenUnlockModal={onOpenUnlockModal}
        onRelock={onRelock}
      />

      <LiveClassStats deferredStats={deferredStats} />

      <LiveClassModulesSection
        isUnlocked={isUnlocked}
        onOpenUnlockModal={onOpenUnlockModal}
      />

      <LiveClassCheckpointsSection
        isUnlocked={isUnlocked}
        onOpenUnlockModal={onOpenUnlockModal}
      />

      {/* Checklist Island Section */}
      <section id="sec-live-checklist" className="course-island-section" style={{ marginTop: '2.5rem' }}>
        <ChecklistIsland courseId={course.id} modules={course.modules} />
      </section>
    </div>
  )
}