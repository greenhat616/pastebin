import { config } from '@/auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import NextAuth from 'next-auth/next'

const prisma = new PrismaClient()
const handler = NextAuth({ ...config, adapter: PrismaAdapter(prisma) })
export { handler as GET, handler as POST }
