# PORTFOLIO_IMPLEMENTATION.md

> **Audience:** Cursor Terminal / Claude Code (coding agent).
> **Mode:** EXECUTE. You are expected to inspect the existing repository, implement the approved design, test it, review it visually, fix what you find, and report. Do **not** stop after writing a plan. Do **not** hand the work back as advice.
> **Owner:** `[Your Name]` (handle: qwertt). Portfolio brand / project name: **qwerttportfolio**.

---

## 0. How to use this document

1. Read this whole file once before touching code.
2. Open the handoff package that ships with this file (`portfolio-handoff/`, see §4). It contains the approved design source (`design/*.dc.html`) and every real screenshot the design uses (`assets/`).
3. Follow the phases in §13 in order. Each phase has acceptance criteria — meet them before moving on.
4. When something is ambiguous, prefer (in this order): **the approved design files → this document → the reference sites → your own judgement.** Make ordinary technical decisions yourself; do not stop to ask.
5. If a real blocker appears (missing credential, unreachable service, no browser available), write down the exact limitation, skip only that part, and continue with everything else.

---

## 0.1 v3 — Own identity + dark qwerttclients (SUPERSEDES older notes below)

The owner judged v2 too close to the primary reference. v3 gives the portfolio its **own identity** and switches every qwerttclients visual to the app's **night theme**. Where any older line in this file conflicts with this section, **this section wins** (old colour names like "pink", "pixel", "Inter Tight", `#FF47E7`, `#F9F4EC`, `#0A0A0A` are historical).

**Execution prompt:** `CURSOR_PROMPT.md` (ships next to this file) is the master order for the coding agent. It fixes the stack (Vite + React 19 + TS + GSAP/ScrollTrigger + Lenis), the full motion choreography, the light system (L1–L10), page transitions, permissions and verification gates. Where it is more specific than §8–§9 or §13 here, it wins.

**Concept — "every project is a trip":** a travel ticket / boarding pass / departure board.

| Element | Spec |
|---|---|
| Palette | paper `#ECE8DF`, paper-2 `#DEDAD0`, ink `#111110`, accent **signal orange `#FF4F1F`** (stamps, active state, arrows, focus ring — never body text) |
| Fonts | **Barlow Condensed** 500/600/700 for display (≥36 px and h1–h3, letter-spacing −0.01em); **IBM Plex Sans** 400–700 for body; **JetBrains Mono** 400/500 for labels, times, gates, codes |
| Mark | the 7×7 "q" is made of **round punched holes** (`border-radius: 50%` cells), like a ticket validator |
| Header | **boarding-pass strip**: dark bar with semicircle side notches, logo "QWERTT" + orange dot, nav (active item = orange pill), right side mono `GATE GMT+5 · STATUS BOARDING [Q1 2027] · EN RU` |
| Services | label "Three tickets · one trip"; each card ends with a **ticket stub**: dashed tear line + notches + mono "Admit one · 0X" + INCLUDED stamp ("torn & stamped" on hover/scroll) |
| Pricing | Express / Full journey / **Code only** |
| Contact finale | mono "Next ● departure"; lines "Let's make / your next / launch [shot] lands / unforgettable →" |
| Case pages | fixed **seat tag** instead of breadcrumb: `← Work` (ink, dashed right edge) + `Row 01 · Seat qwerttclients` (orange); "More work" is **"Next departures"** and every row carries a status chip: kino row `BOARDING`, open slot `GATE OPEN` (orange) |
| Footer | "Built & stamped by [Your Name]" |

**qwerttclients = dark everywhere.** Use the app's own night tokens for any rebuilt UI (booking demo, chat "after" card, map popover, flow cards, system section): ink `#DEE4EA`, ink-2 `#B6C2CF`, ink-3 `#8C9BAB`, bg `#161A1D`, surface `#1D2125`, surface-2 `#22272B`, line `#2C333A`, line-strong `#454F59`, accent `#579DFF` (hover `#85B8FF`, press `#CCE0FF`, tint `#1C2B41`), success `#4BCE97`/`#164B35`, warn `#E2B203`/`#533F04`, danger `#F87168`/`#5D1F1A`, on-accent `#1D2125`. All qwerttclients screenshots are the **night renders** in `assets/dark/` (home, search, place, business, booking, 4 flow screens, home-top for the slider). Exceptions: the Design→Code slider keeps the light *design* layer on the left, and the Languages section keeps one day render on the "day" side of the wipe.

---

## 1. Project goal and context

`[Your Name]` is a web designer and frontend / full-stack developer based in Uzbekistan (GMT+5, remote worldwide). This portfolio exists to **win real clients and paid web projects**. A visitor must understand within seconds:

1. Who the owner is.
2. What websites and digital products they build.
3. The quality of their work (shown, not claimed).
4. Which services they offer.
5. How to contact them.

The visual design has already been designed and approved in a design canvas (Claude Design, artifact "qwerttportfolio"). Your job is to turn that **approved, desktop-first design** into a **working, polished, scroll-driven website** inside the owner's **existing** project.

### 1.1 What this document is (and is not)

- It **extends** the original design brief (summarised in Appendix A). It does **not** replace it. Every requirement in Appendix A still applies.
- It is grounded in the actual design files and in real facts about the two showcased projects (see §6). Anything that is a suggestion rather than a confirmed decision is labelled **[SUGGESTION]**. Anything not verified is labelled **[UNVERIFIED]**.

---

## 2. Non‑negotiable rules

1. **Preserve the approved design.** Same composition, colours, typography, proportions, copy, section order, project presentation and creative features. Do not swap in a template, a UI kit look, or a "cleaner" redesign.
2. **Work in the existing repository.** Do not create a second app next to it. Do not delete or rewrite unrelated files, configs or features. Preserve the existing architecture unless there is a concrete technical reason (write the reason in the final report).
3. **Do not assume the stack.** Do not assume React, Next.js, Vite, Tailwind or anything else until you have read the actual files (§10).
4. **Scroll must stay under the user's control.** No wheel hijacking, no forced full-screen snapping, no disabled native scrolling, no traps. Sticky/pinned sections are allowed only as described in §8.3.
5. **No fake functionality.** A form must never say "sent" unless a request actually succeeded. A link must never point to `#` in the final build unless it is an explicit placeholder listed in §12.
6. **No invented facts.** Do not add clients, testimonials, awards, prices, years of experience or metrics that are not in the design. Keep the bracketed placeholders (e.g. `[Your Name]`, `[PRICE]`) exactly as placeholders, and centralise them so the owner can edit them in one place (§11.4).
7. **No secrets in the repo.** Do not commit API keys, passwords, tokens or demo credentials.
8. **Respect `prefers-reduced-motion`.** Every motion feature must have a reduced-motion behaviour (specified per feature in §7).

---

## 3. References

### 3.1 Design references (quality and behaviour benchmarks — do NOT copy them)

| Role | URL | Use it for |
|---|---|---|
| **PRIMARY** | https://www.eduardbodak.com/ | Overall feel: warm paper `#F9F4EC` handing over to black ink, ultra-tight bold grotesk, small text-pill navigation, pixel glyph as signature, corner taglines in the hero, service trio, pricing cards, "Connect" drawer with copy-to-clipboard email and local time, dark ending with Sitemap / Channels footer. |
| Additional | https://lusion.co/about | Big confident titles, generous spacing between sections, mono labels for metadata, scroll cues, depth through layered previews. |
| Additional | https://uncommondesign.group/ | Each case leads with one large screen, then supporting screens; short declarative copy. |
| Additional | https://matvoyce.tv/ | Rhythm of one huge line of type against small mono captions. |
| Additional | https://minhpham.design/ | Facts and process shown as clean rows / timelines instead of claims. |

Open them in a browser if you can to understand pacing and motion quality. **The approved design always wins over the references.** Never copy their code, assets, glyphs or copy.

### 3.2 Official technical documentation (consult before choosing an approach)

- Motion — scroll-triggered and scroll-linked animations: https://motion.dev/docs/react-scroll-animations
- Motion — smooth scrolling with Lenis: https://motion.dev/docs/lenis
- Lenis — official project and docs: https://lenis.dev/
- GSAP ScrollTrigger — official docs: https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- MDN — Intersection Observer API: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
- MDN — Media queries for accessibility (reduced motion): https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Media_queries/Using_for_accessibility

**Do not install every library listed above.** Pick the smallest set that delivers the design (decision guide in §9).

---

## 4. Handoff package (ships with this file)

```
portfolio-handoff/
├── PORTFOLIO_IMPLEMENTATION.md      ← this file (also delivered separately)
├── design/
│   ├── Main.dc.html                 ← the approved home page (source of truth for layout + copy)
│   ├── Connect.dc.html              ← the Connect drawer, open state (interactive in the canvas)
│   ├── System.dc.html               ← design system, storyboards, interaction spec
│   ├── CaseQwerttclients.dc.html    ← case-study detail page (route e.g. /work/qwerttclients)
│   ├── CaseKinoqwertt.dc.html       ← case-study detail page, dark variant (route e.g. /work/kinoqwertt)
│   └── canvas.json                  ← canvas index (artboard sizes)
└── assets/                          ← real screenshots used by the design (1200 px wide JPEG)
```

