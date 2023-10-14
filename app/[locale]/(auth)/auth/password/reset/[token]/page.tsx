import { Stack } from '@chakra-ui/react'
import { PasswordResetForm } from './_components/form'

type Props = {
  params: {
    token: string
  }
}

export default function ResetPasswordPage(props: Props) {
  // 1. verify token
  // 2. if token is valid, show reset password form
  return (
    <Stack gap={4}>
      <PasswordResetForm />
    </Stack>
  )
}
