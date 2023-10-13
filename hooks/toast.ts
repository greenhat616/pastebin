import { Awaitable } from '@/utils/types'
import { useToast, type AlertStatus } from '@chakra-ui/react'
import { useMemoizedFn } from 'ahooks'

type UseToastFeedbackProps<E extends Event> = {
  fn: (e: E) => Awaitable<void>
  messages: {
    [K in Exclude<AlertStatus, 'error'>]?: {
      title: string
      description: string
    }
  } & {
    error?:
      | {
          title: string
          description: string
        }
      | ((e: Error) => {
          title: string
          description: string
        })
  }
}
type ToastMessages = {
  [K in AlertStatus]?: {
    title: string
    description: string
  }
}

/**
 * useToastFeedback is a hook that wrap the function with toast feedback
 * @param {UseToastFeedbackProps} props - The props of the hook
 * @return {Function} - The wrapped function
 */
export function useToastFeedback<E extends Event>(
  props: UseToastFeedbackProps<E>
) {
  const { messages } = props
  const toast = useToast()

  const toastFeedback = useMemoizedFn(
    (message: ToastMessages, status: AlertStatus) => {
      toast({
        title: message[status]?.title || 'No Title',
        description: message[status]?.description || undefined,
        status,
        isClosable: true
      })
    }
  )

  return useMemoizedFn((e: E) => {
    let res = undefined as Awaitable<void>
    try {
      res = props.fn(e)
    } catch (e) {
      const msg =
        typeof messages.error === 'function'
          ? messages.error(e as Error)
          : messages.error
      toastFeedback(
        {
          error: msg
        },
        'error'
      )
    } finally {
      // judge the result of the function
      if (!res) {
        // It must be no promise returned
        toastFeedback(messages as ToastMessages, 'success')
        return
      }
      // Otherwise, it must be a promise returned
      res
        .then(() => {
          toastFeedback(messages as ToastMessages, 'success')
        })
        .catch((e) => {
          const msg =
            typeof messages.error === 'function'
              ? messages.error(e as Error)
              : messages.error
          toastFeedback(
            {
              error: msg
            },
            'error'
          )
        })
    }
  })
}
