'use client'
import { Button, Input } from '@chakra-ui/react'

export default function Credentials() {
  return (
    <>
      <Input variant="outline" placeholder="Email" rounded="xl" size="lg" />
      <Input variant="outline" placeholder="Password" rounded="xl" size="lg" />
      <Button colorScheme="gray" size="lg" rounded="xl">
        Sign In
      </Button>
    </>
  )
}
