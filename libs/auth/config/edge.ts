import { Role } from '@/enums/user'
import { DefaultSession, NextAuthConfig } from 'next-auth'
import { NextResponse } from 'next/server'

export const protectedPathname = ['/admin', '/me']

export type { Session } from 'next-auth'

// Read more at: https://next-auth.js.org/getting-started/typescript#module-augmentation
declare module '@auth/core/adapters' {
  interface AdapterUser {
    /** The user's role. */
    role: Role
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    /** The user's role. */
    role: Role
    avatar: string | null
    isSuspended: boolean
  }
}

declare module 'next-auth' {
  interface Session {
    user: {
      sub: string // It is a alias of id
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
    }
    // session: ({ session, user }) => ({
    //   ...session,
    //   user: {
    //     ...session.user,
    //     id: user.id,
    //     role: user.role
    //   }
    // })
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error'
  }
} as NextAuthConfig
