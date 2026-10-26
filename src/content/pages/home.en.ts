// Home page copy, English.
import type { ImgKey } from '../shared'

export const homeEn = {
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
      ['Colours that follow the film', 'Each title page picks up the mood of its poster, so every film feels like its own world.'],
      ['Two languages, two themes', 'EN / RU and light / dark, remembered in the browser. No UI kit — plain CSS and GSAP.'],
      ['Polished on every screen', 'Tested on phones, tablets and desktops — no broken layouts, no sideways scrolling.']
    ] as [string, string][],
    clientLabel: 'What this shows a client',
    clientText: 'I can take a designer’s Figma file and ship it as a fast, maintainable app — and catch the bugs before your users do.',
    readCase: 'Read the full case →',
    live: 'Open live site ↗'
  }
}

export type HomeText = typeof homeEn
