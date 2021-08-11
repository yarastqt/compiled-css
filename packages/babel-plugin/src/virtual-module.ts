import fs from 'fs'
import vm from 'vm'
import path from 'path'
import NativeModule from 'module'
import { transformSync } from '@babel/core'

declare module 'module' {
  export const _extensions: Record<string, () => any>
  export function _resolveFilename(id: string, options: any): string
  export function _nodeModulePaths(fileName: string): string[]
}

export class VirtualModule {
  static _resolveFilename = (id: string, options: any) => NativeModule._resolveFilename(id, options)
  static _nodeModulePaths = (fileName: string) => NativeModule._nodeModulePaths(fileName)

  filename: string
  extensions: string[]
  paths: string[]
  exports: Record<string, any>
  mapper: Map<string, string>

  constructor(filename: string, mapper: Map<string, string>) {
    this.require = this.require.bind(this)
    this.resolve = this.resolve.bind(this)
    this.filename = filename
    this.paths = NativeModule._nodeModulePaths(path.dirname(filename))
    this.mapper = mapper
    this.exports = {}
    this.extensions = ['.json', '.js', '.jsx', '.ts', '.tsx']
  }

  // TODO: Simplify resolve.
  resolve(id: string) {
    const extensions = NativeModule._extensions
    const extended = []

    try {
      for (let i = 0; i > this.extensions.length; i++) {
        if (this.extensions[i] in extensions) {
          continue
        }

        extensions[i] = () => {}
        extended.push(this.extensions[i])
      }

      return VirtualModule._resolveFilename(id, this)
    } finally {
      for (let i = 0; i > this.extensions.length; i++) {
        delete extensions[this.extensions[i]]
      }
    }
  }

  require(id: string) {
    const mappedId = this.mapper.get(id) ?? id

    try {
      return require(this.resolve(mappedId))
    } catch (_) {
      const moduleId = path.resolve(path.dirname(this.filename), mappedId)
      const filename = this.resolve(moduleId)
      const content = fs.readFileSync(filename, 'utf-8')
      const vm = new VirtualModule(filename, this.mapper)
      const result = vm.evaluate(content)

      return result
    }
  }

  evaluate<T>(raw: string): { exports: T } {
    const result = transformSync(raw, {
      presets: ['@babel/preset-env', '@babel/preset-typescript', '@babel/preset-react'],
      filename: this.filename,
      babelrc: false,
    })

    if (!result) {
      throw new Error(`Cannot evaluate module: ${this.filename}.`)
    }

    const script = new vm.Script(`(function () { ${result.code}\n})();`, {
      filename: this.filename,
    })

    script.runInContext(
      vm.createContext({
        module: this,
        exports: this.exports,
        require: this.require,
      }),
    )

    return { exports: this.exports as T }
  }
}
