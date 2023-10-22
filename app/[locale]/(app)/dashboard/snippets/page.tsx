import { auth } from '@/libs/auth'
import client from '@/libs/prisma/client'
import { useLocale } from 'next-intl'
import { getTimeZone } from 'next-intl/server'
import Header from '../_components/Header'
import Shell from '../_components/Shell'
import Snippet from './_components/Snippet'
function getSnippets(userID: string) {
  return client.paste.findMany({
    where: {
      userId: userID
    }
  })
}

export default async function SnippetsPage() {
  const locale = useLocale()
  const timeZone = await getTimeZone(locale)
  const session = await auth()
  const snippets = await getSnippets(session!.user.id)

  return (
    <Shell>
      <Header heading="Snippets" text="View unexpired snippets you posted." />
      {snippets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {snippets.map((snippet) => (
            <Snippet
              key={snippet.id}
              snippet={snippet}
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
