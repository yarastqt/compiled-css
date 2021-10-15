import React, { createRef, FC } from 'react'

import { component } from '../component'
import { createClientRender, screen } from './utils/createClientRender'

describe('component', () => {
  const render = createClientRender()

  beforeEach(() => {
    jest.resetAllMocks()
  })

  test('should render component with children', () => {
    const Component = component('div', {})

    render(<Component data-testid="component">Component</Component>)

    expect(screen.getByTestId('component')).toHaveTextContent('Component')
  })

  test('should apply class from single styles', () => {
    const Component = component('div', {
      styles: { content: 'content', id: 'id', selector: '.id' },
    })

    render(<Component data-testid="component" />)

    expect(screen.getByTestId('component')).toHaveAttribute('class', 'id')
  })

  test('should apply class from multi styles', () => {
    const Component = component('div', {
      styles: [
        { content: 'content-1', id: 'id-1', selector: '.id-1' },
        { content: 'content-2', id: 'id-2', selector: '.id-2' },
      ],
    })

    render(<Component data-testid="component" />)

    expect(screen.getByTestId('component')).toHaveAttribute('class', 'id-1 id-2')
  })

  test('should apply class from variants', () => {
    const Component = component('div', {
      variants: {
        kind: {
          primary: { content: 'content', id: 'primary-id', selector: '.primary-id' },
        },
        size: {
          m: { content: 'content', id: 'm-id', selector: '.m-id' },
        },
      },
    })

    render(<Component size="m" kind="primary" data-testid="component" />)

    expect(screen.getByTestId('component')).toHaveAttribute('class', 'primary-id m-id')
  })

  test('should set defaultProps for component', () => {
    const Component = component('div', {
      defaultProps: { kind: 'primary', size: 'm' },
      variants: {
        kind: {
          primary: { content: 'content', id: 'primary-id', selector: '.primary-id' },
        },
        size: {
          m: { content: 'content', id: 'm-id', selector: '.m-id' },
        },
      },
    })

    render(<Component data-testid="component" />)

    expect(screen.getByTestId('component')).toHaveAttribute('class', 'primary-id m-id')
  })

  test('should set displayName for component', () => {
    const Component = component('div', {
      displayName: 'ComponentName',
    })

    expect(Component).toHaveProperty('displayName', 'Steely(ComponentName)')
  })

  test('should update class after update variants', () => {
    const Component = component('div', {
      variants: {
        kind: {
          primary: { content: 'content', id: 'primary-id', selector: '.primary-id' },
          secondary: { content: 'content', id: 'secondary-id', selector: '.secondary-id' },
        },
      },
    })

    const { setProps } = render(<Component kind="primary" data-testid="component" />)

    expect(screen.getByTestId('component')).toHaveAttribute('class', 'primary-id')

    setProps({ kind: 'secondary' })

    expect(screen.getByTestId('component')).toHaveAttribute('class', 'secondary-id')
  })

  test('should set ref for intrinsic component', () => {
    const Component = component('div', { styles: [] })
    const ref = createRef<HTMLDivElement>()

    render(<Component ref={ref} data-testid="component" />)

    expect(ref.current).toBe(screen.getByTestId('component'))
  })

  test('should extend component with variants and styles', () => {
    const UnstyledComponent: FC<{ className?: string }> = ({ className }) => (
      <div className={className} data-testid="component" />
    )

    const BaseComponent = component(UnstyledComponent, {
      styles: [{ content: 'content', id: 'id', selector: '.id' }],
      variants: {
        kind: {
          primary: { content: 'content', id: 'primary-id', selector: '.primary-id' },
        },
      },
    })

    const ExtendedComponent = component(BaseComponent, {
      styles: [{ content: 'content', id: 'extended-id', selector: '.extended-id' }],
      variants: {
        kind: {
          secondary: { content: 'content', id: 'secondary-id', selector: '.secondary-id' },
        },
      },
    })

    const { setProps } = render(<ExtendedComponent kind="primary" />)

    expect(screen.getByTestId('component')).toHaveAttribute('class', 'id extended-id primary-id')

    setProps({ kind: 'secondary' })

    expect(screen.getByTestId('component')).toHaveAttribute('class', 'id extended-id secondary-id')
  })

  test('should apply additional className', () => {
    const Component = component('div', {
      styles: [{ content: 'content', id: 'id', selector: '.id' }],
    })

    render(<Component className="component" data-testid="component" />)

    expect(screen.getByTestId('component')).toHaveAttribute('class', 'id component')
  })

  test('should throw error when variant case not found', () => {
    // Mock error bacause testing library print error to console.
    jest.spyOn(console, 'error').mockImplementation(() => jest.fn())

    const Component = component('div', {
      variants: {
        kind: {
          default: { id: '', content: '', selector: '' },
        },
      },
    })

    expect(() => {
      // @ts-expect-error
      render(<Component kind="action" />)
    }).toThrow('Variant case not found kind: action for Component')
  })

  test('should omit variant prop from props', () => {
    const Component = component('div', {
      variants: {
        kind: {
          default: { id: '', content: '', selector: '' },
        },
      },
    })

    render(<Component kind="default" data-testid="component" />)

    expect(screen.getByTestId('component')).not.toHaveAttribute('kind', 'default')
  })

  test('should render intrinsic component with custom tag', () => {
    const Component = component('div', {})

    render(<Component as="button" data-testid="component" />)
    const ref = screen.getByTestId('component')

    expect(ref.tagName).toBe('BUTTON')
    expect(ref).not.toHaveAttribute('as', 'button')
  })

  test('should render component with custom tag', () => {
    const Base = ({ as: AsType = 'div', ...props }) => <AsType {...props} />
    const Component = component(Base, {})

    render(<Component as="button" data-testid="component" />)
    const ref = screen.getByTestId('component')

    expect(ref.tagName).toBe('BUTTON')
  })
})
