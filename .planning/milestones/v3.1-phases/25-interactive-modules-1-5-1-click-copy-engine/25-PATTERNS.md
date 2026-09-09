# Phase 25 Pattern Mapping: Interactive Modules 1–5 & 1-Click Copy Engine

**Phase**: 25  
**Directory**: `.planning/phases/25-interactive-modules-1-5-1-click-copy-engine`  
**Purpose**: Map concrete, verified code patterns from existing codebase files to all new files and modifications required for Phase 25. This document serves as the implementation blueprint for the planner and executor.

---

## 1. File Inventory & Analogs Mapping

| Target File to Create / Modify | Primary Codebase Analog | Secondary Analog / Source | Key Architectural Responsibilities |
| :--- | :--- | :--- | :--- |
| `app/data/pretrainingModules.ts` | `app/data/pretrainingFoundation.ts` | `index.html` (lines 1099–1960) | Strongly typed TypeScript data definitions, interfaces, step models, checkpoints, command code strings, and alert content for Modules 1–5. |
| `app/components/course/pretraining/CopyableCodeBlock.tsx` | `app/components/course/pretraining/PretrainingPowerShellSection.tsx` | `assets/js/app.js` (lines 230–279) & `public/assets/css/components.css` (lines 203–274) | Terminal chrome header (macOS dots or badge), mono code pre/code block, copy button with 2000ms visual state transition, clipboard API with legacy textarea fallback, non-blocking toast triggering. |
| `app/components/ui/Toast.tsx` | `public/assets/css/components.css` (lines 739–795) | `assets/js/app.js` (lines 500–528) | Toast dispatcher (`showToast`), toast container component, auto-dismiss timeout (default 2000–3000ms), slide-in/out animations, danger/success/warning/info variants. |
| `app/components/course/pretraining/CheckpointPreviewCard.tsx` | `app/components/course/pretraining/PretrainingTargetSection.tsx` (lines 50–60) | `index.html` (lines 1240–1256, 1433–1443, 1700–1715) | Distinctive preview card for Checkpoints 1, 2, and 3 with target milestone badge, checklist summary, and green success border. |
| `app/components/course/pretraining/ModuleArchitectureFlow.tsx` | `index.html` (lines 1905–1945) | `public/assets/css/components.css` (lines 1257–1330) | Interactive 4-node architecture diagram component for Modul 5 (Telegram Ponsel -> Hermes Agent -> 9Router -> Model AI Cloud) with hover feedback and responsive flex direction. |
| `app/components/course/pretraining/PretrainingModuleCard.tsx` | `app/components/course/pretraining/PretrainingSecuritySection.tsx` | `public/assets/css/components.css` (lines 925–1040) & `assets/js/app.js` (lines 535–560) | Collapsible module card container with header icon badge, title/meta, chevron animation, accessible ARIA attributes (`role="button"`, `aria-expanded`, `aria-controls`), keyboard listener (`Enter` / `Space`), and step sections. |
| `app/components/course/pretraining/PretrainingModulesSection.tsx` | `app/components/course/pretraining/PretrainingPrerequisitesSection.tsx` | `index.html` (lines 1086–1094) & `assets/js/app.js` (lines 580–598) | Top-level container `#dynamic-modules-container` hosting Master Controls (`#btn-expand-all-modules`, `#btn-collapse-all-modules`), accordion state orchestration, and sequentially rendering Modules 1 through 5. |
| `app/routes/course.ai.tsx` (Modifications) | `app/routes/course.ai.tsx` (lines 79–88) | - | Mount `<PretrainingModulesSection />` immediately below `<PretrainingPowerShellSection />` within `#container-pretraining`. |
| `tests/pretraining-modules.test.js` | `tests/pretraining-foundation.test.js` | - | Node.js native test runner test suite verifying data structures, step counts, command integrity, component file existence, and route mounting. |

---

## 2. Pattern 1: Strongly-Typed Data Architecture (`app/data/pretrainingModules.ts`)

### 2.1 Analog Reference: `app/data/pretrainingFoundation.ts`
`app/data/pretrainingFoundation.ts` defines explicit TypeScript interfaces for all data structures before exporting strongly-typed constants with 100% fidelity to `index.html`.

