'use client'

import {
  Alert,
  // AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  Box,
  useDisclosure
} from '@chakra-ui/react'

type Props = {
  // children: React.ReactNode
}

export default function Announcement(props: Props) {
  const {
    isOpen: isVisible,
    onClose,
    onOpen
  } = useDisclosure({ defaultIsOpen: true })

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
