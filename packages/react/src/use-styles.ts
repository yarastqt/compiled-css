import { useEffect } from 'react'

export function useStyles(...styles: any[]) {
  const classNames = styles.map((style) => style.className)

  useEffect(() => {
    styles.forEach((block) => inject(block))
  }, [])

  return classNames.join(' ')
}

function inject(chunk: any) {
  if (!document.querySelector(`[data-compiled="${chunk.className}"]`)) {
    const style = document.createElement('style')
    style.dataset.compiled = chunk.className
    style.textContent = chunk.css
    document.head.append(style)
  }
}
