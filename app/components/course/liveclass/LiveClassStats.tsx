import React, { Suspense } from 'react'
import { Await } from '@tanstack/react-router'
import type { CourseStats } from '@/data/courses'

interface LiveClassStatsProps {
  deferredStats: Promise<CourseStats>
}

function LiveStatsGridSkeleton() {
  return (
    <div className="live-stats-grid">
      {[1, 2, 3].map((i) => (
        <div key={i} className="live-stat-card card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
              }}
            />
            <div
              style={{
                width: '68px',
                height: '22px',
                borderRadius: '999px',
                background: 'rgba(255, 255, 255, 0.04)',
              }}
            />
          </div>
          <div style={{ marginTop: '0.75rem' }}>
            <div
              style={{
                width: '45%',
                height: '13px',
                borderRadius: '4px',
                background: 'rgba(255, 255, 255, 0.04)',
                marginBottom: '0.6rem',
              }}
            />
            <div
              style={{
                width: '65%',
                height: '26px',
                borderRadius: '6px',
                background: 'rgba(255, 255, 255, 0.06)',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export function LiveClassStats({ deferredStats }: LiveClassStatsProps) {
  return (
    <section id="sec-live-stats" className="content-section" aria-label="Statistik Partisipasi Kelas">
      <div className="section-header">
        <div className="section-title-wrap">
          <div className="section-badge-num">
            <span>📊</span>
          </div>
          <div>
            <h3 className="section-title">
              Telemetri Partisipasi Kelas
            </h3>
            <p className="section-desc">
              Data keaktifan peserta dan kesiapan gateway runtime secara real-time.
            </p>
          </div>
        </div>
      </div>

      <Suspense fallback={<LiveStatsGridSkeleton />}>
        <Await promise={deferredStats}>
          {(stats: CourseStats) => (
            <div className="live-stats-grid">
              {/* Card 1: Peserta Aktif */}
              <div className="live-stat-card card">
                <div className="live-stat-top">
                  <div className="live-stat-icon-box blue" aria-hidden="true">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <div className="live-stat-badge live">
                    <span className="live-stat-pulse-dot" />
                    Live Sync
                  </div>
                </div>

                <div className="live-stat-info">
                  <span className="live-stat-label">
                    Peserta Terhubung Langsung
                  </span>
                  <div className="live-stat-value-row">
                    <strong className="live-stat-value">
                      {stats.activeParticipants}
                    </strong>
                    <span className="live-stat-unit-badge">
                      Peserta Aktif
                    </span>
                  </div>
                </div>

                <div className="live-stat-footer">
                  <span style={{ color: 'var(--lw-status-success, #10b981)' }}>●</span>
                  <span>Sinkronisasi telemetri kelas otomatis</span>
                </div>
              </div>

              {/* Card 2: Kelulusan Checkpoint */}
              <div className="live-stat-card card">
                <div className="live-stat-top">
                  <div className="live-stat-icon-box green" aria-hidden="true">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                  <div className="live-stat-badge target">
                    Target ≥ 80%
                  </div>
                </div>

                <div className="live-stat-info">
                  <span className="live-stat-label">
                    Kelulusan Checkpoint Praktik
                  </span>
                  <div className="live-stat-value-row">
                    <strong className="live-stat-value" style={{ color: 'var(--lw-status-success, #10b981)' }}>
                      {stats.completionRate}%
                    </strong>
                    <span className="live-stat-unit-badge">
                      Rata-rata Kelas
                    </span>
                  </div>
                </div>

                <div className="live-stat-footer">
                  <span style={{ color: 'var(--lw-status-success, #10b981)' }}>✓</span>
                  <span>Akumulasi kelulusan seluruh modul</span>
                </div>
              </div>

              {/* Card 3: Status Lingkungan Runtime */}
              <div className="live-stat-card card">
                <div className="live-stat-top">
                  <div className="live-stat-icon-box purple" aria-hidden="true">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                    </svg>
                  </div>
                  <div className="live-stat-badge system">
                    Daemon 9Router
                  </div>
                </div>

                <div className="live-stat-info">
                  <span className="live-stat-label">
                    Status Lingkungan Runtime
                  </span>
                  <div className="live-stat-value-row">
                    <strong className="live-stat-value" style={{ color: 'var(--lw-status-success, #10b981)' }}>
                      Normal
                    </strong>
                    <span className="live-stat-unit-badge">
                      Port 20128 Siap
                    </span>
                  </div>
                </div>

                <div className="live-stat-footer">
                  <span style={{ color: 'var(--lw-accent-violet-400, #c084fc)' }}>⚡</span>
                  <span>Zero-conflict gateway standby</span>
                </div>
              </div>
            </div>
          )}
        </Await>
      </Suspense>
    </section>
  )
}