'use client'

import { CreateNormalSnippet } from '@/components/form'

export function CreateSnippetForm({
  nickname,
  className
}: {
  nickname?: string
  className?: string
}) {
  return (
    <CreateNormalSnippet className={className} defaultNickname={nickname} />
  )
}
