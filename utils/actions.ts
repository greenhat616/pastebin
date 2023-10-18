import { ResponseCode } from '@/enums/response'
import { cookies } from 'next/headers'
import { ZodError } from 'zod'

export interface State<T, E> {
  error?: string
  issues?: ZodError<T>['issues'] // Validation issues
  status: ResponseCode
  data?: E
  ts: number
}

export type ActionReturn<T, E> = State<T, E>

export type BaseOptions = {
  cookiesJar?: Map<string, string>
}

function setCookies(cookiesJar: Map<string, string>) {
  for (const [key, value] of cookiesJar) {
    cookies().set(key, value)
  }
}

export function ok<T, E extends object>(
  data?: E,
  options: BaseOptions = {}
): ActionReturn<T, E> {
  if (options.cookiesJar) {
    setCookies(options.cookiesJar)
  }
  return {
    status: ResponseCode.OK,
    ts: Date.now(),
    data
  }
}

type NOkProps<T, E> = {
  error?: string
  issues?: ZodError<T>['issues'] // Validation issues
  data?: E
}

export function nok<T, E extends object>(
  status: ResponseCode,
  args: NOkProps<T, E> = {},
  options: BaseOptions = {}
): ActionReturn<T, E> {
  if (options.cookiesJar) {
    setCookies(options.cookiesJar)
  }
  return {
    status,
    ...args,
    ts: Date.now()
  }
}
