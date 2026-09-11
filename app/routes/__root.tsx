import {
  Outlet,
  ScrollRestoration,
  createRootRoute,
  useRouter,
  useRouterState,
} from '@tanstack/react-router'
import { Meta, Scripts } from '@tanstack/react-start'
import { type ReactNode, useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { GlobalAnnouncementBanner } from '@/components/layout/GlobalAnnouncementBanner'
import { NotFound } from '@/components/ui/NotFound'
import { RouteErrorBoundary } from '@/components/ui/RouteErrorBoundary'
import { getPublicCourseStatusesFn } from '@/server/courseLifecycle'
import { COURSE_STATUS_BROADCAST_CHANNEL } from '@/utils/courseBroadcast'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'learnwith — Pusat Modul Praktik & Workshop Interaktif' },
      { name: 'description', content: 'Platform Pembelajaran Praktik Komputer & AI Interaktif' },
    ],
    links: [
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg?v=3.0.0' },
      { rel: 'apple-touch-icon', href: '/apple-touch-icon.png?v=3.0.0' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap' },
      { rel: 'stylesheet', href: '/assets/css/main.css?v=2.5.0' },
      { rel: 'stylesheet', href: '/assets/css/components.css?v=2.5.0' },
      { rel: 'stylesheet', href: '/assets/css/homepage.css?v=1.0.1' },
      { rel: 'stylesheet', href: '/assets/css/admin.css?v=1.3.0' },
    ],
  }),
  loader: async () => {
    try {
      const courseStatuses = await getPublicCourseStatusesFn()
      return { courseStatuses }
    } catch {
      return { courseStatuses: [] }
    }
  },
  notFoundComponent: NotFound,
  errorComponent: RouteErrorBoundary,
  component: RootComponent,
})

function RootComponent() {
  const router = useRouter()
  const loaderData = Route.useLoaderData()
  const courseStatuses = loaderData?.courseStatuses ?? []
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const isHome = pathname === '/'
  const isAdmin = pathname.startsWith('/admin')

  useEffect(() => {
    if (typeof window === 'undefined' || !('BroadcastChannel' in window)) return
    const channel = new BroadcastChannel(COURSE_STATUS_BROADCAST_CHANNEL)
    channel.onmessage = (event) => {
      if (event.data?.type === 'STATUS_UPDATED') {
        router.invalidate()
      }
    }
    return () => {
      channel.close()
    }
  }, [router])

  return (
    <RootDocument>
      <GlobalAnnouncementBanner />
      <div
        id="drawer-backdrop"
        className="drawer-backdrop"
        aria-hidden="true"
        onClick={() => {
          if (typeof window !== 'undefined') {
            document.getElementById('app-sidebar')?.classList.remove('open')
            document.getElementById('drawer-backdrop')?.classList.remove('active')
          }
        }}
      />
      <div className={`app-container ${isHome ? 'view-home' : ''} ${isAdmin ? 'view-admin' : ''}`}>
        <Header courseStatuses={courseStatuses} />
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
