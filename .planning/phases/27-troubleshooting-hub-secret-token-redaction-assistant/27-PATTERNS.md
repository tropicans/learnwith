# Phase 27: Troubleshooting Hub & Secret Token Redaction Assistant - Pattern Map

**Mapped:** 2026-09-09  
**Files analyzed:** 7  
**Analogs found:** 7 / 7  

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
| :--- | :--- | :--- | :--- | :--- |
| `app/data/pretrainingTroubleshooting.ts` | model / data | transform | `app/data/pretrainingFoundation.ts` & `app/data/pretrainingModules.ts` | exact |
| `app/utils/redaction.ts` | utility | transform | `assets/js/app.js` (lines 1028–1076) & `tests/troubleshooting-exporter.test.js` | exact |
| `app/components/course/pretraining/TroubleshootingCard.tsx` | component | presentation | `app/components/course/pretraining/CheckpointGateCard.tsx` | exact |
| `app/components/course/pretraining/PretrainingTroubleshootingSection.tsx` | component | event-driven | `app/components/course/pretraining/PretrainingModulesSection.tsx` & `assets/js/app.js` (lines 883–949) | exact |
| `app/components/course/pretraining/PretrainingRedactionSection.tsx` | component | event-driven | `app/components/course/pretraining/CopyableCodeBlock.tsx` & `assets/js/app.js` (lines 1080–1126) | exact |
| `tests/pretraining-troubleshooting.test.js` | test | test / assertion | `tests/pretraining-checklist.test.js` & `tests/troubleshooting-exporter.test.js` | exact |
| `app/routes/course.ai.tsx` | route | composition | `app/routes/course.ai.tsx` (lines 87–114) | exact |

---

## Pattern Assignments

### 1. `app/data/pretrainingTroubleshooting.ts` (model / data, transform)

**Analog:** `app/data/pretrainingFoundation.ts` (lines 8–47) & `app/data/pretrainingModules.ts` (lines 8–57)

**Imports pattern:**
None required (pure TypeScript domain definitions and static constants).

**Core Type Definition Pattern:**
```typescript
// Copied from pattern in app/data/pretrainingFoundation.ts:8-47
export type TroubleshootingCategory = 'all' | 'node' | 'router' | 'telegram' | 'hermes' | 'powershell'
export type TroubleSeverity = 'neutral' | 'warning' | 'danger' | 'primary'

export interface TroubleshootingCodeBlock {
  language: string
  code: string
  label?: string
  ariaLabel?: string
  toastMessage?: string
}

export interface TroubleshootingItem {
  id: string
  title: string
  category: TroubleshootingCategory
  categoryLabel: string
  icon: string
  severity: TroubleSeverity
  cause: string
  steps: string[]
  codeBlock?: TroubleshootingCodeBlock
  keywords?: string[]
}

export interface TroubleshootingCategoryOption {
  id: TroubleshootingCategory
  label: string
}
```

**Data Array Pattern:**
```typescript
// Copied from pattern in app/data/pretrainingFoundation.ts:48-75
export const TROUBLESHOOTING_CATEGORIES: TroubleshootingCategoryOption[] = [
  { id: 'all', label: 'Semua Kendala (15)' },
  { id: 'node', label: 'Node.js & npm' },
  { id: 'router', label: '9Router & Port' },
  { id: 'telegram', label: 'Telegram Bot' },
  { id: 'hermes', label: 'Hermes Agent' },
  { id: 'powershell', label: 'PowerShell Security' },
]

export const PRETRAINING_TROUBLESHOOTING_ITEMS: TroubleshootingItem[] = [
  {
    id: 'trbl-node-not-recognized',
    title: 'Pesan: node is not recognized / tidak dikenali',
    category: 'node',
    categoryLabel: 'Node.js & npm',
    icon: '📟',
    severity: 'neutral',
    cause: 'PowerShell belum menemukan program Node.js karena belum terpasang atau belum terbaca di sistem.',
    steps: [
      'Tutup seluruh jendela PowerShell yang sedang aktif.',
      'Unduh dan jalankan installer Node.js LTS dari nodejs.org.',
      'Pastikan mencentang opsi "Automatically install necessary tools" atau "Add to PATH".',
      'Buka kembali PowerShell baru dan ketik node -v untuk verifikasi.'
    ],
    codeBlock: {
      language: 'PowerShell',
      code: 'node -v\nnpm -v',
      ariaLabel: 'Salin perintah verifikasi Node',
      toastMessage: 'Perintah verifikasi Node disalin! 📋'
    },
    keywords: ['node', 'npm', 'not recognized', 'path', 'install']
  },
  // ... 14 additional structured items covering EADDRINUSE, 401 Unauthorized, Execution_Policies, Telegram 409 Conflict
]
```

