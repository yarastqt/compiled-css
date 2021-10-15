import React from 'react'

import { GlobalStyles } from '../global-styles'
import { createClientRender } from './utils/createClientRender'

describe('GlobalStyles', () => {
  const render = createClientRender()

  test('should inject global styles', () => {
    render(<GlobalStyles styles={{ id: 'id', selector: '.id', content: 'body{color:red}' }} />)

    expect(document.querySelectorAll('[data-steely="id"]')).toHaveLength(1)
  })
})
