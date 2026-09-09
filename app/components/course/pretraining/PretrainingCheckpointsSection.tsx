import React from 'react'
import {
  usePretrainingState,
  PretrainingState,
} from '../../../hooks/usePretrainingState'
import { CheckpointGateCard } from './CheckpointGateCard'

export interface PretrainingCheckpointsSectionProps {
  state?: PretrainingState
  onCheckpointChange?: (
    checkpointId: 'cp-1' | 'cp-2' | 'cp-3',
    status: 'pending' | 'passed' | 'failed'
  ) => void
  onParticipantInfoChange?: (
    field: 'nodeVersion' | 'telegramUsername' | 'telegramUserId',
    value: string
  ) => void
}

export function PretrainingCheckpointsSection({
  state: customState,
  onCheckpointChange,
  onParticipantInfoChange,
}: PretrainingCheckpointsSectionProps) {
  const hookState = usePretrainingState()

  const checkpoints = customState ? customState.checkpoints : hookState.checkpoints
  const participantInfo = customState
    ? customState.participantInfo
    : hookState.participantInfo

  const handleCheckpointChange = (
    id: 'cp-1' | 'cp-2' | 'cp-3',
    status: 'pending' | 'passed' | 'failed'
  ) => {
    if (onCheckpointChange) {
      onCheckpointChange(id, status)
    } else {
      hookState.setCheckpoint(id, status)
    }
  }

  const handleParticipantInfoChange = (
    field: 'nodeVersion' | 'telegramUsername' | 'telegramUserId',
    value: string
  ) => {
    if (onParticipantInfoChange) {
      onParticipantInfoChange(field, value)
    } else {
      hookState.setParticipantInfo(field, value)
    }
  }

  // Live validation for Telegram Username (/(bot|_bot)$/i)
  const tgUsername = participantInfo.telegramUsername.trim()
  const isTgUsernameValid = tgUsername.length > 0 && /(bot|_bot)$/i.test(tgUsername)
  const isTgUsernameInvalid = tgUsername.length > 0 && !/(bot|_bot)$/i.test(tgUsername)

  // Live validation for Telegram User ID (/^\d+$/)
  const tgUserId = participantInfo.telegramUserId.trim()
  const isTgUserIdValid = tgUserId.length > 0 && /^\d+$/.test(tgUserId)
  const isTgUserIdInvalid = tgUserId.length > 0 && !/^\d+$/.test(tgUserId)

  return (
    <div id="pretraining-checkpoints-container">
      {/* CHECKPOINT 1: NODE.JS & NPM */}
      <section id="sec-checkpoint-1" className="content-section">
        <div className="section-header">
          <div className="section-title-wrap">
            <div
              className="section-badge-icon"
              style={{
                background: 'var(--accent-primary-subtle)',
                color: 'var(--accent-primary)',
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
              <h3 className="section-title">
                Gerbang Checkpoint 1: Node.js & npm Siap
              </h3>
              <p className="section-desc">
                Verifikasi runtime Node.js dan pengelola paket npm terpasang dengan
                benar.
              </p>
            </div>
          </div>
        </div>

        <CheckpointGateCard
          id="cp-1"
          num={1}
          title="Verifikasi Node.js & npm"
          subtitle="Prasyarat dasar sebelum menjalankan 9Router"
          criteriaTitle="Gerbang Checkpoint 1 dinyatakan <strong>Lolos Verifikasi</strong> apabila kedua perintah terminal berikut berhasil dijalankan tanpa error:"
          criteria={[
            '<code>node --version</code> menghasilkan output nomor versi LTS (contoh: <code>v24.x.x</code> atau <code>v22.x.x</code>).',
            '<code>npm --version</code> menghasilkan output nomor versi (contoh: <code>10.x.x</code> atau <code>9.x.x</code>).',
          ]}
          status={checkpoints['cp-1']}
          onStatusChange={(status) => handleCheckpointChange('cp-1', status)}
        >
          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label htmlFor="input-node-version" className="form-label">
              <span>📟</span> Catat Nomor Versi Node.js yang Tampil (Opsional):
            </label>
            <input
              type="text"
              id="input-node-version"
              className="form-input"
              placeholder="Contoh: v24.2.0"
              data-participant-field="nodeVersion"
              value={participantInfo.nodeVersion}
              onChange={(e) =>
                handleParticipantInfoChange('nodeVersion', e.target.value)
              }
              autoComplete="off"
            />
          </div>
        </CheckpointGateCard>
      </section>

      {/* CHECKPOINT 2: 9ROUTER DASHBOARD */}
      <section id="sec-checkpoint-2" className="content-section">
        <div className="section-header">
          <div className="section-title-wrap">
            <div
              className="section-badge-icon"
              style={{
                background: 'var(--accent-primary-subtle)',
                color: 'var(--accent-primary)',
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
              <h3 className="section-title">
                Gerbang Checkpoint 2: 9Router Dashboard Berjalan
              </h3>
              <p className="section-desc">
                Verifikasi service lokal 9Router aktif dan antarmuka web dashboard
                dapat diakses.
              </p>
            </div>
          </div>
        </div>

        <CheckpointGateCard
          id="cp-2"
          num={2}
          title="Verifikasi Dashboard 9Router Lokal"
          subtitle="Perute model AI penghubung Hermes Agent"
          criteriaTitle="Gerbang Checkpoint 2 dinyatakan <strong>Lolos Verifikasi</strong> jika seluruh kondisi berikut terpenuhi:"
          criteria={[
            'Jendela PowerShell tempat Anda menjalankan <code>9router</code> <strong>tetap terbuka</strong> dan tidak tertutup.',
            'Alamat <code>http://localhost:20128</code> berhasil terbuka di browser Google Chrome / Microsoft Edge.',
            'Berhasil login menggunakan kata sandi awal <code>123456</code> dan melihat dashboard utama 9Router.',
          ]}
          status={checkpoints['cp-2']}
          onStatusChange={(status) => handleCheckpointChange('cp-2', status)}
        />
      </section>

      {/* CHECKPOINT 3: TELEGRAM BOT & USER ID */}
      <section id="sec-checkpoint-3" className="content-section">
        <div className="section-header">
          <div className="section-title-wrap">
            <div
              className="section-badge-icon"
              style={{
                background: 'var(--accent-primary-subtle)',
                color: 'var(--accent-primary)',
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
              <h3 className="section-title">
                Gerbang Checkpoint 3: Bot Telegram & User ID Terverifikasi
              </h3>
              <p className="section-desc">
                Verifikasi Bot Telegram siap, token terlindungi aman, dan User ID
                angka tercatat.
              </p>
            </div>
          </div>
        </div>

        <CheckpointGateCard
          id="cp-3"
          num={3}
          title="Verifikasi Bot Telegram & Telegram User ID"
          subtitle="Kanal antarmuka percakapan perintah jadwal"
          criteriaTitle="Gerbang Checkpoint 3 dinyatakan <strong>Lolos Verifikasi</strong> jika seluruh parameter berikut terpenuhi:"
          criteria={[
            'Bot Telegram baru telah dibuat via <code>@BotFather</code> resmi dan tombol <strong>Start</strong> telah ditekan.',
            'Bot Token rahasia tersimpan aman di obrolan pribadi BotFather (tidak pernah disebarkan ke orang lain).',
            'Nomor Telegram User ID (angka murni) telah didapatkan dari <code>@userinfobot</code>.',
          ]}
          status={checkpoints['cp-3']}
          onStatusChange={(status) => handleCheckpointChange('cp-3', status)}
        >
          {/* Participant Input Form with Validators */}
          <div
            style={{
              background: 'var(--bg-surface-elevated)',
              padding: '1.25rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
              margin: '1.25rem 0',
            }}
          >
            <h5
              style={{
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-bold)',
                marginBottom: '0.75rem',
                color: 'var(--text-primary)',
              }}
            >
              📝 Formulir Data Verifikasi Checkpoint 3:
            </h5>

            <div className="form-group">
              <label htmlFor="input-telegram-username" className="form-label">
                <span>🤖</span> Username Bot Telegram Anda:
              </label>
              <input
                type="text"
                id="input-telegram-username"
                className={`form-input ${
                  isTgUsernameValid
                    ? 'is-valid'
                    : isTgUsernameInvalid
                    ? 'is-invalid'
                    : ''
                }`}
                placeholder="Contoh: @jadwal_budi_2026_bot"
                data-participant-field="telegramUsername"
                value={participantInfo.telegramUsername}
                onChange={(e) =>
                  handleParticipantInfoChange('telegramUsername', e.target.value)
                }
                autoComplete="off"
              />
              <small
                className={`form-validation-msg ${
                  isTgUsernameValid
                    ? 'valid'
                    : isTgUsernameInvalid
                    ? 'invalid'
                    : ''
                }`}
                id="msg-val-tg-username"
              >
                {isTgUsernameValid
                  ? "✓ Format username bot valid (berakhiran 'bot')."
                  : isTgUsernameInvalid
                  ? "✕ Username bot Telegram wajib diakhiri dengan kata 'bot' atau '_bot'."
                  : "Wajib diakhiri kata 'bot' atau '_bot' (contoh: @jadwal_budi_bot)."}
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="input-telegram-userid" className="form-label">
                <span>🆔</span> Telegram User ID Anda (Hanya Angka Murni):
              </label>
              <input
                type="text"
                id="input-telegram-userid"
                className={`form-input ${
                  isTgUserIdValid
                    ? 'is-valid'
                    : isTgUserIdInvalid
                    ? 'is-invalid'
                    : ''
                }`}
                placeholder="Contoh: 123456789"
                data-participant-field="telegramUserId"
                value={participantInfo.telegramUserId}
                onChange={(e) =>
                  handleParticipantInfoChange('telegramUserId', e.target.value)
                }
                autoComplete="off"
              />
              <small
                className={`form-validation-msg ${
                  isTgUserIdValid
                    ? 'valid'
                    : isTgUserIdInvalid
                    ? 'invalid'
                    : ''
                }`}
                id="msg-val-tg-userid"
              >
                {isTgUserIdValid
                  ? '✓ Format Telegram User ID valid (angka murni).'
                  : isTgUserIdInvalid
                  ? '✕ Salah: Telegram User ID hanya berupa angka (misal: 123456789), bukan username @.'
                  : 'Hanya boleh berupa angka murni (tanpa huruf, spasi, atau @).'}
              </small>
            </div>
          </div>
        </CheckpointGateCard>
      </section>
    </div>
  )
}
