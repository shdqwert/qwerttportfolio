import { useGSAP } from '@gsap/react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router'
import { Img } from '../components/Common'
import PunchMark from '../components/motion/PunchMark'
import Reveal from '../components/motion/Reveal'
import { FlapText } from '../components/motion/SplitFlap'
import PageEnd from '../components/PageEnd'
import { deferred } from '../app/deferred'
import { useLabText } from '../content/pages/lab'
import { labIcons, type ImgKey } from '../content/shared'
import { getFlip, gsap, isReduced, loadFlip, MQ } from '../motion/engine'
import { useReduced } from '../motion/hooks'
import type { Cleanup } from './lab/modes'
import s from './Lab.module.css'

const Playground = deferred(() => import('../components/Playground'))

type Mode = 'none' | 'parallax' | 'film' | 'gravity' | 'xray' | 'flash' | 'pixel' | 'magnet' | 'glitch' | 'speed' | 'y1999'
const MODES: Mode[] = ['parallax', 'film', 'gravity', 'xray', 'flash', 'pixel', 'magnet', 'glitch', 'speed', 'y1999']

// ---------- Film alive (TMDB via proxy, offline fallback) ----------
type Film = { id: string; title: string; year: string; rating: string; genre: string; bg: string; poster: string; local?: { bg: ImgKey; poster: ImgKey } }
const LOCAL_FILMS: Film[] = [
  { id: 'dune', title: 'Dune: Part Two', year: '2024', rating: '8.5', genre: 'Sci-fi · Adventure', bg: '', poster: '', local: { bg: 'lab/dune-bg', poster: 'lab/dune-poster' } },
  { id: 'inter', title: 'Interstellar', year: '2014', rating: '8.7', genre: 'Sci-fi · Drama', bg: '', poster: '', local: { bg: 'lab/inter-bg', poster: 'lab/inter-poster' } },
  { id: 'incep', title: 'Inception', year: '2010', rating: '8.8', genre: 'Sci-fi · Thriller', bg: '', poster: '', local: { bg: 'lab/incep-bg', poster: 'lab/incep-poster' } }
]
const PROXY = (import.meta.env.VITE_TMDB_PROXY as string | undefined) || ''

function FilmImg({ film, kind, className, alt }: { film: Film; kind: 'bg' | 'poster'; className?: string; alt: string }) {
  if (film.local) return <Img k={film.local[kind]} alt={alt} className={className} sizes={kind === 'bg' ? '1000px' : '300px'} eager />
  return <img src={film[kind]} alt={alt} className={className} decoding="async" />
}

