// Shikiji is a fork of Shiki, and it will be merged back to Shiki soon
// TODO: use shiki internal plugin instead our own extension
import { DistributiveOmit, DistributivePick } from '@/utils/types'
import type { Root } from 'hast'
import { toHtml as hastToHTML } from 'hast-util-to-html'
import {
  bundledLanguages,
  bundledLanguagesInfo,
  getHighlighter,
  type BundledLanguage,
  type Highlighter
} from 'shiki'

const cachedShikiAllSupportedLanguages = Object.values(
  bundledLanguagesInfo
).map((lang) => {
  return {
    id: lang.id,
    name: lang.name
  }
})

export type ShikiLanguage = {
  id: string
  name?: string
}

/**
 * This function returns the display name of a language by its ID.
 * @param {string} id - Language ID
 * @returns {string} - Language display name
 * TODO: Use a map instead filter the array every time, and the map will have the ext as key, and the language as value.
 */
export function getDisplayNameByLanguageID(id: string): string {
  const lang = cachedShikiAllSupportedLanguages.find((lang) => lang.id === id)
  return lang ? lang.name || lang.id : id.charAt(0).toUpperCase() + id.slice(1)
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
  themes: ['nord', 'min-light'],
  langs: Object.keys(bundledLanguages)
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

export type Options = Parameters<Highlighter['codeToHtml']>['1']
const defaultOptions: Options = {
  lang: 'text', // default is plain text
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
 * It was a wrapper of codeToHast, which means it only call codeToHast, and translate hast to HTML.
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
  options: Partial<Options>
): Promise<string> {
  return hastToHTML(await codeToHast(code, options))
}

/**
 * Convert code to Hast.
 * This function will load the language if it's not loaded yet.
 * @param {string} code - code to be converted
 * @param {Partial<Options>} options - Shiki highlighter options
 * @return {Promise<Root>} - Hast output
 */
export async function codeToHast(
  code: string,
  options: Partial<Options>
): Promise<Root> {
  const mergedOptions = { ...defaultOptions, ...options } as Options
  const shiki = await getShikiSingleton()
  const loadedLangs = await shiki.getLoadedLanguages()
  if (
    mergedOptions.lang !== 'text' &&
    !loadedLangs.includes(mergedOptions.lang)
  ) {
    await shiki.loadLanguage(mergedOptions.lang as BundledLanguage)
  }
  return shiki.codeToHast(code, mergedOptions)
}

export type TransformersOptions = {
  highlightLines?: Array<string>
}

/**
 * convert attrs into line numbers:
 *    {4,7-13,16,23-27,40} -> [4,7,8,9,10,11,12,13,16,23,24,25,26,27,40]
 * @param {string} attrs - attrs string
 * @return {Array<number>} - line numbers
 */
export const attrsToLines = (attrs: string): Array<number> => {
  const lines = new Set<number>()
  attrs.split(',').forEach((attr) => {
    if (attr.includes('-')) {
      const [start, end] = attr.split('-')
      for (let i = parseInt(start); i <= parseInt(end); i++) {
        lines.add(i)
      }
    } else {
      lines.add(parseInt(attr))
    }
  })
  return Array.from(lines)
}

/**
 * Convert code to HTML, with transformer included. Import features like line numbers, copy button, etc.
 * This function will load the language if it's not loaded yet.
 * @param {string} code - code to be converted
 * @param {Partial<Options & TransformersOptions>} options - Shiki highlighter options
 * @return {Promise<string>} - HTML string
 * @example
 * ```js
 * import { codeToHTMLWithTransformer } from 'utils/shiki'
 * const html = await codeToHTML('const a = 1', { lang: 'javascript' })
 * ```
 */
export async function codeToHTMLWithTransformers(
  code: string,
  options: DistributiveOmit<Partial<Options>, 'lang'> &
    Required<DistributivePick<Options, 'lang'>> &
    Partial<TransformersOptions>
): Promise<string> {
  // Highlight lines feature
  let highlightLines = undefined as Array<number> | undefined
  if (options.highlightLines) {
    highlightLines = attrsToLines(options.highlightLines.join(','))
  }
  // let lines = 0
  const mergedOptions = {
    transformers: [
      ...(options.transformers || []),
      {
        code(node) {
          options.lang && (node.properties.class = `language-${options.lang}`)
        },
        line(node, line) {
          // node.properties['data-line'] = line
          // lines = line
          if (highlightLines && highlightLines.includes(line))
            node.properties.class += ' highlight'
        },
        span(node, line, col) {
          node.properties.class = `token:${line}:${col}`
        }
      }
    ],
    ...options
  } as Options
  const hast = await codeToHast(code, mergedOptions)
  // inject features
  // wrapperShikiRoot(hast)
  // appendHeader(hast, mergedOptions.lang || 'Text')
  // appendLineNumbersBlock(hast, lines)
  return hastToHTML(hast)
}
