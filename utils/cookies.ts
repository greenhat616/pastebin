import { env } from '@/env.mjs'
import { sign, unsign } from 'cookie-signature'
import type { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import { cookies } from 'next/headers'
import 'server-only'
import { z } from 'zod'

export class CookieSignatureMismatchError extends Error {
  constructor() {
    super('Cookie signature mismatch')
  }
}

export function setCookie(
  name: string,
  value: string,
  options: Partial<ResponseCookie & { sign: boolean }> = {}
) {
  cookies().set(
    name,
    options.sign ? sign(value, env.NEXTAUTH_SECRET) : value,
    options
  )
}

export function getCookie(
  name: string,
  options: Partial<{ signed: boolean }> = {}
) {
  const item = cookies().get(name)
  if (options.signed) {
    if (!item) return null
    const unsigned = unsign(item.value, env.NEXTAUTH_SECRET)
    if (!unsigned) throw new CookieSignatureMismatchError()
    item.value = unsigned
  }
  return item
}

export function checkTwiceSignedCookie() {
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
}
