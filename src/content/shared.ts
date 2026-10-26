// Language-independent data: images, links, bitmaps, literal code output.
import manifest from './images.json'

export type ImgKey = keyof typeof manifest
export type ImgData = (typeof manifest)[ImgKey]
export const img = (key: ImgKey): ImgData => manifest[key]

// null = not provided yet → rendered as a visible placeholder, never a dead link.
export const links = {
  qwerttclientsLive: null as string | null,
  qwerttclientsScreens: 'https://claude.ai/artifact/JXSTpeT2DMm6nLsUvURD6Q',
  kinoqwerttLive: 'https://kinoqwertt.vercel.app',
  kinoqwerttRepo: 'https://github.com/shdqwert/kinoqwertt',
  telegram: null as string | null,
  github: 'https://github.com/shdqwert' as string | null,
  linkedin: null as string | null,
  instagram: null as string | null,
  imprint: null as string | null,
  privacy: null as string | null
}

export const contactInfo = {
  email: '[hello@yourdomain.com]',
  telegram: '@[your_handle]',
  linkedin: '/in/[your-name]',
  timeZone: 'Asia/Tashkent'
}

// 7×7 bitmaps, '1' = punched hole
export const marks = {
  q: ['0111100', '1000010', '1000010', '1000010', '0111110', '0000010', '0000011'],
  ticket: ['1111111', '1000001', '1011101', '1000001', '1011001', '1000001', '1111111'],
  film: ['1010101', '1111111', '1000001', '1000001', '1000001', '1111111', '1010101'],
  at: ['0111110', '1000001', '1011101', '1010101', '1011111', '1000000', '0111110'],
  code: ['0000000', '0100010', '1000001', '0001000', '1000001', '0100010', '0000000'],
  play: ['1000000', '1100000', '1110000', '1111000', '1110000', '1100000', '1000000']
}
export type MarkName = keyof typeof marks

export const labIcons: Record<string, string[]> = {
  parallax: ['1111111', '0000000', '0111110', '0000000', '0011100', '0000000', '0001000'],
  film: ['1111111', '1010101', '1111111', '1000001', '1111111', '1010101', '1111111'],
  gravity: ['0011100', '0011100', '0000000', '0000000', '0000000', '1111111', '1111111'],
  xray: ['1110111', '1000001', '1000001', '0000000', '1000001', '1000001', '1110111'],
  flash: ['0000000', '0011100', '0111110', '0111110', '0111110', '0011100', '0000000'],
  pixel: ['1010101', '0101010', '1010101', '0101010', '1010101', '0101010', '1010101'],
  magnet: ['1100011', '1100011', '1100011', '1100011', '1100011', '0111110', '0011100'],
  glitch: ['1111000', '0001111', '1111110', '0011111', '1110000', '0111111', '1111000'],
  speed: ['0000001', '0000011', '0000111', '0011111', '0111111', '1111111', '1111111'],
  y1999: ['1111111', '1000001', '1011101', '1000001', '1111111', '0011100', '0111110'],
  play: ['0111100', '1000010', '1000010', '1000010', '0111110', '0000010', '0000011']
}

// Real `npm test` output of the qwerttclients repo — literal, stays English.
export const testsHome = [
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
]
export const testsCase = [
  'signup, session, logout and duplicate email',
  'wrong credentials and rate limit after five attempts',
  'restaurant: availability, booking and conflict when the area is full',
  'past slots and past dates cannot be booked',
  'salon: overlapping time is blocked, “any specialist” picks a free one',
  'hotel: price matches the design example and inventory is respected',
  'sport: duration blocks the following hours',
  'event: ticket limit and totals',
  'booking access: owner, guest key, strangers; change and cancel',
  'reviews are only for guests whose visit is completed',
  'two-step verification: setup, login with code, disable',
  'waitlist is notified when a slot is released',
  'near me sorts by real distance',
  'text search understands Russian, Uzbek and Cyrillic spelling'
]
export const terminal = { title: 'qwerttclients — zsh', prompt: '~/qwerttclients', command: 'npm test', more: '… 11 more', total: 23, duration: '4.6 s' }

