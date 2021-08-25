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
    this.paths = VirtualModule._nodeModulePaths(path.dirname(filename))
    this.mapper = mapper
    this.exports = {}
    this.extensions = ['.json', '.js', '.jsx', '.ts', '.tsx']
  }

  resolve(id: string) {
    const extensions = NativeModule._extensions
    const extended: string[] = []

    try {
      for (const extension of this.extensions) {
        if (!(extension in extensions)) {
          // Use stub for load special extensions.
          extensions[extension] = () => {}
          // Add special extension to stack for cleanup after resolve.
          extended.push(extension)
        }
      }

      return VirtualModule._resolveFilename(id, this)
    } finally {
      for (const extension of extended) {
        delete extensions[extension]
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

  evaluate<T>(raw: string): T {
    const transformed = transformSync(raw, {
      presets: ['@babel/preset-env', '@babel/preset-typescript', '@babel/preset-react'],
      filename: this.filename,
      caller: {
        name: 'virtual-module-evaluator',
      },
    })

    if (!transformed) {
      throw new Error(`Cannot evaluate module: ${this.filename}.`)
    }

    // FIXME: Find better solution for nextjs usage.
    transformed.code = transformed.code?.replace(
      /import React from "react";/g,
      'const React = require("react");',
    )

    const script = new vm.Script(`(function () { ${transformed.code}\n})();`, {
      filename: this.filename,
    })

    script.runInContext(
      vm.createContext({
        module: this,
        exports: this.exports,
        require: this.require,
      }),
    )

    return this.exports as T
  }
}
