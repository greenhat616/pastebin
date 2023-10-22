import { auth } from '@/libs/auth'
import { useLocale } from 'next-intl'
import { getTimeZone } from 'next-intl/server'
import Header from './_components/Header'
import Shell from './_components/Shell'

export default async function DashboardPage() {
  const session = await auth()
  const locale = useLocale()
  const timeZone = await getTimeZone(locale)
  const now = newDayjs(undefined, { locale, timeZone })
  return (
    <Shell>
      <Header
        heading="Overviews"
        text={`Welcome back, ${session?.user.name}. Today is ${now}.`}
      />
    </Shell>
  )
}
