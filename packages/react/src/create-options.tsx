import type { Options } from './component'

/**
 * Utility function for create options with correct types.
 *
 * @param options - Component options
 * @returns options as is
 */
export function createOptions<T, D>(options: Options<T, D>): Options<T, D> {
  return options
}
