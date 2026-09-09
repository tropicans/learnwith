import React, { useState, useMemo } from 'react'
import { usePretrainingState } from '@/hooks/usePretrainingState'
import { generateReportText } from '@/utils/reportGenerator'
import { showToast } from '@/components/ui/Toast'

export function PretrainingReadinessReportSection() {
  const { participantInfo, checkpoints, checklists, setParticipantInfo, readiness } =
    usePretrainingState()

  const [os, setOs] = useState('Windows 11')
  const [probStep, setProbStep] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParticipantInfo('name', e.target.value)
  }

  const previewText = useMemo(() => {
    return generateReportText({
      name: participantInfo.name?.trim() || '',
      os,
      probStep: probStep.trim() || 'Nihil',
      errorMsg: errorMsg.trim() || 'Nihil',
      participantInfo,
      checkpoints,
      moduleChecklists: checklists,
      status: readiness.status,
    })
  }, [participantInfo, os, probStep, errorMsg, checkpoints, checklists, readiness.status])

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(previewText)
        showToast(
          'Format laporan berhasil disalin! Siap dikirim ke WhatsApp / Telegram 📲',
          'success',
          3000
        )
      } else {
        const textarea = document.createElement('textarea')
        textarea.value = previewText
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.focus()
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
        showToast('Laporan disalin ke clipboard!', 'success', 2500)
      }
    } catch {
      showToast('Gagal menyalin laporan, silakan salin manual.', 'danger', 3000)
    }
  }

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }

  return (
    <section id="sec-readiness-report" className="content-section">
      <div className="section-header">
        <div className="section-title-wrap">
          <div
            className="section-badge-icon"
            style={{
              background: 'var(--accent-primary-subtle)',
              color: 'var(--accent-primary)',
              width: 36,
              height: 36,
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.1rem',
            }}
          >
            📋
          </div>
          <div>
            <h3 className="section-title">Form Laporan Kesiapan Peserta</h3>
            <p className="section-desc">
              Format resmi pelaporan hasil pre-training untuk dikirimkan kepada instruktur sebelum hari workshop.
            </p>
          </div>
        </div>
      </div>

      <div className="report-workbench">
        <div className="report-grid">
          {/* Left: Editable Form Pane */}
          <div className="report-form-pane">
            <h4
              style={{
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--text-primary)',
                marginBottom: '0.25rem',
              }}
            >
              ✏️ Lengkapi Data Pelaporan:
            </h4>

            <div className="form-group">
              <label htmlFor="input-report-name" className="form-label">
                <span>👤</span> Nama Lengkap Peserta:
              </label>
              <input
                type="text"
                id="input-report-name"
                className="form-input"
                placeholder="Masukkan nama lengkap Anda..."
                autoComplete="name"
                value={participantInfo.name || ''}
                onChange={handleNameChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="select-report-os" className="form-label">
                <span>💻</span> Sistem Operasi Laptop:
              </label>
              <select
                id="select-report-os"
                className="form-input"
                style={{ cursor: 'pointer' }}
                value={os}
                onChange={(e) => setOs(e.target.value)}
              >
                <option value="Windows 11">Windows 11</option>
                <option value="Windows 10">Windows 10</option>
                <option value="Windows Lainnya / Mac / Linux">
                  Windows Lainnya / Mac / Linux
                </option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="input-report-problem-step" className="form-label">
                <span>⚠️</span> Nomor Langkah yang Bermasalah (Jika Ada):
              </label>
              <input
                type="text"
                id="input-report-problem-step"
                className="form-input"
                placeholder="Contoh: Modul 2 Langkah B, atau kosongkan / tulis 'Nihil'"
                value={probStep}
                onChange={(e) => setProbStep(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="input-report-error-msg" className="form-label">
                <span>🛑</span> Pesan Error Terminal (Opsional, Otomatis Disensor):
              </label>
              <textarea
                id="input-report-error-msg"
                className="form-input"
                style={{
                  height: 90,
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--font-size-xs)',
                }}
                placeholder="Jika ada kendala, tempel ringkasan pesan error di sini (token/kunci akan disensor otomatis)..."
                value={errorMsg}
                onChange={(e) => setErrorMsg(e.target.value)}
              />
            </div>

            <div
              className="alert-box alert-info"
              style={{ marginTop: '0.5rem', padding: '0.75rem 1rem' }}
            >
              <div className="alert-icon">💡</div>
              <div className="alert-content">
                <p style={{ fontSize: 'var(--font-size-xs)' }}>
                  Status Checkpoint 1, 2, 3 dan Google Cloud otomatis diambil dari progres yang Anda centang di atas.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Live Output Preview Pane */}
          <div className="report-preview-pane">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <h4
                style={{
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--text-primary)',
                  margin: 0,
                }}
              >
                📄 Pratinjau Teks Laporan:
              </h4>
              <span className="badge badge-pill badge-neutral">
                Sesuai Format Resmi
              </span>
            </div>

            <pre id="report-output-preview" className="report-preview-box">
              {previewText}
            </pre>

            <div className="report-btn-group">
              <button
                type="button"
                id="btn-copy-report"
                className="btn btn-success"
                onClick={handleCopy}
              >
                <span>📋</span> Salin Laporan (WhatsApp / Telegram)
              </button>
              <button
                type="button"
                id="btn-print-report"
                className="btn btn-secondary"
                onClick={handlePrint}
              >
                <span>🖨️</span> Cetak Laporan / PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
