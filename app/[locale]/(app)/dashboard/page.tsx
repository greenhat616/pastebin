import { auth } from '@/libs/auth'
import Header from './_components/Header'
import Shell from './_components/Shell'

export default async function DashboardPage() {
  const session = await auth()
  return (
    <Shell>
      <Header heading={'Hello, ' + session!.user.name} text="Overviews" />
    </Shell>
  )
}
