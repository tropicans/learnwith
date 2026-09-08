# Phase 20: File-Based Routes & Validated Search Params - Pattern Map

**Phase:** 20 - File-Based Routes & Validated Search Params  
**Status:** Ready for Planning  
**Target File:** `.planning/phases/20-file-based-routes-validated-search-params/20-PATTERNS.md`  

---

## Executive Summary

This document establishes the code blueprints, structural patterns, and route signatures for all files to be created or modified in Phase 20. It defines the mapping from legacy monolithic views in `index.html` to declarative TanStack Router file-based routes and Zod-validated search parameters.

---

## File Classification & Architectural Boundaries

| File Path | Role | Boundary / Data Flow | Action | Analogs / Precedents |
|---|---|---|---|---|
| `app/schemas/searchParams.ts` | Zod Search Validation Schemas | Type Safety & Input Validation | Create | Validation layer for URL query parameters |
| `app/routes/__root.tsx` | Root Document Route Shell | Hybrid (SSR HTML Shell + Navigation) | Modify | `index.html` (legacy top bar, breadcrumb, CSS links) |
| `app/routes/index.tsx` | Frontpage Hub Route (`/`) | Hybrid (SSR Content + Notebook Gallery) | Modify | `#container-home` in `index.html` |
| `app/routes/course.ai.tsx` | Agentic AI Route (`/course/ai`) | Hybrid (Workspace + Dual-Mode Nav) | Create | `#container-course-ai` in `index.html` |
| `app/routes/course.word.tsx` | Word Processing Route (`/course/word`) | Hybrid (Workspace + Gate Prompt) | Create | `#container-course-word` in `index.html` |
| `app/components/layout/Header.tsx` | Platform Header Component | Presentation & Navigation | Create | Header section from `index.html:167-250` |
| `app/components/layout/CourseSwitcher.tsx` | Course Dropdown Selector | Navigation & Unlock Status | Create | `.header-course-switcher` from `index.html:187-220` |

---

## Pattern Assignments

### 1. `app/schemas/searchParams.ts`
- **Role**: Centralized Zod validation schemas for route query parameters.
- **Blueprint**:
  ```typescript
  import { z } from 'zod'

  export const homeSearchSchema = z.object({
    filter: z.enum(['all', 'ai', 'word']).catch('all'),
  })

  export type HomeSearchParams = z.infer<typeof homeSearchSchema>

  export const courseAiSearchSchema = z.object({
    mode: z.enum(['pretraining', 'live-class']).catch('pretraining'),
    step: z.string().optional(),
    cp: z.coerce.number().optional(),
  })

  export type CourseAiSearchParams = z.infer<typeof courseAiSearchSchema>

  export const courseWordSearchSchema = z.object({
    tab: z.string().optional(),
    bab: z.coerce.number().optional(),
    unlocked: z.coerce.boolean().optional(),
  })

  export type CourseWordSearchParams = z.infer<typeof courseWordSearchSchema>
  ```

### 2. `app/routes/__root.tsx`
- **Role**: Global HTML document shell with linked stylesheets, metadata, and platform header.
- **Pattern**:
  ```tsx
  import {
    Outlet,
    ScrollRestoration,
    createRootRoute,
  } from '@tanstack/react-router'
  import { Meta, Scripts } from '@tanstack/react-start'
  import type { ReactNode } from 'react'
  import { Header } from '@/components/layout/Header'

  export const Route = createRootRoute({
    head: () => ({
      meta: [
        { charSet: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { title: 'learnwith — Pusat Modul Praktik & Workshop Interaktif' },
        { name: 'description', content: 'Platform Pembelajaran Praktik Komputer & AI Interaktif' },
      ],
      links: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap' },
        { rel: 'stylesheet', href: '/assets/css/main.css?v=2.2.0' },
        { rel: 'stylesheet', href: '/assets/css/components.css?v=2.2.0' },
      ],
    }),
    component: RootComponent,
  })

  function RootComponent() {
    return (
      <RootDocument>
        <div className="app-container">
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
  ```

