// Lab check: switch every mode on, let it run, screenshot, then Esc back.
// Usage: node tests/qa/lab-modes.mjs <outDir>
import { chromium } from '@playwright/test'
import { mkdirSync } from 'node:fs'

const OUT = process.argv[2] || 'reports/lab'
mkdirSync(OUT, { recursive: true })
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const logs = []
page.on('console', (m) => ['error', 'warning'].includes(m.type()) && logs.push(`[${m.type()}] ${m.text().slice(0, 300)}`))
page.on('pageerror', (e) => logs.push(`[pageerror] ${e.message}`))
await page.goto('http://localhost:4173/lab/?nointro', { waitUntil: 'networkidle' })
await page.waitForTimeout(1200)
const modes = await page.$$eval('[data-mode]', (b) => b.map((x) => x.dataset.mode))
for (const m of modes) {
  await page.evaluate(() => scrollTo(0, 0))
  await page.waitForTimeout(300)
  await page.click(`[data-mode="${m}"]`)
  await page.waitForTimeout(900)
  await page.mouse.move(500, 300)
  await page.mouse.move(900, 500, { steps: 8 })
  await page.mouse.wheel(0, 500)
  await page.waitForTimeout(1200)
  await page.screenshot({ path: `${OUT}/${m}.png` })
  const st = await page.evaluate(() => ({ body: document.querySelector('[data-body]')?.getAttribute('data-body'), pressed: [...document.querySelectorAll('[aria-pressed=true]')].map((x) => x.dataset.mode) }))
  await page.keyboard.press('Escape')
  await page.waitForTimeout(700)
  const after = await page.evaluate(() => ({ pressed: document.querySelectorAll('[aria-pressed=true]').length, overflow: document.documentElement.scrollWidth - innerWidth, cls: document.documentElement.className }))
  console.log(m, JSON.stringify(st), '→ esc', JSON.stringify(after))
}
console.log('LOGS:\n' + (logs.join('\n') || 'none'))
await browser.close()
