import { useMemoizedFn } from 'ahooks'
import { useState } from 'react'

// eslint-disable-next-line @typescript-eslint/ban-types
export function usePendingFn(fn: Function) {
  const [pending, setPending] = useState(false)
  const wrappedFn = async (...args: unknown[]) => {
    setPending(true)
    try {
      await fn(...args)
    } finally {
      setPending(false)
    }
  }
  const memoizedFn = useMemoizedFn(wrappedFn)
  return { pending, fn: memoizedFn }
}