### 3. `app/routes/index.tsx`
- **Role**: Frontpage Hub (`/`) mapping `#container-home`.
- **Pattern**:
  ```tsx
  import { createFileRoute } from '@tanstack/react-router'
  import { homeSearchSchema } from '@/schemas/searchParams'
  import { Link } from '@tanstack/react-router'

  export const Route = createFileRoute('/')({
    validateSearch: (search) => homeSearchSchema.parse(search),
    component: HomeComponent,
  })

  function HomeComponent() {
    const { filter } = Route.useSearch()

    return (
      <main className="app-main home-main" id="container-home">
        <section className="home-hero">
          <div className="home-hero-badge">WORKSPACE MODUL INTERAKTIF</div>
          <h1 className="home-hero-title">Pusat Pembelajaran & Modul Praktik Mandiri</h1>
          <p className="home-hero-subtitle">
            Pilih modul atau workshop di bawah ini untuk memulai panduan praktik langsung, pengujian checkpoint bertahap, dan pembuatan laporan kesiapan instan.
          </p>
        </section>

        {/* Filter Chips */}
        <div className="home-filter-bar">
          <Link to="/" search={{ filter: 'all' }} className={`home-chip ${filter === 'all' ? 'active' : ''}`}>
            Semua Modul
          </Link>
          <Link to="/" search={{ filter: 'ai' }} className={`home-chip ${filter === 'ai' ? 'active' : ''}`}>
            🤖 Hands-on Agentic AI
          </Link>
          <Link to="/" search={{ filter: 'word' }} className={`home-chip ${filter === 'word' ? 'active' : ''}`}>
            📝 Pengolahan Kata ASN
          </Link>
        </div>

        {/* Notebook Cards Grid */}
        <div className="notebook-grid">
          {(filter === 'all' || filter === 'ai') && (
            <div className="notebook-card" data-category="ai">
              <div className="notebook-card-header">
                <span className="notebook-card-icon">🤖</span>
                <span className="badge badge-success">Aktif</span>
              </div>
              <h2 className="notebook-card-title">Hands-on Agentic AI</h2>
              <p className="notebook-card-desc">
                Praktik deploy Hermes Agent & 9Router: dari chat kalender hingga verifikasi token Telegram bot.
              </p>
              <div className="notebook-card-footer">
                <Link to="/course/ai" search={{ mode: 'pretraining' }} className="btn btn-primary btn-sm">
                  Buka Workshop
                </Link>
              </div>
            </div>
          )}

          {(filter === 'all' || filter === 'word') && (
            <div className="notebook-card" data-category="word">
              <div className="notebook-card-header">
                <span className="notebook-card-icon">📝</span>
                <span className="badge badge-warning">Terkunci</span>
              </div>
              <h2 className="notebook-card-title">Pengolahan Kata Tingkat Lanjut</h2>
              <p className="notebook-card-desc">
                Standar BPSDM: Heading hierarkis, Daftar Isi otomatis, Mail Merge, dan Kuis Evaluasi Bab V.
              </p>
              <div className="notebook-card-footer">
                <Link to="/course/word" search={{}} className="btn btn-secondary btn-sm">
                  Buka Modul ASN
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    )
  }
  ```

### 4. `app/routes/course.ai.tsx`
- **Role**: Agentic AI Workshop Workspace (`/course/ai`).
- **Pattern**:
  ```tsx
  import { createFileRoute, Link } from '@tanstack/react-router'
  import { courseAiSearchSchema } from '@/schemas/searchParams'

  export const Route = createFileRoute('/course/ai')({
    validateSearch: (search) => courseAiSearchSchema.parse(search),
    head: () => ({
      meta: [
        { title: 'Hands-on Agentic AI — Workspace Workshop' },
      ],
    }),
    component: CourseAiComponent,
  })

  function CourseAiComponent() {
    const { mode } = Route.useSearch()

    return (
      <main className="app-main course-main" id="container-course-ai">
        <div className="course-mode-tabs">
          <Link
            to="/course/ai"
            search={{ mode: 'pretraining' }}
            className={`mode-tab ${mode === 'pretraining' ? 'active' : ''}`}
          >
            📋 Pra-Training
          </Link>
          <Link
            to="/course/ai"
            search={{ mode: 'live-class' }}
            className={`mode-tab ${mode === 'live-class' ? 'active' : ''}`}
          >
            🚀 Hari-H Kelas 🔒
          </Link>
        </div>

        <div className="course-content-placeholder">
          <h2>Workshop Agentic AI: {mode === 'pretraining' ? 'Sesi Pra-Training' : 'Sesi Hari-H Praktik'}</h2>
          <p>Navigasi rute terverifikasi. Komponen kurikulum interaktif dimuat pada workspace ini.</p>
        </div>
      </main>
    )
  }
  ```

### 5. `app/routes/course.word.tsx`
- **Role**: Advanced Word Processing Workspace (`/course/word`).
- **Pattern**:
  ```tsx
  import { createFileRoute } from '@tanstack/react-router'
  import { courseWordSearchSchema } from '@/schemas/searchParams'

  export const Route = createFileRoute('/course/word')({
    validateSearch: (search) => courseWordSearchSchema.parse(search),
    head: () => ({
      meta: [
        { title: 'Pengolahan Kata Tingkat Lanjut (ASN) — Workspace' },
      ],
    }),
    component: CourseWordComponent,
  })

  function CourseWordComponent() {
    const search = Route.useSearch()

    return (
      <main className="app-main course-main" id="container-course-word">
        <div className="course-header-banner">
          <h2>Pengolahan Kata Tingkat Lanjut (Standar BPSDM)</h2>
          <p>Format Dokumen Kedinasan, Styles, TOC Otomatis & Mail Merge.</p>
        </div>

        <div className="course-content-placeholder">
          <p>Status Modul: Aktif dalam navigasi rute TanStack Router.</p>
        </div>
      </main>
    )
  }
  ```
