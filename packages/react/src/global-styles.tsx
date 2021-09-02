import type { FC } from 'react'
import type { StylesChunk } from '@steely/core'

import { useStyles } from './use-styles'

interface GlobalStylesProps {
  styles: StylesChunk | StylesChunk[]
}

export const GlobalStyles: FC<GlobalStylesProps> = (props) => {
  const { styles } = props
  const styleList = Array.isArray(styles) ? styles : [styles]

  useStyles(...styleList)

  return null
}
