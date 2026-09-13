# Learnwith UI Migration Specification
**Document Version:** 1.0.0  
**Status:** Authoritative Architectural Design Contract  
**Target Platform:** TanStack Start v1.120 + React 19 + Vinxi + Nitro + Docker  
**Scope:** Visual Redesign & Presentation Architecture Specification (**Zero Code Modifications**)

---

## 1. Executive Summary & Design Philosophy

Learnwith is an interactive training and competency platform engineered for technical professionals and Indonesian Civil Servants (Aparatur Sipil Negara / ASN). The application currently powers two mission-critical courses:
1. **Course 1 (`/course/ai`):** *Dari Chat ke Kalender — Praktik Deploy Hermes Agent & 9Router di Windows*
2. **Course 2 (`/course/word`):** *Pelatihan Komputer Lanjutan Pengolahan Dokumen & Otomasi Sesuai Pergub DKI No. 14/2020*
Supported by a unified **Master Admin Command Center (`/admin`)** providing real-time telemetry, passkey rotation, participant triage, and course lifecycle orchestration.

### The New Visual Direction
The migration transitions Learnwith from an utilitarian document-centric presentation to a **cinematic, high-end creative & technology studio aesthetic**. Key visual tenets include:
- **Atmospheric & Immersive Dark Palette:** Deep carbon and obsidian backdrops (`#08080a`, `#0f0f13`) replacing clinical light canvases.
- **Editorial Typography:** Dramatic contrast between oversized architectural display titles and laser-sharp, readable body/monospace typography.
- **Sophisticated Accent Language:** Controlled purple, violet, and electric magenta accents (`#8b5cf6`, `#a855f7`, `#ec4899`) applied with deliberate restraint as rim highlights, focused badges, and soft luminous glows.
- **Modular Bento Grid Systems:** Balanced asymmetrical information modules framed with razor-thin hairline borders (`rgba(255, 255, 255, 0.08)`) and frosted translucent glass backdrops (`rgba(18, 18, 24, 0.7)`).
- **Functional Integrity First:** The visual language serves the pedagogical mission. Homepage is brand-forward and inspiring; course routes are ergonomically optimized for deep learning; admin routes are dense, precise, and operational.

---

## 2. Experience Architecture by Domain

```
                                    ┌────────────────────────────────┐
                                    │    Global Header & Context     │
                                    │ (Brand, CourseSwitcher, Theme) │
                                    └───────────────┬────────────────┘
                                                    │
                 ┌──────────────────────────────────┼──────────────────────────────────┐
                 │                                  │                                  │
    ┌────────────▼───────────┐         ┌────────────▼───────────┐         ┌────────────▼───────────┐
    │     HOMEPAGE (/)       │         │  COURSES (/course/*)   │         │     ADMIN (/admin)     │
    │   Editorial Studio     │         │ Highly Functional IDE  │         │ Dense Operational Room │
    ├────────────────────────┤         ├────────────────────────┤         ├────────────────────────┤
    │ • Narrative Showcase   │         │ • Course 1: AI (Tabs)  │         │ • Master Passkey Gate  │
    │ • Editorial Bento      │         │ • Course 2: Word (BPSDM│         │ • Google SSO Whitelist │
    │ • Course Cards Catalog │         │ • Fixed Progress Rail  │         │ • Realtime Telemetry   │
    │ • GovTech Standards    │         │ • Terminal Snippets    │         │ • Passkey Rotation     │
    │ • Technical FAQ        │         │ • Interactive Gates    │         │ • Incident Triage Hub  │
    └────────────────────────┘         └────────────────────────┘         └────────────────────────┘
```

### A. Homepage (`/`)
- **Purpose:** Position Learnwith as an elite, anxiety-free practical engineering and productivity academy for modern government and technical institutions.
- **Primary User:** Prospective learners, agency heads, training coordinators, and returning students.
- **Primary Action:** Explore curriculum outcomes and launch directly into an active workshop workspace.
- **Information Hierarchy:**
  1. Cinematic Studio Billboard & Manifesto: *"Technical Learning Without Anxiety."*
  2. Live Platform Metrics & Cohort Telemetry Strip.
  3. Interactive Bento Workshop Catalog: Live cards for AI and Word courses with duration, prerequisite tags, and enrollment status.
  4. The 3-Pillar Learning Methodology: Local Isolation, Self-Healing Checkpoints, Standardized Certification.
  5. Enterprise GovTech Compliance & Security Badging (Pergub DKI No. 14/2020, Private Local LLM Architecture).
  6. Technical FAQ and Enrollment CTA.
- **Navigation Model:** Top-level navigation with sticky minimal header; seamless anchor scrolling to catalog; direct client-side routing to courses.
- **Visual Composition:** Desktop 12-column asymmetric bento layouts, oversized serif/sans display type, subtle gradient mesh canvas backdrops, muted purple glow cards.
- **Responsive Behavior:** Hero transitions from a 7/5 desktop split to a focused vertical stack on mobile; bento grids gracefully compress from 3 columns to 2 on tablet, and single-column cards on mobile with horizontal badge carousels.

### B. Course Discovery
- **Purpose:** Transparent evaluation of learning objectives, time commitments, and technical requirements before committing.
- **Primary User:** Learner deciding between AI Agent deployment or ASN Word Automation.
- **Primary Action:** Click through course preview tabs, inspect required tools (Node.js, Telegram, Word styles), and launch course mode.
- **Visual Composition:** High-contrast metadata pill tags (`20 Menit`, `Node.js 18+`, `Pergub 14/2020`), live status chips (`Terbuka`, `Perlu Sandi`), and expandable curriculum outlines.

### C. Course 1: Agentic AI (`/course/ai`)
- **Purpose:** Step-by-step guidance for setting up local proxy routing (9Router), Telegram Bot Gateway, and Google Calendar OAuth on Windows.
- **Primary User:** Technical ASN, developers, and power users preparing their workstation.
- **Primary Action:** Complete 13 checklist tasks, execute shell commands, verify 3 gates, and achieve `SIAP WORKSHOP` readiness.
- **Information Hierarchy:**
  1. Dual-Mode Switcher: `📋 Pra-Training (Mandiri)` vs `🚀 Hari-H Kelas (Tatap Muka)`.
  2. Persistent Context & Readiness Header: Real-time progress bar (0–100%) and calculated status banner (`SIAP WORKSHOP` / `PERLU KLINIK` / `MENUNGGU`).
  3. Sticky Left/Rail Navigation: Module jump links, checkpoint completion indicators, and quick tools (Redaction, Troubleshooting, Report).
  4. Sequential Module Cards: Collapsible step-by-step actions with one-click terminal copy, warnings, and task checkboxes.
  5. Checkpoint Verification Gates: Direct input for Node version, Telegram username, and Bot token validation.
  6. Integrated Utilities: Interactive Redaction Sandbox and WhatsApp/Telegram Readiness Report Exporter.
- **Navigation Model:** Split workspace (desktop: 280px left progress rail + fluid central instructional canvas); drawer-based slide-over on mobile.
- **Visual Composition:** Dark IDE aesthetic. Terminal code blocks with subtle violet syntax borders, neon status pips, high-visibility green check states, and clear amber warning callouts.

### D. Course 2: Advanced Word (`/course/word`)
- **Purpose:** Rigorous document standardization according to Pergub DKI No. 14/2020, automated mail merge, and BPSDM certification.
- **Primary User:** ASN administrative staff, secretariat officers, and government document authors.
- **Primary Action:** Unlock protected course with passkey, follow Bab I–IV guidelines, complete 28 tasks, take the 20-question quiz, verify rubric, and generate graduation certificate.
- **Information Hierarchy:**
  1. Course Hero & Passkey Authorization Banner (`buka-kata`).
  2. Curriculum Syllabus & Streaming Accreditation Stats (`Alumni ASN Terakreditasi`, `Tingkat Kelulusan`).
  3. Bab I–IV Modular Directives (Styles, TOC, Multilevel Lists, Section Breaks, Page Numbering, Mail Merge, Track Changes).
  4. Interactive Practice Checklist Island (Hydration-safe client state).
  5. Bab V.B: 20-Question Knowledge Quiz Engine with live scoring and explanations.
  6. Bab V.C: Competency Rubric (Lampiran 3 & 5) & Self-Reflection Fields.
  7. Final Evaluation Summary: Dynamic 70/30 score calculation, graduation predicate, and official BPSDM Certificate Slip.
- **Navigation Model:** Linear instructional flow with chapter bookmarks; modal passkey unlock; in-page quiz progression.
- **Visual Composition:** Editorial government publishing aesthetic merged with sleek dark UI. Clean document previews, structured typography tables, high-contrast quiz question cards, and an official credential badge container.

### E. Admin Command Center (`/admin`)
- **Purpose:** Live operations room for instructors and workshop facilitators to track cohorts, triage errors, manage passkeys, and control visibility.
- **Primary User:** Lead instructor, technical facilitator, workshop administrator.
- **Primary Action:** Monitor participant telemetry in real-time, inspect stuck checkpoints, rotate course passkeys, and export grade sheets.
- **Information Hierarchy:**
  1. Security Gate: Master passkey verification (`admin-learnwith`) + Google OAuth SSO (`tropicans@gmail.com`).
  2. Session Status Bar: Real-time duration clock and one-click session revocation.
  3. Operational Tab Navigation: Dashboard & Monitoring, Peserta & Telemetri, Manajemen Kursus, Passkey Modul Dinas, Log Kendala, Pengaturan Platform.
  4. Dense Metric KPIs: Total Participants, Siap Workshop, Butuh Bantuan, Average Progress.
  5. Interactive Data Grid: Searchable, filterable participant cohort table with modal inspection.
  6. Direct Action Controls: CSV/JSON data export, passkey rotation modal, announcement broadcast publisher.
- **Navigation Model:** Tabbed single-page command center; full-width responsive dashboard canvas without promotional chrome.
- **Visual Composition:** Utilitarian, high-density dark cockpit. Monospaced numeric counters, compact data rows, vivid status chips, zero decorative clutter.

