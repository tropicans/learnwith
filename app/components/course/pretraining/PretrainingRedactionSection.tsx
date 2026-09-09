import { useState, useCallback } from 'react'
import { sanitizeLogText } from '@/utils/redaction'
import { copyToClipboard } from './CopyableCodeBlock'
import { showToast } from '@/components/ui/Toast'

export function PretrainingRedactionSection() {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [matchesCount, setMatchesCount] = useState(0)
  const [hasScanned, setHasScanned] = useState(false)

  const processRedaction = useCallback((text: string) => {
    setInputText(text)
    if (!text.trim()) {
      setOutputText('')
      setMatchesCount(0)
      setHasScanned(false)
      return
    }

    const result = sanitizeLogText(text)
    setOutputText(result.sanitized)
    setMatchesCount(result.matchesCount)
    setHasScanned(true)
  }, [])

  const handleInputChange = (val: string) => {
    processRedaction(val)
  }

  const handleTriggerScan = () => {
    if (!inputText.trim()) {
      showToast('Tempelkan teks log terlebih dahulu untuk diperiksa', 'warning', 2000)
      return
    }
    processRedaction(inputText)
    showToast(
      matchesCount > 0
        ? `Pemeriksaan selesai: ${matchesCount} data sensitif disensor 🛡️`
        : 'Pemeriksaan selesai: Teks aman dari token sensitif ✓',
      matchesCount > 0 ? 'warning' : 'success',
      2500
    )
  }

  const handleCopySanitized = async () => {
    if (!outputText.trim()) {
      showToast('Tidak ada teks log tersensor untuk disalin', 'warning', 2000)
      return
    }

    const success = await copyToClipboard(outputText)
    if (success) {
      showToast('Log yang disensor berhasil disalin ke clipboard! 📋', 'success', 2500)
    } else {
      showToast('Gagal menyalin log ke clipboard', 'danger', 2000)
    }
  }

  const handleClear = () => {
    setInputText('')
    setOutputText('')
    setMatchesCount(0)
    setHasScanned(false)
    showToast('Teks log dibersihkan 🗑️', 'info', 1500)
  }

  // Calculate status badge text & styling
  const renderBadge = () => {
    if (matchesCount > 0) {
      return (
        <span id="redaction-count-badge" className="badge badge-pill badge-warning">
          {matchesCount} data sensitif disensor 🛡️
        </span>
      )
    }
    if (inputText.trim().length > 0) {
      return (
        <span id="redaction-count-badge" className="badge badge-pill badge-success">
          Aman (tidak terdeteksi token rahasia) ✓
        </span>
      )
    }
    return (
      <span id="redaction-count-badge" className="badge badge-pill badge-neutral">
        0 data terdeteksi
      </span>
    )
  }

  return (
    <section id="sec-redaction" className="content-section">
      <div className="section-header">
        <div className="section-title-wrap">
          <div
            className="section-badge-icon"
            style={{
              background: 'var(--color-success-subtle)',
              color: 'var(--color-success)',
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.1rem',
            }}
          >
            🛡️
          </div>
          <div>
            <h3 className="section-title">
              Alat Bantu Sensor Log Rahasia (Redaction Tool)
            </h3>
            <p className="section-desc">
              Deteksi dan sensor otomatis token bot, API key, email, dan username laptop
              sebelum dibagikan ke instruktur.
            </p>
          </div>
        </div>
      </div>

      <div className="redaction-workbench">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            marginBottom: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.2rem' }}>🔒</span>
            <strong
              style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--text-primary)',
              }}
            >
              Editor Privasi & Penyamaran Kredensial
            </strong>
          </div>
          {renderBadge()}
        </div>

        <div className="redaction-grid">
          {/* Left Input */}
          <div className="redaction-col">
            <div className="redaction-col-header">
              <span>Teks Mentah / Pesan Error:</span>
              <span style={{ color: 'var(--text-muted)' }}>Tempel di sini</span>
            </div>
            <textarea
              id="redaction-input"
              className="redaction-textarea"
              rows={8}
              placeholder={`Tempel pesan error, log terminal, atau konfigurasi Anda di sini...\nContoh:\nError connecting bot 123456789:ABCDefGhIjKlMnOpQrStUvWxYz012345678 at C:\\Users\\john_doe\\app...`}
              value={inputText}
              onChange={(e) => handleInputChange(e.target.value)}
              aria-label="Teks mentah untuk disensor"
            />
          </div>

          {/* Right Output */}
          <div className="redaction-col">
            <div className="redaction-col-header">
              <span>Hasil Setelah Disensor (Aman Dibagikan):</span>
              <span style={{ color: 'var(--color-success)' }}>
                Otomatis terlindungi
              </span>
            </div>
            <textarea
              id="redaction-output"
              className="redaction-textarea redaction-output"
              rows={8}
              readOnly
              value={outputText}
              placeholder="Hasil log yang telah disensor otomatis akan muncul di sini..."
              aria-label="Hasil log yang disensor"
            />
          </div>
        </div>

        <div className="redaction-stats">
          <div className="redaction-pill-list">
            <span className="redaction-pill">✓ Telegram Bot Token</span>
            <span className="redaction-pill">✓ OpenAI API Key</span>
            <span className="redaction-pill">✓ Google Cloud Key</span>
            <span className="redaction-pill">✓ Bearer Token</span>
            <span className="redaction-pill">✓ Alamat Email</span>
            <span className="redaction-pill">✓ Direktori User Windows</span>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              id="btn-trigger-redaction"
              className="btn btn-secondary btn-sm"
              onClick={handleTriggerScan}
            >
              <span>🔍</span> Periksa Sekarang
            </button>
            <button
              type="button"
              id="btn-copy-redacted"
              className="btn btn-success btn-sm"
              onClick={handleCopySanitized}
            >
              <span>📋</span> Salin Log Tersensor
            </button>
            <button
              type="button"
              id="btn-clear-redaction"
              className="btn btn-outline btn-sm"
              onClick={handleClear}
            >
              <span>🗑️</span> Bersihkan
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
