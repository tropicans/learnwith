import { z } from 'zod'

export const workshopModeSchema = z.enum(['pretraining', 'live-class'])
export type WorkshopMode = z.infer<typeof workshopModeSchema>

export const announcementBannerTypeSchema = z.enum(['info', 'warning', 'alert'])
export type AnnouncementBannerType = z.infer<typeof announcementBannerTypeSchema>

export const announcementBannerSchema = z.object({
  id: z.string().min(1),
  enabled: z.boolean(),
  message: z.string().max(280),
  type: announcementBannerTypeSchema,
  linkText: z.string().max(40).optional(),
  linkUrl: z
    .string()
    .url('URL tidak valid')
    .or(z.string().regex(/^\/[a-zA-Z0-9/_#-]*$/, 'Path relatif tidak valid'))
    .optional()
    .or(z.literal('')),
  createdAt: z.number(),
  updatedAt: z.number(),
  updatedBy: z.string(),
})
export type AnnouncementBanner = z.infer<typeof announcementBannerSchema>

export const publicPlatformConfigSchema = z.object({
  workshopMode: workshopModeSchema,
  banner: announcementBannerSchema.pick({
    id: true,
    enabled: true,
    message: true,
    type: true,
    linkText: true,
    linkUrl: true,
  }),
  serverTimestamp: z.number(),
})
export type PublicPlatformConfig = z.infer<typeof publicPlatformConfigSchema>

export const adminPlatformConfigSchema = z.object({
  workshopMode: workshopModeSchema,
  banner: announcementBannerSchema,
  authReadiness: z.object({
    googleOAuthReady: z.boolean(),
    adminPasskeyConfigured: z.boolean(),
    sessionTtlHours: z.number(),
  }),
  environment: z.string(),
  serverTimestamp: z.number(),
  version: z.number(),
  lastModeChange: z
    .object({
      mode: workshopModeSchema,
      changedAt: z.number(),
      changedBy: z.string(),
      reason: z.string().optional(),
    })
    .optional(),
})
export type AdminPlatformConfig = z.infer<typeof adminPlatformConfigSchema>

export const updateWorkshopModeInputSchema = z.object({
  mode: workshopModeSchema,
  reason: z.string().max(200).optional(),
  sessionToken: z.string().optional(),
})
export type UpdateWorkshopModeInput = z.infer<typeof updateWorkshopModeInputSchema>

export const updateAnnouncementBannerInputSchema = z.object({
  enabled: z.boolean(),
  message: z.string().min(1, 'Pesan pengumuman tidak boleh kosong').max(280),
  type: announcementBannerTypeSchema,
  linkText: z.string().max(40).optional(),
  linkUrl: z
    .string()
    .url('URL tidak valid')
    .or(z.string().regex(/^\/[a-zA-Z0-9/_#-]*$/, 'Path relatif tidak valid'))
    .optional()
    .or(z.literal('')),
  sessionToken: z.string().optional(),
})
export type UpdateAnnouncementBannerInput = z.infer<typeof updateAnnouncementBannerInputSchema>
