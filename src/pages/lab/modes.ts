// Lab modes that work on the live stage DOM. Each start() returns a cleanup
// that removes every listener, ticker callback, physics world and node it
// created. Loaded with import() on first use so /lab stays light.
import { gsap } from '../../motion/engine'

export type Cleanup = () => void
type Ctx = { reduced: boolean }

const bodies = (stage: HTMLElement) => Array.from(stage.querySelectorAll<HTMLElement>('[data-body]'))

// 01 — Parallax: depth layers move at 0.4× / 1× / 1.6× with pointer + scroll.
export function parallax(stage: HTMLElement, { reduced }: Ctx): Cleanup {
  const layers = Array.from(stage.querySelectorAll<HTMLElement>('[data-depth]'))
  if (reduced) {
    layers.forEach((l) => gsap.set(l, { y: Number(l.dataset.depth) * -30 }))
    return () => gsap.set(layers, { clearProps: 'transform' })
  }
  let tx = 0
  let ty = 0
  let cx = 0
  let cy = 0
  const move = (e: PointerEvent) => {
    const r = stage.getBoundingClientRect()
    tx = (e.clientX - r.left) / r.width - 0.5
    ty = (e.clientY - r.top) / r.height - 0.5
  }
  const r0 = stage.getBoundingClientRect()
  const top = r0.top + scrollY
  const h = r0.height
  const tick = () => {
    const sp = (top - scrollY + h / 2 - innerHeight / 2) / innerHeight
    cx += (tx - cx) * 0.1
    cy += (ty + sp * 0.6 - cy) * 0.1
    layers.forEach((l) => {
      const d = Number(l.dataset.depth)
      l.style.transform = `translate3d(${(-cx * 60 * d).toFixed(1)}px, ${(-cy * 80 * d).toFixed(1)}px, 0)`
    })
  }
  stage.addEventListener('pointermove', move)
  gsap.ticker.add(tick)
  return () => {
    stage.removeEventListener('pointermove', move)
    gsap.ticker.remove(tick)
    layers.forEach((l) => (l.style.transform = ''))
  }
}

// 03 — Gravity: Matter.js bodies from the elements' rects; drag and throw;
// Space shakes the pile. Reduced motion: the settled pile, no physics.
export async function gravity(stage: HTMLElement, { reduced }: Ctx): Promise<Cleanup> {
  const els = bodies(stage)
  if (reduced) {
    const end = ['translate(40px, 640px) rotate(-4deg)', 'translate(80px, 420px) rotate(-5deg)', 'translate(-140px, 520px) rotate(34deg)', 'translate(520px, 320px) rotate(38deg)', 'translate(-110px, 220px) rotate(11deg)', 'translate(60px, 100px) rotate(-17deg)', 'translate(150px, 120px) rotate(23deg)', 'translate(60px, 60px) rotate(-8deg)']
    els.forEach((el, i) => (el.style.transform = end[i % end.length]))
    return () => els.forEach((el) => (el.style.transform = ''))
  }
  const M = (await import('matter-js')).default
  const sr = stage.getBoundingClientRect()
  const engine = M.Engine.create({ gravity: { x: 0, y: 1.1 } })
  const W = sr.width
  const H = sr.height
  const wall = (x: number, y: number, w: number, h: number) => M.Bodies.rectangle(x, y, w, h, { isStatic: true })
  M.Composite.add(engine.world, [wall(W / 2, H + 30, W * 2, 60), wall(-30, H / 2, 60, H * 2), wall(W + 30, H / 2, 60, H * 2), wall(W / 2, -400, W * 2, 60)])
  const items = els.map((el) => {
    const r = el.getBoundingClientRect()
    const x = r.left - sr.left + r.width / 2
    const y = r.top - sr.top + r.height / 2
    const b = M.Bodies.rectangle(x, y, r.width, r.height, { restitution: 0.25, friction: 0.4, chamfer: { radius: Math.min(12, r.height / 2) } })
    M.Body.setAngularVelocity(b, (Math.random() - 0.5) * 0.04)
    return { el, b, x0: x, y0: y }
  })
  M.Composite.add(engine.world, items.map((i) => i.b))
  const mouse = M.Mouse.create(stage)
  const mc = M.MouseConstraint.create(engine, { mouse, constraint: { stiffness: 0.2, render: { visible: false } } })
  M.Composite.add(engine.world, mc)
  // let the page scroll over the stage
  const m = mouse as unknown as { element: HTMLElement; mousewheel: EventListener }
  m.element.removeEventListener('wheel', m.mousewheel)
  m.element.removeEventListener('mousewheel', m.mousewheel)
  m.element.removeEventListener('DOMMouseScroll', m.mousewheel)
  stage.style.cursor = 'grab'
  const tick = (_t: number, dt: number) => {
    // slow frames run as two half steps — Matter is only stable at ≤ 16.7 ms
    const d = Math.min(dt, 32)
    if (d > 16.667) {
      M.Engine.update(engine, d / 2)
      M.Engine.update(engine, d / 2)
    } else M.Engine.update(engine, d)
    items.forEach(({ el, b, x0, y0 }) => {
      el.style.transform = `translate(${(b.position.x - x0).toFixed(1)}px, ${(b.position.y - y0).toFixed(1)}px) rotate(${b.angle.toFixed(3)}rad)`
    })
  }
  gsap.ticker.add(tick)
  const shake = (e: KeyboardEvent) => {
    if (e.code !== 'Space' || !stage.contains(document.activeElement)) return
    e.preventDefault()
    items.forEach(({ b }) => M.Body.applyForce(b, b.position, { x: (Math.random() - 0.5) * 0.08 * b.mass, y: -0.12 * b.mass }))
  }
  document.addEventListener('keydown', shake)
  return () => {
    gsap.ticker.remove(tick)
    document.removeEventListener('keydown', shake)
    M.Mouse.clearSourceEvents(mouse)
    M.World.clear(engine.world, false)
    M.Engine.clear(engine)
    stage.style.cursor = ''
    els.forEach((el) => (el.style.transform = ''))
  }
}

