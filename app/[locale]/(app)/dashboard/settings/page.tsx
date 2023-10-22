import { auth } from '@/libs/auth'
import { Card, CardBody, CardHeader, Heading } from '@chakra-ui/react'

import AppSettings from './_components/AppSettings'

export default async function DashboardPage() {
  const session = await auth()
  return (
    <Card variant="outline" rounded={'32px'}>
      <CardHeader>
        <Heading size="md">Apps</Heading>
      </CardHeader>
      <CardBody pt="0">
        <AppSettings />
      </CardBody>
    </Card>
  )
}