function FilmMode() {
  const lab = useLabText()
  const f = lab.film
  const [q, setQ] = useState('Dune')
  const [results, setResults] = useState<Film[]>(LOCAL_FILMS)
  const [film, setFilm] = useState<Film>(LOCAL_FILMS[0])
  const [offline, setOffline] = useState(!PROXY)
  const scene = useRef<HTMLDivElement>(null)

  // search: debounce 300 ms; proxy when configured, local films otherwise
  useEffect(() => {
    const term = q.trim().toLowerCase()
    const t = setTimeout(async () => {
      if (PROXY && term) {
        try {
          const res = await fetch(`${PROXY}/search?q=${encodeURIComponent(term)}`)
          if (!res.ok) throw new Error(String(res.status))
          const data = (await res.json()) as Film[]
          setOffline(false)
          setResults(data.slice(0, 5))
          return
        } catch {
          setOffline(true)
        }
      }
      const m = LOCAL_FILMS.filter((x) => !term || x.title.toLowerCase().includes(term) || 'dune interstellar inception дюна интерстеллар начало'.includes(term))
      setResults(m)
    }, 300)
    return () => clearTimeout(t)
  }, [q])

  // 2.5D scene: pointer + scroll drive the layers (quickTo, 0.6 s)
  useGSAP(
    () => {
      const el = scene.current
      if (!el) return
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        const L = (sel: string, k: number) => ({ el: el.querySelector(sel), k })
        const layers = [L(`.${s.filmBg}`, -20), L(`.${s.dust}`, -8), L(`.${s.poster}`, 14), L(`.${s.filmTitle}`, 22)]
        const qs = layers.map((l) => (l.el ? { x: gsap.quickTo(l.el, 'x', { duration: 0.6 }), y: gsap.quickTo(l.el, 'y', { duration: 0.6 }), k: l.k } : null))
        let px = 0
        let py = 0
        const apply = () => {
          const r = el.getBoundingClientRect()
          const sp = (r.top + r.height / 2 - innerHeight / 2) / innerHeight
          qs.forEach((q) => {
            if (!q) return
            q.x(px * q.k)
            q.y((py + sp) * q.k)
          })
        }
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect()
          px = ((e.clientX - r.left) / r.width - 0.5) * 2
          py = ((e.clientY - r.top) / r.height - 0.5) * 2
          apply()
        }
        el.addEventListener('pointermove', move)
        addEventListener('scroll', apply, { passive: true })
        return () => {
          el.removeEventListener('pointermove', move)
          removeEventListener('scroll', apply)
        }
      })
      gsap.from(el.querySelector(`.${s.poster}`), { autoAlpha: 0, rotateY: -40, z: -100, duration: 0.8, ease: 'qw.out' })
    },
    { scope: scene, dependencies: [film.id] }
  )

  return (
    <div className={s.film}>
      <div className={s.filmSide}>
        <div className="mono ash">{f.kicker}</div>
        <label className={s.filmLabel}>
          <span className="mono ash">{f.label}</span>
          <input className={s.search} type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={f.placeholder} />
        </label>
        {offline && <span className={`mono ${s.offline}`}>{f.offline}</span>}
        <div className={s.results} aria-live="polite">
          {results.length === 0 && <p className="mono ash">{f.noResults}</p>}
          {results.map((r) => (
            <button key={r.id} type="button" className={`${s.result} ${r.id === film.id ? s.resultOn : ''}`} onClick={() => (setFilm(r), setQ(r.title))}>
              <FilmImg film={r} kind="poster" alt="" className={s.resultPoster} />
              <span>
                <span className={s.resultTitle}>{r.title}</span>
                <span className="mono ash">
                  {r.year} · ★ {r.rating}
                </span>
              </span>
            </button>
          ))}
        </div>
        <p className={`mono ash ${s.filmText}`}>{f.text}</p>
        <p className={`mono ash ${s.filmCredit}`}>{f.credit}</p>
      </div>
      <div ref={scene} className={s.scene} key={film.id}>
        <FilmImg film={film} kind="bg" alt="" className={s.filmBg} />
        <span className={s.dust} aria-hidden="true">
          {Array.from({ length: 24 }, (_, i) => (
            <i key={i} style={{ left: `${(i * 73) % 100}%`, top: `${(i * 41 + 17) % 100}%`, width: 2 + (i % 4), height: 2 + (i % 4), opacity: 0.25 + (i % 5) * 0.12, animationDelay: `${-i * 0.5}s` }} />
          ))}
        </span>
        <FilmImg film={film} kind="poster" alt={`${film.title} poster`} className={s.poster} />
        <div className={s.filmTitle}>
          <div className={`mono ${s.filmMeta}`}>
            {film.year} · {film.genre}
          </div>
          <div className={s.filmName}>{film.title}</div>
        </div>
        <div className={`mono ${s.layers}`}>
          <span>{f.layers}</span>
          <span>{f.fly}</span>
        </div>
      </div>
    </div>
  )
}