---

### 2. `app/utils/redaction.ts` (utility, transform)

**Analog:** `assets/js/app.js` (lines 1028–1076) and `tests/troubleshooting-exporter.test.js` (lines 44–58)

**Imports pattern:**
None required (pure TypeScript utility module without runtime dependencies).

**Core Sanitization Pattern:**
```typescript
// Copied from assets/js/app.js:1028-1076 with TypeScript types
export interface RedactionRule {
  name: string
  pattern: RegExp
  replacement: string
}

export interface SanitizeResult {
  sanitized: string
  matchesCount: number
}

export const REDACTION_RULES: RedactionRule[] = [
  {
    name: 'Telegram Bot Token',
    pattern: /\b\d{8,10}:[A-Za-z0-9_-]{35}\b/g,
    replacement: '[REDACTED_TELEGRAM_BOT_TOKEN]',
  },
  {
    name: 'OpenAI API Key',
    pattern: /\bsk-[A-Za-z0-9_-]{20,}\b/g,
    replacement: '[REDACTED_API_KEY]',
  },
  {
    name: 'Google Cloud API Key',
    pattern: /\bAIza[0-9A-Za-z-_]{35}\b/g,
    replacement: '[REDACTED_GOOGLE_API_KEY]',
  },
  {
    name: 'Bearer Token',
    pattern: /Bearer\s+[A-Za-z0-9._~+/-]+=*/gi,
    replacement: 'Bearer [REDACTED_BEARER_TOKEN]',
  },
  {
    name: 'Email Address',
    pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
    replacement: '[REDACTED_EMAIL]',
  },
  {
    name: 'Windows User Path',
    pattern: /(C:\\Users\\)[a-zA-Z0-9_.-]+(\\)/gi,
    replacement: '$1[USER]$2',
  },
]

export function sanitizeLogText(rawText: string | null | undefined): SanitizeResult {
  if (!rawText) {
    return { sanitized: '', matchesCount: 0 }
  }

  let sanitized = String(rawText)
  let totalMatches = 0

  for (const rule of REDACTION_RULES) {
    rule.pattern.lastIndex = 0
    const matches = sanitized.match(rule.pattern)
    if (matches) {
      totalMatches += matches.length
      sanitized = sanitized.replace(rule.pattern, rule.replacement)
    }
  }

  return { sanitized, matchesCount: totalMatches }
}
```

---

### 3. `app/components/course/pretraining/TroubleshootingCard.tsx` (component, presentation)

**Analog:** `app/components/course/pretraining/CheckpointGateCard.tsx` (lines 1–45) and `CopyableCodeBlock.tsx`

**Imports pattern:**
```typescript
import React from 'react'
import type { TroubleshootingItem } from '@/data/pretrainingTroubleshooting'
import { CopyableCodeBlock } from './CopyableCodeBlock'
```

