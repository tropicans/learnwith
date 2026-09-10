/**
 * Reproduction Test Suite for Bug:
 * "ketika agentic ai & otomasi di klik layar kembali ke atas"
 * 
 * Root Cause:
 * In app/components/home/WorkshopCatalog.tsx, the filter tabs use TanStack Router's <Link>
 * without `resetScroll={false}`. By default, TanStack Router navigates to the route and
 * resets window scroll position to (0, 0), causing the screen to jump back to the top
 * when clicking "Agentic AI & Otomasi" or any other filter chip.
 */

const { describe, it } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

describe('Bug Reproduction: WorkshopCatalog Filter Scroll Reset', () => {
  const catalogPath = path.resolve(__dirname, '../app/components/home/WorkshopCatalog.tsx')
  const content = fs.readFileSync(catalogPath, 'utf-8')

  it('verifies filter links configure resetScroll={false} to prevent jumping to top on filter change', () => {
    // The filter container contains links for 'all', 'ai', and 'word'
    const filtersContainerMatch = content.match(/<div className="catalog-filters-container"[\s\S]*?<\/div>/)
    assert.ok(filtersContainerMatch, 'Must find catalog-filters-container in WorkshopCatalog.tsx')

    const containerContent = filtersContainerMatch[0]

    // 1. Check filter 'all'
    const allLinkMatch = containerContent.match(/<Link[\s\S]*?search=\{\{\s*filter:\s*'all'\s*\}\}[\s\S]*?>/)
    assert.ok(allLinkMatch, "Must find Link for filter: 'all'")
    assert.ok(
      allLinkMatch[0].includes('resetScroll={false}'),
      "Filter 'all' Link must have resetScroll={false} to prevent jumping to top"
    )

    // 2. Check filter 'ai' (Agentic AI & Otomasi reported by user)
    const aiLinkMatch = containerContent.match(/<Link[\s\S]*?search=\{\{\s*filter:\s*'ai'\s*\}\}[\s\S]*?>/)
    assert.ok(aiLinkMatch, "Must find Link for filter: 'ai'")
    assert.ok(
      aiLinkMatch[0].includes('resetScroll={false}'),
      "Filter 'ai' (Agentic AI & Otomasi) Link must have resetScroll={false} to prevent jumping to top"
    )

    // 3. Check filter 'word'
    const wordLinkMatch = containerContent.match(/<Link[\s\S]*?search=\{\{\s*filter:\s*'word'\s*\}\}[\s\S]*?>/)
    assert.ok(wordLinkMatch, "Must find Link for filter: 'word'")
    assert.ok(
      wordLinkMatch[0].includes('resetScroll={false}'),
      "Filter 'word' Link must have resetScroll={false} to prevent jumping to top"
    )
  })
})
