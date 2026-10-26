import { useGSAP } from '../../motion/useMotion'
import { useRef } from 'react'
import { Img } from '../../components/Common'
import { useHomeText } from '../../content/pages/home'
import type { ImgKey } from '../../content/shared'
import { gsap, MQ } from '../../motion/engine'
import { useStatic } from '../../motion/hooks'
import s from './Home.module.css'

// [image, x, y, w, h, rotation, opacity] in the 1376 × 860 panel (design values)
const TILES: [ImgKey, number, number, number, number, number, number][] = [
  ['photos/f3-s', 40, 230, 220, 146, -8, 1], ['photos/s1-s', 290, 160, 170, 113, 6, 0.9],
  ['photos/c1-s', 120, 430, 190, 126, 4, 1], ['photos/sp3-s', 300, 600, 160, 106, -5, 0.85],
  ['photos/y3-s', 60, 640, 200, 133, 9, 0.7], ['photos/ho3-s', 330, 330, 120, 80, -3, 0.8],
  ['photos/p1-s', 1040, 60, 220, 146, 7, 1], ['photos/w3-s', 1150, 250, 180, 120, -6, 0.9],
  ['photos/b4-s', 960, 230, 130, 87, 4, 0.85], ['photos/r5-s', 1110, 430, 190, 126, 3, 1],
  ['photos/h2-s', 970, 560, 150, 100, -9, 0.8], ['photos/t2-s', 560, 40, 170, 113, -4, 0.75],
  ['photos/j1-s', 760, 70, 150, 100, 8, 0.8], ['photos/r4-s', 520, 700, 170, 113, 5, 0.8],
  ['photos/c3-s', 730, 690, 150, 100, -7, 0.75], ['photos/sp1-s', 860, 640, 110, 73, 10, 0.7]
]

// F18 — pinned ~220vh: 16 real venue photos fly from scattered, off-panel
// positions into the centre frame, shrinking and fading (stagger from edges);
// the frame settles and the headlines fade in for the last 20 %.
export default function Storm() {
  const { storm } = useHomeText()
  const isStatic = useStatic()
  const ref = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      if (isStatic) return
      const el = ref.current!
      const mm = gsap.matchMedia()
      mm.add(MQ.desktop, () => {
        const tiles = gsap.utils.toArray<HTMLElement>(`.${s.tile}`, el)
        const kx = () => el.clientWidth / 1376
        const ky = () => el.clientHeight / 860
        const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: el, start: 'center center', end: '+=120%', pin: true, anticipatePin: 1, scrub: 0.5, invalidateOnRefresh: true } })
        tiles.forEach((t, i) => {
          const [, x, y, w, h, r] = TILES[i]
          const dx = 688 - (x + w / 2)
          const dy = 430 - (y + h / 2)
          tl.fromTo(t, { x: () => -dx * 0.6 * kx(), y: () => -dy * 0.6 * ky(), rotate: r * 2.2, scale: 1.15 }, { x: () => dx * kx(), y: () => dy * ky(), rotate: 0, scale: 0.3, opacity: 0, duration: 0.6, ease: 'power2.in' }, 0.04 * (Math.hypot(dx, dy) > 420 ? 0 : 1) + (i % 4) * 0.03)
        })
        tl.fromTo(el.querySelector(`.${s.stormFrame}`), { scale: 0.9 }, { scale: 1, duration: 0.6, ease: 'qw.out' }, 0.2)
        tl.from(el.querySelectorAll(`.${s.stormText}`), { autoAlpha: 0, y: 24, duration: 0.2, stagger: 0.05 }, 0.8)
      })
    },
    { scope: ref, dependencies: [isStatic] }
  )
  return (
    <div ref={ref} className={s.storm} aria-label={storm.label} role="img" data-theme="ink">
      {TILES.map(([k, x, y, w, h, r, o]) => (
        <span key={k} className={s.tile} aria-hidden="true" style={{ left: `${(x / 1376) * 100}%`, top: `${(y / 860) * 100}%`, width: w, height: h, transform: `rotate(${r}deg)`, opacity: o }}>
          <Img k={k} alt="" sizes="220px" />
        </span>
      ))}
      <div className={s.stormFrame}>
        <Img k="dark/d-home" alt={storm.frameAlt} sizes="640px" />
      </div>
      <div className={`${s.stormText} ${s.stormL}`}>
        {storm.left[0]}
        <br />
        {storm.left[1]}
      </div>
      <div className={`${s.stormText} ${s.stormR}`}>
        {storm.right[0]}
        <br />
        {storm.right[1]}
        <span className={s.stop}>.</span>
      </div>
      <div className={`mono ${s.stormCats}`}>
        {storm.cats[0]}
        <br />
        {storm.cats[1]}
      </div>
    </div>
  )
}
