import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useT } from '../content/i18n'
import { marks } from '../content/shared'
import { isReduced } from '../motion/engine'
import { rnd } from '../motion/hooks'
import Reveal from './motion/Reveal'
import s from './Playground.module.css'

const SIZE = 7
const fromBitmap = (rows: string[]) => rows.join('').split('').map((c) => c === '1')
const toBitmap = (cells: boolean[]) => Array.from({ length: SIZE }, (_, r) => cells.slice(r * SIZE, r * SIZE + SIZE).map((on) => (on ? '1' : '0')).join(''))

function Editor() {
  const { play } = useT()
  const [cells, setCells] = useState(() => fromBitmap(marks.q))
  const [focus, setFocus] = useState(0)
  const [pulse, setPulse] = useState(0)
  const paint = useRef<boolean | null>(null)
  const btns = useRef<(HTMLButtonElement | null)[]>([])
  const set = (i: number, on: boolean) => setCells((c) => (c[i] === on ? c : c.map((v, j) => (j === i ? on : v))))
  const load = (next: boolean[]) => {
    setCells(next)
    setPulse((p) => p + 1)
  }
  useEffect(() => {
    const stop = () => (paint.current = null)
    window.addEventListener('pointerup', stop)
    window.addEventListener('pointercancel', stop)
    return () => {
      window.removeEventListener('pointerup', stop)
      window.removeEventListener('pointercancel', stop)
    }
  }, [])
  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    const map: Record<string, [number, number]> = { ArrowLeft: [0, -1], ArrowRight: [0, 1], ArrowUp: [-1, 0], ArrowDown: [1, 0] }
    const m = map[e.key]
    if (!m) return
    e.preventDefault()
    const r = Math.floor(i / SIZE)
    const c = i % SIZE
    const next = ((r + m[0] + SIZE) % SIZE) * SIZE + ((c + m[1] + SIZE) % SIZE)
    setFocus(next)
    btns.current[next]?.focus()
  }
  const presets: [string, string[]][] = [['q', marks.q], [play.presets.ticket, marks.ticket], [play.presets.film, marks.film], ['@', marks.at]]
  const code = toBitmap(cells)
  return (
    <div className={s.editor}>
      <div className={s.editorMain}>
        <div className={s.grid} role="group" aria-label={play.gridLabel} onPointerLeave={() => (paint.current = null)}>
          {Array.from({ length: SIZE }, (_, r) => (
            <div key={r} className={s.gridRow}>
              {Array.from({ length: SIZE }, (_, c) => {
                const i = r * SIZE + c
                return (
                  <button
                    key={i}
                    type="button"
                    ref={(el) => {
                      btns.current[i] = el
                    }}
                    tabIndex={focus === i ? 0 : -1}
                    aria-pressed={cells[i]}
                    aria-label={`${play.cell} ${r + 1}·${c + 1}`}
                    className={`${s.cell} ${cells[i] ? s.on : ''}`}
                    onPointerDown={(e) => {
                      e.preventDefault()
                      e.currentTarget.releasePointerCapture?.(e.pointerId)
                      paint.current = !cells[i]
                      set(i, paint.current)
                      setFocus(i)
                    }}
                    onPointerEnter={() => paint.current !== null && set(i, paint.current)}
                    onClick={(e) => e.detail === 0 && set(i, !cells[i])}
                    onKeyDown={(e) => onKeyDown(e, i)}
                    onFocus={() => setFocus(i)}
                  />
                )
              })}
            </div>
          ))}
        </div>
        <div className={s.side}>
          <div className={s.preview} aria-hidden="true">
            <span className={s.big} key={pulse}>
              {cells.map((on, i) => (
                <span key={i} className={on ? s.on : ''} style={{ ['--i' as string]: i }} />
              ))}
            </span>
          </div>
          <pre className={`mono ${s.code}`} aria-label={play.codeLabel}>{`[\n${code.map((r) => `  '${r}'`).join(',\n')}\n]`}</pre>
          <span className="mono muted">{play.filled(cells.filter(Boolean).length)}</span>
        </div>
      </div>
      <div className={s.tools}>
        {presets.map(([label, bm]) => (
          <button key={label} type="button" className={s.pick} onClick={() => load(fromBitmap(bm))}>
            {label}
          </button>
        ))}
        <button type="button" className={s.pick} onClick={() => load(Array.from({ length: 49 }, () => Math.random() < 0.42))}>
          {play.random}
        </button>
        <button type="button" className={s.pick} onClick={() => load(cells.map((_, i) => cells[Math.floor(i / SIZE) * SIZE + (SIZE - 1 - (i % SIZE))]))}>
          {play.mirror}
        </button>
        <button type="button" className={s.pick} onClick={() => load(cells.map((v) => !v))}>
          {play.invert}
        </button>
        <button type="button" className={s.pick} onClick={() => load(Array(49).fill(false))}>
          {play.clear}
        </button>
      </div>
    </div>
  )
}

