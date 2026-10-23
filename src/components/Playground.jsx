import { useCallback, useEffect, useRef, useState } from 'react'
import { useT } from '../content/i18n.jsx'
import { marks } from '../content/shared.js'
import { prefersReduced, useReveal } from '../lib/motion.js'
import { Scramble, Split } from './Reveal.jsx'

const SIZE = 7
const fromBitmap = (rows) => rows.join('').split('').map((c) => c === '1')
const toBitmap = (cells) => Array.from({ length: SIZE }, (_, r) => cells.slice(r * SIZE, r * SIZE + SIZE).map((on) => (on ? '1' : '0')).join(''))

// ---- Pixel editor ----------------------------------------------------------

function Editor() {
  const { play } = useT()
  const [cells, setCells] = useState(() => fromBitmap(marks.q))
  const [focus, setFocus] = useState(0)
  const [pulse, setPulse] = useState(0)
  const paint = useRef(null) // null | true (drawing) | false (erasing)
  const btnRefs = useRef([])

  const set = (i, on) => setCells((c) => (c[i] === on ? c : c.map((v, j) => (j === i ? on : v))))
  const load = (next) => {
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

  const onKeyDown = (e, i) => {
    const r = Math.floor(i / SIZE)
    const c = i % SIZE
    const map = { ArrowLeft: [0, -1], ArrowRight: [0, 1], ArrowUp: [-1, 0], ArrowDown: [1, 0] }
    if (!map[e.key]) return
    e.preventDefault()
    const [dr, dc] = map[e.key]
    const next = ((r + dr + SIZE) % SIZE) * SIZE + ((c + dc + SIZE) % SIZE)
    setFocus(next)
    btnRefs.current[next]?.focus()
  }

  const presets = [
    ['q', marks.q],
    [play.presets.ticket, marks.ticket],
    [play.presets.film, marks.film],
    ['@', marks.at]
  ]
  const code = toBitmap(cells)
  const filled = cells.filter(Boolean).length

  return (
    <div className="editor">
      <div className="editor__main">
        <div
          className="editor__grid"
          role="group"
          aria-label={play.gridLabel}
          onPointerLeave={() => (paint.current = null)}
        >
          {Array.from({ length: SIZE }, (_, r) => (
            <div key={r} className="editor__row">
              {Array.from({ length: SIZE }, (_, c) => {
                const i = r * SIZE + c
                return (
                  <button
                    key={i}
                    type="button"
                    ref={(el) => (btnRefs.current[i] = el)}
                    tabIndex={focus === i ? 0 : -1}
                    aria-pressed={cells[i]}
                    aria-label={`${play.cell} ${r + 1}·${c + 1}`}
                    className={`editor__cell${cells[i] ? ' is-on' : ''}`}
                    onPointerDown={(e) => {
                      e.preventDefault()
                      e.currentTarget.releasePointerCapture?.(e.pointerId)
                      paint.current = !cells[i]
                      set(i, paint.current)
                      setFocus(i)
                    }}
                    onPointerEnter={() => paint.current !== null && set(i, paint.current)}
                    onClick={(e) => {
                      // keyboard activation (pointer is handled on pointerdown)
                      if (e.detail === 0) set(i, !cells[i])
                    }}
                    onKeyDown={(e) => onKeyDown(e, i)}
                    onFocus={() => setFocus(i)}
                  />
                )
              })}
            </div>
          ))}
        </div>
        <div className="editor__side">
          <div className="editor__preview" aria-hidden="true">
            <span className="editor__big" key={pulse}>
              {cells.map((on, i) => (
                <span key={i} className={on ? 'is-on' : ''} style={{ '--i': i }} />
              ))}
            </span>
          </div>
          <pre className="mono editor__code" aria-label={play.codeLabel}>
            {`[\n${code.map((r) => `  '${r}'`).join(',\n')}\n]`}
          </pre>
          <span className="mono muted">{play.filled(filled)}</span>
        </div>
      </div>
      <div className="editor__tools">
        {presets.map(([label, bm]) => (
          <button key={label} type="button" className="pick" onClick={() => load(fromBitmap(bm))}>
            {label}
          </button>
        ))}
        <button type="button" className="pick" onClick={() => load(Array.from({ length: 49 }, () => Math.random() < 0.42))}>
          {play.random}
        </button>
        <button type="button" className="pick" onClick={() => load(cells.map((v, i) => cells[Math.floor(i / SIZE) * SIZE + (SIZE - 1 - (i % SIZE))]))}>
          {play.mirror}
        </button>
        <button type="button" className="pick" onClick={() => load(cells.map((v) => !v))}>
          {play.invert}
        </button>
        <button type="button" className="pick" onClick={() => load(Array(49).fill(false))}>
          {play.clear}
        </button>
      </div>
    </div>
  )
}

// ---- Catch the pixel -------------------------------------------------------

const ROUND = 20
const BEST_KEY = 'catchBest'

function readBest() {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0
  } catch {
    return 0
  }
}

