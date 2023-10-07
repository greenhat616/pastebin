import React from 'react'

// Lib
// import { useLocale } from 'next-intl'
import { notFound } from 'next/navigation'
// import { Inter } from 'next/font/google'

import { Metadata } from 'next'
import { useLocale } from 'next-intl'
import {
  getFormatter,
  getNow,
  getTimeZone,
  getTranslator
} from 'next-intl/server'

export async function generateMetadata({
  params: { locale }
}: Omit<Props, 'children'>): Promise<Metadata> {
  const t = await getTranslator(locale, 'app')
  const formatter = await getFormatter(locale)
  const now = await getNow(locale)
  const timeZone = await getTimeZone(locale)

  return {
    title: t('name'),
    description: t('description'),
    other: {
      currentYear: formatter.dateTime(now, { year: 'numeric' }),
      timeZone: timeZone || 'N/A'
    }
  }
}

type Props = {
  children: React.ReactNode
  params: { locale: string }
}

export default function LocaleLayout({ children, params }: Props) {
  const locale = useLocale()
  if (params.locale !== locale) notFound()
  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  )
}
