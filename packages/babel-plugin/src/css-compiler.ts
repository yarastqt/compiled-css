import postcss from 'postcss'
import nested from 'postcss-nested'
import autoprefixer from 'autoprefixer'
import csso from 'csso'

export function compileCss(source: string) {
  const ast = postcss.parse(source)
  const result = postcss([autoprefixer(), nested()]).process(ast, { from: undefined })
  const { css } = csso.minify(result.css)

  return css
}
