import { useState } from 'react'
import { PRETRAINING_POWERSHELL_STEPS } from '@/data/pretrainingFoundation'

export function PretrainingPowerShellSection() {
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null)

  const handleCopy = (text: string, label: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text)
      setCopyFeedback(label)
      setTimeout(() => setCopyFeedback(null), 2000)
    }
  }

  return (
    <section id="sec-powershell" className="content-section">
      <div className="section-header">
        <div className="section-title-wrap">
          <div className="section-badge-num">5</div>
          <div>
            <h3 className="section-title">
              Panduan Khusus: Membuka & Menggunakan PowerShell
            </h3>
            <p className="section-desc">
              Langkah mudah membuka jendela terminal PowerShell pada sistem Windows.
            </p>
          </div>
        </div>
      </div>

      <div className="card card-glass">
        <div className="step-container">
          {PRETRAINING_POWERSHELL_STEPS.map((step) => (
            <div key={step.step} className="step-card">
              <div className="step-num-badge">{step.step}</div>
              <div className="step-main">
                <h4>{step.title}</h4>
                <p>
                  {step.step === 1 ? (
                    <>
                      Klik tombol <strong>Start / Windows</strong> di sudut kiri bawah
                      layar Anda.
                    </>
                  ) : step.step === 2 ? (
                    <>
                      Ketik kata <code>PowerShell</code> lalu klik aplikasi{' '}
                      <strong>Windows PowerShell</strong>.
                      <button
                        type="button"
                        onClick={() => handleCopy('PowerShell', 'step2')}
                        style={{
                          marginLeft: '0.5rem',
                          padding: '0.2rem 0.5rem',
                          fontSize: '0.75rem',
                          borderRadius: '4px',
                          border: '1px solid var(--border-subtle, #cbd5e1)',
                          background: 'var(--bg-surface, #ffffff)',
                          cursor: 'pointer',
                        }}
                      >
                        {copyFeedback === 'step2' ? '✅ Tersalin' : '📋 Salin Kata'}
                      </button>
                    </>
                  ) : (
                    <>
                      Anda akan melihat baris awal seperti{' '}
                      <code>PS C:\Users\NamaAnda&gt;</code>. Teks tersebut normal dan
                      tidak perlu diketik ulang.
                    </>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="alert-box alert-info" style={{ marginTop: '1.25rem' }}>
          <div className="alert-icon">🖱️</div>
          <div className="alert-content">
            <h5>Cara Menyalin dan Menempel Perintah:</h5>
            <p>
              Klik tombol <strong>"Salin Perintah"</strong> pada kotak kode di bawah,
              lalu klik kanan satu kali pada jendela PowerShell untuk menempelkan
              perintah, lalu tekan tombol <strong>Enter</strong>.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
