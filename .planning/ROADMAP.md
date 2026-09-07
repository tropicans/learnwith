# Roadmap: learnwith — Multi-Course Platform & Pengolahan Kata Tingkat Lanjut

## Milestones

- ✅ **v1.0 Pre-Training Interactive Web App (Agentic AI)** - Phases 1-4 (shipped 2026-09-03) — [Archive](milestones/v1.0-ROADMAP.md)
- ✅ **v1.1 Live Workshop Guide (Agentic AI Hari-H)** - Phases 5-8 (shipped 2026-09-07) — [Archive](milestones/v1.1-ROADMAP.md)
- ✅ **v2.0 Multi-Course Platform & Modul Pengolahan Kata Tingkat Lanjut** - Phases 9-12 (shipped 2026-09-07) — [Archive](milestones/v2.0-ROADMAP.md)
- 🟡 **v2.1 Google NotebookLM-Inspired UI/UX Overhaul & Workspace Architecture** - Phases 13-14 (in progress)

## Active Milestone: v2.1 (Phases 13-14)

- [ ] **Phase 13: NotebookLM Top Bar, Anti-Cache Critical CSS & Clean Course Selector**
  - Embed critical `<style>` rules for course dropdowns in `<head>` to prevent unstyled layout leaks.
  - Bump asset cache-busting to `?v=2.1.0`.
  - Introduce `learnwith` platform branding + breadcrumb course pill selector (`learnwith / [ 🤖 Hands-on Agentic AI ▾ ]`).
  - Eliminate triple title repetition while preserving semantic accessibility and test compatibility.
  - Polish elevated course picker modal card.

- [ ] **Phase 14: Workspace Studio Navigation, Sidebar De-duplication & Material 3 Polishing**
  - Hide redundant duplicate course/mode switchers on desktop sidebar (screens ≥ 1024px) to present curriculum immediately.
  - Keep single source of truth for Course 1 mode switcher (Pra-Training vs Hari-H) on desktop header.
  - Ensure mobile header and drawer provide clean, responsive, touch-friendly navigation without text wrapping.
  - Synchronize Course 2 stats cards (4 Bab, 3 Checkpoints, 28 Checklist steps, `0/28`).
  - Soften document readiness status card into a calm, encouraging progress indicator.
  - Style search input into a NotebookLM rounded pill container.

### Phase 13: NotebookLM Top Bar, Anti-Cache Critical CSS & Clean Course Selector

**Goal**: Deliver a calm, elegant Google NotebookLM-style top bar with unified platform branding, anti-cache critical CSS protection, and a modern course pill selector.  
**Depends on**: Milestone v2.0  
**Requirements**: CACHE-01, CACHE-02, NLM-NAV-01, NLM-NAV-02, NLM-NAV-03  
**Plans**: 1-2 plans  

### Phase 14: Workspace Studio Navigation, Sidebar De-duplication & Material 3 Polishing

**Goal**: Eliminate duplicate switchers on desktop sidebar, streamline the curriculum navigation panel, polish Course 2 stat cards and status banners, and perfect mobile responsiveness.  
**Depends on**: Phase 13  
**Requirements**: WORK-01, WORK-02, WORK-03, POLISH-01, POLISH-02, POLISH-03  
**Plans**: 1-2 plans  

## Completed Milestones

<details>
<summary>✅ v2.0 Multi-Course Platform & Modul Pengolahan Kata Tingkat Lanjut (Phases 9-12) - SHIPPED 2026-09-07</summary>

- [x] **Phase 9: Multi-Course Architecture & Course Gate Protection**
- [x] **Phase 10: Interactive Modules Bab I–III (Struktur Dokumen, Styles, TOC & Penomoran Halaman)**
- [x] **Phase 11: Interactive Modules Bab IV (Mail Merge, Track Changes & Kolaborasi Dokumen)**
- [x] **Phase 12: Interactive Knowledge Quiz (Bab V), Rubrik Evaluasi & Laporan Kelulusan BPSDM**

Full details: [v2.0 Roadmap Archive](milestones/v2.0-ROADMAP.md) | [v2.0 Requirements Archive](milestones/v2.0-REQUIREMENTS.md) | [v2.0 Milestone Audit](milestones/v2.0-MILESTONE-AUDIT.md)

</details>

<details>
<summary>✅ v1.1 Live Workshop Guide (Hari-H Praktik Kelas) (Phases 5-8) - SHIPPED 2026-09-07</summary>

- [x] **Phase 5: Mode Switcher & Dual Workshop Navigation Shell**
- [x] **Phase 6: 9Router Model Alignment & Hermes Agent Windows Installation**
- [x] **Phase 7: Telegram Allowlist Gateway, Google Calendar OAuth & End-to-End Verification**
- [x] **Phase 8: In-Class Troubleshooting Hub, Completion Status Engine & Final Report Exporter**

Full details: [v1.1 Roadmap Archive](milestones/v1.1-ROADMAP.md) | [v1.1 Requirements Archive](milestones/v1.1-REQUIREMENTS.md)

</details>

<details>
<summary>✅ v1.0 Pre-Training Interactive Web App (Phases 1-4) - SHIPPED 2026-09-03</summary>

- [x] **Phase 1: Foundation Shell, Navigation & Theme Architecture**
- [x] **Phase 2: Interactive Guide Modules & 1-Click Execution**
- [x] **Phase 3: Checklist Engine, Checkpoint Gates & Local Storage State**
- [x] **Phase 4: Troubleshooting Hub, Secret Redaction Helper & Report Exporter**

Full details: [v1.0 Roadmap Archive](milestones/v1.0-ROADMAP.md) | [v1.0 Requirements Archive](milestones/v1.0-REQUIREMENTS.md)

</details>
