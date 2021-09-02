import type { StylesChunk } from '@steely/core'

export function inject(chunk: StylesChunk): void {
  if (!document.querySelector(`[data-compiled="${chunk.className}"]`)) {
    const style = document.createElement('style')
    style.dataset.compiled = chunk.className
    style.textContent = chunk.css
    document.head.append(style)
  }
}
