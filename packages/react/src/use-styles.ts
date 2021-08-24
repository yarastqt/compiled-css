import { useEffect } from 'react'

import { inject } from './stylesheet'
import type { StylesChunk } from './types'
import { useStyleSheetManager } from './stylesheet-manager'

export function useStyles(...styles: StylesChunk[]): string {
  const classNames = styles.map((style) => style.className)

  if (typeof window === 'undefined') {
    const manager = useStyleSheetManager()
    for (const style of styles) {
      manager.set(style.className, style.css)
    }
  }

  useEffect(() => {
    styles.forEach((block) => inject(block))
  }, [])

  return classNames.join(' ')
}
