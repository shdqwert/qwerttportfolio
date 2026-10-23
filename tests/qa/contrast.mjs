// Prints axe colour-contrast details for a route (fg/bg/ratio per node).
import AxeBuilder from '@axe-core/playwright'
import { chromium } from '@playwright/test'
const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
const page = await ctx.newPage()
await page.goto(`http://localhost:4173${process.argv[2]}?nointro`, { waitUntil: 'networkidle' })
await page.waitForTimeout(500)
const r = await new AxeBuilder({ page }).withRules(['color-contrast']).analyze()
for (const v of r.violations) for (const n of v.nodes) console.log(n.target.join(' '), '|', n.any[0]?.message.replace(/\s+/g, ' ').slice(0, 200))
await browser.close()