const ROUND = 20
const BEST = 'catchBest'

function Catch() {
  const { play } = useT()
  const box = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<'idle' | 'play' | 'over'>('idle')
  const [left, setLeft] = useState(ROUND)
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(0)
  const [pos, setPos] = useState({ x: 50, y: 50 })
  const [caught, setCaught] = useState(0)
  const cooldown = useRef(0)
  const scoreRef = useRef(0)
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        setBest(Number(localStorage.getItem(BEST)) || 0)
      } catch {
        /* ignore */
      }
    }, 0)
    return () => clearTimeout(t)
  }, [])
  const jump = useCallback((avoid?: { x: number; y: number }) => {
    const b = box.current
    if (!b) return
    let x = 50
    let y = 50
    for (let k = 0; k < 12; k++) {
      x = 8 + Math.random() * 84
      y = 12 + Math.random() * 76
      if (!avoid || Math.hypot(((x - avoid.x) / 100) * b.clientWidth, ((y - avoid.y) / 100) * b.clientHeight) > 160) break
    }
    setPos({ x, y })
  }, [])
  useEffect(() => {
    if (state !== 'play') return
    const t0 = performance.now()
    const timer = setInterval(() => {
      const remain = Math.max(0, ROUND - Math.floor((performance.now() - t0) / 1000))
      setLeft(remain)
      if (remain === 0) {
        clearInterval(timer)
        setState('over')
        setBest((b) => {
          const nb = Math.max(b, scoreRef.current)
          try {
            localStorage.setItem(BEST, String(nb))
          } catch {
            /* ignore */
          }
          return nb
        })
      }
    }, 200)
    return () => clearInterval(timer)
  }, [state])
  useEffect(() => {
    if (state !== 'play' || window.matchMedia('(hover: hover)').matches) return
    const t = setInterval(() => jump(), 950)
    return () => clearInterval(t)
  }, [state, jump])
  const start = () => {
    scoreRef.current = 0
    setScore(0)
    setLeft(ROUND)
    setState('play')
    jump()
  }
  const onMove = (e: React.PointerEvent) => {
    if (state !== 'play' || e.pointerType !== 'mouse' || isReduced()) return
    const now = performance.now()
    if (now < cooldown.current) return
    const r = box.current!.getBoundingClientRect()
    const px = ((e.clientX - r.left) / r.width) * 100
    const py = ((e.clientY - r.top) / r.height) * 100
    if (Math.hypot(((px - pos.x) / 100) * r.width, ((py - pos.y) / 100) * r.height) < 64) {
      cooldown.current = now + 420
      jump({ x: px, y: py })
    }
  }
  const hit = () => {
    if (state !== 'play') return
    scoreRef.current += 1
    setScore(scoreRef.current)
    setCaught((c) => c + 1)
    cooldown.current = performance.now() + 300
    jump()
  }
  return (
    <div className={s.catch}>
      <div className={`mono ${s.hud}`}>
        <span>
          {play.score}: <b>{score}</b>
        </span>
        <span>
          {play.time}: <b>{state === 'play' ? left : ROUND}</b>
        </span>
        <span>
          {play.best}: <b>{best}</b>
        </span>
      </div>
      <div className={s.box} ref={box} onPointerMove={onMove}>
        {state === 'play' && (
          <button type="button" className={s.px} style={{ left: `${pos.x}%`, top: `${pos.y}%` }} onClick={hit} aria-label={play.pixelLabel}>
            <span key={caught} />
          </button>
        )}
        {state !== 'play' && (
          <div className={s.msg}>
            <p className={s.msgTitle}>{state === 'over' ? play.over(score) : play.catchTitle}</p>
            <p className={s.msgText}>{state === 'over' && score >= best && score > 0 ? play.record : play.catchText}</p>
            <button type="button" className="btn btn-signal" onClick={start}>
              {state === 'over' ? play.again : play.start}
            </button>
          </div>
        )}
        <span className="sr-only" aria-live="polite">
          {state === 'over' ? play.over(score) : ''}
        </span>
      </div>
    </div>
  )
}

