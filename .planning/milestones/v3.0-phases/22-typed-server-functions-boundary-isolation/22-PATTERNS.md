# Phase 22: Typed Server Functions & Boundary Isolation - Pattern Map

**Phase:** 22 - Typed Server Functions & Boundary Isolation  
**Status:** Ready for Planning  
**Target Directory:** `.planning/phases/22-typed-server-functions-boundary-isolation/`

---

## Executive Summary

This document establishes the architecture patterns, security boundaries, and code blueprints for Phase 22. It specifies the server-only configuration module (`app/server/config.ts`), typed RPC functions with Zod validation (`app/server/auth.ts`, `app/server/diagnostics.ts`), shared schema contracts (`app/schemas/serverFn.ts`), client modal integration (`app/components/course/InstructorUnlockModal.tsx`), and automated boundary isolation test suites.

---

## File Classification & Architectural Boundaries

| File Path | Role | Boundary | Action | Analogs / Precedents |
|---|---|---|---|---|
| `app/schemas/serverFn.ts` | Zod Schemas for RPC Requests & Responses | Shared / Isomorphic Contract | Create | `app/schemas/searchParams.ts` |
| `app/server/config.ts` | Server-Only Environment & Secret Hashing | Server-Only Boundary (`node:crypto`) | Create | `assets/js/app.js` (legacy `DEFAULT_WORD_PASSCODE_HASHES`) |
| `app/server/auth.ts` | Passkey Verification `createServerFn` RPC | Server-to-Client Boundary | Create | TanStack Start `createServerFn` authentication guides |
| `app/server/diagnostics.ts` | Telemetry & Health `createServerFn` RPC | Server-to-Client Boundary | Create | TanStack Start `createServerFn` RPC pattern |
| `app/components/course/InstructorUnlockModal.tsx` | Instructor Passkey Dialog | Client UI Component | Create | `assets/js/app.js` (`modal-liveclass-locked`) |
| `app/routes/course.ai.tsx` | Agentic AI Workspace | Route & RPC Consumer | Modify | Phase 21 `course.ai.tsx` |
| `app/routes/course.word.tsx` | Word ASN Workspace | Route & RPC Consumer | Modify | Phase 21 `course.word.tsx` |
| `tests/server-functions.test.js` | RPC Unit / Integration Tests | Automated Test Suite | Create | `tests/session-security.test.js` |
| `tests/server-boundary-audit.test.js` | Bundle Leakage & Boundary Audit | Automated Audit Suite | Create | `tests/csp-dom-security.test.js` |

---

## Pattern Blueprints

### 1. Shared Schemas (`app/schemas/serverFn.ts`)
Strict runtime contracts governing RPC input payloads:
```typescript
import { z } from 'zod'

export const verifyPasskeyInputSchema = z.object({
  courseId: z.enum(['ai', 'word']),
  passkey: z.string().trim().min(1, 'Passkey wajib diisi').max(100, 'Passkey terlalu panjang'),
})

export type VerifyPasskeyInput = z.infer<typeof verifyPasskeyInputSchema>

export const verifyPasskeyResultSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  unlockedAt: z.number().optional(),
})

export type VerifyPasskeyResult = z.infer<typeof verifyPasskeyResultSchema>

export const diagnosticsInputSchema = z.object({
  includeMemory: z.boolean().default(false),
})

export type DiagnosticsInput = z.infer<typeof diagnosticsInputSchema>
```

