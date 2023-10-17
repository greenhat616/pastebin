import NextAuth, { DefaultSession } from 'next-auth'

import { Role } from '@/enums/user'
import prisma from '@/libs/prisma/client'
import {
  createUser,
  findUserById,
  loginByEmail
} from '@/libs/services/users/user'
import { wrapTranslationKey } from '@/utils/strings'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { uniqueId } from 'lodash-es'
import CredentialsProvider from 'next-auth/providers/credentials'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'

export type { Session } from 'next-auth'

// Read more at: https://next-auth.js.org/getting-started/typescript#module-augmentation
declare module '@auth/core/jwt' {
  interface JWT {
    /** The user's role. */
    userRole?: Role
  }
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
    } & DefaultSession['user']
  }
}

const adapter = PrismaAdapter(prisma)

const protectedPathname = ['/admin', '/me']

export const {
  handlers: { GET, POST },
  auth
} = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'text',
          placeholder: 'example@domain.com'
        },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials.email || !credentials.password) return null
        const user = await loginByEmail(
          credentials.email as string,
          credentials.password as string
        )
        if (!user)
          throw new Error(
            wrapTranslationKey('auth.signin.credentials.feedback.invalid')
          )
        return user
      }
    })
  ],
  callbacks: {
    async authorized({ request, auth }) {
      if (!request.nextUrl) return true
      if (request.nextUrl.pathname === '/admin') {
        if (!auth) return false
        const user = await findUserById(auth.user.id)
        return user?.role === Role.Admin
      }
      for (const path of protectedPathname) {
        if (request.nextUrl.pathname.startsWith(path)) {
          return !!auth
        }
      }
      return true
    },
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id
      }
    }),
    async jwt({ token, user: { id } }) {
      const user = await prisma.user.findFirst({
        where: {
          id
        }
      })
      token.userRole = user!.role as Role
      return token
    }
  },
  adapter: {
    ...adapter,
    async createUser(profile) {
      const user = await prisma.user.findFirst({
        where: {
          email: profile.email
        }
      })
      if (user) return user // User already exists
      return await createUser(profile.email, uniqueId('user_'), {
        avatar: profile.image,
        name: profile.name,
        emailVerified: profile.emailVerified
      })
    }
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error'
  }
})
// We recommend doing your own environment variable validation
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    export interface ProcessEnv {
      NEXTAUTH_SECRET: string

      AUTH_GITHUB_ID: string
      AUTH_GITHUB_SECRET: string

      AUTH_GOOGLE_ID: string
      AUTH_GOOGLE_SECRET: string
    }
  }
}
