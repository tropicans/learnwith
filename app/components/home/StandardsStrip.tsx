import { IconFileText, IconTerminal, IconShield, IconActivity } from './Icons'

export function StandardsStrip() {
  return (
    <section className="standards-strip-container" id="standar" aria-label="Standar dan Metodologi Pelatihan">
      <div className="standards-header">
        <span className="standards-eyebrow">METODOLOGI &amp; KREDIBILITAS TEKNIS</span>
        <h2 className="standards-title">Dibangun di Atas Regulasi Resmi &amp; Standar Praktik Industri</h2>
      </div>

      <div className="standards-grid">
        <div className="standard-item">
          <div className="standard-icon-box">
            <IconFileText width={22} height={22} />
          </div>
          <div className="standard-content">
            <h3 className="standard-heading">Pergub DKI No. 14/2020</h3>
            <p className="standard-desc">
              Pedoman baku tata naskah dinas kedinasan ASN: margin presisi, tipografi resmi, hierarki Heading 1–3, dan penomoran halaman campuran.
            </p>
          </div>
        </div>

        <div className="standard-item">
          <div className="standard-icon-box">
            <IconTerminal width={22} height={22} />
          </div>
          <div className="standard-content">
            <h3 className="standard-heading">Toolchain CLI Terbuka</h3>
            <p className="standard-desc">
              Lingkungan kerja berbasis Node.js LTS, PowerShell script, 9Router proxy port 20128, dan integrasi desktop API tanpa lock-in berbayar.
            </p>
          </div>
        </div>

        <div className="standard-item">
          <div className="standard-icon-box">
            <IconShield width={22} height={22} />
          </div>
          <div className="standard-content">
            <h3 className="standard-heading">Proteksi Rahasia Client-Side</h3>
            <p className="standard-desc">
              Sensor token dan API key otomatis di memory browser. Tidak ada pengiriman credential mentah ke server eksternal saat troubleshooting.
            </p>
          </div>
        </div>

        <div className="standard-item">
          <div className="standard-icon-box">
            <IconActivity width={22} height={22} />
          </div>
          <div className="standard-content">
            <h3 className="standard-heading">Arsitektur Dual-Mode</h3>
            <p className="standard-desc">
              Pemisahan tegas antara ruang mandiri pra-training untuk verifikasi dependensi dan ruang kelas terpandu hari-H untuk skenario penuh.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
