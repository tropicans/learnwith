export function ModuleArchitectureFlow() {
  return (
    <div>
      <div className="arch-flow-container">
        <div className="arch-node">
          <div className="arch-node-icon">📱</div>
          <div className="arch-node-title">Telegram Ponsel</div>
          <div className="arch-node-desc">
            Anda mengetik instruksi jadwal meeting ke Bot Telegram
          </div>
        </div>

        <div className="arch-arrow">
          <span className="arch-arrow-label">Kirim Pesan</span>
          <span>──▶</span>
        </div>

        <div className="arch-node">
          <div className="arch-node-icon">🤖</div>
          <div className="arch-node-title">Hermes Agent</div>
          <div className="arch-node-desc">
            Berjalan di laptop Anda sebagai asisten cerdas
          </div>
        </div>

        <div className="arch-arrow">
          <span className="arch-arrow-label">
            OpenAI Endpoint
            <br />
            <code>:20128/v1</code>
          </span>
          <span>──▶</span>
        </div>

        <div className="arch-node">
          <div className="arch-node-icon">🚀</div>
          <div className="arch-node-title">9Router</div>
          <div className="arch-node-desc">
            Perute lokal menghubungkan agen ke model AI
          </div>
        </div>

        <div className="arch-arrow">
          <span className="arch-arrow-label">Proses Bahasa</span>
          <span>──▶</span>
        </div>

        <div className="arch-node">
          <div className="arch-node-icon">🧠</div>
          <div className="arch-node-title">Model AI Cloud</div>
          <div className="arch-node-desc">
            Menganalisis jadwal & mengeksekusi Google Calendar
          </div>
        </div>
      </div>

      <div className="alert-box alert-success" style={{ marginTop: '1rem' }}>
        <div className="alert-icon">✨</div>
        <div className="alert-content">
          <h5>Pre-Training Anda Siap!</h5>
          <p>
            Setelah menyelesaikan Modul 1 sampai Modul 5, Anda telah memenuhi
            seluruh prasyarat teknis. Pastikan Anda mencatat hasil di bagian{' '}
            <strong>Laporan Kesiapan</strong> untuk dilaporkan ke instruktur.
          </p>
        </div>
      </div>
    </div>
  )
}
