import { Kind } from './types'
import type { StylesChunk, Styles, Interpolations } from './types'
import { compile } from './compiler'

export function css(styles: Styles, ...interpolations: Interpolations): StylesChunk {
  return compile(Kind.css)(styles, ...interpolations)
}

export function keyframes(styles: Styles, ...interpolations: Interpolations): StylesChunk {
  return compile(Kind.keyframes)(styles, ...interpolations)
}

export function createGlobalStyle(styles: Styles, ...interpolations: Interpolations): StylesChunk {
  return compile(Kind.global)(styles, ...interpolations)
}
