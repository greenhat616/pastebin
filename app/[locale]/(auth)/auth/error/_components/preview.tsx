'use client'

import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Stack } from '@chakra-ui/react'

import { useSearchParams } from 'next/navigation'

export default function ErrorPreview() {
  const searchParams = useSearchParams()
  const err = searchParams.get('error') || 'Unknown Error'
  return (
    <Stack gap={4}>
      <Alert
        status="error"
        variant="subtle"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        bgColor="transparent"
        minH="175px"
        title="Auth error occurred"
        maxWidth="sm"
      >
        {err}
      </Alert>

      <Button colorScheme="gray" size="lg" rounded="xl">
        Go Home
      </Button>
    </Stack>
  )
}
