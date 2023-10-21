// extends mean it should do something in hast tree. not inject in hook.
import type { Element, Root } from 'hast'
import { getDisplayNameByLanguageID } from './'

/**
 * This function appends a header to the root node.
 * It will add features like language name, copy button, etc.
 * Note that this function should be called after the function that wrapper the shiki root node.
 * @param {Root} root - RootHastNode
 * @param {string} lang - language id
 */
export function appendHeader(root: Root, lang: string) {
  // Root -> [ShikiRootWrapper]
  // This force type cast is safe because we know the structure of the root node.
  ;(<Element>root.children[0]).children.unshift({
    type: 'element',
    tagName: 'div',
    properties: { class: 'header' },
    children: [
      {
        type: 'element',
        tagName: 'span',
        properties: {
          class: 'language-name'
        },
        children: [{ type: 'text', value: getDisplayNameByLanguageID(lang) }]
      },
      {
        type: 'element',
        tagName: 'div',
        properties: { class: 'copy-button' },
        children: []
      }
    ]
  })
}

/**
 * This function wraps the root node with a div.
 * @param {Root} root - RootHastNode
 */
export function wrapperShikiRoot(root: Root) {
  // Root -> pre -> code
  // This force type cast is safe because we know the structure of the root node.
  const shikiRoot = <Element>root.children[0]
  root.children[0] = {
    type: 'element',
    tagName: 'div',
    properties: { class: 'shiki-container' },
    children: [shikiRoot]
  }
}

/**
 * This function append a lines block to the root node.
 * Please note that this function should be called after the functions that append the header and footer.
 * @param root RootHastNode
 */
export function appendLineNumbersBlock(root: Root, lines: number) {
  root.children.unshift({
    type: 'element',
    tagName: 'div',
    properties: { class: 'line-numbers-container' },
    children: [
      {
        type: 'element',
        tagName: 'span',
        properties: { class: 'line block relative', 'data-line': ' ' },
        children: new Array(lines).fill(0).map((_, i) => {
          return {
            type: 'element',
            tagName: 'span',
            properties: { class: 'line-number' },
            children: [
              {
                type: 'text',
                value: (i + 1).toString()
              }
            ]
          }
        })
      }
    ]
  })
}