export const stack = ['Figma', 'HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'React Router', 'Vite', 'Next.js', 'Astro', 'Webflow', 'GSAP', 'Three.js', 'Git', 'Vercel']

// qwerttclients app tokens (night theme) — from its stylesheet
export const appTokens: [string, string][] = [
  ['ink', '#DEE4EA'], ['ink-2', '#B6C2CF'], ['ink-3', '#8C9BAB'], ['bg', '#161A1D'], ['surface', '#1D2125'], ['line-strong', '#454F59'],
  ['accent', '#579DFF'], ['accent-tint', '#1C2B41'], ['success', '#4BCE97'], ['warn', '#E2B203'], ['danger', '#F87168'], ['success-tint', '#164B35']
]

// Real venues with their real coordinates (from the app's database)
export type PlaceKind = 'restaurant' | 'salon' | 'hotel' | 'sport' | 'event'
export const places: [string, number, number, PlaceKind][] = [
  ['Amber', 41.289832, 69.274704, 'restaurant'], ['Oq Saroy', 41.32252, 69.224288, 'restaurant'], ['City Dental Clinic', 41.277736, 69.207576, 'salon'],
  ['Studio Noir', 41.270176, 69.202944, 'salon'], ['Sakura House', 41.292196, 69.277692, 'restaurant'], ['Tavola', 41.295184, 69.278664, 'restaurant'],
  ['Merion Hotel', 41.319208, 69.255256, 'hotel'], ['Pulse Studio', 41.336868, 69.334364, 'sport'], ['Sage & Stone', 41.289748, 69.278892, 'salon'],
  ['Corner Cup', 41.297524, 69.27678, 'restaurant'], ['Riverside Sports Club', 41.313532, 69.24838, 'sport'], ['Nomad Coworking', 41.369176, 69.281984, 'sport'],
  ['Ambar Bistro', 41.363248, 69.284744, 'restaurant'], ['Blue Room Jazz Night', 41.332152, 69.335888, 'event'], ['Amber Hair Studio', 41.336472, 69.34016, 'salon']
]
export const hiddenPlaceLabels = ['Sakura House', 'Tavola', 'Sage & Stone', 'Corner Cup', 'Amber Hair Studio', 'City Dental Clinic']
export const mapX = (lng: number) => Math.round(80 + ((lng - 69.195) / (69.35 - 69.195)) * 1180)
export const mapY = (lat: number) => Math.round(50 + ((41.378 - lat) / (41.378 - 41.262)) * 620)
export const districts: [string, number, number, number][] = [
  ['Yunusabad', 2, 69.27, 41.375], ['Shaykhontohur', 2, 69.235, 41.33], ['Old City', 1, 69.205, 41.335], ['Mirzo Ulugbek', 3, 69.31, 41.35], ['Mirabad', 5, 69.285, 41.282], ['Chilanzar', 2, 69.196, 41.262]
]
export const placeColors: Record<PlaceKind, string> = { restaurant: '#ECE8DF', salon: '#C8C3B8', hotel: '#9A958B', sport: '#4ADE80', event: '#FF4F1F' }

// split-flap board rows (real venues)
export const boardRows: [string, string, string, string][] = [
  ['09:30', 'PULSE STUDIO', 'YOGA CLASS', 'CONFIRMED'],
  ['12:00', 'AMBER', 'TABLE FOR 2', 'CONFIRMED'],
  ['18:30', 'STUDIO NOIR', 'HAIRCUT', 'CONFIRMED'],
  ['19:00', 'RIVERSIDE', 'COURT 1', 'CONFIRMED'],
  ['20:00', 'BLUE ROOM JAZZ', 'TICKETS X2', 'DOORS 1900'],
  ['20:30', 'MERION HOTEL', 'ROOM 2 NTS', 'CHECK IN'],
  ['21:00', 'OQ SAROY', 'TABLE FOR 6', 'CONFIRMED'],
  ['10:00', 'NOMAD COWORK', 'DESK DAY', 'CONFIRMED'],
  ['11:15', 'AMBAR BISTRO', 'BRUNCH X3', 'WAITLIST'],
  ['16:00', 'SAGE & STONE', 'MASSAGE', 'CONFIRMED']
]
export const boardActive = 2