### 2.2 Concrete Implementation Pattern
```typescript
// app/data/pretrainingModules.ts

export type AlertType = 'info' | 'warning' | 'danger' | 'success'

export interface StepAlert {
  type: AlertType
  icon: string
  title: string
  content: string
  bullets?: string[]
  note?: string
}

export interface StepLink {
  url: string
  label: string
  isExternal: boolean
  note?: string
}

export interface ModuleStep {
  nodeId: string // e.g. "A", "B", "1", "2"
  title: string
  badgeLabel: string
  badgeClass?: string
  description: string
  command?: string
  commandLanguage?: string
  outputBadge?: {
    label: string
    value: string
  }
  instructions?: string[]
  externalLink?: StepLink
  alerts?: StepAlert[]
  taskId: string // data-task-id e.g. "m1-check-node"
  checklistLabel: string
}

export interface CheckpointPreview {
  checkpointNum: number
  title: string
  badge: string
  description: string
  requirements: string[]
  note?: string
}

export interface PretrainingModule {
  id: string // e.g. "sec-module-1"
  num: number // 1 to 5
  title: string
  subtitle: string
  icon: string
  badgeLabel: string // e.g. "3 Langkah", "Wajib Dibaca"
  badgeClass: string
  steps: ModuleStep[]
  checkpoint?: CheckpointPreview
  hasArchFlow?: boolean // specifically for Module 5
}

export const PRETRAINING_MODULES: PretrainingModule[] = [
  // Module 1: Node.js (3 steps, Checkpoint 1)
  // Module 2: 9Router (4 steps, Checkpoint 2)
  // Module 3: Bot Telegram & User ID (5 steps, Checkpoint 3)
  // Module 4: Google Cloud Account & Hermes Readiness (2 steps)
  // Module 5: Pra-Kelas Boundaries & Architecture Flow (3 sections)
]
```

### 2.3 Rules to Observe
- Task IDs (`taskId`) must precisely match the prototype: `m1-check-node`, `m1-verify-lts`, `m1-check-npm`, `m2-install-pkg`, `m2-start-service`, `m2-open-dashboard`, `m2-verify-local`, `m3-start-botfather`, `m3-create-newbot`, `m3-save-token-secure`, `m3-get-userid`, `m4-open-console`, `m4-verify-login`.
- Preserve command text exactly without whitespace distortion or unnecessary comment wrapping (e.g. `npm install -g 9router`, `9router`, `node --version`, `npm --version`, `/newbot`, `/revoke`).

---

## 3. Pattern 2: 1-Click Copy Engine (`CopyableCodeBlock.tsx`)

### 3.1 Analog Reference: `assets/js/app.js` (lines 230–279) & `components.css` (lines 203–274)
In `assets/js/app.js`, the copy logic checks `navigator.clipboard && window.isSecureContext`, falls back to `textarea.select() + document.execCommand('copy')`, updates button classes to `.copied`, changes text to `✓ Tersalin!`, and dispatches `showToast`.

### 3.2 Concrete Implementation Pattern
```tsx
// app/components/course/pretraining/CopyableCodeBlock.tsx
import { useState, useCallback } from 'react'
import { showToast } from '@/components/ui/Toast'

export interface CopyableCodeBlockProps {
  code: string
  language?: string
  showDots?: boolean
  label?: string
  toastMessage?: string
}

export async function copyToClipboard(text: string): Promise<boolean> {
  // Trim outer boundaries, preserve interior newlines/whitespace
  const cleanedText = text.replace(/^\n+|\n+$/g, '')
  
  if (typeof window !== 'undefined' && navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(cleanedText)
      return true
    } catch {
      // Fallback below
    }
  }

  // Fallback for non-https or restricted environments
  if (typeof document !== 'undefined') {
    try {
      const textarea = document.createElement('textarea')
      textarea.value = cleanedText
      textarea.style.position = 'fixed'
      textarea.style.left = '-9999px'
      textarea.style.top = '-9999px'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.focus()
      textarea.select()
      const success = document.execCommand('copy')
      document.body.removeChild(textarea)
      return success
    } catch {
      return false
    }
  }

  return false
}

export function CopyableCodeBlock({
  code,
  language = 'PowerShell',
  showDots = true,
  label,
  toastMessage = 'Perintah berhasil disalin ke clipboard 📋',
}: CopyableCodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    const success = await copyToClipboard(code)
    if (success) {
      setIsCopied(true)
      showToast(toastMessage, 'success', 2200)
      setTimeout(() => {
        setIsCopied(false)
      }, 2000)
    } else {
      showToast('Gagal menyalin perintah secara otomatis', 'warning', 2500)
    }
  }, [code, toastMessage])

  return (
    <div className="code-container">
      <div className="code-header">
        {showDots ? (
          <div className="code-dots">
            <span className="code-dot red"></span>
            <span className="code-dot yellow"></span>
            <span className="code-dot green"></span>
          </div>
        ) : null}
        <span className="code-label">{label || language}</span>
        <button
          type="button"
          className={`code-copy-btn ${isCopied ? 'copied' : ''}`}
          onClick={handleCopy}
          aria-label="Salin perintah"
        >
          <span>{isCopied ? '✓ Tersalin!' : '📋 Salin Perintah'}</span>
        </button>
      </div>
      <pre className="code-content">
        <code>{code}</code>
      </pre>
    </div>
  )
}
```

