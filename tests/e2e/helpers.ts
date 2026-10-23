import { expect, type Page } from '@playwright/test'

export const ROUTES = ['/', '/work/qwerttclients/', '/work/kinoqwertt/', '/lab/']
export const ALL = [...ROUTES, ...ROUTES.map((r) => '/ru' + r)]

// Collects console errors + page errors; call `check()` at the end of a test.
export function watchErrors(page: Page) {
  const errors: string[] = []
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', (e) => errors.push(e.message))
  return { errors, check: () => expect(errors, errors.join('\n')).toEqual([]) }
}

export async function open(page: Page, path: string) {
  await page.goto(path + (path.includes('?') ? '&' : '?') + 'nointro', { waitUntil: 'networkidle' })
  await page.waitForTimeout(400)
}

export const overflowX = (page: Page) => page.evaluate(() => document.documentElement.scrollWidth - innerWidth)

export async function scrollThrough(page: Page, steps = 12, delta = 2400) {
  for (let i = 0; i < steps; i++) {
    await page.mouse.wheel(0, delta)
    await page.waitForTimeout(120)
  }
  await page.waitForTimeout(400)
}
