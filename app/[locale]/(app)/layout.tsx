import { ChakraProvider } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { Header } from './_components/layout/Header'

type Props = {
  children: ReactNode
}

export default function AppLayout({ children }: Props) {
  return (
    <ChakraProvider>
      <Header />
      <main>
        <div className="mx-auto max-w-7xl px-3 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </ChakraProvider>
  )
}
