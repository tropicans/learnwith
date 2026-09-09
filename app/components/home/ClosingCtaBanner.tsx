import { IconLayers, IconArrowRight } from './Icons'

export function ClosingCtaBanner() {
  return (
    <section className="closing-banner-container" aria-label="Aksi Memulai Pembelajaran">
      <div className="closing-banner-card">
        <div className="closing-banner-content">
          <span className="closing-banner-eyebrow">COMMAND CENTER PRAKTIK</span>
          <h2 className="closing-banner-title">Siap Menguasai Keterampilan Praktik Terstandar?</h2>
          <p className="closing-banner-desc">
            Pilih jalur workshop Anda, ikuti panduan interaktif langkah-demi-langkah, dan buktikan kompetensi Anda melalui checkpoint otomatis.
          </p>
          <div className="closing-banner-actions">
            <a href="#pilihan-modul" className="btn btn-primary btn-closing-cta">
              <IconLayers width={18} height={18} />
              <span>Eksplorasi Katalog Workshop</span>
              <IconArrowRight width={16} height={16} />
            </a>
          </div>
          <div className="closing-banner-badges">
            <span className="closing-badge">• Akses Langsung di Browser</span>
            <span className="closing-badge">• Kredensial Tersimpan Aman di Komputer Anda</span>
            <span className="closing-badge">• Verifikasi Checkpoint Otomatis</span>
          </div>
        </div>
      </div>
    </section>
  )
}
