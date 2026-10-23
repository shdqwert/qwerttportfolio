import { en, type Content } from './en'
import { ru } from './ru'

export type Lang = 'en' | 'ru'
export const LANGS: Record<Lang, Content> = { en, ru }
export const BASE: Record<Lang, string> = { en: '', ru: '/ru' }
export const ROUTES = ['/', '/work/qwerttclients', '/work/kinoqwertt', '/lab'] as const
export type RouteKey = 'home' | 'qc' | 'kino' | 'lab'

export function langFromPath(pathname: string): Lang {
  return /^\/ru(\/|$)/.test(pathname) ? 'ru' : 'en'
}
export function stripLang(pathname: string) {
  return pathname.replace(/^\/ru(?=\/|$)/, '').replace(/(.)\/+$/, '$1') || '/'
}
export function routeKey(path: string): RouteKey {
  const p = stripLang(path)
  if (p.startsWith('/work/qwerttclients')) return 'qc'
  if (p.startsWith('/work/kinoqwertt')) return 'kino'
  if (p.startsWith('/lab')) return 'lab'
  return 'home'
}

export function rememberLang(lang: Lang) {
  try {
    localStorage.setItem('lang', lang)
  } catch {
    /* storage unavailable — the URL still carries the language */
  }
}
