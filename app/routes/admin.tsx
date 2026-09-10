import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { adminCheckSessionFn, adminGetAuthConfigFn } from '@/server/adminAuth'
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
  const isAuthenticated = Boolean(currentUser)

  useEffect(() => {
    if (initialUser) {
      setCurrentUser(initialUser)
    }
  }, [initialUser])

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
        />
      )}
    </main>
  )
}
