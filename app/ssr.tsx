/// <reference types="vinxi/types/server" />
import {
  createStartHandler,
  defaultStreamHandler,
} from '@tanstack/react-start/server'
import { getRouterManifest } from '@tanstack/react-start/router-manifest'
import { createRouter } from './router'

export default createStartHandler({
  createRouter,
  getRouterManifest,
})(async (ctx) => {
  const start = Date.now()
  const response = await defaultStreamHandler(ctx)
  const duration = Date.now() - start
  const method = ctx.request.method
  const url = new URL(ctx.request.url).pathname
  const status = response.status

  // Structured minimalist request logging (D-12)
  console.log(`[SSR] ${method} ${url} ${status} (${duration}ms)`)

  // Ensure fresh SSR responses are never cached stale by proxies (D-10)
  if (!response.headers.has('Cache-Control')) {
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
  }

  return response
})
