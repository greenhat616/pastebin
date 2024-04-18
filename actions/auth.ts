'use server'

import { CredentialsAuthType } from '@/enums/app'
import { ResponseCode } from '@/enums/response'
import { Role } from '@/enums/user'
import { auth, signIn } from '@/libs/auth'
import {
  NoAuthenticatorFoundError,
  getUserAuthenticationOptions,
  getUserRegisterOptions,
  verifyUserAuthentication,
  verifyUserRegistration
} from '@/libs/auth/webauthn'
import client from '@/libs/prisma/client'
import { createUser, findUserById } from '@/libs/services/users/user'
import {
  CredentialsAuthTypeSchema,
  RequestSignUpWithWebAuthnSchema,
  SignInWithPasswordSchema,
  SignInWithWebAuthn,
  SignInWithWebAuthnSchema,
  SignUpWithPassword,
  SignUpWithPasswordSchema,
  VerifySignInWithWebAuthnSchema,
  VerifySignUpWithWebAuthnSchema
} from '@/libs/validation/auth'
import { ActionReturn, nok } from '@/utils/actions'
import { setCookie } from '@/utils/cookies'
import type {
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
  RegistrationResponseJSON
} from '@simplewebauthn/types'
import { CredentialsSignin } from 'next-auth'
import { isRedirectError } from 'next/dist/client/components/redirect'
import { redirect } from 'next/navigation'
import { ZodError } from 'zod'

export async function signInAction<T>(
  callbackUrl: string | undefined,
  preState: T,
  formData: FormData
) {
  let authType
  try {
    authType = await CredentialsAuthTypeSchema.parseAsync(
      Number(formData.get('auth_type'))
    )
  } catch (error) {
    if (error instanceof ZodError) {
      return nok(ResponseCode.ValidationFailed, {
        error: wrapTranslationKey(
          'auth.signup.form.feedback.validation_failed'
        ),
        issues: error.issues
      })
    }
    return nok(ResponseCode.OperationFailed, {
      error: (error as Error).message
    })
  }

  switch (authType) {
    case CredentialsAuthType.Password:
      return await signInWithPassword(callbackUrl, preState, formData)
    case CredentialsAuthType.WebAuthn:
      return await signInWithWebAuthn(callbackUrl, preState, formData)
  }
}

async function signInWithPassword<T>(
  callbackUrl: string | undefined,
  preState: T,
  formData: FormData
) {
  const result = SignInWithPasswordSchema.safeParse({
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
      // id: 'passwordCredentials',
      email: result.data.email,
      password: result.data.password
    })
    redirect(callbackUrl || '/')
    return ok()
  } catch (error) {
    // console.log(error)
    if (isRedirectError(error)) throw error // If it is a redirect interrupt, throw it
    return nok(ResponseCode.OperationFailed, {
      error:
        error instanceof CredentialsSignin
          ? wrapTranslationKey('auth.signin.credentials.feedback.invalid')
          : (error as Error).message
    })
  }
}

/**
 * Sign Up Action
 * 1. Check auth type
 * 2. If password, sign up with password
 * 3. If webauthn, request webauthn
 *
 * @param callbackUrl
 * @param preState
 * @param formData
 * @returns
 */
export async function signUpAction<T>(
  callbackUrl: string | undefined,
  preState: T,
  formData: FormData
): Promise<ActionReturn<SignUpWithPassword, object>> {
  let authType: CredentialsAuthType
  try {
    authType = await CredentialsAuthTypeSchema.parseAsync(
      Number(formData.get('auth_type'))
    )
  } catch (error) {
    if (error instanceof ZodError) {
      return nok(ResponseCode.ValidationFailed, {
        error: wrapTranslationKey(
          'auth.signup.form.feedback.validation_failed'
        ),
        issues: error.issues
      })
    }
    return nok(ResponseCode.OperationFailed, {
      error: (error as Error).message
    })
  }
  switch (authType) {
    case CredentialsAuthType.Password:
      return await signUpWithPassword(callbackUrl, preState, formData)
    case CredentialsAuthType.WebAuthn:
      return await requestSignUpWithWebAuthn(callbackUrl, preState, formData)
  }
}

