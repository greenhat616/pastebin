import { auth } from '@/libs/auth'
import { useLocale } from 'next-intl'
import { getTimeZone } from 'next-intl/server'
import Header from './_components/header'
import Shell from './_components/shell'

export default async function DashboardPage() {
  const session = await auth()
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const locale = useLocale()
  const timeZone = await getTimeZone({ locale })
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
