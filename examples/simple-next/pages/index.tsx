import type { NextPage } from 'next'
import { component, css } from '@steely/react'

const Home: NextPage = () => {
  return (
    <Container>
      <Button kind="primary">Button</Button>
    </Container>
  )
}

const Container = component('div', {
  styles: css`
    padding: 16px;
  `,
})

const Button = component('button', {
  styles: css`
    border: 0;
    cursor: pointer;
    height: 32px;
    padding: 0 8px;
    font-family: inherit;
  `,
  variants: {
    kind: {
      primary: css`
        background-color: #2196f3;
        color: #fff;

        &:hover {
          background-color: #1e88e5;
        }
      `,
    },
  },
})

export default Home
