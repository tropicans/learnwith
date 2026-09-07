# Milestone v2.1 Requirements — Google NotebookLM-Inspired UI/UX Overhaul & Workspace Architecture

**Status:** ✅ COMPLETE  
**Milestone:** v2.1  

---

## Requirements Traceability

### 1. Critical CSS & Anti-Cache Architecture (CACHE)

- [x] **CACHE-01**: Course dropdown menu must have critical `<style>` rules embedded in `<head>` ensuring `display: none !important;` by default and `display: flex !important;` when `.show` is toggled, preventing unstyled HTML leakage under any network or cache conditions.
- [x] **CACHE-02**: Asset versioning query parameter bumped to `?v=2.1.0` on all linked stylesheets and scripts in `index.html`.

### 2. Google NotebookLM-Inspired Top Bar & Course Selector (NLM-NAV)

- [x] **NLM-NAV-01**: Header displays unified platform branding `learnwith` alongside an elegant Material 3 breadcrumb pill selector (`learnwith / [ 🤖 Hands-on Agentic AI ▾ ]`).
- [x] **NLM-NAV-02**: Elimination of triple text repetition in header: `#header-brand-title` and `#header-brand-subtitle` integrated seamlessly into the brand & breadcrumb hierarchy while preserving DOM accessibility and 100% test compatibility.
- [x] **NLM-NAV-03**: Floating course switcher popover styled as an elevated Google-style card with soft shadows, active course indicator, and clean unlock status badges.

### 3. Workspace De-duplication & Sidebar Streamlining (WORKSPACE)

- [x] **WORK-01**: Sidebar on desktop (screens ≥ 1024px) hides redundant duplicate switchers, immediately surfacing module curriculum links without pushing content below the fold.
- [x] **WORK-02**: Course 1 mode switcher (Pra-Training vs Hari-H Kelas) on desktop resides exclusively in the header as a clean, segmented Material 3 pill control.
- [x] **WORK-03**: Mobile header displays compact logo and hamburger menu without text wrapping or multi-line button breaking; mobile sidebar drawer cleanly accommodates touch-friendly course and mode selection (≥ 44px touch targets).

### 4. Visual Hierarchy, Card Polishing & Content Alignment (POLISH)

- [x] **POLISH-01**: Course 2 hero stat cards synchronized to real numbers: 4 Bab, 3 Checkpoints, 28 Checklist steps, and dynamic progress counter (`0/28 Langkah Selesai`).
- [x] **POLISH-02**: Document readiness status card redesigned from an alarming orange warning box into an encouraging, calm progress card.
- [x] **POLISH-03**: Search bar styled with Google-style rounded pill container, comfortable padding, and non-overlapping `Ctrl+K` key badge.

### 5. Google NotebookLM Frontpage Hub & Seamless Navigation (HOME)

- [x] **HOME-01**: Dedicated NotebookLM Frontpage Hub (`#container-home`) displaying platform welcome hero, search/filter helper, and notebook card gallery for Course 1, Course 2, and BPSDM Civil Service standards.
- [x] **HOME-02**: Clean full-width canvas on home view (`.view-home` on `.app-container` hides `.app-sidebar` and centers `.app-main`).
- [x] **HOME-03**: Header adaptively displays clean brand on Frontpage and breadcrumb pill on Studio Workspace views.
- [x] **HOME-04**: Seamless two-way navigation: clicking notebook cards enters Studio Workspace, clicking `learnwith` brand or `🏠 Beranda Kursus` in dropdown returns to Frontpage.
- [x] **HOME-05**: URL routing supports `?course=ai`, `?course=word`, and default root without parameters rendering the NotebookLM Frontpage with 100% backward test compatibility.

---

## Traceability Table

| Requirement | Phase | Status |
|---|---|---|
| CACHE-01 | Phase 13 | Complete |
| CACHE-02 | Phase 13 | Complete |
| NLM-NAV-01 | Phase 13 | Complete |
| NLM-NAV-02 | Phase 13 | Complete |
| NLM-NAV-03 | Phase 13 | Complete |
| WORK-01 | Phase 14 | Complete |
| WORK-02 | Phase 14 | Complete |
| WORK-03 | Phase 14 | Complete |
| POLISH-01 | Phase 14 | Complete |
| POLISH-02 | Phase 14 | Complete |
| POLISH-03 | Phase 14 | Complete |
| HOME-01 | Phase 15 | Complete |
| HOME-02 | Phase 15 | Complete |
| HOME-03 | Phase 15 | Complete |
| HOME-04 | Phase 15 | Complete |
| HOME-05 | Phase 15 | Complete |
