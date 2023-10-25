'use server'

import { ResponseCode } from '@/enums/response'
import { auth } from '@/libs/auth'
import client from '@/libs/prisma/client'
import { UserProfileSchema } from '@/libs/validation/user'

export async function modifyProfileAction<T>(preState: T, formData: FormData) {
  const session = await auth()
  if (!session) return nok(ResponseCode.NotAuthorized)
  const result = UserProfileSchema.safeParse({
    bio: formData.get('bio') || undefined,
    website: formData.get('website') || undefined,
    name: formData.get('nickname')
  })
  if (!result.success)
    return nok(ResponseCode.ValidationFailed, {
      error: wrapTranslationKey(
        'components.profile_form.feedback.validation_failed'
      ),
      issues: result.error.issues
    })

  const user = await client.user.update({
    where: { id: session.user.id },
    data: {
      bio: result.data.bio || null,
      website: result.data.website || null,
      name: result.data.name
    }
  })
  return ok({
    user
  })
}
