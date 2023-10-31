import { ResponseCode } from '@/enums/response'
import { auth } from '@/libs/auth'
import client from '@/libs/prisma/client'
import { NextRequest, type NextResponse } from 'next/server'
import { z } from 'zod'

export type APIAuthenticatorResponse = {
  name?: string
  credentialID: string
  updatedAt: Date
  createdAt: Date
}

export const GET = auth(async function (req): Promise<NextResponse> {
  if (!req.auth) return fail(ResponseCode.NotAuthorized, {})
  // Check signed token
  try {
    const signedTwiceConfirmationToken = getCookie('user.twice_confirmed', {
      signed: true
    })
    if (!signedTwiceConfirmationToken) throw new Error('No signed token found')
    const arr = signedTwiceConfirmationToken.value.split('.')
    if (arr.length !== 2) throw new Error('Invalid signed token')
    z.string().uuid().parse(arr[0]) // Check token
    if (Date.now() - Number(arr[1]) > 1000 * 60 * 15) {
      // 15 minutes
      throw new Error('Token expired')
    }
  } catch (e) {
    return fail(ResponseCode.NotAuthorized, {
      message: (e as Error).message
    })
  }

  // Get authenticators
  const authenticators = await client.authenticator.findMany({
    where: { userId: req.auth.user.id },
    orderBy: { createdAt: 'desc' }
  })
  return success(
    authenticators.map(
      (authenticator) =>
        ({
          name: authenticator.name,
          credentialID: authenticator.credentialID,
          updatedAt: authenticator.updatedAt, // Last used
          createdAt: authenticator.createdAt
        }) as APIAuthenticatorResponse
    )
  )
}) as unknown as (req: NextRequest) => Promise<NextResponse>
