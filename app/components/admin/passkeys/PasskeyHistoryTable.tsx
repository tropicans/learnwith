import React, { useState } from 'react'
import type { PasskeyRotationHistoryEntry } from '../../../schemas/passkey'

interface PasskeyHistoryTableProps {
  history: PasskeyRotationHistoryEntry[]
  isLoading?: boolean
}

export function PasskeyHistoryTable({ history, isLoading = false }: PasskeyHistoryTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copyHash = async (hash: string, id: string) => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(hash)
      } else {
        const textarea = document.createElement('textarea')
        textarea.value = hash
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      // Fallback
    }
  }

  const formatDate = (timestamp: number) => {
    try {
      return new Date(timestamp).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return '-'
    }
  }

  return (
    <div className="admin-passkey-history-section" id="admin-passkey-history-section">
      <div className="admin-section-header">
        <div className="admin-section-title-group">
          <h3 className="admin-section-title">
            <span>📜</span> Riwayat Rotasi Passkey
          </h3>
          <span className="admin-section-badge">
            {history.length} Catatan Versi
          </span>
        </div>
        <p className="admin-section-desc">
          Audit trail immutable atas pembaruan passkey sebelumnya untuk keperluan integritas dan rekonsiliasi.
        </p>
      </div>

      <div className="admin-table-container">
        <table className="admin-table" aria-label="Tabel Riwayat Rotasi Passkey">
          <thead>
            <tr>
              <th scope="col" style={{ width: '80px' }}>Versi</th>
              <th scope="col">Modul Pelatihan</th>
              <th scope="col">SHA-256 Hash Preview</th>
              <th scope="col">Waktu Rotasi</th>
              <th scope="col">Dirotasi Oleh</th>
              <th scope="col">Alasan Rotasi</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && history.length === 0 ? (
              <tr>
                <td colSpan={6} className="table-loading-cell">
                  <div className="table-loading-spinner">
                    <span className="spinner-sm" aria-hidden="true" />
                    <span>Memuat riwayat rotasi...</span>
                  </div>
                </td>
              </tr>
            ) : history.length === 0 ? (
              <tr>
                <td colSpan={6} className="table-empty-cell">
                  Belum ada riwayat rotasi passkey.
                </td>
              </tr>
            ) : (
              history.map((entry) => {
                const isWord = entry.courseId === 'word'
                const isCopied = copiedId === entry.id
                return (
                  <tr key={entry.id} id={`history-row-${entry.id}`}>
                    <td>
                      <span className="passkey-version-tag">
                        v{entry.version}
                      </span>
                    </td>
                    <td>
                      <span className={`passkey-course-pill ${isWord ? 'pill-word' : 'pill-ai'}`}>
                        {isWord ? '📝 Word ASN' : '🤖 Agentic AI'}
                      </span>
                    </td>
                    <td>
                      <div className="passkey-table-hash-group">
                        <code className="passkey-hash-snippet" title={entry.hash}>
                          {entry.hash.substring(0, 16)}…
                        </code>
                        <button
                          type="button"
                          className="btn-snippet-copy"
                          onClick={() => copyHash(entry.hash, entry.id)}
                          title="Salin hash lengkap"
                        >
                          {isCopied ? '✅' : '📋'}
                        </button>
                      </div>
                    </td>
                    <td className="table-time-cell">
                      {formatDate(entry.rotatedAt)}
                    </td>
                    <td>
                      <span className="passkey-admin-badge">
                        {entry.rotatedBy}
                      </span>
                    </td>
                    <td className="table-reason-cell">
                      {entry.reason || '-'}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
