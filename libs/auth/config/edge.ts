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
  }
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: Role
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
    async authorized({ request, auth }) {
      console.log(auth)
      if (!request.nextUrl) return true
      if (request.nextUrl.pathname.startsWith('/admin')) {
        if (!auth) return NextResponse.redirect('/auth/signin')
        // return auth?.user === Role.Admin
      }
      for (const path of protectedPathname) {
        if (request.nextUrl.pathname.startsWith(path)) {
          return !!auth
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
