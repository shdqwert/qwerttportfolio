import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './styles/tokens.css'
import './styles/site.css'
import App from './App.jsx'
import Intro from './components/Intro.jsx'
import { LangProvider } from './content/i18n.jsx'
import { LANGS, langFromPath } from './content/lang.js'

const lang = langFromPath(window.location.pathname)
document.documentElement.lang = lang
document.title = LANGS[lang].meta.title

const root = document.getElementById('root')
const app = (
  <StrictMode>
    <App lang={lang} />
  </StrictMode>
)

// Production HTML is prerendered per language (scripts/prerender.js); dev renders on the client.
if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)

// The intro lives in its own root so it never affects hydration. index.html
// sets `intro-pending` before first paint when it should play.
if (document.documentElement.classList.contains('intro-pending')) {
  const host = document.createElement('div')
  document.body.appendChild(host)
  const introRoot = createRoot(host)
  introRoot.render(
    <LangProvider lang={lang}>
      <Intro
        onDone={() => {
          introRoot.unmount()
          host.remove()
        }}
      />
    </LangProvider>
  )
}
