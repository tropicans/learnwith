# LearnWith Design System

A formal design specification and implementation manual for **LearnWith** (`learnwith`).  
Anchor Direction: **Enterprise GovTech & Professional Academy × Editorial Studio Bento**  
Core Purpose: **"Learning that you can actually practice."**  
Implementation Target: Built upon the existing Vanilla CSS Custom Properties architecture (`assets/css/main.css` & `assets/css/components.css`).

---

## 1. Brand Essence

LearnWith bridges the gap between passive educational theory and verified workplace execution. It is neither an informal video streaming catalog nor a bureaucratic document archive; it is an **interactive training command center** designed for Aparatur Sipil Negara (ASN), technical leads, engineers, and modern public-sector/enterprise professionals.

* **Personality:** Trustworthy, technically credible, practical, modern, human, and disciplined.
* **Tone:** Institutional dignity without bureaucratic sluggishness; technological sophistication without speculative crypto/web3 hype or cyberpunk gimmicks.
* **Value Promise:** Participants do not simply absorb conceptual slides—they configure environments, execute terminal checkpoints, audit standardized documents, and verify actual competence.

---

## 2. Design Principles

1. **Pragmatic Competence over Abstract Claims:**  
   Every visual element reinforces actionable capability. Interface components highlight verified states, real command syntax, measurable checkpoints, and reproducible workflows.
2. **Editorial Clarity via the Bento Architecture:**  
   Information is structured into purposeful, high-density modular tiles (Editorial Bento). Information hierarchy is unambiguous: users always know where they are, what is required, and how to verify their progress.
3. **Restraint as a Premium Quality:**  
   Visual authority is achieved through deliberate typography, disciplined whitespace, crisp 1px borders, and grounded elevation—never through neon glows, heavy glassmorphism, or decorative clutter.
4. **Authenticity in Evidence:**  
   Media and product demonstrations show real interfaces, actual terminal outputs, and legitimate workflow interactions. Stock imagery, artificial illustrations, and fabricated data are strictly prohibited.
5. **Radical Respect for User Environment:**  
   Interfaces must load instantly, respect low-bandwidth and high-latency connections, conserve CPU/GPU decoding cycles, and accommodate users with accessibility requirements or motion sensitivities.

---

## 3. Visual Language

* **Surfaces:** Clean, planar surfaces with subtle tonal contrast between canvas (`--bg-body`) and content containers (`--bg-surface`).
* **Borders & Dividers:** Subtle 1px borders (`--border-subtle`) define cards and panels, strengthening readability without visual noise. On hover or focus, borders transition smoothly to `--border-strong`.
* **Elevation & Depth:** Shallow, realistic drop shadows (`--shadow-xs` to `--shadow-sm`). Hover elevations are restrained (`translateY(-2px)` with `--shadow-md`). Deep blur halos and neon dropshadows are prohibited.
* **Corner Geometry:** Disciplined, predictable radius progression:
  * Interactive controls & inputs: `8px` (`--radius-md`)
  * Badges & small pills: `4px` (`--radius-sm`) or `9999px` (`--radius-full`)
  * Feature containers & bento tiles: `16px` (`--radius-xl`) to `20px`

---

## 4. Typography

Typography is the core structural element of LearnWith. The system pairs an authoritative, highly legible neo-grotesque sans-serif with an uncompromising monospace.

### Typeface Stack
* **Primary Sans-Serif:** `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`  
  Used for all editorial headings, body text, UI controls, navigation, and explanatory copy.
  * *OpenType Settings:* `font-feature-settings: 'cv02', 'cv03', 'cv04', 'tnum';` (enhances character distinction and aligns tabular numerals).
* **Monospace Accent:** `'JetBrains Mono', SFMono-Regular, Consolas, monospace`  
  Used selectively for terminal commands, CLI arguments, code blocks, checkpoint status tags, tabular telemetry, and version indicators.

### Typographic Hierarchy & Scale

