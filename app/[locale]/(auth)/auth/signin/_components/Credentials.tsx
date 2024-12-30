'use client'
import { signInAction, verifySignInWithWebAuthnAction } from '@/actions/auth'
import { CredentialsAuthType } from '@/enums/app'
import { ResponseCode } from '@/enums/response'
import { SignInWithPassword } from '@/libs/validation/auth'
import { Input } from '@chakra-ui/react'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { toaster } from '@/components/ui/toaster'
import {
  browserSupportsWebAuthn,
  startAuthentication
} from '@simplewebauthn/browser'
import { PublicKeyCredentialCreationOptionsJSON } from '@simplewebauthn/types'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'

import { useFormStatus } from 'react-dom'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type Props = {
  // signInAction: (
  //   callbackURL: string | undefined,
  //   formData: FormData
  // ) => Promise<FormData>
}

// const initialState = {
//   // form: {
//   //   email: '',
//   //   password: ''
//   // },
//   // error: {
//   //   email: undefined,
//   //   password: undefined
//   // } as {
//   //   email?: string
//   //   password?: string
//   // }
//   error: undefined as string | undefined,
//   issues: [] as ZodError<typeof SignInSchema>['issues']
// }

// type SubmitProps = {
//   state: Partial<typeof initialState>
// }

function Submit({ pending }: { pending: boolean }) {
  const t = useTranslations()
  const { pending: formPending } = useFormStatus()

  return (
    <Button
      colorScheme="gray"
      size="lg"
      rounded="xl"
      // onClick={handleSignIn}
      loading={pending || formPending}
      loadingText={t('auth.signin.credentials.loading')}
      type="submit"
    >
      {t('auth.signin.credentials.button')}
    </Button>
  )
}

