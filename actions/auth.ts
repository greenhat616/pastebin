'use server'

import { ResponseCode } from '@/enums/response'
import { Role } from '@/enums/user'
import { signIn } from '@/libs/auth'
import client from '@/libs/prisma/client'
import { createUser } from '@/libs/services/users/user'
import { SignInSchema, SignUp, SignUpSchema } from '@/libs/validation/auth'
import { ActionReturn, nok } from '@/utils/actions'
import { isRedirectError } from 'next/dist/client/components/redirect'
import { redirect } from 'next/navigation'

export async function signInAction<T>(
  callbackUrl: string | undefined,
  preState: T,
  formData: FormData
) {
  const result = SignInSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password')
  })
  if (!result.success) {
    return nok(ResponseCode.ValidationFailed, {
      issues: result.error.issues,
      error: wrapTranslationKey('auth.signin.credentials.feedback.invalid')
    })
  }
  try {
    const url = await signIn('credentials', {
      redirect: false,
      redirectTo: callbackUrl,
      email: result.data.email,
      password: result.data.password
    })
    redirect(url)
    return ok()
  } catch (error) {
    if (isRedirectError(error)) throw error // If it is a redirect interrupt, throw it
    return nok(ResponseCode.OperationFailed, {
      error:
        (error as Error).message === 'CredentialsSignin'
          ? wrapTranslationKey('auth.signin.credentials.feedback.invalid')
          : (error as Error).message
    })
  }
}

export async function signUpAction<T>(
  callbackUrl: string | undefined,
  preState: T,
  formData: FormData
): Promise<ActionReturn<SignUp, object>> {
  const result = await SignUpSchema.safeParseAsync({
    email: formData.get('email'),
    nickname: formData.get('nickname'),
    password: formData.get('password'),
    password_confirmation: formData.get('password_confirmation')
  })
  if (!result.success)
    return nok(ResponseCode.ValidationFailed, {
      error: wrapTranslationKey('auth.signup.form.feedback.validation_failed'),
      issues: result.error.issues
    })
  const data = result.data
  const user = await client.user.findFirst({
    where: {
      email: data.email
    }
  })
  if (user) {
    return nok(ResponseCode.OperationFailed, {
      error: wrapTranslationKey('auth.signup.form.feedback.remote.email')
    })
  }
  await createUser(data.email, data.password, {
    name: data.nickname,
    role: Role.User
  })

  // TODO: Send email verification
  try {
    const url = await signIn('credentials', {
      redirect: false,
      email: data.email,
      password: data.password,
      redirectTo: callbackUrl
    })
    // login success
    redirect(url)
    return ok()
  } catch (error) {
    if (isRedirectError(error)) throw error // If it is a redirect interrupt, throw it
    if (error instanceof Error) {
      return nok(ResponseCode.OperationFailed, {
        error:
          error.message === 'CredentialsSignin'
            ? wrapTranslationKey('auth.signin.credentials.feedback.invalid')
            : error.message
      })
    } else {
      return nok(ResponseCode.OperationFailed, {
        error: JSON.stringify(error)
      })
    }
  }
}
