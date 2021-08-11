export type Kind = 'css' | 'keyframes'

export interface CssChunk {
  css: string
  className: string
  /**
   * @internal
   */
  body: string
  /**
   * @internal
   */
  kind: Kind
  /**
   * @internal
   */
  toString: () => string
}

export type Styles = TemplateStringsArray
export type Interpolation = CssChunk | string | number
export type Interpolations = Interpolation[]
