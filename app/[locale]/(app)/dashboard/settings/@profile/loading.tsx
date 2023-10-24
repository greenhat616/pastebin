'use client'

import { Card, CardBody, CardHeader, Heading } from '@chakra-ui/react'
import {
  BlockButtonSkeleton,
  FormInputSkeleton,
  XLargeAvatarSkeleton
} from '../../_components/skeleton'

export default function ProfilesLoading() {
  return (
    <Card variant="outline" className="!rounded-2xl">
      <CardHeader>
        <Heading size="md">Profiles</Heading>
      </CardHeader>
      <CardBody pt="0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="flex flex-col gap-4">
            <FormInputSkeleton />
            <FormInputSkeleton />
            <FormInputSkeleton />
            <FormInputSkeleton />
          </div>
          <div className="flex flex-col gap-4">
            <XLargeAvatarSkeleton />
            <BlockButtonSkeleton />
            <BlockButtonSkeleton />
            <BlockButtonSkeleton />
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