| Token / Role | Target Size | Line Height | Weight | Letter Spacing | Context / Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display / Hero** | `clamp(2.25rem, 5vw, 3.5rem)` | `1.15` | 800 (Extrabold) | `-0.035em` | Main landing hero headline |
| `--font-size-4xl` | `2.25rem` (36px) | `1.2` | 700 (Bold) | `-0.03em` | Primary section titles (H1/H2) |
| `--font-size-3xl` | `1.875rem` (30px) | `1.25` | 700 (Bold) | `-0.025em` | Major track / bento cluster headings |
| `--font-size-2xl` | `1.5rem` (24px) | `1.3` | 600 (Semibold) | `-0.02em` | Card titles, modal headers |
| `--font-size-xl` | `1.25rem` (20px) | `1.4` | 600 (Semibold) | `-0.015em` | Sub-feature headings, callout headers |
| `--font-size-lg` | `1.125rem` (18px) | `1.55` | 400 / 500 | `0em` | Hero lead paragraph, prominent excerpts |
| `--font-size-base` / `md` | `1.0rem` (16px) | `1.65` | 400 (Regular) | `0em` | Default body copy, documentation prose |
| `--font-size-sm` | `0.875rem` (14px) | `1.5` | 500 / 600 | `0.01em` | Buttons, navigation links, input fields |
| `--font-size-xs` | `0.75rem` (12px) | `1.4` | 500 / 600 (Mono) | `0.02em` | Metadata tags, status badges, captions |

---

## 5. Color Tokens

The visual system builds directly on the established CSS custom properties in `assets/css/main.css`. It maintains strict contrast ratios (WCAG 2.1 AA, targeting AAA for primary body text).

### Core Token Palette

```
Light Mode:
  Canvas:           --bg-body: #f8fafc (Slate 50)
  Surface:          --bg-surface: #ffffff
  Borders:          --border-subtle: #e2e8f0 | --border-strong: #cbd5e1
  Text:             --text-primary: #0f172a | --text-secondary: #334155 | --text-muted: #64748b
  Brand Accent:     --accent-primary: #2563eb (Cobalt 600) | Hover: #1d4ed8
  Accent Subtle:    --accent-primary-subtle: #eff6ff

Dark Mode ([data-theme="dark"]):
  Canvas:           --bg-body: #0b0f19 (Obsidian Slate)
  Surface:          --bg-surface: #151b2c
  Borders:          --border-subtle: #1e2638 | --border-strong: #2d3852
  Text:             --text-primary: #f8fafc | --text-secondary: #cbd5e1 | --text-muted: #94a3b8
  Brand Accent:     --accent-primary: #3b82f6 (Cobalt 500) | Hover: #60a5fa
  Accent Subtle:    --accent-primary-subtle: rgba(59, 130, 246, 0.12)
```

### Semantic Status Tokens
* **Success / Verified:** `--color-success: #059669` (Dark: `#34d399`), `--color-success-subtle: #ecfdf5`. Used for passing checkpoints, verified certificates, and completed requirements.
* **Warning / Attention:** `--color-warning: #d97706` (Dark: `#fbbf24`), `--color-warning-subtle: #fffbeb`. Used for prerequisites, pending review, and dual-mode notices.
* **Danger / Issue:** `--color-danger: #dc2626` (Dark: `#f87171`), `--color-danger-subtle: #fef2f2`. Used for failed validation and critical errors.
* **Informational / Neutral:** `--color-info: #2563eb` (Dark: `#60a5fa`), `--bg-surface-subtle: #f1f5f9` (Dark: `#1f283f`).

---

## 6. Spacing System

Layout rhythm adheres strictly to an 8-point harmonic base with 4-point micro-increments.

```
4px   (0.25rem)  - Micro-gap between badge icon and text
8px   (0.5rem)   - Standard gap between tag lists, chip elements
12px  (0.75rem)  - Input field padding, compact card header gap
16px  (1.0rem)   - Standard component inner padding, card gaps on mobile
24px  (1.5rem)   - Standard bento card body padding, section sub-elements
32px  (2.0rem)   - Bento grid gaps, column separation
48px  (3.0rem)   - Separation between sub-groups within a section
80px  (5.0rem)   - Major section vertical padding (Desktop)
120px (7.5rem)   - Hero top/bottom breathing room on widescreen viewports
```

