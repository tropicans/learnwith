import React from 'react'

interface LiveClassHeroProps {
  isUnlocked: boolean
  onOpenUnlockModal: () => void
  onRelock?: () => void
}

export function LiveClassHero({ isUnlocked, onOpenUnlockModal, onRelock }: LiveClassHeroProps) {
  return (
    <section id="sec-live-hero" className="main-hero">
      <div className="hero-tag">
        <span>🚀</span> Sesi Tatap Muka • Hari-H Kelas Terbimbing
      </div>
      <h2 className="hero-title">Hands-on Agentic AI: Praktik Deploy Hermes & Telegram Gateway</h2>
      <p className="hero-subtitle">
        Panduan praktik interaktif langsung di laptop Anda: instalasi daemon 9Router, konfigurasi
        identitas Hermes Agent Core, aktivasi gateway Telegram Bot interaktif, dan integrasi Google Calendar
        OAuth untuk otomasi kedinasan secara native di Windows.
      </p>

      {/* Standard 4-stat grid matching Pra-Training */}
      <div className="hero-stats-grid">
        <div className="hero-stat-card">
          <div
            className="hero-stat-icon"
            style={{ background: 'var(--accent-primary-subtle)', color: 'var(--accent-primary)' }}
          >
            ⏱️
          </div>
          <div className="hero-stat-info">
            <h4>3-4 Jam</h4>
            <p>Durasi Hands-on</p>
          </div>
        </div>

        <div className="hero-stat-card">
          <div
            className="hero-stat-icon"
            style={{ background: 'rgba(52, 211, 153, 0.12)', color: 'var(--color-success)' }}
          >
            🧩
          </div>
          <div className="hero-stat-info">
            <h4>6 Modul</h4>
            <p>Modul 6 s.d. 11</p>
          </div>
        </div>

        <div className="hero-stat-card">
          <div
            className="hero-stat-icon"
            style={{ background: 'rgba(251, 191, 36, 0.12)', color: 'var(--color-warning)' }}
          >
            🎯
          </div>
          <div className="hero-stat-info">
            <h4>6 Gerbang</h4>
            <p>Checkpoint Praktik</p>
          </div>
        </div>

        <div className="hero-stat-card">
          <div
            className="hero-stat-icon"
            style={{
              background: isUnlocked ? 'rgba(52, 211, 153, 0.12)' : 'rgba(239, 68, 68, 0.12)',
              color: isUnlocked ? 'var(--color-success)' : 'var(--color-danger)',
            }}
          >
            {isUnlocked ? '🔓' : '🔒'}
          </div>
          <div className="hero-stat-info">
            <h4>{isUnlocked ? 'Terbuka' : 'Terkunci'}</h4>
            <p>Akses Instruktur</p>
          </div>
        </div>
      </div>

      {/* Dynamic Access Gate Banner (Matches Pra-Training alert box style) */}
      {!isUnlocked ? (
        <div
          className="alert-box alert-info"
          style={{
            marginTop: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div className="alert-icon" style={{ fontSize: '1.5rem' }}>
              🔒
            </div>
            <div className="alert-content">
              <h5>Gerbang Sesi Praktik Terkunci oleh Instruktur</h5>
              <p>
                Sesi ini dipandu langsung di ruang workshop. Masukkan passkey kelas yang diberikan
                oleh fasilitator untuk membuka seluruh kode terminal CLI dan checklist interaktif.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenUnlockModal}
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}
          >
            <span>🔒</span> Buka Akses Instruktur (Passkey)
          </button>
        </div>
      ) : (
        <div
          className="alert-box alert-success"
          style={{
            marginTop: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div className="alert-icon" style={{ fontSize: '1.5rem' }}>
              ✅
            </div>
            <div className="alert-content">
              <h5>Sesi Praktik Terbimbing Aktif & Terbuka</h5>
              <p>
                Passkey kelas terverifikasi. Seluruh instruksi kode terminal PowerShell, checklist mandiri,
                dan 6 gerbang checkpoint evaluasi kini terbuka penuh.
              </p>
            </div>
          </div>
          {onRelock && (
            <button
              type="button"
              onClick={onRelock}
              className="btn btn-sm btn-outline"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}
            >
              <span>🔒</span> Kunci Kembali Sesi
            </button>
          )}
        </div>
      )}
    </section>
  )
}