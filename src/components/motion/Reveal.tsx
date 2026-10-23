import { useGSAP } from '@gsap/react'
import { createElement, useRef, type CSSProperties, type ReactNode } from 'react'
import { gsap, MQ, SplitText } from '../../motion/engine'

type Variant = 'rise' | 'clip' | 'rule' | 'mask' | 'track' | 'side' | 'fade'

type Props = {
  as?: string
  variant?: Variant
  children?: ReactNode
  className?: string
  style?: CSSProperties
  /** CSS selector of the pieces to animate inside; default: direct children (or the element itself for mask/track/clip) */
  targets?: string
  stagger?: number
  delay?: number
  start?: string
  id?: string
  'aria-label'?: string
  'aria-labelledby'?: string
  role?: string
}

// Triggered once at `top 82%`, never replays. Content is in the DOM and
// visible without JS; GSAP only sets the from-state when motion is allowed.
export default function Reveal({ as = 'div', variant = 'rise', children, className, style, targets, stagger = 0.07, delay = 0, start = 'top 82%', ...rest }: Props) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        const st = { trigger: el, start, once: true }
        const kids = targets ? gsap.utils.toArray<HTMLElement>(targets, el) : (Array.from(el.children) as HTMLElement[])
        switch (variant) {
          case 'rise':
            gsap.from(kids.length ? kids : el, { y: 24, autoAlpha: 0, duration: 0.8, stagger, delay, ease: 'qw.out', scrollTrigger: st })
            break
          case 'fade':
            gsap.from(kids.length ? kids : el, { autoAlpha: 0, duration: 0.8, stagger, delay, scrollTrigger: st })
            break
          case 'side':
            gsap.from(kids.length ? kids : el, { x: (i: number) => (i % 2 ? 60 : -60), autoAlpha: 0, duration: 0.9, stagger, delay, ease: 'qw.out', scrollTrigger: st })
            break
          case 'clip': {
            const t = kids.length && targets ? kids : [el]
            gsap.fromTo(t, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, stagger, delay, ease: 'qw.inOut', scrollTrigger: st, clearProps: 'clipPath' })
            break
          }
          case 'rule': {
            const rules = gsap.utils.toArray<HTMLElement>('[data-rule]', el)
            const rises = gsap.utils.toArray<HTMLElement>('[data-rise]', el)
            const tl = gsap.timeline({ scrollTrigger: st, delay })
            tl.from(rules, { scaleX: 0, transformOrigin: '0 50%', duration: 0.8, stagger: 0.09, ease: 'qw.out' })
            if (rises.length) tl.from(rises, { y: 16, autoAlpha: 0, duration: 0.7, stagger: 0.09 }, 0.25)
            break
          }
          case 'mask': {
            SplitText.create(el, {
              type: 'lines',
              mask: 'lines',
              aria: 'none',
              autoSplit: true,
              linesClass: 'split-line',
              onSplit(self) {
                return gsap.from(self.lines, { yPercent: 105, duration: 0.9, stagger: 0.08, delay, ease: 'qw.out', scrollTrigger: st })
              }
            })
            break
          }
          case 'track':
            gsap.from(el, { letterSpacing: '0.03em', y: 24, autoAlpha: 0, duration: 1, delay, ease: 'qw.out', scrollTrigger: st })
            break
        }
      })
    },
    { scope: ref }
  )

  // eslint-disable-next-line react/refs
  return createElement(as, { ref, className, style, ...rest }, children)
}
