'use client'

import {
  // AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
  useDisclosure
} from '@chakra-ui/react'
import { Alert } from "@/components/ui/alert"
import { CloseButton } from '@/components/ui/close-button'


export default function Announcement() {
  const {
    open: isVisible,
    onClose,
    onOpen
  } = useDisclosure({ defaultOpen: true })

  return (
    isVisible && (
      <Alert className="w-full rounded-md" status="info">
        <Box className="flex-1">
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>
            Your application has been received. We will review your application
            and respond within the next 48 hours.
          </AlertDescription>
        </Box>
        <CloseButton
          alignSelf="flex-start"
          position="relative"
          right={-1}
          top={-1}
          onClick={onClose}
        />
      </Alert>
    )
  )
}