// ---------- Speed test (only measured values) ----------
function useSpeed(active: boolean) {
  const [m, setM] = useState<(string | null)[]>([null, null, null, null, null, null])
  useEffect(() => {
    if (!active) return
    const out: (string | null)[] = [null, null, null, null, null, null]
    const push = () => setM([...out])
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
    if (nav) out[0] = `${Math.round(nav.responseStart - nav.requestStart)} ms`
    const fcp = performance.getEntriesByName('first-contentful-paint')[0]
    if (fcp) out[1] = `${Math.round(fcp.startTime)} ms`
    const js = (performance.getEntriesByType('resource') as PerformanceResourceTiming[]).filter((r) => r.initiatorType === 'script' || /\.js(\?|$)/.test(r.name))
    out[4] = `${(js.reduce((a, r) => a + (r.transferSize || r.encodedBodySize || 0), 0) / 1024).toFixed(0)} KB`
    let cls = 0
    const obs: PerformanceObserver[] = []
    try {
      const lcp = new PerformanceObserver((l) => {
        const e = l.getEntries().at(-1)
        if (e) out[2] = `${Math.round(e.startTime)} ms`
        push()
      })
      lcp.observe({ type: 'largest-contentful-paint', buffered: true })
      obs.push(lcp)
      const ls = new PerformanceObserver((l) => {
        for (const e of l.getEntries() as unknown as { value: number; hadRecentInput: boolean }[]) if (!e.hadRecentInput) cls += e.value
        out[3] = cls.toFixed(3)
        push()
      })
      ls.observe({ type: 'layout-shift', buffered: true })
      obs.push(ls)
      if (out[3] === null) out[3] = '0.000'
    } catch {
      /* unsupported */
    }
    let frames = 0
    const t0 = performance.now()
    let raf = 0
    const loop = (t: number) => {
      frames++
      if (t - t0 < 2000) raf = requestAnimationFrame(loop)
      else {
        out[5] = `${Math.round((frames * 1000) / (t - t0))} fps`
        push()
      }
    }
    raf = requestAnimationFrame(loop)
    push()
    return () => {
      cancelAnimationFrame(raf)
      obs.forEach((o) => o.disconnect())
    }
  }, [active])
  return m
}