### 4.1 How to read the `.dc.html` design files

They are HTML with a tiny template layer. They are **not** meant to be shipped — port them into the project's own components.

- Everything inside `<x-dc> … </x-dc>` is the page markup. **Inline `style="…"` values are the exact design values** (sizes, colours, spacing). Treat them as the spec.
- `<helmet><style>` holds the shared classes and hover states (`.btn`, `.navlink`, `.shot`, `.mono`, `.flink`, `.copy`).
- `{{name}}` is a value from the `renderVals()` method in the `<script type="text/x-dc">` block at the bottom of each file. Read that method to get repeated data (FAQ items, chapter lists, test lines, stack list, pixel-mark bitmaps).
- `<sc-for list="{{items}}" as="item">` = repeat for each item. `<sc-if value="{{x}}">` = render only if truthy.
- `data-props='{"accent":…}'` = the one design lever (accent colour, default `#FF47E7`).
- `/_blob/<id>` is a canvas-hosted image. Map it to the local file with the table below.

### 4.2 Image map (`/_blob/<id>` → file in `assets/`)

| Blob id in design | Local file | Size (px) | Used in |
|---|---|---|---|
| `85f4dbbd805f27f629f08e004818d19c` | `qwerttclients-home.jpg` | 1200×1975 | Hero preview; Case 01 scroll stage |
| `96183974a07c53423ca28af20507e0e4` | `qwerttclients-place-amber.jpg` | 1200×1924 | Case 01 screen 1 |
| `b1eb944f436e64c520a287300564c285` | `qwerttclients-booking-barber.jpg` | 1200×683 | Case 01 screen 2; System storyboard |
| `3814425218d883bcf22a7e88048b089c` | `qwerttclients-business.jpg` | 1200×817 | Case 01 screen 3 |
| `11d399288d20da6cd88955a8d57592c4` | `qwerttclients-design-top.jpg` | 1200×550 | Design → Code slider (design layer) |
| `6fb8feb5766731a6c12e3b27be5db91c` | `qwerttclients-built-top.jpg` | 1200×550 | Design → Code slider (build layer) |
| `0d6697bf58b09957dc971f42e558da30` | `kinoqwertt-home.jpg` | 1200×5211 | Case 02 scroll stage; Case 02 screen 3 |
| `b03f5eaf4414fbc1f376917a44f7405d` | `kinoqwertt-title-dune2.jpg` | 1200×5962 | Case 02 screen 1 |
| `90c4a944b9daba37af1279840ee00fd7` | `kinoqwertt-top250.jpg` | 1200×2500 | Case 02 screen 2 |
| `f15a6dc0c226bc3f87481cdcef905ae3` | `qwerttclients-intro.jpg` | 1200×750 | Case page hero media (the app's own scroll-driven intro) |
| `505fc1710ae1c8c9c7b524eeb2028e2e` | `qwerttclients-search.jpg` | 1200×1354 | Footer shuffle card; case page media 02 |

All screenshots were rendered from the **real running projects** (not drawings). Convert them to AVIF/WebP + JPEG fallback at build time if the project has an image pipeline; otherwise ship optimised JPEG/WebP. Keep the originals in the repo's asset folder (e.g. `public/work/` or the project's equivalent).

---

## 5. Approved design — section by section

Frame: **1440 px** desktop, content gutter **32 px** each side (content width 1376 px), gap 24 px, **180 px** between major sections. Root background `#F9F4EC`, text `#0A0A0A`, base font *Inter Tight*, global letter-spacing `-0.04em`. Exact copy lives in `design/Main.dc.html` — copy it from there verbatim.

| # | Section (id) | Background | What it contains (summary) |
|---|---|---|---|
| 1 | Header | paper | Left: text-pill nav `Work` (active, black pill) · `Services` · `About` · `Connect`. Right: green dot + "Booking [Q1 2027]", language `EN` / `RU`. |
| 2 | Hero `#top` | paper | Centered H1 "Websites people / love to use." (112 px, 600, −0.085em, line-height .92). Pink 7×7 pixel "q" mark (9 px cells). Name line "[Your Name] · Designer & Frontend Developer". Lead paragraph. Buttons: "See two case studies ↓" (ink) + "Start a project" (outline → opens Connect). Browser-framed preview 880×557 of `qwerttclients-home.jpg` (top-cropped). Corner taglines: bottom-left "For brands that believe / every detail matters." and bottom-right "Uzbekistan ↔ Remote worldwide". |
| 3 | What you get | paper | 4 columns with a 1.5 px top rule: 01 One person, design to code · 02 Built around your goal · 03 Fast and solid code · 04 Yours to edit. |
| 4 | Case 01 `#work` — **qwerttclients** | ink opener → paper | **"Book a ___" opener (F17)**, 168 px title + one-line lead, 4 big numbers, role/stack mono line, **Photo storm (F18)**, **Scroll stage** (F1), 3 real screens with mono captions, **Book it by scrolling + ticket (F19)**, "Decisions that make it work" (4 numbered rows) + "How it helps" (clients card, businesses ink card, CTAs "Read the full case →", "Open all 38 screens ↗"), **Design → Code slider** (F3), **Proof console** (F4). |
| 5 | Case 02 — **kinoqwertt** | **ink `#0A0A0A`** | Same template on dark: film pixel mark + title, lead, facts (role, stack, data, live URL), 3 cards (third card paper), **Scroll stage** (F2, dark), 3 real screens, "How it's engineered" (4 rows) + real CSS excerpt card + "What this shows a client" card + CTAs "Open live site ↗" → https://kinoqwertt.vercel.app, "GitHub ↗" → https://github.com/shdqwert/kinoqwertt. |
| 6 | Services `#services` | paper | Mono "Services", centered H2 "Every project includes strategy, design, development and motion." **The deck (F13):** ink panel 1376×760 with three playing cards (340×476, radius 20) fanned at −7° / 0° / 7° — Website Design · Development · Motion, each with a 7×7 pixel icon, text, 4 deliverables and an upside-down mirrored corner like a real card — plus a face-down card behind with the q-pattern back (inline SVG pattern). 3 pricing cards: One Pager (paper-2), Full Site (ink), Development (paper-2) — prices are placeholders `from [PRICE]`, durations `[3–5] weeks` etc. "Discuss" buttons open Connect. |
| 7 | About `#about` | paper | Portrait placeholder 440×550 (paper-2, ink pixel q, "[Your portrait · 4:5]"), H2 "Hi, I'm [Your Name]…", bio placeholder, 4 facts, 4-step process (Week 1 Discover → Launch Ship & care), "Tools I use daily" chip list. |
| 8 | FAQ | paper | H2 "Questions before we start" + 5-item accordion (first open). |
| 9 | Contact `#contact` | **ink** | Pink "@" pixel mark, mono line "When everything looks the same, details make the difference. Always.", mono "Next [film mark] Chapter", **kinetic finale (F14):** H2 at 136 px in four staggered lines — "Let's make [qwerttclients shot]" / "[mono: website, app — or both] your next" / "chapter [kinoqwertt shot] feel" / "unforgettable [pink arrow]" — the whole block is one link to Connect; then big email `[hello@yourdomain.com]` + "Click to copy", buttons "Start a project →" (opens Connect) and "Telegram @[your_handle]", mono "Tashkent 14:32 · usually replies within [24 hours]" (time must be live). |
| 10 | Footer (inside the ink section) | ink | Sitemap (Work, Services, About, Connect) left; **footer shuffle card (F15)** in the middle (stack of real screens, caption + "03 / 11" counter + "Next ↻" button); Channels (Telegram, GitHub, LinkedIn, Instagram) right; bottom row ©2026 · Imprint · Privacy · tiny pixel mark + "Crafted by [Your Name]". |
| 12 | Case page (`CaseQwerttclients.dc.html`) | paper → ink | See F16. Linked from Case 01 "Read the full case →". |
| 11 | Connect drawer (`Connect.dc.html`) | overlay | Right-side panel 700 px wide, 16 px inset, radius 24, page dimmed `rgba(14,14,12,.62)`. Tabs Contact / Pricing / FAQ, Close. Ink email card with copy button + live local time. Brief form: name, email, "What do you need?" multi-select chips, "Budget" single-select chips, message textarea, "Send brief →". Two collapsed FAQ rows. |

---

## 6. Facts about the two showcased projects (verified)

Use these facts; do not exaggerate them.

### 6.1 qwerttclients (Case 01)
- Universal booking platform: restaurants, cafés, beauty, wellness, hotels, sports, coworking, events, health.
- Working full-stack app: **React 19 + React Router + Vite** front end, **Fastify** API, **SQLite** (`node:sqlite`), shared TypeScript.
- **23 API integration tests, all passing** (run via `npm test`, ~4.6 s). Five booking flows (restaurant, salon, hotel, sport, event), reschedule/cancel, calendar export, owner dashboard, 2-step verification, waitlist, multilingual search.
- Languages: EN / RU / UZ. Day / night theme. 50 venue photos from Unsplash (credits page exists in that app → add "Photos: Unsplash" credit near the screenshots).
- Production bundle: JS ≈ 189 KB gzipped, CSS ≈ 6 KB gzipped.
- Original design canvas has 38 screens (desktop, tablet, mobile).
- Public live URL: **[UNVERIFIED — none known]**. A Render deploy config exists in that repo. Keep "Read the full case →" as a placeholder link until the owner provides a URL.

