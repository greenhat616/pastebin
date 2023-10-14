import { Stack } from '@chakra-ui/react'
import { ApplyPasswordResetForm } from './_components/form'

export default async function PasswordResetPage() {
  return (
    <Stack gap={4}>
      <ApplyPasswordResetForm />
    </Stack>
  )
}
