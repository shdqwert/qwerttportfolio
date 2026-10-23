import type { ComponentType } from 'react'
import { useT } from '../content/i18n'
import type { Lang, RouteKey } from '../content/lang'
import { loadHomeText } from '../content/pages/home'

// Every page is its own chunk (shared components land in a common one). They
// are loaded before the first render and before each gate transition, so
// rendering stays synchronous and hydration never suspends.
const loaders: Record<RouteKey, (lang: Lang) => Promise<{ default: ComponentType }>> = {
  home: (lang) => Promise.all([import('../pages/Home'), loadHomeText(lang)]).then(([m]) => m),
  qc: () => import('../pages/CaseQc'),
  kino: () => import('../pages/CaseKino'),
  lab: () => import('../pages/Lab')
}
const cache: Partial<Record<RouteKey, ComponentType>> = {}
const pending: Partial<Record<RouteKey, Promise<void>>> = {}

// the language never changes inside a session (switching reloads the page)
export function preloadPage(key: RouteKey, lang: Lang): Promise<void> {
  if (cache[key]) return Promise.resolve()
  return (pending[key] ??= loaders[key](lang).then((m) => {
    cache[key] = m.default
  }))
}

export const preloadAll = (lang: Lang) => Promise.all((Object.keys(loaders) as RouteKey[]).map((k) => preloadPage(k, lang)))

// Back/forward to a page that is not loaded yet: suspend for that moment.
export function Page({ k }: { k: RouteKey }) {
  const { lang } = useT()
  const C = cache[k]
  if (C) return <C />
  throw preloadPage(k, lang)
}