**Core Card Rendering Pattern:**
```typescript
// Copied from CheckpointGateCard.tsx structure and index.html:2287-2315
export interface TroubleshootingCardProps {
  item: TroubleshootingItem
}

export function TroubleshootingCard({ item }: TroubleshootingCardProps) {
  const badgeClass =
    item.severity === 'danger'
      ? 'badge badge-pill badge-danger'
      : item.severity === 'warning'
      ? 'badge badge-pill badge-warning'
      : 'badge badge-pill badge-neutral'

  return (
    <div
      className={`trouble-card ${item.severity === 'danger' ? 'danger' : ''}`}
      data-trouble-category={item.category}
      id={`trouble-${item.id}`}
    >
      <div className="trouble-header">
        <div className="trouble-title-wrap">
          <div className="trouble-icon">{item.icon}</div>
          <div>
            <h4 className="trouble-title">{item.title}</h4>
            <span className={badgeClass}>{item.categoryLabel}</span>
          </div>
        </div>
      </div>

      <div className="trouble-cause">
        <strong>Penyebab:</strong> {item.cause}
      </div>

      <ol className="trouble-steps">
        {item.steps.map((step, idx) => (
          <li key={idx}>{step}</li>
        ))}
      </ol>

      {item.codeBlock && (
        <div style={{ marginTop: '0.75rem' }}>
          <CopyableCodeBlock
            code={item.codeBlock.code}
            language={item.codeBlock.language}
            label={item.codeBlock.label}
            ariaLabel={item.codeBlock.ariaLabel}
            toastMessage={item.codeBlock.toastMessage}
          />
        </div>
      )}
    </div>
  )
}
```

---

### 4. `app/components/course/pretraining/PretrainingTroubleshootingSection.tsx` (component, event-driven)

**Analog:** `app/components/course/pretraining/PretrainingModulesSection.tsx` (lines 1–41) & `assets/js/app.js` (lines 883–949)

**Imports pattern:**
```typescript
import { useState, useMemo, useRef } from 'react'
import {
  PRETRAINING_TROUBLESHOOTING_ITEMS,
  TROUBLESHOOTING_CATEGORIES,
  type TroubleshootingCategory,
} from '@/data/pretrainingTroubleshooting'
import { TroubleshootingCard } from './TroubleshootingCard'
```

**State & Filter Logic Pattern:**
```typescript
// Copied from assets/js/app.js:883-949 with React useState + useMemo
export function PretrainingTroubleshootingSection() {
  const [selectedCategory, setSelectedCategory] = useState<TroubleshootingCategory>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const pillRefs = useRef<(HTMLButtonElement | null)[]>([])

  const filteredItems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    return PRETRAINING_TROUBLESHOOTING_ITEMS.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory
      if (!matchesCategory) return false

      if (!q) return true

      const matchTitle = item.title.toLowerCase().includes(q)
      const matchCause = item.cause.toLowerCase().includes(q)
      const matchSteps = item.steps.some((s) => s.toLowerCase().includes(q))
      const matchKeywords = item.keywords?.some((k) => k.toLowerCase().includes(k)) || false
      const matchCategory = item.categoryLabel.toLowerCase().includes(q)

      return matchTitle || matchCause || matchSteps || matchKeywords || matchCategory
    })
  }, [selectedCategory, searchQuery])

  // Keyboard navigation across category pills (ArrowLeft, ArrowRight, Home, End)
  const handlePillKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End']
    if (!keys.includes(e.key)) return
    e.preventDefault()

    const total = TROUBLESHOOTING_CATEGORIES.length
    let nextIndex = index

    if (e.key === 'Home') nextIndex = 0
    if (e.key === 'End') nextIndex = total - 1
    if (e.key === 'ArrowLeft') nextIndex = (index - 1 + total) % total
    if (e.key === 'ArrowRight') nextIndex = (index + 1) % total

    pillRefs.current[nextIndex]?.focus()
    setSelectedCategory(TROUBLESHOOTING_CATEGORIES[nextIndex].id)
  }

  return (
    <section id="sec-troubleshooting" className="content-section">
      {/* Header, Search toolbar, Filter pills, and Card Grid */}
    </section>
  )
}
```

---

### 5. `app/components/course/pretraining/PretrainingRedactionSection.tsx` (component, event-driven)

**Analog:** `app/components/course/pretraining/CopyableCodeBlock.tsx` (lines 18–52) & `assets/js/app.js` (lines 1080–1126)

**Imports pattern:**
```typescript
import { useState, useId } from 'react'
import { sanitizeLogText } from '@/utils/redaction'
import { copyToClipboard } from './CopyableCodeBlock'
import { showToast } from '@/components/ui/Toast'
```

