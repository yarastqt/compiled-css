import { css } from '@steely/react'

function component(_options) {}

const variants = component({
  styles: [
    css`
      height: 32px;
    `,
  ],
  kind: {
    default: css`
      color: red;
    `,
  },
})
