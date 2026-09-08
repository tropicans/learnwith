import { Link } from '@tanstack/react-router'
import type { ErrorComponentProps } from '@tanstack/react-router'

export function RouteErrorBoundary({ error, reset }: ErrorComponentProps) {
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
          maxWidth: '540px',
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
            src="/favicon.svg?v=2.3.0"
            alt="LearnWith Logo"
            style={{ width: '56px', height: '56px', borderRadius: '12px' }}
          />
        </div>
        <div
          className="badge badge-pill badge-neutral"
          style={{ marginBottom: '1rem', fontSize: '0.85rem', color: '#b91c1c', backgroundColor: '#fef2f2' }}
        >
          Terjadi Kesalahan Sistem
        </div>
        <h2
          style={{
            fontSize: '1.4rem',
            fontWeight: 700,
            marginBottom: '0.75rem',
            color: 'var(--text-primary, #202124)',
          }}
        >
          Gagal Memuat Komponen Halaman
        </h2>
        <p
          style={{
            fontSize: '0.9rem',
            color: 'var(--text-muted, #5f6368)',
            lineHeight: 1.5,
            marginBottom: '1.5rem',
          }}
        >
          {error?.message || 'Terjadi gangguan saat memproses data modul. Silakan coba muat ulang halaman.'}
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          {reset && (
            <button
              type="button"
              onClick={() => reset()}
              className="btn btn-secondary"
              style={{ padding: '0.65rem 1.25rem', fontSize: '0.9rem' }}
            >
              Muat Ulang
            </button>
          )}
          <Link
            to="/"
            search={{ filter: 'all' }}
            className="btn btn-primary"
            style={{ padding: '0.65rem 1.25rem', fontSize: '0.9rem' }}
          >
            Beranda Workshop
          </Link>
        </div>
      </div>
    </main>
  )
}

export default RouteErrorBoundary
