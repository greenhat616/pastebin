import { Flex } from '@chakra-ui/react'
import { pick } from 'lodash-es'
import {
  NextIntlClientProvider,
  useLocale,
  useMessages,
  type AbstractIntlMessages
} from 'next-intl'
import Announcement from './_components/home/Announcement'
import CodeForm from './_components/home/CodesForm'
type Props = {
  params: { locale: string }
}

// Home Page
export default function Home(props: Props) {
  const locale = useLocale()
  const messages = useMessages()

  return (
    <NextIntlClientProvider
      locale={locale}
      messages={pick(messages, 'home') as AbstractIntlMessages}
    >
      <Flex direction="column">
        <Announcement />
        <CodeForm className="mt-sm" />
      </Flex>
    </NextIntlClientProvider>
  )
}
