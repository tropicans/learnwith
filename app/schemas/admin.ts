import { z } from 'zod'

export const adminLoginInputSchema = z.object({
  passkey: z.string().trim().min(1, 'Passkey admin wajib diisi').max(100, 'Passkey terlalu panjang'),
})

export type AdminLoginInput = z.infer<typeof adminLoginInputSchema>

export const adminLoginResultSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  token: z.string().optional(),
  authenticatedAt: z.number().optional(),
})

export type AdminLoginResult = z.infer<typeof adminLoginResultSchema>

export const adminUserSchema = z.object({
  role: z.literal('admin'),
  authenticatedAt: z.number(),
  authMethod: z.enum(['passkey', 'google']),
})

export type AdminUser = z.infer<typeof adminUserSchema>

export const adminSessionResultSchema = z.object({
  authenticated: z.boolean(),
  adminUser: adminUserSchema.optional(),
})

export type AdminSessionResult = z.infer<typeof adminSessionResultSchema>

export const adminLogoutResultSchema = z.object({
  success: z.boolean(),
  message: z.string(),
})

export type AdminLogoutResult = z.infer<typeof adminLogoutResultSchema>

export const adminAuthConfigSchema = z.object({
  googleAuthAvailable: z.boolean(),
  googleClientIdConfigured: z.boolean(),
  authModes: z.array(z.string()),
})

export type AdminAuthConfig = z.infer<typeof adminAuthConfigSchema>
