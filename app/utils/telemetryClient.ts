import { ingestParticipantTelemetryFn } from '../server/telemetry.ts'
import type { ParticipantTelemetryInput } from '../schemas/telemetry.ts'

export const CLIENT_ID_STORAGE_KEY = 'learnwith_client_id'

let debounceTimer: ReturnType<typeof setTimeout> | null = null
let pendingPayload: Omit<ParticipantTelemetryInput, 'participantId' | 'clientTimestamp'> | null = null

/**
 * Retrieve or initialize an anonymous, persistent client ID for this browser session.
 */
export function getOrCreateClientId(): string {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return 'usr-guest'
  }

  try {
    const existing = localStorage.getItem(CLIENT_ID_STORAGE_KEY)
    if (existing && existing.trim().length > 0) {
      return existing.trim()
    }

    const randomPart = Math.random().toString(36).substring(2, 10)
    const timestampPart = Date.now().toString(36)
    const newId = `usr-${timestampPart}-${randomPart}`

    localStorage.setItem(CLIENT_ID_STORAGE_KEY, newId)
    return newId
  } catch {
    return 'usr-local-fallback'
  }
}

/**
 * Immediately flush pending or provided telemetry payload to the server.
 * Completely non-blocking with all network/server errors silently suppressed.
 */
export async function flushTelemetryImmediately(
  immediatePayload?: Omit<ParticipantTelemetryInput, 'participantId' | 'clientTimestamp'>
): Promise<boolean> {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
    debounceTimer = null
  }

  const payloadToSend = immediatePayload || pendingPayload
  if (!payloadToSend) return false

  pendingPayload = null

  const fullPayload: ParticipantTelemetryInput = {
    ...payloadToSend,
    participantId: getOrCreateClientId(),
    clientTimestamp: Date.now(),
  }

  try {
    await ingestParticipantTelemetryFn({ data: fullPayload })
    return true
  } catch (err) {
    if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
      console.debug('[TelemetryClient] Heartbeat delivery non-critically suppressed:', err)
    }
    return false
  }
}

/**
 * Send participant telemetry with 500ms debouncing to coalesce rapid checklist clicks.
 * Safe for fire-and-forget invocation from UI callbacks and state hooks.
 */
export function sendParticipantTelemetry(
  payload: Omit<ParticipantTelemetryInput, 'participantId' | 'clientTimestamp'>,
  debounceMs = 500
): void {
  pendingPayload = payload

  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }

  debounceTimer = setTimeout(() => {
    debounceTimer = null
    void flushTelemetryImmediately()
  }, debounceMs)
}

/**
 * Test helper to reset internal client state.
 */
export function resetTelemetryClientForTesting(): void {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
    debounceTimer = null
  }
  pendingPayload = null
}