export default function Playground() {
  const { play } = useT()
  return (
    <section id="play" className={`wrap ${s.playground}`} aria-labelledby="play-title">
      <div className={s.head}>
        <div>
          <div className="mono muted">{play.label}</div>
          <Reveal as="h2" variant="mask" className={s.title} id="play-title">
            {play.title}
          </Reveal>
        </div>
        <p className={s.text}>{play.text}</p>
      </div>
      <Reveal className={s.grid2} variant="clip" targets={`.${s.card}`} stagger={0.12}>
        <div className={s.card}>
          <div className={s.cardHead}>
            <span className="mono">{play.editorLabel}</span>
            <span className="mono muted">01</span>
          </div>
          <Editor />
        </div>
        <div className={`${s.card} ${s.cardInk}`}>
          <div className={s.cardHead}>
            <span className="mono">{play.catchLabel}</span>
            <span className="mono ash">02</span>
          </div>
          <Catch />
        </div>
      </Reveal>
      <p className={`mono muted ${s.hint}`}>{play.hint}</p>
    </section>
  )
}

const CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']

// Easter egg: ↑↑↓↓←→←→BA rains punched holes over the page for 5 s.
export function Konami() {
  const { play } = useT()
  const [active, setActive] = useState(0)
  useEffect(() => {
    let p = 0
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key
      p = key === CODE[p] ? p + 1 : key === CODE[0] ? 1 : 0
      if (p === CODE.length) {
        p = 0
        setActive(Date.now())
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])
  useEffect(() => {
    if (!active) return
    document.documentElement.classList.add('pixel-party')
    const t = setTimeout(() => {
      setActive(0)
      document.documentElement.classList.remove('pixel-party')
    }, 5000)
    return () => clearTimeout(t)
  }, [active])
  const drops = useMemo(
    () =>
      Array.from({ length: 90 }, (_, i) => ({
        left: `${(rnd(i, 11) * 100).toFixed(1)}%`,
        size: `${6 + Math.round(rnd(i, 12) * 14)}px`,
        delay: `${Math.round(rnd(i, 13) * 2600)}ms`,
        dur: `${1400 + Math.round(rnd(i, 14) * 1800)}ms`,
        color: ['var(--accent)', 'var(--ink)', '#ECE8DF', '#4ADE80'][Math.floor(rnd(i, 15) * 4)]
      })),
    []
  )
  if (!active) return null
  return (
    <div className={s.party} key={active}>
      {!isReduced() && drops.map((d, i) => <span key={i} aria-hidden="true" style={{ left: d.left, width: d.size, height: d.size, background: d.color, animationDelay: d.delay, animationDuration: d.dur }} />)}
      <p className={`mono ${s.toast}`} role="status">
        {play.konami}
      </p>
    </div>
  )
}
