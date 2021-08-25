import type { Styles, Interpolations, StylesChunk } from './types'

export function css(styles: Styles, ...interpolations: Interpolations): StylesChunk {
  throw new NotImplemented('css')
}

export function keyframes(styles: Styles, ...interpolations: Interpolations): StylesChunk {
  throw new NotImplemented('keyframes')
}

export function createGlobalStyle(styles: Styles, ...interpolations: Interpolations): StylesChunk {
  throw new NotImplemented('createGlobalStyle')
}

class NotImplemented extends Error {
  constructor(type: string) {
    super(`For usage ${type} please add "@compiled-css/babel-plugin".`)
  }
}
