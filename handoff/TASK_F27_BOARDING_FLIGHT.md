# TASK — F27 "Boarding flight" (case pages kinoqwertt + qwerttclients)

> For Cursor Agent / Claude Code. Execute it: implement, then verify in the browser. This is an addition to `handoff/CURSOR_PROMPT.md`; every rule there still applies (permissions, hard limits, motion engine, verification gates).
> **Design source:** `handoff/design/CaseKinoqwertt.dc.html` and `handoff/design/CaseQwerttclients.dc.html`. Search for `BOARDING FLIGHT (F27)` in both the CSS and the markup.
> **Videos:** `public/assets/video/` (already in the project):
>
> | File | Content |
> |---|---|
> | `kinoqwertt-reel.mp4` + `kinoqwertt-reel-poster.jpg` | ~31 s real screen recording of kinoqwertt: trailer carousel → rails → Dune title page; 960×600, H.264, muted |
> | `qwerttclients-reel.mp4` + `qwerttclients-reel-poster.jpg` | ~25 s real screen recording of qwerttclients in night mode: home → restaurant search → Amber → Studio Noir booking |

## What the visitor sees

1. **Start.** At the top of the case page the screen preview is **small** and sits beside the intro text. It carries a ticket tag: `Row 02 · Seat kinoqwertt` + an orange chip `Boarding`.
2. **Scroll down.** The preview **flies** down and to the left into a large dark landing mat directly below the hero, growing smoothly to full size. It does not simply scroll with the page.
3. **Tilt.** In mid-air it tilts like a physical card: `perspective(1800px) rotateX(5deg) rotateY(-6deg) rotateZ(-1.4deg)` at the midpoint, back to 0 on landing. The tilt also reacts to scroll **velocity** (faster scroll = up to ±4° extra), springing back when the scroll stops.
4. **Alive.** The screen inside is a **real video** (muted, looping, `playsinline`) of the product being used. That is why the image "comes alive".
5. **In flight.** The chip flips (SplitFlap) `Boarding → In flight`. A thin orange flight-path line draws from the start position to the landing slot. A light sheen (L2) sweeps across the card.
6. **Landing.** The chip flips to `Landed`. The **"BOARDED ✓"** stamp hits the lower-right corner (`qw.snap`, rotate −8° → −4°, scale 1.3 → 1). The flight path fades out. The card then scrolls on normally with the page.
7. **Scroll back up.** Everything reverses smoothly, because the animation is scrubbed, not triggered.

## Where

| Page | Start rect (px, desktop 1440) | Landing rect | Notes |
|---|---|---|---|
| `/work/kinoqwertt` | left 648, top 325, 760×475 (the old hero preview spot, right of "View site") | left 96, top 956, 1248×780, inside a `#1A1917` mat with 56/64 px padding | The old static hero preview is **replaced** by this. |
| `/work/qwerttclients` | right side under the hero: left 988, top 40 of the new section, 420×262, with the hint `● Watch it work — scroll ↓` | left 96, top 456, 1248×780, mat as above | New section **1b** between the hero board and "Booking shouldn't take a phone call". |

Numbers are for 1440 px. In code, measure the start and end slots with `getBoundingClientRect()` in `ScrollTrigger`'s `onRefresh` (FLIP style) so it works at any width.

## How to build it (GSAP + ScrollTrigger, inside `useGSAP`)