---

## 7. Layout and Grid

1. **Global Max-Width & Centering:**
   * Global Container: `max-width: 1280px` (or `min(1280px, 92vw)`), centered via `margin-left: auto; margin-right: auto;`.
   * Editorial Narrative Measure: `max-width: 720px` for headings and descriptive prose to ensure optimal line length.
2. **Layout Decoupling on the Landing Page:**
   * On `/`, the app shell must decouple from the documentation 2-column sidebar grid (`sidebar main`). The landing canvas is a dedicated single-column flow (`.view-home` or standalone container).
3. **12-Column Editorial Grid:**
   * Desktop viewports utilize a 12-column grid (`display: grid; grid-template-columns: repeat(12, 1fr); gap: 2rem;`).
   * Hero uses an asymmetric **7-column narrative + 5-column product showcase** split.
4. **Bento Tile Grids:**
   * Feature grids utilize flexible auto-fit structures: `grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 1.75rem;`.

---

## 8. Hero Specification

The hero is the primary visual transformation of the landing page. It rejects the generic centered text box in favor of an asymmetric, high-signal split layout.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ HERO SECTION (7 / 5 ASYMMETRIC DESKTOP SPLIT)                               │
├──────────────────────────────────────┬──────────────────────────────────────┤
│ Column 1–7: Narrative Authority      │ Column 8–12: Experience Showcase     │
│                                      │                                      │
│ [ Context Indicator Pill ]           │ ┌──────────────────────────────────┐ │
│ "Platform Praktik Terstandar"        │ │ LearnWith Studio Frame           │ │
│                                      │ │ ─────────────────────────────── │ │
│ Headline:                            │ │ [ Live Checkpoint / Real CLI    │ │
│ [ Strategic headline communicating   │ │   Verification Showcase ]        │ │
│   mechanism & verified outcome ]     │ │                                  │ │
│                                      │ │ • Instant WebP poster            │ │
│ Value Proposition (2–3 sentences):   │ │ • Responsive video or static     │ │
│ Terstruktur, langsung di terminal    │ │   demonstration                  │ │
│ dan dokumen riil, tanpa friksi setup.│ │ • Aspect ratio preserved         │ │
│                                      │ └──────────────────────────────────┘ │
│ Actions:                             │                                      │
│ [ Mulai Workshop AI (Primary) ]      │                                      │
│ [ Pelajari Kurikulum (Secondary) ]   │                                      │
│                                      │                                      │
│ Verified Capability Tags:            │                                      │
│ • Checkpoint Otomatis                │                                      │
│ • Dual-Mode (Pra-Training & Kelas)   │                                      │
│ • Dokumen Terstandar ASN             │                                      │
└──────────────────────────────────────┴──────────────────────────────────────┘
```

### Strategic Headline Policy
* **Do not freeze a single static slogan into specification.** The headline is an editorial copy decision finalized during content development.
* **Conceptual Directions to Explore:**
  * *Belajar. Praktikkan. Buktikan.*
  * *Dari Materi ke Praktik yang Terverifikasi.*
  * *Bukan Cuma Paham. Bisa Membuktikan.*
* **Rule:** The headline must communicate LearnWith’s **distinctive mechanism** (automated verification and workplace realism) and **tangible outcome**, avoiding generic "platform belajar masa kini" cliches.

### Hero Action Group
* **Primary Action:** Solid Cobalt button (`.btn-primary`) pointing to the primary active track (`/course/ai`).
* **Secondary Action:** Crisp outlined or neutral surface button (`.btn-secondary`) pointing to curriculum overview or documentation.
* **Capability Tags:** Monospace micro-pills highlighting key structural features (e.g., automated checkpoints, dual-mode learning, document compliance).

---

## 9. Buttons & Action Controls

Buttons provide unambiguous affordance, tactile responsiveness, and keyboard accessibility.

* **Primary (`.btn-primary`):** Solid `--accent-primary`, white text, subtle shadow (`--shadow-xs`). Active state: `transform: scale(0.985)`.
* **Secondary (`.btn-secondary`):** `--bg-surface`, `--border-strong`, `--text-primary`. On hover: `--bg-surface-hover`.
* **Ghost / Text (`.btn-ghost`):** Transparent background, `--text-secondary`. On hover: `--text-primary` with subtle background wash.
* **Monospace Pill Control (`.btn-mono`):** Styled with `'JetBrains Mono'`, used for CLI copy commands, mode toggles, or checkpoint triggers.
* **Touch Targets & Focus Rings:**
  * Minimum interactive height: `44px`.
  * `:focus-visible` ring: `2px solid var(--accent-primary)`, `offset: 2px`.

---

## 10. Cards & Bento Architecture

Cards organize workshops, modules, and platform capabilities into distinct, cohesive surfaces.

* **Base Structure (`.notebook-card`, `.bento-card`):**
  * Background: `--bg-surface`
  * Border: `1px solid var(--border-subtle)`
  * Radius: `16px` (`--radius-xl`)
  * Padding: `1.5rem` to `1.75rem`
* **Card Interior Hierarchy:**
  1. **Header Zone:** Status pill (`.badge-pill`) + Category label (`font-size-xs`, uppercase, bold).
  2. **Title:** Semibold, `--text-primary`, tight tracking.
  3. **Description:** Regular, `--text-secondary`, line height `1.55`.
  4. **Telemetry / Feature Strip:** Monospace metrics and checklist counts with crisp SVG icons.
  5. **Footer Action:** Integrated full-width button pinned to the card bottom.
* **Hover Interaction:** Subtle lift (`translateY(-2px)`) + deepened border (`--border-strong`) over 200ms ease.

---

## 11. Iconography

* **Zero Emoji Standard:** Raw operating system emojis (`🤖`, `📝`, `⚡`, `✨`, `📚`, `🎯`) are strictly prohibited in the UI. Emojis render unpredictably across OS platforms and undermine professional credibility.
* **Vector Standard:** Uniform SVG vector icons (Lucide / Heroicons family).
  * **ViewBox:** `0 0 24 24`
  * **Stroke Width:** `1.75px` or `2.0px` (consistently maintained across the entire site).
  * **Linecap / Linejoin:** `round`.
  * **Sizing:** `16px` for inline badges/buttons; `20px` for metadata lists; `24px` for prominent feature headers.

---

## 12. Motion Principles

Motion in LearnWith confirms state and guides attention. It must never distract or cause fatigue.

* **Durations & Easings:**
  * Micro-interactions (hover, active click): `150ms cubic-bezier(0.4, 0, 0.2, 1)`
  * State transitions (tabs, toggles, filter shifts): `200ms cubic-bezier(0.16, 1, 0.3, 1)`
  * Panel reveals & modals: `250ms – 300ms`
* **Prohibitions:**
  * No continuous looping ambient motion (e.g. drifting floating particles, wobbling containers).
  * No scroll-jacking or artificial scroll acceleration.
* **Accessibility Override:**
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
  ```

