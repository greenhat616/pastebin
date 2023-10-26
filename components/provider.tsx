'use client'
import { queryClient } from '@/libs/requests'
import { QueryClientProvider as ReactQueryClientProvider } from '@tanstack/react-query'

export function QueryClientProvider({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <ReactQueryClientProvider client={queryClient}>
      {children}
    </ReactQueryClientProvider>
  )
}
