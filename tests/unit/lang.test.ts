import { describe, expect, it } from 'vitest'
import { langFromPath, routeKey, stripLang } from '../../src/content/lang'
import { clamp, rnd } from '../../src/motion/hooks'

describe('routing helpers', () => {
  it('reads the language from the path', () => {
    expect(langFromPath('/')).toBe('en')
    expect(langFromPath('/ru')).toBe('ru')
    expect(langFromPath('/ru/lab/')).toBe('ru')
    expect(langFromPath('/rules')).toBe('en')
  })
  it('strips the language prefix and trailing slashes', () => {
    expect(stripLang('/ru')).toBe('/')
    expect(stripLang('/ru/')).toBe('/')
    expect(stripLang('/ru/work/kinoqwertt/')).toBe('/work/kinoqwertt')
    expect(stripLang('/lab/')).toBe('/lab')
    expect(stripLang('/')).toBe('/')
  })
  it('maps paths to page keys', () => {
    expect(routeKey('/')).toBe('home')
    expect(routeKey('/ru/work/qwerttclients/')).toBe('qc')
    expect(routeKey('/work/kinoqwertt')).toBe('kino')
    expect(routeKey('/ru/lab')).toBe('lab')
    expect(routeKey('/nope')).toBe('home')
  })
})

describe('motion helpers', () => {
  it('rnd is deterministic and in [0, 1)', () => {
    for (let i = 0; i < 200; i++) {
      const v = rnd(i, 3)
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThan(1)
      expect(rnd(i, 3)).toBe(v)
    }
  })
  it('clamp', () => {
    expect(clamp(-1)).toBe(0)
    expect(clamp(2)).toBe(1)
    expect(clamp(5, 0, 10)).toBe(5)
  })
})
