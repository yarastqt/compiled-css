import { VirtualModule } from './virtual-module'

interface StylesChunk {
  content: string
  id: string
  selector: string
}

interface Exports {
  __extractable: StylesChunk[]
}

export function executeModule(code: string, fileName: string, mapper: Map<string, string>) {
  const module = new VirtualModule(fileName, mapper)
  const exports = module.evaluate<Exports>(code)

  return exports.__extractable
}
