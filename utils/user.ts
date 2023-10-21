import { env } from '@/env.mjs'
import { User } from '@prisma/client'
import { Session } from 'next-auth/types'
import crypto from 'node:crypto'

export function getUserAvatar(session: Session | User | undefined | null) {
  const user: Partial<Pick<Session['user'], 'email' | 'avatar'>> =
    (session as Session)?.user || (session as User) || undefined
  return (
    user?.avatar ??
    env.NEXT_PUBLIC_AUTH_GRAVATAR_MIRROR.replace(
      '{hash}',
      user?.email
        ? crypto
            .createHash('md5')
            .update(user?.email)
            .digest('hex')
        : ''
    )
  )
}
