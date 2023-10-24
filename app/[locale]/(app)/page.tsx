import IntlClientProvider from '@/components/IntlClientProvider'
import { auth } from '@/libs/auth'
import { Flex } from '@chakra-ui/react'
import { pick } from 'lodash-es'
import { useLocale, useMessages, type AbstractIntlMessages } from 'next-intl'
import Announcement from './_components/home/Announcement'
import { CreateSnippetForm } from './_components/home/form'
type Props = {
  params: { locale: string }
}

function CreateSnippetIntlProvider({
  children
}: {
  children: React.ReactNode
}) {
  const locale = useLocale()
  const messages = useMessages()
  return (
    <IntlClientProvider
      locale={locale}
      messages={pick(messages, 'components', 'home') as AbstractIntlMessages}
    >
      {children}
    </IntlClientProvider>
  )
}

// Home Page
export default async function Home(props: Props) {
  const session = await auth()
  return (
    <Flex direction="column">
      <Announcement />
      <CreateSnippetIntlProvider>
        <CreateSnippetForm
          className="mt-4"
          nickname={session ? session.user.name || undefined : undefined}
        />
      </CreateSnippetIntlProvider>
    </Flex>
  )
}