---

## 13. Video and Media Strategy

Video serves as **supporting evidence of the actual LearnWith experience**—demonstrating real checkpoint execution, terminal interactions, and document verification. It is never decorative filler or generic stock footage.

### Technical Performance Architecture
1. **Zero Layout Shift (CLS Guarantee):**  
   The showcase container must have an explicit CSS aspect ratio (e.g. `aspect-ratio: 16 / 9;` or explicit width/height) and an immediate static poster image.
2. **Instant Poster First:**  
   An optimized, lightweight WebP poster image renders immediately in the HTML markup (`poster="/assets/showcase-poster.webp"`). The page layout and typography never wait for video bytes.
3. **Non-Blocking Execution:**  
   Video elements must use `preload="metadata"` (or `preload="none"` below the fold), `muted`, `loop`, `playsinline`, and `autoplay`. Audio tracks must be stripped completely at encoding time.
4. **Responsive Media Strategy (Not Blanket Disabling):**
   * **Desktop & High-Bandwidth Environments:** High-definition showcase video (WebM VP9 primary + MP4 H.264 fallback).
   * **Capable Mobile Devices / Tablets:** Optimized, lower-bitrate 720p/480p cut delivered via responsive `<source media="..." />`.
   * **Constrained Connections (Save-Data) & Low-End Devices:** Static WebP poster rendered directly without video decoding.
   * **`prefers-reduced-motion: reduce`:** Video element is bypassed; high-fidelity static UI screenshot is rendered.
