import { wrapTranslationKey } from '@/utils/strings'
import z from 'zod'

export const SignUpSchema = z
  .object({
    email: z
      .string({
        required_error: wrapTranslationKey(
          'auth.signup.form.feedback.email.required'
        )
      })
      .email({
        message: wrapTranslationKey('auth.signup.form.feedback.email.invalid')
      }),
    nickname: z.string({
      required_error: wrapTranslationKey(
        'auth.signup.form.feedback.nickname.required'
      )
    }),
    password: z.string({
      required_error: wrapTranslationKey(
        'auth.signup.form.feedback.password.required'
      )
    }),
    password_confirmation: z.string({
      required_error: wrapTranslationKey(
        'auth.signup.form.feedback.password_confirmation.required'
      )
    })
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: wrapTranslationKey(
      'auth.signup.form.feedback.password_confirmation.required'
    ),
    path: ['password_confirmation'] // path of error
  })
