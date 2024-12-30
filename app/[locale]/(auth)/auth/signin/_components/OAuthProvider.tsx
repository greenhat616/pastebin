'use client'

import { Stack } from '@chakra-ui/react'
import { Button } from '@/components/ui/button'
import { signIn } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import React from 'react'

type OAuthProviderProps = {
  providers: Array<{
    id: string
    name: string
    icon: React.ReactElement
  }>
}

export default function OAuthProvider(props: OAuthProviderProps) {
  const t = useTranslations()
  return (
    <Stack gap={4}>
      {props.providers.map((provider) => {
        return (
          <Button
            key={provider.id}
            colorScheme="gray"
            size="lg"
            rounded="xl"
            onClick={() => signIn(provider.id)}
          >
            {provider.icon}
            {t('auth.signin.sso', {
              provider: provider.name
            })}
          </Button>
        )
      })}
    </Stack>
  )
}
