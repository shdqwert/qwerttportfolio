# IMPLEMENTATION_REPORT.md — qwerttportfolio

Built from `PORTFOLIO_IMPLEMENTATION.md` + `portfolio-handoff/` (design `Main.dc.html`, `Connect.dc.html`, `System.dc.html`, 11 screenshots). Date: 2026-10-23.

## 1. Audit summary

| Item | Finding |
|---|---|
| Repository | `C:\Users\SUYUNOV\portfolio project`. It was **empty** before this session; a fresh Vite + React scaffold was created in it (owner-approved) right before implementation. No prior features to preserve. Git was not initialised — initialised it and committed per phase. |
| Stack | React 19.3 · Vite 8.3 · `@vitejs/plugin-react` 6 · JavaScript (no TypeScript) · npm (`package-lock.json`). |
| Scripts | `dev`, `build`, `lint` (oxlint), `preview`. No `test`/`typecheck` scripts exist. |
| Styling | Plain CSS (no Tailwind / CSS-in-JS). Tokens in `src/styles/tokens.css`, everything else in `src/styles/site.css`. |
| Animation libs | None installed before; none added (see §3). |
| Backend | None. No env vars were required before. |
| Other folders | `qwerttclients`, `kinoqwertt` were **not touched**. |

## 2. Design mapping

| Design part | Component | Status |
|---|---|---|
| Header, nav, progress line | `SiteHeader.jsx` | new · done |
| Hero (+ pixel q, browser preview, taglines) | `Hero.jsx`, `PixelMark.jsx`, `BrowserFrame.jsx` | new · done |
| What you get | `Sections.jsx → ValueColumns` | new · done |
| Case template (both cases) | `CaseStudy.jsx` (+ `NumberedList`) | new · done |
| Scroll stage F1/F2 | `ScrollStage.jsx` | new · done |
| Screens + lightbox | `ScreenGallery.jsx` | new · done |
| How it helps / CSS excerpt asides | `Sections.jsx → QcHelps, KinoAside` | new · done |
| Design → Code | `CompareSlider.jsx` | new · done |
| Proof console | `ProofConsole.jsx` | new · done |
| Ink hand-over (Case 02, Contact) | `InkSection.jsx` | new · done |
| Services + pricing | `Sections.jsx → Services, PricingCards` | new · done |
| About + process + stack | `Sections.jsx → About` | new · done |
| FAQ | `Sections.jsx → Faq, FaqList` | new · done |
| Contact, footer, live clock, copy email | `Sections.jsx → Contact, Footer`, `Common.jsx → LiveClock, CopyEmail` | new · done |
| Connect drawer + brief form | `ConnectDrawer.jsx`, `ConnectContext.jsx` | new · done |
| Motion helpers | `src/lib/motion.js` (scroll loop, `useReveal`, `useScrollProgress`, `useCountUp`, media queries), `src/lib/dialog.js` | new · done |
| All copy / data / placeholders | `src/content/portfolio.js` | new · done |

Assets: all 11 screenshots copied to `public/work/`. Fonts: Inter Tight + JetBrains Mono from Google Fonts (`display=swap`, preconnect). Unused design fonts (Inter, Bebas Neue) were not loaded.

## 3. Animation approach

**No animation library.** One shared passive `scroll`/`resize` listener drives a single `requestAnimationFrame` loop (`onScrollFrame`), IntersectionObserver handles viewport reveals, and CSS transitions/keyframes do the motion. Only `transform`, `opacity`, `clip-path`, `scale`/`translate` animate (exceptions: one-time `letter-spacing` on the two case titles, as specified; `grid-template-rows` for accordion height).

Why: every effect in §7/§8 is either a class toggle on viewport entry or a value read from scroll position; neither needs Motion or GSAP, so the smallest set (§3.2/§9) is zero dependencies. Sticky stages use native `position: sticky` — no scroll hijacking, no `preventDefault` on wheel/touch, no snapping. Lenis was **not** added (native scroll felt right and §8.3 makes it optional).

