import { Stack } from '@chakra-ui/react'
import { pick } from 'lodash-es'
import { Metadata } from 'next'
import {
  NextIntlClientProvider,
  useLocale,
  useMessages,
  type AbstractIntlMessages
} from 'next-intl'
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

export default function SignUpPage(props: Props) {
  const messages = useMessages()
  const locale = useLocale()
  return (
    <Stack gap={4}>
      <NextIntlClientProvider
        messages={pick(messages, 'auth.signup.form') as AbstractIntlMessages}
        locale={locale}
      >
        <SignUpForm />
      </NextIntlClientProvider>
    </Stack>
  )
}
