import type { Styles, Interpolations, StylesChunk } from './types'

export function css(styles: Styles, ...interpolations: Interpolations): StylesChunk {
  throw new NotImplemented()
}

export function keyframes(styles: Styles, ...interpolations: Interpolations): StylesChunk {
  throw new NotImplemented()
}

export function createGlobalStyle(styles: Styles, ...interpolations: Interpolations): StylesChunk {
  throw new NotImplemented()
}

class NotImplemented extends Error {
  constructor() {
    super('For usage please add "@compiled-css/babel-plugin".')
  }
}