5. **Resource Conservation (CPU/GPU Workload Minimization):**  
   An `IntersectionObserver` must monitor the video element:
   * When the video scrolls outside the active viewport, execute `video.pause()`.
   * When the video scrolls into the active viewport, resume `video.play()`.  
   *(Note: This minimizes unnecessary decoding and energy consumption; avoid claiming absolute "zero GPU").*

---

## 14. Responsive Behavior

| Viewport Tier | Breakpoint | Adaptations |
| :--- | :--- | :--- |
| **Widescreen Desktop** | `≥ 1280px` | 12-column grid; 7/5 hero split; full bento arrangements; maximum whitespace. |
| **Standard Desktop / Laptop** | `1024px – 1279px` | 12-column grid with reduced horizontal margins; bento tiles flow naturally. |
| **Tablet** | `768px – 1023px` | Hero stacks into single column (editorial narrative on top, showcase container beneath); bento tiles shift to 2-column grid; touch targets strictly ≥ 44px. |
| **Mobile** | `< 768px` | Single-column linear flow; horizontal scroll chips for category filters; responsive video or static poster; compact card padding (`1.25rem`). |

---

## 15. Accessibility (WCAG 2.1 AA Standards)

* **Color Contrast:** All body text meets at least `4.5:1` contrast against background. Headlines exceed `3.0:1`. Button text meets at least `5.2:1`.
* **Keyboard Navigability:** All clickable cards, filters, and buttons are native interactive elements (`<a>`, `<button>`, `<input>`) or carry proper `role`, `tabIndex={0}`, and Enter/Space event handlers.
* **Screen Reader Integrity:**
  * Purely decorative elements and SVG icons are tagged with `aria-hidden="true"`.
  * Status badges contain descriptive semantic tags (e.g. `<span class="sr-only">Status: </span>Aktif`).
  * Live regions (`aria-live="polite"`) notify assistive tech when workshop filters change.

---

## 16. Trust and Content Integrity

To preserve credibility with institutional stakeholders, public-sector partners, and professional learners, **trust claims must be rigorously truthful**.

### Categories of Trust Signals
1. **Verified Institutional Relationships:** Only display institutional names (e.g., BPSDM, Pusdiklat, government bodies) if backed by official workshop mandates, formal partnerships, or verified curriculum deployments. Never fabricate client lists or endorsements.
2. **Methodologies & Standards:** Prominently highlight verifiable standards:
   * Tata Naskah Dinas ASN compliance rules.
   * Open-source automation standards (PowerShell, Docker, Node.js, Python).
   * Verifiable offline-first architecture.
3. **Product Capabilities:** Communicate real features supported by code:
   * Automated CLI checkpoint verification.
   * Dual-mode workspace architecture (Pra-Training & Ruang Kelas).
   * Instant feedback loops and error diagnostic trees.
4. **Data & Metrics Integrity:** Never invent artificial stats (e.g., "99% completion rate", "10,000 ASN trained") unless derived from verified production databases. Rely on structural metrics: count of curriculum modules, verified checkpoints, and checklist items.

---

## 17. Landing Page Information Architecture

