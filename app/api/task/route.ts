import { Role } from '@/enums/user'
import client from '@/libs/prisma/client'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
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
    if (expiredPastes.length > 0) {
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
