import { declare } from '@babel/helper-plugin-utils'
import { types as t } from '@babel/core'

export default declare((api, options) => {
  api.assertVersion(7)

  return {
    name: '@compiled-css/babel-plugin',
    visitor: {
      Program: {
        enter: (path, state) => {
          path.traverse({
            ImportDeclaration: () => {},
            TaggedTemplateExpression: () => {},
          })
        },
      },
    },
  }
})
