import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { NotFound } from '@/components/ui/NotFound'
import { RouteErrorBoundary } from '@/components/ui/RouteErrorBoundary'

export function createRouter() {
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadDelay: 50,
    defaultNotFoundComponent: NotFound,
    defaultErrorComponent: RouteErrorBoundary,
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}
