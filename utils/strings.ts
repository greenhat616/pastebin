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
