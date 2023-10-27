'use server'

import { CredentialsAuthType } from '@/enums/app'
import { ResponseCode } from '@/enums/response'
import { auth, signIn } from '@/libs/auth'
import {
  getUserAuthenticationOptions,
  verifyUserAuthentication
} from '@/libs/auth/webauthn'
import client from '@/libs/prisma/client'
import {
  findUserById,
  hashPassword,
  verifyPassword
} from '@/libs/services/users/user'
import {
  AuthenticationResponseJSONSchema,
  CredentialsAuthTypeSchema,
  SignInWithPasswordSchema
} from '@/libs/validation/auth'
import { UserProfileSchema } from '@/libs/validation/user'
import { ActionReturn } from '@/utils/actions'
import { checkTwiceSignedCookie } from '@/utils/cookies'
import md5 from 'md5'
import { z } from 'zod'

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

export async function requestTwiceConfirmationTokenAction({
  token
}: {
  token: string
}) {
  const session = await auth()
  if (!session) return nok(ResponseCode.NotAuthorized)
  const result = z.string().uuid().safeParse(token)
  if (!result.success)
    return nok(ResponseCode.ValidationFailed, {
      error: wrapTranslationKey(
        'actions.user.request_twice_confirmation.invalid_token'
      )
    })
  const authenticatorCount = await client.authenticator.count({
    where: { userId: session.user.id }
  })
  // Set signed token, to prevent CSRF
  setCookie('user.twice_confirmed_id', md5(result.data), {
    httpOnly: true,
    maxAge: 60 * 15, // 15 minutes,
    sign: true,
    sameSite: 'strict'
  })
  if (authenticatorCount > 0) {
    const options = await getUserAuthenticationOptions(session.user)
    return ok(options)
  } else {
    return nok(ResponseCode.OperationFailed, {
      error: wrapTranslationKey(
        'actions.user.request_twice_confirmation.no_authenticator_found'
      )
    })
  }
}

export async function confirmTwiceAction<T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  input: Record<string, any>
) {
  // console.log(input)
  const session = await auth()
  if (!session) return nok(ResponseCode.NotAuthorized)
  let authType
  let token
  try {
    const data = z
      .object({
        authType: CredentialsAuthTypeSchema,
        token: z.string().uuid()
      })
      .parse(input)
    authType = data.authType
    token = data.token
    const signedToken = getCookie('user.twice_confirmed_id', { signed: true })
    if (!signedToken || md5(token) !== signedToken.value)
      throw new Error('Invalid token')
  } catch (e) {
    // console.log(e)
    return nok(ResponseCode.ValidationFailed, {
      error: wrapTranslationKey('actions.user.confirm_twice.invalid_ctx')
    })
  }
  switch (authType) {
    case CredentialsAuthType.Password:
      const result = SignInWithPasswordSchema.safeParse({
        password: input.password,
        email: session.user.email
      })
      if (!result.success)
        return nok(ResponseCode.ValidationFailed, {
          error: wrapTranslationKey(
            'actions.user.confirm_twice.invalid_password'
          ),
          issues: result.error.issues
        })
      const user = await findUserById(session.user.id)
      const bool = await verifyPassword(result.data.password, user!.password)
      if (!bool)
        return nok(ResponseCode.ValidationFailed, {
          error: wrapTranslationKey(
            'actions.user.confirm_twice.invalid_password'
          )
        })
      break
    case CredentialsAuthType.WebAuthn:
      const res = AuthenticationResponseJSONSchema.safeParse(input.ctx)
      if (!res.success)
        return nok(ResponseCode.ValidationFailed, {
          error: wrapTranslationKey(
            'actions.user.confirm_twice.invalid_authentication_response'
          ),
          issues: res.error.issues
        })
      const verification = await verifyUserAuthentication(
        session.user,
        res.data
      )
      if (!verification.verified)
        return nok(ResponseCode.ValidationFailed, {
          error: wrapTranslationKey(
            'actions.user.confirm_twice.invalid_authentication_response'
          )
        })
      break
  }
  setCookie('user.twice_confirmed', `${token}.${Date.now()}`, {
    httpOnly: true,
    maxAge: 60 * 15, // 15 minutes,
    sign: true,
    sameSite: 'strict'
  })
  return ok()
}