export default function Lab() {
  const lab = useLabText()
  const [params, setParams] = useSearchParams()
  const initial = (MODES as string[]).includes(params.get('mode') || '') ? (params.get('mode') as Mode) : 'none'
  const [mode, setMode] = useState<Mode>(initial)
  const stage = useRef<HTMLDivElement>(null)
  const grid = useRef<HTMLDivElement>(null)
  const flipState = useRef<Flip.FlipState | null>(null)
  const speed = useSpeed(mode === 'speed')
  const names = useMemo(() => Object.fromEntries(lab.switches.map(([id, n]) => [id, n])), [lab.switches])
  const reduced = useReduced()
  const heavy = ['parallax', 'gravity', 'magnet', 'glitch', 'film']
  const label = mode === 'none' ? lab.normal : names[mode] + (reduced && heavy.includes(mode) ? lab.reducedNote : '')

  useEffect(() => void loadFlip(), [])

  const pick = useCallback(
    (m: Mode) => {
      const el = stage.current
      if (el) flipState.current = getFlip()?.getState(el.querySelectorAll('[data-body]')) ?? null
      setMode(m)
      const next = new URLSearchParams(params)
      if (m === 'none') next.delete('mode')
      else next.set('mode', m)
      setParams(next, { replace: true, preventScrollReset: true })
    },
    [params, setParams]
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && !document.querySelector('[aria-modal="true"]') && pick('none')
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [pick])

  // Start the mode's code on the live stage; its cleanup runs on switch/reset.
  useEffect(() => {
    const el = stage.current
    if (!el) return
    let cleanup: Cleanup | null = null
    let dead = false
    if (flipState.current && !isReduced()) {
      getFlip()?.from(flipState.current, { duration: 0.5, ease: 'qw.inOut' })
      gsap.fromTo(el, { autoAlpha: 0.6 }, { autoAlpha: 1, duration: 0.3 })
    }
    flipState.current = null
    const run = async () => {
      const m = await import('./lab/modes')
      if (dead) return
      const ctx = { reduced: isReduced() }
      const fn: Record<string, (s: HTMLElement, c: typeof ctx) => Cleanup | Promise<Cleanup>> = { parallax: m.parallax, gravity: m.gravity, xray: m.xray, flash: m.flash, pixel: m.pixel, magnet: m.magnet, glitch: m.glitch }
      const start = fn[mode]
      if (!start) return
      const c = await start(el, ctx)
      if (dead) c()
      else cleanup = c
    }
    run()
    return () => {
      dead = true
      cleanup?.()
    }
  }, [mode])

  // stamp on the active switch
  useGSAP(
    () => {
      if (mode === 'none' || isReduced()) return
      const card = grid.current?.querySelector(`[data-mode="${mode}"]`)
      if (card) gsap.fromTo(card.querySelector(`.${s.stamp}`), { scale: 1.6, rotate: -18, autoAlpha: 0 }, { scale: 1, rotate: -8, autoAlpha: 1, duration: 0.26, ease: 'qw.snap' })
    },
    { dependencies: [mode], scope: grid }
  )

  const showBase = mode !== 'y1999' && mode !== 'film'
  const st = lab.stage
  return (
    <>
      <section className={`wrap ${s.intro}`}>
        <div>
          <div className={`mono muted ${s.kicker}`}>
            <PunchMark shape="q" cell={4} />
            {lab.kicker}
          </div>
          <Reveal as="h1" variant="mask" className={s.h1}>
            {lab.title[0]}
            <br />
            {lab.title[1]}
            <br />
            {lab.title[2]}
          </Reveal>
        </div>
        <div className={s.introSide}>
          <p className={s.introText}>{lab.text}</p>
          <div className={s.resetRow}>
            <button type="button" className={s.reset} onClick={() => pick('none')}>
              {lab.reset} <span className="mono">Esc</span>
            </button>
            <span className="mono muted" aria-live="polite">
              {lab.mode}:{' '}
              <b className={s.modeName}>
                <FlapText text={label} run seed={label.length} />
              </b>
            </span>
          </div>
        </div>
      </section>

      <section aria-label={lab.switchesLabel} className="wrap">
        <div ref={grid} className={s.switches}>
          {lab.switches.map(([id, name, desc], i) => {
            const on = mode === id
            return (
              <button key={id} type="button" data-mode={id} className={`${s.sw} ${on ? s.swOn : ''}`} aria-pressed={on} onClick={() => pick(on ? 'none' : (id as Mode))}>
                <span className={s.swTop}>
                  <span className="mono">{String(i + 1).padStart(2, '0')}</span>
                  <PunchMark rows={labIcons[id]} cell={4} color={on ? 'var(--accent)' : 'currentColor'} />
                </span>
                <span className={s.swName}>{name}</span>
                <span className={s.swDesc}>{desc}</span>
                {on && <span className={`mono ${s.stamp}`}>ON</span>}
              </button>
            )
          })}
        </div>
      </section>

      <section aria-label={lab.stageLabel} className={`wrap ${s.stageSection}`}>
        <div ref={stage} className={`${s.stage} lab-stage ${mode === 'xray' ? 'is-xray' : ''}`} data-mode={mode} tabIndex={-1}>
          {showBase && (
            <>
              <div className={s.sNav} data-body data-name="nav" data-depth="0.4" data-kind="text">
                {st.nav.map((n, i) => (
                  <span key={n} style={{ opacity: i ? 0.6 : 1 }}>
                    {n}
                  </span>
                ))}
              </div>
              <div className={s.sHead} data-body data-depth="1" data-kind="text" data-glitch>
                {st.head}
              </div>
              <div className={s.sMark} data-body data-name="mark · 7×7" data-depth="1.6">
                <PunchMark shape="q" cell={12} />
              </div>
              <span className={s.sBtn} data-body data-name="button" data-depth="0.6">
                {st.btn}
              </span>
              <div className={s.sImg} data-body data-name="img" data-depth="-0.6">
                <Img k="dark/d-home" alt={st.imgAlt} sizes="560px" />
              </div>
              {st.cards.map((c, i) => (
                <div key={c} className={s.sCard} style={{ left: 40 + i * 220 }} data-body data-name="card" data-depth={String(0.8 + i * 0.2)}>
                  <Img k={(['photos/f3-s', 'photos/b4-s', 'photos/ho3-s'] as ImgKey[])[i]} alt={c} sizes="200px" />
                  <div>{c}</div>
                </div>
              ))}
              {mode === 'parallax' && <span className={`mono ${s.hint}`}>{lab.parallaxHint}</span>}
              {mode === 'gravity' && <span className={`mono ${s.hint}`}>{lab.gravityHint}</span>}
              {mode === 'flash' && <span className={`mono ${s.hint} ${s.hintLight}`}>{lab.flashHint}</span>}
              {mode === 'magnet' && <span className={`mono ${s.hint}`}>{lab.magnetHint}</span>}
              {mode === 'glitch' && <span className={`mono ${s.hint}`}>{lab.glitchHint}</span>}
              {mode === 'speed' && (
                <div className={s.speed}>
                  <div className={s.speedHead}>
                    <span>{lab.speed.title}</span>
                    <span className="mono" style={{ color: 'var(--ok-term)' }}>
                      {lab.speed.live}
                    </span>
                  </div>
                  <p className="mono ash">{lab.speed.text}</p>
                  {lab.speed.labels.map((l, i) => (
                    <div key={l} className={s.metric}>
                      <span>{l}</span>
                      <span className="mono">{speed[i] ?? '…'}</span>
                    </div>
                  ))}
                  <span className={`mono ash ${s.speedFoot}`}>{lab.speed.foot}</span>
                </div>
              )}
            </>
          )}
          {mode === 'y1999' && <Y1999 />}
          {mode === 'film' && <FilmMode />}
        </div>
      </section>

      <Playground />
      <PageEnd page="lab" />
    </>
  )
}

