'use client'

import { ResponseCode } from '@/enums/response'
import { ActionReturn, State } from '@/utils/actions'
import { Awaitable } from '@/utils/types'
import { useEffect, useRef, type MutableRefObject } from 'react'

import { useFormState } from 'react-dom'

/**
 * useSubmitForm is a wrapper to use React Server Actions with callbacks handled correctly.
 * Note that {ActionReturn<T>} is a type alias of {State<T>}.
 * @param serverAction - The server action to be invoked.
 * @param callbacks - Callbacks to be invoked when the server action is done.
 * @returns The state of the server action, the form reference and the action to be invoked.
 */
export function useSubmitForm<T, E extends object>(
  serverAction: (
    preState: State<T, E>,
    formData: FormData
  ) => Awaitable<ActionReturn<T, E>>,
  callbacks?: {
    onSuccess?: (
      state: State<T, E>,
      ref: MutableRefObject<null | HTMLFormElement>
    ) => void
    onError?: (
      state: State<T, E>,
      ref: MutableRefObject<null | HTMLFormElement>
    ) => void
  }
): {
  state: State<T, E>
  ref: MutableRefObject<null | HTMLFormElement>
  action: (formData: FormData) => void
}

export function useSubmitForm<T, E extends object>(
  serverAction: (
    preState: State<T, E>,
    formData: FormData
  ) => Awaitable<ActionReturn<T, E>>,
  callbacks: {
    onSuccess?: (
      state: State<T, E>,
      ref: MutableRefObject<null | HTMLFormElement>
    ) => void
    onError?: (
      state: State<T, E>,
      ref: MutableRefObject<null | HTMLFormElement>
    ) => void
  } = {}
) {
  const { onSuccess = () => {}, onError = () => {} } = callbacks
  const ref = useRef(null) as MutableRefObject<null | HTMLFormElement>

  const [state, formAction] = useFormState<State<T, E>>(
    // TODO: use best practice to fix this type assertion
    // This type assertion is intended, because of react server actions is not giving a best practice.
    serverAction as unknown as (formData: State<T, E>) => Promise<State<T, E>>,
    {
      status: ResponseCode.NotInvoke
    } as State<T, E>
  )

  useEffect(() => {
    if (
      (state?.status !== ResponseCode.OK &&
        state?.status !== ResponseCode.NotInvoke) ||
      state?.error
    ) {
      if (typeof onError === 'function') {
        onError(state, ref)
      }
    }

    if (state?.status == ResponseCode.OK) {
      if (typeof onSuccess === 'function') {
        onSuccess(state, ref)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, ref])

  return { state, ref, action: formAction }
}
