import { getServerConfig } from './config.ts'
import type {
  AdminPlatformConfig,
  AnnouncementBanner,
  AnnouncementBannerType,
  PublicPlatformConfig,
  UpdateAnnouncementBannerInput,
  WorkshopMode,
} from '../schemas/platformConfig.ts'

// In-memory state
let currentWorkshopMode: WorkshopMode = 'pretraining'
let currentBanner: AnnouncementBanner = {
  id: 'banner_init_v1',
  enabled: false,
  message: '',
  type: 'info',
  linkText: '',
  linkUrl: '',
  createdAt: Date.now(),
  updatedAt: Date.now(),
  updatedBy: 'system',
}
let storeVersion = 1
let lastModeChange:
  | {
      mode: WorkshopMode
      changedAt: number
      changedBy: string
      reason?: string
    }
  | undefined = {
  mode: 'pretraining',
  changedAt: Date.now(),
  changedBy: 'system',
  reason: 'Initial system default',
}

/**
 * Returns the public projection of platform configuration.
 * Strict Quarantine Rule (T-33-02, T-33-05): Strictly omit any secret credentials,
 * internal hashes, tokens, or audit metadata.
 */
export function getPublicPlatformConfig(): PublicPlatformConfig {
  return {
    workshopMode: currentWorkshopMode,
    banner: {
      id: currentBanner.id,
      enabled: currentBanner.enabled,
      message: currentBanner.message,
      type: currentBanner.type,
      linkText: currentBanner.linkText,
      linkUrl: currentBanner.linkUrl,
    },
    serverTimestamp: Date.now(),
  }
}

/**
 * Returns the full administrative view of platform configuration.
 */
export function getAdminPlatformConfig(): AdminPlatformConfig {
  const config = getServerConfig()
  return {
    workshopMode: currentWorkshopMode,
    banner: { ...currentBanner },
    authReadiness: {
      googleOAuthReady: Boolean(config.googleClientId),
      adminPasskeyConfigured: Boolean(config.adminPasskeyHash),
      sessionTtlHours: 24,
    },
    environment: config.nodeEnv,
    serverTimestamp: Date.now(),
    version: storeVersion,
    lastModeChange: lastModeChange ? { ...lastModeChange } : undefined,
  }
}

/**
 * Updates global workshop mode.
 */
export function updateWorkshopMode(
  mode: WorkshopMode,
  updatedBy = 'master-admin',
  reason?: string
): { success: boolean; mode: WorkshopMode; version: number } {
  currentWorkshopMode = mode
  storeVersion += 1
  lastModeChange = {
    mode,
    changedAt: Date.now(),
    changedBy: updatedBy,
    reason,
  }
  return {
    success: true,
    mode: currentWorkshopMode,
    version: storeVersion,
  }
}

/**
 * Updates announcement banner and rotates banner ID to reset client dismissal cache.
 */
let bannerCounter = 0

export function updateAnnouncementBanner(
  input: {
    enabled: boolean
    message?: string
    type?: AnnouncementBannerType
    linkText?: string
    linkUrl?: string
  },
  updatedBy = 'master-admin'
): { success: boolean; banner: AnnouncementBanner; version: number } {
  bannerCounter += 1
  const newId = `banner_${Date.now()}_${bannerCounter}`
  currentBanner = {
    id: newId,
    enabled: input.enabled,
    message: input.message !== undefined ? input.message.trim() : currentBanner.message,
    type: input.type || currentBanner.type,
    linkText: input.linkText !== undefined ? input.linkText.trim() : currentBanner.linkText,
    linkUrl: input.linkUrl !== undefined ? input.linkUrl.trim() : currentBanner.linkUrl,
    createdAt: currentBanner.createdAt,
    updatedAt: Date.now(),
    updatedBy,
  }
  storeVersion += 1
  return {
    success: true,
    banner: { ...currentBanner },
    version: storeVersion,
  }
}

/**
 * Resets state back to deterministic defaults (for testing purposes).
 */
export function clearPlatformStoreForTesting(): void {
  currentWorkshopMode = 'pretraining'
  currentBanner = {
    id: 'banner_init_v1',
    enabled: false,
    message: '',
    type: 'info',
    linkText: '',
    linkUrl: '',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    updatedBy: 'system',
  }
  storeVersion = 1
  lastModeChange = {
    mode: 'pretraining',
    changedAt: Date.now(),
    changedBy: 'system',
    reason: 'Initial system default',
  }
}
