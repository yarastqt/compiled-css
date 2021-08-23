import { useEffect } from 'react'

import { inject } from './stylesheet'
import type { StylesChunk } from './types'

export function useStyles(...styles: StylesChunk[]): string {
  const classNames = styles.map((style) => style.className)

  useEffect(() => {
    styles.forEach((block) => inject(block))
  }, [])

  return classNames.join(' ')
}
