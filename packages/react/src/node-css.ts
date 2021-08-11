import type { Kind, CssChunk, Styles, Interpolation, Interpolations } from './types'

export function css(styles: Styles, ...interpolations: Interpolations): CssChunk {
  return compile('css')(styles, ...interpolations)
}

export function keyframes(styles: Styles, ...interpolations: Interpolations): CssChunk {
  return compile('keyframes')(styles, ...interpolations)
}

function compile(kind: Kind) {
  return (styles: Styles, ...interpolations: Interpolations): CssChunk => {
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

      if (isCssChunk(interpolation)) {
        if (interpolation.kind === 'keyframes') {
          body.push(interpolation.className + styles[i + 1])
          extra.push(interpolation.toString())
        }
      } else {
        body.push(interpolation + styles[i + 1])
      }
    }

    body.push(...extra)

    const css = createContainer(kind, className, body.join(''))

    return { kind, className, css, toString: () => css }
  }
}

function createContainer(kind: Kind, className: string, body: string) {
  if (kind === 'css') {
    return `.${className}{${body}}`
  }

  if (kind === 'keyframes') {
    return `@keyframes ${className}{${body}}`
  }

  throw new Error(`Unexpected kind ${kind}.`)
}

function isCssChunk(value: Interpolation): value is CssChunk {
  return typeof value === 'object' && value.kind !== undefined
}
