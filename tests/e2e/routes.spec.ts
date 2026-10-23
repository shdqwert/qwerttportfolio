import { expect, test } from '@playwright/test'
import { ALL, open, overflowX, scrollThrough, watchErrors } from './helpers'

for (const path of ALL) {
  test(`loads ${path} cleanly`, async ({ page }) => {
    const w = watchErrors(page)
    await open(page, path)
    await expect(page.locator('html')).toHaveAttribute('lang', path.startsWith('/ru') ? 'ru' : 'en')
    await expect(page.locator('main h1').first()).toBeVisible()
    expect(await overflowX(page)).toBeLessThanOrEqual(0)
    // scroll to the end so every pinned / scrubbed section runs once
    await scrollThrough(page)
    expect(await overflowX(page)).toBeLessThanOrEqual(0)
    w.check()
  })
}
