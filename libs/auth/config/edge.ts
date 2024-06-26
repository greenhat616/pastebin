import { Role } from '@/enums/user'
import { NextAuthConfig, type DefaultSession } from 'next-auth'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { type JWT } from 'next-auth/jwt'
import { NextResponse } from 'next/server'

export const protectedPathname = ['/admin', '/me']

export type { Session } from 'next-auth'

declare module 'next-auth/jwt' {
  interface JWT {
    /** The user's role. */
    id: string
    role: Role
    avatar: string | null
    isSuspended: boolean
  }
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string // It is a alias of id
      // id: string
      role: Role
      avatar: string | null
      isSuspended: boolean
    } & DefaultSession['user']
  }
}

// Note that it is a minimal config, that it is ensure it can exec in edge runtime.
export const authConfig = {
  providers: [],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    // Note that: this hook only invoked in signed in user.
    // So that, we should reject the request in layout react server component.
    async authorized({ request, auth }) {
      if (!request.nextUrl) return true
      if (request.nextUrl.pathname.startsWith('/admin')) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore ts(2339)
        if (!auth || auth?.user?.role !== Role.Admin) {
          return NextResponse.redirect(request.nextUrl.href)
        }
        return true
      }
      for (const path of protectedPathname) {
        if (request.nextUrl.pathname.startsWith(path) && !auth) {
          const redirectUrl = new URL('/auth/signin', request.nextUrl.origin)
          redirectUrl.searchParams.set('callbackUrl', request.nextUrl.href)
          return NextResponse.redirect(redirectUrl)
        }
      }
      return true
    },
    async session(params) {
      params.session = {
        ...params.session,
        user: {
          ...params.session.user,
          id: params.token.id,
          role: params.token.role,
          avatar: params.token.avatar,
          isSuspended: params.token.isSuspended
        }
      }
      return params.session
    }
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error'
  }
} as NextAuthConfig
