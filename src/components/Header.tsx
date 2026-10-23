import { useGSAP } from '@gsap/react'
import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router'
import { TLink, useNav } from '../app/Nav'
import { useT } from '../content/i18n'
import { BASE, rememberLang, routeKey, stripLang } from '../content/lang'
import { Flip, gsap, MQ, ScrollTrigger } from '../motion/engine'
import { clamp } from '../motion/hooks'
import { FlapText } from './motion/SplitFlap'
import PunchMark from './motion/PunchMark'
import RollLabel from './motion/RollLabel'
import s from './Header.module.css'

const SPY: [string, string, string][] = [
  ['work', 'work', 'case-02'],
  ['services', 'services', 'services'],
  ['about', 'about', 'about'],
  ['connect', 'contact', 'contact']
]

function LangSwitch() {
  const { lang } = useT()
  const loc = useLocation()
  return (
    <span className={s.lang}>
      {(['en', 'ru'] as const).map((l) =>
        l === lang ? (
          <b key={l} aria-current="true">
            {l.toUpperCase()}
          </b>
        ) : (
          <a key={l} href={BASE[l] + (stripLang(loc.pathname) === '/' ? '/' : stripLang(loc.pathname)) + (loc.hash === '#connect' ? '' : loc.hash)} hrefLang={l} lang={l} onClick={() => rememberLang(l)}>
            {l.toUpperCase()}
          </a>
        )
      )}
    </span>
  )
}

export default function Header() {
  const { nav, ui, owner } = useT()
  const { connectOpen } = useNav()
  const loc = useLocation()
  const page = routeKey(loc.pathname)
  const ref = useRef<HTMLElement>(null)
  const pill = useRef<HTMLSpanElement>(null)
  const [spy, setSpy] = useState<string | null>(null)
  const [hidden, setHidden] = useState(false)
  const [inverted, setInverted] = useState(false)
  const active = page === 'lab' ? 'lab' : page === 'home' ? spy : 'work'

  // Load: strip drops in (0.7 s), logo dot stamps.
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        gsap.from(`.${s.strip}`, { yPercent: -140, duration: 0.7, ease: 'qw.out' })
        gsap.from(`.${s.logo} .pm`, { scale: 1.6, rotate: -12, duration: 0.5, delay: 0.35, ease: 'qw.snap' })
      })
    },
    { scope: ref }
  )

  // Hide on the way down after 200 px (direction only — no layout reads).
  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => setHidden(self.scroll() > 200 && self.direction === 1)
    })
    return () => st.kill()
  }, [loc.key])

  // Invert over ink sections + scroll-spy, both with IntersectionObserver.
  useEffect(() => {
    const inkSet = new Set<Element>()
    const inkIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? inkSet.add(e.target) : inkSet.delete(e.target)))
        setInverted(inkSet.size > 0)
      },
      { rootMargin: `-44px 0px -${Math.max(0, innerHeight - 45)}px 0px` }
    )
    document.querySelectorAll('[data-theme="ink"]').forEach((el) => inkIo.observe(el))
    let spyIo: IntersectionObserver | null = null
    if (page === 'home') {
      const on = new Map<string, boolean>()
      spyIo = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => on.set(e.target.id, e.isIntersecting))
          const hit = SPY.find(([, a, b]) => on.get(a) || on.get(b))
          setSpy(hit ? hit[0] : null)
        },
        { rootMargin: '-35% 0px -64% 0px' }
      )
      SPY.flatMap(([, a, b]) => [a, b]).forEach((id) => {
        const el = document.getElementById(id)
        if (el) spyIo!.observe(el)
      })
    }
    return () => {
      inkIo.disconnect()
      spyIo?.disconnect()
    }
  }, [page, loc.key])

  // The active pill moves between items with Flip instead of jumping.
  useEffect(() => {
    const p = pill.current
    const host = ref.current?.querySelector<HTMLElement>(`[data-nav="${active}"]`)
    if (!p) return
    if (!host) {
      gsap.to(p, { autoAlpha: 0, duration: 0.2 })
      return
    }
    const state = Flip.getState(p)
    host.prepend(p)
    gsap.set(p, { autoAlpha: 1 })
    if (window.matchMedia(MQ.motion).matches) Flip.from(state, { duration: 0.5, ease: 'qw.inOut' })
  }, [active])

  return (
    <header ref={ref} className={`${s.header} ${hidden && !connectOpen ? s.hidden : ''} ${inverted ? s.inverted : ''}`}>
      <div className={s.strip}>
        <TLink to="/" className={s.logo} aria-label={ui.home}>
          <PunchMark shape="q" cell={4} gap={1} color="currentColor" />
          <span className={s.word}>QWERTT</span>
          <span className={s.dot} aria-hidden="true" />
        </TLink>
        <nav aria-label={ui.mainNav} className={s.nav}>
          <span ref={pill} className={s.pill} aria-hidden="true" />
          {nav.map((n) => (
            <span key={n.id} data-nav={n.id} className={s.item}>
              <TLink to={n.to} className={`${s.link} ${active === n.id ? s.on : ''}`} aria-current={active === n.id ? 'page' : undefined}>
                <RollLabel>{n.label}</RollLabel>
              </TLink>
            </span>
          ))}
        </nav>
        <div className={`mono ${s.meta}`}>
          <span>
            {ui.gate} <b>GMT+5</b>
          </span>
          <span className={s.status}>
            {ui.status}{' '}
            <b>
              <span className={s.pulse} aria-hidden="true" />
              <FlapText text={`${ui.boarding} ${owner.availability}`} run seed={9} />
            </b>
          </span>
          <LangSwitch />
        </div>
        <span className={`${s.notch} ${s.notchL}`} aria-hidden="true" />
        <span className={`${s.notch} ${s.notchR}`} aria-hidden="true" />
      </div>
    </header>
  )
}

// L7 — runway lights: 48 dots light up orange with page progress (one element).
export function Runway() {
  const ref = useRef<HTMLDivElement>(null)
  const [inverted, setInverted] = useState(false)
  const loc = useLocation()
  useEffect(() => {
    const fill = ref.current?.firstElementChild as HTMLElement | null
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        if (fill) fill.style.transform = `scaleX(${clamp(self.progress).toFixed(4)})`
      }
    })
    const set = new Set<Element>()
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? set.add(e.target) : set.delete(e.target)))
        setInverted(set.size > 0)
      },
      { rootMargin: `-1px 0px -${Math.max(0, innerHeight - 3)}px 0px` }
    )
    document.querySelectorAll('[data-theme="ink"]').forEach((el) => io.observe(el))
    return () => {
      st.kill()
      io.disconnect()
    }
  }, [loc.key])
  return (
    <div ref={ref} className={`${s.runway} ${inverted ? s.runwayInk : ''}`} aria-hidden="true">
      <span />
    </div>
  )
}
