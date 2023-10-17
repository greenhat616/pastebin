'use client'
import { useRouter } from '@/libs/navigation'
import type { TranslationKey } from '@/utils/strings'
import {
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  useToast
} from '@chakra-ui/react'
import { useMemoizedFn, useReactive } from 'ahooks'
import Joi from 'joi'
import { signIn } from 'next-auth/react'
import { useTranslations } from 'next-intl'

export default function Credentials() {
  // Deps
  const router = useRouter()
  const t = useTranslations()
  const toast = useToast()
  const signInSchema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        'string.email': t('auth.signin.credentials.feedback.email.invalid'),
        'string.empty': t('auth.signin.credentials.feedback.email.required')
      }),
    password: Joi.string()
      .required()
      .messages({
        'string.empty': t('auth.signin.credentials.feedback.password.required')
      })
  })

  // States
  const state = useReactive({
    form: {
      email: '',
      password: ''
    },
    error: {
      email: undefined,
      password: undefined
    } as {
      email?: string
      password?: string
    },
    loading: false
  })

  // Events
  const handleSignIn = useMemoizedFn(() => {
    state.error = {}
    const { error } = signInSchema.validate(state.form, { abortEarly: false })
    if (error) {
      for (const detail of error.details) {
        console.log(detail)
        for (const path of detail.path) {
          if (!state.error[path as keyof typeof state.form])
            state.error[path as keyof typeof state.form] = detail.message
        }
      }
      return
    }
    state.error = {}
    state.loading = true
    signIn('credentials', {
      redirect: false,
      email: state.form.email,
      password: state.form.password
    })
      .then((res) => {
        if (!res || !res.ok) {
          throw new Error(
            !!res
              ? `${
                  res.error
                    ? isTranslationKey(res.error)
                      ? t(unwrapTranslationKey(res.error as TranslationKey))
                      : res.error
                    : ''
                } - ${res.status}`
              : 'Unknown error'
          )
        }
        toast({
          title: t('auth.signin.credentials.feedback.success.title'),
          description: t(
            'auth.signin.credentials.feedback.success.description'
          ),
          status: 'success',
          duration: 2000,
          isClosable: true
        })
        setTimeout(() => {
          // Disable lint because of callback must be valid url
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore ts(2345)
          router.push(res.url || '/')
        }, 3000)
      })
      .catch((err) => {
        console.error(err)
        toast({
          title: t('auth.signin.credentials.feedback.error.title'),
          description: t('auth.signin.credentials.feedback.error.description', {
            error: err.message
          }),
          status: 'error',
          duration: 5000,
          isClosable: true
        })
      })
      .finally(() => {
        state.loading = false
      })
  })

  return (
    <>
      <FormControl isInvalid={!!state.error.email}>
        <Input
          variant="outline"
          placeholder={t('auth.signin.credentials.placeholder.email')}
          rounded="xl"
          size="lg"
          type="email"
          value={state.form.email}
          onChange={(e) => {
            state.form.email = e.target.value
          }}
        />
        {!!state.error.email && (
          <FormErrorMessage>{state.error.email}</FormErrorMessage>
        )}
      </FormControl>
      <FormControl isInvalid={!!state.error.password}>
        <Input
          variant="outline"
          placeholder={t('auth.signin.credentials.placeholder.password')}
          rounded="xl"
          size="lg"
          type="password"
          value={state.form.password}
          onChange={(e) => {
            state.form.password = e.target.value
          }}
        />
        {!!state.error.password && (
          <FormErrorMessage>{state.error.password}</FormErrorMessage>
        )}
      </FormControl>
      <Button
        colorScheme="gray"
        size="lg"
        rounded="xl"
        onClick={handleSignIn}
        isLoading={state.loading}
        loadingText={t('auth.signin.credentials.loading')}
      >
        {t('auth.signin.credentials.button')}
      </Button>
    </>
  )
}
