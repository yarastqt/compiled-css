import { declare } from '@babel/helper-plugin-utils'
import { types as t } from '@babel/core'
import type { ImportDeclaration, TaggedTemplateExpression, Program } from '@babel/types'
import type { NodePath } from '@babel/core'

import { generateExtractableModule } from './module-generator'
import { executeModule } from './module-executor'
import { compileCss } from './css-compiler'
import type { QueueChunk } from './types'

interface State {
  imports: string[]
  queue: QueueChunk[]
}

const processed = new Set<string>()

export default declare((api, opts) => {
  api.assertVersion(7)

  const isVirtualModuleCaller = api.caller((caller) => caller?.name === 'virtual-module-evaluator')

  const options = Object.assign(opts, {
    allowedModules: ['@steely/core', '@steely/react'],
    allowedMethods: ['css', 'keyframes', 'createGlobalStyle'],
  })

  const mapper = new Map<string, string>([
    ['@steely/core', '@steely/core/lib/node'],
    ['@steely/react', '@steely/react/lib/node'],
  ])

  function collectImports(path: NodePath<ImportDeclaration>, state: State) {
    if (!options.allowedModules.includes(path.node.source.value)) {
      return
    }

    for (const specifier of path.node.specifiers) {
      if (options.allowedMethods.includes(specifier.local.name)) {
        state.imports.push(specifier.local.name)
      }
    }
  }

  function collectExtractable(path: NodePath<TaggedTemplateExpression>, state: State) {
    if (t.isIdentifier(path.node.tag) && state.imports.includes(path.node.tag.name)) {
      state.queue.push({
        path,
        node: path.node,
        parentType: path.parent.type,
        meta: {
          // @ts-expect-error
          name: path.parent?.id?.name,
        },
      })
    }
  }

  function extractStyles(path: NodePath<Program>, state: State) {
    const code = generateExtractableModule(path, state.queue)

    try {
      // @ts-expect-error
      const extractable = executeModule(code, state.file.opts.filename, mapper)

      for (let i = 0; i < extractable.length; i++) {
        const chunk = extractable[i]
        const content = compileCss(chunk.content)
        const id = chunk.id
        const selector = chunk.selector

        state.queue[i].path.replaceWith(
          t.objectExpression([
            t.objectProperty(t.identifier('content'), t.stringLiteral(content)),
            t.objectProperty(t.identifier('id'), t.stringLiteral(id)),
            t.objectProperty(t.identifier('selector'), t.stringLiteral(selector)),
          ]),
        )
      }
    } catch (error) {
      console.log(error)
    }
  }

  return {
    name: '@steely/babel-plugin',
    visitor: {
      Program: {
        enter: (path, state) => {
          if (isVirtualModuleCaller || processed.has(state.filename)) {
            return
          }

          processed.add(state.filename)

          state.imports = []
          state.queue = []

          path.traverse({
            ImportDeclaration: (p) => {
              // @ts-expect-error (TODO: Fix ts issue)
              collectImports(p, state)
            },

            TaggedTemplateExpression: (p) => {
              // @ts-expect-error (TODO: Fix ts issue)
              collectExtractable(p, state)
            },
          })

          // @ts-expect-error (TODO: Fix ts issue)
          if (state.queue.length > 0) {
            // @ts-expect-error (TODO: Fix ts issue)
            extractStyles(path, state)
          }
        },
        exit: () => {
          processed.clear()
        },
      },
    },
  }
})
