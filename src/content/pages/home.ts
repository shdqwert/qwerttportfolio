import { useT } from '../i18n'
import type { Lang } from '../lang'
import type { HomeText } from './home.en'

// Home copy is split per language and only the visitor's language is loaded
// (with the Home chunk, see app/pages.tsx).
const text: Partial<Record<Lang, HomeText>> = {}

export async function loadHomeText(lang: Lang) {
  if (!text[lang]) text[lang] = lang === 'ru' ? (await import('./home.ru')).homeRu : (await import('./home.en')).homeEn
}

export const useHomeText = () => text[useT().lang]!