// 04 — X-ray: blueprint grid + labels generated from computed styles.
export function xray(stage: HTMLElement): Cleanup {
  const layer = document.createElement('div')
  layer.className = 'xray-layer'
  layer.setAttribute('aria-hidden', 'true')
  const sr = stage.getBoundingClientRect()
  bodies(stage).forEach((el) => {
    const r = el.getBoundingClientRect()
    const cs = getComputedStyle(el)
    const isText = el.dataset.kind === 'text'
    const font = cs.fontFamily.split(',')[0].replace(/"/g, '')
    const label = document.createElement('span')
    label.className = 'xray-label'
    label.textContent = isText ? `${el.tagName.toLowerCase()} · ${font} ${cs.fontWeight} · ${parseFloat(cs.fontSize)}px` : `${el.dataset.name || el.tagName.toLowerCase()} · ${Math.round(r.width)}×${Math.round(r.height)} · r ${parseFloat(cs.borderTopLeftRadius) || 0}`
    label.style.left = `${r.left - sr.left}px`
    label.style.top = `${Math.max(2, r.top - sr.top - 18)}px`
    layer.appendChild(label)
  })
  stage.appendChild(layer)
  return () => layer.remove()
}

// 05 — Flashlight: lights out, a lerped torch follows the cursor (0.15);
// keyboard / touch users get a fixed centred light.
export function flash(stage: HTMLElement, { reduced }: Ctx): Cleanup {
  const dark = document.createElement('div')
  dark.className = 'flash-layer'
  dark.setAttribute('aria-hidden', 'true')
  stage.appendChild(dark)
  const r0 = stage.getBoundingClientRect()
  let tx = r0.width * 0.73
  let ty = r0.height * 0.54
  let x = tx
  let y = ty
  const move = (e: PointerEvent) => {
    const r = stage.getBoundingClientRect()
    tx = e.clientX - r.left
    ty = e.clientY - r.top
  }
  const tick = () => {
    x += (tx - x) * (reduced ? 1 : 0.15)
    y += (ty - y) * (reduced ? 1 : 0.15)
    dark.style.setProperty('--fx', `${x.toFixed(1)}px`)
    dark.style.setProperty('--fy', `${y.toFixed(1)}px`)
  }
  stage.addEventListener('pointermove', move)
  gsap.ticker.add(tick)
  return () => {
    stage.removeEventListener('pointermove', move)
    gsap.ticker.remove(tick)
    dark.remove()
  }
}

// 06 — Pixel: Silkscreen font (loaded only now), square corners, hard
// shadows, images rendered through a tiny canvas with smoothing off.
export async function pixel(stage: HTMLElement): Promise<Cleanup> {
  await import('@fontsource/silkscreen/400.css')
  stage.classList.add('is-pixel')
  const imgs = Array.from(stage.querySelectorAll<HTMLImageElement>('img'))
  const originals = imgs.map((im) => ({ im, src: im.currentSrc || im.src, srcset: im.srcset }))
  const sources = Array.from(stage.querySelectorAll<HTMLSourceElement>('source'))
  const srcsets = sources.map((s) => s.srcset)
  sources.forEach((s) => (s.srcset = ''))
  for (const { im, src } of originals) {
    try {
      const base = new Image()
      base.src = src
      await base.decode()
      const w = 48
      const h = Math.max(1, Math.round((base.naturalHeight / base.naturalWidth) * w))
      const c = document.createElement('canvas')
      c.width = w
      c.height = h
      const ctx = c.getContext('2d')!
      ctx.imageSmoothingEnabled = false
      ctx.drawImage(base, 0, 0, w, h)
      im.srcset = ''
      im.src = c.toDataURL()
    } catch {
      /* keep the original image */
    }
  }
  return () => {
    stage.classList.remove('is-pixel')
    originals.forEach(({ im, src, srcset }) => {
      im.src = src
      im.srcset = srcset
    })
    sources.forEach((s, i) => (s.srcset = srcsets[i]))
  }
}

// 07 — Magnet: elements lean toward the cursor (≤ 24 px, spring) with
// dashed orange lines showing the pull.
export function magnet(stage: HTMLElement, { reduced }: Ctx): Cleanup {
  const els = bodies(stage)
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('class', 'magnet-layer')
  svg.setAttribute('aria-hidden', 'true')
  stage.appendChild(svg)
  const lines = els.map(() => {
    const l = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    svg.appendChild(l)
    return l
  })
  let centres: { x: number; y: number }[] = []
  const measure = () => {
    const sr = stage.getBoundingClientRect()
    centres = els.map((el) => {
      const r = el.getBoundingClientRect()
      return { x: r.left - sr.left + r.width / 2, y: r.top - sr.top + r.height / 2 }
    })
  }
  measure()
  const qx = els.map((el) => gsap.quickTo(el, 'x', { duration: reduced ? 0 : 0.6, ease: 'elastic.out(1, 0.5)' }))
  const qy = els.map((el) => gsap.quickTo(el, 'y', { duration: reduced ? 0 : 0.6, ease: 'elastic.out(1, 0.5)' }))
  const move = (e: PointerEvent) => {
    const sr = stage.getBoundingClientRect()
    const px = e.clientX - sr.left
    const py = e.clientY - sr.top
    els.forEach((_, i) => {
      const c = centres[i]
      const dx = px - c.x
      const dy = py - c.y
      const d = Math.hypot(dx, dy) || 1
      const k = Math.max(0, 1 - d / 420) * 24
      qx[i]((dx / d) * k)
      qy[i]((dy / d) * k)
      const l = lines[i]
      l.setAttribute('x1', String(px))
      l.setAttribute('y1', String(py))
      l.setAttribute('x2', String(c.x))
      l.setAttribute('y2', String(c.y))
      l.style.opacity = String(k > 1 ? 1 : 0)
    })
  }
  const leave = () => {
    qx.forEach((q) => q(0))
    qy.forEach((q) => q(0))
    lines.forEach((l) => (l.style.opacity = '0'))
  }
  stage.addEventListener('pointermove', move)
  stage.addEventListener('pointerleave', leave)
  addEventListener('resize', measure)
  return () => {
    stage.removeEventListener('pointermove', move)
    stage.removeEventListener('pointerleave', leave)
    removeEventListener('resize', measure)
    gsap.set(els, { x: 0, y: 0 })
    svg.remove()
  }
}

// 08 — Glitch: 2 s bursts of RGB split, shifted slices and noise bars with
// steps(), then calm. Reduced motion: a static split.
export function glitch(stage: HTMLElement, { reduced }: Ctx): Cleanup {
  stage.classList.add('is-glitch')
  const head = stage.querySelector<HTMLElement>('[data-glitch]')
  const layer = document.createElement('div')
  layer.className = 'glitch-layer'
  layer.setAttribute('aria-hidden', 'true')
  if (head) {
    for (const cls of ['g-red', 'g-cyan']) {
      const c = head.cloneNode(true) as HTMLElement
      c.removeAttribute('data-body')
      c.removeAttribute('data-glitch')
      c.className = `${head.className} ${cls}`
      layer.appendChild(c)
    }
  }
  for (let i = 0; i < 3; i++) {
    const bar = document.createElement('i')
    bar.className = 'g-bar'
    layer.appendChild(bar)
  }
  stage.appendChild(layer)
  if (reduced) return () => (layer.remove(), stage.classList.remove('is-glitch'))
  const burst = () => {
    const tl = gsap.timeline()
    for (let k = 0; k < 14; k++) {
      tl.set(layer.querySelectorAll('.g-red'), { x: gsap.utils.random(-14, 14), clipPath: `inset(${gsap.utils.random(0, 60)}% 0 ${gsap.utils.random(10, 50)}% 0)` }, k * 0.14)
      tl.set(layer.querySelectorAll('.g-cyan'), { x: gsap.utils.random(-14, 14), clipPath: `inset(${gsap.utils.random(30, 70)}% 0 ${gsap.utils.random(0, 30)}% 0)` }, k * 0.14)
      tl.set(layer.querySelectorAll('.g-bar'), { top: () => `${gsap.utils.random(5, 95)}%`, height: () => gsap.utils.random(2, 16), opacity: () => (Math.random() > 0.4 ? 0.9 : 0) }, k * 0.14)
      tl.set(stage.querySelectorAll('[data-body]'), { x: () => (Math.random() > 0.7 ? gsap.utils.random(-8, 8) : 0) }, k * 0.14)
    }
    tl.set(stage.querySelectorAll('[data-body]'), { x: 0 })
    tl.set(layer.querySelectorAll('.g-bar'), { opacity: 0 })
    return tl
  }
  let tl = burst()
  const timer = setInterval(() => (tl = burst()), 3600)
  return () => {
    clearInterval(timer)
    tl.kill()
    gsap.set(stage.querySelectorAll('[data-body]'), { x: 0 })
    layer.remove()
    stage.classList.remove('is-glitch')
  }
}
