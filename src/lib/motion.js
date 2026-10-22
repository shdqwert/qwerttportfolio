import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react'

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

export const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v))

// ---- media queries -------------------------------------------------------

function subscribeQuery(query) {
  return (cb) => {
    const mq = window.matchMedia(query)
    mq.addEventListener('change', cb)
    return () => mq.removeEventListener('change', cb)
  }
}

export function useMediaQuery(query) {
  return useSyncExternalStore(
    subscribeQuery(query),
    () => window.matchMedia(query).matches,
    () => false
  )
}

export const REDUCED = '(prefers-reduced-motion: reduce)'
export const NARROW = '(max-width: 1023px)'

export const useReducedMotion = () => useMediaQuery(REDUCED)

export function prefersReduced() {
  return typeof window !== 'undefined' && window.matchMedia(REDUCED).matches
}

// ---- one shared scroll / resize loop --------------------------------------

const subscribers = new Set()
let frame = 0

function tick() {
  frame = 0
  for (const fn of subscribers) fn()
}

function schedule() {
  if (!frame) frame = requestAnimationFrame(tick)
}

export function onScrollFrame(fn) {
  if (subscribers.size === 0) {
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule, { passive: true })
  }
  subscribers.add(fn)
  schedule()
  return () => {
    subscribers.delete(fn)
    if (subscribers.size === 0) {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }
}

// Calls fn(progress, rect) every frame the page scrolls. progress = 0 when the
// element's top touches the viewport bottom, 1 when its bottom leaves the top.
export function useScrollProgress(fn, { enabled = true } = {}) {
  const ref = useRef(null)
  const fnRef = useRef(fn)
  useIsoLayoutEffect(() => {
    fnRef.current = fn
  })
  useEffect(() => {
    if (!enabled) return
    return onScrollFrame(() => {
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      fnRef.current(clamp((vh - r.top) / (vh + r.height)), r, vh, el)
    })
  }, [enabled])
  return ref
}

// ---- reveal on viewport entry --------------------------------------------

// Content is visible by default (prerendered HTML, no JS, reduced motion).
// Only when JS runs and the element is still below the fold do we add the
// `rv` class that hides it, then `is-in` once it enters the viewport.
export function useReveal({ threshold = 0.2, rootMargin = '0px 0px -8% 0px', once = true } = {}) {
  const ref = useRef(null)
  const [state, setState] = useState('idle') // idle | armed | in
  useIsoLayoutEffect(() => {
    const el = ref.current
    if (!el || prefersReduced()) {
      setState('in')
      return
    }
    const r = el.getBoundingClientRect()
    const alreadyVisible = r.top < window.innerHeight * 0.92 && r.bottom > 0
    if (alreadyVisible) {
      setState('in')
      return
    }
    setState('armed')
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState('in')
          if (once) io.disconnect()
        }
      },
      { threshold, rootMargin }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold, rootMargin, once])
  const className = state === 'armed' ? 'rv' : state === 'in' ? 'rv is-in' : ''
  return [ref, className, state === 'in']
}

// Animate a number from 0 to `to` once `run` turns true.
export function useCountUp(to, run, { duration = 700 } = {}) {
  const [value, setValue] = useState(to)
  const started = useRef(false)
  useIsoLayoutEffect(() => {
    if (!run || started.current || prefersReduced()) return
    started.current = true
    setValue(0)
    let raf = 0
    const t0 = performance.now()
    const step = (t) => {
      const k = clamp((t - t0) / duration)
      const eased = 1 - Math.pow(1 - k, 3)
      setValue(Math.round(to * eased))
      if (k < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [run, to, duration])
  return value
}