### 6.2 kinoqwertt (Case 02)
- Film-database redesign concept (based on an IMDb-style Figma file), live at https://kinoqwertt.vercel.app, repo https://github.com/shdqwert/kinoqwertt.
- **React 19 + Vite + GSAP**, plain CSS (no UI kit). Data from the TMDB API with a local fallback (the live site keeps rendering when the API key fails — at the time of writing the key was invalid).
- EN / RU, light / dark, sign-in and trailer modals, Top 250, title page, watchlist, search.
- One accent variable `--movie-accent` (fallback `#f5c518`) used across highlights — the CSS excerpt in the design is real.
- Its screenshots show the IMDb logo and real film posters. **Add a small caption "Unofficial redesign concept"** near the Case 02 screens so this is not mistaken for client work.

---

## 7. Feature register (what was requested, what exists, what to build)

Legend — **Design status:** `DESIGNED` (fully drawn in the design files) · `STORYBOARDED` (states drawn in `System.dc.html`) · `SPEC ONLY` (described, not drawn). **Code status:** everything below is **NOT IMPLEMENTED** in code yet — the design canvas is static.

Request history (from the owner): (1) a complete premium portfolio after studying five references; (2) keep only two projects — qwerttclients and kinoqwertt — shown as real case studies that prove skill to clients; (3) use **real project imagery, not drawings**; (4) **the site must react to scrolling, not only to clicks**; (5) "surprise me" → the owner approved three creative features: Design → Code slider, Proof console, Living "q".

---

### F1 — Scroll stage: qwerttclients (pinned, scroll-linked)
- **Status:** DESIGNED (state at ~35% in `Main.dc.html`) + STORYBOARDED (0% / 35% / 70% in `System.dc.html`). Code: to build.
- **Purpose:** Let the visitor "use" the real product just by scrolling the page — the core of the scroll-driven request.
- **Visual:** Paper-2 panel (`#EDE8DE`, radius 20, padding 40, height 820) with a 2-column grid: left a browser frame (chrome bar 38 px with three dots and URL "qwerttclients.com / Tashkent / Restaurants"; viewport shows `qwerttclients-home.jpg` full-width); right a 300 px rail: mono "Scroll through the real product", ordered list of 5 chapters (Search · Free today · Venue page · Book in steps · Business view), active chapter at full opacity with description + 2 px progress bar, inactive at 0.45; bottom: mouse icon + "Keep scrolling — the site moves, the page stays." A pink dot + ink label callout ("Free times on every card — no dead ends") and a thin custom scrollbar on the frame's right edge.
- **Experience / behaviour:**
  - Outer wrapper height ≈ `400vh`; inner stage `position: sticky; top: calc(50vh - 410px)` (or `top: 80px`), so the stage stays on screen while the page keeps scrolling **natively**.
  - Map wrapper scroll progress `p ∈ [0,1]` to 5 chapters (`0–.2, .2–.4, …`).
  - Inside a chapter, translate the screenshot: `translateY(-(imgHeight - viewportHeight) * localProgress)`.
  - At chapter boundaries cross-fade (200–300 ms or scroll-scrubbed) to the chapter's image: 1–2 → `qwerttclients-home.jpg`, 3 → `qwerttclients-place-amber.jpg`, 4 → `qwerttclients-booking-barber.jpg`, 5 → `qwerttclients-business.jpg`.
  - Rail: active item and its progress bar follow `p`; frame scrollbar thumb reflects `p`.
  - Callouts fade in at set progress points (e.g. `.30–.45` "Free times on every card — no dead ends") and out 0.15 later.
  - When `p` reaches 1 the sticky releases and the page continues normally.
- **Must not:** intercept `wheel`, call `preventDefault` on scroll, or snap. Keyboard users must be able to Tab past it; anchor links must jump over it.
- **Reduced motion:** no sticky; render the five chapter screenshots stacked (each in its own frame, top-cropped) with the rail text as captions.
- **Likely files:** `components/ScrollStage.(tsx|jsx|vue|…)` (reusable, prop-driven: chapters, images, theme), project data file, CSS module.
- **Inspect first:** existing scroll/animation libs, whether a smooth-scroll engine is already installed, global `overflow` rules (sticky breaks inside `overflow: hidden` ancestors — the design root uses `overflow: hidden`; use `overflow-x: clip` instead or restructure).
- **Verify:** scroll slowly through — chapter changes at the right points, screenshot moves smoothly, no jump on release; keyboard Tab and "Work" nav link skip correctly; reduced motion shows the static version; no console errors; 60 fps in Performance panel (no layout thrash: only `transform`/`opacity` animate).

### F2 — Scroll stage: kinoqwertt (dark variant)
- **Status:** DESIGNED. Same component as F1 with `theme="dark"`: panel `#1A1917`, frame `#0C0C0C`, chrome `#262522`, URL "kinoqwertt.vercel.app", rail text on dark, callout "Rails animate in with GSAP as you scroll" (paper label).
- **Chapters:** Trailer hero · Featured & Top picks · Box office & streaming · Title page · Top 250. Images: 1–3 → `kinoqwertt-home.jpg` (one long scroll), 4 → `kinoqwertt-title-dune2.jpg`, 5 → `kinoqwertt-top250.jpg`.
- **Verify:** as F1.

### F3 — Design → Code comparison slider
- **Status:** DESIGNED (static at 54%). Code: to build.
- **Purpose:** Prove that the design was implemented faithfully — design canvas on the left, live build on the right.
- **Visual:** Heading block (mono "Design → Code", H3 "Drag the line. / Same layout — now it works.", side paragraph). Frame 1376×631, radius 16. Bottom layer `qwerttclients-built-top.jpg`; top layer `qwerttclients-design-top.jpg` clipped to the left of the handle. 2 px white divider, 64 px black circular handle with ‹ › chevrons, labels "Design · canvas" (ink, bottom-left) and "Live build · React + API" (pink, bottom-right). Cursor `ew-resize`.
- **Behaviour:** pointer drag (Pointer Events, works with mouse and touch) and click-to-jump. Use `clip-path: inset(0 calc(100% - var(--pos)) 0 0)` on the design layer — not width changes. When it first enters the viewport, play a one-time hint: 50% → 30% → 70% → 54% (≈1.2 s, eased). Stop the hint as soon as the user interacts.
- **Accessibility:** the handle is a focusable element with `role="slider"`, `aria-valuemin=0`, `aria-valuemax=100`, `aria-valuenow`, `aria-label="Compare design and live build"`. ← / → move 5%, Home/End jump to 0/100.
- **Reduced motion:** no hint animation; slider still works.
- **Verify:** drag, click, keyboard, touch emulation; images stay perfectly aligned at any position; no layout shift (reserve height via `aspect-ratio: 1200 / 550`).

### F4 — Proof console
- **Status:** DESIGNED. Code: to build.
- **Purpose:** "Proof, not promises" — show real engineering checks.
- **Visual:** Left (1.45fr) black terminal card: title bar "qwerttclients — zsh"; prompt `~/qwerttclients $ npm test` (prompt in pink); 12 green `✔` lines (exact strings in `renderVals().tests` of `Main.dc.html`, all taken from the real test run); "… 11 more"; summary `ℹ tests 23 · pass 23 · fail 0 · 4.6 s`; blinking block cursor. Right (1fr) paper-2 card: mono "Proof, not promises", "Don't take my word for it. Here are the checks.", 2×2 stats: **23/23** API tests passing · **3** languages, one codebase · **189 KB** whole app JS, gzipped · **6 KB** all CSS, gzipped.
- **Behaviour:** when ≥40% visible (IntersectionObserver), type the lines in one by one (≈40 ms per line), then count the summary up; run once. The text must exist in the DOM from the start (animate visibility per line, do not inject text later) so screen readers and no-JS users get it.
- **Reduced motion:** show everything immediately; no blinking cursor.
- **Data:** keep the lines and numbers in the project data file. Do not invent new numbers; if the owner re-runs tests, update the file.
- **Verify:** triggers once, never re-types on scroll back; content readable with JS disabled.

