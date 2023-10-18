'use client'

import { signUpAction } from '@/actions/auth'
import { SignUp } from '@/libs/validation/auth'
import {
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  Stack,
  useToast
} from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
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

function Submit() {
  const t = useTranslations()
  const { pending } = useFormStatus()
  // if (!pending && state.error) {
  // }
  return (
    <Button
      colorScheme="gray"
      size="lg"
      rounded="xl"
      isLoading={pending}
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
  const toast = useToast()
  const callbackURL = useSearchParams().get('callbackUrl')

  // Form
  const signUp = signUpAction.bind(null, callbackURL || undefined)
  const { state, action } = useSubmitForm<SignUp, object>(signUp, {
    // onSuccess: (state) => {},
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
        console.log(translateIfKey(t, issue.message))
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
        {msgs?.email && <FormErrorMessage>{msgs?.email}</FormErrorMessage>}
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
        {msgs?.nickname && (
          <FormErrorMessage>{msgs?.nickname}</FormErrorMessage>
        )}
      </FormControl>
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
          placeholder={t('auth.signup.form.placeholder.password_confirmation')}
          type="password_confirmation"
          name="password_confirmation"
          rounded="xl"
          size="lg"
          // value={state.form.password_confirmation}
          // onChange={(e) => {
          //   state.form.password_confirmation = e.target.value
          // }}
        />
        {msgs?.password_confirmation && (
          <FormErrorMessage>{msgs?.password_confirmation}</FormErrorMessage>
        )}
      </FormControl>
      <Submit />
      <Button
        colorScheme="gray"
        size="lg"
        rounded="xl"
        onClick={() => {
          window.history.back()
        }}
      >
        {t('auth.signup.form.buttons.back')}
      </Button>
    </Stack>
  )
}
