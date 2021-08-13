import { VirtualModule } from './virtual-module'

interface CssChunk {
  css: string
  className: string
}

interface Exports {
  __extractable: CssChunk[]
}

export function executeModule(code: string, fileName: string, mapper: Map<string, string>) {
  const module = new VirtualModule(fileName, mapper)
  const exports = module.evaluate<Exports>(code)

  return exports.__extractable
}
