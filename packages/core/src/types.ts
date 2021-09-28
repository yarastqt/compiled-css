export enum Kind {
  css,
  keyframes,
  global,
}

export interface StylesChunk {
  content: string
  id: string
  selector: string
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
export type Interpolation = StylesChunk | string | number
export type Interpolations = Interpolation[]
