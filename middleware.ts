import { config as Locales, pathnames } from '@/libs/navigation'
import { type Awaitable } from '@/utils/types'
import NextAuth from 'next-auth'
import type { NextAuthRequest } from 'next-auth/lib'
// import { NextRequestWithAuth, withAuth } from 'next-auth/middleware'
import createMiddleware from 'next-intl/middleware'
import { type ResponseCookies } from 'next/dist/compiled/@edge-runtime/cookies'
import { type NextMiddlewareResult } from 'next/dist/server/web/types'
import { NextResponse } from 'next/server'
import { authConfig } from './libs/auth/config/edge'
export type MiddlewareCtx = {
  headers: Headers
  cookies: ResponseCookies
  // Context is a map, and will be destroyed after the request.
  // It maybe a good place to store some security related data, such as token or user info.
  context: Map<string, unknown>
}

// const protectedPathname = ['/admin', '/me']

// const authMiddleware = withAuth({
//   callbacks: {
//     async authorized({ req: request, token }) {
//       if (!request.nextUrl) return true
//       if (request.nextUrl.pathname.startsWith('/admin')) {
//         if (!token) return false
//         return token?.userRole === Role.Admin
//       }
//       for (const path of protectedPathname) {
//         if (request.nextUrl.pathname.startsWith(path)) {
//           return !!token
//         }
//       }
//       return true
//     }
//   }
// }) as unknown as Middleware // It is intentional, because of the event in next middleware is deprecated,
// and the next-auth/middleware will drop the event in upcoming version 5.
const { auth } = NextAuth(authConfig)
const injectPathnameMiddleware: Middleware = async (req, ctx) => {
  const { headers } = ctx
  // const res = NextResponse.next()
  // res.headers.set('x-pathname', req.nextUrl.pathname)
  headers.set('x-pathname', req.nextUrl.pathname)
}

export type Middleware = (
  req: NextAuthRequest,
  ctx: MiddlewareCtx
) => Awaitable<NextMiddlewareResult>

const middlewares: Array<Middleware> = [
  injectPathnameMiddleware,
  // i18n middleware
  createMiddleware({
    ...Locales,
    pathnames,
    localePrefix: 'never'
  }),
  auth as Middleware
]

export default async function middleware(req: NextAuthRequest) {
  const response = NextResponse.next()
  const context = new Map<string, unknown>()
  for (const fn of middlewares) {
    const res = await fn(req, {
      // Note that: it was ref, so that the sub middleware can modify the ctx
      headers: response.headers,
      cookies: response.cookies,
      context
    })
    if (res) {
      // 1. check if middleware has already responded with a failure
      // 2. check if middleware has already rewritten the url,
      // Ref: https://github.com/vercel/next.js/blob/dbf35a7fd436cd72174fb7dc22cd5c8d55774857/packages/next/src/server/web/spec-extension/response.ts#L96
      if (res.status !== 200 || res.headers.get('x-middleware-rewrite')) {
        copyHeaders(res.headers, response.headers)
        if (!!(res as NextResponse<unknown>)['cookies'])
          copyCookies((res as NextResponse<unknown>).cookies, response.cookies)
        return res
      }
      // Extends headers and cookies
      for (const [key, value] of res.headers.entries()) {
        req.headers.set(key, value) // It is intentional, to let sub middlewares can get the ctx headers
        response.headers.set(key, value)
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore ts(2339)
      res.cookies &&
        (res as NextResponse<unknown>).cookies.getAll().forEach((cookie) => {
          req.cookies.set(cookie) // It is intentional, to let sub middlewares can get the ctx cookies
          response.cookies.set(cookie)
        })
    }
  }
  return response
}

function copyHeaders(target: Headers, input: Headers) {
  for (const [key, value] of input.entries()) {
    target.set(key, value)
  }
}

function copyCookies(target: ResponseCookies, input: ResponseCookies) {
  for (const cookie of input.getAll()) {
    target.set(cookie)
  }
}

export const config = {
  // Skip all paths that should not be internationalized. This example skips
  // certain folders and all pathnames with a dot (e.g. favicon.ico)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}
