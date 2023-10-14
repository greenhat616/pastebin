'use client'

import { Button, Input } from '@chakra-ui/react'

export function ApplyPasswordResetForm() {
  return (
    <>
      <Input variant="outline" placeholder="Email" rounded="xl" size="lg" />
      <Button colorScheme="gray" size="lg" rounded="xl">
        Apply Password Reset
      </Button>
    </>
  )
}
