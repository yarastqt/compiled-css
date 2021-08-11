import { VirtualModule } from './virtual-module'

interface Exports {
  __extractable: string[]
}

export function executeModule(code: string, fileName: string, mapper: Map<string, string>) {
  const module = new VirtualModule(fileName, mapper)
  const { exports } = module.evaluate<Exports>(code)

  return exports.__extractable
}
