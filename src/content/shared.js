// Language-independent data: links, images, pixel bitmaps, real code output.

// null = not provided yet → rendered as a visible placeholder, never as a dead link.
export const links = {
  qwerttclientsCase: null,
  qwerttclientsScreens: 'https://claude.ai/artifact/JXSTpeT2DMm6nLsUvURD6Q',
  kinoqwerttLive: 'https://kinoqwertt.vercel.app',
  kinoqwerttRepo: 'https://github.com/shdqwert/kinoqwertt',
  telegram: null,
  github: 'https://github.com/shdqwert',
  linkedin: null,
  instagram: null,
  imprint: null,
  privacy: null
}

export const contactInfo = {
  email: '[hello@yourdomain.com]',
  telegram: '@[your_handle]',
  linkedin: '/in/[your-name]',
  timeZone: 'Asia/Tashkent'
}

// 7×7 pixel bitmaps, '1' = filled cell.
export const marks = {
  q: ['0111100', '1000010', '1000010', '1000010', '0111110', '0000010', '0000011'],
  ticket: ['1111111', '1000001', '1011101', '1000001', '1011001', '1000001', '1111111'],
  film: ['1010101', '1111111', '1000001', '1000001', '1000001', '1111111', '1010101'],
  at: ['0111110', '1000001', '1011101', '1010101', '1011111', '1000000', '0111110']
}

const img = (file, w, h) => ({ src: `/work/${file}`, w, h })

export const images = {
  qcHome: img('qwerttclients-home.jpg', 1200, 1975),
  qcAmber: img('qwerttclients-place-amber.jpg', 1200, 1924),
  qcBarber: img('qwerttclients-booking-barber.jpg', 1200, 683),
  qcBusiness: img('qwerttclients-business.jpg', 1200, 817),
  qcDesignTop: img('qwerttclients-design-top.jpg', 1200, 550),
  qcBuiltTop: img('qwerttclients-built-top.jpg', 1200, 550),
  kinoHome: img('kinoqwertt-home.jpg', 1200, 5211),
  kinoDune: img('kinoqwertt-title-dune2.jpg', 1200, 5962),
  kinoTop: img('kinoqwertt-top250.jpg', 1200, 2500)
}

// Real output of `npm test` in the qwerttclients repo — stays in English in
// both languages because it is literal terminal output.
export const terminal = {
  title: 'qwerttclients — zsh',
  prompt: '~/qwerttclients',
  command: 'npm test',
  tests: [
    'signup, session, logout and duplicate email',
    'wrong credentials and rate limit after five attempts',
    'restaurant: availability, booking and conflict when the area is full',
    'past slots and past dates cannot be booked',
    'salon: overlapping time is blocked, “any specialist” picks a free one',
    'hotel: price matches the design example and inventory is respected',
    'sport: duration blocks the following hours',
    'event: ticket limit and totals',
    'booking access: owner, guest key, strangers; change and cancel',
    'two-step verification: setup, login with code, disable',
    'waitlist is notified when a slot is released',
    'text search understands Russian, Uzbek and Cyrillic spelling'
  ],
  more: '… 11 more',
  total: 23,
  duration: '4.6 s'
}

// Real CSS from the kinoqwertt build (comment is translated per language).
export const cssLines = [
  '.imdb-header__scope-option--active {',
  '  color: var(--movie-accent, #f5c518);',
  '}',
  '.auth-modal__field input:focus {',
  '  border-color: var(--movie-accent, #f5c518);',
  '}',
  '.trailer-modal__close:hover {',
  '  color: var(--movie-accent, #f5c518);',
  '}'
]

export const stack = ['Figma', 'HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'React Router', 'Vite', 'Next.js', 'Astro', 'Webflow', 'GSAP', 'Three.js', 'Git', 'Vercel']
