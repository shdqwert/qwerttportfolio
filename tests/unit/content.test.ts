import { describe, expect, it, vi } from 'vitest'

vi.mock('../../src/content/i18n', () => ({ useT: () => ({ lang: 'en' }) }))

import { en } from '../../src/content/en'
import { ru } from '../../src/content/ru'
import { homeEn } from '../../src/content/pages/home.en'
import { homeRu } from '../../src/content/pages/home.ru'
import { texts as kino } from '../../src/content/pages/kino'
import { texts as lab } from '../../src/content/pages/lab'
import { texts as qc } from '../../src/content/pages/qc'
import { flightText } from '../../src/content/pages/flight'

// Every RU object must have exactly the EN shape: same keys, same array
// lengths, same value types (so no section silently renders in English).
function shape(v: unknown, path = ''): string[] {
  if (Array.isArray(v)) return [`${path}[${v.length}]`, ...v.flatMap((x, i) => shape(x, `${path}[${i}]`))]
  if (v && typeof v === 'object') return Object.keys(v).sort().flatMap((k) => shape((v as Record<string, unknown>)[k], `${path}.${k}`))
  return [`${path}:${typeof v}`]
}

describe('RU copy mirrors EN', () => {
  it.each([
    ['site', en, ru],
    ['home', homeEn, homeRu],
    ['qc', qc.en, qc.ru],
    ['kino', kino.en, kino.ru],
    ['lab', lab.en, lab.ru],
    ['flight', flightText.en, flightText.ru]
  ])('%s', (_, a, b) => {
    expect(shape(b)).toEqual(shape(a))
  })

  it('RU copy is actually translated (not the EN strings)', () => {
    expect(ru.ui.skip).not.toBe(en.ui.skip)
    expect(homeRu.hero).not.toEqual(homeEn.hero)
    expect(qc.ru.pitch).not.toBe(qc.en.pitch)
  })
})
