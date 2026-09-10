import { Link } from '@tanstack/react-router'

export function NotFound() {
  return (
    <main
      className="app-main error-page-main"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        padding: '2rem',
      }}
    >
      <div
        className="card error-card"
        style={{
          maxWidth: '520px',
          width: '100%',
          textAlign: 'center',
          padding: '2.5rem 2rem',
          borderRadius: '16px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          border: '1px solid var(--border-subtle, #e0e0e0)',
          background: 'var(--bg-surface, #ffffff)',
        }}
      >
        <div style={{ marginBottom: '1.25rem' }}>
          <img
            src="/favicon.svg?v=3.0.0"
            alt="LearnWith Logo"
            style={{ width: '56px', height: '56px', borderRadius: '12px' }}
          />
        </div>
        <div
          className="badge badge-pill badge-neutral"
          style={{ marginBottom: '1rem', fontSize: '0.85rem' }}
        >
          404 • Halaman Tidak Ditemukan
        </div>
        <h2
          style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            marginBottom: '0.75rem',
            color: 'var(--text-primary, #202124)',
          }}
        >
          Modul atau Halaman Tidak Ditemukan
        </h2>
        <p
          style={{
            fontSize: '0.95rem',
            color: 'var(--text-muted, #5f6368)',
            lineHeight: 1.5,
            marginBottom: '2rem',
          }}
        >
          Maaf, tautan yang Anda tuju tidak tersedia atau telah dipindahkan ke kurikulum terbaru. Silakan kembali ke beranda untuk memilih workshop.
        </p>
        <Link
          to="/"
          search={{ filter: 'all' }}
          className="btn btn-primary btn-block"
          style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem' }}
        >
          <span>Kembali ke Beranda Workshop</span>
        </Link>
      </div>
    </main>
  )
}

export default NotFound