**State, Redaction Execution & Clipboard Copy Pattern:**
```typescript
// Copied from assets/js/app.js:1080-1126 and CopyableCodeBlock.tsx:18-52
export function PretrainingRedactionSection() {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [matchesCount, setMatchesCount] = useState(0)
  const [hasChecked, setHasChecked] = useState(false)

  const handleProcessRedaction = (text: string) => {
    setInputText(text)
    const result = sanitizeLogText(text)
    setOutputText(result.sanitized)
    setMatchesCount(result.matchesCount)
    setHasChecked(true)
  }

  const handleCopySanitized = async () => {
    if (!outputText.trim()) {
      showToast('Tidak ada teks log untuk disalin', 'warning', 2000)
      return
    }
    const success = await copyToClipboard(outputText)
    if (success) {
      showToast('Log yang disensor berhasil disalin ke clipboard! 📋', 'success', 2500)
    } else {
      showToast('Gagal menyalin ke clipboard', 'danger', 2000)
    }
  }

  const handleClear = () => {
    setInputText('')
    setOutputText('')
    setMatchesCount(0)
    setHasChecked(false)
    showToast('Teks log dibersihkan 🗑️', 'info', 1500)
  }

  // Badge appearance calculation
  const renderBadge = () => {
    if (matchesCount > 0) {
      return (
        <span id="redaction-count-badge" className="badge badge-pill badge-warning">
          {matchesCount} data sensitif disensor 🛡️
        </span>
      )
    }
    if (inputText.trim().length > 0) {
      return (
        <span id="redaction-count-badge" className="badge badge-pill badge-success">
          Aman (tidak terdeteksi token rahasia) ✓
        </span>
      )
    }
    return (
      <span id="redaction-count-badge" className="badge badge-pill badge-neutral">
        0 data terdeteksi
      </span>
    )
  }

  return (
    <section id="sec-redaction" className="content-section">
      {/* Header, Dual-pane textarea grid, Action buttons, Protected entity tags */}
    </section>
  )
}
```

---

### 6. `tests/pretraining-troubleshooting.test.js` (test, assertion)

**Analog:** `tests/pretraining-checklist.test.js` (lines 1–55) & `tests/troubleshooting-exporter.test.js` (lines 40–60)

**Imports pattern:**
```javascript
const { describe, it, before } = require('node:test')
const assert = require('node:assert')
const fs = require('node:fs')
const path = require('node:path')
```

**Test Suite Pattern:**
```javascript
describe('Phase 27 Troubleshooting Hub & Secret Redaction Assistant Suite', () => {
  let trblModule
  let redactionModule

  before(async () => {
    trblModule = await import('../app/data/pretrainingTroubleshooting.ts')
    redactionModule = await import('../app/utils/redaction.ts')
  })

  describe('Suite 1: Data Model & Error Cards (PRE-TOOL-01, PRE-TOOL-02)', () => {
    it('exports at least 10 error resolution cards (PRE-TOOL-02)', () => {
      const items = trblModule.PRETRAINING_TROUBLESHOOTING_ITEMS
      assert.ok(Array.isArray(items))
      assert.ok(items.length >= 10, 'Must have at least 10 error cards')
    })

    it('contains specific required cards for EADDRINUSE, 401 Unauthorized, Execution_Policies, Telegram 409 Conflict', () => {
      const items = trblModule.PRETRAINING_TROUBLESHOOTING_ITEMS
      const allText = JSON.stringify(items).toLowerCase()
      assert.ok(allText.includes('eaddrinuse'), 'Must contain EADDRINUSE card')
      assert.ok(allText.includes('401 unauthorized'), 'Must contain 401 Unauthorized card')
      assert.ok(allText.includes('execution') || allText.includes('disabled on this system'), 'Must contain Execution_Policies card')
      assert.ok(allText.includes('409 conflict') || allText.includes('conflict'), 'Must contain Telegram 409 Conflict card')
    })
  })

  describe('Suite 2: Secret Token Redaction Engine (PRE-TOOL-03)', () => {
    it('redacts Telegram Bot token and counts match', () => {
      const { sanitizeLogText } = redactionModule
      const token = '123456789:ABCDefGhIjKlMnOpQrStUvWxYz012345678'
      const res = sanitizeLogText(`Error with ${token}`)
      assert.ok(res.sanitized.includes('[REDACTED_TELEGRAM_BOT_TOKEN]'))
      assert.ok(!res.sanitized.includes(token))
      assert.strictEqual(res.matchesCount, 1)
    })
  })
})
```

