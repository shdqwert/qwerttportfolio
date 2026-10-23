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
import { LangProvider } from './content/i18n'
import { preloadAll, preloadPage } from './app/pages'
import { BASE, langFromPath, loadLang, routeKey } from './content/lang'
import { initMotion } from './motion/engine'
import { initLight } from './motion/light'
import './styles/tokens.css'
import './styles/base.css'

const lang = langFromPath(location.pathname)
document.documentElement.lang = lang
history.scrollRestoration = 'manual'
initMotion()
initLight()

// this route's chunk + language first, so the first render is synchronous
await Promise.all([loadLang(lang), preloadPage(routeKey(location.pathname), lang)])

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
// the other pages arrive in the background once the browser is idle
const idle = window.requestIdleCallback || ((cb: () => void) => setTimeout(cb, 1))
window.addEventListener('load', () => setTimeout(() => idle(() => void Promise.all([preloadAll(lang), import('./components/ConnectDrawer')])), 2500), { once: true })

// The intro lives in its own root so it never affects hydration.
if (document.documentElement.classList.contains('intro-pending')) {
  const { default: Intro } = await import('./components/Intro')
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
