import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import App from './App.tsx'
import { BASE, LANGS, routeKey, type Lang } from './content/lang'

export function render(lang: Lang, path: string) {
  return renderToString(
    <StrictMode>
      <StaticRouter location={BASE[lang] + path} basename={BASE[lang] || undefined}>
        <App lang={lang} />
      </StaticRouter>
    </StrictMode>
  )
}

export const meta = (lang: Lang, path: string) => LANGS[lang].meta[routeKey(path)]
