# Milestone v2.1 Requirements — Google NotebookLM-Inspired UI/UX Overhaul & Workspace Architecture

**Status:** 🟡 ACTIVE  
**Milestone:** v2.1  

---

## Requirements Traceability

### 1. Critical CSS & Anti-Cache Architecture (CACHE)

- [ ] **CACHE-01**: Course dropdown menu must have critical `<style>` rules embedded in `<head>` ensuring `display: none !important;` by default and `display: flex !important;` when `.show` is toggled, preventing unstyled HTML leakage under any network or cache conditions.
- [ ] **CACHE-02**: Asset versioning query parameter bumped to `?v=2.1.0` on all linked stylesheets and scripts in `index.html`.

### 2. Google NotebookLM-Inspired Top Bar & Course Selector (NLM-NAV)

- [ ] **NLM-NAV-01**: Header displays unified platform branding `learnwith` alongside an elegant Material 3 breadcrumb pill selector (`learnwith / [ 🤖 Hands-on Agentic AI ▾ ]`).
- [ ] **NLM-NAV-02**: Elimination of triple text repetition in header: `#header-brand-title` and `#header-brand-subtitle` integrated seamlessly into the brand & breadcrumb hierarchy while preserving DOM accessibility and 100% test compatibility.
- [ ] **NLM-NAV-03**: Floating course switcher popover styled as an elevated Google-style card with soft shadows, active course indicator, and clean unlock status badges.

### 3. Workspace De-duplication & Sidebar Streamlining (WORKSPACE)

- [ ] **WORK-01**: Sidebar on desktop (screens ≥ 1024px) hides redundant duplicate switchers, immediately surfacing module curriculum links without pushing content below the fold.
- [ ] **WORK-02**: Course 1 mode switcher (Pra-Training vs Hari-H Kelas) on desktop resides exclusively in the header as a clean, segmented Material 3 pill control.
- [ ] **WORK-03**: Mobile header displays compact logo and hamburger menu without text wrapping or multi-line button breaking; mobile sidebar drawer cleanly accommodates touch-friendly course and mode selection (≥ 44px touch targets).

### 4. Visual Hierarchy, Card Polishing & Content Alignment (POLISH)

- [ ] **POLISH-01**: Course 2 hero stat cards synchronized to real numbers: 4 Bab, 3 Checkpoints, 28 Checklist steps, and dynamic progress counter (`0/28 Langkah Selesai`).
- [ ] **POLISH-02**: Document readiness status card redesigned from an alarming orange warning box into an encouraging, calm progress card.
- [ ] **POLISH-03**: Search bar styled with Google-style rounded pill container, comfortable padding, and non-overlapping `Ctrl+K` key badge.

---

## Traceability Table

| Requirement | Phase | Status |
|---|---|---|
| CACHE-01 | Phase 13 | Pending |
| CACHE-02 | Phase 13 | Pending |
| NLM-NAV-01 | Phase 13 | Pending |
| NLM-NAV-02 | Phase 13 | Pending |
| NLM-NAV-03 | Phase 13 | Pending |
| WORK-01 | Phase 14 | Pending |
| WORK-02 | Phase 14 | Pending |
| WORK-03 | Phase 14 | Pending |
| POLISH-01 | Phase 14 | Pending |
| POLISH-02 | Phase 14 | Pending |
| POLISH-03 | Phase 14 | Pending |
