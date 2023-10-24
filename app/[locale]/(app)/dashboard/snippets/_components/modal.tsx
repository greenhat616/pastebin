import { CreateNormalSnippet } from '@/components/form'
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay
} from '@chakra-ui/react'
import 'client-only'

type ModalProps = {
  isOpen: boolean
  onClose: () => void
}

export interface CreateSnippetModalProps extends ModalProps {
  nickname?: string
  onSuccess?: (pasteID: string) => void
}

export function CreateSnippetModal({
  onClose,
  isOpen,
  nickname,
  onSuccess
}: CreateSnippetModalProps) {
  return (
    <Modal
      isCentered
      onClose={onClose}
      isOpen={isOpen}
      motionPreset="slideInBottom"
    >
      <ModalOverlay />
      <ModalContent
        rounded="16px"
        maxWidth={{
          sm: '90%',
          md: '66.6%',
          lg: '50%'
        }}
        py="5"
      >
        <ModalHeader>Create snippet</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <CreateNormalSnippet
            defaultNickname={nickname}
            onSuccess={onSuccess}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
