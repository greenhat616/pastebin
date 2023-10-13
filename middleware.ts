import { Awaitable } from '@/utils/types'
import { withAuth, type NextRequestWithAuth } from 'next-auth/middleware'
import createMiddleware from 'next-intl/middleware'
import { ResponseCookies } from 'next/dist/compiled/@edge-runtime/cookies'
import { NextMiddlewareResult } from 'next/dist/server/web/types'
import { NextFetchEvent, NextResponse } from 'next/server'
import { config as Locales, pathnames } from './navigation'

export type MiddlewareCtx = {
  headers: Headers
  cookies: ResponseCookies
  // Context is a map, and will be destroyed after the request.
  // It maybe a good place to store some security related data, such as token or user info.
  context: Map<string, unknown>
}

const injectPathnameMiddleware: Middleware = async (req, event, ctx) => {
  const { headers } = ctx
  // const res = NextResponse.next()
  // res.headers.set('x-pathname', req.nextUrl.pathname)
  headers.set('x-pathname', req.nextUrl.pathname)
}

export type Middleware = (
  req: NextRequestWithAuth,
  event: NextFetchEvent,
  ctx: MiddlewareCtx
) => Awaitable<NextMiddlewareResult>

const middlewares: Array<Middleware> = [
  injectPathnameMiddleware,
  withAuth({
    callbacks: {
      authorized({ req, token }) {
        // `/admin` requires admin role
        if (req.nextUrl.pathname === '/admin') {
          return token?.userRole === 'admin'
        }
        // `/me` only requires the user to be logged in
        return !!token
      }
    }
  }) as Middleware,
  // i18n middleware
  createMiddleware({
    ...Locales,
    pathnames
  })
]

export default async function middleware(
  req: NextRequestWithAuth,
  event: NextFetchEvent
) {
  const response = NextResponse.next()
  const context = new Map<string, unknown>()
  for (const fn of middlewares) {
    const res = await fn(req, event, {
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
