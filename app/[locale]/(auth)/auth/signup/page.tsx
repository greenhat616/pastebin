import IntlClientProvider from '@/components/IntlClientProvider'
import { Stack } from '@chakra-ui/react'
import { pick } from 'lodash-es'
import { Metadata } from 'next'
import { AbstractIntlMessages, useLocale, useMessages } from 'next-intl'
import { getTranslator } from 'next-intl/server'
import SignUpForm from './_components/form'

type Props = {
  params: {
    locale: string
  }
}

export async function generateMetadata({
  params: { locale }
}: Props): Promise<Metadata> {
  const t = await getTranslator(locale)

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
