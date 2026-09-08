# TanStack Start System Architecture & Directory Layout

**Domain:** Full-Stack Web Architecture  
**Project:** learnwith v3.0 Migration  

---

## 1. Directory Tree Architecture

```
learnwith/
├── app/
│   ├── client.tsx              # Client entry point (hydrateRoot & createRouter)
│   ├── ssr.tsx                 # Server entry point (defaultStreamHandler)
│   ├── router.tsx              # Router definition & QueryClient integration
│   ├── routes/                 # File-based routes (TanStack Router)
│   │   ├── __root.tsx          # Root HTML document shell & global navigation
│   │   ├── index.tsx           # Home Hub / Course Gallery
│   │   ├── course/
│   │   │   ├── ai.tsx          # Hands-on Agentic AI workspace
│   │   │   └── word.tsx        # Pengolahan Kata Tingkat Lanjut workspace
│   │   └── diagnostics.tsx     # Technical troubleshooting & health matrix
│   ├── components/             # Reusable UI components
│   │   ├── layout/             # Header, Sidebar, Container, ThemeToggle
│   │   ├── modules/            # Accordion, Checkpoint, ChecklistItem
│   │   └── ui/                 # Buttons, Badges, Modals, Toasts
│   ├── server/                 # Server-only boundaries (createServerFn)
│   │   ├── auth.ts             # Passcode verification server functions
│   │   └── telemetry.ts        # Optional local diagnostics server functions
│   └── styles/                 # Preserved & modernized CSS design system
│       ├── main.css            # Base tokens, layout, typography
│       └── components.css      # Component cards, glassmorphic styles
├── public/                     # Static assets (favicon, images, templates)
├── tests/                      # Automated unit, integration, and E2E suites
├── app.config.ts               # TanStack Start / Vinxi / Vite configuration
├── tsconfig.json               # TypeScript strict configuration
└── package.json                # Modern package manifest with scripts
```

---

## 2. Data Flow & Server Boundary Contract

1. **URL Request → Vinxi Server**:
   - Request diterima server Vinxi/Nitro.
   - `ssr.tsx` mengeksekusi `createRouter()`.
   - Route match menentukan loader mana yang harus dijalankan di server.
2. **Server Execution Boundary**:
   - `server/auth.ts` dieksekusi murni di Node runtime.
   - Secret key, server hash salt, dan server env tidak pernah bocor ke client JS bundle.
3. **Full-Document HTML Stream**:
   - Server merender `<StartServer />` dan mengalirkan HTML stream langsung ke browser.
   - Browser menerima rendered markup pertama (FCP cepat, zero blank screen).
4. **Hydration & Client Interaction**:
   - `client.tsx` menghidrasi tree komponen.
   - Komponen interaktif (seperti checkbox checklist dan kuis) langsung aktif menggunakan state lokal/store tanpa re-render seluruh halaman.
