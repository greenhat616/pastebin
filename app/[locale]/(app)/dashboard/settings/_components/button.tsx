import { linkAccountAction, unlinkAccountAction } from '@/actions/user'
import { ResponseCode } from '@/enums/response'
import { Button, useToast } from '@chakra-ui/react'
import { useMemoizedFn } from 'ahooks'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export type SSO = {
  id: string
  name: string
  icon: JSX.Element
} & {
  connected: boolean
}

export function SSOButton({ sso }: { sso: SSO }) {
  const toast = useToast()
  const router = useRouter()
  // const [pending, startTransition] = useTransition()
  const [pending, setPending] = useState(false)
  const onLink = useMemoizedFn(async () => {
    setPending(true)
    try {
      const res = await linkAccountAction(sso.id)
      if (res.status !== ResponseCode.OK) {
        throw new Error(res.error)
      }
      const win = window.open(res.data!.url, '_blank')
      const timer = setInterval(checkWinIsClosed, 500)
      function checkWinIsClosed() {
        if (win?.closed) {
          clearInterval(timer)
          router.refresh()
        }
      }
    } catch (e) {
      toast({
        title: 'Link account failed.',
        description: e instanceof Error ? e.message : 'Unknown error',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    } finally {
      setPending(false)
    }
  })

  const onUnlink = useMemoizedFn(async () => {
    setPending(true)
    try {
      const res = await unlinkAccountAction(sso.id)
      if (res.status !== ResponseCode.OK) {
        throw new Error(res.error)
      }
      toast({
        title: 'Account unlinked.',
        status: 'success',
        duration: 5000,
        isClosable: true
      })
      router.refresh()
    } catch (e) {
      toast({
        title: 'Link account failed.',
        description: e instanceof Error ? e.message : 'Unknown error',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    } finally {
      setPending(false)
    }
  })

  const text = `${sso.connected ? 'Unlink' : 'Link'} ${sso.name}`

  return (
    <Button
      isLoading={pending}
      disabled={pending}
      loadingText={text}
      colorScheme={sso.connected ? 'blue' : 'gray'}
      className="flex gap-3"
      onClick={sso.connected ? onUnlink : onLink}
    >
      {sso.icon} {text}
    </Button>
  )
}
