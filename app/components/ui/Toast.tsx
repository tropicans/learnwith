import { useState, useEffect, useCallback } from 'react'

export type ToastType = 'info' | 'success' | 'warning' | 'danger'

export interface ToastItem {
  id: string
  message: string
  type: ToastType
  duration: number
  isExiting?: boolean
}

export interface ToastEventDetail {
  message: string
  type?: ToastType
  duration?: number
}

// In-memory subscribers for direct React updates
type ToastSubscriber = (toasts: ToastItem[]) => void
const subscribers = new Set<ToastSubscriber>()
let currentToasts: ToastItem[] = []

function notifySubscribers() {
  subscribers.forEach((fn) => fn([...currentToasts]))
}

/**
 * Dispatches a toast notification globally across the application.
 * Dispatches both an in-memory event and a DOM CustomEvent ('app:toast').
 */
export function showToast(
  message: string,
  type: ToastType = 'info',
  duration: number = 3000
): void {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
  const newToast: ToastItem = { id, message, type, duration, isExiting: false }

  currentToasts = [...currentToasts, newToast]
  notifySubscribers()

  // Dispatch DOM CustomEvent if in browser context
  if (typeof window !== 'undefined') {
    const event = new CustomEvent<ToastEventDetail>('app:toast', {
      detail: { message, type, duration },
    })
    window.dispatchEvent(event)
  }

  // Schedule exit animation and removal
  setTimeout(() => {
    // Mark as exiting for slide-out animation
    currentToasts = currentToasts.map((t) =>
      t.id === id ? { ...t, isExiting: true } : t
    )
    notifySubscribers()

    setTimeout(() => {
      currentToasts = currentToasts.filter((t) => t.id !== id)
      notifySubscribers()
    }, 300)
  }, duration)
}

// Legacy / global browser interop
if (typeof window !== 'undefined') {
  ;(window as any).showToast = showToast
}

/**
 * ToastContainer component that renders active toast notifications.
 * Mounts at the root or section level.
 */
export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  // Subscribe to in-memory notifications
  useEffect(() => {
    subscribers.add(setToasts)
    return () => {
      subscribers.delete(setToasts)
    }
  }, [])

  // Listen to window CustomEvent ('app:toast') from external scripts
  const handleCustomEvent = useCallback((event: Event) => {
    const customEvent = event as CustomEvent<ToastEventDetail>
    if (!customEvent.detail) return
    const { message, type = 'info', duration = 3000 } = customEvent.detail
    // If the event was already added through showToast, currentToasts already contains it
    const alreadyExists = currentToasts.some(
      (t) => t.message === message && !t.isExiting
    )
    if (!alreadyExists) {
      showToast(message, type, duration)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.addEventListener('app:toast', handleCustomEvent)
    return () => {
      window.removeEventListener('app:toast', handleCustomEvent)
    }
  }, [handleCustomEvent])

  if (toasts.length === 0) {
    return null
  }

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return '✅'
      case 'warning':
        return '⚠️'
      case 'danger':
        return '🛑'
      case 'info':
      default:
        return 'ℹ️'
    }
  }

  return (
    <div id="toast-container" className="toast-container" aria-live="polite">
      {toasts.map((toast) => {
        const isDanger = toast.type === 'danger'
        return (
          <div
            key={toast.id}
            className={`toast toast-${toast.type} ${toast.isExiting ? 'toast-exit' : 'show'}`}
            style={{
              animation: toast.isExiting
                ? 'toastSlideOut 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
                : undefined,
              ...(isDanger ? { borderLeft: '4px solid var(--color-danger, #ef4444)' } : {}),
            }}
            role="status"
          >
            <span>{getIcon(toast.type)}</span>
            <span>{toast.message}</span>
          </div>
        )
      })}
    </div>
  )
}
