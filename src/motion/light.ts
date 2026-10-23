// Light system core: one shared pointer listener, lerped in the GSAP ticker,
// written as --lx / --ly (viewport px) on <html>. Every light layer reads
// those variables with `background-attachment: fixed`, so the cost is two
// custom-property writes per frame — no layout reads.
import { gsap, MQ } from './engine'

let started = false

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
  let px = innerWidth / 2
  let py = innerHeight * 0.3
  let lx = px
  let ly = py
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
    if (idle) return
    const dx = px - lx
    const dy = py - ly
    if (Math.abs(dx) < 0.2 && Math.abs(dy) < 0.2) {
      idle = true
      return
    }
    lx += dx * 0.12
    ly += dy * 0.12
    root.style.setProperty('--lx', `${lx.toFixed(1)}px`)
    root.style.setProperty('--ly', `${ly.toFixed(1)}px`)
  })
}
