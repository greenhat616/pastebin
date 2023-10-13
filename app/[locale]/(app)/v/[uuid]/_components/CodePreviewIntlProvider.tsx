import { pick } from 'lodash-es'
import {
  NextIntlClientProvider,
  useLocale,
  useMessages,
  type AbstractIntlMessages
} from 'next-intl'
import React from 'react'

type Props = {
  children: React.ReactNode
}

export default function CodePreviewIntlProvider(props: Props) {
  const messages = useMessages()
  const locale = useLocale()

  return (
    <NextIntlClientProvider
      messages={pick(messages, 'code-preview') as AbstractIntlMessages}
      locale={locale}
    >
      {props.children}
    </NextIntlClientProvider>
  )
}
