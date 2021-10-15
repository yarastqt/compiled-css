import type { StylesChunk } from '@steely/core'

export function inject(chunk: StylesChunk): void {
  if (!document.querySelector(`[data-steely="${chunk.id}"]`)) {
    const style = document.createElement('style')
    style.dataset.steely = chunk.id
    style.textContent = chunk.content
    document.head.append(style)
  }
}
