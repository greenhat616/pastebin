import { QueryClient } from '@tanstack/react-query'
import 'client-only'
import { ofetch } from 'ofetch'
// Requests should

export const ofetchClient = ofetch.create({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore ts(7017)
  fetch: globalThis._nextOriginalFetch || globalThis.fetch
})

export const queryClient = new QueryClient()
