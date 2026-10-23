import { expect, test } from '@playwright/test'
import { open, watchErrors } from './helpers'

test('header link runs the gate transition to Lab and back', async ({ page }) => {
  const w = watchErrors(page)
  await open(page, '/')
  await page.getByRole('navigation', { name: /main/i }).getByRole('link', { name: 'Lab' }).click()
  await expect(page).toHaveURL(/\/lab$/)
  await expect(page.locator('main h1')).toContainText('Press a button')
  await page.goBack()
  await expect(page).toHaveURL(/\/(\?nointro)?$/)
  await expect(page.locator('main h1').first()).toBeVisible()
  w.check()
})

test('Connect drawer opens, keeps focus inside, closes on Esc', async ({ page }) => {
  const w = watchErrors(page)
  await open(page, '/')
  await page.getByRole('navigation', { name: /main/i }).getByRole('link', { name: 'Connect' }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await expect(page).toHaveURL(/#connect$/)
  await page.waitForTimeout(500)
  expect(await dialog.evaluate((d) => d.contains(document.activeElement))).toBe(true)
  for (let i = 0; i < 25; i++) await page.keyboard.press('Tab')
  expect(await dialog.evaluate((d) => d.contains(document.activeElement))).toBe(true)
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  w.check()
})

test('screen gallery opens the lightbox and closes on Esc', async ({ page }) => {
  const w = watchErrors(page)
  await open(page, '/')
  const shot = page.locator('button[aria-label^="View screen"]').first()
  // hidden until its reveal fires, so scroll there the way a visitor would
  await shot.evaluate((e) => e.scrollIntoView({ block: 'center' }))
  await page.mouse.wheel(0, 10)
  await expect(shot).toBeVisible()
  await page.waitForTimeout(900)
  await shot.click()
  const box = page.getByRole('dialog')
  await expect(box).toBeVisible()
  await page.keyboard.press('ArrowRight')
  await page.keyboard.press('Escape')
  await expect(box).toBeHidden()
  w.check()
})

test('language switch goes to the Russian page', async ({ page }) => {
  await open(page, '/work/kinoqwertt/')
  await page.locator('header a[hreflang="ru"]').click()
  await expect(page).toHaveURL(/\/ru\/work\/kinoqwertt/)
  await expect(page.locator('html')).toHaveAttribute('lang', 'ru')
})

test('design → code slider moves with the keyboard', async ({ page }) => {
  await open(page, '/')
  const handle = page.getByRole('slider').first()
  await handle.scrollIntoViewIfNeeded()
  await handle.focus()
  await page.keyboard.press('Home')
  await expect(handle).toHaveAttribute('aria-valuenow', '0')
  await page.keyboard.press('ArrowRight')
  await page.keyboard.press('ArrowRight')
  await expect(handle).toHaveAttribute('aria-valuenow', '10')
  await page.keyboard.press('End')
  await expect(handle).toHaveAttribute('aria-valuenow', '100')
})

test('every Lab mode switches on and Esc resets it', async ({ page }) => {
  const w = watchErrors(page)
  await open(page, '/lab/')
  const modes = await page.$$eval('button[data-mode]', (b) => b.map((x) => x.getAttribute('data-mode')!))
  expect(modes.length).toBe(10)
  for (const m of modes) {
    const b = page.locator(`button[data-mode="${m}"]`)
    await b.click()
    await expect(b).toHaveAttribute('aria-pressed', 'true')
    await page.waitForTimeout(500)
    await page.keyboard.press('Escape')
    await expect(b).toHaveAttribute('aria-pressed', 'false')
  }
  w.check()
})

test('intro departure board plays once and hands over', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('html')).toHaveClass(/intro-pending/)
  await expect(page.locator('html')).not.toHaveClass(/intro-pending/, { timeout: 6000 })
  await expect(page.locator('main h1').first()).toBeVisible()
  await page.reload({ waitUntil: 'domcontentloaded' })
  await expect(page.locator('html')).not.toHaveClass(/intro-pending/)
})
