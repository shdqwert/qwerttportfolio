import '@fontsource/barlow-condensed/500.css'
import '@fontsource/barlow-condensed/600.css'
import '@fontsource/barlow-condensed/700.css'
import '@fontsource/ibm-plex-sans/400.css'
import '@fontsource/ibm-plex-sans/500.css'
import '@fontsource/ibm-plex-sans/600.css'
import '@fontsource/ibm-plex-sans/700.css'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/500.css'
import '@fontsource/jetbrains-mono/700.css'
import '@fontsource/roboto-condensed/cyrillic-600.css'
import '@fontsource/roboto-condensed/cyrillic-700.css'
import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import App from './App.tsx'
import Intro from './components/Intro'
import { LangProvider } from './content/i18n'
import { BASE, LANGS, langFromPath } from './content/lang'
import { initMotion } from './motion/engine'
import { initLight } from './motion/light'
import './styles/tokens.css'
import './styles/base.css'

const lang = langFromPath(location.pathname)
document.documentElement.lang = lang
history.scrollRestoration = 'manual'
initMotion()
initLight()

const app = (
  <StrictMode>
    <BrowserRouter basename={BASE[lang]}>
      <App lang={lang} />
    </BrowserRouter>
  </StrictMode>
)
// Hydrate only when the prerendered markup is for this exact route — a host
// that falls back to the home HTML (e.g. no trailing slash) gets a fresh render.
const root = document.getElementById('root')!
const here = location.pathname.replace(/\/+$/, '') || '/'
if (root.hasChildNodes() && root.dataset.route === here) hydrateRoot(root, app)
else {
  root.textContent = ''
  createRoot(root).render(app)
}
void LANGS

// The intro lives in its own root so it never affects hydration.
if (document.documentElement.classList.contains('intro-pending')) {
  const host = document.createElement('div')
  document.body.appendChild(host)
  const r = createRoot(host)
  r.render(
    <LangProvider lang={lang}>
      <Intro
        onDone={() => {
          r.unmount()
          host.remove()
        }}
      />
    </LangProvider>
  )
}
