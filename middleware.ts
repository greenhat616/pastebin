import createMiddleware from 'next-intl/middleware'
import { ResponseCookies } from 'next/dist/compiled/@edge-runtime/cookies'
import { NextRequest, NextResponse } from 'next/server'
import { Awaitable } from 'unocss'
import { config as Locales, pathnames } from './navigation'

export type MiddlewareCtx = {
  headers: Headers
  cookies: ResponseCookies
  // Context is a map, and will be destroyed after the request.
  // It maybe a good place to store some security related data, such as token or user info.
  context: Map<string, unknown>
}

const injectPathnameMiddleware: Middleware = async (req, ctx) => {
  const { headers } = ctx
  // const res = NextResponse.next()
  // res.headers.set('x-pathname', req.nextUrl.pathname)
  headers.set('x-pathname', req.nextUrl.pathname)
}

export type Middleware = (
  req: NextRequest,
  ctx: MiddlewareCtx
) => Awaitable<NextResponse | void>

const middlewares: Array<Middleware> = [
  injectPathnameMiddleware,
  // i18n middleware
  createMiddleware({
    ...Locales,
    pathnames
  })
]

export default async function middleware(req: NextRequest) {
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
        copyCookies(res.cookies, response.cookies)
        return res
      }
      // Extends headers and cookies
      for (const [key, value] of res.headers.entries()) {
        req.headers.set(key, value) // It is intentional, to let sub middlewares can get the ctx headers
        response.headers.set(key, value)
      }
      res.cookies.getAll().forEach((cookie) => {
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