### 2. Quarantined Server Configuration (`app/server/config.ts`)
Isolates sensitive hash matching and Node.js built-in cryptography:
```typescript
import crypto from 'node:crypto'

// Default hashes matching legacy test fixtures
const DEFAULT_AI_PASSKEY_HASH = '4452077e60e86b8ee876b509f61b09b52a9261a9953c8965a3c03565e33d26aa' // 'buka-kelas'
const DEFAULT_WORD_PASSKEY_HASH = 'ddf62f4013c59b111215312fb959629155a5b1dc5cf799f2053a8c2395c4511b' // 'buka-kata'

export function getServerConfig() {
  return {
    aiPasskeyHash: process.env.AI_PASSKEY_HASH || DEFAULT_AI_PASSKEY_HASH,
    wordPasskeyHash: process.env.WORD_PASSKEY_HASH || DEFAULT_WORD_PASSKEY_HASH,
    nodeEnv: process.env.NODE_ENV || 'development',
  }
}

export function verifyPasskeyWithHash(courseId: 'ai' | 'word', candidate: string): boolean {
  const config = getServerConfig()
  const targetHash = courseId === 'ai' ? config.aiPasskeyHash : config.wordPasskeyHash
  const candidateHash = crypto
    .createHash('sha256')
    .update(candidate.trim().toLowerCase())
    .digest('hex')

  const targetBuf = Buffer.from(targetHash, 'hex')
  const candidateBuf = Buffer.from(candidateHash, 'hex')

  if (targetBuf.length !== candidateBuf.length) {
    return false
  }

  return crypto.timingSafeEqual(targetBuf, candidateBuf)
}
```

### 3. Passkey Verification RPC (`app/server/auth.ts`)
```typescript
import { createServerFn } from '@tanstack/react-start'
import { verifyPasskeyInputSchema, type VerifyPasskeyResult } from '@/schemas/serverFn'
import { verifyPasskeyWithHash } from './config'

export const verifyInstructorPasskeyFn = createServerFn({ method: 'POST' })
  .validator((data: unknown) => verifyPasskeyInputSchema.parse(data))
  .handler(async ({ data }): Promise<VerifyPasskeyResult> => {
    const isAuthorized = verifyPasskeyWithHash(data.courseId, data.passkey)

    if (!isAuthorized) {
      return {
        success: false,
        message: 'Passkey instruktur tidak valid atau salah.',
      }
    }

    return {
      success: true,
      message: 'Sesi instruktur berhasil diverifikasi.',
      unlockedAt: Date.now(),
    }
  })
```

### 4. Diagnostics & Health Telemetry RPC (`app/server/diagnostics.ts`)
```typescript
import { createServerFn } from '@tanstack/react-start'
import { diagnosticsInputSchema } from '@/schemas/serverFn'
import { getServerConfig } from './config'

export const getSystemDiagnosticsFn = createServerFn({ method: 'GET' })
  .validator((data: unknown) => diagnosticsInputSchema.parse(data || {}))
  .handler(async ({ data }) => {
    const config = getServerConfig()

    return {
      status: 'healthy' as const,
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      environment: config.nodeEnv,
      memory: data.includeMemory
        ? {
            rssMb: Math.round(process.memoryUsage().rss / (1024 * 1024)),
            heapUsedMb: Math.round(process.memoryUsage().heapUsed / (1024 * 1024)),
          }
        : undefined,
    }
  })
```

### 5. Client Modal Component (`app/components/course/InstructorUnlockModal.tsx`)
```tsx
import { useState } from 'react'
import { verifyInstructorPasskeyFn } from '@/server/auth'

interface InstructorUnlockModalProps {
  courseId: 'ai' | 'word'
  isOpen: boolean
  onClose: () => void
  onUnlocked: () => void
}

export function InstructorUnlockModal({
  courseId,
  isOpen,
  onClose,
  onUnlocked,
}: InstructorUnlockModalProps) {
  const [passkey, setPasskey] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isPending, setIsPending] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')
    setIsPending(true)

    try {
      const result = await verifyInstructorPasskeyFn({
        data: { courseId, passkey },
      })

      if (result.success) {
        onUnlocked()
        onClose()
      } else {
        setErrorMessage(result.message)
      }
    } catch {
      setErrorMessage('Terjadi kesalahan saat memverifikasi passkey.')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="modal modal-locked open" role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Buka Sesi Praktik Kelas Instruktur</h3>
        <p>Masukkan passkey instruktur yang diberikan untuk mengakses materi penuh.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={passkey}
            onChange={(e) => setPasskey(e.target.value)}
            placeholder="Passkey instruktur"
            disabled={isPending}
            autoFocus
          />
          {errorMessage && <div className="feedback-error">{errorMessage}</div>}
          <div className="modal-actions">
            <button type="button" onClick={onClose} disabled={isPending}>Batal</button>
            <button type="submit" disabled={isPending}>
              {isPending ? 'Memverifikasi...' : 'Buka Kunci'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
```