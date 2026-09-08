# TanStack Start Feature Capabilities & Specifications

**Domain:** Full-Document SSR, File-Based Routing, Streaming & Type Safety  
**Project:** learnwith v3.0 Migration  

---

## 1. Table Stakes (Must-Have Capabilities)

1. **File-Based Routing Architecture (`app/routes/`)**:
   - `__root.tsx`: Menyediakan kerangka dokumen HTML lengkap (`<html>`, `<head>`, `<Meta />`, `<Links />`, `<body>`, `<Outlet />`, `<Scripts />`, `<ScrollRestoration />`).
   - `index.tsx`: Halaman Frontpage Hub (menampilkan kartu workshop `learnwith`).
   - `course.ai.tsx`: Halaman workshop Agentic AI (Pra-Training & Kelas).
   - `course.word.tsx`: Halaman workshop Pengolahan Kata Tingkat Lanjut (dengan password/unlock validation via loader).
   - `diagnostics.tsx`: Halaman diagnosis teknis & troubleshooting.

2. **Validated Search Params with Zod**:
   - Skema validasi query string yang ketat pada route:
     ```ts
     const courseSearchSchema = z.object({
       mode: z.enum(['pretraining', 'live-class']).catch('pretraining'),
       tab: z.string().optional(),
       unlock: z.string().optional(),
       filter: z.string().optional(),
     });
     ```
   - Type-safe auto-complete saat menggunakan `<Link search={{ mode: 'live-class' }} />`.

3. **Type-Safe Route Loaders & SSR Preloading**:
   - Data modul, silabus, dan daftar periksa diload sebelum halaman dirender via `loader: async () => fetchCourseData()`.
   - Mengeliminasi Content Layout Shift (CLS) dan zero empty-state flicker pada first paint.

4. **Typed Server Functions (`createServerFn`)**:
   - Server-only execution boundaries untuk fungsi sensitif (misal: verifikasi kata sandi pengajar dengan SHA-256 di server environment).

---

## 2. Differentiators (Advanced Architecture Capabilities)

1. **Full-Document Progressive SSR Streaming**:
   - Stream HTML chunks menggunakan React Suspense boundaries (`<Suspense fallback={<ModuleSkeleton />}>`).
   - Browser menerima shell utama secara instan, disusul konten berat saat siap tanpa memblokir seluruh rendering.

2. **Per-Route SSR Mode Selection**:
   - SSR Full untuk konten publik & dokumentasi (Home Hub & Agentic AI Pre-training) demi performa TTFB dan SEO.
   - Client-only / SPA Island untuk widget interaktif stateful (Kuis Bab V, Token Redactor Playground, LocalStorage Sync) menggunakan boundary `ClientOnly` tanpa merusak hidrasi server.

3. **Runtime Deployment Optimization**:
   - Docker container multi-stage build yang menghasilkan standalone Node server bundle untuk integrasi seamless dengan self-hosted container stack.
