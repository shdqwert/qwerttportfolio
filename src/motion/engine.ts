// The ONLY place where Lenis and ScrollTrigger are wired. One Lenis instance,
// one GSAP ticker for the whole app. Browser-only: call initMotion() once.
import gsap from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { Flip } from 'gsap/Flip'
import { Observer } from 'gsap/Observer'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import Lenis from 'lenis'

export { gsap, ScrollTrigger, SplitText, Flip, Observer }

export const MQ = {
  desktop: '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
  motion: '(prefers-reduced-motion: no-preference)',
  reduce: '(prefers-reduced-motion: reduce)',
  coarse: '(pointer: coarse)',
  fine: '(pointer: fine) and (prefers-reduced-motion: no-preference)'
}

let lenis: Lenis | null = null
let ready = false

export const isReduced = () => typeof window !== 'undefined' && window.matchMedia(MQ.reduce).matches
export const getLenis = () => lenis

export function initMotion() {
  if (ready || typeof window === 'undefined') return
  ready = true
  gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase, Flip, Observer)
  CustomEase.create('qw.out', '0.2,0.7,0.2,1')
  CustomEase.create('qw.inOut', '0.65,0,0.35,1')
  CustomEase.create('qw.snap', '0.3,1.4,0.5,1')
  gsap.defaults({ ease: 'qw.out', duration: 0.8 })
  ScrollTrigger.config({ ignoreMobileResize: true })

  if (!isReduced()) {
    lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9, smoothWheel: true, syncTouch: false })
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((t) => lenis?.raf(t * 1000))
    gsap.ticker.lagSmoothing(0)
  }

  const refresh = () => ScrollTrigger.refresh()
  document.fonts?.ready.then(refresh)
  window.addEventListener('load', refresh, { once: true })
  ;(window as unknown as { __motionReady: boolean }).__motionReady = true
}

export function headerOffset() {
  return 24
}

// Anchor / programmatic scroll. Reduced motion jumps instantly.
export function scrollToTarget(target: string | number | HTMLElement, opts: { immediate?: boolean; duration?: number } = {}) {
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target
  if (el === null) return
  if (lenis && !opts.immediate && !isReduced()) {
    lenis.scrollTo(el as HTMLElement | number, { offset: typeof el === 'number' ? 0 : -headerOffset(), duration: opts.duration ?? 1.1, easing: (t) => 1 - Math.pow(1 - t, 4) })
  } else {
    const y = typeof el === 'number' ? el : el.getBoundingClientRect().top + window.scrollY - headerOffset()
    if (lenis) lenis.scrollTo(y, { immediate: true, force: true })
    else window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior })
  }
}

let locks = 0
export function lockScroll() {
  if (locks++ > 0) return
  const gap = window.innerWidth - document.documentElement.clientWidth
  document.documentElement.style.setProperty('--scrollbar-gap', `${gap}px`)
  document.documentElement.classList.add('scroll-locked')
  lenis?.stop()
}
export function unlockScroll() {
  if (--locks > 0) return
  document.documentElement.classList.remove('scroll-locked')
  document.documentElement.style.removeProperty('--scrollbar-gap')
  lenis?.start()
}

// Wait for fonts + decoded images in a container, then refresh triggers.
export async function refreshWhenReady(root?: HTMLElement | null) {
  try {
    await document.fonts?.ready
    const imgs = root ? [...root.querySelectorAll('img')] : []
    await Promise.all(imgs.slice(0, 12).map((i) => (i.complete ? i.decode?.().catch(() => {}) : new Promise((r) => i.addEventListener('load', r, { once: true })))))
  } catch {
    /* ignore */
  }
  ScrollTrigger.refresh()
}
