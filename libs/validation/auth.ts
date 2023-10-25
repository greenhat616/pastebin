import { CredentialsAuthType } from '@/enums/app'
import { wrapTranslationKey } from '@/utils/strings'
import z from 'zod'

/**
 * Verify the auth type
 */
export const CredentialsAuthTypeSchema = z
  .nativeEnum(CredentialsAuthType, {
    invalid_type_error: wrapTranslationKey('auth.credentials.auth_type.invalid')
  })
  .default(CredentialsAuthType.Password)

export const RequestSignUpWithWebAuthnSchema = z.object({
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
  })
})

export type RequestSignUpWithWebAuthn = z.infer<
  typeof RequestSignUpWithWebAuthnSchema
>

export const RegistrationResponseJSONSchema = z.object(
  {
    id: z.string().min(1),
    rawId: z.string().min(1),
    response: z.object({
      clientDataJSON: z.string().min(1),
      attestationObject: z.string().min(1),
      authenticatorData: z.string().optional(),
      transports: z
        .array(
          z.enum([
            'ble',
            'cable',
            'hybrid',
            'internal',
            'nfc',
            'smart-card',
            'usb'
          ])
        )
        .optional(),
      publicKeyAlgorithm: z.number().optional(),
      publicKey: z.string().optional()
    }),
    authenticatorAttachment: z.enum(['platform', 'cross-platform']).optional(),
    clientExtensionResults: z.object({
      appid: z.boolean().optional(),
      credProps: z
        .object({
          rk: z.boolean().optional()
        })
        .optional(),
      hmacCreateSecret: z.boolean().optional()
    }),
    type: z.enum(['public-key'])
  },
  {
    invalid_type_error: wrapTranslationKey(
      'auth.credentials.feedback.webauthn_registration.invalid'
    )
  }
)

export const VerifySignUpWithWebAuthnSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: wrapTranslationKey('auth.signup.form.feedback.email.required')
    })
    .email({
      message: wrapTranslationKey('auth.signup.form.feedback.email.invalid')
    }),
  name: z.string().min(1, {
    message: wrapTranslationKey('auth.signup.form.feedback.nickname.required')
  }),
  ctx: RegistrationResponseJSONSchema
})

export const AuthenticationResponseJSONSchema = z.object(
  {
    id: z.string().min(1),
    rawId: z.string().min(1),
    response: z.object({
      clientDataJSON: z.string().min(1),
      authenticatorData: z.string().min(1),
      signature: z.string().min(1),
      userHandle: z.string().optional()
    }),
    authenticatorAttachment: z.enum(['platform', 'cross-platform']).optional(),
    clientExtensionResults: z.object({
      appid: z.boolean().optional(),
      credProps: z
        .object({
          rk: z.boolean().optional()
        })
        .optional(),
      hmacCreateSecret: z.boolean().optional()
    }),
    type: z.enum(['public-key'])
  },
  {
    invalid_type_error: wrapTranslationKey(
      'auth.credentials.feedback.webauthn_authentication.invalid'
    )
  }
)

export const VerifySignInWithWebAuthnSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: wrapTranslationKey('auth.signup.form.feedback.email.required')
    })
    .email({
      message: wrapTranslationKey('auth.signup.form.feedback.email.invalid')
    }),
  ctx: AuthenticationResponseJSONSchema
})

export const SignUpWithPasswordSchema = z
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

export type SignUpWithPassword = z.infer<typeof SignUpWithPasswordSchema>

export const SignInWithWebAuthnSchema = z.object({
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
    })
})

export type SignInWithWebAuthn = z.infer<typeof SignInWithWebAuthnSchema>

export const SignInWithPasswordSchema = z.object({
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

export type SignInWithPassword = z.infer<typeof SignInWithPasswordSchema>

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
