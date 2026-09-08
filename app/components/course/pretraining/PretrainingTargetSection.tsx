import { PRETRAINING_TARGET_CRITERIA } from '@/data/pretrainingFoundation'

export function PretrainingTargetSection() {
  return (
    <section id="sec-target" className="content-section">
      <div className="section-header">
        <div className="section-title-wrap">
          <div className="section-badge-num">1</div>
          <div>
            <h3 className="section-title">Target & Alur Pre-Training</h3>
            <p className="section-desc">
              Pahami apa saja yang perlu diselesaikan sebelum mengikuti sesi kelas.
            </p>
          </div>
        </div>
      </div>

      <div className="card card-glass">
        <div className="card-header">
          <h4 className="card-title">✨ Kriteria Pre-Training Selesai</h4>
        </div>
        <div className="card-body">
          <p>Pre-training Anda dinyatakan selesai dan siap 100% untuk kelas saat:</p>
          <div className="step-container">
            {PRETRAINING_TARGET_CRITERIA.map((crit) => (
              <div key={crit.step} className="step-card">
                <div className="step-num-badge">{crit.step}</div>
                <div className="step-main">
                  <h4>{crit.title}</h4>
                  <p>
                    {crit.step === 1 ? (
                      <>
                        Aplikasi 9Router terpasang di sistem dan perintah{' '}
                        <code>npx 9router start</code> dapat dijalankan.
                      </>
                    ) : crit.step === 2 ? (
                      <>
                        Halaman <code>http://localhost:20128</code> dapat diakses di
                        Chrome/Edge pada laptop Anda.
                      </>
                    ) : (
                      crit.description
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="alert-box alert-info" style={{ marginTop: '1.25rem' }}>
            <div className="alert-icon">💡</div>
            <div className="alert-content">
              <h5>Belum Perlu Menginstal Hermes Agent!</h5>
              <p>
                Hermes Agent, pemilihan model AI/provider, dan penyambungan Google
                Calendar akan dikonfigurasi bersama instruktur saat kelas workshop
                berlangsung.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
