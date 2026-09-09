import { IconCheckCircle, IconTerminal, IconFileText, IconShield } from './Icons'

export function BentoValuePillars() {
  return (
    <section className="home-section bento-pillars-section" id="pilar-keunggulan" aria-label="Pilar Keunggulan Platform">
      <div className="section-header text-center">
        <span className="section-eyebrow">NILAI UTAMA BELAJAR DENGAN PRAKTIK</span>
        <h2 className="section-title">Mengapa Belajar di Command Center LearnWith?</h2>
        <p className="section-subtitle">
          Dirancang untuk menghilangkan friksi setup, memastikan akurasi langkah, dan memberikan bukti nyata atas kompetensi yang telah dipelajari.
        </p>
      </div>

      <div className="bento-grid">
        {/* Bento Card 1: Checkpoint Otomatis (Spans 2 columns on wide screens) */}
        <div className="bento-card bento-feature-large">
          <div className="bento-card-badge">
            <IconCheckCircle width={15} height={15} /> Validasi Presisi
          </div>
          <h3 className="bento-card-title">Checkpoint Otomatis di Setiap Langkah Kritis</h3>
          <p className="bento-card-desc">
            Tidak ada lagi tebak-tebakan apakah konfigurasi Anda berhasil. Sistem memverifikasi status port, token API, dan integritas dokumen secara langsung, memberikan konfirmasi instan sebelum beralih ke tahap berikutnya.
          </p>
          <div className="bento-card-footer-visual" aria-hidden="true">
            <div className="mini-telemetry-pill success">
              <span className="telemetry-dot"></span> Port 20128: PASSED
            </div>
            <div className="mini-telemetry-pill success">
              <span className="telemetry-dot"></span> OAuth 2.0: TERHUBUNG
            </div>
            <div className="mini-telemetry-pill success">
              <span className="telemetry-dot"></span> Format Pergub 14: VALID
            </div>
          </div>
        </div>

        {/* Bento Card 2: 1-Click Copy & Zero Typing Error */}
        <div className="bento-card">
          <div className="bento-card-badge">
            <IconTerminal width={15} height={15} /> Efisiensi Eksekusi
          </div>
          <h3 className="bento-card-title">1-Click Command &amp; Anti-Typo</h3>
          <p className="bento-card-desc">
            Sintaks PowerShell dan konfigurasi rumit dapat disalin dengan 1 klik lengkap dengan petunjuk eksekusi administratif.
          </p>
        </div>

        {/* Bento Card 3: Dokumen & Otomasi Siap Pakai */}
        <div className="bento-card">
          <div className="bento-card-badge">
            <IconFileText width={15} height={15} /> Output Siap Pakai
          </div>
          <h3 className="bento-card-title">Hasil Kerja Sesuai Standar Kedinasan</h3>
          <p className="bento-card-desc">
            Menghasilkan artefak nyata: bot Telegram yang mengatur jadwal rapat di kalender atau format naskah dinas baku yang lulus evaluasi BPSDM.
          </p>
        </div>

        {/* Bento Card 4: Keamanan & Sensor Token Client-Side */}
        <div className="bento-card bento-feature-wide">
          <div className="bento-card-badge">
            <IconShield width={15} height={15} /> Keamanan Data
          </div>
          <h3 className="bento-card-title">Keamanan Kredensial Terisolasi di Browser</h3>
          <p className="bento-card-desc">
            Saat menggunakan asisten troubleshooting atau menyusun laporan kesiapan, token bot dan API key disaring langsung di memori browser. Kredensial rahasia Anda tidak pernah dikirim ke server pihak ketiga.
          </p>
        </div>
      </div>
    </section>
  )
}
