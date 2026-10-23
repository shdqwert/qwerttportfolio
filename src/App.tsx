import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router'
import { NavProvider } from './app/Nav'
import ConnectDrawer from './components/ConnectDrawer'
import Header, { Runway } from './components/Header'
import Cursor from './components/motion/Cursor'
import { Konami } from './components/Playground'
import { LangProvider, useT } from './content/i18n'
import { routeKey, type Lang } from './content/lang'
import CaseKino from './pages/CaseKino'
import CaseQc from './pages/CaseQc'
import Home from './pages/Home'
import Lab from './pages/Lab'

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
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/work/qwerttclients" element={<CaseQc />} />
            <Route path="/work/kinoqwertt" element={<CaseKino />} />
            <Route path="/lab" element={<Lab />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
      </div>
      <ConnectDrawer />
      <Cursor />
      <Konami />
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
