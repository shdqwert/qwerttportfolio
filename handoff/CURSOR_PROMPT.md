# CURSOR_PROMPT.md — build qwerttportfolio, motion + light edition

> Paste this whole file into Cursor (Agent mode) or Claude Code. It is an **execution order**, not a discussion.
> Companion files: `PORTFOLIO_IMPLEMENTATION.md` (full spec, F1–F26) and `portfolio-handoff/` (design source + real assets).
> **Priority when something conflicts:** this file (motion, light, process, permissions) → `design/*.dc.html` (layout, copy, colours) → `PORTFOLIO_IMPLEMENTATION.md` → your judgement.

---

## 0. Mission

Build the owner's personal portfolio **qwerttportfolio**: a desktop-first web-developer portfolio whose job is to make a visitor think *"this person is a pro — I want to hire them"*.

- **Two case studies only:** **qwerttclients** (a booking platform, shown in its night theme) and **kinoqwertt** (a film-site redesign concept).
- **Pages:** Home, `/work/qwerttclients`, `/work/kinoqwertt`, `/lab`, plus the Connect drawer.
- **Feel:** the experience must feel **expensive**. Every motion is smooth, physical and intentional. Light reacts to the visitor. Nothing jumps, flickers, loads late or blocks scrolling.

**Identity (v3, the owner's own — not a copy of any reference):**

| Element | Value |
|---|---|
| Motif | Travel ticket / boarding pass / departure board — "every project is a trip" |
| Colour: paper | `#ECE8DF` |
| Colour: paper-2 | `#DEDAD0` |
| Colour: ink | `#111110` |
| Colour: signal orange | `#FF4F1F` — stamps, active states, arrows, focus, light accents only |
| Display font | Barlow Condensed |
| Body font | IBM Plex Sans |
| Label font | JetBrains Mono |
| Signature mark | Punched-hole "q" mark |

---

## 1. Permissions — the owner grants you full working access

You are authorised to do all of the following **without asking**:

1. **Project folder:** read, create, edit, move and delete any file inside the project folder (and the handoff folder).
2. **Terminal:** run any command needed to build, lint, type-check, test, preview, profile and screenshot the project.
3. **Packages and tools:** install npm packages and dev tools, and install Playwright browsers (`npx playwright install chromium firefox webkit`).
4. **Local servers:** start and stop them (Vite dev/preview, a small API proxy) on any free localhost port.
5. **Browsing:** open **any public website** in a real browser (Playwright, or Cursor's browser / MCP if available) to study motion, take screenshots and record videos. This includes the reference sites and the live kinoqwertt.
6. **Scaffolding:**
   - If the project folder is empty, create the app yourself (§3).
   - If a repo already exists, audit it first and work inside it.
7. **Git:** create a local branch and make **local commits** after each phase (clear messages).
8. **Fixing:** fix every bug, warning and visual difference you find. Make ordinary technical decisions yourself and do not stop to ask.

**Hard limits — these stay in force even with full access:**

- **No spending.** Do not buy anything, start a paid plan or trial, or enter payment details.
- **No going public without the owner's yes.** Do not deploy, publish, `git push`, open PRs or make anything public until the owner explicitly says "yes" in chat. Prepare everything else, then ask once at the end.
- **No secrets in files.** Do not put API keys, tokens or passwords in any file in the repo. Use `.env.local` (git-ignored) plus a `.env.example` with empty values. The TMDB token in the old kinoqwertt project is **invalid** — do not try to reuse or hunt for keys; use the local fallback images.
- **No contact.** Do not message, email or submit forms to third parties.
- **No logins.** Do not log in to any website. Do not create accounts.
- **No copying references.** Do not copy code, assets, fonts, copy or glyphs from the reference sites. Study behaviour only.
- **Stay inside the project.** Do not touch system settings, global configs or files outside the project and handoff folders.

---

## 2. Inputs

```
portfolio-handoff/
├── PORTFOLIO_IMPLEMENTATION.md   full spec: sections, features F1–F26, tokens, a11y, phases
├── design/                       approved design (Claude Design canvas files)
│   ├── Main.dc.html              Home — layout, copy, order (source of truth)
│   ├── CaseQwerttclients.dc.html /work/qwerttclients (8-chapter story, dark app visuals)
│   ├── CaseKinoqwertt.dc.html    /work/kinoqwertt (dark page)
│   ├── Lab.dc.html               /lab — 10 effect switches (working prototype logic in renderVals)
│   ├── Connect.dc.html           Connect drawer (open state)
│   ├── System.dc.html            tokens, components, storyboards, spec rows
│   └── canvas.json
└── assets/                       real screenshots + photos
    ├── dark/                     qwerttclients NIGHT renders (use these everywhere for qwerttclients)
    ├── photos/                   real venue photos (Unsplash, credit required)
    ├── renders/                  flow screens, languages
    └── lab/                      film fallback images
```

**How to read `.dc.html`:**

- It is HTML with inline styles inside `<x-dc>`. Fonts and the shared CSS are in `<helmet>`.
- `{{name}}` holes and `<sc-for list>` loops get their data from the `renderVals()` script at the bottom of each file. Data, copy and blob ids live there.
- `/_blob/<id>` images map to files in `assets/` (map by alt text and order; table in spec §4.2).
- The CSS block `/* DEPARTURE FINALE + TERMINAL FOOTER */` already contains the motion for F26 as **looping keyframes** (canvas preview only). In the real build that motion must be **driven by scroll** as specified below, not looped.
- Open each file in a browser to see it. Missing blob images are fine; match against the canvas screenshots you take in Step A.

---

## 3. Stack decision (made — do not re-debate unless the repo already dictates otherwise)

| Concern | Choice | Why |
|---|---|---|
| App | **Vite + React 19 + TypeScript + React Router** | Same stack as the owner's own projects |
| Animation engine | **GSAP 3** — core, ScrollTrigger, SplitText, Flip, CustomEase, Observer (all free in GSAP 3.13+) + `@gsap/react` (`useGSAP`) | Precise pinned and scrubbed timelines are the core of this site |
| Smooth scroll | **Lenis** (one instance for the whole app) | Inertial, native-scroll-based smoothing. No scroll-jacking. |
| Physics (Lab Gravity only) | **Matter.js**, lazy-loaded | — |
| Styles | Plain CSS with custom properties (tokens) + CSS Modules per component | No Tailwind, no UI kit |
| Fonts | Self-host Barlow Condensed (500/600/700), IBM Plex Sans (400–700), JetBrains Mono (400/500) via `@fontsource/*`, `font-display: swap` + metric-matched fallbacks | — |
| API proxy | Vite dev proxy + a tiny serverless/edge function for TMDB (Lab Film mode) | Keeps the key on the server |
| Tests | Playwright (visual, motion, a11y with `@axe-core/playwright`) + Vitest for utilities | — |

**Existing repo?** Then audit it first (spec §10). Keep its architecture, add GSAP + Lenis only if nothing equivalent exists, and write the reason down.

---

## 4. Step-by-step execution

### Step A — Research in a real browser (do this first, ~30 min of tool time)

Write `research/capture.ts` (Playwright, Chromium, 1440×900, `recordVideo`). For each site:

1. Load the site and wait for network idle + 2 s.
2. Take a full-page screenshot.
3. Scroll the page **slowly**: `mouse.wheel` 120 px every 120 ms to the bottom, with video recording on.
4. Scroll it again **fast**: 1200 px jumps.
5. Hover the main nav, buttons and cards; screenshot each hover state.
6. Log fonts, colours, the number of `position: sticky` / pinned elements, animation libraries found in `window` (e.g. `gsap`, `Lenis`, `THREE`), and the average frame time while scrolling (rAF sampling).

**Sites to visit:**

- **References (behaviour and pacing only — never copy):**
  - https://www.eduardbodak.com/
  - https://www.eduardbodak.com/work
  - https://www.eduardbodak.com/work/filmbot
  - https://lusion.co/about
  - https://uncommondesign.group/
  - https://matvoyce.tv/
  - https://minhpham.design/
- **Owner's live project:**
  - https://kinoqwertt.vercel.app — capture its real motion: GSAP rails, carousel, page transitions.
- **The design itself:** open every `design/*.dc.html` locally and screenshot it full-page. These are your **visual targets**.

**Output: `research/NOTES.md`.** For each site, 5–10 bullets on:

- what makes its motion feel smooth (easing, duration, how scrub lags, how text reveals);
- what you will adapt — in our own identity;
- what you will deliberately avoid (preloaders, scroll-jacking, heavy WebGL).

Keep the videos in `research/videos/` (git-ignored). Do not download or ship any of their assets.

### Step B — Scaffold, tokens, fonts, assets

1. Create the app (or audit the existing one) and the route skeleton.
2. Copy `assets/` to `public/assets/` with readable names. **qwerttclients always uses the `dark/` renders.** Exceptions:
   - the design layer of the Design→Code slider stays light;
   - the "day" half of the Languages wipe stays light.
3. Convert images to AVIF + WebP + JPEG fallback at 1×/2× (e.g. `vite-imagetools` or `sharp` script). Set explicit `width`/`height` on every `<img>`.
4. Put tokens in `src/styles/tokens.css`: spec §11.1 v3 + the light tokens in §6 below + the motion tokens in §5.3.
5. Centralise all placeholders (`[Your Name]`, `[hello@yourdomain.com]`, prices…) in `src/content/site.ts`.

### Step C — Static build, pixel-matched, no motion

- Build every section of every page at 1440 px, matching `design/*.dc.html`: spacing, sizes, copy, colours, order.
- Compare with Playwright screenshots side by side (`research/compare/`) and fix differences until each section is visually equivalent.
- Content must be fully readable with JS disabled.
- **Commit.**

### Step D — Motion system core (§5), then light system core (§6)

### Step E — Feature motion, page by page (§7). Commit after each page.

### Step F — Interactions: Connect drawer, slider, lightbox, FAQ, Lab modes, copy email, live clock, form (spec F3, F6, F10, F11, F25)

### Step G — Reduced motion, touch, keyboard, no-JS paths for every feature

### Step H — Verification (§8): fix → re-verify until all gates pass

### Step I — Final report (§9), then ask the owner once whether to deploy

---

## 5. Motion system — how everything must move

### 5.1 One clock, one scroll

```ts
// src/motion/engine.ts — the ONLY place Lenis/ScrollTrigger are wired
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { CustomEase } from 'gsap/CustomEase';
import { Flip } from 'gsap/Flip';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase, Flip);

export const reduce = matchMedia('(prefers-reduced-motion: reduce)');

export const lenis = reduce.matches ? null : new Lenis({
  lerp: 0.085,              // inertia: lower = silkier, never below 0.07
  wheelMultiplier: 0.9,
  smoothWheel: true,
  syncTouch: false,         // native touch scrolling stays native
});

if (lenis) {
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

CustomEase.create('qw.out',   '0.2,0.7,0.2,1');   // reveals, slides
CustomEase.create('qw.inOut', '0.65,0,0.35,1');   // opens, wipes, drawers
CustomEase.create('qw.snap',  '0.3,1.4,0.5,1');   // tiny overshoot: stamps, chips, ticket landing
```

**Rules:**

- **Lenis:**
  - Exactly **one** Lenis instance and **one** GSAP ticker.
  - Never add a second smooth-scroll lib or a `requestAnimationFrame` loop per component. Subscribe to `gsap.ticker` instead.
  - **Anchor links:** use `lenis.scrollTo(target, { offset: -header, duration: 1.1, easing: t => 1 - Math.pow(1 - t, 4) })`. Under reduced motion, jump instantly.
  - **When the Connect drawer or a lightbox opens:** call `lenis.stop()`, then `lenis.start()` on close. Compensate for the scrollbar width so nothing shifts.
- **Animation code:**
  - Every component animates inside `useGSAP(() => {...}, { scope: ref })` so contexts revert on unmount (route changes leave zero leaked triggers).
  - Put desktop / reduced-motion / touch variants inside `gsap.matchMedia()`: `'(min-width: 1024px) and (prefers-reduced-motion: no-preference)'`, `'(prefers-reduced-motion: reduce)'`, `'(pointer: coarse)'`.
- **ScrollTrigger timing:**
  - Call `ScrollTrigger.refresh()` after `document.fonts.ready` and after the images of pinned sections have `decode()`d.
  - Never read layout (`getBoundingClientRect`) inside an `onUpdate`. Cache it in `onRefresh`.
  - Pinned sections: use `pin: true, pinSpacing: true, anticipatePin: 1`. No ancestor may have `overflow: hidden`; use `overflow-x: clip`.
  - **Scrubbed timelines** use `scrub: 0.8` (smooth catch-up, never 1:1 jitter). Story stages use `scrub: 1` — F1, F2, F13, F17, F18, F19, F24. The finale (F26) uses `scrub: 1.2`.
  - **Triggered reveals** play once (`once: true`), fire at `start: 'top 82%'` and must not replay on scroll-up.
- **What may animate:** only `transform`, `opacity`, `clip-path` and CSS custom properties that feed those.
  - Never animate `width`, `height`, `top`, `left`, `margin` or `box-shadow`. For shadows, animate the opacity of a pre-rendered shadow layer.
  - Never animate `filter: blur` on anything larger than 400×400.
  - Set `will-change: transform` only while an element is animating (`onStart`/`onComplete`), never globally.
- **Timing:** everything is time-based (GSAP), so 60 Hz and 120 Hz screens feel identical.
- **Text splitting:**
  - Use SplitText with `mask: 'lines'` (lines rise from a clip, no overflow hacks).
  - Keep `aria-label` with the original string on the parent; give split pieces `aria-hidden`.
  - Re-split on resize (`autoSplit: true`, `onSplit` returns the tween).

### 5.2 Motion language (the "feel" in words)

- **Departure board:** precise, mechanical, satisfying. Characters flip in `steps()`, then settle with a 1-frame flicker of light (§6, L3).
- **Ticket:** paper with weight. Cards land with a tiny overshoot (`qw.snap`), tear lines draw, stamps hit (scale 1.25 → 1, rotate −8° → −3°, 260 ms) with a quick orange flash.
- **Travel:** horizontal movement means "going somewhere": lines slide in from the sides, strips move sideways, transitions wipe like a departure gate.
- **Calm by default:** most reveals are short (≤ 0.8 s) and small (16–32 px). The big moments are the story stages, the deck, the storm, the finale and page transitions. **Never** apply the same fade-up to everything. Vary rule-draw, clip-reveal, mask-rise, tracking-settle, flip.

### 5.3 Motion tokens

```css
:root {
  --ease-out: cubic-bezier(.2,.7,.2,1);
  --ease-in-out: cubic-bezier(.65,0,.35,1);
  --ease-snap: cubic-bezier(.3,1.4,.5,1);
  --d-micro: 160ms;  /* colour, underline */
  --d-ui: 320ms;     /* buttons, chips, hover lifts */
  --d-reveal: 800ms; /* section reveals */
  --d-open: 1000ms;  /* drawers, windows, wipes */
  --d-page: 1100ms;  /* route transition total */
  --stagger: 70ms;   /* default sibling stagger (60–120 allowed) */
  --rise: 24px;      /* default reveal distance (16–32, never > 48) */
}
```

### 5.4 Global motion components (build these first, reuse everywhere)

| Component | Behaviour |
|---|---|
| `<Reveal variant="rise\|clip\|rule\|mask\|track">` | Rise: y 24 → 0, opacity 0 → 1, 0.8 s qw.out. Clip: `inset(100% 0 0 0)` → `inset(0)`. Rule: `scaleX(0 → 1)` from left, then children rise. Mask: SplitText lines `yPercent 105 → 0`, stagger 0.08. Track: letter-spacing `+0.04em → final` while rising 24 px. Content is visible if JS fails: add `.js-motion` on `<html>` before first paint and hide only under that class. |
| `<Counter to={23} />` | Counts up once in 1.2 s, `power3.out`, tabular numerals, final value in the DOM from the start (`aria-label`). |
| `<SplitFlap text rows />` | 24×36 tiles. Each tile flips 2–6 random glyphs (`A–Z 0–9 · :`) at 40 ms per flip with `steps(1)`; the top half folds down via `rotateX(-90deg)` on a split pseudo-element (`transform-origin: bottom`), 70 ms. Column stagger 25 ms. Used in the case hero board (F20), the finale "Destination" flap and the header STATUS. |
| `<PunchMark shape>` | 7×7 punched-hole grid (round cells). Morphs between bitmaps (q / ticket / film / @) per cell: scale 0 → 1 + opacity, stagger by distance from centre 10 ms, 600 ms. In the hero, holes near the cursor push away (≤ 18 px, spring via `gsap.quickTo`, duration 0.6, `elastic.out(1, 0.5)`). |
| `<Magnetic strength={0.25} max={12}>` | Pointer-fine only. `gsap.quickTo` x/y, 0.5 s `power3.out`; returns with `elastic.out(1, 0.4)`. Used on primary buttons, the 180 px "Let's talk" circle and the finale arrow. |
| `<RollLabel>` | Nav and buttons: visible label goes `yPercent 0 → −100`, `aria-hidden` duplicate goes `100 → 0`, 0.35 s qw.out, stagger 0.012 s per character. |
| `<Marquee speed={60}>` | Infinite `xPercent` loop with `gsap.ticker`; speed eases to 0 on hover/focus (0.4 s); reverses direction briefly with scroll velocity (`ScrollTrigger` `getVelocity()`, clamp ±1.5×). |
| `<Cursor>` | Desktop pointer-fine only. A 10 px ink/paper dot (blend `difference`) follows with `quickTo` 0.35 s. The native cursor stays visible. Over media it grows to 72 px and shows mono `VIEW`; over sliders `DRAG`; over the finale `BOARD →`. Hidden on touch and under reduced motion. |
| `<PageTransition>` | See §7.6. |

---

## 6. Light system — make the page feel lit, not flat

Light is subtle, warm and physical. It must **never** reduce text contrast below WCAG AA and must **cost almost nothing** (CSS gradients on composited layers, one shared pointer listener writing CSS variables in a single `gsap.ticker` callback).

```css
:root {
  --light-warm: rgba(255, 186, 120, .10);   /* warm cabin light */
  --light-signal: rgba(255, 79, 31, .16);   /* orange glow */
  --light-white: rgba(255, 255, 255, .07);  /* specular */
  --shade: rgba(0, 0, 0, .55);              /* vignette */
}
```

| # | Light | Where | How | Reduced motion / touch |
|---|---|---|---|---|
| L1 | **Cursor cabin light** | All ink sections (Case 02, opener, storm, demo, finale, footer, kino case page) | One fixed overlay per ink section: `background: radial-gradient(520px circle at var(--lx) var(--ly), var(--light-warm), transparent 60%)`, `mix-blend-mode: screen`. Pointer position is lerped (factor 0.12 per tick) so the light **trails** softly. Fades in over 400 ms when the pointer enters the section. | Static soft glow at top-centre. |
| L2 | **Ticket sheen** | Service tickets, pricing cards, boarding passes in the footer deck, the printed booking ticket, the seat tag | `::after` with a 120° linear gradient band (transparent → `--light-white` → transparent, 35% wide), `translateX(-130% → 130%)` 0.9 s qw.inOut. Runs **once** when the card enters view and again on hover (throttled to once per 1.2 s). Footer deck cards also tilt to the pointer (rotateX/Y ≤ 6°, `perspective: 900px`) and the sheen position follows the tilt. | Off. |
| L3 | **Board glow** | Split-flap boards, "Final call · Destination", header STATUS | Active-row characters get `text-shadow: 0 0 12px var(--light-signal)`. On each flip, the tile's opacity dips 1 → .82 → 1 in 80 ms (filament flicker). Orange dots pulse (scale 1 → 1.35, opacity .9 → 0 ring) every 2.4 s. | Static glow, no flicker. |
| L4 | **Stage lighting for the finale** | F26 on every page | Section vignette: `radial-gradient(ellipse at 50% 40%, transparent 45%, var(--shade))`. A soft spotlight follows the **active line** of the scrubbed headline (a 900×300 radial-gradient layer whose `y` is tweened with the timeline). Each image window has a rim light (`inset 0 0 0 1px rgba(255,255,255,.12)`) and a warm bloom under it (pre-blurred PNG/radial layer, opacity follows window open progress). | Static vignette only. |
| L5 | **Hero ambient** | Home hero + case heroes | A large, very soft warm gradient blob behind the preview drifts slowly (40 s loop, ±6% position, `yoyo`). The preview's contact shadow is a separate blurred layer whose opacity/scale grows as the preview lifts on scroll (1 → 1.04). | Static. |
| L6 | **Wordmark light sweep** | Giant "QWERTT" ticket in every footer | When the footer reaches 60% in view: letters rise (70 ms stagger), then **one** light band sweeps across the letters (`background-clip: text` gradient, `background-position` 120% → −20%, 1.4 s). The punched holes along the top get a 1 px inner highlight. | Static letters, no sweep. |
| L7 | **Runway progress lights** | Top of viewport | Instead of a plain progress bar: 48 small dots across the width. Dots light up orange in sequence with page progress (`scaleX` of a masked orange layer over a dotted mask — a single element). Invert to paper dots over ink. | Plain 2 px bar. |
| L8 | **Lights-down hand-over** | Every paper → ink boundary (Case 02, Contact, case page sections) | As the ink section rises, a radial "lights dimming" mask expands from the pointer position (or from the centre on touch): `clip-path: circle(0% at var(--lx) var(--ly)) → circle(150%)`, scrubbed over 35vh. Text colour switches with the background at 50% so contrast never drops. | Instant colour swap. |
| L9 | **Map night lights** | Case page map (F22) | Pins glow like city lights; active pin has a slow orange pulse ring; district labels fade up as their pins "switch on" in sequence (40 ms). | Static. |
| L10 | **Projector beam** | kinoqwertt case page hero + Lab Film mode | A faint conic/linear beam from top-left with drifting dust (24 particles, CSS only), opacity .35, parallax with pointer. | Off. |

**Quality bar for light:** if you turn all light effects off, the design must still look exactly like `design/*.dc.html`. Light only adds depth. Add a dev-only toggle `?light=off` to compare.

---
## 7. Choreography — every animation, page by page

Notation: **T** = triggered once (`start: 'top 82%'`), **S** = scrubbed to scroll, **P** = pinned + scrubbed, **H** = hover/pointer, **L** = on load. Numbers are targets; tune by eye in the browser, but stay inside the motion tokens. Details of each feature (visual, data, a11y) are in `PORTFOLIO_IMPLEMENTATION.md` under the F-number.

### 7.1 Global (all pages)

| Element | Type | Animation |
|---|---|---|
| Boarding-pass header | L + S | **Load:** the strip drops from y −100% (0.7 s qw.out). Logo dot stamps (qw.snap). STATUS flips in with `<SplitFlap>`. **Scroll:** hides on scroll down after 200 px (yPercent −110, 0.45 s) and shows on scroll up. Colours invert over ink sections (0.3 s). The active nav pill moves between items with **Flip** (0.5 s qw.inOut), not a jump. |
| Nav links / buttons | H | `<RollLabel>`. Primary buttons also get `<Magnetic>` and a sheen pass (L2). Focus ring is a 2 px orange outline at 3 px offset (never animated away). |
| Runway progress | S | L7. |
| Cursor | H | `<Cursor>` (§5.4). |
| Links in text | H | Underline draws left→right (`scaleX`, 0.32 s) and leaves to the right. |
| Images (all) | T | Clip-reveal `inset(0 0 100% 0)` → `inset(0)` 1 s qw.inOut, with the inner image scaling 1.08 → 1 at the same time. Lazy-load below the fold; `decoding="async"`. |
| Section headings | T | `<Reveal variant="mask">` for H2. Mono kicker labels type on (characters stagger 18 ms). |
| Departure finale (F26) | P/S | §7.5. |
| Terminal footer | T + H | §7.5. |

### 7.2 Home (`/`)

| # | Section | Animation (desktop, motion allowed) |
|---|---|---|
| 1 | **Hero** (L) | 0.00 s: header drops. 0.15 s: H1 "Websites people / love to use." lines rise from masks (yPercent 105 → 0, 0.9 s qw.out, stagger 0.1). 0.35 s: punched "q" holes pop in by distance from centre (scale 0 → 1, 12 ms stagger, qw.snap). 0.5 s: name line, lead and buttons rise 16 px. 0.6 s: preview frame scales .96 → 1 + opacity, and its shadow layer fades in (L5). Corner taglines "Built for people / who hate waiting." type on. **Total ≤ 1.3 s, no preloader.** **Scroll out (S):** preview lifts (scale 1 → 1.04, y −40) with a parallax of .9; taglines fade by 30% of the hero; L5 blob drifts. |
| 2 | What you get (T) | 4 columns: the top rule draws (scaleX) → number flips (SplitFlap, 3 chars) → text rises. Stagger 0.09. |
| 3 | Case 01 opener "Book a ___" (F17, P ≈300vh) | The word reel rolls one word per 20% (yPercent per word, qw.inOut). Background photo cross-fades with a slow push-in (scale 1.06 → 1). Thumbnail outline moves via Flip. 5-segment bar fills. L1 cabin light is on. |
| 4 | Title + 4 numbers (T) | Title: track-settle reveal. Numbers: `<Counter>` with SplitFlap flicker on the last digit. |
| 5 | Photo storm (F18, P ≈220vh) | 16 tiles fly from scattered off-panel positions toward the centre frame (x/y/rotation/scale → 0.3, opacity → 0), staggered by distance (`stagger: { each: .03, from: 'edges' }`). The centre frame scales .9 → 1 and gains its shadow. Headline fades in for the last 20%. |
| 6 | qwerttclients scroll stage (F1, P 400vh, dark renders) | The screenshot `y` follows progress inside each chapter; chapters cross-fade over 6% of progress. The rail's active item moves by Flip; the progress bar `scaleY`; callouts pop with qw.snap and leave after 15%. Frame scrollbar thumb follows. **Must feel like using the real app.** |
| 7 | Three screens (T + H) | Rise 32 px, stagger 0.12, inner scale 1.06 → 1. Hover: lift 6 px + L2 sheen, cursor shows `VIEW`. Click: lightbox (F10) opens with Flip from the thumbnail to full size (0.7 s qw.inOut); closing flips back. |
| 8 | Book-by-scrolling demo (F19, P 250vh) | Step 1: the venue card slides in from the right (x 60 → 0). Step 2: the "Fri 23" chip, then the 18:30 slot, fill blue with qw.snap (scale .92 → 1). Step 3: Confirm presses (scale .97, orange tap ring expands and fades), then the **ticket prints**: it comes out of the slot (yPercent −100 → 0 in 3 steps of 6 px "printer jerks" with `steps(3)`, then a free slide), lands with a 2° tilt (qw.snap), the stamp hits "BOOKED ✓", the dashed tear line draws, and the L2 sheen runs once. Step chips tick in sequence. |
| 9 | Decisions / how it helps (T) | Rows: the rule draws, then the text rises; the number column flips. |
| 10 | Design → Code slider (F3) | First view: hint animation 50 → 30 → 70 → 54% (1.4 s qw.inOut) with the cursor label `DRAG`. Drag with inertia: on release, the handle continues with velocity and eases to stop (`gsap.to` with velocity-based distance, 0.6 s). Keyboard support as spec. |
| 11 | Proof console (F4, T at 40%) | Lines type in one by one (40 ms per line, blinking block cursor at the end), then the summary counts up and the 4 stats count up with a stagger of 0.1. Plays once. |
| 12 | Case 02 kinoqwertt hand-over (F12 + L8) + scroll stage (F2, dark) | Lights-down radial mask from the pointer; the ink panel's corner radius 32 → 0. The F2 stage behaves like F1. L10 projector beam is faint in the background. |
| 13 | Services — "Three tickets · one trip" (F13 deck, P 250vh) | 0–40%: three face-down tickets fan out (x/rotation from a stack, qw.out). 40–100%: each flips (`rotateY 180`, preserve-3d), and as it lands face-up the **stub tears**: the dashed line draws, the stub drops 6 px and rotates 3°, and the "INCLUDED" stamp hits (qw.snap + orange flash). L2 sheen per card. Hover: lift 10 px, straighten to 0°, tilt-to-pointer ≤ 6°. |
| 14 | Pricing (T + H) | Cards rise with stagger. The middle card (Full journey) gets a slow orange border glow pulse (opacity only). Hover: lift + sheen. |
| 15 | About / process / stack (T + S) | Portrait parallax −40 px; process steps reveal with rule draw; stack chips flip in like board letters. |
| 16 | FAQ (T + click) | Rows reveal; the accordion height animates via GSAP `height: 'auto'` (0.4 s qw.inOut) — the only place a height tween is allowed, and it is contained. "+" rotates 45°. |
| 17 | Contact + Departure finale (F26) | §7.5 with the Home copy. |
| 18 | Footer | §7.5. |

### 7.3 `/work/qwerttclients` (dark app visuals everywhere)

| # | Section | Animation |
|---|---|---|
| 0 | Page enter | §7.6 transition. The seat tag "← Work · Row 01 · Seat qwerttclients" slides in from the left (qw.snap) with L2 sheen and stays fixed bottom-left. |
| 1b | **Boarding flight (F27)** | New section between the board and the chat: a small preview flies into a big landing mat with the night-mode screen recording. Spec: `handoff/TASK_F27_BOARDING_FLIGHT.md`. |
| 1 | Split-flap bookings board (F20) | **L:** every tile flips through random glyphs before landing (column stagger 25 ms, total ≤ 1.6 s) with L3 flicker. **S:** every ~120 px of scroll the board advances one row (top row flips out, a new row flips in from a list of ~10 real rows). Giant title: track-settle. |
| 2 | Chat before/after | The sticky chapter rail (F21) appears with the rule draw; the active chapter follows the section in view (Flip on the marker). Left: DM bubbles appear one by one (scrubbed), with "Seen" ticks and missed-call rows shaking once (x ±3, 0.3 s). Right: the dark app card snaps in with "Confirmed in 4 seconds", which counts 0 → 4 s. |
| 3 | Real map (F22) | Pins drop by district (y −30 → 0, qw.snap, 40 ms stagger) and switch on like night lights (L9). The popover cycles through 3 venues every 2.5 s while in view (Flip between pins). Roads draw with `stroke-dashoffset`. |
| 4 | Five ways to book | Cards rise with alternating offsets (0 / 28 px) and keep a slight differential parallax (±20 px). Each flow screenshot clip-reveals after its card. |
| 5 | Design system (app tokens) | Swatches fill left→right (scaleX from 0, stagger 0.04). Live components fade up. Slot states demo cycles available → selected → 1 left → taken every 1.6 s. |
| 6 | Languages & themes (F23) | Diagonal wipe 20 → 80% (S, clip-path polygon) between night and day. The UZ / RU / RU-night cards fan out one by one. EN/RU/UZ + Day/Night pills update as the wipe crosses them. |
| 7 | Under the hood | Architecture arrows draw in sequence; the 6 capability tiles flip like tickets; the console types (F4 rules). |
| 8 | Horizontal strip (F24, P ~200vh) | Vertical scroll → `x` of the row (`scrub: 1`). The centre card scales to 1, others .92 and dimmed to 70%. The counter "03 / 08" flips with SplitFlap. Velocity skew: cards skew ≤ 4° with scroll velocity, then relax (clamped `quickTo`). |
| 9 | Result + CTA "Need bookings, not calls?" | The headline track-settles. The 180 px "Let's talk →" circle is `<Magnetic max 12>`; its arrow loops a 6 px nudge every 2 s. |
| 10 | Next departures | Rows slide from alternating sides. Image windows open from the centre (F26 window animation). Status chips BOARDING / GATE OPEN blink once like a board update (L3). Hover: text turns orange, image scale 1.05, cursor `BOARD →`. |
| 11 | Finale + footer | §7.5 with the qwerttclients copy. |

### 7.4 `/work/kinoqwertt` (ink page)

| # | Section | Animation |
|---|---|---|
| 0 | Page enter | §7.6. Seat tag "Row 02 · Seat kinoqwertt". |
| 0b | **Boarding flight (F27)** | The hero preview flies down into its landing mat, growing and tilting in mid-air; inside, a real screen recording plays. Full spec: `handoff/TASK_F27_BOARDING_FLIGHT.md`. |
| 1 | Hero | The title rises per line through the mask; the tagline words appear one per line (stagger 0.12). The intro media opens like a **cinema curtain** (clip-path `inset(0 50%)` → `inset(0)`, 1.1 s qw.inOut) with L10 projector beam and dust. The "View site ↗" pill marquee runs (pauses on hover/focus). |
| 2 | Media panels 01–06 + sticky credits | Panels clip-reveal with the inner image `object-position` drifting 0 → 6% (S) — the screenshot feels like it scrolls. Credits column sticky (`top: 96px`); each credit row lights up (opacity .45 → 1) when its paired panel is centred. The CSS excerpt lines fade in top→bottom; the "Fixed along the way" list ticks in. |
| 3 | Next departures (paper) | As §7.3 #10. |
| 4 | Finale + footer | §7.5 with the kinoqwertt copy (windows: posters, then backdrops). |
| — | Caption | Keep "Unofficial redesign concept. Film titles and posters belong to their owners." |

### 7.5 Departure finale + Terminal footer (F26) — shared, different copy per page

**Finale (P, `start: 'top 75%'`, `end: 'bottom 60%'`, `scrub: 1.2`, not pinned — it plays while crossing the viewport):**

| Progress | What happens |
|---|---|
| 0–0.15 | "● Final call · Destination ___" — the orange dot starts its L3 pulse; the destination word **flips** (`<SplitFlap>`) through 5 page-specific words and settles on the last at 0.15. |
| 0.05–0.55 | The 4 headline lines slide from alternating sides (line 1 from −140 px, 2 from +160, 3 from −140, 4 from +160, opacity .25 → 1). Stagger by 0.08 of progress. The L4 spotlight follows the line currently moving. |
| 0.2–0.6 | Each image window opens from the centre (`clip-path: inset(0 50% 0 50% round 12px)` → `inset(0 0 0 0 round 12px)`), rotates 0 → ±3°, rim light and bloom fade in. |
| after open | Windows **cycle through 3 real images every 2.6 s** on a time loop (not scroll): the current image fades out while the next one fades in with a slow Ken Burns (scale 1.12 → 1, y 0 → −4%). An orange mono tag sits in the corner. The loop runs only while the finale is in view (ScrollTrigger `toggleActions` / `onToggle` pause). |
| 0.5–0.75 | The arrow draws (`stroke-dashoffset` 240 → 0) and then idles with a 6 px nudge every 2 s. |
| hover | The whole block is one `<a>` to Connect. Windows scale 1.05 and straighten to 0°; the arrow moves +14 px (`<Magnetic>`); the cursor shows `BOARD →`. |
| leave | Reversing the scroll reverses everything smoothly (scrub). Nothing pops. |

**Ticker strip:** `<Marquee>` of page-specific facts with orange holes; velocity-reactive; pauses on hover/focus.

**Terminal footer:**

- **Columns:** the "Terminal map" and "Channels" columns fade up (stagger 0.06).
- **Boarding-pass deck:** 3 real screens. Every 3.2 s **while in view**, the top card flies off to the right (x +260, y −40, rotate 14°, 0.5 s qw.inOut). It drops behind the stack (z-index swap at the midpoint), and the stack settles (qw.snap).
  - Click / Enter deals the next card immediately.
  - Hover pauses the auto-deal and tilts the top card to the pointer with L2 sheen.
  - `aria-live="polite"` announces the caption.
- **Giant ticket wordmark "QWERTT":**
  - When the wordmark is 60% in view, the letters rise one by one (yPercent 60 → 0, 70 ms stagger, qw.out).
  - Then the L6 light sweep runs once.
  - The perforation holes pop in left→right (8 ms stagger).
  - The dashed tear line draws.
  - "Back to top ↑" is a `<Magnetic>` link; `lenis.scrollTo(0, { duration: 1.6 })`.
- **End of page:** the footer must be **fully visible and finished** when the visitor reaches the very end of the page. Nothing may still be waiting to animate there.

### 7.6 Page transitions (new — "gate change")

Between Home ↔ case pages ↔ Lab:

1. **Leave (0.5 s):** an ink panel with a **perforated top edge** (CSS radial-gradient holes) slides up from the bottom (yPercent 100 → 0, qw.inOut). On it, a mono line flips with `<SplitFlap>`, e.g. `NOW BOARDING · ROW 01 · QWERTTCLIENTS`.
2. **Swap:** change the route, scroll to top (`lenis.scrollTo(0, { immediate: true })`), and `ScrollTrigger.refresh()` after the new page's fonts/images are ready.
3. **Enter (0.6 s):** the panel continues upward (yPercent 0 → −100). The new page's hero load sequence starts at 0.2 s into this phase.

**Implementation:**

- Use the View Transitions API (`document.startViewTransition`) where supported, with a GSAP overlay fallback.
- Back/forward navigation restores the previous scroll position on Home. When returning, skip the overlay and do a quick 0.25 s fade.
- Reduced motion: 150 ms cross-fade only.

### 7.7 Lab (`/lab`) and Connect

- **Lab mode switch:**
  - The old mode cleans up completely (kill tweens, observers, physics world).
  - The stage cross-fades .3 s while its elements **Flip** from their old layout to the new one.
  - The mode label flips with `<SplitFlap>`.
  - Switch cards: `aria-pressed` toggles with a stamp animation on the active card.
  - All 10 modes behave as specified in spec **F25**. Make each one feel **premium**: physics at 60 fps, a lerped flashlight (0.15), a magnet with springs, 2 s glitch bursts with `steps()`, and live speed-test numbers only.
  - **Film mode:**
    - TMDB goes through the proxy. If the key is missing, use `assets/lab/` fallback films and say "offline demo" in mono.
    - Search results stagger in.
    - The 2.5D scene is driven by pointer + scroll (`quickTo`, 0.6 s): backdrop −20 px, dust −8 px, poster +14 px, title +22 px.
- **Connect drawer:**
  - **Open:** slides from the right (xPercent 100 → 0, 0.75 s qw.inOut); the page behind dims to 62% ink and scales .985.
  - **Contents:** stagger in (0.05).
  - **Copy email:** stamps "Copied ✓".
  - **Close:** Esc, outside click or Close reverses the opening in 0.5 s.
  - **Scroll and focus:** focus trap and `lenis.stop()` while open.
  - **Form honesty:** never fake a "sent" state.

---

## 8. Verification gates (all must pass — fix and re-run until they do)

1. **Build health:** `lint`, `typecheck`, `test`, `build` pass with 0 errors; 0 console errors/warnings on every route.
2. **Visual match:** a Playwright full-page screenshot of each route at 1440×900 is compared to the design screenshots from Step A, section by section. Spacing, type, colours and copy match. Diffs are listed and fixed. Also check 1280×800 and 1920×1080 (no overflow, no clipped text).
3. **Smoothness (measured, not guessed):** `tests/perf/scroll.spec.ts` must:
   - drive slow and fast wheel scrolls through each route with a CDP performance trace (`tracing.start`);
   - sample rAF frame times in-page.
   - **Pass criteria (Chromium, no CPU throttle):**
     - p95 frame time ≤ 18 ms and no frame > 50 ms during scroll;
     - 0 long tasks > 50 ms during scroll;
     - CLS < 0.02;
     - 4× CPU-throttled run: p95 ≤ 34 ms.
   - Save traces in `reports/perf/`.
4. **Motion correctness (video review):** record Playwright videos (`recordVideo`, 1440×900) of each route scrolled slowly, then fast, then back up. Watch them (extract frames with ffmpeg every 100 ms into `reports/frames/` and look at them). Check:
   - no element jumps, flickers or pops;
   - pinned sections pin and release without a jump;
   - scrubbed timelines reverse cleanly;
   - triggered reveals don't replay;
   - nothing stays hidden;
   - the footer is complete at the end of the page.
5. **Storyboard check:** screenshot F1/F2/F13/F17/F18/F19/F24 and the finale at progress 0 / .35 / .7 / 1 (scroll to computed positions) and compare with the storyboards in `System.dc.html`.
6. **Light check:**
   - Render with `?light=off` and with light on: the layout is identical, only depth differs.
   - Text contrast stays AA with light on (axe + manual sample of 10 text points under L1 / L4).
7. **Reduced motion:** `page.emulateMedia({ reducedMotion: 'reduce' })` on every route:
   - no pin, no scrub, no parallax, no Lenis, no cursor light;
   - everything is readable;
   - screenshots saved.
8. **Accessibility:**
   - `@axe-core/playwright` reports 0 serious/critical issues.
   - A keyboard-only run through every route and the drawer passes: visible focus, logical order, no traps, Esc works, the slider works with arrow keys.
   - JS disabled: all content is visible.
9. **Cross-browser:** run the visual + motion specs in Chromium, Firefox and WebKit. Fix WebKit-specific issues — sticky inside transforms, `clip-path` with `round`, `backface-visibility`.
10. **Performance budget:**
    - Lighthouse desktop on Home and one case page: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95.
    - Initial JS ≤ 180 KB gzip. Lab modes and Matter.js are lazy.
    - LCP ≤ 2.0 s on preview build.
11. **Real-site cross-check:**
    - Re-open the live kinoqwertt and 2 references side by side with your local build in the browser.
    - Write 5 bullets in the report on where your motion now feels **equal or better** and what you tuned to get there.

---

## 9. Final report (`REPORT.md`) and hand-back

- **Changes:** what was built, file map, stack and why.
- **Research:** `research/NOTES.md` summary (what was adapted, what was avoided).
- **Verification:**
  - feature table F1–F26 + L1–L10 + page transitions: status, how it was verified, screenshot/video path;
  - perf numbers (p95 frame time, long tasks, CLS, LCP, Lighthouse) before and after tuning;
  - known limitations — for example, TMDB is offline without a key.
- **Hand-over notes:**
  - placeholders left for the owner (from `src/content/site.ts`);
  - how to run: `npm i`, `npm run dev`, `npm run test:visual`, `npm run test:perf`;
  - the one question for the owner: *"Everything is verified locally. Do you want me to deploy (e.g. Vercel) and push? I will not do it without your yes."*

**Never claim that something works unless you ran it and saw it working in the browser.**

---

## 10. Definition of done

- [ ] All 4 routes + the Connect drawer are built and match the design at 1440 px.
- [ ] qwerttclients visuals are dark everywhere (except the two intentional light layers).
- [ ] Every animation in §7 is implemented, smooth (gate 3), and correct in video review (gate 4).
- [ ] The light system L1–L10 is implemented, cheap, AA-safe, and switchable with `?light=off`.
- [ ] Page transitions work, including back/forward.
- [ ] The finale + terminal footer are on every page, and the footer is complete at the end of each page.
- [ ] Reduced motion, keyboard, no-JS and touch paths all work.
- [ ] All verification gates pass in Chromium; Firefox/WebKit issues are fixed or documented.
- [ ] There are no secrets, nothing was published or pushed, and `REPORT.md` is written.
