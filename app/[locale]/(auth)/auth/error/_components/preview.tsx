'use client'

import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  Stack
} from '@chakra-ui/react'
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
      >
        <AlertIcon boxSize="40px" mr={0} />
        <AlertTitle mt={4} mb={1} fontSize="lg">
          Auth error occurred
        </AlertTitle>
        <AlertDescription maxWidth="sm">{err}</AlertDescription>
      </Alert>

      <Button colorScheme="gray" size="lg" rounded="xl">
        Go Home
      </Button>
    </Stack>
  )
}
