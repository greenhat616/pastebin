import { IntlClientProvider } from '@/components/server-provider'
import { auth } from '@/libs/auth'
import client from '@/libs/prisma/client'
import { Paste } from '@prisma/client'
import { pick } from 'lodash-es'
import { AbstractIntlMessages, useLocale, useMessages } from 'next-intl'
import { getTimeZone } from 'next-intl/server'
import Header from '../_components/header'
import Shell from '../_components/shell'
import { AddButton } from './_components/button'
import Snippet from './_components/snippet'
function getSnippets(userID: string) {
  return client.paste.findMany({
    where: {
      userId: userID
    },
    orderBy: {
      createdAt: 'desc'
    },
    select: {
      id: true,
      title: true,
      createdAt: true,
      expiredAt: true,
      description: true,
      syntax: true,
      type: true,
      content: false
    }
  })
}

function AddButtonIntlProvider({ children }: { children: React.ReactNode }) {
  const locale = useLocale()
  const messages = useMessages()
  return (
    <IntlClientProvider
      locale={locale}
      messages={pick(messages, 'components') as AbstractIntlMessages}
    >
      {children}
    </IntlClientProvider>
  )
}

export default async function SnippetsPage() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const locale = useLocale()
  const timeZone = await getTimeZone({ locale })
  const session = await auth()
  const snippets = await getSnippets(session!.user.id)

  return (
    <Shell>
      <Header heading="Snippets" text="View unexpired snippets you posted.">
        <AddButtonIntlProvider>
          <AddButton username={session?.user.name as string} />
        </AddButtonIntlProvider>
      </Header>
      {snippets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {snippets.map((snippet) => (
            <Snippet
              key={snippet.id}
              snippet={snippet as Paste}
              timeZone={timeZone}
              locale={locale}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl mt-10">
          <div className="flex items-center h-[150px] justify-center">
            <ISolarInboxLinear
              width={50}
              height={50}
              className="text-gray-200"
            />
          </div>

          <h2 className="text-center text-sm text-gray-400">
            No snippets found.
          </h2>
        </div>
      )}
    </Shell>
  )
}
