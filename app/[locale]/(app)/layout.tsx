import { ChakraProvider } from '@chakra-ui/react'
import { omit, pick } from 'lodash-es'
import {
  AbstractIntlMessages,
  NextIntlClientProvider,
  useLocale,
  useMessages
} from 'next-intl'
import { ReactNode } from 'react'

import { auth } from '@/libs/auth'
import { Session } from 'next-auth/types'
import { Header } from './_components/layout/Header'

type Props = {
  children: ReactNode
}

function IntlProvider({ children }: Props) {
  const locale = useLocale()
  const messages = useMessages()
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={pick(messages, 'app.nav') as AbstractIntlMessages}
    >
      {children}
    </NextIntlClientProvider>
  )
}

export default async function AppLayout({ children }: Props) {
  const session = await auth()

  return (
    <ChakraProvider>
      <IntlProvider>
        <Header
          session={
            session
              ? (omit(session, ['user.jti', 'user.exp', 'user.iat']) as Session)
              : null
          }
        />
      </IntlProvider>
      <main>
        <div className="mx-auto max-w-7xl px-3 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </ChakraProvider>
  )
}
