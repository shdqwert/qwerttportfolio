// Step A research: open each reference in Chromium, record a slow and a fast
// scroll, sample frame times and note which motion libraries the page uses.
// Behaviour study only — nothing from these sites is downloaded or shipped.
import { chromium } from '@playwright/test'
import { mkdirSync, writeFileSync } from 'node:fs'

const SITES = [
  ['bodak-home', 'https://www.eduardbodak.com/'],
  ['bodak-work', 'https://www.eduardbodak.com/work'],
  ['bodak-filmbot', 'https://www.eduardbodak.com/work/filmbot'],
  ['lusion-about', 'https://lusion.co/about'],
  ['uncommon', 'https://uncommondesign.group/'],
  ['matvoyce', 'https://matvoyce.tv/'],
  ['minhpham', 'https://minhpham.design/'],
  ['kinoqwertt', 'https://kinoqwertt.vercel.app']
]
const only = process.argv.slice(2)
const OUT = new URL('./', import.meta.url).pathname.replace(/^\/(\w:)/, '$1')
mkdirSync(`${OUT}shots`, { recursive: true })
mkdirSync(`${OUT}videos`, { recursive: true })

const browser = await chromium.launch()
const results = {}

for (const [id, url] of SITES) {
  if (only.length && !only.includes(id)) continue
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, recordVideo: { dir: `${OUT}videos/${id}`, size: { width: 1440, height: 900 } } })
  const page = await ctx.newPage()
  const r = { url }
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 }).catch(() => page.waitForLoadState('load'))
    await page.waitForTimeout(2000)
    await page.screenshot({ path: `${OUT}shots/${id}-0.png` })
    r.info = await page.evaluate(() => {
      const w = window
      const libs = ['gsap', 'ScrollTrigger', 'Lenis', 'lenis', 'THREE', 'Barba', 'barba', 'Swiper', 'locomotiveScroll', 'LocomotiveScroll', 'Webflow', '__NEXT_DATA__', '__NUXT__'].filter((k) => k in w)
      const fonts = [...new Set([...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family.replace(/"/g, '')))]
      const all = [...document.querySelectorAll('body *')]
      const sticky = all.filter((el) => ['sticky', 'fixed'].includes(getComputedStyle(el).position)).length
      const bodyStyle = getComputedStyle(document.body)
      return {
        title: document.title,
        libs,
        fonts: fonts.slice(0, 8),
        stickyOrFixed: sticky,
        height: document.documentElement.scrollHeight,
        bg: bodyStyle.backgroundColor,
        color: bodyStyle.color,
        htmlClass: document.documentElement.className.slice(0, 120),
        canvas: document.querySelectorAll('canvas').length
      }
    })
    // slow wheel scroll with rAF sampling
    await page.evaluate(() => {
      window.__ft = []
      let last = performance.now()
      const loop = (t) => {
        window.__ft.push(t - last)
        last = t
        if (window.__ft.length < 6000) requestAnimationFrame(loop)
      }
      requestAnimationFrame(loop)
    })
    await page.mouse.move(720, 450)
    const maxY = Math.min(r.info.height, 9000)
    for (let y = 0; y < maxY; y += 120) {
      await page.mouse.wheel(0, 120)
      await page.waitForTimeout(120)
    }
    const shotsAt = [0.25, 0.5, 0.75]
    for (const k of shotsAt) {
      await page.evaluate((y) => window.scrollTo(0, y), Math.round(maxY * k))
      await page.waitForTimeout(900)
      await page.screenshot({ path: `${OUT}shots/${id}-${Math.round(k * 100)}.png` })
    }
    r.frames = await page.evaluate(() => {
      const f = window.__ft.slice(5).sort((a, b) => a - b)
      const p = (q) => Math.round(f[Math.floor(f.length * q)] * 10) / 10
      return { samples: f.length, p50: p(0.5), p95: p(0.95), max: Math.round(f[f.length - 1]) }
    })
    // fast scroll back up and down
    await page.evaluate(() => window.scrollTo(0, 0))
    for (let i = 0; i < 6; i++) {
      await page.mouse.wheel(0, 1200)
      await page.waitForTimeout(250)
    }
    // hover first nav links / buttons
    const hovers = await page.$$('header a, nav a, a[class*="button"], button')
    for (const [i, h] of hovers.slice(0, 3).entries()) {
      try {
        await page.evaluate(() => window.scrollTo(0, 0))
        await h.hover({ timeout: 2000 })
        await page.waitForTimeout(500)
        await page.screenshot({ path: `${OUT}shots/${id}-hover${i}.png` })
      } catch {
        /* element not hoverable */
      }
    }
  } catch (e) {
    r.error = String(e.message || e).slice(0, 200)
  }
  results[id] = r
  console.log(id, JSON.stringify(r))
  await ctx.close()
}

writeFileSync(`${OUT}capture-results.json`, JSON.stringify(results, null, 2))
await browser.close()
