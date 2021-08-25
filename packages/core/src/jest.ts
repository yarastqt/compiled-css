import { Kind } from './types'
import type { StylesChunk, Styles, Interpolations } from './types'
import { compile } from './compiler'

let counter = 0

export function css(styles: Styles, ...interpolations: Interpolations): StylesChunk {
  return compile(Kind.css)(injectId(styles), ...interpolations)
}

export function keyframes(styles: Styles, ...interpolations: Interpolations): StylesChunk {
  return compile(Kind.keyframes)(injectId(styles), ...interpolations)
}

export function createGlobalStyle(styles: Styles, ...interpolations: Interpolations): StylesChunk {
  return compile(Kind.global)(injectId(styles), ...interpolations)
}

function injectId(styles: Styles) {
  return styles.map((value, index) => {
    if (index === 0) {
      return `{{c${++counter}}}${value}`
    }
    return value
  }) as any as Styles
}