---

## 3. Design Token System Specification

The design token system upgrades Learnwith to a cohesive dark studio aesthetic while maintaining complete backward compatibility with existing CSS token variables.

```
       ┌─────────────────────────────────────────────────────────────┐
       │                LEARNWITH DARK STUDIO PALETTE                │
       ├──────────────────────────────┬──────────────────────────────┤
       │ Backgrounds & Canvases       │ Accents & Luminous Violet    │
       │ • Canvas Deep:   #08080a     │ • Violet Base:    #8b5cf6    │
       │ • Canvas Base:   #0f0f13     │ • Purple Bright:  #a855f7    │
       │ • Surface 1:     #14141c     │ • Electric Pink:  #ec4899    │
       │ • Surface 2:     #1c1c28     │ • Deep Plum:      #3b185f    │
       ├──────────────────────────────┼──────────────────────────────┤
       │ Borders & Dividers           │ Semantic Indicators          │
       │ • Hairline: rgba(255.. 0.08) │ • Success Green:  #10b981    │
       │ • Subtle:   rgba(255.. 0.14) │ • Warning Amber:  #f59e0b    │
       │ • Focus:    #8b5cf6          │ • Danger Crimson: #ef4444    │
       └──────────────────────────────┴──────────────────────────────┘
```

### Proposed Design Token Registry

```css
:root {
  /* ==========================================================================
     1. SURFACES & CANVASES (Cinematic Dark Architecture)
     ========================================================================== */
  --lw-bg-canvas-deep:      #08080a;  /* Deepest viewport backdrop */
  --lw-bg-canvas-base:      #0e0e14;  /* Standard page canvas */
  --lw-bg-surface-1:        #14141e;  /* Primary elevated card surface */
  --lw-bg-surface-2:        #1b1b28;  /* Secondary elevated component surface */
  --lw-bg-surface-glass:    rgba(20, 20, 30, 0.72); /* Frosted glass cards */
  --lw-bg-surface-glass-heavy: rgba(14, 14, 20, 0.88); /* Navigation & Modals */
  --lw-bg-terminal:         #0b0b10;  /* Code snippets & terminal canvas */

  /* ==========================================================================
     2. BORDERS & HAIRLINES
     ========================================================================== */
  --lw-border-hairline:     rgba(255, 255, 255, 0.07); /* Standard card separation */
  --lw-border-subtle:       rgba(255, 255, 255, 0.12); /* Interactive borders */
  --lw-border-highlight:    rgba(168, 85, 247, 0.35);  /* Violet card hover */
  --lw-border-focus:        #a855f7;                    /* Active input / focus */
  --lw-border-glass:        rgba(255, 255, 255, 0.15); /* Glass rim lighting */

  /* ==========================================================================
     3. TYPOGRAPHY COLORS
     ========================================================================== */
  --lw-text-primary:        #f8fafc;  /* Main headlines & values */
  --lw-text-secondary:      #cbd5e1;  /* Body narrative & descriptions */
  --lw-text-muted:          #64748b;  /* Captions, timestamps, disabled tags */
  --lw-text-link:           #c084fc;  /* Hyperlinks & interactive text */
  --lw-text-link-hover:     #e879f9;  /* Hyperlink hover */

  /* ==========================================================================
     4. BRAND & ACCENT COLOR SYSTEM
     ========================================================================== */
  --lw-accent-violet-500:   #8b5cf6;  /* Primary action violet */
  --lw-accent-violet-400:   #a855f7;  /* Hover / vibrant violet */
  --lw-accent-magenta-500:  #ec4899;  /* Contrast electric magenta */
  --lw-accent-plum-900:     #2e1065;  /* Deep purple surface / glow root */
  --lw-accent-glow:         rgba(168, 85, 247, 0.18); /* Ambient violet halo */
  --lw-accent-glow-strong:  rgba(236, 72, 153, 0.25); /* Focus / CTA halo */

  /* ==========================================================================
     5. SEMANTIC STATUS SYSTEM
     ========================================================================== */
  --lw-status-success:      #10b981;  /* Checkpoint passed / ready */
  --lw-status-success-bg:   rgba(16, 185, 129, 0.12);
  --lw-status-success-border: rgba(16, 185, 129, 0.3);

  --lw-status-warning:      #f59e0b;  /* Pending checkpoint / advisory */
  --lw-status-warning-bg:   rgba(245, 158, 11, 0.12);
  --lw-status-warning-border: rgba(245, 158, 11, 0.3);

  --lw-status-danger:       #ef4444;  /* Checkpoint failed / clinic required */
  --lw-status-danger-bg:    rgba(239, 68, 68, 0.12);
  --lw-status-danger-border: rgba(239, 68, 68, 0.3);

  --lw-status-info:         #38bdf8;  /* Technical notes / guidance */
  --lw-status-info-bg:      rgba(56, 189, 248, 0.12);
  --lw-status-info-border:  rgba(56, 189, 248, 0.3);

  /* ==========================================================================
     6. TYPOGRAPHY FAMILIES, SIZES & WEIGHTS
     ========================================================================== */
  --lw-font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --lw-font-display: 'Plus Jakarta Sans', 'Inter', system-ui, sans-serif;
  --lw-font-mono: 'JetBrains Mono', 'Fira Code', SFMono-Regular, Menlo, monospace;

  /* Font Sizes */
  --lw-text-xs:   0.75rem;    /* 12px */
  --lw-text-sm:   0.875rem;   /* 14px */
  --lw-text-base: 1.0rem;     /* 16px */
  --lw-text-lg:   1.125rem;   /* 18px */
  --lw-text-xl:   1.25rem;    /* 20px */
  --lw-text-2xl:  1.5rem;     /* 24px */
  --lw-text-3xl:  1.875rem;   /* 30px */
  --lw-text-4xl:  2.25rem;    /* 36px */
  --lw-text-5xl:  3.0rem;     /* 48px */
  --lw-text-6xl:  3.75rem;    /* 60px */
  --lw-text-hero: clamp(2.5rem, 5vw + 1rem, 4.5rem);

  /* Line Heights */
  --lw-leading-tight:   1.12;
  --lw-leading-snug:    1.28;
  --lw-leading-normal:  1.5;
  --lw-leading-relaxed: 1.7;

  /* Font Weights */
  --lw-font-normal:   400;
  --lw-font-medium:   500;
  --lw-font-semibold: 600;
  --lw-font-bold:     700;
  --lw-font-black:    800;

  /* ==========================================================================
     7. SPACING SCALE & BORDER RADIUS
     ========================================================================== */
  --lw-space-1:  0.25rem;  /* 4px */
  --lw-space-2:  0.5rem;   /* 8px */
  --lw-space-3:  0.75rem;  /* 12px */
  --lw-space-4:  1.0rem;   /* 16px */
  --lw-space-6:  1.5rem;   /* 24px */
  --lw-space-8:  2.0rem;   /* 32px */
  --lw-space-10: 2.5rem;   /* 40px */
  --lw-space-12: 3.0rem;   /* 48px */
  --lw-space-16: 4.0rem;   /* 64px */
  --lw-space-20: 5.0rem;   /* 80px */

  --lw-radius-sm:  6px;
  --lw-radius-md:  12px;
  --lw-radius-lg:  18px;
  --lw-radius-xl:  24px;
  --lw-radius-full: 9999px;

  /* ==========================================================================
     8. SHADOWS & LUMINOUS GLOW
     ========================================================================== */
  --lw-shadow-card:  0 10px 30px -10px rgba(0, 0, 0, 0.6);
  --lw-shadow-glow:  0 0 40px -8px var(--lw-accent-glow);
  --lw-shadow-modal: 0 25px 60px -15px rgba(0, 0, 0, 0.85);

  /* ==========================================================================
     9. MOTION & TIMING
     ========================================================================== */
  --lw-ease-out:     cubic-bezier(0.16, 1, 0.3, 1);   /* Smooth deceleration */
  --lw-ease-in-out:  cubic-bezier(0.65, 0, 0.35, 1);  /* Natural transition */
  --lw-duration-fast: 150ms;
  --lw-duration-base: 250ms;
  --lw-duration-slow: 400ms;
}
```

### Alignment with Existing CSS Variables
To eliminate regression risks, existing variable names in `assets/css/main.css` and `assets/css/components.css` are mapped directly to the new token system:
- `var(--bg-body)` $\rightarrow$ maps to `var(--lw-bg-canvas-base)`
- `var(--bg-surface)` $\rightarrow$ maps to `var(--lw-bg-surface-1)`
- `var(--border-subtle)` $\rightarrow$ maps to `var(--lw-border-hairline)`
- `var(--text-primary)` $\rightarrow$ maps to `var(--lw-text-primary)`
- `var(--text-secondary)` $\rightarrow$ maps to `var(--lw-text-secondary)`
- `var(--text-muted)` $\rightarrow$ maps to `var(--lw-text-muted)`
- `var(--color-primary)` $\rightarrow$ maps to `var(--lw-accent-violet-500)`

---

## 4. Component Migration Map

