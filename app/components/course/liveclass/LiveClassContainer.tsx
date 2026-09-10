import React from 'react'
import type { CourseData, CourseStats } from '@/data/courses'
import { LiveClassHero } from './LiveClassHero'
import { LiveClassTargetSection } from './LiveClassTargetSection'
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

      <LiveClassTargetSection />

      <LiveClassStats deferredStats={deferredStats} />

      <LiveClassModulesSection
        isUnlocked={isUnlocked}
        onOpenUnlockModal={onOpenUnlockModal}
      />

      <LiveClassCheckpointsSection
        isUnlocked={isUnlocked}
        onOpenUnlockModal={onOpenUnlockModal}
      />

      {/* Checklist Island Section matching Pra-Training */}
      <section id="sec-live-checklist" className="content-section" style={{ marginTop: '3rem' }}>
        <div className="section-header">
          <div className="section-title-wrap">
            <div
              className="section-badge-icon"
              style={{
                background: 'rgba(59, 130, 246, 0.12)',
                color: 'var(--accent-primary)',
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.1rem',
              }}
            >
              📝
            </div>
            <div>
              <h3 className="section-title">Lembar Checklist Mandiri Peserta Hari-H</h3>
              <p className="section-desc">
                Pantau progres pengerjaan tugas praktik Anda secara keseluruhan.
              </p>
            </div>
          </div>
        </div>

        <ChecklistIsland courseId={course.id} modules={course.modules} />
      </section>
    </div>
  )
}