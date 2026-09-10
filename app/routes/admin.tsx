import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { adminCheckSessionFn, adminGetAuthConfigFn, adminGoogleLoginFn } from '@/server/adminAuth'
import type { AdminUser } from '@/schemas/admin'
import { AdminLoginGate } from '@/components/admin/AdminLoginGate'
import { AdminShell } from '@/components/admin/AdminShell'

export const Route = createFileRoute('/admin')({
  loader: async () => {
    const [sessionResult, authConfig] = await Promise.all([
      adminCheckSessionFn(),
      adminGetAuthConfigFn(),
    ])
    return {
      authenticated: sessionResult.authenticated,
      initialUser: sessionResult.adminUser || null,
      authConfig,
    }
  },
  head: () => ({
    meta: [
      { title: 'Command Center Instruktur & Admin — learnwith' },
      { name: 'description', content: 'Pusat Kendali Administrasi, Telemetri, dan Pemantauan Peserta learnwith' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  component: AdminRouteComponent,
})

function AdminRouteComponent() {
  const { authenticated: initialAuthenticated, initialUser, authConfig } = Route.useLoaderData()
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(initialUser)
  const [oauthError, setOauthError] = useState<string | null>(null)
  const isAuthenticated = Boolean(currentUser)

  useEffect(() => {
    if (initialUser) {
      setCurrentUser(initialUser)
    }
  }, [initialUser])

  // Handle Google OAuth callback from URL hash (#access_token=... or #id_token=...)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const hash = window.location.hash
    if (!hash || (!hash.includes('access_token=') && !hash.includes('id_token='))) return

    const params = new URLSearchParams(hash.replace(/^#/, ''))
    const idToken = params.get('id_token')
    const accessToken = params.get('access_token')
    const token = idToken || accessToken

    if (token) {
      // Clear hash immediately for cleanliness and security
      window.history.replaceState(null, '', window.location.pathname + window.location.search)

      adminGoogleLoginFn({ data: { credentialToken: token } })
        .then((res) => {
          if (res.success && res.authenticatedAt) {
            setCurrentUser({
              role: 'admin',
              authenticatedAt: res.authenticatedAt,
              authMethod: 'google',
            })
          } else {
            setOauthError(res.message || 'Login Google gagal.')
          }
        })
        .catch((err) => {
          setOauthError(err instanceof Error ? err.message : 'Gagal menghubungkan ke Google.')
        })
    }
  }, [])

  const handleLoginSuccess = (user: AdminUser) => {
    setCurrentUser(user)
  }

  const handleLogout = () => {
    setCurrentUser(null)
  }

  return (
    <main
      className="admin-canvas app-main-admin"
      id="admin-main-canvas"
      style={{
        gridArea: 'main',
        width: '100%',
        minHeight: 'calc(100vh - 48px)',
        backgroundColor: 'var(--bg-body, #f5f5f7)',
        color: 'var(--text-primary, #1d1d1f)',
      }}
    >
      {isAuthenticated && currentUser ? (
        <AdminShell adminUser={currentUser} onLogout={handleLogout} />
      ) : (
        <AdminLoginGate
          onLoginSuccess={handleLoginSuccess}
          googleClientIdConfigured={authConfig.googleClientIdConfigured}
          googleClientId={authConfig.googleClientId}
          externalErrorMessage={oauthError}
        />
      )}
    </main>
  )
}
