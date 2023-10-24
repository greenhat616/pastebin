'use client'

import { Card, CardBody, CardHeader } from '@chakra-ui/react'
import Header from '../_components/header'
import Shell from '../_components/shell'
import { H2Skeleton, PSkeleton, TextSkeleton } from '../_components/skeleton'

export default function SnippetsLoading() {
  return (
    <Shell>
      <Header heading="Snippets" text="View unexpired snippets you posted." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <Card variant="outline" className="!rounded-2xl">
          <CardHeader>
            <H2Skeleton />
          </CardHeader>
          <CardBody pt="0">
            <div className="flex flex-col gap-4">
              <TextSkeleton lines={2} />
              <PSkeleton />
            </div>
          </CardBody>
        </Card>
        <Card variant="outline" className="!rounded-2xl">
          <CardHeader>
            <H2Skeleton />
          </CardHeader>
          <CardBody pt="0">
            <div className="flex flex-col gap-4">
              <TextSkeleton lines={2} />
              <PSkeleton />
            </div>
          </CardBody>
        </Card>
      </div>
    </Shell>
  )
}
