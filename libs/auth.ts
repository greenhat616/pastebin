import { DefaultSession, NextAuthOptions, getServerSession } from 'next-auth'

import { Role } from '@/enums/user'
import { env } from '@/env.mjs'
import prisma from '@/libs/prisma/client'
import { createUser, loginByEmail } from '@/libs/services/users/user'
import { wrapTranslationKey } from '@/utils/strings'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { uniqueId } from 'lodash-es'
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse
} from 'next'
import CredentialsProvider from 'next-auth/providers/credentials'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'

export type { Session } from 'next-auth'

// Read more at: https://next-auth.js.org/getting-started/typescript#module-augmentation
declare module 'next-auth/jwt' {
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

export const config = {
  providers: [
    GitHub({
      clientId: env.AUTH_GITHUB_ID,
      clientSecret: env.AUTH_GITHUB_SECRET
    }),
    Google({
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET
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
        if (!credentials || !credentials.email || !credentials.password)
          return null
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
} satisfies NextAuthOptions

// Helper function to get session without passing config every time
// https://next-auth.js.org/configuration/nextjs#getserversession
export function auth(
  ...args:
    | [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, config)
}
