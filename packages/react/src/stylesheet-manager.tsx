import React, { FC, createContext, useContext } from 'react'

export type StyleSheetManager = Map<string, string>

export interface StyleSheetManagerProps {
  /**
   * A sheet manager.
   */
  sheet: StyleSheetManager
}

const defaultSheet = new Map<string, string>()
export const StyleSheetContext = createContext<StyleSheetManager>(defaultSheet)

export const StyleSheetManager: FC<StyleSheetManagerProps> = (props) => {
  const { children, sheet } = props

  return <StyleSheetContext.Provider value={sheet}>{children}</StyleSheetContext.Provider>
}

export function useStyleSheetManager(): StyleSheetManager {
  return useContext(StyleSheetContext)
}
