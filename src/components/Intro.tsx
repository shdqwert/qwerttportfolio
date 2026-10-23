import { useEffect, useMemo, useRef, useState } from 'react'
import { useT } from '../content/i18n'
import { rnd } from '../motion/hooks'
import { BoardTile, useFlapText } from './motion/SplitFlap'
import s from './Intro.module.css'

const COLS = 16
const ROWS = 10
const SEED = (Date.now() % 997) + 1
const WIDTH = 16

function BoardRow({ text, run, seed, active }: { text: string; run: boolean; seed: number; active?: boolean }) {
  const shown = useFlapText(text.padEnd(WIDTH, ' ').slice(0, WIDTH), run, seed)
  return (
    <div className={s.row}>
      {[...shown].map((c, i) => (
        <BoardTile key={i} ch={c} active={active} status={active} />
      ))}
    </div>
  )
}

// First visit per session: a departure board flips to "QW-00 PORTFOLIO /
// GATE OPEN", then an ink tile grid dissolves from the centre into the hero.
// Skipped with reduced motion, deep links or ?nointro (decided in index.html).
export default function Intro({ onDone }: { onDone: () => void }) {
  const { intro, ui } = useT()
  const [phase, setPhase] = useState<'in' | 'out'>('in')
  const [run, setRun] = useState(false)
  const skip = useRef<HTMLButtonElement>(null)
  const out = useRef(false)

  const tiles = useMemo(() => {
    const list: string[] = []
    let i = 0
    const cx = (COLS - 1) / 2
    const cy = (ROWS - 1) / 2
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) list.push(`${Math.round(Math.hypot(c - cx, (r - cy) * 1.4) * 34 + rnd(i++, SEED) * 90)}ms`)
    return list
  }, [])

  const goOut = useRef(() => {})
  useEffect(() => {
    goOut.current = () => {
      if (out.current) return
      out.current = true
      setPhase('out')
      document.documentElement.classList.remove('intro-pending')
      window.dispatchEvent(new Event('intro-done'))
      setTimeout(() => {
        try {
          sessionStorage.setItem('introSeen', '1')
        } catch {
          /* ignore */
        }
        onDone()
      }, 1050)
    }
  })

  useEffect(() => {
    const r = requestAnimationFrame(() => setRun(true))
    const t = setTimeout(() => goOut.current(), 1400)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && goOut.current()
    document.addEventListener('keydown', onKey)
    skip.current?.focus({ preventScroll: true })
    return () => {
      cancelAnimationFrame(r)
      clearTimeout(t)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  return (
    <div className={`${s.intro} ${phase === 'out' ? s.out : ''}`}>
      <div className={s.tiles} aria-hidden="true" style={{ ['--cols' as string]: COLS, ['--rows' as string]: ROWS }}>
        {tiles.map((d, i) => (
          <span key={i} style={{ ['--d' as string]: d }} />
        ))}
      </div>
      <div className={s.stage} aria-hidden="true">
        <div className={s.board}>
          {intro.board.map((t, i) => (
            <BoardRow key={t} text={t} run={run} seed={SEED + i} active={i === 2} />
          ))}
        </div>
        <div className={`mono ${s.status}`}>
          <span className={s.dot} />
          {intro.status}
        </div>
      </div>
      <div className={`mono ${s.brand}`} aria-hidden="true">
        {intro.brand}
      </div>
      <button type="button" ref={skip} className={`mono ${s.skip}`} onClick={() => goOut.current()}>
        {ui.skipIntro}
      </button>
    </div>
  )
}
