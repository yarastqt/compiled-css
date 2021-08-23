export function inject(chunk: any) {
  if (!document.querySelector(`[data-compiled="${chunk.className}"]`)) {
    const style = document.createElement('style')
    style.dataset.compiled = chunk.className
    style.textContent = chunk.css
    document.head.append(style)
  }
}