function Y1999() {
  const lab = useLabText()
  const y = lab.y1999
  return (
    <div className={s.y99}>
      <div className={s.y99Bar}>
        <span>{y.bar}</span>
        <span>_ □ ×</span>
      </div>
      <div className={s.y99Page}>
        <div className={s.y99Marquee}>
          <span>{y.marquee}</span>
        </div>
        <h2 className={s.y99Title}>{y.title}</h2>
        <p className={s.y99Intro}>
          {y.intro[0]}
          <b>{y.intro[1]}</b>
          {y.intro[2]}
          <u>{y.intro[3]}</u>
          {y.intro[4]}
        </p>
        <div className={s.y99Construction}>
          <span>{y.construction}</span>
        </div>
        <table className={s.y99Table} cellPadding={8}>
          <tbody>
            <tr>
              <td>
                <Img k="lab/pixel-r2" alt={y.imgAlt} sizes="220px" className={s.y99Img} />
              </td>
              <td>
                <b>{y.projects}</b>
                <ul>
                  <li>
                    <u>{y.list[0]}</u> <span className={s.y99New}>{y.newBadge}</span>
                  </li>
                  <li>
                    <u style={{ color: '#551A8B' }}>{y.list[1]}</u>
                  </li>
                  <li>
                    <u>{y.list[2]}</u>
                  </li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
        <p className={s.y99Counter}>
          {y.counter} <span>000127</span> <small>{y.counterNote}</small>
        </p>
        <div className={s.y99Buttons}>
          {y.buttons.map((b) => (
            <span key={b}>{b}</span>
          ))}
        </div>
        <p className={s.y99Foot}>
          {y.foot}
          <i>{y.back}</i>
        </p>
      </div>
    </div>
  )
}
