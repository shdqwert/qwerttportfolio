// English copy. Anything in [brackets] is a placeholder the owner must replace —
// it is rendered visibly on purpose. ru.ts must keep exactly the same shape.
import type { ImgKey, MarkName } from './shared'

const name = '[Your Name]'

type Win = { tag: string; imgs: ImgKey[]; w: number; h: number; tilt: number; pos: string }
type FLine = { a: string; win?: Win; note?: string; b?: string; arrow?: boolean }
export type FinaleCfg = { flap: string[]; aria: string; lines: FLine[]; indents: number[] }

export const en = {
  lang: 'en' as 'en' | 'ru',
  meta: {
    home: { title: 'qwertt — Websites people love to use', description: 'Designer & frontend developer from Uzbekistan. Websites and web apps that turn visitors into clients — two real case studies: qwerttclients and kinoqwertt.' },
    qc: { title: 'qwerttclients — case study · qwertt', description: 'A working booking platform: React 19, Fastify, SQLite, 23 API tests, three languages and a night theme.' },
    kino: { title: 'kinoqwertt — case study · qwertt', description: 'An unofficial film-database redesign, built from Figma into a live React + GSAP app.' },
    lab: { title: 'Lab — 10 switches · qwertt', description: 'Press a button and watch the page change: parallax, physics, x-ray, glitch, live speed test and more.' }
  },
  owner: {
    name,
    role: 'Designer & Frontend Developer',
    roleShort: 'Designer & Developer',
    availability: '[Q1 2027]',
    replyTime: '[24 hours]',
    portrait: '[Your portrait · 4:5]',
    bio: '[2–3 sentences: where you’re based, how you started, what you love building.]',
    timeLabel: 'Tashkent'
  },
  nav: [
    { id: 'work', label: 'Work', to: '/#work' },
    { id: 'services', label: 'Services', to: '/#services' },
    { id: 'about', label: 'About', to: '/#about' },
    { id: 'lab', label: 'Lab', to: '/lab' },
    { id: 'connect', label: 'Connect', to: '#connect' }
  ],
  ui: {
    skip: 'Skip to content',
    mainNav: 'Main',
    langLabel: 'Language',
    home: 'qwertt — home',
    gate: 'GATE',
    status: 'STATUS',
    boarding: 'BOARDING',
    copy: 'Click to copy',
    copied: 'Copied ✓',
    placeholderTitle: 'Placeholder — add the URL in src/content/shared.ts',
    close: 'Close ✕',
    open: 'Open +',
    shut: 'Close −',
    online: 'online',
    replies: 'usually replies within',
    repliesShort: 'replies within',
    viewScreen: 'View screen: ',
    screenOf: (i: number, n: number, c: string) => `Screen ${i} of ${n}: ${c}`,
    prevScreen: 'Previous screen',
    nextScreen: 'Next screen',
    fullScreenshot: 'Full screenshot, scrollable',
    keepScrolling: ['Keep scrolling — the site moves,', 'the page stays.'],
    seatWork: '← Work',
    breadcrumb: 'Breadcrumb',
    nowBoarding: 'NOW BOARDING',
    row: 'ROW',
    seat: 'Seat',
    skipIntro: 'Skip intro →',
    cursorView: 'VIEW',
    cursorDrag: 'DRAG',
    cursorBoard: 'BOARD →'
  },
  hero: {
    lines: ['Websites people', 'love to use.'],
    lead: 'I design and build websites and web apps that turn visitors into clients — clear, fast and crafted down to the last detail.',
    primary: 'See two case studies ↓',
    secondary: 'Start a project',
    taglineLeft: ['Built for people', 'who hate waiting.'],
    taglineRight: ['Uzbekistan', 'Remote worldwide'],
    and: 'and',
    previewAlt: 'qwerttclients home page in night theme: search for restaurants, salons, hotels and sports with available times'
  },
  values: [
    { title: 'One person, design to code', text: 'You talk to the one who designs and ships it. Nothing gets lost in handover.' },
    { title: 'Built around your goal', text: 'Bookings, leads or sales — every screen is designed to move people to that action.' },
    { title: 'Fast and solid code', text: 'Clean React or Webflow builds, no heavy UI kits, responsive and accessible.' },
    { title: 'Yours to edit', text: 'CMS and a handover call, so your team updates content without me.' }
  ],
  opener: {
    label: 'Case 01 / 02 — qwerttclients',
    meta: 'Working product · front end, API, database',
    bookA: 'Book a',
    words: [
      { word: 'table', img: 'photos/r2-big' as ImgKey, alt: 'Restaurant interior with set tables — one of the real venues in qwerttclients' },
      { word: 'haircut', img: 'photos/b1-big' as ImgKey, alt: 'Studio Noir barbershop interior' },
      { word: 'room', img: 'photos/ho2-big' as ImgKey, alt: 'Merion Hotel room' },
      { word: 'court', img: 'photos/t1-big' as ImgKey, alt: 'Riverside tennis court' },
      { word: 'ticket', img: 'photos/j2-big' as ImgKey, alt: 'Blue Room jazz stage' }
    ],
    hint: 'Scroll — the plan changes',
    credit: 'Photos: Unsplash, as used in the app'
  },
  qcIntro: {
    title: 'qwerttclients',
    lead: 'One place to find and book anything nearby — and a dashboard where the owner sees the day.',
    numbers: [
      { v: '5', k: 'booking flows: table, salon,\nhotel, sport, event' },
      { v: '23/23', k: 'API tests passing' },
      { v: '3', k: 'languages: EN · RU · UZ' },
      { v: '38', k: 'screens designed, desktop\nto mobile' }
    ],
    role: 'Role: UX · UI · design system · front end · API — React 19, React Router, Vite, Fastify, SQLite'
  },
  storm: {
    label: 'Real venue photos converging into the qwerttclients home page',
    left: ['50 real', 'places.'],
    right: ['One', 'search'],
    cats: ['Restaurants · cafés · barbers · salons · spa', 'hotels · courts · coworking · live events'],
    frameAlt: 'qwerttclients home page: one search bar for every category'
  },
  stageQc: {
    label: 'Scroll through qwerttclients',
    railLabel: 'Scroll through the real product',
    url: 'qwerttclients.com / Tashkent / Restaurants',
    chapters: [
      { t: 'Search', d: 'Where, date, time, guests — and category tabs. One bar for everything.', img: 'dark/d-home' as ImgKey, alt: 'qwerttclients home page, night theme: one search bar for every category' },
      { t: 'Free today', d: 'Each card shows real free times, so people pick a slot before opening a page.', img: 'dark/d-home' as ImgKey, alt: 'qwerttclients home page scrolled to venues available today' },
      { t: 'Venue page', d: 'Photos, menu, reviews; the booking panel follows you down the page.', img: 'dark/d-place' as ImgKey, alt: 'Venue page for the restaurant Amber with gallery and booking panel' },
      { t: 'Book in steps', d: 'Five category flows: table, salon, hotel, sport, event.', img: 'dark/d-flow-studio-noir' as ImgKey, alt: 'Barber booking: choose a service and a specialist' },
      { t: 'Business view', d: 'Today’s schedule, occupancy and requests in one dashboard.', img: 'dark/d-business' as ImgKey, alt: 'Business dashboard with today’s schedule by table' }
    ],
    callouts: [{ text: 'Free times on every card — no dead ends', from: 0.3, to: 0.45, x: '24%', y: '42%' }]
  },
  qcScreens: {
    credit: 'Photos in the app: Unsplash.',
    items: [
      { img: 'dark/d-place' as ImgKey, alt: 'Venue page for the restaurant Amber with photo gallery and booking panel', caption: 'Venue page — photo gallery, menu, reviews, free times for the table.' },
      { img: 'dark/d-flow-studio-noir' as ImgKey, alt: 'Barber booking: choose a service and a specialist', caption: 'Barber flow — service and specialist first, then date and time.' },
      { img: 'dark/d-business' as ImgKey, alt: 'Business dashboard with today’s schedule by table and a request to accept', caption: 'Owner view — schedule by table, occupancy, requests to accept.' }
    ]
  },
  demo: {
    label: 'Booking demo driven by scroll',
    title: ['Book it by', 'scrolling.'],
    steps: ['01 Place', '02 Time', '03 Confirm'],
    stepsLabel: 'Booking steps',
    venue: 'Studio Noir',
    venueMeta: 'Barber · Bunyodkor Ave 3 · ★ 4.9 (156)',
    tag: 'HAIRCUT · $12',
    photoAlt: 'Studio Noir barbershop interior',
    days: [['Thu', '22'], ['Fri', '23'], ['Sat', '24'], ['Sun', '25'], ['Mon', '26']],
    slots: ['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'],
    taken: ['17:30', '19:30'],
    confirm: 'Confirm 18:30 with Dmitry K.',
    note: 'Scroll picks the place, then the time, then presses Confirm — the same flow a real guest goes through.',
    ticket: {
      booked: 'BOOKED ✓',
      fields: [['Service', 'Haircut · 30 min'], ['Specialist', 'Dmitry K.'], ['When', 'Fri, 23 Oct · 18:30'], ['Total', '$12 · pay there']],
      refLabel: 'Reference',
      ref: 'QW-7K2M9',
      foot: 'Show this at the door · added to calendar'
    }
  },
  qcLists: {
    decisionsTitle: 'Decisions that make it work',
    decisions: [
      ['Search first, not categories first', 'What + where + when in one bar, so people reach real options in one step.'],
      ['Free slots on every card', 'No dead ends: you see availability before you open a page.'],
      ['A flow for each kind of booking', 'Table and guests, service and specialist, hotel dates and room, sport court, event tickets — five flows, one system.'],
      ['It actually works, end to end', 'Real API and database: live availability, booking, reschedule, cancel, calendar export, owner dashboard — covered by 23 integration tests.']
    ] as [string, string][],
    helpsTitle: 'How it helps',
    clientsLabel: 'For clients',
    clients: ['Book in about a minute, any time of day', 'See price, reviews and free times before committing', 'Reminders and easy rescheduling'],
    businessesLabel: 'For businesses',
    businesses: ['Bookings come in while the phone is quiet', 'Automatic reminders to cut no-shows', 'One calendar for every staff member'],
    readCase: 'Read the full case →',
    allScreens: 'Open all 38 screens ↗'
  },
  compare: {
    label: 'Design → Code',
    title: ['Drag the line.', 'Same layout — now it works.'],
    text: 'Left: the original design canvas. Right: the same screen in the running app, with real photos and live data. Nothing got lost between design and code.',
    builtAlt: 'qwerttclients home page running as the live React app, night theme',
    designAlt: 'The same qwerttclients home page as a design canvas',
    aria: 'Compare design and live build',
    valueText: (v: number) => `${v}% design`,
    designTag: 'Design · canvas',
    builtTag: 'Live build · React + API'
  },
  proof: {
    label: 'Proof, not promises',
    lead: 'Don’t take my word for it. Here are the checks.',
    stats: [
      { value: 23, suffix: '/23', label: 'API tests passing' },
      { value: 3, suffix: '', label: 'languages, one codebase' },
      { value: 189, suffix: ' KB', label: 'whole app JS, gzipped' },
      { value: 6, suffix: ' KB', label: 'all CSS, gzipped' }
    ]
  },
  kinoHome: {
    index: 'Case 02 / 02',
    meta: '2026 · Personal project — in development',
    title: 'kinoqwertt',
    lead: 'A redesign concept of a film database, built from a Figma file into a live React app — trailers, ratings, title pages and a watchlist.',
    facts: [['My role', 'Frontend development'], ['Stack', 'React 19 · Vite · GSAP · plain CSS'], ['Data', 'TMDB API + local fallback'], ['Live', 'kinoqwertt.vercel.app ↗']] as [string, string][],
    cards: [
      ['The problem', 'Film databases are crowded with ads and links. Deciding what to watch tonight takes longer than the trailer.'],
      ['Who it’s for', 'Movie fans who want to pick fast, read the essentials and keep a watchlist for later.'],
      ['What I built', 'Home with trailer carousel, title page, Top 250, search, watchlist, sign-in and trailer modals — in English and Russian, light and dark.']
    ] as [string, string][],
    stage: {
      label: 'Scroll through kinoqwertt',
      railLabel: 'Scroll through the live site',
      url: 'kinoqwertt.vercel.app',
      chapters: [
        { t: 'Trailer hero', d: 'Carousel with featured videos beside it.', img: 'shots/kinoqwertt-home' as ImgKey, alt: 'kinoqwertt home page with trailer carousel' },
        { t: 'Featured & Top picks', d: 'Horizontal rails of lists, posters and ratings — animated in with GSAP.', img: 'shots/kinoqwertt-home' as ImgKey, alt: 'kinoqwertt home page scrolled to Featured Today and Top Picks' },
        { t: 'Box office & streaming', d: 'Weekly box office and tabs per streaming service.', img: 'shots/kinoqwertt-home' as ImgKey, alt: 'kinoqwertt home page scrolled to box office and streaming' },
        { t: 'Title page', d: 'Rating, cast, reviews, storyline, box office and specs.', img: 'shots/kinoqwertt-title-dune2' as ImgKey, alt: 'Title page for Dune: Part Two with rating, cast and where to watch' },
        { t: 'Top 250', d: 'Ranked list with genres, filters and trailers.', img: 'shots/kinoqwertt-top250' as ImgKey, alt: 'Top 250 movies list with filters' }
      ],
      callouts: [{ text: 'Rails animate in with GSAP as you scroll', from: 0.22, to: 0.37, x: '30%', y: '30%' }]
    },
    screens: [
      { img: 'shots/kinoqwertt-title-dune2' as ImgKey, alt: 'Title page for Dune: Part Two with rating, cast and where to watch', caption: 'Title page — trailer, rating, cast, reviews, box office, specs.' },
      { img: 'shots/kinoqwertt-top250' as ImgKey, alt: 'Top 250 movies list with filters', caption: 'Top 250 — ranked list with filters, genres and trailers.' },
      { img: 'shots/kinoqwertt-home' as ImgKey, alt: 'Home page hero with trailer carousel', caption: 'Home — trailer carousel with featured videos beside it.' }
    ],
    screensCredit: 'Unofficial redesign concept — not affiliated with IMDb. Posters belong to their owners.',
    listTitle: 'How it’s engineered',
    list: [
      ['Never a blank page', 'Live data comes from the TMDB API; if it fails, the site falls back to local data and still renders every section.'],
      ['One accent variable for the whole UI', 'Every highlight reads --movie-accent, so a page can re-colour itself without touching components.'],
      ['Two languages, two themes', 'EN / RU and light / dark, remembered in the browser. No UI kit — plain CSS and GSAP.'],
      ['Bugs found and fixed', 'Header vanishing on navigation; a 726 px overflow on 375 px phones (flex children without min-width: 0).']
    ] as [string, string][],
    codeLabel: 'styles · from the live build',
    excerpt: 'excerpt',
    comment: '/* every highlight reads one variable */',
    clientLabel: 'What this shows a client',
    clientText: 'I can take a designer’s Figma file and ship it as a fast, maintainable app — and catch the bugs before your users do.',
    readCase: 'Read the full case →',
    live: 'Open live site ↗'
  },
  services: {
    label: 'Services',
    title: 'Design, code and motion — one ticket, one person.',
    deckLabel: 'Services as three tickets',
    deckKicker: 'Three tickets · one trip',
    deckTorn: 'torn & stamped',
    admit: 'Admit one',
    stamp: 'INCLUDED',
    cards: [
      { no: '01 / 03', title: 'Website Design', icon: 'q' as MarkName, text: 'Structure, art direction and interfaces people enjoy using.', items: ['UX & page structure', 'Art direction', 'Figma design system', 'Every state, every screen'] },
      { no: '02 / 03', title: 'Development', icon: 'code' as MarkName, text: 'Fast, accessible builds that keep every design detail intact.', items: ['React · Next.js · Astro', 'Webflow + CMS', 'APIs & databases', 'Tests before launch'] },
      { no: '03 / 03', title: 'Motion', icon: 'play' as MarkName, text: 'Scroll, hover and page transitions that make the site feel alive.', items: ['Scroll storytelling', 'Micro-interactions', 'Page transitions', 'Reduced-motion ready'] }
    ],
    discuss: 'Discuss',
    discussAria: (p: string) => `Discuss the ${p} package`
  },
  pricing: [
    { name: 'Express', weeks: '[3–5] weeks', text: 'For focused stories — a launch, a product, a personal brand.', price: 'from [PRICE]', ink: false },
    { name: 'Full journey', weeks: '[6–10] weeks', text: 'For growing brands — multi-page, CMS, booking or catalogue.', price: 'from [PRICE]', ink: true },
    { name: 'Code only', weeks: '[2–6] weeks', text: 'You have the Figma — I build it, pixel-accurate and animated.', price: 'from [PRICE]', ink: false }
  ],
  about: {
    label: 'About',
    title: `Hi, I’m ${name}. I care about the last 10% — the part most sites skip.`,
    text: 'I work as a one-person studio, so the person who designs your site is the person who codes it.',
    facts: [['Based in', '[City], Uzbekistan'], ['Experience', '[N] years'], ['Languages', '[RU · EN · UZ]'], ['Time zone', 'GMT+5, EU overlap']] as [string, string][],
    process: [
      ['Week 1', 'Discover', 'Goals, audience, scope and a fixed quote.'],
      ['Weeks 2–3', 'Design', 'Key screens first, then the full system.'],
      ['Weeks 4–6', 'Build', 'Live link from day one, weekly updates.'],
      ['Launch', 'Ship & care', 'Speed checks, handover, [30] days support.']
    ] as [string, string, string][],
    stackLabel: 'Tools I use daily',
    stackEdit: '[edit list]'
  },
  faq: {
    title: 'Questions before we start',
    label: 'Questions',
    items: [
      { q: 'How long does a website take?', a: 'A one-pager usually takes [3–5] weeks, a full site [6–10]. You get a fixed timeline in the first week, and a live link to watch progress.' },
      { q: 'Can I edit the site myself after launch?', a: '[ANSWER]' },
      { q: 'Do you take development-only projects?', a: '[ANSWER]' },
      { q: 'Do you work with clients abroad?', a: '[ANSWER]' },
      { q: 'How does payment work?', a: '[ANSWER]' }
    ]
  },
  contact: {
    label: 'Contact',
    motto: 'Good websites don’t keep people waiting. Neither do I.',
    cta: 'Start a project →',
    telegram: 'Telegram'
  },
  finale: {
    finalCall: 'Final call',
    destination: 'Destination',
    home: <FinaleCfg>{
      flap: ['YOUR LAUNCH', 'NEW SITE', 'APP', 'REDESIGN', 'BOTH'],
      aria: 'Let’s make your next launch land unforgettable — start a project',
      lines: [
        { a: 'Let’s make', win: { tag: 'qwerttclients', imgs: ['dark/d-home', 'dark/d-place', 'dark/d-business'] as ImgKey[], w: 230, h: 112, tilt: -3, pos: 'top' } },
        { note: 'website, app — or both', a: 'your next' },
        { a: 'launch', win: { tag: 'kinoqwertt', imgs: ['shots/kinoqwertt-home', 'shots/kinoqwertt-title-dune2', 'shots/kinoqwertt-top250'] as ImgKey[], w: 230, h: 112, tilt: 3, pos: 'top' }, b: 'lands' },
        { a: 'unforgettable', arrow: true }
      ],
      indents: [110, 360, 40, 300]
    },
    qc: <FinaleCfg>{
      flap: ['BOOKINGS', 'NO CALLS', 'FULL TABLES', 'YOUR LAUNCH', '24/7'],
      aria: 'Your guests book while you rest — start a project',
      lines: [
        { a: 'Your guests', win: { tag: 'real venues', imgs: ['photos/r2-big', 'photos/b1-big', 'photos/f3-s'] as ImgKey[], w: 230, h: 112, tilt: -3, pos: 'top' } },
        { note: '24/7 · no phone tag', a: 'book' },
        { a: 'while you', win: { tag: 'live product', imgs: ['dark/d-home', 'dark/d-search', 'dark/d-business'] as ImgKey[], w: 230, h: 112, tilt: 3, pos: 'top' }, b: 'rest' },
        { a: 'easy.', arrow: true }
      ],
      indents: [80, 380, 30, 320]
    },
    kino: <FinaleCfg>{
      flap: ['PREMIERE', 'OPENING NIGHT', 'FULL HOUSE', 'YOUR LAUNCH', 'ENCORE'],
      aria: 'Your story deserves a premiere night — start a project',
      lines: [
        { a: 'Your story', win: { tag: 'now showing', imgs: ['lab/dune-poster', 'lab/inter-poster', 'lab/incep-poster'] as ImgKey[], w: 150, h: 120, tilt: -3, pos: 'center' } },
        { note: 'film, brand or launch', a: 'deserves' },
        { a: 'a', win: { tag: 'scene', imgs: ['lab/dune-bg', 'lab/inter-bg', 'lab/incep-bg'] as ImgKey[], w: 260, h: 112, tilt: 3, pos: 'center' }, b: 'premiere' },
        { a: 'night.', arrow: true }
      ],
      indents: [80, 380, 30, 320]
    },
    lab: <FinaleCfg>{
      flap: ['PARALLAX', 'X-RAY', 'GRAVITY', 'GLITCH', '1999'],
      aria: 'Pick an effect, I will build it for real — start a project',
      lines: [
        { a: 'Pick an effect', win: { tag: 'lab sample', imgs: ['lab/pixel-r2', 'dark/d-home', 'shots/kinoqwertt-home'] as ImgKey[], w: 230, h: 112, tilt: -3, pos: 'top' } },
        { note: '10 switches above — or your own idea', a: 'I’ll' },
        { a: 'build', win: { tag: 'shipped', imgs: ['lab/dune-poster', 'dark/d-place', 'shots/kinoqwertt-top250'] as ImgKey[], w: 230, h: 112, tilt: 3, pos: 'top' }, b: 'it' },
        { a: 'for real.', arrow: true }
      ],
      indents: [80, 380, 30, 320]
    }
  },
  tickers: {
    home: ['Flight QW-01 · qwerttclients', 'Flight QW-02 · kinoqwertt', 'Design + code, one person', 'Tashkent ↔ worldwide', 'Next: your project', 'Gate open'],
    qc: ['Flight QW-01 · qwerttclients', 'Departed on time', '3 languages', 'Night mode on board', '23/23 tests passed', 'Next stop: your business', 'Gate open'],
    kino: ['Flight QW-02 · kinoqwertt', 'Now showing', 'Top 250 on board', 'EN · RU', 'GSAP in every rail', 'Next screening: yours', 'Gate open'],
    lab: ['Lab · 10 switches', 'Physics on board', 'Live speed test', 'Built by hand', 'Reset with Esc', 'Gate open']
  },
  footer: {
    map: 'Terminal map',
    channels: 'Channels',
    deckLabel: 'Projects deck',
    deck: [
      { img: 'dark/d-home' as ImgKey, cap: 'qwerttclients — Home', no: 'BOARDING PASS · 01' },
      { img: 'shots/kinoqwertt-home' as ImgKey, cap: 'kinoqwertt — Home', no: 'BOARDING PASS · 02' },
      { img: 'dark/d-business' as ImgKey, cap: 'qwerttclients — Business', no: 'BOARDING PASS · 03' }
    ],
    admit: 'ADMIT ONE',
    nextCard: 'Deal next boarding pass',
    seat: 'Seat: yours · Gate: open · Boarding: [Q1 2027]',
    tickets: { home: 'Ticket QW-00 · qwerttportfolio', qc: 'Ticket QW-01 · qwerttclients', kino: 'Ticket QW-02 · kinoqwertt', lab: 'Ticket QW-03 · lab' },
    top: 'Back to top ↑',
    imprint: 'Imprint',
    privacy: 'Privacy',
    stamped: `Built & stamped by ${name}`,
    links: { home: 'Home', work: 'Work', services: 'Services', about: 'About', lab: 'Lab', connect: 'Connect', qc: 'qwerttclients', kino: 'kinoqwertt' }
  },
  nextDepartures: {
    label: 'Next departures',
    boarding: 'BOARDING',
    gateOpen: 'GATE OPEN',
    open: 'this spot is open',
    your: 'Your',
    project: 'project'
  },
  caseQc: {
    seat: 'Row 01 · Seat qwerttclients',
    kicker: 'Case 01 · Working product',
    date: 'Tashkent · today, 23 Oct',
    boardLabel: 'Bookings board',
    boardCols: ['Time', 'Place', 'What', 'Status'],
    title: 'qwerttclients',
    pitch: 'A city’s free times on one board. Book anything nearby — no calls.',
    hint: 'Scroll — the board keeps flipping',
    chaptersLabel: 'Chapters',
    chapters: ['Problem', 'The city', 'Five flows', 'System', 'Languages', 'Under the hood', 'Screens', 'Result'],
    problem: {
      kicker: '01 · The problem',
      title: ['Booking shouldn’t take', 'a phone call.'],
      before: 'Before · DMs and calls',
      beforeTime: '2 h 46 min',
      after: 'After · qwerttclients',
      afterTime: 'seconds',
      msgs: [
        { t: 'Hi! Do you have a table for 2 tonight?', at: '17:02 · sent', me: true },
        { t: 'Seen', at: '17:40', seen: true },
        { t: 'Missed call × 3', at: '18:05 – 18:31', missed: true },
        { t: 'Hello? Anyone?', at: '18:52 · sent', me: true },
        { t: 'Sorry, we are full tonight.', at: '19:48' }
      ],
      cardAlt: 'Pasta at Amber restaurant',
      venue: 'Amber',
      instant: 'INSTANT CONFIRMATION',
      venueMeta: 'Restaurant · Italian · Amir Temur St 45 · ★ 4.8',
      slots: ['18:00', '19:00', '20:30 · 1 LEFT'],
      confirmed: 'Table for 2 · 19:00 · Terrace',
      confirmedMeta: 'Confirmed · QW-7K2M9 · reminder 2 h before',
      confirmedIn: 'Confirmed in'
    },
    city: {
      kicker: '02 · The city',
      title: ['15 places. 6 districts.', 'One search.'],
      text: 'Every pin is a real venue from the app’s database, placed by its own latitude and longitude. Search by name, district or “near me” — sorted by real distance.',
      mapLabel: 'Map of Tashkent with 15 venue pins across Mirabad, Yunusabad, Chilanzar, Old City, Mirzo Ulugbek and Shaykhontohur',
      legend: [['Food & drink', 'restaurant'], ['Beauty & health', 'salon'], ['Hotels', 'hotel'], ['Sport & work', 'sport'], ['Events', 'event']] as [string, string][],
      pops: [
        { name: 'Amber', rating: '★ 4.8', meta: 'Mirabad · Amir Temur St 45 · from $25 / guest', img: 'photos/r2-big' as ImgKey, times: ['12:00', '12:30', '13:00'] },
        { name: 'Studio Noir', rating: '★ 4.9', meta: 'Chilanzar · Bunyodkor Ave 3 · haircut $12', img: 'photos/b1-big' as ImgKey, times: ['17:00', '18:30', '20:00'] },
        { name: 'Merion Hotel', rating: '★ 4.7', meta: 'Shaykhontohur · 4-star · from $80 / night', img: 'photos/ho2-big' as ImgKey, times: ['Fri', 'Sat', 'Sun'] }
      ]
    },
    flows: {
      kicker: '03 · Five ways to book',
      title: ['A table is not', 'a hotel room.'],
      text: 'Each category books the way it works in real life — then all five share one checkout, one account and one design system.',
      items: [
        { no: '01', cat: 'Restaurant', title: 'Table & seating', photo: 'photos/r2-big' as ImgKey, photoAlt: 'Restaurant dining room', steps: ['Date & time', 'Party size', 'Terrace, hall or bar'], shot: 'dark/d-flow-amber' as ImgKey, shotAlt: 'Restaurant booking: date, lunch and dinner times' },
        { no: '02', cat: 'Salon', title: 'Service & specialist', photo: 'photos/b1-big' as ImgKey, photoAlt: 'Barbershop interior', steps: ['Service', 'Specialist or “any”', 'Free time'], shot: 'dark/d-flow-studio-noir' as ImgKey, shotAlt: 'Barber booking: services and specialists' },
        { no: '03', cat: 'Hotel', title: 'Dates & room', photo: 'photos/ho2-big' as ImgKey, photoAlt: 'Hotel room', steps: ['Check-in & out', 'Guests', 'Room & extras'], shot: 'dark/d-flow-merion-hotel' as ImgKey, shotAlt: 'Hotel booking: two-month calendar and guests' },
        { no: '04', cat: 'Sport', title: 'Court & duration', photo: 'photos/t1-big' as ImgKey, photoAlt: 'Tennis court', steps: ['Court', 'Day & start', '60 · 90 · 120 min'], shot: 'dark/d-flow-riverside-sports-club' as ImgKey, shotAlt: 'Sports booking: courts, days and durations' },
        { no: '05', cat: 'Event', title: 'Date & tickets', photo: 'photos/j2-big' as ImgKey, photoAlt: 'Jazz stage', steps: ['Show date', 'Ticket type', 'Quantity'], shot: 'dark/d-flow-blue-room-jazz-night' as ImgKey, shotAlt: 'Event booking: show dates and ticket types' }
      ]
    },
    system: {
      kicker: '04 · Design system · night theme',
      title: ['A system, not', '38 separate screens.'],
      tokensLabel: 'Tokens · from the app’s stylesheet',
      typeName: 'Source Sans 3',
      typeScale: '36/40 · 28/32 · 20/24 · 16/24 · 14/20 · 12/16',
      radii: 'radius 3 · 4 · 8',
      compLabel: 'Components · real states',
      buttons: ['Reserve a table', 'Hover', 'Manage booking', 'Disabled'],
      slots: ['18:00', '19:00', '20:30', '21:00'],
      oneLeft: '1 LEFT',
      slotStates: ['available', 'selected', '1 left', 'taken'],
      badges: ['CONFIRMED', 'INSTANT', 'WAITLIST', 'CANCELLED'],
      stepper: ['Service', 'Date & time', 'Confirm'],
      banner: 'Free cancellation until 17:00 — change the time in My bookings.'
    },
    languages: {
      kicker: '05 · Languages & themes',
      title: ['Day or night.', 'English, русский, oʻzbek.'],
      langs: ['EN', 'RU', 'UZ'],
      themes: ['☀ Day', '☾ Night'],
      wipeLabel: 'The same home page in night theme and day theme, split by a diagonal wipe',
      night: '☾ Night',
      day: '☀ Day',
      cards: [
        { img: 'renders/home-uz' as ImgKey, alt: 'Home page in Uzbek: Yaqin atrofdagi hamma narsani bron qiling' },
        { img: 'renders/home-ru' as ImgKey, alt: 'Home page in Russian: Бронируйте всё, что рядом' },
        { img: 'renders/place-dark-ru' as ImgKey, alt: 'Venue page in Russian, night theme' }
      ],
      note: 'Dates, plurals and server messages are translated too'
    },
    engine: {
      kicker: '06 · Under the hood',
      title: ['Not a mockup.', 'It runs.'],
      archLabel: 'Architecture: React single-page app talks to a Fastify API backed by SQLite; shared TypeScript types, dates and pricing are used on both sides',
      boxes: [
        { k: 'Browser', t: 'React 19', d: 'React Router · Vite · i18n · themes' },
        { k: 'API', t: 'Fastify', d: 'zod validation · cookie sessions · 2FA' },
        { k: 'Data', t: 'SQLite', d: 'node:sqlite · seed · bookings' }
      ],
      shared: 'Shared TypeScript',
      sharedNote: 'types · dates · pricing — one source for both sides',
      caps: [
        { t: 'Live availability', d: 'Slots computed per venue, staff and duration' },
        { t: 'No double booking', d: 'Conflicts blocked on the server' },
        { t: 'Waitlist', d: 'Guests notified when a slot frees up' },
        { t: 'Two-step login', d: 'TOTP codes, rate-limited sign-in' },
        { t: 'Calendar export', d: '.ics for every booking' },
        { t: 'Smart search', d: 'Latin and Cyrillic spellings, near me' }
      ]
    },
    strip: {
      kicker: '07 · Screens',
      title: ['Scroll down — the screens', 'slide sideways.'],
      label: 'All key screens',
      items: [
        { img: 'shots/qwerttclients-intro' as ImgKey, cap: 'Scroll-driven intro', alt: 'Intro: categories orbit the logo' },
        { img: 'dark/d-home' as ImgKey, cap: 'Home', alt: 'Home page with search and venues' },
        { img: 'dark/d-search' as ImgKey, cap: 'Search & filters', alt: 'Search results with filters' },
        { img: 'dark/d-place' as ImgKey, cap: 'Venue page', alt: 'Amber venue page' },
        { img: 'dark/d-flow-amber' as ImgKey, cap: 'Restaurant booking', alt: 'Restaurant booking calendar' },
        { img: 'dark/d-business' as ImgKey, cap: 'Owner dashboard', alt: 'Business dashboard' },
        { img: 'renders/place-dark-ru' as ImgKey, cap: 'Night theme · RU', alt: 'Venue page, Russian, night' },
        { img: 'shots/qwerttclients-design-top' as ImgKey, cap: 'Where it started', alt: 'Original design canvas' }
      ]
    },
    result: {
      kicker: '08 · What this means for your project',
      items: [
        ['Design that ships', 'The same person drew the 38 screens and wrote the code — nothing lost in between.'],
        ['Real product logic', 'Availability, conflicts, pricing, waitlists, 2FA — the hard parts, tested.'],
        ['Ready for your market', 'Three languages, two themes, local dates and currencies from day one.']
      ] as [string, string][],
      cta: ['Need bookings,', 'not calls?'],
      talk: 'Let’s talk',
      screens: 'Open all 38 design screens ↗',
      credit: 'Venue photos in the app: Unsplash · [live URL]'
    }
  },
  caseKino: {
    seat: 'Row 02 · Seat kinoqwertt',
    kicker: 'Case 02 · ©2026 · Unofficial redesign concept',
    title: 'kinoqwertt',
    tagline: ['Pick', 'tonight’s', 'film', 'faster than', 'the trailer.'],
    heroAlt: 'kinoqwertt home page: trailer carousel with featured videos',
    viewSite: 'View site ↗',
    media: [
      { no: '01', h: 560, img: 'shots/kinoqwertt-home' as ImgKey, pos: 0, alt: 'Home: trailer carousel and featured videos', cap: 'Home — trailer carousel' },
      { no: '02', h: 560, img: 'shots/kinoqwertt-home' as ImgKey, pos: 22, alt: 'Home: Featured Today and Top Picks rails with ratings', cap: 'Featured today & Top picks' },
      { no: '03', h: 560, img: 'shots/kinoqwertt-home' as ImgKey, pos: 62, alt: 'Home: streaming tabs and weekly box office', cap: 'Streaming tabs & box office' },
      { no: '04', h: 600, img: 'shots/kinoqwertt-title-dune2' as ImgKey, pos: 0, alt: 'Title page for Dune: Part Two with rating and where to watch', cap: 'Title page — Dune: Part Two' },
      { no: '05', h: 560, img: 'shots/kinoqwertt-title-dune2' as ImgKey, pos: 24, alt: 'Title page: cast and user reviews', cap: 'Cast & reviews' },
      { no: '06', h: 560, img: 'shots/kinoqwertt-top250' as ImgKey, pos: 0, alt: 'Top 250 list with genres and filters', cap: 'Top 250 — ranked list' }
    ],
    summary: 'A film database redesign, taken from a Figma file to a live React app: trailers, ratings, title pages, Top 250 and a watchlist.',
    body: 'I built the front end end to end: components, layout, motion and data. Live data comes from the TMDB API — and when the API is unavailable, the site falls back to local data and still renders every section.',
    creditsTitle: 'Credits',
    credits: [['Role', 'Front-end development'], ['Stack', 'React 19 · Vite · GSAP'], ['Styling', 'Plain CSS, no UI kit'], ['Data', 'TMDB API + local fallback'], ['Extras', 'EN / RU · light / dark']] as [string, string][],
    codeLabel: 'from the live build',
    fixedTitle: 'Fixed along the way',
    fixed: ['Header vanished on navigation — fixed the layout structure.', '726 px overflow on 375 px phones — flex children got min-width: 0.'],
    live: 'Open live site ↗',
    repo: 'GitHub ↗',
    caption: 'Unofficial concept. Film titles and posters belong to their owners.'
  },
  lab: {
    kicker: 'Lab',
    headerNote: '10 switches · every one is real front-end code',
    title: ['Press a button.', 'Watch this page', 'change.'],
    text: 'These aren’t templates or plugins. Each switch is something I build into client sites — parallax, physics, live data, motion. Try one, then hit Reset.',
    reset: 'Reset ↺',
    mode: 'Mode',
    normal: 'Normal',
    switchesLabel: 'Switches',
    stageLabel: 'Live preview',
    reducedNote: ' · reduced motion: end state',
    switches: [
      ['parallax', 'Parallax', 'The page splits into depth layers that move at different speeds.'],
      ['film', 'Film alive', 'Search a film — its poster becomes a 2.5D scene you fly into.'],
      ['gravity', 'Gravity', 'Everything falls. Grab blocks and throw them around.'],
      ['xray', 'X-ray', 'See the grid, boxes, sizes and fonts behind the design.'],
      ['flash', 'Flashlight', 'Lights off. Your cursor becomes a torch.'],
      ['pixel', 'Pixel', 'The whole page turns 8-bit, in the style of my q mark.'],
      ['magnet', 'Magnet', 'Words and buttons lean toward your cursor.'],
      ['glitch', 'Glitch', 'Controlled chaos: RGB split, slices, noise.'],
      ['speed', 'Speed test', 'Live performance numbers of this very page.'],
      ['y1999', '1999', 'My site, if I had made it in 1999.']
    ] as [string, string, string][],
    stage: {
      nav: ['qwertt', 'Work', 'Services', 'About', 'Connect'],
      head: 'Websites people love to use.',
      btn: 'See work ↓',
      imgAlt: 'qwerttclients home page preview',
      cards: ['Restaurants', 'Barbers', 'Hotels']
    },
    parallaxHint: 'scroll or move — layers move at 0.4× · 1× · 1.6×',
    gravityHint: 'Drag anything · it has weight · Space shakes',
    flashHint: 'Move the light · content stays readable to screen readers',
    magnetHint: 'Everything leans toward your cursor',
    glitchHint: 'Signal lost… press Reset to fix',
    speed: {
      title: 'Speed test',
      live: '● measuring live',
      text: 'Measured in your browser, on this page, right now — Navigation Timing + PerformanceObserver.',
      foot: 'Values appear as they are measured · no fake scores',
      labels: ['Time to first byte', 'First contentful paint', 'Largest contentful paint', 'Layout shift (CLS)', 'JS transferred', 'Frames per second']
    },
    y1999: {
      bar: 'qwertt.html - Netscape Navigator',
      marquee: '★ WELCOME TO MY HOMEPAGE!!! ★ BEST VIEWED IN 800×600 ★ SIGN MY GUESTBOOK ★',
      title: '~*~ qwertt’s Web Page ~*~',
      intro: ['I make ', 'websites', '!!! ', 'Click here', ' to see my work.'],
      construction: 'UNDER CONSTRUCTION',
      imgAlt: 'My restaurant project (very pixelated)',
      projects: 'My Projects:',
      list: ['Booking site', 'Movie site', 'My cat'],
      newBadge: 'NEW!',
      counter: 'You are visitor number',
      counterNote: '(a joke counter, not real data)',
      buttons: ['Guestbook', 'E-mail me', 'Webring →'],
      foot: '© 1999 qwertt · Made with Notepad · ',
      back: '(press Reset to come back to 2026)'
    },
    film: {
      kicker: 'Film alive · search any film',
      label: 'Film title',
      placeholder: 'Try “Dune”, “Interstellar”…',
      offline: 'offline demo — local images, no TMDB key',
      text: 'Backdrop, poster and title come from TMDB. The scene is built in 2.5D layers — scroll or move the mouse to fly in.',
      layers: 'layer depth · backdrop −20 · dust −8 · poster +14 · title +22',
      fly: 'scroll ↓ to fly in',
      noResults: 'No films found — try another title.',
      credit: 'This product uses the TMDB API but is not endorsed or certified by TMDB.'
    }
  },
  play: {
    label: 'Playground',
    title: 'Break time. Play with pixels.',
    text: 'No business here — just the same 7×7 grid my logo lives on. Punch your own mark, or try to catch the hole that refuses to be clicked.',
    editorLabel: 'Punch your mark',
    catchLabel: 'Catch the hole',
    gridLabel: 'Punch grid, 7 by 7. Arrow keys move, Space toggles a hole.',
    cell: 'Hole',
    codeLabel: 'Your mark as code',
    filled: (n: number) => `${n} / 49 holes`,
    presets: { ticket: 'Ticket', film: 'Film' },
    random: 'Random',
    mirror: 'Mirror',
    invert: 'Invert',
    clear: 'Clear',
    score: 'Score',
    time: 'Time',
    best: 'Best',
    pixelLabel: 'The hole — click to catch it',
    catchTitle: '20 seconds. One hole. It runs.',
    catchText: 'Get close and it jumps away — but it needs a moment to rest.',
    start: 'Start',
    again: 'Again',
    over: (n: number) => `${n} caught.`,
    record: 'New personal best — saved in this browser.',
    hint: 'psst… ↑ ↑ ↓ ↓ ← → ← → B A',
    konami: 'Konami code accepted · +30 lives'
  },
  intro: {
    board: ['DEPARTURES', 'QW-00  PORTFOLIO', 'GATE   OPEN'],
    status: 'NOW BOARDING',
    brand: 'qwertt · portfolio © 2026'
  },
  transition: {
    home: 'NOW BOARDING · ROW 00 · HOME',
    qc: 'NOW BOARDING · ROW 01 · QWERTTCLIENTS',
    kino: 'NOW BOARDING · ROW 02 · KINOQWERTT',
    lab: 'NOW BOARDING · ROW 03 · LAB'
  },
  connect: {
    tabs: { Contact: 'Contact', Pricing: 'Pricing', FAQ: 'FAQ' } as Record<'Contact' | 'Pricing' | 'FAQ', string>,
    tabsLabel: 'Connect sections',
    dialog: 'Connect',
    emailLabel: 'Email — fastest reply',
    services: ['Website design', 'Development', 'Redesign', 'Motion / WebGL', 'Not sure yet'],
    budgets: ['[Range A]', '[Range B]', '[Range C]', 'Let’s discuss'],
    defaultService: 'Website design',
    defaultBudget: '[Range B]',
    nameLabel: 'Your name',
    namePh: 'Jane Doe',
    emailField: 'Email',
    emailPh: 'jane@company.com',
    needLabel: 'What do you need?',
    budgetLabel: 'Budget',
    messageLabel: 'Tell me about the project',
    messagePh: 'Goals, timeline, links to references…',
    errName: 'Please add your name.',
    errEmail: 'Please enter a valid email.',
    sending: 'Sending…',
    send: 'Send brief →',
    sendMail: 'Send brief via email app →',
    mailNote: 'Opens your email app with the brief filled in.',
    errSend: (email: string) => `Couldn’t send — please try again or write to ${email}.`,
    doneTitle: 'Thanks — your brief is in.',
    doneText: (t: string) => `I’ll reply within ${t}.`,
    mail: { subject: (n: string) => `Project brief from ${n}`, name: 'Name', email: 'Email', needs: 'Needs', budget: 'Budget' }
  }
}

export type Content = typeof en
