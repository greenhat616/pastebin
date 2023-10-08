import { ChakraProvider } from '@chakra-ui/react'
import { pick } from 'lodash-es'
import {
  AbstractIntlMessages,
  NextIntlClientProvider,
  useLocale,
  useMessages
} from 'next-intl'
import { ReactNode } from 'react'
import { Header } from './_components/layout/Header'
type Props = {
  children: ReactNode
}

export default function AppLayout({ children }: Props) {
  const locale = useLocale()
  const messages = useMessages()
  return (
    <ChakraProvider>
      <NextIntlClientProvider
        locale={locale}
        messages={pick(messages, 'app.nav') as AbstractIntlMessages}
      >
        <Header />
      </NextIntlClientProvider>
      <main>
        <div className="mx-auto max-w-7xl px-3 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </ChakraProvider>
  )
}
