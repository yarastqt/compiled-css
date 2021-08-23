import { declare } from '@babel/helper-plugin-utils'
import { types as t } from '@babel/core'
import type { ImportDeclaration, TaggedTemplateExpression, Program } from '@babel/types'
import type { NodePath } from '@babel/core'

import { generateExtractableModule } from './module-generator'
import { executeModule } from './module-executor'
import { generateClassName } from './classname-generator'
import { compileCss } from './css-compiler'

interface State {
  imports: string[]
  nodes: NodePath<TaggedTemplateExpression>[]
  extractable: string[]
}

const processed = new Set<string>()

export default declare((api, opts) => {
  api.assertVersion(7)

  const options = Object.assign(opts, {
    allowedModules: ['@compiled-css/react'],
    allowedMethods: ['css', 'keyframes', 'createGlobalStyle'],
  })

  const mapper = new Map<string, string>()
  mapper.set('@compiled-css/react', '@compiled-css/react/lib/node-css')

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
      const className = generateClassName(path, state)
      // TODO: Refactor this code with better solution.
      // Push className to first chunk, because it's easy way to extract it for runtime.
      path.node.quasi.quasis[0].value.raw = `{{${className}}}${path.node.quasi.quasis[0].value.raw}`

      state.nodes.push(path)
      // @ts-expect-error (TODO: Fix this case)
      state.extractable.push(path.parentPath.node.id.name)
    }
  }

  function extractStyles(path: NodePath<Program>, state: State) {
    const code = generateExtractableModule(path, state.extractable)

    try {
      // @ts-expect-error
      const extractable = executeModule(code, state.file.opts.filename, mapper)

      for (let i = 0; i < extractable.length; i++) {
        const css = compileCss(extractable[i].css)
        const { className } = extractable[i]

        state.nodes[i].replaceWith(
          t.objectExpression([
            t.objectProperty(t.identifier('css'), t.stringLiteral(css)),
            t.objectProperty(t.identifier('className'), t.stringLiteral(className)),
          ]),
        )
      }
    } catch (error) {
      console.log(error)
    }
  }

  return {
    name: '@compiled-css/babel-plugin',
    visitor: {
      Program: {
        enter: (path, state) => {
          if (processed.has(state.filename)) {
            return
          }

          processed.add(state.filename)

          state.imports = []
          state.nodes = []
          state.extractable = []

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
          if (state.extractable.length > 0) {
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
