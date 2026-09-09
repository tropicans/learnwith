import { useState, useCallback } from 'react'
import { showToast } from '@/components/ui/Toast'

export interface CopyableCodeBlockProps {
  code: string
  language?: string
  label?: string
  ariaLabel?: string
  showDots?: boolean
  className?: string
  toastMessage?: string
}

/**
 * Robust copy helper supporting navigator.clipboard with legacy textarea fallback.
 * Strictly preserves internal newlines and whitespace formatting.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // Trim only outer bounding newlines, preserving indentation and inner line breaks
  const cleanedText = text.replace(/^\n+|\n+$/g, '')

  if (typeof window !== 'undefined' && navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(cleanedText)
      return true
    } catch {
      // Continue to fallback below
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
  label,
  ariaLabel = 'Salin perintah',
  showDots = true,
  className = '',
  toastMessage = 'Perintah berhasil disalin ke clipboard 📋',
}: CopyableCodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    const success = await copyToClipboard(code)
    if (success) {
      setIsCopied(true)
      showToast(toastMessage, 'success', 2000)
      setTimeout(() => {
        setIsCopied(false)
      }, 2000)
    } else {
      showToast('Gagal menyalin perintah secara otomatis', 'warning', 2500)
    }
  }, [code, toastMessage])

  return (
    <div className={`code-container ${className}`.trim()}>
      <div className="code-header">
        {showDots && (
          <div className="code-dots">
            <span className="code-dot red" />
            <span className="code-dot yellow" />
            <span className="code-dot green" />
          </div>
        )}
        <span className="code-label">{label || language}</span>
        <button
          type="button"
          className={`code-copy-btn ${isCopied ? 'copied' : ''}`}
          onClick={handleCopy}
          aria-label={ariaLabel}
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
