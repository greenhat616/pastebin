import { IntlClientProvider } from '@/components/server-provider'
import { auth } from '@/libs/auth'
import { omit, pick } from 'lodash-es'
import type { Session } from 'next-auth'
import { AbstractIntlMessages, useLocale, useMessages } from 'next-intl'
import { ReactNode } from 'react'
import { Header } from './_components/layout/Header'

type Props = {
  children: ReactNode
}

function HeaderIntlProvider({ children }: Props) {
  const locale = useLocale()
  const messages = useMessages()
  return (
    <IntlClientProvider
      locale={locale}
      messages={pick(messages, 'app.nav') as AbstractIntlMessages}
    >
      {children}
    </IntlClientProvider>
  )
}

export default async function AppLayout({ children }: Props) {
  const session = await auth()
  // console.log(session)
  return (
    <>
      <HeaderIntlProvider>
        <Header
          session={
            session
              ? (omit(session, [
                  'user.jti',
                  'user.exp',
                  'user.iat'
                ]) as Partial<Session>)
              : null
          }
        />
      </HeaderIntlProvider>
      <main>
        <div className="mx-auto max-w-7xl px-3 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </>
  )
}
