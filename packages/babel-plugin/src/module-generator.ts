import generator from '@babel/generator'
import { expression, statement } from '@babel/template'
import { types as t } from '@babel/core'
import type { Program } from '@babel/types'
import type { NodePath } from '@babel/core'

import type { QueueChunk } from './types'

export function generateExtractableModule(path: NodePath<Program>, queue: QueueChunk[]): string {
  const expressionTemplate = expression(`%%expression%%`)
  const statementTemplate = statement('exports.__extractable = %%expressions%%')

  const statements = [
    statementTemplate({
      expressions: t.arrayExpression(
        queue.map((chunk) => {
          // For variable decl case use name as reference to css.
          if (chunk.kind === 'variable') {
            return expressionTemplate({ expression: chunk.meta.name })
          }
          // For other cases use css node inplace.
          return expressionTemplate({ expression: chunk.node })
        }),
      ),
    }),
  ]

  const program = t.program(
    [...path.node.body, ...statements],
    path.node.directives,
    path.node.sourceType,
    path.node.interpreter,
  )

  const { code } = generator(program)

  return code
}