The revised landing page sequence optimizes for **early proof of mechanism**, overcoming the friction of traditional text-heavy landing pages.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. HERO WITH EXPERIENCE SHOWCASE                                            │
│    Strategic Headline + Value Prop + Primary/Secondary CTAs + Studio Window │
├─────────────────────────────────────────────────────────────────────────────┤
│ 2. STANDARDS & METHODOLOGY STRIP                                            │
│    Verifiable standards: Tata Naskah Dinas ASN, Open CLI, Dual-Mode Engine   │
├─────────────────────────────────────────────────────────────────────────────┤
│ 3. THE VALUE PILLARS (EDITORIAL BENTO)                                      │
│    Why LearnWith: Automated Checkpoints, Zero-Setup Sandboxes, Real Outputs │
├─────────────────────────────────────────────────────────────────────────────┤
│ 4. WORKSHOP TRACKS (THE CORE CATALOG)                                       │
│    Interactive cards for available learning tracks:                         │
│    • Workshop Agentic AI & Otomasi Ruang Kerja                              │
│    • Standardisasi Dokumen & Administrasi Perkantoran ASN                   │
├─────────────────────────────────────────────────────────────────────────────┤
│ 5. HOW IT WORKS (3-STEP VERIFICATION PIPELINE)                              │
│    Pilih Modul ──> Eksekusi di Terminal ──> Validasi Otomatis               │
├─────────────────────────────────────────────────────────────────────────────┤
│ 6. VERIFIABLE PLATFORM CAPABILITIES                                         │
│    Diagnostic error guidance, dual-mode flexibility, offline persistence    │
├─────────────────────────────────────────────────────────────────────────────┤
│ 7. FREQUENTLY ASKED QUESTIONS (FAQ)                                         │
│    Prerequisites, hardware specs, network requirements, certificate access │
├─────────────────────────────────────────────────────────────────────────────┤
│ 8. FINAL ACTION CLOSING BANNER                                              │
│    High-contrast closing panel with direct route action                     │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 18. Anti-Patterns (Strictly Prohibited)

1. **No Raw Operating System Emojis:** Do not use `🤖`, `📝`, `⚡`, `✨`, `✅`, etc., as UI icons or list bullets.
2. **No Neon Cyberpunk / Excessive Glass:** Do not use high-intensity glowing text, dark purple neon accents, or unreadable glass overlays.
3. **No Unanchored Floating Gradients / Blobs:** Gradients must be strictly contained within subtle component frames or text masks.
4. **No Artificial AI Stock Illustrations:** Do not place generic 3D rendered cartoon figures or irrelevant stock photography.
5. **No Fabricated Social Proof:** Never generate fake user quotes, unverified institutional badges, or invented completion stats.
6. **No Video as Pure Decoration:** Never load heavy background video loops that do not depict actual LearnWith software operations.

---

## 19. Implementation Guidance for the Existing Vanilla CSS System

This specification builds upon and refines the existing codebase without rewriting or abandoning current CSS foundations.

### File Roles & Responsibilities
* `assets/css/main.css`: Contains CSS variables (`:root` and `[data-theme="dark"]`), global resets, typography tokens, base button tokens, and app-level grid structure.
* `assets/css/components.css`: Contains modular component classes (`.card`, `.notebook-card`, `.badge`, `.btn`, `.terminal`, etc.).
* `app/routes/__root.tsx`: Injects stylesheets and sets the HTML document shell.
* `app/routes/index.tsx`: Houses the landing page component tree and route-level state.

### Evolution Strategy (No Breaking Changes)
1. **Reuse Existing Token Names:** Always use existing CSS custom properties (`--accent-primary`, `--bg-surface`, `--text-primary`, `--border-subtle`, `--radius-md`, etc.). Do not invent duplicate variables.
2. **Scoping New Landing Page Classes:** When introducing new bento or hero layout classes, prefix them clearly (`.home-hero-...`, `.bento-...`, `.showcase-...`) and keep them organized within the existing CSS structure.
3. **Fixing App-Container Scoping:** Ensure the home page container is cleanly isolated (using `.view-home` on `.app-container` or scoping `.home-main`) so that the multi-column sidebar grid from the course view does not leak into the landing page.
4. **Pure SVG Icon Components:** Extract or render SVG icons directly in React components using consistent `width={18}`, `height={18}`, `stroke="currentColor"`, and `strokeWidth="2"`.
