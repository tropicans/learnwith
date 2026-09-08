import { PRETRAINING_HERO_STATS } from '@/data/pretrainingFoundation'

export function PretrainingHero() {
  return (
    <section className="main-hero">
      <div className="hero-tag">
        <span>🎓</span> Workshop Pre-Training Guide • Non-Coding Friendly
      </div>
      <h2 className="hero-title">Hands-on Agentic AI: Dari Chat ke Kalender</h2>
      <p className="hero-subtitle">
        Panduan langkah-demi-langkah interaktif untuk menyiapkan laptop Anda sebelum kelas workshop{' '}
        <strong>Hands-on Agentic AI: Dari Chat ke Kalender — Praktik Deploy Hermes Agent & 9Router</strong>.
        Dilengkapi fitur 1-klik salin perintah, verifikasi checkpoint otomatis, dan sensor token keamanan.
      </p>

      <div className="hero-stats-grid">
        {PRETRAINING_HERO_STATS.map((stat, idx) => (
          <div key={idx} className="hero-stat-card">
            <div
              className="hero-stat-icon"
              style={{ background: stat.bgStyle, color: stat.colorStyle }}
            >
              {stat.icon}
            </div>
            <div className="hero-stat-info">
              <h4>{stat.value}</h4>
              <p>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
