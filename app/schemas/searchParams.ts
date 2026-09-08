import { z } from 'zod'

export const homeSearchSchema = z.object({
  filter: z.enum(['all', 'ai', 'word']).catch('all'),
})

export type HomeSearchParams = z.infer<typeof homeSearchSchema>

export const courseAiSearchSchema = z.object({
  mode: z.enum(['pretraining', 'live-class']).catch('pretraining'),
  step: z.string().optional(),
  cp: z.coerce.number().optional(),
})

export type CourseAiSearchParams = z.infer<typeof courseAiSearchSchema>

export const courseWordSearchSchema = z.object({
  tab: z.string().optional(),
  bab: z.coerce.number().optional(),
  unlocked: z.coerce.boolean().optional(),
})

export type CourseWordSearchParams = z.infer<typeof courseWordSearchSchema>
