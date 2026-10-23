import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { ALL, open } from './helpers'

test.describe('axe', () => {
  test.skip(({ browserName }) => browserName !== 'chromium', 'axe runs once, in Chromium')
  test.use({ contextOptions: { reducedMotion: 'reduce' } })
  for (const path of ALL) {
    test(`${path}: no serious or critical violations`, async ({ page }) => {
      await open(page, path)
      const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()
      const bad = r.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
      expect(bad.map((v) => `${v.id}: ${v.nodes.length} × ${v.nodes.slice(0, 3).map((n) => n.target).join(' | ')}`)).toEqual([])
    })
  }
})
