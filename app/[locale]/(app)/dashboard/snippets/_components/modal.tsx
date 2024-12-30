import { CreateNormalSnippet } from '@/components/form'
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot
} from '@/components/ui/dialog'
import { CloseButton } from '@/components/ui/close-button'
import 'client-only'

type ModalProps = {
  open: boolean
  onClose: () => void
}

export interface CreateSnippetModalProps extends ModalProps {
  nickname?: string
  onSuccess?: (pasteID: string) => void
}

export function CreateSnippetModal({
  onClose,
  open: isOpen,
  nickname,
  onSuccess
}: CreateSnippetModalProps) {
  return (
    <DialogRoot
      onOpenChange={onClose}
      open={isOpen}
      motionPreset="slide-in-bottom"
    >
      <DialogContent
        rounded="16px"
        maxWidth={{
          sm: '90%',
          md: '66.6%',
          lg: '50%'
        }}
        py="5"
      >
        <DialogHeader>Create snippet</DialogHeader>
        <DialogCloseTrigger>
          <CloseButton />
        </DialogCloseTrigger>
        <DialogBody>
          <CreateNormalSnippet
            defaultNickname={nickname}
            onSuccess={onSuccess}
          />
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  )
}
