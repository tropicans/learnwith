# Phase 1 Technical Research: Core Foundation & Shell

## Overview
Phase 1 establishes the client-side architecture and visual design system for the **Pre-Training Workshop Interactive Checklist & Guide Web App**. The goal is a zero-build, lightning-fast, responsive web app that renders cleanly on all screen sizes, supports dark/light modes, provides real-time search filtering, and tracks overall progress accurately.

## Architecture & Technology Choices

### 1. Zero-Dependency Vanilla Web Stack
- **HTML5**: Semantic tags (`<header>`, `<nav>`, `<main>`, `<aside>`, `<section>`, `<article>`, `<footer>`), ARIA attributes (`aria-expanded`, `aria-label`, `aria-live`, `role="progressbar"`).
- **CSS3**: Custom properties (CSS variables), CSS Grid & Flexbox, Backdrop Filter (Glassmorphism), CSS transitions/animations for micro-interactions, responsive media queries (`@media (max-width: 768px)`).
- **Vanilla JS (ES6+)**: Modular script architecture (`state.js`, `search.js`, `app.js`), `localStorage` wrapper with JSON serialization, custom event dispatching for reactive UI updates.

### 2. Design System Tokens (Palette & Typography)
- **Typography**: Modern font stack (`Inter`, system-ui, `-apple-system`, `Segoe UI`, `Roboto`, sans-serif) with high legibility for technical commands and instructional text.
- **Dark Theme Palette**:
  - Background Base: `#0f172a` (Slate 900)
  - Surface/Card: `rgba(30, 41, 59, 0.75)` (Slate 800 with glass blur)
  - Surface Border: `rgba(255, 255, 255, 0.08)`
  - Primary Accent: `#3b82f6` (Blue 500) & `#6366f1` (Indigo 500)
  - Success Accent: `#10b981` (Emerald 500)
  - Warning/Caution: `#f59e0b` (Amber 500)
  - Text Primary: `#f8fafc` (Slate 50)
  - Text Secondary: `#94a3b8` (Slate 400)
- **Light Theme Palette**:
  - Background Base: `#f8fafc` (Slate 50)
  - Surface/Card: `#ffffff`
  - Surface Border: `#e2e8f0`
  - Text Primary: `#0f172a`
  - Text Secondary: `#64748b`

### 3. Search & Highlighting Architecture
- **In-Memory Search Index**: Structured index created during initial page load capturing section titles, step text, command snippets, glossary terms, and error keywords.
- **Debounced Input Filter**: 150ms debounce on search input to maintain 60fps responsiveness.
- **Keyword Highlighting**: Lightweight `<mark class="search-highlight">` wrapper dynamically inserted into matching DOM elements or filtered card views.

### 4. Progress Tracking Engine
- **Metric Formula**: Progress % = `((Checked Steps + Checkpoints Passed) / Total Tracked Items) * 100`.
- **Reactive UI**: State changes trigger smooth CSS width transitions on the header progress bar and update the numerical percentage badge.

## Validation Architecture
- **Manual Verification**: Run web browser / local HTTP server or open `index.html` directly to verify responsiveness (desktop 1440px, tablet 768px, mobile 375px), theme switching, search filter highlighting, and progress indicator synchronization.
- **Functional Checks**:
  - Theme persists across page reload in `localStorage`.
  - Search displays matching items and hides non-matching items.
  - Mobile drawer opens/closes with backdrop click and hamburger button.
