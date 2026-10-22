import { createContext, useContext } from 'react'
import { LANGS } from './lang.js'

const LangContext = createContext(LANGS.en)

export function LangProvider({ lang, children }) {
  return <LangContext.Provider value={LANGS[lang] || LANGS.en}>{children}</LangContext.Provider>
}

// eslint-disable-next-line react/only-export-components
export const useT = () => useContext(LangContext)
