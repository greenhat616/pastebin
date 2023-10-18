// export { GET, POST } from '@/libs/auth'

import { handlers } from '@/libs/auth'
// import NextAuth from 'next-auth/next'

// const handler = NextAuth(config)
// export { handler as GET, handler as POST }
export const { GET, POST } = handlers
