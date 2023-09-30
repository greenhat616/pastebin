import { NextResponse, NextRequest } from 'next/server'

import { i18n } from './i18n-config'

// Get the preferred locale, similar to above or using a library
function getLocale(request: NextRequest) {
  const acceptLanguage = request.headers.get('Accept-Language')
  const locale = acceptLanguage?.split(',')[0]

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore ts(2345)
  if (locale && i18n.locales.includes(locale)) {
    return locale
  }
  return i18n.defaultLocale
}

export function middleware(request: NextRequest) {
  // Check if there is any supported locale in the pathname
  const pathname = request.nextUrl.pathname
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request)

    // e.g. incoming request is /products
    // The new URL is now /en-US/products
    return NextResponse.redirect(new URL(`/${locale}/${pathname}`, request.url))
  }
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next).*)'
    // Optional: only run on root (/) URL
    // '/'
  ]
}
