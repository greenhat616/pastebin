import { URLPattern } from 'next/server'

type URLPatternResult = Exclude<ReturnType<URLPattern['exec']>, null>

export type URLPatternParser = [
  URLPattern,
  (patternResult: URLPatternResult) => Record<string, string | undefined>
]

/**
 * Parse params from URL.
 * Fucking Next.js....
 * @param {string} url
 * @return {Record<string, string | undefined>}
 */
export const parseURLParams = <O>(
  url: string,
  patterns: URLPatternParser[]
): Partial<O> => {
  const input = url.split('?')[0]
  let result = {}

  for (const [pattern, handler] of patterns) {
    const patternResult = pattern.exec(input)
    if (patternResult !== null && 'pathname' in patternResult) {
      result = handler(patternResult)
      break
    }
  }
  return result
}
