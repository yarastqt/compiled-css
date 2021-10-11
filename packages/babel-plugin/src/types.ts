import type { TaggedTemplateExpression } from '@babel/types'
import type { NodePath } from '@babel/core'

export interface QueueChunk {
  path: NodePath<TaggedTemplateExpression>
  node: NodePath<TaggedTemplateExpression>['node']
  kind: 'variable' | 'object'
  meta: {
    name?: string
  }
}
