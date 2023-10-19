'use server'

import { PasteType } from '@/enums/paste'
import { ResponseCode } from '@/enums/response'
import { auth } from '@/libs/auth'
import client from '@/libs/prisma/client'
import { CodeFormSchema, Content } from '@/libs/validation/paste'
import { isRedirectError } from 'next/dist/client/components/redirect'
import { redirect } from 'next/navigation'

// Type: normal
export async function submitPasteNormalAction<T>(
  prevState: T,
  formData: FormData
) {
  const result = await CodeFormSchema.safeParseAsync({
    syntax: formData.get('syntax'),
    content: formData.get('content'),
    expiration: formData.get('expiration'),
    poster: formData.get('poster')
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
        content,
        poster: result.data.poster,
        userId: session ? session.user.id : null,
        expiredAt:
          result.data.expiration === -1 // -1 means never expired
            ? null
            : new Date(Date.now() + result.data.expiration * 1000)
      }
    })
    redirect(`/v/${newPaste.id}`)
  } catch (error) {
    if (isRedirectError(error)) throw error
    return nok(ResponseCode.OperationFailed, {
      error: (error as Error).message
    })
  }
}
