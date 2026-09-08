import React from 'react'

export interface SkeletonLineProps {
  width?: string | number
  height?: string | number
  className?: string
  style?: React.CSSProperties
}

/**
 * Single pulsing skeleton line for typography and text blocks
 */
export function SkeletonLine({
  width = '100%',
  height = '1rem',
  className = '',
  style = {},
}: SkeletonLineProps) {
  return (
    <div
      className={`skeleton-pulse ${className}`}
      style={{
        width,
        height,
        backgroundColor: 'var(--border-subtle, rgba(0, 0, 0, 0.08))',
        borderRadius: 'var(--radius-sm, 4px)',
        animation: 'skeletonPulse 1.5s ease-in-out infinite',
        ...style,
      }}
    />
  )
}

/**
 * Skeleton container mimicking NotebookLM card placeholders
 */
export function CardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`skeleton-card-container ${className}`}
      style={{
        border: '1px solid var(--border-subtle, #e0e0e0)',
        borderRadius: 'var(--radius-md, 12px)',
        padding: '1.5rem',
        background: 'var(--bg-surface, #ffffff)',
        boxShadow: 'var(--shadow-xs, 0 1px 2px rgba(0,0,0,0.05))',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'var(--border-subtle, rgba(0,0,0,0.08))',
            animation: 'skeletonPulse 1.5s ease-in-out infinite',
          }}
        />
        <div style={{ flex: 1 }}>
          <SkeletonLine width="60%" height="1.2rem" style={{ marginBottom: '0.4rem' }} />
          <SkeletonLine width="35%" height="0.85rem" />
        </div>
      </div>
      <SkeletonLine width="95%" height="0.9rem" style={{ marginBottom: '0.5rem' }} />
      <SkeletonLine width="80%" height="0.9rem" style={{ marginBottom: '1rem' }} />
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <SkeletonLine width="70px" height="1.5rem" style={{ borderRadius: '12px' }} />
        <SkeletonLine width="90px" height="1.5rem" style={{ borderRadius: '12px' }} />
      </div>
    </div>
  )
}

/**
 * Pulse container for live workshop metrics & streaming stats (SSR-02)
 */
export function StatsSkeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`course-stats-banner skeleton-stats-container ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '1rem 1.5rem',
        background: 'var(--bg-surface-elevated, rgba(66, 133, 244, 0.05))',
        border: '1px solid var(--border-subtle, #e0e0e0)',
        borderRadius: 'var(--radius-md, 10px)',
        margin: '1.25rem 0',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '40%' }}>
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: 'var(--border-subtle, rgba(0,0,0,0.08))',
            animation: 'skeletonPulse 1.5s ease-in-out infinite',
          }}
        />
        <div style={{ flex: 1 }}>
          <SkeletonLine width="80%" height="0.8rem" style={{ marginBottom: '0.3rem' }} />
          <SkeletonLine width="50%" height="1.1rem" />
        </div>
      </div>
      <div style={{ height: '36px', width: '1px', background: 'var(--border-subtle, #e0e0e0)' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '40%' }}>
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: 'var(--border-subtle, rgba(0,0,0,0.08))',
            animation: 'skeletonPulse 1.5s ease-in-out infinite',
          }}
        />
        <div style={{ flex: 1 }}>
          <SkeletonLine width="75%" height="0.8rem" style={{ marginBottom: '0.3rem' }} />
          <SkeletonLine width="45%" height="1.1rem" />
        </div>
      </div>
    </div>
  )
}

/**
 * Pulse container for interactive checklist tasks (SSR-04 fallback)
 */
export function ChecklistSkeleton({ count = 3, className = '' }: { count?: number; className?: string }) {
  return (
    <div
      className={`skeleton-checklist-container ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        padding: '1.25rem',
        background: 'var(--bg-surface, #ffffff)',
        border: '1px solid var(--border-subtle, #e0e0e0)',
        borderRadius: 'var(--radius-md, 12px)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <SkeletonLine width="40%" height="1.1rem" />
        <SkeletonLine width="20%" height="1.1rem" />
      </div>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            background: 'var(--bg-muted, rgba(0,0,0,0.02))',
            borderRadius: 'var(--radius-sm, 6px)',
          }}
        >
          <div
            style={{
              width: '18px',
              height: '18px',
              borderRadius: '4px',
              backgroundColor: 'var(--border-subtle, rgba(0,0,0,0.12))',
              animation: 'skeletonPulse 1.5s ease-in-out infinite',
            }}
          />
          <div style={{ flex: 1 }}>
            <SkeletonLine width={`${85 - (i % 3) * 15}%`} height="0.9rem" />
          </div>
        </div>
      ))}
    </div>
  )
}
