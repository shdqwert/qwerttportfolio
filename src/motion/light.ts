// Light system core: one shared pointer listener, lerped in the GSAP ticker.
// Nothing is written to <html> per frame (a custom property there would
// restyle the whole document); readers ask getLight(). Cabin lights (L1) are
// glows moved with a transform: each cabin's page position is measured on
// ScrollTrigger refresh, so a frame only does math + one transform per visible
// cabin — no layout reads, no repaint while scrolling.
import { gsap, MQ, ScrollTrigger } from './engine'

type Cabin = { el: HTMLElement; glow: HTMLElement; top: number; left: number; on: boolean }

let started = false
let live = false
const cabins = new Set<Cabin>()
let io: IntersectionObserver | null = null
let dirty = true
const light = { x: 0, y: 0 }

// lerped pointer position in viewport px (centre-ish before the first move)
export const getLight = () => (light.x ? light : { x: innerWidth / 2, y: innerHeight / 2 })

const measure = (c: Cabin) => {
  const r = c.el.getBoundingClientRect()
  c.top = r.top + window.scrollY
  c.left = r.left + window.scrollX
}

export function addCabin(el: HTMLElement) {
  const glow = el.firstElementChild as HTMLElement | null
  if (!glow || !live) return
  const c: Cabin = { el, glow, top: 0, left: 0, on: false }
  measure(c)
  cabins.add(c)
  io?.observe(el)
  dirty = true
  return () => {
    cabins.delete(c)
    io?.unobserve(el)
  }
}

export function initLight() {
  if (started || typeof window === 'undefined') return
  started = true
  const root = document.documentElement
  if (new URLSearchParams(location.search).get('light') === 'off') {
    root.classList.add('light-off')
    return
  }
  if (!window.matchMedia(MQ.fine).matches) {
    root.classList.add('light-static')
    return
  }
  live = true
  io = new IntersectionObserver((es) => {
    for (const e of es) for (const c of cabins) if (c.el === e.target) c.on = e.isIntersecting
    dirty = true
  })
  const remeasure = () => {
    cabins.forEach(measure)
    dirty = true
  }
  ScrollTrigger.addEventListener('refresh', remeasure)
  addEventListener('resize', remeasure, { passive: true })

  let px = innerWidth / 2
  let py = innerHeight * 0.3
  let lx = px
  let ly = py
  let sy = -1
  let idle = true
  addEventListener(
    'pointermove',
    (e) => {
      px = e.clientX
      py = e.clientY
      idle = false
    },
    { passive: true }
  )
  gsap.ticker.add(() => {
    if (!idle) {
      const dx = px - lx
      const dy = py - ly
      if (Math.abs(dx) < 0.2 && Math.abs(dy) < 0.2) idle = true
      lx += dx * 0.12
      ly += dy * 0.12
      light.x = lx
      light.y = ly
      dirty = true
    }
    const y = window.scrollY
    if (y !== sy) {
      sy = y
      dirty = true
    }
    if (!dirty) return
    dirty = false
    const x0 = window.scrollX
    for (const c of cabins) if (c.on) c.glow.style.transform = `translate3d(${(lx - c.left + x0).toFixed(1)}px, ${(ly - c.top + y).toFixed(1)}px, 0)`
  })
}
