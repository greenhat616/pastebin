import client from '@/libs/prisma/client'
import { codeToHTMLWithTransformers } from '@/libs/shiki'
import { Content } from '@/libs/validation/paste'
import { getUserAvatar } from '@/utils/user'
import { Flex, Text } from '@chakra-ui/react'
import { Avatar } from '@/components/ui/avatar'
import { useLocale, useTranslations } from 'next-intl'
import { getTimeZone } from 'next-intl/server'
import { notFound } from 'next/navigation'
import CodePreview from './_components/CodePreview'
import CodePreviewIntlProvider from './_components/CodePreviewIntlProvider'

// function checkUUIDValidation(cuid?: string): boolean {
//   if (!cuid) return false
//   //   try {
//   //     Joi.attempt(uuid, Joi.string().uuid())
//   //   } catch (e) {
//   //     return false
//   //   }
//   //   return true

//   return true
// }

async function getPasteData(cuid: string) {
  return client.paste.findUnique({
    where: {
      id: cuid
    },
    include: {
      user: true
    }
  })
}

type Props = {
  params: { cuid: string }
}

function PosterInfo({
  data,
  timeZone,
  locale
}: {
  data: Awaited<ReturnType<typeof getPasteData>>
  timeZone: string
  locale: string
}) {
  const t = useTranslations()
  // const now = useNow({
  //   // Update every 10 seconds
  //   // updateInterval: 1000 * 10
  //   // TODO: wait for its support in next-intl
  // })
  // const format = useFormatter()

  const avatarUrl = getUserAvatar(data?.user)
  return (
    <Flex
      className="mt-3 mb-5 justify-center md:justify-start items-center"
      gap={5}
    >
      <Avatar size="lg" name={data!.poster} src={avatarUrl} draggable={false} />
      <Flex className="flex-1" direction="column">
        <Text fontSize="2xl" className="font-bold">
          {data!.poster}
        </Text>
        <Text fontSize="sm">
          {t('code-preview.info.posted_at', {
            time: formatDateTime(data!.createdAt, {
              timeZone,
              locale
            })
          })}
        </Text>
        <Text fontSize="sm">
          {t('code-preview.info.expiration', {
            expiration: data!.expiredAt
              ? newDayjs(data!.expiredAt, {
                  timeZone,
                  locale
                }).fromNow()
              : t('code-preview.info.expiration_never')
          })}
        </Text>
      </Flex>
    </Flex>
  )
}

function renderCode(code: string, language: string) {
  return codeToHTMLWithTransformers(code, {
    lang: language
  })
}

export default async function View(props: Props) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const locale = useLocale()
  const timeZone = await getTimeZone({ locale })
  // if (!checkUUIDValidation(props.params.cuid)) return notFound()
  const cuid = props.params.cuid
  const data = await getPasteData(cuid)
  if (!data || !(data?.content as Content[])[0]) notFound()

  const content = (data?.content as Content[])[0] // TODO: support multiple content, gist like
  const renderedContent = await renderCode(content.content, content.syntax)
  return (
    <div>
      {/* <h1>View {cuid}</h1> */}
      <PosterInfo data={data} locale={locale} timeZone={timeZone} />
      <CodePreviewIntlProvider>
        <CodePreview content={content.content} language={content.syntax}>
          <div
            dangerouslySetInnerHTML={{
              __html: renderedContent
            }}
          />
        </CodePreview>
      </CodePreviewIntlProvider>
    </div>
  )
}
