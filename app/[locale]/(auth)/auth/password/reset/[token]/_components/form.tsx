'use client'

import { Button, Input } from '@chakra-ui/react'

export function PasswordResetForm() {
  return (
    <>
      <Input variant="outline" placeholder="Password" rounded="xl" size="lg" />
      <Input
        variant="outline"
        placeholder="Confirm Password"
        rounded="xl"
        size="lg"
      />
      <Button colorScheme="gray" size="lg" rounded="xl">
        Reset Password
      </Button>
    </>
  )
}
