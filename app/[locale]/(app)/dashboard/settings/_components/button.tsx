import { linkAccountAction, unlinkAccountAction } from '@/actions/user'
import { ResponseCode } from '@/enums/response'
import { Button } from '@/components/ui/button'
import { useMemoizedFn } from 'ahooks'
import { useRouter } from 'next/navigation'
import { useTransition, type ReactNode } from 'react'
import { toaster } from '@/components/ui/toaster'

export type SSO = {
  id: string
  name: string
  icon: ReactNode
} & {
  connected: boolean
}

export function SSOButton({ sso }: { sso: SSO }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  const onLink = useMemoizedFn(() => {
    startTransition(async () => {
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
        toaster.create({
          title: 'Link account failed.',
          description: e instanceof Error ? e.message : 'Unknown error',
          type: 'error',
          duration: 5000
        })
      }
    })
  })

  const onUnlink = useMemoizedFn(() => {
    startTransition(async () => {
      try {
        const res = await unlinkAccountAction(sso.id)
        if (res.status !== ResponseCode.OK) {
          throw new Error(res.error)
        }
        toaster.create({
          title: 'Account unlinked.',
          type: 'success',
          duration: 5000
        })
        router.refresh()
      } catch (e) {
        toaster.create({
          title: 'Link account failed.',
          description: e instanceof Error ? e.message : 'Unknown error',
          type: 'error',
          duration: 5000
        })
      }
    })
  })

  const text = `${sso.connected ? 'Unlink' : 'Link'} ${sso.name}`

  return (
    <Button
      loading={pending}
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
