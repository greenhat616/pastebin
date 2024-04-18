import { env } from '@/env.mjs'
import { User } from '@prisma/client'
import md5 from 'md5'
import { type Session } from 'next-auth'

export function getUserAvatar(session: Session | User | undefined | null) {
  const user: Partial<Pick<Session['user'], 'email' | 'avatar'>> =
    (session as Session)?.user || (session as User) || undefined
  // console.log(user)
  return (
    user?.avatar ??
    env.NEXT_PUBLIC_AUTH_GRAVATAR_MIRROR.replace(
      '{hash}',
      user?.email ? md5(user.email) : ''
    )
  )
}
