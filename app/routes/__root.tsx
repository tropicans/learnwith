import {
  Outlet,
  ScrollRestoration,
  createRootRoute,
  useRouterState,
} from '@tanstack/react-router'
import { Meta, Scripts } from '@tanstack/react-start'
import type { ReactNode } from 'react'
import { Header } from '@/components/layout/Header'
import { GlobalAnnouncementBanner } from '@/components/layout/GlobalAnnouncementBanner'
import { NotFound } from '@/components/ui/NotFound'
import { RouteErrorBoundary } from '@/components/ui/RouteErrorBoundary'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'learnwith — Pusat Modul Praktik & Workshop Interaktif' },
      { name: 'description', content: 'Platform Pembelajaran Praktik Komputer & AI Interaktif' },
    ],
    links: [
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg?v=2.3.0' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap' },
      { rel: 'stylesheet', href: '/assets/css/main.css?v=2.2.0' },
      { rel: 'stylesheet', href: '/assets/css/components.css?v=2.2.0' },
      { rel: 'stylesheet', href: '/assets/css/homepage.css?v=1.0.0' },
      { rel: 'stylesheet', href: '/assets/css/admin.css?v=1.0.0' },
    ],
  }),
  notFoundComponent: NotFound,
  errorComponent: RouteErrorBoundary,
  component: RootComponent,
})

function RootComponent() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const isHome = pathname === '/'
  const isAdmin = pathname.startsWith('/admin')

  return (
    <RootDocument>
      <GlobalAnnouncementBanner />
      <div className={`app-container ${isHome ? 'view-home' : ''} ${isAdmin ? 'view-admin' : ''}`}>
        <Header />
        <Outlet />
      </div>
    </RootDocument>
  )
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="id" data-theme="light">
      <head>
        <Meta />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}