function Catch() {
  const { play } = useT()
  const boxRef = useRef(null)
  const [state, setState] = useState('idle') // idle | play | over
  const [left, setLeft] = useState(ROUND)
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(0)
  const [pos, setPos] = useState({ x: 50, y: 50 })
  const [caught, setCaught] = useState(0)
  const cooldown = useRef(0)
  const scoreRef = useRef(0)

  useEffect(() => {
    const t = setTimeout(() => setBest(readBest()), 0)
    return () => clearTimeout(t)
  }, [])

  const jump = useCallback((avoid) => {
    const box = boxRef.current
    if (!box) return
    const w = box.clientWidth
    const h = box.clientHeight
    let x
    let y
    for (let k = 0; k < 12; k++) {
      x = 8 + Math.random() * 84
      y = 12 + Math.random() * 76
      if (!avoid || Math.hypot(((x - avoid.x) / 100) * w, ((y - avoid.y) / 100) * h) > 160) break
    }
    setPos({ x, y })
  }, [])

  // countdown
  useEffect(() => {
    if (state !== 'play') return
    const t0 = performance.now()
    const timer = setInterval(() => {
      const remain = Math.max(0, ROUND - Math.floor((performance.now() - t0) / 1000))
      setLeft(remain)
      if (remain === 0) {
        clearInterval(timer)
        setState('over')
        const s = scoreRef.current
        setBest((b) => {
          const nb = Math.max(b, s)
          try {
            localStorage.setItem(BEST_KEY, String(nb))
          } catch {
            /* ignore */
          }
          return nb
        })
      }
    }, 200)
    return () => clearInterval(timer)
  }, [state])

  // on touch screens the pixel hops on its own
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

  const onMove = (e) => {
    if (state !== 'play' || e.pointerType !== 'mouse' || prefersReduced()) return
    const now = performance.now()
    if (now < cooldown.current) return
    const r = boxRef.current.getBoundingClientRect()
    const px = ((e.clientX - r.left) / r.width) * 100
    const py = ((e.clientY - r.top) / r.height) * 100
    const dist = Math.hypot(((px - pos.x) / 100) * r.width, ((py - pos.y) / 100) * r.height)
    // flees when the cursor gets close, then rests so it can be caught
    if (dist < 64) {
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
    <div className="catch">
      <div className="catch__hud mono">
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
      <div className={`catch__box is-${state}`} ref={boxRef} onPointerMove={onMove}>
        {state === 'play' && (
          <button type="button" className="catch__px" style={{ left: `${pos.x}%`, top: `${pos.y}%` }} onClick={hit} aria-label={play.pixelLabel}>
            <span key={caught} />
          </button>
        )}
        {state !== 'play' && (
          <div className="catch__msg">
            <p className="catch__title">{state === 'over' ? play.over(score) : play.catchTitle}</p>
            <p className="catch__text">{state === 'over' && score >= best && score > 0 ? play.record : play.catchText}</p>
            <button type="button" className="btn btn-ink" onClick={start}>
              {state === 'over' ? play.again : play.start}
            </button>
          </div>
        )}
        <span className="catch__live sr-only" aria-live="polite">
          {state === 'over' ? play.over(score) : ''}
        </span>
      </div>
    </div>
  )
}

// ---- Section ---------------------------------------------------------------

export default function Playground() {
  const { play } = useT()
  const [ref, cls] = useReveal({ threshold: 0.15 })
  return (
    <section id="play" className="wrap section playground" aria-labelledby="play-title">
      <div className="playground__head">
        <div>
          <Scramble className="mono muted" text={play.label} />
          <Split as="h2" id="play-title" className="h2 playground__title" text={play.title} />
        </div>
        <p className="playground__text">{play.text}</p>
      </div>
      <div className={`playground__grid ${cls}`} ref={ref}>
        <div className="play-card" style={{ '--i': 0 }}>
          <div className="play-card__head">
            <span className="mono">{play.editorLabel}</span>
            <span className="mono muted">01</span>
          </div>
          <Editor />
        </div>
        <div className="play-card play-card--ink" style={{ '--i': 1 }}>
          <div className="play-card__head">
            <span className="mono">{play.catchLabel}</span>
            <span className="mono ash">02</span>
          </div>
          <Catch />
        </div>
      </div>
      <p className="mono muted playground__hint">{play.hint}</p>
    </section>
  )
}
