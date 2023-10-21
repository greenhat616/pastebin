import { auth } from '@/libs/auth'
import { providers } from '@/libs/auth/providers'
import client from '@/libs/prisma/client'
import { User } from '@prisma/client'
import Profiles from '../_components/Profiles'

async function getSSOs(userID: string) {
  const accounts = await client.account.findMany({
    where: {
      userId: userID
    }
  })
  return providers.map((provider) => {
    return {
      ...provider,
      connected: accounts.some((account) => account.providerId === provider.id)
    }
  })
}

export default async function ProfilePage() {
  const session = await auth()
  const user = await client.user.findUnique({
    where: {
      id: session!.user.id
    }
  })
  const ssos = await getSSOs(session!.user.id)
  return <Profiles user={user as User} ssos={ssos} />
}
