# TanStack Start Technical Stack Research

**Domain:** Full-Stack Web Application Framework  
**Target:** TanStack Start, TanStack Router, Vinxi/Nitro, Vite, React, TypeScript  
**Project:** learnwith v3.0 Migration  

---

## 1. Core Stack Packages & Ecosystem Versions

| Package | Purpose | Recommended Version |
|---|---|---|
| `@tanstack/react-start` | Core full-stack TanStack Start framework integration | `^1.x` |
| `@tanstack/react-router` | Type-safe router with file-based routing support | `^1.x` |
| `@tanstack/router-plugin` | Vite code generator plugin for file-based route generation | `^1.x` |
| `@tanstack/react-query` | Server & client async state caching and loader deduplication | `^5.x` |
| `vinxi` | Underlying full-stack bundler / server toolkit powering Start | Latest stable |
| `react` & `react-dom` | View presentation layer | `^19.0` or `^18.3` |
| `zod` | Search params validation, form validation, server fn schema | `^3.23` |
| `typescript` | Static typing and route inference engine | `^5.4` |
| `vite` | Client & server asset bundler | `^5.x` |

---

## 2. Server Boundary & Runtime Deployment Integration

- **`createServerFn`**:
  - Operasi sensitif (verifikasi kunci sandi, membaca konfigurasi server, integrasi LLM/gateway internal) dienkapsulasi dengan `createServerFn`.
  - Menggunakan `.validator(zodSchema)` untuk validasi input sebelum fungsi dieksekusi.
  - Runtime bundling otomatis memecah kode: di browser hanya stub HTTP RPC (`fetch`) yang disertakan, sedangkan logic asli hanya ada di server build.
- **Target Deployment**:
  - Node.js runtime (`@tanstack/start/server-runtime` atau Nitro node-server preset) kompatibel penuh dengan `docker-compose.yml` yang sudah ada di proyek root.
  - Menghasilkan build mandiri tanpa dependensi runtime eksternal selain Node 20+.

---

## 3. What NOT to Add (Anti-Bloat Guard)
- Jangan menambahkan database ORM berat (Prisma, TypeORM) jika belum diperlukan; data statis kurikulum & modul cukup diload via TypeScript modules/loaders.
- Jangan mengganti styling yang sudah ada dengan UI framework berat yang membutuhkan runtime JavaScript besar; tetap pertahankan design system CSS murni (`assets/css/main.css`, `components.css`) dengan loading optimal di root document.
