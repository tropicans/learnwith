import React, { Suspense } from 'react'
import { Await } from '@tanstack/react-router'
import { StatsSkeleton } from '@/components/ui/Skeleton'
import type { CourseStats } from '@/data/courses'

interface LiveClassStatsProps {
  deferredStats: Promise<CourseStats>
}

export function LiveClassStats({ deferredStats }: LiveClassStatsProps) {
  return (
    <section id="sec-live-stats" className="content-section" aria-label="Statistik Partisipasi Kelas">
      <div className="section-header">
        <div className="section-title-wrap">
          <div
            className="section-badge-icon"
            style={{
              background: 'var(--accent-primary-subtle)',
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
            📊
          </div>
          <div>
            <h3 className="section-title">Telemetri Partisipasi Kelas</h3>
            <p className="section-desc">
              Data keaktifan peserta dan tingkat kelulusan checkpoint praktik secara real-time.
            </p>
          </div>
        </div>
      </div>

      <div className="card card-glass">
        <div className="card-body" style={{ padding: '1.25rem 1.75rem' }}>
          <Suspense fallback={<StatsSkeleton />}>
            <Await promise={deferredStats}>
              {(stats: CourseStats) => (
                <div className="live-stats-container">
                  <div className="live-stat-card">
                    <div className="live-stat-icon-box blue" aria-hidden="true">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </div>
                    <div className="live-stat-info">
                      <span className="live-stat-label">Peserta Terhubung Langsung</span>
                      <div className="live-stat-value-row">
                        <strong className="live-stat-value">{stats.activeParticipants}</strong>
                        <span className="live-stat-unit">Peserta Aktif</span>
                      </div>
                      <span className="live-stat-subtext">Sinkronisasi telemetri kelas otomatis</span>
                    </div>
                  </div>

                  <div className="live-stat-divider" aria-hidden="true" />

                  <div className="live-stat-card">
                    <div className="live-stat-icon-box green" aria-hidden="true">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                    </div>
                    <div className="live-stat-info">
                      <span className="live-stat-label">Kelulusan Checkpoint Praktik</span>
                      <div className="live-stat-value-row">
                        <strong className="live-stat-value">{stats.completionRate}%</strong>
                        <span className="live-stat-unit">Rata-rata Kelas</span>
                      </div>
                      <span className="live-stat-subtext">Akumulasi kelulusan seluruh modul</span>
                    </div>
                  </div>

                  <div className="live-stat-divider" aria-hidden="true" />

                  <div className="live-stat-card">
                    <div className="live-stat-icon-box purple" aria-hidden="true">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                      </svg>
                    </div>
                    <div className="live-stat-info">
                      <span className="live-stat-label">Status Lingkungan Runtime</span>
                      <div className="live-stat-value-row">
                        <strong className="live-stat-value" style={{ color: '#16a34a' }}>Normal</strong>
                        <span className="live-stat-unit">Port 20128 Siap</span>
                      </div>
                      <span className="live-stat-subtext">Zero-conflict gateway standby</span>
                    </div>
                  </div>
                </div>
              )}
            </Await>
          </Suspense>
        </div>
      </div>
    </section>
  )
}