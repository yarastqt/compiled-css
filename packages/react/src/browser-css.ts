import type { Styles, Interpolations, CssChunk } from './types'

export function css(styles: Styles, ...interpolations: Interpolations): CssChunk {
  throw new NotImplemented()
}

export function keyframes(styles: Styles, ...interpolations: Interpolations): CssChunk {
  throw new NotImplemented()
}

class NotImplemented extends Error {
  constructor() {
    super('For usage please add "@compiled-css/babel-plugin".')
  }
}
