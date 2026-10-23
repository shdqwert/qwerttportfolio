// F27 check: records a Playwright video of each case page scrolled slowly down
// through the boarding flight, back up, then fast; logs card/chip/stamp/path/
// video state every 100 ms; extracts frames (100 ms) with Playwright's ffmpeg.
// Uses installed Chrome: Playwright's Chromium has no H.264, so the MP4 reels would not play.
// Usage: node tests/qa/flight-video.mjs   → reports/videos, reports/frames, reports/flight-<page>.json
import { chromium } from '@playwright/test'
import { execFileSync } from 'node:child_process'
import { mkdirSync, readdirSync, renameSync, rmSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

const PAGES = { kino: '/work/kinoqwertt/', qc: '/work/qwerttclients/' }
const ffDir = join(homedir(), 'AppData/Local/ms-playwright')
const ff = readdirSync(ffDir).filter((d) => d.startsWith('ffmpeg')).map((d) => join(ffDir, d, 'ffmpeg-win64.exe'))[0]
const browser = await chromium.launch({ channel: 'chrome', args: ['--use-angle=d3d11', '--enable-gpu-rasterization', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] })

for (const [name, path] of Object.entries(PAGES)) {
  const vdir = `reports/videos/${name}`
  rmSync(vdir, { recursive: true, force: true })
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, recordVideo: { dir: vdir, size: { width: 1440, height: 900 } } })
  const page = await ctx.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  await page.goto(`http://localhost:4173${path}?nointro`, { waitUntil: 'load' })
  await page.waitForTimeout(2500)
  await page.mouse.move(720, 450)
  const log = []
  const sample = async (dir) =>
    log.push({
      dir,
      ...(await page.evaluate(() => {
        const fly = document.querySelector('[class*="_fly_"]')
        const r = fly?.getBoundingClientRect()
        const chip = document.querySelector('[class*="_tag_"] i [aria-hidden="true"]')?.textContent
        const stamp = document.querySelector('[class*="_stamp_"]')
        const pathEl = document.querySelector('[class*="_path_"] path')
        const v = document.querySelector('[class*="_card_"] video')
        return {
          y: Math.round(scrollY),
          card: r ? [Math.round(r.left), Math.round(r.top), Math.round(r.width)] : null,
          chip,
          stamp: stamp ? +getComputedStyle(stamp).opacity : null,
          path: pathEl ? [+getComputedStyle(pathEl).opacity, +(+getComputedStyle(pathEl).strokeDashoffset || 0).toFixed(2)] : null,
          video: v ? { paused: v.paused, t: +v.currentTime.toFixed(1) } : null
        }
      }))
    })
  const end = await page.evaluate(() => {
    const m = document.querySelector('[class*="_mat_"]')
    return m.getBoundingClientRect().top + scrollY + m.offsetHeight / 2 - innerHeight / 2 + 500
  })
  // slow down
  while ((await page.evaluate(() => scrollY)) < end) {
    await page.mouse.wheel(0, 60)
    await page.waitForTimeout(100)
    await sample('down')
  }
  await page.waitForTimeout(1200)
  await sample('rest')
  // slow back up
  while ((await page.evaluate(() => scrollY)) > 2) {
    await page.mouse.wheel(0, -60)
    await page.waitForTimeout(100)
    await sample('up')
  }
  await page.waitForTimeout(1200)
  await sample('top')
  // fast down
  for (let i = 0; i < 8; i++) {
    await page.mouse.wheel(0, 600)
    await page.waitForTimeout(100)
    await sample('fast')
  }
  await page.waitForTimeout(1500)
  await sample('end')
  const video = page.video()
  await ctx.close()
  const file = join(vdir, `${name}.webm`)
  renameSync(await video.path(), file)
  writeFileSync(`reports/flight-${name}.json`, JSON.stringify({ errors, log }, null, 1))
  const fdir = `reports/frames/${name}`
  rmSync(fdir, { recursive: true, force: true })
  mkdirSync(fdir, { recursive: true })
  execFileSync(ff, ['-hide_banner', '-loglevel', 'error', '-i', file, '-r', '10', join(fdir, 'f%04d.png')])
  console.log(name, 'samples', log.length, 'frames', readdirSync(fdir).length, 'errors', errors.length)
}
await browser.close()
