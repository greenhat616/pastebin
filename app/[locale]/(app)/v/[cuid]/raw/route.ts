import { PasteType } from '@/enums/paste'
import client from '@/libs/prisma/client'
import type { Content } from '@/libs/validation/paste'
import { NextRequest } from 'next/server'

export async function GET(
  req: NextRequest,
  { params: { cuid } }: { params: { cuid: string } }
) {
  if (!cuid) return new Response('Not Found', { status: 404 })
  const result = await client.paste.findUnique({
    where: { id: cuid }
  })
  if (!result) return new Response('Not Found', { status: 404 })
  switch (result.type) {
    case PasteType.Gist:
      const filename = req.nextUrl.searchParams.get('filename')
      if (!filename)
        return new Response(
          `Not supported operation. You might want to view /v/${cuid}?filename=example.txt?`,
          { status: 400 }
        )
      const content = (result.content as Array<Content>).find(
        (content) => content.filename === filename
      ) as Content | undefined
      if (!content) return new Response('Not Found', { status: 404 })
      return new Response(content.content, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8'
        }
      })
    case PasteType.Normal:
      return new Response((result.content as Array<Content>)[0].content, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8'
        }
      })
    default:
      return new Response(
        `Not Supported paste type. Maybe you want to view /v/${cuid}/raw/filename`,
        { status: 400 }
      )
  }
}
