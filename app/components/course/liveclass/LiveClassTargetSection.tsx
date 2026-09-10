import React from 'react'

export function LiveClassTargetSection() {
  const criteria = [
    {
      step: 1,
      title: 'Daemon 9Router Running pada Port 20128',
      description: 'Menghubungkan multi-model AI (Gemini, Claude, GPT) melalui proxy lokal berkinerja tinggi dengan logging real-time.',
    },
    {
      step: 2,
      title: 'Aktivasi Hermes Agent Core & System Prompt ASN',
      description: 'Menginisialisasi agen cerdas otonom lokal berbasis TypeScript dengan template instruksi kedinasan standar DKI.',
    },
    {
      step: 3,
      title: 'Gateway Telegram Bot Interaktif 2-Arah',
      description: 'Menghubungkan token BotFather dan webhook agar agen dapat menerima pesan dinas langsung dari smartphone Anda.',
    },
    {
      step: 4,
      title: 'Integrasi Google Calendar OAuth untuk Jadwal Rapat',
      description: 'Memberi wewenang kepada agen untuk membuat, membaca, dan memperbarui agenda rapat pimpinan otomatis dari teks chat.',
    },
  ]

  return (
    <section id="sec-live-target" className="content-section">
      <div className="section-header">
        <div className="section-title-wrap">
          <div className="section-badge-num">1</div>
          <div>
            <h3 className="section-title">Target & Alur Sesi Praktik Hari-H</h3>
            <p className="section-desc">
              Pahami 4 tonggak utama integrasi Agentic AI yang akan Anda buktikan langsung di kelas.
            </p>
          </div>
        </div>
      </div>

      <div className="card card-glass">
        <div className="card-header">
          <h4 className="card-title">✨ Kriteria Keberhasilan Praktik Tatap Muka</h4>
        </div>
        <div className="card-body">
          <p>
            Sesi praktik Anda dinyatakan tuntas saat ke-4 pilar integrasi sistem di bawah ini berhasil
            dijalankan dan diverifikasi melalui gerbang checkpoint:
          </p>

          <div className="step-container">
            {criteria.map((crit) => (
              <div key={crit.step} className="step-card">
                <div className="step-num-badge">{crit.step}</div>
                <div className="step-main">
                  <h4>{crit.title}</h4>
                  <p>{crit.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="alert-box alert-info" style={{ marginTop: '1.25rem' }}>
            <div className="alert-icon">💡</div>
            <div className="alert-content">
              <h5>Tips Praktik di Ruang Kelas</h5>
              <p>
                Pastikan laptop Anda terhubung ke jaringan Wi-Fi kelas. Port <code>20128</code> tidak boleh
                digunakan aplikasi lain agar komunikasi Hermes Agent dengan 9Router berjalan tanpa hambatan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}