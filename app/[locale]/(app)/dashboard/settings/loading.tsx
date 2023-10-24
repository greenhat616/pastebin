'use client'

import { Card, CardBody, CardHeader, Heading } from '@chakra-ui/react'
import { FormInputSkeleton } from '../_components/skeleton'

export default function SettingsLoading() {
  return (
    <Card variant="outline" className="!rounded-2xl">
      <CardHeader>
        <Heading size="md">Apps</Heading>
      </CardHeader>
      <CardBody pt="0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <FormInputSkeleton />
          <FormInputSkeleton />
          <FormInputSkeleton />
          <FormInputSkeleton />
          <FormInputSkeleton />
          <FormInputSkeleton />
          <FormInputSkeleton />
          <FormInputSkeleton />
        </div>
      </CardBody>
    </Card>
  )
}
