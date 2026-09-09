import { IconAlertCircle, IconShield, IconActivity, IconFileText } from './Icons'

export function PlatformCapabilities() {
  return (
    <section className="home-section capabilities-section" id="kapabilitas-platform" aria-label="Kapabilitas Unggulan Command Center">
      <div className="section-header text-center">
        <span className="section-eyebrow">FITUR COMMAND CENTER</span>
        <h2 className="section-title">Fitur Pendukung untuk Praktikum Tanpa Hambatan</h2>
        <p className="section-subtitle">
          Alat bantu praktis yang terintegrasi langsung di browser untuk mendampingi setiap tahapan latihan Anda.
        </p>
      </div>

      <div className="capabilities-grid">
        <div className="capability-card">
          <div className="capability-icon">
            <IconAlertCircle width={24} height={24} />
          </div>
          <h3 className="capability-title">Troubleshooting Hub Terpadu</h3>
          <p className="capability-desc">
            Pencarian cepat solusi untuk kendala umum: bentrok port 20128, error ExecutionPolicy PowerShell, hak akses token Telegram, dan konfigurasi OAuth 2.0.
          </p>
        </div>

        <div className="capability-card">
          <div className="capability-icon">
            <IconShield width={24} height={24} />
          </div>
          <h3 className="capability-title">Asisten Sensor Token Rahasia</h3>
          <p className="capability-desc">
            Alat penyensor otomatis di browser yang mengaburkan bot token, credential OAuth, dan API key secara instan sebelum log dibagikan ke instruktur.
          </p>
        </div>

        <div className="capability-card">
          <div className="capability-icon">
            <IconActivity width={24} height={24} />
          </div>
          <h3 className="capability-title">Persistensi Lokal Tanpa Login Rumit</h3>
          <p className="capability-desc">
            Status checklist dan hasil verifikasi checkpoint tersimpan aman di browser Anda. Latihan dapat dilanjutkan kapan saja tanpa risiko kehilangan progres.
          </p>
        </div>

        <div className="capability-card">
          <div className="capability-icon">
            <IconFileText width={24} height={24} />
          </div>
          <h3 className="capability-title">Generator Laporan Kesiapan</h3>
          <p className="capability-desc">
            Satu klik untuk mengompilasi bukti kelulusan checkpoint dan ringkasan kesiapan teknis ke format pesan terstruktur untuk konfirmasi ke penyelenggara.
          </p>
        </div>
      </div>
    </section>
  )
}
