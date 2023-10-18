import { wrapTranslationKey } from '@/utils/strings'
import z from 'zod'

export const SignUpSchema = z
  .object({
    email: z
      .string()
      .min(1, {
        message: wrapTranslationKey('auth.signup.form.feedback.email.required')
      })
      .email({
        message: wrapTranslationKey('auth.signup.form.feedback.email.invalid')
      }),
    nickname: z.string().min(1, {
      message: wrapTranslationKey('auth.signup.form.feedback.nickname.required')
    }),
    password: z.string().min(1, {
      message: wrapTranslationKey('auth.signup.form.feedback.password.required')
    }),
    password_confirmation: z.string().min(1, {
      message: wrapTranslationKey(
        'auth.signup.form.feedback.password_confirmation.required'
      )
    })
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: wrapTranslationKey(
      'auth.signup.form.feedback.password_confirmation.mismatch'
    ),
    path: ['password_confirmation'] // path of error
  })

export type SignUp = z.infer<typeof SignUpSchema>

export const SignInSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: wrapTranslationKey(
        'auth.signin.credentials.feedback.email.required'
      )
    })
    .email({
      message: wrapTranslationKey(
        'auth.signin.credentials.feedback.email.invalid'
      )
    }),
  password: z.string().min(1, {
    message: wrapTranslationKey(
      'auth.signin.credentials.feedback.password.required'
    )
  })
})

export type SignIn = z.infer<typeof SignInSchema>

export const ForgotPasswordSchema = z.object({
  email: z
    .string({
      required_error: wrapTranslationKey(
        'auth.forgot_password.form.feedback.email.required'
      )
    })
    .email({
      message: wrapTranslationKey(
        'auth.forgot_password.form.feedback.email.invalid'
      )
    })
})

export type ForgotPassword = z.infer<typeof ForgotPasswordSchema>

export const PasswordResetSchema = z
  .object({
    token: z
      .string({
        required_error: wrapTranslationKey(
          'auth.reset_password.form.feedback.token.required'
        )
      })
      .length(32, {
        message: wrapTranslationKey(
          'auth.reset_password.form.feedback.token.invalid'
        )
      }),
    password: z.string({
      required_error: wrapTranslationKey(
        'auth.reset_password.form.feedback.password.required'
      )
    }),
    password_confirmation: z.string({
      required_error: wrapTranslationKey(
        'auth.reset_password.form.feedback.password_confirmation.required'
      )
    })
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: wrapTranslationKey(
      'auth.reset_password.form.feedback.password_confirmation.required'
    ),
    path: ['password_confirmation'] // path of error
  })

export type PasswordReset = z.infer<typeof PasswordResetSchema>
