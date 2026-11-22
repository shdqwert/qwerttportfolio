import { useEffect } from 'react'
import { gsap, MQ } from '../../motion/engine'
import s from './TouchFx.module.css'

// Phone/tablet counterpart of the desktop Cursor (coarse pointer + motion only).
//  · Tap stamp: every tap punches a ring of holes where the finger lands.
//  · Haptics: a short tick on buttons and links (Android; iOS ignores it).
//  · Tilt: --tilt-x / --tilt-y (-1…1) on <html>, from the gyroscope where the
//    browser gives it freely, otherwise from where the finger rests on screen.
//    [data-tilt] elements turn that into a parallax shift (base.css).
//  iOS hides the gyroscope behind a permission prompt; it is only asked for
//  when the visitor taps an element marked [data-tilt-ask] (the hero mark).
const TAP_TARGET = 'a, button, [role="button"], summary, label'

export default function TouchFx() {
  useEffect(() => {
    const mq = window.matchMedia(`${MQ.coarse} and ${MQ.motion}`)
    if (!mq.matches) return
    const root = document.documentElement
    root.classList.add('touch-fx')

    const layer = document.createElement('div')
    layer.className = s.layer
    layer.setAttribute('aria-hidden', 'true')
    document.body.appendChild(layer)

    // ---- tilt -------------------------------------------------------------
    const tilt = { x: 0, y: 0 }
    const apply = () => {
      root.style.setProperty('--tilt-x', tilt.x.toFixed(3))
      root.style.setProperty('--tilt-y', tilt.y.toFixed(3))
    }
    const toX = gsap.quickTo(tilt, 'x', { duration: 0.9, ease: 'power3.out', onUpdate: apply })
    const toY = gsap.quickTo(tilt, 'y', { duration: 0.9, ease: 'power3.out', onUpdate: apply })
    let gyro = false
    let base: { b: number; g: number } | null = null
    const orient = (e: DeviceOrientationEvent) => {
      if (e.beta == null || e.gamma == null) return
      gyro = true
      // relative to how the phone was held when the page started listening
      base ??= { b: e.beta, g: e.gamma }
      toX(gsap.utils.clamp(-1, 1, (e.gamma - base.g) / 18))
      toY(gsap.utils.clamp(-1, 1, (e.beta - base.b) / 18))
    }
    const listenGyro = () => window.addEventListener('deviceorientation', orient, { passive: true })
    type Ask = { requestPermission?: () => Promise<'granted' | 'denied'> }
    const needsAsk = typeof (window.DeviceOrientationEvent as unknown as Ask | undefined)?.requestPermission === 'function'
    if (!needsAsk) listenGyro()
    let asked = false

    // finger fallback: while a finger rests, the scene leans toward it
    const lean = (e: PointerEvent) => {
      if (gyro || e.pointerType === 'mouse') return
      toX((e.clientX / innerWidth - 0.5) * 2)
      toY((e.clientY / innerHeight - 0.5) * 2)
    }
    const settle = () => {
      if (gyro) return
      toX(0)
      toY(0)
    }

    // ---- tap stamp + haptics ------------------------------------------------
    let last = 0
    const down = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') return
      lean(e)
      const now = performance.now()
      if (now - last < 60) return
      last = now
      const t = e.target as Element | null
      const hit = t?.closest(TAP_TARGET)

      if (needsAsk && !asked && t?.closest('[data-tilt-ask]')) {
        asked = true
        ;(window.DeviceOrientationEvent as unknown as Required<Ask>)
          .requestPermission()
          .then((r) => r === 'granted' && listenGyro())
          .catch(() => {})
      }

      const stamp = document.createElement('span')
      stamp.className = `${s.stamp} ${hit ? s.strong : ''}`
      stamp.style.left = `${e.clientX}px`
      stamp.style.top = `${e.clientY}px`
      stamp.innerHTML = '<i></i>'.repeat(8)
      layer.appendChild(stamp)
      setTimeout(() => stamp.remove(), 650)
      // safety: never let stamps pile up
      while (layer.childElementCount > 6) layer.firstElementChild?.remove()

      if (hit && 'vibrate' in navigator) {
        try {
          navigator.vibrate(8)
        } catch {
          /* blocked by the browser: fine */
        }
      }
    }

    window.addEventListener('pointerdown', down, { passive: true })
    window.addEventListener('pointermove', lean, { passive: true })
    window.addEventListener('pointerup', settle, { passive: true })
    window.addEventListener('pointercancel', settle, { passive: true })
    return () => {
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointermove', lean)
      window.removeEventListener('pointerup', settle)
      window.removeEventListener('pointercancel', settle)
      window.removeEventListener('deviceorientation', orient)
      layer.remove()
      root.classList.remove('touch-fx')
      root.style.removeProperty('--tilt-x')
      root.style.removeProperty('--tilt-y')
    }
  }, [])
  return null
}
