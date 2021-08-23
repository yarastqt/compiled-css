import { Kind } from './types'
import type { StylesChunk, Styles, Interpolation, Interpolations } from './types'

export function css(styles: Styles, ...interpolations: Interpolations): StylesChunk {
  return compile(Kind.css)(styles, ...interpolations)
}

export function keyframes(styles: Styles, ...interpolations: Interpolations): StylesChunk {
  return compile(Kind.keyframes)(styles, ...interpolations)
}

export function createGlobalStyle(styles: Styles, ...interpolations: Interpolations): StylesChunk {
  return compile(Kind.global)(styles, ...interpolations)
}

function compile(kind: Kind) {
  return (styles: Styles, ...interpolations: Interpolations): StylesChunk => {
    const classNameRe = /{{(.+)}}/
    const executed = styles[0].match(classNameRe)

    if (!executed) {
      throw new Error('Cannot extract className.')
    }

    const className = executed[1]
    const body = [styles[0].replace(classNameRe, '')]
    const extra: string[] = []

    for (let i = 0; i < interpolations.length; i++) {
      const interpolation = interpolations[i]
      const chunk = styles[i + 1]

      if (isStylesChunk(interpolation)) {
        if (interpolation.kind === Kind.css) {
          body.push(interpolation.body + chunk)
        }
        if (interpolation.kind === Kind.keyframes) {
          body.push(interpolation.className + chunk)
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
    const css = createContainer(kind, className, source)

    return { kind, className, css, body: source, toString: () => css }
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
