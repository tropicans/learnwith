import React, { useState, useEffect } from 'react'
import { LIVE_CLASS_MODULES } from '@/data/liveClassModules'
import { showToast } from '@/components/ui/Toast'

interface LiveClassCheckpointsSectionProps {
  isUnlocked: boolean
  onOpenUnlockModal: () => void
}

type CheckpointStatus = 'pending' | 'passed' | 'failed'

const CHECKPOINT_CRITERIA_MAP: Record<number, string[]> = {
  6: [
    'Layanan 9Router aktif listening pada port <code>20128</code>',
    'Virtual API Key lokal (misal: <code>sk-9r-...</code>) berhasil diterbitkan',
    'Provider & Model LLM aktif terkonfigurasi di dashboard 9Router',
    'Matriks Routing Combos berhasil disusun untuk fallback multi-model',
    'Endpoint <code>/v1/chat/completions</code> mengembalikan respons JSON valid',
  ],
  7: [
    'Hermes Agent terpasang via official installer <code>install.ps1</code>',
    'Setup wizard (<code>hermes setup</code>) berhasil menghubungkan agen ke 9Router (port 20128)',
    'Perintah <code>hermes config</code> menampilkan konfigurasi aktif tanpa kendala',
  ],
  8: [
    'File konfigurasi <code>hermes.json</code> terhubung ke gateway <code>http://localhost:20128/v1</code>',
    'MCP Tools bridge terdaftar dan diaktifkan di terminal',
    'Simulasi terminal CLI Hermes berhasil menjawab pertanyaan kedinasan',
  ],
  9: [
    'Bot Telegram terdaftar di BotFather dan token tersimpan aman di <code>.env</code>',
    'Webhook 2-arah berhasil terhubung dan memproses pesan masuk',
    'Perintah <code>/status</code> pada aplikasi Telegram dibalas otomatis oleh Hermes Agent',
  ],
  10: [
    'File kredensial <code>credentials.json</code> terpasang dari Google Cloud Console',
    'Alur OAuth 2.0 peramban selesai dan token <code>token.json</code> terbit',
    'Hermes berhasil membaca daftar acara kalender dinas terkini',
  ],
  11: [
    'Pesan chat Telegram otomatis dianalisis dan diekstrak menjadi agenda rapat',
    'Acara kalender dinas berhasil dibuat di Google Calendar tanpa input manual',
    'Konfirmasi pemesanan waktu terkirim kembali ke chat Telegram pengguna',
  ],
}

export function LiveClassCheckpointsSection({
  isUnlocked,
  onOpenUnlockModal,
}: LiveClassCheckpointsSectionProps) {
  const storageKey = 'learnwith_ai_live_checkpoints_v1'
  const [statuses, setStatuses] = useState<Record<string, CheckpointStatus>>({})

  // Hydrate from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        setStatuses(JSON.parse(saved))
      }
    } catch {}
  }, [storageKey])

  const handleStatusChange = (cpKey: string, nextStatus: CheckpointStatus) => {
    setStatuses((prev) => {
      const updated = { ...prev, [cpKey]: nextStatus }
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated))
      } catch {}
      return updated
    })

    if (nextStatus === 'passed') {
      showToast(`${cpKey.toUpperCase()} berhasil diverifikasi! ✓`, 'success', 2500)
    } else if (nextStatus === 'failed') {
      showToast(`${cpKey.toUpperCase()} tercatat ada kendala ✕`, 'danger', 2500)
    } else {
      showToast(`Status ${cpKey.toUpperCase()} diatur ulang ↺`, 'info', 1800)
    }
  }

  return (
    <section id="sec-live-checkpoints" className="content-section">
      <div className="section-header">
        <div className="section-title-wrap">
          <div
            className="section-badge-icon"
            style={{
              background: 'rgba(251, 191, 36, 0.12)',
              color: 'var(--color-warning)',
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.1rem',
            }}
          >
            📍
          </div>
          <div>
            <h3 className="section-title">Gerbang Checkpoint Praktik Hari-H (CP-6 s.d. CP-11)</h3>
            <p className="section-desc">
              Verifikasi bertahap untuk memastikan setiap modul integrasi berhasil dieksekusi sebelum beralih ke modul berikutnya.
            </p>
          </div>
        </div>
      </div>

      {!isUnlocked && (
        <div className="alert-box alert-warning" style={{ marginBottom: '1.5rem' }}>
          <div className="alert-icon">🔒</div>
          <div className="alert-content">
            <h5>Gerbang Checkpoint Hari-H Terkunci</h5>
            <p>
              Aktivitas validasi checkpoint dan penandaan kelulusan terbuka setelah Anda memasukkan
              passkey instruktur kelas.
            </p>
            <button
              type="button"
              className="btn btn-sm btn-primary"
              onClick={onOpenUnlockModal}
              style={{ marginTop: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <span>🔒</span> Buka Akses Instruktur
            </button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {LIVE_CLASS_MODULES.map((mod) => {
          const cpKey = `cp-${mod.num}`
          const status = statuses[cpKey] || 'pending'
          const criteriaList = CHECKPOINT_CRITERIA_MAP[mod.num] || []

          const statusBadge =
            status === 'passed' ? (
              <span className="badge badge-pill badge-success">✓ Lolos</span>
            ) : status === 'failed' ? (
              <span className="badge badge-pill badge-danger">✕ Kendala</span>
            ) : (
              <span className="badge badge-pill badge-warning">Pending</span>
            )

          return (
            <div
              key={cpKey}
              id={`card-${cpKey}`}
              className={`checkpoint-gate-card ${status !== 'pending' ? status : ''}`}
            >
              <div className="checkpoint-header-row">
                <div className="checkpoint-title-wrap">
                  <div className="checkpoint-badge-icon">{mod.num}</div>
                  <div>
                    <h4
                      style={{
                        fontSize: 'var(--font-size-base)',
                        fontWeight: 'var(--font-weight-bold)',
                        color: 'var(--text-primary)',
                        marginBottom: '0.15rem',
                      }}
                    >
                      {mod.checkpointTitle}
                    </h4>
                    <span
                      style={{
                        fontSize: 'var(--font-size-xs)',
                        color: 'var(--text-muted)',
                      }}
                    >
                      Verifikasi ketercapaian Modul {mod.num}
                    </span>
                  </div>
                </div>
                {statusBadge}
              </div>

              <p className="card-body" style={{ margin: '0.5rem 0' }}>
                {mod.checkpointDescription}
              </p>

              <div className="checklist-group" style={{ margin: '0.75rem 0 1rem 0' }}>
                {criteriaList.map((crit, idx) => (
                  <div key={idx} className="checklist-item" style={{ cursor: 'default' }}>
                    <span
                      style={{
                        fontSize: '1.1rem',
                        color: 'var(--color-success)',
                        fontWeight: 'bold',
                      }}
                    >
                      ✓
                    </span>
                    <div
                      className="checklist-label"
                      dangerouslySetInnerHTML={{ __html: crit }}
                    />
                  </div>
                ))}
              </div>

              {isUnlocked && (
                <div className="cp-action-btn-group">
                  <button
                    type="button"
                    className="btn btn-success btn-cp-action"
                    onClick={() => handleStatusChange(cpKey, 'passed')}
                  >
                    <span>✓</span> Lolos Verifikasi
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-cp-action"
                    onClick={() => handleStatusChange(cpKey, 'failed')}
                  >
                    <span>✕</span> Ada Kendala (Gagal)
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-cp-action btn-sm"
                    onClick={() => handleStatusChange(cpKey, 'pending')}
                  >
                    <span>↺</span> Reset Status
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}