import { Kind } from './types'
import type { StylesChunk, Styles, Interpolation, Interpolations } from './types'
import { hash } from './crypto'

declare const __dirname: string

export function compile(kind: Kind) {
  return (styles: Styles, ...interpolations: Interpolations): StylesChunk => {
    const body = [styles[0]]
    const extra: string[] = []

    for (let i = 0; i < interpolations.length; i++) {
      const interpolation = interpolations[i]
      const chunk = styles[i + 1]

      if (isStylesChunk(interpolation)) {
        if (interpolation.kind === Kind.css) {
          body.push(interpolation.body + chunk)
        }
        if (interpolation.kind === Kind.keyframes) {
          body.push(interpolation.id + chunk)
          extra.push(interpolation.toString())
        }
        if (interpolation.kind === Kind.global) {
          throw new Error('Cannot use global styles inside css.')
        }
      } else {
        body.push(interpolation + chunk)
      }
    }

    body.push(...extra)

    const source = body.join('')
    const slug = hash(`${__dirname}${source}`)
    const id = `css-${slug}`
    const content = createContainer(kind, id, source)

    return {
      kind,
      id,
      content,
      body: source,
      toString: () => content,
      selector: `.${id}`,
    }
  }
}

function createContainer(kind: Kind, className: string, body: string) {
  if (kind === Kind.css) {
    return `.${className}{${body}}`
  }

  if (kind === Kind.keyframes) {
    return `@keyframes ${className}{${body}}`
  }

  if (kind === Kind.global) {
    return body
  }

  throw new Error(`Unexpected kind ${kind}.`)
}

function isStylesChunk(value: Interpolation): value is StylesChunk {
  return typeof value === 'object' && value.kind !== undefined
}