export default function Credentials(props: Props) {
  const [authType, setAuthType] = useState(CredentialsAuthType.WebAuthn)
  const [pending, startTransition] = useTransition()

  const searchParams = useSearchParams()
  const signIn = signInAction.bind(
    null,
    searchParams.get('callbackUrl') || undefined
  )

  const { state, action } = useSubmitForm<
    SignInWithPassword,
    PublicKeyCredentialCreationOptionsJSON
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  >(signIn as any, {
    onSuccess: (state) => {
      startTransition(async () => {
        let asseResp
        try {
          // Pass the options to the authenticator and wait for a response
          asseResp = await startAuthentication(state.data!)
        } catch (error) {
          console.error(error)
          toaster.create({
            title: t('auth.signin.credentials.feedback.error.title'),
            description: t(
              'auth.signin.credentials.feedback.error.description',
              {
                error:
                  error instanceof Error
                    ? error.name === 'NotAllowedError'
                      ? t('auth.signin.form.feedback.error.not_allowed_error')
                      : 'Unknown error'
                    : 'Unknown error'
              }
            ),
            type: 'error',
            duration: 5000
          })
          return
        }

        try {
          const resp = await verifySignInWithWebAuthnAction(
            searchParams.get('callbackUrl') || undefined,
            {
              ctx: asseResp
            }
          )
          if (!resp) return // It means redirect
          if (resp.status !== ResponseCode.OK) throw new Error(resp.error)
        } catch (error) {
          console.error(error)
          toaster.create({
            title: t('auth.signin.credentials.feedback.error.title'),
            description: t(
              'auth.signin.credentials.feedback.error.description',
              {
                error: (error as Error).message
              }
            ),
            type: 'error',
            duration: 5000
          })
        }
      })
    },
    onError: (state) => {
      if (
        state.status === ResponseCode.OperationFailed &&
        state.error ===
          wrapTranslationKey(
            'auth.signin.credentials.feedback.no_authenticator'
          )
      ) {
        setAuthType(CredentialsAuthType.Password)
        return
      }
      toaster.error({
        title: t('auth.signin.credentials.feedback.error.title'),
        description: t('auth.signin.credentials.feedback.error.description', {
          error: translateIfKey(t, state.error || 'Unknown error')
        }),
        duration: 5000
      })
    }
  })
  const t = useTranslations()

  const msgs = state.issues?.reduce(
    (acc, issue) => {
      for (const path of issue.path) {
        if (!acc[path as keyof typeof acc])
          acc[path as keyof typeof acc] = translateIfKey(t, issue.message)
      }
      return acc
    },
    {
      email: undefined as string | undefined,
      password: undefined as string | undefined
    }
  )
  // Events
  // const handleSignIn = useMemoizedFn(() => {
  //   state.error = {}
  //   const result = SignInSchema.safeParse(state.form)
  //   console.log(result)
  //   if (!result.success) {
  //     for (const issue of result.error.issues) {
  //       for (const path of issue.path) {
  //         if (!state.error[path as keyof typeof state.form])
  //           state.error[path as keyof typeof state.form] = translateIfKey(
  //             t,
  //             issue.message
  //           )
  //       }
  //     }
  //     return
  //   }
  //   state.error = {}
  //   state.loading = true
  //   signIn('credentials', {
  //     redirect: false,
  //     email: state.form.email,
  //     password: state.form.password
  //   })
  //     .then((res) => {
  //       console.log(res)
  //       if (!res || !res.ok) {
  //         throw new Error(
  //           !!res
  //             ? `${
  //                 res.error
  //                   ? isTranslationKey(res.error)
  //                     ? t(unwrapTranslationKey(res.error as TranslationKey))
  //                     : res.error
  //                   : ''
  //               } - ${res.status}`
  //             : 'Unknown error'
  //         )
  //       }
  //       toast({
  //         title: t('auth.signin.credentials.feedback.success.title'),
  //         description: t(
  //           'auth.signin.credentials.feedback.success.description'
  //         ),
  //         status: 'success',
  //         duration: 2000,
  //         isClosable: true
  //       })
  //       setTimeout(() => {
  //         // Disable lint because of callback must be valid url
  //         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //         // @ts-ignore ts(2345)
  //         router.push(res.url || '/')
  //       }, 3000)
  //     })
  //     .catch((err) => {
  //       console.error(err)
  //       toast({
  //         title: t('auth.signin.credentials.feedback.error.title'),
  //         description: t('auth.signin.credentials.feedback.error.description', {
  //           error: err.message
  //         }),
  //         status: 'error',
  //         duration: 5000,
  //         isClosable: true
  //       })
  //     })
  //     .finally(() => {
  //       state.loading = false
  //     })
  // })

  // If browser doesn't support WebAuthn, fallback to password
  useEffect(() => {
    if (
      !browserSupportsWebAuthn() &&
      authType === CredentialsAuthType.WebAuthn
    ) {
      setAuthType(CredentialsAuthType.Password)
    }
  }, [authType])

  return (
    <form className="grid cols-1 gap-4" action={action}>
      <Field invalid={!!msgs?.email} errorText={msgs?.email}>
        <Input
          variant="outline"
          placeholder={t('auth.signin.credentials.placeholder.email')}
          rounded="xl"
          size="lg"
          type="email"
          name="email"
          // value={state.form.email}
          // onChange={(e) => {
          //   state.form.email = e.target.value
          // }}
        />
      </Field>
      {authType === CredentialsAuthType.Password && (
        <Field invalid={!!msgs?.password} errorText={msgs?.password}>
          <Input
            variant="outline"
            placeholder={t('auth.signin.credentials.placeholder.password')}
            rounded="xl"
            size="lg"
            type="password"
            name="password"
            // value={state.form.password}
            // onChange={(e) => {
            //   state.form.password = e.target.value
            // }}
          />
        </Field>
      )}
      <input
        className="hidden"
        type="hidden"
        name="auth_type"
        value={authType}
      />

      <Submit pending={pending} />
    </form>
  )
}
