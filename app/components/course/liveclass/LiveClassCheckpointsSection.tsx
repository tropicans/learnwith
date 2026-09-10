import React from 'react'
import { LIVE_CLASS_MODULES } from '@/data/liveClassModules'

interface LiveClassCheckpointsSectionProps {
  isUnlocked: boolean
  onOpenUnlockModal: () => void
}

export function LiveClassCheckpointsSection({
  isUnlocked,
  onOpenUnlockModal,
}: LiveClassCheckpointsSectionProps) {
  return (
    <section id="sec-live-checkpoints" className="live-checkpoints-section">
      <div className="live-section-header">
        <div className="live-section-title-group">
          <div className="live-section-icon" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
          <div>
            <h2 className="live-section-title">6 Gerbang Checkpoint Praktik Hari-H</h2>
            <p className="live-section-desc">
              Pemeriksaan bertahap untuk memastikan setiap komponen integrasi (9Router, Hermes, Telegram, Google Calendar)
              berfungsi 100% tanpa error sebelum beranjak ke modul berikutnya.
            </p>
          </div>
        </div>
      </div>

      <div className="live-checkpoints-grid">
        {LIVE_CLASS_MODULES.map((mod) => (
          <div key={`cp-${mod.num}`} className="live-checkpoint-card">
            <div className="live-checkpoint-card-header">
              <span className="live-cp-badge">Checkpoint {mod.num}</span>
              <span className={`live-cp-status ${isUnlocked ? 'status-ready' : 'status-locked'}`}>
                {isUnlocked ? 'Siap Uji' : 'Terkunci'}
              </span>
            </div>

            <h3 className="live-cp-title">{mod.checkpointTitle.replace(/^Checkpoint \d+:\s*/, '')}</h3>
            <p className="live-cp-desc">{mod.checkpointDescription}</p>

            <div className="live-cp-footer">
              <span className="live-cp-module-tag">Tautan Modul {mod.num}</span>
              <a href={`#${mod.id}`} className="live-cp-link">
                <span>Buka Modul</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}