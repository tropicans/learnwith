import { IconLayers, IconTerminal, IconCheckCircle } from './Icons'

export function HowItWorksSection() {
  return (
    <section className="home-section how-it-works-section" id="cara-kerja" aria-label="Alur Tiga Langkah Praktik">
      <div className="section-header text-center">
        <span className="section-eyebrow">METODE PEMBELAJARAN</span>
        <h2 className="section-title">Alur 3 Langkah Verifikasi Praktik</h2>
        <p className="section-subtitle">
          Dari pemahaman instruksi teknis hingga kepastian bahwa konfigurasi Anda berfungsi sempurna.
        </p>
      </div>

      <div className="steps-container">
        {/* Step 1 */}
        <div className="step-card">
          <div className="step-number-badge">01</div>
          <div className="step-icon-wrapper">
            <IconLayers width={24} height={24} />
          </div>
          <h3 className="step-title">Pilih Modul &amp; Siapkan Lingkungan</h3>
          <p className="step-desc">
            Buka ruang kerja mandiri Anda. Ikuti daftar periksa terstruktur untuk memastikan runtime (Node.js/PowerShell) atau template dokumen siap sebelum memulai.
          </p>
        </div>

        {/* Step 2 */}
        <div className="step-card">
          <div className="step-number-badge">02</div>
          <div className="step-icon-wrapper">
            <IconTerminal width={24} height={24} />
          </div>
          <h3 className="step-title">Eksekusi di Terminal &amp; Dokumen Riil</h3>
          <p className="step-desc">
            Jalankan skrip konfigurasi nyata di PowerShell Admin atau terapkan sistem Heading dan Mail Merge langsung pada Microsoft Word di desktop Anda.
          </p>
        </div>

        {/* Step 3 */}
        <div className="step-card">
          <div className="step-number-badge">03</div>
          <div className="step-icon-wrapper">
            <IconCheckCircle width={24} height={24} />
          </div>
          <h3 className="step-title">Validasi Checkpoint Otomatis</h3>
          <p className="step-desc">
            Konfirmasi keberhasilan melalui skrip checkpoint terintegrasi. Sistem memverifikasi port, API token, dan kesesuaian dokumen dengan laporan diagnostik instan.
          </p>
        </div>
      </div>
    </section>
  )
}
