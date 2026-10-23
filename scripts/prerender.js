// Prerenders every route in both languages into dist/**/index.html so the
// content is in the HTML before any JavaScript runs (and without JS).
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const { render, meta } = await import(pathToFileURL(`${root}dist-ssr/entry-server.js`).href)
const template = await readFile(`${root}dist/index.html`, 'utf8')
const marker = '<div id="root"></div>'
if (!template.includes(marker)) throw new Error('Root marker not found in dist/index.html')
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

const ROUTES = ['/', '/work/qwerttclients', '/work/kinoqwertt', '/lab']
for (const lang of ['en', 'ru']) {
  for (const path of ROUTES) {
    const m = meta(lang, path)
    const url = (lang === 'ru' ? '/ru' : '') + (path === '/' ? '' : path) || '/'
    const html = template
      .replace('<html lang="en">', `<html lang="${lang}">`)
      .replace(/<title>.*?<\/title>/, `<title>${esc(m.title)}</title>`)
      .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${esc(m.description)}" />`)
      .replace(marker, `<div id="root" data-route="${url}">${render(lang, path)}</div>`)
    const dir = `${root}dist${lang === 'ru' ? '/ru' : ''}${path === '/' ? '' : path}`
    await mkdir(dir, { recursive: true })
    await writeFile(`${dir}/index.html`, html)
    console.log(`prerendered ${dir.replace(root, '')}/index.html`)
  }
}
await rm(`${root}dist-ssr`, { recursive: true, force: true })
