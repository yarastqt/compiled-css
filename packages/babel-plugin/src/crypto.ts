import { createHash } from 'crypto'

export function hash(input: string): string {
  return createHash('sha256').update(input).digest().slice(0, 2).toString('hex')
}
