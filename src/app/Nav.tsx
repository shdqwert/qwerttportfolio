import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type AnchorHTMLAttributes, type ReactNode } from 'react'
import { useLocation, useNavigate, useNavigationType } from 'react-router'
import { useT } from '../content/i18n'
import { routeKey } from '../content/lang'
import { preloadPage } from './pages'
import { gsap, isReduced, refreshWhenReady, scrollToTarget } from '../motion/engine'
import { FlapText } from '../components/motion/SplitFlap'
import s from './Nav.module.css'

type NavApi = {
  go: (to: string) => void
  connectOpen: boolean
  openConnect: () => void
  closeConnect: () => void
}
const NavContext = createContext<NavApi>({ go: () => {}, connectOpen: false, openConnect: () => {}, closeConnect: () => {} })
// eslint-disable-next-line react/only-export-components
export const useNav = () => useContext(NavContext)

const POS_KEY = (p: string) => `scroll:${p}`

// Fires the page's hero load sequence once any overlay (intro / gate change)
// has cleared.
// eslint-disable-next-line react/only-export-components
export function whenStageReady(cb: () => void) {
  const html = document.documentElement
  if (html.classList.contains('intro-pending')) {
    window.addEventListener('intro-done', cb, { once: true })
    return () => window.removeEventListener('intro-done', cb)
  }
  if (html.classList.contains('page-entering')) {
    window.addEventListener('page-enter', cb, { once: true })
    return () => window.removeEventListener('page-enter', cb)
  }
  cb()
  return () => {}
}

export function NavProvider({ children }: { children: ReactNode }) {
  const t = useT()
  const navigate = useNavigate()
  const location = useLocation()
  const navType = useNavigationType()
  const overlay = useRef<HTMLDivElement>(null)
  const pending = useRef<null | { hash: string }>(null)
  const [label, setLabel] = useState('')
  const [connectOpen, setConnectOpen] = useState(false)

  // Connect drawer follows the #connect hash so it is linkable and Back closes it.
  useEffect(() => {
    const sync = () => setConnectOpen(window.location.hash === '#connect')
    sync()
    window.addEventListener('hashchange', sync)
    window.addEventListener('popstate', sync)
    return () => {
      window.removeEventListener('hashchange', sync)
      window.removeEventListener('popstate', sync)
    }
  }, [])
  const openConnect = useCallback(() => {
    if (window.location.hash !== '#connect') history.pushState({ ...history.state, connect: true }, '', '#connect')
    setConnectOpen(true)
  }, [])
  const closeConnect = useCallback(() => {
    if (history.state?.connect) history.back()
    else {
      history.replaceState(history.state, '', window.location.pathname + window.location.search)
      setConnectOpen(false)
    }
  }, [])

  const go = useCallback(
    (to: string) => {
      if (to === '#connect') return openConnect()
      const [path, hash = ''] = to.split('#')
      const target = path || location.pathname.replace(/^\/ru/, '') || '/'
      const samePage = routeKey(target) === routeKey(location.pathname)
      if (samePage) {
        if (hash) scrollToTarget(`#${hash}`)
        else scrollToTarget(0)
        if (hash) history.replaceState(history.state, '', `#${hash}`)
        return
      }
      sessionStorage.setItem(POS_KEY(location.pathname), String(window.scrollY))
      const el = overlay.current
      // the next page's chunk loads while the gate closes
      const ready = preloadPage(routeKey(target), t.lang)
      const doNav = () =>
        void ready.then(() => {
          pending.current = { hash }
          navigate(target + (hash ? `#${hash}` : ''))
        })
      if (!el || isReduced()) {
        if (el) gsap.fromTo(el, { autoAlpha: 0, yPercent: 0 }, { autoAlpha: 1, duration: 0.15, onComplete: doNav })
        else doNav()
        document.documentElement.classList.add('page-entering')
        return
      }
      setLabel(t.transition[routeKey(target)])
      document.documentElement.classList.add('page-entering')
      gsap.fromTo(el, { autoAlpha: 1, yPercent: 100 }, { yPercent: 0, duration: 0.5, ease: 'qw.inOut', onComplete: doNav })
    },
    [location.pathname, navigate, openConnect, t.transition, t.lang]
  )

  // After a route change: scroll, refresh triggers, then lift the overlay.
  useEffect(() => {
    const el = overlay.current
    const html = document.documentElement
    if (pending.current) {
      const { hash } = pending.current
      pending.current = null
      scrollToTarget(0, { immediate: true })
      const main = document.getElementById('main')
      refreshWhenReady(main).then(() => {
        if (hash) scrollToTarget(`#${hash}`, { immediate: true })
        const done = () => {
          html.classList.remove('page-entering')
          window.dispatchEvent(new Event('page-enter'))
        }
        if (!el) return done()
        if (isReduced()) {
          gsap.to(el, { autoAlpha: 0, duration: 0.15, onComplete: done })
          return
        }
        gsap.to(el, { yPercent: -100, duration: 0.6, ease: 'qw.inOut', onComplete: () => void gsap.set(el, { autoAlpha: 0 }) })
        gsap.delayedCall(0.2, done)
      })
      return
    }
    if (navType === 'POP') {
      // Back / forward: no overlay, quick fade, restore the previous position.
      const y = Number(sessionStorage.getItem(POS_KEY(location.pathname)) || 0)
      const main = document.getElementById('main')
      html.classList.remove('page-entering')
      if (main && !isReduced()) gsap.fromTo(main, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25 })
      refreshWhenReady(main).then(() => scrollToTarget(y, { immediate: true }))
    }
  }, [location.key, location.pathname, navType])

  const api = useMemo(() => ({ go, connectOpen, openConnect, closeConnect }), [go, connectOpen, openConnect, closeConnect])
  return (
    <NavContext.Provider value={api}>
      {children}
      <div ref={overlay} className={s.gate} aria-hidden="true">
        <span className={s.holes} />
        <span className={`mono ${s.label}`}>{label && <FlapText text={label} run seed={3} />}</span>
      </div>
    </NavContext.Provider>
  )
}

// Internal link: real href (works without JS / new tab), animated in-app.
export function TLink({ to, children, onClick, ...rest }: { to: string; children: ReactNode } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>) {
  const { go } = useNav()
  const { lang } = useT()
  const href = to.startsWith('#') ? to : (lang === 'ru' ? '/ru' : '') + (to === '/' ? '/' : to)
  // intent prefetch: the target page's chunk starts loading on hover / focus
  const warm = () => void (to.startsWith('#') || preloadPage(routeKey(to.split('#')[0] || '/'), lang))
  return (
    <a
      href={href}
      onPointerEnter={warm}
      onFocus={warm}
      onClick={(e) => {
        onClick?.(e)
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
        e.preventDefault()
        go(to)
      }}
      {...rest}
    >
      {children}
    </a>
  )
}
