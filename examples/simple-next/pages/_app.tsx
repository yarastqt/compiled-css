import type { AppProps } from 'next/app'
import { GlobalStyles, createGlobalStyle } from '@steely/react'

const styles = createGlobalStyle`
  body {
    margin: 0;
    font-family: Arial, Helvetica, sans-serif;
  }
`

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <GlobalStyles styles={styles} />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
