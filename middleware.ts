import createMiddleware from 'next-intl/middleware'
import { Locales } from './i18n'

export default createMiddleware({
  ...Locales
})

export const config = {
  // Skip all paths that should not be internationalized. This example skips
  // certain folders and all pathnames with a dot (e.g. favicon.ico)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}
