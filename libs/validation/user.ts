import { z } from 'zod'

export const UserProfileSchema = z.object({
  bio: z.string().optional(),
  website: z.string().url().optional(),
  name: z.string().min(1, {
    message: wrapTranslationKey('validation.user.name_too_short')
  })
})

export type UserProfile = z.infer<typeof UserProfileSchema>
