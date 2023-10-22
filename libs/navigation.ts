import {
  createLocalizedPathnamesNavigation,
  Pathnames
} from 'next-intl/navigation'

export const config = {
  // A list of all locales that are supported
  locales: ['en', 'zh-CN'],

  // If this locale is matched, pathnames work without a prefix (e.g. `/about`)
  defaultLocale: 'en'
}

export const pathnames = {
  // If all locales use the same pathname, a
  // single external path can be provided.
  '/auth/signin': '/auth/signin',
  '/auth/signout': '/auth/signout',
  '/auth/error': '/auth/error',
  '/auth/signup': '/auth/signup',
  '/auth/password/reset': '/auth/password/reset',
  '/auth/password/reset/[token]': '/auth/password/reset/[token]',
  '/': '/',
  '/about': '/about',
  '/v/[uuid]': '/v/[uuid]',
  '/dashboard': '/dashboard',
  '/dashboard/notifications': '/dashboard/notifications',
  '/dashboard/snippets': '/dashboard/snippets',
  '/dashboard/settings': '/dashboard/settings'
} satisfies Pathnames<typeof config.locales>

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createLocalizedPathnamesNavigation({ locales: config.locales, pathnames })
