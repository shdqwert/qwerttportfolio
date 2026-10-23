import { memo, useEffect, useRef, useState } from 'react'
import { isReduced } from '../../motion/engine'
import { rnd } from '../../motion/hooks'
import s from './SplitFlap.module.css'

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789·:'
const GLYPHS_RU = 'АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЭЮЯ0123456789·:'

// Inline split-flap: each character flips through 2–6 random glyphs (40 ms per
// flip, steps) before landing, with a filament flicker. `words` cycles through
// a list (finale destination); `text` flips once to a single value.
// eslint-disable-next-line react/only-export-components
// After the first run only the characters that changed flip (1–3 glyphs, short
// wave) — like a real board, and cheap enough to retrigger while scrolling.
export function useFlapText(target: string, run: boolean, seed = 1) {
  const [shown, setShown] = useState(target)
  const timer = useRef(0)
  const last = useRef<string | null>(null)
  useEffect(() => {
    if (!run || isReduced()) {
      const t = setTimeout(() => setShown(target), 0)
      return () => clearTimeout(t)
    }
    const chars = [...target]
    const prev = last.current
    last.current = target
    const pool = /[А-Я]/i.test(target) ? GLYPHS_RU : GLYPHS
    const flips = chars.map((c, i) => (c === ' ' || (prev !== null && prev[i] === c) ? 0 : prev === null ? 2 + Math.floor(rnd(i, seed) * 5) : 1 + Math.floor(rnd(i, seed) * 3)))
    // column stagger: one step per character on the first run, one per four after
    const lag = (i: number) => (prev === null ? i : i >> 2)
    let step = 0
    const max = Math.max(0, ...flips.map((n, i) => n + lag(i)))
    const tick = () => {
      step++
      setShown(
        chars
          .map((c, i) => {
            const local = step - lag(i)
            if (c === ' ' || local > flips[i]) return c
            if (local <= 0) return prev === null ? pool[Math.floor(rnd(i + step, seed + 3) * pool.length)] : prev[i] ?? c
            return pool[Math.floor(rnd(i * 7 + step, seed) * pool.length)]
          })
          .join('')
      )
      if (step <= max) timer.current = window.setTimeout(tick, 40)
    }
    tick()
    return () => clearTimeout(timer.current)
  }, [target, run, seed])
  return shown
}

export function FlapText({ text, run = true, className, seed }: { text: string; run?: boolean; className?: string; seed?: number }) {
  const shown = useFlapText(text, run, seed)
  return (
    <span className={`${s.inline} ${className || ''}`}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" key={shown === text ? 'done' : 'flip'} className={shown === text ? s.settled : s.flipping}>
        {shown}
      </span>
    </span>
  )
}

// Cycles through words while `run` (finale "Destination ___").
export function FlapCycle({ words, run, interval = 2200, className }: { words: string[]; run: boolean; interval?: number; className?: string }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (!run || isReduced()) return
    const t = setInterval(() => setI((n) => (n + 1) % words.length), interval)
    return () => clearInterval(t)
  }, [run, words.length, interval])
  return <FlapText text={words[i]} run={run} className={className} seed={i + 1} />
}

// Board tile (24×36): the top half folds down on every change. Memoised: a
// board tick re-renders only the tiles whose character changed; the fold is a
// 2D scaleY so no tile needs its own 3D layer.
export const BoardTile = memo(function BoardTile({ ch, active, status }: { ch: string; active?: boolean; status?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null)
  const prev = useRef(ch)
  useEffect(() => {
    if (prev.current === ch) return
    prev.current = ch
    const el = ref.current
    if (!el || isReduced()) return
    el.querySelector(`.${s.fold}`)?.animate([{ transform: 'scaleY(1)' }, { transform: 'scaleY(0)' }], { duration: 70, easing: 'steps(2)' })
  }, [ch])
  return (
    <span ref={ref} aria-hidden="true" className={`${s.tile} ${ch === ' ' ? s.blank : ''} ${active ? s.active : ''} ${active && status ? s.status : ''}`}>
      {ch === ' ' ? '' : ch}
      <span className={s.fold} />
    </span>
  )
})
