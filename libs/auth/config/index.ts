import { Role } from '@/enums/user'
import prisma from '@/libs/prisma/client'
import { createUser, loginByEmail } from '@/libs/services/users/user'
import { SignInSchema } from '@/libs/validation/auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { merge, uniqueId } from 'lodash-es'
import { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import { env } from 'process'
import 'server-only'
import { authConfig as edgeConfig } from './edge'
const adapter = PrismaAdapter(prisma)

export const authConfig = merge(edgeConfig, {
  providers: [
    GitHub({
      clientId: env.AUTH_GITHUB_ID,
      clientSecret: env.AUTH_GITHUB_SECRET
    }),
    Google({
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET
    }),
    Credentials({
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
        const result = await SignInSchema.safeParseAsync(credentials)
        if (!result.success) return null
        const user = await loginByEmail(
          credentials.email as string,
          credentials.password as string
        )
        if (!user) return null
        // throw new Error(
        //   wrapTranslationKey('auth.signin.credentials.feedback.invalid')
        // )
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
} satisfies NextAuthConfig)
