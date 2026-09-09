import { useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import type { PublicPlatformConfig } from '../../schemas/platformConfig.ts'
import { getPublicPlatformConfigFn } from '../../server/platform.ts'

export const BANNER_DISMISS_KEY = 'learnwith_dismissed_banner_id'

export function GlobalAnnouncementBanner() {
  const [config, setConfig] = useState<PublicPlatformConfig | null>(null)
  const [isDismissed, setIsDismissed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function loadConfig() {
      try {
        const data = await getPublicPlatformConfigFn()
        if (!isMounted) return

        let dismissed = false
        if (typeof window !== 'undefined' && data?.banner?.id) {
          try {
            const storedId = localStorage.getItem(BANNER_DISMISS_KEY)
            if (storedId === data.banner.id) {
              dismissed = true
            }
          } catch {
            // Fail silently on storage access restrictions
          }
        }

        setConfig(data)
        setIsDismissed(dismissed)
      } catch {
        // Non-blocking error handling: fail silently without throwing or rendering error banner
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadConfig()
    return () => {
      isMounted = false
    }
  }, [])

  const handleDismiss = () => {
    setIsDismissed(true)
    if (typeof window !== 'undefined' && config?.banner?.id) {
      try {
        localStorage.setItem(BANNER_DISMISS_KEY, config.banner.id)
      } catch {
        // Fail silently on storage access restrictions
      }
    }
  }

  // Guard: return null if still loading, banner disabled, empty message, or dismissed by user
  if (
    isLoading ||
    !config?.banner?.enabled ||
    !config.banner.message ||
    config.banner.message.trim() === '' ||
    isDismissed
  ) {
    return null
  }

  const icon =
    config.banner.type === 'alert'
      ? '🚨'
      : config.banner.type === 'warning'
        ? '⚠️'
        : 'ℹ️'

  const hasLink = Boolean(config.banner.linkUrl && config.banner.linkUrl.trim())
  const linkText = config.banner.linkText?.trim() || 'Buka Tautan'
  const linkUrl = config.banner.linkUrl?.trim() || ''
  const isExternal = linkUrl.startsWith('http://') || linkUrl.startsWith('https://')

  return (
    <aside
      className={`global-announcement-banner banner-type-${config.banner.type} announcement-${config.banner.type}`}
      role="alert"
      aria-live="polite"
    >
      <div className="banner-inner announcement-content">
        <span className="banner-icon" aria-hidden="true">
          {icon}
        </span>
        <p className="banner-message">{config.banner.message}</p>
        {hasLink &&
          (isExternal ? (
            <a
              href={linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="banner-link-btn"
            >
              <span>{linkText}</span>
              <span className="banner-link-icon" aria-hidden="true">
                ↗
              </span>
            </a>
          ) : (
            <Link to={linkUrl as any} className="banner-link-btn">
              <span>{linkText}</span>
            </Link>
          ))}
        <button
          type="button"
          onClick={handleDismiss}
          className="banner-close-btn announcement-dismiss-btn"
          aria-label="Tutup pengumuman"
        >
          ✕
        </button>
      </div>
    </aside>
  )
}
