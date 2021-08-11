import generator from '@babel/generator'
import { expression, statement } from '@babel/template'
import { types as t } from '@babel/core'
import type { Program } from '@babel/types'
import type { NodePath } from '@babel/core'

export function generateExtractableModule(path: NodePath<Program>, extractable: string[]): string {
  const expressionTemplate = expression(`%%expression%%`)
  const statementTemplate = statement('exports.__extractable = %%expressions%%')

  const statements = [
    statementTemplate({
      expressions: t.arrayExpression(
        extractable.map((expression) => expressionTemplate({ expression })),
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
