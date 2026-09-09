/**
 * LearnWith Homepage Redesign Automated Test Suite
 * Covers: Gate 0 Shell Scoping, Content Truth Gate, Media Contract,
 * Filter Param Synchronization, and Zero-Emoji Standards
 */

const { describe, it, before } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

describe('LearnWith Homepage Redesign Test Suite', () => {
  let coursesModule

  before(async () => {
    coursesModule = await import('../app/data/courses.ts')
  })

  // =========================================================================
  // SUITE 1: GATE 0 SHELL SCOPING & ROOT INTEGRATION
  // =========================================================================
  describe('Suite 1: Gate 0 Root Shell Scoping & Architecture', () => {
    it('verifies __root.tsx implements dynamic .view-home class based on pathname', () => {
      const rootPath = path.resolve(__dirname, '../app/routes/__root.tsx')
      const content = fs.readFileSync(rootPath, 'utf-8')
      assert.ok(content.includes('useRouterState'), '__root.tsx must import useRouterState')
      assert.ok(content.includes("isHome = pathname === '/'"), '__root.tsx must detect root pathname')
      assert.ok(content.includes("view-home"), '__root.tsx must conditionally apply view-home')
    })

    it('verifies homepage.css is linked in __root.tsx head', () => {
      const rootPath = path.resolve(__dirname, '../app/routes/__root.tsx')
      const content = fs.readFileSync(rootPath, 'utf-8')
      assert.ok(content.includes('/assets/css/homepage.css'), 'homepage.css must be linked in head')
    })

    it('verifies main.css contains rules to hide sidebar and switcher under .view-home', () => {
      const mainCssPath = path.resolve(__dirname, '../assets/css/main.css')
      const content = fs.readFileSync(mainCssPath, 'utf-8')
      assert.ok(content.includes('.app-container.view-home'), 'main.css must contain .app-container.view-home rules')
      assert.ok(content.includes('.app-container.view-home .app-sidebar'), 'sidebar must be hidden under view-home')
    })
  })

  // =========================================================================
  // SUITE 2: CONTENT TRUTH GATE & FACTUAL VERIFICATION
  // =========================================================================
  describe('Suite 2: Content Truth Gate & Factual Traceability', () => {
    it('verifies Pergub DKI No. 14/2020 is cited correctly in standards and curriculum', () => {
      const standardsPath = path.resolve(__dirname, '../app/components/home/StandardsStrip.tsx')
      const content = fs.readFileSync(standardsPath, 'utf-8')
      assert.ok(content.includes('Pergub DKI No. 14/2020'), 'Standards strip must cite Pergub DKI No. 14/2020')
    })

    it('verifies 9Router port 20128 and Node.js LTS are cited from actual implementation', () => {
      const standardsPath = path.resolve(__dirname, '../app/components/home/StandardsStrip.tsx')
      const content = fs.readFileSync(standardsPath, 'utf-8')
      assert.ok(content.includes('20128'), 'Must cite verified port 20128')
      assert.ok(content.includes('Node.js LTS'), 'Must cite Node.js LTS')
    })

    it('verifies no fabricated marketing claims or stats exist in homepage components', () => {
      const homeDir = path.resolve(__dirname, '../app/components/home')
      const files = fs.readdirSync(homeDir)
      for (const file of files) {
        if (!file.endsWith('.tsx') && !file.endsWith('.ts')) continue
        const fileContent = fs.readFileSync(path.join(homeDir, file), 'utf-8')
        assert.ok(!fileContent.includes('10,000 ASN'), `Fabricated stat found in ${file}`)
        assert.ok(!fileContent.includes('99% kelulusan'), `Fabricated stat found in ${file}`)
        assert.ok(!fileContent.includes('100% kepuasan'), `Fabricated stat found in ${file}`)
      }
    })

    it('verifies zero raw OS emojis in homepage route and home components', () => {
      const emojiRegex = /[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u
      const filesToCheck = [
        path.resolve(__dirname, '../app/routes/index.tsx'),
        ...fs.readdirSync(path.resolve(__dirname, '../app/components/home'))
          .filter(f => f.endsWith('.tsx') || f.endsWith('.ts'))
          .map(f => path.resolve(__dirname, '../app/components/home', f))
      ]

      for (const filePath of filesToCheck) {
        const content = fs.readFileSync(filePath, 'utf-8')
        const match = emojiRegex.exec(content)
        assert.equal(
          match,
          null,
          `Found raw OS emoji "${match ? match[0] : ''}" in ${path.basename(filePath)}! Standard requires pure SVG vector icons.`
        )
      }
    })
  })

  // =========================================================================
  // SUITE 3: SINGLE SOURCE OF TRUTH & CATALOG DATA INTEGRITY
  // =========================================================================
  describe('Suite 3: Single Source of Truth & Catalog Data', () => {
    it('verifies getCoursesList returns real course models (AI and Word)', async () => {
      const courses = await coursesModule.getCoursesList()
      assert.ok(Array.isArray(courses), 'getCoursesList must return an array')
      assert.equal(courses.length, 2, 'Must contain exactly 2 courses')

      const aiCourse = courses.find(c => c.category === 'ai')
      const wordCourse = courses.find(c => c.category === 'word')

      assert.ok(aiCourse, 'AI course must exist')
      assert.equal(aiCourse.modulesCount, 5, 'AI pre-training modules must be 5')
      assert.equal(aiCourse.checkpointsCount, 3, 'AI checkpoints must be 3')

      assert.ok(wordCourse, 'Word course must exist')
      assert.equal(wordCourse.modulesCount, 5, 'Word modules must be 5')
      assert.equal(wordCourse.checkpointsCount, 3, 'Word checkpoints must be 3')
    })

    it('verifies WorkshopCatalog maps cards to expected DOM IDs and route targets', () => {
      const catalogPath = path.resolve(__dirname, '../app/components/home/WorkshopCatalog.tsx')
      const content = fs.readFileSync(catalogPath, 'utf-8')
      assert.ok(content.includes('card-home-course-ai'), 'Must include AI card id')
      assert.ok(content.includes('card-home-course-word'), 'Must include Word card id')
      assert.ok(content.includes('btn-home-enter-ai'), 'Must include AI button id')
      assert.ok(content.includes('btn-home-enter-word'), 'Must include Word button id')
      assert.ok(content.includes('to={targetRoute}'), 'Must bind target route')
      assert.ok(content.includes("searchParams = isAi ? { mode: 'pretraining'"), 'Must bind pretraining mode param')
    })
  })

  // =========================================================================
  // SUITE 4: MEDIA ARCHITECTURE CONTRACT & NO AVOIDABLE CLS
  // =========================================================================
  describe('Suite 4: Media Architecture Contract & Layout Stability', () => {
    it('verifies showcase-frame enforces explicit 16/9 aspect-ratio in CSS to prevent CLS', () => {
      const cssPath = path.resolve(__dirname, '../assets/css/homepage.css')
      const content = fs.readFileSync(cssPath, 'utf-8')
      assert.ok(content.includes('.showcase-frame'), 'CSS must define .showcase-frame')
      assert.ok(content.includes('aspect-ratio: 16 / 9'), '.showcase-frame must specify aspect-ratio: 16 / 9')
    })

    it('verifies ShowcaseFrame provides immediate conceptual visualization without waiting for video', () => {
      const showcasePath = path.resolve(__dirname, '../app/components/home/ShowcaseFrame.tsx')
      const content = fs.readFileSync(showcasePath, 'utf-8')
      assert.ok(content.includes('showcase-stage'), 'ShowcaseFrame must provide DOM fallback stage')
      assert.ok(content.includes('showcase-terminal-body'), 'Must provide terminal body visualization')
      assert.ok(content.includes('Visualisasi Konseptual'), 'Must label as conceptual visualization')
      assert.ok(content.includes('preload="none"'), 'Video must have preload="none" to prevent blocking download')
      assert.ok(content.includes('IntersectionObserver'), 'Must use IntersectionObserver for lifecycle management')
    })
  })

  // =========================================================================
  // SUITE 5: PLATFORM POSITIONING & PRIMARY CTA ANCHORING
  // =========================================================================
  describe('Suite 5: Platform Positioning & Primary CTA Target', () => {
    it('verifies hero primary CTA directs to #pilihan-modul (catalog) instead of hardcoding single course', () => {
      const heroPath = path.resolve(__dirname, '../app/components/home/HeroSection.tsx')
      const content = fs.readFileSync(heroPath, 'utf-8')
      assert.ok(content.includes('href="#pilihan-modul"'), 'Primary CTA must anchor to tracks catalog #pilihan-modul')
      assert.ok(content.includes('Pilih Jalur Belajar'), 'Primary CTA label must invite choosing learning track')
      assert.ok(content.includes('href="#standar"'), 'Secondary CTA must anchor to #standar')
    })
  })

  // =========================================================================
  // SUITE 6: MOBILE FILTER UX & ACCESSIBILITY
  // =========================================================================
  describe('Suite 6: Mobile Filter UX & Accessibility Invariants', () => {
    it('verifies catalog filter chips wrap naturally without forcing horizontal scroll', () => {
      const cssPath = path.resolve(__dirname, '../assets/css/homepage.css')
      const content = fs.readFileSync(cssPath, 'utf-8')
      assert.ok(content.includes('.catalog-filters-container'), 'CSS must style .catalog-filters-container')
      assert.ok(content.includes('flex-wrap: wrap'), 'Filter container must allow wrap to prevent forced scroll')
    })

    it('verifies interactive controls have at least 44px touch target height', () => {
      const cssPath = path.resolve(__dirname, '../assets/css/homepage.css')
      const content = fs.readFileSync(cssPath, 'utf-8')
      assert.ok(content.includes('min-height: 44px'), 'Interactive chips must meet 44px minimum')
      assert.ok(content.includes('min-height: 48px'), 'Buttons must meet 48px standard')
    })

    it('verifies FAQ uses accessible native details and summary with focus rings', () => {
      const faqPath = path.resolve(__dirname, '../app/components/home/FaqSection.tsx')
      const content = fs.readFileSync(faqPath, 'utf-8')
      assert.ok(content.includes('<details'), 'FAQ must use <details> for native keyboard accessibility')
      assert.ok(content.includes('<summary'), 'FAQ must use <summary>')

      const cssPath = path.resolve(__dirname, '../assets/css/homepage.css')
      const cssContent = fs.readFileSync(cssPath, 'utf-8')
      assert.ok(cssContent.includes('.faq-summary:focus-visible'), 'Must have explicit :focus-visible ring')
    })

    it('verifies prefers-reduced-motion media query is defined', () => {
      const cssPath = path.resolve(__dirname, '../assets/css/homepage.css')
      const content = fs.readFileSync(cssPath, 'utf-8')
      assert.ok(content.includes('@media (prefers-reduced-motion: reduce)'), 'Must include prefers-reduced-motion')
    })
  })
})
