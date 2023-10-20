import { ResponseCode } from '@/enums/response'
import { Role } from '@/enums/user'
import { env } from '@/env.mjs'
import client from '@/libs/prisma/client'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  if (
    env.CRON_TASK_TOKEN &&
    req.headers.get('Authorization') !== `Bearer ${env.CRON_TASK_TOKEN}`
  ) {
    return fail(ResponseCode.NotAuthorized, {})
  }
  try {
    // 1. Check if the first user is admin, if not, grant admin role to it.
    const firstUser = await client.user.findFirst({
      orderBy: {
        createdAt: 'asc'
      }
    })
    if (firstUser && firstUser.role !== Role.Admin) {
      await client.user.update({
        where: {
          id: firstUser.id
        },
        data: {
          role: Role.Admin
        }
      })
    }

    // 2. check whether the expired date is coming, if so, delete paste records
    const expiredPastes = await client.paste.findMany({
      where: {
        expiredAt: {
          lte: new Date()
        }
      }
    })
    if (expiredPastes && expiredPastes.length > 0) {
      await client.paste.deleteMany({
        where: {
          id: {
            in: expiredPastes.map((paste) => paste.id)
          }
        }
      })
    }
  } catch (error) {
    console.error(error)
  } finally {
    // always return success
    return success(null)
  }
}
