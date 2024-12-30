'use client'
import { Button, useDisclosure } from '@chakra-ui/react'
import { useMemoizedFn } from 'ahooks'
import { useRouter } from 'next/navigation'
import { CreateSnippetModal } from './modal'
import { toaster } from '@/components/ui/toaster'
import { open } from 'fs'

export type AddButtonProps = {
  username?: string
}

export function AddButton({ username }: AddButtonProps) {
  const { open, onOpen, onClose } = useDisclosure()
  const router = useRouter()
  const onSuccess = useMemoizedFn((pasteID: string) => {
    toaster.create({
      title: 'Snippet created',
      description: `Your snippet has been created successfully. You can view it at ${pasteID}`,
      type: 'success',
      duration: 5000
    })
    router.refresh()
    onClose()
  })
  return (
    <div>
      <Button rounded="16px" onClick={onOpen}>
        Create snippet
      </Button>
      <CreateSnippetModal
        open={open}
        onClose={onClose}
        onSuccess={onSuccess}
        nickname={username}
      />
    </div>
  )
}