async function signUpWithPassword<T>(
  callbackUrl: string | undefined,
  preState: T,
  formData: FormData
): Promise<ActionReturn<SignUpWithPassword, object>> {
  const result = await SignUpWithPasswordSchema.safeParseAsync({
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
          error instanceof CredentialsSignin
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

/**
 * WebAuthn Support - Passwordless is best!
 */

/**
 * Add WebAuthn device while user is signed in
 * @returns
 */
export async function requestAddWebAuthnAction(): Promise<
  ActionReturn<never, PublicKeyCredentialCreationOptionsJSON>
> {
  const session = await auth()
  if (!session) return nok(ResponseCode.NotAuthorized)

  try {
    checkTwiceSignedCookie()
  } catch (e) {
    return nok(ResponseCode.OperationFailed, {
      error: (e as Error).message
    })
  }

  const user = await findUserById(session.user.id)
  if (!user) return nok(ResponseCode.NotAuthorized)

  const options = await getUserRegisterOptions(user)
  return ok(options)
}

/**
 * Verify add WebAuthn device request while user is signed in
 * @returns
 */
export async function verifyAddWebAuthnAction({
  ctx
}: {
  ctx: RegistrationResponseJSON
}) {
  const session = await auth()
  if (!session) return nok(ResponseCode.NotAuthorized)

  try {
    checkTwiceSignedCookie()
  } catch (e) {
    return nok(ResponseCode.OperationFailed, {
      error: (e as Error).message
    })
  }

  const user = await findUserById(session.user.id)
  if (!user) return nok(ResponseCode.NotAuthorized)

  try {
    const isOk = verifyUserRegistration(user, ctx)
    if (!isOk) return nok(ResponseCode.OperationFailed)
    return ok()
  } catch (error) {
    // console.log(error)
    return nok(ResponseCode.OperationFailed, {
      error: (error as Error).message
    })
  }
}

/**
 * Sign up new user with WebAuthn device
 * @param callbackUrl
 * @param preState
 * @param formData
 * @returns
 */
async function requestSignUpWithWebAuthn<T>(
  callbackUrl: string | undefined,
  preState: T,
  formData: FormData
): Promise<
  ActionReturn<SignUpWithPassword, PublicKeyCredentialCreationOptionsJSON>
> {
  const result = await RequestSignUpWithWebAuthnSchema.safeParseAsync({
    email: formData.get('email'),
    nickname: formData.get('nickname')
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
  const options = await getUserRegisterOptions({
    email: data.email,
    name: data.nickname
  })
  setCookie('next-auth.reg_email', data.email, {
    sign: true,
    httpOnly: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 5
  })
  setCookie('next-auth.reg_name', data.nickname, {
    sign: true,
    httpOnly: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 5
  })
  return ok(options)
}

/**
 * Verify WebAuthn response data and sign up user
 * It will be called after user request sign up with WebAuthn device,
 * @param callbackUrl - callback url
 * @param input - input data, generated by `browser` side.
 * @returns
 */
export async function verifySignUpWithWebAuthnAction(
  callbackUrl: string | undefined,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  input: Record<string, any>
): Promise<ActionReturn<never, object>> {
  // console.log(input)
  try {
    const data = VerifySignUpWithWebAuthnSchema.parse({
      email: getCookie('next-auth.reg_email', { signed: true })?.value,
      name: getCookie('next-auth.reg_name', { signed: true })?.value,
      ctx: input.ctx
    })
    const result = await verifyUserRegistration(
      {
        email: data.email,
        name: data.name
      },
      data.ctx
    )
    if (!result.verified) return nok(ResponseCode.OperationFailed)
    // do sign in
    await signIn('webauthnCredentials', {
      redirect: false,
      id: result.userID,
      token: result.authenticator.credentialID,
      redirectTo: callbackUrl
    })
    redirect(callbackUrl || '/')
    return ok()
  } catch (error) {
    if (isRedirectError(error)) throw error
    console.error(error)
    return nok(ResponseCode.OperationFailed, {
      error: (error as Error).message
    })
  }
}

/**
 * Sign in with WebAuthn device
 * @param callbackUrl
 * @param preState
 * @param formData
 * @returns
 */
async function signInWithWebAuthn<T>(
  callbackUrl: string | undefined,
  preState: T,
  formData: FormData
): Promise<
  ActionReturn<SignInWithWebAuthn, PublicKeyCredentialRequestOptionsJSON>
> {
  const result = await SignInWithWebAuthnSchema.safeParse({
    email: formData.get('email')
  })
  if (!result.success)
    return nok(ResponseCode.ValidationFailed, {
      error: wrapTranslationKey(
        'auth.signin.credentials.feedback.email.invalid'
      ),
      issues: result.error.issues
    })

  const user = await client.user.findFirst({
    where: {
      email: result.data.email
    }
  })
  if (!user) {
    return nok(ResponseCode.OperationFailed, {
      error: wrapTranslationKey(
        'auth.signin.credentials.feedback.no_authenticator' // Fallback to password, don't tell user that email is not registered
      )
    })
  }
  try {
    const options = await getUserAuthenticationOptions(user)
    setCookie('next-auth.login_email', user.email, {
      sign: true,
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 5
    })
    return ok(options)
  } catch (error) {
    if (error instanceof NoAuthenticatorFoundError) {
      return nok(ResponseCode.OperationFailed, {
        error: wrapTranslationKey(
          'auth.signin.credentials.feedback.no_authenticator' // It will fallback to password.
        )
      })
    } else {
      return nok(ResponseCode.OperationFailed, {
        error: (error as Error).message
      })
    }
  }
}

/**
 * Verify WebAuthn response data and sign in user
 * @param callbackUrl
 * @param input
 * @returns
 */
export async function verifySignInWithWebAuthnAction(
  callbackUrl: string | undefined,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  input: Record<string, any>
): Promise<ActionReturn<never, object>> {
  const email = getCookie('next-auth.login_email', { signed: true })?.value
  try {
    const data = VerifySignInWithWebAuthnSchema.parse({
      email: email,
      ctx: input.ctx
    })
    const user = await client.user.findFirst({
      where: {
        email: data.email
      }
    })
    if (!user) return nok(ResponseCode.OperationFailed)
    const result = await verifyUserAuthentication(user, data.ctx)
    if (!result.verified)
      return nok(ResponseCode.OperationFailed, {
        error: wrapTranslationKey('auth.signin.webauthn.feedback.auth_invalid')
      })
    // do sign in
    const res = await signIn('webauthnCredentials', {
      redirect: false,
      id: result.userID,
      token: result.authenticator.credentialID,
      redirectTo: callbackUrl
    })
    // console.log(res)
    redirect(callbackUrl || '/')
    return ok()
  } catch (error) {
    if (isRedirectError(error)) throw error
    console.error(error)
    return nok(ResponseCode.OperationFailed, {
      error: (error as Error).message
    })
  }
}
