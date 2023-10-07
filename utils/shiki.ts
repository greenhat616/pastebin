'use client'
import { BUNDLED_LANGUAGES } from 'shiki'
// FIXME: use shiki instead of shikiji
// import { bundledLanguagesBase } from 'shikiji' // Shikiji is a fork of Shiki, and it will be merged back to Shiki soon
import { getHighlighter, type BuiltinLanguage, type Highlighter } from 'shikiji'
import { DistributiveOmit, DistributivePick } from './types'

const cachedShikiAllSupportedLanguages = BUNDLED_LANGUAGES.map((lang) => ({
  id: lang.id,
  name: lang.displayName
}))

export type ShikiLanguage = {
  id: string
  name?: string
}

/**
 * This function returns all supported languages by Shiki.
 * @returns {Array<ShikiLanguage>} - All supported languages by Shiki
 */
export function getShikiAllSupportedLanguages(): Array<ShikiLanguage> {
  return cachedShikiAllSupportedLanguages
}

type HighlighterOptions = Parameters<typeof getHighlighter>[0]
const defaultHighlighterOptions: HighlighterOptions = {
  themes: ['nord', 'min-light']
}

let shiki = undefined as Highlighter | undefined

/**
 * Get Shiki highlighter singleton.
 * @returns {Promise<Highlighter>} - Shiki highlighter singleton
 */
export async function getShikiSingleton(): Promise<Highlighter> {
  if (!shiki) {
    shiki = await getHighlighter(defaultHighlighterOptions)
  }
  return shiki
}

type Options = Parameters<Highlighter['codeToHtml']>['1']
const defaultOptions: DistributiveOmit<Options, 'lang'> = {
  themes: {
    dark: 'nord',
    light: 'min-light'
  }
}

/**
 *  Create a singleton of Shiki highlighter, and replace the default one.
 * @param {Partial<HighlighterOptions>} options - Shiki highlighter options
 * @return {Promise<Highlighter>}
 */
export async function createShikiSingleton(
  options: Partial<HighlighterOptions> = {}
) {
  const mergedOptions = {
    ...defaultHighlighterOptions,
    ...options
  } as HighlighterOptions
  const highlighter = await getHighlighter(mergedOptions)
  shiki = highlighter
  return highlighter
}

/**
 * Convert code to HTML.
 * This function will load the language if it's not loaded yet.
 * @param {string} code - code to be converted
 * @param {Partial<Options>} options - Shiki highlighter options
 * @return {Promise<string>} - HTML string
 * @example
 * ```js
 * import { codeToHTML } from 'utils/shiki'
 * const html = await codeToHTML('const a = 1', { lang: 'javascript' })
 * ```
 */
export async function codeToHTML(
  code: string,
  options: DistributiveOmit<Partial<Options>, 'lang'> &
    Required<DistributivePick<Options, 'lang'>>
): Promise<string> {
  const mergedOptions = { ...defaultOptions, ...options } as Options
  const shiki = await getShikiSingleton()
  const loadedLangs = await shiki.getLoadedLanguages()
  if (!loadedLangs.includes(mergedOptions.lang)) {
    await shiki.loadLanguage(mergedOptions.lang as BuiltinLanguage)
  }
  const html = await shiki.codeToHtml(code, mergedOptions)
  return html
}