```ts
// BoardingFlight.tsx — one component, props: { video, poster, alt, row, seat, startRef }
// DOM: <figure class="flight"> sits in its FINAL slot (inside the landing mat); the start slot is an empty placeholder.
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: heroRef.current,          // the hero + landing wrapper
    start: 'top top',
    endTrigger: matRef.current,
    end: 'center center',              // landed when the mat is centred
    scrub: 1,                          // smooth catch-up
    invalidateOnRefresh: true,
  },
});
// FLIP: from the start slot to the final slot
const from = () => {
  const s = startRef.current!.getBoundingClientRect(), e = card.getBoundingClientRect();
  return { x: s.left - e.left, y: s.top - e.top, scale: s.width / e.width };
};
gsap.set(card, { transformOrigin: '0 0', transformPerspective: 1800 });
tl.fromTo(card, { x: () => from().x, y: () => from().y, scale: () => from().scale, rotateX: 0, rotateY: 0, rotateZ: 0 },
                { x: 0, y: 0, scale: 1, ease: 'qw.inOut', duration: 1 })
  .to(card, { keyframes: { rotateX: [0, 5, 0], rotateY: [0, -6, 0], rotateZ: [0, -1.4, 0] }, ease: 'none', duration: 1 }, 0)
  .fromTo(pathEl, { strokeDashoffset: len }, { strokeDashoffset: 0, ease: 'qw.inOut', duration: 0.9 }, 0.05)
  .to(pathEl, { opacity: 0, duration: 0.1 }, 0.92)
  .fromTo(sheen, { xPercent: -130 }, { xPercent: 130, ease: 'none', duration: 0.5 }, 0.25)
  .add(() => chip.flip(tl.scrollTrigger!.direction > 0 ? 'In flight' : 'Boarding'), 0.08)
  .add(() => chip.flip(tl.scrollTrigger!.direction > 0 ? 'Landed' : 'In flight'), 0.95)
  .fromTo(stamp, { autoAlpha: 0, scale: 1.3, rotate: -8 }, { autoAlpha: 1, scale: 1, rotate: -4, ease: 'qw.snap', duration: 0.08 }, 0.92);

// velocity tilt (extra, on top of the timeline)
const tiltTo = gsap.quickTo(tiltWrap, 'rotateY', { duration: 0.6, ease: 'power3.out' });
ScrollTrigger.create({ trigger: heroRef.current, start: 'top top', end: 'bottom top',
  onUpdate: (self) => tiltTo(gsap.utils.clamp(-4, 4, self.getVelocity() / -400)) });
// when scrolling stops, return to 0 (e.g. gsap.delayedCall(0.15) reset in onUpdate)
```

**Rules:**

- **Wrappers:** use two nested wrappers — the outer one for the FLIP x/y/scale, the inner one for the velocity tilt — so the two transforms never fight.
- **Video:**
  - `<video muted loop playsinline preload="metadata" poster=…>` with the poster `<img>` underneath.
  - Call `play()` only when the card is within 1 viewport (IntersectionObserver), and `pause()` when it leaves.
  - Never autoplay with sound.
- **Text:** the `aria-label` describes what the recording shows. The tag, path and stamp are `aria-hidden`.
- **Layout:** the hero must reserve the start slot's space (an empty placeholder with `aspect-ratio: 16/10`), so the layout never jumps when the card leaves it.
- **Reduced motion / < 1024 px / `(pointer: coarse)` with low memory:**
  - no flight: the card is rendered in its landing slot;
  - the video shows only the poster plus a "Play ▶" button;
  - the stamp is shown, the path and hint are hidden.
- **Performance:** only `transform` and `opacity` animate. `will-change: transform` only while the ScrollTrigger is active. Keep p95 frame time ≤ 18 ms (gate 3 in CURSOR_PROMPT).

## Optional extra (do it if time allows, say so in the report)

On Home, apply the same flight to the hero preview: it flies from the hero into the Case 01 scroll stage frame (F1), so the "small preview" becomes the big interactive stage. Same component, different start and end refs.

## Verify (record it, don't guess)

1. Use a Playwright video (`recordVideo`, 1440×900): scroll each case page slowly down through the flight and back up, then fast.
2. Extract frames every 100 ms with ffmpeg and look at them. Check:
   - the card moves along one smooth path;
   - no jump at start or landing;
   - the chip and stamp states are correct in both directions;
   - the video is playing.
3. Take screenshots at progress 0 / 0.5 / 1 and compare them with the canvas loop states (the design file shows the motion as an 8 s alternate loop).
4. Run the reduced-motion screenshot and the perf spec. Add the results to `REPORT.md`.
