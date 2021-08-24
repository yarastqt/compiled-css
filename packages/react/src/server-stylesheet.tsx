import React, { Fragment, ReactNode } from 'react'

import { StyleSheetManager } from './stylesheet-manager'

export class ServerStyleSheet {
  private isSealed = false
  private sheet: StyleSheetManager = new Map()

  /**
   * Wraps App into provider to collect styles.
   */
  collectStyles(children: ReactNode): ReactNode {
    if (this.isSealed) {
      throw new Error('Cannot use collectStyles after ServerStyleSheet is sealed.')
    }

    return <StyleSheetManager sheet={this.sheet}>{children}</StyleSheetManager>
  }

  /**
   * Returns style tags as string.
   */
  getStyleTags(): string {
    if (this.isSealed) {
      throw new Error('Cannot use getStyleTags after ServerStyleSheet is sealed.')
    }

    return Array.from(this.sheet)
      .map(([id, content]) => {
        return `<style data-compiled="${id}">${content}</style>`
      })
      .join('')
  }

  /**
   * Returns style tags as react node.
   */
  getStyleElements(): ReactNode {
    if (this.isSealed) {
      throw new Error('Cannot use getStyleElements after ServerStyleSheet is sealed.')
    }

    return (
      <Fragment>
        {Array.from(this.sheet).map(([id, content]) => (
          <style key={id} data-compiled={id} dangerouslySetInnerHTML={{ __html: content }} />
        ))}
      </Fragment>
    )
  }

  /**
   * Sets seal to stop collect styles.
   */
  seal(): void {
    this.isSealed = true
  }
}
