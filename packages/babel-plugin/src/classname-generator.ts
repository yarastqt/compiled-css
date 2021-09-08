import { relative } from 'path'

import { hash } from './crypto'

// TODO: Fix any type.
export function generateClassName(source: string, state: any) {
  const displayName = 'c'
  const relativeFileName = relative(state.file.opts.root, state.file.opts.filename)
  const slug = hash(`${relativeFileName}${displayName}${source}`)
  const className = `${displayName}-${slug}`

  return className
}
