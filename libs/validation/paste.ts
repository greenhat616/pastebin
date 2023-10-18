import { z } from 'zod'

import { PasteType } from '@/enums/paste'
import { BUNDLED_LANGUAGES } from 'shiki'

export const CodeFormSupportedExpiration = [
  -1, // never
  60 * 30, // 30 minutes
  60 * 60, // 1 hour
  60 * 60 * 24, // 1 day
  60 * 60 * 24 * 7, // 1 week
  60 * 60 * 24 * 30, // 1 month
  60 * 60 * 24 * 365 // 1 year
]

export const CodeFormSchema = z.object({
  poster: z.string().min(1, {
    message: wrapTranslationKey(
      'components.code_form.validation.poster.required'
    )
  }),
  syntax: z
    .string()
    .min(1, {
      message: wrapTranslationKey(
        'components.code_form.validation.syntax.required'
      )
    })
    .refine(
      (syntax) =>
        !!BUNDLED_LANGUAGES.find((lang) => lang.id === syntax) ||
        syntax === 'text',
      {
        message: wrapTranslationKey(
          'components.code_form.validation.syntax.invalid'
        )
      }
    ),
  expiration: z.preprocess(
    (x) => Number(x),
    z
      .number()
      .int()
      .refine(
        (expiration) => CodeFormSupportedExpiration.includes(expiration),
        {
          message: wrapTranslationKey(
            'components.code_form.validation.expiration.invalid'
          )
        }
      )
  ),
  content: z
    .string()
    .min(1, {
      message: wrapTranslationKey(
        'components.code_form.validation.content.required'
      )
    })
    .max(65535, {
      message: wrapTranslationKey(
        'components.code_form.validation.content.too_long'
      )
    })
})

export type CodeForm = z.infer<typeof CodeFormSchema>

export const ContentSchema = z.object({
  type: z.nativeEnum(PasteType).default(PasteType.Normal),
  syntax: z
    .string()
    .min(1, {
      message: wrapTranslationKey(
        'components.code_form.validation.syntax.required'
      )
    })
    .refine(
      (syntax) =>
        !!BUNDLED_LANGUAGES.find((lang) => lang.id === syntax) ||
        syntax === 'text',
      {
        message: wrapTranslationKey(
          'components.code_form.validation.syntax.invalid'
        )
      }
    ),
  filename: z.string().min(1, {
    message: wrapTranslationKey(
      'components.code_form.validation.filename.required' // Filename is required
    )
  }),
  content: z
    .string()
    .min(1, {
      message: wrapTranslationKey(
        'components.code_form.validation.content.required' // Content is required
      )
    })
    .max(65535, {
      message: wrapTranslationKey(
        'components.code_form.validation.content.too_long' // Content is too long
      )
    })
})

export type Content = z.infer<typeof ContentSchema>