| Existing Component | New Visual Role | Action | Reason | Business Logic Risk |
|---|---|---|---|---|
| **Global: Header** | Sticky frosted studio navigation bar | **REFACTOR** | Needs sleek backdrop blur, integrated search trigger, and luminous active indicators. | **LOW:** Retain brand links, `toggleTheme`, `#btn-mobile-nav` ID, and route links. |
| **Global: CourseSwitcher** | Floating glass dropdown popover | **REFACTOR** | Upgrade dropdown styling to dark glass with badge pills. | **LOW:** Preserve status mappings (`Terbuka`, `Perlu Sandi`) and navigation handlers. |
| **Global: GlobalAnnouncementBanner** | Slender warning broadcast bar | **REFACTOR** | Replace solid blue bar with dark translucent warning banner. | **ZERO:** Purely consumes `sessionStorage` dismiss state and server config. |
| **Global: Toast** | Luminous corner alert container | **KEEP / REFACTOR** | Structure is clean; update container styling to frosted dark surface with semantic rim borders. | **ZERO:** Keep `showToast()` imperative API signature. |
| **Global: Skeleton** | Subtle shimmering dark pulse cards | **REFACTOR** | Update light grey skeleton pulse to obsidian shimmer gradient. | **ZERO:** Presentational loading fallback. |
| **Global: NotFound** | Cinematic 404 void page | **REFACTOR** | Refresh graphic representation and return button. | **ZERO:** Static route view. |
| **Global: RouteErrorBoundary** | High-contrast diagnostic rescue card | **REFACTOR** | Modernize error details box and retry CTA. | **ZERO:** Standard React error boundary. |
| **Home: HeroSection** | Cinematic studio billboard & manifesto | **REFACTOR** | Oversized typography, gradient headline, live platform badge, dual CTA. | **ZERO:** Presentational landing module. |
| **Home: WorkshopCatalog** | Bento workshop discovery grid | **REFACTOR** | Replace basic cards with bento tiles featuring hover glow and rich meta tags. | **LOW:** Must preserve course IDs (`ai`, `word`), filter query params (`?filter=all\|ai\|word`), and unlock buttons. |
| **Home: BentoValuePillars** | 3-column architectural pillar bento | **REFACTOR** | Modernize icon containers with subtle violet backdrops and refined typography. | **ZERO:** Static editorial content. |
| **Home: StandardsStrip** | GovTech trust & compliance strip | **REFACTOR** | Sleek monochromatic brand strip with Pergub and open source badges. | **ZERO:** Static branding. |
| **Home: HowItWorksSection** | 3-step learning flow bento deck | **REFACTOR** | Numbered sequence tiles with hairline connecting rails. | **ZERO:** Static educational content. |
| **Home: PlatformCapabilities** | Dark capability comparison matrix | **REFACTOR** | Modernize comparison columns with check/cross glyphs. | **ZERO:** Static content. |
| **Home: FaqSection** | Clean dark accordion deck | **REFACTOR** | Subtle hairline borders, smooth expansion transitions. | **ZERO:** Pure UI state (open/close). |
| **Home: ClosingCtaBanner** | Immersive closing conversion tile | **REFACTOR** | Deep plum gradient backdrop with prominent enrollment action. | **ZERO:** Static CTA. |
| **Home: ShowcaseFrame** | Interactive terminal preview frame | **REFACTOR** | Obsidian terminal shell with syntax-highlighted agent response mockup. | **ZERO:** Visual decorative asset. |
| **Course AI: PretrainingHero** | Command briefing hero with live status | **REFACTOR** | Dark header tile with participant metadata summary and time investment badge. | **ZERO:** Consumes passed props. |
| **Course AI: PretrainingTargetSection** | Flow diagram of end-state integration | **REFACTOR** | Visual node graph showing Telegram $\rightarrow$ 9Router $\rightarrow$ Hermes $\rightarrow$ Google Calendar. | **ZERO:** Static curriculum preview. |
| **Course AI: PretrainingGlossarySection** | 6-card architectural concepts grid | **REFACTOR** | Cards with subtle violet glow and accessible hover tooltips. | **ZERO:** Static terminology. |
| **Course AI: PretrainingSecuritySection** | Security rules callout | **REFACTOR** | Dark amber warning card emphasizing token safety and private bot limits. | **ZERO:** Static safety instructions. |
| **Course AI: PretrainingPrerequisitesSection**| Hardware/software prerequisite cards | **REFACTOR** | Compact checklist cards with verified requirement badges. | **LOW:** Preserve task checkboxes if bound. |
| **Course AI: PretrainingPowerShellSection** | PowerShell admin execution guide | **REFACTOR** | Elevated code terminal with one-click copy and admin elevation badge. | **ZERO:** Static commands. |
| **Course AI: PretrainingModulesSection** | Container for Modules 1–5 | **REFACTOR** | Clean vertical spacing container. | **ZERO:** Layout container. |
| **Course AI: PretrainingModuleCard** | Accordion module guide with copyable code| **REFACTOR** | Obsidian container with collapsible steps, copy buttons, and checklist items. | **HIGH (CAREFUL):** Must strictly preserve `data-task-id` attributes and `toggleChecklist` bindings. |
| **Course AI: PretrainingCheckpointsSection**| Checkpoint gate evaluation container | **REFACTOR** | Prominent verification cards with live validation pips. | **HIGH (CAREFUL):** Must preserve input IDs, regex validators, and `setCheckpoint` events. |
| **Course AI: CheckpointGateCard** | Verification gate card (Pass/Fail/Pending)| **REFACTOR** | High-visibility status states (crimson for failed, emerald for passed). | **HIGH (CAREFUL):** Must preserve `#card-checkpoint-*` and button triggers. |
| **Course AI: PretrainingReadinessSection** | Dynamic readiness banner (3 states) | **REFACTOR** | Prominent status badge tile (`SIAP WORKSHOP`, `PERLU KLINIK`, `MENUNGGU`). | **HIGH (CAREFUL):** Must reflect `readiness.status` from `usePretrainingState`. |
| **Course AI: PretrainingTroubleshootingSection**| Filterable issue diagnosis hub | **REFACTOR** | Category filter chips (`node`, `router`, `telegram`, `hermes`) and solution cards. | **LOW:** Preserve filter state and search strings. |
| **Course AI: PretrainingRedactionSection** | Secret token & PII scrubber sandbox | **REFACTOR** | Dual-pane terminal with realtime sensor badge and sanitized output copy. | **LOW:** Ensure `sanitizeLogText` regex utility is called without modification. |
| **Course AI: PretrainingReadinessReportSection**| WhatsApp / Telegram report generator | **REFACTOR** | Clean report preview container with copy buttons and auto-sanitization indicator. | **LOW:** Preserve `generateReportText` call and output formatting. |
| **Course AI: PretrainingSidebar** | Sticky progress rail & anchor drawer | **REFACTOR** | Desktop floating rail with module progress rings and mobile drawer. | **MEDIUM:** Ensure anchor link IDs match heading section IDs exactly. |
| **Course AI: ResetProgressModal** | Danger-zone confirmation dialog | **REFACTOR** | Frosted glass alert dialog with explicit cancel and reset buttons. | **LOW:** Preserve `resetState()` callback. |
| **Course AI: LiveClassContainer** | Hari-H in-class workshop orchestrator | **REFACTOR** | Real-time classroom layout with locked/unlocked state guards. | **MEDIUM:** Preserve `sessionStorage.getItem('live_class_unlocked')`. |
| **Course AI: LiveClassHero** | In-class session hero banner | **REFACTOR** | Dynamic lock icon, instructor status, and session timeline. | **ZERO:** Presentational header. |
| **Course AI: LiveClassStats** | Live class progress telemetry bar | **REFACTOR** | Shimmering multi-segment progress bar for Modules 6–11. | **LOW:** Wire to `calculateLiveReadiness()`. |
| **Course AI: LiveClassTargetSection** | Live integration architecture flow | **REFACTOR** | Visual step-by-step pipeline diagram. | **ZERO:** Static graphic. |
| **Course AI: LiveClassModulesSection** | Modules 6–11 hands-on exercises | **REFACTOR** | Dark terminal cards for Hermes agent setup and command tests. | **HIGH (CAREFUL):** Preserve checklist IDs `m6-*` through `m11-*`. |
| **Course AI: LiveClassCheckpointsSection** | In-class checkpoints 4 through 9 | **REFACTOR** | Verification cards for live bot responses and calendar booking. | **HIGH (CAREFUL):** Preserve checkpoint IDs `cp-4` through `cp-9`. |
| **Course Word: Course Hero** | GovTech accreditation hero banner | **REFACTOR** | Official dark banner with Pergub badge and passkey unlock status. | **LOW:** Preserve unlock button action. |
| **Course Word: Passkey Unlock** | Instructor / Developer passkey modal | **REFACTOR** | Glass passkey input dialog with error feedback. | **HIGH (CAREFUL):** Must verify against `verifyInstructorPasskeyFn`. |
| **Course Word: ChecklistIsland** | Hydration-safe client checklist island | **REFACTOR** | Modernize list appearance with custom dark check indicators and progress bar. | **HIGH (CAREFUL):** Preserve storage key `learnwith_word_checklist_state` and event `word:stateChange`. |
| **Course Word: Syllabus Presentation** | Bab I–IV curriculum overview cards | **REFACTOR** | Elevated cards detailing standards, section breaks, and mail merge directives. | **ZERO:** Static curriculum presentation. |
| **Course Word: Bab V Quiz (index.html)** | Interactive 20-question quiz engine | **D. CAREFUL — CONTROLLED FUNCTIONAL MIGRATION** | Migrate presentation/runtime from legacy DOM (`index.html` / `app.js`) to React 19 while preserving exact 20 questions, answer keys, 5 pts/question, and KKM 80. | **CRITICAL:** High regression risk. Must produce 100% equivalent quiz scoring, answer tracking, and explanations without altering business rules. |
| **Course Word: Rubric (index.html)** | 9-item verification & 6-item portfolio | **D. CAREFUL — CONTROLLED FUNCTIONAL MIGRATION** | Migrate Lampiran 3 and Lampiran 5 interactive checklist cards from legacy DOM to React 19. | **CRITICAL:** High regression risk. Must preserve rubric keys, portfolio score calculation (each item ~16.67 pts, total 100), and storage contracts. |
| **Course Word: Evaluation Summary** | 70% portfolio + 30% quiz grade calculation| **D. CAREFUL — CONTROLLED FUNCTIONAL MIGRATION** | Migrate composite graduation card from legacy DOM to React 19. | **CRITICAL:** High regression risk. Must strictly execute identical formula $(\text{Port} \times 0.7) + (\text{Quiz} \times 0.3)$ and predicates (A/B/C/D). |
| **Course Word: Certificate (index.html)** | Digital BPSDM certificate slip | **D. CAREFUL — CONTROLLED FUNCTIONAL MIGRATION** | Migrate digital certificate slip and verification card from legacy DOM to React 19. | **CRITICAL:** High regression risk. Must preserve exact certificate data binding (name, NIP, unit, score, grade), issuance behavior, print trigger, and export formatters. |
| **Admin: AdminLoginGate** | Dual-mode administrative authentication | **REFACTOR** | Minimal high-security login card: Passkey field + Google SSO button with loading states. | **HIGH (CAREFUL):** Must call `adminLoginFn` and handle OAuth hash callback. |
| **Admin: AdminShell** | Command center operational shell | **REFACTOR** | Sleek top bar with active session timer, 6 navigation tabs, and logout button. | **LOW:** Maintain tab switching state and session token propagation. |
| **Admin: DashboardKPIs** | Realtime cohort metric counters | **REFACTOR** | Monospaced numeric KPI tiles with trend pips and cohort distribution bars. | **ZERO:** Consumes `stats` object. |
| **Admin: ParticipantTable** | Searchable cohort data grid | **REFACTOR** | High-density dark data table with sticky header, status chips, and pagination controls. | **LOW:** Preserve participant filtering and sorting logic. |
| **Admin: ParticipantDetailModal** | Individual learner audit popup | **REFACTOR** | Detail drawer/modal inspecting checkpoints, completed tasks, and telemetry timestamps. | **ZERO:** Modal display. |
| **Admin: ExportControls** | CSV and JSON cohort download buttons | **REFACTOR** | Compact action buttons with loading indicators. | **ZERO:** Calls `exportCohortAsCsv` and `exportCohortAsJson`. |
| **Admin: Courses Management** | Course lifecycle table & status modal | **REFACTOR** | Visibility toggle cards (`Active`, `Hidden`, `Archived`, `Deleted`) with audit history. | **HIGH (CAREFUL):** Calls `adminUpdateCourseStatusFn` and broadcasts updates. |
| **Admin: Passkey Management** | Passkey rotation console & audit table | **REFACTOR** | Cards showing active SHA-256 hashes, attempt logs, and rotation modal dialog. | **HIGH (CAREFUL):** Calls `adminRotatePasskeyFn` and reads audit logs. |
| **Admin: Troubleshooting View** | Learner error triage board | **REFACTOR** | Incident feed with status filters (`open`, `investigating`, `resolved`) and resolution notes. | **LOW:** Calls `updateTroubleshootingLogStatusFn`. |
| **Admin: Platform Settings** | Workshop mode & banner editor | **REFACTOR** | Switcher for global mode (`pretraining` vs `live-class`) and broadcast banner form. | **HIGH (CAREFUL):** Calls `adminUpdateWorkshopModeFn` and `adminUpdateAnnouncementBannerFn`. |

