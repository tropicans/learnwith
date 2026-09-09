import { createServerFn } from '@tanstack/react-start'
import {
  updateAnnouncementBannerInputSchema,
  updateWorkshopModeInputSchema,
  type UpdateAnnouncementBannerInput,
  type UpdateWorkshopModeInput,
} from '../schemas/platformConfig.ts'
import {
  getAdminPlatformConfig,
  getPublicPlatformConfig,
  updateAnnouncementBanner,
  updateWorkshopMode,
} from './platformStore.ts'
import { readSessionToken, validateAdminSession } from './session.ts'

/**
 * Validates Master Admin session token.
 * Throws an unauthorized Error if invalid or expired.
 */
export function assertAdminAuthorized(explicitToken?: string | null) {
  const token = explicitToken || readSessionToken()
  const adminUser = validateAdminSession(token)
  if (!adminUser) {
    throw new Error('UNAUTHORIZED: Sesi Master Admin diperlukan untuk mengakses konfigurasi platform.')
  }
  return adminUser
}

/**
 * Server function: Get Public Platform Config
 * Public endpoint for learners and navigation banners.
 */
export const getPublicPlatformConfigFn = createServerFn({ method: 'GET' }).handler(async () => {
  return getPublicPlatformConfig()
})

/**
 * Server function: Get Admin Platform Config
 * Protected endpoint for Master Admin settings view.
 */
export const adminGetPlatformConfigFn = createServerFn({ method: 'GET' })
  .validator((data?: unknown) => {
    if (data && typeof data === 'object' && 'sessionToken' in (data as any)) {
      return data as { sessionToken?: string }
    }
    return undefined
  })
  .handler(async ({ data }) => {
    assertAdminAuthorized(data?.sessionToken)
    return getAdminPlatformConfig()
  })

/**
 * Server function: Update Global Workshop Mode
 * Protected mutation endpoint for switching between 'pretraining' and 'live-class'.
 */
export const adminUpdateWorkshopModeFn = createServerFn({ method: 'POST' })
  .validator((data: unknown) => {
    return updateWorkshopModeInputSchema.parse(data) as UpdateWorkshopModeInput
  })
  .handler(async ({ data }) => {
    const user = assertAdminAuthorized(data.sessionToken)
    const result = updateWorkshopMode(data.mode, user.role || 'master-admin', data.reason)
    return {
      success: true,
      mode: data.mode,
      version: result.version,
      message: `Mode workshop berhasil diubah menjadi ${
        data.mode === 'live-class' ? 'Sesi Tatap Muka (Live Class)' : 'Pra-Pelatihan Mandiri (Pre-Training)'
      }.`,
    }
  })

/**
 * Server function: Update Announcement Banner
 * Protected mutation endpoint for broadcasting or dismissing global announcement banner.
 */
export const adminUpdateAnnouncementBannerFn = createServerFn({ method: 'POST' })
  .validator((data: unknown) => {
    return updateAnnouncementBannerInputSchema.parse(data) as UpdateAnnouncementBannerInput
  })
  .handler(async ({ data }) => {
    const user = assertAdminAuthorized(data.sessionToken)
    const result = updateAnnouncementBanner(data, user.role || 'master-admin')
    return {
      success: true,
      banner: result.banner,
      version: result.version,
      message: data.enabled
        ? 'Pengumuman berhasil disiarkan ke seluruh peserta.'
        : 'Pengumuman dinonaktifkan.',
    }
  })
