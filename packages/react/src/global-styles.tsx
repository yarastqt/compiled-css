import { FC } from 'react'

import { useStyles } from './use-styles'
import type { StylesChunk } from './types'

interface GlobalStylesProps {
  styles: StylesChunk | StylesChunk[]
}

export const GlobalStyles: FC<GlobalStylesProps> = (props) => {
  const { styles } = props
  const styleList = Array.isArray(styles) ? styles : [styles]

  useStyles(...styleList)

  return null
}
