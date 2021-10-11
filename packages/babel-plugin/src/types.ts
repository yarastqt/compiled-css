import type { TaggedTemplateExpression } from '@babel/types'
import type { NodePath } from '@babel/core'

export interface QueueChunk {
  path: NodePath<TaggedTemplateExpression>
  node: NodePath<TaggedTemplateExpression>['node']
  parentType: NodePath<TaggedTemplateExpression>['parent']['type']
  meta: {
    name?: string
  }
}