Dependencies added: none at runtime. Build-time: none (the prerender uses Vite's own SSR build).

**Prerendering:** `npm run build` also builds `src/entry-server.jsx` for SSR and `scripts/prerender.js` writes the rendered page into `dist/index.html`; the client hydrates it. Content therefore exists in the HTML before JS (F8 requirement, no-JS support).

## 4. Feature documentation

### F1 — Scroll stage: qwerttclients
- What the visitor sees: a pinned panel with a browser frame; scrolling the page scrolls the real product inside the frame, chapter rail on the right follows, callout "Free times on every card — no dead ends" appears around 30–45%.
- How it works: wrapper `400vh`, inner `.stage` `position: sticky; top: max(24px, 50vh − 410px)`. Progress `p = (stickyTop − rect.top) / (trackHeight − stageHeight)`. 5 chapters × 0.2. Chapters sharing a screenshot are merged into one segment that scrolls continuously (`translate3d(0, −(imgH − viewH)·segP, 0)`); segment images cross-fade (260 ms opacity). Rail bar `scaleX(local)`, scrollbar thumb `translateY(p·room)`, callout opacity by progress window.
- Trigger: scroll progress.
- Implemented in: `ScrollStage.jsx`, data in `portfolio.js → projects[0].stage`.
- Depends on: frontend only; screenshots `qwerttclients-home/place-amber/booking-barber/business.jpg`.
- In the design vs. added: layout designed; all movement added in code.
- Reduced motion: no sticky; five framed screenshots in a grid with chapter captions (also used below 1024 px).
- How to test: scroll slowly through Case 01; Tab past it; click "Work"/"Services" nav.
- Verified? **Yes** — screenshots at p = 0 / 0.35 / 0.7 / 1 (1440×900), reduced-motion screenshot, anchor jump test.
- Limitations: none known.

### F2 — Scroll stage: kinoqwertt (dark)
- Same component, `dark` variant (panel `#1A1917`, frame `#0C0C0C`). Chapters 1–3 scroll the long home screenshot, 4 → Dune title page, 5 → Top 250. Callout "Rails animate in with GSAP as you scroll" at 22–37%.
- Verified? **Yes** — screenshots at 0.3 / 0.7.

### F3 — Design → Code slider
- What the visitor sees: design canvas clipped over the live build, white divider and black handle.
- How it works: `clip-path: inset(0 calc(100% − var(--pos)) 0 0)` on the design layer; Pointer Events with pointer capture (mouse + touch, `touch-action: pan-y` keeps vertical scrolling); click jumps. Frame reserves height with `aspect-ratio: 1200/550`.
- Trigger: pointer drag / click / keys; one-time hint on 50% visibility.
- Implemented in: `CompareSlider.jsx`.
- Accessibility: handle `role="slider"`, `aria-valuemin/max/now/valuetext`, ← → ↑ ↓ ±5 %, Home/End.
- Deviation: hint runs **54 → 30 → 70 → 54** instead of 50 → 30 → 70 → 54, so it starts from the resting position without a jump.
- Reduced motion: no hint; slider works.
- Verified? **Yes** — keyboard Home + 6×→ gives `aria-valuenow=30` (screenshot), hint observed at 2.2 s screenshot.
- Limitations: touch drag not tested on a physical device.

### F4 — Proof console
- What the visitor sees: `npm test` output typing in line by line, then `tests 23 · pass 23` and the four stats count up.
- How it works: all lines are in the DOM (prerendered); when armed (JS, below fold) lines get `visibility: hidden`; at ≥40 % visible each line becomes visible with `calc(i·40ms)` delay and the ✔ flashes; numbers use `useCountUp`. Runs once (observer disconnects).
- Implemented in: `ProofConsole.jsx`; data `portfolio.js → proof`.
- Reduced motion: everything shown immediately; no blinking cursor.
- Verified? **Yes** — screenshot after trigger; no-JS HTML contains all lines.

### F5 — Living "q"
- What the visitor sees: hero q draws cell by cell on load; cells push away from the mouse (≤ 18 px within 80 px) and spring back; case/contact marks morph q → ticket → film → @ when they enter view.
- How it works: `PixelMark.jsx` renders 49 grid cells; draw = CSS keyframes (`scale` + opacity, 12 ms stagger); repel = rAF-throttled pointermove writing the `translate` property (pointer type `mouse` only); morph = cells start in the previous bitmap and transition opacity/scale with `i·10ms` delay over 600 ms.
- Implemented in: `PixelMark.jsx`, bitmaps `portfolio.js → marks`.
- Reduced motion: static final shapes, no cursor reaction.
- Verified? **Yes** for shapes (cell-by-cell DOM check of the hero q against its bitmap) and morph end states (screenshots). Cursor repel verified by code only (headless run had no pointer movement).
- Limitations: per-section morph only; the single travelling mark [SUGGESTION] was not built.

### F6 — Connect drawer
- What the visitor sees: right drawer (700 px, 16 px inset, radius 24) over a dimmed page; tabs Contact / Pricing / FAQ; ink email card with copy button and live Tashkent time; brief form.
- How it works: open state follows `#connect` (pushState); Back, Esc, outside click and Close all close it. Focus moves into the drawer, is trapped, and returns to the trigger. Background scroll locked with scrollbar-width compensation. Slide-in 700 ms, out 350 ms.
- Form: name + email validated, honeypot field. If `VITE_FORM_ENDPOINT` is set → JSON POST, "Sending…", success only on 2xx, error message otherwise (input kept). If not set (current state) → button reads **"Send brief via email app →"** and opens a pre-filled `mailto:` — never claims "sent".
- Implemented in: `ConnectDrawer.jsx`, `ConnectContext.jsx`, `lib/dialog.js`.
- Verified? **Yes** — open from "Start a project" (hash `#connect`, focus on first tab), validation errors shown on empty submit, Esc closes (hash cleared, focus back on "Start a project"), deep link `/#connect` opens it.
- Limitations: no real endpoint configured (see §6).

### F7 — Header & navigation
- Fixed header; hides after 200 px when scrolling down, shows on scroll up; turns ink with paper text over `data-theme="ink"` sections; scroll-spy pills (Work for both cases, Services, About, Connect for Contact) with `aria-current`; text-roll hover (visible label + `aria-hidden` duplicate); 2 px page-progress line (inverts over ink).
- Implemented in: `SiteHeader.jsx`.
- Deviation: header has a solid paper/ink background so text stays readable over content once fixed (at the top it looks identical to the design).
- Verified? **Yes** — scripted check of active pill + inversion at every section; screenshots.

### F8 — Hero load sequence
- Lines rise from a mask (80 ms stagger), q draws, name/lead/buttons fade up, preview scales from 0.98; total ≈ 1.2 s. Pure CSS keyframes, so it plays without JS and content is in the prerendered HTML. On scroll-out the preview scales 1 → 1.04 with ~0.1 parallax and the taglines fade within 30 % of the hero height.
- Reduced motion: no animation, no parallax.
- Verified? **Yes** (load screenshot; no-JS screenshot shows the full hero).

### F9 — Section reveals & scroll-linked details
- What you get: rule draws, then text rises (80 ms stagger) · case titles: tracking +4 % → final while rising 24 px · facts row by row · cards: clip-path reveal from bottom (100 ms stagger) · screens rise 32 px with inner image 1.06 → 1 · numbered rows: rule then text · code excerpt lines fade top→bottom · Services H2 words scrub 20 % → 100 % opacity (fully opaque when off-screen and at the end) · pricing rises · About portrait parallax −40 px · process steps rule-draw · FAQ rows rise · Contact: lines rise from mask, email underline draws · footer columns fade up.
- How it works: `useReveal` only hides an element (`.rv`) when JS runs **and** it is below the fold; otherwise content stays visible.
- Verified? **Yes** — full scroll-through screenshots; reduced-motion run shows everything.

### F10 — Screens hover + lightbox
- Hover lift 6 px with "View screen" chip; click opens a lightbox with the full-length screenshot in a scrollable frame; ← → move between the three, Esc / Close / backdrop close; focus trapped and restored.
- Implemented in: `ScreenGallery.jsx`.
- Verified? **Yes** (screenshot of open lightbox; Esc tested).

### F11 — FAQ accordion
- Buttons with `aria-expanded`/`aria-controls`, one open at a time, first open by default, 350 ms height animation via `grid-template-rows`; closed answers are `inert`. Answers 2–5 are `[ANSWER]` placeholders. Reused in the drawer.
- Verified? **Yes** (keyboard tab order + screenshots).

### F12 — Paper ↔ ink hand-over
- Case 02 and Contact enter as an inset panel (32 px side inset, 32 px radius) that opens to full bleed as the section top travels from the viewport bottom to mid-screen (`clip-path: inset(0 var(--inset) round var(--inset))`). Text colour belongs to the section, so contrast never drops.
- Implemented in: `InkSection.jsx`.
- Reduced motion: no clip animation.
- Verified? **Yes** (screenshot mid-transition shows the rounded inset).

### Extras added
- Unsplash credit under Case 01 screens; "Unofficial redesign concept — not affiliated with IMDb" under Case 02 screens.
- Skip link, `robots.txt`, meta description, `theme-color`, image preload for the hero.

## 5. Testing results

| Check | Result |
|---|---|
| `npm run lint` (oxlint) | 0 warnings, 0 errors |
| `npm run build` | passes; JS 275 KB (85.8 KB gzip), CSS 36.9 KB (8.0 KB gzip); prerender OK |
| `test` / `typecheck` | no such scripts in the project |
| Console (prod build, full scroll, drawer, lightbox, slider) | no errors, no warnings, no failed requests |
| Horizontal overflow at 1920 / 1440 / 1280 / 1024 / 820 px | 0 px |
| Keyboard-only pass | all interactive elements reachable in logical order; drawer/lightbox trap and restore focus |
| No-JS | prerendered HTML contains every section (8 `<section>`s, hero h1) |
| Reduced motion (`reducedMotion: 'reduce'`) | no sticky stages (static grids), no transforms; page height 12.6k px vs 18.4k with stages |
| **Lighthouse 12.8 (desktop, prod build)** | **Performance 91 · Accessibility 100 · Best Practices 100 · SEO 100** · LCP 1.4 s · CLS 0.001 · TBT 0 ms |

Browser: Google Chrome (headless, via playwright-core) on Windows 11. Claude-in-Chrome extension was not connected, so automation used the locally installed Chrome. Firefox/Safari not tested.
Screenshots (1440×900 unless noted): `…\scratchpad\qa\shots1\` — hero, every section, stages at 0/0.35/0.7/1, slider at 30 %, drawer, drawer validation, lightbox, 1280 and 820 px hero, reduced-motion stage, no-JS hero.

## 6. Known gaps & next steps for the owner

1. **Placeholders** — fill in `src/content/portfolio.js`: name, email, Telegram, LinkedIn, Instagram, city, experience, languages, availability, reply time, support days, bio, portrait, prices, durations, budgets, FAQ answers 2–5, Imprint/Privacy URLs. Unknown links render as visible dotted-underline text, never as dead links.
2. **Form delivery** — set `VITE_FORM_ENDPOINT` (e.g. a Formspree form URL) in `.env` to send briefs directly; until then the form opens the visitor's email app.
3. **qwerttclients live URL** — set `links.qwerttclientsCase`; the "Read the full case →" button shows `[case URL]` until then.
4. **"Open all 38 screens ↗"** links to the private design artifact `claude.ai/artifact/JXSTpeT2…` — share it publicly or replace the link, otherwise visitors can't open it.
5. **Portrait** — replace the placeholder block in About with a real 4:5 photo.
6. **Images** — screenshots ship as the original JPEGs (no image pipeline in the project). Lighthouse estimates ~260 KB savings from WebP/AVIF + responsive sizes; converting them is the next performance step.
7. **Fonts** — Google Fonts CSS is render-blocking (~0.9 s on the Lighthouse throttled profile); self-hosting the two families would remove it.
8. **RU version** — the RU switch is shown as in the design but is non-interactive ("coming soon"); no Russian copy exists yet.
9. Mobile layout below 1024 px is a readable stacked fallback, not a designed mobile version (per §11.5).

## 7. How to run / edit

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build + prerender → dist/
npm run preview   # serve dist/ at http://localhost:4173
npm run lint
```

Content: `src/content/portfolio.js` (all copy, projects, chapters, test lines, links, placeholders). Tokens: `src/styles/tokens.css`. Screenshots: `public/work/`.