---

### 7. `app/routes/course.ai.tsx` (route, composition)

**Analog:** `app/routes/course.ai.tsx` (lines 87–114)

**Imports addition pattern:**
```typescript
import { PretrainingTroubleshootingSection } from '@/components/course/pretraining/PretrainingTroubleshootingSection'
import { PretrainingRedactionSection } from '@/components/course/pretraining/PretrainingRedactionSection'
```

**Section Mounting Pattern:**
```typescript
// Inside CourseAiComponent within the {mode === 'pretraining'} container
{mode === 'pretraining' ? (
  <div id="container-pretraining" className="mode-container active">
    <PretrainingHero />
    <PretrainingTargetSection />
    <PretrainingGlossarySection />
    <PretrainingSecuritySection />
    <PretrainingPrerequisitesSection />
    <PretrainingPowerShellSection />
    <PretrainingModulesSection />
    <PretrainingCheckpointsSection />
    <PretrainingReadinessSection
      readiness={readiness}
      onOpenResetModal={() => setIsResetModalOpen(true)}
    />
    {/* Phase 27: Troubleshooting Hub & Secret Token Redaction */}
    <PretrainingTroubleshootingSection />
    <PretrainingRedactionSection />
    <ResetProgressModal
      isOpen={isResetModalOpen}
      onClose={() => setIsResetModalOpen(false)}
      onConfirm={() => {
        resetState()
        setIsResetModalOpen(false)
        showToast(
          'Semua progres dan verifikasi berhasil diatur ulang 🔄',
          'info',
          2500
        )
      }}
    />
  </div>
) : (
  // ... live-class mode
)}
```

---

## Shared Patterns

### 1. Clipboard Copy with Toast Feedback
**Source:** `app/components/course/pretraining/CopyableCodeBlock.tsx` (lines 18–52) & `app/components/ui/Toast.ts`  
**Apply to:** `TroubleshootingCard.tsx` (embedded commands) and `PretrainingRedactionSection.tsx` (sanitized log copy)  
```typescript
import { copyToClipboard } from '@/components/course/pretraining/CopyableCodeBlock'
import { showToast } from '@/components/ui/Toast'

// Robust pattern preserving lines with visual toast confirmation
const success = await copyToClipboard(text)
if (success) {
  showToast('Tersalin ke clipboard! 📋', 'success', 2000)
}
```

### 2. Badge Pill Styling & Accessibility
**Source:** `app/components/course/pretraining/CheckpointGateCard.tsx` (lines 26–40) & `index.html` (lines 2275–2280)  
**Apply to:** Category filter buttons, detection badges, and trouble card category chips  
- Uses `.badge.badge-pill.badge-{neutral|warning|danger|success}`.
- Filter toolbar uses `role="group"`, `aria-label="Filter kategori kendala"`, and `aria-pressed="true|false"` with `tabIndex={0 | -1}` for roving tabindex keyboard navigation.

### 3. Native Node.js Test Runner with Dynamic TS Imports
**Source:** `tests/pretraining-checklist.test.js` (lines 6–10, 47–56)  
**Apply to:** `tests/pretraining-troubleshooting.test.js`  
```javascript
const { describe, it, before } = require('node:test')
const assert = require('node:assert')

describe('Suite', () => {
  let module
  before(async () => {
    module = await import('../app/data/pretrainingTroubleshooting.ts')
  })
})
```

---

## No Analog Found

None. All 7 files have exact or high-quality analogs in the existing codebase.

---

## Metadata

- **Analog search scope:** `app/data/`, `app/components/course/pretraining/`, `app/utils/`, `app/routes/`, `assets/js/`, `tests/`
- **Files scanned:** 12
- **Pattern extraction date:** 2026-09-09
