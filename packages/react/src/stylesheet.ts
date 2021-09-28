import type { StylesChunk } from '@steely/core'

export function inject(chunk: StylesChunk): void {
  if (!document.querySelector(`[data-compiled="${chunk.id}"]`)) {
    const style = document.createElement('style')
    style.dataset.compiled = chunk.id
    style.textContent = chunk.content
    document.head.append(style)
  }
}
