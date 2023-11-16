// Note that it is a Server Component
import { NextIntlClientProvider, type AbstractIntlMessages } from 'next-intl'
import { getNow, getTimeZone } from 'next-intl/server'
import 'server-only'

type IntlProviderProps = {
  locale: string
  messages: AbstractIntlMessages
  children: React.ReactNode
}

export async function IntlClientProvider({
  locale,
  messages,
  children
}: IntlProviderProps) {
  const now = await getNow({ locale })
  const timeZone = await getTimeZone({ locale })
  return (
    <NextIntlClientProvider now={now} timeZone={timeZone} messages={messages}>
      {children}
    </NextIntlClientProvider>
  )
}
