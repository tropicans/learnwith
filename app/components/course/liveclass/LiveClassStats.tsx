import React, { Suspense } from 'react'
import { Await } from '@tanstack/react-router'
import type { CourseStats } from '@/data/courses'

interface LiveClassStatsProps {
  deferredStats: Promise<CourseStats>
}

function LiveStatsGridSkeleton() {
  return (
    <div
      className="live-stats-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem',
      }}
    >
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="live-stat-card card card-glass"
          style={{
            padding: '1.25rem 1.5rem',
            borderRadius: 'var(--radius-lg, 16px)',
            minHeight: '140px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: 'var(--bg-surface, #ffffff)',
            border: '1px solid var(--border-subtle, #e2e8f0)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'rgba(0, 0, 0, 0.06)',
              }}
            />
            <div
              style={{
                width: '68px',
                height: '22px',
                borderRadius: '999px',
                background: 'rgba(0, 0, 0, 0.05)',
              }}
            />
          </div>
          <div style={{ marginTop: '0.75rem' }}>
            <div
              style={{
                width: '45%',
                height: '13px',
                borderRadius: '4px',
                background: 'rgba(0, 0, 0, 0.05)',
                marginBottom: '0.6rem',
              }}
            />
            <div
              style={{
                width: '65%',
                height: '26px',
                borderRadius: '6px',
                background: 'rgba(0, 0, 0, 0.07)',
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
      <div className="section-header" style={{ marginBottom: '1.25rem' }}>
        <div className="section-title-wrap">
          <div
            className="section-badge-icon"
            style={{
              background: 'var(--accent-primary-subtle, rgba(37, 99, 235, 0.1))',
              color: 'var(--accent-primary, #2563eb)',
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md, 10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.1rem',
            }}
          >
            📊
          </div>
          <div>
            <h3 className="section-title" style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>
              Telemetri Partisipasi Kelas
            </h3>
            <p className="section-desc" style={{ margin: '0.25rem 0 0 0', color: 'var(--text-muted, #64748b)', fontSize: '0.875rem' }}>
              Data keaktifan peserta dan kesiapan gateway runtime secara real-time.
            </p>
          </div>
        </div>
      </div>

      <Suspense fallback={<LiveStatsGridSkeleton />}>
        <Await promise={deferredStats}>
          {(stats: CourseStats) => (
            <div
              className="live-stats-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '1.25rem',
                marginBottom: '2rem',
              }}
            >
              {/* Card 1: Peserta Aktif */}
              <div
                className="live-stat-card card card-glass"
                style={{
                  padding: '1.25rem 1.5rem',
                  borderRadius: 'var(--radius-lg, 16px)',
                  background: 'var(--bg-surface, #ffffff)',
                  border: '1px solid var(--border-subtle, #e2e8f0)',
                  boxShadow: 'var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.04))',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
              >
                <div
                  className="live-stat-top"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div
                    className="live-stat-icon-box blue"
                    aria-hidden="true"
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(37, 99, 235, 0.1)',
                      color: '#2563eb',
                    }}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <div
                    className="live-stat-badge live"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.25rem 0.65rem',
                      borderRadius: '999px',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      background: 'rgba(16, 185, 129, 0.1)',
                      color: '#059669',
                      border: '1px solid rgba(16, 185, 129, 0.25)',
                      letterSpacing: '0.02em',
                      textTransform: 'uppercase',
                    }}
                  >
                    <span
                      className="live-stat-pulse-dot"
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: '#10b981',
                        display: 'inline-block',
                      }}
                    />
                    Live Sync
                  </div>
                </div>

                <div className="live-stat-info" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <span
                    className="live-stat-label"
                    style={{
                      fontSize: '0.775rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      color: 'var(--text-muted, #64748b)',
                    }}
                  >
                    Peserta Terhubung Langsung
                  </span>
                  <div
                    className="live-stat-value-row"
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '0.6rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    <strong
                      className="live-stat-value"
                      style={{
                        fontSize: '1.75rem',
                        fontWeight: 800,
                        color: 'var(--text-primary, #0f172a)',
                        lineHeight: 1.1,
                      }}
                    >
                      {stats.activeParticipants}
                    </strong>
                    <span
                      className="live-stat-unit-badge"
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        padding: '0.2rem 0.55rem',
                        borderRadius: '6px',
                        background: 'rgba(37, 99, 235, 0.08)',
                        color: '#2563eb',
                      }}
                    >
                      Peserta Aktif
                    </span>
                  </div>
                </div>

                <div
                  className="live-stat-footer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted, #94a3b8)',
                    paddingTop: '0.6rem',
                    borderTop: '1px solid var(--border-subtle, rgba(0,0,0,0.05))',
                    marginTop: 'auto',
                  }}
                >
                  <span style={{ color: '#10b981' }}>●</span>
                  <span>Sinkronisasi telemetri kelas otomatis</span>
                </div>
              </div>

              {/* Card 2: Kelulusan Checkpoint */}
              <div
                className="live-stat-card card card-glass"
                style={{
                  padding: '1.25rem 1.5rem',
                  borderRadius: 'var(--radius-lg, 16px)',
                  background: 'var(--bg-surface, #ffffff)',
                  border: '1px solid var(--border-subtle, #e2e8f0)',
                  boxShadow: 'var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.04))',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
              >
                <div
                  className="live-stat-top"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div
                    className="live-stat-icon-box green"
                    aria-hidden="true"
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(16, 185, 129, 0.1)',
                      color: '#10b981',
                    }}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                  <div
                    className="live-stat-badge target"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.25rem 0.65rem',
                      borderRadius: '999px',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      background: 'rgba(59, 130, 246, 0.08)',
                      color: '#2563eb',
                      border: '1px solid rgba(59, 130, 246, 0.2)',
                      letterSpacing: '0.02em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Target ≥ 80%
                  </div>
                </div>

                <div className="live-stat-info" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <span
                    className="live-stat-label"
                    style={{
                      fontSize: '0.775rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      color: 'var(--text-muted, #64748b)',
                    }}
                  >
                    Kelulusan Checkpoint Praktik
                  </span>
                  <div
                    className="live-stat-value-row"
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '0.6rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    <strong
                      className="live-stat-value"
                      style={{
                        fontSize: '1.75rem',
                        fontWeight: 800,
                        color: '#059669',
                        lineHeight: 1.1,
                      }}
                    >
                      {stats.completionRate}%
                    </strong>
                    <span
                      className="live-stat-unit-badge"
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        padding: '0.2rem 0.55rem',
                        borderRadius: '6px',
                        background: 'rgba(16, 185, 129, 0.08)',
                        color: '#059669',
                      }}
                    >
                      Rata-rata Kelas
                    </span>
                  </div>
                </div>

                <div
                  className="live-stat-footer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted, #94a3b8)',
                    paddingTop: '0.6rem',
                    borderTop: '1px solid var(--border-subtle, rgba(0,0,0,0.05))',
                    marginTop: 'auto',
                  }}
                >
                  <span style={{ color: '#059669' }}>✓</span>
                  <span>Akumulasi kelulusan seluruh modul</span>
                </div>
              </div>

              {/* Card 3: Status Lingkungan Runtime */}
              <div
                className="live-stat-card card card-glass"
                style={{
                  padding: '1.25rem 1.5rem',
                  borderRadius: 'var(--radius-lg, 16px)',
                  background: 'var(--bg-surface, #ffffff)',
                  border: '1px solid var(--border-subtle, #e2e8f0)',
                  boxShadow: 'var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.04))',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
              >
                <div
                  className="live-stat-top"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div
                    className="live-stat-icon-box purple"
                    aria-hidden="true"
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(139, 92, 246, 0.1)',
                      color: '#8b5cf6',
                    }}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                    </svg>
                  </div>
                  <div
                    className="live-stat-badge system"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.25rem 0.65rem',
                      borderRadius: '999px',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      background: 'rgba(139, 92, 246, 0.08)',
                      color: '#7c3aed',
                      border: '1px solid rgba(139, 92, 246, 0.2)',
                      letterSpacing: '0.02em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Daemon 9Router
                  </div>
                </div>

                <div className="live-stat-info" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <span
                    className="live-stat-label"
                    style={{
                      fontSize: '0.775rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      color: 'var(--text-muted, #64748b)',
                    }}
                  >
                    Status Lingkungan Runtime
                  </span>
                  <div
                    className="live-stat-value-row"
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '0.6rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    <strong
                      className="live-stat-value"
                      style={{
                        fontSize: '1.75rem',
                        fontWeight: 800,
                        color: '#16a34a',
                        lineHeight: 1.1,
                      }}
                    >
                      Normal
                    </strong>
                    <span
                      className="live-stat-unit-badge"
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        padding: '0.2rem 0.55rem',
                        borderRadius: '6px',
                        background: 'rgba(22, 163, 74, 0.08)',
                        color: '#16a34a',
                      }}
                    >
                      Port 20128 Siap
                    </span>
                  </div>
                </div>

                <div
                  className="live-stat-footer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted, #94a3b8)',
                    paddingTop: '0.6rem',
                    borderTop: '1px solid var(--border-subtle, rgba(0,0,0,0.05))',
                    marginTop: 'auto',
                  }}
                >
                  <span style={{ color: '#16a34a' }}>⚡</span>
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