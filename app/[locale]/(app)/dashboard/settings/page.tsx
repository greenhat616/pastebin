import { auth } from '@/libs/auth'
import { Card, CardBody, Heading } from '@chakra-ui/react'

import AppSettings from './_components/app-settings'

export default async function DashboardPage() {
  const session = await auth()
  return (
    <Card.Root variant="outline" rounded={'16px'}>
      <Card.Header>
        <Heading size="md">Apps</Heading>
      </Card.Header>
      <CardBody pt="0">
        <AppSettings />
      </CardBody>
    </Card.Root>
  )
}
