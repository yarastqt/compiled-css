export function css(styles: any, ...interpolations: any[]): any {
  let css = styles[0]

  for (let i = 0; i < interpolations.length; i++) {
    css += interpolations[i] + styles[i + 1]
  }

  return {
    css: css,
    toString: () => css,
  }
}