---

## 5. Homepage Architecture & Section Blueprint

The new homepage serves as the flagship entrypoint. It establishes brand authority, introduces the learning philosophy, and guides users into the course catalog.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. CINEMATIC HERO & MANIFESTO                                               │
│    "LEARNWITH — Technical Learning Without Anxiety."                        │
│    Oversized typography | Live Cohort Badge | Dual Action CTA               │
├─────────────────────────────────────────────────────────────────────────────┤
│ 2. LIVE METRICS & CAPABILITIES STRIP                                        │
│    Active Learners | Completion Rate | Zero-Cloud Privacy | Windows Native  │
├─────────────────────────────────────────────────────────────────────────────┤
│ 3. EDITORIAL WORKSHOP CATALOG (BENTO GRID)                                  │
│    [Card 1: Agentic AI - 9Router]       [Card 2: Word ASN - Pergub 14/2020] │
│    Interactive Mode Tabs | Prereqs      Passkey Gate | 28 Tasks | KKM 80    │
├─────────────────────────────────────────────────────────────────────────────┤
│ 4. THE 3-PILLAR LEARNING METHODOLOGY (BENTO)                                │
│    [1. Isolated Local Runtime]  [2. Self-Healing Gates]  [3. GovTech Cert]  │
├─────────────────────────────────────────────────────────────────────────────┤
│ 5. STANDARDS & GOVTECH COMPLIANCE STRIP                                     │
│    Pergub DKI No. 14/2020 | BPSDM Standards | Local LLM Privacy Guard       │
├─────────────────────────────────────────────────────────────────────────────┤
│ 6. HOW IT WORKS (STEP-BY-STEP SEQUENCE)                                     │
│    Step 1: Self-Paced Prep  ──►  Step 2: Hands-on Lab  ──►  Step 3: Cert    │
├─────────────────────────────────────────────────────────────────────────────┤
│ 7. CURRICULUM FAQ ACCORDION                                                 │
│    Expandable answers for Windows requirements, admin rights, and passkeys  │
├─────────────────────────────────────────────────────────────────────────────┤
│ 8. IMMERSIVE CLOSING CONVERSION BANNER                                      │
│    Deep plum gradient tile | Immediate Workshop Launch CTA                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Section-by-Section Specifications

