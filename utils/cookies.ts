import { env } from '@/env.mjs'
import { sign, unsign } from 'cookie-signature'
import type { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import { cookies } from 'next/headers'
import 'server-only'

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
