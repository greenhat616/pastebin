/**
 * classNames is a utility function to join class names together.
 * It filters out falsy values.
 * @param input
 * @return {string}
 */
export function classNames(
  ...input: Array<string | null | undefined | false>
): string {
  input = input.filter(Boolean) as string[]
  return input.join(' ')
}

/**
 * getLocalePathname return the pathname, which is the rest of the url after the locale.
 * @param {string} pathname - Raw pathname
 * @return {string} - Pathname without the first '/'
 */
export function getLocalePathname(pathname: string): string {
  if (pathname === '/') return pathname
  return pathname.replace(/^\/[a-z]{2}\//, '/')
}
