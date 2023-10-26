import { IntlClientProvider } from '@/components/server-provider'
import { pick } from 'lodash-es'
import { useLocale, useMessages, type AbstractIntlMessages } from 'next-intl'
import React from 'react'

type Props = {
  children: React.ReactNode
}

export default function CodePreviewIntlProvider(props: Props) {
  const messages = useMessages()
  const locale = useLocale()

  return (
    <IntlClientProvider
      messages={pick(messages, 'code-preview') as AbstractIntlMessages}
      locale={locale}
    >
      {props.children}
    </IntlClientProvider>
  )
}
