import { createContext, useContext, type ReactNode } from 'react'
import type { Content } from './en'
import { LANGS, type Lang } from './lang'

const LangContext = createContext<Content>(LANGS.en)

export function LangProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  return <LangContext.Provider value={LANGS[lang] || LANGS.en}>{children}</LangContext.Provider>
}

// eslint-disable-next-line react/only-export-components
export const useT = () => useContext(LangContext)
