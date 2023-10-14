'use client'

import { Button, Input } from '@chakra-ui/react'

export default function SignUpForm() {
  return (
    <>
      <Input variant="outline" placeholder="Email" rounded="xl" size="lg" />
      <Input variant="outline" placeholder="Nickname" rounded="xl" size="lg" />
      <Input variant="outline" placeholder="Password" rounded="xl" size="lg" />
      <Input
        variant="outline"
        placeholder="Confirm Password"
        rounded="xl"
        size="lg"
      />
      <Button colorScheme="gray" size="lg" rounded="xl">
        Sign Up
      </Button>
      <Button
        colorScheme="gray"
        size="lg"
        rounded="xl"
        onClick={() => {
          window.history.back()
        }}
      >
        Go Back
      </Button>
    </>
  )
}
