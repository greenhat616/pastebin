import React from 'react'

// Global CSS
// import 'uno.css'
import '@/styles/global.scss'

// Lib
import { Analytics } from '@vercel/analytics/react'
// import { useLocale } from 'next-intl'
import { notFound } from 'next/navigation'
// import { Inter } from 'next/font/google'

import { Metadata } from 'next'
import { useLocale } from 'next-intl'
import {
  getFormatter,
  getNow,
  getTimeZone,
  getTranslations
} from 'next-intl/server'

import { UnoCSSIndicator } from '@/components/uno-css-indicator'
import { Fira_Code } from 'next/font/google'
const firaCode = Fira_Code({
  variable: '--font-fira-code',
  subsets: ['latin', 'cyrillic']
})

export async function generateMetadata({
  params: { locale }
}: Omit<Props, 'children'>): Promise<Metadata> {
  const t = await getTranslations({
    locale: locale,
    namespace: 'app'
  })
  const formatter = await getFormatter({ locale })
  const now = await getNow({ locale })
  const timeZone = await getTimeZone({ locale })

  return {
    title: t('name'),
    description: t('description'),
    other: {
      currentYear: formatter.dateTime(now, { year: 'numeric' }),
      timeZone: timeZone || 'Asia/Shanghai'
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
      <body className={`${firaCode.variable} font-sans`}>
        <UnoCSSIndicator />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
