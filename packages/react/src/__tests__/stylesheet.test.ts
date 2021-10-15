import type { StylesChunk } from '@steely/core'

import { inject } from '../stylesheet'

describe('stylesheet', () => {
  test('should inject styles once with same id', () => {
    const styles: StylesChunk = { id: 'id', selector: '', content: '.id{color:red}' }

    inject(styles)
    inject(styles)

    expect(document.querySelectorAll('[data-steely="id"]')).toHaveLength(1)
  })
})
