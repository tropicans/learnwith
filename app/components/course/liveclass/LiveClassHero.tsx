import React from 'react'

interface LiveClassHeroProps {
  isUnlocked: boolean
  onOpenUnlockModal: () => void
  onRelock?: () => void
}

export function LiveClassHero({ isUnlocked, onOpenUnlockModal, onRelock }: LiveClassHeroProps) {
  return (
    <section id="sec-live-hero" className="live-hero-section">
      <div className="live-hero-badge-row">
        <div className="live-badge-group">
          <span className="badge badge-pill badge-primary">
            Mode Kelas Terbimbing
          </span>
          <span className={`live-session-status-pill ${isUnlocked ? 'status-unlocked' : 'status-locked'}`}>
            <span className={`status-dot ${isUnlocked ? 'pulse-green' : 'pulse-amber'}`} aria-hidden="true" />
            <span>{isUnlocked ? 'Sesi Praktik Aktif' : 'Akses Terkunci Instruktur'}</span>
          </span>
        </div>
      </div>

      <h1 className="live-hero-title">
        Hands-on Agentic AI: Sesi Hari-H Praktik Terbimbing
      </h1>
      <p className="live-hero-subtitle">
        Implementasi Live Telegram Gateway &amp; Integrasi Kalender Google dengan Mesin Cerdas Hermes Agent
      </p>

      <p className="live-hero-description">
        Selamat datang di ruang laboratorium praktik langsung! Pada sesi ini, Anda akan merangkai
        arsitektur multi-model AI, mengoperasikan agen otonom Windows secara native, dan menghubungkan
        bot Telegram langsung ke Google Calendar untuk otomasi jadwal kedinasan secara aman.
      </p>

      {/* Meta Features Row */}
      <div className="live-features-row">
        <div className="live-feature-item">
          <div className="live-feature-icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div className="live-feature-content">
            <strong>Durasi Sesi</strong>
            <span>3 Jam Hands-on</span>
          </div>
        </div>

        <div className="live-feature-item">
          <div className="live-feature-icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
              <polyline points="10 2 10 10 13 7 16 10 16 2" />
            </svg>
          </div>
          <div className="live-feature-content">
            <strong>Struktur Praktik</strong>
            <span>6 Modul Berurutan (M6–M11)</span>
          </div>
        </div>

        <div className="live-feature-item">
          <div className="live-feature-icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <div className="live-feature-content">
            <strong>Gerbang Evaluasi</strong>
            <span>6 Checkpoint Otomatis</span>
          </div>
        </div>
      </div>

      {/* Dynamic Access Gate Banner */}
      <div className={`live-gate-card ${isUnlocked ? 'gate-card-unlocked' : 'gate-card-locked'}`}>
        {isUnlocked ? (
          <div className="gate-content-unlocked">
            <div className="gate-icon-circle green">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div className="gate-text-group">
              <div className="gate-header-row">
                <h2 className="gate-title">Gerbang Sesi Praktik Terbimbing Aktif</h2>
                <span className="gate-badge-verified">Terotentikasi</span>
              </div>
              <p className="gate-desc">
                Passkey kelas Anda telah terverifikasi. Seluruh instruksi interaktif, kode terminal,
                dan checklist Modul 6–11 kini terbuka penuh dan siap Anda jalankan.
              </p>
            </div>
            <div className="gate-actions-row">
              <a href="#sec-module-6" className="btn btn-primary gate-action-btn">
                <span>Mulai Praktik Modul 6</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </a>
              {onRelock && (
                <button type="button" onClick={onRelock} className="btn btn-outline btn-sm" title="Kunci kembali sesi">
                  <span>Kunci Ulang</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="gate-content-locked">
            <div className="gate-icon-circle amber">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <div className="gate-text-group">
              <div className="gate-header-row">
                <h2 className="gate-title">Akses Praktik Hari-H Dilindungi Passkey Instruktur</h2>
                <span className="gate-badge-locked">Terkunci</span>
              </div>
              <p className="gate-desc">
                Untuk menjaga sinkronisasi kecepatan kelas, materi hands-on Modul 6–11 dilindungi.
                Masukkan passkey resmi yang diumumkan oleh instruktur kelas saat sesi dimulai.
              </p>
            </div>
            <div className="gate-actions-row">
              <button
                type="button"
                id="btn-open-unlock-modal"
                onClick={onOpenUnlockModal}
                className="btn btn-primary gate-action-btn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m21 2-2 2m-1.5 1.5L14 9a5 5 0 1 0 3 3l3.5-3.5" />
                  <circle cx="7.5" cy="16.5" r="2.5" />
                </svg>
                <span>Buka Akses Hari-H (Passkey Instruktur)</span>
              </button>
              <a href="#sec-live-modules" className="btn btn-secondary gate-action-btn">
                <span>Lihat Silabus Ringkas</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}