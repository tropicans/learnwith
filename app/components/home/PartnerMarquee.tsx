import React from 'react'

interface BrandItem {
  id: string
  name: string
  tagline: string
  icon: React.ReactNode
}

const row1Brands: BrandItem[] = [
  {
    id: 'ollama',
    name: 'OLLAMA AI',
    tagline: 'Local Model Inference',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    id: 'docker',
    name: 'DOCKER CORE',
    tagline: 'Isolated Workspace',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="4" />
        <path d="M9 3v18M15 3v18M3 9h18M3 15h18" strokeOpacity="0.4" />
      </svg>
    ),
  },
  {
    id: 'openxml',
    name: 'OFFICE OPENXML',
    tagline: 'Naskah Dinas Baku',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    id: 'nodejs',
    name: 'NODE.JS LTS',
    tagline: 'Backend Runtime',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
        <line x1="12" y1="22" x2="12" y2="15.5" />
        <polyline points="22 8.5 12 15.5 2 8.5" />
      </svg>
    ),
  },
  {
    id: 'router9',
    name: '9ROUTER CORE',
    tagline: 'Port 20128 Gateway',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 3v6M12 15v6M3 12h6M15 12h6" />
        <circle cx="12" cy="3" r="1.5" />
        <circle cx="12" cy="21" r="1.5" />
        <circle cx="3" cy="12" r="1.5" />
        <circle cx="21" cy="12" r="1.5" />
      </svg>
    ),
  },
  {
    id: 'postgres',
    name: 'POSTGRESQL',
    tagline: 'Relational Store',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    ),
  },
  {
    id: 'telegram',
    name: 'TELEGRAM BOT',
    tagline: 'Otomasi Kalender',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21.5 2L2 9.5l7 3.5 3.5 7L21.5 2z" />
        <path d="M9 13l5-5" />
      </svg>
    ),
  },
  {
    id: 'spbe',
    name: 'STANDAR SPBE',
    tagline: 'Arsitektur Terpadu',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
]

const row2Brands: BrandItem[] = [
  {
    id: 'pergub',
    name: 'PERGUB 14/2020',
    tagline: 'Standardisasi Dokumen',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
        <path d="M16 13H8" />
        <path d="M16 17H8" />
        <path d="M10 9H8" />
      </svg>
    ),
  },
  {
    id: 'fastapi',
    name: 'FASTAPI ENGINE',
    tagline: 'Sub-15ms Latency',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    id: 'powershell',
    name: 'POWERSHELL CLI',
    tagline: 'Skrip Otomasi Teruji',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="4 17 10 11 4 5" />
        <line x1="12" y1="19" x2="20" y2="19" />
      </svg>
    ),
  },
  {
    id: 'langchain',
    name: 'LANGCHAIN CORE',
    tagline: 'RAG Pipeline',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3a9 9 0 0 1 9 9" strokeLinecap="round" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    ),
  },
  {
    id: 'clientsec',
    name: 'CLIENT-SIDE SEC',
    tagline: 'Sensor Token Memori',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    id: 'checkpoints',
    name: 'CHECKPOINT GATE',
    tagline: 'Validasi Otomatis',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
  {
    id: 'dualmode',
    name: 'DUAL WORKSPACE',
    tagline: 'Pretraining & Live',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    id: 'sertifikasi',
    name: 'AKREDITASI RESMI',
    tagline: 'Portofolio Teruji',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="8" r="7" />
        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
      </svg>
    ),
  },
]

function BrandCard({ brand }: { brand: BrandItem }) {
  return (
    <div className="brand-card">
      <div className="brand-icon-box">
        {brand.icon}
      </div>
      <div className="brand-info">
        <span className="brand-name">{brand.name}</span>
        <span className="brand-tagline">{brand.tagline}</span>
      </div>
    </div>
  )
}

export function PartnerMarquee() {
  return (
    <section id="ekosistem" className="partner-marquee-section" aria-label="Ekosistem Teknologi Teruji">
      <div className="marquee-nebula-left" aria-hidden="true" />
      <div className="marquee-nebula-right" aria-hidden="true" />

      <div className="marquee-content-wrap">
        <div className="marquee-header">
          <span className="section-eyebrow">EKOSISTEM &amp; STANDARISASI TEKNOLOGI</span>
          <h2 className="section-title">Terintegrasi dengan Standar Komputasi Modern</h2>
          <p className="section-subtitle">
            Setiap modul dirancang selaras dengan infrastruktur resmi, protokol otomasi terbuka, dan standar tata naskah dinas kedinasan.
          </p>
        </div>

        <div className="marquee-container">
          <div className="marquee-track-outer">
            <div className="animate-marquee-left">
              {row1Brands.map((brand) => (
                <BrandCard key={`r1-a-${brand.id}`} brand={brand} />
              ))}
              {row1Brands.map((brand) => (
                <BrandCard key={`r1-b-${brand.id}`} brand={brand} />
              ))}
            </div>
          </div>

          <div className="marquee-track-outer">
            <div className="animate-marquee-right">
              {row2Brands.map((brand) => (
                <BrandCard key={`r2-a-${brand.id}`} brand={brand} />
              ))}
              {row2Brands.map((brand) => (
                <BrandCard key={`r2-b-${brand.id}`} brand={brand} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
