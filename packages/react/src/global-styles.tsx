import type { FC } from 'react'

import type { Styleable } from './types'
import { useStyles } from './use-styles'

export const GlobalStyles: FC<Styleable> = (props) => {
  const { styles } = props
  const styleList = Array.isArray(styles) ? styles : [styles]

  useStyles(...styleList)

  return null
}
