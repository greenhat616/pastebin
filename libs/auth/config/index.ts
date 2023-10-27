import { Role } from '@/enums/user'
import { env } from '@/env.mjs'
import prisma from '@/libs/prisma/client'
import {
  createUser,
  findUserById,
  loginByEmail
} from '@/libs/services/users/user'
import { SignInWithPasswordSchema } from '@/libs/validation/auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { merge, uniqueId } from 'lodash-es'
import CredentialsProvider from 'next-auth/providers/credentials'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import crypto from 'node:crypto'
// import 'server-only'
import { NextAuthConfig } from 'next-auth'
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
    CredentialsProvider({
      // id: 'passwordCredentials',
      // TODO: split this into two providers, waiting for upstream fix
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        id: {
          label: 'ID',
          type: 'text',
          placeholder: 'UserID'
        },
        token: { label: 'token', type: 'password' },
        email: {
          label: 'Email',
          type: 'text',
          placeholder: 'example@domain.com'
        },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // console.log(credentials)
        if ('id' in credentials) {
          const id = credentials.id as string
          const token = credentials.token as string

          const authenticator = await prisma.authenticator.findFirst({
            where: {
              userId: id,
              credentialID: token
            }
          })
          if (!authenticator) return null
          const user = await findUserById(id)
          return user
        } else if ('email' in credentials) {
          const result =
            await SignInWithPasswordSchema.safeParseAsync(credentials)
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

        return null
      }
    })
    // CredentialsProvider({
    //   // Note that: it must be called in the server side
    //   id: 'webauthnCredentials',
    //   name: 'WebAuthn',
    //   credentials: {
    //     id: { label: 'id', type: 'text' },
    //     token: { label: 'token', type: 'text' }
    //   },
    //   async authorize(credentials) {
    //     console.log(credentials)
    // const id = credentials.id as string
    // const token = credentials.token as string

    // const authenticator = await prisma.authenticator.findFirst({
    //   where: {
    //     userId: id,
    //     credentialID: token
    //   }
    // })
    // if (!authenticator) return null
    // const user = await findUserById(id)
    // return user
    //   }
    // })
  ],
  callbacks: {
    async jwt(state) {
      if (!state.trigger) return state.token
      const user = await prisma.user.findFirst({
        where: {
          id: state.user.id
        }
      })
      state.token.id = user!.id
      state.token.role = user!.role as Role
      state.token.avatar =
        user!.avatar ||
        env.NEXT_PUBLIC_AUTH_GRAVATAR_MIRROR.replace(
          '{hash}',
          crypto.createHash('md5').update(user!.email).digest('hex')
        )
      state.token.isSuspended = user!.isSuspend
      return { ...state.token }
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
        emailVerified: profile.emailVerified,
        extraFields: {}
      })
    }
  },
  events: {
    /**
     * Called when a user is created
     * @param message
     */
    async linkAccount(message) {
      const user = await findUserById(message.user.id)
      await prisma.user.update({
        where: {
          id: user!.id
        },
        data: {
          extraFields: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ...((user!.extraFields as any) || {}),
            avatar: {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ...((user!.extraFields as any)?.avatar || {}),
              [message.account.provider]: message.profile.image
            }
          }
        }
      })
    },
    /**
     * Called when a user signs in
     * @param  {object} message
     */
    async signIn(message) {
      if (message.account?.type === 'credentials') return
      if (!message.profile) return
      const user = await findUserById(message.user.id)
      await prisma.user.update({
        where: {
          id: message.user.id
        },
        data: {
          extraFields: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ...((user!.extraFields as any) || {}),
            avatar: {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ...((user!.extraFields as any)?.avatar || {}),
              [message.account!.provider]:
                message.profile.picture ||
                message.profile.avatar_url ||
                message.profile.image
            }
          }
        }
      })
    }
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error'
  }
} satisfies NextAuthConfig)
