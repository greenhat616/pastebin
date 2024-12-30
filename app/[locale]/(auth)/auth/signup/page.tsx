import { IntlClientProvider } from '@/components/server-provider'
import { Stack } from '@chakra-ui/react'
import { pick } from 'lodash-es'
import { Metadata } from 'next'
import { AbstractIntlMessages, useLocale, useMessages } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import SignUpForm from './_components/form'

type Props = {
  params: Promise<{
    locale: string
  }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale })

  return {
    title: `${t('auth.signup.title')} - ${t('app.name')}`
  }
}

function SignUpIntlProvider({ children }: { children: React.ReactNode }) {
  const messages = useMessages()
  const locale = useLocale()

  return (
    <IntlClientProvider
      messages={
        pick(messages, 'auth.signup.form', 'auth.type') as AbstractIntlMessages
      }
      locale={locale}
    >
      {children}
    </IntlClientProvider>
  )
}

export default async function SignUpPage(props: Props) {
  return (
    <SignUpIntlProvider>
      <Stack gap={4}>
        <SignUpForm />
      </Stack>
    </SignUpIntlProvider>
  )
}
