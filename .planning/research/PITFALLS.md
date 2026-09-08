# Common Pitfalls in TanStack Start & Full-Document SSR Migrations

**Domain:** Framework Migration & SSR Pitfalls  
**Project:** learnwith v3.0 Migration  

---

## 1. Top Technical Pitfalls & Prevention Strategies

### Pitfall 1: Server Hydration Mismatches (SSR vs LocalStorage)
- **Problem**: Mengakses `window`, `localStorage`, atau `document` langsung saat initial render di server akan menghasilkan error `ReferenceError: window is not defined` atau hydration error mismatch (misal: checkbox dicentang di client tapi belum di server).
- **Prevention**:
  - Bungkus akses `localStorage` di dalam `useEffect` atau custom hook `useLocalStorage`.
  - Gunakan helper component `<ClientOnly fallback={<Skeleton />}>` untuk komponen stateful yang murni berbasis client data.

### Pitfall 2: Leaking Server Code into Client Bundles
- **Problem**: Mengimpor modul server (Node `fs`, `crypto`, atau server secrets) di dalam file komponen client atau shared utils.
- **Prevention**:
  - Gunakan konvensi `createServerFn` dari `@tanstack/react-start`.
  - Simpan fungsi server di folder terpisah (`app/server/`) dan jangan pernah mengimpor modul Node langsung di komponen rute UI.

### Pitfall 3: Broken Relative Asset Paths & CSS Delivery
- **Problem**: File CSS tidak ter-render saat SSR streaming atau path favicon/gambar putus saat berpindah ke rute nested seperti `/course/ai`.
- **Prevention**:
  - Gunakan root `<Links />` di `__root.tsx` dan pastikan asset diimpor via Vite pipeline (`import './styles/main.css'`) atau diletakkan di folder `public/` dengan absolute path (`/favicon.svg`).

### Pitfall 4: Type Inference Regressions in Route Tree
- **Problem**: Mengubah nama file route tanpa men-generate ulang `routeTree.gen.ts` menyebabkan TypeScript error atau link type-check gagal.
- **Prevention**:
  - Pasang `@tanstack/router-plugin/vite` di `app.config.ts` agar `routeTree.gen.ts` otomatis di-generate setiap ada perubahan pada folder `app/routes/`.

### Pitfall 5: Deployment Runtime Model Mismatch
- **Problem**: Mengubah arsitektur aplikasi sehingga tidak dapat lagi dijalankan dalam container Docker mandiri.
- **Prevention**:
  - Konfigurasikan target deployment menggunakan preset `node-server` di TanStack Start/Vinxi agar tetap kompatibel 100% dengan Docker compose yang ada.
