'use client'

import { signUpAction, verifySignUpWithWebAuthnAction } from '@/actions/auth'
import { CredentialsAuthType } from '@/enums/app'
import { ResponseCode } from '@/enums/response'
import { SignUpWithPassword } from '@/libs/validation/auth'
import {
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  Stack,
  useToast
} from '@chakra-ui/react'
import {
  browserSupportsWebAuthn,
  startRegistration
} from '@simplewebauthn/browser'
import {
  PublicKeyCredentialCreationOptionsJSON,
  RegistrationResponseJSON
} from '@simplewebauthn/types'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { useFormStatus } from 'react-dom'

// type State = {
//   form: {
//     email: string
//     nickname: string
//     password: string
//     password_confirmation: string
//   }
//   error: {
//     email?: string
//     nickname?: string
//     password?: string
//     password_confirmation?: string
//   }
// }

function Submit({ pending }: { pending: boolean }) {
  const t = useTranslations()
  const { pending: formPending } = useFormStatus()
  // if (!pending && state.error) {
  // }
  return (
    <Button
      colorScheme="gray"
      size="lg"
      rounded="xl"
      isLoading={pending || formPending}
      loadingText={t('auth.signup.form.loading')}
      type="submit"
    >
      {t('auth.signup.form.buttons.submit')}
    </Button>
  )
}

// const initialState = {
//   // form: {
//   //   email: '',
//   //   nickname: '',
//   //   password: '',
//   //   password_confirmation: ''
//   // },
//   error: '',
//   issues: [],
//   ts: 0
// } as ActionReturn<SignUp, object>

export default function SignUpForm() {
  const t = useTranslations()
  // const [isVerifyWebauthnPending, startTransition] = useTransition()
  const [isVerifyWebauthnPending, setIsVerifyWebauthnPending] = useState(false)
  const toast = useToast()
  const callbackURL = useSearchParams().get('callbackUrl')

  // Form
  const [authType, setAuthType] = useState(CredentialsAuthType.WebAuthn) // Prefer WebAuthn
  const signUp = signUpAction.bind(null, callbackURL || undefined)
  const { state, action } = useSubmitForm<
    SignUpWithPassword,
    PublicKeyCredentialCreationOptionsJSON
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  >(signUp as any, {
    onSuccess: async (state) => {
      // console.log(state)
      setIsVerifyWebauthnPending(true)
      // In current case, if enter this branch, it means this request is a webauthn request
      let attResp: RegistrationResponseJSON
      try {
        // Pass the options to the authenticator and wait for a response
        attResp = await startRegistration(state.data!)
      } catch (error) {
        console.error(error)
        toast({
          title: t('auth.signup.form.feedback.error.title'),
          description: t('auth.signup.form.feedback.error.description', {
            error:
              error instanceof Error
                ? error.name === 'InvalidStateError'
                  ? t('auth.signup.form.feedback.error.invalid_state_error')
                  : error.name === 'NotAllowedError'
                    ? t('auth.signup.form.feedback.error.not_allowed_error')
                    : 'Unknown error'
                : 'Unknown error'
          }),
          status: 'error',
          duration: 5000,
          isClosable: true
        })
        setIsVerifyWebauthnPending(false)
        return
      }

      try {
        const result = await verifySignUpWithWebAuthnAction(
          callbackURL || undefined,
          {
            ctx: attResp
          }
        )
        if (!result) return // It means redirect
        // Due to not redirect, there should be error
        if (result.status !== ResponseCode.OK) throw new Error(result.error)
      } catch (error) {
        console.error(error)
        toast({
          title: t('auth.signup.form.feedback.error.title'),
          description: t('auth.signup.form.feedback.error.description', {
            error: translateIfKey(t, 'Unknown error')
          }),
          status: 'error',
          duration: 5000,
          isClosable: true
        })
      } finally {
        setIsVerifyWebauthnPending(true)
      }
    },
    onError: (state) => {
      toast({
        title: t('auth.signup.form.feedback.error.title'),
        description: t('auth.signup.form.feedback.error.description', {
          error: translateIfKey(t, state?.error || 'Unknown error')
        }),
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    }
  })
  const msgs = state?.issues?.reduce(
    (acc, issue) => {
      for (const path of issue.path) {
        // console.log(translateIfKey(t, issue.message))
        if (!acc[path as keyof typeof acc])
          acc[path as keyof typeof acc] = translateIfKey(t, issue.message)
      }
      return acc
    },
    {
      email: undefined as string | undefined,
      nickname: undefined as string | undefined,
      password: undefined as string | undefined,
      password_confirmation: undefined as string | undefined
    }
  )

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
    <Stack as="form" gap={4} action={action}>
      <FormControl isInvalid={!!msgs?.email}>
        <Input
          variant="outline"
          placeholder={t('auth.signup.form.placeholder.email')}
          name="email"
          rounded="xl"
          size="lg"
          // value={state.form.email}
          // onChange={(e) => {
          //   state.form.email = e.target.value
          // }}
        />
        {!!msgs?.email && <FormErrorMessage>{msgs?.email}</FormErrorMessage>}
      </FormControl>
      <FormControl isInvalid={!!msgs?.nickname}>
        <Input
          variant="outline"
          placeholder={t('auth.signup.form.placeholder.nickname')}
          name="nickname"
          rounded="xl"
          size="lg"
          // value={state.form.nickname}
          // onChange={(e) => {
          //   state.form.nickname = e.target.value
          // }}
        />
        {!!msgs?.nickname && (
          <FormErrorMessage>{msgs?.nickname}</FormErrorMessage>
        )}
      </FormControl>
      {authType === CredentialsAuthType.Password && (
        <>
          <FormControl isInvalid={!!msgs?.password}>
            <Input
              variant="outline"
              placeholder={t('auth.signup.form.placeholder.password')}
              rounded="xl"
              type="password"
              name="password"
              size="lg"
              // value={state.form.password}
              // onChange={(e) => {
              //   state.form.password = e.target.value
              // }}
            />
            {!!msgs?.password && (
              <FormErrorMessage>{msgs?.password}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl isInvalid={!!msgs?.password_confirmation}>
            <Input
              variant="outline"
              placeholder={t(
                'auth.signup.form.placeholder.password_confirmation'
              )}
              type="password"
              name="password_confirmation"
              rounded="xl"
              size="lg"
              // value={state.form.password_confirmation}
              // onChange={(e) => {
              //   state.form.password_confirmation = e.target.value
              // }}
            />
            {!!msgs?.password_confirmation && (
              <FormErrorMessage>{msgs?.password_confirmation}</FormErrorMessage>
            )}
          </FormControl>
        </>
      )}
      <input
        className="hidden"
        type="hidden"
        name="auth_type"
        value={authType}
      />
      <Submit pending={isVerifyWebauthnPending} />
      <Button
        colorScheme="gray"
        size="lg"
        rounded="xl"
        onClick={() => {
          setAuthType(
            authType === CredentialsAuthType.WebAuthn
              ? CredentialsAuthType.Password
              : CredentialsAuthType.WebAuthn
          )
        }}
      >
        {t('auth.signup.form.buttons.toggle', {
          auth_type: t(
            `auth.type.${
              authType === CredentialsAuthType.WebAuthn
                ? 'credentials'
                : 'webauthn'
            }`
          )
        })}
      </Button>
    </Stack>
  )
}
