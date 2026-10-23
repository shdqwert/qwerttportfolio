import { lazy, Suspense, useEffect, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router'
import { NavProvider, useNav } from './app/Nav'
import { Page } from './app/pages'
import Header, { Runway } from './components/Header'
import { LangProvider, useT } from './content/i18n'
import { routeKey, type Lang } from './content/lang'

function Meta() {
  const t = useT()
  const loc = useLocation()
  const key = routeKey(loc.pathname)
  useEffect(() => {
    document.title = t.meta[key].title
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.meta[key].description)
    document.body.classList.toggle('is-ink', key === 'kino')
  }, [key, t])
  return null
}

// The drawer is its own chunk: fetched on the first open (or on idle, see
// main.tsx) and kept mounted afterwards so its exit animation can play.
const ConnectDrawer = lazy(() => import('./components/ConnectDrawer'))
function Drawer() {
  const { connectOpen } = useNav()
  const [used, setUsed] = useState(false)
  if (connectOpen && !used) setUsed(true)
  return used ? (
    <Suspense fallback={null}>
      <ConnectDrawer />
    </Suspense>
  ) : null
}

// Pointer cursor and the Konami egg are extras: they load once the page has
// finished loading and the browser is idle.
const Cursor = lazy(() => import('./components/motion/Cursor'))
const Konami = lazy(() => import('./components/Konami').then((m) => ({ default: m.Konami })))
function Extras() {
  const [on, setOn] = useState(false)
  useEffect(() => {
    const go = () => setTimeout(() => setOn(true), 1500)
    if (document.readyState === 'complete') go()
    else window.addEventListener('load', go, { once: true })
  }, [])
  return on ? (
    <Suspense fallback={null}>
      <Cursor />
      <Konami />
    </Suspense>
  ) : null
}

function Shell() {
  const { ui } = useT()
  return (
    <NavProvider>
      <Meta />
      <a className="skip" href="#main">
        {ui.skip}
      </a>
      <Header />
      <Runway />
      <div id="page">
        <main id="main">
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<Page k="home" />} />
              <Route path="/work/qwerttclients" element={<Page k="qc" />} />
              <Route path="/work/kinoqwertt" element={<Page k="kino" />} />
              <Route path="/lab" element={<Page k="lab" />} />
              <Route path="*" element={<Page k="home" />} />
            </Routes>
          </Suspense>
        </main>
      </div>
      <Drawer />
      <Extras />
    </NavProvider>
  )
}

export default function App({ lang }: { lang: Lang }) {
  return (
    <LangProvider lang={lang}>
      <Shell />
    </LangProvider>
  )
}
