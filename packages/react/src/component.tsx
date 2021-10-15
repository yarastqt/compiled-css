import React, {
  ComponentType,
  RefAttributes,
  forwardRef,
  NamedExoticComponent,
  PropsWithChildren,
  ReactNode,
} from 'react'
import { StylesChunk } from '@steely/core'

import { useStyles } from './use-styles'

export interface Options<T, D> {
  variants?: T
  displayName?: string
  defaultProps?: D
  styles?: StylesChunk | StylesChunk[]
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

type WithVariantProps<P, V, R> =
  // Remove previous variant props from current and add extended variant props.
  Omit<P, keyof R> &
    VariantProps<V & R> &
    RefAttributes<any> &
    PropsWithChildren<{ className?: string; as?: ReactNode }>

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
): SteelyExoticComponent<WithVariantProps<P, V, R>, V & R> & DefaultProps<D> {
  const Component = (ComponentType as any).__component ?? ComponentType
  const prevOptions = (ComponentType as any).__options ?? {}

  const variants = mergeVariants(prevOptions.variants, options.variants)
  const styles = mergeStyles(prevOptions.styles, options.styles)

  const displayName = options.displayName ?? (ComponentType as any).displayName ?? 'Component'

  const SteelyComponent = forwardRef((props: any, ref) => {
    const sstyles = [...styles]
    const nextProps = { ...props }

    for (const key of Object.keys(variants)) {
      if (nextProps[key] === undefined) {
        continue
      }

      const variantCase = variants[key][nextProps[key]]

      if (!variantCase) {
        throw new Error(`Variant case not found ${key}: ${nextProps[key]} for ${displayName}`)
      }

      // FIXME: Rewrite to perf solution.
      delete nextProps[key]

      sstyles.push(variantCase)
    }

    const stylesClassName = useStyles(...sstyles)
    const className = nextProps.className
      ? `${stylesClassName} ${nextProps.className}`
      : stylesClassName

    const ElementType = nextProps.as ?? Component

    if (typeof Component === 'string') {
      // FIXME: Rewrite to perf solution.
      delete nextProps.as
    }

    return <ElementType {...nextProps} ref={ref} className={className} />
  })

  SteelyComponent.displayName = `Steely(${displayName})`
  SteelyComponent.defaultProps = options.defaultProps

  // @ts-expect-error
  SteelyComponent.__options = { styles, variants }
  // @ts-expect-error
  SteelyComponent.__component = Component

  return SteelyComponent as any
}

function mergeVariants(prev: Variants = {}, next: Variants = {}): Variants {
  const variants: Variants = {}
  const keys = ([] as string[]).concat(Object.keys(prev), Object.keys(next))

  for (const key of keys) {
    variants[key] = {}

    if (prev[key]) Object.assign(variants[key], prev[key])
    if (next[key]) Object.assign(variants[key], next[key])
  }

  return variants
}

function mergeStyles(
  prev: StylesChunk[] = [],
  next: StylesChunk | StylesChunk[] = [],
): StylesChunk[] {
  next = Array.isArray(next) ? next : [next]

  if (prev.length === 0) return next
  if (next.length === 0) return prev

  return prev.concat(next)
}
