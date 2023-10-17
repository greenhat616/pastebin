// export { GET, POST } from '@/libs/auth'

import { config } from '@/libs/auth'
import NextAuth from 'next-auth/next'

const handler = NextAuth(config)
export { handler as GET, handler as POST }