#### Section 1: Cinematic Hero & Manifesto
- **Purpose:** Make an unforgettable first impression. Communicate clarity, technical depth, and calmness.
- **Content Source:** [app/components/home/HeroSection.tsx](file:///c:/Users/X1%20Carbon/Downloads/Projects/self-hosted-ai-starter-kit/Dev/learnwith/app/components/home/HeroSection.tsx)
- **Component:** `HeroSection` (Refactored)
- **Layout & Composition:**
  - **Desktop:** Asymmetric split. Left (7 cols): Eyebrow badge with glowing pip (`Workshop Mandiri & Kelas Tatap Muka`), giant display title (`Pusat Modul Praktik & Ruang Belajar Terpadu`), narrative subhead, dual primary/outline CTA buttons (`Jelajahi Modul Workshop`, `Lihat Standar Teknis`). Right (5 cols): `ShowcaseFrame` rendering an illuminated obsidian terminal preview of an active agent interaction.
  - **Mobile:** Single column stack. Headline font auto-scales with clamp; terminal preview condenses below CTAs.
- **CTA:** Smooth-scroll to `#workshop-catalog` or direct link to `/course/ai`.
- **Motion:** Subtle fade-up on page load (duration: 350ms, ease-out).

#### Section 2: Live Platform Metrics Strip
- **Purpose:** Provide immediate social proof and operational credibility.
- **Content Source:** [app/data/courses.ts](file:///c:/Users/X1%20Carbon/Downloads/Projects/self-hosted-ai-starter-kit/Dev/learnwith/app/data/courses.ts) streaming statistics.
- **Component:** `StandardsStrip` (Refactored)
- **Layout & Composition:**
  - Full-width dark hairline container with 4 distributed stat pillars:
    1. `👥 470+ ASN & Profesional Terakreditasi`
    2. `🎯 91% Rata-rata Kelulusan Uji Kompetensi`
    3. `🛡️ 100% Data Aman & Tersensor Lokal`
    4. `⏱️ 0-Config Setup Wizard`
  - Separated by vertical 1px hairline dividers on desktop.

#### Section 3: Editorial Workshop Catalog (Bento Grid)
- **Purpose:** The core discovery engine. Showcases Course 1 and Course 2 side-by-side with full curriculum depth.
- **Content Source:** [app/components/home/WorkshopCatalog.tsx](file:///c:/Users/X1%20Carbon/Downloads/Projects/self-hosted-ai-starter-kit/Dev/learnwith/app/components/home/WorkshopCatalog.tsx), `courses` loader data.
- **Component:** `WorkshopCatalog` (Refactored)
- **Layout & Composition:**
  - Section header with category filter pill tabs (`Semua Workshop`, `Agentic AI`, `Otomasi Naskah ASN`).
  - 2-column bento grid featuring elevated cards:
    - **Card 1 (Agentic AI):** Violet rim accent, title, subtitle, duration pill (`5 Modul Pra-Training • 6 Modul Hari-H`), prerequisites (`Node.js 18+`, `Telegram Bot`), launch CTA (`Masuk Ruang Pra-Training 🚀`).
    - **Card 2 (Pengolahan Kata ASN):** Magenta rim accent, title, subtitle, GovTech badge (`Pergub DKI No. 14/2020`), modules pill (`5 Bab • 28 Tugas • KKM 80`), passkey status indicator (`🔒 Akses Terproteksi Instruktur`), launch CTA (`Buka Modul Naskah 📝`).
  - Mobile: Full-width stacked cards with touch-friendly button targets.

#### Section 4: The 3-Pillar Learning Methodology
- **Purpose:** Explain why Learnwith achieves superior outcomes compared to standard slide-based training.
- **Content Source:** [app/components/home/BentoValuePillars.tsx](file:///c:/Users/X1%20Carbon/Downloads/Projects/self-hosted-ai-starter-kit/Dev/learnwith/app/components/home/BentoValuePillars.tsx)
- **Component:** `BentoValuePillars` (Refactored)
- **Layout & Composition:**
  - 3-column bento box:
    1. **Isolasi Lingkungan Mandiri:** Zero-cloud dependency, local execution, data privacy.
    2. **Gerbang Verifikasi Mandiri (Self-Healing):** Automatic diagnostics and technical clinics before live classes.
    3. **Standarisasi & Sertifikasi Resmi:** Compliance with government standards and verifiable digital slips.

#### Section 5: GovTech Standards & Compliance
- **Purpose:** Reassure institutional stakeholders regarding legal and security standards.
- **Content Source:** [app/components/home/PlatformCapabilities.tsx](file:///c:/Users/X1%20Carbon/Downloads/Projects/self-hosted-ai-starter-kit/Dev/learnwith/app/components/home/PlatformCapabilities.tsx)
- **Component:** `PlatformCapabilities` (Refactored)
- **Layout:** High-contrast 2-column comparison card contrasting Learnwith practical workshops against legacy theoretical courses.

#### Section 6: How It Works (Step-by-Step Flow)
- **Purpose:** Outline the clear path from registration to official accreditation.
- **Content Source:** [app/components/home/HowItWorksSection.tsx](file:///c:/Users/X1%20Carbon/Downloads/Projects/self-hosted-ai-starter-kit/Dev/learnwith/app/components/home/HowItWorksSection.tsx)
- **Component:** `HowItWorksSection` (Refactored)
- **Layout:** Linear sequence deck: `01. Persiapan Mandiri` $\rightarrow$ `02. Sesi Interaktif Kelas` $\rightarrow$ `03. Evaluasi & Sertifikat`.

#### Section 7: Curriculum FAQ Accordion
- **Purpose:** Resolve technical pre-flight anxiety before learners launch their workshop.
- **Content Source:** [app/components/home/FaqSection.tsx](file:///c:/Users/X1%20Carbon/Downloads/Projects/self-hosted-ai-starter-kit/Dev/learnwith/app/components/home/FaqSection.tsx)
- **Component:** `FaqSection` (Refactored)
- **Layout:** Centered single-column accordion with hairline borders and smooth animated chevron transitions.

#### Section 8: Immersive Closing CTA Banner
- **Purpose:** Final conversion driver for learners reaching the page footer.
- **Content Source:** [app/components/home/ClosingCtaBanner.tsx](file:///c:/Users/X1%20Carbon/Downloads/Projects/self-hosted-ai-starter-kit/Dev/learnwith/app/components/home/ClosingCtaBanner.tsx)
- **Component:** `ClosingCtaBanner` (Refactored)
- **Layout:** Deep plum gradient card (`linear-gradient(135deg, #1f0b38 0%, #0e0e14 100%)`), bold headline, launch workshop button.

---

## 6. Course 1 (AI) Experience Specification

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. FIXED TOP CONTEXT BAR: Readiness Status Banner & Progress Pill           │
│    Progress: [████████████████░░░░] 74% | Status: ⏳ MENUNGGU VERIFIKASI    │
├──────────────────────────────┬──────────────────────────────────────────────┤
│ 2. STICKY LEFT PROGRESS RAIL │ 3. INSTRUCTIONAL WORKSPACE CANVAS            │
│    • Mode Tabs (Pra / Live)  │    • Briefing Hero & Target Criteria Flow    │
│    • Modul 1 (Node.js)       │    • Architectural Glossary (6 Terms)        │
│    • Modul 2 (9Router)       │    • Security Rules & PowerShell Setup       │
│    • Modul 3 (Telegram)      │    • Interactive Module Cards 1–5            │
│    • Modul 4 (Google Cloud)  │    • Checkpoint 1: Node & npm PATH           │
│    • Modul 5 (Audit Kesiapan)│    • Checkpoint 2: 9Router Port 20128        │
│    ───────────────────────   │    • Checkpoint 3: Telegram Bot & ID         │
│    • Checkpoint Gates (1-3)  │    • Troubleshooting Diagnosis Engine        │
│    • Quick Tools (Redaction) │    • Secret Redaction Sandbox                │
│    • Export Laporan Kesiapan │    • WhatsApp / Telegram Report Generator    │
└──────────────────────────────┴──────────────────────────────────────────────┘
```

### Addressing the 5 Core Pedagogical Questions

| Question | Interface Solution in New Design |
|---|---|
| **1. Where am I?** | Top sticky navigation rail displays the active module with violet glow indicator; section headings include clear chapter tags (`Modul 02 / 05`). |
| **2. What have I completed?** | Checked items render with a vibrant emerald checkmark, strike-through task label, and progress counter increment. Completed checkpoints display a green shield badge. |
| **3. What should I do next?** | The next uncompleted task is visually emphasized with a subtle hairline highlight border; sidebar displays a pulsing indicator on the next pending gate. |
| **4. Am I ready?** | The global readiness banner calculates status in real-time. Reaching $\ge 80\%$ progress and passing all 3 checkpoints triggers the luminous `🎉 SIAP MENGIKUTI WORKSHOP` banner. |
| **5. What happens if I fail?** | If any checkpoint is marked failed, the banner immediately shifts to amber/crimson `⚠️ PERLU TECHNICAL CLINIC` with a direct one-click link to the troubleshooting diagnosis hub. |

### Component Design Details
1. **Module Instruction Cards (`PretrainingModuleCard`):**
   - Obsidian container (`--lw-bg-surface-1`) with a 1px hairline border.
   - Header with module number badge (`M01`), estimated duration (`⏱️ 20 Menit`), and expand/collapse chevron.
   - Code blocks with JetBrains Mono font, dark canvas (`#0b0b10`), syntax rim border, and a 1-click copy button providing immediate toast feedback (`showToast`).
   - Action checklist items: Custom-styled native checkboxes with touch-friendly hitboxes ($44 \times 44\text{px}$).
2. **Checkpoint Verification Gates (`CheckpointGateCard`):**
   - High-contrast card with pass/fail toggle buttons.
   - Live validation feedback for Checkpoint 3: Telegram username regex `/(bot|_bot)$/i` and numeric user ID regex `/^\d+$/`.
3. **Secret Token Redaction Sandbox (`PretrainingRedactionSection`):**
   - Dual-pane layout: Raw log input on left/top, sanitized output on right/bottom.
   - Live badge indicating number of scrubbed secrets (`Shield: 3 tokens sanitized`).
   - One-click copy for sanitized log output.

---

## 7. Course 2 (Word) Experience Specification

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. COURSE HERO & PASSKEY AUTHORIZATION                                      │
│    Standardisasi Dokumen Kedinasan ASN Sesuai Pergub DKI No. 14/2020        │
│    Status: [ 🔒 Akses Terkunci (Passkey) ] -> [ ✅ Akses Materi Terbuka ]   │
├─────────────────────────────────────────────────────────────────────────────┤
│ 2. STREAMING ACCREDITATION STATS BANNER                                     │
│    👥 142 Alumni ASN Terakreditasi  │  🎯 88% Tingkat Kelulusan Pergub 14   │
├─────────────────────────────────────────────────────────────────────────────┤
│ 3. BAB I–IV CURRICULUM SYLLABUS & CHECKLIST ISLAND                          │
│    • Bab I: Standar Naskah Dinas (Margin 4-3-3-3, Font Resmi)               │
│    • Bab II: Heading Styles 1-3, Multilevel List, TOC Otomatis              │
│    • Bab III: Section Breaks (Next Page), Unlink Header, Romawi/Arab, .dotx │
│    • Bab IV: Mail Merge (Excel), Next Record Rules, Track Changes           │
│    ───────────────────────────────────────────────────────────────────────  │
│    • Hydration-Safe Checklist Island (28 Praktik Mandiri)                   │
├─────────────────────────────────────────────────────────────────────────────┤
│ 4. BAB V.B: 20-QUESTION KNOWLEDGE QUIZ ENGINE                               │
│    • Live Score Banner (0/100) — Ambang Batas KKM: 80                       │
│    • 20 Interactive Question Cards with Option Buttons A, B, C, D           │
│    • Official BPSDM Explanations on Answer Selection                        │
├─────────────────────────────────────────────────────────────────────────────┤
│ 5. BAB V.C: PORTFOLIO RUBRIC & 70/30 GRADUATION EVALUATION                  │
│    • Lampiran 3: 9 Butir Verifikasi Checklist                               │
│    • Lampiran 5: 6 Butir Portofolio Praktik                                 │
│    • Formula: (Nilai Portofolio × 70%) + (Nilai Kuis × 30%)                 │
│    • Predikat Kelulusan: Sangat Memuaskan (A) / Memuaskan (B) / Cukup / D   │
├─────────────────────────────────────────────────────────────────────────────┤
│ 6. OFFICIAL BPSDM DIGITAL CERTIFICATE SLIP                                  │
│    Digital Credential Slip: Nama, NIP, Unit Kerja, Nilai Akhir, Predikat   │
│    Actions: [ 🖨️ Cetak Bukti Kelulusan ] [ 📋 Salin Ringkasan WA / TG ]     │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Controlled Functional Migration & Evaluation Invariants (D. CAREFUL)

The migration of Course 2 Bab V (Quiz, Rubric, Graduation Summary, and Certificate Slip) from the legacy DOM implementation (`index.html` and `assets/js/app.js`) into React 19 components is explicitly classified as **D. CAREFUL — CONTROLLED FUNCTIONAL MIGRATION**. 

This is **NOT** a presentation-only change. The quiz evaluation, portfolio checklist, reflection inputs, graduation scoring math, and digital certificate generation are tightly coupled to runtime state and evaluation contracts. The primary goal is to **preserve existing behavior with 100% equivalence** while modernizing the presentation architecture into modular, idiomatic React components.

#### Mandatory Behaviorally Identical Elements
The following 15 elements MUST remain mathematically, logically, and behaviorally identical:
1. **20 Quiz Questions:** Exact wording, ordering, and options (A, B, C, D) defined in `WORD_QUIZ_QUESTIONS`.
2. **Answer Keys:** Unaltered answer verification mapping for all 20 questions.
3. **Point Value:** Exactly 5 points awarded per correct answer ($20 \times 5 = 100\text{ maximum points}$).
4. **Minimum Competency Criterion (KKM):** Exactly **80 points** ($\ge 16\text{ correct answers}$ required to pass).
5. **Quiz Pass/Fail Behavior:** `state.quiz.passed = (score >= 80)` state transition and banner display.
6. **Portfolio Rubric Items:** 9 Lampiran 3 verification items + 6 Lampiran 5 portfolio artifact items.
7. **Checkpoint Requirements:** Prerequisite passing of all 3 checkpoints (`word-cp-1`, `word-cp-2`, `word-cp-3`).
8. **70% Portfolio Weighting:** Portfolio score contributes precisely 70% toward the final grade.
9. **30% Quiz Weighting:** Knowledge quiz score contributes precisely 30% toward the final grade.
10. **Final Score Calculation:** Exact formula execution:
    $$\text{Final Score} = \text{Math.round}((\text{Portfolio Score} \times 0.70) + (\text{Quiz Score} \times 0.30))$$
11. **Graduation Predicates:**
    - $\ge 90$: *Sangat Memuaskan (A)*
    - $80 - 89$: *Memuaskan (B)*
    - $75 - 79$: *Cukup (C)*
    - $< 75$ or any failed checkpoint: *Perlu Remediasi (D)*
12. **Certificate Data Content:** Participant Name, NIP, Unit Kerja, Target Dokumen, Nilai Akhir, Predikat Kelulusan, and issuance date.
13. **Certificate Issuance Behavior:** Unlocked only upon achieving competency status (`lulus` or `lulus_cukup`); remediation guidance shown if score is below threshold or checkpoints are pending/failed.
14. **Participant Information:** Real-time synchronization of `participantInfo` fields across report and certificate views.
15. **Storage & Test Contracts:** Unbroken persistence in `localStorage` namespace `learnwith_word_state_v1` and retention of all existing DOM IDs and test selectors (`#sec-word-quiz`, `.quiz-card`, `.quiz-option-btn`, `#word-quiz-score-banner`, `#bpsdm-certificate-card`, `#btn-print-word-report`).

#### Explicit Validation Requirements for Course 2 Bab V Migration
Before, during, and after migrating Bab V into React 19, the implementation must adhere to these 7 quality gates:
1. **Understand Existing Legacy Behavior:** The exact DOM event handling and state mutation mechanisms in `assets/js/app.js` and `assets/js/state.js` must be fully documented and referenced prior to writing React equivalents.
2. **Equivalent Output Production:** The React 19 implementation must produce 100% equivalent DOM structures, state representations, and visual feedback states.
3. **Automated Test Continuity:** All existing automated test suites (`tests/word-quiz-report.test.js`, `tests/word-modules.test.js`, `tests/checkpoint-engine.test.js`) must continue to pass without test modification.
4. **Boundary Case Testing:** Specific test scenarios must be verified:
   - Score = 79 (Must result in *Perlu Remediasi (D)* if KKM 80 not met).
   - Score = 80 with all CPs passed (Must result in *Memuaskan (B)*).
   - Score = 100 with one CP marked failed (Must trigger remediation regardless of quiz score).
   - Partial portfolio completion (e.g., 3/6 items = 50% portfolio).
5. **Before/After Score Comparison:** Numerical score calculation outputs must be compared directly against legacy test snapshots to guarantee identical rounding and weighted contributions.
6. **Certificate Output Data Verification:** Generated certificate slip values, print formatting, and clipboard copy outputs (WhatsApp / Telegram formats) must match legacy text templates character-for-character.
7. **Zero Rule Redesign:** Under no circumstances may any grading rule, rubric weighting, KKM score, or predicate threshold be altered as part of the visual redesign.

---

## 8. Admin Experience Specification

The Admin Command Center (`/admin`) is an **operational control room**, not a consumer landing page.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ MASTER ADMIN COMMAND CENTER                      [ Sesi Aktif: 01:42 ] [ Keluar ]│
├─────────────────────────────────────────────────────────────────────────────┤
│ [Dashboard] [Peserta & Telemetri] [Kursus] [Passkeys] [Kendala] [Pengaturan]│
├─────────────────────────────────────────────────────────────────────────────┤
│ KPI METRICS ROW                                                             │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐ │
│ │ 328 Peserta  │ │ 241 Siap     │ │ 34 Butuh     │ │ 84% Rata-rata        │ │
│ │ Total Cohort │ │ Workshop     │ │ Klinik       │ │ Progres Cohort       │ │
│ └──────────────┘ └──────────────┘ └──────────────┘ └──────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────┤
│ FILTER TOOLBAR & EXPORT CONTROLS                                            │
│ [ Cari Peserta... ] [ Status: Semua ▾ ] [ Kursus: Semua ▾ ] [ CSV ] [ JSON ]│
├─────────────────────────────────────────────────────────────────────────────┤
│ PARTICIPANT COHORT DATA TABLE                                               │
│ Nama Peserta    │ Instansi    │ Kursus │ Progres  │ CP1 │ CP2 │ CP3 │ Aksi  │
│ ────────────────┼─────────────┼────────┼──────────┼─────┼─────┼─────┼────── │
│ Budi Pratama    │ Diskominfotik│ AI     │ 100% [█] │  ✓  │  ✓  │  ✓  │ Detail│
│ Siti Aminah     │ BPSDM DKI   │ Word   │  82% [█] │  ✓  │  ✓  │  ✓  │ Detail│
│ Hendra Wijaya   │ Bappeda     │ AI     │  45% [░] │  ✓  │  ✕  │  -  │ Detail│
└─────────────────────────────────────────────────────────────────────────────┘
```

### Operational Design Principles
- **Dense Typography:** Compact table row heights ($48\text{px}$ desktop) with crisp tabular numbers (`font-variant-numeric: tabular-nums`).
- **Status Visibility:** Instant visual scanning via color-coded chips (Green: `Ready`, Amber: `Pending`, Red: `Clinic`).
- **No Promotional Fluff:** Clean, high-contrast surfaces without decorative gradients or distracting hover animations.

---

## 9. Responsive Behavior & Structural Adaptations

Rather than simply stacking elements, Learnwith layouts adapt structurally across three standard breakpoints:

```
Desktop (≥ 1280px)           Tablet (768px – 1279px)         Mobile (< 768px)
┌──────────────┬───────────┐ ┌───────────────────────────┐   ┌───────────────────────────┐
│ Sidebar Rail │ Workspace │ │ Condensed Top Tab Bar     │   │ Collapsible Drawer Menu   │
│ (280px)      │ (Fluid)   │ ├───────────────────────────┤   ├───────────────────────────┤
│              │           │ │ 2-Column Responsive Bento │   │ Single-Column Stack       │
│              │           │ │ Table: Horizontal Scroll  │   │ Table: Card List View     │
└──────────────┴───────────┘ └───────────────────────────┘   └───────────────────────────┘
```

### Breakpoint Matrix

| Viewport | Breakpoint | Header & Navigation | Course Workspace Layout | Data Tables & Grids |
|---|---|---|---|---|
| **Desktop** | $\ge 1280\text{px}$ | Full top bar, sticky search, course switcher dropdown. | Fixed $280\text{px}$ left progress rail + fluid central instructional canvas. | 12-column bento grids; full tabular data grids with all metadata columns. |
| **Tablet** | $768\text{px} - 1279\text{px}$ | Compact brand icon, icon-only action triggers. | Rail collapses to an interactive horizontal progress bar below the header. | Bento compresses to 2 columns; tables retain horizontal scroll with sticky name columns. |
| **Mobile** | $< 768\text{px}$ | Hamburger trigger, slide-over drawer backdrop, touch-first switcher. | Full-width single-column layout; rail accessible via floating progress trigger button. | Tables transform into stacked participant cards; quiz option buttons become full-width vertical stacks. |

---

## 10. Motion Language & Micro-Interactions

Motion must be **restrained, precise, and utilitarian**. It should confirm user action without causing distraction or motion sickness.

### Principles
- **Page Transitions:** Crisp opacity fade (`0ms` to `200ms`, `var(--lw-ease-out)`). Zero horizontal sliding between full routes.
- **Card Hovers:** Elevation shift: `transform: translateY(-2px)`, border illumination from `--lw-border-hairline` to `--lw-border-highlight` (`150ms`).
- **Accordion Expansions:** Height transition using `grid-template-rows: 0fr` to `1fr` (`200ms`, ease-out).
- **Checklist Completions:** Checkmark icon scales from $0.8$ to $1.0$ with simultaneous text-decoration strike fade.
- **Copy Code Feedback:** Button icon switches from clipboard to checkmark with a brief green rim pulse for 2 seconds.
- **Accessibility Invariant:** All motion MUST respect `@media (prefers-reduced-motion: reduce)`:
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
  ```

---

## 11. Image & Media Strategy

Imagery in Learnwith is functional and illustrative of software architecture, never purely stock photography:

| Image Asset Concept | Aspect Ratio | Approximate Composition | Subject / Content | Role |
|---|---|---|---|---|
| **`hero_terminal_mockup`** | 16:10 | Slanted 2.5D perspective obsidian terminal with purple glow rim. | Output of `hermes status` and active Telegram gateway ping. | Hero narrative illustration. |
| **`arch_diagram_flow`** | 21:9 | Linear horizontal node sequence with illuminated bus lines. | Architecture: Windows CLI $\rightarrow$ 9Router $\rightarrow$ Telegram $\rightarrow$ Google Calendar. | Pedagogical mental model. |
| **`course_card_ai`** | 16:9 | High-contrast dark graphic tile with neon bot wireframe. | Agentic AI course identity. | Course catalog thumbnail. |
| **`course_card_word`** | 16:9 | Clean document blueprint graphic with structured heading lines. | Advanced Word course identity. | Course catalog thumbnail. |
| **`certificate_bpsdm_emblem`**| 1:1 | Monochrome metallic seal vector with DKI Jakarta star emblem. | Official accreditation seal for graduation certificate. | Verifiable credential seal. |

---

## 12. Accessibility & Usability (WCAG 2.1 AA)

1. **Color Contrast:** All body text (`#cbd5e1` on `#0e0e14`) achieves a contrast ratio of $\ge 9.2:1$ (exceeding WCAG AAA). Primary headings (`#f8fafc`) achieve $14:1$.
2. **Keyboard Focus Ring:** Every interactive element has an explicit outline:
   ```css
   :focus-visible {
     outline: 2px solid var(--lw-border-focus);
     outline-offset: 2px;
   }
   ```
3. **Form Accessibility:** All inputs (`#input-node-version`, `#input-tg-username`) feature persistent `<label>` tags with matching `htmlFor` attributes.
4. **Touch Targets:** All buttons, checkboxes, and interactive tabs maintain a minimum hit area of $44 \times 44\text{px}$.

---

## 13. Regression Safety Rules & Invariants

To guarantee that zero business logic, testing suites, or security boundaries are compromised during the UI migration, the following rules are strictly enforced:

```
                           ╔═══════════════════════════════════════╗
                           ║     STRICT INVARIANT REQUIREMENTS     ║
                           ╠═══════════════════════════════════════╣
                           ║ 1. PRESERVE ALL ROUTE PATHS & PARAMS  ║
                           ║ 2. PRESERVE ALL LOCALSTORAGE KEYS    ║
                           ║ 3. PRESERVE ALL TEST SELECTORS & IDS  ║
                           ║ 4. PRESERVE SERVER-FN SECURITY BOUNDS ║
                           ║ 5. PRESERVE EXACT 70/30 GRADING MATH  ║
                           ╚═══════════════════════════════════════╝
```

### Exact Technical Invariants
1. **Routes & Search Params:**
   - `/` with `?filter=all|ai|word`
   - `/course/ai` with `?mode=pretraining|live-class`
   - `/course/word`
   - `/admin`
2. **Storage Namespaces:**
   - `learnwith_ai_state_v1`, `learnwith_ai_checklist`, `pretraining_app_state_v1`
   - `learnwith_word_state_v1`, `learnwith_word_checklist_state`, `learnwith_word_unlocked`
   - `learnwith_client_id`, `learnwith_theme`, `learnwith_admin_token`
   - `learnwith_admin_session` (Cookie)
3. **DOM Selectors Required by Automated Tests (`tests/*.test.js`):**
   - AI Checklist tasks: `[data-task-id="m1-check-node"]`, etc.
   - Checkpoint Cards: `#card-checkpoint-1`, `#card-checkpoint-2`, `#card-checkpoint-3`
   - Checkpoint Action Buttons: `.btn-cp-action[data-status="passed"]`, `.btn-cp-action[data-status="failed"]`
   - Input Fields: `#input-node-version`, `#input-tg-username`, `#input-tg-userid`
   - Word Elements: `#container-course-word`, `#sec-word-quiz`, `.quiz-card`, `.quiz-option-btn`, `#word-quiz-score-banner`, `#bpsdm-certificate-card`
   - Admin Elements: `#admin-shell-container`, `#btn-admin-logout`, `#tab-admin-dashboard`, `#tab-admin-telemetry`
4. **Graduation Formula:**
   $$\text{Nilai Akhir} = (\text{Nilai Portofolio} \times 0.70) + (\text{Nilai Kuis} \times 0.30)$$
   Ambang Batas KKM: **80**.

---

## 14. Migration Boundary Classification

### List A — Safe UI Changes (Presentation Only)
- CSS variables and color scheme replacement.
- Layout wrappers, containers, and bento grid arrangements.
- Typography classes, font size scaling, letter spacing.
- Button styling, border radius, shadows, and subtle violet glows.
- Card padding, micro-interaction transitions, and hover elevation.
- Visual icon assets and SVG illustrations.

### List B — Changes Requiring Controlled Refactor & Functional Migration (D. CAREFUL)
*Components and views where presentation is tightly coupled to client state, client storage, RPC calls, or evaluation engines:*

1. **Course 2 Bab V Migration (Quiz, Rubric, Evaluation Summary, Certificate) — CONTROLLED FUNCTIONAL MIGRATION:**
   - **Target Files:** New React 19 components in `app/components/course/word/` replacing legacy DOM blocks from `index.html` lines 6530–7480 and interaction wireup in `assets/js/app.js`.
   - **Rationale:** This work is **NOT** presentation-only. The quiz choices, explanations, Lampiran 3 & 5 rubric checkboxes, 70/30 composite score calculation, KKM 80 check, graduation predicates, and digital certificate generation are fundamentally coupled to application logic, `localStorage` contracts (`learnwith_word_state_v1`), and automated test suites (`tests/word-quiz-report.test.js`, `tests/word-modules.test.js`).
   - **Migration Mandate:** 100% behavioral equivalence, zero grading rule changes, identical test selectors, and full passing of all 7 validation requirements.

2. **Course 1 Client State & Checkpoint Coupled Components:**
   - **[app/routes/course.ai.tsx](file:///c:/Users/X1%20Carbon/Downloads/Projects/self-hosted-ai-starter-kit/Dev/learnwith/app/routes/course.ai.tsx):** Handles mode changes (`pretraining` vs `live-class`) and in-flight lifecycle restriction banners.
   - **[app/components/course/pretraining/PretrainingModuleCard.tsx](file:///c:/Users/X1%20Carbon/Downloads/Projects/self-hosted-ai-starter-kit/Dev/learnwith/app/components/course/pretraining/PretrainingModuleCard.tsx):** Accordion steps tightly coupled to `toggleChecklist` and `data-task-id` attributes.
   - **[app/components/course/pretraining/PretrainingCheckpointsSection.tsx](file:///c:/Users/X1%20Carbon/Downloads/Projects/self-hosted-ai-starter-kit/Dev/learnwith/app/components/course/pretraining/PretrainingCheckpointsSection.tsx):** Form inputs bound to `setParticipantInfo` and regex validators.
   - **[app/components/course/pretraining/CheckpointGateCard.tsx](file:///c:/Users/X1%20Carbon/Downloads/Projects/self-hosted-ai-starter-kit/Dev/learnwith/app/components/course/pretraining/CheckpointGateCard.tsx):** Pass/Fail status toggles tied to `setCheckpoint` callback.
   - **[app/components/course/pretraining/PretrainingReadinessSection.tsx](file:///c:/Users/X1%20Carbon/Downloads/Projects/self-hosted-ai-starter-kit/Dev/learnwith/app/components/course/pretraining/PretrainingReadinessSection.tsx):** Reactive status banner derived from `usePretrainingState`.
   - **[app/components/course/pretraining/PretrainingRedactionSection.tsx](file:///c:/Users/X1%20Carbon/Downloads/Projects/self-hosted-ai-starter-kit/Dev/learnwith/app/components/course/pretraining/PretrainingRedactionSection.tsx):** Bound to `sanitizeLogText` regex and clipboard copy.
   - **[app/components/course/pretraining/PretrainingReadinessReportSection.tsx](file:///c:/Users/X1%20Carbon/Downloads/Projects/self-hosted-ai-starter-kit/Dev/learnwith/app/components/course/pretraining/PretrainingReadinessReportSection.tsx):** Formats report output with auto-sanitization indicator.
   - **[app/components/course/liveclass/LiveClassModulesSection.tsx](file:///c:/Users/X1%20Carbon/Downloads/Projects/self-hosted-ai-starter-kit/Dev/learnwith/app/components/course/liveclass/LiveClassModulesSection.tsx) & [LiveClassCheckpointsSection.tsx](file:///c:/Users/X1%20Carbon/Downloads/Projects/self-hosted-ai-starter-kit/Dev/learnwith/app/components/course/liveclass/LiveClassCheckpointsSection.tsx):** In-class exercise steps and verification checkpoints 4–9.

3. **Course 2 Storage & Telemetry Coupled Components:**
   - **[app/routes/course.word.tsx](file:///c:/Users/X1%20Carbon/Downloads/Projects/self-hosted-ai-starter-kit/Dev/learnwith/app/routes/course.word.tsx):** Syncs Word telemetry via `localStorage` and `word:stateChange` window events.
   - **[app/components/course/ChecklistIsland.tsx](file:///c:/Users/X1%20Carbon/Downloads/Projects/self-hosted-ai-starter-kit/Dev/learnwith/app/components/course/ChecklistIsland.tsx):** Hydration-safe client-only checklist updater writing to `learnwith_word_checklist_state`.
   - **[app/components/course/InstructorUnlockModal.tsx](file:///c:/Users/X1%20Carbon/Downloads/Projects/self-hosted-ai-starter-kit/Dev/learnwith/app/components/course/InstructorUnlockModal.tsx):** Submits passkey to server RPC `verifyInstructorPasskeyFn` and writes `sessionStorage`.

4. **Admin Authentication & Operational Mutation Views:**
   - **[app/components/admin/AdminLoginGate.tsx](file:///c:/Users/X1%20Carbon/Downloads/Projects/self-hosted-ai-starter-kit/Dev/learnwith/app/components/admin/AdminLoginGate.tsx):** Dispatches login credentials to `adminLoginFn` and coordinates Google SSO callback.
   - **[app/routes/admin.tsx](file:///c:/Users/X1%20Carbon/Downloads/Projects/self-hosted-ai-starter-kit/Dev/learnwith/app/routes/admin.tsx):** Reads `#access_token` and `#id_token` from URL hash and manages admin session rehydration.
   - **[app/components/admin/courses/AdminCourseManagementView.tsx](file:///c:/Users/X1%20Carbon/Downloads/Projects/self-hosted-ai-starter-kit/Dev/learnwith/app/components/admin/courses/AdminCourseManagementView.tsx):** Triggers `adminUpdateCourseStatusFn` mutations and BroadcastChannel notifications.
   - **[app/components/admin/passkeys/AdminPasskeyView.tsx](file:///c:/Users/X1%20Carbon/Downloads/Projects/self-hosted-ai-starter-kit/Dev/learnwith/app/components/admin/passkeys/AdminPasskeyView.tsx):** Triggers `adminRotatePasskeyFn` mutations.
   - **[app/components/admin/settings/AdminSettingsView.tsx](file:///c:/Users/X1%20Carbon/Downloads/Projects/self-hosted-ai-starter-kit/Dev/learnwith/app/components/admin/settings/AdminSettingsView.tsx):** Triggers `adminUpdateWorkshopModeFn` and `adminUpdateAnnouncementBannerFn`.

### List C — DO NOT TOUCH (Critical Infrastructure & Math Engines)
*These files must remain strictly unmodified during UI work:*
- **All Server Code (`app/server/*`):** `config.ts`, `session.ts`, `adminAuth.ts`, `auth.ts`, `passkey.ts`, `passkeyStore.ts`, `courseLifecycle.ts`, `courseLifecycleStore.ts`, `telemetry.ts`, `telemetryStore.ts`, `troubleshooting.ts`, `troubleshootingStore.ts`, `platform.ts`, `platformStore.ts`.
- **All Data Schemas (`app/schemas/*`):** All 8 Zod schema definition files.
- **Core State & Formula Engines:**
  - `app/hooks/usePretrainingState.ts` (Progress calculation and readiness rules).
  - `assets/js/state.js` (Word 70/30 scoring formula, KKM 80, and question answer keys).
  - `app/utils/redaction.ts` (ReDoS-safe regex engine).
  - `app/utils/telemetryClient.ts` (Debounced heartbeat dispatcher).
- **All Test Specifications (`tests/*`, `scratch/*`):** Test suites must remain the immutable validation benchmark.
- **Docker & Server Configuration:** `Dockerfile`, `docker-compose.yml`, `app.config.ts`.

---

## 15. Implementation Order & Phasing

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ PHASE 0: SPECIFICATION & DESIGN CONTRACT (Current Phase)                    │
├─────────────────────────────────────────────────────────────────────────────┤
│ PHASE 1: DESIGN TOKENS & FOUNDATION CSS                                     │
│          assets/css/main.css, assets/css/components.css                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ PHASE 2: GLOBAL SHELL & NAVIGATION                                          │
│          Header.tsx, CourseSwitcher.tsx, GlobalAnnouncementBanner.tsx       │
├─────────────────────────────────────────────────────────────────────────────┤
│ PHASE 3: HOMEPAGE REDESIGN (/)                                              │
│          app/routes/index.tsx, app/components/home/*                        │
├─────────────────────────────────────────────────────────────────────────────┤
│ PHASE 4: COURSE 1 (AGENTIC AI) REDESIGN (/course/ai)                        │
│          app/routes/course.ai.tsx, app/components/course/pretraining/*      │
├─────────────────────────────────────────────────────────────────────────────┤
│ PHASE 5: COURSE 2 (ADVANCED WORD) REDESIGN (/course/word)                   │
│          Port Bab V Quiz, Rubric & Certificate from index.html into React   │
├─────────────────────────────────────────────────────────────────────────────┤
│ PHASE 6: ADMIN COMMAND CENTER REDESIGN (/admin)                             │
│          app/routes/admin.tsx, app/components/admin/*                       │
├─────────────────────────────────────────────────────────────────────────────┤
│ PHASE 7: RESPONSIVE & MOBILE POLISH                                         │
│          Touch targets, table transformations, mobile drawer refinement     │
├─────────────────────────────────────────────────────────────────────────────┤
│ PHASE 8: ACCESSIBILITY & CONTRAST VALIDATION                                │
│          Keyboard navigation audit, WCAG contrast verification, ARIA audit   │
├─────────────────────────────────────────────────────────────────────────────┤
│ PHASE 9: REGRESSION TESTING & SUITE VERIFICATION                            │
│          npm run test:all (Unit tests, Playwright e2e, Docker smoke)        │
├─────────────────────────────────────────────────────────────────────────────┤
│ PHASE 10: PRODUCTION CONTAINER BUILD & AUDIT SIGN-OFF                       │
│           docker compose build & up, final git commit & push                │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Phase Details

#### Phase 1: Design Tokens & Foundation CSS
- **Files Involved:** `assets/css/main.css`, `assets/css/components.css`.
- **Prerequisites:** Approved design token specification (Section 3).
- **Expected Outcome:** Dark palette variables, typography, hairlines, and glow utility classes active without breaking existing class references.
- **Validation:** `npm run test:node` passes.
- **DO NOT TOUCH:** Component markup or application logic.

#### Phase 2: Global Shell & Navigation
- **Files Involved:** `app/routes/__root.tsx`, `app/components/layout/Header.tsx`, `CourseSwitcher.tsx`, `GlobalAnnouncementBanner.tsx`.
- **Prerequisites:** Phase 1 complete.
- **Expected Outcome:** Sleek dark navigation header, smooth theme switcher, accessible mobile drawer.
- **Validation:** Visual verification on `/`, `/course/ai`, `/course/word`, `/admin`.
- **DO NOT TOUCH:** Route loader queries or BroadcastChannel invalidation.

#### Phase 3: Homepage Redesign (`/`)
- **Files Involved:** `app/routes/index.tsx`, `app/components/home/*` (all 10 files).
- **Prerequisites:** Phase 2 complete.
- **Expected Outcome:** Cinematic hero, live metrics strip, bento workshop catalog, methodology pillars.
- **Validation:** `node --test tests/homepage.test.js`, `tests/catalog-filter-scroll.test.js`.
- **DO NOT TOUCH:** Search parameter validation schema (`homeSearchSchema`).

#### Phase 4: Course 1 (Agentic AI) Redesign (`/course/ai`)
- **Files Involved:** `app/routes/course.ai.tsx`, `app/components/course/pretraining/*`, `app/components/course/liveclass/*`.
- **Prerequisites:** Phase 3 complete.
- **Expected Outcome:** Dark IDE workspace, responsive progress rail, module instruction cards, interactive gate cards.
- **Validation:** `node --test tests/pretraining-checklist.test.js`, `tests/checkpoint-engine.test.js`, `tests/pretraining-readiness-report.test.js`.
- **DO NOT TOUCH:** `usePretrainingState.ts`, checklist task IDs, checkpoint IDs, telemetry dispatch.

#### Phase 5: Course 2 (Advanced Word) Migration & Controlled Functional Refactor (`/course/word`)
- **Files Involved:** `app/routes/course.word.tsx`, `app/components/course/ChecklistIsland.tsx`, new React 19 components in `app/components/course/word/` (`WordQuizSection.tsx`, `WordRubricSection.tsx`, `WordEvaluationSummary.tsx`, `BpsdmCertificateSlip.tsx`).
- **Prerequisites:** Phase 4 complete. Complete architectural comprehension of `index.html` lines 6530–7480 and `assets/js/app.js` event listeners.
- **Expected Outcome:** Seamless migration of the legacy Bab V Quiz, Rubric, Evaluation, and Certificate from vanilla DOM into idiomatic React 19 components while maintaining 100% behavioral equivalence.
- **Mandatory 7 Validation Gates:**
  1. Understand existing legacy event wireup and state mutation flow prior to migration.
  2. Produce equivalent React 19 UI states, option selection indicators, and explanation views.
  3. Continuous green passing of `node --test tests/word-modules.test.js` and `tests/word-quiz-report.test.js`.
  4. Explicit boundary testing: Score 79 (Remediasi), Score 80 (Memuaskan), Score 100 with failed CP (Remediasi).
  5. Mathematical score parity check: direct comparison of $(\text{Port} \times 0.70) + (\text{Quiz} \times 0.30)$ against baseline.
  6. Certificate output data fidelity verification: Name, NIP, Unit Kerja, Nilai Akhir, Predikat, print CSS.
  7. Strict zero rule redesign: zero changes to question count (20), point value (5), KKM (80), rubric items, or formulas.
- **DO NOT TOUCH:** Scoring algorithms, KKM threshold, question definitions, answer keys, or `learnwith_word_state_v1` namespace.

#### Phase 6: Admin Command Center Redesign (`/admin`)
- **Files Involved:** `app/routes/admin.tsx`, `app/components/admin/*`.
- **Prerequisites:** Phase 5 complete.
- **Expected Outcome:** Dense operational dark cockpit, real-time KPI metrics, responsive participant cohort table.
- **Validation:** `node --test tests/admin-dashboard.test.js`, `tests/admin-passkey.test.js`, `tests/course-lifecycle-admin-ui.test.js`.
- **DO NOT TOUCH:** `adminAuth.ts`, `session.ts`, `passkeyStore.ts`, session cookies.

#### Phase 7: Responsive & Mobile Polish
- **Files Involved:** All layout and page CSS files.
- **Prerequisites:** Phase 6 complete.
- **Expected Outcome:** Seamless touch UX, mobile card layouts for tables, full-width quiz buttons.
- **Validation:** `node --test tests/mobile-accessibility.test.js`.

#### Phase 8: Accessibility & Contrast Validation
- **Files Involved:** All UI components.
- **Prerequisites:** Phase 7 complete.
- **Expected Outcome:** 100% WCAG 2.1 AA compliance, focus rings, ARIA tags, reduced-motion overrides.
- **Validation:** Lighthouse Accessibility score $\ge 98$, keyboard-only walkthrough.

#### Phase 9: Regression Testing & Suite Verification
- **Prerequisites:** All visual work complete.
- **Commands:** `npm run test:all` (Node tests, Docker smoke tests, Playwright e2e).
- **Validation:** Zero test failures across all 35 test suites.

#### Phase 10: Production Container Build & Audit Sign-off
- **Prerequisites:** Phase 9 passes.
- **Commands:** `docker compose build`, `docker compose up -d`, healthcheck verification.
- **Final Action:** Audit verification, git commit, and push per project guidelines.

---

## Non-Negotiable Rules

1. **UI redesign does not mean business-logic rewrite.** Presentation changes must strictly wrap existing functionality.
2. **Existing learning flows must remain intact.** Pre-training $\rightarrow$ Checkpoints $\rightarrow$ Readiness $\rightarrow$ Live Class for Course 1; Bab I–IV $\rightarrow$ Quiz $\rightarrow$ Rubric $\rightarrow$ Certificate for Course 2.
3. **Existing state/storage contracts must remain intact.** `learnwith_ai_*` and `learnwith_word_*` keys and data structures must not be altered or cross-contaminated.
4. **Security boundaries must remain intact.** Timing-safe comparisons, 256-bit crypto sessions, HttpOnly cookies, and Google OAuth whitelists must never be weakened.
5. **Scoring formulas must remain mathematically identical.** Nilai Akhir $= (\text{Portofolio} \times 0.70) + (\text{Kuis} \times 0.30)$ with KKM 80.
6. **Automated test selectors must remain functional.** All `id`, `data-task-id`, and element classes targeted by `tests/*.test.js` must be preserved.
7. **Course isolation must remain intact.** Course 1 and Course 2 must never access or modify each other's storage namespaces.
8. **Every migration phase must be independently verifiable.** Code must build, typecheck, and pass existing tests at the conclusion of every individual phase.

---
*Authored as the authoritative architectural blueprint for the Learnwith visual redesign.*
