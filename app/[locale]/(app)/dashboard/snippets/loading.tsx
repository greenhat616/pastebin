'use client'

import { Card } from '@chakra-ui/react'
import Header from '../_components/header'
import Shell from '../_components/shell'
import { H2Skeleton, PSkeleton, TextSkeleton } from '../_components/skeleton'

export default function SnippetsLoading() {
  return (
    <Shell>
      <Header heading="Snippets" text="View unexpired snippets you posted." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <Card.Root variant="outline" className="!rounded-2xl">
          <Card.Header>
            <H2Skeleton />
          </Card.Header>
          <Card.Body pt="0">
            <div className="flex flex-col gap-4">
              <TextSkeleton lines={2} />
              <PSkeleton />
            </div>
          </Card.Body>
        </Card.Root>
        <Card.Root variant="outline" className="!rounded-2xl">
          <Card.Header>
            <H2Skeleton />
          </Card.Header>
          <Card.Body pt="0">
            <div className="flex flex-col gap-4">
              <TextSkeleton lines={2} />
              <PSkeleton />
            </div>
          </Card.Body>
        </Card.Root>
      </div>
    </Shell>
  )
}
