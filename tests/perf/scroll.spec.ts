import { expect, test, type Page } from '@playwright/test'
import { mkdirSync, writeFileSync } from 'node:fs'

// Scroll perf gate (Chromium): wheel-scroll each route top → bottom like a
// person, sample rAF frame times in the page, collect CLS + LCP, and write the
// numbers to reports/perf/<route>.json. Run on the production build.
const ROUTES = ['/', '/work/qwerttclients/', '/work/kinoqwertt/', '/lab/']
mkdirSync('reports/perf', { recursive: true })

// hardware GPU: headless default is SwiftShader (software), which is not what
// a visitor's browser does and roughly doubles frame times
test.use({ launchOptions: { args: ['--use-angle=d3d11', '--enable-gpu-rasterization', '--ignore-gpu-blocklist'] } })

async function measure(page: Page, path: string) {
  await page.addInitScript(() => {
    const w = window as unknown as { __perf: { cls: number; lcp: number; frames: number[] } }
    w.__perf = { cls: 0, lcp: 0, frames: [] }
    new PerformanceObserver((l) => {
      for (const e of l.getEntries() as (PerformanceEntry & { value: number; hadRecentInput: boolean })[]) if (!e.hadRecentInput) w.__perf.cls += e.value
    }).observe({ type: 'layout-shift', buffered: true })
    new PerformanceObserver((l) => {
      const last = l.getEntries().at(-1)
      if (last) w.__perf.lcp = last.startTime
    }).observe({ type: 'largest-contentful-paint', buffered: true })
  })
  await page.goto(path + '?nointro', { waitUntil: 'networkidle' })
  await page.waitForTimeout(1200)
  await page.mouse.move(700, 450)
  await page.evaluate(() => {
    const w = window as unknown as { __perf: { frames: number[] }; __stop: boolean }
    let last = performance.now()
    const tick = (t: number) => {
      w.__perf.frames.push(t - last)
      last = t
      if (!w.__stop) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  })
  for (let i = 0; i < 260; i++) {
    await page.mouse.wheel(0, 100)
    await page.waitForTimeout(16)
    if (i % 20 === 0 && (await page.evaluate(() => scrollY >= document.documentElement.scrollHeight - innerHeight - 2))) break
  }
  await page.waitForTimeout(600)
  const r = await page.evaluate(() => {
    const w = window as unknown as { __perf: { cls: number; lcp: number; frames: number[] }; __stop: boolean }
    w.__stop = true
    const f = w.__perf.frames.slice(2).sort((a, b) => a - b)
    const p = (q: number) => f[Math.min(f.length - 1, Math.floor(f.length * q))]
    return { frames: f.length, p50: p(0.5), p95: p(0.95), max: f.at(-1) ?? 0, over50: f.filter((x) => x > 50).length, cls: w.__perf.cls, lcp: w.__perf.lcp }
  })
  return r
}

test.describe('scroll perf', () => {
  test.skip(({ browserName }) => browserName !== 'chromium', 'Chromium only')
  for (const path of ROUTES) {
    test(`${path} scrolls smoothly`, async ({ page }) => {
      const r = await measure(page, path)
      const name = path.replace(/\W+/g, '_') || 'home'
      writeFileSync(`reports/perf/${name}.json`, JSON.stringify(r, null, 2))
      console.log(path, JSON.stringify(r))
      expect(r.p95, 'p95 frame time').toBeLessThanOrEqual(18)
      expect(r.over50, 'frames over 50 ms').toBe(0)
      expect(r.cls, 'CLS').toBeLessThan(0.02)
      expect(r.lcp, 'LCP').toBeLessThanOrEqual(2000)
    })

    test(`${path} with 4× CPU throttling`, async ({ page }) => {
      const cdp = await page.context().newCDPSession(page)
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
      const r = await measure(page, path)
      const name = (path.replace(/\W+/g, '_') || 'home') + '-cpu4x'
      writeFileSync(`reports/perf/${name}.json`, JSON.stringify(r, null, 2))
      console.log(path, '4x', JSON.stringify(r))
      expect(r.p95, 'p95 frame time at 4× CPU').toBeLessThanOrEqual(34)
    })
  }
})
