'use server'

import { PasteType } from '@/enums/paste'
import { ResponseCode } from '@/enums/response'
import { auth } from '@/libs/auth'
import client from '@/libs/prisma/client'
import {
  Content,
  CreateNormalSnippetFormSchema,
  type CreateNormalSnippetForm
} from '@/libs/validation/paste'
import type { ActionReturn } from '@/utils/actions'
import type { Session } from 'next-auth'
import { isRedirectError } from 'next/dist/client/components/redirect'
import { redirect } from 'next/navigation'

// Type: normal
export async function submitPasteNormalAction<T>(
  prevState: T,
  formData: FormData
): Promise<ActionReturn<CreateNormalSnippetForm, { id: string }>> {
  const result = await CreateNormalSnippetFormSchema.safeParseAsync({
    syntax: formData.get('syntax'),
    content: formData.get('content'),
    expiration: formData.get('expiration'),
    poster: formData.get('poster'),
    redirect: formData.get('redirect')
  })
  if (!result.success)
    return nok(ResponseCode.ValidationFailed, {
      error: wrapTranslationKey(
        'components.code_form.feedback.validation_failed'
      ),
      issues: result.error.issues
    })
  const content = [
    {
      type: PasteType.Normal,
      syntax: result.data.syntax,
      filename: '',
      content: result.data.content
    }
  ] as Content[]
  const session = await auth()
  try {
    const newPaste = await client.paste.create({
      data: {
        title: '',
        description: '',
        syntax: result.data.syntax,
        type: PasteType.Normal,
        content,
        poster: result.data.poster,
        // TODO: remove this force cast, waiting for next-auth update
        userId: session ? (session as unknown as Session).user.id : null,
        expiredAt:
          result.data.expiration === -1 // -1 means never expired
            ? null
            : new Date(Date.now() + result.data.expiration * 1000)
      }
    })
    if (result.data.redirect) redirect(`/v/${newPaste.id}`)
    return ok({
      id: newPaste.id
    })
  } catch (error) {
    if (isRedirectError(error)) throw error
    console.error(error)
    return nok(ResponseCode.OperationFailed, {
      error: (error as Error).message
    })
  }
}
