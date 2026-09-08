---
id: 260908-k0z
description: Ganti logo LearnWith menjadi logo resmi baru sesuai gambar terlampir
date: 2026-09-08
type: quick
---

# Quick Plan: Ganti Logo LearnWith Menjadi Logo Resmi Baru

## Overview
Mengganti aset logo dan favicon `learnwith` di seluruh aplikasi (root, public, assets/icons, header komponen TanStack Start, dan index.html) menggunakan desain logo resmi baru (ikon panah ke atas + figur kolaboratif + kilau bintang + tipografi "LearnWith").

## Tasks
- [x] Ekstraksi logo dan mark dari media terlampir dengan resolusi tinggi (SVG vektor dan transparent PNG)
- [x] Perbarui `favicon.svg`, `public/favicon.svg`, dan `assets/icons/favicon.svg` dengan ikon mark baru dan rounded navy squircle
- [x] Buat aset logo lengkap (`learnwith-logo.svg`, `learnwith-logo-white.svg`, PNG resolusi tinggi)
- [x] Perbarui `app/components/layout/Header.tsx`, `app/routes/__root.tsx`, dan `index.html`
- [x] Verifikasi visual via Playwright screenshot dan verifikasi otomatis via test suite (11/11 lulus)
