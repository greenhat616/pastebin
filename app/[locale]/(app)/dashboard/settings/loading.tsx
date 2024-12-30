'use client'

import { Card, CardBody, Heading } from '@chakra-ui/react'
import { FormInputSkeleton } from '../_components/skeleton'

export default function SettingsLoading() {
  return (
    <Card.Root variant="outline" className="!rounded-2xl">
      <Card.Header>
        <Heading size="md">Apps</Heading>
      </Card.Header>
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
    </Card.Root>
  )
}
