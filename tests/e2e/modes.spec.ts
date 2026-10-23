import { expect, test } from '@playwright/test'
import { ROUTES, open, overflowX, scrollThrough, watchErrors } from './helpers'

test.describe('reduced motion', () => {
  test.use({ contextOptions: { reducedMotion: 'reduce' } })
  for (const path of ROUTES) {
    test(`${path}: no pinning, everything visible`, async ({ page }) => {
      const w = watchErrors(page)
      await page.goto(path, { waitUntil: 'networkidle' })
      await expect(page.locator('html')).not.toHaveClass(/intro-pending/)
      expect(await page.locator('.pin-spacer').count()).toBe(0)
      const hidden = await page.$$eval('main [data-reveal], main h1, main h2', (els) =>
        els.filter((e) => getComputedStyle(e).opacity === '0' || getComputedStyle(e).visibility === 'hidden').map((e) => e.textContent?.slice(0, 40))
      )
      expect(hidden).toEqual([])
      w.check()
    })
  }
})

test.describe('no JavaScript', () => {
  test.use({ javaScriptEnabled: false })
  for (const path of ROUTES) {
    test(`${path}: content is in the HTML and visible`, async ({ page }) => {
      await page.goto(path)
      await expect(page.locator('main h1').first()).toBeVisible()
      expect(await page.locator('main h2, main h3').count()).toBeGreaterThan(0)
      const hidden = await page.locator('main [data-reveal]').evaluateAll((els) => els.filter((e) => getComputedStyle(e).opacity === '0').length)
      expect(hidden).toBe(0)
    })
  }
})

test.describe('phone 375', () => {
  test.use({ viewport: { width: 375, height: 812 }, hasTouch: true })
  for (const path of ROUTES) {
    test(`${path}: no sideways scroll`, async ({ page }) => {
      const w = watchErrors(page)
      await open(page, path)
      await scrollThrough(page, 14, 2000)
      expect(await overflowX(page)).toBeLessThanOrEqual(0)
      w.check()
    })
  }
})

test('?light=off disables the light system', async ({ page }) => {
  await open(page, '/?light=off')
  await expect(page.locator('html')).toHaveClass(/light-off/)
})
