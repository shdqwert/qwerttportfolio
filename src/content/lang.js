import en from './en.js'
import ru from './ru.js'

export const LANGS = { en, ru }
export const PATHS = { en: '/', ru: '/ru/' }
const STORE_KEY = 'lang'

export function langFromPath(pathname) {
  return /^\/ru(\/|$)/.test(pathname) ? 'ru' : 'en'
}

// Returning Russian readers on "/" are sent to /ru/ by an inline script in
// index.html, before first paint.
export function rememberLang(lang) {
  try {
    localStorage.setItem(STORE_KEY, lang)
  } catch {
    /* storage unavailable — the URL still carries the language */
  }
}