### 3.3 Reused CSS Rules
- Container: `.code-container` (`background: var(--bg-terminal); border: 1px solid rgba(255, 255, 255, 0.1);`)
- Dots: `.code-dots`, `.code-dot.red`, `.code-dot.yellow`, `.code-dot.green`
- Button: `.code-copy-btn` and `.code-copy-btn.copied` (`background: var(--action-success); color: #ffffff;`)

---

## 4. Pattern 3: Toast Notification Component & Dispatcher (`app/components/ui/Toast.tsx`)

### 4.1 Analog Reference: `public/assets/css/components.css` (lines 739–795) & `assets/js/app.js` (lines 500–528)
CSS classes `.toast-container`, `.toast`, `.toast-success`, `.toast-info`, `.toast-warning`, `@keyframes toastSlideIn`, `@keyframes toastSlideOut` already exist in `components.css`.

### 4.2 Concrete Implementation Pattern
```tsx
// app/components/ui/Toast.tsx
import { useState, useEffect } from 'react'

export type ToastType = 'info' | 'success' | 'warning'

export interface ToastItem {
  id: string
  message: string
  type: ToastType
  duration: number
}

type ToastListener = (toasts: ToastItem[]) => void
const listeners: Set<ToastListener> = new Set()
let activeToasts: ToastItem[] = []

export function showToast(message: string, type: ToastType = 'info', duration: number = 3000) {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
  const item: ToastItem = { id, message, type, duration }
  activeToasts = [...activeToasts, item]
  listeners.forEach((fn) => fn(activeToasts))

  setTimeout(() => {
    activeToasts = activeToasts.filter((t) => t.id !== id)
    listeners.forEach((fn) => fn(activeToasts))
  }, duration)
}

// Attach to window for legacy interoperability if needed
if (typeof window !== 'undefined') {
  ;(window as any).showToast = showToast
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  useEffect(() => {
    listeners.add(setToasts)
    return () => {
      listeners.delete(setToasts)
    }
  }, [])

  if (toasts.length === 0) return null

  const getIcon = (type: ToastType) => {
    if (type === 'success') return '✅'
    if (type === 'warning') return '⚠️'
    return 'ℹ️'
  }

  return (
    <div id="toast-container" className="toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`} role="status">
          <span>{getIcon(toast.type)}</span>
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  )
}
```

---

## 5. Pattern 4: Module Card Accordion & Step Rendering (`PretrainingModuleCard.tsx`)

### 5.1 Analog Reference: `PretrainingSecuritySection.tsx` & `components.css` (lines 925–1040)
`PretrainingModuleCard` renders a `.module-card` which toggles the `.collapsed` class. Inside is `.module-header` (with accessibility attributes), followed by `.module-body` containing `.step-section` elements.

### 5.2 Concrete Implementation Pattern
```tsx
// app/components/course/pretraining/PretrainingModuleCard.tsx
import type { PretrainingModule } from '@/data/pretrainingModules'
import { CopyableCodeBlock } from './CopyableCodeBlock'
import { CheckpointPreviewCard } from './CheckpointPreviewCard'
import { ModuleArchitectureFlow } from './ModuleArchitectureFlow'

export interface PretrainingModuleCardProps {
  module: PretrainingModule
  isExpanded: boolean
  onToggle: () => void
}

