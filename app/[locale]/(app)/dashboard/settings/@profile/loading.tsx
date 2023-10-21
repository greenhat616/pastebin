'use client'

import { Card, CardBody, CardHeader, Flex, Heading } from '@chakra-ui/react'
import AvatarSkeleton from '../_components/AvatarSkeleton'
import ButtonSkeleton from '../_components/ButtonSkeleton'
import InputSkeleton from '../_components/InputSkeleton'

export default function ProfilesLoading() {
  return (
    <Card variant="outline" className="!rounded-2xl">
      <CardHeader>
        <Heading size="md">Profiles</Heading>
      </CardHeader>
      <CardBody pt="0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <Flex gap={4}>
            <InputSkeleton />
            <InputSkeleton />
            <InputSkeleton />
            <InputSkeleton />
          </Flex>
          <Flex gap={4}>
            <AvatarSkeleton />
            <ButtonSkeleton />
            <ButtonSkeleton />
            <ButtonSkeleton />
          </Flex>
        </div>
      </CardBody>
    </Card>
  )
}
