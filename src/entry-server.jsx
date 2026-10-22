import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App.jsx'
import { LANGS } from './content/lang.js'

export function render(lang) {
  return renderToString(
    <StrictMode>
      <App lang={lang} />
    </StrictMode>
  )
}

export const meta = (lang) => LANGS[lang].meta
