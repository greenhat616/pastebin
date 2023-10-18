import CodeForm from '@/components/CodesForm'
import { auth } from '@/libs/auth'
import { Flex } from '@chakra-ui/react'
import { pick } from 'lodash-es'
import {
  NextIntlClientProvider,
  useLocale,
  useMessages,
  type AbstractIntlMessages
} from 'next-intl'
import Announcement from './_components/home/Announcement'
type Props = {
  params: { locale: string }
}

function IntlProvider({ children }: { children: React.ReactNode }) {
  const locale = useLocale()
  const messages = useMessages()
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={pick(messages, 'components', 'home') as AbstractIntlMessages}
    >
      {children}
    </NextIntlClientProvider>
  )
}

// Home Page
export default async function Home(props: Props) {
  const session = await auth()
  return (
    <Flex direction="column">
      <Announcement />
      <IntlProvider>
        <CodeForm
          className="mt-sm"
          defaultNickname={session ? session.user.name || undefined : undefined}
        />
      </IntlProvider>
    </Flex>
  )
}
