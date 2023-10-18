import NextAuth from 'next-auth'
import 'server-only'
import { authConfig } from './config'

export const { auth, signIn, signOut, handlers } = NextAuth(authConfig)
