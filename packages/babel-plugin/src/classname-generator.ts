import { relative } from 'path'
import { types as t } from '@babel/core'
import type { TaggedTemplateExpression } from '@babel/types'
import type { NodePath } from '@babel/core'

import { hash } from './crypto'

// TODO: Fix any type.
export function generateClassName(path: NodePath<TaggedTemplateExpression>, state: any) {
  const displayName = getDisplayName(path)
  const relativeFileName = relative(state.file.opts.root, state.file.opts.filename)
  const source = path.getSource()
  const slug = hash(`${relativeFileName}${displayName}${source}`)
  const className = `${displayName}-${slug}`

  return className
}

// TODO: Add fallback and generate displayName from filename.
function getDisplayName(path: any): string {
  if (t.isVariableDeclarator(path.parent) && t.isIdentifier(path.parent.id)) {
    return path.parent.id.name
  }

  return ''
}
