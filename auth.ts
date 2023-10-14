import {
  getServerSession,
  type NextAuthOptions as NextAuthConfig
} from 'next-auth'

import prisma from '@/libs/prisma/client'
import { PrismaAdapter } from '@auth/prisma-adapter'
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse
} from 'next'
import CredentialsProvider from 'next-auth/providers/credentials'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import crypto from 'node:crypto'
import { Role } from './enums/user'
import { createUser, loginByEmail } from './libs/services/users/user'

// Read more at: https://next-auth.js.org/getting-started/typescript#module-augmentation
declare module 'next-auth/jwt' {
  interface JWT {
    /** The user's role. */
    userRole?: Role
  }
}

const adapter = PrismaAdapter(prisma)

export const config = {
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
        if (!credentials) return null
        const user = await loginByEmail(credentials.email, credentials.password)
        return user
      }
    })
  ],
  callbacks: {
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
      return await createUser(
        profile.email,
        crypto.randomBytes(20).toString('hex'), // Generate random password
        {
          avatar: profile.image,
          name: profile.name,
          emailVerified: profile.emailVerified
        }
      )
    }
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error'
  }
} satisfies NextAuthConfig

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
