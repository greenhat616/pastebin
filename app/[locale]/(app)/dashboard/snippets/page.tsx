import { PasteType } from '@/enums/paste'
import { auth } from '@/libs/auth'
import client from '@/libs/prisma/client'
import { getDisplayNameByLanguageID } from '@/libs/shiki'
import { Card, CardBody, CardHeader, Flex, Tag } from '@chakra-ui/react'
import { useLocale } from 'next-intl'
import { getTimeZone } from 'next-intl/server'
import Header from '../_components/Header'
import Shell from '../_components/Shell'
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
            <Card key={snippet.id} variant="outline" className="!rounded-2xl">
              <CardHeader>
                <Flex>
                  <h2 className="font-medium text-lg flex-1">
                    {snippet.title || 'Untitled Snippet'}
                  </h2>
                  <div className="flex gap-2">
                    <Tag>{formatPasteType(snippet.type as PasteType)}</Tag>
                    {(snippet.type as PasteType) === PasteType.Normal && (
                      <Tag>
                        {getDisplayNameByLanguageID(snippet.syntax || 'text')}
                      </Tag>
                    )}
                  </div>
                </Flex>
              </CardHeader>
              <CardBody pt="0">
                <p className="text-sm font-italic">
                  {snippet.description || 'No description provided.'}
                </p>
                <div className="flex gap-3 mt-5">
                  <p className="truncate flex-1 text-sm">
                    Posted on:{' '}
                    {newDayjs(snippet.createdAt, {
                      timeZone,
                      locale
                    }).fromNow()}
                  </p>

                  {!!snippet.expiredAt && (
                    <Tag>
                      Expired{' '}
                      {newDayjs(snippet.expiredAt, {
                        timeZone,
                        locale
                      }).fromNow()}
                    </Tag>
                  )}
                </div>
              </CardBody>
            </Card>
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
