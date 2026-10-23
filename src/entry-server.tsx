import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import App from './App.tsx'
import { deferredReady } from './app/deferred'
import { preloadAll } from './app/pages'
import { loadHomeText } from './content/pages/home'
import { BASE, LANGS, loadLang, routeKey, type Lang } from './content/lang'

// Load every page chunk and both languages so render() stays synchronous.
export const prepare = () => Promise.all([preloadAll('en'), loadLang('ru'), loadHomeText('ru')]).then(deferredReady)

export function render(lang: Lang, path: string) {
  return renderToString(
    <StrictMode>
      <StaticRouter location={BASE[lang] + path} basename={BASE[lang] || undefined}>
        <App lang={lang} />
      </StaticRouter>
    </StrictMode>
  )
}

export const meta = (lang: Lang, path: string) => (LANGS[lang] || LANGS.en).meta[routeKey(path)]
