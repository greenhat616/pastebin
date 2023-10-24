'use client'
import { Button, useDisclosure, useToast } from '@chakra-ui/react'
import { useMemoizedFn } from 'ahooks'
import { useRouter } from 'next/navigation'
import { CreateSnippetModal } from './modal'

export type AddButtonProps = {
  username?: string
}

export function AddButton({ username }: AddButtonProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const router = useRouter()
  const onSuccess = useMemoizedFn((pasteID: string) => {
    toast({
      title: 'Snippet created',
      description: `Your snippet has been created successfully. You can view it at ${pasteID}`,
      status: 'success',
      duration: 5000,
      isClosable: true
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
        isOpen={isOpen}
        onClose={onClose}
        onSuccess={onSuccess}
        nickname={username}
      />
    </div>
  )
}
