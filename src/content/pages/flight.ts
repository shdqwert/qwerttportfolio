// F27 boarding-flight copy (case pages). Ships with the case chunks.
const en = {
  states: ['Boarding', 'In flight', 'Landed'],
  stamp: 'BOARDED ✓',
  rec: '00 · live screen recording',
  hint: 'Now boarding — scroll ↓',
  play: 'Play ▶',
  kino: {
    seat: 'Row 02 · Seat kinoqwertt',
    landing: 'Landing · Row 02 · Gate open',
    alt: 'Screen recording of the kinoqwertt site: trailer carousel, featured rails, Top picks, then the Dune: Part Two title page'
  },
  qc: {
    seat: 'Row 01 · Seat qwerttclients',
    landing: 'Landing · Row 01 · Gate open',
    alt: 'Screen recording of qwerttclients in night mode: home, restaurant search, the Amber venue page and Studio Noir booking'
  }
}

const ru: typeof en = {
  states: ['Посадка', 'В полёте', 'Прибыл'],
  stamp: 'НА БОРТУ ✓',
  rec: '00 · живая запись экрана',
  hint: 'Идёт посадка — листайте ↓',
  play: 'Смотреть ▶',
  kino: {
    seat: 'Ряд 02 · Место kinoqwertt',
    landing: 'Посадка · Ряд 02 · Выход открыт',
    alt: 'Запись экрана сайта kinoqwertt: карусель трейлеров, подборки, Top picks и страница фильма «Дюна: Часть вторая»'
  },
  qc: {
    seat: 'Ряд 01 · Место qwerttclients',
    landing: 'Посадка · Ряд 01 · Выход открыт',
    alt: 'Запись экрана qwerttclients в ночной теме: главная, поиск ресторана, страница Amber и запись в Studio Noir'
  }
}

export const flightText = { en, ru }
