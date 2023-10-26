import { z } from 'zod'

export const UserProfileSchema = z.object({
  bio: z.string().optional(),
  website: z.string().url().optional(),
  name: z.string().min(1, {
    message: wrapTranslationKey('validation.user.name_too_short')
  })
})

export type UserProfile = z.infer<typeof UserProfileSchema>

export const ChangePasswordSchema = z
  .object({
    password: z.string({
      required_error: wrapTranslationKey(
        'components.change_password_form.feedback.password.required'
      )
    }),
    password_confirmation: z.string({
      required_error: wrapTranslationKey(
        'components.change_password_form.feedback.password_confirmation.required'
      )
    })
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: wrapTranslationKey(
      'components.change_password_form.feedback.password_confirmation.mismatch'
    ),
    path: ['password_confirmation'] // path of error
  })