### F5 — The living "q" (pixel mark that travels the page)
- **Status:** DESIGNED (shapes placed) + STORYBOARDED (5 states in `System.dc.html`). Code: to build.
- **Purpose:** One signature element that guides the visitor through the story (inspired by the primary reference's pixel glyph, but original).
- **Shapes (7×7 bitmaps, `1` = filled):**
  - q: `0111100,1000010,1000010,1000010,0111110,0000010,0000011`
  - ticket (Case 01): `1111111,1000001,1011101,1000001,1011001,1000001,1111111`
  - film frame (Case 02): `1010101,1111111,1000001,1000001,1000001,1111111,1010101`
  - @ (Contact): `0111110,1000001,1011101,1010101,1011111,1000000,0111110`
- **Placements in design:** hero (q, 9 px cells), Case 01 title (ticket, 14 px), Case 02 title (film, 14 px), Contact (@, 12 px), About portrait (ink q, 14 px), footer signature (paper q, 2 px). Colour = accent `#FF47E7` (except About ink and footer paper).
- **Behaviour:**
  1. **Load:** hero cells appear cell by cell (stagger ≈12 ms).
  2. **Cursor:** in the hero, filled cells within ~80 px of the pointer push away (max 18 px, spring) and settle back. Pointer-only; skip on touch.
  3. **Scroll morph:** implement as one reusable `PixelMark` component that can tween between bitmaps (per-cell opacity/scale, stagger 10 ms, ~600 ms). Each section's mark morphs **from the previous shape into its own** when it enters view (q → ticket → film → @). A single fixed travelling mark is **[SUGGESTION]** only — do the per-section morph first.
- **Implementation tip:** render 49 cells in a CSS grid; animate `opacity`/`transform` only. Use `aria-hidden="true"`.
- **Reduced motion:** static final shapes, no cursor reaction.
- **Verify:** each shape matches its bitmap exactly; no jank while scrolling; zero layout shift.

### F6 — Connect drawer
- **Status:** DESIGNED (interactive chips + copy button in `Connect.dc.html`). Code: to build.
- **Opens from:** every "Start a project", "Discuss", "Write to me", nav "Connect". Use a URL hash (`#connect`) or route state so it is linkable; Back/Esc closes.
- **Behaviour:** slide in from the right (≈700 ms ease-out), dim page, trap focus, restore focus to the trigger on close, close on Esc / outside click / Close button, lock background scroll while open (without layout jump — compensate scrollbar width).
- **Form:** name, email (validated), services (multi), budget (single), message. **Submission (see §11.3):** must use a real endpoint or a clearly labelled `mailto:` fallback. Never show success without a successful response.
- **Copy email:** Clipboard API → label "Copied ✓" (green `#1E9E5A`) for 1.8 s; fall back to selecting the text.
- **Live time:** "Tashkent HH:MM" computed with `Intl.DateTimeFormat('en-GB', {timeZone: 'Asia/Tashkent', hour: '2-digit', minute: '2-digit'})`, updated every minute (also in the Contact section).
- **Tabs:** Contact / Pricing / FAQ switch panel content (Pricing reuses the three pricing cards; FAQ reuses FAQ data).

### F7 — Header & navigation behaviour
- **Status:** SPEC ONLY (System spec rows "Header", "Nav link").
- Fixed header. Hide on scroll down after 200 px, show on scroll up. Text colour inverts over ink sections (Case 02, Contact/Footer) — detect with IntersectionObserver on section boundaries.
- **Scroll-spy:** the active pill follows the section in view (`Work` for both cases, `Services`, `About`, `Connect` for Contact), with `aria-current="true"`.
- **Text roll hover:** label rolls up and a duplicate rolls in from below (350 ms). Implement with one visible label + one `aria-hidden` duplicate.
- Anchor links scroll smoothly to sections with an offset for the header; respect reduced motion (instant jump).
- **Page progress indicator [SUGGESTION, approved by brief §E]:** a 2 px ink line at the very top of the viewport scaled by page progress (`transform: scaleX(p)`); invert colour over ink sections.

### F8 — Hero load sequence
- **Status:** SPEC ONLY. Headline lines rise from a mask (y 100% → 0, 80 ms stagger), pixel q draws, lead and buttons fade up, preview frame fades/scales from 0.98. Total < 1.2 s. **No preloader or start gate.** Content must be in the HTML before JS (no flash of empty hero).

### F9 — Section reveals and scroll-linked details (requirement A–F, see §8)
- **Status:** SPEC ONLY. Detailed in §8.

### F10 — Screens hover + lightbox
- **Status:** hover lift DESIGNED (`.shot:hover`), lightbox SPEC ONLY.
- Hover: lift 6 px (700 ms). Click: open a full-size lightbox showing the full-length screenshot in a scrollable frame; arrow keys move between the three screens; Esc closes; focus trapped.

### F11 — FAQ accordion
- **Status:** DESIGNED (first item open). Use `<details>/<summary>` or a button with `aria-expanded`/`aria-controls`. One open at a time, height animation 350 ms (reduced motion: instant). Answers for items 2–5 are **not written yet** → keep them as `[ANSWER]` placeholders in the data file.

### F12 — Background colour hand-over (paper ↔ ink)
- **Status:** DESIGNED as section backgrounds; transition SPEC ONLY. The page goes paper → ink at Case 02 → paper at Services → ink at Contact/Footer. Animate the hand-over by scroll (e.g. Case 02's ink panel scales its corner radius from 32 px to 0 and fades in as it reaches mid-screen). Must never leave text at low contrast mid-transition — switch text colour together with background.

### Second research pass — features added after studying the primary reference in full

The owner pointed out that only the home page of the primary reference had been studied. Its other pages were then reviewed: `/work` (each project = big title + small tags + pink arrow, followed by a row of numbered thumbnails of varying heights), `/work/filmbot` (case page: big title, tagline set one word per line, large media, a long column of media on dark mats next to a **sticky Credits / Awards column**, a "View Site" pill whose URL text loops as a marquee, "More Work" rows where **a thumbnail sits between the words of each project name**, a fixed breadcrumb pill "Work › Filmbot"), and the bottom of the home page (services shown as **playing cards that are dealt and flipped while scrolling**, and a "Next Chapter" finale of huge staggered words with small words in the gaps and a pink arrow). The ideas below adapt those patterns to this portfolio's own style and content — **do not copy that site's assets, glyphs, card artwork or copy.**

### F13 — The deck (services as cards, scroll-dealt)
- **Status:** DESIGNED (final state in `Main.dc.html`) + STORYBOARDED (0% / 40% / 100% in `System.dc.html`). Code: to build.
- **Visual:** see §5 row 6. Card back = paper `#E8E2D6`, 14 px inner margin, 1.5 px ink inner frame, tiled q-glyph pattern (inline SVG `<pattern>`, 40×40 tile, 3 px cells). Faces = paper, number "01 / 03", title, pixel icon (q · brackets · play), text, 4 deliverables, mirrored corner rotated 180°.
- **Behaviour:** sticky stage ~250vh (native scroll). `0–0.4`: three stacked face-down cards spread to their fan positions and angles. `0.4–1.0`: cards flip one by one (`rotateY(180deg)`, `transform-style: preserve-3d`, `backface-visibility: hidden`, ~0.2 progress each). Optional: hovering a face-up card lifts it 10 px and straightens it to 0°.
- **Accessibility:** card content is real text in the DOM (the face), the back is decorative (`aria-hidden`). Order in DOM = reading order.
- **Reduced motion / < 1024 px:** no sticky, three face-up cards in a row.
- **Verify:** scrub slowly — no flicker of both sides, no z-fighting; flipped text crisp; section releases cleanly.

### F14 — Kinetic finale (Contact)
- **Status:** DESIGNED (settled state) + STORYBOARDED. Code: to build.
- **Behaviour (scroll-scrubbed while the block crosses the viewport):** lines start offset horizontally (alternate +120/−80/+140/−60 px, opacity .4) and slide to their final staggered indents (110 / 360 / 40 / 300 px); inline shots open from `width: 0` (use `clip-path` or `scaleX` on a fixed-width box to avoid reflow) to 230×112 with ±3° tilt; the pink arrow draws via `stroke-dashoffset`. The block is a single `<a>` to Connect; hover enlarges the shots 1.05 and turns the arrow ink→pink pulse.
- **Reduced motion:** final layout, no scrub.
- **Verify:** text stays readable at every progress value; no horizontal overflow; one tab stop.

### F15 — Footer shuffle card
- **Status:** DESIGNED. Code: to build.
- **Behaviour:** a stack of the 11 real screenshots (`assets/`). "Next ↻" button: top card flies off (rotate 12° + translate, 500 ms) and re-enters at the bottom; the next screen and caption appear; counter updates ("03 / 11"). `aria-live="polite"` on the caption. Images lazy-loaded; preload only the next one.

### F16 — Case-study page (`/work/qwerttclients`)
- **Status:** DESIGNED for both projects: `CaseQwerttclients.dc.html` (light) and `CaseKinoqwertt.dc.html` (dark: ink page, `#1A1917` media mats, paper "More work" section, CSS excerpt + "Fixed along the way" in the sticky column, "View site ↗" pill → https://kinoqwertt.vercel.app, caption "Unofficial concept. Film titles and posters belong to their owners."). Code: build **one data-driven template** with a `theme` prop and two routes (`/work/qwerttclients`, `/work/kinoqwertt`). Home "Read the full case →" buttons and each page's "More work" rows link to each other. kinoqwertt media panels reuse three long screenshots with different `object-position` values (see `renderVals().media` in the file).
- **Sections:** header (Service · Work active · Connect, centred "[Your Name] · Designer & Developer", EN/RU) → hero (168 px title, tagline one word per line, 760×475 intro media, "View app" pill) → detail grid (numbered media panels on ink mats 01–06 on the left; **sticky** facts column on the right: summary, Credits, Proof, CTA "Want one like this? →", "Photos in the app: Unsplash") → "More work" (ink): rows "kino [shot] qwertt" (→ home Case 02 or a future kinoqwertt case page) and "Your [dashed 'this spot is open' frame] project [pink arrow]" (→ Connect) → footer.
- **Behaviours:** sticky column (`position: sticky; top: 96px`; ensure no ancestor has `overflow: hidden`); media panels reveal with rise + inner image scale 1.04→1 on scroll; "View app" pill = fixed label + mono marquee (`translateX` loop, pause on hover/focus and under reduced motion); "More work" row hover → text pink, shot scale 1.05; fixed breadcrumb pill bottom-left ("Work" → home `#work`).
- **Verify:** route works on refresh (server/static fallback), back button returns to the same scroll position on the home page, sticky column never overlaps the footer.

### Case 01 redesign (owner feedback: "the qwerttclients section is boring")

Case 01 on the home page now opens dark and photographic and uses the app's **real venue photos** (Unsplash, as used in the app — keep the credit line). The old meta row and the three text cards (problem / who / built) were **removed** and replaced by F17–F19 and a 4-number row (5 booking flows · 23/23 API tests · 3 languages · 38 screens). New photo files are in `assets/photos/` (see §4.2 addendum below).

### F17 — "Book a ___" opener (full-bleed, sticky)
- **Status:** DESIGNED (state "table") + spec row in `System.dc.html`.
- **Visual:** full-width ink section 900 px; real restaurant photo on the right 70% under a 42% ink overlay; "Book a" + a vertical word reel (168 px; active word white with a pink full stop, previous/next words at 18% opacity); right edge: 5 photo thumbnails with labels (active one with a 2 px pink outline); bottom: scroll hint, 5-segment progress bar, photo credit.
- **Behaviour:** sticky ~300vh; progress in 5 equal parts → reel rolls one word (`table → haircut → room → court → ticket`), background photo cross-fades, thumbnail + segment update. `aria-live="polite"` on the active word. Native scroll only.
- **Reduced motion / < 1024 px:** static "Book a table." with the thumbnail strip, no sticky.

### F18 — Photo storm ("50 real places. One search.")
- **Status:** DESIGNED (mid-flight state). Ink panel 1376×860, 16 rotated photo tiles scattered around a centred 640×400 frame showing `qwerttclients-home.jpg`.
- **Behaviour:** scroll-scrubbed: tiles move from scattered/off-panel positions toward the frame centre, scaling to ~0.3 and fading out (stagger by distance), headings fade in at the end. Only `transform`/`opacity`.
- **Reduced motion:** final state.

### F19 — "Book it by scrolling" demo + printed ticket
- **Status:** DESIGNED (final state: step 3, ticket printed).
- **Visual:** ink panel; left: mini booking UI in the app's own palette (`#172B4D` text, `#0C66E4` primary) — Studio Noir barbershop photo, real data from the app (Haircut 30 min $12, specialist Dmitry K.), day chips (Fri 23 selected), 8 time slots (18:30 selected, two taken), Confirm button pressed with a pink tap ring; step chips 01 Place ✓ · 02 Time ✓ · 03 Confirm. Right: a dark printer slot and a paper ticket (pixel ticket mark, "BOOKED ✓", venue, service, specialist, time, total, dashed tear line, reference `QW-7K2M9`, 9×9 pixel QR-like block, "Show this at the door").
- **Behaviour:** sticky ~250vh; step 1 → venue slides in; step 2 → Fri 23 then 18:30 fill blue; step 3 → Confirm presses, ticket slides out of the slot (translateY −100% → 0, rotate 0 → 2°), step chips tick. All content present in the DOM from the start.
- **Reduced motion:** final state.

### §4.2 addendum — real venue photos (from the qwerttclients project, Unsplash licence)
`assets/photos/`: `r2-big.jpg` (restaurant, opener bg / "table"), `b1-big.jpg` (barbershop, "haircut" + demo), `ho2-big.jpg` (hotel room, "room"), `t1-big.jpg` (tennis court, "court"), `j2-big.jpg` (jazz stage, "ticket"); storm tiles `f3 s1 c1 sp3 y3 ho3 p1 w3 b4 r5 h2 t2 j1 r4 c3 sp1` (`*-s.jpg`, 560 px). Blob ids are in `renderVals()` of `Main.dc.html` (`reel`, `storm`) in the same order.

### Case page qwerttclients — v2 (supersedes the qwerttclients part of F16)

`CaseQwerttclients.dc.html` was rebuilt as a long-form, chaptered story. The kinoqwertt page keeps the F16 template. Route: `/work/qwerttclients`. Sections and their features:

| # | Section | Feature | Scroll / interaction behaviour |
|---|---|---|---|
| 1 | Hero — **split-flap bookings board** (F20) | Ink board of 5 rows × 42 character tiles (24×36, JetBrains Mono 700, split line at mid-height): `TIME PLACE WHAT STATUS` with real venue names from the app; active row (18:30 STUDIO NOIR) white with pink status. Giant title 184 px + one-line pitch. | On load each tile flips through 2–6 random characters before landing (staggered by column, ~40 ms per flip, total < 1.6 s). On scroll, the board advances one row every ~120 px of scroll (top row flips out, a new one flips in from a list of ~10 rows). Use `aria-hidden` tiles + a real `role="table"` with row labels for screen readers. Reduced motion: static board. |
| 2 | Problem — chat **before / after** | Left: chat thread of DMs, "Seen", missed calls, "Sorry, we are full" (2 h 46 min). Right: one Amber card in the app's own UI + "Confirmed in 4 seconds". | Messages appear one by one as the section scrolls (scrubbed), the 4-second side appears instantly — the contrast is the point. **Sticky chapter rail** (F21) on the left: 01–08, active chapter follows scroll (IntersectionObserver), links jump to sections. |
| 3 | The city — **real map** (F22) | Ink map; 15 pins positioned from the venues' **real latitude/longitude** (projection in `renderVals()`), district labels with real counts (Mirabad 5, Mirzo Ulugbek 3, Yunusabad 2, Chilanzar 2, Shaykhontohur 2, Old City 1), legend by category, popover card for Amber with real free times. | Pins drop in by district as the map scrolls in; a pulse runs on the active pin; the popover cycles through 3 venues while the section is in view (or on pin hover/focus — pins are buttons). Roads/canal are decorative SVG. |
| 4 | Five ways to book | 5 cards: real category photo, title, the 3 real steps of that flow, **real screenshot** of that flow (`flow-*.jpg`). | Cards rise with alternating offsets (0 / 28 px) and parallax slightly against each other while scrolling. |
| 5 | Design system | The app's **own tokens** (12 colours from its stylesheet), Source Sans 3 scale, radii, and live components rebuilt in its styles: buttons (default/hover/secondary/disabled), slot states (available/selected/1 left/taken), status badges, stepper, banner. | Token swatches fill in left→right; components fade up. |
| 6 | Languages & themes (F23) | Left: same home page, **night** (real render) and **day**, split by a diagonal pink line. Right: stacked real renders in **Uzbek**, **Russian**, and **Russian + night** (venue page). EN/RU/UZ and Day/Night pills. | Scroll moves the diagonal wipe from 20% → 80% (`clip-path` polygon); the language cards fan out one by one. Pills reflect the visible state. |
| 7 | Under the hood | Architecture diagram (React 19 → Fastify → SQLite + shared TypeScript), 6 capability tiles (live availability, no double booking, waitlist, 2FA, .ics export, Latin/Cyrillic search), console with 14 real test names + `23 / 23`. | Diagram boxes connect with drawing arrows; console types in (F4 rules). |
| 8 | Screens — **horizontal strip** (F24) | 8 real screens 600×375 in one row (intro, home, search, venue, restaurant booking, owner dashboard, night RU, original design canvas). | Section pins (sticky ~200vh); vertical scroll translates the row horizontally (`translateX`), centred card scales to 1, others 0.92; progress bar + "03 / 08" counter. Keyboard: the row is also a scrollable list (`overflow-x: auto` fallback, arrow keys). Reduced motion / < 1024 px: normal horizontal scroll container. |
| 9 | Result + CTA | 3 outcomes, giant "Need bookings, not calls?" row with a 180 px round "Let's talk →" button (→ Connect), link to the 38 design screens. | Button follows the cursor slightly inside the row (magnetic, ≤ 12 px). |
| 10 | More work + footer | As F16. | As F16. |

New real renders (rendered from the running qwerttclients app; see `assets/renders/`): `flow-amber.jpg`, `flow-studio-noir.jpg`, `flow-merion-hotel.jpg`, `flow-riverside-sports-club.jpg`, `flow-blue-room-jazz-night.jpg`, `home-dark.jpg`, `home-ru.jpg`, `home-uz.jpg`, `place-dark-ru.jpg`. Their blob ids appear in `CaseQwerttclients.dc.html` (`renderVals()` and markup) — map by order/alt text.

### F25 — Lab page (`/lab`, `Lab.dc.html`, interactive in the canvas)

A separate page linked from the header nav ("Lab") and the footer sitemap. Purpose: let a visitor **switch real effects on and off** to feel the owner's front-end range. Layout: intro ("Press a button. Watch this page change." + short pitch), a **Reset ↺** button (also `Esc`) with a live "Mode: …" label (`aria-live`), 10 switch cards (5×2, `aria-pressed`), and a **stage** — a mini version of the portfolio home (nav, headline, pixel q, button, preview image, 3 photo cards) that the switches transform. In the canvas the switches already work as a prototype (open the artboard and press Play).

Implementation rules for all modes:
- One mode at a time; `Reset` and `Esc` restore the normal stage instantly and clean up every listener, rAF loop, physics world and observer created by the mode.
- Mode is reflected in the URL (`/lab?mode=gravity`) so it can be shared; unknown values fall back to normal.
- Lazy-load each mode's code (`import()` on first click) so the Lab page stays light.
- Under `prefers-reduced-motion` show the end state of motion-heavy modes (Parallax, Gravity, Magnet, Glitch, Film alive) without animation, and say so in the mode label.
- Effects apply to the **stage only** (not the whole site), except Pixel and 1999 which may restyle the whole Lab page via a scoped class on `<main>`.

| # | Mode | What the visitor sees | How to build it |
|---|---|---|---|
| 01 | Parallax | Stage elements split into depth layers (labels z +120 / +40 / 0 / −60) and move at 0.4× / 1× / 1.6× while scrolling or moving the mouse. | Scroll/pointer progress → per-layer `translate3d`; one rAF loop; `will-change: transform` only while active. |
| 02 | **Film alive** | Search field ("Try Dune, Interstellar…"), result list with posters, and a 2.5D scene: blurred backdrop, floating dust, tilted poster (`rotateY(-14deg) translateZ(80px)`), big title in front. Scrolling / mouse moves the camera so the still image "comes alive". | Search via **TMDB API** (`/search/movie`, then `/movie/{id}/images` for backdrop + poster + title logo). **Call TMDB through a small server/edge proxy** so the API key is never shipped to the browser; debounce 300 ms; handle empty/no-result/error states. Scene = CSS 3D layers (`perspective` on the stage, `translateZ` per layer) driven by pointer + scroll; dust = 20–30 absolutely positioned dots on a cheap canvas or CSS. Optional upgrade: WebGL displacement with a depth map — only if it stays smooth. Credit: "This product uses the TMDB API but is not endorsed or certified by TMDB." |
| 03 | Gravity | Blocks fall, pile at the bottom, can be grabbed and thrown (hand cursor). | **Matter.js** (or a ~100-line custom verlet) — create bodies from the elements' `getBoundingClientRect()`, sync DOM transforms each frame; walls = stage edges; destroy the engine on Reset. Keyboard: Space "shakes" the pile. |
| 04 | X-ray | Stage turns into a blueprint: ink background, 24 px grid, dashed pink outlines and labels (font, size, radius, dimensions). | Toggle a class; labels generated from computed styles (`getComputedStyle`) so they are true, not hard-coded. |
| 05 | Flashlight | Lights out; a soft circular torch follows the cursor. | CSS `mask-image: radial-gradient(...)` on an overlay with `--x/--y` updated on `pointermove`; keyboard users get a fixed centred light. Text stays in the DOM (readable by screen readers). |
| 06 | Pixel | Everything goes 8-bit: Silkscreen font, square corners, hard drop shadows, pixelated images. | Scoped class switching font and radii; images rendered through a tiny offscreen `<canvas>` (downscale → upscale with `imageSmoothingEnabled = false`). Load the pixel font only when the mode starts. |
| 07 | Magnet | Words, buttons and images lean toward the cursor; dashed pink lines show the pull. | Pointer distance → capped translation (≤ 24 px) with spring easing; lines in one SVG overlay. |
| 08 | Glitch | RGB-split headline, shifted slices of the image, noise bars. | CSS `clip-path` slices + pseudo-element copies with offsets, animated with `steps()`; max 2 s bursts, then calm; respect reduced motion (static split). |
| 09 | Speed test | Side panel with **live** metrics of this page: TTFB, FCP, LCP, CLS, JS transferred, FPS. | `performance.getEntriesByType('navigation'|'resource')`, `PerformanceObserver` for `paint`, `largest-contentful-paint`, `layout-shift`; FPS via rAF sampling for 2 s. **Show only measured values** ("…" while measuring). Never display invented scores. |
| 10 | 1999 | The stage becomes a 1999 homepage: grey browser window, green marquee, Comic Sans title, "Under construction" stripes, pixelated photo in a bevelled table, visitor counter, bevel buttons. | Separate small component/stylesheet rendered inside the stage; marquee via CSS animation (pausable); fake counter is clearly a joke element, not data. |

Assets: `assets/lab/` — `dune-bg.jpg`, `dune-poster.jpg`, `inter-bg.jpg`, `inter-poster.jpg`, `incep-bg.jpg`, `incep-poster.jpg` (fallback/demo images taken from the owner's kinoqwertt build; in production use live TMDB images), `pixel-r2.png`.


### F26 — Departure finale + Terminal footer (EVERY page: Home, both case pages, Lab)

Supersedes the F14 visuals and the short case-page footers. One shared component `<DepartureFinale config>` + `<TerminalFooter config>`; copy per page lives in the config (see `design/*.dc.html`, CSS block "DEPARTURE FINALE + TERMINAL FOOTER").

| Page | Headline (4 staggered lines, 136 px Barlow Condensed) | Windows (each flips through 3 real shots) |
|---|---|---|
| Home | Let’s make ▢ / your next / launch ▢ lands / unforgettable → | qwerttclients home/place/business · kinoqwertt home/Dune/Top 250 |
| qwerttclients | Your guests ▢ / book / while you ▢ rest / easy. → | venue photos · dark app screens |
| kinoqwertt | Your story ▢ / deserves / a ▢ premiere / night. → | posters · backdrops |
| Lab | Pick an effect ▢ / I’ll / build ▢ it / for real. → | lab samples · shipped screens |

**Behaviour (build = scroll-scrubbed; canvas shows it as a 10 s loop):**
1. Mono line "● Final call · Destination [flap]" — the destination flips through 5 words in steps (split-flap).
2. Lines slide in from alternating sides (−140 / +160 px → 0, 120 ms stagger).
3. Windows open from the centre (`clip-path: inset(0 50% 0 50%)` → `inset(0)`), settle at ±3°, then **cycle through 3 real images** (cross-fade + slow Ken Burns, like a departure board changing). Orange mono tag in the corner (e.g. "REAL VENUES", "NOW SHOWING").
4. Arrow draws (`stroke-dashoffset`), nudges +14 px on hover. Whole block = one link to Connect.
5. Contact row (email + local time + "Start a project →") on sub-pages.
6. Ticker strip: page-specific mono facts with orange holes, infinite marquee (pause on hover/focus).
7. Terminal footer: "Terminal map" (all pages) · **auto-dealing deck of 3 boarding passes** with real screens (top card flies off right and goes to the back every 3 s; click = deal next) · Channels.
8. **Giant ticket wordmark**: paper card with a punched-hole perforation on top, "QWERTT" 340 px Barlow 700, letters rise one by one (70 ms stagger) when the footer enters; dashed tear line; stub "Ticket QW-0X · page · Seat: yours · Gate: open · Back to top ↑".
9. "Next departures" row images on case pages use the same window-open animation.
10. `prefers-reduced-motion`: everything static, first image of each window shown.

### Removed / obsolete — do NOT implement
- Projects "Derby of Legends", "[Signal]", "Atelier", "Lighthouse", "Motion Lab" and the drawn (illustrated) project mockups.
- Cobalt accent `#3A30FF`, the Archivo condensed/extended display font, the uppercase marquee band, tilted/fanned cards. (These belonged to an earlier iteration that the owner rejected as excess style.)

### Open suggestions (not confirmed — implement only after the core is done, and say so in the report)
- Use `qwerttclients-intro.jpg` as chapter 0 of F1 (shows that app's own scroll-driven intro).
- Custom cursor (dot → ring on links → "View" disc on screens), pointer devices only.
- Live "Open site" button for qwerttclients once a public URL exists.

---

## 8. Scroll-driven experience — detailed requirements

### 8.1 Map of effects

| Where | Type | Effect |
|---|---|---|
| Hero | load + scroll-linked | Load sequence (F8). While scrolling out: preview frame scales 1 → 1.04 and moves up slightly (parallax ≈0.1); corner taglines fade out by 30% of hero height. |
| What you get | trigger | 4 columns reveal with 80 ms stagger: top rule draws left→right (`scaleX`), then text rises 16 px + fades. |
| Case titles | trigger | Title letters settle from +4% tracking to final while the line rises 24 px; pixel mark morphs (F5). Meta facts reveal row by row. |
| Problem / who / what cards | trigger | Clip-path reveal from bottom (`inset(100% 0 0 0)` → `inset(0)`), 100 ms stagger. |
| Scroll stages | **scroll-linked, sticky** | F1 / F2. |
| Three screens | trigger + hover | Rise 32 px + fade, stagger 120 ms; image inside scales 1.06 → 1 (subtle). Hover lift. |
| Decisions lists | trigger | Rows reveal one by one; the 1 px rule draws first. |
| Design → Code | trigger | One-time hint (F3). |
| Proof console | trigger | Typing (F4). Stats count up. |
| Case 02 entry | scroll-linked | Ink hand-over (F12). |
| Code excerpt | trigger | Lines fade in top→bottom (no typing — it is real code to read). |
| Services | trigger + scroll-linked | H2 words fade from 20% to 100% opacity progressively as the heading crosses the viewport (scroll-scrubbed, but always fully readable at rest). **The deck (F13)** deals and flips on scroll. Pricing cards rise with stagger. |
| Contact finale | scroll-linked | **Kinetic finale (F14).** |
| Case page | sticky + trigger | **F16:** sticky facts column, media reveals, marquee pill. |
| About | scroll-linked | Portrait block parallax (−40 px over its pass). Process steps reveal with rule draw. |
| FAQ | trigger | Rows reveal; accordion as F11. |
| Contact | trigger | "@" morph, H2 lines rise from mask, email underline draws left→right. |
| Footer | trigger | Columns fade up; no element should appear "late" or unfinished — footer must be fully visible when the page is scrolled to the end. |
| Global | scroll-linked | Page progress line (F7) and header behaviour. |

### 8.2 Motion tokens (from the design system)
- Easing: `cubic-bezier(.2,.7,.2,1)` (ease-out), `cubic-bezier(.65,0,.35,1)` (in-out).
- Durations: 200 ms hover/colour · 350 ms UI · 700 ms reveals · 1000 ms page-level.
- Reveal distances: 16–32 px. Never > 48 px.
- Stagger: 60–120 ms between siblings.
- Vary effects between sections (rule-draw, clip-path, rise, tracking settle) — **do not apply one identical fade-up to everything.**

### 8.3 Scroll interaction rules
- Native scrolling always works. No `wheel`/`touchmove` `preventDefault`, no scroll-jacking, no full-page snapping.
- Sticky stages (F1/F2) are allowed because the page keeps scrolling natively; their length must be modest (≤ 400vh each) and they must not block keyboard navigation or anchor links.
- Reveals must start from a **visible-enough** state for no-JS / failed-JS: content is visible by default in CSS; JS adds an `.is-animating` class before observing. If JS fails, nothing stays hidden.
- Smooth scrolling (Lenis) is optional. Only add it if it clearly improves the feel **and** you sync it with the chosen animation engine. Disable it under reduced motion. Never run two smooth-scroll engines.
- `prefers-reduced-motion: reduce` → no parallax, no scroll-linked transforms, no sticky stages (static fallback), reveals become simple fades ≤ 200 ms or none.

---

## 9. Choosing the animation approach (decision guide)

1. **Inspect first** (`package.json`, lockfile, existing animation code). If the project already uses an animation library, prefer it.
2. If the stack is **React** and nothing is installed:
   - Use **Motion** (`motion` package) for viewport reveals (`whileInView`) and scroll-linked values (`useScroll`, `useTransform`) — covers F1–F5, F7–F12.
   - Add **GSAP + ScrollTrigger** only if you need complex pinned timelines that Motion makes awkward. Do not use both for the same element.
3. If the stack is **not React** (vanilla, Astro, Vue, Svelte…): use **GSAP + ScrollTrigger** or plain **IntersectionObserver** + CSS transitions + a small `requestAnimationFrame` scroll-progress helper. CSS scroll-driven animations (`animation-timeline: view()/scroll()`) are acceptable as progressive enhancement only, with a JS fallback.
4. **Lenis:** optional (see §8.3). If used with GSAP, drive ScrollTrigger from Lenis' scroll event; if used with Motion, follow the Motion Lenis guide.
5. Write down the chosen approach and why in the final report.

---

## 10. PHASE 1 — Repository audit (do this first, change nothing yet)

Run and read (adapt commands to the OS / package manager you find):

```bash
git status && git log --oneline -15
ls -la && cat package.json            # or pyproject.toml / composer.json / etc.
# lockfile → package manager: package-lock.json (npm) | pnpm-lock.yaml (pnpm) | yarn.lock (yarn) | bun.lockb (bun)
find . -maxdepth 3 -type d -not -path "*/node_modules*" -not -path "*/.git*"
cat README.md CLAUDE.md 2>/dev/null
```

Record in a short audit note (keep it in your final report):
- Framework + language + version; build tool; package manager; scripts (`dev`, `build`, `test`, `lint`, `typecheck`).
- Entry points, routing system, page/section components that already exist.
- Styling system (CSS files, modules, Tailwind, CSS-in-JS), existing tokens/variables, fonts already loaded.
- Animation / scroll libraries already present.
- Images/fonts already in the repo.
- Backend/API/server code, environment variables expected (names only — never print values).
- Current state: run `dev` and `build`; note errors, warnings, broken pages, incomplete features.
- What must be **preserved** (working features, configs, content the owner wrote).

**Known context [UNVERIFIED]:** the owner has a folder named `portfolio project` on their machine that may be this repository. Other folders on the machine (`qwerttclients`, `kinoqwertt`) are **separate projects** — do not modify them.

**Acceptance:** the app runs (or you have documented exactly why it does not), and you can list which design sections already exist in code.

---

## 11. Frontend & backend implementation requirements

### 11.1 Design tokens (create once, reuse everywhere)

```css
:root {
  /* colour */
  --paper: #ECE8DF;      /* main background */
  --paper-2: #DEDAD0;    /* cards, panels */
  --ink: #111110;        /* text, buttons, dark sections */
  --ink-2: #1A1917;      /* cards on dark */
  --stone: #5E5A52;      /* muted text on paper */
  --ash: #9A958B;        /* muted text on ink */
  --body-muted: #3B3833; /* secondary body on paper */
  --body-muted-dark: #C8C3B8; /* secondary body on ink */
  --accent: #FF4F1F;     /* signal orange: stamps, active, arrows, focus — never body text */
  --ok: #1E9E5A;
  --rule: rgba(10,10,10,.16);
  --rule-dark: rgba(236,232,223,.18);

  /* type */
  --font-display: "Barlow Condensed", system-ui, sans-serif; /* 500/600/700 — ≥36px, h1–h3 */
  --font-sans: "IBM Plex Sans", system-ui, sans-serif;        /* 400/500/600/700 */
  --font-mono: "JetBrains Mono", ui-monospace, monospace;     /* 400/500 */
  --track-tight: -0.01em;   /* base */
  --track-display: -0.01em; /* condensed display needs no heavy negative tracking */

  /* layout */
  --frame: 1440px; --gutter: 32px; --gap: 24px; --section: 180px;
  --r-pill: 999px; --r-panel: 24px; --r-card: 16px; --r-shot: 12px; --r-nav: 8px;

  /* motion */
  --ease-out: cubic-bezier(.2,.7,.2,1);
  --ease-in-out: cubic-bezier(.65,0,.35,1);
  --d-fast: 200ms; --d-ui: 350ms; --d-reveal: 700ms; --d-page: 1000ms;
}
```

Type scale (desktop): Hero 112 / .92 / 600 / −0.085em · Case title 168 / .86 / 600 / −0.085em · Contact H2 136 / .88 · Section H2 60–76 / .95 / −0.08em · H3 48–64 · Lead 34 / 1.08 / −0.06em · Card text 21 / 1.25 · Title 20–28 · Body 15–19 / 1.45 · Mono label 12 / 500 / +0.02em. Self-host the fonts (or load from Google Fonts with `display=swap` and preconnect); avoid layout shift with `size-adjust`/fallback metrics if available.

Components & states (from `System.dc.html`): Primary button (ink → `#2A2926` + lift 2 px on hover), Outline button (→ ink fill), Paper button (on ink), Ghost button (on ink), Nav link (→ ink pill), all with a **2 px `#FF4F1F` focus ring, 3 px offset**. Chips (outline 1 px, pill). Shot frames (radius 12, 1 px outline).

### 11.2 Component map (adapt names to the project's conventions)

| Design part | Suggested component |
|---|---|
| Header + nav + progress line | `SiteHeader`, `NavLink`, `ScrollProgress` |
| Hero | `Hero` (+ `PixelMark`, `BrowserFrame`) |
| What you get | `ValueColumns` |
| Case template | `CaseStudy` (props: project data, theme light/dark) |
| Scroll stage | `ScrollStage` (F1/F2) |
| Screens row | `ScreenGallery` + `Lightbox` |
| Decisions / engineered list | `NumberedList` |
| Design → Code | `CompareSlider` |
| Proof console | `ProofConsole` |
| CSS excerpt card | `CodeCard` |
| Services + pricing | `Services`, `PricingCard` |
| About + process + stack | `About`, `ProcessSteps`, `ChipList` |
| FAQ | `Faq` |
| Contact + footer | `Contact`, `Footer`, `LiveClock`, `CopyEmail` |
| Connect drawer | `ConnectDrawer`, `BriefForm` |
| Motion helpers | `useReveal`/`Reveal`, `useSectionProgress`, `useReducedMotion` |

Put all copy and project data in one typed data module (e.g. `src/content/portfolio.(ts|js|json)`): navigation, projects (facts, chapters, images, alt text, captions, decisions, links), services, pricing, process, stack, FAQ, contact placeholders, proof-console lines/stats.

### 11.3 Backend / functionality
- Inspect existing backend first. **Animation work is frontend-only.**
- Contact / brief form: if the project already has an API route or form service, use it. Otherwise implement the smallest correct option the stack supports (e.g. a serverless/API route that sends email via a provider whose key comes from an environment variable) **and** document the required env vars in `.env.example` (names only). If no backend is possible, use a `mailto:` link that pre-fills subject/body and label the button honestly ("Open email app"). In every case: show loading, success only on a 2xx response, a clear error state otherwise, and keep the user's input on error.
- Add basic spam protection if a server endpoint exists (honeypot field + rate limit).
- External links (`kinoqwertt.vercel.app`, GitHub, design canvas) open in a new tab with `rel="noopener noreferrer"`.

### 11.4 Placeholders that must stay placeholders (centralise them)
`[Your Name]`, `[Q1 2027]` availability, `[hello@yourdomain.com]`, `@[your_handle]`, `/in/[your-name]`, `[City]`, `[N] years`, `[RU · EN · UZ]`, `[PRICE]` ×3, `[3–5]`/`[6–10]`/`[2–6]` weeks, `[30]` days support, `[24 hours]` reply time, `[Your portrait · 4:5]`, bio `[2–3 sentences …]`, FAQ answers 2–5 `[ANSWER]`, qwerttclients live URL. Render them visibly (do not hide them) so the owner notices and replaces them.

### 11.5 Responsive guard (desktop-first)
The approved composition is 1440 px. Make it correct at 1280–1920 px (scale type with `clamp()` around the design values; keep the 1376 px content cap). Below 1024 px: no horizontal overflow (`min-width: 0` on flex/grid children), stack multi-column grids, disable sticky stages (use the reduced-motion static version), keep everything readable. A full mobile design is **not** required in this stage.

---

## 12. Performance, accessibility, quality

**Performance**
- Animate only `transform`, `opacity`, `clip-path` (and `filter` sparingly). No animating `top/left/width/height`.
- One scroll engine, one rAF loop; throttle with rAF; passive listeners; clean up observers/listeners/timelines on unmount.
- Images: explicit `width`/`height` or `aspect-ratio`; `loading="lazy"` + `decoding="async"` below the fold; hero preview eager with `fetchpriority="high"`; serve WebP/AVIF where possible; the tall screenshots (up to 5962 px) should be resized/sliced if they hurt LCP or memory.
- Targets (desktop, production build, Lighthouse): Performance ≥ 85, Accessibility ≥ 95, Best Practices ≥ 95, CLS < 0.05. Report the real numbers.

**Accessibility**
- Landmarks: `header`, `nav`, `main`, `section` with headings, `footer`. One `h1` (hero). Logical `h2`/`h3`.
- Every interactive element is a real `button` or `a`; visible focus ring; drawer & lightbox trap focus and restore it; Esc closes.
- Alt text: meaningful for screenshots (alt texts are in the design file); `aria-hidden` for decorative pixel marks.
- Contrast ≥ 4.5:1 for text (the token pairs above pass). `--accent` is never used for text on paper.
- Reduced motion fully respected (per-feature behaviours in §7).
- Nothing important is ever permanently hidden by animation; the page works with JS disabled (content visible, links work).

**Quality**
- No console errors or warnings in dev and prod. No broken links (except listed placeholders). Lint/typecheck pass if the project has them.

---

## 13. Implementation phases (execute in order)

**PHASE 1 — Audit.** §10. Output: audit note.

**PHASE 2 — Design mapping.** Create a table: every section/feature from §5 and §7 → existing component (keep / modify) or new component → status. List missing assets/fonts. Copy `assets/` into the project's static folder. Output: mapping table in the report.

**PHASE 3 — Implementation.**
1. Tokens, fonts, global styles (§11.1).
2. Static layout of all sections, pixel-perfect against `Main.dc.html` at 1440 px, with real copy, real images and placeholders — **no motion yet**. Commit.
3. Interactions without scroll: nav, buttons, Connect drawer, copy email, live clock, FAQ, compare slider (drag/keys), lightbox, form with honest submission. Commit.
4. Scroll layer: reveals (§8.1), scroll stages F1/F2, pixel morph F5, proof console F4, colour hand-over F12, header/scroll-spy/progress F7, hero sequence F8. Commit.
5. Reduced-motion and no-JS paths for every feature. Commit.

**PHASE 4 — Integration.** Routing, anchors (`#work`, `#services`, `#about`, `#contact`, `#connect`), existing backend features, form endpoint, environment variables documented in `.env.example`.

**PHASE 5 — Testing.** Run every available script: `lint`, `typecheck`, `test`, `build`, then `preview`/`start`. Fix what fails. Check links. Check console. Run Lighthouse (or the closest available tool).

**PHASE 6 — Visual review.** Run the site locally and look at it — do not rely on reading code.
- If Playwright/browser automation is available: capture full-page screenshots at 1440×900 and 1280×800, plus screenshots of each scroll stage at progress 0 / 0.35 / 0.7 / 1, the slider at 30/54/80%, the drawer open, and reduced-motion mode (`page.emulateMedia({ reducedMotion: 'reduce' })`). Compare against the design section by section (spacing, type sizes, colours, copy). Fix differences.
- Scroll the whole page top→bottom slowly and quickly: no jumps, no stuck states, no element that appears late, footer complete at the end.
- Keyboard-only pass: Tab through the entire page and the drawer.

**PHASE 7 — Final report.** §14.

**Never claim a feature works unless you implemented it and verified it in a running build.**

---

## 14. Final report (required) and per-feature documentation

Produce `IMPLEMENTATION_REPORT.md` in the repo root containing:

1. **Audit summary** (stack, scripts, what existed, what was preserved).
2. **Design mapping table** (section → component → status).
3. **Chosen animation approach** and why; dependencies added (name, version, reason) and any removed.
4. **Feature documentation** — one block per feature F1–F25 (and any suggestion you implemented), using exactly this template:

```markdown
### <Feature name>
- What the visitor sees:
- How it works (technique, key values):
- Trigger (load / viewport entry / scroll progress / pointer / click / key):
- Implemented in (files / components):
- Depends on (frontend logic / backend / assets / library):
- In the design already vs. added in code:
- Reduced-motion behaviour:
- How to test (steps):
- Verified? (yes/no, how):
- Limitations / incomplete:
```

5. **Testing results**: commands run and their real output summary, Lighthouse scores, browsers checked, screenshots taken (paths).
6. **Known gaps & blockers** (e.g. missing email provider key, missing qwerttclients live URL, placeholder copy), each with the exact next step for the owner.
7. **How to run** (dev, build, preview) and **how to edit content** (path to the data module, list of placeholders).

---

## 15. Definition of done

- [ ] All sections from §5 render at 1440 px and visually match `Main.dc.html` (copy, sizes, colours, spacing).
- [ ] Real screenshots used everywhere; no drawn mockups; Unsplash credit + "Unofficial redesign concept" captions present.
- [ ] F1–F25 implemented and verified, each with a reduced-motion path; removed items in §7 are absent.
- [ ] Case page route `/work/qwerttclients` works on direct load and refresh.
- [ ] Scrolling is native and never trapped; anchors and keyboard navigation work across sticky stages.
- [ ] Connect drawer accessible; form never fakes success; copy-email and live clock work.
- [ ] No console errors; lint/typecheck/test/build pass (where they exist); Lighthouse targets met or numbers reported.
- [ ] No horizontal overflow at 1024–1920 px.
- [ ] `IMPLEMENTATION_REPORT.md` written with honest statuses.
- [ ] No secrets committed; `.env.example` lists required variable names.

---

## Appendix A — Original design brief (summary; still fully in force)

The original brief from the owner remains the governing requirement. Key points:

- Premium, original, desktop portfolio for a web developer, built to attract real clients; the actual finished design, not a concept or moodboard.
- Research and synthesise the five references (Eduard Bodak primary; Lusion, Uncommon Design Group, Mat Voyce, Minh Pham secondary) into **one coherent original identity** — never a copy, never a collage.
- Must communicate: who the owner is, what they build, the quality level, services, and how to get in touch. Projects are the centre of the page and must prove ability rather than claim it.
- Sections: navigation (with hover/active/focus states and an easy contact action), hero (headline, concise description, memorable visual, primary "explore projects" and secondary "contact" actions), selected projects with credible real previews, about, services, skills & technologies (no fake percentages), contact (email / Telegram placeholders), refined footer.
- Editable placeholders for all personal data; no invented clients, testimonials, awards or employment history; sample work presented honestly.
- Avoid generic AI-template patterns, meaningless decoration, excessive gradients, glassmorphism, random floating cards and pointless animation; not overly minimal either.
- Interactions must serve a purpose; define states and behaviour for later development; a reusable design system (tokens, typography, spacing, grid, buttons, cards, section layouts, motion principles).
- Desktop first in this stage.

Later decisions by the owner (all reflected above): only two projects (qwerttclients, kinoqwertt) presented as full case studies with real imagery; style pulled closer to the primary reference (removed extra fonts, marquee, tilted cards, cobalt colour); scroll-driven experience instead of click-only; three creative additions — Design → Code slider, Proof console, Living "q".
