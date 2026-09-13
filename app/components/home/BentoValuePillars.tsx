import { IconCheckCircle, IconTerminal, IconShield } from './Icons'

export function BentoValuePillars() {
  return (
    <section className="home-section bento-pillars-section" id="pilar-keunggulan" aria-label="Pilar Keunggulan Platform">
      <div className="bento-nebula-center" aria-hidden="true" />
      <div className="bento-nebula-left" aria-hidden="true" />
      <div className="bento-nebula-right" aria-hidden="true" />

      <div className="bento-container">
        <div className="section-header text-center">
          <span className="section-eyebrow">NILAI UTAMA &amp; ARSITEKTUR BELAJAR</span>
          <h2 className="section-title">
            Dirancang untuk Eksekusi Nyata. <br />
            <span className="text-gradient-purple">Terstruktur dengan Standar Kedinasan.</span>
          </h2>
          <p className="section-subtitle">
            Setiap pilar memastikan akurasi langkah teknis, verifikasi status port otomatis, dan kepatuhan terhadap format naskah dinas resmi.
          </p>
        </div>

        {/* 12-Column Asymmetric Bento Grid */}
        <div className="bento-grid-12">
          {/* Card 1: Top Skills Pro Suite (Col 8) */}
          <div className="bento-card-hero">
            <div className="bento-card-top-bar">
              <div className="bento-badge-purple">
                <IconCheckCircle width={13} height={13} />
                <span>VALIDASI PRESISI CHECKPOINT</span>
              </div>
              <span className="bento-num-label">01 // PLATFORM</span>
            </div>

            <div className="bento-split-content">
              <div className="bento-split-left">
                <h3 className="bento-title-bold">
                  CHECKPOINT OTOMATIS
                  <span className="bento-title-gradient">VERIFIKASI REAL-TIME</span>
                </h3>
                <p className="bento-desc-clean">
                  Tidak ada lagi tebak-tebakan konfigurasi. Sistem memverifikasi status port, token API, dan integritas dokumen secara langsung sebelum lanjut ke modul berikutnya.
                </p>
                <div className="bento-chips-row">
                  <span className="bento-chip">Port 20128: PASSED</span>
                  <span className="bento-chip">OAuth 2.0: TERHUBUNG</span>
                  <span className="bento-chip">Pergub DKI No. 14/2020: VALID</span>
                </div>
              </div>

              <div className="bento-split-right">
                <div className="bento-img-frame">
                  <img src="/images/bento-team.jpg" alt="Kolaborasi Lab Komputer" className="bento-img-cover" />
                  <div className="bento-img-badge">
                    <span>LABORATORIUM PRAKTIK</span>
                    <span className="status-dot-active">AKTIF</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Workspace Stage (Col 4) */}
          <div className="bento-card-stage">
            <img src="/images/bento-stage.jpg" alt="Panggung Workshop" className="bento-bg-img" />
            <div className="bento-bg-overlay" />

            <div className="bento-stage-top">
              <span className="bento-num-label">02 // WORKSPACE</span>
              <div className="bento-circle-badge">
                <span>20</span>
                <span>26</span>
              </div>
            </div>

            <div className="bento-stage-bottom">
              <div className="bento-tag-pill">
                <span className="telemetry-dot" />
                <span>DUAL-MODE INTERACTION</span>
              </div>
              <h4 className="bento-stage-title">
                PowerShell &amp; Terminal <br />
                <span style={{ color: '#ffffff', fontWeight: 600 }}>1-Click Anti-Typo Copy</span>
              </h4>
              <p className="bento-stage-desc">
                Sintaks skrip administratif dapat disalin dengan 1 klik lengkap dengan verifikasi eksekusi.
              </p>
            </div>
          </div>

          {/* Card 3: Kinetic Motion Tall (Col 4, Row Span 2) */}
          <div className="bento-card-tall">
            <img src="/images/bento-dancer.jpg" alt="Pembelajaran Praktik Dinamis" className="bento-bg-img" />
            <div className="bento-bg-overlay" />

            <div className="bento-tall-top">
              <div className="bento-glowing-dot" title="Node Praktik Aktif" aria-label="Node Praktik Aktif">
                <span className="inner-dot" />
              </div>
              <span className="bento-num-label">03 // ADAPTIF</span>
            </div>

            <div className="bento-tall-bottom">
              <span className="bento-subtag">EFISIENSI EKSEKUSI NYATA</span>
              <h4 className="bento-tall-title">OUTPUT SIAP PAKAI</h4>
              <p className="bento-tall-desc">
                Menghasilkan artefak nyata: bot Telegram pengatur agenda kalender serta naskah dinas resmi siap cetak sesuai tata naskah baku.
              </p>
            </div>
          </div>

          {/* Card 4: Masterclass Intake (Col 8) */}
          <div className="bento-card-masterclass">
            <div className="masterclass-glow" aria-hidden="true" />

            <div className="masterclass-text">
              <div className="bento-badge-pink">
                <span className="telemetry-dot-pink" />
                <span>STANDAR KURIKULUM &amp; KELAS</span>
              </div>
              <h3 className="masterclass-title">
                KURIKULUM TERSTANDARISASI <br className="hidden-sm" />
                PERGUB DKI NO. 14/2020 &amp; NODE.JS LTS
              </h3>
              <p className="masterclass-date">
                SIAP AKSES • DUAL JALUR AI &amp; WORD OFFICE
              </p>
            </div>

            <div className="masterclass-btn-wrap">
              <a href="#pilihan-modul" className="masterclass-circle-btn" aria-label="Pilih Jalur Belajar">
                <svg className="masterclass-arrow-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="5" x2="5" y2="19" />
                  <polyline points="15 19 5 19 5 9" />
                </svg>
              </a>
            </div>
          </div>

          {/* Card 5: Accreditation & Certification (Col 4) */}
          <div className="bento-card-cert">
            <img src="/images/bento-cert.jpg" alt="Sertifikat Digital" className="bento-bg-img" />
            <div className="bento-bg-overlay" />

            <div className="bento-cert-top">
              <span className="bento-subtag">BUKTI KELULUSAN</span>
              <h4 className="bento-cert-title">SERVE PORTOFOLIO &amp; SERTIFIKAT DIGITAL</h4>
            </div>

            <div className="bento-cert-bottom">
              <span className="bento-cert-tag">
                <IconShield width={12} height={12} />
                <span>KEAMANAN CLIENT-SIDE</span>
              </span>
            </div>
          </div>

          {/* Cards 6 & 7: Stacked Mini Cards (Col 4) */}
          <div className="bento-stack-col">
            <div className="bento-mini-card bento-mini-brand">
              <div className="bento-mini-left">
                <div className="bento-mini-icon">
                  <IconTerminal width={22} height={22} />
                </div>
                <div>
                  <div className="bento-mini-brand-title">LEARNWITH</div>
                  <div className="bento-mini-brand-sub">Command Center &amp; Ruang Belajar</div>
                </div>
              </div>
              <div className="bento-mini-dot" />
            </div>

            <div className="bento-mini-card bento-mini-status">
              <div>
                <span className="bento-mini-server-label">SERVER LMS TERPADU</span>
                <div className="bento-mini-server-title">PORT 20128 • LOCALHOST</div>
              </div>
              <div className="bento-mini-uptime">
                <span className="telemetry-dot" />
                <span>99.99% AKTIF</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
