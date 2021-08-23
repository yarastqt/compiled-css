import React, { FC, AllHTMLAttributes, ComponentType } from 'react'

import { useStyles } from './use-styles'
import type { StylesChunk } from './types'

export type ComponentProps = AllHTMLAttributes<HTMLElement>

export function component<T = ComponentProps>(
  ElementType: ComponentType | string,
  styles: StylesChunk | StylesChunk[],
): FC<T> {
  const styleList = Array.isArray(styles) ? styles : [styles]

  return function Component(props) {
    const className = useStyles(...styleList)

    return <ElementType className={className} {...props} />
  }
}