export async function modifyPasswordAction(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  input: Record<string, any>
) {
  const session = await auth()
  if (!session) return nok(ResponseCode.NotAuthorized)
  const password = z.string().min(1).max(256).safeParse(input.password)
  if (!password.success)
    return nok(ResponseCode.ValidationFailed, {
      error: wrapTranslationKey('actions.user.modify_password.invalid_password')
    })
  // Check twice confirmation
  try {
    checkTwiceSignedCookie()
  } catch (e) {
    return nok(ResponseCode.NotAuthorized, {
      error: (e as Error).message
    })
  }
  // Update password
  const hashedPassword = await hashPassword(password.data)
  await client.user.update({
    where: { id: session.user.id },
    data: { password: hashedPassword }
  })
  return ok()
}

export async function modifyAuthenticatorName(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  input: Record<string, any>
) {
  const session = await auth()
  if (!session) return nok(ResponseCode.NotAuthorized)
  const result = z
    .object({
      name: z.string().min(1).max(256),
      credential_id: z.string().min(1)
    })
    .safeParse(input)
  if (!result.success)
    return nok(ResponseCode.ValidationFailed, {
      error: wrapTranslationKey(
        'actions.user.modify_authenticator_name.invalid_input'
      )
    })
  // Check twice confirmation
  try {
    checkTwiceSignedCookie()
  } catch (e) {
    return nok(ResponseCode.NotAuthorized)
  }

  // Only update one
  const res = await client.authenticator.updateMany({
    where: {
      credentialID: result.data.credential_id,
      userId: session.user.id
    },
    data: { name: result.data.name }
  })
  if (res.count === 0) {
    return nok(ResponseCode.OperationFailed, {
      error: wrapTranslationKey(
        'actions.user.modify_authenticator_name.no_authenticator_found'
      )
    })
  }
  return ok()
}

export async function removeAuthenticatorAction({
  credentialID
}: {
  credentialID: string
}) {
  const session = await auth()
  if (!session) return nok(ResponseCode.NotAuthorized)
  // Check twice confirmation
  try {
    checkTwiceSignedCookie()
  } catch (e) {
    return nok(ResponseCode.NotAuthorized)
  }
  // Only remove one
  const res = await client.authenticator.deleteMany({
    where: {
      credentialID: credentialID,
      userId: session.user.id
    }
  })
  if (res.count === 0) {
    return nok(ResponseCode.OperationFailed, {
      error: wrapTranslationKey(
        'actions.user.remove_authenticator.no_authenticator_found'
      )
    })
  }
  return ok()
}

/**
 * SSO Operation
 */

export async function linkAccountAction(
  providerID: string
): Promise<ActionReturn<never, { url: string }>> {
  const session = await auth()
  if (!session) return nok(ResponseCode.NotAuthorized)
  const record = await client.account.findFirst({
    where: { provider: providerID, userId: session.user.id }
  })
  if (record) {
    return nok(ResponseCode.OperationFailed, {
      error: wrapTranslationKey(
        'actions.user.link_account.account_already_linked'
      )
    })
  }
  try {
    const url = await signIn(providerID, {
      redirect: false
    })
    return ok({ url })
  } catch (e) {
    return nok(ResponseCode.OperationFailed, {
      error: (e as Error).message
    })
  }
}

export async function unlinkAccountAction(providerID: string) {
  const session = await auth()
  if (!session) return nok(ResponseCode.NotAuthorized)
  const record = await client.account.findFirst({
    where: { provider: providerID, userId: session.user.id }
  })
  if (!record) {
    return nok(ResponseCode.OperationFailed, {
      error: wrapTranslationKey(
        'actions.user.unlink_account.account_not_linked'
      )
    })
  }
  // Do unlink
  try {
    await client.account.delete({
      where: {
        provider_providerAccountId: {
          provider: providerID,
          providerAccountId: record.providerAccountId
        }
      }
    })
  } catch (e) {
    return nok(ResponseCode.OperationFailed, {
      error: (e as Error).message
    })
  }

  return ok()
}
