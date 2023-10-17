'use client'

import { Button, FormControl, FormErrorMessage, Input } from '@chakra-ui/react'
import { useMemoizedFn, useReactive } from 'ahooks'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { z } from 'zod'
type State = {
  form: {
    email: string
    nickname: string
    password: string
    password_confirmation: string
  }
  error: {
    email?: string
    nickname?: string
    password?: string
    password_confirmation?: string
  }
  loading: boolean
}

export default function SignUpForm() {
  const t = useTranslations('auth.signup.form')

  const state = useReactive<State>({
    form: {
      email: '',
      nickname: '',
      password: '',
      password_confirmation: ''
    },
    error: {},
    loading: false
  })

  const onSubmit = useMemoizedFn(() => {})
  return (
    <>
      <FormControl isInvalid={!!state.error.email}>
        <Input
          variant="outline"
          placeholder={t('placeholder.email')}
          rounded="xl"
          size="lg"
          value={state.form.email}
          onChange={(e) => {
            state.form.email = e.target.value
          }}
        />
        {state.error.email && (
          <FormErrorMessage>{state.error.email}</FormErrorMessage>
        )}
      </FormControl>
      <FormControl isInvalid={!!state.error.nickname}>
        <Input
          variant="outline"
          placeholder={t('placeholder.nickname')}
          rounded="xl"
          size="lg"
          value={state.form.nickname}
          onChange={(e) => {
            state.form.nickname = e.target.value
          }}
        />
        {state.error.nickname && (
          <FormErrorMessage>{state.error.nickname}</FormErrorMessage>
        )}
      </FormControl>
      <FormControl isInvalid={!!state.error.password}>
        <Input
          variant="outline"
          placeholder={t('placeholder.password')}
          rounded="xl"
          size="lg"
          value={state.form.password}
          onChange={(e) => {
            state.form.password = e.target.value
          }}
        />
        {state.error.password && (
          <FormErrorMessage>{state.error.password}</FormErrorMessage>
        )}
      </FormControl>
      <FormControl isInvalid={!!state.error.password_confirmation}>
        <Input
          variant="outline"
          placeholder={t('placeholder.password_confirmation')}
          rounded="xl"
          size="lg"
          value={state.form.password_confirmation}
          onChange={(e) => {
            state.form.password_confirmation = e.target.value
          }}
        />
        {state.error.password_confirmation && (
          <FormErrorMessage>
            {state.error.password_confirmation}
          </FormErrorMessage>
        )}
      </FormControl>
      <Button colorScheme="gray" size="lg" rounded="xl">
        {t('buttons.submit')}
      </Button>
      <Button
        colorScheme="gray"
        size="lg"
        rounded="xl"
        onClick={() => {
          window.history.back()
        }}
      >
        {t('buttons.back')}
      </Button>
    </>
  )
}
