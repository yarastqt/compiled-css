import React, { ComponentType, RefAttributes, forwardRef, NamedExoticComponent } from 'react'
import { StylesChunk } from '@steely/core'

import { useStyles } from './use-styles'

export interface Options<T, D> {
  variants?: T
  displayName?: string
  defaultProps?: D
  styles?: StylesChunk[]
}

export interface DefaultProps<T> {
  defaultProps: T
}

export interface SteelyExoticComponent<P, V> extends NamedExoticComponent<P> {
  __options?: Options<V, any>
  __component?: SteelyComponentType<any, any>
}

type SteelyComponentType<T, R> =
  | keyof JSX.IntrinsicElements
  | ComponentType<T>
  | SteelyExoticComponent<T, R>

type VariantProps<T> = { [K in keyof T]: keyof T[K] }

type WithVariantsProps<P, V, R> =
  // Remove previous variant props from current and add extended variant props.
  Omit<P, keyof R> & VariantProps<V & R> & RefAttributes<any> & { className?: string }

type Variants = Record<string, Record<string, StylesChunk>>

/**
 * Creates or extends component with styles and variants.
 *
 * Generic types:
 * P — props
 * V — variants
 * R — prev variants
 * D — defaultProps
 */
export function component<P, V extends Variants = {}, R extends Variants = {}, D = {}>(
  ComponentType: SteelyComponentType<P, R>,
  options: Options<V, D>,
): SteelyExoticComponent<WithVariantsProps<P, V, R>, V & R> & DefaultProps<D> {
  const Component = (ComponentType as any).__component ?? ComponentType
  const prevOptions = (ComponentType as any).__options ?? {}

  const variants = mergeVariants(prevOptions.variants, options.variants)
  const styles = mergeStyles(prevOptions.styles, options.styles)

  const displayName = options.displayName ?? (ComponentType as any).displayName ?? 'Component'

  const SteelyComponent = forwardRef((props: any, ref) => {
    const sstyles = [...styles]

    for (const key of Object.keys(variants)) {
      if (props[key] === undefined) {
        continue
      }

      const variantCase = variants[key][props[key]]

      if (!variantCase) {
        throw new Error(`Variant case not found ${key}: ${props[key]} for ${displayName}`)
      }

      sstyles.push(variantCase)
    }

    const stylesClassName = useStyles(...sstyles)
    const className = props.className ? `${stylesClassName} ${props.className}` : stylesClassName

    return <Component {...props} ref={ref} className={className} />
  })

  SteelyComponent.displayName = `Steely(${displayName})`
  SteelyComponent.defaultProps = options.defaultProps

  // @ts-expect-error
  SteelyComponent.__options = { styles, variants }
  // @ts-expect-error
  SteelyComponent.__component = Component

  return SteelyComponent as any
}

function mergeVariants(a: Variants = {}, b: Variants = {}): Variants {
  const variants: Variants = {}
  const keys = ([] as string[]).concat(Object.keys(a), Object.keys(b))

  for (const key of keys) {
    variants[key] = {}

    if (a[key]) Object.assign(variants[key], a[key])
    if (b[key]) Object.assign(variants[key], b[key])
  }

  return variants
}

function mergeStyles(a: StylesChunk[] = [], b: StylesChunk[] = []): StylesChunk[] {
  if (a.length === 0) return b
  if (b.length === 0) return a

  return a.concat(b)
}