export function PretrainingModuleCard({
  module,
  isExpanded,
  onToggle,
}: PretrainingModuleCardProps) {
  return (
    <section id={module.id} className="content-section">
      <div className={`module-card ${isExpanded ? 'active-module' : 'collapsed'}`}>
        <div
          className="module-header"
          role="button"
          tabIndex={0}
          aria-expanded={isExpanded}
          aria-controls={`module-body-${module.num}`}
          onClick={onToggle}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onToggle()
            }
          }}
        >
          <div className="module-header-main">
            <div className="module-icon-badge">{module.icon}</div>
            <div className="module-title-group">
              <h3>{module.title}</h3>
              <p>{module.subtitle}</p>
            </div>
          </div>
          <div className="module-header-meta">
            <span className={`badge badge-pill ${module.badgeClass}`}>
              {module.badgeLabel}
            </span>
            <span className="module-chevron" aria-hidden="true">
              ▼
            </span>
          </div>
        </div>

        {isExpanded && (
          <div id={`module-body-${module.num}`} className="module-body">
            {module.steps.map((step) => (
              <div key={step.nodeId} className="step-section">
                <div className="step-section-node">{step.nodeId}</div>
                <div className="step-section-title">
                  <span>{step.title}</span>
                  <span className={`badge badge-pill ${step.badgeClass || 'badge-neutral'}`}>
                    {step.badgeLabel}
                  </span>
                </div>

                <p className="card-body">{step.description}</p>

                {step.command && (
                  <CopyableCodeBlock
                    code={step.command}
                    language={step.commandLanguage || 'PowerShell'}
                  />
                )}

                {step.outputBadge && (
                  <div className="command-output-badge">
                    <span>{step.outputBadge.label}</span>{' '}
                    <code>{step.outputBadge.value}</code>
                  </div>
                )}

                {step.externalLink && (
                  <div style={{ margin: '0.5rem 0 1rem 0' }}>
                    <a
                      href={step.externalLink.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="external-link"
                    >
                      🔗 {step.externalLink.label}
                    </a>
                  </div>
                )}

                {step.instructions && step.instructions.length > 0 && (
                  <ol className="step-instruction-list">
                    {step.instructions.map((inst, idx) => (
                      <li key={idx} dangerouslySetInnerHTML={{ __html: inst }} />
                    ))}
                  </ol>
                )}

                {step.alerts?.map((alert, aIdx) => (
                  <div key={aIdx} className={`alert-box alert-${alert.type}`}>
                    <div className="alert-icon">{alert.icon}</div>
                    <div className="alert-content">
                      <h5>{alert.title}</h5>
                      <p>{alert.content}</p>
                      {alert.bullets && (
                        <ul style={{ margin: '0.35rem 0 0 1.25rem' }}>
                          {alert.bullets.map((b, bIdx) => (
                            <li key={bIdx} dangerouslySetInnerHTML={{ __html: b }} />
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}

                <label className="step-checklist-action">
                  <input
                    type="checkbox"
                    className="checklist-checkbox"
                    data-task-id={step.taskId}
                    disabled
                  />
                  <span className="checklist-label">{step.checklistLabel}</span>
                </label>
              </div>
            ))}

            {module.hasArchFlow && <ModuleArchitectureFlow />}
            {module.checkpoint && (
              <CheckpointPreviewCard checkpoint={module.checkpoint} />
            )}
          </div>
        )}
      </div>
    </section>
  )
}
```

---

## 6. Pattern 5: Architecture Flow Diagram (`ModuleArchitectureFlow.tsx`)

### 6.1 Analog Reference: `index.html` (lines 1905–1945) & `components.css` (lines 1257–1330)
Modul 5 includes an interactive 4-node diagram showing data flow between mobile Telegram, local Hermes Agent, 9Router, and Cloud AI models.

### 6.2 Concrete Implementation Pattern
```tsx
// app/components/course/pretraining/ModuleArchitectureFlow.tsx
export function ModuleArchitectureFlow() {
  return (
    <div className="arch-flow-container">
      <div className="arch-node">
        <div className="arch-node-icon">📱</div>
        <div className="arch-node-title">Telegram Ponsel</div>
        <div className="arch-node-desc">
          Anda mengetik instruksi jadwal meeting ke Bot Telegram
        </div>
      </div>

      <div className="arch-arrow">
        <span className="arch-arrow-label">Kirim Pesan</span>
        <span>──▶</span>
      </div>

      <div className="arch-node">
        <div className="arch-node-icon">🤖</div>
        <div className="arch-node-title">Hermes Agent</div>
        <div className="arch-node-desc">
          Berjalan di laptop Anda sebagai asisten cerdas
        </div>
      </div>

      <div className="arch-arrow">
        <span className="arch-arrow-label">
          OpenAI Endpoint<br />
          <code>:20128/v1</code>
        </span>
        <span>──▶</span>
      </div>

      <div className="arch-node">
        <div className="arch-node-icon">🚀</div>
        <div className="arch-node-title">9Router</div>
        <div className="arch-node-desc">
          Perute lokal menghubungkan agen ke model AI
        </div>
      </div>

      <div className="arch-arrow">
        <span className="arch-arrow-label">Proses Bahasa</span>
        <span>──▶</span>
      </div>

      <div className="arch-node">
        <div className="arch-node-icon">🧠</div>
        <div className="arch-node-title">Model AI Cloud</div>
        <div className="arch-node-desc">
          Menganalisis jadwal & mengeksekusi Google Calendar
        </div>
      </div>
    </div>
  )
}
```

---

## 7. Pattern 6: Checkpoint Preview Card (`CheckpointPreviewCard.tsx`)

### 7.1 Analog Reference: `index.html` (lines 1241–1256, 1434–1443, 1701–1715)
### 7.2 Concrete Implementation Pattern
```tsx
// app/components/course/pretraining/CheckpointPreviewCard.tsx
import type { CheckpointPreview } from '@/data/pretrainingModules'

export function CheckpointPreviewCard({ checkpoint }: { checkpoint: CheckpointPreview }) {
  return (
    <div
      className="card card-glass"
      style={{ borderLeft: '4px solid var(--color-success)', marginTop: '1rem' }}
    >
      <div className="card-header">
        <h4 className="card-title" style={{ color: 'var(--color-success)' }}>
          {checkpoint.title}
        </h4>
        <span className="badge badge-pill badge-success">{checkpoint.badge}</span>
      </div>
      <div className="card-body">
        <p>{checkpoint.description}</p>
        {checkpoint.requirements && checkpoint.requirements.length > 0 && (
          <ul style={{ margin: '0.5rem 0 0 1.25rem', color: 'var(--text-secondary)' }}>
            {checkpoint.requirements.map((req, idx) => (
              <li key={idx} dangerouslySetInnerHTML={{ __html: req }} />
            ))}
          </ul>
        )}
        {checkpoint.note && (
          <p
            style={{
              marginTop: '0.75rem',
              fontSize: 'var(--font-size-xs)',
              color: 'var(--text-muted)',
            }}
            dangerouslySetInnerHTML={{ __html: checkpoint.note }}
          />
        )}
      </div>
    </div>
  )
}
```

---

## 8. Pattern 7: Master Accordion Section Container (`PretrainingModulesSection.tsx`)

### 8.1 Analog Reference: `index.html` (lines 1086–1094) & `assets/js/app.js` (lines 580–598)
Controls all 5 modules simultaneously via "Buka Semua Modul" and "Tutup Semua Modul" buttons while allowing individual toggles.

### 8.2 Concrete Implementation Pattern
```tsx
// app/components/course/pretraining/PretrainingModulesSection.tsx
import { useState } from 'react'
import { PRETRAINING_MODULES } from '@/data/pretrainingModules'
import { PretrainingModuleCard } from './PretrainingModuleCard'
import { showToast } from '@/components/ui/Toast'

export function PretrainingModulesSection() {
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    'sec-module-1': true,
    'sec-module-2': true,
    'sec-module-3': true,
    'sec-module-4': true,
    'sec-module-5': true,
  })

  const handleToggleModule = (id: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handleExpandAll = () => {
    const updated: Record<string, boolean> = {}
    PRETRAINING_MODULES.forEach((m) => {
      updated[m.id] = true
    })
    setExpandedModules(updated)
    showToast('Semua modul dibuka 📖', 'info', 1800)
  }

  const handleCollapseAll = () => {
    const updated: Record<string, boolean> = {}
    PRETRAINING_MODULES.forEach((m) => {
      updated[m.id] = false
    })
    setExpandedModules(updated)
    showToast('Semua modul disembunyikan 📁', 'info', 1800)
  }

  return (
    <div id="dynamic-modules-container">
      {/* Global Expand/Collapse Module Controls */}
      <div className="module-controls">
        <button
          id="btn-expand-all-modules"
          type="button"
          className="btn btn-sm btn-outline"
          onClick={handleExpandAll}
        >
          <span>📖</span> Buka Semua Modul
        </button>
        <button
          id="btn-collapse-all-modules"
          type="button"
          className="btn btn-sm btn-outline"
          onClick={handleCollapseAll}
        >
          <span>📁</span> Tutup Semua Modul
        </button>
      </div>

      {PRETRAINING_MODULES.map((module) => (
        <PretrainingModuleCard
          key={module.id}
          module={module}
          isExpanded={!!expandedModules[module.id]}
          onToggle={() => handleToggleModule(module.id)}
        />
      ))}
    </div>
  )
}
```

---

## 9. Pattern 8: Route & Root Integration

### 9.1 `app/routes/course.ai.tsx`
Import and place `PretrainingModulesSection` right after `PretrainingPowerShellSection` within `#container-pretraining`:
```tsx
// app/routes/course.ai.tsx
import { PretrainingHero } from '@/components/course/pretraining/PretrainingHero'
import { PretrainingTargetSection } from '@/components/course/pretraining/PretrainingTargetSection'
import { PretrainingGlossarySection } from '@/components/course/pretraining/PretrainingGlossarySection'
import { PretrainingSecuritySection } from '@/components/course/pretraining/PretrainingSecuritySection'
import { PretrainingPrerequisitesSection } from '@/components/course/pretraining/PretrainingPrerequisitesSection'
import { PretrainingPowerShellSection } from '@/components/course/pretraining/PretrainingPowerShellSection'
import { PretrainingModulesSection } from '@/components/course/pretraining/PretrainingModulesSection'

// In pretraining render block:
{mode === 'pretraining' ? (
  <div id="container-pretraining" className="mode-container active">
    <PretrainingHero />
    <PretrainingTargetSection />
    <PretrainingGlossarySection />
    <PretrainingSecuritySection />
    <PretrainingPrerequisitesSection />
    <PretrainingPowerShellSection />
    <PretrainingModulesSection />
  </div>
) : ...
```

### 9.2 `app/routes/__root.tsx`
Add `<ToastContainer />` inside `RootComponent` to ensure non-blocking toast notifications appear across the entire application:
```tsx
// app/routes/__root.tsx
import { ToastContainer } from '@/components/ui/Toast'

function RootComponent() {
  return (
    <RootDocument>
      <div className="app-container">
        <Header />
        <Outlet />
      </div>
      <ToastContainer />
    </RootDocument>
  )
}
```

---

## 10. Pattern 9: Automated Test Suite (`tests/pretraining-modules.test.js`)

### 10.1 Analog Reference: `tests/pretraining-foundation.test.js`
Uses Node.js native test runner (`node:test`, `node:assert`) and dynamic `import()` for TypeScript modules.

### 10.2 Concrete Test Specifications
```javascript
// tests/pretraining-modules.test.js
const { describe, it, before } = require('node:test')
const assert = require('node:assert')
const fs = require('node:fs')
const path = require('node:path')

describe('Phase 25 Interactive Modules 1-5 & Copy Engine Suite (PRE-MOD-01..06)', () => {
  let modulesData

  before(async () => {
    modulesData = await import('../app/data/pretrainingModules.ts')
  })

  describe('Suite 1: Data Model Validation (app/data/pretrainingModules.ts)', () => {
    it('exports exactly 5 modules with correct numbering and IDs', () => {
      const modules = modulesData.PRETRAINING_MODULES
      assert.strictEqual(modules.length, 5)
      assert.strictEqual(modules[0].id, 'sec-module-1')
      assert.strictEqual(modules[1].id, 'sec-module-2')
      assert.strictEqual(modules[2].id, 'sec-module-3')
      assert.strictEqual(modules[3].id, 'sec-module-4')
      assert.strictEqual(modules[4].id, 'sec-module-5')
    })

    it('validates Module 1 (Node.js & npm) structure (PRE-MOD-01)', () => {
      const m1 = modulesData.PRETRAINING_MODULES[0]
      assert.strictEqual(m1.steps.length, 3)
      assert.strictEqual(m1.steps[0].taskId, 'm1-check-node')
      assert.strictEqual(m1.steps[0].command, 'node --version')
      assert.strictEqual(m1.steps[1].taskId, 'm1-verify-lts')
      assert.strictEqual(m1.steps[2].taskId, 'm1-check-npm')
      assert.strictEqual(m1.steps[2].command, 'npm --version')
      assert.ok(m1.checkpoint, 'Checkpoint 1 must exist')
      assert.strictEqual(m1.checkpoint.checkpointNum, 1)
    })

    it('validates Module 2 (9Router) structure (PRE-MOD-02)', () => {
      const m2 = modulesData.PRETRAINING_MODULES[1]
      assert.strictEqual(m2.steps.length, 4)
      assert.strictEqual(m2.steps[0].taskId, 'm2-install-pkg')
      assert.strictEqual(m2.steps[0].command, 'npm install -g 9router')
      assert.strictEqual(m2.steps[1].taskId, 'm2-start-service')
      assert.strictEqual(m2.steps[1].command, '9router')
      assert.strictEqual(m2.steps[2].taskId, 'm2-open-dashboard')
      assert.strictEqual(m2.steps[3].taskId, 'm2-verify-local')
      assert.ok(m2.checkpoint, 'Checkpoint 2 must exist')
    })

    it('validates Module 3 (Bot Telegram) structure (PRE-MOD-03)', () => {
      const m3 = modulesData.PRETRAINING_MODULES[2]
      assert.strictEqual(m3.steps.length, 5)
      assert.strictEqual(m3.steps[0].taskId, 'm3-start-botfather')
      assert.strictEqual(m3.steps[1].taskId, 'm3-create-newbot')
      assert.strictEqual(m3.steps[1].command, '/newbot')
      assert.strictEqual(m3.steps[2].taskId, 'm3-save-token-secure')
      assert.strictEqual(m3.steps[4].taskId, 'm3-get-userid')
      assert.ok(m3.checkpoint, 'Checkpoint 3 must exist')
    })

    it('validates Module 4 (Google Cloud Account) structure (PRE-MOD-04)', () => {
      const m4 = modulesData.PRETRAINING_MODULES[3]
      assert.strictEqual(m4.steps.length, 2)
      assert.strictEqual(m4.steps[0].taskId, 'm4-open-console')
      assert.strictEqual(m4.steps[1].taskId, 'm4-verify-login')
    })

    it('validates Module 5 (Boundaries & Flow) structure (PRE-MOD-05)', () => {
      const m5 = modulesData.PRETRAINING_MODULES[4]
      assert.strictEqual(m5.hasArchFlow, true)
      assert.ok(m5.steps.length >= 2)
    })
  })

  describe('Suite 2: Component Architecture & File Parity', () => {
    const compDir = path.resolve(__dirname, '../app/components/course/pretraining')
    const uiDir = path.resolve(__dirname, '../app/components/ui')
    const routeFile = path.resolve(__dirname, '../app/routes/course.ai.tsx')

    it('verifies all component files exist', () => {
      const expectedFiles = [
        path.join(compDir, 'CopyableCodeBlock.tsx'),
        path.join(compDir, 'PretrainingModuleCard.tsx'),
        path.join(compDir, 'PretrainingModulesSection.tsx'),
        path.join(compDir, 'ModuleArchitectureFlow.tsx'),
        path.join(compDir, 'CheckpointPreviewCard.tsx'),
        path.join(uiDir, 'Toast.tsx'),
      ]
      for (const file of expectedFiles) {
        assert.ok(fs.existsSync(file), `File ${file} must exist`)
      }
    })

    it('verifies route mounting in app/routes/course.ai.tsx', () => {
      const content = fs.readFileSync(routeFile, 'utf8')
      assert.ok(content.includes('PretrainingModulesSection'))
      assert.ok(content.includes('<PretrainingModulesSection'))
    })
  })
})
```

---

## 11. Verification Commands
```powershell
# 1. Execute dedicated unit test suite for Phase 25
& C:\nvm4w\nodejs\node.exe --test tests/pretraining-modules.test.js

# 2. Execute full test suite to guarantee zero regression
& C:\nvm4w\nodejs\node.exe --test tests/*.test.js

# 3. Verify TypeScript strict type-checking
& C:\nvm4w\nodejs\node.exe ./node_modules/typescript/bin/tsc --noEmit
```
