/**
 * TrimChars returns a slice of the string s with all leading and trailing Unicode code points contained in cutset removed.
 * @param str raw string
 * @param cutset the char set to trim
 * @return {string}
 */
export function trimChars(str: string, cutset: string) {
  let start = 0,
    end = str.length

  while (start < end && cutset.indexOf(str[start]) >= 0) ++start

  while (end > start && cutset.indexOf(str[end - 1]) >= 0) --end

  return start > 0 || end < str.length ? str.substring(start, end) : str
}

/**
 * TrimCharsLeft returns a slice of the string s with all leading Unicode code points contained in cutset removed.
 * @param str raw string
 * @param cutset the char set to trim
 * @return {string}
 */
export function trimCharsLeft(str: string, cutset: string) {
  let start = 0
  const end = str.length

  while (start < end && cutset.indexOf(str[start]) >= 0) ++start

  return start > 0 || end < str.length ? str.substring(start, end) : str
}

/**
 * TrimCharsRight returns a slice of the string s, with all trailing Unicode code points contained in cutset removed.
 * @param str raw string
 * @param cutset the char set to trim
 * @return {string}
 */
export function trimCharsRight(str: string, cutset: string) {
  let end = str.length
  const start = 0

  while (end > start && cutset.indexOf(str[end - 1]) >= 0) --end

  return start > 0 || end < str.length ? str.substring(start, end) : str
}

/**
 * return the number of lines in a string
 * @param {string} str - Raw string
 * @return {number} - Number of lines
 */
export function getLines(str: string): number {
  return str.split('\n').length
}

export type TranslationKey = `[${string}]`

/**
 * Judge whether the string is a translation key
 * @param str - Raw string
 * @returns {boolean} - Whether the string is a translation key
 */
export function isTranslationKey(str: string): boolean {
  return /^\[.*\]$/.test(str)
}

/**
 * Unwrap the translation key
 * @param str - Raw string
 * @returns {string} - Unwrapped string
 */
export function unwrapTranslationKey(str: TranslationKey): string {
  return str.replace(/^\[(.*)\]$/, '$1')
}

/**
 * Wrap the translation key
 * @param str - Raw string
 * @returns {TranslationKey} - Wrapped string
 */
export function wrapTranslationKey(str: string): TranslationKey {
  return `[${str}]` as TranslationKey
}
