import { Awaitable } from '@/utils/types'
import { toaster } from '@/components/ui/toaster'
import { useMemoizedFn } from 'ahooks'

type UseToastFeedbackProps<E extends Event> = {
  fn: (e: E) => Awaitable<void>
  messages: {
    [K in 'success' | 'info' | 'warning']?: {
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
  [K in 'success' | 'info' | 'warning' | 'error']?: {
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

  const toastFeedback = useMemoizedFn(
    (
      message: ToastMessages,
      status: 'success' | 'info' | 'warning' | 'error'
    ) => {
      toaster.create({
        title: message[status]?.title || 'No Title',
        description: message[status]?.description || undefined,
        type: status
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
