import React, { useState, useMemo, useRef } from 'react'
import {
  PRETRAINING_TROUBLESHOOTING_ITEMS,
  TROUBLESHOOTING_CATEGORIES,
  type TroubleshootingCategory,
} from '@/data/pretrainingTroubleshooting'
import { TroubleshootingCard } from './TroubleshootingCard'

export function PretrainingTroubleshootingSection() {
  const [selectedCategory, setSelectedCategory] =
    useState<TroubleshootingCategory>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const pillRefs = useRef<(HTMLButtonElement | null)[]>([])

  const filteredItems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    return PRETRAINING_TROUBLESHOOTING_ITEMS.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory
      if (!matchesCategory) return false

      if (!q) return true

      const matchTitle = item.title.toLowerCase().includes(q)
      const matchCause = item.cause.toLowerCase().includes(q)
      const matchSteps = item.steps.some((s) => s.toLowerCase().includes(q))
      const matchKeywords =
        item.keywords?.some((k) => k.toLowerCase().includes(q)) || false
      const matchCategory = item.categoryLabel.toLowerCase().includes(q)

      return (
        matchTitle || matchCause || matchSteps || matchKeywords || matchCategory
      )
    })
  }, [selectedCategory, searchQuery])

  // Keyboard navigation across category pills (ArrowLeft, ArrowRight, Home, End)
  const handlePillKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End']
    if (!keys.includes(e.key)) return
    e.preventDefault()

    const total = TROUBLESHOOTING_CATEGORIES.length
    let nextIndex = index

    if (e.key === 'Home') nextIndex = 0
    if (e.key === 'End') nextIndex = total - 1
    if (e.key === 'ArrowLeft') nextIndex = (index - 1 + total) % total
    if (e.key === 'ArrowRight') nextIndex = (index + 1) % total

    pillRefs.current[nextIndex]?.focus()
    setSelectedCategory(TROUBLESHOOTING_CATEGORIES[nextIndex].id)
  }

  const handleClearSearch = () => {
    setSearchQuery('')
  }

  return (
    <section id="sec-troubleshooting" className="content-section">
      <div className="section-header">
        <div className="section-title-wrap">
          <div
            className="section-badge-icon"
            style={{
              background: 'var(--color-warning-subtle)',
              color: 'var(--color-warning)',
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.1rem',
            }}
          >
            🔧
          </div>
          <div>
            <h3 className="section-title">
              Pusat Bantuan & Troubleshooting Kendala
            </h3>
            <p className="section-desc">
              Solusi langkah demi langkah untuk kendala teknis umum pada Node.js,
              9Router, PowerShell, Telegram, dan Hermes.
            </p>
          </div>
        </div>
      </div>

      {/* Troubleshooting Search & Category Filter Toolbar */}
      <div className="troubleshoot-toolbar">
        <div className="troubleshoot-search-wrap" style={{ position: 'relative' }}>
          <span className="troubleshoot-search-icon">🔍</span>
          <input
            type="search"
            id="troubleshoot-search-input"
            className="troubleshoot-search-input"
            placeholder="Ketik pesan error atau kata kunci (contoh: EADDRINUSE, 401, PowerShell, port)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Cari kendala pre-training"
            autoComplete="off"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '1rem',
                padding: '4px',
              }}
              aria-label="Hapus pencarian"
            >
              ✕
            </button>
          )}
        </div>

        <div
          id="troubleshoot-filter-pills"
          className="troubleshoot-filter-pills"
          role="group"
          aria-label="Filter kategori kendala"
        >
          {TROUBLESHOOTING_CATEGORIES.map((cat, idx) => {
            const isActive = selectedCategory === cat.id
            return (
              <button
                key={cat.id}
                type="button"
                id={`filter-btn-${cat.id}`}
                data-category={cat.id}
                className={`troubleshoot-filter-btn ${isActive ? 'active' : ''}`}
                aria-pressed={isActive}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setSelectedCategory(cat.id)}
                onKeyDown={(e) => handlePillKeyDown(e, idx)}
                ref={(el) => {
                  pillRefs.current[idx] = el
                }}
              >
                {cat.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Result Count Indicator */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          margin: '0.75rem 0',
          fontSize: 'var(--font-size-xs)',
          color: 'var(--text-secondary)',
        }}
      >
        <span>
          Menampilkan <strong>{filteredItems.length}</strong> solusi kendala
          {selectedCategory !== 'all' && (
            <span>
              {' '}
              pada kategori{' '}
              <em>
                {
                  TROUBLESHOOTING_CATEGORIES.find(
                    (c) => c.id === selectedCategory
                  )?.label
                }
              </em>
            </span>
          )}
        </span>
      </div>

      {/* Troubleshooting Cards List */}
      <div id="troubleshoot-cards-container" className="troubleshoot-grid">
        {filteredItems.map((item) => (
          <TroubleshootingCard key={item.id} item={item} />
        ))}
      </div>

      {/* Empty State when no cards match */}
      {filteredItems.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '2.5rem 1.5rem',
            background: 'var(--bg-surface)',
            border: '1px dashed var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            margin: '1.5rem 0',
          }}
        >
          <div style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>🔍</div>
          <h4
            style={{
              fontSize: 'var(--font-size-base)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--text-primary)',
              marginBottom: '0.5rem',
            }}
          >
            Tidak Ditemukan Solusi yang Cocok
          </h4>
          <p
            style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--text-secondary)',
              maxWidth: '520px',
              margin: '0 auto 1.25rem',
              lineHeight: 1.6,
            }}
          >
            Tidak ada kendala yang cocok dengan kata kunci{' '}
            <strong>"{searchQuery}"</strong>. Coba periksa ejaan, gunakan kata
            kunci yang lebih umum, atau beralih ke kategori lain.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
              }}
            >
              Reset Filter & Tampilkan Semua (15)
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
