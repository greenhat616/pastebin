import client from '@/libs/prisma/client'
import { Content } from '@/libs/validation/paste'
import { notFound } from 'next/navigation'
import CodePreview from './_components/CodePreview'
import CodePreviewIntlProvider from './_components/CodePreviewIntlProvider'

function checkUUIDValidation(cuid?: string): boolean {
  if (!cuid) return false
  //   try {
  //     Joi.attempt(uuid, Joi.string().uuid())
  //   } catch (e) {
  //     return false
  //   }
  //   return true

  return true
}

async function getPasteData(cuid: string) {
  return client.paste.findUnique({
    where: {
      id: cuid
    }
  })
}

type Props = {
  params: { cuid: string }
}

export default async function View(props: Props) {
  if (!checkUUIDValidation(props.params.cuid)) return notFound()
  const cuid = props.params.cuid
  const data = await getPasteData(cuid)
  if (!data || !(data?.content as Content[])[0]) return notFound()
  const content = (data?.content as Content[])[0] // TODO: support multiple content, gist like
  return (
    <div>
      <h1>View {cuid}</h1>
      <CodePreviewIntlProvider>
        <CodePreview content={content.content} language={content.syntax} />
      </CodePreviewIntlProvider>
    </div>
  )
}
